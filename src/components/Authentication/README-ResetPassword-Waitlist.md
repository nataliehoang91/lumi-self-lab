# Reset Password & Waitlist Components

## Overview

This document explains how to use Clerk's `<TaskResetPassword />` and `<Waitlist />` components in the application.

## TaskResetPassword Component

### What It Does

The `<TaskResetPassword />` component is used when a user has clicked a reset password link from their email and has a `reset-password` session task. It renders a UI for resolving the password reset task.

**Reference:** [Clerk TaskResetPassword Documentation](https://clerk.com/docs/nextjs/reference/components/authentication/task-reset-password)

### Important Notes

> ⚠️ **IMPORTANT**: The `<TaskResetPassword/>` component cannot render when a user doesn't have current session tasks.

### How It Works

1. User clicks "Forgot password?" on the sign-in page
2. Clerk sends a reset password email with a link
3. User clicks the link from their email
4. Clerk creates a `reset-password` session task
5. User is redirected to `/reset-password` (configured in `ClerkProvider`)
6. `<TaskResetPassword />` component renders automatically
7. User enters new password
8. After successful reset, user is redirected to `/sign-in`

### Current Implementation

**Location:** `/src/app/reset-password/page.tsx`

```tsx
import { TaskResetPassword } from "@clerk/nextjs";

export default function ResetPasswordPage() {
  return (
    <TaskResetPassword
      appearance={{ /* custom styling */ }}
      redirectUrlComplete="/sign-in"
    />
  );
}
```

### Configuration

**In `src/app/layout.tsx`:**

```tsx
<ClerkProvider
  taskUrls={{
    "reset-password": "/reset-password",
  }}
>
```

This tells Clerk to redirect users with a `reset-password` session task to `/reset-password`.

### Automatic Handling

According to Clerk's documentation, the `<SignIn />` component automatically handles the reset-password flow, including rendering the `<TaskResetPassword />` component when needed. You only need to customize the route if you want it on a different path.

### Properties

- **`redirectUrlComplete`** (string): The URL to navigate to after successfully completing the password reset. Defaults to `/`. We set it to `/sign-in`.

- **`appearance`** (Appearance): Optional object to style the component. We use this to match our custom design.

## Waitlist Component

### What It Does

The `<Waitlist />` component renders a form that allows users to join for early access to your application. This is ideal for apps in early development stages or those wanting to generate interest before launch.

**Reference:** [Clerk Waitlist Documentation](https://clerk.com/docs/nextjs/reference/components/authentication/waitlist)

### Important Notes

> ⚠️ **WARNING**: Before using the `<Waitlist />` component, you must:
> 1. Enable Waitlist mode in Clerk Dashboard
> 2. Provide the `waitlistUrl` prop in ClerkProvider or SignIn component

### Enabling Waitlist Mode

1. Go to [Clerk Dashboard Waitlist Settings](https://dashboard.clerk.com/~/user-authentication/waitlist)
2. Toggle on **Enable waitlist**
3. Click **Save**

### Current Implementation

**Location:** `/src/app/waitlist/[[...waitlist]]/page.tsx`

```tsx
import { Waitlist } from "@clerk/nextjs";

export default function WaitlistPage() {
  return (
    <Waitlist
      appearance={{ /* custom styling */ }}
      signInUrl="/sign-in"
      afterJoinWaitlistUrl="/"
    />
  );
}
```

### Configuration

**In `src/app/layout.tsx`:**

```tsx
<ClerkProvider
  waitlistUrl="/waitlist"
>
```

This tells Clerk where to redirect users who want to join the waitlist.

**Also configured in SignIn and SignUp components:**

```tsx
<SignIn
  waitlistUrl="/waitlist"
  // ... other props
/>
```

### Properties

- **`afterJoinWaitlistUrl`** (string): The URL to navigate to after joining the waitlist. We set it to `/` (home page).

- **`signInUrl`** (string): The URL or path to the sign-in page. Used for the "Already have an account? Sign in" link. We set it to `/sign-in`.

- **`appearance`** (Appearance): Optional object to style the component. We use this to match our custom design.

- **`fallback`** (ReactNode): Optional element to render while the component is mounting.

## Authentication Flow

### Password Reset Flow

1. User visits `/sign-in`
2. User clicks "Forgot password?" link (handled by `<SignIn />` component)
3. Clerk sends reset password email
4. User clicks link in email
5. User is redirected to `/reset-password` (via `taskUrls` configuration)
6. `<TaskResetPassword />` component renders
7. User enters new password
8. User is redirected to `/sign-in` (via `redirectUrlComplete`)

### Waitlist Flow

1. User visits `/waitlist`
2. `<Waitlist />` component renders
3. User enters email/name (depending on configuration)
4. User joins waitlist
5. User is redirected to `/` (via `afterJoinWaitlistUrl`)
6. If user clicks "Already have an account? Sign in", they're redirected to `/sign-in`

## Customization

Both components support the same `appearance` prop as `<SignIn />` and `<SignUp />` components, allowing you to customize:

- Colors (primary, background, text, etc.)
- Border radius
- Font family
- Input styles
- Button styles
- Card styles
- Error message styles
- And more...

See the component files for the full customization options.

## Testing

### Test Password Reset

1. Go to `/sign-in`
2. Click "Forgot password?" link
3. Enter your email
4. Check your email for reset link
5. Click the reset link
6. You should be redirected to `/reset-password`
7. Enter new password
8. You should be redirected to `/sign-in`

### Test Waitlist

1. Ensure Waitlist mode is enabled in Clerk Dashboard
2. Go to `/waitlist`
3. Fill out the waitlist form
4. Submit
5. You should be redirected to home page

## Resources

- [TaskResetPassword Component Docs](https://clerk.com/docs/nextjs/reference/components/authentication/task-reset-password)
- [Waitlist Component Docs](https://clerk.com/docs/nextjs/reference/components/authentication/waitlist)
- [Clerk Session Tasks](https://clerk.com/docs/guides/how-clerk-works/routing#session-tasks)
- [Waitlist Mode Guide](https://clerk.com/docs/guides/secure/restricting-access#waitlist)
