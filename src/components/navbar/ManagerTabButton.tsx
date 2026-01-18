"use client";

import { useUser } from "@/hooks/use-user";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";

interface ManagerTabButtonProps {
  pathname: string;
}

export function ManagerTabButton({ pathname }: ManagerTabButtonProps) {
  const { user, loading } = useUser();

  // Show loading state or nothing while loading
  if (loading) {
    return null;
  }

  // Only show if user has organisation account
  if (user?.accountType !== "organisation") {
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

  // Show Manager tab for organisation accounts
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
