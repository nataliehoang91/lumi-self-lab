import { Suspense } from "react";

export default function ExperimentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8 max-w-4xl">{children}</div>
      </div>
    </Suspense>
  );
}
