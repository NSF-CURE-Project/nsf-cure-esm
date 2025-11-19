// src/app/(public)/classes/[classSlug]/chapters/[chapterSlug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { SafeHtml } from "@/components/ui/safeHtml";

export const dynamic = "force-dynamic";
export const fetchCache = "default-no-store";

const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1337";
const PUB = process.env.NODE_ENV === "production" ? "live" : "preview";

type RouteParams = { classSlug: string; chapterSlug: string };
type PageProps = {
  params: Promise<RouteParams>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

/** Build Strapi query for a single module by slug (only real fields + valid populate). */
function buildModuleUrl(chapterSlug: string) {
  const url = new URL(`${STRAPI_URL}/api/modules`);

  url.searchParams.set("filters[slug][$eq]", chapterSlug);
  url.searchParams.set("publicationState", PUB);

  // scalar fields only
  url.searchParams.set("fields", "title,slug,objective");

  // ONLY relations + allowed keys; no 'order' anywhere
  url.searchParams.set("populate[class][fields]", "slug");
  url.searchParams.set("populate[lessons][fields]", "title,slug");

  return url.toString();
}

type NormalizedLesson = { title: string; slug: string };
type NormalizedModule = {
  title: string;
  slug: string;
  classSlug: string | null;
  objective?: string | null;
  lessons: NormalizedLesson[];
};

function normalizeModule(item: any): NormalizedModule | null {
  if (!item) return null;

  // Strapi v4 uses { data: [...], attributes: {...} }; v5 can be flat
  const a = "attributes" in item ? item.attributes ?? {} : item;

  // class relation (v4 nested .data.attributes.slug OR v5 .class.slug)
  const classSlug =
    a?.class?.data?.attributes?.slug ??
    a?.class?.attributes?.slug ?? // in case the relation came populated as an entity
    a?.class?.slug ??
    null;

  // lessons relation (array of entities or entities.data)
  const rawLessons = a?.lessons?.data ?? a?.lessons ?? [];
  const lessons: NormalizedLesson[] = (Array.isArray(rawLessons) ? rawLessons : []).map(
    (l: any) => {
      const la = "attributes" in l ? l.attributes ?? {} : l ?? {};
      return {
        title: typeof la.title === "string" ? la.title : "Untitled lesson",
        slug: typeof la.slug === "string" ? la.slug : "",
      };
    }
  );

  return {
    title: typeof a.title === "string" ? a.title : "Untitled chapter",
    slug: typeof a.slug === "string" ? a.slug : "",
    classSlug,
    objective: typeof a.objective === "string" ? a.objective : null,
    lessons,
  };
}

async function fetchModule(classSlug: string, chapterSlug: string) {
  const url = buildModuleUrl(chapterSlug);

  let raw = "";
  let status = 0;

  try {
    const res = await fetch(url, { cache: "no-store" });
    status = res.status;
    raw = await res.text().catch(() => "");
    if (!res.ok) {
      return { mod: null as NormalizedModule | null, debug: { status, url, raw } };
    }
  } catch (e) {
    return { mod: null as NormalizedModule | null, debug: { status, url, raw: String(e) } };
  }

  let json: any = {};
  try {
    json = JSON.parse(raw || "{}");
  } catch {
    // leave json as {}
  }

  const item = Array.isArray(json?.data) ? json.data[0] : null;
  const mod = normalizeModule(item);

  // Ensure the module actually belongs to this class
  const ok = !!mod; //

  return { mod: ok ? mod : null, debug: { url, raw } };
}

export default async function ChapterOverviewPage({ params, searchParams }: PageProps) {
  const { classSlug, chapterSlug } = await params;
  const sp = (await searchParams) ?? {};
  const DEBUG = "debug" in sp;

  const { mod, debug } = await fetchModule(classSlug, chapterSlug);

  if (!mod) {
    if (DEBUG) {
      return (
        <pre className="p-4 text-xs border rounded max-w-3xl mx-auto my-8 whitespace-pre-wrap">
{`DEBUG: No module matched
classSlug: ${classSlug}
chapterSlug: ${chapterSlug}
Query URL: ${debug.url}

Raw:
${debug.raw?.slice(0, 2000) ?? "(no body)"}`}
        </pre>
      );
    }
    return notFound();
  }

  return (
    <article className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-4">{mod.title}</h1>

      {mod.objective && (
        <section className="bg-muted/50 border rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-semibold mb-2">Chapter Objectives</h2>
          <SafeHtml
            html={mod.objective}
            className="prose dark:prose-invert max-w-none text-sm"
          />
        </section>
      )}

      <section>
        <h2 className="text-lg font-semibold mb-3">Lessons in this Chapter</h2>
        <ul className="space-y-2">
          {mod.lessons.map((l) => (
            <li key={l.slug}>
              <Link
                href={`/classes/${classSlug}/lessons/${l.slug}`}
                className="block rounded-lg border hover:border-foreground/30 p-3"
              >
                {l.title}
              </Link>
            </li>
          ))}
          {mod.lessons.length === 0 && (
            <li className="text-sm text-muted-foreground">No lessons yet.</li>
          )}
        </ul>
      </section>
    </article>
  );
}
