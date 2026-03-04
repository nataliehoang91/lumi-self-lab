import { Suspense } from "react";
import { SignUpForm } from "./SignUpForm";

/**
 * Sign-Up Page - Server component wraps client form in Suspense
 * so Clerk/request data is inside a boundary (cacheComponents: true).
 */
export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div
            className="border-primary h-8 w-8 animate-spin rounded-full border-2
              border-t-transparent"
          />
        </div>
      }
    >
      <SignUpForm />
    </Suspense>
  );
}
