import { Suspense } from "react";

export default function ExperimentLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="container mx-auto max-w-4xl px-4 py-8">{children}</div>
    </Suspense>
  );
}
