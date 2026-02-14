# Unstyled Components & Fully Custom Authentication

## Overview

If you want **complete control** over the design and CSS styling, Clerk offers two approaches:

1. **Clerk Elements** - Unstyled, composable components (Beta)
2. **Custom Flows** - Build your own UI using Clerk hooks and backend API

## Option 1: Clerk Elements (Unstyled Components) - RECOMMENDED ⭐

Clerk Elements provides **unstyled, composable components** that give you full control over styles while Clerk handles all the logic.

**Reference:** [Clerk Elements Documentation](https://clerk.com/docs/customization/elements/overview)

### Benefits

- ✅ **Unstyled** - No default CSS, full design control
- ✅ **Composable** - Build your own UI structure
- ✅ **Type-safe** - Full TypeScript support
- ✅ **Automatic** - Clerk handles validation, errors, loading states
- ✅ **Flexible** - Use your own form components and styling

### Installation

```bash
npm install @clerk/elements
```

### Example: Custom Sign-In with Clerk Elements

```tsx
"use client";

import { SignIn, ClerkElementsStylesError } from "@clerk/elements";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export default function CustomSignInPage() {
  return (
    <SignIn.Root>
      <SignIn.Step name="start">
        <Card className="p-8 bg-card/90 backdrop-blur-sm rounded-3xl">
          {/* Your custom header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to continue</p>
          </div>

          {/* Email field with your styling */}
          <SignIn.Field name="identifier">
            <SignIn.Label asChild>
              <Label>Email</Label>
            </SignIn.Label>
            <SignIn.Input asChild>
              <Input
                type="email"
                placeholder="you@example.com"
                className="h-12 rounded-2xl bg-background/50 border-foreground/25"
              />
            </SignIn.Input>
            <SignIn.FieldError />
          </SignIn.Field>

          {/* Password field with your styling */}
          <SignIn.Field name="password">
            <SignIn.Label asChild>
              <Label>Password</Label>
            </SignIn.Label>
            <SignIn.Input asChild>
              <Input
                type="password"
                placeholder="Enter your password"
                className="h-12 rounded-2xl bg-background/50 border-foreground/25"
              />
            </SignIn.Input>
            <SignIn.FieldError />
          </SignIn.Field>

          {/* Submit button with your styling */}
          <SignIn.Action submit asChild>
            <Button type="submit" className="w-full py-6 rounded-2xl shadow-lg hover:shadow-xl">
              Sign In
            </Button>
          </SignIn.Action>

          {/* Error messages */}
          <SignIn.Error />

          {/* Social login buttons (if enabled) */}
          <SignIn.SocialProvider name="google" asChild>
            <Button variant="outline" className="w-full">
              Continue with Google
            </Button>
          </SignIn.SocialProvider>
        </Card>
      </SignIn.Step>
    </SignIn.Root>
  );
}
```

### Available Clerk Elements Components

For **Sign In:**

- `<SignIn.Root>` - Root container
- `<SignIn.Step>` - Step container (start, password, verification, etc.)
- `<SignIn.Field>` - Form field wrapper
- `<SignIn.Label>` - Field label
- `<SignIn.Input>` - Input field
- `<SignIn.FieldError>` - Field-level error message
- `<SignIn.Error>` - Global error message
- `<SignIn.Action>` - Action button (submit, navigate, etc.)
- `<SignIn.SocialProvider>` - Social login button
- `<SignIn.Link>` - Navigation links

For **Sign Up:**

- Similar structure with `<SignUp.*>` components

**Note:** Clerk Elements is currently in **beta** and supports Next.js App Router.

## Option 2: Fully Custom Flows (Using Hooks & Backend API)

If you need **complete control** over every aspect, you can build fully custom authentication using Clerk hooks and the backend API.

**Reference:** [Custom Flows Guide](https://clerk.com/docs/guides/development/custom-flows/authentication/sign-in-or-up)

### What You Need to Implement

For a **complete custom sign-in/sign-up flow**, you'll need to handle:

#### Sign-In Flow

1. **Email/Password Input** ✅ (Already have)
2. **Validation** ✅ (Already have with InteractiveForm)
3. **Sign-In Method** ✅ (Using `signIn.create()`)
4. **Session Management** ✅ (Using `setActive()`)
5. **Error Handling** ✅ (Already have)
6. **Loading States** ✅ (Already have)
7. **Password Reset** ✅ (Using forgot password flow)
8. **Email Verification** ⚠️ (If required)
9. **Social Login** ✅ (Using `signIn.authenticateWithRedirect()`)

#### Sign-Up Flow

1. **Email/Password Input** ✅ (Already have)
2. **Password Confirmation** ✅ (Already have)
3. **Validation** ✅ (Already have)
4. **Sign-Up Method** ✅ (Using `signUp.create()`)
5. **Email Verification** ⚠️ (Required - need to handle)
6. **Session Activation** ⚠️ (After verification)
7. **Error Handling** ✅ (Already have)

### Backend API for Email Addresses

**Reference:** [Clerk Backend API - Email Addresses](https://clerk.com/docs/reference/backend-api/tag/email-addresses)

If you want to use Clerk's **backend API directly** (instead of frontend hooks), you'll need to:

#### Required Backend Endpoints

1. **Create Email Address** - `POST /v1/email_addresses`
2. **Update Email Address** - `PATCH /v1/email_addresses/{id}`
3. **Delete Email Address** - `DELETE /v1/email_addresses/{id}`
4. **Prepare Email Address Verification** - `POST /v1/email_addresses/{id}/prepare_verification`
5. **Attempt Email Address Verification** - `POST /v1/email_addresses/{id}/attempt_verification`

#### Required Methods for Custom Sign-Up

```tsx
// 1. Create user with email
const user = await clerkClient.users.create({
  emailAddress: [email],
  password,
});

// 2. Prepare email verification
const verification = await clerkClient.emailAddresses.createEmailAddressVerification({
  emailAddressId: emailAddress.id,
});

// 3. Attempt verification (when user clicks link)
const verified = await clerkClient.emailAddresses.attemptVerification({
  emailAddressId: emailAddress.id,
  code: verificationCode,
});

// 4. Create session
const session = await clerkClient.sessions.create({
  userId: user.id,
});
```

#### Required Methods for Custom Sign-In

```tsx
// 1. Authenticate user
const signInAttempt = await clerkClient.signIns.create({
  identifier: email,
  password,
});

// 2. Verify password (if needed)
const verified = await clerkClient.signIns.attemptPassword({
  signInId: signInAttempt.id,
  password,
});

// 3. Create session
const session = await clerkClient.sessions.create({
  userId: user.id,
});
```

### Current Implementation Status

✅ **What we have:**

- Custom forms with InteractiveForm
- Clerk hooks (`useSignIn`, `useSignUp`)
- Full design control with Tailwind CSS
- Form validation and error handling
- Loading states
- Social login integration

⚠️ **What might be missing:**

- Email verification flow (handled automatically by Clerk, but may need custom UI)
- Complete password reset flow (we have the initial request, but reset form uses TaskResetPassword)
- Multi-factor authentication (if needed)

## Recommendation

For **full design control with minimal code**, I recommend:

1. **Use Clerk Elements** (Option 1) if you want unstyled components
   - Install `@clerk/elements`
   - Use unstyled components with your own styling
   - Clerk handles all logic automatically

2. **Keep current approach** (Option 2 - Custom Flows) if you're happy with it
   - We're already using Clerk hooks with custom forms
   - Full control over UI/UX
   - Already integrated with InteractiveForm

3. **Use Backend API** only if you need:
   - Server-side authentication logic
   - Custom business logic during sign-up
   - Integration with external systems

## Migration Guide

### From Current Implementation to Clerk Elements

1. Install Clerk Elements:

   ```bash
   npm install @clerk/elements
   ```

2. Replace `<SignIn />` with `<SignIn.Root>` and sub-components
3. Replace form fields with `<SignIn.Field>` components
4. Keep all your custom styling (Card, Input, Button components)
5. Remove `appearance` prop (not needed with Elements)

### From Current Implementation to Backend API

1. Create API routes for sign-in/sign-up:
   - `/api/auth/sign-in/route.ts`
   - `/api/auth/sign-up/route.ts`

2. Use `clerkClient` from `@clerk/nextjs/server`

3. Implement all required methods (see above)

4. Update frontend to call API routes instead of using hooks directly

## Resources

- [Clerk Elements Overview](https://clerk.com/docs/customization/elements/overview)
- [Custom Flows Guide](https://clerk.com/docs/guides/development/custom-flows/authentication/sign-in-or-up)
- [Backend API - Email Addresses](https://clerk.com/docs/reference/backend-api/tag/email-addresses)
- [Backend API - Sign Ins](https://clerk.com/docs/reference/backend-api/tag/sign-ins)
- [Backend API - Sign Ups](https://clerk.com/docs/reference/backend-api/tag/sign-ups)
