'use client';

import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';

type User = {
  id: string;
  email: string;
  name: string;
  isVerified: boolean;
  createdAt: Date;
} | null;

export function useUser() {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/user');

      if (!res.ok) {
        if (res.status === 401) {
          setUser(null);
          return;
        }
        throw new Error('Failed to fetch user');
      }

      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = () => {
    fetchUser();
  };

  return {
    user,
    loading,
    error,
    refreshUser
  };
}