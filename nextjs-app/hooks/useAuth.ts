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

  const resendVerificationEmail = async (email: string) => {
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error(`Rate limit exceeded. Please try again in ${data.retryAfter} minutes.`);
        }
        throw new Error(data.error || 'Failed to resend verification email');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  const forgotPin = async (email: string) => {
    try {
      const response = await fetch('/api/auth/forgot-pin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error(`Rate limit exceeded. Please try again in ${data.retryAfter} minutes.`);
        }
        throw new Error(data.error || 'Failed to process request');
      }

      router.push('/');
    } catch (error: any) {
      throw error;
    }
  };

  const resetPin = async (token: string, newPin: string) => {
    try {
      const response = await fetch('/api/auth/reset-pin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPin }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset PIN');
      }

      return data;
    } catch (error: any) {
      throw error;
    }
  };

  return {
    signin,
    logout,
    signup,
    resendVerificationEmail,
    forgotPin,
    resetPin,
  };
};