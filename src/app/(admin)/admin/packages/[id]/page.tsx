import { notFound } from "next/navigation";
import { AdminShell } from "@/components/Admin/AdminShell";
import { PackageEditorClient } from "@/components/Admin/PackageEditorClient";
import { getAccessPackageById, getAccessPackages } from "@/app/actions/admin/packages";


export default async function PackageEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [pkg, allPackages] = await Promise.all([
    getAccessPackageById(id),
    getAccessPackages(),
  ]);
  if (!pkg) notFound();

  return (
    <AdminShell>
      <PackageEditorClient pkg={pkg} allPackages={allPackages} />
    </AdminShell>
  );
}
