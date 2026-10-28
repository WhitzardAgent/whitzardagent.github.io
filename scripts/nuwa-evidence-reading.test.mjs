import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const data=JSON.parse(fs.readFileSync(new URL('../src/data/nuwa-index/catalogue.json',import.meta.url)));

test('reading scope never treats paragraph length or metadata verification as editorial approval',async()=>{
 const {readingStatus}=await import('../src/lib/nuwa-intelligence/researchReading.mjs');
 const w={id:'work',summary:{en:'Summary',zh:'摘要'},note:{question:{en:'x'.repeat(1000),zh:'问'},finding:{en:'Summary',zh:'摘要'}}};
 const status=readingStatus(w);assert.equal(status.id,'source-note');assert.equal(status.baselineComplete,false);assert.equal(status.sections.find(s=>s.id==='finding').available,false);
 assert.equal(readingStatus({id:'empty',note:{}}).id,'bibliographic');
});
test('a changed source invalidates current assertions but leaves historical evidence reproducible',async()=>{
 const {assertionState,validateAssertion}=await import('../src/lib/nuwa-intelligence/researchReading.mjs');
 const a={id:'a',kind:'source-finding',evidenceRefs:[{sourceId:'s',version:'v1',locator:'Table 1'}],review:{state:'reviewed',reviewer:'human',approvedFingerprint:'hash1'}};
 assert.equal(assertionState(a,'hash1'),'reviewed');assert.equal(assertionState(a,'hash2'),'review-pending');assert.equal(a.evidenceRefs[0].version,'v1');
 assert.ok(validateAssertion({...a,kind:'nuwa-calculation',calculation:{operation:'count-nonzero'},resultIds:[]},data).some(e=>/evidence set/i.test(e)));
});
test('static evidence discovery searches methods and limits with bilingual terms and gives an evidence snippet',async()=>{
 const {buildSearchDocument,searchResearch}=await import('../src/lib/nuwa-intelligence/researchDiscovery.mjs');
 const w={id:'w',title:'Protocol study',aliases:['审计'],authors:[],summary:{en:'Study',zh:'研究'},note:{question:{en:'Can oversight work?',zh:'监督是否有效'},method:{en:'A trusted monitor observes an untrusted model',zh:'可信监测器检查不可信模型'},limits:{en:'Limited audit budget',zh:'审计预算有限'}},contributions:[],areas:[],primaryFunction:'governance'};
 const doc=buildSearchDocument(w,{organizations:[]});const a=searchResearch([doc],'trusted monitor','en');assert.equal(a.length,1);assert.match(a[0].snippet,/trusted monitor/);assert.equal(searchResearch([doc],'审计预算','zh').length,1);assert.equal(searchResearch([doc],'unseen phrase','en').length,0);
});
test('original and NUWA citations preserve distinct authorship, stable URL and snapshot versions',async()=>{
 const {researchCitation}=await import('../src/lib/nuwa-intelligence/researchCite.mjs');
 const w=data.works.find(w=>w.id==='ai-control');
 const bib=researchCitation(w,data,{format:'bib',kind:'original',locale:'en'});assert.match(bib,/AI Control/);assert.match(bib,/author\s*=/);assert.match(bib,/2312\.06942/);
 const note=researchCitation(w,data,{format:'bib',kind:'nuwa',locale:'zh'});assert.match(note,/NUWA/);assert.match(note,new RegExp(data.snapshotId.replaceAll('.','\\.')));assert.doesNotMatch(note,/author\s*=/);assert.match(note,/\/work\/ai-control/);
 const ris=researchCitation(w,data,{format:'ris',kind:'original'});assert.match(ris,/TY  - /);assert.match(ris,/ER  -/);
});
test('protocol comparison explains measurement differences without ranking heterogeneous results',async()=>{
 const {protocolComparison}=await import('../src/lib/nuwa-intelligence/protocolComparison.mjs');
 const result=protocolComparison(data,['cybergym','cybench','agentcyberrange'],'en');assert.equal(result.protocols.length,3);assert.ok(result.rows.some(r=>r.id==='scoring'));assert.ok(result.rows.some(r=>r.id==='conditions'));assert.equal(result.rankAllowed,false);assert.ok(!JSON.stringify(result).includes('overallScore'));
 assert.throws(()=>protocolComparison(data,['cybergym','cybench','agentcyberrange','replibench','time-horizons']),/2.*4/);
});
test('published reading is bundled; private drafts remain opt-in, external-only and never become reviewed',async()=>{
 const {loadResearchDossiers}=await import('../src/lib/nuwa-intelligence/researchReading.mjs');
 let reads=0;const published=loadResearchDossiers(data,{},()=>{reads++;throw Error();});assert.equal(published.length,data.works.length);assert.ok(published.every(d=>d.publication.state==='published'&&d.review.independentEvidenceReview==='pending-human-review'));assert.equal(reads,0);
 assert.throws(()=>loadResearchDossiers(data,{NUWA_LOCAL_REVIEW:'1',NUWA_DOSSIER_ROOT:process.cwd()},()=>''),/outside/);
 const fake={snapshotId:data.snapshotId,works:[{id:'ai-control',review:{state:'reviewed'},en:{takeaway:'Draft'},zh:{takeaway:'草稿'}}]};
 const ds=loadResearchDossiers(data,{NUWA_LOCAL_REVIEW:'1',NUWA_DOSSIER_ROOT:'/tmp/nuwa-private-test'},()=>JSON.stringify(fake));assert.equal(ds[0].review.state,'local-review');
});
test('server-rendered factorial evidence charts include all source conditions without a missing visual-map module',async()=>{
 const {buildDisplaySets,displayRows}=await import('../src/lib/nuwa-intelligence/panorama.mjs');
 const {renderMonitorChart}=await import('../src/lib/nuwa-intelligence/chartServer.mjs');
 const group=buildDisplaySets(data,{benchmarkId:'agentic-misalignment'}).find(g=>displayRows(data,g).some(r=>r.experimentalConditions));
 assert.ok(group);const rows=displayRows(data,group,{locale:'en'});assert.equal(rows.length,108);
 assert.doesNotThrow(()=>renderMonitorChart(rows,group,'en',{display:'bars',all:true,compact:true}));
});
test('reading-scope filters survive navigation without changing legacy default filter shape',async()=>{
 const {readIndexFilters,writeIndexFilters}=await import('../src/lib/nuwaNavigation.mjs');
 const state=readIndexFilters('?view=research&reviewScope=bibliographic&q=control');assert.equal(state.reviewScope,'bibliographic');assert.equal(readIndexFilters(writeIndexFilters('',state)).reviewScope,'bibliographic');
 assert.equal(Object.hasOwn(readIndexFilters(''),'reviewScope'),false);
});
test('monitoring CSV retains typed reported uncertainty, denominator units and snapshot provenance',async()=>{
 const {comparisonRows,monitorCsv}=await import('../src/lib/nuwa-intelligence/monitoring.mjs');
 const id='reported-neo-deepseek-v4-de3e1a723a83',group=data.monitoring.groups.find(g=>g.bindings.some(b=>b.resultId===id));
 const row=comparisonRows(data,group).find(r=>r.resultId===id);assert.equal(row.reportedUncertainty.kind,'confidence');assert.equal(row.sampleCounts.denominator.value,249);
 const csv=monitorCsv([row],group);assert.match(csv,/reportedUncertainty/);assert.match(csv,/sampleCounts/);assert.match(csv,/95\.4/);assert.match(csv,/249/);assert.match(csv,/snapshotId/);assert.ok(csv.includes(data.snapshotId));
});
test('publication attribution cannot come from a different paper cited by an institutional article',()=>{
 for(const [id,publisher]of [['metr-frontier-risk-report','metr'],['fortress-audit','generality']]){
  const work=data.works.find(w=>w.id===id);assert.ok(work.contributions.some(c=>c.organizationId===publisher));assert.equal(work.attributionSourceId,work.sourceId);
 }
 const robot=data.works.find(w=>w.id==='palisade-robot-shutdown');assert.deepEqual(robot.authors,['Artem Petrov','Sergey Koldyba','Sergey Molchanov','Nikolaj Kotov','Dmitrii Volkov','Oleg Serikov']);
});
test('prepared dossier source fingerprints mark changed evidence pending and keep it out of new search synthesis',async()=>{
 const {dossierFingerprint,loadResearchDossiers}=await import('../src/lib/nuwa-intelligence/researchReading.mjs');
 const d={id:'ai-control',sourceRefs:[{sourceId:data.works.find(w=>w.id==='ai-control').sourceId,version:'edition',locator:'§2'}],review:{state:'local-review'},en:{takeaway:'Draft'},zh:{takeaway:'草稿'}};d.review.preparedFingerprint=dossierFingerprint(data,d);
 const changed=structuredClone(data);changed.sources.find(s=>s.id===d.sourceRefs[0].sourceId).version+=' revised';
 const loaded=loadResearchDossiers(changed,{NUWA_LOCAL_REVIEW:'1',NUWA_DOSSIER_ROOT:'/tmp/nuwa-private-test'},()=>JSON.stringify({snapshotId:changed.snapshotId,works:[d]}));assert.equal(loaded[0].review.state,'review-pending');
});
test('deferred monitor payloads retain only the selected result scope and exclude archival review ledgers',async()=>{
 const {monitorDataSubset}=await import('../src/lib/nuwa-intelligence/monitorPayload.mjs');
 const group=data.monitoring.groups.find(g=>g.benchmarkId==='time-horizons');const payload=monitorDataSubset(data,[group]);
 const ids=new Set(group.bindings.map(b=>b.resultId));assert.ok(payload.results.length>0);assert.ok(payload.results.every(r=>ids.has(r.id)));assert.equal(Object.hasOwn(payload,'observationDispositions'),false);assert.equal(Object.hasOwn(payload,'reviewSummaries'),false);assert.ok(payload.results.every(r=>r.metrics));
});
test('protocol reading derives from the defining work, keeps unknown methods explicit and never substitutes later model reports',async()=>{
 const {extendProtocolReadings}=await import('../src/lib/nuwa-intelligence/protocolReading.mjs');
 const works=[{id:'p',en:{takeaway:'Draft',question:'Construct',design:'Task',limits:'Limits',decisionRelevance:'Use'},zh:{takeaway:'稿',question:'构念',design:'任务',limits:'限制',decisionRelevance:'用途'},review:{sourceScope:'abstract'},sourceRefs:[]}];
 const result=extendProtocolReadings([{id:'p',review:{sourceReading:'pending'}},{id:'missing',review:{sourceReading:'pending'}}],works,{works:[{id:'p',protocolIds:['p']},{id:'later-model-report',protocolIds:['missing']}]});
 assert.equal(result[0].en.scoring,null);assert.equal(result[0].en.conditions,null);assert.equal(result[0].review.sourceScope,'abstract');assert.equal(result[0].review.humanSignoff,null);assert.equal(result[1].en,undefined);
});
test('native dossier caching never caches a source approval and artifact changes invalidate the prepared reading',async()=>{
 const os=await import('node:os'),path=await import('node:path');const {loadResearchDossiers,dossierFingerprint}=await import('../src/lib/nuwa-intelligence/researchReading.mjs');const root=fs.mkdtempSync(path.join(os.tmpdir(),'nuwa-dossier-regression-'));
 try{const c=structuredClone(data),sourceId=c.works.find(w=>w.id==='ai-control').sourceId,d={id:'ai-control',sourceRefs:[{sourceId,version:'v1',locator:'§2'}],reviewedResource:{url:'https://example.org/original',sha256:'capture1'},en:{takeaway:'Draft'},zh:{takeaway:'稿'},review:{}};d.review.preparedFingerprint=dossierFingerprint(c,d);fs.writeFileSync(path.join(root,'dossiers.json'),JSON.stringify({snapshotId:c.snapshotId,works:[d]}));const env={NUWA_LOCAL_REVIEW:'1',NUWA_DOSSIER_ROOT:root};assert.equal(loadResearchDossiers(c,env)[0].review.state,'local-review');c.sources.find(s=>s.id===sourceId).version+=' changed';assert.equal(loadResearchDossiers(c,env)[0].review.state,'review-pending');const changed=structuredClone(d);changed.reviewedResource.sha256='capture2';assert.notEqual(dossierFingerprint(data,changed),d.review.preparedFingerprint);}finally{fs.rmSync(root,{recursive:true,force:true});}
});
test('syntheses invalidate when any bound result changes and pending protocol drafts cannot enter comparisons',async()=>{
 const os=await import('node:os'),path=await import('node:path');const {loadResearchSyntheses,dossierFingerprint,synthesisEvidenceFingerprint}=await import('../src/lib/nuwa-intelligence/researchReading.mjs');const {protocolComparison}=await import('../src/lib/nuwa-intelligence/protocolComparison.mjs');const root=fs.mkdtempSync(path.join(os.tmpdir(),'nuwa-synthesis-regression-'));
 try{const c=structuredClone(data),a={id:'test',sourceRefs:[],resultIds:[c.results[0].id],review:{},completeEvidenceBinding:{}};a.review.preparedFingerprint=dossierFingerprint(c,a);a.completeEvidenceBinding.resultFingerprint=synthesisEvidenceFingerprint(c,a);fs.writeFileSync(path.join(root,'syntheses.json'),JSON.stringify({snapshotId:c.snapshotId,analyses:[a]}));const env={NUWA_LOCAL_REVIEW:'1',NUWA_DOSSIER_ROOT:root};assert.equal(loadResearchSyntheses(c,env)[0].status,'local-review');c.results[0].metrics[0].value+=1;assert.equal(loadResearchSyntheses(c,env)[0].status,'review-pending');const comparison=protocolComparison(data,['cybergym','cybench'],'en',{profiles:[{id:'cybergym',review:{state:'review-pending'},en:{measurement:'STALE INTERPRETATION'}}]});assert.doesNotMatch(JSON.stringify(comparison),/STALE INTERPRETATION/);assert.match(comparison.rows[0].cells[0],/review pending/);}finally{fs.rmSync(root,{recursive:true,force:true});}
});
test('captured source bundle artifact changes invalidate synthesis dependencies even when result values are unchanged',async()=>{
 const {synthesisEvidenceFingerprint,dossierFingerprint}=await import('../src/lib/nuwa-intelligence/researchReading.mjs');const c=structuredClone(data),v=c.sourceVersions.find(v=>c.results.some(r=>r.sourceId===v.sourceId)),r=c.results.find(r=>r.sourceId===v.sourceId),a={resultIds:[r.id],sourceRefs:[{sourceId:v.sourceId,version:'v1',locator:'Table1'}]};const before=synthesisEvidenceFingerprint(c,a),reading=dossierFingerprint(c,a);v.artifacts[0].sha256='changed-artifact';assert.notEqual(synthesisEvidenceFingerprint(c,a),before);assert.notEqual(dossierFingerprint(c,a),reading);
});
test('retained public record editions are complete, content-hashed and exclude new private editorial drafts',async()=>{
 const {digest}=await import('../src/lib/nuwa-intelligence/sourceVersions.mjs');
 const editions=JSON.parse(fs.readFileSync(new URL(`../src/data/nuwa-index/record-editions/${data.snapshotId}.json`,import.meta.url)));assert.equal(editions.snapshotId,data.snapshotId);assert.deepEqual(editions.records.map(r=>r.work.id).sort(),data.works.map(w=>w.id).sort());for(const record of editions.records){assert.equal(record.snapshotId,data.snapshotId);const {contentHash,...payload}=record;assert.equal(digest(payload),contentHash);assert.doesNotMatch(JSON.stringify(record),/\/Users\/|DRAFT_NUWA_|data-private-dossier/);}assert.equal(editions.records.find(r=>r.work.id==='ai-control').work.title,data.works.find(w=>w.id==='ai-control').title);
});
test('measurement pages keep unknown reviewed methods explicit and do not expose internal profile metadata as prose',async()=>{
 const {protocolProfileText}=await import('../src/lib/nuwa-intelligence/protocolComparison.mjs');const p={en:{scoring:null},scoring:{en:'Unverified legacy scoring'},conditions:{sourceVersion:'opaque-hash',variants:[{id:'internal-id',configuration:{en:'Tool budget not reported'}}]},statistics:{catalogueResultCount:42,denominator:null}};assert.match(protocolProfileText(p,'scoring'),/Not established/);assert.doesNotMatch(protocolProfileText(p,'conditions'),/internal-id|opaque-hash/);assert.match(protocolProfileText(p,'conditions'),/not independently reverified/);assert.doesNotMatch(protocolProfileText(p,'statistics'),/42|catalogueResultCount/);
});
