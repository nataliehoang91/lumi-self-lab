import { Suspense } from "react";
import { ReadLoading } from "@/components/Bible/Read/ReadLoading";

export default function ReadLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<ReadLoading />}>{children}</Suspense>;
}
