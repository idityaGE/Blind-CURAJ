'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function LandingHero() {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-8 py-20">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Connect Anonymously,
          <br />
          Chat Freely
        </h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          Meet new people through random chat connections. Start meaningful conversations with strangers from around the world.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mx-auto">
        <Link href="/signin">
          <Button size="lg" className="w-full sm:w-auto">
            Sign In
          </Button>
        </Link>
        <Link href="/signup">
          <Button size="lg" variant="outline" className="w-full sm:w-auto">
            Create Account
          </Button>
        </Link>
      </div>
      <div className="relative w-full max-w-4xl mx-auto">
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