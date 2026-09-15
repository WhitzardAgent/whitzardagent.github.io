import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { allResearchBlogEntries, publishedResearchBlog, researchBlogSlug } from "../../../../lib/researchBlog";

export async function GET(context: APIContext) {
  const entries = publishedResearchBlog(await allResearchBlogEntries(), "en");
  return rss({
    title: "Research Blog — NUWA",
    description: "Human-written and edited explainers from NUWA Frontier AI Safety Lab.",
    site: context.site ?? "https://whitzard.tech",
    items: entries.map((entry) => ({
      title: entry.data.title,
      pubDate: entry.data.date,
      description: entry.data.summary,
      link: `/en/nuwa/blog/${researchBlogSlug(entry)}`,
      categories: entry.data.tags,
    })),
    customData: "<language>en</language>",
  });
}
