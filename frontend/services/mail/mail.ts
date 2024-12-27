import { studentEmailConfig } from '@/config/student-email.config';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  host: process.env.MAIL_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendMail = async ({
  to,
  subject,
  html
}: MailOptions): Promise<boolean> => {
  try {
    const info = await transporter.sendMail({
      from: `"Blind ${studentEmailConfig.college.shortHand} 🍀" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html
    });
    console.log('Message sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};