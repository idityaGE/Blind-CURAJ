'use client';

import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const router = useRouter();

  const signup = async (email: string, pin: string, name?: string) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, pin, name }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error);
      }

      router.push(`/verify?email=${encodeURIComponent(email)}`);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const signin = async (email: string, pin: string) => {
    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, pin }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error);
      }

      router.push('/');
      router.refresh();
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });

      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return { signin, logout, signup };
};