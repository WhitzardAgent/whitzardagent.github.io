import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

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
  external_url: z.string().url().optional(),
  substack_url: z.string().url().optional(),
  github_url: z.string().url().optional(),
  pdf_url: z.string().url().optional(),
  doi_url: z.string().url().optional(),
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

const updates = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/updates" }),
  schema: commonSchema,
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: commonSchema,
});

export const collections = { posts, briefs, notes, reports, updates, projects };
