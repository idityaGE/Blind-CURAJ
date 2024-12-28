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

const SignUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  enrollmentId: z
    .string()
    .regex(studentEmailConfig.localPart.regex, `Invalid enrollment ID format. Example: ${studentEmailConfig.localPart.example}`),
  pin: z.string().length(4, 'PIN must be exactly 4 digits'),
  confirmPin: z.string().length(4, 'Confirm PIN must be exactly 4 digits'),
}).refine((data) => data.pin === data.confirmPin, {
  message: "PINs don't match",
  path: ["confirmPin"],
});

type SignUpInput = z.infer<typeof SignUpSchema>;

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();

  const form = useForm<SignUpInput>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: '',
      enrollmentId: '',
      pin: '',
      confirmPin: '',
    },
  });

  async function onSubmit(values: SignUpInput) {
    setIsLoading(true);
    try {
      // Convert enrollment ID to email format
      const email = `${values.enrollmentId.toLowerCase()}@${studentEmailConfig.domainName}`;
      await signup(email, values.pin, values.name);
    } catch (error: any) {
      form.setError('enrollmentId', {
        type: 'manual',
        message: error.message,
      });
    }
    setIsLoading(false);
  }

  return (
    <Card className="w-full min-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
        <CardDescription>Create your account using your enrollment ID.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Anonymous'
                      disabled={isLoading}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                    Enter a 4-digit PIN for your account.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm PIN</FormLabel>
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
                    Re-enter your 4-digit PIN to confirm.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing up...' : 'Sign Up'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account? <Link href="/signin" className="text-primary hover:underline">Sign in</Link>
        </p>
      </CardFooter>
    </Card>
  );
}