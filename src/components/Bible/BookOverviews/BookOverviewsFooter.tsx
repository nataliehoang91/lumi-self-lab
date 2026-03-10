"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { getBibleIntl } from "@/lib/bible-intl";
import { cn } from "@/lib/utils";

// 66 book slugs in canonical order (matches BibleBook.order 1–66)
const BOOK_SLUGS_ORDER = [
  "genesis", "exodus", "leviticus", "numbers", "deuteronomy", "joshua", "judges", "ruth",
  "1-samuel", "2-samuel", "1-kings", "2-kings", "1-chronicles", "2-chronicles", "ezra", "nehemiah",
  "esther", "job", "psalms", "proverbs", "ecclesiastes", "song-of-solomon", "isaiah", "jeremiah",
  "lamentations", "ezekiel", "daniel", "hosea", "joel", "amos", "obadiah", "jonah", "micah",
  "nahum", "habakkuk", "zephaniah", "haggai", "zechariah", "malachi", "matthew", "mark", "luke",
  "john", "acts", "romans", "1-corinthians", "2-corinthians", "galatians", "ephesians", "philippians",
  "colossians", "1-thessalonians", "2-thessalonians", "1-timothy", "2-timothy", "titus", "philemon",
  "hebrews", "james", "1-peter", "2-peter", "1-john", "2-john", "3-john", "jude", "revelation",
] as const;

// Display names by order index (0–65), same order as BOOK_SLUGS_ORDER
export const BOOK_NAMES_EN = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth",
  "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah",
  "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah",
  "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah",
  "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi", "Matthew", "Mark", "Luke",
  "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians", "Philippians",
  "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon",
  "Hebrews", "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John", "Jude", "Revelation",
];
export const BOOK_NAMES_VI = [
  "Sáng thế ký", "Xuất Ê-díp-tô ký", "Lê-vi ký", "Dân số ký", "Phục truyền luật lệ ký", "Giô-suê", "Các quan xét", "Ru-tơ",
  "1 Sa-mu-ên", "2 Sa-mu-ên", "1 Các vua", "2 Các vua", "1 Sử ký", "2 Sử ký", "E-xơ-ra", "Nê-hê-mi",
  "Ê-xơ-tê", "Gióp", "Thi thiên", "Châm ngôn", "Truyền đạo", "Nhã ca", "Ê-sai", "Giê-rê-mi",
  "Ai ca", "Ê-xê-chi-ên", "Đa-ni-ên", "Ô-sê", "Giô-ên", "A-mốt", "Áp-đia", "Giô-na", "Mi-chê",
  "Na-hum", "Ha-ba-cúc", "Sô-phô-ni", "A-ghê", "Xa-cha-ri", "Ma-la-chi", "Ma-thi-ơ", "Mác", "Lu-ca",
  "Giăng", "Công vụ", "Rô-ma", "1 Cô-rinh-tô", "2 Cô-rinh-tô", "Ga-la-ti", "Ê-phê-sô", "Phi-líp",
  "Cô-lô-se", "1 Tê-sa-lô-ni-ca", "2 Tê-sa-lô-ni-ca", "1 Ti-mô-thê", "2 Ti-mô-thê", "Tít", "Phi-lê-môn",
  "Hê-bơ-rơ", "Gia-cơ", "1 Phi-e-rơ", "2 Phi-e-rơ", "1 Giăng", "2 Giăng", "3 Giăng", "Giu-đe", "Khải huyền",
];

const FIRST_BOOK_OVERVIEW_LABEL: Record<string, string> = {
  en: "Read Genesis overview",
  vi: "Đọc tổng quan Sáng thế ký",
};

function getBookOverviewSegment(pathname: string | null): { lang: string; bookSlug: string | null } | null {
  if (!pathname?.includes("/book-overviews")) return null;
  const parts = pathname.split("/");
  const langIdx = parts.indexOf("bible") + 1;
  const overviewIdx = parts.indexOf("book-overviews");
  const lang = parts[langIdx] === "vi" ? "vi" : "en";
  const bookSlug = overviewIdx >= 0 && parts[overviewIdx + 1] ? parts[overviewIdx + 1] : null;
  return { lang, bookSlug };
}

export function BookOverviewsFooter() {
  const pathname = usePathname();
  const result = getBookOverviewSegment(pathname);
  const { fontSize } = useBibleApp();
  const intl = getBibleIntl(result?.lang === "vi" ? "VI" : "EN");

  if (!result) return null;
  const { lang, bookSlug } = result;

  const bodyClass =
    fontSize === "small" ? "text-xs" : fontSize === "large" ? "text-base" : "text-sm";
  const contentFont = lang === "vi" ? "font-vietnamese-flashcard" : undefined;

  const indexHref = `/bible/${lang}/book-overviews`;
  const readHref = `/bible/${lang}/read`;

  // Index page: no Previous (first page); Next = first book overview (Genesis)
  if (!bookSlug) {
    const firstBookSlug = BOOK_SLUGS_ORDER[0];
    const firstBookHref = `/bible/${lang}/book-overviews/${firstBookSlug}`;
    const nextLabel = FIRST_BOOK_OVERVIEW_LABEL[lang] ?? FIRST_BOOK_OVERVIEW_LABEL.en;

    return (
      <div
        className={cn(
          "border-sage-dark/20 flex flex-col justify-between gap-4 border-t pt-6",
          "sm:flex-row sm:items-center",
          contentFont
        )}
      >
        <div className="order-1" />
        <Link
          href={firstBookHref}
          className={cn(
            "bg-primary-light dark:bg-primary-dark order-2 flex w-full items-center justify-end gap-2 rounded-xl px-5 py-2.5 font-medium text-black transition-opacity hover:opacity-90 sm:w-auto sm:justify-center sm:ml-auto",
            bodyClass
          )}
        >
          <span className="font-bold">{nextLabel}</span>
          <ArrowRight className="h-3.5 w-3.5 shrink-0" />
        </Link>
      </div>
    );
  }

  // Book page: Back to Book Overviews, Next = next book (or Read Bible if last)
  const currentIndex = BOOK_SLUGS_ORDER.indexOf(bookSlug as (typeof BOOK_SLUGS_ORDER)[number]);
  const isLastBook = currentIndex === BOOK_SLUGS_ORDER.length - 1;
  const prevHref = currentIndex > 0 ? `/bible/${lang}/book-overviews/${BOOK_SLUGS_ORDER[currentIndex - 1]}` : indexHref;
  const nextSlug = !isLastBook && currentIndex >= 0 ? BOOK_SLUGS_ORDER[currentIndex + 1] : null;
  const nextHref = nextSlug ? `/bible/${lang}/book-overviews/${nextSlug}` : readHref;
  const nextBookName = nextSlug && currentIndex >= 0 && currentIndex + 1 < BOOK_NAMES_EN.length
    ? (lang === "vi" ? BOOK_NAMES_VI[currentIndex + 1] : BOOK_NAMES_EN[currentIndex + 1])
    : null;
  const nextLabel = isLastBook
    ? intl.t("learnFooterStartReading")
    : nextBookName
      ? (lang === "vi" ? `Đọc tổng quan ${nextBookName}` : `Read ${nextBookName} overview`)
      : null;

  return (
    <div
      className={cn(
        "border-sage-dark/20 flex flex-col justify-between gap-4 border-t pt-6",
        "sm:flex-row sm:items-center",
        contentFont
      )}
    >
      <div className="order-1 flex flex-wrap items-center gap-3">
        <Link
          href={currentIndex > 0 ? prevHref : indexHref}
          className={cn(
            "text-foreground hover:text-foreground flex items-center gap-1.5 transition-colors",
            bodyClass
          )}
        >
          <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
          {currentIndex > 0 ? (
            <>
              {intl.t("learnStructurePrevious")}: <span className="font-semibold">Previous book</span>
            </>
          ) : (
            <>
              {intl.t("learnStructurePrevious")}: <span className="font-semibold">Books & Overview</span>
            </>
          )}
        </Link>
      </div>
      <Link
        href={nextHref}
        className={cn(
          "bg-primary-light dark:bg-primary-dark order-2 flex w-full items-center justify-end gap-2 rounded-xl px-5 py-2.5 font-medium text-black transition-opacity hover:opacity-90 sm:w-auto sm:justify-center",
          bodyClass
        )}
      >
        {nextLabel ? (
          <span className="font-bold">{nextLabel}</span>
        ) : null}
        <ArrowRight className="h-3.5 w-3.5 shrink-0" />
      </Link>
    </div>
  );
}
