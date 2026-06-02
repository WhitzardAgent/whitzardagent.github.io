import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const allContent = await Promise.all([
    getCollection("posts", ({ data }) => !data.draft),
    getCollection("briefs", ({ data }) => !data.draft),
    getCollection("notes", ({ data }) => !data.draft),
    getCollection("reports", ({ data }) => !data.draft),
  ]);

  const items = allContent
    .flat()
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: "Whitzard and Nuwa Frontier AI Safety Lab",
    description:
      "Research, reports, briefs, and updates from Whitzard and Nuwa Frontier AI Safety Lab.",
    site: context.site ?? "https://www.whitzard.tech",
    items: items.map((item) => ({
      title: item.data.title,
      pubDate: item.data.date,
      description: item.data.summary || "",
      link:
        ["reports", "briefs", "notes"].includes(item.collection)
          ? `/research/${item.id}`
          : `/blog/${item.id}`,
      categories: item.data.tags,
    })),
    customData: "<language>en</language>",
  });
}
