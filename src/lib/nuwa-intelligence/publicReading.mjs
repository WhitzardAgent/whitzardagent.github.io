import release from '../../data/nuwa-index/release.json' with {type:'json'};
import bundle from '../../data/nuwa-index/reading/index.mjs';
import {digest} from './sourceVersions.mjs';
export const publicRelease=release;
export const publicReading=bundle;
export function publicEditionFor(catalogue){return catalogue.snapshotId===bundle.snapshotId?bundle:null;}
export function validatePublicReading(catalogue,edition=bundle,manifest=release){
 const errors=[];
 if(edition.snapshotId!==catalogue.snapshotId||manifest.snapshotId!==catalogue.snapshotId)errors.push('Published reading snapshot mismatch');
 if(digest(edition)!==manifest.readingEditionHash)errors.push('Published reading content hash mismatch');
 if(manifest.counts?.works!==catalogue.works.length||manifest.counts?.protocols!==catalogue.benchmarks.length||manifest.counts?.syntheses!==edition.analyses.length||manifest.counts?.recordObservations!==edition.works.flatMap(d=>d.observations??[]).length||(manifest.counts?.effectiveResults??manifest.counts?.rawResults)!==catalogue.results.length)errors.push('Published summary counts differ from the catalogue or reading edition');
 if(edition.publication?.state!=='published'||!edition.publication.authorizationReference)errors.push('Publication consent missing');
 for(const [key,expected]of [['works',catalogue.works],['protocols',catalogue.benchmarks]])if(edition[key].length!==expected.length||new Set(edition[key].map(r=>r.id)).size!==expected.length||expected.some(r=>!edition[key].some(p=>p.id===r.id)))errors.push(`Published ${key} coverage mismatch`);
 if(/\/Users\/|\/Downloads\/|BEGIN (?:RSA|OPENSSH) PRIVATE KEY|data-private-dossier|DRAFT_NUWA_/.test(JSON.stringify(edition)))errors.push('Private material in public reading edition');
 for(const d of [...edition.works,...edition.protocols,...edition.analyses,...edition.supplement.updates]){
  if(d.publication?.state!=='published'||!d.sourceRefs?.length)errors.push(`Publication or references missing: ${d.id}`);
  if(!d.review?.preparedFingerprint||d.sourceRefs.some(r=>!r.locator||!r.version))errors.push(`Evidence binding missing: ${d.id}`);
 }
 return errors;
}
