import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { generateResetToken } from '@/helpers/helper';
import { sendMail } from '@/services/mail/mail';
import { checkRateLimit, recordAttempt } from '@/utils/rateLimit';
import { studentEmailConfig } from '@/config/student-email.config';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!email.endsWith(`@${studentEmailConfig.domainName}`)) {
      return NextResponse.json(
        { error: `Invalid email domain. Must be a ${studentEmailConfig.college.shortHand} email address.` },
        { status: 400 }
      );
    }

    // Extract and validate enrollment ID
    const enrollmentId = email.split('@')[0].toUpperCase();
    const enrollmentIdRegex = studentEmailConfig.localPart.regex;
    if (!enrollmentIdRegex.test(enrollmentId)) {
      return NextResponse.json(
        { error: 'Invalid enrollment ID format' },
        { status: 400 }
      );
    }

    // Check rate limit
    const rateLimitResult = await checkRateLimit(email);
    if (!rateLimitResult.success) {
      const retryAfter = Math.ceil((rateLimitResult.reset - Math.floor(Date.now() / 1000)) / 60);
      return NextResponse.json(
        {
          error: 'Too many reset attempts',
          retryAfter
        },
        {
          status: 429,
          headers: {
            'Retry-After': rateLimitResult.reset.toString()
          }
        }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // For security, don't reveal whether the account exists
      return NextResponse.json({
        message: 'If an account exists with this enrollment ID, you will receive PIN reset instructions.'
      });
    }

    if (!user.isVerified) {
      return NextResponse.json(
        { error: 'Please verify your email first' },
        { status: 400 }
      );
    }

    // Generate reset token
    const resetToken = await generateResetToken(user.id);
    const resetTokenExpiry = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    // Update user with reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry
      }
    });

    // Send reset email
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-pin?token=${resetToken}`;

    const mailOptions = {
      to: email,
      subject: 'Reset Your PIN - Blind Chat',
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
              background: #fff;
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
              <h1>Reset Your PIN</h1>
            </div>
            <div class="content">
              <p>Hi there,</p>
              <p>We received a request to reset your PIN for your account on <b>Blind Chat (${studentEmailConfig.college.shortHand})</b>. Click the button below to reset your PIN. This link will expire in 30 minutes:</p>
              <p><a href="${resetUrl}" class="button">Reset Your PIN</a></p>
              <p>If you didn't request this, you can safely ignore this email.</p>
            </div>
            <div class="footer">
              <p>Blind Chat Team | ${studentEmailConfig.college.shortHand}</p>
              <p>Please do not reply to this email. If you need help, contact support at support@yourcollege.com</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Hi there,

        We received a request to reset your PIN for your account on Blind Chat (${studentEmailConfig.college.shortHand}). Use the following link to reset your PIN. This link will expire in 30 minutes:

        ${resetUrl}

        If you didn't request this, you can safely ignore this email.

        Blind Chat Team | ${studentEmailConfig.college.shortHand}
        Please do not reply to this email. If you need help, contact support at support@yourcollege.com
      `
    };


    const emailSent = await sendMail(mailOptions);
    if (!emailSent) {
      throw new Error('Failed to send reset email');
    }

    // Record the attempt only after successful email send
    await recordAttempt(email);

    return NextResponse.json({
      message: 'If an account exists with this enrollment ID, you will receive PIN reset instructions.'
    });

  } catch (error) {
    console.error('Forgot PIN error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}