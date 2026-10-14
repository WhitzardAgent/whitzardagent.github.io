import type { ResearchAsset } from "../data/generated/researchAssets";
import type { Locale } from "../i18n/config";

export type ResearchKind = "" | "publication" | "technical-report" | "blogs";
export type ResearchFilterState = { q: string; topic: string; year: string; member: string; tags: string[]; kind?: ResearchKind };
export type ResearchBlogCard = { id: string; title: string; summary: string; year: number; date?: string; authors: string[]; tags: ResearchTag[]; url: string; source: string; external: boolean; researchSlug?: string };
export type ResearchTag = { id: string; en: string; zh: string; count?: number };
export const emptyResearchFilters: ResearchFilterState = { q: "", topic: "", year: "", member: "", tags: [] };
export const tagId = (value: string) => value.normalize("NFKC").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export function researchKind(asset: ResearchAsset): Exclude<ResearchKind, "" | "blogs"> {
  if (asset.publicationType === "report") return "technical-report";
  // Legacy records sometimes retain "preprint" after a venue is documented.
  // Classify from that source metadata; an arXiv URL alone never implies acceptance.
  const pending = /\b(?:under review|submission|submitted|pending|not(?:\s+\w+){0,3}\s+accepted)\b/i.test(asset.venue);
  const accepted = /\baccepted\b/i.test(asset.venue);
  const venueRecorded = /\b(?:ICML|ICLR|WWW|CCS|SIGKDD|IEEE|NeurIPS|AAAI|NDSS|USENIX)\b/i.test(asset.venue) && /\b(?:19|20)\d{2}\b/.test(asset.venue);
  if (asset.publicationType === "preprint" && (pending || (!accepted && !venueRecorded))) return "technical-report";
  return "publication";
}

export function tagsForResearch(asset: ResearchAsset): ResearchTag[] {
  const tags = new Map<string, ResearchTag>();
  asset.topics.en.forEach((en, index) => {
    const id = tagId(en);
    if (id && !tags.has(id)) tags.set(id, { id, en, zh: asset.topics.zh[index] ?? en });
  });
  return [...tags.values()];
}
export function buildResearchTags(assets: ResearchAsset[], blogs: ResearchBlogCard[] = []): ResearchTag[] {
  const tags = new Map<string, ResearchTag>();
  for (const asset of assets) for (const tag of tagsForResearch(asset)) {
    const previous = tags.get(tag.id);
    tags.set(tag.id, { ...(previous ?? tag), count: (previous?.count ?? 0) + 1 });
  }
  for (const blog of blogs) for (const tag of new Map(blog.tags.map(tag => [tag.id, tag])).values()) {
    const previous = tags.get(tag.id);
    tags.set(tag.id, { ...(previous ?? tag), count: (previous?.count ?? 0) + 1 });
  }
  return [...tags.values()].sort((a, b) => (b.count ?? 0) - (a.count ?? 0) || a.en.localeCompare(b.en));
}
export function readResearchFilters(search: string): ResearchFilterState {
  const params = new URLSearchParams(search);
  const candidate = params.get("kind");
  const kind: ResearchKind = candidate === "publication" || candidate === "technical-report" || candidate === "blogs" ? candidate : "";
  return { q: params.get("q") ?? "", topic: params.get("topic") ?? "", year: params.get("year") ?? "", member: params.get("member") ?? "", tags: [...new Set(params.getAll("tag").map(tag => tag.trim()).filter(Boolean))], ...(params.has("kind") ? { kind } : {}) };
}
export function writeResearchFilterParams(search: string, filters: ResearchFilterState): string {
  const params = new URLSearchParams(search);
  for (const key of ["q", "topic", "year", "member"] as const) {
    params.delete(key);
    if (filters[key]) params.set(key, filters[key]);
  }
  params.delete("tag");
  params.delete("kind");
  if (filters.kind) params.set("kind", filters.kind);
  for (const tag of [...new Set(filters.tags)]) params.append("tag", tag);
  return params.toString();
}
export function matchesResearch(asset: ResearchAsset, filters: ResearchFilterState, locale: Locale): boolean {
  if (filters.kind && researchKind(asset) !== filters.kind) return false;
  if (filters.topic && asset.category !== filters.topic) return false;
  if (filters.year && asset.year !== Number(filters.year)) return false;
  if (filters.member && !asset.memberSlugs.includes(filters.member as ResearchAsset["memberSlugs"][number])) return false;
  if (filters.tags.length && !tagsForResearch(asset).some(tag => filters.tags.includes(tag.id))) return false;
  const query = filters.q.trim().toLocaleLowerCase(locale === "zh" ? "zh-CN" : "en");
  return !query || [asset.title, ...asset.authors, asset.venue, ...asset.topics[locale], asset.summary[locale]].join(" ").toLocaleLowerCase(locale === "zh" ? "zh-CN" : "en").includes(query);
}

export function matchesResearchBlog(blog: ResearchBlogCard, filters: ResearchFilterState, locale: Locale, companion?: ResearchAsset): boolean {
  if (filters.kind && filters.kind !== "blogs") return false;
  if (filters.year && blog.year !== Number(filters.year)) return false;
  if (filters.topic && companion?.category !== filters.topic) return false;
  if (filters.member && !companion?.memberSlugs.includes(filters.member as ResearchAsset["memberSlugs"][number])) return false;
  if (filters.tags.length && !blog.tags.some(tag => filters.tags.includes(tag.id))) return false;
  const query = filters.q.trim().toLocaleLowerCase(locale === "zh" ? "zh-CN" : "en");
  return !query || [blog.title, blog.summary, ...blog.authors, ...blog.tags.map(tag => tag[locale])].join(" ").toLocaleLowerCase(locale === "zh" ? "zh-CN" : "en").includes(query);
}
