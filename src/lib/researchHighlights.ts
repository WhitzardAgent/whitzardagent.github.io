import { researchHighlights, type ResearchHighlight } from "../data/researchHighlights";
import { allResearchBlogEntries, researchBlogSlug, type ResearchBlogEntry } from "./researchBlog";
import { localizedPath, type Locale } from "../i18n/config";

export type ResolvedHighlight = ResearchHighlight & { article: ResearchBlogEntry; href: string };

export async function getResearchHighlights(locale: Locale, placement: ResearchHighlight["placements"][number]): Promise<ResolvedHighlight[]> {
  const entries = await allResearchBlogEntries();
  return researchHighlights.filter(item => item.placements.includes(placement)).sort((a, b) => a.order - b.order).flatMap(item => {
    const article = entries.find(entry => entry.data.pair === item.articlePair && entry.data.locale === locale && !entry.data.draft);
    if (!article) return [];
    const cover = article.data.cover;
    const image = cover ? { ...item.image, src: cover.src, thumbnail: cover.thumbnail ?? cover.src, width: cover.width, height: cover.height, alt: { ...item.image.alt, [locale]: cover.alt }, caption: { ...item.image.caption, [locale]: cover.caption ?? item.image.caption[locale] } } : item.image;
    return [{ ...item, image, article, href: localizedPath(`/nuwa/blog/${researchBlogSlug(article)}`, locale) }];
  });
}
