import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getClassBySlug } from "@/app/shared/lib/strapiSdk/classes";

type Params = Promise<{ classSlug: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export async function generateMetadata(props: {
    params: Params
    searchParams: SearchParams
}){
  const params = await props.params
  const { classSlug } = await params;
  const entity = await getClassBySlug(classSlug);
  const title = entity?.attributes?.title ?? "Class";
  return { title: `${title} • Engineering Learning` };
}

export default async function ClassPage(props: {
    params: Params
    searchParams: SearchParams
}) {
  const params = await props.params
  const { classSlug } = await params;
  const entity = await getClassBySlug(classSlug)
  if (!entity?.attributes) return notFound();

  const c = entity.attributes;
  return <article>{c.title}</article>;
}

export const revalidate = 60;

