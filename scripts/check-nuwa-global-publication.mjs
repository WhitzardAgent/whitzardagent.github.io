import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {effectiveCatalogue} from '../src/lib/nuwa-intelligence/lineage.mjs';
import {dossierFingerprint} from '../src/lib/nuwa-intelligence/researchReading.mjs';
import {digest} from '../src/lib/nuwa-intelligence/sourceVersions.mjs';
import {validateCatalogue} from '../src/lib/nuwaIndex.mjs';
import {validatePublicReading} from '../src/lib/nuwa-intelligence/publicReading.mjs';
export function globalPublicationErrors(edition){
 const errors=[];const {contentHash,...body}=edition;
 if(contentHash!==digest(body))errors.push('Public edition hash mismatch');
 if(edition.publication?.state!=='published'||edition.publication.authorizationReference!=='user-authorized-global-index-publication-2026-10-29')errors.push('Publication authorization missing');
 if(edition.reviewedCandidateId!=='local-6efe31bc4a0c0f37')errors.push('Reviewed candidate mismatch');
 if(edition.candidateId!==edition.catalogue.snapshotId||edition.candidateId!==edition.reading.snapshotId||edition.candidateId!==edition.release.snapshotId)errors.push('Edition identity mismatch');
 if(digest(effectiveCatalogue(edition.validationCatalogue))!==digest(edition.catalogue))errors.push('Effective projection differs from validated raw catalogue');
 if(edition.release.counts.rawResults!==edition.validationCatalogue.results.length||edition.release.counts.effectiveResults!==edition.catalogue.results.length)errors.push('Raw/effective result counts mismatch');
 if(edition.release.catalogueHash!==digest(edition.catalogue))errors.push('Catalogue hash mismatch');
 errors.push(...validateCatalogue(edition.validationCatalogue),...validatePublicReading(edition.catalogue,edition.reading,edition.release));
 for(const w of edition.catalogue.works)if(w.localReviewBatchId)errors.push(`${w.id}: local-only publication marker retained`);
 for(const g of edition.catalogue.candidateMonitoringGroups??[])if(g.review?.status==='accepted')errors.push(`${g.id}: candidate review promoted`);
 for(const d of [...edition.reading.works,...edition.reading.protocols,...edition.reading.analyses]){
  if(d.review?.preparedFingerprint!==dossierFingerprint(edition.catalogue,d))errors.push(`${d.id}: source binding mismatch`);
  if(d.review?.independentEvidenceReview!=='pending-human-review'||d.review?.bilingualEditorialReview!=='pending-human-review')errors.push(`${d.id}: independent review must remain pending`);
  for(const o of d.observations??[])if(o.publication!=='published')errors.push(`${d.id}: source evidence not published`);
 }
 const ids=new Set(edition.catalogue.works.map(w=>w.id));for(const d of edition.scopeDispositions)if(ids.has(d.id))errors.push(`${d.id}: excluded work in current scope`);
 const serialized=JSON.stringify(edition);if(/\/Users\/|\/Downloads\/|BEGIN (?:RSA|OPENSSH) PRIVATE KEY|data-private-dossier|DRAFT_NUWA_/.test(serialized))errors.push('Private material in public bundle');
 return errors;
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1])){
 const file=process.argv[2]??'src/data/nuwa-index/public-editions/2026-10-29.1.json';const edition=JSON.parse(fs.readFileSync(file,'utf8')),errors=globalPublicationErrors(edition);
 const frozenFile=`src/data/nuwa-index/record-editions/${edition.candidateId}.json`;
 if(!fs.existsSync(frozenFile))errors.push('Published record editions missing');else {const frozen=JSON.parse(fs.readFileSync(frozenFile,'utf8'));if(frozen.snapshotId!==edition.candidateId||frozen.records.length!==edition.catalogue.works.length)errors.push('Frozen publication coverage mismatch');for(const record of frozen.records){const {contentHash,...payload}=record;if(digest(payload)!==contentHash||digest(record.work)!==digest(edition.catalogue.works.find(w=>w.id===record.work.id))||digest(record.readingDossier)!==digest(edition.reading.works.find(w=>w.id===record.work.id)))errors.push(`Frozen edition mismatch: ${record.work.id}`);}}
 if(errors.length){console.error(errors.join('\n'));process.exit(1);}console.log(`Global public edition ${edition.candidateId}: hashes, raw catalogue, reading, scope and publication states valid; independent evidence review remains pending.`);
}
