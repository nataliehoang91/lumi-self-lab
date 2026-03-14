"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/bible-navigation-menu";
import { cn } from "@/lib/utils";
import {
  NAV_MENU_TRIGGER_ACTIVE,
  NAV_MENU_TRIGGER_BASE,
  NAV_MENU_TRIGGER_HOVER,
  NAV_MENU_TRIGGER_INACTIVE,
} from "./constants";
import type { NavLink } from "./types";
import type { BibleIntl } from "@/lib/bible-intl";
import { useBibleNavData } from "./useBibleNavData";

const NAV_TRIGGER_THEME_WARM =
  "theme-warm:hover:bg-second/20 theme-warm:focus:bg-second/20 theme-warm:data-[state=open]:bg-second theme-warm:data-[state=open]:text-second-foreground";

function renderDropdownLinks(
  links: NavLink[],
  intl: BibleIntl,
  firstBold = false
) {
  return links.map((link, index) => (
    <NavigationMenuLink key={link.href} asChild>
      <Link
        href={link.href}
        className={cn(
          "group/item relative flex w-full flex-row items-center justify-start overflow-visible",
          "rounded-lg px-2 py-1.5 text-left text-sm outline-none",
          "text-foreground transition-colors duration-200 hover:bg-transparent active:scale-[0.98]",
          index === 0 && firstBold && "font-semibold",
          link.isActive && "bg-primary-light/20 theme-warm:bg-second/20"
        )}
      >
        {!link.isActive && (
          <span
            className={cn(
              "bg-primary-dark absolute bottom-0 left-0 h-0.5 w-0 rounded-full",
              "theme-warm:group-hover/item:bg-second",
              "transition-[width] duration-200 ease-out group-hover/item:w-full"
            )}
          />
        )}
        <span className="flex min-w-0 items-center gap-2 whitespace-nowrap">
          <span className="whitespace-nowrap">{link.label}</span>
          {link.comingSoon && (
            <span className="text-muted-foreground shrink-0 text-[10px] tracking-wide uppercase">
              {intl.t("navSoon")}
            </span>
          )}
        </span>
      </Link>
    </NavigationMenuLink>
  ));
}

export function BibleNavMenuDesktop() {
  const {
    learnLinks,
    bibleLinks,
    glossaryLinks,
    isLearn,
    isBible,
    isGlossary,
    intl,
  } = useBibleNavData();

  return (
    <div
      className={cn(
        "absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2",
        "items-center justify-center xl:flex"
      )}
    >
      <NavigationMenu viewport={false}>
        <NavigationMenuList className="flex items-center gap-4">
          <NavigationMenuItem>
            <NavigationMenuTrigger
              className={cn(
                NAV_MENU_TRIGGER_BASE,
                NAV_MENU_TRIGGER_HOVER,
                NAV_TRIGGER_THEME_WARM,
                isLearn ? NAV_MENU_TRIGGER_ACTIVE : NAV_MENU_TRIGGER_INACTIVE,
                isLearn && "theme-warm:bg-second! theme-warm:text-second-foreground!"
              )}
              style={
                isLearn
                  ? { backgroundColor: "var(--coral)", color: "var(--coral-foreground)" }
                  : undefined
              }
            >
              {intl.t("langPageNavLearn")}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink asChild>
                <Link
                  href={learnLinks[0].href}
                  className={cn(
                    "group/item text-foreground relative flex w-full flex-row items-center justify-start overflow-visible rounded-lg px-2 py-1.5 text-left text-sm font-semibold whitespace-nowrap transition-colors duration-200 outline-none hover:bg-transparent active:scale-[0.98]",
                    learnLinks[0].isActive && "bg-primary-light/20"
                  )}
                >
                  {!learnLinks[0].isActive && (
                    <span className="bg-primary-dark absolute bottom-0 left-0 h-0.5 w-0 rounded-full transition-[width] duration-200 ease-out group-hover/item:w-full" />
                  )}
                  <span className="whitespace-nowrap">{learnLinks[0].label}</span>
                </Link>
              </NavigationMenuLink>
              <div className="bg-border my-1 h-px" />
              {learnLinks.slice(1).map((link) => (
                <NavigationMenuLink key={link.href} asChild>
                  <Link
                    href={link.href}
                    className={cn(
                      "group/item text-foreground relative flex w-full flex-row items-center justify-start overflow-visible rounded-lg px-2 py-1.5 text-left text-sm whitespace-nowrap transition-colors duration-200 outline-none hover:bg-transparent active:scale-[0.98]",
                      link.isActive && "bg-primary-light/20"
                    )}
                  >
                    {!link.isActive && (
                      <span className="bg-primary-dark absolute bottom-0 left-0 h-0.5 w-0 rounded-full transition-[width] duration-200 ease-out group-hover/item:w-full" />
                    )}
                    <span className="whitespace-nowrap">{link.label}</span>
                  </Link>
                </NavigationMenuLink>
              ))}
            </NavigationMenuContent>
          </NavigationMenuItem>
          <span className="bg-border mx-2 h-4 w-px" aria-hidden />
          <NavigationMenuItem>
            <NavigationMenuTrigger
              className={cn(
                NAV_MENU_TRIGGER_BASE,
                NAV_MENU_TRIGGER_HOVER,
                NAV_TRIGGER_THEME_WARM,
                isBible ? NAV_MENU_TRIGGER_ACTIVE : NAV_MENU_TRIGGER_INACTIVE,
                isBible && "theme-warm:bg-second! theme-warm:text-second-foreground!"
              )}
              style={
                isBible
                  ? { backgroundColor: "var(--coral)", color: "var(--coral-foreground)" }
                  : undefined
              }
            >
              {intl.t("navBible")}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              {renderDropdownLinks(bibleLinks, intl, true)}
            </NavigationMenuContent>
          </NavigationMenuItem>
          <span className="bg-border mx-2 h-4 w-px" aria-hidden />
          <NavigationMenuItem>
            <NavigationMenuTrigger
              className={cn(
                NAV_MENU_TRIGGER_BASE,
                NAV_MENU_TRIGGER_HOVER,
                NAV_TRIGGER_THEME_WARM,
                isGlossary ? NAV_MENU_TRIGGER_ACTIVE : NAV_MENU_TRIGGER_INACTIVE,
                isGlossary && "theme-warm:bg-second! theme-warm:text-second-foreground!"
              )}
              style={
                isGlossary
                  ? { backgroundColor: "var(--coral)", color: "var(--coral-foreground)" }
                  : undefined
              }
            >
              {intl.t("langPageNavGlossary")}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              {renderDropdownLinks(glossaryLinks, intl, true)}
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
