import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/helpers/create-user';
import { SignUpSchema } from '@/types/user';
import { prisma } from '@/lib/db/prisma';

export async function POST(req: NextRequest) {
  try {
    const { email, pin, name } = SignUpSchema.parse(await req.json());

    // Validate email domain
    if (!email.toLowerCase().endsWith('@curaj.ac.in')) {
      return NextResponse.json(
        { error: 'Only CURAJ email addresses are allowed' },
        { status: 400 }
      );
    }

    // Validate enrollment ID format from email
    const enrollmentId = email.split('@')[0];
    if (!/^\d{4}[a-z]+\d{3}$/.test(enrollmentId)) {
      return NextResponse.json(
        { error: 'Invalid enrollment ID format' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Enrollment ID already registered' },
        { status: 409 }
      );
    }

    const user = await createUser(email, pin, name);

    if (!user) {
      return NextResponse.json(
        { error: 'Error creating user' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'User created successfully. Please check your email for verification.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified
      }
    }, { status: 201 });

  } catch (error: any) {
    if (error.issues) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error in Signup Route:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}