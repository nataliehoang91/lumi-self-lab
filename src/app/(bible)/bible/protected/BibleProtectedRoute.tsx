import type { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";
import { BibleProtectedRedirect } from "./BibleProtectedRedirect";

interface Props {
  children: ReactNode;
}

export async function BibleProtectedRoute({ children }: Props) {
  const { userId } = await auth();

  if (!userId) {
    return <BibleProtectedRedirect />;
  }

  return <>{children}</>;
}
