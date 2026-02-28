"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { LearnLessonFooter } from "@/components/Bible/Learn/LearnLessonFooter";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { getBibleIntl } from "@/lib/bible-intl";

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { globalLanguage, fontSize } = useBibleApp();
  const intl = getBibleIntl(globalLanguage);

  const bodyClass =
    fontSize === "small" ? "text-xs" : fontSize === "large" ? "text-base" : "text-sm";

  const segment =
    pathname && pathname.startsWith("/bible/learn/")
      ? pathname.replace("/bible/learn/", "").split("/")[0]
      : null;

  const segmentTitleKey: Record<string, string> = {
    "": "learnTitle",
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
          {pathname?.startsWith("/bible/learn") && (
            <div className={cn("flex items-center gap-2 text-muted-foreground mb-8", bodyClass)}>
              <Link
                href="/bible/learn"
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
          <LearnLessonFooter />
        </Container>
      </main>
    </div>
  );
}
