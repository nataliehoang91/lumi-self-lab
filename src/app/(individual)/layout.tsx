import { NavigationBar } from "@/components/Navigation/navigation-bar";
import { UserProvider } from "@/hooks/user-context";
import { SecondaryNavbarContentProvider } from "@/contexts/SecondaryNavbarContentContext";

/**
 * Personal portal (individual) layout: Nav + UserProvider.
 * SecondaryNavbarContentProvider lets pages set secondary navbar content via SetSecondaryNavbar.
 * Use IndividualContainer in each page (or section layout) for consistent 7xl, md:px-4, py-6; create uses full width.
 */
export default function IndividualLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <SecondaryNavbarContentProvider>
        <NavigationBar />
        {children}
      </SecondaryNavbarContentProvider>
    </UserProvider>
  );
}
