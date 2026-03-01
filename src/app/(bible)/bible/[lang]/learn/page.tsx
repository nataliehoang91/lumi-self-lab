"use client";

import { useParams, usePathname } from "next/navigation";
import { notFound } from "next/navigation";
import { EnLearnPage } from "@/components/Bible/Learn/LearnPage/en/learn-page";
import { VnLearnPage } from "@/components/Bible/Learn/LearnPage/vn/learn-page";

function getLangFromPath(pathname: string | null): "en" | "vi" | null {
  const m = pathname?.match(/^\/bible\/(en|vi)(\/|$)/);
  return (m?.[1] as "en" | "vi") ?? null;
}

export default function LearnPage() {
  const params = useParams();
  const pathname = usePathname();
  const lang = ((params?.lang as string)?.toLowerCase() ?? getLangFromPath(pathname)) ?? "en";

  if (lang === "vi") return <VnLearnPage />;
  if (lang === "en") return <EnLearnPage />;
  notFound();
}
