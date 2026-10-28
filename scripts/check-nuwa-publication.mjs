import fs from'node:fs';import{createHash}from'node:crypto';import{execFileSync}from'node:child_process';
import {digest}from'../src/lib/nuwa-intelligence/sourceVersions.mjs';
import{validatePublicReading,publicReading,publicRelease}from'../src/lib/nuwa-intelligence/publicReading.mjs';
import{validateCatalogue}from'../src/lib/nuwaIndex.mjs';
import{releasedSnapshotErrors,releasedReadingEditionErrors}from'./lib/nuwa-index-release.mjs';
const read=f=>JSON.parse(fs.readFileSync(f,'utf8')),catalogue=read('src/data/nuwa-index/catalogue.json'),errors=[...validateCatalogue(catalogue),...validatePublicReading(catalogue)];
const same=read(`src/data/nuwa-index/snapshots/${catalogue.snapshotId}.json`);if(digest(same)!==digest(catalogue))errors.push('Current immutable catalogue snapshot differs');
const editions=read(`src/data/nuwa-index/record-editions/${catalogue.snapshotId}.json`);if(editions.records.length!==catalogue.works.length)errors.push('Frozen reading record count mismatch');
for(const record of editions.records){const{contentHash,...payload}=record;if(digest(payload)!==contentHash||record.snapshotId!==catalogue.snapshotId)errors.push(`Invalid frozen record ${record.work.id}`);if(digest(record.readingDossier)!==digest(publicReading.works.find(d=>d.id===record.work.id)))errors.push(`Frozen reading body differs: ${record.work.id}`);if(digest(record.work)!==digest(catalogue.works.find(w=>w.id===record.work.id)))errors.push(`Frozen work metadata differs: ${record.work.id}`);}
const base=process.env.NUWA_SNAPSHOT_BASE??(process.argv.includes('--base')?process.argv[process.argv.indexOf('--base')+1]:null);
if(base){
 const actual=execFileSync('git',['rev-parse',base],{encoding:'utf8'}).trim();let before=null;
 let exists=true;try{execFileSync('git',['cat-file','-e',`${actual}:src/data/nuwa-index/catalogue.json`],{stdio:'pipe'});}catch(error){if(error.status===128)exists=false;else throw error;}
 if(exists)before=JSON.parse(execFileSync('git',['show',`${actual}:src/data/nuwa-index/catalogue.json`],{encoding:'utf8',maxBuffer:64*1024*1024,stdio:['ignore','pipe','pipe']}));else if(actual!==publicRelease.bootstrapBaseRevision)errors.push('Missing trusted catalogue base: bootstrap must name the actual reviewed pre-launch revision');
 if(before&&digest(before)!==digest(catalogue)&&before.snapshotId===catalogue.snapshotId)errors.push('Material changes need a new snapshot');
 errors.push(...await releasedSnapshotErrors(actual),...await releasedReadingEditionErrors(actual));
 console.log(before?'Validated publication against an existing committed catalogue baseline.':'Validated explicit bootstrap against the pre-launch commit; no fact-only gate pass is claimed.');
}
for(const retained of read('src/data/nuwa-index/bootstrap-retained-files.json').files)if(createHash('sha256').update(fs.readFileSync(retained.file)).digest('hex')!==retained.sha256)errors.push(`Pre-launch archive changed: ${retained.file}`);
if(publicReading.works.flatMap(d=>d.observations??[]).some(o=>o.publication!=='published'))errors.push('Record evidence publication state mismatch');
if(errors.length){console.error(errors.join('\n'));process.exit(1);}console.log(`Public reading ${catalogue.snapshotId}: content, sources, editions and publication status valid; independent academic review is not implied.`);
