"use client";

import { useUser } from "@/hooks/user-context";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BarChart3, Loader2 } from "lucide-react";

interface ManagerTabButtonProps {
  pathname: string;
}

export function ManagerTabButton({ pathname }: ManagerTabButtonProps) {
  const { userData, loading } = useUser();

  // Show loading state
  if (loading) {
    return (
      <Button
        variant="ghost"
        className="gap-2 rounded-3xl text-violet-500 transition-all hover:scale-105"
        disabled
      >
        <Loader2 className="h-8 w-8 animate-spin" />
      </Button>
    );
  }

  // Only show if user has manager role or org admin
  if (!userData?.hasManagerRole && !userData?.isOrgAdmin) {
    return (
      <Link href="/upgrade">
        <Button
          variant="ghost"
          className="border-violet/50 text-violet hover:border-violet hover:bg-violet/10
            hover:text-violet gap-2 rounded-3xl border-2 transition-all hover:scale-105"
        >
          <BarChart3 className="size-4" />
          Upgrade
        </Button>
      </Link>
    );
  }

  // Show Manager tab for users with manager role
  return (
    <Link href="/org">
      <Button
        variant="ghost"
        className={`gap-2 rounded-3xl transition-all hover:scale-105 ${
          pathname === "/org"
            ? "bg-primary hover:bg-second text-black hover:text-white"
            : `border-violet/50 text-violet hover:border-violet hover:bg-violet/10
              hover:text-violet border-2`
          }`}
      >
        <BarChart3 className="size-4" />
        Manager
      </Button>
    </Link>
  );
}
