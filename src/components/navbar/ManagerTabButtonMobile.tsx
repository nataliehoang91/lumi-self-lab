"use client";

import { useUser } from "@/hooks/use-user";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";

interface ManagerTabButtonMobileProps {
  pathname: string;
  onClose: () => void;
}

export function ManagerTabButtonMobile({ pathname, onClose }: ManagerTabButtonMobileProps) {
  const { user, loading } = useUser();

  if (loading) {
    return null;
  }

  if (user?.accountType !== "organisation") {
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
    <Link href="/manager" onClick={onClose}>
      <Button
        variant="ghost"
        className={`w-full justify-start rounded-2xl gap-2 ${
          pathname === "/manager"
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
