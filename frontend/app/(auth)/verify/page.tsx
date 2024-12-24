'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

function VerifyContent() {
  const [isResending, setIsResending] = useState(false);
  const { toast } = useToast();
  const { resendVerificationEmail } = useAuth();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || 'your email';

  const handleResend = async () => {
    if (isResending) return;

    setIsResending(true);
    try {
      const result = await resendVerificationEmail(email);
      toast({
        title: "Verification email resent",
        description: `Please check your inbox. You have ${result.remainingAttempts} attempts remaining.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to resend email",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Verify Your Email</CardTitle>
        <CardDescription className="text-center">
          We&apos;ve sent a verification link to your email
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-center text-sm text-muted-foreground">
          We&apos;ve sent a verification email to <strong>{email}</strong>.
          Please check your inbox and click on the link to verify your email address.
        </p>
        <div className="flex flex-col items-center gap-3">
          <Button
            variant="secondary"
            onClick={handleResend}
            disabled={isResending}
            className="w-full max-w-[200px]"
          >
            {isResending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resending...
              </>
            ) : (
              'Resend Email'
            )}
          </Button>
          <Link
            href="/signin"
            className="text-sm font-medium text-primary hover:text-primary/90 underline underline-offset-4"
          >
            Back to Sign In
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function VerifyPage() {
  return (
    <div className="flex items-center justify-center">
      <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin text-primary" />}>
        <VerifyContent />
      </Suspense>
    </div>
  );
}