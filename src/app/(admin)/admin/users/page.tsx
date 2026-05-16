import { AdminShell } from "@/components/Admin/AdminShell";
import { UsersClient } from "@/components/Admin/UsersClient";
import { getAdminUsersList, getAccessPackages } from "@/app/actions/admin/packages";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const [users, packages] = await Promise.all([
    getAdminUsersList(),
    getAccessPackages(),
  ]);

  return (
    <AdminShell>
      <UsersClient users={users} packages={packages} />
    </AdminShell>
  );
}
