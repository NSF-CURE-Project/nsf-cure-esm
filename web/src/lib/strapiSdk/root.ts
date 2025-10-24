import "server-only"
import type {
  ClassItem,
  ModuleItem,
  LessonItem,
  ClassAttrs,
  ModuleAttrs,
  LessonAttrs,
} from "./types"

/* -------------------------------------------------------------------------- */
/*                               Type Utilities                               */
/* -------------------------------------------------------------------------- */

type Dict = Record<string, unknown>

/**
 * Generic Strapi entity (supports both v4 and v5)
 * v4: { id, attributes: T }
 * v5: { id, ...T }
 */
export type StrapiEntity<T extends Dict = Dict> =
  | { id?: number | string; documentId?: string; attributes?: T }
  | (T & { id?: number | string; documentId?: string })

/** Runtime type guards (avoid any) */
function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null
}

function hasAttributes<T extends Dict>(
  e: StrapiEntity<T>
): e is { id?: number | string; documentId?: string; attributes: T } {
  const attrs = (e as { attributes?: unknown }).attributes
  return isRecord(attrs)
}

/** Normalize Strapi id to a number (or undefined if not parseable) */
function asId(v: unknown): number | undefined {
  if (typeof v === "number" && Number.isFinite(v)) return v
  if (typeof v === "string") {
    const n = Number(v)
    return Number.isFinite(n) ? n : undefined
  }
  return undefined
}

/* Convenience alias */
type AnyEntity = StrapiEntity<Dict>

/* -------------------------------------------------------------------------- */
/*                                   Config                                   */
/* -------------------------------------------------------------------------- */

const base = process.env.STRAPI_URL ?? process.env.NEXT_PUBLIC_STRAPI_URL
if (!base) throw new Error("STRAPI_URL missing (set it in web/.env.local)")

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

/** Safely read an attribute (v4 or v5) */
const attr = <T = unknown, U extends Dict = Dict>(
  e: StrapiEntity<U> | null | undefined,
  key: keyof U & string
): T | undefined => {
  if (!e) return undefined

  if (hasAttributes<U>(e)) {
    const attrs = e.attributes as Record<string, unknown>
    return attrs[key] as T | undefined
  }

  const flat = e as Record<string, unknown>
  return flat[key] as T | undefined
}

/** Safely read a relation array (v4 or v5) */
const relArray = (e: AnyEntity | null | undefined, key: string): AnyEntity[] => {
  if (!e) return []

  // v4: { attributes: { key: { data: [...] } } }
  if (hasAttributes(e)) {
    const node = (e.attributes as Record<string, unknown>)[key]
    if (isRecord(node)) {
      const data = (node as { data?: unknown }).data
      if (Array.isArray(data)) return data as AnyEntity[]
    }
  }

  // v5: { key: [...] } or { key: { data: [...] } }
  const flat = (e as Record<string, unknown>)[key]
  if (Array.isArray(flat)) return flat as AnyEntity[]
  if (isRecord(flat)) {
    const data = (flat as { data?: unknown }).data
    if (Array.isArray(data)) return data as AnyEntity[]
  }

  return []
}

/* -------------------------------------------------------------------------- */
/*                                   Mappers                                  */
/* -------------------------------------------------------------------------- */

function mapLesson(e: AnyEntity): LessonItem | null {
  if (!e) return null

  const id = asId(e.id) ?? asId(e.documentId)
  if (id === undefined) return null

  const title =
    attr<LessonAttrs["title"]>(e, "title") ??
    attr<LessonAttrs["slug"]>(e, "slug") ??
    `Lesson ${id}`

  const slug = attr<LessonAttrs["slug"]>(e, "slug") ?? String(id)
  return { id, title, slug }
}

function mapModule(e: AnyEntity, parentSlug = ""): ModuleItem | null {
  if (!e) return null

  const id = asId(e.id) ?? asId(e.documentId)
  if (id === undefined) return null

  const title =
    attr<ModuleAttrs["title"]>(e, "title") ??
    attr<ModuleAttrs["slug"]>(e, "slug") ??
    `Module ${id}`

  const slug =
    attr<ModuleAttrs["slug"]>(e, "slug") ??
    (parentSlug ? `${parentSlug}-m${id}` : String(id))

  const lessons = relArray(e, "lessons").map(mapLesson).filter(Boolean) as LessonItem[]
  return { id, title, slug, lessons }
}

function mapClass(e: AnyEntity): ClassItem | null {
  if (!e) return null

  const id = asId(e.id) ?? asId(e.documentId)
  if (id === undefined) return null

  const title =
    attr<ClassAttrs["title"]>(e, "title") ??
    attr<ClassAttrs["slug"]>(e, "slug") ??
    `Class ${id}`

  const slug = attr<ClassAttrs["slug"]>(e, "slug") ?? String(id)

  // Coerce possible null -> undefined to satisfy `string | undefined`
  const descMaybe = attr<ClassAttrs["description"] | null>(e, "description")
  const description = descMaybe === null ? undefined : descMaybe ?? undefined

  const modules = relArray(e, "modules")
    .map((m) => mapModule(m, slug))
    .filter(Boolean) as ModuleItem[]

  return { id, title, slug, description, modules }
}

/* -------------------------------------------------------------------------- */
/*                                   Fetcher                                  */
/* -------------------------------------------------------------------------- */

export async function getClassesTree(): Promise<ClassItem[]> {
  const url = new URL(`${base}/api/classes`)
  url.searchParams.set("populate[modules][populate]", "lessons")
  if (process.env.STRAPI_API_TOKEN) {
    url.searchParams.set("publicationState", "preview")
  }

  const res = await fetch(url.toString(), {
    headers: process.env.STRAPI_API_TOKEN
      ? { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` }
      : {},
    cache: "no-store",
  })

  if (!res.ok) throw new Error(`Strapi error ${res.status}`)

  const json = (await res.json()) as { data?: unknown }
  const raw = Array.isArray(json.data) ? json.data : []

  const list = raw.map((x) => mapClass(x as AnyEntity)).filter(Boolean) as ClassItem[]

  if (!list.length) {
    console.warn(
      "getClassesTree: empty after mapping. First raw item:",
      JSON.stringify(raw[0], null, 2)
    )
  }

  return list
}
