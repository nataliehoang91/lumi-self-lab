"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  verifyAdminPassword,
  createAdminSessionToken,
  COOKIE_NAME,
  COOKIE_MAX_AGE,
} from "@/lib/admin-auth";

export async function adminLogin(
  email: string,
  password: string
): Promise<{ ok: true } | { error: string }> {
  const user = await prisma.user.findFirst({
    where: { email: email.trim().toLowerCase() },
    select: { clerkUserId: true, role: true, adminPassword: true },
  });

  if (!user || user.role !== "super_admin") {
    return { error: "Invalid credentials" };
  }

  if (!user.adminPassword) {
    return { error: "Admin password not set. Contact system administrator." };
  }

  const valid = await verifyAdminPassword(password, user.adminPassword);
  if (!valid) return { error: "Invalid credentials" };

  const token = createAdminSessionToken(user.clerkUserId);
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/admin",
  });

  return { ok: true };
}

export async function adminLogout(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}
