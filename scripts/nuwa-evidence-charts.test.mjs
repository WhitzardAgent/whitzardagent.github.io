import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {documentKey,collectPageSources} from '../src/lib/researchCitations.mjs';
import {chartRows,chartMarkup,tableMarkup,chartCsv,chartSvg,readChartState,writeChartState,intervalFor,formatMetric} from '../src/lib/evidenceCharts.mjs';
import {validateCatalogue} from '../src/lib/nuwaIndex.mjs';
const data=JSON.parse(await readFile(new URL('../src/data/nuwa-index/catalogue.json',import.meta.url)));
const baseline=JSON.parse(await readFile(new URL('../src/data/nuwa-index/snapshots/2026-10-25.3.json',import.meta.url)));
const resolve=id=>{const spec=data.charts.find(c=>c.protocolId===id);return {spec,records:spec.recordIds.map(id=>data.results.find(r=>r.id===id))};};
test('citation identities deduplicate arXiv abstract, PDF, HTML, DOI aliases while preserving versions and locations',()=>{
 assert.equal(documentKey('https://arxiv.org/html/2406.13352v3#A3'),'arxiv:2406.13352');assert.equal(documentKey('https://doi.org/10.48550/arXiv.2406.13352'),'arxiv:2406.13352');
 const refs=[{url:'https://arxiv.org/abs/2406.13352',title:'AgentDojo',version:'v1',locator:'Table 1'},{url:'https://arxiv.org/pdf/2406.13352v3',title:'AgentDojo',version:'v3',locator:'Table 3'},{url:'https://arxiv.org/html/2406.13352v3#A3',title:'AgentDojo',locator:'Table 3'}];
 const [entry]=collectPageSources(refs);assert.equal(collectPageSources(refs).length,1);assert.deepEqual(entry.versions,['v1','v3']);assert.deepEqual(entry.locators,['Table 1','Table 3']);
 const sources=[{id:'x',documentId:'paper-x',url:'https://arxiv.org/abs/2406.13352',aliases:['https://doi.org/10.1000/example'],title:'X'}];assert.equal(collectPageSources([...refs,{url:'https://doi.org/10.1000/example'}],sources).length,1);
 assert.equal(collectPageSources([...refs,{url:'https://project.example.org',title:'Project'}]).length,2);
});
test('all protocols have a real audit and each chart resolves recorded source data without ranking',()=>{
 assert.deepEqual(validateCatalogue(data),[]);assert.equal(data.visualAudits.length,data.benchmarks.length);assert.ok(data.charts.length>=18);assert.equal(data.figures.length,42);
 for(const ch of data.charts){assert.equal(ch.basis,'source-report');assert.equal(ch.domain[0],0);const rows=ch.recordIds.map(id=>data.results.find(r=>r.id===id));assert.ok(rows.every(r=>r.comparisonGroup===null&&r.benchmarkId===ch.protocolId));}
 for(const old of baseline.results)assert.deepEqual(data.results.find(r=>r.id===old.id),old);assert.ok(data.results.length>=180);
});
test('source order, missing values and display limit are shared by chart and table',()=>{
 const {spec,records}=resolve('mask'),state=readChartState('',spec,records);assert.deepEqual(chartRows(spec,records,state).rows,records.slice(0,12));
 const metric=spec.metricIds[2],filtered={...state,metric,all:true};const expected=records.filter(r=>r.metrics.some(m=>m.id===metric));assert.equal(chartRows(spec,records,filtered).rows.length,expected.length);assert.ok(expected.length<records.length);
 assert.equal((tableMarkup(spec,records,filtered,'en').match(/<tr>/g)??[]).length,expected.length+1);assert.equal((chartMarkup(spec,records,filtered,'en').match(/class="ec-row"/g)??[]).length,expected.length);
});
test('chart filters round-trip unrelated URL state, selected systems and paired utility',()=>{
 const {spec,records}=resolve('agentdojo');const state={metric:'paired',systems:[records[3].id],view:'table',all:true};const query=writeChartState('?view=results&q=existing',state,spec);assert.equal(new URLSearchParams(query).get('q'),'existing');assert.deepEqual(readChartState(query,spec,records),state);assert.equal(chartRows(spec,records,state).metricIds.length,2);
});
test('only reported confidence intervals become error bars; SEM and SD do not',()=>{
 const {records}=resolve('agentdojo');const m=records[0].metrics[0];assert.deepEqual(intervalFor(m),{lower:66.61-3.69,upper:66.61+3.69,level:95,kind:'confidence',provenance:'source-reported'});
 const paper=resolve('paperbench').records[0].metrics[0];assert.match(paper.interval,/standard error/);assert.equal(intervalFor(paper),null);const post=resolve('posttrainbench').records[1].metrics[0];assert.equal(intervalFor(post),null);
 const ci=resolve('stealth-evals').records[0].metrics[0];assert.equal(intervalFor(ci).upper,7.1);
});
test('formatted values retain qualifiers and reported decimal precision; exports retain source and system names',()=>{
 assert.equal(formatMetric({id:'threshold',value:80,unit:'%',qualifier:'greater-than'}),'>80%');assert.equal(formatMetric({id:'post-level0-pass3',value:74.1,unit:'%',qualifier:'exact'}),'74.10%');
 const {spec,records}=resolve('agentcyberrange');const state=readChartState('',spec,records);const csv=chartCsv(spec,records,state,'en');assert.match(csv,/Codex 0.144.1/);assert.match(csv,/source_locator/);assert.match(chartSvg(spec,records,state,'en'),/agentcyberrange.io/);
});
test('source table spot checks preserve values, sample conditions and special prompt flags',()=>{
 assert.equal(resolve('cybench').records[0].metrics[0].value,17.5);assert.equal(resolve('opendeception').records[1].metrics[1].value,93.6);assert.equal(resolve('paperbench').records[0].metrics[0].value,2.6);assert.equal(resolve('bountybench').records[0].metrics[1].value,57.5);assert.equal(resolve('judgebench').records[0].metrics[0].value,56.57);assert.equal(resolve('posttrainbench').records[0].metrics[0].value,51.1);assert.equal(resolve('posttrainbench').records[0].metrics[0].unit,'score');assert.ok(resolve('replibench').records.some(r=>r.metrics.some(m=>m.conditionNote)));
 assert.ok(resolve('vct').records.every(r=>r.system!=='Expert virologists'));assert.match(resolve('vct').records.find(r=>r.system==='o1 (Dec ’24)').sampleSize.en,/One evaluation/);
});
