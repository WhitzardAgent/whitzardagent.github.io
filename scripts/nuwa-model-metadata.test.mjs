import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
test('model release projection uses the independent record, never falls back to a report date',async()=>{
 const {modelMetadata}=await import('../src/lib/modelMetadata.mjs');
 const m=modelMetadata({id:'gpt-5-5',releaseDate:'2026-04-24',releaseDateBasis:'assessment-reports-release'});
 assert.equal(m.release.date,'2026-04-23');assert.equal(m.release.status,'verified');assert.match(m.release.sources[0].url,/openai.com/);
 const unknown=modelMetadata({id:'deepseek-v4-flash-0731',releaseDate:'2026-07-31'});assert.equal(unknown.release.date,null);assert.equal(unknown.release.status,'pending');
});
test('every model has a maintained record; disclosed sizes distinguish total and active parameters',async()=>{
 const {modelMetadata,validateModelMetadata,modelMetadataRegistry}=await import('../src/lib/modelMetadata.mjs');const d=JSON.parse(fs.readFileSync('src/data/nuwa-index/catalogue.json'));
 assert.deepEqual(validateModelMetadata(d.models),[]);assert.equal(modelMetadataRegistry.models.length,d.models.length);
 const m=modelMetadata(d.models.find(m=>m.id==='kimi-k3'));assert.equal(m.parameters.total,2800e9);assert.equal(m.parameters.active,104e9);assert.equal(m.parameters.architecture,'MoE');
 const p=modelMetadata(d.models.find(m=>m.id==='claude-opus-4-6')).parameters;assert.equal(p.total,null);assert.equal(p.status,'not-disclosed');
});
test('comparison projection and CSV include release provenance and model size, keeping source experiments intact',async()=>{
 const {comparisonRows,monitorCsv}=await import('../src/lib/nuwa-intelligence/monitoring.mjs');const d=JSON.parse(fs.readFileSync('src/data/nuwa-index/catalogue.json'));const g=d.monitoring.groups.find(g=>g.bindings.some(b=>b.modelId==='gpt-5-5'));const before=JSON.stringify(d);const rows=comparisonRows(d,g),r=rows.find(r=>r.modelId==='gpt-5-5');
 assert.equal(r.releaseDate,'2026-04-23');assert.equal(r.releaseDateBasis,'developer-release');assert.equal(r.modelMetadata.parameters.total,null);assert.match(monitorCsv(rows,g).split('\r\n')[0],/releaseSource.*totalParameters/);assert.equal(JSON.stringify(d),before);
});
test('model release and parameter citations resolve independently and deduplicate by document',async()=>{
 const{modelMetadataReferences,modelMetadataSources}=await import('../src/lib/modelMetadata.mjs');const{collectPageSources}=await import('../src/lib/researchCitations.mjs');const refs=modelMetadataReferences({id:'kimi-k3'}),sources=modelMetadataSources([{id:'kimi-k3'}]);const entries=collectPageSources(refs,sources);assert.equal(entries.length,2);assert.ok(entries.some(e=>e.url==='https://huggingface.co/moonshotai/Kimi-K3'));assert.ok(entries.some(e=>e.url.includes('whats-new')));
});
