"use client";

import { use, useEffect, useState } from "react";
import { ReadProvider, useRead } from "@/components/Bible/Read/context/ReadContext";
import { ReadInsightsContainer } from "@/components/Bible/Read/ReadInsightsContainer";
import { ReadContentContainer, ReadShellContainer } from "./ReadContentContainer";
import { BibleMinimalLoader } from "@/components/Bible/GeneralComponents/minimal-bible-loader";
import type { BibleBook } from "@/components/Bible/Read/types";
import { useReadFocus } from "@/components/Bible/ReadFocusContext";
import { NavigationForm } from "@/components/CoreAdvancedComponent/behaviors/navigation-form";
import { usePathname } from "next/navigation";
import { ReadHeader } from "../ReadHeaderNav/ReadHeader";
import { ReadMain } from "../ReadMain";
import { FullPageBibleLoader } from "../../GeneralComponents/full-page-bible-loader";

function ReadFocusSync() {
  const { focusMode } = useRead();
  const { setReadFocusMode } = useReadFocus();
  useEffect(() => {
    setReadFocusMode(focusMode);
    return () => setReadFocusMode(false);
  }, [focusMode, setReadFocusMode]);
  return null;
}

/**
 * Unwraps the server getBooks() promise with React use() so the read page
 * can stream: shell renders first, then content when books resolve (Suspense).
 * Shows BibleLoader on first enter, then main content after onComplete.
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
  const [entryLoaderDone, setEntryLoaderDone] = useState(false);

  if (!entryLoaderDone) {
    return (
      <FullPageBibleLoader
        onComplete={() => {
          setEntryLoaderDone(true);
        }}
      />
    );
  }

  return (
    <NavigationForm action={pathname} preventReset>
      <ReadProvider initialBooks={initialBooks} initialSearchParams={searchParams}>
        <ReadShellContainer>
          <ReadFocusSync />
          <ReadContentContainer>
            <ReadHeader />
            <ReadMain />
          </ReadContentContainer>
          <ReadInsightsContainer />
        </ReadShellContainer>
      </ReadProvider>
    </NavigationForm>
  );
}
