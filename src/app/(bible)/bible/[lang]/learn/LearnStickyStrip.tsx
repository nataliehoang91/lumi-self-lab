"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function LearnStickyStrip({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "sticky top-14 z-40 w-full transition-[background-color,border-color] duration-200",
        scrolled
          ? "bg-card border-b border-border"
          : "bg-transparent border-b border-transparent"
      )}
    >
      {children}
    </div>
  );
}
