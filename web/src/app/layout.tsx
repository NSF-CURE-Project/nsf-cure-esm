import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link"
import Image from "next/image"

// (optional) fonts via next/font
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// Theme provider wrapper (using next-themes example)
import { ThemeProvider } from "@/app/components/theme-provider"; // create this (see below)
import Navbar from "./components/navigation/navbar";

export const metadata: Metadata = {
  title: "Supplemental Engineering Lessons",
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
