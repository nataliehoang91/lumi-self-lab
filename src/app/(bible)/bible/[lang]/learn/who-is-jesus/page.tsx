"use client";

import { useParams, usePathname } from "next/navigation";
import { notFound } from "next/navigation";
import { EnWhoIsJesus } from "@/components/Bible/Learn/WhoIsJesus/en/who-is-jesus";
import { VnWhoIsJesus } from "@/components/Bible/Learn/WhoIsJesus/vn/who-is-jesus";

function getLangFromPath(pathname: string | null): "en" | "vi" | null {
  const m = pathname?.match(/^\/bible\/(en|vi)(\/|$)/);
  return (m?.[1] as "en" | "vi") ?? null;
}

export default function WhoIsJesusPage() {
  const params = useParams();
  const pathname = usePathname();
  const lang = ((params?.lang as string)?.toLowerCase() ?? getLangFromPath(pathname)) ?? "en";

  if (lang === "vi") return <VnWhoIsJesus />;
  if (lang === "en") return <EnWhoIsJesus />;
  notFound();
}
