/**
 * Bible Flash Cards – standalone layout.
 * No auth provider; cookie-based admin only.
 */
export default function BibleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
