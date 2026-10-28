import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const mod=()=>import('../src/lib/nuwa-intelligence/sourceVersions.mjs');
const hash=x=>createHash('sha256').update(x).digest('hex');
const artifact={role:'document',url:'https://example.org/card.pdf',sha256:hash('card'),capturedAt:'2026-10-26T00:00:00Z'};
const input={sourceId:'card',documentId:'arxiv:1234.56789',artifacts:[artifact],publicationDate:null,revisionDate:null};
test('source identity excludes repeated capture time but includes data and renderer revisions',async()=>{
 const {makeSourceVersion}=await mod();const a=makeSourceVersion(input),b=makeSourceVersion({...input,artifacts:[{...artifact,capturedAt:'2026-10-27T00:00:00Z'}]});assert.equal(a.id,b.id);assert.equal(a.publicationDate,null);
 assert.notEqual(a.id,makeSourceVersion({...input,artifacts:[artifact,{...artifact,role:'renderer',sha256:hash('changed') }]}).id);
 assert.throws(()=>makeSourceVersion({...input,publicationDate:'2026-10-26',publicationDateBasis:'file-mtime'}),/publication/);
});
test('document aliases do not automatically equate HTML and PDF versions',async()=>{
 const {canonicalDocumentId,makeSourceVersion}=await mod();assert.equal(canonicalDocumentId('https://arxiv.org/pdf/2501.00001v2'),canonicalDocumentId('https://doi.org/10.48550/arXiv.2501.00001'));
 assert.notEqual(makeSourceVersion(input).id,makeSourceVersion({...input,artifacts:[{...artifact,sha256:hash('html')}]}).id);
});
test('a review binds package hash, source version and individual approved records',async()=>{
 const {packageHash,validateReview,eligibleObservations}=await import('../src/lib/nuwa-intelligence/extraction.mjs');
 const p={unitId:'x',contractVersion:'nuwa-source-1',artifacts:[artifact],coverage:[{id:'s',status:'pending'}],observations:[{id:'o',value:0,rawValue:'0',eligibility:'eligible',locator:'/0'}]};
 const review={packageHash:packageHash(p),sourceVersionId:'v',contractVersion:p.contractVersion,reviewer:'independent',approvedObservationIds:['o'],approvedClaimIds:[],status:'accepted-partial'};
 assert.deepEqual(validateReview(p,review,'v'),[]);assert.equal(eligibleObservations(p,review,'v').length,1);
 assert.ok(validateReview({...p,observations:[{...p.observations[0],value:1}]},review,'v').length);assert.equal(eligibleObservations(p,{...review,approvedObservationIds:[]},'v').length,0);
 assert.equal(eligibleObservations({...p,observations:[{...p.observations[0],eligibility:'quarantined'}]},review,'v').length,0);
});
test('job resume preserves completed sections and never calls incomplete extraction complete',async()=>{
 const {resumeJob,jobStatus,validateExtraction}=await import('../src/lib/nuwa-intelligence/extraction.mjs');
 const job={sourceVersionId:'v',contractVersion:'c',sections:{a:'extracted',b:'pending'}};assert.equal(resumeJob(job,'v','c').sections.a,'extracted');assert.equal(jobStatus(job),'partial');assert.equal(resumeJob(job,'v2','c').sections.a,'pending');
 assert.ok(validateExtraction({observations:[{id:'o',value:0,rawValue:'0',eligibility:'eligible',locator:''}],coverage:[]}).some(x=>x.includes('locator')));
});
test('correction projection preserves history and suppresses superseded records consistently',async()=>{
 const {effectiveEvidence,correctionFor,validateLineage}=await import('../src/lib/nuwa-intelligence/lineage.mjs');
 const rs=[{id:'a'},{id:'b'},{id:'c'}],ls=[{id:'l',type:'supersedes',from:'b',to:'a',publicSince:'2026-10-26'}];assert.deepEqual(effectiveEvidence(rs,ls).map(x=>x.id),['b','c']);assert.equal(correctionFor('a',ls)[0].from,'b');assert.equal(rs.length,3);
 assert.deepEqual(effectiveEvidence(rs,ls,{asOf:'2026-10-25'}).map(x=>x.id),['a','c']);assert.ok(validateLineage(rs,[...ls,{id:'m',type:'supersedes',from:'a',to:'b'}]).length);
});
test('a reused score does not prove an independent run or auto-merge uncertain matches',async()=>{
 const {independentEvidenceCount}=await import('../src/lib/nuwa-intelligence/lineage.mjs');
 assert.equal(independentEvidenceCount(['a','b'],[{type:'same-run',from:'a',to:'b',reviewId:'r'}]),1);assert.equal(independentEvidenceCount(['a','b'],[{type:'possibly-same-run',from:'a',to:'b'}]),2);
});
test('only explicit matched comparisons rank; only reviewed stable series connect',async()=>{
 const {comparisonOperations,selectEvidenceAsOf}=await import('../src/lib/nuwa-intelligence/comparisons.mjs');
 assert.equal(comparisonOperations({level:'source-group',reviewId:'r'}).rank,false);assert.equal(comparisonOperations({level:'matched',reviewId:'r',conditionsComplete:true}).rank,true);assert.equal(comparisonOperations({level:'longitudinal',reviewId:'r',conditionsComplete:false}).connect,false);
 assert.equal(selectEvidenceAsOf([{id:'a',publicSince:'2026-10-26',reportedDate:'2025-01-01'},{id:'b',publicSince:null}], '2026-10-25').length,0);
});
test('missing evidence is not an experimental zero and NUWA labels require a receipt',async()=>{
 const {validateEvaluationPlan,validateRunReceipt}=await import('../src/lib/nuwa-intelligence/evaluationPlans.mjs');
 assert.ok(validateEvaluationPlan({gapType:'unextracted'}).length);assert.ok(validateRunReceipt({origin:'external'},null).length);
});
test('timeline labels use explicit source roles and distinguish verification from capture',async()=>{const{trendSourceMarkup}=await import('../src/lib/riskTrends.mjs');const data={sources:[{id:'a',title:'Data service',url:'https://example.org/no-suffix',version:'v1',verifiedOn:'2026-10-25'}],assessments:[],assessmentEvidence:[]};const series={sourceIds:['a'],evidenceLinkIds:[],sourceRoles:[{sourceId:'a',role:'data'}]};const html=trendSourceMarkup(data,series,'en');assert.match(html,/Official data/);assert.match(html,/Source checked/);assert.doesNotMatch(html,/Snapshot captured/);});
test('effective catalogue applies corrections to charts, model links and trend references',async()=>{const{effectiveCatalogue}=await import('../src/lib/nuwa-intelligence/lineage.mjs');const d={results:[{id:'a'},{id:'b'}],evidenceLineage:[{type:'withdraws',to:'a'}],charts:[{id:'c',recordIds:['a','b']}],assessmentEvidence:[{id:'x',resultId:'a'},{id:'y',resultId:'b'}],trendSeries:[{evidenceLinkIds:['x','y']}],officialObservations:[{resultId:'a'},{resultId:'b'}]};const v=effectiveCatalogue(d);assert.deepEqual(v.charts[0].recordIds,['b']);assert.deepEqual(v.trendSeries[0].evidenceLinkIds,['y']);assert.equal(d.results.length,2);});
test('reviewed mapping corrections retire unsupported protocols without rewriting historical associations',async()=>{const{effectiveCatalogue}=await import('../src/lib/nuwa-intelligence/lineage.mjs');const d={results:[],protocolVariants:[{id:'wrong',locator:'1.2'},{id:'right',locator:'1.1'}],mappingCorrections:[{variantId:'wrong',action:'withdraw'},{variantId:'right',action:'revise',changes:{locator:'1.2'}}],assessments:[{sections:[{variantIds:['wrong','right']}]}],assessmentEvidence:[{id:'x',variantId:'wrong',resultId:null},{id:'y',variantId:'right',resultId:null}]};const p=effectiveCatalogue(d);assert.equal(p.protocolVariants.length,1);assert.equal(p.protocolVariants[0].locator,'1.2');assert.deepEqual(p.assessments[0].sections[0].variantIds,['right']);assert.equal(d.protocolVariants.length,2);});
test('result previews do not combine different task sets, budgets or attempt counts',async()=>{const{resultGroups}=await import('../src/lib/modelEvidence.mjs');const a={id:'a',benchmarkId:'b',sourceId:'s',taskSet:'t1',protocol:'p',configuration:{harness:'h',budget:'2h'},trialCount:1,metrics:[{id:'m'}]},b={...a,id:'b',taskSet:'t2'},c={...a,id:'c',trialCount:30};assert.equal(resultGroups({benchmarks:[{id:'b'}],charts:[]},[a,b,c]).length,3);});
