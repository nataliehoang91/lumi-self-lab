# Authentication Components

This folder contains example authentication components using the `InteractiveForm` component from `@/components/CoreAdvancedComponent`.

## Components

### SignInForm

Example sign-in form using InteractiveForm with Clerk authentication.

**Usage:**

```tsx
import { SignInForm } from "@/components/Authentication/sign-in-form";

export default function SignInPage() {
  return (
    <div className="container mx-auto p-4">
      <Card>
        <SignInForm />
      </Card>
    </div>
  );
}
```

## Form Components Used

All authentication forms use components from:

- `@/components/CoreAdvancedComponent/behaviors/interactive-form` - InteractiveForm, SubmitButton, etc.
- `@/components/CoreAdvancedComponent/components/form` - FormField, InputControl, FormMessage

## Clerk Integration

These components use Clerk for authentication. Make sure you have:

1. Set up Clerk environment variables (`.env.local`)
2. Configured Clerk middleware in `middleware.ts`
3. Added ClerkProvider to your root layout

## Form Actions

The forms use `InteractiveForm` which expects an async action function that:

- Takes `FormData` as input
- Returns a promise with `{ redirect?: string; error?: string; refresh?: boolean }`
- Handles authentication logic (e.g., Clerk sign-in/sign-up)

Example action:

```tsx
const handleSignIn = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Your auth logic here
  // ...

  return { redirect: "/dashboard", refresh: true };
};
```
