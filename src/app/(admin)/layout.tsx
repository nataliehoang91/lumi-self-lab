import { NavigationBar } from "@/components/Navigation/navigation-bar";
import { UserProvider } from "@/hooks/user-context";
import { SecondaryNavbarContentProvider } from "@/contexts/SecondaryNavbarContentContext";

/**
 * Platform admin portal (Clerk). Placeholder layout.
 * Route group: (admin) — URLs: /admin, /admin/users, /admin/orgs, /admin/billing
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <SecondaryNavbarContentProvider>
        <NavigationBar />
        {children}
      </SecondaryNavbarContentProvider>
    </UserProvider>
  );
}
