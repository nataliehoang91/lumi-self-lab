import type { Metadata } from "next";
import { headers } from "next/headers";
import { BibleLocaleRedirect } from "@/components/Bible/BibleLocaleRedirect";

const DEFAULT_LOCALE = "en" as const;

export const metadata: Metadata = {
  title: "Scripture·Space",
  description:
    "A quiet place to learn and read Scripture. Explore the Bible at your own pace.",
};

/** Prefer vi if Accept-Language suggests Vietnamese; else zh; else en. */
async function getLocaleFromHeaders(): Promise<"en" | "vi" | "zh"> {
  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language") ?? "";
  const lower = acceptLanguage.toLowerCase();
  if (lower.includes("vi")) return "vi";
  if (lower.includes("zh")) return "zh";
  return DEFAULT_LOCALE;
}

/**
 * Root /bible: no params. Client redirect uses localStorage locale if set, else server locale from headers.
 */
export default async function BiblePage() {
  const serverLocale = await getLocaleFromHeaders();
  return <BibleLocaleRedirect fallbackLocale={serverLocale} />;
}
