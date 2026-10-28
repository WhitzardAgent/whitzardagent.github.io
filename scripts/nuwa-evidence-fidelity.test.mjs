import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as source from '../src/lib/nuwa-intelligence/sourceObservation.mjs';
import {packageHash,validateExtraction,validateReview,eligibleObservations} from '../src/lib/nuwa-intelligence/extraction.mjs';
import {validateCatalogue} from '../src/lib/nuwaIndex.mjs';
const catalogue=()=>JSON.parse(fs.readFileSync(new URL('../src/data/nuwa-index/catalogue.json',import.meta.url)));
const observation={id:'o',metric:'success',value:0,rawValue:'0%',unit:'%',locator:'Table 1',eligibility:'eligible',numerator:0,denominator:10,trials:null};
const pkg=o=>({unitId:'unit',contractVersion:'nuwa-source-1',extractor:'extractor-A',observations:[{...observation,...o}],claims:[]});
const review=p=>({packageHash:packageHash(p),sourceVersionId:'v',contractVersion:p.contractVersion,reviewer:'reviewer-B',status:'accepted',approvedObservationIds:['o'],approvedClaimIds:[]});

test('a denominator stays separate from reported trials and unknown count units stay unknown',()=>{
 assert.doesNotMatch(source.observationSample({denominator:39,trials:null}).en,/trials|rollouts/);
 assert.match(source.observationSample({denominator:39,trials:null}).en,/39.*denominator|denominator.*39/i);
 assert.match(source.observationSample({denominator:39,trials:3}).en,/3.*trials/);
 assert.equal(typeof source.observationCounts,'function');
 const counts=source.observationCounts({denominator:39,trials:null});
 assert.deepEqual(counts.denominator,{value:39,unit:null});assert.deepEqual(counts.trials,{value:null,unit:null});
 assert.deepEqual(source.observationCounts({denominator:39,denominatorUnit:'tasks'}).denominator,{value:39,unit:'tasks'});
});
test('printed bootstrap uncertainty keeps the source kind, confidence level and method without invented endpoints',()=>{
 assert.equal(typeof source.observationUncertainty,'function');
 const ci={level:0.95,method:'bootstrap',samples:1000,reportedPlusMinus:'2.5'};
 const u=source.observationUncertainty({rawFields:{CI:ci}});
 assert.deepEqual(u.raw,ci);assert.equal(u.kind,'confidence');assert.equal(u.level,0.95);assert.equal(u.levelUnit,'fraction');assert.equal(u.method,'bootstrap');assert.equal(u.reportedPlusMinus,'2.5');assert.equal(u.lower,null);assert.equal(u.upper,null);
 const bars=source.observationUncertainty({rawFields:{CI:'95% CI bars displayed; numeric endpoints not disclosed'}});
 assert.equal(bars.level,95);assert.equal(bars.levelUnit,'percent');assert.equal(bars.lower,null);
 const endpoints=source.observationUncertainty({rawFields:{printed_ci:'[39–73]'}});assert.equal(endpoints.raw,'[39–73]');assert.equal(endpoints.kind,'unspecified');assert.equal(endpoints.level,null);
});
test('extraction rejects negative, fractional and mismatched count fields while retaining zero numerators',()=>{
 for(const o of [{denominator:-1},{denominator:0},{trials:-2},{numerator:1.5},{numerator:11},{denominatorUnit:'percent'},{unit:'count',value:-1},{unit:'count',value:1.5}])assert.ok(validateExtraction(pkg(o)).length,JSON.stringify(o));
 assert.deepEqual(validateExtraction(pkg({numerator:0})),[]);
});
test('bounded fractions and typed uncertainty reject impossible ratios and unsupported types',()=>{
 for(const o of [{unit:'fraction',value:1.2},{unit:'ratio',value:-1},{uncertainty:{kind:'made-up',lower:0,upper:1}},{uncertainty:{kind:'confidence',level:2,levelUnit:'fraction'}},{rawFields:{CI:{level:0.95,method:'bootstrap',reportedPlusMinus:-1}}}])assert.ok(validateExtraction(pkg(o)).length,JSON.stringify(o));
});
test('review cannot approve an invalid extraction or the known extractor reviewing itself',()=>{
 const p=pkg({denominator:-1});assert.ok(validateReview(p,review(p),'v').some(e=>/denominator/.test(e)));assert.equal(eligibleObservations(p,review(p),'v').length,0);
 const good=pkg({});assert.ok(validateReview(good,{...review(good),reviewer:'extractor-A'},'v').some(e=>/independent/i.test(e)));
 for(const extractor of [{id:'Extractor-A'},'Codex dedicated source worker /root/extractor-a']){const identified={...good,extractor};assert.ok(validateReview(identified,{...review(identified),reviewer:extractor.id?'extractor-a':'/root/extractor-a'},'v').some(e=>/independent/i.test(e)));}
 assert.deepEqual(validateReview(good,review(good),'v'),[]);
});
test('all thirty Neo DeepSeek printed bootstrap uncertainties survive canonical publication',()=>{
 const d=catalogue(),rs=d.results.filter(r=>r.sourceId==='neo-deepseek-v4-source'&&/±/.test(String(r.reportedValue?.rawValue)));
 assert.equal(rs.length,30);
 for(const r of rs){const u=r.metrics[0].reportedUncertainty;assert.ok(u,r.id);assert.equal(u.kind,'confidence');assert.equal(u.level,0.95);assert.equal(u.method,'bootstrap');assert.ok(u.reportedPlusMinus);assert.equal(u.lower,null);assert.equal(u.upper,null);assert.match(r.metrics[0].interval,/bootstrap/);}
});
test('review decisions retain 888 accepted IDs with 839 published and 49 reasoned deferred dispositions',()=>{
 const d=catalogue();assert.equal(d.schemaVersion,'5.2');assert.equal(d.reviewSummaries.length,13);assert.equal(d.reviewSummaries.reduce((n,r)=>n+r.approvedObservationIds.length,0),888);
 assert.equal(d.observationDispositions.length,888);assert.equal(d.observationDispositions.filter(o=>o.disposition==='published').length,839);assert.equal(d.observationDispositions.filter(o=>o.disposition==='deferred').length,49);
 for(const row of d.observationDispositions){assert.ok(row.reason);assert.equal(row.sourceObservation.id,row.observationId);assert.ok(Object.hasOwn(row.sourceObservation,'rawValue'));assert.ok(Object.hasOwn(row.sourceObservation,'value'));}
});
test('source metadata corrections preserve old result IDs, values, qualifiers and raw tokens',()=>{
 const old=JSON.parse(fs.readFileSync(new URL('../src/data/nuwa-index/snapshots/2026-10-27.1.json',import.meta.url))),d=catalogue();
 assert.equal(d.results.length,old.results.length);
 for(const r of old.results){const n=d.results.find(n=>n.id===r.id);assert.ok(n,r.id);assert.deepEqual(n.reportedValue,r.reportedValue);assert.deepEqual(n.metrics.map(m=>[m.id,m.value,m.unit,m.qualifier,m.uncertainty]),r.metrics.map(m=>[m.id,m.value,m.unit,m.qualifier,m.uncertainty]));}
});
test('publication validation catches missing dispositions, changed accepted values and divergent official uncertainty',()=>{
 const d=catalogue();assert.equal(d.schemaVersion,'5.2');assert.deepEqual(validateCatalogue(d),[]);
 const missing=structuredClone(d);missing.observationDispositions.pop();assert.ok(validateCatalogue(missing).some(e=>/disposition|accounting/.test(e)));
 const value=structuredClone(d),published=value.observationDispositions.find(o=>o.disposition==='published');published.sourceObservation.value+=1;assert.ok(validateCatalogue(value).some(e=>/value|measurement/.test(e)));
 const mirror=structuredClone(d);mirror.officialObservations[0].reportedUncertainty={kind:'confidence',raw:'changed'};assert.ok(validateCatalogue(mirror).some(e=>/uncertainty|mirror/.test(e)));
});

test('the real batch compiler stops on malformed extraction before writing a candidate',async()=>{
 const {mkdtemp,writeFile,mkdir,rm}=await import('node:fs/promises'),{tmpdir}=await import('node:os'),path=await import('node:path'),{spawnSync}=await import('node:child_process');
 const {makeSourceVersion}=await import('../src/lib/nuwa-intelligence/sourceVersions.mjs');
 const root=await mkdtemp(path.join(tmpdir(),'nuwa-invalid-source-'));
 try{
  const d=catalogue(),p={...pkg({denominator:-1}),unitId:'cybergym-official',sourceId:'cybergym-official-data',artifacts:[{role:'document',url:'https://example.org/source',sha256:'0'.repeat(64)}],coverage:[]};
  const v=makeSourceVersion({sourceId:p.sourceId,artifacts:p.artifacts,documentId:d.sources.find(s=>s.id===p.sourceId)?.documentId,contractVersion:p.contractVersion}),r={...review(p),sourceVersionId:v.id};
  await writeFile(path.join(root,'baseline-catalogue.json'),JSON.stringify(d));await mkdir(path.join(root,p.unitId));await writeFile(path.join(root,p.unitId,'candidate-package.json'),JSON.stringify(p));await writeFile(path.join(root,p.unitId,'review.json'),JSON.stringify(r));
  const output=path.join(root,'candidate.json'),run=spawnSync(process.execPath,['scripts/build-nuwa-source-batch.mjs',output],{env:{...process.env,NUWA_PRIVATE_ROOT:root},encoding:'utf8'});
  assert.notEqual(run.status,0);assert.match(run.stderr,/invalid denominator/);assert.equal(fs.existsSync(output),false);
 }finally{await rm(root,{recursive:true,force:true});}
});

test('metadata migration keeps an existing editorial dependency stale and preserves the input',async()=>{
 const {correctEvidenceFidelity,selectedSourceUnits}=await import('./correct-nuwa-evidence-fidelity.mjs');
 const packages=selectedSourceUnits.map(unitId=>{const p={...pkg({}),unitId};return {package:p,review:review(p)};});
 const input={schemaVersion:'5.1',snapshotId:'old',sourceUnits:selectedSourceUnits.map(id=>({id,sourceVersionId:'v',reviewId:`review-${id}`})),reviewSummaries:packages.map(({package:p,review:r})=>({...r,id:`review-${p.unitId}`})),results:[],observationEvidence:[],officialObservations:[],monitoring:{groups:[],analyses:[{id:'existing-assertion',snapshotId:'old',dependencies:'original-dependencies',status:'reviewed'}]}};
 const before=structuredClone(input),d=correctEvidenceFidelity(input,packages);
 assert.deepEqual(input,before);assert.equal(d.monitoring.analyses[0].dependencies,'original-dependencies');assert.equal(d.monitoring.analyses[0].snapshotId,'old');assert.equal(d.observationDispositions.length,13);assert.ok(d.observationDispositions.every(o=>o.disposition==='deferred'));
 assert.throws(()=>correctEvidenceFidelity(input,packages.slice(1)),/Exact thirteen/);
});

const unsupportedProjectionChanges=[
 ['reported unit',r=>{r.reportedValue.unit='invented-unit';},/reported.*unit/i],
 ['trial count',r=>{r.trialCount=999;},/trial.*count/i],
 ['qualifier',r=>{r.metrics[0].qualifier='greater-than';},/qualifier/i],
 ['invented uncertainty',r=>{r.metrics[0].reportedUncertainty={raw:'invented',kind:'confidence',level:95,levelUnit:'percent',lower:0,upper:1};r.metrics[0].interval='95% CI [0,1]';},/uncertainty/i],
 ['invented interval alone',r=>{r.metrics[0].interval='95% CI [0,1]';},/uncertainty|interval/i],
];
for(const [field,change,expected] of unsupportedProjectionChanges){
 test(`source publication rejects unsupported ${field} even when accepted ledger and hashes are unchanged`,async()=>{
  const {validateIntelligence}=await import('../src/lib/nuwa-intelligence/publication.mjs');
  const d=catalogue(),r=d.results.find(r=>r.id==='reported-neo-kimi-k3-c157ed59e0eb');change(r);
  assert.ok(validateIntelligence(d).some(e=>expected.test(e)),`missing source fidelity error for ${field}`);
 });
 test(`metadata migration rejects unsupported ${field} before fingerprint rebinding`,async()=>{
  const {correctEvidenceFidelity,selectedSourceUnits}=await import('./correct-nuwa-evidence-fidelity.mjs');
  const packages=selectedSourceUnits.map(unitId=>{const p={...pkg({}),unitId};return {package:p,review:review(p)};});
  const r={id:'result',sourceId:'source',reportedValue:{rawValue:'0%',unit:'%',numerator:0,denominator:10},transformation:null,trialCount:null,metrics:[{value:0,unit:'%',qualifier:'exact',interval:null}]};
  const input={schemaVersion:'5.1',snapshotId:'old',sourceUnits:selectedSourceUnits.map(id=>({id,sourceVersionId:'v',reviewId:`review-${id}`})),reviewSummaries:packages.map(({package:p,review:r})=>({...r,id:`review-${p.unitId}`})),results:[r],observationEvidence:[{reviewId:`review-${selectedSourceUnits[0]}`,observationId:'o',resultId:r.id}],officialObservations:[],monitoring:{groups:[],analyses:[]}};
  change(r);const before=structuredClone(input);
  assert.throws(()=>correctEvidenceFidelity(input,packages),expected);assert.deepEqual(input,before);
 });
}

test('projection fidelity preserves compiler conversions and explicitly reviewed trial corrections',async()=>{
 const {validateObservationProjection}=await import('../src/lib/nuwa-intelligence/publication.mjs');
 const transformation={operation:'fraction-to-percent',factor:100,decimals:1},o={...observation,value:83.3,rawValue:0.833,unit:'%',numerator:null,denominator:null,trials:1,transformation};
 const result={id:'r',sourceId:'s',reportedValue:{rawValue:0.833,unit:'fraction',numerator:null,denominator:null},transformation,trialCount:1,metrics:[{value:83.3,unit:'%',qualifier:'exact',interval:null}]};
 assert.deepEqual(validateObservationProjection(result,o),[]);
 const derivedSource={...observation,value:null,rawValue:'7/30',unit:'count/total',numerator:7,denominator:30,trials:30};
 const derived={...result,reportedValue:{rawValue:'7/30',unit:'count/total',numerator:7,denominator:30},transformation:{kind:'percentage-from-counts',numerator:7,denominator:30,precision:2},trialCount:30,metrics:[{value:23.33,unit:'%',qualifier:'exact',interval:null}]};
 assert.deepEqual(validateObservationProjection(derived,derivedSource),[]);
 const corrected={...result,trialCount:null},correction={resultId:'r',review:{status:'accepted'},locator:'Table 1',reason:{en:'Source correction',zh:'来源更正'},sourceIds:['s'],changes:{trialCount:null}};
 assert.ok(validateObservationProjection(corrected,o).some(e=>/trial count/.test(e)));
 assert.deepEqual(validateObservationProjection(corrected,o,{resultCorrections:[correction]}),[]);
 assert.ok(validateObservationProjection({...corrected,trialCount:999},o,{resultCorrections:[correction]}).some(e=>/trial count/.test(e)));
});
