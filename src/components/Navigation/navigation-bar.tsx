"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X, BarChart3, Building2, Crown, Loader2, Shield } from "lucide-react";
import { Logo } from "@/components/GeneralComponents/Logo";
import { ThemeToggle } from "@/components/GeneralComponents/ThemeToggle";
import { cn } from "@/lib/utils";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useUser } from "@/hooks/user-context";
import { useSecondaryNavbarContentValue } from "@/contexts/SecondaryNavbarContentContext";

// Shared class constants (active = bg primary, hover border second; inactive = border second, hover border primary; border-1)
const BASE_DESKTOP = "rounded-3xl transition-all hover:scale-105 gap-2";
const BASE_MOBILE = "w-full justify-start rounded-2xl gap-2";
const ACTIVE_DESKTOP = "bg-primary-dark text-white hover:border hover:border-second";
const ACTIVE_MOBILE = "bg-primary-dark text-white";
const INACTIVE_DESKTOP = "border border-second text-foreground hover:border-primary";
const INACTIVE_UPGRADE_DESKTOP = "border border-second text-amber-600 hover:border-primary";
const INACTIVE_UPGRADE_MOBILE = "text-amber-600";
const INACTIVE_MANAGER_DESKTOP = "border border-second/50 text-second hover:border-primary";
const INACTIVE_MANAGER_MOBILE = "text-second";
const BADGE_CLASS =
  "ml-1 size-5 p-0 flex items-center justify-center rounded-full bg-red-500 text-white text-xs";

function DashboardButton({
  pathname,
  variant,
  onClick,
}: {
  pathname: string;
  variant: "desktop" | "mobile";
  onClick?: () => void;
}) {
  const isActive = pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  const isDesktop = variant === "desktop";

  return (
    <Link href="/dashboard" onClick={onClick}>
      <Button
        variant="ghost"
        className={cn(
          isDesktop ? BASE_DESKTOP : BASE_MOBILE,
          isActive && isDesktop && ACTIVE_DESKTOP,
          isActive && !isDesktop && ACTIVE_MOBILE,
          !isActive && isDesktop && INACTIVE_DESKTOP
        )}
      >
        Dashboard
      </Button>
    </Link>
  );
}

function ExperimentsButton({
  pathname,
  variant,
  onClick,
}: {
  pathname: string;
  variant: "desktop" | "mobile";
  onClick?: () => void;
}) {
  const isActive = pathname === "/experiments" || pathname.startsWith("/experiments/");
  const isDesktop = variant === "desktop";

  return (
    <Link href="/experiments" onClick={onClick}>
      <Button
        variant="ghost"
        className={cn(
          isDesktop ? BASE_DESKTOP : BASE_MOBILE,
          isActive && isDesktop && ACTIVE_DESKTOP,
          isActive && !isDesktop && ACTIVE_MOBILE,
          !isActive && isDesktop && INACTIVE_DESKTOP
        )}
      >
        Experiments
      </Button>
    </Link>
  );
}

function JoinedExperimentsButton({
  pathname,
  variant,
  badge,
  onClick,
}: {
  pathname: string;
  variant: "desktop" | "mobile";
  badge?: number;
  onClick?: () => void;
}) {
  const isActive = pathname === "/org" || pathname.startsWith("/org/");
  const isDesktop = variant === "desktop";

  return (
    <Link href="/org" onClick={onClick}>
      <Button
        variant="ghost"
        className={cn(
          isDesktop ? BASE_DESKTOP : BASE_MOBILE,
          isActive && isDesktop && ACTIVE_DESKTOP,
          isActive && !isDesktop && ACTIVE_MOBILE,
          !isActive && isDesktop && INACTIVE_DESKTOP
        )}
      >
        <Building2 className="size-4" />
        Joined Experiments
        {badge != null && badge > 0 && <Badge className={BADGE_CLASS}>{badge}</Badge>}
      </Button>
    </Link>
  );
}

function OrganisationsButton({
  pathname,
  variant,
  onClick,
}: {
  pathname: string;
  variant: "desktop" | "mobile";
  onClick?: () => void;
}) {
  const isActive = pathname === "/org" || pathname.startsWith("/org/");
  const isDesktop = variant === "desktop";

  return (
    <Link href="/org" onClick={onClick}>
      <Button
        variant="ghost"
        className={cn(
          isDesktop ? BASE_DESKTOP : BASE_MOBILE,
          isActive && isDesktop && ACTIVE_DESKTOP,
          isActive && !isDesktop && ACTIVE_MOBILE,
          !isActive && isDesktop && INACTIVE_DESKTOP
        )}
      >
        <Building2 className="size-4" />
        Organisations
      </Button>
    </Link>
  );
}

function UpgradeButton({
  pathname,
  variant,
  onClick,
}: {
  pathname: string;
  variant: "desktop" | "mobile";
  onClick?: () => void;
}) {
  const isActive = pathname === "/upgrade" || pathname.startsWith("/upgrade/");
  const isDesktop = variant === "desktop";

  return (
    <Link href="/upgrade" onClick={onClick}>
      <Button
        variant="ghost"
        className={cn(
          isDesktop ? BASE_DESKTOP : BASE_MOBILE,
          isActive && isDesktop && ACTIVE_DESKTOP,
          isActive && !isDesktop && ACTIVE_MOBILE,
          !isActive && isDesktop && INACTIVE_UPGRADE_DESKTOP,
          !isActive && !isDesktop && INACTIVE_UPGRADE_MOBILE
        )}
      >
        <Crown className="size-4" />
        Upgrade
      </Button>
    </Link>
  );
}

function ManagerButton({
  pathname,
  variant,
  onClick,
}: {
  pathname: string;
  variant: "desktop" | "mobile";
  onClick?: () => void;
}) {
  const isActive = pathname === "/org" || pathname.startsWith("/org/");
  const isDesktop = variant === "desktop";

  return (
    <Link href="/org" onClick={onClick}>
      <Button
        variant="ghost"
        className={cn(
          isDesktop ? BASE_DESKTOP : BASE_MOBILE,
          isActive && isDesktop && ACTIVE_DESKTOP,
          isActive && !isDesktop && ACTIVE_MOBILE,
          !isActive && isDesktop && INACTIVE_MANAGER_DESKTOP,
          !isActive && !isDesktop && INACTIVE_MANAGER_MOBILE
        )}
      >
        <BarChart3 className="size-4" />
        Manager
      </Button>
    </Link>
  );
}

function SuperAdminButton({
  pathname,
  variant,
  onClick,
}: {
  pathname: string;
  variant: "desktop" | "mobile";
  onClick?: () => void;
}) {
  const isActive = pathname === "/super-admin" || pathname.startsWith("/super-admin/");
  const isDesktop = variant === "desktop";

  const activeViolet = "bg-violet-500 text-white";
  const activeVioletHover = "hover:bg-violet-600";
  const inactiveVioletDesktop =
    "border border-violet-500/50 text-violet-600 dark:text-violet-400 hover:border-violet-500 hover:bg-violet-500 hover:text-white";
  const inactiveVioletMobile = "text-violet-600 dark:text-violet-400";

  return (
    <Link href="/super-admin" onClick={onClick}>
      <Button
        variant="ghost"
        className={cn(
          isDesktop ? BASE_DESKTOP : BASE_MOBILE,
          isActive && activeViolet,
          isActive && isDesktop && activeVioletHover,
          !isActive && isDesktop && inactiveVioletDesktop,
          !isActive && !isDesktop && inactiveVioletMobile
        )}
      >
        <Shield className="size-4" />
        Super Admin
      </Button>
    </Link>
  );
}

function SignInButton({
  onClick,
  variant = "desktop",
}: {
  onClick?: () => void;
  variant?: "desktop" | "mobile";
}) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "rounded-2xl transition-all hover:scale-105",
        variant === "mobile" && "w-full justify-start"
      )}
      asChild
    >
      <Link href="/sign-in" onClick={onClick}>
        Sign In
      </Link>
    </Button>
  );
}

function SignUpButton({
  onClick,
  variant = "desktop",
}: {
  onClick?: () => void;
  variant?: "desktop" | "mobile";
}) {
  return (
    <Button
      className={cn(
        "rounded-2xl transition-all hover:scale-105",
        variant === "mobile" && "w-full justify-start"
      )}
      asChild
    >
      <Link href="/sign-up" onClick={onClick}>
        Sign Up
      </Link>
    </Button>
  );
}

function MobileMenuButton({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-2xl md:hidden"
      onClick={onClick}
      aria-label="Toggle menu"
    >
      {open ? <X className="size-5" /> : <Menu className="size-5" />}
    </Button>
  );
}

const LOADING_DESKTOP =
  "flex items-center gap-2 rounded-3xl border border-border/50 bg-muted/30 px-4 py-2";
const LOADING_MOBILE =
  "flex items-center gap-2 rounded-2xl border border-border/50 bg-muted/30 px-4 py-3";
const LOADING_SPINNER = "size-5 animate-spin text-muted-foreground";
const LOADING_TEXT = "text-sm text-muted-foreground";

/**
 * Navigation bar component with Clerk integration.
 *
 * Features:
 * - Clerk UserButton for authenticated users
 * - Sign in/Sign up buttons for unauthenticated users
 * - Theme toggle (light/dark mode)
 * - Responsive mobile menu
 * - Navigation links for protected routes
 */
export function NavigationBar() {
  const pathname = usePathname();
  const { userData, loading: userLoading } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const secondaryContent = useSecondaryNavbarContentValue();

  const hideNavbar =
    pathname === "/" ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/waitlist");

  if (hideNavbar) {
    return null;
  }

  const showNavLinks = !userLoading;
  const showManager =
    userData?.accountType === "organisation" || userData?.isParticipant || userData?.hasManagerRole;
  const closeMobile = () => setMobileMenuOpen(false);

  const showJoinedExperiments =
    userData?.accountType === "individual" || userData?.accountType === "organisation";
  const showUpgrade =
    userData?.accountType === "individual" && !userData?.isUpgraded && !userData?.isSuperAdmin;
  const showOrganisations = userData?.isOrgAdmin === true;
  const pendingAssignments = userData?.pendingAssignments ?? 0;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-card backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between shrink-0">
          <Logo
            href="/dashboard"
            width={32}
            height={32}
            className="transition-transform hover:scale-105"
          />

          <div className="hidden items-center gap-3 md:flex">
            {!showNavLinks ? (
              <div className={LOADING_DESKTOP}>
                <Loader2 className={LOADING_SPINNER} />
                <span className={LOADING_TEXT}>Loading…</span>
              </div>
            ) : (
              <>
                <DashboardButton pathname={pathname} variant="desktop" />
                <ExperimentsButton pathname={pathname} variant="desktop" />
                {showJoinedExperiments && (
                  <JoinedExperimentsButton
                    pathname={pathname}
                    variant="desktop"
                    badge={pendingAssignments > 0 ? pendingAssignments : undefined}
                  />
                )}
                {showUpgrade && <UpgradeButton pathname={pathname} variant="desktop" />}
                {showOrganisations && <OrganisationsButton pathname={pathname} variant="desktop" />}
                {showManager && <ManagerButton pathname={pathname} variant="desktop" />}
                {userData?.isSuperAdmin && (
                  <SuperAdminButton pathname={pathname} variant="desktop" />
                )}
              </>
            )}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggle variant="desktop" />
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "rounded-2xl transition-all hover:scale-105",
                    userButtonPopoverCard:
                      "rounded-3xl border-border/40 bg-card/80 backdrop-blur-xl",
                    userButtonPopoverActionButton: "rounded-2xl",
                    userButtonPopoverActionButtonText: "text-sm",
                  },
                }}
                userProfileMode="modal"
                afterSignOutUrl="/waitlist"
              />
            </SignedIn>
            <SignedOut>
              <div className="flex items-center gap-2">
                <SignInButton />
                <SignUpButton />
              </div>
            </SignedOut>
          </div>

          <MobileMenuButton
            open={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          />
        </div>
      </div>

      {secondaryContent && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="overflow-hidden border-t border-border/40 bg-card/80 backdrop-blur-sm [&>*]:!mb-0"
        >
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">{secondaryContent}</div>
        </motion.div>
      )}

      {mobileMenuOpen && (
        <div className="border-t border-border/40 bg-background/95 backdrop-blur-xl md:hidden">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {!showNavLinks ? (
              <div className={LOADING_MOBILE}>
                <Loader2 className={LOADING_SPINNER} />
                <span className={LOADING_TEXT}>Loading…</span>
              </div>
            ) : (
              <>
                <DashboardButton pathname={pathname} variant="mobile" onClick={closeMobile} />
                <ExperimentsButton pathname={pathname} variant="mobile" onClick={closeMobile} />
                {showJoinedExperiments && (
                  <JoinedExperimentsButton
                    pathname={pathname}
                    variant="mobile"
                    badge={pendingAssignments > 0 ? pendingAssignments : undefined}
                    onClick={closeMobile}
                  />
                )}
                {showUpgrade && (
                  <UpgradeButton pathname={pathname} variant="mobile" onClick={closeMobile} />
                )}
                {showOrganisations && (
                  <OrganisationsButton pathname={pathname} variant="mobile" onClick={closeMobile} />
                )}
                {showManager && (
                  <ManagerButton pathname={pathname} variant="mobile" onClick={closeMobile} />
                )}
                {userData?.isSuperAdmin && (
                  <SuperAdminButton pathname={pathname} variant="mobile" onClick={closeMobile} />
                )}
              </>
            )}

            <div className="flex items-center gap-2 pt-2">
              <ThemeToggle variant="mobile" />
            </div>

            <div className="border-t border-border/40 pt-2">
              <SignedIn>
                <div className="px-2 py-2">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "rounded-2xl",
                        userButtonPopoverCard:
                          "rounded-3xl border-border/40 bg-card/80 backdrop-blur-xl",
                      },
                    }}
                    userProfileMode="modal"
                    afterSignOutUrl="/waitlist"
                  />
                </div>
              </SignedIn>
              <SignedOut>
                <SignInButton variant="mobile" onClick={closeMobile} />
                <SignUpButton variant="mobile" onClick={closeMobile} />
              </SignedOut>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
