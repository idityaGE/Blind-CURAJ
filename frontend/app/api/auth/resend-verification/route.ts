import { NextResponse } from 'next/server'
import { checkRateLimit, recordAttempt } from '@/utils/rateLimit'
import { prisma } from '@/lib/db/prisma'
import { sendMail } from '@/services/mail/mail'
import { studentEmailConfig } from '@/config/student-email.config'


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

    const mailOptions = {
      to: email,
      subject: 'Verify Your Email - Blind Chat',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f9f9f9;
              margin: 0;
              padding: 0;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 50px auto;
              background: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .header h1 {
              color: #0073e6;
            }
            .content {
              line-height: 1.6;
            }
            .button {
              display: inline-block;
              margin: 20px 0;
              padding: 10px 20px;
              background-color: #0073e6;
              color: #FFFFFF;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
            }
            .footer {
              font-size: 12px;
              text-align: center;
              color: #888;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Email Verification</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>Thank you for signing up for Blind Chat (${studentEmailConfig.college.shortHand}). To complete your registration, please verify your email by clicking the button below:</p>
              <p><a href="${verificationUrl}" class="button">Verify Your Email</a></p>
              <p>If the button above doesn't work, copy and paste the following link into your browser:</p>
              <p><a href="${verificationUrl}">${verificationUrl}</a></p>
              <p>If you didn’t sign up for Blind Chat, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>Blind Chat Team | ${studentEmailConfig.college.shortHand}</p>
              <p>Please do not reply to this email. If you need help, contact support at support@yourcollege.com</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Hello,

        Thank you for signing up for Blind Chat (${studentEmailConfig.college.shortHand}). To complete your registration, verify your email by clicking the link below:

        ${verificationUrl}

        If you didn’t sign up for Blind Chat, please ignore this email.

        Blind Chat Team | ${studentEmailConfig.college.shortHand}
        Please do not reply to this email. If you need help, contact support at support@yourcollege.com
      `
    };


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