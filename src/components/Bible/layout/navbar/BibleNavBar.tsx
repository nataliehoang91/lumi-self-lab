"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import { useReadFocus } from "@/components/Bible/ReadFocusContext";
import { WhiteBibleLogo } from "@/components/Bible/BibleLogo";
import { BibleReferenceSearch } from "@/components/Bible/BibleReferenceSearch";
import { BibleNavMenuDesktop } from "./BibleNavMenuDesktop";
import { BibleNavSettingsDropdown } from "./BibleNavSettingsDropdown";
import { BibleNavMobileSheet } from "./BibleNavMobileSheet";

export function BibleNavBar() {
  const pathname = usePathname();
  const { readFocusMode } = useReadFocus();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isLangLanding = /^\/bible\/(en|vi|zh)$/.test(pathname ?? "");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 right-0 left-0 z-50 w-full transition-all duration-300",
        readFocusMode &&
          "pointer-events-none h-0 overflow-hidden border-transparent opacity-0",
        !readFocusMode && "opacity-100",
        !readFocusMode &&
          (isLangLanding
            ? scrolled
              ? "border-border/60 bg-card/95 border-b shadow-sm"
              : "bg-transparent"
            : "border-border/60 bg-card/95 border-b shadow-sm")
      )}
    >
      <Container
        className="relative flex h-14 w-full items-center justify-between gap-2 px-4 py-3
          sm:px-6"
      >
        <Link href="/bible" className="flex min-w-0 items-center gap-6">
          <WhiteBibleLogo />
          <h1 className="invisible truncate text-lg font-semibold xl:visible">
            ScriptureSpace
          </h1>
        </Link>

        <BibleNavMenuDesktop />

        <div className="flex shrink-0 items-center gap-2">
          {/* Desktop: Search + Settings */}
          <div className="hidden items-center gap-2 md:flex">
            <BibleReferenceSearch />
            <BibleNavSettingsDropdown variant="desktop" />
          </div>

          {/* Mobile: Search + Settings + Sheet trigger */}
          <div className="flex items-center gap-2 md:hidden">
            <div className="max-w-[160px]">
              <BibleReferenceSearch />
            </div>
            <BibleNavSettingsDropdown variant="mobile" />
          </div>

          {/* Mobile nav sheet (Learn, Bible, Glossary) */}
          <div className="xl:hidden">
            <BibleNavMobileSheet open={mobileNavOpen} onOpenChange={setMobileNavOpen} />
          </div>
        </div>
      </Container>
    </nav>
  );
}
