import { getCollection, type CollectionEntry } from 'astro:content';
import { snapshotIds } from '../data/nuwa-index';
import { publishableReports } from './nuwaIndex.mjs';
export type IndexReport = CollectionEntry<'indexReports'>;
const reportModules = import.meta.glob('../content/index-reports/**/*.{md,mdx}');
export async function publishedIndexReports(): Promise<IndexReport[]> {
  const entries = Object.keys(reportModules).length ? await getCollection('indexReports') : [];
  return publishableReports(entries, snapshotIds).sort((a, b) => +b.data.date - +a.data.date);
}
export async function indexReportPaths() {
  return (await publishedIndexReports()).filter(entry => entry.data.locale === 'zh').map(entry => ({ params: { slug: entry.data.articleSlug }, props: { entry } }));
}
export async function englishIndexReportPaths() {
  return (await publishedIndexReports()).filter(entry => entry.data.locale === 'en').map(entry => ({ params: { slug: entry.data.articleSlug }, props: { entry } }));
}
