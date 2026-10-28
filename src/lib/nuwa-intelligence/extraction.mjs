import {digest} from './sourceVersions.mjs';
export const packageHash=p=>digest(p);
const countUnits=new Set(['count','tasks','trials','rollouts','attempts','runs','instances','items','samples','questions','problems','episodes','transcripts','pods','seeds','turns','steps','epochs','vulnerabilities','projects','benchmarks']);
const uncertaintyKinds=new Set(['confidence','range','standard-error','standard-deviation','credible','unspecified']);
export function validateExtraction(p){
 const e=[];if(!p.unitId||!p.contractVersion)e.push('package identity/contract missing');
 const ids=new Set();
 for(const o of p.observations??[]){
  if(!o.id||ids.has(o.id))e.push('observation duplicate/missing ID');ids.add(o.id);
  if(!o.locator)e.push(`${o.id}: locator missing`);
  if(o.value!==null&&!Number.isFinite(o.value))e.push(`${o.id}: invalid value`);
  if(o.value!==null&&(o.rawValue===null||o.rawValue===undefined))e.push(`${o.id}: raw token missing`);
  for(const key of ['numerator','denominator','trials']){
   const value=o[key];if(value!==undefined&&value!==null&&(!Number.isSafeInteger(value)||value<(key==='denominator'?1:0)))e.push(`${o.id}: invalid ${key}`);
   if(o[`${key}Unit`]!==undefined&&o[`${key}Unit`]!==null&&!countUnits.has(o[`${key}Unit`]))e.push(`${o.id}: invalid ${key} count unit`);
  }
  if(Number.isFinite(o.numerator)&&Number.isFinite(o.denominator)&&o.numerator>o.denominator)e.push(`${o.id}: numerator exceeds denominator`);
  if(o.unit==='count'&&o.value!==null&&(!Number.isSafeInteger(o.value)||o.value<0))e.push(`${o.id}: invalid count value`);
  if(['fraction','proportion'].includes(o.unit)&&o.value!==null&&(o.value<0||o.value>1))e.push(`${o.id}: invalid bounded ratio`);
  if(['%','percent'].includes(o.unit)&&o.value!==null&&(o.value<0||o.value>100))e.push(`${o.id}: invalid percentage ratio`);
  if(o.unit==='ratio'&&o.value!==null&&o.value<0)e.push(`${o.id}: invalid ratio`);
  for(const u of [o.uncertainty,o.rawFields?.CI,o.rawFields?.printed_ci].filter(u=>u!==undefined&&u!==null)){
   if(typeof u==='string')continue;
   if(typeof u!=='object'||Array.isArray(u)){e.push(`${o.id}: invalid uncertainty type`);continue;}
   if(u.kind!==undefined&&!uncertaintyKinds.has(u.kind))e.push(`${o.id}: invalid uncertainty kind`);
   if(u.level!==undefined&&u.level!==null&&(!Number.isFinite(u.level)||u.level<=0||u.level>(u.levelUnit==='fraction'?1:100)))e.push(`${o.id}: invalid uncertainty level`);
   if(u.levelUnit!==undefined&&!['percent','fraction',null].includes(u.levelUnit))e.push(`${o.id}: invalid uncertainty level unit`);
   for(const key of ['lower','upper'])if(u[key]!==undefined&&u[key]!==null&&!Number.isFinite(u[key]))e.push(`${o.id}: invalid uncertainty ${key}`);
   if(Number.isFinite(u.lower)&&Number.isFinite(u.upper)&&u.lower>u.upper)e.push(`${o.id}: reversed uncertainty bounds`);
   if(u.reportedPlusMinus!==undefined&&u.reportedPlusMinus!==null&&(!Number.isFinite(Number(u.reportedPlusMinus))||Number(u.reportedPlusMinus)<0))e.push(`${o.id}: invalid uncertainty plus/minus`);
   if(u.samples!==undefined&&u.samples!==null&&(!Number.isSafeInteger(u.samples)||u.samples<=0))e.push(`${o.id}: invalid uncertainty resamples`);
   if(u.method!==undefined&&u.method!==null&&(typeof u.method!=='string'||!u.method.trim()))e.push(`${o.id}: invalid uncertainty method`);
  }
  if(!['eligible','pending','quarantined'].includes(o.eligibility))e.push(`${o.id}: invalid eligibility`);
 }
 return e;
}
const identity=x=>{
 const value=typeof x==='string'?x:x?.id??x?.name;
 if(typeof value!=='string')return null;
 const normalized=value.trim().toLowerCase();
 // Agent task IDs can be embedded in an extraction-method description.
 return normalized.match(/\/root\/[a-z0-9_/-]+/)?.[0]??normalized;
};
export function validateReview(p,r,versionId){
 const e=validateExtraction(p);
 if(!r||r.packageHash!==packageHash(p))e.push('review package hash mismatch');
 if(r?.sourceVersionId!==versionId)e.push('review source version mismatch');
 if(r?.contractVersion!==p.contractVersion)e.push('review contract mismatch');
 if(!r?.reviewer||identity(p.extractor)&&identity(p.extractor)===identity(r.reviewer))e.push('independent reviewer required');
 if(!['accepted','accepted-partial','blocked'].includes(r?.status))e.push('invalid review status');
 for(const key of ['approvedObservationIds','approvedClaimIds'])if(!Array.isArray(r?.[key])||new Set(r[key]).size!==r[key].length)e.push(`invalid or duplicate ${key}`);
 for(const id of r?.approvedObservationIds??[])if(!(p.observations??[]).some(o=>o.id===id))e.push(`unknown reviewed observation ${id}`);
 for(const id of r?.approvedClaimIds??[])if(!(p.claims??[]).some(c=>c.id===id))e.push(`unknown reviewed claim ${id}`);
 return e;
}
export function eligibleObservations(p,r,v){if(validateReview(p,r,v).length||r.status==='blocked')return [];return (p.observations??[]).filter(o=>o.eligibility==='eligible'&&r.approvedObservationIds.includes(o.id));}
export function eligibleClaims(p,r,v){if(validateReview(p,r,v).length||r.status==='blocked')return [];return (p.claims??[]).filter(c=>r.approvedClaimIds.includes(c.id));}
export function resumeJob(job,sourceVersionId,contractVersion){const same=job.sourceVersionId===sourceVersionId&&job.contractVersion===contractVersion;return {...job,sourceVersionId,contractVersion,sections:Object.fromEntries(Object.entries(job.sections??{}).map(([k,v])=>[k,same?v:'pending']))};}
export function jobStatus(job){const statuses=Object.values(job.sections??{});return statuses.length&&statuses.every(s=>!['pending','unavailable'].includes(s))?'complete':statuses.some(s=>s!=='pending')?'partial':'pending';}
