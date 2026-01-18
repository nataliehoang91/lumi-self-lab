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
        className="rounded-3xl transition-all hover:scale-105 gap-2 text-violet-500"
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
          className="rounded-3xl transition-all hover:scale-105 gap-2 border-2 border-violet/50 text-violet hover:border-violet hover:bg-violet/10 hover:text-violet"
        >
          <BarChart3 className="size-4" />
          Upgrade
        </Button>
      </Link>
    );
  }

  // Show Manager tab for users with manager role
  return (
    <Link href="/manager">
      <Button
        variant="ghost"
        className={`rounded-3xl transition-all hover:scale-105 gap-2 ${
          pathname === "/manager"
            ? "bg-primary text-black hover:bg-secondary hover:text-white"
            : "border-2 border-violet/50 text-violet hover:border-violet hover:bg-violet/10 hover:text-violet"
        }`}
      >
        <BarChart3 className="size-4" />
        Manager
      </Button>
    </Link>
  );
}
