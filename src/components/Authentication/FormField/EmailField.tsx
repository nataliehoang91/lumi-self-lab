"use client";

import type React from "react";

import {
  FormField,
  FormLabel,
  FormMessage,
  InputControl,
} from "@/components/CoreAdvancedComponent/components/form";
import { ReserveLayout } from "@/components/ui/reverse-layout";
import { Input } from "@/components/ui/input";
import { FormErrorMessage } from "@/components/CoreAdvancedComponent/behaviors/interactive-form";

export const EmailField = () => {
  return (
    <FormField name="email">
      <FormLabel>Email</FormLabel>
      <InputControl asChild>
        <Input
          data-testid="login-email"
          type="email"
          required
          placeholder="Enter your email address"
        />
      </InputControl>
      <ReserveLayout placeItems="start">
        <FormMessage match="valueMissing">Please enter your email address</FormMessage>
        <FormMessage match="typeMismatch">Please enter a valid email address</FormMessage>
        <FormErrorMessage name="email">This email does not exist. Please sign up.</FormErrorMessage>
      </ReserveLayout>
    </FormField>
  );
};
