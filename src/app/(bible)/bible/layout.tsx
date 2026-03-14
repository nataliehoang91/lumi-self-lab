import type { ReactNode } from "react";
import { BibleLayoutClient } from "@/components/Bible/layout/BibleLayoutClient";

export default function BibleLayout({ children }: { children: ReactNode }) {
  return <BibleLayoutClient>{children}</BibleLayoutClient>;
}
