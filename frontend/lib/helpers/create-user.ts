import { prisma } from '@/lib/db/prisma';
import { sendMail } from '@/services/mail/mail';
import { generateVerifyToken, hashPin } from '@/lib/helpers/helper';

export const createUser = async (email: string, pin: string, name?: string) => {
  const hashedPin = await hashPin(pin);
  if (!hashedPin) {
    throw new Error('Error hashing pin');
  }

  const verifyToken = await generateVerifyToken();
  let user;

  try {
    // Create user first
    user = await prisma.user.create({
      data: {
        name: name || 'Anonymous',
        email,
        pin: hashedPin,
        verifyToken,
      },
    });

    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify?token=${verifyToken}`;

    const mailOptions = {
      to: email,
      subject: 'Verify your email',
      html: `
        <h1>Email Verification</h1>
        <h2>From : Blind CURAJ</h2>
        <p>Click the link below to verify your email:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
      `
    };

    // Send verification email
    const emailSent = await sendMail(mailOptions);

    if (!emailSent) {
      // If email fails, delete the created user and throw error
      if (user?.id) {
        await prisma.user.delete({
          where: { id: user.id }
        });
      }
      throw new Error('Failed to send verification email');
    }

    return user;

  } catch (error) {
    // If user was created but email failed, ensure user is deleted
    if (user?.id) {
      await prisma.user.delete({
        where: { id: user.id }
      });
    }

    console.error('Error in user creation process:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to create user');
  }
};