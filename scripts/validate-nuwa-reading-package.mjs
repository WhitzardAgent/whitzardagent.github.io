import fs from 'node:fs';
import path from 'node:path';
import {digest} from '../src/lib/nuwa-intelligence/sourceVersions.mjs';
import {dossierFingerprint,synthesisEvidenceFingerprint} from '../src/lib/nuwa-intelligence/researchReading.mjs';
import {assertPrivateRoot} from '../src/lib/nuwa-intelligence/privateStore.mjs';
const root=assertPrivateRoot(process.env.NUWA_DOSSIER_ROOT),data=JSON.parse(fs.readFileSync(new URL('../src/data/nuwa-index/catalogue.json',import.meta.url))),docs=JSON.parse(fs.readFileSync(path.join(root,'dossiers.json'))),profiles=JSON.parse(fs.readFileSync(path.join(root,'protocols.json'))),syntheses=JSON.parse(fs.readFileSync(path.join(root,'syntheses.json'))),errors=[];
const duplicate=rows=>new Set(rows.map(r=>r.id)).size!==rows.length;
for(const [name,payload,rows,expected]of [['dossiers',docs,docs.works,data.works],['protocols',profiles,profiles.protocols,data.benchmarks]]){
 if(rows.length!==expected.length)errors.push(`${name}: record count mismatch`);if(payload.snapshotId!==data.snapshotId)errors.push(`${name}: snapshot mismatch`);if(duplicate(rows))errors.push(`${name}: duplicate IDs`);for(const record of expected)if(!rows.some(r=>r.id===record.id))errors.push(`${name}: missing ${record.id}`);
}
const written=docs.works.filter(d=>d.en?.takeaway||d.zh?.takeaway);
for(const work of written){
 if(work.review.preparedFingerprint!==dossierFingerprint(data,work))errors.push(`${work.id}: stale source reading fingerprint`);const resource=work.reviewedResource??work.sourceArtifact;if(resource?.sha256)for(const ref of work.sourceRefs??[])if(ref.url===resource.url&&!ref.version?.includes(resource.sha256))errors.push(`${work.id}: actual reading artifact not bound to source reference`);
 if(work.review?.state!=='local-review'||work.review?.editorialApproval!=='pending-human-review')errors.push(`${work.id}: authored draft must remain pending human review`);
 if(!work.sourceRefs?.length||work.sourceRefs.some(r=>!r.locator||!r.version))errors.push(`${work.id}: precise versioned source reference required`);
 for(const locale of ['en','zh'])for(const key of ['takeaway','question','design','findings','interpretation','limits','decisionRelevance']){const value=work[locale]?.[key];if(!value||Array.isArray(value)&&!value.length)errors.push(`${work.id}/${locale}: missing ${key}`);}
}
const catalogueSha=digest(fs.readFileSync(new URL('../src/data/nuwa-index/catalogue.json',import.meta.url),'utf8'));
for(const a of syntheses.analyses){if(a.review?.preparedFingerprint!==dossierFingerprint(data,a)||a.completeEvidenceBinding?.resultFingerprint!==synthesisEvidenceFingerprint(data,a))errors.push(`${a.id}: stale source/result dependencies`);if(a.completeEvidenceBinding?.catalogueSnapshotId!==data.snapshotId||a.completeEvidenceBinding?.catalogueSha256!==catalogueSha)errors.push(`${a.id}: stale complete evidence binding`);if(a.snapshotId!==data.snapshotId||a.status!=='local-review')errors.push(`${a.id}: invalid draft binding`);for(const f of a.findings??[]){for(const id of f.resultIds??[])if(!a.resultIds.includes(id)||!data.results.some(r=>r.id===id))errors.push(`${a.id}: incomplete/unknown claim evidence ${id}`);if(!f.assertionKind)errors.push(`${a.id}: assertion kind missing`);}}
const deception=syntheses.analyses.find(a=>a.id==='analysis-deception-2026-10-26');if(deception){const bound=deception.findings.find(f=>f.resultIds.length===36)?.resultIds??[],rows=data.results.filter(r=>bound.includes(r.id));if(rows.length!==36||rows.filter(r=>r.metrics[0].value===0).length!==31||Math.min(...rows.map(r=>r.metrics[0].value))!==0||Math.max(...rows.map(r=>r.metrics[0].value))!==57)errors.push('Deception aggregate does not match its complete evidence set');}
const report={snapshotId:data.snapshotId,works:docs.works.length,preparedBilingualDrafts:written.length,protocols:profiles.protocols.length,syntheses:syntheses.analyses.length,errors,scope:'Structural and arithmetic checks only; this is not human editorial approval.'};fs.writeFileSync(path.join(root,'package-validation.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));if(errors.length)process.exitCode=1;
