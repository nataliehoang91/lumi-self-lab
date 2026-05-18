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
import { BibleNavMobileSheet } from "./BibleNavMobileSheet";
import { BibleNavProfileDropdown } from "./BibleNavProfileDropdown";
import { BibleNavGuestDropdown } from "./BibleNavGuestDropdown";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { GraduationCap } from "lucide-react";
import { useBibleNavData } from "./useBibleNavData";
import { LearnReadingProgress } from "@/components/Bible/Learn/shared-components/LearnReadingProgress";

export function BibleNavBar() {
  const pathname = usePathname();
  const { readFocusMode } = useReadFocus();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { intl, isStudy, langSegment } = useBibleNavData();

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
        {/* Left: logo + search */}
        <div className="flex shrink-0 items-center gap-5">
          <Link href="/bible" className="flex shrink-0 items-center gap-3">
            <div className="origin-left scale-[1.35] transform-gpu">
              <WhiteBibleLogo />
            </div>
          </Link>
          <div className="hidden md:block ml-4">
            <BibleReferenceSearch />
          </div>
        </div>
        <LearnReadingProgress />

        {/* Center nav (absolute, xl+) */}
        <BibleNavMenuDesktop />

        {/* Right cluster */}
        <div className="flex shrink-0 items-center gap-1.5">
          {/* xl+: Study Hub + profile/guest dropdown */}
          <div className="hidden items-center gap-3 xl:flex">
            <Link
              href={`/bible/${langSegment}/study`}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all",
                isStudy
                  ? "bg-second text-white shadow-sm"
                  : "border border-second/40 bg-second/10 text-second hover:border-second/60 hover:bg-second/20"
              )}
            >
              <GraduationCap className="h-3.5 w-3.5 shrink-0" />
              {intl.t("navStudy")}
            </Link>
            <SignedIn>
              <BibleNavProfileDropdown />
            </SignedIn>
            <SignedOut>
              <BibleNavGuestDropdown />
            </SignedOut>
          </div>

          {/* Mobile nav sheet (< xl) */}
          <div className="xl:hidden">
            <BibleNavMobileSheet open={mobileNavOpen} onOpenChange={setMobileNavOpen} />
          </div>
        </div>
      </Container>
    </nav>
  );
}
