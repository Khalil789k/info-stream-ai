import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { Inter as FontSans } from "next/font/google";
import { Space_Grotesk as FontHeadline } from "next/font/google";
import { Source_Code_Pro as FontCode } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";

// ---------------------------------------------------------------------------
// layout.tsx — Root layout for the App Router
// This file loads global CSS, registers fonts, and wraps all pages with
// ThemeProvider and a Toaster component for notifications.
// Comments added so you know where to plug global pieces (fonts, themes, toasts).
// ---------------------------------------------------------------------------

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontHeadline = FontHeadline({
  subsets: ["latin"],
  variable: "--font-headline",
  weight: ["500", "700"],
});

const fontCode = FontCode({
  subsets: ["latin"],
  variable: "--font-code",
});

export const metadata: Metadata = {
  title: "Info Stream AI",
  description: "AI-powered study assistant",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // The html/body wrapper is required by Next App Router pages
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          // Base classes applied globally
          "min-h-screen bg-background font-sans antialiased",
          // Font variables injected by next/font to use in Tailwind variables
          fontSans.variable,
          fontHeadline.variable,
          fontCode.variable
        )}
      >
        {/* ThemeProvider handles light/dark classes and system preference */}
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {/* children is where route content renders (page.tsx etc.) */}
          {children}
          {/* Toaster component is globally available for showing toasts */}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
