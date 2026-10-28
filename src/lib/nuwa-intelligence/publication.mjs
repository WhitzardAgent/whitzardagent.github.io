import {digest} from './sourceVersions.mjs';
import {validateExtraction} from './extraction.mjs';
import {observationCounts,observationSemantics,observationUncertainty,observationInterval} from './sourceObservation.mjs';
import {validateLineage} from './lineage.mjs';
export function validateIntelligence(d){if(!['5.0','5.1','5.2'].includes(d.schemaVersion))return ['2.0','3.0','3.1','4.0'].includes(d.schemaVersion)?[]:['Unsupported source-intelligence schema'];const e=[],names=['sourceVersions','observationEvidence','claims','reviewSummaries','evidenceLineage','comparisonSets','monitoringSignals','evidenceGaps','sourceUnits','officialObservations'],maps={};for(const name of names){if(!Array.isArray(d[name])){e.push(`${name}: missing schema5 array`);continue;}maps[name]=new Map(d[name].map(x=>[x.id,x]));if(maps[name].size!==d[name].length)e.push(`${name}: duplicate IDs`);}const ref=(name,id,at)=>{if(!maps[name]?.has(id))e.push(`${at}: unknown ${name} ${id}`);};const resultIds=new Set(d.results.map(r=>r.id));for(const v of d.sourceVersions??[])for(const a of v.artifacts??[])if(!/^[a-f0-9]{64}$/.test(a.sha256))e.push(`${v.id}: invalid artifact hash`);for(const r of d.reviewSummaries??[]){ref('sourceVersions',r.sourceVersionId,r.id);if(r.contractVersion!==maps.sourceVersions?.get(r.sourceVersionId)?.contractVersion)e.push(`${r.id}: review contract mismatch`);if(!/^[a-f0-9]{64}$/.test(r.packageHash??''))e.push(`${r.id}: unbound review`);}
 for(const o of d.observationEvidence??[]){ref('sourceVersions',o.sourceVersionId,o.id);ref('reviewSummaries',o.reviewId,o.id);const review=maps.reviewSummaries?.get(o.reviewId);if(!['accepted','accepted-partial'].includes(review?.status))e.push(`${o.id}: published evidence review is blocked or unapproved`);if(review?.sourceVersionId!==o.sourceVersionId)e.push(`${o.id}: review source version mismatch`);if(o.resultId&&!review?.approvedObservationIds?.includes(o.observationId)||o.claimId&&!review?.approvedClaimIds?.includes(o.observationId))e.push(`${o.id}: unapproved observation or claim`);if(o.resultId&&!resultIds.has(o.resultId))e.push(`${o.id}: result missing`);if(o.claimId)ref('claims',o.claimId,o.id);if(!o.resultId&&!o.claimId)e.push(`${o.id}: evidence target missing`);if(!o.locator)e.push(`${o.id}: locator missing`);}
 for(const u of d.sourceUnits??[]){ref('sourceVersions',u.sourceVersionId,u.id);ref('reviewSummaries',u.reviewId,u.id);const r=maps.reviewSummaries?.get(u.reviewId);if(!['accepted','accepted-partial'].includes(r?.status))e.push(`${u.id}: source review is blocked or unapproved`);if(r?.sourceVersionId!==u.sourceVersionId)e.push(`${u.id}: review source version mismatch`);}
 for(const o of d.officialObservations??[]){if(!resultIds.has(o.resultId))e.push(`${o.id}: result missing`);ref('sourceUnits',o.unitId,o.id);if(!Number.isFinite(o.value)||o.denominator===0)e.push(`${o.id}: invalid metric`);const record=d.results.find(r=>r.id===o.resultId),unit=maps.sourceUnits?.get(o.unitId);if(record?.metrics[0]?.value!==o.value||record?.metrics[0]?.unit!==o.unit)e.push(`${o.id}: mirrored measurement mismatch`);if(!(d.observationEvidence??[]).some(l=>l.resultId===o.resultId&&l.sourceVersionId===unit?.sourceVersionId&&l.reviewId===unit?.reviewId))e.push(`${o.id}: reviewed official observation missing`);}
 for(const c of d.comparisonSets??[])if((c.level==='matched'||c.level==='longitudinal')&&(!c.reviewId||!c.conditionsComplete))e.push(`${c.id}: unsupported comparison`);
 for(const c of d.mappingCorrections??[]){if(!d.protocolVariants?.some(v=>v.id===c.variantId))e.push(`${c.id}: unknown corrected variant`);ref('reviewSummaries',c.reviewId,c.id);if(!['withdraw','revise'].includes(c.action))e.push(`${c.id}: invalid mapping correction`);if(c.changes&&Object.keys(c.changes).some(k=>!['locator','name','protocolId','limitations','measurementTarget','riskAssociations','primaryDimension'].includes(k)))e.push(`${c.id}: forbidden mapping change`);}
 if(d.schemaVersion==='5.2')e.push(...validateDispositionLedger(d,maps));
 e.push(...validateLineage(d.results,d.evidenceLineage));const serialized=JSON.stringify(d);if(/\/Users\/|\/home\/|BEGIN (?:OPENSSH|RSA) PRIVATE KEY|"(?:privatePath|capture_path|capture_file|path)"\s*:/.test(serialized))e.push('private data in public projection');return e;}

/** Compare source-bound projection fields using the batch compiler's explicit normalization.
 * Legacy inputs may omit the uncertainty that this migration restores, but may not
 * supply contradictory uncertainty. Unlinked historical typed intervals are untouched.
 */
export function validateObservationProjection(result,o,{allowMissingUncertainty=false,resultCorrections=[]}={}){
 const e=[],hash=value=>digest(value??null),metric=result.metrics?.[0];
 if(!metric)return [`${result.id}: source measurement missing`];
 const derived=o.value===null&&Number.isFinite(o.numerator)&&Number.isFinite(o.denominator)&&o.denominator>0;
 const value=derived?Number((100*o.numerator/o.denominator).toFixed(2)):o.value;
 const unit=derived?'%':o.unit==='percent'?'%':o.unit||'source unit';
 const reportedUnit=o.transformation?.operation==='fraction-to-percent'?'fraction':o.unit;
 const transformation=derived?{kind:'percentage-from-counts',numerator:o.numerator,denominator:o.denominator,precision:2}:o.transformation??null;
 const qualifier=/greater|^>/.test(o.qualifier??'')?'greater-than':/less|^</.test(o.qualifier??'')?'less-than':/approx|about/i.test(o.qualifier??'')?'approximate':'exact';
 if(metric.value!==value||hash(result.reportedValue?.rawValue)!==hash(o.rawValue)||result.reportedValue?.numerator!==(o.numerator??null)||result.reportedValue?.denominator!==(o.denominator??null))e.push(`${result.id}: accepted measurement value mismatch`);
 if(result.reportedValue?.unit!==reportedUnit)e.push(`${result.id}: source reported unit mismatch`);
 if(metric.unit!==unit||hash(result.transformation)!==hash(transformation))e.push(`${result.id}: source measurement unit or transformation mismatch`);
 if(metric.qualifier!==qualifier)e.push(`${result.id}: source qualifier mismatch`);
 const correction=resultCorrections.find(c=>c.resultId===result.id&&c.review?.status==='accepted'&&c.locator&&c.reason?.en&&c.reason?.zh&&c.sourceIds?.includes(result.sourceId)&&Object.keys(c.changes??{}).length===1&&Object.hasOwn(c.changes,'trialCount'));
 if(result.trialCount!==(o.trials??null)&&(!correction||result.trialCount!==correction.changes.trialCount))e.push(`${result.id}: source trial count mismatch`);
 const uncertainty=observationUncertainty(o),interval=observationInterval(o);
 if(hash(metric.reportedUncertainty)!==hash(uncertainty)&&!(allowMissingUncertainty&&metric.reportedUncertainty==null&&uncertainty!==null))e.push(`${result.id}: reported uncertainty mismatch`);
 if((metric.interval??null)!==interval&&!(allowMissingUncertainty&&metric.interval==null&&interval!==null))e.push(`${result.id}: source uncertainty interval mismatch`);
 return e;
}

/** Schema 5.2 accounts for every accepted observation, including unplotted source values. */
function validateDispositionLedger(d,maps){
 const hash=value=>digest(value??null);
 const e=[],entries=d.observationDispositions,seen=new Set(),resultMap=new Map(d.results.map(r=>[r.id,r]));
 if(!Array.isArray(entries))return ['observationDispositions: missing schema5.2 accounting ledger'];
 for(const row of entries){
  const key=`${row.reviewId}|${row.observationId}`,review=maps.reviewSummaries?.get(row.reviewId),unit=maps.sourceUnits?.get(row.unitId),o=row.sourceObservation;
  if(seen.has(key))e.push(`${row.id}: duplicate disposition`);seen.add(key);
  if(!review?.approvedObservationIds?.includes(row.observationId)||unit?.reviewId!==row.reviewId||row.sourceVersionId!==review?.sourceVersionId||row.sourceVersionId!==unit?.sourceVersionId)e.push(`${row.id}: disposition review binding mismatch`);
  if(!row.id||!['published','deferred'].includes(row.disposition)||typeof row.reason!=='string'||!row.reason.trim())e.push(`${row.id}: invalid publication disposition or reason`);
  if(!o||o.id!==row.observationId||digest(o)!==row.sourceObservationHash){e.push(`${row.id}: accepted source value integrity mismatch`);continue;}
  e.push(...validateExtraction({unitId:row.unitId,contractVersion:review?.contractVersion,observations:[o]}));
  const links=(d.observationEvidence??[]).filter(l=>l.reviewId===row.reviewId&&l.observationId===row.observationId&&l.resultId);
  if(row.disposition==='deferred'){
   if(row.resultId!==null||links.length)e.push(`${row.id}: deferred disposition has a published result`);
   continue;
  }
  const result=resultMap.get(row.resultId);
  if(!result||links.length!==1||links[0].resultId!==row.resultId){e.push(`${row.id}: published disposition result mismatch`);continue;}
  const metric=result.metrics[0];
  e.push(...validateObservationProjection(result,o,{resultCorrections:d.monitoring?.resultCorrections??[]}));
  if(hash(result.sampleCounts)!==hash(observationCounts(o))||hash(result.sourceSemantics)!==hash(observationSemantics(o)))e.push(`${row.id}: source count or semantics mismatch`);
  for(const official of d.officialObservations??[])if(official.resultId===row.resultId){
   if(official.numerator!==(o.numerator??null)||official.denominator!==(o.denominator??null)||official.trials!==(o.trials??null)||hash(official.reportedValue)!==hash(result.reportedValue))e.push(`${official.id}: mirrored original counts or units mismatch`);
   if(digest(official.reportedUncertainty??null)!==digest(metric.reportedUncertainty??null)||official.interval!==metric.interval||hash(official.sampleCounts)!==hash(result.sampleCounts)||hash(official.sourceSemantics)!==hash(result.sourceSemantics))e.push(`${official.id}: mirrored uncertainty or source metadata mismatch`);
  }
 }
 for(const review of d.reviewSummaries??[])for(const id of review.approvedObservationIds??[])if(!seen.has(`${review.id}|${id}`))e.push(`${review.id}/${id}: accepted observation missing publication disposition`);
 for(const link of d.observationEvidence??[])if(link.resultId&&!seen.has(`${link.reviewId}|${link.observationId}`))e.push(`${link.id}: published observation missing disposition`);
 return e;
}
