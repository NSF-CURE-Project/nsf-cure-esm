// src/app/components/root/Sidebar.tsx
import Link from "next/link";
import { getClassesTree } from "@/app/shared/lib/strapiSdk/root";
import type { ClassItem } from "@/app/shared/lib/strapiSdk/types";

// tiny helpers
const safeTrim = (s?: string | null) => (s ?? "").trim();
const humanizeSlug = (s?: string | null) => safeTrim(s).replace(/-/g, " ");

export default async function Sidebar() {
  const tree: ClassItem[] = await getClassesTree();

  if (!tree?.length) {
    return (
      <nav className="text-sm text-muted-foreground bg-card border border-border rounded-lg p-3">
        No classes yet.
      </nav>
    );
  }

  return (
    <nav className="text-sm text-foreground bg-card rounded-lg p-3 space-y-4">
      {tree.map((_class, ci) => {
        const classKey = _class.id ?? `class-${ci}`;
        const classTitle =
          safeTrim(_class.title) ||
          humanizeSlug(_class.slug) ||
          `Class ${_class.id ?? ci}`;

        return (
          <div key={classKey} className="space-y-2">
            {/* Class title */}
            <p className="font-semibold text-primary">{classTitle}</p>

            {(_class.modules ?? []).map((mod, mi) => {
              const modKey = mod.id ?? `mod-${classKey}-${mi}`;
              const modTitle =
                safeTrim(mod.title) ||
                `Module ${mod.id ?? `${_class.id ?? ci}-${mi}`}`;

              return (
                <div key={modKey} className="ml-3 space-y-1.5">
                  {/* Module title */}
                  <p className="text-muted-foreground">{modTitle}</p>

                  {/* Lessons */}
                  <ul className="ml-2 space-y-1">
                    {(mod.lessons ?? []).map((lesson, li) => {
                      const lessonKey = lesson.id ?? `lesson-${modKey}-${li}`;
                      const slug = safeTrim(lesson.slug);
                      const lessonTitle =
                        safeTrim(lesson.title) ||
                        humanizeSlug(slug) ||
                        `Lesson ${lesson.id ?? li}`;

                      const linkBase =
                        "rounded-sm px-1 py-0.5 " +
                        "text-foreground/80 hover:text-primary " +
                        "focus-visible:outline-none focus-visible:ring-2 " +
                        "focus-visible:ring-ring focus-visible:ring-offset-2 " +
                        "focus-visible:ring-offset-background transition-colors";

                      return (
                        <li key={lessonKey}>
                          {slug ? (
                            <Link href={`/lessons/${slug}`} className={linkBase}>
                              {lessonTitle}
                            </Link>
                          ) : (
                            <span className="text-muted-foreground">{lessonTitle}</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        );
      })}
    </nav>
  );
}

