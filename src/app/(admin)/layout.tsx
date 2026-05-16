import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyAdminSessionToken, COOKIE_NAME } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  const clerkUserId = token ? verifyAdminSessionToken(token) : null;

  if (!clerkUserId) redirect("/admin/login");

  // Confirm still super_admin in DB
  const user = await prisma.user.findUnique({
    where: { clerkUserId },
    select: { role: true },
  });
  if (user?.role !== "super_admin") redirect("/admin/login");

  return <>{children}</>;
}
