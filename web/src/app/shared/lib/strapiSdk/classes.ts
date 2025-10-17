import { apiGet } from "@/app/shared/lib/strapiClient";
import type {
  StrapiCollectionRes,
  StrapiEntity,
  ClassAttrs,
  ModuleAttrs,
  LessonAttrs,
} from "@/app/shared/lib/strapiSdk/types";

// Fetch ONE class by slug
export async function getClassBySlug(slug: string) {
  const res = await apiGet<StrapiCollectionRes<ClassAttrs>>("/classes", {
    filters: { slug: { $eq: slug } },
    populate: { modules: { populate: ["lessons"] } },
  });
  // Return first match (strapi returns a collection)
  return res.data?.[0] as StrapiEntity<ClassAttrs> | undefined;
}

// Fetch ONE lesson by slug (if you want /lessons/[slug])
export async function getLessonBySlug(slug: string) {
  const res = await apiGet<StrapiCollectionRes<LessonAttrs>>("/lessons", {
    filters: { slug: { $eq: slug } },
  });
  return res.data?.[0] as StrapiEntity<LessonAttrs> | undefined;

  
}
