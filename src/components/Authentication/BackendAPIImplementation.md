# Fully Custom Authentication Using Clerk Backend API

## Overview

If you need **complete control** over the authentication flow and want to implement all methods yourself using Clerk's Backend API, this guide shows what's required.

**Reference:** [Clerk Backend API - Email Addresses](https://clerk.com/docs/reference/backend-api/tag/email-addresses)

## When to Use Backend API

Use the Backend API when you need:

- ✅ Server-side authentication logic
- ✅ Custom business logic during sign-up/sign-in
- ✅ Integration with external systems (CRM, analytics, etc.)
- ✅ Custom email verification flows
- ✅ Multi-step sign-up processes
- ✅ Custom password policies
- ✅ Server-side validation

## Required Methods for Complete Custom Sign-Up

### 1. Create User with Email Address

```tsx
// app/api/auth/sign-up/route.ts
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, password, firstName, lastName } = await request.json();

  try {
    // 1. Create user with email address
    const user = await clerkClient.users.create({
      emailAddress: [email],
      password,
      firstName,
      lastName,
      skipPasswordChecks: false, // Enforce password requirements
      skipPasswordRequirement: false,
    });

    // 2. Get the email address ID
    const emailAddress = user.emailAddresses[0];

    // 3. Prepare email verification
    const verification = await clerkClient.emailAddresses.createEmailAddressVerification({
      emailAddressId: emailAddress.id,
    });

    // 4. Return response (don't create session yet - wait for verification)
    return NextResponse.json({
      userId: user.id,
      emailAddressId: emailAddress.id,
      verificationId: verification.id,
      status: "verification_required",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.errors?.[0]?.message || "Sign up failed" },
      { status: 400 }
    );
  }
}
```

### 2. Verify Email Address

```tsx
// app/api/auth/verify-email/route.ts
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { emailAddressId, code } = await request.json();

  try {
    // Attempt verification
    const verified = await clerkClient.emailAddresses.attemptVerification({
      emailAddressId,
      code,
    });

    if (verified.status === "verified") {
      // 5. Create session after verification
      const session = await clerkClient.sessions.create({
        userId: verified.userId,
      });

      return NextResponse.json({
        sessionId: session.id,
        status: "complete",
      });
    }

    return NextResponse.json({ error: "Verification failed" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.errors?.[0]?.message || "Verification failed" },
      { status: 400 }
    );
  }
}
```

### 3. Resend Verification Code

```tsx
// app/api/auth/resend-verification/route.ts
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { emailAddressId } = await request.json();

  try {
    const verification = await clerkClient.emailAddresses.createEmailAddressVerification({
      emailAddressId,
    });

    return NextResponse.json({
      verificationId: verification.id,
      status: "sent",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.errors?.[0]?.message || "Failed to resend code" },
      { status: 400 }
    );
  }
}
```

## Required Methods for Complete Custom Sign-In

### 1. Authenticate User

```tsx
// app/api/auth/sign-in/route.ts
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  try {
    // 1. Create sign-in attempt
    const signInAttempt = await clerkClient.signIns.create({
      identifier: email,
    });

    // 2. Attempt password authentication
    const result = await clerkClient.signIns.attemptPassword({
      signInId: signInAttempt.id,
      password,
    });

    if (result.status === "complete") {
      // 3. Create session
      const session = await clerkClient.sessions.create({
        userId: result.userId,
      });

      return NextResponse.json({
        sessionId: session.id,
        userId: result.userId,
        status: "complete",
      });
    }

    // Handle MFA or other required steps
    return NextResponse.json({
      signInId: signInAttempt.id,
      status: result.status,
      nextSteps: result.nextSteps,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.errors?.[0]?.message || "Sign in failed" },
      { status: 400 }
    );
  }
}
```

### 2. Password Reset Request

```tsx
// app/api/auth/forgot-password/route.ts
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email } = await request.json();

  try {
    // Create password reset request
    const reset = await clerkClient.signIns.create({
      identifier: email,
      strategy: "reset_password_email_code",
    });

    return NextResponse.json({
      status: "sent",
      signInId: reset.id,
    });
  } catch (error: any) {
    // Don't reveal if email exists (security best practice)
    return NextResponse.json({
      status: "sent", // Always return success
    });
  }
}
```

### 3. Reset Password with Code

```tsx
// app/api/auth/reset-password/route.ts
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { signInId, code, newPassword } = await request.json();

  try {
    // Attempt reset with code
    const reset = await clerkClient.signIns.attemptFirstFactor({
      signInId,
      strategy: "reset_password_email_code",
      code,
      password: newPassword,
    });

    if (reset.status === "complete") {
      // Create session after password reset
      const session = await clerkClient.sessions.create({
        userId: reset.userId,
      });

      return NextResponse.json({
        sessionId: session.id,
        status: "complete",
      });
    }

    return NextResponse.json({ error: "Reset failed" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.errors?.[0]?.message || "Reset failed" },
      { status: 400 }
    );
  }
}
```

## Complete Frontend Implementation

### Sign-Up Flow

```tsx
// app/sign-up/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { InteractiveForm } from "@/components/CoreAdvancedComponent/behaviors/interactive-form";

export default function SignUpPage() {
  const router = useRouter();
  const [verificationRequired, setVerificationRequired] = useState(false);

  const handleSignUp = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // 1. Create user
    const response = await fetch("/api/auth/sign-up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.status === "verification_required") {
      // 2. Show verification form
      setVerificationRequired(true);
      // Store emailAddressId and verificationId for verification step
      return { error: null, redirect: null };
    }

    if (data.error) {
      return { error: data.error };
    }

    // 3. After verification, create session on client
    if (data.sessionId) {
      // Set session cookie (handled by Clerk middleware)
      router.push("/dashboard");
      return { redirect: "/dashboard", refresh: true };
    }

    return { error: "Sign up failed" };
  };

  const handleVerifyEmail = async (formData: FormData) => {
    const code = formData.get("code") as string;
    const emailAddressId = formData.get("emailAddressId") as string;

    const response = await fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emailAddressId, code }),
    });

    const data = await response.json();

    if (data.sessionId) {
      router.push("/dashboard");
      return { redirect: "/dashboard", refresh: true };
    }

    return { error: data.error || "Verification failed" };
  };

  if (verificationRequired) {
    return (
      <InteractiveForm action={handleVerifyEmail}>{/* Verification code input */}</InteractiveForm>
    );
  }

  return <InteractiveForm action={handleSignUp}>{/* Email and password inputs */}</InteractiveForm>;
}
```

### Sign-In Flow

```tsx
// app/sign-in/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { InteractiveForm } from "@/components/CoreAdvancedComponent/behaviors/interactive-form";

export default function SignInPage() {
  const router = useRouter();

  const handleSignIn = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const response = await fetch("/api/auth/sign-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.sessionId) {
      // Set session cookie (handled by Clerk middleware)
      router.push("/dashboard");
      return { redirect: "/dashboard", refresh: true };
    }

    if (data.error) {
      return { error: data.error };
    }

    // Handle MFA or other required steps
    if (data.nextSteps) {
      // Show appropriate UI for next steps
      return { error: null, redirect: null };
    }

    return { error: "Sign in failed" };
  };

  return <InteractiveForm action={handleSignIn}>{/* Email and password inputs */}</InteractiveForm>;
}
```

## All Required Backend API Methods

### Email Address Management

1. ✅ `POST /v1/email_addresses` - Create email address
2. ✅ `PATCH /v1/email_addresses/{id}` - Update email address
3. ✅ `DELETE /v1/email_addresses/{id}` - Delete email address
4. ✅ `POST /v1/email_addresses/{id}/prepare_verification` - Prepare verification
5. ✅ `POST /v1/email_addresses/{id}/attempt_verification` - Attempt verification

### Sign-In Management

1. ✅ `POST /v1/sign_ins` - Create sign-in attempt
2. ✅ `POST /v1/sign_ins/{id}/attempt_password` - Attempt password
3. ✅ `POST /v1/sign_ins/{id}/attempt_first_factor` - Attempt first factor (for MFA/reset)

### Sign-Up Management

1. ✅ `POST /v1/users` - Create user
2. ✅ `PATCH /v1/users/{id}` - Update user
3. ✅ `DELETE /v1/users/{id}` - Delete user

### Session Management

1. ✅ `POST /v1/sessions` - Create session
2. ✅ `GET /v1/sessions/{id}` - Get session
3. ✅ `DELETE /v1/sessions/{id}` - Revoke session

## Comparison: Hooks vs Backend API

| Feature               | Hooks (Current) | Backend API             |
| --------------------- | --------------- | ----------------------- |
| Code Complexity       | ⭐ Simple       | ⭐⭐⭐ Complex          |
| Control               | ⭐⭐ Medium     | ⭐⭐⭐ Full             |
| Server-Side Logic     | ❌ No           | ✅ Yes                  |
| Custom Business Logic | ⚠️ Limited      | ✅ Full                 |
| Maintenance           | ⭐⭐ Easy       | ⭐⭐⭐ Harder           |
| Recommended For       | Most apps       | Enterprise/complex apps |

## Recommendation

**For your use case** (wanting full design control), I recommend:

1. **Use Clerk Elements** (unstyled components) - Best balance of control and simplicity
2. **Keep current approach** (hooks + custom forms) - Already working well
3. **Use Backend API** only if you need server-side business logic

The Backend API approach is significantly more complex and requires implementing all methods yourself. Only use it if you have specific requirements that can't be met with hooks or Elements.
