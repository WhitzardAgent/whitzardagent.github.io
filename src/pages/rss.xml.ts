import rss from "@astrojs/rss";
import { researchAssets } from "../data/generated/researchAssets";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  return rss({
    title: "Nuwa Frontier AI Safety Lab",
    description:
      "Research, publications, and updates from Nuwa Frontier AI Safety Lab.",
    site: context.site ?? "https://www.whitzard.tech",
    items: researchAssets.map((paper) => ({
      title: paper.title,
      pubDate: paper.year ? new Date(`${paper.year}-01-01`) : new Date(),
      description: paper.summary || "",
      link: paper.url || `https://www.whitzard.tech/research`,
      categories: paper.topic,
    })),
    customData: "<language>en</language>",
  });
}
