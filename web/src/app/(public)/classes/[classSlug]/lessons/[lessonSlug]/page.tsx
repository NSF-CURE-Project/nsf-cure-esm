// src/app/(public)/classes/[classSlug]/lessons/[lessonSlug]/page.tsx
import { notFound } from "next/navigation";
import DOMPurify from "isomorphic-dompurify"; // ✅ sanitize rich text safely

// Disable static caching so lessons always render fresh
export const dynamic = "force-dynamic";
export const fetchCache = "default-no-store";

const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1337";
const IS_PROD = process.env.NODE_ENV === "production";
const PUB = IS_PROD ? "live" : "preview"; // show drafts in dev

type RouteParams = { classSlug: string; lessonSlug: string };
type PageProps = {
  params: Promise<RouteParams>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const absUrl = (u?: string | null) =>
  u ? (u.startsWith("http") ? u : `${STRAPI_URL}${u}`) : null;

// Build Strapi query for lesson by slug
function buildUrl(lessonSlug: string) {
  const url = new URL(`${STRAPI_URL}/api/lessons`);
  url.searchParams.set("filters[slug][$eq]", lessonSlug);
  url.searchParams.set("publicationState", PUB);

  // Only necessary fields
  url.searchParams.set("fields[0]", "title");
  url.searchParams.set("fields[1]", "textContent");
  url.searchParams.set("fields[2]", "slug");

  // Populate related module → class.slug, module.objective and video.url
  url.searchParams.set("populate[module][fields][0]", "slug");
  url.searchParams.set("populate[module][fields][1]", "objective");
  url.searchParams.set("populate[module][populate][class][fields][0]", "slug");
  url.searchParams.set("populate[video][fields][0]", "url");
  return url.toString();
}

// Normalize Strapi v5 flat shape or v4 nested attributes
function normalizeLesson(item: any) {
  if (!item) return null;

  // Strapi v5 (flat)
  if (!("attributes" in item)) {
    return {
      title: item.title ?? "Untitled lesson",
      textContent: item.textContent ?? "",
      videoUrl: absUrl(item.video?.url ?? null),
      classSlug:
        item.module?.class?.slug ??
        item.module?.data?.attributes?.class?.data?.attributes?.slug ??
        null,
      // module.objective (v5 flat or hybrid)
      objective:
        item.module?.objective ??
        item.module?.data?.attributes?.objective ??
        null,
    };
  }

  // Strapi v4 (attributes)
  const a = item.attributes ?? {};
  return {
    title: a.title ?? "Untitled lesson",
    textContent: a.textContent ?? "",
    videoUrl: absUrl(a.video?.data?.attributes?.url ?? null),
    classSlug:
      a.module?.data?.attributes?.class?.data?.attributes?.slug ??
      a.module?.class?.slug ??
      null,
    // module.objective (v4)
    objective:
      a.module?.data?.attributes?.objective ??
      a.module?.objective ??
      null,
  };
}

async function fetchLesson(classSlug: string, lessonSlug: string) {
  const url = buildUrl(lessonSlug);
  const res = await fetch(url, { cache: "no-store" });
  const raw = await res.text().catch(() => "");

  if (!res.ok) {
    return { lesson: null as any, debug: { phase: "http-fail", status: res.status, raw, url } };
  }

  const json = JSON.parse(raw || "{}");
  const item = Array.isArray(json?.data) ? json.data[0] : null;
  const norm = normalizeLesson(item);

  const ok =
    !!norm && !!norm.classSlug && norm.classSlug.toLowerCase() === classSlug.toLowerCase();

  return {
    lesson: ok ? norm : null,
    debug: {
      url,
      count: Array.isArray(json?.data) ? json.data.length : 0,
    },
  };
}

export default async function LessonPage({ params, searchParams }: PageProps) {
  const { classSlug, lessonSlug } = await params;
  const sp = (await searchParams) ?? {};
  const DEBUG = "debug" in sp;

  const { lesson, debug } = await fetchLesson(classSlug, lessonSlug);

  if (!lesson) {
    if (DEBUG) {
      return (
        <pre className="max-w-3xl mx-auto my-8 whitespace-pre-wrap break-words text-xs p-4 rounded border">
{`DEBUG: No lesson rendered

classSlug: ${classSlug}
lessonSlug: ${lessonSlug}
Fetch URL:
${debug.url}
Items: ${debug.count}`}
        </pre>
      );
    }
    notFound();
  }

  const { title, textContent, videoUrl, objective } = lesson as {
    title: string;
    textContent: string;
    videoUrl: string | null;
    objective?: string | null;
  };

  // Detect if the text contains HTML markup (from Strapi rich text)
  const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(textContent ?? "");
  const safeHtml = DOMPurify.sanitize(textContent ?? "");

  // Objective may also contain HTML; sanitize and render accordingly
  const objectiveLooksHtml = /<\/?[a-z][\s\S]*>/i.test(objective ?? "");
  const safeObjectiveHtml = DOMPurify.sanitize(objective ?? "");

  return (
    <article className="max-w-4xl mx-auto py-10 px-4">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-6">{title}</h1>

      {/* Objective */}
      {objective ? (
        <section className="mb-8">
          <h2 className="text-base font-semibold mb-2">Chapter Objectives</h2>
          {objectiveLooksHtml ? (
            <div
              className="prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: safeObjectiveHtml }}
            />
          ) : (
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {objective}
            </p>
          )}
        </section>
      ) : null}

      {/* Video */}
      {videoUrl ? (
        <div className="aspect-video mb-8">
          <video src={videoUrl} controls className="w-full h-full rounded-lg shadow" />
        </div>
      ) : (
        <p className="text-sm text-muted-foreground mb-8">No video for this lesson.</p>
      )}

      {/* Text content */}
      {looksLikeHtml ? (
        <div
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: safeHtml }}
        />
      ) : (
        <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
          {textContent}
        </div>
      )}
    </article>
  );
}
