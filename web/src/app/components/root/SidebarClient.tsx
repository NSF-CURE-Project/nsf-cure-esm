"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import type { ClassItem } from "@/app/shared/lib/strapiSdk/types";

type Props = { tree: ClassItem[] };

export function SidebarClient({ tree }: Props) {
  const pathname = usePathname();

  // 🟢 Start with everything expanded
  const [openClasses, setOpenClasses] = useState<Record<number, boolean>>({});
  const [openModules, setOpenModules] = useState<Record<number, boolean>>({});

  // initialize open states on mount
  useEffect(() => {
    const classState: Record<number, boolean> = {};
    const moduleState: Record<number, boolean> = {};

    tree.forEach((c) => {
      classState[c.id] = true; // open all classes by default
      c.modules?.forEach((m) => {
        moduleState[m.id] = true; // open all modules by default
      });
    });

    setOpenClasses(classState);
    setOpenModules(moduleState);
  }, [tree]);

  const toggleClass = (id: number) =>
    setOpenClasses((s) => ({ ...s, [id]: !s[id] }));

  const toggleModule = (id: number) =>
    setOpenModules((s) => ({ ...s, [id]: !s[id] }));

  const safe = (s?: string | null) => (s ?? "").trim();
  const pretty = (s?: string | null) => safe(s).replace(/-/g, " ");

  return (
    <nav className="text-sm space-y-3">
      {tree.map((c) => {
        const classTitle = safe(c.title) || pretty(c.slug) || `Class ${c.id}`;
        const classOpen = !!openClasses[c.id];

        return (
          <div key={c.id} className="rounded-lg">
            {/* CLASS HEADER */}
            <button
              onClick={() => toggleClass(c.id)}
              aria-expanded={classOpen}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <span className="font-semibold">{classTitle}</span>
              <span className="ml-2 text-xs">{classOpen ? "▾" : "▸"}</span>
            </button>

            {/* MODULES */}
            {classOpen && (c.modules?.length ?? 0) > 0 && (
              <div className="mt-1 pl-3 space-y-2">
                {c.modules!.map((m) => {
                  const modTitle =
                    safe(m.title) || pretty(m.slug) || `Module ${m.id}`;
                  const modOpen = !!openModules[m.id];

                  return (
                    <div key={m.id}>
                      <button
                        onClick={() => toggleModule(m.id)}
                        aria-expanded={modOpen}
                        className="w-full flex items-center justify-between px-2 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600"
                      >
                        <span>{modTitle}</span>
                        <span className="ml-2 text-xs">{modOpen ? "▾" : "▸"}</span>
                      </button>

                      {/* LESSONS */}
                      {modOpen && (m.lessons?.length ?? 0) > 0 && (
                        <ul className="mt-1 pl-3 space-y-1">
                          {m.lessons!.map((l) => {
                            const title =
                              safe(l.title) || pretty(l.slug) || `Lesson ${l.id}`;
                            const href = l.slug ? `/lessons/${l.slug}` : undefined;
                            const active =
                              !!href && pathname && pathname.startsWith(href);

                            return (
                              <li key={l.id}>
                                {href ? (
                                  <Link
                                    href={href}
                                    className={`block px-2 py-1 rounded hover:underline ${
                                      active
                                        ? "bg-zinc-100 dark:bg-zinc-800 font-medium"
                                        : ""
                                    }`}
                                  >
                                    {title}
                                  </Link>
                                ) : (
                                  <span className="block px-2 py-1 text-zinc-500">
                                    {title}
                                  </span>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
