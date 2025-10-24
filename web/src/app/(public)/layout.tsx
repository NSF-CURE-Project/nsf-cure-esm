// SERVER component (no "use client")
import Sidebar from "@/components/navigation/Sidebar";
import Toc from "@/components/navigation/Toc";
import React from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      id="layout" /* we'll set --toc-w and --toc-gap on this node from Toc */
      className="
        min-h-dvh bg-background text-foreground
        grid grid-cols-1
        lg:grid-cols-[18rem_minmax(0,1fr)_var(--toc-w,20rem)]
        lg:gap-[var(--toc-gap,2rem)]
      "
    >
      {/* LEFT */}
      <aside aria-label="Primary navigation" className="hidden lg:block border-r p-4">
        <div className="sticky top-[var(--nav-h)]">
          <div className="max-h-[calc(100dvh-var(--nav-h)-2rem)] overflow-y-auto">
            <Sidebar />
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="min-w-0 overflow-x-hidden p-6 lg:px-8">
  {/* 👇 This wrapper resizes; Toc sets --content-max */}
  <div
  id="content"
  className="mx-auto w-full px-6 max-w-[var(--content-max,110ch)] transition-[max-width] duration-300"
>
  {children}
</div>

</main>


      {/* RIGHT (TOC column) */}
      <div className="hidden lg:block">
        {/* no padding above sticky so it’s flush with the navbar */}
        <div className="sticky top-[var(--nav-h)] h-[calc(100dvh-var(--nav-h))] overflow-hidden">
          <div className="h-full overflow-y-auto bg-muted/20">
            <Toc />
          </div>
        </div>
      </div>
    </div>
  );
}
