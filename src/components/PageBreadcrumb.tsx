"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FlaskConical, ArrowLeft, ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface PageBreadcrumbProps {
  /** Back link - the primary "Back to X" action */
  backLabel: string;
  backHref: string;
  /** Optional breadcrumb trail for deeper pages (e.g. Dashboard > Experiments > Detail) */
  trail?: BreadcrumbItem[];
  /** Whether to show the Self-Lab logo on the right. Defaults to true. */
  showLogo?: boolean;
}

export function PageBreadcrumb({
  backLabel,
  backHref,
  trail,
  showLogo = true,
}: PageBreadcrumbProps) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          asChild
          className="text-second hover:text-second/90 hover:bg-second/10 h-9 gap-2
            rounded-xl px-3 transition-colors"
        >
          <Link href={backHref}>
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Link>
        </Button>

        {trail && trail.length > 0 && (
          <nav aria-label="Breadcrumb" className="hidden items-center gap-1 sm:flex">
            {trail.map((item, index) => (
              <div key={item.href} className="flex items-center gap-1">
                <ChevronRight className="text-muted-foreground/50 h-3.5 w-3.5" />
                {index === trail.length - 1 ? (
                  <span className="text-foreground px-2 py-1 text-sm font-medium">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground
                      hover:bg-muted/50 rounded-lg px-2 py-1 text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        )}
      </div>

      {showLogo && (
        <Link
          href="/dashboard"
          className="text-muted-foreground hover:text-foreground inline-flex items-center
            gap-2 transition-colors"
        >
          <FlaskConical className="h-5 w-5" />
          <span className="text-foreground text-sm font-semibold">Self-Lab</span>
        </Link>
      )}
    </div>
  );
}
