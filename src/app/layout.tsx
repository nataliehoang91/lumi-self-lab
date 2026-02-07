import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
    <ClerkProvider
      // Configure custom routes for session tasks
      // Reference: https://clerk.com/docs/nextjs/reference/components/authentication/task-reset-password
      taskUrls={{
        "reset-password": "/reset-password",
      }}
      // Configure waitlist URL for waitlist functionality
      // Reference: https://clerk.com/docs/nextjs/reference/components/authentication/waitlist
      waitlistUrl="/waitlist"
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
        >
          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center">
                Loading...
              </div>
            }
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </Suspense>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
