"use client";
import type { DashboardData } from "@/lib/dashboard-data";
import { DashboardIndividualHeader } from "./DashboardIndividualHeader";
import { DashboardTipCard } from "./DashboardTipCard";
import { DashboardYourExperiments } from "./DashboardYourExperiments";
import { DashboardStartNewCard } from "./DashboardStartNewCard";
import { DashboardStatsGrid } from "./DashboardStatsGrid";
import { DashboardParticipantView } from "./DashboardParticipantView";
import { DashboardTeamManagerView } from "./DashboardTeamManagerView";
import { DashboardOrgAdminView } from "./DashboardOrgAdminView";

type Props = {
  data: DashboardData;
};

export function IndividualDashboard({ data }: Props) {
  const {
    view,
    displayName,
    personalStats,
    activeExperiments,
    userData,
    teamStats,
    orgStats,
    orgHref,
    pendingAssignments,
  } = data;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {view === "individual" && (
          <div className="space-y-8">
            <DashboardIndividualHeader displayName={displayName} personalStats={personalStats} />
            {activeExperiments.length > 0 && <DashboardTipCard />}
            <DashboardYourExperiments experiments={activeExperiments} />
            <DashboardStartNewCard />
            <DashboardStatsGrid personalStats={personalStats} />
          </div>
        )}

        {view === "participant" && userData && (
          <DashboardParticipantView
            displayName={displayName}
            personalStats={personalStats}
            userData={userData}
            pendingAssignments={pendingAssignments}
          />
        )}

        {view === "team-manager" && userData && (
          <DashboardTeamManagerView
            displayName={displayName}
            personalStats={personalStats}
            teamStats={teamStats}
            userData={userData}
            orgHref={orgHref}
          />
        )}

        {view === "org-admin" && userData && (
          <DashboardOrgAdminView
            displayName={displayName}
            orgStats={orgStats}
            userData={userData}
          />
        )}
      </div>
    </div>
  );
}
