"use client";

import { useState } from "react";
import { LandingLoader } from "@/components/Bible/LangPage/LandingLoader";
import { FullPageBibleLoader } from "@/components/Bible/GeneralComponents/full-page-bible-loader";
import { BibleMinimalLoader } from "@/components/Bible/GeneralComponents/minimal-bible-loader";
import {
  VerseSkeletonLoader,
  GradientShimmerLoader,
  MicroPanelLoader,
  SegmentedProgressBar,
} from "@/components/Bible/GeneralComponents/bible-section-loaders";
import { ThemePaletteSwitch } from "@/components/GeneralComponents/ThemePaletteSwitch";
import { ThemeToggleButtonBibleApp } from "@/components/Bible/theme-toggle-in-bible-app";

type Overlay = "landing" | "full" | "minimal" | null;

export default function LandingLoaderDemoPage() {
  const [overlay, setOverlay] = useState<Overlay>("landing");

  const closeOverlay = () => setOverlay(null);

  return (
    <main className="bg-body text-foreground min-h-screen">
      {/* Full-screen overlay loaders */}
      {overlay === "landing" && <LandingLoader onComplete={closeOverlay} />}
      {overlay === "full" && <FullPageBibleLoader onComplete={closeOverlay} />}
      {overlay === "minimal" && (
        <BibleMinimalLoader onComplete={closeOverlay} book="John" chapter={3} />
      )}

      {/* Playground content */}
      <div className="relative z-10 mx-auto max-w-5xl space-y-10 px-6 py-12">
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-semibold">Loader playground</h1>
              <p className="text-muted-foreground text-sm">
                Use these buttons to trigger the different full-screen Bible loaders.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ThemePaletteSwitch />
              <ThemeToggleButtonBibleApp variant="desktop" />
            </div>
          </div>
          <div className="flex flex-wrap gap-3 pt-1">
            <button
              type="button"
              className="border-border bg-background/80 hover:bg-background rounded-full
                border px-4 py-2 text-sm font-medium transition-colors"
              onClick={() => setOverlay("landing")}
            >
              Play landing loader
            </button>
            <button
              type="button"
              className="border-border bg-background/80 hover:bg-background rounded-full
                border px-4 py-2 text-sm font-medium transition-colors"
              onClick={() => setOverlay("full")}
            >
              Play full-page Bible loader
            </button>
            <button
              type="button"
              className="border-border bg-background/80 hover:bg-background rounded-full
                border px-4 py-2 text-sm font-medium transition-colors"
              onClick={() => setOverlay("minimal")}
            >
              Play minimal Bible loader
            </button>
            {overlay !== null && (
              <button
                type="button"
                className="border-border/60 bg-background/60 text-muted-foreground
                  hover:bg-background rounded-full border px-4 py-2 text-xs font-medium
                  transition-colors"
                onClick={closeOverlay}
              >
                Force close overlay
              </button>
            )}
          </div>
        </section>

        <section className="space-y-4">
          <h2
            className="text-muted-foreground text-sm font-semibold tracking-[0.16em]
              uppercase"
          >
            Section loaders
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-background/80 space-y-3 rounded-2xl border p-4">
              <p
                className="text-muted-foreground text-xs font-medium tracking-[0.16em]
                  uppercase"
              >
                Verse skeleton loader
              </p>
              <VerseSkeletonLoader verseCount={4} />
            </div>

            <div
              className="bg-background/80 space-y-3 overflow-hidden rounded-2xl border
                p-4"
            >
              <p
                className="text-muted-foreground text-xs font-medium tracking-[0.16em]
                  uppercase"
              >
                Gradient shimmer loader
              </p>
              <GradientShimmerLoader verseCount={4} />
            </div>

            <div className="bg-background/80 space-y-3 rounded-2xl border p-4">
              <p
                className="text-muted-foreground text-xs font-medium tracking-[0.16em]
                  uppercase"
              >
                Micro panel loader
              </p>
              <div className="flex flex-wrap gap-3">
                <MicroPanelLoader book="John" chapter={3} side="left" />
                <MicroPanelLoader book="Psalms" chapter={23} side="right" />
              </div>
            </div>

            <div className="bg-background/80 space-y-3 rounded-2xl border p-4">
              <p
                className="text-muted-foreground text-xs font-medium tracking-[0.16em]
                  uppercase"
              >
                Segmented progress bar
              </p>
              <div className="space-y-2">
                <SegmentedProgressBar progress={35} />
                <SegmentedProgressBar progress={72} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
