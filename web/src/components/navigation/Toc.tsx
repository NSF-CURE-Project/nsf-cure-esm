"use client";

import { useEffect, useMemo, useState } from "react";
import { ThemeToggle } from "@/theme/ThemeToggle";

type TocItem = { id: string; text: string; level: number };

export default function Toc() {
  const [items, setItems] = useState<TocItem[]>([]);
  const [open, setOpen] = useState(true);     // desktop sidebar open/closed
  const [drawer, setDrawer] = useState(false); // mobile drawer

  // Build TOC from headings
  useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll("main h2, main h3")
    ) as HTMLHeadingElement[];

    const tocItems = headings.map((h) => {
      const id =
        h.id || h.textContent?.toLowerCase().trim().replace(/\s+/g, "-") || "";
      h.id = id;
      return { id, text: h.textContent || "", level: h.tagName === "H2" ? 2 : 3 };
    });

    setItems(tocItems);
  }, []);

  // 🔑 Drive the layout's 3rd grid column and the main content width via CSS vars.
  // When closed, use a thin rail (0.75rem) so the toggle button remains visible,
  // and widen the main content's max width so it reshapes to fill the space.
  useEffect(() => {
    const layout = document.getElementById("layout");
    const content = document.getElementById("content");
    if (layout) {
      layout.style.setProperty("--toc-w", open ? "20rem" : "0.75rem");
    }
    if (content) {
      content.style.setProperty("--content-max", open ? "110ch" : "140ch"); // or 90rem
    }
  }, [open]);
  

  // Active section highlight
  const [activeId, setActiveId] = useState<string | null>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActiveId((e.target as HTMLElement).id));
      },
      { rootMargin: "0px 0px -70% 0px", threshold: [0, 1] }
    );
    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [items]);

  // Memoized list
  const TocList = useMemo(
    () => (
      <nav className="text-sm">
        <p className="mb-2 font-semibold">On this page</p>
        <ul className="space-y-1">
          {items.map((item) => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id} className={item.level === 3 ? "ml-3" : ""}>
                <a
                  href={`#${item.id}`}
                  onClick={() => setDrawer(false)}
                  className={[
                    "block rounded px-2 py-1 hover:underline",
                    "text-muted-foreground",
                    isActive ? "font-semibold underline text-foreground" : "",
                  ].join(" ")}
                >
                  {item.text}
                </a>
              </li>
            );
          })}
        </ul>
        <div className="border-t border-border pt-4 mt-4">
          <ThemeToggle />
        </div>
      </nav>
    ),
    [items, activeId]
  );

  return (
    <>
      {/* Mobile trigger */}
      <button
        className="fixed bottom-5 right-5 z-40 rounded-full border bg-background/70 px-4 py-2 text-sm shadow-sm backdrop-blur lg:hidden"
        onClick={() => setDrawer(true)}
        aria-controls="toc-drawer"
        aria-expanded={drawer}
      >
        Contents
      </button>

      {/* Mobile drawer */}
      <div
        id="toc-drawer"
        role="dialog"
        aria-modal="true"
        className={`fixed inset-y-0 right-0 z-50 w-72 transform border-l bg-background transition-transform duration-200 lg:hidden ${
          drawer ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <span className="font-semibold">Table of contents</span>
          <button
            className="rounded px-2 py-1 text-sm hover:bg-muted"
            onClick={() => setDrawer(false)}
          >
            Close
          </button>
        </div>
        <div className="max-h-[calc(100vh-56px)] overflow-y-auto p-3">{TocList}</div>
      </div>

      {/* Desktop TOC (thin rail when closed) */}
      <aside
        className={`relative hidden lg:block transition-[width] duration-200 ${
          open ? "w-full" : "w-12" /* internal width for the aside itself */
        }`}
        aria-label="Table of contents"
      >
        {/* Collapse / expand button */}
        <button
          className="absolute -left-3 top-2 z-10 inline-flex h-7 w-7 items-center justify-center rounded-full border bg-background text-xs shadow-sm"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="desktop-toc"
          title={open ? "Collapse TOC" : "Expand TOC"}
        >
          {open ? "-->" : "<"}
        </button>

        {/* Sticky panel aligned to navbar */}
        <div
          id="desktop-toc"
          className="sticky top-[var(--nav-h)] h-[calc(100dvh-var(--nav-h))] overflow-hidden"
        >
          <div
            className={`h-full overflow-y-auto rounded-lg border border-border/40 bg-muted/20 p-4 backdrop-blur-sm transition-opacity ${
              open ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            {TocList}
          </div>
        </div>
      </aside>
    </>
  );
}
