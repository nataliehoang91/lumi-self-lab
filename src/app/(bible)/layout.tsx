import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scripture Memory - Bible Flashcards",
  description: "A beautiful scripture memory app for church communities",
};

/**
 * Bible Flash Cards – standalone layout.
 * No auth provider; cookie-based admin only.
 * Root layout provides html, body, theme.
 */
export default function BibleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
