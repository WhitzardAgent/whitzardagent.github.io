import {createHash} from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { immutableSnapshotErrors } from '../../src/lib/nuwaIndex.mjs';

const git = (args, cwd) => execFileSync('git', args, { encoding: 'utf8', cwd, maxBuffer:64*1024*1024 });
const splitPaths = output => output.split('\0').filter(Boolean);
export function candidatePaths(base, cwd = process.cwd()) {
  return [...new Set([...splitPaths(git(['diff', '--name-only', '-z', base, '--'], cwd)), ...splitPaths(git(['ls-files', '--others', '--exclude-standard', '-z'], cwd))])];
}
async function retainedFileErrors(base,files,cwd){
 const algorithm=git(['rev-parse','--show-object-format'],cwd).trim(),before={},after={};
 for(const file of files){
  before[file]=git(['rev-parse',`${base}:${file}`],cwd).trim();
  try{const bytes=await readFile(resolve(cwd,file));after[file]=createHash(algorithm).update(`blob ${bytes.length}\0`).update(bytes).digest('hex');}catch(error){if(error.code!=='ENOENT')throw error;}
 }
 return immutableSnapshotErrors(before,after);
}
export async function releasedSnapshotErrors(base,cwd=process.cwd()){
 const files=splitPaths(git(['ls-tree','-r','--name-only','-z',base,'--','src/data/nuwa-index/snapshots/'],cwd));
 return retainedFileErrors(base,files,cwd);
}
/** Compare Git blob identities without buffering the full immutable JSON through child stdout. */
export async function releasedReadingEditionErrors(base,cwd=process.cwd()){
 const files=splitPaths(git(['ls-tree','-r','--name-only','-z',base,'--','src/data/nuwa-index/reading/','src/data/nuwa-index/record-editions/','src/data/nuwa-index/public-editions/'],cwd)).filter(file=>file.endsWith('.json'));
 return retainedFileErrors(base,files,cwd);
}
