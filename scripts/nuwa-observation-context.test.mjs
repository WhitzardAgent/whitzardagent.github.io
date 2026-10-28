import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {effectiveCatalogue} from '../src/lib/nuwa-intelligence/lineage.mjs';
import {buildDisplaySets,displayRows} from '../src/lib/nuwa-intelligence/panorama.mjs';
import {monitorChartOption,isConditionMatrix} from '../src/lib/nuwa-intelligence/monitorChart.mjs';
import {monitorCsv} from '../src/lib/nuwa-intelligence/monitoring.mjs';
const data=effectiveCatalogue(JSON.parse(fs.readFileSync(new URL('../src/data/nuwa-index/catalogue.json',import.meta.url))));
const sets=buildDisplaySets(data);
test('APE topic conditions are eight explicit scopes, not repeated unlabeled model scores',()=>{
 const set=sets.find(s=>s.bindings.some(b=>b.metricId==='neo-kimi-k3-turn-1-persuasion-attempt-rate'));
 const rows=displayRows(data,set);assert.equal(rows.length,32);assert.equal(set.facets.length,8);
 for(const f of set.facets){const rs=rows.filter(r=>r.facetId===f.id);assert.equal(rs.length,4);assert.equal(new Set(rs.map(r=>r.system)).size,4);assert.ok(rs.every(r=>r.observationCondition?.en));}
 assert.ok(set.facets.some(f=>f.label.en.includes('Conspiracy')));
 assert.ok(set.facets.some(f=>f.label.en.includes('Undermining Control')));
 assert.equal(rows.filter(r=>r.value===0).length,15);
});
test('PersuSafety and DeceptionBench preserve their independently measured conditions',()=>{
 const cases=[['neo-kimi-k3-turn-1-persuasion-attempt-rate','persusafety',3,12],['neo-glm52-deceptionbench-deception-score','deceptionbench',2,10]];
 for(const [metric,id,facets,n]of cases){const s=sets.find(s=>s.benchmarkId===id&&s.bindings.some(b=>b.metricId===metric));assert.ok(s);assert.equal(s.facets.length,facets);assert.equal(displayRows(data,s).length,n);}
});
test('every non-factorial chart distinguishes repeated model labels using recorded conditions',()=>{
 for(const set of sets){const rows=displayRows(data,set);if(isConditionMatrix(rows))continue;
  for(const facet of set.facets){const rs=rows.filter(r=>r.facetId===facet.id);if(!rs.length)continue;
   const option=monitorChartOption(rs,set,'en',{display:'bars',exportAll:true,all:true});
   assert.equal(new Set(option.yAxis.data).size,rs.length,`${set.id} ${facet.label.en}: ambiguous model axis`);
  }
 }
});
test('budget changes remain visible beside the model and in machine-readable exports',()=>{
 const set=sets.find(s=>s.benchmarkId==='cybergym'&&s.bindings.some(b=>b.metricId==='saferai-glm52-cybergym-pass-1'));
 const rs=displayRows(data,set).filter(r=>r.system==='GLM-5.2'&&r.taskSet.includes('hard-task'));
 assert.equal(rs.length,3);assert.ok(rs.every(r=>r.observationLabel.en.includes(r.configuration.budget)));
 const csv=monitorCsv(rs,set);assert.match(csv.split('\r\n')[0],/"protocol","observationCondition","observationLabel"/);assert.match(csv,/2M tokens per task/);assert.match(csv,/50M tokens per task/);
});
test('compact topic views show one named condition and four distinct systems at a time',async()=>{
 const {chartFacets,monitorChartHeight}=await import('../src/lib/nuwa-intelligence/monitorChart.mjs');
 const s=sets.find(s=>s.benchmarkId==='ape'&&s.bindings.some(b=>b.metricId==='neo-kimi-k3-turn-1-persuasion-attempt-rate')),rows=displayRows(data,s);
 assert.equal(chartFacets(rows,{display:'bars',compact:true}).pages,8);
 const option=monitorChartOption(rows,s,'en',{display:'bars',compact:true});assert.equal(option.title.text,'Conspiracy');assert.equal(option.series[0].data.length,4);assert.ok(monitorChartHeight(rows,{display:'bars',compact:true})<400);
 const next=monitorChartOption(rows,s,'en',{display:'bars',compact:true,facetPage:1});assert.equal(next.title.text,'Undermining Control');assert.equal(next.series[0].data.length,4);
 assert.equal(rows.find(r=>r.system==='DeepSeek V4 Flash'&&r.observationCondition.en==='Conspiracy').value,94);
});
test('condition projection preserves input records, historical dates and independent measurements',()=>{
 const before=JSON.stringify(data),rs=displayRows(data,sets.find(s=>s.benchmarkId==='ape'&&s.bindings.some(b=>b.metricId==='neo-kimi-k3-turn-1-persuasion-attempt-rate')));
 assert.equal(new Set(rs.map(r=>r.resultId+'|'+r.metricId)).size,32);assert.equal(JSON.stringify(data),before);
 const g=sets.find(s=>s.benchmarkId==='alignment-faking'&&s.title.en.includes('Deceptive alignment rate')),matches=displayRows(data,g).filter(r=>r.system==='Claude Opus 4.6');
 assert.equal(matches.length,2);assert.notEqual(matches[0].observationLabel.en,matches[1].observationLabel.en);
});
test('condition-table filters match the displayed budget and localized experimental label',async()=>{
 const {projectEvidenceRows}=await import('../src/lib/nuwa-intelligence/panorama.mjs');
 const cy=sets.find(s=>s.benchmarkId==='cybergym'&&s.bindings.some(b=>b.metricId==='saferai-glm52-cybergym-pass-1')),rs=displayRows(data,cy);
 assert.equal(projectEvidenceRows(rs,{filters:{taskSet:{filterType:'text',type:'contains',filter:'50M tokens per task'}}}).length,2);
 const ape=sets.find(s=>s.benchmarkId==='ape'&&s.bindings.some(b=>b.metricId==='neo-kimi-k3-turn-1-persuasion-attempt-rate'));
 assert.equal(projectEvidenceRows(displayRows(data,ape),{locale:'zh',filters:{taskSet:{filterType:'text',type:'contains',filter:'阴谋论'}}}).length,4);
});
