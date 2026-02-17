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
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SignUpForm />
    </Suspense>
  );
}
