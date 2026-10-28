import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {frameworkRelationships,frameworkResearchQuery} from '../src/lib/frameworkRelationships.mjs';
import {matchesIndexRecord} from '../src/lib/nuwaIndexFilters.mjs';
import {benchmarkCardProjection} from '../src/lib/benchmarkCards.mjs';
import {benchmarkResultEntries} from '../src/lib/nuwa-intelligence/monitoring.mjs';
const catalogue=JSON.parse(fs.readFileSync(new URL('../src/data/nuwa-index/catalogue.json',import.meta.url)));
test('both agentic mechanisms reach the complete dual-use set as conceptual pathways',()=>{
 const model=frameworkRelationships(catalogue);
 const domains=catalogue.areas.filter(a=>a.family==='dual-use-risk').map(a=>a.id).sort();
 assert.deepEqual(model.domains.map(a=>a.id).sort(),domains);
 for(const mechanism of model.mechanisms){assert.equal(mechanism.relation,'conceptual');assert.deepEqual([...mechanism.domainIds].sort(),domains);for(const work of mechanism.works)assert.ok(work.areas.includes(mechanism.id));}
});
test('every framework evidence link has an original source and a research search match',()=>{
 const model=frameworkRelationships(catalogue);
 for(const node of [...model.mechanisms,...model.capabilities]) for(const work of node.works){
  assert.ok(catalogue.sources.find(s=>s.id===work.sourceId)?.url);
  assert.ok(work.note.limits?.en,'source-specific boundary retained');
  const filters=Object.fromEntries(new URLSearchParams(frameworkResearchQuery(work)));
  assert.ok(matchesIndexRecord({areas:work.areas,search:work.title},filters));
 }
 // Enabling examples do not assert a one-to-one link to a harm domain.
 for(const capability of model.capabilities)assert.equal('domainIds' in capability,false);
});
test('compact benchmark projections preserve every observation and source for filtering',()=>{
 for(const entry of benchmarkResultEntries(catalogue,catalogue.results)){
  const rows=benchmarkCardProjection(entry);
  assert.deepEqual(rows.flatMap(r=>r.resultIds).sort(),entry.groups.flatMap(g=>g.records.map(r=>r.id)).sort());
  for(const row of rows){assert.equal(row.benchmark,entry.id);assert.ok(row.sourceId);assert.ok(row.systemKey);assert.ok(matchesIndexRecord(row,{benchmark:entry.id}));}
  for(const area of catalogue.areas){
   const expected=entry.groups.flatMap(g=>g.records).filter(r=>r.areas.includes(area.id)).map(r=>r.id).sort();
   const actual=rows.filter(r=>matchesIndexRecord(r,{area:area.id})).flatMap(r=>r.resultIds).sort();
   assert.deepEqual(actual,expected);
  }
 }
});
