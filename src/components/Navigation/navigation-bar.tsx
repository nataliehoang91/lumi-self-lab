"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X, BarChart3, Building2, Crown, Loader2, Shield, Bell } from "lucide-react";
import { Logo } from "@/components/GeneralComponents/Logo";
import { ThemeToggle } from "@/components/GeneralComponents/ThemeToggle";
import { ThemePaletteSwitch } from "@/components/GeneralComponents/ThemePaletteSwitch";
import { cn } from "@/lib/utils";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useUser } from "@/hooks/user-context";
import { useSecondaryNavbarContentValue } from "@/contexts/SecondaryNavbarContentContext";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/GeneralComponents/LanguageSwitcher";

// Shared class constants (active = bg primary, hover border second; inactive = border second, hover border primary; border-1)
const BASE_DESKTOP = "rounded-3xl transition-all hover:scale-105 gap-2";
const BASE_MOBILE = "w-full justify-start rounded-2xl gap-2";
const ACTIVE_DESKTOP = "bg-primary-dark text-white hover:border hover:border-second";
const ACTIVE_MOBILE = "bg-primary-dark text-white";
const INACTIVE_DESKTOP = "border border-second text-foreground hover:border-primary";
const INACTIVE_UPGRADE_DESKTOP =
  "border border-second text-amber-600 hover:border-primary";
const INACTIVE_UPGRADE_MOBILE = "text-amber-600";
const INACTIVE_MANAGER_DESKTOP =
  "border border-second/50 text-second hover:border-primary";
const INACTIVE_MANAGER_MOBILE = "text-second";
const BADGE_CLASS =
  "ml-1 size-5 p-0 flex items-center justify-center rounded-full bg-red-500 text-white text-xs";

function NavButton({
  href,
  isActive,
  variant,
  onClick,
  children,
  className,
}: {
  href: string;
  isActive: boolean;
  variant: "desktop" | "mobile";
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  const isDesktop = variant === "desktop";
  return (
    <Link href={href} onClick={onClick}>
      <Button
        variant="ghost"
        className={cn(
          isDesktop ? BASE_DESKTOP : BASE_MOBILE,
          isActive && isDesktop && ACTIVE_DESKTOP,
          isActive && !isDesktop && ACTIVE_MOBILE,
          !isActive && isDesktop && INACTIVE_DESKTOP,
          className
        )}
      >
        {children}
      </Button>
    </Link>
  );
}

function SignInButton({
  onClick,
  label,
  variant = "desktop",
}: {
  onClick?: () => void;
  label: string;
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
        {label}
      </Link>
    </Button>
  );
}

function SignUpButton({
  onClick,
  label,
  variant = "desktop",
}: {
  onClick?: () => void;
  label: string;
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
        {label}
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
  const t = useTranslations("nav");

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
    userData?.accountType === "organisation" ||
    userData?.isParticipant ||
    userData?.hasManagerRole;
  const closeMobile = () => setMobileMenuOpen(false);

  const showJoinedExperiments =
    userData?.accountType === "individual" || userData?.accountType === "organisation";
  const showUpgrade =
    userData?.accountType === "individual" &&
    !userData?.isUpgraded &&
    !userData?.isSuperAdmin;
  const showOrganisations = userData?.isOrgAdmin === true;
  const pendingAssignments = userData?.pendingAssignments ?? 0;

  return (
    <nav
      className="border-border/40 bg-card sticky top-0 z-50 w-full border-b
        backdrop-blur-xl"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 shrink-0 items-center justify-between">
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
                <span className={LOADING_TEXT}>{t("dashboard")}</span>
              </div>
            ) : (
              <>
                <NavButton href="/dashboard" isActive={pathname === "/dashboard" || pathname.startsWith("/dashboard/")} variant="desktop">
                  {t("dashboard")}
                </NavButton>
                <NavButton href="/experiments" isActive={pathname === "/experiments" || pathname.startsWith("/experiments/")} variant="desktop">
                  {t("experiments")}
                </NavButton>
                {showJoinedExperiments && (
                  <NavButton href="/org" isActive={pathname === "/org" || pathname.startsWith("/org/")} variant="desktop">
                    <Building2 className="size-4" />
                    {t("joinedExperiments")}
                    {pendingAssignments > 0 && <Badge className={BADGE_CLASS}>{pendingAssignments}</Badge>}
                  </NavButton>
                )}
                {showUpgrade && (
                  <NavButton
                    href="/upgrade"
                    isActive={pathname === "/upgrade" || pathname.startsWith("/upgrade/")}
                    variant="desktop"
                    className={cn(!pathname.startsWith("/upgrade") && INACTIVE_UPGRADE_DESKTOP)}
                  >
                    <Crown className="size-4" />
                    {t("upgrade")}
                  </NavButton>
                )}
                {showOrganisations && (
                  <NavButton href="/org" isActive={pathname === "/org" || pathname.startsWith("/org/")} variant="desktop">
                    <Building2 className="size-4" />
                    {t("organisations")}
                  </NavButton>
                )}
                {showManager && (
                  <NavButton
                    href="/org"
                    isActive={pathname === "/org" || pathname.startsWith("/org/")}
                    variant="desktop"
                    className={cn(!(pathname === "/org" || pathname.startsWith("/org/")) && INACTIVE_MANAGER_DESKTOP)}
                  >
                    <BarChart3 className="size-4" />
                    {t("manager")}
                  </NavButton>
                )}
                {userData?.isSuperAdmin && (
                  <Link href="/super-admin">
                    <Button
                      variant="ghost"
                      className={cn(
                        BASE_DESKTOP,
                        pathname.startsWith("/super-admin") ? "bg-violet-500 text-white hover:bg-violet-600" : "border border-violet-500/50 text-violet-600 dark:text-violet-400 hover:border-violet-500 hover:bg-violet-500 hover:text-white"
                      )}
                    >
                      <Shield className="size-4" />
                      {t("superAdmin")}
                    </Button>
                  </Link>
                )}
                <NavButton href="/settings/notifications" isActive={pathname.startsWith("/settings/notifications")} variant="desktop">
                  <Bell className="size-4" />
                  {t("notifications")}
                </NavButton>
              </>
            )}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <LanguageSwitcher />
            <ThemePaletteSwitch />
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
                <SignInButton label={t("signIn")} />
                <SignUpButton label={t("signUp")} />
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
          className="border-border/40 bg-card/80 overflow-hidden border-t backdrop-blur-sm
            [&>*]:!mb-0"
        >
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
            {secondaryContent}
          </div>
        </motion.div>
      )}

      {mobileMenuOpen && (
        <div
          className="border-border/40 bg-background/95 border-t backdrop-blur-xl
            md:hidden"
        >
          <div className="space-y-1 px-4 pt-2 pb-3">
            {!showNavLinks ? (
              <div className={LOADING_MOBILE}>
                <Loader2 className={LOADING_SPINNER} />
                <span className={LOADING_TEXT}>{t("dashboard")}</span>
              </div>
            ) : (
              <>
                <NavButton href="/dashboard" isActive={pathname === "/dashboard" || pathname.startsWith("/dashboard/")} variant="mobile" onClick={closeMobile}>
                  {t("dashboard")}
                </NavButton>
                <NavButton href="/experiments" isActive={pathname === "/experiments" || pathname.startsWith("/experiments/")} variant="mobile" onClick={closeMobile}>
                  {t("experiments")}
                </NavButton>
                {showJoinedExperiments && (
                  <NavButton href="/org" isActive={pathname === "/org" || pathname.startsWith("/org/")} variant="mobile" onClick={closeMobile}>
                    <Building2 className="size-4" />
                    {t("joinedExperiments")}
                    {pendingAssignments > 0 && <Badge className={BADGE_CLASS}>{pendingAssignments}</Badge>}
                  </NavButton>
                )}
                {showUpgrade && (
                  <NavButton
                    href="/upgrade"
                    isActive={pathname === "/upgrade" || pathname.startsWith("/upgrade/")}
                    variant="mobile"
                    onClick={closeMobile}
                    className={cn(!(pathname === "/upgrade" || pathname.startsWith("/upgrade/")) && INACTIVE_UPGRADE_MOBILE)}
                  >
                    <Crown className="size-4" />
                    {t("upgrade")}
                  </NavButton>
                )}
                {showOrganisations && (
                  <NavButton href="/org" isActive={pathname === "/org" || pathname.startsWith("/org/")} variant="mobile" onClick={closeMobile}>
                    <Building2 className="size-4" />
                    {t("organisations")}
                  </NavButton>
                )}
                {showManager && (
                  <NavButton
                    href="/org"
                    isActive={pathname === "/org" || pathname.startsWith("/org/")}
                    variant="mobile"
                    onClick={closeMobile}
                    className={cn(!(pathname === "/org" || pathname.startsWith("/org/")) && INACTIVE_MANAGER_MOBILE)}
                  >
                    <BarChart3 className="size-4" />
                    {t("manager")}
                  </NavButton>
                )}
                {userData?.isSuperAdmin && (
                  <Link href="/super-admin" onClick={closeMobile}>
                    <Button
                      variant="ghost"
                      className={cn(
                        BASE_MOBILE,
                        pathname.startsWith("/super-admin") ? "bg-violet-500 text-white" : "text-violet-600 dark:text-violet-400"
                      )}
                    >
                      <Shield className="size-4" />
                      {t("superAdmin")}
                    </Button>
                  </Link>
                )}
                <NavButton href="/settings/notifications" isActive={pathname.startsWith("/settings/notifications")} variant="mobile" onClick={closeMobile}>
                  <Bell className="size-4" />
                  {t("notifications")}
                </NavButton>
              </>
            )}

            <div className="flex items-center gap-2 pt-2">
              <LanguageSwitcher />
              <ThemePaletteSwitch />
              <ThemeToggle variant="mobile" />
            </div>

            <div className="border-border/40 border-t pt-2">
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
                <SignInButton label={t("signIn")} variant="mobile" onClick={closeMobile} />
                <SignUpButton label={t("signUp")} variant="mobile" onClick={closeMobile} />
              </SignedOut>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
