import { z } from "astro/zod";

export const researchBlogSchema = z.object({
  title: z.string().min(1),
  locale: z.enum(["zh", "en"]),
  pair: z.string().min(1),
  articleSlug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  date: z.coerce.date(),
  updated: z.coerce.date().optional(),
  authors: z.array(z.string().min(1)).min(1),
  summary: z.string().min(1),
  tags: z.array(z.string()).default([]),
  researchSlug: z.string().min(1).optional(),
  infrastructureSlug: z.string().min(1).optional(),
  originalTitle: z.string().min(1),
  originalUrl: z.url(),
  arxivUrl: z.url().optional(),
  codeUrl: z.url().optional(),
  cover: z.object({ src: z.string().startsWith("/assets/"), alt: z.string().min(1), width: z.number().positive(), height: z.number().positive(), caption: z.string().min(1).optional(), thumbnail: z.string().startsWith("/assets/").optional() }).optional(),
  featured: z.boolean().default(false),
  draft: z.boolean().default(true),
}).refine(data => Boolean(data.researchSlug) !== Boolean(data.infrastructureSlug), {
  message: "Reference exactly one paper (researchSlug) or project (infrastructureSlug).",
});

export type ResearchBlogFrontmatter = z.infer<typeof researchBlogSchema>;
