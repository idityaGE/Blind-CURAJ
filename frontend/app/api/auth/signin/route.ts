import { prisma } from '@/lib/db/prisma';
import { verifyPin } from '@/lib/helpers/helper';
import { NextRequest, NextResponse } from 'next/server';
import { SignInSchema } from '@/types/user';
import { generateToken } from '@/lib/helpers/helper';

export async function POST(req: NextRequest) {
  try {
    const { email, pin } = SignInSchema.parse(await req.json());

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials or Don't have account" }, { status: 401 });
    }

    if (!user.isVerified) {
      return NextResponse.json({ error: 'Please verify your account' }, { status: 401 });
    }

    const isPinValid = await verifyPin(pin, user.pin);
    if (!isPinValid) {
      return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 });
    }

    const token = await generateToken({ id: user.id, email: user.email });

    // Create response
    const response = NextResponse.json({
      message: 'Login successful',
    });

    // Set HTTP-only cookie
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;

  } catch (error: any) {
    console.error('Error in Login Route:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}