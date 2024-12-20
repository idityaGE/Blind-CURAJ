import { prisma } from '@/lib/db/prisma';
import { sendMail } from '@/services/mail/mail';
import { generateVerifyToken, hashPin } from '@/lib/helpers/helper';


export const createUser = async (email: string, pin: string, name?: string) => {
  const hashedPin = await hashPin(pin);
  if (!hashedPin) {
    throw new Error('Error hashing pin');
  }

  const verifyToken = await generateVerifyToken();

  try {
    const user = await prisma.user.create({
      data: {
        name: name || 'Anonymous',
        email,
        pin: hashedPin,
        verifyToken,
      },
    })

    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify?token=${verifyToken}`;

    const mailOptions = {
      to: email,
      subject: 'Verify your email',
      html: `
        <h1>Email Verification</h1>
        <p>Click the link below to verify your email:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
    `
    }

    await sendMail(mailOptions);

    return user;

  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}