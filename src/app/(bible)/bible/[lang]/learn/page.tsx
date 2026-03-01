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
  notFound();
}
