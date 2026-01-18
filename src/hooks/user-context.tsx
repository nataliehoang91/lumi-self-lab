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

// API User type (from /api/users/me)
type APIUser = {
  id: string;
  clerkUserId: string;
  email: string | null;
  accountType: "individual" | "organisation";
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
};

// Transformed user data structure
export type UserData = {
  email: string;
  name: string;
  accountType: "individual" | "organisation";
  hasManagerRole: boolean; // True if team_manager or org_admin in any org
  isOrgAdmin: boolean; // True if org_admin in any org OR accountType === "organisation"
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
  scenario: UserScenario | null; // null = use real API data
  setScenario: (scenario: UserScenario | null) => void;
  userData: UserData | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
};

// Transform API user data to UserData structure
function transformAPIUserToUserData(apiUser: APIUser): UserData {
  // Check if user is org_admin in any org OR has organisation accountType
  const isOrgAdmin =
    apiUser.accountType === "organisation" ||
    apiUser.organisations.some((org) => org.role === "org_admin");

  // Check if user has manager role (team_manager or org_admin)
  const hasManagerRole = apiUser.organisations.some(
    (org) => org.role === "team_manager" || org.role === "org_admin"
  );

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

  return {
    email: apiUser.email || "",
    name: "", // TODO: Get from Clerk user object if needed
    accountType: apiUser.accountType,
    hasManagerRole,
    isOrgAdmin,
    isParticipant: false, // TODO: Check if user has experiments with organisationId
    pendingAssignments: 0, // TODO: Implement actual assignment tracking
    orgs,
    teams,
  };
}

// Mock scenario data (for test scenarios page)
const SCENARIO_DATA: Record<string, UserData> = {
  individual: {
    email: "alex@personal.com",
    name: "Alex Chen",
    accountType: "individual",
    hasManagerRole: false,
    isOrgAdmin: false,
    isParticipant: false,
    pendingAssignments: 0,
    orgs: [],
    teams: [],
  },
  "org-admin": {
    email: "admin@acmecorp.com",
    name: "Sarah Admin",
    accountType: "organisation",
    hasManagerRole: true,
    isOrgAdmin: true,
    isParticipant: false,
    pendingAssignments: 3,
    orgs: [
      { id: "org-1", name: "Acme Corp", role: "org_admin" },
      { id: "org-2", name: "StartupCo", role: "org_admin" },
    ],
    teams: [],
  },
  "team-manager": {
    email: "manager@personal.com",
    name: "Mike Manager",
    accountType: "individual",
    hasManagerRole: true,
    isOrgAdmin: false,
    isParticipant: true,
    pendingAssignments: 1,
    orgs: [
      {
        id: "org-1",
        name: "Acme Corp",
        role: "team_manager",
        teamId: "team-1",
        teamName: "Engineering",
      },
    ],
    teams: [
      {
        id: "team-1",
        name: "Engineering",
        orgId: "org-1",
        orgName: "Acme Corp",
      },
    ],
  },
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [scenario, setScenarioState] = useState<UserScenario | null>(null);
  const [apiUser, setApiUser] = useState<APIUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/users/me");
      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }
      const data = await response.json();
      setApiUser(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch user");
      console.error("Error fetching user:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load scenario from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("userScenario");
    if (
      saved &&
      (saved === "individual" ||
        saved === "team-manager" ||
        saved === "org-admin")
    ) {
      setScenarioState(saved as UserScenario);
      setLoading(false); // Mock data, no loading needed
    } else {
      // Fetch real user data from API
      fetchUser();
    }
  }, [fetchUser]);

  const setScenario = (newScenario: UserScenario | null) => {
    setScenarioState(newScenario);
    if (newScenario) {
      localStorage.setItem("userScenario", newScenario);
    } else {
      localStorage.removeItem("userScenario");
      fetchUser(); // Fetch real data when switching off scenario
    }
  };

  // Compute userData: use scenario mock data if set, otherwise transform API data
  const userData = useMemo<UserData | null>(() => {
    if (scenario) {
      return SCENARIO_DATA[scenario] || null;
    }
    if (apiUser) {
      return transformAPIUserToUserData(apiUser);
    }
    return null;
  }, [scenario, apiUser]);

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
