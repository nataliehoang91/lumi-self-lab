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
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          asChild
          className="gap-2 text-second hover:text-second/90 hover:bg-second/10 transition-colors rounded-xl px-3 h-9"
        >
          <Link href={backHref}>
            <ArrowLeft className="w-4 h-4" />
            {backLabel}
          </Link>
        </Button>

        {trail && trail.length > 0 && (
          <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1">
            {trail.map((item, index) => (
              <div key={item.href} className="flex items-center gap-1">
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
                {index === trail.length - 1 ? (
                  <span className="text-sm font-medium text-foreground px-2 py-1">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-muted/50"
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
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <FlaskConical className="w-5 h-5" />
          <span className="font-semibold text-sm text-foreground">Self-Lab</span>
        </Link>
      )}
    </div>
  );
}
