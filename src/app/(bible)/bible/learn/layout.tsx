import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { LearnLessonFooter } from "@/components/Bible/Learn/LearnLessonFooter";

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-read font-sans">
      <main>
        <Container maxWidth="5xl" className={cn("px-4 py-16")}>
          {children}
          <LearnLessonFooter />
        </Container>
      </main>
    </div>
  );
}
