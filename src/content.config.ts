import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const commonSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  type: z.enum(["post", "brief", "note", "report", "framework", "update"]).optional(),
  brand: z.enum(["whitzard", "nuwa", "whitzardagent"]).default("whitzard"),
  authors: z.array(z.string()).optional(),
  summary: z.string().optional(),
  tags: z.array(z.string()).optional(),
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
  homepage: z.boolean().default(false),
  research_area: z.string().optional(),
  external_url: z.url().optional(),
  substack_url: z.url().optional(),
  github_url: z.url().optional(),
  pdf_url: z.url().optional(),
  doi_url: z.url().optional(),
  project: z.string().optional(),
});

const posts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
  schema: commonSchema,
});

const briefs = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/briefs" }),
  schema: commonSchema,
});

const notes = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/notes" }),
  schema: commonSchema,
});

const reports = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/reports" }),
  schema: commonSchema,
});

export const collections = { posts, briefs, notes, reports };
