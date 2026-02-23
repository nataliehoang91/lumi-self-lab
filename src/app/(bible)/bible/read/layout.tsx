import { Suspense } from "react";
import ReadLoading from "./loading";
import { ReadLayoutClient } from "./ReadLayoutClient";

export default function ReadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReadLayoutClient>
      <Suspense fallback={<ReadLoading />}>
        {children}
      </Suspense>
    </ReadLayoutClient>
  );
}
