import { Suspense } from "react";
import { SignInForm } from "./SignInForm";

/**
 * Sign-In Page - Server component wraps client form in Suspense
 * so useSearchParams is inside a boundary (cacheComponents: true).
 */
export default function SignInPage() {
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
      <SignInForm />
    </Suspense>
  );
}
