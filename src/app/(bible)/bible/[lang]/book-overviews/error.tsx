"use client";

import { BibleErrorPage } from "@/components/Bible/GeneralComponents/BibleErrorPage";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <BibleErrorPage error={error} reset={reset} />;
}
