// ===== UI shapes you render (normalized) =====
export type LessonItem = { id: number; title: string; slug: string };
export type ModuleItem = { id: number; title: string; slug: string; lessons: LessonItem[] };
export type ClassItem  = { id: number; title: string; slug: string; description?: string; modules: ModuleItem[] };

// ===== Minimal Strapi response wrappers =====
export type StrapiEntity<T> = { id: number; attributes: T };
export type StrapiRelation<T> = { data: Array<StrapiEntity<T>> | null };
export type StrapiCollectionRes<T> = { data: Array<StrapiEntity<T>>; meta?: unknown };

// ===== Attributes as saved in Strapi (raw API) =====
// Make fields optional because they can be absent (not populated or unset)
export type LessonAttrs = {
  title?: string | null;
  slug?: string | null;
};

export type ModuleAttrs = {
  title?: string | null;
  slug?: string | null;
  lessons?: StrapiRelation<LessonAttrs>;
};

export type ClassAttrs = {
  title?: string | null;
  slug?: string | null;
  description?: string | null;
  modules?: StrapiRelation<ModuleAttrs>;
};
