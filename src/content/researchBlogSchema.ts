import { z } from "astro/zod";

export const researchBlogSchema = z.object({
  title: z.string().min(1),
  locale: z.enum(["zh", "en"]),
  pair: z.string().min(1),
  date: z.coerce.date(),
  updated: z.coerce.date().optional(),
  authors: z.array(z.string().min(1)).min(1),
  summary: z.string().min(1),
  tags: z.array(z.string()).default([]),
  researchSlug: z.string().min(1),
  originalTitle: z.string().min(1),
  originalUrl: z.url(),
  arxivUrl: z.url().optional(),
  codeUrl: z.url().optional(),
  featured: z.boolean().default(false),
  draft: z.boolean().default(true),
});

export type ResearchBlogFrontmatter = z.infer<typeof researchBlogSchema>;
