import { Suspense } from "react";

export default function ExperimentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">{children}</div>
    </Suspense>
  );
}
