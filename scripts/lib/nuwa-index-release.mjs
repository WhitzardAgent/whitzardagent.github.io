import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { immutableSnapshotErrors } from '../../src/lib/nuwaIndex.mjs';

const git = (args, cwd) => execFileSync('git', args, { encoding: 'utf8', cwd });
const splitPaths = output => output.split('\0').filter(Boolean);
export function candidatePaths(base, cwd = process.cwd()) {
  return [...new Set([...splitPaths(git(['diff', '--name-only', '-z', base, '--'], cwd)), ...splitPaths(git(['ls-files', '--others', '--exclude-standard', '-z'], cwd))])];
}
export async function releasedSnapshotErrors(base, cwd = process.cwd()) {
  const files = splitPaths(git(['ls-tree', '-r', '--name-only', '-z', base, '--', 'src/data/nuwa-index/snapshots/'], cwd));
  const before = {}, after = {};
  for (const file of files) {
    before[file] = git(['show', `${base}:${file}`], cwd);
    try { after[file] = await readFile(resolve(cwd, file), 'utf8'); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  return immutableSnapshotErrors(before, after);
}

/** Published reading and record editions have the same immutability requirement as numeric snapshots. */
export async function releasedReadingEditionErrors(base,cwd=process.cwd()){
 const files=splitPaths(git(['ls-tree','-r','--name-only','-z',base,'--','src/data/nuwa-index/reading/','src/data/nuwa-index/record-editions/'],cwd)).filter(file=>file.endsWith('.json'));
 const before={},after={};for(const file of files){before[file]=git(['show',`${base}:${file}`],cwd);try{after[file]=await readFile(resolve(cwd,file),'utf8');}catch(error){if(error.code!=='ENOENT')throw error;}}
 return immutableSnapshotErrors(before,after);
}
