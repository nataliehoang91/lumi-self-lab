import { notFound } from "next/navigation";
import { AdminShell } from "@/components/Admin/AdminShell";
import { DeepDiveForm } from "@/components/Admin/DeepDiveForm";
import { getDeepDive } from "@/app/actions/admin/deep-dive";

export default async function EditDeepDivePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const entry = await getDeepDive(id);
  if (!entry) notFound();

  return (
    <AdminShell>
      <DeepDiveForm entry={entry} />
    </AdminShell>
  );
}
