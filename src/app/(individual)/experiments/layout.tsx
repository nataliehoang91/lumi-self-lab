import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { ExperimentsLayoutClient } from "./ExperimentsLayoutClient";

/**
 * Experiments layout: auth guard + ErrorBoundary + Suspense.
 * Unauthenticated users redirect to waitlist.
 */
export default async function ExperimentsLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/waitlist");
  }

  return <ExperimentsLayoutClient>{children}</ExperimentsLayoutClient>;
}
