import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { factUpdatePolicy } from '../src/lib/nuwaIndex.mjs';
import { candidatePaths, releasedSnapshotErrors } from './lib/nuwa-index-release.mjs';
const base = process.argv[process.argv.indexOf('--base') + 1];
if (!process.argv.includes('--base') || !base) throw new Error('Provide --base <trusted Git revision>.');
const file = 'src/data/nuwa-index/catalogue.json';
const before = JSON.parse(execFileSync('git', ['show', `${base}:${file}`], { encoding: 'utf8', maxBuffer:64*1024*1024 }));
const after = JSON.parse(await readFile(file, 'utf8'));
const files = candidatePaths(base);
const policy = factUpdatePolicy(before, after, files);
policy.errors.push(...await releasedSnapshotErrors(base));
if (policy.requiresApproval) policy.errors.push('Scientific definitions or interpretations changed: editorial approval required.');
if (policy.errors.length) { console.error(policy.errors.join('\n')); process.exit(1); }
console.log('Fact update is within the approved data scope. Full build and release checks are still required.');
