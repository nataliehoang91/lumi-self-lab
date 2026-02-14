"use client";

import type React from "react";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import {
  FormErrorMessage,
  InteractiveForm,
  LoadingMessage,
  SubmitButton,
  SubmitMessage,
} from "@/components/CoreAdvancedComponent/behaviors/interactive-form";
import {
  FormField,
  FormMessage,
  InputControl,
} from "@/components/CoreAdvancedComponent/components/form";
import { ReserveLayout } from "@/components/ui/reverse-layout";

import { LoadingIcon } from "@/components/CoreAdvancedComponent/components/LoadingIcon";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const ForgotPasswordForm = ({
  cardClassName,
  cardHeaderClassName,
}: {
  cardClassName?: string;
  cardHeaderClassName?: string;
}) => {
  return (
    <Card className={cn("w-full max-w-md rounded-lg shadow-lg", cardClassName)}>
      <CardHeader className={cn("text-center", cardHeaderClassName)}>
        <CardTitle className="text-3xl font-bold mb-2">Forgot Password?</CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your email to reset your password.
        </CardDescription>
      </CardHeader>

      <InteractiveForm
        fields={["email"]}
        action={async (formData: FormData) => {
          "use server";
          // TODO: Implement Clerk forgot password action
          // For now, return redirect to sent page
          const email = formData.get("email") as string;
          return {
            redirect: `/forgot-password/sent?email=${encodeURIComponent(email)}`,
            refresh: true,
          };
        }}
      >
        <CardContent className="">
          <FormField name="email">
            <Label htmlFor="email">Email</Label>
            <InputControl>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Enter your email address"
                autoComplete="email"
              />
            </InputControl>
            <ReserveLayout placeItems="start">
              <FormMessage match="valueMissing">Please enter your email address</FormMessage>
              <FormMessage match="typeMismatch">Please enter a valid email address</FormMessage>
              <FormErrorMessage name="email" />
            </ReserveLayout>
          </FormField>
        </CardContent>

        <CardFooter className="flex-col space-y-4">
          <SubmitButton asChild>
            <Button type="submit" className="w-full py-4">
              <ReserveLayout>
                <SubmitMessage>
                  <span className="text-md font-semibold">Send Reset Email</span>
                </SubmitMessage>
                <LoadingMessage>
                  <LoadingIcon />
                </LoadingMessage>
              </ReserveLayout>
            </Button>
          </SubmitButton>

          {/* Compact footer navigation */}
          <div className="w-full space-y-3">
            {/* Back to Sign In */}
            <div className="text-center">
              <Link
                href="/sign-in"
                className="text-sm underline font-medium text-primary hover:underline"
              >
                Go back to Sign In
              </Link>
            </div>
          </div>
        </CardFooter>

        <ReserveLayout>
          <FormErrorMessage name="general" />
        </ReserveLayout>
      </InteractiveForm>
    </Card>
  );
};
