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
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
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
        <div className="flex shrink-0 items-center gap-2">
          <Link href="/bible" className="flex shrink-0 items-center gap-3">
            <WhiteBibleLogo />
            <h1 className="hidden truncate text-lg font-semibold 2xl:block">
              ScriptureSpace
            </h1>
          </Link>
          <div className="hidden md:block">
            <BibleReferenceSearch />
          </div>
        </div>
        <LearnReadingProgress />

        {/* Center nav (absolute, xl+) */}
        <BibleNavMenuDesktop />

        {/* Right cluster */}
        <div className="flex shrink-0 items-center gap-1.5">
          {/* md–xl: settings + sheet (search is on left) */}
          <div className="flex items-center gap-1.5 md:flex xl:hidden">
            <BibleNavSettingsDropdown variant="mobile" />
          </div>

          {/* xl+: Study Hub + settings */}
          <div className="hidden items-center gap-1.5 xl:flex">
            <Link
              href={`/bible/${langSegment}/study`}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all",
                isStudy
                  ? "bg-violet-600 text-white shadow-md shadow-violet-500/25"
                  : "border border-violet-200 bg-violet-50 text-violet-700 hover:border-violet-300 hover:bg-violet-100 dark:border-violet-800/50 dark:bg-violet-950/30 dark:text-violet-300 dark:hover:bg-violet-900/40"
              )}
            >
              <GraduationCap className="h-3.5 w-3.5 shrink-0" />
              {intl.t("navStudy")}
            </Link>
            <BibleNavSettingsDropdown variant="desktop" />
          </div>

          {/* xl+: auth — UserButton when signed in, compact buttons when signed out */}
          <div className="hidden items-center gap-1 xl:flex">
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "rounded-xl transition-all hover:scale-105 shadow-sm",
                    userButtonPopoverCard:
                      "rounded-3xl border-border/40 bg-card/80 backdrop-blur-xl",
                    userButtonPopoverActionButton: "rounded-2xl",
                  },
                }}
                userProfileMode="modal"
                afterSignOutUrl="/waitlist"
              />
            </SignedIn>
            <SignedOut>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 rounded-lg px-2.5 text-xs"
                asChild
              >
                <Link href="/sign-in">{intl.t("navSignIn")}</Link>
              </Button>
              <Button
                size="sm"
                className="h-7 rounded-lg px-2.5 text-xs shadow-sm"
                asChild
              >
                <Link href="/sign-up">{intl.t("navSignUp")}</Link>
              </Button>
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
