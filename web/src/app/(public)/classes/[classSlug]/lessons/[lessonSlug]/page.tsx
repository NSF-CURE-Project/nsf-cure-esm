// src/app/(public)/classes/[classSlug]/lessons/[lessonSlug]/page.tsx
import { notFound } from "next/navigation";
import { SafeHtml } from "@/components/ui/safeHtml";

export const dynamic = "force-dynamic";
export const fetchCache = "default-no-store";

const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1337";
const PUB = process.env.NODE_ENV === "production" ? "live" : "preview";

type RouteParams = { classSlug: string; lessonSlug: string };
type PageProps = {
  params: Promise<RouteParams>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const absUrl = (u?: string | null) =>
  u ? (u.startsWith("http") ? u : `${STRAPI_URL}${u}`) : null;

function buildUrl(lessonSlug: string) {
  const url = new URL(`${STRAPI_URL}/api/lessons`);
  url.searchParams.set("filters[slug][$eq]", lessonSlug);
  url.searchParams.set("publicationState", PUB);
  url.searchParams.set("fields[0]", "title");
  url.searchParams.set("fields[1]", "textContent");
  url.searchParams.set("populate[video][fields][0]", "url");
  url.searchParams.set("populate[module][populate][class][fields][0]", "slug");
  return url.toString();
}

function normalizeLesson(item: any) {
  if (!item) return null;

  const a = "attributes" in item ? item.attributes : item;

  return {
    title: a.title ?? "Untitled lesson",
    textContent: a.textContent ?? "",
    videoUrl: absUrl(a.video?.data?.attributes?.url ?? a.video?.url ?? null),
    classSlug:
      a.module?.data?.attributes?.class?.data?.attributes?.slug ??
      a.module?.class?.slug ??
      null,
  };
}

async function fetchLesson(classSlug: string, lessonSlug: string) {
  const url = buildUrl(lessonSlug);
  const res = await fetch(url, { cache: "no-store" });
  const raw = await res.text();
  const json = JSON.parse(raw || "{}");

  const item = json?.data?.[0];
  const lesson = normalizeLesson(item);

  if (!lesson) return { lesson: null };

  const matchesClass =
    lesson.classSlug?.toLowerCase() === classSlug.toLowerCase();

  return { lesson: matchesClass ? lesson : null };
}

export default async function LessonPage({ params, searchParams }: PageProps) {
  const { classSlug, lessonSlug } = await params;
  const { lesson } = await fetchLesson(classSlug, lessonSlug);

  if (!lesson) return notFound();

  const { title, videoUrl, textContent } = lesson;

  const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(textContent ?? "");

  return (
    <article className="max-w-4xl mx-auto py-10 px-4">
      {/* Visible Lesson Title */}
      <h1 className="text-3xl font-bold mb-6">{title}</h1>

      {/* Invisible TOC heading (top-level) */}
      <h2 id="lesson-title" className="sr-only">
        {title}
      </h2>

      {/* ============================
          VIDEO SECTION
      ============================ */}

      {/* Invisible TOC heading for video */}
      <h3 id="lesson-video" className="sr-only">
        Lesson Video
      </h3>

      {videoUrl ? (
        <div className="aspect-video mb-8">
          <video
            src={videoUrl}
            controls
            className="w-full h-full rounded-lg shadow"
          />
        </div>
      ) : (
        <p className="text-sm text-muted-foreground mb-8">
          No video for this lesson.
        </p>
      )}

      {/* ============================
          CONTENT SECTION
      ============================ */}

      {/* Invisible TOC heading for content */}
      <h3 id="lesson-content" className="sr-only">
        Lesson Content
      </h3>

      {looksLikeHtml ? (
        <SafeHtml
          html={textContent}
          className="prose dark:prose-invert max-w-none"
        />
      ) : (
        <div className="prose dark:prose-invert whitespace-pre-wrap max-w-none">
          {textContent}
        </div>
      )}
    </article>
  );
}

