import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { allResearchBlogEntries, publishedResearchBlog, researchBlogSlug } from "../../../lib/researchBlog";

export async function GET(context: APIContext) {
  const entries = publishedResearchBlog(await allResearchBlogEntries(), "zh");
  return rss({
    title: "Research Blog — 女娲实验室",
    description: "女娲实验室对前沿 AI 风险研究的人工撰写与编辑解读。",
    site: context.site ?? "https://whitzard.tech",
    items: entries.map((entry) => ({
      title: entry.data.title,
      pubDate: entry.data.date,
      description: entry.data.summary,
      link: `/nuwa/blog/${researchBlogSlug(entry)}`,
      categories: entry.data.tags,
    })),
    customData: "<language>zh-CN</language>",
  });
}
