"use client";

import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { EnWhoIsJesus } from "@/components/Bible/Learn/WhoIsJesus/en/who-is-jesus";
import { VnWhoIsJesus } from "@/components/Bible/Learn/WhoIsJesus/vn/who-is-jesus";

export default function WhoIsJesusPage() {
  const params = useParams();
  const lang = (params?.lang as string)?.toLowerCase();

  if (lang === "vi") return <VnWhoIsJesus />;
  if (lang === "en") return <EnWhoIsJesus />;
  if (lang !== undefined) notFound();
  return <EnWhoIsJesus />;
}
