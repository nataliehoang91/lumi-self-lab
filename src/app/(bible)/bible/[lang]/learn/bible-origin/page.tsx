"use client";

import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { EnBibleOriginPage } from "@/components/Bible/Learn/BibleOrigin/en/bible-origin";
import { VnBibleOriginPage } from "@/components/Bible/Learn/BibleOrigin/vn/bible-origin";

export default function BibleOriginPage() {
  const params = useParams();
  const lang = (params?.lang as string)?.toLowerCase();

  if (lang === "vi") return <VnBibleOriginPage />;
  if (lang === "en") return <EnBibleOriginPage />;
  if (lang !== undefined) notFound();
  return <EnBibleOriginPage />;
}
