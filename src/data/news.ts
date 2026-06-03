export type NewsItem = {
  title: string;
  date: string;
  type: "Research" | "Company" | "Ecosystem" | "Event" | "Media" | "Update";
  summary?: string;
  /** External URL — card links directly to this URL. */
  url?: string;
  /** Slug for internal detail page at /news/[slug]. Used when url is not set. */
  slug?: string;
  /** Full body content for internal detail page (Markdown-supported). */
  body?: string;
  source?: string;
  featured?: boolean;
};

export const newsItems: NewsItem[] = [
  {
    title: "The Science of Frontier AI Risk Evaluation",
    date: "2026-01-15",
    type: "Research",
    url: "https://nuwasafety.substack.com/p/science-of-frontier-ai-risk-evaluation",
    source: "Nuwa Substack",
    summary:
      "Nuwa's first public research essay on making frontier AI risk evaluation more scientific, evidence-based, and operational.",
    featured: true,
  },
  {
    title: "Nuwa Frontier AI Safety Lab Launch",
    date: "2025-11-01",
    type: "Company",
    slug: "nuwa-lab-launch",
    summary:
      "Nuwa Frontier AI Safety Lab is launched as the research lab supported by Whitzard.",
    body:
      "Nuwa Frontier AI Safety Lab is officially launched as the research lab supported by Whitzard. Nuwa focuses on transparent, third-party, open infrastructure and benchmarks for frontier AI safety evaluation and governance.\n\nThe lab studies frontier AI risks including autonomy risks, deception, scheming, and loss-of-control, while developing open evaluation frameworks, benchmarks, technical notes, and governance evidence for safe and controllable AI.",
    featured: true,
  },
  {
    title: "WhitzardAgent Open Ecosystem",
    date: "2025-12-01",
    type: "Ecosystem",
    url: "https://github.com/WhitzardAgent",
    summary:
      "WhitzardAgent hosts open-source tools and datasets for AI safety evaluation, agent safety, and runtime protection.",
  },
];

/**
 * Resolve the link for a news item:
 * - If `url` is set, link to the external URL directly.
 * - If `slug` is set, link to the internal detail page /news/[slug].
 * - Otherwise, no link (card is not clickable).
 */
export function getNewsLink(item: NewsItem): string | undefined {
  if (item.url) return item.url;
  if (item.slug) return `/news/${item.slug}`;
  return undefined;
}
