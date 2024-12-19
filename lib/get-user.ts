import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/helpers/helper';

export const getUser = async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')

  if (!token) {
    return null;
  }

  try {
    const user = verifyToken(token?.value);
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}