"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifyAdminSessionToken, COOKIE_NAME } from "@/lib/admin-auth";
import { SYSTEM_PACKAGE_SEEDS, ALL_FEATURE_KEYS } from "@/lib/feature-catalog";
import type { AccessPackage } from "@prisma/client";

async function requireAdmin(): Promise<string> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  const clerkUserId = token ? verifyAdminSessionToken(token) : null;
  if (!clerkUserId) throw new Error("unauthorized");
  const user = await prisma.user.findUnique({ where: { clerkUserId }, select: { role: true } });
  if (user?.role !== "super_admin") throw new Error("forbidden");
  return clerkUserId;
}

// ── Seed system packages if they don't exist ────────────────────────────────

export async function ensureSystemPackages(): Promise<void> {
  await prisma.accessPackage.createMany({
    data: SYSTEM_PACKAGE_SEEDS.map((seed) => ({
      name: seed.name,
      key: seed.key as string,
      description: seed.description,
      features: seed.features as object,
      isSystem: seed.isSystem,
      isDefault: seed.isDefault,
    })),
    skipDuplicates: true,
  });
}

// ── Package CRUD ──────────────────────────────────────────────────────────────

export async function getAccessPackages(): Promise<(AccessPackage & { _count: { userAssignments: number; organisations: number } })[]> {
  await requireAdmin();
  await ensureSystemPackages();
  return prisma.accessPackage.findMany({
    orderBy: [{ isSystem: "desc" }, { createdAt: "asc" }],
    include: { _count: { select: { userAssignments: true, organisations: true } } },
  });
}

export async function getAccessPackageById(id: string): Promise<AccessPackage | null> {
  await requireAdmin();
  return prisma.accessPackage.findUnique({ where: { id } });
}

export async function createAccessPackage(data: {
  name: string;
  description?: string;
}): Promise<{ ok: true; id: string } | { error: string }> {
  const adminId = await requireAdmin();
  const key = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
  const existing = await prisma.accessPackage.findUnique({ where: { key } });
  if (existing) return { error: "A package with this name already exists" };

  const features = Object.fromEntries(ALL_FEATURE_KEYS.map((k) => [k, false]));
  const pkg = await prisma.accessPackage.create({
    data: { name: data.name.trim(), key, description: data.description?.trim() || null, features },
  });
  revalidatePath("/admin/packages");
  return { ok: true, id: pkg.id };
}

export async function updatePackageFeatures(id: string, features: Record<string, boolean>): Promise<void> {
  await requireAdmin();
  await prisma.accessPackage.update({ where: { id }, data: { features } });
  revalidatePath("/admin/packages");
  revalidatePath(`/admin/packages/${id}`);
}

export async function updatePackageMeta(id: string, data: { name: string; description?: string }): Promise<void> {
  await requireAdmin();
  await prisma.accessPackage.update({
    where: { id },
    data: { name: data.name.trim(), description: data.description?.trim() || null },
  });
  revalidatePath("/admin/packages");
  revalidatePath(`/admin/packages/${id}`);
}

export async function deleteAccessPackage(id: string): Promise<{ ok: true } | { error: string }> {
  await requireAdmin();
  const pkg = await prisma.accessPackage.findUnique({ where: { id } });
  if (!pkg) return { error: "Not found" };
  if (pkg.isSystem) return { error: "System packages cannot be deleted" };
  await prisma.accessPackage.delete({ where: { id } });
  revalidatePath("/admin/packages");
  return { ok: true };
}

// ── User assignment ───────────────────────────────────────────────────────────

export async function assignPackageToUser(clerkUserId: string, packageId: string | null): Promise<void> {
  const adminId = await requireAdmin();
  if (packageId === null) {
    await prisma.userPackageAssignment.deleteMany({ where: { clerkUserId } });
  } else {
    await prisma.userPackageAssignment.upsert({
      where: { clerkUserId },
      update: { packageId, assignedBy: adminId },
      create: { clerkUserId, packageId, assignedBy: adminId },
    });
  }
  revalidatePath("/admin/users");
}

// ── Org assignment ────────────────────────────────────────────────────────────

export async function assignPackageToOrg(orgId: string, packageId: string | null): Promise<void> {
  await requireAdmin();
  await prisma.organisation.update({
    where: { id: orgId },
    data: { packageId },
  });
  revalidatePath("/admin/orgs");
}

// ── Users list (from DB User table) ──────────────────────────────────────────

export async function getAdminUsersList(): Promise<{
  clerkUserId: string;
  email: string | null;
  role: string;
  accountType: string;
  createdAt: Date;
  packageAssignment: { packageId: string; package: { name: string; key: string } } | null;
}[]> {
  await requireAdmin();
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      packageAssignment: { include: { package: { select: { name: true, key: true } } } },
    },
  });
  return users.map((u) => ({
    clerkUserId: u.clerkUserId,
    email: u.email,
    role: u.role,
    accountType: u.accountType,
    createdAt: u.createdAt,
    packageAssignment: u.packageAssignment
      ? { packageId: u.packageAssignment.packageId, package: u.packageAssignment.package }
      : null,
  }));
}

// ── Orgs list ─────────────────────────────────────────────────────────────────

export async function getAdminOrgsList(): Promise<{
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  memberCount: number;
  package: { id: string; name: string; key: string } | null;
}[]> {
  await requireAdmin();
  const orgs = await prisma.organisation.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      package: { select: { id: true, name: true, key: true } },
      _count: { select: { members: true } },
    },
  });
  return orgs.map((o) => ({
    id: o.id,
    name: o.name,
    description: o.description,
    createdAt: o.createdAt,
    memberCount: o._count.members,
    package: o.package,
  }));
}
