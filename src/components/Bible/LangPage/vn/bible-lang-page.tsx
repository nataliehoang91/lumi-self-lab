"use client";

import { BookOpen, BookMarked, Sparkles } from "lucide-react";
import { DailyVerse } from "../shared-components/DailyVerse";
import { LangPageHero } from "../shared-components/LangPageHero";
import { LangPageStats } from "../shared-components/LangPageStats";
import { LangPageJourney } from "../shared-components/LangPageJourney";
import { LangPageCtaBanner } from "../shared-components/LangPageCtaBanner";
import { LangPageFooter } from "../shared-components/LangPageFooter";
import type { JourneyItem, NavLink } from "../shared-components/types";
import type { StatAccent } from "../shared-components/AnimatedStat";
import { useLearnFontClasses } from "@/components/Bible/Learn/useLearnFontClasses";

const DAILY_VERSES_VN = [
  {
    text: "Lời Chúa là ngọn đèn cho chân tôi, ánh sáng cho đường lối tôi.",
    ref: "Thi thiên 119:105",
  },
  { text: "Hãy hết lòng tin cậy Đức Giê-hô-va.", ref: "Châm ngôn 3:5" },
  {
    text: "Tôi làm được mọi sự nhờ Đấng Christ ban thêm sức cho tôi.",
    ref: "Phi-líp 4:13",
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
      cta: { label: "Bắt đầu học", href: `${base}/learn` },
      icon: BookOpen,
      accent: "primary",
    },
    {
      step: "02",
      label: "Đọc",
      headline: "Đọc Kinh thánh rõ ràng.",
      body: "Xem song song các bản dịch và đọc tập trung.",
      links: [{ label: "Xem đôi", href: `${base}/read` }],
      cta: { label: "Mở Kinh thánh", href: `${base}/read` },
      icon: BookMarked,
      accent: "sage",
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
      accent: "coral",
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
}

export function VnBibleLangPage({ lang }: VnBibleLangPageProps) {
  const base = `/bible/${lang}`;
  const { subBodyClass, verseClass, bodyClass } = useLearnFontClasses();

  const verseIdx = new Date().getDate() % DAILY_VERSES_VN.length;
  const verse = DAILY_VERSES_VN[verseIdx];
  const journey = getJourneyVn(base);
  const navLinks = getNavLinksVn(base);

  const stats: { value: string; label: string; accent: StatAccent }[] = [
    { value: "66", label: "Sách", accent: "primary" },
    { value: "1,189", label: "Chương", accent: "second" },
    { value: "3,000+", label: "Ngôn ngữ", accent: "tertiary" },
    { value: "1", label: "Câu chuyện", accent: "sage" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <LangPageHero
        eyebrow="Nơi bình yên để biết Chúa"
        title1="Biết chính mình."
        title2="Biết Kinh thánh."
        subtitle="Một không gian yên tĩnh để học và đọc Kinh thánh."
        ctaStartLabel="Bắt đầu tại đây"
        ctaBibleLabel="Mở Kinh thánh"
        learnHref={`${base}/learn`}
        readHref={`${base}/read`}
      >
        <div className="relative z-10 mt-20 w-full max-w-2xl mx-auto">
          <DailyVerse
            label="Câu của ngày"
            text={verse.text}
            verseRef={verse.ref}
            readHref={`${base}/read`}
            readLabel="Đọc trong bối cảnh"
            labelClassName={subBodyClass}
            quoteClassName={verseClass}
            refClassName={bodyClass}
            linkClassName={bodyClass}
          />
        </div>
      </LangPageHero>

      <LangPageStats stats={stats} />

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
