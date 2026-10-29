import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {digest} from '../src/lib/nuwa-intelligence/sourceVersions.mjs';
import {dossierFingerprint,synthesisEvidenceFingerprint} from '../src/lib/nuwa-intelligence/researchReading.mjs';
import {validateCatalogue} from '../src/lib/nuwaIndex.mjs';
export const publicationVersion='2026-10-29.1';
export const reviewedCandidateId='local-6efe31bc4a0c0f37';
const consent={state:'published',publishedOn:'2026-10-29',authorizationReference:'user-authorized-global-index-publication-2026-10-29',reviewedCandidateId};
const blocked=/\/Users\/|\/Downloads\/|BEGIN (?:RSA|OPENSSH) PRIVATE KEY|data-private-dossier|DRAFT_NUWA_/;
function removePrivate(value){
 if(Array.isArray(value))return value.map(removePrivate);
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).filter(([key])=>!['path','textPath','internalReviewLog','cachePath'].includes(key)).map(([key,v])=>[key,removePrivate(v)]));
 return typeof value==='string'?value.replaceAll(reviewedCandidateId,publicationVersion):value;
}
function publishReading(record,catalogue){
 record.publication={...consent};
 record.review={...record.review,state:record.review?.state==='review-pending'?'review-pending':'published-note',independentEvidenceReview:'pending-human-review',bilingualEditorialReview:'pending-human-review'};
 record.review.preparedFingerprint=dossierFingerprint(catalogue,record);
 for(const o of record.observations??[])o.publication='published';
 for(const s of record.supplementalSources??[])publishReading(s,catalogue);
}
export function restoreValidationCatalogue(catalogue,base){
 const raw=structuredClone(catalogue),sources=new Set(raw.sources.map(s=>s.id));
 const resultIds=new Set(raw.results.map(r=>r.id));
 const neededResultIds=new Set((raw.evidenceLineage??[]).flatMap(e=>[e.from,e.to]));
 for(const r of base.results)if(!resultIds.has(r.id)&&neededResultIds.has(r.id)&&sources.has(r.sourceId)){raw.results.push(structuredClone(r));resultIds.add(r.id);}
 const variantIds=new Set(raw.protocolVariants.map(v=>v.id)),neededVariantIds=new Set((raw.mappingCorrections??[]).map(c=>c.variantId));
 for(const v of base.protocolVariants)if(!variantIds.has(v.id)&&neededVariantIds.has(v.id)&&sources.has(v.sourceId)){raw.protocolVariants.push(structuredClone(v));variantIds.add(v.id);}
 return raw;
}
export function buildPublicEdition(candidate,base){
 if(candidate.candidateId!==reviewedCandidateId)throw Error('Only the explicitly reviewed candidate may be published');
 const result=removePrivate(candidate);result.schemaVersion='nuwa-global-public-edition-1';result.candidateId=publicationVersion;result.reviewedCandidateId=reviewedCandidateId;result.publication={...consent};
 const {catalogue,reading}=result;catalogue.snapshotId=publicationVersion;reading.snapshotId=publicationVersion;catalogue.publication={...consent,baseSnapshotId:candidate.baseSnapshotId};reading.publication={...consent};reading.publishedOn=consent.publishedOn;
 for(const w of catalogue.works)if(w.localReviewBatchId){w.contentEditionId=publicationVersion;delete w.localReviewBatchId;}
 for(const r of catalogue.results)if(r.localReview){r.sourceTranscriptionPendingIndependentReview=true;r.publication='published';delete r.localReview;}
 for(const group of catalogue.candidateMonitoringGroups??[]){group.review={...group.review,status:'source-transcribed-unreviewed',independentEvidenceReview:'pending-human-review'};group.publication={...consent};}
 for(const d of [...reading.works,...reading.protocols,...reading.analyses,...reading.supplement.updates])publishReading(d,catalogue);
 for(const a of reading.analyses)if(a.completeEvidenceBinding)a.completeEvidenceBinding.resultFingerprint=synthesisEvidenceFingerprint(catalogue,a);
 reading.supplement.publication={...consent};
 const workIds=new Set(catalogue.works.map(w=>w.id)),protocolIds=new Set(catalogue.benchmarks.map(p=>p.id));
 for(const key of ['workIds','dossierIds'])reading.supplement[key]=(reading.supplement[key]??[]).filter(id=>workIds.has(id));
 reading.supplement.protocolIds=(reading.supplement.protocolIds??[]).filter(id=>protocolIds.has(id));
 reading.supplement.updates=reading.supplement.updates.filter(d=>workIds.has(d.id));
 for(const p of [...result.publications,...result.opinions]){p.publication={...consent};p.review={independentEvidenceReview:'pending-human-review',bilingualEditorialReview:'pending-human-review'};for(const o of p.observations??[])o.publication='published';}
 for(const doc of result.documents)doc.publication='published';
 result.release={schemaVersion:'nuwa-global-public-release-1',snapshotId:publicationVersion,publishedOn:consent.publishedOn,publication:{...consent},readingEditionHash:digest(reading),catalogueHash:digest(catalogue),counts:{works:catalogue.works.length,protocols:catalogue.benchmarks.length,syntheses:reading.analyses.length,opinions:result.opinions.length,recordObservations:reading.works.flatMap(w=>w.observations??[]).length,rawResults:catalogue.results.length},changes:{en:'Publish the global research reading and evidence workspaces, seven new protocol profiles, condition-annotated charts, authored technical perspectives, source channels and basic global search. Source transcriptions and independent evidence review remain distinct.',zh:'发布全球研究阅读与证据工作台、七项新增协议档案、条件注释图表、署名技术观点、来源渠道及基础全局检索。来源转录与独立证据复核继续分别记录。'},review:{independentEvidenceReview:'pending-human-review',bilingualEditorialReview:'pending-human-review'}};
 result.validationCatalogue=restoreValidationCatalogue(catalogue,base);
 result.release.counts.effectiveResults=catalogue.results.length;result.release.counts.rawResults=result.validationCatalogue.results.length;result.release.resultCountSemantics='Current exports use effective results; rawResults includes the retained corrected record in validationCatalogue.';
 const errors=validateCatalogue(result.validationCatalogue);if(errors.length)throw Error('Publication raw catalogue validation failed:\n'+errors.join('\n'));
 if(blocked.test(JSON.stringify(result)))throw Error('Private material in public edition');
 result.contentHash=digest(result);return result;
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1])){
 const source=process.argv[2];if(!source)throw Error('Pass the private fixed candidate JSON');
 const base=JSON.parse(fs.readFileSync('src/data/nuwa-index/catalogue.json','utf8')),candidate=JSON.parse(fs.readFileSync(source,'utf8'));
 const edition=buildPublicEdition(candidate,base);const out=`src/data/nuwa-index/public-editions/${publicationVersion}.json`;fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,JSON.stringify(edition)+'\n');console.log(JSON.stringify({file:out,contentHash:edition.contentHash,counts:edition.release.counts,validation:'complete raw catalogue passed; effective projection retained separately'}));
}
