import React from "react";
import { ThemedButton } from "@/components/ui/ThemedButton";
import { RichText } from "@/components/ui/richText";
import type { BlocksContent } from "@strapi/blocks-react-renderer";

export const dynamic = "force-dynamic";
export const fetchCache = "default-no-store";

const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1337";
const IS_PROD = process.env.NODE_ENV === "production";
const PUB = IS_PROD ? "live" : "preview";

type HomePageFields = {
  overview: BlocksContent | null;
  missionStatement: BlocksContent | null;
  goals: BlocksContent | null;
};

async function getHomePage(): Promise<HomePageFields | null> {
  const url = new URL("/api/home-pages", STRAPI_URL);
  url.searchParams.set("publicationState", PUB);
  url.searchParams.set("populate", "*");

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) return null;

  const json = await res.json();
  const first = Array.isArray(json?.data) ? json.data[0] : null;
  if (!first) return null;

  return {
    overview: (first.overview ?? null) as BlocksContent | null,
    missionStatement: (first.missionStatement ?? null) as BlocksContent | null,
    goals: (first.goals ?? null) as BlocksContent | null,
  };
}

export default async function Landing() {
  const home = await getHomePage();

  return (
    <div className="mx-auto max-w-[60rem] px-6">
      <div className="mx-auto max-w-[40rem]">
        <header>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            NSF CURE Summer Bridge Program
          </h1>

          {home?.overview ? (
            <RichText
              content={home.overview}
              className="mt-3 text-muted-foreground leading-7"
            />
          ) : (
            <p className="mt-3 text-muted-foreground">
              Welcome to NSF CURE Engineering Supplemental Materials...
            </p>
          )}
        </header>

        {/* Hidden H2 so TOC has a top-level "Getting Started" anchor */}
        <h2 id="getting-started" className="sr-only">
          Getting Started
        </h2>

        <section className="mt-6">
          <ThemedButton href="/materials">Getting Started</ThemedButton>
        </section>

        <section className="mt-10 space-y-10">
          {home?.missionStatement && (
            <div>
              <h2 className="text-2xl font-semibold mb-3">
                Our Purpose at NSF CURE SBP
              </h2>
              <RichText content={home.missionStatement} className="leading-7" />
            </div>
          )}

          {home?.goals && (
            <div>
              <h2 className="text-2xl font-semibold mb-3">Program Goals</h2>
              <RichText content={home.goals} className="leading-7" />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

