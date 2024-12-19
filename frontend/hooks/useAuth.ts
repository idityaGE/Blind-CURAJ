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

      const data = await res.json();
      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      const res = await fetch(`/api/auth/verify?token=${token}`);

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error);
      }

      return await res.json();
    } catch (error: any) {
      throw new Error(error.message);
    }
  };


  const login = async (email: string, pin: string) => {
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

      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return { login, logout, signup, verifyEmail };
};