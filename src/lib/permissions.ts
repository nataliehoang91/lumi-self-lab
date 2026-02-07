/**
 * Centralized role and permission helpers (Phase 0 + Phase 2).
 * See docs/architecture-snapshot-2025-02-07.md and docs/phase-2-permissions-2025-02-07.md.
 *
 * Roles:
 * - Global: user | super_admin (User.role)
 * - Org-level: member | team_manager | org_admin (OrganisationMember.role)
 *
 * Boundaries:
 * - Personal: own resources only (experiments, check-ins, profile).
 * - Org-scoped: canAccessOrg / canManageOrg / canViewAggregateInsights.
 * - Super-admin: requireSuperAdmin() for global admin.
 */

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { Experiment, OrganisationMember, User } from "@prisma/client";

// ---------------------------------------------------------------------------
// Authentication (all portals)
// ---------------------------------------------------------------------------

/**
 * Returns the current user's Clerk ID if authenticated, null otherwise.
 * Callers must return 401 when null.
 */
export async function getAuthenticatedUserId(): Promise<string | null> {
  const { userId } = await auth();
  return userId;
}

/**
 * Personal: true if the caller is authenticated. Use for APIs that only
 * expose the current user's own data (e.g. GET /api/users/identity). No role check.
 */
export async function canAccessPersonalData(
  clerkUserId: string | null
): Promise<boolean> {
  return !!clerkUserId;
}

// ---------------------------------------------------------------------------
// Personal: experiment ownership (experiments are always user-owned)
// ---------------------------------------------------------------------------

/**
 * Experiments are always owned by clerkUserId. No org or manager role grants
 * access; only the owner may read/update/delete. Use for any experiment
 * or sub-resource (check-ins, fields) access. Same as requireExperimentOwner.
 */
export async function canManageExperiment(
  experimentId: string,
  clerkUserId: string
): Promise<boolean> {
  const experiment = await prisma.experiment.findFirst({
    where: { id: experimentId, clerkUserId },
    select: { id: true },
  });
  return !!experiment;
}

/**
 * Returns the experiment if the user owns it, null otherwise. Use when you
 * need the experiment entity; otherwise use canManageExperiment.
 */
export async function requireExperimentOwner(
  experimentId: string,
  clerkUserId: string
): Promise<Experiment | null> {
  return prisma.experiment.findFirst({
    where: { id: experimentId, clerkUserId },
  });
}

// ---------------------------------------------------------------------------
// Super-admin (global admin)
// ---------------------------------------------------------------------------

/**
 * Returns true if the user has global super_admin role. Use for admin-only
 * API routes and the super-admin portal. Caller must return 403 when false.
 */
export async function requireSuperAdmin(
  clerkUserId: string
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { clerkUserId },
    select: { role: true },
  });
  return user?.role === "super_admin";
}

// ---------------------------------------------------------------------------
// Org-scoped access (Phase 2)
// ---------------------------------------------------------------------------

/**
 * Returns the current user's membership in the given org, if any.
 */
export async function getOrgMembership(
  clerkUserId: string,
  orgId: string
): Promise<OrganisationMember | null> {
  return prisma.organisationMember.findUnique({
    where: {
      organisationId_clerkUserId: { organisationId: orgId, clerkUserId },
    },
  });
}

/**
 * Org: true if the user may access this org (view org context, member list, etc.).
 * Requires: member of org (any role) OR super_admin. Use for org-scoped read APIs.
 */
export async function canAccessOrg(
  clerkUserId: string,
  orgId: string
): Promise<boolean> {
  if (await requireSuperAdmin(clerkUserId)) return true;
  const membership = await getOrgMembership(clerkUserId, orgId);
  return !!membership;
}

/**
 * Org: true if the user may manage this org (templates, experiments, members, settings).
 * Requires: OrganisationMember.role in [team_manager, org_admin] OR super_admin.
 * team_manager is scoped by teamId when that is enforced in future phases.
 */
export async function canManageOrg(
  clerkUserId: string,
  orgId: string
): Promise<boolean> {
  if (await requireSuperAdmin(clerkUserId)) return true;
  const membership = await getOrgMembership(clerkUserId, orgId);
  if (!membership) return false;
  return membership.role === "team_manager" || membership.role === "org_admin";
}

/**
 * Org: true if the user may view aggregate insights for this org.
 * Requires: member of org (any role) OR super_admin. Aggregate only; no per-user data.
 */
export async function canViewAggregateInsights(
  clerkUserId: string,
  orgId: string
): Promise<boolean> {
  return canAccessOrg(clerkUserId, orgId);
}

/**
 * Org: true if the user may access org-admin routes (e.g. /org/[orgId]/admin/*).
 * Requires: OrganisationMember.role === "org_admin" OR super_admin. Stricter than canManageOrg.
 */
export async function canActAsOrgAdmin(
  clerkUserId: string,
  orgId: string
): Promise<boolean> {
  if (await requireSuperAdmin(clerkUserId)) return true;
  const membership = await getOrgMembership(clerkUserId, orgId);
  return membership?.role === "org_admin" ?? false;
}

/**
 * Returns the DB user with role. Use when you need User.role or
 * User.accountType for permission checks.
 */
export async function getDbUser(
  clerkUserId: string
): Promise<(User & { role: string }) | null> {
  const user = await prisma.user.findUnique({
    where: { clerkUserId },
  });
  return user as (User & { role: string }) | null;
}

// ---------------------------------------------------------------------------
// Portal access (Phase 1: auth boundary)
// ---------------------------------------------------------------------------

/**
 * Returns true if the user may access the org portal (manager, organisations,
 * joined-experiments). Access requires at least one org membership OR
 * super_admin role. Used by server layout guards.
 */
export async function canAccessOrgPortal(
  clerkUserId: string
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { clerkUserId },
    select: {
      role: true,
      organisationMemberships: { take: 1, select: { id: true } },
    },
  });
  if (!user) return false;
  if (user.role === "super_admin") return true;
  return user.organisationMemberships.length > 0;
}
