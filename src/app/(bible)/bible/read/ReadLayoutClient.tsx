"use client";

import { ReadProvider } from "@/components/Bible/Read";

export function ReadLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ReadProvider>{children}</ReadProvider>;
}
