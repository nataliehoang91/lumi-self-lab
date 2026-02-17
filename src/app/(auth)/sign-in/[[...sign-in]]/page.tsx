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
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
