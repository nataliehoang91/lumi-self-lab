"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import {
  BookOverviewsFooter,
  BOOK_NAMES_EN,
  BOOK_NAMES_VI,
} from "@/components/Bible/BookOverviews/BookOverviewsFooter";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import { GeneralErrorFallback } from "@/components/GeneralErrorFallback";
import { SimpleLoader } from "@/components/Bible/GeneralComponents/simple-loader";

/** Format slug for breadcrumb: "1-corinthians" → "1 Corinthians" */
function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

/** Map URL slug (based on English name) to localized book name using fixed arrays. */
function getBookNameFromSlug(slug: string, lang: "en" | "vi"): string {
  const normalized = slug.replace(/-/g, " ").toLowerCase();

  const index = BOOK_NAMES_EN.findIndex((name) => {
    const key = name.toLowerCase().replace(/\s+/g, " ");
    return key === normalized;
  });

  if (index === -1) {
    // Fallback so we never break the breadcrumb.
    return slugToTitle(slug);
  }

  return lang === "vi" ? BOOK_NAMES_VI[index] : BOOK_NAMES_EN[index];
}

export default function BookOverviewsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { subBodyClassUp } = useBibleFontClasses();
  const parts = pathname?.split("/") ?? [];
  const lang = parts[2] === "vi" ? "vi" : "en";
  const isBookPage =
    pathname?.includes("/book-overviews/") && parts[parts.indexOf("book-overviews") + 1];
  const bookSlug = isBookPage ? parts[parts.indexOf("book-overviews") + 1] : null;

  const bookTitle =
    bookSlug != null ? getBookNameFromSlug(bookSlug, lang === "vi" ? "vi" : "en") : null;

  return (
    <div className="bg-read min-h-screen font-sans dark:bg-[#050408]">
      <main>
        <Container
          maxWidth="7xl"
          className={cn("px-4 py-16", lang === "vi" && "font-vietnamese-flashcard")}
        >
          {/* Breadcrumb — same as learn layout */}
          <div
            className={cn(
              "text-muted-foreground mb-8 flex items-center gap-2",
              subBodyClassUp,
              lang === "vi" && "font-vietnamese-flashcard"
            )}
          >
            <Link
              href={`/bible/${lang}`}
              className="hover:text-foreground font-medium transition-colors"
            >
              {lang === "vi" ? "Kinh Thánh" : "Bible"}
            </Link>
            <ChevronRight className="h-3 w-3" />
            {!bookSlug ? (
              <span className="text-foreground font-bold">
                {lang === "vi" ? "Sách & Giới thiệu" : "Books & Overview"}
              </span>
            ) : (
              <Link
                href={`/bible/${lang}/book-overviews`}
                className="hover:text-foreground font-medium transition-colors"
              >
                {lang === "vi" ? "Sách & Giới thiệu" : "Books & Overview"}
              </Link>
            )}
            {bookSlug && (
              <>
                <ChevronRight className="h-3 w-3" />
                <span className="text-foreground font-bold">{bookTitle}</span>
              </>
            )}
          </div>

          <ErrorBoundary
            fallbackRender={(props) => (
              <GeneralErrorFallback
                {...props}
                defaultDescription="We couldn't load Books & Overview. Please try again or go back to the Bible page."
                homeUrl="/bible"
              />
            )}
          >
            <Suspense fallback={<SimpleLoader />}>{children}</Suspense>
          </ErrorBoundary>

          <div className="my-10" />
          <BookOverviewsFooter />
        </Container>
      </main>
    </div>
  );
}
