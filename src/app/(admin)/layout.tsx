import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { NavigationBar } from "@/components/Navigation/navigation-bar";
import { UserProvider } from "@/hooks/user-context";
import { SecondaryNavbarContentProvider } from "@/contexts/SecondaryNavbarContentContext";

/**
 * Platform admin portal (Clerk). Placeholder layout.
 * Route group: (admin) — URLs: /admin, /admin/users, /admin/orgs, /admin/billing
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
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
