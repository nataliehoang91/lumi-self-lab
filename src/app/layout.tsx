import type React from "react";
import type { Metadata } from "next";
import {
  Inter,
  Geist_Mono,
  Lora,
  Merriweather,
  Noto_Serif,
  Be_Vietnam_Pro,
  Roboto,
  Noto_Sans,
  Open_Sans,
  Playfair_Display,
  Libre_Baskerville,
  Chivo,
  Sora,
} from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { Suspense } from "react";
import "./globals.css";

/* Inter: recommended for UI (incl. Vietnamese); body 16–17px, line-height 1.6–1.75, letter-spacing 0–0.2px */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const loraSerif = Lora({
  variable: "--font-bible-serif",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const vietnameseScripture = Merriweather({
  variable: "--font-vietnamese",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "700"],
});

/* Noto Serif: strong Vietnamese diacritic support for flashcards (clearer than Merriweather at card sizes) */
const notoSerifVietnamese = Noto_Serif({
  variable: "--font-vietnamese-flashcard",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "700"],
});

/* Vietnamese reading fonts (Google Fonts suggestions: good diacritics, UI-friendly) */
const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "700"],
});

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600", "700"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600", "700"],
});

/* English reading fonts (NIV/KJV – serif & display, from reference design) */
const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const chivo = Chivo({
  variable: "--font-chivo",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://selfwithin.space"),
  title: "SelfWithin — Explore your inner life",
  description:
    "A personal reflection space for exploring your thoughts and emotions with AI guidance.",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${geistMono.variable}
          ${vietnameseScripture.variable} ${loraSerif.variable}
          ${notoSerifVietnamese.variable}
          ${beVietnamPro.variable} ${roboto.variable} ${notoSans.variable} ${openSans.variable}
          ${playfairDisplay.variable} ${libreBaskerville.variable} ${chivo.variable} ${sora.variable}
          font-sans antialiased`}
      >
        <Suspense
          fallback={
            <div className="flex min-h-screen items-center justify-center">
              Loading...
            </div>
          }
        >
          <ClerkProvider
            taskUrls={{ "reset-password": "/reset-password" }}
            waitlistUrl="/waitlist"
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </ClerkProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
