"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { getBibleIntl } from "@/lib/bible-intl";
import { languageToSegment, pathWithLang } from "./constants";
import type { NavLink } from "./types";

export function useBibleNavData() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { globalLanguage, setGlobalLanguage, fontSize, setFontSize } = useBibleApp();
  const intl = getBibleIntl(globalLanguage);

  const isLearn = pathname?.includes("/bible/") && pathname?.includes("/learn");
  const isBible =
    pathname?.includes("/bible/") &&
    (pathname?.includes("/read") ||
      pathname?.includes("/book-overviews") ||
      pathname?.includes("/topics") ||
      pathname?.includes("/topics-timeline"));
  const isGlossary =
    pathname?.includes("/bible/") &&
    (pathname?.includes("/flashcard") || pathname?.includes("/glossary"));

  /** ZH (Chinese) not supported in nav for now – hide language option */
  const showZhLanguage = false;

  const learnLang = globalLanguage === "VI" ? "vi" : "en";
  const langSegment = pathname?.match(/^\/bible\/(en|vi|zh)/)?.[1] ?? learnLang;

  function handleLanguageChange(lang: "EN" | "VI" | "ZH") {
    setGlobalLanguage(lang);
    const segment = languageToSegment(lang);
    const newPath =
      pathname === "/bible" || pathname === "/bible/"
        ? `/bible/${segment}`
        : pathWithLang(pathname, segment);
    if (newPath) {
      const qs = searchParams?.toString();
      router.replace(qs ? `${newPath}?${qs}` : newPath);
    }
  }

  const learnLinks: NavLink[] = [
    { href: `/bible/${learnLang}/learn`, label: intl.t("langPageCtaStart"), isActive: pathname === `/bible/${learnLang}/learn` },
    { href: `/bible/${learnLang}/learn/bible-structure`, label: intl.t("langPageJ1Link1"), isActive: (pathname?.startsWith("/bible/") && pathname?.includes("/learn/bible-structure")) ?? false },
    { href: `/bible/${learnLang}/learn/bible-origin`, label: intl.t("langPageJ1Link2"), isActive: (pathname?.startsWith("/bible/") && pathname?.includes("/learn/bible-origin")) ?? false },
    { href: `/bible/${learnLang}/learn/who-is-jesus`, label: intl.t("langPageJ1Link3"), isActive: (pathname?.startsWith("/bible/") && pathname?.includes("/learn/who-is-jesus")) ?? false },
    { href: `/bible/${learnLang}/learn/what-is-faith`, label: intl.t("langPageJ1Link4"), isActive: (pathname?.startsWith("/bible/") && pathname?.includes("/learn/what-is-faith")) ?? false },
  ];

  const bibleLinks: NavLink[] = [
    { href: `/bible/${langSegment}/read`, label: intl.t("langPageNavRead"), isActive: (pathname?.startsWith("/bible/") && pathname?.includes("/read")) ?? false },
    { href: `/bible/${langSegment}/book-overviews`, label: intl.t("navBookOverviews"), isActive: pathname?.includes("/book-overviews") ?? false },
    { href: `/bible/${langSegment}/topics`, label: intl.t("navTopicsExplorer"), isActive: (pathname?.includes("/topics") && !pathname?.includes("/topics-timeline")) ?? false, comingSoon: true },
    { href: `/bible/${langSegment}/topics-timeline`, label: intl.t("navTopicsTimeline"), isActive: pathname?.includes("/topics-timeline") ?? false, comingSoon: true },
  ];

  const glossaryLinks: NavLink[] = [
    { href: `/bible/${langSegment}/flashcard`, label: intl.t("langPageNavFlashcards"), isActive: (pathname?.startsWith("/bible/") && pathname?.includes("/flashcard")) ?? false },
    { href: `/bible/${langSegment}/glossary/other`, label: intl.t("navOther"), isActive: pathname?.includes("/glossary/other") ?? false, comingSoon: true },
  ];

  return {
    pathname,
    intl,
    learnLang,
    langSegment,
    learnLinks,
    bibleLinks,
    glossaryLinks,
    isLearn,
    isBible,
    isGlossary,
    showZhLanguage,
    handleLanguageChange,
    globalLanguage,
    fontSize,
    setFontSize,
  };
}
