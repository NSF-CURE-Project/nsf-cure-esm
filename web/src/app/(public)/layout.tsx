// SERVER component (no "use client")
import Sidebar from "@/components/navigation/Sidebar";
import Toc from "@/components/navigation/Toc";
import Footer from "@/components/Footer";
import React from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      id="layout"
      className="
        min-h-dvh bg-background text-foreground
        grid grid-cols-1
        lg:grid-cols-[18rem_minmax(0,1fr)_var(--toc-w)]
        lg:gap-[var(--toc-gap)]
      "
      style={{
        // content row (1fr) + footer row (auto)
        gridTemplateRows: "1fr auto",
      }}
    >
      {/* LEFT: SIDEBAR (row 1) */}
      <aside
        aria-label="Primary navigation"
        className="hidden lg:block border-r p-4 lg:row-start-1"
      >
        <div className="sticky top-[var(--nav-h)]">
          <div className="max-h-[calc(100dvh-var(--nav-h)-2rem)] overflow-y-auto">
            <Sidebar />
          </div>
        </div>
      </aside>

      {/* CENTER: MAIN (row 1) */}
      <main className="min-w-0 overflow-x-hidden p-6 lg:px-8 lg:row-start-1">
        <div
          id="content"
          className="mx-auto w-full transition-[max-width] duration-300"
          // 👆 no max-w here so you can clearly see the middle column grow/shrink
        >
          {children}
        </div>
      </main>

      {/* RIGHT: TOC COLUMN (row 1) */}
      <div className="hidden lg:block lg:row-start-1">
        <Toc />
      </div>

      {/* FOOTER (row 2) — spans ALL columns */}
      <footer className="border-t bg-background/80 backdrop-blur py-8 px-6 text-center text-sm text-muted-foreground col-span-full lg:col-span-3 lg:row-start-2">
        <Footer />
      </footer>
    </div>
  );
}
