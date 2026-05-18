"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, Users, Building2, LayoutDashboard, CreditCard, BookOpenText } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/deep-dive", label: "Deep Dive", icon: BookOpenText },
  { href: "/admin/packages", label: "Packages", icon: Package },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/orgs", label: "Organisations", icon: Building2 },
  { href: "/admin/billing", label: "Billing", icon: CreditCard },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar */}
      <aside className="hidden w-56 shrink-0 border-r border-border bg-background lg:flex lg:flex-col">
        <div className="border-b border-border px-5 py-4">
          <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground">Admin Portal</p>
          <p className="mt-0.5 text-sm font-semibold text-foreground">lumi · self</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile nav */}
        <div className="flex gap-1 overflow-x-auto border-b border-border bg-background px-4 py-2 lg:hidden">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                  active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Link>
            );
          })}
        </div>
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
