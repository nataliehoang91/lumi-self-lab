/** Shared nav menu trigger classes so Learn, Bible, Glossary match (outline, px, hover, etc.) */
export const NAV_MENU_TRIGGER_BASE =
  "h-auto rounded-lg border-0 px-2 py-1 text-sm font-medium shadow-none outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";
export const NAV_MENU_TRIGGER_HOVER = "hover:bg-coral/20 focus:bg-coral/20";
export const NAV_MENU_TRIGGER_ACTIVE =
  "bg-[var(--coral)] text-[var(--coral-foreground)] data-[state=open]:bg-[var(--coral)] data-[state=open]:text-[var(--coral-foreground)]";
export const NAV_MENU_TRIGGER_INACTIVE = "bg-transparent text-foreground";

/** Route segment for /bible/[lang]/... */
export function languageToSegment(lang: "EN" | "VI" | "ZH"): "en" | "vi" | "zh" {
  if (lang === "VI") return "vi";
  if (lang === "ZH") return "zh";
  return "en";
}

/** If pathname is /bible/{en|vi|zh}/..., return path with new lang segment; else null. */
export function pathWithLang(
  pathname: string | null,
  newSegment: "en" | "vi" | "zh"
): string | null {
  if (!pathname?.startsWith("/bible/")) return null;
  const match = pathname.match(/^\/bible\/(en|vi|zh)(\/.*)?$/);
  if (!match) return null;
  return `/bible/${newSegment}${match[2] ?? ""}`;
}
