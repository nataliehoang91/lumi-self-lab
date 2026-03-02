import type { LucideIcon } from "lucide-react";

/** Theme accent for journey step strip: primary, second, tertiary, sage, coral */
export type JourneyAccent = "primary" | "second" | "tertiary" | "sage" | "coral";

export interface JourneyItem {
  step: string;
  label: string;
  headline: string;
  body: string;
  links: { label: string; href: string }[];
  cta: { label: string; href: string };
  icon: LucideIcon;
  accent: JourneyAccent;
}

export interface QuickItem {
  label: string;
  sub: string;
  href: string;
  icon: LucideIcon;
}

export interface FeatureItem {
  title: string;
  desc: string;
  href: string;
}

export interface NavLink {
  label: string;
  href: string;
}
