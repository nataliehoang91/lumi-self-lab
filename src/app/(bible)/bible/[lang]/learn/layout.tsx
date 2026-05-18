import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { LearnLessonFooter } from "@/components/Bible/Learn/LearnLessonFooter";
import { LearnDeepDiveCta } from "@/components/Bible/Learn/LearnDeepDiveCta";
import { LearnBreadcrumb } from "./LearnBreadcrumb";
import { LearnStickyStrip } from "./LearnStickyStrip";

export default async function LearnLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <div className="bg-read min-h-screen font-sans dark:bg-[#050408]">
      <LearnStickyStrip>
        <Container maxWidth="7xl" className="px-4 sm:px-6 lg:px-16 xl:px-24">
          <LearnBreadcrumb lang={lang} />
        </Container>
      </LearnStickyStrip>
      <main>
        <Container maxWidth="7xl" className={cn("px-4 sm:px-6 lg:px-16 xl:px-24 pt-8 pb-16")}>
          {children}
          <LearnDeepDiveCta />
          <div className="my-10" />
          <LearnLessonFooter />
        </Container>
      </main>
    </div>
  );
}
