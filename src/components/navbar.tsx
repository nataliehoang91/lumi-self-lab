"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sparkles, Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ManagerTabButton } from "@/components/navbar/ManagerTabButton";
import { ManagerTabButtonMobile } from "@/components/navbar/ManagerTabButtonMobile";

/**
 * Navbar Component with Clerk Integration
 *
 * Features:
 * - Clerk UserButton for authenticated users
 * - Sign in/Sign up buttons for unauthenticated users
 * - Theme toggle (light/dark mode)
 * - Responsive mobile menu
 * - Navigation links for protected routes
 *
 * References:
 * - https://clerk.com/docs/nextjs/reference/components/user/user-button
 * - https://clerk.com/docs/nextjs/reference/components/user/user-avatar
 */
export function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Don't show navbar on landing/auth pages
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

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/experiments", label: "Experiments" },
    { href: "/templates", label: "Templates" },
    { href: "/insights", label: "Insights" },
    { href: "/organizations", label: "Organizations" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2 transition-transform hover:scale-105"
          >
            <div className="flex size-9 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 text-secondary">
              <Sparkles className="size-5" />
            </div>
            <span className="text-lg font-semibold text-foreground">
              Self-Lab
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  className={`rounded-2xl transition-all hover:scale-105 border border-transparent hover:border-secondary/50 ${
                    pathname === link.href ||
                    pathname.startsWith(link.href + "/")
                      ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary font-medium"
                      : "hover:bg-muted/50 hover:text-secondary"
                  }`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
            {/* Manager tab - only show for organisation accounts */}
            <ManagerTabButton pathname={pathname} />
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-2 md:flex">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-2xl transition-all hover:scale-105"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="size-5" />
              ) : (
                <Moon className="size-5" />
              )}
            </Button>

            {/* Clerk UserButton for authenticated users */}
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
                afterSignOutUrl="/"
              />
            </SignedIn>

            {/* Sign In/Sign Up buttons for unauthenticated users */}
            <SignedOut>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  className="rounded-2xl transition-all hover:scale-105"
                  asChild
                >
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button
                  className="rounded-2xl transition-all hover:scale-105"
                  asChild
                >
                  <Link href="/sign-up">Sign Up</Link>
                </Button>
              </div>
            </SignedOut>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-2xl md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border/40 bg-background/95 backdrop-blur-xl md:hidden">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button
                  variant="ghost"
                  className={`w-full justify-start rounded-2xl border border-transparent hover:border-secondary/50 ${
                    pathname === link.href ||
                    pathname.startsWith(link.href + "/")
                      ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary font-medium"
                      : "hover:bg-muted/50 hover:text-secondary"
                  }`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
            {/* Manager tab in mobile - conditional */}
            <ManagerTabButtonMobile
              pathname={pathname}
              onClose={() => setMobileMenuOpen(false)}
            />

            {/* Theme Toggle in Mobile Menu */}
            <div className="flex items-center gap-2 pt-2">
              <Button
                variant="ghost"
                onClick={toggleTheme}
                className="w-full justify-start rounded-2xl"
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="mr-2 size-4" />
                    Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="mr-2 size-4" />
                    Dark Mode
                  </>
                )}
              </Button>
            </div>

            {/* Clerk UserButton/Sign In in Mobile Menu */}
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
                    afterSignOutUrl="/"
                  />
                </div>
              </SignedIn>
              <SignedOut>
                <Button
                  variant="ghost"
                  className="w-full justify-start rounded-2xl"
                  asChild
                >
                  <Link
                    href="/sign-in"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start rounded-2xl"
                  asChild
                >
                  <Link
                    href="/sign-up"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </Button>
              </SignedOut>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
