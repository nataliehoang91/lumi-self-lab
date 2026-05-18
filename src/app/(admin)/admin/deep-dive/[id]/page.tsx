import { notFound } from "next/navigation";
import { AdminShell } from "@/components/Admin/AdminShell";
import { DeepDiveForm } from "@/components/Admin/DeepDiveForm";
import { getDeepDivePair } from "@/app/actions/admin/deep-dive";
import { prisma } from "@/lib/prisma";

export default async function EditDeepDivePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // id here is actually a slug (we route by slug for the dual-language form)
  // Try to find by id first, then use its slug to load the pair
  const entry = await prisma.bibleDeepDive.findUnique({ where: { id } });
  if (!entry) notFound();

  const pair = await getDeepDivePair(entry.slug);

  return (
    <AdminShell>
      <DeepDiveForm slug={entry.slug} en={pair.en} vi={pair.vi} />
    </AdminShell>
  );
}
