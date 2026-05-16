import { prisma } from "@/lib/prisma";
import { ALL_FEATURES_OFF } from "@/lib/feature-catalog";

/**
 * Resolve the feature access map for a Clerk user.
 * Priority: direct assignment > org package > default (free) package > all off.
 */
export async function getUserFeatureAccess(clerkUserId: string): Promise<Record<string, boolean>> {
  // 1. Direct user assignment
  const direct = await prisma.userPackageAssignment.findUnique({
    where: { clerkUserId },
    include: { package: true },
  });
  if (direct) return direct.package.features as Record<string, boolean>;

  // 2. Org package (first org membership with a package assigned)
  const orgMembership = await prisma.organisationMember.findFirst({
    where: { clerkUserId },
    include: { organisation: { include: { package: true } } },
  });
  if (orgMembership?.organisation.package) {
    return orgMembership.organisation.package.features as Record<string, boolean>;
  }

  // 3. Default package (isDefault: true)
  const defaultPkg = await prisma.accessPackage.findFirst({ where: { isDefault: true } });
  if (defaultPkg) return defaultPkg.features as Record<string, boolean>;

  // 4. Fallback: all features off
  return ALL_FEATURES_OFF;
}

export async function hasFeature(clerkUserId: string, featureKey: string): Promise<boolean> {
  const features = await getUserFeatureAccess(clerkUserId);
  return features[featureKey] === true;
}

/** Get the package info for a user (name, key) along with their features. */
export async function getUserPackageInfo(clerkUserId: string): Promise<{
  packageName: string;
  packageKey: string;
  source: "direct" | "org" | "default" | "none";
  features: Record<string, boolean>;
} | null> {
  const direct = await prisma.userPackageAssignment.findUnique({
    where: { clerkUserId },
    include: { package: true },
  });
  if (direct) {
    return {
      packageName: direct.package.name,
      packageKey: direct.package.key,
      source: "direct",
      features: direct.package.features as Record<string, boolean>,
    };
  }

  const orgMembership = await prisma.organisationMember.findFirst({
    where: { clerkUserId },
    include: { organisation: { include: { package: true } } },
  });
  if (orgMembership?.organisation.package) {
    return {
      packageName: orgMembership.organisation.package.name,
      packageKey: orgMembership.organisation.package.key,
      source: "org",
      features: orgMembership.organisation.package.features as Record<string, boolean>,
    };
  }

  const defaultPkg = await prisma.accessPackage.findFirst({ where: { isDefault: true } });
  if (defaultPkg) {
    return {
      packageName: defaultPkg.name,
      packageKey: defaultPkg.key,
      source: "default",
      features: defaultPkg.features as Record<string, boolean>,
    };
  }

  return null;
}
