import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { LearnLessonFooter } from "@/components/Bible/Learn/LearnLessonFooter";
import { LearnDeepDiveCta } from "@/components/Bible/Learn/LearnDeepDiveCta";
import { LearnBreadcrumb } from "./LearnBreadcrumb";

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
      <main>
        <Container maxWidth="5xl" className={cn("px-4 sm:px-6 py-16")}>
          <LearnBreadcrumb lang={lang} />
          {children}
          <LearnDeepDiveCta />
          <div className="my-10" />
          <LearnLessonFooter />
        </Container>
      </main>
    </div>
  );
}
