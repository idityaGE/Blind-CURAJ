import { prisma } from '@/lib/db/prisma';
import { sendMail } from '@/services/mail/mail';
import { generateVerifyToken, hashPin } from '@/helpers/helper';
import { studentEmailConfig } from '@/config/student-email.config';
import { getVerificationEmail } from '@/templates';

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

    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify?token=${verifyToken}`;

    const mailOptions = getVerificationEmail(email, verificationUrl, studentEmailConfig);

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