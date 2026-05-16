import { AdminShell } from "@/components/Admin/AdminShell";
import { PackagesClient } from "@/components/Admin/PackagesClient";
import { getAccessPackages } from "@/app/actions/admin/packages";

export const dynamic = "force-dynamic";

export default async function PackagesPage() {
  const packages = await getAccessPackages();
  return (
    <AdminShell>
      <PackagesClient packages={packages} />
    </AdminShell>
  );
}
