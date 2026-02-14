import { NavigationBar } from "@/components/Navigation/navigation-bar";
import { UserProvider } from "@/hooks/user-context";

/**
 * Personal portal (individual) layout: Nav + UserProvider.
 * Middleware enforces auth; no portal guard (any authenticated user can access).
 */
export default function IndividualLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <NavigationBar />
      {children}
    </UserProvider>
  );
}
