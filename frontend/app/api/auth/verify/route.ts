import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { verifyToken: token },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid verification token' },
        { status: 400 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { message: 'Email already verified' },
        { status: 200 }
      );
    }

    // Update user verification status
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verifyToken: null,
        verifiedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: 'Email verified successfully',
    });

  } catch (error) {
    console.error('Error in Verify Route:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}