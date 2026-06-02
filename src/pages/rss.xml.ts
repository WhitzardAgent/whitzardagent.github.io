import rss from "@astrojs/rss";
import { researchPapers } from "../data/researchPapers";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  return rss({
    title: "Nuwa Frontier AI Safety Lab",
    description:
      "Research, publications, and updates from Nuwa Frontier AI Safety Lab.",
    site: context.site ?? "https://www.whitzard.tech",
    items: researchPapers.map((paper) => ({
      title: paper.title,
      pubDate: paper.year ? new Date(`${paper.year}-01-01`) : new Date(),
      description: paper.summary,
      link: paper.url,
      categories: paper.topic,
    })),
    customData: "<language>en</language>",
  });
}
