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
import { useBibleNavData } from "./useBibleNavData";

export function BibleNavBar() {
  const pathname = usePathname();
  const { readFocusMode } = useReadFocus();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { intl } = useBibleNavData();

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
        {/* Left: logo + title (title only visible at 2xl to keep space for center nav) */}
        <Link href="/bible" className="flex shrink-0 items-center gap-3">
          <WhiteBibleLogo />
          <h1 className="hidden truncate text-lg font-semibold 2xl:block">
            ScriptureSpace
          </h1>
        </Link>

        {/* Center nav (absolute, xl+) */}
        <BibleNavMenuDesktop />

        {/* Right cluster */}
        <div className="flex shrink-0 items-center gap-1.5">
          {/* md–xl: compact search + settings + sheet */}
          <div className="flex items-center gap-1.5 md:flex xl:hidden">
            <div className="max-w-[160px] md:max-w-none">
              <BibleReferenceSearch />
            </div>
            <BibleNavSettingsDropdown variant="mobile" />
          </div>

          {/* xl+: search + settings */}
          <div className="hidden items-center gap-1.5 xl:flex">
            <BibleReferenceSearch />
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
