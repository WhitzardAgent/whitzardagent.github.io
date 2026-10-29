import {createHash} from 'node:crypto';
import fs from 'node:fs';
export function verifyCapturedPackages(packages){for(const p of packages){if(!p.source?.path||!p.source.sha256)throw Error(`Missing capture binding: ${p.id}`);for(const [file,expected] of [[p.source.path,p.source.sha256],[p.source.textPath,p.source.textSha256]]){if(file&&expected&&createHash('sha256').update(fs.readFileSync(file)).digest('hex')!==expected)throw Error(`Source changed: ${p.id}`);}}}

export const excludedWorks=['political-persuasion','action-persuasion','levers-persuasion'];
const hash=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const text=v=>typeof v==='string'?v:Array.isArray(v)?v.map(text).join(' '):v&&typeof v==='object'?Object.values(v).map(text).join(' '):'';
export function buildPreviewCorpus(catalogue,reading,packages=[]){
 const excluded=catalogue.works.filter(w=>excludedWorks.includes(w.id));
 const excludedSources=new Set(excluded.map(w=>w.sourceId));
 const excludedProtocols=new Set(excluded.flatMap(w=>w.protocolIds));
 const works=catalogue.works.filter(w=>!excludedWorks.includes(w.id));
 const protocols=catalogue.benchmarks.filter(b=>!excludedProtocols.has(b.id)&&!excludedSources.has(b.sourceId));
 const results=catalogue.results.filter(r=>!excludedProtocols.has(r.benchmarkId)&&!excludedSources.has(r.sourceId));
 const dossiers=reading.works.filter(d=>works.some(w=>w.id===d.id));
 const analyses=reading.analyses.filter(a=>!(a.sourceIds??[]).some(id=>excludedSources.has(id)));
 const documents=[];
 const add=(type,id,title,fields,meta={})=>{for(const [section,body]of Object.entries(fields)){for(const locale of ['en','zh']){const content=text(body?.[locale]??body);if(content)documents.push({id:`${type}:${id}:${section}:${locale}`,objectId:id,type,title,section,locale,text:content,...meta});}}};
 for(const w of works){const d=dossiers.find(d=>d.id===w.id);const fields={summary:w.summary};for(const section of ['question','design','findings','interpretation','limits'])fields[section]={en:d?.en?.[section]??w.note?.[section]?.en,zh:d?.zh?.[section]??w.note?.[section]?.zh};add('research',w.id,w.title,fields,{areas:w.areas,primaryFunction:w.primaryFunction,publicationDate:w.publicationDate,sourceUrl:w.originalUrl,url:`/nuwa/whitzard-index/work/${w.id}/`});}
 for(const b of protocols){const d=reading.protocols.find(d=>d.id===b.id);add('benchmark',b.id,b.name,{summary:b.summary,measurement:d?.measurement,task:d?.task,scoring:d?.scoring,limits:d?.validity??b.limitations},{areas:[],url:`/nuwa/whitzard-index/benchmark/${b.id}/`});}
 for(const a of analyses)add('synthesis',a.id,text(a.heading??a.title),{takeaway:a.takeaway},{areas:[a.area].filter(Boolean),url:`/nuwa/whitzard-index/synthesis/${a.id}/`});
 for(const r of results)add('observation',r.id,`${r.system} · ${r.benchmarkId}`,{finding:r.sourceFinding,limits:r.limitations},{areas:[],url:`/nuwa/whitzard-index/result/${r.id}/`});
 for(const o of catalogue.organizations)add('organization',o.id,o.name.en,{identity:o.name},{areas:[],url:o.url??o.homepage??'/nuwa/whitzard-index/'});
 const included=packages.filter(p=>['local-review-candidate','candidate-local-review','existing-work-enrichment-candidate'].includes(p.disposition));
 for(const p of included)add(p.kind==='opinion'?'opinion':p.kind==='benchmark'?'benchmark':'research',p.id,p.title,{question:{en:p.en.question,zh:p.zh.question},design:{en:p.en.design,zh:p.zh.design},findings:{en:p.en.findings,zh:p.zh.findings},limits:{en:p.en.limits,zh:p.zh.limits}},{areas:[],url:p.url,sourceUrl:p.url,publicationDate:p.date,review:'local-review-candidate'});
 const body={packages:included,baseSnapshotId:catalogue.snapshotId,works,protocols,results,dossiers,analyses,documents,scopeDispositions:excluded.map(w=>({id:w.id,reason:'political-content-outside-current-scope',historicalSnapshot:catalogue.snapshotId}))};
 return {...body,candidateId:`local-${hash(body).slice(0,16)}`};
}
export function compileCandidate(catalogue,reading,manifest){
 if(manifest.baseSnapshotId!==catalogue.snapshotId)throw Error('Candidate base snapshot mismatch');
 const ids=new Set();for(const p of manifest.packages){if(ids.has(p.id))throw Error(`duplicate publication: ${p.id}`);ids.add(p.id);if(!p.source?.sha256||!p.url||!p.en||!p.zh)throw Error(`incomplete source package: ${p.id}`);}
 verifyCapturedPackages(manifest.packages);
 const base=buildPreviewCorpus(catalogue,reading,manifest.packages);return {...base,packages:manifest.packages,manifestHash:hash(manifest),publication:{state:'local-review',independentEvidenceReview:'pending-human-review'}};
}
