'use client';

import { useState } from 'react';
import { LandingLoader } from '@/components/Bible/LangPage/LandingLoader';
import { FullPageBibleLoader } from '@/components/Bible/GeneralComponents/full-page-bible-loader';
import { BibleMinimalLoader } from '@/components/Bible/GeneralComponents/minimal-bible-loader';
import {
  VerseSkeletonLoader,
  GradientShimmerLoader,
  MicroPanelLoader,
  SegmentedProgressBar,
} from '@/components/Bible/GeneralComponents/bible-section-loaders';
import { ThemePaletteSwitch } from '@/components/GeneralComponents/ThemePaletteSwitch';
import { ThemeToggleButtonBibleApp } from '@/components/Bible/theme-toggle-in-bible-app';

type Overlay = 'landing' | 'full' | 'minimal' | null;

export default function LandingLoaderDemoPage() {
  const [overlay, setOverlay] = useState<Overlay>('landing');

  const closeOverlay = () => setOverlay(null);

  return (
    <main className="min-h-screen bg-body text-foreground">
      {/* Full-screen overlay loaders */}
      {overlay === 'landing' && <LandingLoader onComplete={closeOverlay} />}
      {overlay === 'full' && <FullPageBibleLoader onComplete={closeOverlay} />}
      {overlay === 'minimal' && (
        <BibleMinimalLoader onComplete={closeOverlay} book="John" chapter={3} />
      )}

      {/* Playground content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 space-y-10">
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-semibold">Loader playground</h1>
              <p className="text-sm text-muted-foreground">
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
              className="px-4 py-2 rounded-full border border-border bg-background/80 text-sm font-medium hover:bg-background transition-colors"
              onClick={() => setOverlay('landing')}
            >
              Play landing loader
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-full border border-border bg-background/80 text-sm font-medium hover:bg-background transition-colors"
              onClick={() => setOverlay('full')}
            >
              Play full-page Bible loader
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-full border border-border bg-background/80 text-sm font-medium hover:bg-background transition-colors"
              onClick={() => setOverlay('minimal')}
            >
              Play minimal Bible loader
            </button>
            {overlay !== null && (
              <button
                type="button"
                className="px-4 py-2 rounded-full border border-border/60 bg-background/60 text-xs font-medium text-muted-foreground hover:bg-background transition-colors"
                onClick={closeOverlay}
              >
                Force close overlay
              </button>
            )}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Section loaders
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border bg-background/80 p-4 space-y-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-[0.16em]">
                Verse skeleton loader
              </p>
              <VerseSkeletonLoader verseCount={4} />
            </div>

            <div className="rounded-2xl border bg-background/80 p-4 space-y-3 overflow-hidden">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-[0.16em]">
                Gradient shimmer loader
              </p>
              <GradientShimmerLoader verseCount={4} />
            </div>

            <div className="rounded-2xl border bg-background/80 p-4 space-y-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-[0.16em]">
                Micro panel loader
              </p>
              <div className="flex flex-wrap gap-3">
                <MicroPanelLoader book="John" chapter={3} side="left" />
                <MicroPanelLoader book="Psalms" chapter={23} side="right" />
              </div>
            </div>

            <div className="rounded-2xl border bg-background/80 p-4 space-y-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-[0.16em]">
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

