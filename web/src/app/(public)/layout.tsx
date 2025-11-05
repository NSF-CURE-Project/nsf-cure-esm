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
        lg:grid-cols-[18rem_minmax(0,1fr)_var(--toc-w,20rem)]
        lg:gap-[var(--toc-gap,2rem)]
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
          className="mx-auto w-full max-w-[var(--content-max,110ch)] transition-[max-width] duration-300"
        >
          {children}
        </div>
      </main>

      {/* RIGHT: TOC (row 1, sticky in its column) */}
      <aside className="hidden lg:block">
        <div className="sticky top-[var(--nav-h)] h-[calc(100dvh-var(--nav-h))] overflow-hidden">
          <div className="h-full overflow-y-auto p-4 border-l bg-muted/20">
            <Toc />
          </div>
        </div>
      </aside>

      {/* FOOTER (row 2) — spans ALL columns */}
      <footer className="border-t bg-background/80 backdrop-blur py-8 px-6 text-center text-sm text-muted-foreground col-span-full lg:col-span-3 lg:row-start-2">
        <Footer />
      </footer>
    </div>
  );
}


