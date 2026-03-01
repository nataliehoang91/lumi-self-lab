"use client";

import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { EnWhatIsBiblePage } from "@/components/Bible/Learn/WhatIsBible/en/what-is-bible";
import { VnWhatIsBiblePage } from "@/components/Bible/Learn/WhatIsBible/vn/what-is-bible";

export default function BibleStructurePage() {
  const params = useParams();
  const lang = (params?.lang as string)?.toLowerCase();

  if (lang === "vi") return <VnWhatIsBiblePage />;
  if (lang === "en") return <EnWhatIsBiblePage />;
  notFound();
}
