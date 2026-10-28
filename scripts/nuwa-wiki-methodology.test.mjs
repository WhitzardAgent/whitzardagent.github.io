import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {readIndexFilters,indexViews,readIndexLocation} from '../src/lib/nuwaIndex.mjs';
import {collectPageSources} from '../src/lib/researchCitations.mjs';
const data=JSON.parse(fs.readFileSync(new URL('../src/data/nuwa-index/catalogue.json',import.meta.url)));
test('Methodology is an independent fifth entry and legacy framework method anchors resolve there',()=>{
 assert.deepEqual(indexViews,['framework','trend','research','benchmarks','methodology']);
 assert.equal(readIndexFilters('?view=methodology').view,'methodology');
 assert.equal(readIndexLocation('?view=framework','#indicator-register').view,'methodology');
 assert.equal(readIndexLocation('?view=framework','#source-series').view,'methodology');
 assert.equal(readIndexLocation('?view=framework','#ni-framework').view,'framework');
});
test('Palisade HTML and PDF share one bibliography item with both dates and links',()=>{
 const entries=collectPageSources([{sourceId:'palisade-robot-shutdown',locator:'Overview'},{sourceId:'palisade-robot-technical-report',locator:'§2–4; Figure 2 (p. 3)'}],data.sources);
 assert.equal(entries.length,1);assert.equal(entries[0].sourceIds.length,2);
 assert.equal(entries[0].links.length,2);assert.equal(entries[0].dates.length,2);assert.equal(entries[0].locators.length,2);
});
test('brand attribution may resolve without claiming a model version or release date',async()=>{
 const {resolveDeveloper}=await import('../src/lib/modelBrandIdentity.mjs');
 assert.equal(resolveDeveloper('DeepSeek-V4-Pro (high)',data).organizationId,'deepseek');
 assert.equal(resolveDeveloper('Claude Opus 4.7 + Claude Code',data).organizationId,'anthropic');
 assert.equal(resolveDeveloper('GPT-5.5 + Codex',data).organizationId,'openai');
 assert.equal(resolveDeveloper('Unidentified private system',data),null);
 assert.equal(resolveDeveloper('Unidentified system with Claude Code harness',data),null);
 const {comparisonRows}=await import('../src/lib/nuwa-intelligence/monitoring.mjs');
 const r=data.results.find(r=>/^DeepSeek/i.test(r.system));const group={bindings:[{resultId:r.id,metricId:r.metrics[0].id}]};
 const [row]=comparisonRows(data,group);assert.equal(row.developerId,'deepseek');assert.equal(row.modelId,null);assert.equal(row.releaseDate,null);
});
test('wiki prose removes repeated lead text without losing distinct source findings',async()=>{
 const {readingSections}=await import('../src/lib/wikiReading.mjs');
 const w={summary:{en:'Lead'},note:{question:{en:'Lead'},method:{en:'Method'},finding:{en:'Finding'},supports:{en:'Finding'},limits:{en:'Bounded'}}};
 assert.deepEqual(readingSections(w).map(s=>s.paragraphs),[['Method'],['Finding'],['Bounded']]);
});
test('five bilingual case articles retain original source locations and case provenance',()=>{
 for(const id of ['cybergym','cybench','agentcyberrange','agentic-misalignment','palisade-robot-shutdown'])for(const locale of ['en','zh']){
  const md=fs.readFileSync(new URL(`../src/content/nuwa-wiki/${id}.${locale}.md`,import.meta.url),'utf8');assert.match(md,/sourceRefs:/);assert.match(md,/locator/);assert.equal((md.match(/^## /gm)||[]).length,4);assert.match(md,/caseType: "source-(example|workflow)"/);
 }
});
test('legacy series-only links reveal their relocated Methodology view',()=>{
 assert.equal(readIndexFilters('?series=metr-horizon-1-1&metric=metr-p50').view,'methodology');
 assert.equal(readIndexFilters('?view=trend&series=metr-horizon-1-1').view,'trend');
});
test('compact bibliography bounds repetitive locators while retaining full provenance and version labels',async()=>{
 const {citationDisplay}=await import('../src/lib/researchCitations.mjs');
 const entry={locators:Array.from({length:95},(_,i)=>`§3; Table ${i}; model-specific configuration ${i}`),versions:['arXiv:2412.00000v3','Technical report · 2026-02-11'],dates:[{value:'2026-02-11'}]};
 const display=citationDisplay(entry,'en');assert.ok(display.locations.length<=250);assert.match(display.versions,/v3/);assert.equal(entry.locators.length,95);assert.equal(display.hiddenLocationCount>0,true);
});
test('bibliography hides build captures but keeps publication edition labels',async()=>{
 const {citationDisplay}=await import('../src/lib/researchCitations.mjs');
 const d=citationDisplay({versions:['Official captured bundle 13ee62db4f3b0692','Website bundle routes-B-0Mubrq.js / 2026-10-24 capture','arXiv:2408.08926v4','Second edition'],dates:[],locators:[]});
 assert.equal(d.versions,'v4 / Second edition');
});
test('source findings remain visibly distinct from NUWA interpretation',async()=>{
 const {readingSections}=await import('../src/lib/wikiReading.mjs');const sections=readingSections({summary:{en:'Lead'},note:{finding:{en:'Authors observed X'},supports:{en:'NUWA considers Y supported'},connections:{en:'Relation Z'}}});
 assert.equal(sections.find(s=>s.id==='finding').paragraphs.length,1);
 assert.equal(sections.find(s=>s.id==='interpretation').title,'NUWA interpretation');
 assert.deepEqual(sections.find(s=>s.id==='interpretation').paragraphs,['NUWA considers Y supported','Relation Z']);
});
test('bibliography author formatting removes extraction footnote artifacts without altering source names',async()=>{
 const {citationAuthors}=await import('../src/lib/researchCitations.mjs');const names=['Zhun Wang','Tianneng Shi 1 1 footnotemark: 1','{ zhun.wang','stneng }@berkeley.edu'];assert.deepEqual(citationAuthors(names),['Zhun Wang','Tianneng Shi']);assert.equal(names.length,4);
});
