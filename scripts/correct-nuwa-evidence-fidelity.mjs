/** Additive schema 5.2 source-metadata correction. Historical snapshot bytes are never rewritten.
 * Original reviewer decisions and accepted source observations are immutable inputs;
 * the publication ledger records deferral without changing evidence approval.
 */
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {packageHash,validateExtraction,validateReview} from '../src/lib/nuwa-intelligence/extraction.mjs';
import {digest,makeSourceVersion,sourceArtifactsForPackage} from '../src/lib/nuwa-intelligence/sourceVersions.mjs';
import {observationCounts,observationSample,observationSemantics,observationUncertainty,observationInterval} from '../src/lib/nuwa-intelligence/sourceObservation.mjs';
import {monitorBindingHash} from '../src/lib/nuwa-intelligence/monitoringIntegrity.mjs';
import {validateObservationProjection} from '../src/lib/nuwa-intelligence/publication.mjs';
import {validateCatalogue} from '../src/lib/nuwaIndex.mjs';
export const selectedSourceUnits=['cybergym-official','exploitgym-official','secbench-pro-official','agentcyberrange-official','neo-kimi-k3','neo-deepseek-v4','neo-glm52','saferai-glm52','caisi-deepseek-2025','caisi-deepseek-v4','kimi-k3-developer','glm52-developer','deepseek-v4-developer'];
export function dispositionForObservation(pkg,review,observation,link){
 const reason=link?'Retained existing reviewed publication.':observation.eligibility!=='eligible'?`Accepted by reviewer; publication deferred because extraction eligibility is ${observation.eligibility}.`:!Number.isFinite(observation.value)&&!(Number.isFinite(observation.numerator)&&observation.denominator>0)?'Accepted by reviewer; publication deferred because no finite numerical measurement is available.':!review.protocolByObservation?.[observation.id]?'Accepted by reviewer; publication deferred because protocol identity is unresolved.':'Accepted by reviewer; no existing published result is linked. Requires a separate publication decision.';
 return {id:`disposition-${pkg.unitId}-${digest(observation.id).slice(0,12)}`,unitId:pkg.unitId,observationId:observation.id,disposition:link?'published':'deferred',reason,resultId:link?.resultId??null,sourceObservation:structuredClone(observation),sourceObservationHash:digest(observation)};
}
export function correctEvidenceFidelity(input,packages,{snapshotId='2026-10-27.2',verifiedOn='2026-10-27'}={}){
 const d=structuredClone(input),previousSnapshotId=d.snapshotId,resultIds=new Set(),reviewIds=[];
 if(!['5.1','5.2'].includes(d.schemaVersion))throw Error('Source fidelity migration requires schema 5.1 or 5.2');
 if(packages.length!==selectedSourceUnits.length||new Set(packages.map(x=>x.package.unitId)).size!==packages.length||selectedSourceUnits.some(id=>!packages.some(x=>x.package.unitId===id)))throw Error('Exact thirteen compiler-selected source packages required');
 d.observationDispositions=[];
 for(const {package:p,review} of packages){
  const unit=d.sourceUnits.find(u=>u.id===p.unitId);if(!unit)throw Error(`${p.unitId}: source unit missing`);
  const errors=[...validateExtraction(p),...validateReview(p,review,unit.sourceVersionId)];if(errors.length)throw Error(`${p.unitId}: ${errors.join('; ')}`);
  const receipt=d.reviewSummaries.find(r=>r.id===unit.reviewId);
  if(!receipt||receipt.packageHash!==packageHash(p)||receipt.status!==review.status||receipt.reviewer!==review.reviewer)throw Error(`${p.unitId}: original review receipt mismatch`);
  receipt.approvedObservationIds=[...review.approvedObservationIds];receipt.approvedClaimIds=[...review.approvedClaimIds];reviewIds.push(receipt.id);
  for(const id of review.approvedObservationIds){
   const o=p.observations.find(o=>o.id===id),links=d.observationEvidence.filter(l=>l.reviewId===unit.reviewId&&l.observationId===id&&l.resultId);
   if(links.length>1)throw Error(`${p.unitId}/${id}: ambiguous publication link`);
   const link=links[0],entry=dispositionForObservation(p,review,o,link);Object.assign(entry,{sourceVersionId:unit.sourceVersionId,reviewId:unit.reviewId});d.observationDispositions.push(entry);
   if(!link)continue;
   const result=d.results.find(r=>r.id===link.resultId);if(!result)throw Error(`${p.unitId}/${id}: linked result missing`);
   const projectionErrors=validateObservationProjection(result,o,{allowMissingUncertainty:input.schemaVersion==='5.1',resultCorrections:input.monitoring?.resultCorrections??[]});if(projectionErrors.length)throw Error(projectionErrors.join('; '));
   // Keep all numerical values, transformations, raw tokens, IDs and existing numerical intervals.
   result.sampleCounts=observationCounts(o);result.sourceSemantics=observationSemantics(o);
   if(Number.isFinite(o.denominator))result.sampleSize=observationSample(o);
   const uncertainty=observationUncertainty(o);
   if(uncertainty){result.metrics[0].reportedUncertainty=uncertainty;result.metrics[0].interval=observationInterval(o);}
   for(const official of d.officialObservations.filter(x=>x.resultId===result.id))Object.assign(official,{sampleCounts:structuredClone(result.sampleCounts),sourceSemantics:structuredClone(result.sourceSemantics),reportedUncertainty:uncertainty,interval:result.metrics[0].interval});
   resultIds.add(result.id);
  }
 }
 d.schemaVersion='5.2';d.snapshotId=snapshotId;d.verifiedOn=verifiedOn;
 d.sourceMetadataCorrections=[...(d.sourceMetadataCorrections??[]),{id:`source-fidelity-${snapshotId.replaceAll('.','-')}`,kind:'source-metadata',snapshotId,previousSnapshotId,description:{en:'Restored source-reported uncertainty and distinct count semantics; restored original evidence approvals and recorded publication/deferment separately. Numerical measurements and historical snapshots are unchanged.',zh:'恢复来源报告的不确定性和独立计数字段；恢复原始证据复核决定，并单独登记发布或暂缓处置。数值测量及历史快照保持原样。'},resultIds:[...resultIds],reviewIds}];
 // Rebind deterministic source-projection groups only. Existing analysis assertions keep their
 // dependencies and therefore become stale; this correction grants no editorial approval.
 for(const group of d.monitoring?.groups??[])group.review.dependencyHash=monitorBindingHash(d,group);
 return d;
}
export async function loadReviewedPackages(catalogue,privateRoot){
 if(!path.isAbsolute(privateRoot))throw Error('Absolute private source root required');
 const root=path.join(privateRoot,'iteration-2026-10-26'),packages=[];
 for(const unitId of selectedSourceUnits){
  const unit=catalogue.sourceUnits.find(u=>u.id===unitId);if(!unit)throw Error(`${unitId}: missing source unit`);
  const dir=path.join(root,unitId),p=JSON.parse(await fs.readFile(path.join(dir,unit.kind==='official'?'candidate-package.json':'package.json'),'utf8')),review=JSON.parse(await fs.readFile(path.join(dir,'review.json'),'utf8'));
  const v=makeSourceVersion({sourceId:p.sourceId,documentId:catalogue.sourceVersions.find(v=>v.id===unit.sourceVersionId)?.documentId,contractVersion:p.contractVersion,artifacts:sourceArtifactsForPackage(p)});
  if(v.id!==unit.sourceVersionId)throw Error(`${unitId}: source version changed`);
  for(const artifact of sourceArtifactsForPackage(p))if(artifact.path&&createHash('sha256').update(await fs.readFile(artifact.path)).digest('hex')!==artifact.sha256)throw Error(`${unitId}: captured artifact changed`);
  packages.push({package:p,review});
 }
 return packages;
}
async function main(){
 const dataPath=path.resolve('src/data/nuwa-index/catalogue.json'),d=JSON.parse(await fs.readFile(dataPath,'utf8'));
 const privateRoot=process.env.NUWA_PRIVATE_ROOT;if(!privateRoot)throw Error('NUWA_PRIVATE_ROOT required');
 const next=correctEvidenceFidelity(d,await loadReviewedPackages(d,privateRoot)),errors=validateCatalogue(next);if(errors.length)throw Error(errors.join('\n'));
 const snapshot=path.resolve(`src/data/nuwa-index/snapshots/${next.snapshotId}.json`),bytes=JSON.stringify(next,null,2)+'\n';
 await fs.writeFile(snapshot,bytes,{flag:'wx'});await fs.writeFile(dataPath,bytes);
 console.log(JSON.stringify({snapshot:next.snapshotId,accepted:next.observationDispositions.length,published:next.observationDispositions.filter(o=>o.disposition==='published').length,deferred:next.observationDispositions.filter(o=>o.disposition==='deferred').length}));
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))await main();
