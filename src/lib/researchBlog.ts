import { getCollection, type CollectionEntry } from "astro:content";
import type { Locale } from "../i18n/config";
import { researchAssets } from "../data/generated/researchAssets";

export type ResearchBlogEntry = CollectionEntry<"researchBlog">;
const researchBlogModules = import.meta.glob("../content/research-blog/**/*.{md,mdx}");

export async function allResearchBlogEntries(): Promise<ResearchBlogEntry[]> {
  return Object.keys(researchBlogModules).length > 0 ? getCollection("researchBlog") : [];
}

export function publishedResearchBlog(entries: ResearchBlogEntry[], locale: Locale) {
  return entries
    .filter((entry) => !entry.data.draft && entry.data.locale === locale)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function researchBlogSlug(entry: ResearchBlogEntry) {
  return entry.id.replace(/\.mdx?$/, "").split("/").pop() ?? entry.id;
}

export function companionResearch(entry: ResearchBlogEntry) {
  return researchAssets.find((asset) => asset.slug === entry.data.researchSlug);
}

export function pairedEntry(entry: ResearchBlogEntry, entries: ResearchBlogEntry[]) {
  return entries.find((candidate) => candidate.data.pair === entry.data.pair && candidate.data.locale !== entry.data.locale);
}
