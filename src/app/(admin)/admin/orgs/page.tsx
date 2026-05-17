import { AdminShell } from "@/components/Admin/AdminShell";
import { OrgsClient } from "@/components/Admin/OrgsClient";
import { getAdminOrgsList, getAccessPackages } from "@/app/actions/admin/packages";


export default async function AdminOrgsPage() {
  const [orgs, packages] = await Promise.all([
    getAdminOrgsList(),
    getAccessPackages(),
  ]);

  return (
    <AdminShell>
      <OrgsClient orgs={orgs} packages={packages} />
    </AdminShell>
  );
}
