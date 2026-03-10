"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { BookOverviewsFooter } from "@/components/Bible/BookOverviews/BookOverviewsFooter";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";

/** Format slug for breadcrumb: "1-corinthians" → "1 Corinthians" */
function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

export default function BookOverviewsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { bodyClass } = useBibleFontClasses();
  const parts = pathname?.split("/") ?? [];
  const lang = parts[2] === "vi" ? "vi" : "en";
  const isBookPage =
    pathname?.includes("/book-overviews/") && parts[parts.indexOf("book-overviews") + 1];
  const bookSlug = isBookPage ? parts[parts.indexOf("book-overviews") + 1] : null;

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
              bodyClass,
              lang === "vi" && "font-vietnamese-flashcard"
            )}
          >
            <Link
              href={`/bible/${lang}`}
              className="hover:text-foreground font-medium transition-colors"
            >
              Bible
            </Link>
            <ChevronRight className="h-3 w-3" />
            {!bookSlug ? (
              <span className="text-foreground font-bold">Books & Overview</span>
            ) : (
              <Link
                href={`/bible/${lang}/book-overviews`}
                className="hover:text-foreground font-medium transition-colors"
              >
                Books & Overview
              </Link>
            )}
            {bookSlug && (
              <>
                <ChevronRight className="h-3 w-3" />
                <span className="text-foreground font-bold">{slugToTitle(bookSlug)}</span>
              </>
            )}
          </div>

          {children}

          <div className="my-10" />
          <BookOverviewsFooter />
        </Container>
      </main>
    </div>
  );
}
