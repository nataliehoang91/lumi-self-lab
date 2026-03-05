"use client";

import { BookOpen, BookMarked, Sparkles, BookPlus } from "lucide-react";
import { DailyVerse } from "../shared-components/DailyVerse";
import { LangPageHero } from "../shared-components/LangPageHero";
import { LangPageJourney } from "../shared-components/LangPageJourney";
import { LangPageCtaBanner } from "../shared-components/LangPageCtaBanner";
import { LangPageFooter } from "../shared-components/LangPageFooter";
import type { JourneyItem, NavLink } from "../shared-components/types";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import type { BibleBook } from "@/components/Bible/Read/types";

function buildReadHrefVi(
  bookId: string | null,
  chapter: number,
  verse: number,
  testament: "ot" | "nt"
): string {
  if (!bookId) return "#";
  const sp = new URLSearchParams();
  sp.set("version1", "vi");
  sp.set("sync", "true");
  sp.set("book1", bookId);
  sp.set("chapter1", String(chapter));
  sp.set("testament1", testament);
  sp.set("verse1", String(verse));
  return `/bible/vi/read?${sp.toString()}`;
}

function findBookIdByVi(
  books: BibleBook[] | undefined,
  nameVi: string,
  nameEn?: string
): string | null {
  if (!books?.length) return null;
  const v = nameVi.trim().toLowerCase();
  const byVi = books.find((b) => b.nameVi.trim().toLowerCase() === v);
  if (byVi) return byVi.id;
  if (nameEn) {
    const byEn = books.find((b) => b.nameEn === nameEn);
    if (byEn) return byEn.id;
  }
  return null;
}

const DAILY_VERSES_VN = [
  {
    text: "Lời Chúa là ngọn đèn cho chân tôi, ánh sáng cho đường lối tôi.",
    ref: "Thi thiên 119:105",
    nameVi: "Thi thiên",
    nameEn: "Psalms",
    chapter: 119,
    verse: 105,
    testament: "ot" as const,
  },
  {
    text: "Hãy hết lòng tin cậy Đức Giê-hô-va.",
    ref: "Châm ngôn 3:5",
    nameVi: "Châm ngôn",
    nameEn: "Proverbs",
    chapter: 3,
    verse: 5,
    testament: "ot" as const,
  },
  {
    text: "Tôi làm được mọi sự nhờ Đấng Christ ban thêm sức cho tôi.",
    ref: "Phi-líp 4:13",
    nameVi: "Phi-líp",
    nameEn: "Philippians",
    chapter: 4,
    verse: 13,
    testament: "nt" as const,
  },
];

function getJourneyVn(base: string): JourneyItem[] {
  return [
    {
      step: "01",
      label: "Học",
      headline: "Bắt đầu từ nền tảng.",
      body: "Hiểu Kinh thánh là gì, Chúa Giê-xu là ai và đức tin nghĩa là gì.",
      links: [
        { label: "Cấu trúc Kinh thánh", href: `${base}/learn/bible-structure` },
        { label: "Nguồn gốc Kinh thánh", href: `${base}/learn/bible-origin` },
        { label: "Chúa Giê-xu là ai", href: `${base}/learn/who-is-jesus` },
        { label: "Đức tin là gì", href: `${base}/learn/what-is-faith` },
      ],
      cta: { label: "Tìm hiểu thêm", href: `${base}/learn` },
      icon: BookOpen,
      accent: "coral",
    },
    {
      step: "02",
      label: "Đọc",
      headline: "Đọc Kinh thánh rõ ràng.",
      body: "Xem song song các bản dịch và đọc tập trung.",
      links: [{ label: "Xem đôi", href: `${base}/read` }],
      cta: { label: "Mở Kinh thánh", href: `${base}/read` },
      icon: BookPlus,
      accent: "gray",
    },
    {
      step: "03",
      label: "Ghi nhớ",
      headline: "Hiểu và ghi nhớ.",
      body: "Flashcard và Glossary giúp bạn hiểu thuật ngữ và ghi nhớ câu Kinh thánh.",
      links: [
        { label: "Flashcard", href: `${base}/flashcard` },
        { label: "Glossary", href: `${base}/glossary` },
      ],
      cta: { label: "Mở Flashcard", href: `${base}/flashcard` },
      icon: Sparkles,
      accent: "sage",
    },
  ];
}

function getNavLinksVn(base: string): NavLink[] {
  return [
    { label: "Học", href: `${base}/learn` },
    { label: "Đọc", href: `${base}/read` },
    { label: "Flashcard", href: `${base}/flashcard` },
    { label: "Glossary", href: `${base}/glossary` },
  ];
}

export interface VnBibleLangPageProps {
  lang: string;
  books: BibleBook[];
}

export function VnBibleLangPage({ lang, books }: VnBibleLangPageProps) {
  const base = `/bible/${lang}`;
  const { subBodyClass, verseClass, bodyClass } = useBibleFontClasses();

  const verseIdx = new Date().getDate() % DAILY_VERSES_VN.length;
  const verse = DAILY_VERSES_VN[verseIdx];
  const verseRefHref = buildReadHrefVi(
    findBookIdByVi(books, verse.nameVi, verse.nameEn),
    verse.chapter,
    verse.verse,
    verse.testament
  );
  const journey = getJourneyVn(base);
  const navLinks = getNavLinksVn(base);

  return (
    <div className="bg-body text-foreground min-h-screen font-sans">
      <LangPageHero
        eyebrow="Nơi bình yên để biết Chúa"
        title1="Biết chính mình."
        title2="Biết Kinh Thánh."
        subtitle="Một không gian yên tĩnh để tìm hiểu và đọc Kinh thánh."
        ctaStartLabel="Bắt đầu tại đây"
        ctaBibleLabel="Mở Kinh thánh"
        learnHref={`${base}/learn`}
        readHref={`${base}/read`}
      >
        <div className="relative z-10 mx-auto mt-20 w-full max-w-2xl">
          <DailyVerse
            label="Câu của ngày"
            text={verse.text}
            verseRef={verse.ref}
            verseRefHref={verseRefHref}
            readHref={`${base}/read`}
            readLabel="Đọc trong bối cảnh"
            labelClassName={subBodyClass}
            quoteClassName={verseClass}
            refClassName={bodyClass}
            linkClassName={bodyClass}
          />
        </div>
      </LangPageHero>

      <LangPageJourney
        title="Hành trình của bạn"
        subtitle="Con đường từ câu hỏi đầu tiên đến đức tin sâu nhiệm."
        items={journey}
      />

      <LangPageCtaBanner
        title="Bắt đầu từ một bước nhỏ."
        paragraph="Dù bạn mới bắt đầu hay đã đọc nhiều năm, bạn có thể tiếp tục học và lớn lên từng ngày."
        newLabel="Tôi mới đến"
        bibleLabel="Đưa tôi đến Kinh thánh"
        learnHref={`${base}/learn`}
        readHref={`${base}/read`}
      />

      <LangPageFooter
        tagline="Nơi bình yên để biết Chúa."
        copyright="Kinh thánh cho tâm hồn."
        navLinks={navLinks}
      />
    </div>
  );
}
