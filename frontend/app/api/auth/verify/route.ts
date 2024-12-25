import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { generateToken } from '@/helpers/helper';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const verifyToken = searchParams.get('token');

    if (!verifyToken) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { verifyToken },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid verification token or Already been Verified' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    console.log('baseUrl:', baseUrl);

    if (user.isVerified) {
      // Use the new URL() constructor for better URL handling
      return NextResponse.redirect(new URL('/', baseUrl), {
        status: 302,
      });
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

    const token = await generateToken({ id: user.id, email: user.email });

    // Create response with absolute URL
    const response = NextResponse.redirect(new URL('/', baseUrl), {
      status: 302,
    });

    // Set HTTP-only cookie
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;

  } catch (error) {
    console.error('Error in Verify Route:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}