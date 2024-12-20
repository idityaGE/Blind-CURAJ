import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';

function VerifyContent({ email }: { email: string }) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Verify Your Email</CardTitle>
        <CardDescription className="text-center">
          We've sent a verification link to your email
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-center text-sm text-muted-foreground">
          We've sent a verification email to <strong>{email}</strong>.
          Please check your inbox and click on the link to verify your email address.
        </p>
      </CardContent>
    </Card>
  );
}

export default function VerifyPage({ searchParams }: { searchParams: { email?: string } }) {
  const email = searchParams.email || 'your email';

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin text-primary" />}>
        <VerifyContent email={email} />
      </Suspense>
    </div>
  );
}

