"use client";

import { useUser } from "@/hooks/user-context";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BarChart3, Loader2 } from "lucide-react";

interface ManagerTabButtonMobileProps {
  pathname: string;
  onClose: () => void;
}

export function ManagerTabButtonMobile({ pathname, onClose }: ManagerTabButtonMobileProps) {
  const { userData, loading } = useUser();

  if (loading) {
    return (
      <Button
        variant="ghost"
        className="w-full justify-start rounded-2xl gap-2 text-violet-500"
        disabled
      >
        <Loader2 className="size-4 animate-spin" />
        Loading...
      </Button>
    );
  }

  if (!userData?.hasManagerRole && !userData?.isOrgAdmin) {
    return (
      <Link href="/upgrade" onClick={onClose}>
        <Button
          variant="ghost"
          className="w-full justify-start rounded-2xl gap-2 border-2 border-violet/50 text-violet hover:border-violet hover:bg-violet hover:text-white"
        >
          <BarChart3 className="size-4" />
          Upgrade to Organisation
        </Button>
      </Link>
    );
  }

  return (
    <Link href="/org" onClick={onClose}>
      <Button
        variant="ghost"
        className={`w-full justify-start rounded-2xl gap-2 ${
          pathname === "/org"
            ? "bg-primary text-black hover:bg-secondary hover:text-white"
            : "border-2 border-violet/50 text-violet hover:border-violet hover:bg-violet hover:text-white"
        }`}
      >
        <BarChart3 className="size-4" />
        Manager Dashboard
      </Button>
    </Link>
  );
}
