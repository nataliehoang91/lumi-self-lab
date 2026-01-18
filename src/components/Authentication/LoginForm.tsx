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
import { ReserveLayout } from "@/components/ui/reverse-layout";

// TODO: Update to use Clerk authentication  
// This LoginForm component is kept for reference but should be updated to use Clerk hooks

import { LoadingIcon } from "@/components/CoreAdvancedComponent/components/LoadingIcon";
import { EmailField } from "./FormField/EmailField";
import { PasswordField } from "./FormField/PasswordField";
import { cn } from "@/lib/utils";
import { EMAIL_FIELD, PASSWORD_FIELD } from "./types";

export const LoginForm = ({
  cardClassName,
  cardHeaderClassName,
  callbackUrl,
}: {
  cardClassName?: string;
  cardHeaderClassName?: string;
  callbackUrl?: string;
}) => {
  return (
    <Card
      className={cn(
        "w-full max-w-lg sm:min-w-md  md:min-w-lg rounded-lg shadow-lg",
        cardClassName
      )}
    >
      <CardHeader className={cn("text-center", cardHeaderClassName)}>
        <CardTitle className="text-3xl font-bold mb-2">Welcome Back</CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your credentials to access Self-Lab.
        </CardDescription>
      </CardHeader>

      <InteractiveForm
        data-testid="login-form"
        fields={[EMAIL_FIELD, PASSWORD_FIELD]}
        action={async (formData: FormData) => {
          "use server";
          // TODO: Update to use Clerk authentication
          // For now, redirect to dashboard (Clerk will handle auth in protected layout)
          const redirectUrl = callbackUrl || "/create";
          return {
            redirect: redirectUrl,
            refresh: true,
          };
        }}
        className="contents"
      >
          <CardContent className="space-y-4">
            <EmailField />
            <PasswordField />
          </CardContent>
          <CardFooter>
            <SubmitButton asChild>
              <Button type="submit" className="w-full py-4">
                <ReserveLayout>
                  <SubmitMessage>
                    <span className="text-md font-semibold">Log In</span>
                  </SubmitMessage>
                  <LoadingMessage>
                    <LoadingIcon />
                  </LoadingMessage>
                </ReserveLayout>
              </Button>
            </SubmitButton>
          </CardFooter>
          <ReserveLayout>
            <FormErrorMessage name="general">
              Invalid email or password
            </FormErrorMessage>
          </ReserveLayout>
        </InteractiveForm>
      <div className="block">
        <p className="text-balance text-center text-sm text-muted-foreground px-4">
          By Logging In, <br /> You Accept Self-Lab&apos;s
          <Link
            href="/terms"
            className="text-primary hover:underline"
          >
            {" "}
            Terms & Conditions{" "}
          </Link>
        </p>
        {/* Contact info */}
        <div className="my-4" />
        <p className="text-balance text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="text-primary hover:underline"
          >
            Sign up here
          </Link>
        </p>
      </div>
    </Card>
  );
};
