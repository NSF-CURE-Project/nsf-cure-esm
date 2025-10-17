// src/app/shared/lib/strapiSdk/root.ts
import 'server-only';
import type {
  ClassItem, ModuleItem, LessonItem,
  ClassAttrs, ModuleAttrs, LessonAttrs,
  StrapiCollectionRes, StrapiEntity
} from './types';

const base = process.env.STRAPI_URL ?? process.env.NEXT_PUBLIC_STRAPI_URL;
if (!base) throw new Error('STRAPI_URL missing (set it in web/.env.local)');

// ---- helpers to support v4 (attributes) and v5 (flat) ----
type AnyEntity = any;

const attr = <T = unknown>(e: AnyEntity, key: string): T | undefined =>
  e?.attributes ? e.attributes[key] : e?.[key];

const relArray = (e: AnyEntity, key: string): AnyEntity[] => {
  // v4: { attributes: { key: { data: [...] } } }
  const v4Data = e?.attributes?.[key]?.data;
  if (Array.isArray(v4Data)) return v4Data;

  // v5: { key: [...] } or { key: { data: [...] } }
  const v5 = e?.[key];
  if (Array.isArray(v5)) return v5;
  if (Array.isArray(v5?.data)) return v5.data;

  return [];
};

// ---- mappers (use helpers above) ----
function mapLesson(e: AnyEntity): LessonItem | null {
  if (!e) return null;
  const id = e.id ?? e.documentId ?? undefined;
  const title = (attr<LessonAttrs['title']>(e, 'title')) ?? (attr<LessonAttrs['slug']>(e, 'slug')) ?? (id ? `Lesson ${id}` : 'Lesson');
  const slug  = (attr<LessonAttrs['slug']>(e, 'slug')) ?? String(id ?? '');
  if (!id) return null; // need stable keys
  return { id, title, slug };
}

function mapModule(e: AnyEntity, parentSlug = ''): ModuleItem | null {
  if (!e) return null;
  const id = e.id ?? e.documentId ?? undefined;
  const title = (attr<ModuleAttrs['title']>(e, 'title')) ?? (attr<ModuleAttrs['slug']>(e, 'slug')) ?? (id ? `Module ${id}` : 'Module');
  const slug  = (attr<ModuleAttrs['slug']>(e, 'slug')) ?? (parentSlug ? `${parentSlug}-m${id ?? ''}` : String(id ?? ''));
  const lessons = relArray(e, 'lessons').map(mapLesson).filter(Boolean) as LessonItem[];
  if (!id) return null;
  return { id, title, slug, lessons };
}

function mapClass(e: AnyEntity): ClassItem | null {
  if (!e) return null;
  const id = e.id ?? e.documentId ?? undefined;
  const title = (attr<ClassAttrs['title']>(e, 'title')) ?? (attr<ClassAttrs['slug']>(e, 'slug')) ?? (id ? `Class ${id}` : 'Class');
  const slug  = (attr<ClassAttrs['slug']>(e, 'slug')) ?? String(id ?? '');
  const description = attr<ClassAttrs['description']>(e, 'description') ?? undefined;
  const modules = relArray(e, 'modules').map(m => mapModule(m, slug)).filter(Boolean) as ModuleItem[];
  if (!id) return null;
  return { id, title, slug, description, modules };
}

export async function getClassesTree(): Promise<ClassItem[]> {
  const url = new URL(`${base}/api/classes`);
  url.searchParams.set('populate[modules][populate]', 'lessons');
  if (process.env.STRAPI_API_TOKEN) url.searchParams.set('publicationState', 'preview');

  const res = await fetch(url.toString(), {
    headers: process.env.STRAPI_API_TOKEN
      ? { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` }
      : {},
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`Strapi error ${res.status}`);

  const json = await res.json();
  // Works for v5 (json.data is flat objects) and v4 (json.data is entities with attributes)
  const list = (json?.data ?? []).map(mapClass).filter(Boolean) as ClassItem[];

  // Debug if empty
  if (!list.length) {
    console.warn('getClassesTree: empty after mapping. First raw item:', JSON.stringify(json?.data?.[0], null, 2));
  }

  return list;
}
