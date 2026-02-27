import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Lora, Merriweather } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { Suspense } from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
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
        className={`${geistSans.variable} ${geistMono.variable} ${vietnameseScripture.variable} ${loraSerif.variable} font-sans antialiased`}
      >
        <Suspense
          fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}
        >
          <ClerkProvider taskUrls={{ "reset-password": "/reset-password" }} waitlistUrl="/waitlist">
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
