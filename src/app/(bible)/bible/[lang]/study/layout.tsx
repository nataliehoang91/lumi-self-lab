import { StudyFullPageLoader } from "@/components/Bible/GeneralComponents/study-full-page-loader";
import { Suspense } from "react";

export default function StudyLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<StudyFullPageLoader />}>{children}</Suspense>;
}
