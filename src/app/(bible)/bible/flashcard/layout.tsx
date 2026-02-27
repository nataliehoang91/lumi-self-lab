import { Suspense } from "react";
import { FlashcardCollectionLoader } from "@/components/Bible/GeneralComponents/flashcard-collection-loader";

export default function FlashcardLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<FlashcardCollectionLoader />}>{children}</Suspense>;
}
