"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

// ========= Shapes (loose) =========
type LessonItem  = { slug?: string; title?: string; name?: string } & Record<string, any>;
type ChapterItem = {
  slug?: string; title?: string; name?: string;
  lessons?: LessonItem[]; items?: LessonItem[]; children?: LessonItem[];
} & Record<string, any>;
type ClassItem   = {
  slug?: string; title?: string; name?: string;
  chapters?: ChapterItem[]; modules?: ChapterItem[]; children?: ChapterItem[];
} & Record<string, any>;

type Props = { classes: ClassItem[] };

// ========= Accessors =========
const getClassSlug   = (c: ClassItem)   => c.slug ?? c.classSlug ?? c.id ?? "";
const getClassTitle  = (c: ClassItem)   => c.title ?? c.name ?? "Untitled Class";
const getChapters    = (c: ClassItem): ChapterItem[] =>
  (c.chapters ?? c.modules ?? c.children ?? []) as ChapterItem[];

const getChapterSlug  = (ch: ChapterItem) => ch.slug ?? ch.chapterSlug ?? ch.id ?? "";
const getChapterTitle = (ch: ChapterItem) => ch.title ?? ch.name ?? "Untitled Chapter";
const getLessons      = (ch: ChapterItem): LessonItem[] =>
  (ch.lessons ?? ch.items ?? ch.children ?? []) as LessonItem[];

const getLessonSlug   = (l: LessonItem) => l.slug ?? l.lessonSlug ?? l.id ?? "";
const getLessonTitle  = (l: LessonItem) => l.title ?? l.name ?? "Untitled Lesson";

export default function SidebarClient({ classes }: Props) {
  const pathname = usePathname();

  // Parse /classes/[classSlug]/lessons/[lessonSlug]
  const { currentClassSlug, currentLessonSlug } = useMemo(() => {
    const parts = pathname.split("/").filter(Boolean);
    const iClass = parts.indexOf("classes");
    const iLesson = parts.indexOf("lessons");
    return {
      currentClassSlug: iClass >= 0 ? parts[iClass + 1] : null,
      currentLessonSlug: iLesson >= 0 ? parts[iLesson + 1] : null,
    };
  }, [pathname]);

  // lessonSlug -> { classSlug, chapterSlug }
  const lessonOwner = useMemo(() => {
    const map: Record<string, { classSlug: string; chapterSlug: string }> = {};
    for (const cls of classes ?? []) {
      const cSlug = getClassSlug(cls);
      for (const ch of getChapters(cls)) {
        const chSlug = getChapterSlug(ch);
        for (const ls of getLessons(ch)) {
          const lSlug = getLessonSlug(ls);
          if (cSlug && chSlug && lSlug) map[lSlug] = { classSlug: cSlug, chapterSlug: chSlug };
        }
      }
    }
    return map;
  }, [classes]);

  // Persisted open state
  const STORAGE_CLASSES  = "sidebar:open-classes";
  const STORAGE_CHAPTERS = "sidebar:open-chapters";

  const [openClasses, setOpenClasses] = useState<Record<string, boolean>>({});
  const [openChapters, setOpenChapters] = useState<Record<string, boolean>>({});

  // Init + auto-open current route owner
  useEffect(() => {
    let cMap: Record<string, boolean> = {};
    let hMap: Record<string, boolean> = {};
    try {
      cMap = JSON.parse(localStorage.getItem(STORAGE_CLASSES) || "{}") || {};
      hMap = JSON.parse(localStorage.getItem(STORAGE_CHAPTERS) || "{}") || {};
    } catch {}

    const owner = currentLessonSlug ? lessonOwner[currentLessonSlug] : null;
    const firstClassSlug = classes[0] ? getClassSlug(classes[0]) : null;

    const defaultClass = currentClassSlug || owner?.classSlug || firstClassSlug;
    const defaultChapter = owner ? `${owner.classSlug}/${owner.chapterSlug}` : null;

    if (defaultClass && cMap[defaultClass] !== true) cMap[defaultClass] = true;
    if (defaultChapter && hMap[defaultChapter] !== true) hMap[defaultChapter] = true;
    if (!Object.keys(cMap).length && defaultClass) cMap[defaultClass] = true;

    setOpenClasses(cMap);
    setOpenChapters(hMap);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, JSON.stringify(lessonOwner), classes?.length]);

  // Persist on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CLASSES, JSON.stringify(openClasses));
      localStorage.setItem(STORAGE_CHAPTERS, JSON.stringify(openChapters));
    } catch {}
  }, [openClasses, openChapters]);

  const toggleClass = (slug: string) =>
    setOpenClasses((m) => ({ ...m, [slug]: !m[slug] }));

  const toggleChapter = (classSlug: string, chapterSlug: string) => {
    const key = `${classSlug}/${chapterSlug}`;
    setOpenChapters((m) => ({ ...m, [key]: !m[key] }));
  };

  return (
    <nav className="text-sm">
      <ul className="space-y-3">
        {(classes ?? []).map((cls) => {
          const cSlug = getClassSlug(cls);
          if (!cSlug) return null;
          const classOpen = !!openClasses[cSlug];

          return (
            <li key={cSlug}>
              {/* 🟡 Class header (Cal Poly Gold) */}
              <button
                type="button"
                aria-expanded={classOpen}
                aria-controls={`panel-class-${cSlug}`}
                onClick={() => toggleClass(cSlug)}
                className="group flex w-full items-center gap-2 px-4 py-2 font-semibold text-[#FFB81C] transition-colors hover:bg-[#FFB81C]/10 hover:text-[#FFB81C]"
              >
                <span
                  className={["inline-block transition-transform", classOpen ? "rotate-90" : ""].join(" ")}
                  aria-hidden="true"
                >
                  ▶
                </span>
                <span>{getClassTitle(cls)}</span>
              </button>

              {/* Chapters (collapsible) */}
              <div
                id={`panel-class-${cSlug}`}
                className={[
                  "grid transition-[grid-template-rows,opacity] duration-200 ease-out",
                  classOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-70",
                ].join(" ")}
              >
                <ul className="min-h-0 overflow-hidden pl-6 pr-2 space-y-2">
                  {getChapters(cls).map((ch) => {
                    const chSlug = getChapterSlug(ch);
                    if (!chSlug) return null;
                    const chKey = `${cSlug}/${chSlug}`;
                    const chOpen = !!openChapters[chKey];

                    return (
                      <li key={chSlug}>
                        {/* Chapter header */}
                        <button
                          type="button"
                          aria-expanded={chOpen}
                          aria-controls={`panel-ch-${chKey}`}
                          onClick={() => toggleChapter(cSlug, chSlug)}
                          className="group flex w-full items-center gap-2 px-2 py-1 font-medium rounded-md transition-colors hover:bg-accent/25 hover:text-accent-foreground"
                        >
                          <span
                            className={["inline-block transition-transform", chOpen ? "rotate-90" : ""].join(" ")}
                            aria-hidden="true"
                          >
                            ▶
                          </span>
                          <span>{getChapterTitle(ch)}</span>
                        </button>

                        {/* Lessons (collapsible) */}
                        <div
                          id={`panel-ch-${chKey}`}
                          className={[
                            "grid transition-[grid-template-rows,opacity] duration-200 ease-out",
                            chOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-70",
                          ].join(" ")}
                        >
                          <ul className="min-h-0 overflow-hidden pl-6 py-1 space-y-1">
                            {getLessons(ch).map((ls) => {
                              const lsSlug = getLessonSlug(ls);
                              if (!lsSlug) return null;
                              const active = lsSlug === currentLessonSlug;
                              return (
                                <li key={lsSlug}>
                                  <Link
                                    href={`/classes/${cSlug}/lessons/${lsSlug}`}
                                    className={[
                                      "block rounded-md px-2 py-1 transition-colors",
                                      active
                                        ? "bg-accent text-accent-foreground font-semibold"
                                        : "text-muted-foreground hover:bg-accent/20 hover:text-accent-foreground",
                                    ].join(" ")}
                                  >
                                    {getLessonTitle(ls)}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
