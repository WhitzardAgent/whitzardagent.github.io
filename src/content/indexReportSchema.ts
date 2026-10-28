import { z } from 'astro/zod';
export const indexReportSchema = z.object({
  title: z.string().min(1), summary: z.string().min(1), locale: z.enum(['en', 'zh']), pair: z.string().min(1),
  articleSlug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), date: z.coerce.date(), updated: z.coerce.date().optional(),
  scope: z.enum(['cross-topic','topic']).default('cross-topic'), topicIds:z.array(z.string()).default([]),
  period: z.enum(['baseline', 'weekly', 'monthly']), snapshotId: z.string().min(1), authors: z.array(z.string().min(1)).min(1),
  citations: z.array(z.object({ sourceId:z.string().optional(), url:z.url().optional(), title:z.string().optional(), locator:z.string().optional(), version:z.string().optional() })).default([]),
  draft: z.boolean().default(true), approved: z.boolean().default(false), approvalReference: z.string().optional(),
}).refine(data => !data.approved || Boolean(data.approvalReference?.trim()), { message: 'Approved reports require an editorial approval reference.' });
