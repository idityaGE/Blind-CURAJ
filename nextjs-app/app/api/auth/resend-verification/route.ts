import { NextResponse } from 'next/server'
import { checkRateLimit, recordAttempt } from '@/utils/rateLimit'
import { prisma } from '@/lib/db/prisma'
import { sendMail } from '@/services/mail/mail'
import { studentEmailConfig } from '@/config/student-email.config'
import { getVerificationEmail } from '@/templates';


export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check rate limit
    const rateLimit = await checkRateLimit(email)

    if (!rateLimit.success) {
      return NextResponse.json({
        error: 'Rate limit exceeded',
        retryAfter: Math.ceil(rateLimit.reset - Date.now() / 1000),
        remainingAttempts: rateLimit.remaining,
      }, {
        status: 429,
        headers: {
          'X-RateLimit-Limit': rateLimit.limit.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': rateLimit.reset.toString(),
        }
      })
    }

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (user.isVerified) {
      return NextResponse.json(
        { error: 'Email already verified' },
        { status: 400 }
      )
    }

    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify?token=${user.verifyToken}`

    const mailOptions = getVerificationEmail(email, verificationUrl, studentEmailConfig);

    const emailSent = await sendMail(mailOptions)

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send verification email' },
        { status: 500 }
      )
    }

    // Record successful attempt
    await recordAttempt(email)

    return NextResponse.json({
      message: 'Verification email resent',
      remainingAttempts: rateLimit.remaining - 1
    }, {
      headers: {
        'X-RateLimit-Limit': rateLimit.limit.toString(),
        'X-RateLimit-Remaining': (rateLimit.remaining - 1).toString(),
        'X-RateLimit-Reset': rateLimit.reset.toString(),
      }
    })

  } catch (error) {
    console.error('Error in resend verification:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}