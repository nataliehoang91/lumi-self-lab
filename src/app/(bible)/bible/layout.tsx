import { BibleAppProvider } from "@/components/Bible/BibleAppContext";
import { BibleNavBar } from "@/components/Bible/BibleNavBar";

export default function BibleSectionLayout({ children }: { children: React.ReactNode }) {
  return (
    <BibleAppProvider>
      <BibleNavBar />
      <main className=" pt-14 min-h-screen">{children}</main>
    </BibleAppProvider>
  );
}
