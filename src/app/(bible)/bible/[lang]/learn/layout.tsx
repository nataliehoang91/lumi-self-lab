"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { LearnLessonFooter } from "@/components/Bible/Learn/LearnLessonFooter";
import { LearnDeepDiveCta } from "@/components/Bible/Learn/LearnDeepDiveCta";
import { getBibleIntl } from "@/lib/bible-intl";
import { useLearnFontClasses } from "@/components/Bible/Learn/useLearnFontClasses";

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { bodyClass } = useLearnFontClasses();
  const parts = pathname?.split("/") ?? [];
  // pathname: /bible/en/learn or /bible/en/learn/bible-origin
  const lang = parts[2] === "vi" ? "vi" : "en";
  const segment = parts[3] === "learn" && parts[4] ? parts[4] : null;

  const intl = getBibleIntl(lang === "vi" ? "VI" : "EN");
  const segmentTitleKey: Record<string, string> = {
    "bible-structure": "learnModule1Title",
    "bible-origin": "learnOriginTitle",
    "who-is-jesus": "learnJesusTitle",
    "what-is-faith": "learnModule4Title",
  };
  const titleKey = segment ? segmentTitleKey[segment] : null;
  const currentLabel = titleKey ? intl.t(titleKey) : null;

  return (
    <div className="min-h-screen bg-read font-sans">
      <main>
        <Container maxWidth="5xl" className={cn("px-4 py-16")}>
          {pathname?.includes("/learn") && segment != null && (
            <div className={cn("flex items-center gap-2 text-muted-foreground mb-8", bodyClass)}>
              <Link
                href={`/bible/${lang}/learn`}
                className="hover:text-foreground transition-colors font-medium"
              >
                Learn
              </Link>
              {currentLabel && (
                <>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-foreground">{currentLabel}</span>
                </>
              )}
            </div>
          )}

          {children}

          <LearnDeepDiveCta />
          <div className="my-10" />
          <LearnLessonFooter />
        </Container>
      </main>
    </div>
  );
}
