"use client";

import { useEffect, useState } from "react";

interface User {
  id: string;
  clerkUserId: string;
  accountType: "individual" | "organisation";
  upgradedAt: string | null;
  organisations: Array<{
    id: string;
    name: string;
    description: string | null;
    role: string;
    joinedAt: string;
  }>;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("/api/users/me");
        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch user");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  const refreshUser = async () => {
    try {
      const response = await fetch("/api/users/me");
      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }
      const data = await response.json();
      setUser(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch user");
    }
  };

  return { user, loading, error, refreshUser };
}
