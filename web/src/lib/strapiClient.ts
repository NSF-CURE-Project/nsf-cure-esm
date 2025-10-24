import qs from "qs";

export const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN || "";

type QueryParams = Record<string, unknown>;

function buildUrl(endpoint: string, params?: QueryParams) {
  const clean = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const base = `${STRAPI_URL.replace(/\/$/, "")}/api${clean}`;
  if (!params) return base;

  // QS-style: populate[modules][populate]=lessons
  const query = qs.stringify(params, { encodeValuesOnly: true, indices: false });
  return `${base}?${query}`;
}

export async function apiGet<T>(endpoint: string, params?: QueryParams): Promise<T> {
  const url = buildUrl(endpoint, params);

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Strapi GET ${res.status} ${res.statusText} – ${text}`);
  }
  return (await res.json()) as T;
}
