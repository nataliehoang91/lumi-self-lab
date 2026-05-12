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
      <div className="px-4 py-8">
        {view === "individual" && (
          <>
            {/* Header spans full width */}
            <DashboardIndividualHeader
              displayName={displayName}
              personalStats={personalStats}
            />

            {/* Two-column layout on lg+, single column on mobile */}
            <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
              {/* Main column — experiments list */}
              <div className="min-w-0 flex-1 space-y-6">
                <DashboardYourExperiments experiments={activeExperiments} />
              </div>

              {/* Sidebar — stats + actions */}
              <div className="w-full shrink-0 space-y-4 lg:w-80 xl:w-96">
                <DashboardStatsGrid personalStats={personalStats} />
                <DashboardStartNewCard />
                {activeExperiments.length > 0 && <DashboardTipCard />}
              </div>
            </div>
          </>
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

