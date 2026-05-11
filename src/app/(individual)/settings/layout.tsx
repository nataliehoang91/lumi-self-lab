import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export default async function SettingsLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/waitlist");
  return <>{children}</>;
}
