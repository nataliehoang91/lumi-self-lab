import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getTodayUTC } from "@/lib/date-utils";

export type DashboardUserOrg = {
  id: string;
  name: string;
  role: "member" | "team_manager" | "org_admin";
};

export type DashboardUser = {
  email: string;
  name: string;
  isOrgAdmin: boolean;
  hasManagerRole: boolean;
  isParticipant: boolean;
  pendingAssignments: number;
  orgs: DashboardUserOrg[];
  teams: Array<{ id: string; name: string; orgId: string; orgName: string }>;
};

export type DashboardExperiment = {
  id: string;
  title: string;
  status: string;
  durationDays: number;
  startedAt: string | null;
  checkIns: Array<{ checkInDate: string }>;
  _count: { checkIns: number };
};

function formatLastCheckIn(checkInDate: string | undefined): string {
  if (!checkInDate) return "No check-ins yet";
  const dateStr = checkInDate.split("T")[0];
  const today = getTodayUTC();
  const yesterday = new Date();
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];
  if (dateStr === today) return "Today";
  if (dateStr === yesterdayStr) return "Yesterday";
  const days = Math.floor(
    (new Date(today).getTime() - new Date(dateStr).getTime()) / (24 * 60 * 60 * 1000)
  );
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return dateStr;
}

export type DashboardView = "individual" | "participant" | "team-manager" | "org-admin";

export type PersonalStats = {
  activeExperiments: number;
  totalCompleted: number;
  currentStreak: number;
};

export type ActiveExperimentItem = {
  id: string;
  name: string;
  daysActive: number;
  durationDays: number;
  lastCheckIn: string;
  status: "active";
};

export type DashboardUserData = {
  pendingAssignments: number;
  orgs: DashboardUserOrg[];
};

export type DashboardData = {
  view: DashboardView;
  displayName: string;
  personalStats: PersonalStats;
  activeExperiments: ActiveExperimentItem[];
  userData: DashboardUserData | null;
  teamStats: {
    teamName: string;
    memberCount: number;
    activeExperiments: number;
    avgCompletion: number;
    topPerformer: string;
  };
  orgStats: {
    totalOrgs: number;
    totalMembers: number;
    totalExperiments: number;
    avgOrgCompletion: number;
  };
  orgHref: string;
  pendingAssignments: Array<{
    id: string;
    title: string;
    orgName: string;
    dueDate: string;
    status: "pending";
  }>;
};

export type PendingAssignment = DashboardData["pendingAssignments"][number];
export type TeamStats = DashboardData["teamStats"];
export type OrgStats = DashboardData["orgStats"];

export async function getDashboardData(): Promise<DashboardData> {
  const { userId } = await auth();
  if (!userId) {
    redirect("/waitlist");
  }

  const [user, experiments] = await Promise.all([
    prisma.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        organisationMemberships: {
          include: { organisation: true },
        },
        experiments: {
          where: { organisationId: { not: null } },
          select: { id: true },
        },
      },
    }),
    prisma.experiment.findMany({
      where: { clerkUserId: userId },
      include: {
        checkIns: { orderBy: { checkInDate: "desc" }, take: 1 },
        _count: { select: { checkIns: true } },
      },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  if (!user) {
    redirect("/waitlist");
  }

  const role = (user as { role?: string }).role ?? "user";
  const isSuperAdmin = role === "super_admin";
  const orgs = user.organisationMemberships.map((m) => ({
    id: m.organisation.id,
    name: m.organisation.name,
    role: m.role as "member" | "team_manager" | "org_admin",
  }));
  const hasOrgMemberships = orgs.length > 0;
  const hasOrgLinkedExperiments =
    "experiments" in user && Array.isArray(user.experiments) ? user.experiments.length > 0 : false;
  const isParticipant = hasOrgMemberships || hasOrgLinkedExperiments;
  const isOrgAdmin =
    isSuperAdmin || user.accountType === "organisation" || orgs.some((o) => o.role === "org_admin");
  const hasManagerRole =
    isSuperAdmin || orgs.some((o) => o.role === "team_manager" || o.role === "org_admin");
  const teams = user.organisationMemberships
    .filter((m) => m.role === "team_manager" && m.teamId && m.teamName)
    .map((m) => ({
      id: m.teamId!,
      name: m.teamName!,
      orgId: m.organisation.id,
      orgName: m.organisation.name,
    }));

  const email = user.email ?? "";
  const displayName = email ? email.split("@")[0] : "there";

  let view: DashboardView = "individual";
  if (isOrgAdmin) view = "org-admin";
  else if (hasManagerRole) view = "team-manager";
  else if (isParticipant) view = "participant";

  const active = experiments.filter((e) => e.status === "active");
  const completed = experiments.filter((e) => e.status === "completed");
  const personalStats = {
    activeExperiments: active.length,
    totalCompleted: completed.length,
    currentStreak: 0,
  };
  const activeExperiments = active.slice(0, 5).map((exp) => ({
    id: exp.id,
    name: exp.title,
    daysActive: exp._count?.checkIns ?? exp.checkIns?.length ?? 0,
    durationDays: exp.durationDays,
    lastCheckIn: formatLastCheckIn(
      exp.checkIns?.[0]?.checkInDate
        ? new Date(exp.checkIns[0].checkInDate).toISOString().split("T")[0]
        : undefined
    ),
    status: "active" as const,
  }));

  const firstOrgAdmin = orgs.find((o) => o.role === "org_admin");
  const orgHref = firstOrgAdmin ? `/org/${firstOrgAdmin.id}/admin` : "/org";

  return {
    view,
    displayName,
    personalStats,
    activeExperiments,
    userData:
      isParticipant || hasManagerRole || isOrgAdmin ? { pendingAssignments: 0, orgs } : null,
    teamStats: {
      teamName: teams[0]?.name ?? "Team",
      memberCount: 0,
      activeExperiments: 0,
      avgCompletion: 0,
      topPerformer: "-",
    },
    orgStats: {
      totalOrgs: orgs.length,
      totalMembers: 0,
      totalExperiments: 0,
      avgOrgCompletion: 0,
    },
    orgHref,
    pendingAssignments: [],
  };
}
