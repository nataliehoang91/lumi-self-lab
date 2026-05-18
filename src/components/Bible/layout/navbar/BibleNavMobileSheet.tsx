"use client";

import Link from "next/link";
import {
  SquareMenu, Play, LayoutGrid, BookMarked, User, Sparkles, Heart,
  BookOpen, Library, Compass, Clock, Layers, MoreHorizontal, List, Newspaper,
  BookOpenText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BibleLogo } from "@/components/Bible/BibleLogo";
import { ThemePaletteSwitch } from "@/components/GeneralComponents/ThemePaletteSwitch";
import { ThemeToggleButtonBibleApp } from "@/components/Bible/theme-toggle-in-bible-app";
import { cn } from "@/lib/utils";
import { useBibleNavData } from "./useBibleNavData";

interface BibleNavMobileSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LEARN_ICONS = [Play, LayoutGrid, BookMarked, User, Sparkles, Heart];
const BIBLE_ICONS = [BookOpen, Library, Compass, Clock];
const GLOSSARY_ICONS = [Layers, MoreHorizontal];

function NavItem({
  href,
  label,
  isActive,
  comingSoon,
  icon: Icon,
  onClose,
}: {
  href: string;
  label: string;
  isActive: boolean;
  comingSoon?: boolean;
  icon?: React.ElementType;
  onClose: () => void;
}) {
  return (
    <li>
      <Link
        href={href}
        onClick={onClose}
        className={cn(
          "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all",
          isActive
            ? "bg-primary/10 text-primary font-semibold"
            : "text-foreground/70 hover:bg-muted hover:text-foreground"
        )}
      >
        {Icon && (
          <Icon
            className={cn(
              "h-4 w-4 shrink-0 transition-colors",
              isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
            )}
          />
        )}
        <span className="flex-1 leading-snug">{label}</span>
        {comingSoon && (
          <span className="rounded-full bg-muted px-2 py-0.5 text-[9px] font-semibold tracking-wider text-muted-foreground uppercase">
            Soon
          </span>
        )}
      </Link>
    </li>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1 px-3 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
      {children}
    </p>
  );
}

export function BibleNavMobileSheet({ open, onOpenChange }: BibleNavMobileSheetProps) {
  const { learnLinks, bibleLinks, glossaryLinks, studyLinks, articlesHref, isArticles, learnLang, intl } = useBibleNavData();
  const close = () => onOpenChange(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="border-primary-dark bg-primary-dark text-primary-foreground hover:bg-primary-dark focus-visible:ring-ring h-8 w-8 rounded-lg shadow-sm hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2"
          aria-label="Open menu"
        >
          <SquareMenu className="h-4 w-4 shrink-0" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex w-full max-w-[min(20rem,85vw)] flex-col border-l p-0 sm:max-w-sm"
      >
        {/* Header */}
        <SheetHeader className="flex flex-row items-center gap-2 border-b px-4 py-3 pr-12">
          <BibleLogo />
          <SheetTitle className="truncate text-left text-base font-semibold">
            {intl.t("navAppName")}
          </SheetTitle>
          <div className="ml-auto flex items-center gap-1">
            <ThemePaletteSwitch />
            <ThemeToggleButtonBibleApp variant="desktop" />
          </div>
        </SheetHeader>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-5">

            {/* Learn */}
            <section>
              <SectionLabel>{intl.t("langPageNavLearn")}</SectionLabel>
              <ul className="space-y-0.5">
                {learnLinks.map((link, i) => (
                  <NavItem
                    key={link.href}
                    {...link}
                    icon={LEARN_ICONS[i]}
                    onClose={close}
                  />
                ))}
              </ul>
            </section>

            <div className="border-t" />

            {/* Bible */}
            <section>
              <SectionLabel>{intl.t("navBible")}</SectionLabel>
              <ul className="space-y-0.5">
                {bibleLinks.map((link, i) => (
                  <NavItem
                    key={link.href}
                    {...link}
                    icon={BIBLE_ICONS[i]}
                    onClose={close}
                  />
                ))}
              </ul>
            </section>

            <div className="border-t" />

            {/* Articles */}
            <section>
              <SectionLabel>{intl.t("langPageNavArticles")}</SectionLabel>
              <ul className="space-y-0.5">
                <NavItem
                  href={articlesHref}
                  label={intl.t("langPageNavArticles")}
                  isActive={isArticles}
                  icon={Newspaper}
                  onClose={close}
                />
              </ul>
            </section>

            <div className="border-t" />

            {/* Glossary */}
            <section>
              <SectionLabel>{intl.t("langPageNavGlossary")}</SectionLabel>
              <ul className="space-y-0.5">
                {glossaryLinks.map((link, i) => (
                  <NavItem
                    key={link.href}
                    {...link}
                    icon={GLOSSARY_ICONS[i]}
                    onClose={close}
                  />
                ))}
              </ul>
            </section>

            <div className="border-t" />

            {/* Study */}
            <section>
              <SectionLabel>{intl.t("navStudy")}</SectionLabel>
              <ul className="space-y-0.5">
                {studyLinks.map((link) => (
                  <NavItem
                    key={link.href}
                    {...link}
                    icon={List}
                    onClose={close}
                  />
                ))}
              </ul>
            </section>

          </div>
        </nav>

        {/* Footer CTA */}
        <div className="border-t p-3">
          <Button
            asChild
            className="bg-primary-dark text-primary-foreground hover:bg-primary-dark w-full hover:opacity-90"
            onClick={close}
          >
            <Link href={`/bible/${learnLang}/study`}>{intl.t("navStudy")}</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
