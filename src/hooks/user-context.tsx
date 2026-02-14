"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useMemo,
} from "react";

export type UserScenario = "individual" | "team-manager" | "org-admin" | null;

// API User type (from /api/users/identity)
type APIUser = {
  id: string;
  clerkUserId: string;
  email: string | null;
  accountType: "individual" | "organisation";
  role?: string; // user | super_admin (global admin; distinct from org_admin)
  upgradedAt: string | null;
  organisations: Array<{
    id: string;
    name: string;
    description: string | null;
    role: string; // "member" | "team_manager" | "org_admin"
    teamId?: string; // Optional: for team_manager role
    teamName?: string; // Optional: for team_manager role
    joinedAt: string;
  }>;
  isParticipant?: boolean; // True if has org memberships or org-linked experiments
};

// Transformed user data structure
export type UserData = {
  email: string;
  name: string;
  accountType: "individual" | "organisation";
  hasManagerRole: boolean; // True if team_manager or org_admin in any org
  isOrgAdmin: boolean; // True if org_admin in any org OR accountType === "organisation"
  isSuperAdmin: boolean; // True if User.role === "super_admin" (global admin; distinct from org_admin)
  isUpgraded: boolean; // True if upgradedAt set OR super_admin (full access)
  isParticipant: boolean; // True if has experiments linked to orgs (derived from experiments count)
  pendingAssignments: number; // TODO: Implement actual assignment tracking
  orgs: Array<{
    id: string;
    name: string;
    role: "member" | "team_manager" | "org_admin";
    teamId?: string;
    teamName?: string;
  }>;
  teams: Array<{
    id: string;
    name: string;
    orgId: string;
    orgName: string;
  }>;
};

export type UserContextType = {
  scenario: UserScenario | null; // Only for test scenarios page, doesn't affect userData
  setScenario: (scenario: UserScenario | null) => void;
  userData: UserData | null; // Always based on real database accountType
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
};

// Transform API user data to UserData structure
function transformAPIUserToUserData(apiUser: APIUser): UserData {
  // Global admin: full access to everything (manager, org admin, upgraded)
  const isSuperAdmin = apiUser.role === "super_admin";

  // Check if user is org_admin in any org OR has organisation accountType (or super_admin)
  const isOrgAdmin =
    isSuperAdmin ||
    apiUser.accountType === "organisation" ||
    apiUser.organisations.some((org) => org.role === "org_admin");

  // Check if user has manager role (team_manager or org_admin) (or super_admin)
  const hasManagerRole =
    isSuperAdmin ||
    apiUser.organisations.some((org) => org.role === "team_manager" || org.role === "org_admin");

  // Upgraded: has upgradedAt OR super_admin (auto full access)
  const isUpgraded = !!apiUser.upgradedAt || isSuperAdmin;

  // Build orgs array with proper typing
  const orgs = apiUser.organisations.map((org) => ({
    id: org.id,
    name: org.name,
    role: org.role as "member" | "team_manager" | "org_admin",
    teamId: org.teamId,
    teamName: org.teamName,
  }));

  // Build teams array (extracted from orgs where role is team_manager)
  const teams = apiUser.organisations
    .filter((org) => org.role === "team_manager" && org.teamId && org.teamName)
    .map((org) => ({
      id: org.teamId!,
      name: org.teamName!,
      orgId: org.id,
      orgName: org.name,
    }));

  // User is a participant if they have org memberships OR org-linked experiments
  const isParticipant = apiUser.isParticipant ?? apiUser.organisations.length > 0;

  const email = apiUser.email || "";
  const displayName = email ? email.split("@")[0] : "there";

  return {
    email,
    name: displayName,
    accountType: apiUser.accountType,
    hasManagerRole,
    isOrgAdmin,
    isSuperAdmin,
    isUpgraded,
    isParticipant, // Based on org memberships or org-linked experiments from API
    pendingAssignments: 0, // TODO: Implement actual assignment tracking
    orgs,
    teams,
  };
}

// Note: Scenario functionality is kept for test scenarios page compatibility
// but userData always comes from real database based on accountType

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [scenario, setScenarioState] = useState<UserScenario | null>(null);
  const [apiUser, setApiUser] = useState<APIUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/users/identity", {
        cache: "no-store",
        credentials: "same-origin",
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const message = (data?.error ?? data?.details) || "Failed to fetch user";
        throw new Error(typeof message === "string" ? message : "Failed to fetch user");
      }
      setApiUser(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch user");
      console.error("Error fetching user:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Always fetch real user data from database on mount
  useEffect(() => {
    if (!apiUser) {
      fetchUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only run once on mount

  const setScenario = (newScenario: UserScenario | null) => {
    // Scenario is only for test scenarios page, doesn't affect userData
    setScenarioState(newScenario);
    if (newScenario) {
      localStorage.setItem("userScenario", newScenario);
    } else {
      localStorage.removeItem("userScenario");
    }
  };

  // Compute userData: always use real API data based on accountType from database
  const userData = useMemo<UserData | null>(() => {
    if (apiUser) {
      return transformAPIUserToUserData(apiUser);
    }
    return null;
  }, [apiUser]);

  // Debug: log super_admin status when user data is available
  useEffect(() => {
    if (userData) {
      const isSuperAdmin = userData.isSuperAdmin;
      console.log(
        "[UserContext] super_admin:",
        isSuperAdmin,
        "| email:",
        userData.email,
        "| role from API:",
        apiUser?.role
      );
    }
  }, [userData, apiUser?.role]);

  return (
    <UserContext.Provider
      value={{
        scenario,
        setScenario,
        userData,
        loading,
        error,
        refreshUser: fetchUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
