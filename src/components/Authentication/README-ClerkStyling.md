# Clerk Authentication - Styling Guide

## Using Clerk's Built-in Components vs Custom Forms

### Option 1: Custom Forms with InteractiveForm (Current Approach) ✅

We're using **Clerk hooks** (`useSignIn`, `useSignUp`) with our **InteractiveForm** components. This gives us:

- ✅ Full control over UI/UX
- ✅ Use our existing form components (FormField, InputControl, FormMessage)
- ✅ Consistent design system
- ✅ Better integration with our validation and error handling

**Example:**
```tsx
import { useSignIn } from "@clerk/nextjs";
import { InteractiveForm, SubmitButton, FormField } from "@/components/CoreAdvancedComponent";

export default function SignInPage() {
  const { signIn, setActive } = useSignIn();
  
  const handleSignIn = async (formData: FormData) => {
    const result = await signIn.create({
      identifier: formData.get("email"),
      password: formData.get("password"),
    });
    // ... handle result
  };

  return (
    <InteractiveForm action={handleSignIn}>
      <FormField name="email">...</FormField>
    </InteractiveForm>
  );
}
```

### Option 2: Clerk's Built-in Components (Alternative)

Clerk provides `<SignIn />`, `<SignUp />`, and `<UserButton />` components that can be customized with the `appearance` prop.

**Example with Custom Styling:**
```tsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <SignIn
      appearance={{
        elements: {
          // Apply Tailwind classes directly
          formButtonPrimary: "w-full text-lg py-6 rounded-2xl shadow-lg",
          formFieldInput: "h-12 rounded-2xl bg-background/50",
          card: "bg-card/90 backdrop-blur-sm rounded-3xl",
          // ... more customizations
        },
        variables: {
          colorPrimary: "hsl(var(--primary))",
          borderRadius: "1.25rem",
        },
      }}
    />
  );
}
```

**Available CSS Classes for Customization:**

- `rootBox` - Root container
- `card` - Main card container
- `headerTitle` - Title text
- `headerSubtitle` - Subtitle text
- `formButtonPrimary` - Primary button
- `formButtonSecondary` - Secondary button
- `formFieldInput` - Input fields
- `formFieldLabel` - Label text
- `footerActionLink` - Links in footer
- `dividerLine` - Divider lines
- `dividerText` - Divider text
- And many more... See [Clerk's Appearance API docs](https://clerk.com/docs/customization/overview)

**When to Use Each Approach:**

| Custom Forms (Current) | Clerk Built-in Components |
|----------------------|-------------------------|
| ✅ Full design control | ⚠️ Limited customization |
| ✅ Use your form components | ⚠️ Must use Clerk's structure |
| ✅ Better TypeScript support | ⚠️ Less type safety |
| ⚠️ More code to maintain | ✅ Quick setup |
| ✅ Consistent with app patterns | ⚠️ May not match app design |

## Current Implementation

All auth pages (`/sign-in`, `/sign-up`, `/forgot-password`) use:
- Clerk hooks (`useSignIn`, `useSignUp`) for authentication logic
- `InteractiveForm` from `@/components/CoreAdvancedComponent` for form handling
- Custom UI components matching the app's design system
- Proper error handling and validation

This approach provides the best balance of control, consistency, and maintainability.
