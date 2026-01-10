"use client";

import type React from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormErrorMessage } from "@/components/CoreAdvancedComponent/behaviors/interactive-form";
import {
  FormField,
  FormLabel,
  FormMessage,
  InputControl,
} from "@/components/CoreAdvancedComponent/components/form";
import { ReserveLayout } from "@/components/ui/reverse-layout";
import { useState } from "react";

export const PasswordField = () => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <FormField name="password">
      <div className="flex items-center justify-between">
        <FormLabel>Password</FormLabel>
        <Link
          href="/forgot-password"
          className="text-sm text-primary hover:underline"
        >
          Forgot Password?
        </Link>
      </div>
      <div className="relative">
        <InputControl asChild>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Please enter your password"
            required
            className="pr-10"
            rightElement={
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-transparent"
                aria-label="Show password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            }
          />
        </InputControl>
      </div>
      <ReserveLayout placeItems="start">
        <FormMessage match="valueMissing">
          Please enter your password
        </FormMessage>
        <FormErrorMessage name="password" match="tooShort">
          Password must be at least 8 characters long
        </FormErrorMessage>
        <FormErrorMessage name="password" />
      </ReserveLayout>
    </FormField>
  );
};
