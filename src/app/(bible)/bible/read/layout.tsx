import { Suspense } from "react";
import { FullPageBibleLoader } from "@/components/Bible/GeneralComponents/full-page-bible-loader";

export default function ReadLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<FullPageBibleLoader />}>{children}</Suspense>;
}
