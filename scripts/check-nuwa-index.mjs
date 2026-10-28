import {validateModelMetadata} from '../src/lib/modelMetadata.mjs';
import { readFile, readdir } from 'node:fs/promises';
import { validateCatalogue } from '../src/lib/nuwaIndex.mjs';
import { releasedSnapshotErrors } from './lib/nuwa-index-release.mjs';
import { publishableReports } from '../src/lib/nuwaIndex.mjs';
import { parse } from 'yaml';
const data = JSON.parse(await readFile(new URL('../src/data/nuwa-index/catalogue.json', import.meta.url), 'utf8'));
const errors = [...validateCatalogue(data),...validateModelMetadata(data.models)];
const requestedBase = process.argv.includes('--base') ? process.argv[process.argv.indexOf('--base') + 1] : process.env.NUWA_SNAPSHOT_BASE;
const base = requestedBase && !/^0+$/.test(requestedBase) ? requestedBase : 'HEAD';
errors.push(...await releasedSnapshotErrors(base));
const snapshotDir = new URL('../src/data/nuwa-index/snapshots/', import.meta.url);
const snapshots = [];
for (const file of await readdir(snapshotDir)) {
  if (!file.endsWith('.json')) continue;
  const snapshot = JSON.parse(await readFile(new URL(file, snapshotDir), 'utf8'));
  snapshots.push(snapshot);
  errors.push(...validateCatalogue(snapshot).map(error => `${file}: ${error}`));
  if (file !== `${snapshot.snapshotId}.json`) errors.push(`${file}: filename does not match snapshot ID`);
}
const current = snapshots.find(snapshot => snapshot.snapshotId === data.snapshotId);
if (!current || JSON.stringify(current) !== JSON.stringify(data)) errors.push('Current catalogue must match its frozen snapshot.');
const reports = [];
async function readReports(directory) {
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const file = new URL(item.name + (item.isDirectory() ? '/' : ''), directory);
    if (item.isDirectory()) await readReports(file);
    else if (/\.mdx?$/.test(item.name)) {
      const text = await readFile(file, 'utf8');
      const frontmatter = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      if (!frontmatter) { errors.push(`${file.pathname}: missing report metadata`); continue; }
      const metadata = parse(frontmatter[1]);
      reports.push({ id: file.pathname, data: { ...metadata, date: new Date(metadata.date) } });
    }
  }
}
await readReports(new URL('../src/content/index-reports/', import.meta.url));
const approved = publishableReports(reports, snapshots.map(snapshot => snapshot.snapshotId));
for (const report of reports) if (!approved.includes(report)) errors.push(`${report.id}: public reports require approval, a fixed snapshot and exactly one matching bilingual pair; keep drafts outside the public checkout.`);
const routes = new Set();
for (const report of approved) {
  const route = `${report.data.locale}/${report.data.articleSlug}`;
  if (routes.has(route)) errors.push(`${report.id}: duplicate report route ${route}`);
  routes.add(route);
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`NUWA Index ${data.snapshotId}: ${data.works.length} research works, ${data.organizations.length} institutions, ${data.areas.length} risk topics, ${data.benchmarks.length} evaluations, ${data.results.length} source-reported system records; references and metrics valid.`);
