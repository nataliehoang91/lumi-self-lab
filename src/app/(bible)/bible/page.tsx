import { redirect } from "next/navigation";
import { headers } from "next/headers";

const DEFAULT_LOCALE = "en";

/** Prefer vi if Accept-Language suggests Vietnamese; else zh; else en. */
async function getLocaleFromHeaders(): Promise<"en" | "vi" | "zh"> {
  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language") ?? "";
  const lower = acceptLanguage.toLowerCase();
  if (lower.includes("vi")) return "vi";
  if (lower.includes("zh")) return "zh";
  return DEFAULT_LOCALE;
}

export default async function BiblePage() {
  const locale = await getLocaleFromHeaders();
  redirect(`/bible/${locale}`);
}
