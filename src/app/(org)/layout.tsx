import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getAuthenticatedUserId, canAccessOrgPortal } from "@/lib/permissions";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
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
  const locale = await getLocale();
  const messages = await getMessages();

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
