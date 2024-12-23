import React from 'react';
import { HomeIcon } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col items-center justify-center min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        {/* Logo and branding section */}
        <div className="flex flex-col items-center mb-4">
          <Link
            href="/"
            className="flex items-center justify-center w-16 h-16 bg-primary transition-colors rounded-xl mb-2"
          >
            <HomeIcon className="w-8 h-8 text-primary-foreground" />
          </Link>
          <h1 className="text-2xl font-bold text-foreground font-mono">Blind CURAJ</h1>
        </div>

        {/* Main content area with card effect */}
        <div className="w-full max-w-md">
          <div className="bg-card text-card-foreground shadow-lg rounded-xl border">
            {children}
          </div>

          {/* Footer information */}
          <div className="mt-6 text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              </svg>
              <span>Protected by end-to-end encryption</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Need help? Contact{' '}
              <a
                href="mailto:am44910606@gmail.com"
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                am44910606@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}