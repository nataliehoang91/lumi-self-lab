"use client";

import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { EnLearnPage } from "@/components/Bible/Learn/LearnPage/en/learn-page";
import { VnLearnPage } from "@/components/Bible/Learn/LearnPage/vn/learn-page";

export default function LearnPage() {
  const params = useParams();
  const lang = (params?.lang as string)?.toLowerCase();

  if (lang === "vi") return <VnLearnPage />;
  if (lang === "en") return <EnLearnPage />;
  // Avoid 404 during client-side lang switch (params can be briefly undefined)
  if (lang !== undefined) notFound();
  return <EnLearnPage />;
}
