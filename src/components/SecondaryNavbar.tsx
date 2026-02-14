"use client";

import { motion } from "motion/react";

interface SecondaryNavbarProps {
  children: React.ReactNode;
}

/**
 * Secondary navbar - a second row below the main nav that drops down with animation.
 * Use on pages that need a page-specific header (title, actions, etc.).
 * No provider needed; each page renders its own.
 */
export function SecondaryNavbar({ children }: SecondaryNavbarProps) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="sticky top-16 z-40 overflow-hidden border-b border-border/40 bg-card/80 backdrop-blur-sm w-screen relative left-1/2 -translate-x-1/2"
    >
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">{children}</div>
    </motion.div>
  );
}
