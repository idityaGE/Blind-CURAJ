import { prisma } from '@/lib/db/prisma';
import { sendMail } from '@/services/mail/mail';
import { generateVerifyToken, hashPin } from '@/helpers/helper';
import { studentEmailConfig } from '@/config/student-email.config';

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