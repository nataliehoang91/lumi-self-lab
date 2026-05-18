import Link from "next/link";
import { Package, Users, Building2, CreditCard, ArrowRight, BookOpenText } from "lucide-react";
import { AdminShell } from "@/components/Admin/AdminShell";
import { getAccessPackages } from "@/app/actions/admin/packages";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [packages, userCount, orgCount, deepDiveCount] = await Promise.all([
    getAccessPackages(),
    prisma.user.count(),
    prisma.organisation.count(),
    prisma.bibleDeepDive.count({ where: { isPublished: true } }),
  ]);

  const stats = [
    { label: "Deep Dive Articles", value: deepDiveCount, href: "/admin/deep-dive", icon: BookOpenText, color: "text-orange-500" },
    { label: "Packages", value: packages.length, href: "/admin/packages", icon: Package, color: "text-violet-600" },
    { label: "Users", value: userCount, href: "/admin/users", icon: Users, color: "text-blue-600" },
    { label: "Organisations", value: orgCount, href: "/admin/orgs", icon: Building2, color: "text-emerald-600" },
  ];

  return (
    <AdminShell>
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground">Admin</p>
        <h1 className="mt-1 text-2xl font-semibold text-foreground">Overview</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, href, icon: Icon, color }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col gap-4 rounded-2xl border border-border bg-background p-5 transition-all hover:border-primary/30 hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <Icon className={`h-5 w-5 ${color}`} />
              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{value}</p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Access Packages</h2>
          <Link href="/admin/packages" className="text-xs text-primary hover:underline">View all →</Link>
        </div>
        <div className="space-y-2">
          {packages.map((pkg) => (
            <div key={pkg.id} className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3">
              <div className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full ${pkg.key === "testing" ? "bg-amber-400" : pkg.key === "premium" ? "bg-emerald-400" : "bg-blue-400"}`} />
                <span className="text-sm font-medium text-foreground">{pkg.name}</span>
                {pkg.isSystem && <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">System</span>}
                {pkg.isDefault && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">Default</span>}
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{pkg._count.userAssignments} users · {pkg._count.organisations} orgs</span>
                <Link href={`/admin/packages/${pkg.id}`} className="text-primary hover:underline">Edit</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
