'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const ForgotPinSchema = z.object({
  enrollmentId: z
    .string()
    .regex(/^\d{4}[A-Za-z]+\d{3}$/, 'Invalid enrollment ID format. Example: 2023BTCSE017'),
});

type ForgotPinInput = z.infer<typeof ForgotPinSchema>;

export const ForgotPinForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { forgotPin } = useAuth();
  const { toast } = useToast();

  const form = useForm<ForgotPinInput>({
    resolver: zodResolver(ForgotPinSchema),
    defaultValues: {
      enrollmentId: '',
    },
  });

  const onSubmit = async (values: ForgotPinInput) => {
    setIsLoading(true);
    try {
      // Convert enrollment ID to email format
      const email = `${values.enrollmentId.toLowerCase()}@curaj.ac.in`;
      await forgotPin(email);

      toast({
        title: "Reset Link Sent to your Email",
        description: "If an account exists with this enrollment ID, you will receive PIN reset instructions.",
      });

      form.reset();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send reset link",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Forgot PIN</CardTitle>
        <CardDescription>
          Enter your enrollment ID and we&apos;ll send you a link to reset your PIN.
        </CardDescription>
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
                      placeholder="2023BTCSE017"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter your enrollment ID (e.g., 2023BTCSE017)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};