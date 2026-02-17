/**
 * Example Authentication Component using InteractiveForm
 *
 * This component demonstrates how to use InteractiveForm with Clerk authentication
 *
 * Usage:
 * ```tsx
 * import { SignInForm } from "@/components/Authentication/sign-in-form";
 *
 * export default function SignInPage() {
 *   return <SignInForm />;
 * }
 * ```
 */

"use client";

import {
  InteractiveForm,
  SubmitButton,
  SubmitMessage,
  LoadingMessage,
  FormErrorMessage,
} from "@/components/CoreAdvancedComponent/behaviors/interactive-form";
import {
  FormField,
  InputControl,
  FormMessage,
} from "@/components/CoreAdvancedComponent/components/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getErrorMessage } from "@/types";

type SignInFields = "email" | "password";

export function SignInForm() {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (
    formData: FormData
  ): Promise<{ redirect?: string; error?: string; refresh?: boolean }> => {
    if (!isLoaded) return { error: "Please wait..." };
    setError(null);

    try {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      if (!email || !password) {
        return { error: "Email and password are required" };
      }

      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        return { redirect: "/dashboard", refresh: true };
      } else {
        return { error: "Sign in incomplete. Please try again." };
      }
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Sign in failed. Please try again.");
      setError(errorMessage);
      return { error: errorMessage };
    }
  };

  return (
    <InteractiveForm<SignInFields> fields={["email", "password"]} action={handleSignIn}>
      <div className="space-y-6">
        {error && (
          <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            {error}
          </div>
        )}

        <FormErrorMessage />

        <FormField name="email">
          <Label htmlFor="email">Email</Label>
          <InputControl>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              autoComplete="email"
            />
          </InputControl>
          <FormMessage match="valueMissing">Email is required</FormMessage>
          <FormMessage match="typeMismatch">Please enter a valid email</FormMessage>
        </FormField>

        <FormField name="password">
          <Label htmlFor="password">Password</Label>
          <InputControl>
            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </InputControl>
          <FormMessage match="valueMissing">Password is required</FormMessage>
        </FormField>

        <div className="space-y-2">
          <SubmitButton asChild>
            <Button type="submit" className="w-full" size="lg" disabled={!isLoaded}>
              <LoadingMessage>Signing in...</LoadingMessage>
              <SubmitMessage>Sign In</SubmitMessage>
            </Button>
          </SubmitButton>
        </div>
      </div>
    </InteractiveForm>
  );
}
