import type { ReactNode } from "react";
import { redirect } from "next/navigation";

const SUPPORTED_LOCALES = ["en", "vi", "zh"] as const;
export type BibleLocale = (typeof SUPPORTED_LOCALES)[number];

export function isBibleLocale(lang: string): lang is BibleLocale {
  return SUPPORTED_LOCALES.includes(lang as BibleLocale);
}

/** Pre-render all locale routes so /bible/vi/read, /bible/en/read etc. work (Next.js i18n). */
export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }));
}

export default async function BibleLangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const normalized = lang?.toLowerCase();
  if (!normalized || !isBibleLocale(normalized)) {
    redirect("/bible/en");
  }
  return <>{children}</>;
}
