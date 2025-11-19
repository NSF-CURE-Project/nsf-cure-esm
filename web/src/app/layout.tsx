import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "../theme/theme-provider";
import Navbar from "@/components/navigation/navbar";
import React from "react";

export const metadata: Metadata = {
  title: "Supplemental Engineering Lessons",
  description: "Supplemental engineering learning videos and problem sets.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Tailwind's default font stack (font-sans) instead of next/font */}
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
