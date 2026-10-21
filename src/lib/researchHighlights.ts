import { researchHighlights, type ResearchHighlight } from "../data/researchHighlights";
import { allResearchBlogEntries, researchBlogSlug, type ResearchBlogEntry } from "./researchBlog";
import { localizedPath, type Locale } from "../i18n/config";

export type ResolvedHighlight = ResearchHighlight & { article: ResearchBlogEntry; href: string };

export async function getResearchHighlights(locale: Locale, placement: ResearchHighlight["placements"][number]): Promise<ResolvedHighlight[]> {
  const entries = await allResearchBlogEntries();
  return researchHighlights.filter(item => item.placements.includes(placement)).sort((a, b) => a.order - b.order).flatMap(item => {
    const article = entries.find(entry => entry.data.pair === item.articlePair && entry.data.locale === locale && !entry.data.draft);
    if (!article) return [];
    return [{ ...item, article, href: localizedPath(`/nuwa/blog/${researchBlogSlug(article)}`, locale) }];
  });
}
