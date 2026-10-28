import fs from 'node:fs';
import path from 'node:path';
import {digest} from './sourceVersions.mjs';
import {publicEditionFor} from './publicReading.mjs';
import {assertPrivateRoot} from './privateStore.mjs';
export const readingSectionsContract=['question','method','finding','supports','limits','connections'];
const nativeRead=file=>fs.readFileSync(file,'utf8');
const dossierCache=new Map();
let supplementalDossiers=[],supplementalProtocols=[];
export function registerResearchSupplement(data){supplementalDossiers=data?.dossiers??[];supplementalProtocols=data?.protocols??[];}
const text=value=>typeof value==='string'?value.trim():'';
/** Availability is a content inventory, not scholarly quality or a human sign-off. */
export function readingStatus(work,{dossier}={}){
 const sections=readingSectionsContract.map(id=>({id,available:['en','zh'].every(locale=>{const value=text(work.note?.[id]?.[locale]);return value&&value!==text(work.summary?.[locale]);}),review:work.noteStatus?.[id]??'not-recorded'}));
 const hasNote=sections.some(s=>s.available),pending=dossier?.review?.state==='review-pending';
 const id=pending?'review-pending':dossier?.publication?.state==='published'?'published-note':dossier?'local-review':hasNote?'source-note':'bibliographic';
 const labels={'published-note':{en:'NUWA research note · independent review pending',zh:'NUWA 研究解读 · 独立复核待完成'},bibliographic:{en:'Bibliographic record',zh:'书目记录'},'source-note':{en:'Existing source note',zh:'既有来源笔记'},'local-review':{en:'Editorial draft · review pending',zh:'编辑草稿 · 待复核'},'review-pending':{en:'Source changed · review pending',zh:'来源有变化 · 待复核'}};
 return {id,label:labels[id],hasSubstantiveContent:hasNote||Boolean(dossier?.en?.takeaway&&dossier?.zh?.takeaway),sections,baselineComplete:false,reviewPending:pending};
}
export function assertionState(assertion,currentFingerprint){
 if(assertion.review?.state!=='reviewed')return assertion.review?.state??'draft';
 return assertion.review.approvedFingerprint&&assertion.review.approvedFingerprint===currentFingerprint?'reviewed':'review-pending';
}
export function validateAssertion(assertion,catalogue){
 const errors=[],kinds=['source-finding','nuwa-calculation','nuwa-interpretation','recommendation'];
 if(!assertion.id||!kinds.includes(assertion.kind))errors.push('Assertion identity or kind missing');
 if(!assertion.evidenceRefs?.length)errors.push('Source references required');
 for(const ref of assertion.evidenceRefs??[])if(!ref.locator||!ref.version)errors.push('Exact source version and locator required');
 if(assertion.kind==='nuwa-calculation'&&(!assertion.resultIds?.length||!assertion.calculation?.operation))errors.push('Calculation requires a complete evidence set and operation');
 for(const id of assertion.resultIds??[])if(!catalogue.results.some(r=>r.id===id))errors.push(`Unknown evidence result ${id}`);
 return errors;
}
export function dossierFingerprint(catalogue,dossier){const resource=dossier.reviewedResource??dossier.sourceArtifact;return digest({refs:(dossier.sourceRefs??[]).map(ref=>({sourceId:ref.sourceId,url:ref.url,version:ref.version,locator:ref.locator,artifactSha256:ref.artifactSha256,source:catalogue.sources.find(s=>s.id===ref.sourceId)??null,sourceVersions:(catalogue.sourceVersions??[]).filter(v=>v.sourceId===ref.sourceId)})),resource:resource?{url:resource.url,sha256:resource.sha256,version:resource.version,captureFormat:resource.captureFormat}:null});}
export function synthesisEvidenceFingerprint(catalogue,analysis){const results=(analysis.resultIds??[]).map(id=>({id,result:catalogue.results.find(r=>r.id===id)??null})),sourceIds=new Set(results.map(r=>r.result?.sourceId)),versionIds=new Set(results.map(r=>r.result?.sourceVersionId));return digest({results,sourceVersions:(catalogue.sourceVersions??[]).filter(v=>sourceIds.has(v.sourceId)||versionIds.has(v.id)),group:analysis.groupId?catalogue.monitoring?.groups.find(g=>g.id===analysis.groupId)??null:null});}
export function loadResearchDossiers(catalogue,environment=process.env,read=nativeRead){
 if(environment.NUWA_LOCAL_REVIEW!=='1'||!environment.NUWA_DOSSIER_ROOT)return (publicEditionFor(catalogue)?.works??[]).map(d=>({...d,review:{...d.review,state:d.review.preparedFingerprint!==dossierFingerprint(catalogue,d)?'review-pending':'published-note'}}));
 const root=assertPrivateRoot(environment.NUWA_DOSSIER_ROOT),file=path.join(root,'dossiers.json'),key=read===nativeRead?`${file}|${fs.statSync(file).mtimeMs}|${catalogue.snapshotId}`:null;let data=key?dossierCache.get(key):null;if(!data){data=JSON.parse(read(file));if(key){dossierCache.clear();dossierCache.set(key,data);}}
 if(data.snapshotId!==catalogue.snapshotId)throw Error('Research dossier snapshot does not match catalogue');
 const works=new Map((data.works??[]).map(d=>[d.id,d]));for(const d of supplementalDossiers)works.set(d.id,d);
 return [...works.values()].filter(d=>catalogue.works.some(w=>w.id===d.id)&&d.en?.takeaway&&d.zh?.takeaway).map(d=>({...d,review:{...d.review,state:d.review?.state==='review-pending'||d.review?.preparedFingerprint&&d.review.preparedFingerprint!==dossierFingerprint(catalogue,d)?'review-pending':'local-review'}}));
}
export function loadProtocolDossiers(catalogue,environment=process.env){
 if(environment.NUWA_LOCAL_REVIEW!=='1'||!environment.NUWA_DOSSIER_ROOT)return (publicEditionFor(catalogue)?.protocols??[]).map(p=>({...p,review:{...p.review,state:p.review.preparedFingerprint!==dossierFingerprint(catalogue,p)?'review-pending':'published-note'}}));
 const root=assertPrivateRoot(environment.NUWA_DOSSIER_ROOT),file=path.join(root,'protocols.json');
 if(!fs.existsSync(file))return [];
 const data=JSON.parse(fs.readFileSync(file,'utf8'));if(data.snapshotId!==catalogue.snapshotId)throw Error('Protocol dossier snapshot mismatch');const profiles=new Map((data.protocols??[]).map(p=>[p.id,p]));for(const p of supplementalProtocols)profiles.set(p.id,p);return [...profiles.values()].map(p=>({...p,review:{...p.review,state:p.review?.preparedFingerprint&&p.review.preparedFingerprint!==dossierFingerprint(catalogue,p)?'review-pending':'local-review'}}));
}
export function readingManifest(catalogue,{dossiers=[]}={}){
 return {schemaVersion:'nuwa-reading-1',snapshotId:catalogue.snapshotId,generatedOn:catalogue.verifiedOn,qualityRule:'Availability and section disposition do not establish evidence verification, editorial approval or experimental replication.',works:catalogue.works.map(work=>({id:work.id,sourceId:work.sourceId,...readingStatus(work,{dossier:dossiers.find(d=>d.id===work.id)}),sourceReview:work.localReviewBatchId?'local-selected-original-sections':'existing-catalogue-scope',publicationState:dossiers.find(d=>d.id===work.id)?.publication?.state??'bibliographic',editorialApproval:dossiers.find(d=>d.id===work.id)?.review?.bilingualEditorialReview??'not-recorded',publication:work.publicationDate,sourceLocations:work.noteSourceLocator?[work.noteSourceLocator]:[]})),protocols:catalogue.benchmarks.map(b=>({id:b.id,sourceId:b.sourceId,version:b.version,review:'measurement-profile',structuredResults:catalogue.results.filter(r=>r.benchmarkId===b.id).length,missingReview:['construct-validity','scoring-audit','representative-case','independent-method-review']}))};
}

export function loadResearchSyntheses(catalogue,environment=process.env){
 if(environment.NUWA_LOCAL_REVIEW!=='1'||!environment.NUWA_DOSSIER_ROOT)return (publicEditionFor(catalogue)?.analyses??[]).map(a=>({...a,status:a.review.preparedFingerprint!==dossierFingerprint(catalogue,a)||a.completeEvidenceBinding.resultFingerprint!==synthesisEvidenceFingerprint(catalogue,a)?'review-pending':'published-note'}));
 const root=assertPrivateRoot(environment.NUWA_DOSSIER_ROOT),data=JSON.parse(fs.readFileSync(path.join(root,'syntheses.json'),'utf8'));
 if(data.snapshotId!==catalogue.snapshotId)throw Error('Synthesis snapshot mismatch');
 return (data.analyses??[]).map(a=>({...a,status:!a.review?.preparedFingerprint||a.review.preparedFingerprint!==dossierFingerprint(catalogue,a)||!a.completeEvidenceBinding?.resultFingerprint||a.completeEvidenceBinding.resultFingerprint!==synthesisEvidenceFingerprint(catalogue,a)?'review-pending':'local-review'}));
}
