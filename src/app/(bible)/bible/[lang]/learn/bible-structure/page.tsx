"use client";

import { useParams, usePathname } from "next/navigation";
import { notFound } from "next/navigation";
import { EnWhatIsBiblePage } from "@/components/Bible/Learn/WhatIsBible/en/what-is-bible";
import { VnWhatIsBiblePage } from "@/components/Bible/Learn/WhatIsBible/vn/what-is-bible";

function getLangFromPath(pathname: string | null): "en" | "vi" | null {
  const m = pathname?.match(/^\/bible\/(en|vi)(\/|$)/);
  return (m?.[1] as "en" | "vi") ?? null;
}

export default function BibleStructurePage() {
  const params = useParams();
  const pathname = usePathname();
  const lang = ((params?.lang as string)?.toLowerCase() ?? getLangFromPath(pathname)) ?? "en";

  if (lang === "vi") return <VnWhatIsBiblePage />;
  if (lang === "en") return <EnWhatIsBiblePage />;
  notFound();
}
