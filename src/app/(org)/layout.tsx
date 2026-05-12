import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getAuthenticatedUserId, canAccessOrgPortal } from "@/lib/permissions";
import { NextIntlClientProvider } from "next-intl";
import { cookies } from "next/headers";
import enMessages from "../../../messages/en.json";
import viMessages from "../../../messages/vi.json";
import { NavigationBar } from "@/components/Navigation/navigation-bar";
import { UserProvider } from "@/hooks/user-context";
import { SecondaryNavbarContentProvider } from "@/contexts/SecondaryNavbarContentContext";

/**
 * Org portal layout: guard (membership or super_admin) + Nav + UserProvider.
 * Exception: /org/invites/* is allowed for any authenticated user (invite accept).
 */
export default async function OrgLayout({ children }: { children: React.ReactNode }) {
  const userId = await getAuthenticatedUserId();
  if (!userId) redirect("/waitlist");
  const pathname = (await headers()).get("x-pathname") ?? "";
  const isInviteAccept = pathname.startsWith("/org/invites/");
  if (!isInviteAccept) {
    const canAccess = await canAccessOrgPortal(userId);
    if (!canAccess) redirect("/dashboard");
  }
  const cookieStore = await cookies();
  const raw = cookieStore.get("NEXT_LOCALE")?.value ?? "en";
  const locale = raw === "vi" ? "vi" : "en";
  const messages = locale === "vi" ? viMessages : enMessages;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <UserProvider>
        <SecondaryNavbarContentProvider>
          <NavigationBar />
          {children}
        </SecondaryNavbarContentProvider>
      </UserProvider>
    </NextIntlClientProvider>
  );
}
