import { NextIntlClientProvider } from "next-intl";
import { cookies } from "next/headers";
import { NavigationBar } from "@/components/Navigation/navigation-bar";
import { UserProvider } from "@/hooks/user-context";
import { SecondaryNavbarContentProvider } from "@/contexts/SecondaryNavbarContentContext";
import enMessages from "../../../messages/en.json";
import viMessages from "../../../messages/vi.json";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
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
