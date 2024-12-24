import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { generateResetToken } from '@/helpers/helper';
import { sendMail } from '@/services/mail/mail';


export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this email' },
        { status: 404 }
      );
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
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-pin?token=${resetToken}`;

    const mailOptions = {
      to: email,
      subject: 'Reset Your PIN',
      html: `
        <h1>PIN Reset Request</h1>
        <h2>From : Blind CURAJ</h2>
        <p>Click the link below to reset your PIN. This link will expire in 30 minutes:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>If you didn't request this, please ignore this email.</p>
      `
    };

    const emailSent = await sendMail(mailOptions);
    if (!emailSent) {
      throw new Error('Failed to send reset email');
    }

    return NextResponse.json({
      message: 'Reset instructions sent to your email'
    });

  } catch (error) {
    console.error('Forgot PIN error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}