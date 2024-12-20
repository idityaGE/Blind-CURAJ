import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/helpers/create-user';
import { SignUpSchema } from '@/types/user';
import { prisma } from '@/lib/db/prisma';

export async function POST(req: NextRequest) {
  try {
    const { email, pin, name } = SignUpSchema.parse(await req.json());

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
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
    // Handle Zod validation errors
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