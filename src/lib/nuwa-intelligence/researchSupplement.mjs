import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {assertPrivateRoot,assertPrivateOutput} from './privateStore.mjs';
import {digest} from './sourceVersions.mjs';

const cache=new Map();
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
export function validateResearchSupplement(data,base){
 const errors=[];
 if(data.schemaVersion!=='nuwa-index-supplement-1'||!data.batchId)errors.push('Supplement identity missing');
 if(data.baseSnapshotId!==base.snapshotId||data.baseFingerprint!==digest(base))errors.push('Supplement base changed; evidence integration requires review');
 if(data.review?.publication!=='private-draft'||data.review?.humanEvidenceApproval!==null||data.review?.bilingualEditorialApproval!==null)errors.push('Supplement must retain pending human review');
 if(data.results||data.sourceVersions||data.monitoring)errors.push('Reading supplements cannot inject results, source versions or monitoring groups');
 const ids=new Set(base.works.map(w=>w.id)),sourceIds=new Set(base.sources.map(s=>s.id)),protocolIds=new Set(base.benchmarks.map(b=>b.id));
 for(const [key,known]of [['sources',sourceIds],['benchmarks',protocolIds],['works',ids]])for(const row of data[key]??[]){if(!row.id||known.has(row.id))errors.push(`Duplicate ${key} identity: ${row.id}`);known.add(row.id);}
 for(const work of data.works??[]){
  if(!sourceIds.has(work.sourceId)||work.protocolIds.some(id=>!protocolIds.has(id)))errors.push(`Unresolved work dependency: ${work.id}`);
  if(!base.functions.some(f=>f.id===work.primaryFunction)||work.areas.some(id=>!base.areas.some(a=>a.id===id)))errors.push(`Invalid classification: ${work.id}`);
  if(!data.dossiers?.some(d=>d.id===work.id))errors.push(`Missing reading dossier: ${work.id}`);
 }
 for(const b of data.benchmarks??[])if(!sourceIds.has(b.sourceId)||b.links.some(l=>!base.questions.some(q=>q.id===l.questionId)))errors.push(`Unresolved protocol dependency: ${b.id}`);
 if((data.visualAudits??[]).length!==(data.benchmarks??[]).length||(data.benchmarks??[]).some(b=>!data.visualAudits?.some(a=>a.protocolId===b.id)))errors.push('Each new protocol needs an explicit visual disposition');
 const observationIds=new Set();
 for(const d of data.dossiers??[]){
  if(!ids.has(d.id))errors.push(`Unknown dossier: ${d.id}`);
  for(const locale of ['en','zh'])for(const key of ['takeaway','question','design','findings','interpretation','limits','decisionRelevance'])if(!d[locale]?.[key]?.length)errors.push(`Missing ${locale}.${key}: ${d.id}`);
  for(const o of d.observations??[]){
   if(observationIds.has(o.id)||!Number.isFinite(o.value)||o.publication!=='private-draft'||o.humanEvidenceApproval!==null)errors.push(`Invalid observation: ${o.id}`);
   observationIds.add(o.id);
   if(!o.sourceRefs?.length||o.sourceRefs.some(r=>!r.url||!r.locator||!r.artifactSha256))errors.push(`Observation provenance missing: ${o.id}`);
  }
 }
 for(const d of [...(data.dossiers??[]),...(data.protocols??[]),...(data.updates??[])]){
  if(d.review?.publication!=='private-draft'||d.review?.humanEvidenceApproval!==null||d.review?.bilingualEditorialApproval!==null)errors.push(`Draft scope missing: ${d.id}`);
  if(!d.sourceRefs?.length||d.sourceRefs.some(r=>!sourceIds.has(r.sourceId)||!r.url||!r.locator||!r.version||!r.artifactSha256))errors.push(`Unresolved source reference: ${d.id}`);
  for(const ref of d.sourceRefs??[])if(!data.artifacts?.some(a=>a.sha256===ref.artifactSha256))errors.push(`Source capture absent: ${d.id}`);
 }
 for(const update of data.updates??[])if(!base.works.some(w=>w.id===update.id)||update.relatedWorkIds.some(id=>!ids.has(id)))errors.push(`Invalid contextual update: ${update.id}`);
 return errors;
}
/** Opt-in reading extension. Never appends scored results or changes a retained snapshot. */
export function loadResearchSupplement(base,environment=process.env){
 if(environment.NUWA_LOCAL_REVIEW!=='1'||!environment.NUWA_SUPPLEMENT_ROOT)return null;
 if(!environment.NUWA_DOSSIER_ROOT)throw Error('Research supplement requires the explicit local dossier package');
 const root=assertPrivateRoot(environment.NUWA_SUPPLEMENT_ROOT),file=path.join(root,'index-integration.json'),key=`${file}|${fs.statSync(file).mtimeMs}|${digest(base)}`;
 if(cache.has(key))return cache.get(key);
 const data=JSON.parse(fs.readFileSync(file,'utf8')),errors=validateResearchSupplement(data,base);
 if(errors.length)throw Error(errors.join('\n'));
 for(const a of data.artifacts??[]){const artifact=assertPrivateOutput(path.join(root,a.file),root);if(sha(fs.readFileSync(artifact))!==a.sha256)throw Error(`Supplement source changed: ${a.file}`);}
 data.reviewFingerprint=digest(data);cache.clear();cache.set(key,data);return data;
}
export function applyResearchSupplement(base,data){
 if(!data)return base;
 return {...base,sources:[...base.sources,...data.sources],works:[...base.works,...data.works.map(w=>({...w,localReviewBatchId:data.batchId}))],benchmarks:[...base.benchmarks,...data.benchmarks],visualAudits:[...(base.visualAudits??[]),...(data.visualAudits??[])],reviewSupplement:{batchId:data.batchId,asOf:data.asOf,newWorkIds:data.works.map(w=>w.id),protocolIds:data.benchmarks.map(b=>b.id),updatedWorkIds:data.updates.map(u=>u.id)}};
}
