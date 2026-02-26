"use client";

import { use } from "react";
import { ReadProvider } from "@/components/Bible/Read";
import { ReadPageContent } from "./ReadPageContent";
import type { BibleBook } from "@/components/Bible/Read/types";
import { NavigationForm } from "@/components/CoreAdvancedComponent/behaviors/navigation-form";
import { usePathname } from "next/navigation";

/**
 * Unwraps the server getBooks() promise with React use() so the read page
 * can stream: shell renders first, then content when books resolve (Suspense).
 * No useEffect needed — provider gets initial data as props.
 */
export function ReadPageShell({
  booksPromise,
  searchParams,
}: {
  booksPromise: Promise<BibleBook[]>;
  searchParams: Record<string, string | undefined>;
}) {
  const initialBooks = use(booksPromise);
  const pathname = usePathname();
  return (
    <NavigationForm action={pathname} preventReset>
      <ReadProvider initialBooks={initialBooks} initialSearchParams={searchParams}>
        <ReadPageContent />
      </ReadProvider>
    </NavigationForm>
  );
}
