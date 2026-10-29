import fs from 'node:fs';
import path from 'node:path';
import {effectiveCatalogue} from './lineage.mjs';
import {validateCatalogue} from '../nuwaIndex.mjs';
import {canonicalDocumentId,digest,makeSourceVersion} from './sourceVersions.mjs';
import {verifyCapturedPackages,excludedWorks} from './researchCandidate.mjs';
const scalar=v=>Array.isArray(v)?v.join(' '):typeof v==='string'?v:'';
const T=(en,zh=en)=>({en:scalar(en),zh:scalar(zh)});
const publicData=v=>Array.isArray(v)?v.map(publicData):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).filter(([k])=>!['path','textPath'].includes(k)).map(([k,x])=>[k,publicData(x)])):v;
const accepted=p=>['local-review-candidate','candidate-local-review','existing-work-enrichment-candidate'].includes(p.disposition);
const identity=url=>{const id=canonicalDocumentId(url);return id.startsWith('arxiv:')?id.replace(/v\d+$/,''):id.replace(/^https?:\/\/(?:dx\.)?doi.org\//,'doi:').toLowerCase();};
export function loadGlobalPackages(root=process.env.NUWA_GLOBAL_RESEARCH_ROOT){
 if(!root)return null;
 const packages=[];
 for(const lane of ['vendors','labs','academic']){const rollout=path.join(root,lane,'rollout.json');const file=fs.existsSync(rollout)?rollout:path.join(root,lane,'packages.json');const d=JSON.parse(fs.readFileSync(file,'utf8'));packages.push(...(Array.isArray(d)?d:d.packages));}
 verifyCapturedPackages(packages);for(const p of packages){if(p.fullSource)verifyCapturedPackages([{id:p.id,source:p.fullSource}]);for(const f of p.originalFigures??[])verifyCapturedPackages([{id:p.id,source:f}]);}return packages;
}
export function loadChannelScans(root=process.env.NUWA_GLOBAL_RESEARCH_ROOT){
 if(!root)return [];const file=path.join(root,'inventory-rescan.json');if(!fs.existsSync(file))return [];
 return JSON.parse(fs.readFileSync(file,'utf8')).rows.filter(r=>r.collection==='signals').map(r=>({id:r.id,url:r.url,status:r.status,checkedAt:r.checkedAt??null,scope:r.captureScope??'Retrieval failed; no source reading recorded'}));
}
export function assembleCurrentEdition(base,reading,packages,channels=[]){
 const catalogue=structuredClone(base),edition=structuredClone(reading);
 const removed=catalogue.works.filter(w=>excludedWorks.includes(w.id)),removedIds=new Set(removed.map(w=>w.id)),removedSources=new Set(removed.map(w=>w.sourceId));
 catalogue.works=catalogue.works.filter(w=>!removedIds.has(w.id));
 const shared=new Set(catalogue.works.flatMap(w=>w.protocolIds??[])),removedProtocols=new Set(removed.flatMap(w=>w.protocolIds??[]).filter(id=>!shared.has(id)));
 catalogue.benchmarks=catalogue.benchmarks.filter(b=>!removedProtocols.has(b.id));
 catalogue.results=catalogue.results.filter(r=>!removedProtocols.has(r.benchmarkId)&&!removedSources.has(r.sourceId));
 catalogue.sources=catalogue.sources.filter(s=>!removedSources.has(s.id));if(catalogue.sourceVersions)catalogue.sourceVersions=catalogue.sourceVersions.filter(v=>!removedSources.has(v.sourceId));
 catalogue.questions=(catalogue.questions??[]).map(q=>{const sourceIds=(q.sourceIds??[]).filter(id=>!removedSources.has(id));return {...q,sourceIds:sourceIds.length?sourceIds:[...new Set(catalogue.benchmarks.filter(b=>b.links?.some(l=>l.questionId===q.id)).map(b=>b.sourceId))]};});
 const resultIds=new Set(catalogue.results.map(r=>r.id));
 for(const key of ['relations'])catalogue[key]=(catalogue[key]??[]).filter(r=>!removedIds.has(r.from)&&!removedIds.has(r.to));
 if(catalogue.monitoring)catalogue.monitoring.benchmarkSelections=(catalogue.monitoring.benchmarkSelections??[]).filter(s=>!removedProtocols.has(s.benchmarkId));
 if(catalogue.monitoring)catalogue.monitoring.groups=catalogue.monitoring.groups.filter(g=>!removedProtocols.has(g.benchmarkId)).map(g=>({...g,bindings:g.bindings.filter(b=>resultIds.has(b.resultId))}));
 for(const key of ['charts','figures','visualAudits'])if(catalogue[key])catalogue[key]=catalogue[key].filter(v=>!removedProtocols.has(v.protocolId));
 if(catalogue.protocolVariants)catalogue.protocolVariants=catalogue.protocolVariants.filter(v=>!removedProtocols.has(v.benchmarkId)&&!removedSources.has(v.sourceId));
 edition.works=edition.works.filter(w=>!removedIds.has(w.id));edition.protocols=edition.protocols.filter(p=>!removedProtocols.has(p.id));edition.analyses=edition.analyses.filter(a=>!(a.sourceIds??[]).some(s=>removedSources.has(s)));
 const opinions=[],publications=[],changes=[];
 for(const p of packages.filter(accepted)){
  const existing=catalogue.works.find(w=>w.id===p.id||w.originalUrl&&identity(w.originalUrl)===identity(p.url));
  const id=existing?.id??p.id,sourceId=existing?.sourceId??p.id;
  const note={question:T(p.en.question,p.zh.question),method:T(p.en.design,p.zh.design),finding:T(p.en.findings??p.en.finding,p.zh.findings??p.zh.finding),limits:T(p.en.limits,p.zh.limits),supports:null,connections:null};
  if(!existing){
   catalogue.sources.push({id:sourceId,title:p.title,url:p.url,version:p.source.sha256,publicationDate:p.date??null,verifiedOn:p.source.capturedAt?.slice(0,10)??base.verifiedOn,type:'research',documentId:identity(p.url)});
   catalogue.works.push({id,title:p.title,aliases:p.aliases??[],authors:p.authors??[],primaryFunction:p.kind==='opinion'?'governance':p.kind==='benchmark'?'evaluation':'discovery',secondaryFunctions:[],kind:p.kind==='benchmark'?'benchmark':p.kind==='opinion'?'method':'study',sourceId,attributionSourceId:sourceId,originalUrl:p.url,publicationDate:p.date??null,updatedOn:p.source.capturedAt?.slice(0,10)??base.verifiedOn,areas:p.areas??[],protocolIds:[],contributions:[],resources:[],summary:note.finding,scopeNote:note.limits,note,tags:[],localReviewBatchId:'global-research-2026-10-29',noteSourceLocator:(p.source.locators??[]).join('; ')});
  }
  let sourceVersionId=null;
  if(/^[a-f0-9]{64}$/.test(p.source.sha256)){
   const artifacts=[{role:'document',url:p.url,sha256:p.source.sha256,capturedAt:p.source.capturedAt}];if(p.fullSource)artifacts.push({role:'document',url:p.fullSource.url,sha256:p.fullSource.sha256,capturedAt:p.fullSource.capturedAt});for(const f of p.originalFigures??[])artifacts.push({role:'data',url:f.url,sha256:f.sha256,capturedAt:f.capturedAt});
   const version=makeSourceVersion({sourceId,documentId:identity(p.url),artifacts,publicationDate:p.date??null,availabilityBasis:'unknown'});sourceVersionId=version.id;catalogue.sourceVersions??=[];if(!catalogue.sourceVersions.some(v=>v.id===version.id))catalogue.sourceVersions.push(version);
  }
  const mapped={asb:{area:'cybersecurity',dimension:'behavior'},safeagentbench:{area:'autonomous-physical-harm',dimension:'behavior'},'tool-emu':{area:'autonomy',dimension:'behavior'},'redwood-linuxarena':{area:'deception',dimension:'behavior'},'redwood-basharena':{area:'deception',dimension:'behavior'},redcode:{area:'cybersecurity',dimension:'behavior'},'tensor-trust':{area:'cybersecurity',dimension:'behavior'}}[p.id];
  if(mapped&&!existing){
   const work=catalogue.works.find(w=>w.id===id);work.protocolIds=[id];work.areas=[mapped.area];
   catalogue.benchmarks.push({id,name:p.title.split(':')[0].replace(/^Introducing /,''),kind:'benchmark',sourceId,version:p.source.sha256,summary:note.question,measures:note.question,assessmentSubject:note.method,limitations:note.limits,primaryDimension:mapped.dimension,links:[],tags:[],classificationNote:note.limits});
   edition.protocols.push({id,name:p.title,measurement:note.question,task:note.method,validity:note.limits,...(p.protocolProfile??{}),sourceRefs:[{sourceId,url:p.url,version:p.source.sha256,locator:(p.source.locators??[]).join('; ')}],review:{state:'local-review'}});
   catalogue.visualAudits??=[];catalogue.visualAudits.push({protocolId:id,display:'chart',chartId:null,figureId:null,numericalStatus:'candidate-source-transcription',note:note.limits});
   const bindings=[];
   for(const o of p.observations??[]){
    if((o.trendEligible===false&&!o.candidateChartEligible)||o.canonicalObservationId||o.observationKind!=='evaluation-result'||!o.system||!Number.isFinite(o.value)||!o.unit||!o.locator)continue;
    const resultId=`candidate-${digest({publication:p.id,observation:o.id}).slice(0,24)}`,metricId=`metric-${digest(o.metricLabel??o.label??o.metric).slice(0,10)}`,label=typeof o.metricName==='object'?o.metricName:T(o.metricLabel??o.label??o.metric);
    catalogue.results.push({id:resultId,researchWorkId:id,sourceVersionId,benchmarkId:id,benchmarkVersion:p.source.sha256,system:o.system,subjectType:'system',evidenceType:'benchmark-result',sourceId,sourceUrl:o.sourceUrl??p.url,sourceVersion:p.source.sha256,sourceVersionLabel:o.sourceVersion??null,locator:o.locator,publicationDate:p.date??null,evaluationDate:null,verifiedOn:p.source.capturedAt?.slice(0,10)??base.verifiedOn,taskSet:o.taskSet??(typeof o.conditions==='string'?o.conditions:o.conditions?.en)??'Task scope not disclosed',protocol:typeof o.conditions==='string'?o.conditions:o.conditions?.en??o.locator,configuration:o.configuration??{modelVersion:o.system,harness:null,tools:null,budget:null},trialCount:null,sampleCounts:o.sampleCounts??null,sampleSize:T(o.denominator?String(o.denominator):'Not disclosed','见原文样本说明'),reportedValue:{rawValue:o.rawValue??o.rawToken,unit:o.unit,numerator:o.numerator??null,denominator:o.denominator??null},metrics:[{id:metricId,label,value:o.value,unit:o.unit,dimension:mapped.dimension,qualifier:'exact',interval:null,meaning:label,dimensionRationale:note.question,reportedUncertainty:o.reportedUncertainty??null}],sourceFinding:note.finding,interpretation:null,limitations:note.limits,localReview:true,sourceObservationId:o.id,sourceArtifactHash:o.sourceSha256??p.source.sha256});
    bindings.push({resultId,metricId,modelId:null,publicSince:null});
   }
   catalogue.candidateMonitoringGroups??=[];catalogue.candidateMonitoringGroups.push({id:`candidate-${id}`,benchmarkId:id,title:T(p.title),description:note.method,areas:[mapped.area],sourceIds:[sourceId],level:'source-report',conditionsComplete:false,review:{status:'local-review'},bindings});
  }
  const dossier={id,en:{...p.en,takeaway:p.en.findings},zh:{...p.zh,takeaway:p.zh.findings},observations:publicData(p.observations??[]),unitInventory:publicData(p.unitInventory??[]),sourceScope:p.source.scope,sourceRefs:[{sourceId,url:p.url,version:p.source.sha256,locator:(p.source.locators??[]).join('; ')||p.source.scope}],publication:{state:'local-review'},review:{state:'local-review',sourceScope:'selected-sections',independentEvidenceReview:'pending-human-review'}};
  // Preserve richer existing public text; source additions remain separately inspectable.
  const prior=edition.works.find(w=>w.id===id);if(!prior)edition.works.push(dossier);else prior.supplementalSources=[...(prior.supplementalSources??[]),dossier];
  publications.push({id,sourceId,title:p.title,url:p.url,identity:identity(p.url),sourceHash:p.source.sha256,fullSource:p.fullSource?{url:p.fullSource.url,sha256:p.fullSource.sha256,textSha256:p.fullSource.textSha256,captureKind:p.fullSource.captureKind}:null,scope:p.source.scope,originalFigures:(p.originalFigures??[]).map(f=>({...publicData(f),src:`/images/nuwa-index/candidate/${f.sha256}.png`})),kind:p.kind,authors:p.authors??[],organization:p.organization??null,observations:publicData(p.observations??[]),en:p.en,zh:p.zh});
  if(p.kind==='opinion')opinions.push({...publications.at(-1),date:p.date??null});
  changes.push({id,action:existing?'enrich':'add',sourceId});
 }
 const peopleMap=new Map();for(const w of catalogue.works)for(const name of w.authors??[]){if(!peopleMap.has(name))peopleMap.set(name,{id:'author-'+digest(name).slice(0,14),name,workIds:[]});peopleMap.get(name).workIds.push(w.id);}const researchers=[...peopleMap.values()];
 const scopeDispositions=removed.map(w=>({id:w.id,reason:'political-content-outside-current-scope',historicalSnapshot:base.snapshotId}));
 const candidateId=`local-${digest({catalogue,reading:edition,publications,scopeDispositions,channels}).slice(0,16)}`;
 catalogue.snapshotId=candidateId;catalogue.publication={state:'local-review',baseSnapshotId:base.snapshotId};edition.snapshotId=candidateId;
 const documents=[];const add=(type,id,title,fields,url,meta={})=>{for(const [section,copy]of Object.entries(fields))for(const locale of ['en','zh']){const v=copy?.[locale]??copy;const text=Array.isArray(v)?v.join('\n\n'):typeof v==='string'?v:'';if(text)documents.push({id:`${type}:${id}:${section}:${locale}`,objectId:id,type,title,locale,section,text,url,anchor:type==='research'&&['question','design','findings','interpretation','limits'].includes(section)?`claim-${id}-${section}`:null,review:'source-scope-stated',...meta});}};
 for(const w of catalogue.works){const d=edition.works.find(d=>d.id===w.id),fields={summary:w.summary};for(const key of ['question','design','findings','interpretation','limits'])fields[key]=T(d?.en?.[key]??w.note?.[({design:'method',findings:'finding'})[key]??key]?.en,d?.zh?.[key]??w.note?.[({design:'method',findings:'finding'})[key]??key]?.zh);add('research',w.id,w.title,fields,`/nuwa/whitzard-index/work/${w.id}/`,{areas:w.areas??[],primaryFunction:w.primaryFunction});}
 for(const b of catalogue.benchmarks)add('benchmark',b.id,b.name,{summary:b.summary,measurement:b.measures,limits:b.limitations},`/nuwa/whitzard-index/benchmark/${b.id}/`);
 for(const r of effectiveCatalogue(catalogue).results)add('observation',r.id,`${r.system} · ${r.benchmarkId}`,{finding:r.sourceFinding,limits:r.limitations},`/nuwa/whitzard-index/result/${r.id}/`);
 for(const a of edition.analyses)add('synthesis',a.id,a.heading?.en??a.title?.en??a.id,{takeaway:a.takeaway},`/nuwa/whitzard-index/synthesis/${a.id}/`);
 for(const o of catalogue.organizations)add('organization',o.id,o.name.en,{identity:o.name},`/nuwa/whitzard-index/organization/${o.id}/`);
 for(const person of researchers)add('researcher',person.id,person.name,{publications:T(person.workIds.map(id=>catalogue.works.find(w=>w.id===id).title).join(' · '))},`/nuwa/whitzard-index/researcher/${person.id}/`);
 for(const p of opinions)add('opinion',p.id,p.title,{argument:T(p.en.findings??p.en.finding,p.zh.findings??p.zh.finding),assumptions:T(p.en.design,p.zh.design),limits:T(p.en.limits,p.zh.limits)},`/nuwa/whitzard-index/opinion/${p.id}/`);
 validateCurrentEdition({candidateId,catalogue,reading:edition});
 const errors=base.schemaVersion?validateCatalogue(catalogue):[];if(errors.length)throw Error('Candidate catalogue invalid: '+errors.join('\n'));
 const projected=effectiveCatalogue(catalogue);
 return {candidateId,publication:catalogue.publication,baseSnapshotId:base.snapshotId,catalogue:projected,reading:edition,publications,opinions,researchers,channels,scopeDispositions,changes,documents};
}

export function validateCurrentEdition({candidateId,catalogue,reading}){
 if(catalogue.snapshotId!==candidateId||reading.snapshotId!==candidateId)throw Error('Candidate version mismatch');
 for(const key of ['works','benchmarks','results','sources']){const ids=catalogue[key].map(v=>v.id);if(new Set(ids).size!==ids.length)throw Error(`Duplicate candidate ${key} identity`);}
 const sourceIds=new Set(catalogue.sources.map(s=>s.id)),protocolIds=new Set(catalogue.benchmarks.map(b=>b.id));
 for(const r of catalogue.results.filter(r=>r.localReview)){if(!/^[a-z0-9-]+$/.test(r.id)||!sourceIds.has(r.sourceId)||!protocolIds.has(r.benchmarkId)||!r.locator||!r.sourceArtifactHash||!r.sourceObservationId||r.metrics.some(m=>!Number.isFinite(m.value)||!m.unit))throw Error(`Invalid candidate observation ${r.id}`);}
 if(catalogue.works.some(w=>excludedWorks.includes(w.id)))throw Error('Excluded work in current candidate');
 return true;
}
