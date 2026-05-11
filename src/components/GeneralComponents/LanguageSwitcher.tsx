"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();

  function toggle() {
    const next = locale === "en" ? "vi" : "en";
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000`;
    router.refresh();
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      className="rounded-2xl px-3 text-xs font-medium tabular-nums"
      aria-label="Switch language"
    >
      {locale === "en" ? "VI" : "EN"}
    </Button>
  );
}
