'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { studentEmailConfig } from '@/config/student-email.config';

const SignInSchema = z.object({
  enrollmentId: z
    .string()
    .regex(studentEmailConfig.localPart.regex, `Invalid enrollment ID format. Example: ${studentEmailConfig.localPart.example}`),
  pin: z.string().length(4, 'PIN must be exactly 4 digits'),
});

type SignInInput = z.infer<typeof SignInSchema>;

export function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { signin } = useAuth();

  const form = useForm<SignInInput>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      enrollmentId: '',
      pin: '',
    },
  });

  async function onSubmit(values: SignInInput) {
    setIsLoading(true);

    try {
      // Convert enrollment ID to email format
      const email = `${values.enrollmentId.toLowerCase()}@${studentEmailConfig.domainName}`;
      await signin(email, values.pin);
    } catch (error: any) {
      form.setError('pin', {
        type: 'manual',
        message: error.message,
      });
    }

    setIsLoading(false);
  }

  return (
    <Card className="w-full min-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
        <CardDescription>Enter your enrollment ID and PIN to access your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="enrollmentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enrollment ID</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={studentEmailConfig.localPart.example}
                      disabled={isLoading}
                      className="w-full"
                    />
                  </FormControl>
                  <FormDescription>
                    Enter your enrollment ID (e.g., {studentEmailConfig.localPart.example}).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PIN</FormLabel>
                  <FormControl>
                    <InputOTP
                      maxLength={4}
                      pattern={REGEXP_ONLY_DIGITS}
                      {...field}
                      className="flex justify-center gap-2"
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>
                    Enter your 4-digit PIN.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>

              <div className="text-center">
                <Link
                  href="/forgot-pin"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot PIN?
                </Link>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account? <Link href="/signup" className="text-primary hover:underline">Sign up</Link>
        </p>
      </CardFooter>
    </Card>
  );
}