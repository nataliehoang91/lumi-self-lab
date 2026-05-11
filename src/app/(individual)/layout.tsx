import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { NavigationBar } from "@/components/Navigation/navigation-bar";
import { UserProvider } from "@/hooks/user-context";
import { SecondaryNavbarContentProvider } from "@/contexts/SecondaryNavbarContentContext";

/**
 * Personal portal (individual) layout: Nav + UserProvider + next-intl provider.
 * SecondaryNavbarContentProvider lets pages set secondary navbar content via SetSecondaryNavbar.
 * Use IndividualContainer in each page (or section layout) for consistent 7xl, md:px-4, py-6; create uses full width.
 */
export default async function IndividualLayout({ children }: { children: React.ReactNode }) {
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
