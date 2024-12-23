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
    <div className="flex flex-col items-center justify-center text-center space-y-10 py-6">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl leading-normal md:leading-tight">
          Connect <span className='bg-orange-500 p-1 rounded-lg'>Anonymously,</span>
          <br />
          Chat Freely
        </h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl leading-loose">
          Meet new people through random chat connections. Start meaningful conversations with <span className='underline decoration-orange-500 decoration-2 underline-offset-8'>strangers</span> from around your <span className="underline decoration-orange-500 decoration-2 underline-offset-8">university</span>.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mx-auto pb-10">
        {user ? (
          <GitHubButton onClick={handleConnect} />
        ) : (
          <>
            <Link href="/signup">
              <Button size="lg" variant="link" className="w-full sm:w-auto hover:scale-105 bg-orange-500 dark:text-white">
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
    </div>
  );
}