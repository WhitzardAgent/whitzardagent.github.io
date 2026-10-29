import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {buildPreviewCorpus,compileCandidate,verifyCapturedPackages} from '../src/lib/nuwa-intelligence/researchCandidate.mjs';
const catalogue=JSON.parse(fs.readFileSync('src/data/nuwa-index/catalogue.json'));
const reading=JSON.parse(fs.readFileSync('src/data/nuwa-index/reading/2026-10-28.2.json'));
test('candidate excludes political objects and source-derived results, retaining original',()=>{
 const before=JSON.stringify(catalogue);const p=buildPreviewCorpus(catalogue,reading);
 assert.equal(p.works.length,172);assert(!p.documents.some(d=>/political-persuasion|action-persuasion|levers-persuasion/.test(d.id)));
 assert(p.documents.some(d=>d.type==='benchmark'));assert(p.documents.some(d=>d.type==='synthesis'));assert(p.documents.some(d=>d.type==='observation'));
 assert.equal(JSON.stringify(catalogue),before);assert.equal(p.baseSnapshotId,'2026-10-28.2');
});
test('incremental compilation is deterministic and rejects base drift and duplicate identities',()=>{
 const m={baseSnapshotId:catalogue.snapshotId,packages:[]};assert.deepEqual(compileCandidate(catalogue,reading,m),compileCandidate(catalogue,reading,m));
 assert.throws(()=>compileCandidate(catalogue,reading,{...m,baseSnapshotId:'old'}),/base/);
 assert.throws(()=>compileCandidate(catalogue,reading,{...m,packages:[{id:'x',url:'https://example.org',source:{sha256:'a'},en:{},zh:{}},{id:'x'}]}),/duplicate/);
});
test('synthesis search titles are present',()=>{
 const p=buildPreviewCorpus(catalogue,reading);assert(p.documents.filter(d=>d.type==='synthesis').every(d=>d.title));
});

test('changed capture bytes are rejected before preview rendering',()=>{assert.throws(()=>verifyCapturedPackages([{id:'changed',source:{path:'scripts/nuwa-research-preview.test.mjs',sha256:'0'.repeat(64)}}]),/Source changed/);});
