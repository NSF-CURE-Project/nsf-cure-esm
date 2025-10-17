import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link"

// (optional) fonts via next/font
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// Theme provider wrapper (using next-themes example)
import { ThemeProvider } from "@/app/components/theme-provider"; // create this (see below)

// Simple site-wide navbar
function Navbar() {
  return (
    <header className="border-b">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-6">
        <Link href="/" className="font-semibold">NSF CURE ESM Project</Link>
        <nav className="ml-auto flex gap-4 text-sm">
          <a href="/courses" className="hover:underline">Courses</a>
          <a href="/about" className="hover:underline">About</a>
        </nav>
      </div>
    </header>
  );
}

export const metadata: Metadata = {
  title: "Engineering Learning Platform",
  description: "Supplemental engineering learning videos and problem sets.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
