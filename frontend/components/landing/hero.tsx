'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import GitHubButton from './gradient-btn';
import { UserBeam } from './user-beam';

interface LandingHeroProps {
  user: any | null; // Replace 'any' with your actual user type
}

export function LandingHero({ user }: LandingHeroProps) {
  const router = useRouter();

  const handleConnect = () => {
    router.push('/chat');
  };

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Connect Anonymously,
          <br />
          Chat Freely
        </h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          Meet new people through random chat connections. Start meaningful conversations with strangers from around your university.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mx-auto pb-4">
        {user ? (
          <GitHubButton onClick={handleConnect} />
        ) : (
          <>
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
              </Button>
            </Link>
            <Link href="/signin">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </>
        )}
      </div>
      <UserBeam />
      <div className="relative w-full max-w-4xl mx-auto pt-12">
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80"
          alt="Chat Preview"
          className="w-full h-[300px] object-cover rounded-lg shadow-2xl"
        />
      </div>
    </div>
  );
}