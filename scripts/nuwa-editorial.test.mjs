import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {buildDisplaySets,displayRows} from '../src/lib/nuwa-intelligence/panorama.mjs';
import {selectTopicPresentation,researchCoverage,metricDefinition} from '../src/lib/nuwa-intelligence/editorial.mjs';
const data=JSON.parse(fs.readFileSync(new URL('../src/data/nuwa-index/catalogue.json',import.meta.url)));
test('editorial defaults select measured questions rather than the largest display group',()=>{
 for(const [area,benchmark,metric,view] of [['autonomy','time-horizons','metr-p50','timeline'],['deception','agentic-misalignment','saferai-glm52-agentic-misalignment-harmful-action-rate','bars'],['cybersecurity','cybergym','saferai-glm52-cybergym-pass-1','timeline']]){
  const groups=buildDisplaySets(data,{area}),p=selectTopicPresentation(data,area,groups);
  assert.equal(p.groups[0].benchmarkId,benchmark);assert.ok(p.groups[0].bindings.some(b=>b.metricId===metric));assert.equal(p.defaultDisplay,view);
  assert.ok(p.indicatorIds.length<=5);assert.equal(new Set(p.groups.map(g=>g.id)).size,groups.length,'all legacy display IDs remain addressable');
 }
});
test('factorial default preserves every genuine zero and experimental condition',()=>{
 const p=selectTopicPresentation(data,'deception',buildDisplaySets(data,{area:'deception'}));const rows=displayRows(data,p.groups[0]);
 assert.equal(rows.length,108);assert.equal(rows.filter(r=>r.value===0).length,103);assert.ok(rows.every(r=>r.experimentalConditions.goal&&r.experimentalConditions.threat));
});
test('explicit measurement rules are protocol specific and do not merge unknown scores',()=>{
 assert.equal(metricDefinition('cybench','cybench-m0').family,'unguided');assert.equal(metricDefinition('cybench','cybench-m1').family,'subtask-guided');
 assert.equal(metricDefinition('agentcyberrange','agentcyberrange-official-pass3',{taskSet:'Web Exploitation'}).family,'web-pass3');
 assert.equal(metricDefinition('agentcyberrange','agentcyberrange-official-pass3',{taskSet:'Post Exploitation'}).family,'post-pass3');
 assert.equal(metricDefinition('cybench','unreviewed-new-score'),null);
});
test('research coverage counts unique works per primary function and topic',()=>{
 const coverage=researchCoverage(data);assert.equal(coverage.length,6);
 for(const row of coverage)for(const cell of row.cells){const works=data.works.filter(w=>w.primaryFunction===cell.functionId&&w.areas.includes(row.area));assert.equal(cell.count,works.length);assert.deepEqual(cell.workIds,works.map(w=>w.id));}
 assert.ok(coverage.every(row=>row.cells.map(c=>c.functionId).join(',')==='discovery,evaluation,governance'));
});
test('compact condition charts page scenarios without dropping rows from data or export',async()=>{
 const {monitorChartOption,chartFacets}=await import('../src/lib/nuwa-intelligence/monitorChart.mjs');const p=selectTopicPresentation(data,'deception',buildDisplaySets(data,{area:'deception'})),rows=displayRows(data,p.groups[0]);
 const state={display:'bars',compact:true};const scopes=chartFacets(rows,state);assert.equal(scopes.visible.length,1);assert.equal(scopes.pages,3);
 const option=monitorChartOption(rows,p.groups[0],'en',state);assert.equal(option.series.flatMap(s=>s.data??[]).length,36);
 const exported=monitorChartOption(rows,p.groups[0],'en',{...state,exportAll:true});assert.equal(exported.series.flatMap(s=>s.data??[]).length,108);
});
