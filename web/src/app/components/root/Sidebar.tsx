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
    return <nav className="text-sm text-gray-500 p-3">No classes yet.</nav>;
  }

  return (
    <nav className="text-sm space-y-4">
      {tree.map((_class, ci) => {
        const classKey = _class.id ?? `class-${ci}`;
        const classTitle =
          safeTrim(_class.title) ||
          humanizeSlug(_class.slug) ||
          `Class ${_class.id ?? ci}`;

        return (
          <div key={classKey}>
            <p className="font-semibold mb-1">{classTitle}</p>

            {(_class.modules ?? []).map((mod, mi) => {
              const modKey = mod.id ?? `mod-${classKey}-${mi}`;
              const modTitle =
                safeTrim(mod.title) ||
                `Module ${mod.id ?? `${_class.id ?? ci}-${mi}`}`;

              return (
                <div key={modKey} className="ml-3">
                  <p className="text-gray-500 mb-1">{modTitle}</p>

                  <ul className="ml-2 space-y-1">
                    {(mod.lessons ?? []).map((lesson, li) => {
                      const lessonKey = lesson.id ?? `lesson-${modKey}-${li}`;
                      const lessonTitle =
                        safeTrim(lesson.title) ||
                        humanizeSlug(lesson.slug) ||
                        `Lesson ${lesson.id ?? li}`;

                      return (
                        <li key={lessonKey}>
                          {safeTrim(lesson.slug) ? (
                            <Link
                              href={`/lessons/${safeTrim(lesson.slug)}`}
                              className="hover:underline"
                            >
                              {lessonTitle}
                            </Link>
                          ) : (
                            <span>{lessonTitle}</span>
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
