/**
 * Invisible-admin (root/internal) layout. No Clerk in layout; super-admin
 * sub-routes use DB role guard in their own layout.
 */
export default function InvisibleAdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
