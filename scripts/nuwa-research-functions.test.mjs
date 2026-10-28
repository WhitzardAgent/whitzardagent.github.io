import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {readIndexFilters,writeIndexFilters,matchesIndexRecord,validateCatalogue}from'../src/lib/nuwaIndex.mjs';
const d=JSON.parse(fs.readFileSync(new URL('../src/data/nuwa-index/catalogue.json',import.meta.url)));
test('research has three top-level functions with monitoring under evaluation and incident investigation under governance',()=>{
 assert.deepEqual(d.functions.map(f=>f.id),['discovery','evaluation','governance']);
 const monitoring=d.works.find(w=>w.id==='monitoring-monitorability'),incident=d.works.find(w=>w.id==='hugging-face-incident');
 assert.equal(monitoring.primaryFunction,'evaluation');assert.ok(monitoring.tags.includes('risk-monitoring'));
 assert.equal(incident.primaryFunction,'governance');assert.ok(incident.tags.includes('incident-investigation'));
 assert.ok(d.works.every(w=>['discovery','evaluation','governance'].includes(w.primaryFunction)));
});
test('research tags filter independently and preserve legacy monitoring links',()=>{
 const q=readIndexFilters('?view=research&function=monitoring');assert.equal(q.function,'evaluation');assert.equal(q.tag,'risk-monitoring');
 assert.deepEqual(readIndexFilters(writeIndexFilters('',q)),q);
 assert.ok(matchesIndexRecord({areas:[],functions:['evaluation'],tags:['risk-monitoring'],search:''},q));
 assert.ok(!matchesIndexRecord({areas:[],functions:['evaluation'],tags:[],search:''},q));
});
test('five-function historical snapshots remain readable',()=>{
 const old=JSON.parse(fs.readFileSync(new URL('../src/data/nuwa-index/snapshots/2026-10-26.4.json',import.meta.url)));assert.equal(old.functions.length,5);assert.deepEqual(validateCatalogue(old),[]);
});
