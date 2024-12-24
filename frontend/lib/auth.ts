import { cookies } from 'next/headers';
import { verifyToken } from '@/helpers/helper';
import { prisma } from '@/lib/db/prisma';

// server-side getUser
export async function getUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token?.value) {
      return null;
    }

    const decoded = await verifyToken(token.value);

    if (!decoded || typeof decoded === 'string') {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id as string },
      select: {
        id: true,
        email: true,
        name: true,
        isVerified: true,
        createdAt: true,
      }
    });

    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}