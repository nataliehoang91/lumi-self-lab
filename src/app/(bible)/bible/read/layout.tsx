import { Suspense } from "react";
import ReadLoading from "./loading";

export default function ReadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<ReadLoading />}>{children}</Suspense>;
}
