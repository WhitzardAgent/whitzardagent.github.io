import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {prepareGlobalWeekly} from './prepare-nuwa-global-weekly.mjs';
import {recordWeeklyDelivery} from '../src/lib/nuwa-intelligence/weeklyUpdates.mjs';
const publication={id:'paper',identity:'arxiv:2501.12345',url:'https://arxiv.org/abs/2501.12345v2',title:'A study',sourceHash:'a'.repeat(64),fullSource:{sha256:'b'.repeat(64)},en:{findings:['A']},zh:{findings:['甲']},observations:[]};
const edition={candidateId:'local-example',baseSnapshotId:'2026-10-28.2',publications:[publication]};
const now='2026-10-30T08:00:00.000Z';
test('global weekly reuses canonical identity, bilingual content and delivered batch deduplication',()=>{
 const first=prepareGlobalWeekly({edition,state:{lastPublishedSnapshotId:'2026-10-28.2'},scanSucceeded:true,now});
 assert.equal(first.batch.candidates[0].identity,'arxiv:2501.12345');
 assert.deepEqual(first.batch.candidates[0].content.zh,{findings:['甲']});
 assert.deepEqual(first.batch.candidates[0].sourceHashes,['a'.repeat(64),'b'.repeat(64)]);
 const state=recordWeeklyDelivery(first.state,first.batch.contentHash);
 const second=prepareGlobalWeekly({edition,state,scanSucceeded:true,now:'2026-11-06T08:00:00.000Z'});
 assert.equal(second.shouldNotify,false);assert.equal(second.state.queue.length,1);
 assert.equal(second.state.lastPublishedSnapshotId,'2026-10-28.2');
});
test('global weekly content change invalidates previous approval',()=>{
 const first=prepareGlobalWeekly({edition,state:{},scanSucceeded:true,now});
 first.state.queue[0].approval={baseSnapshotId:edition.baseSnapshotId,reference:'old'};
 first.state.queue[0].disposition='approved';
 const changed=structuredClone(edition);changed.publications[0].en.findings=['Changed'];
 const second=prepareGlobalWeekly({edition:changed,state:first.state,scanSucceeded:true,now});
 assert.equal(second.state.queue[0].approval,null);assert.equal(second.state.queue[0].disposition,'awaiting-review');
 assert.notEqual(second.batch.contentHash,first.batch.contentHash);
});
test('unsuccessful or HTTP-only scan cannot advance state',()=>{
 const state={lastSuccessfulScanAt:'2026-10-20T08:00:00Z'},before=structuredClone(state);
 for(const scanSucceeded of [false,undefined])assert.throws(()=>prepareGlobalWeekly({edition,state,scanSucceeded,now}),/unsuccessful scan/);
 assert.deepEqual(state,before);
});
test('CLI requires explicit substantive success and leaves existing state untouched',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'nuwa-global-weekly-'));
 try{
  fs.mkdirSync(path.join(root,'complete'));fs.writeFileSync(path.join(root,'complete/candidate.json'),JSON.stringify(edition));
  const stateFile=path.join(root,'existing.json'),original=JSON.stringify({lastPublishedSnapshotId:'2026-10-28.2'});fs.writeFileSync(stateFile,original);
  const args=['scripts/prepare-nuwa-global-weekly.mjs','--root',root,'--state',stateFile,'--now',now];
  assert.notEqual(spawnSync(process.execPath,args,{encoding:'utf8'}).status,0);
  assert.notEqual(spawnSync(process.execPath,[...args,'--scan-succeeded','false'],{encoding:'utf8'}).status,0);
  assert.equal(fs.existsSync(path.join(root,'weekly-review')),false);
  const ok=spawnSync(process.execPath,[...args,'--scan-succeeded'],{encoding:'utf8'});assert.equal(ok.status,0,ok.stderr);
  assert.equal(fs.readFileSync(stateFile,'utf8'),original);assert.ok(fs.existsSync(path.join(root,'weekly-review/state.json')));
  assert.equal(JSON.parse(fs.readFileSync(path.join(root,'weekly-review/review.json'))).publication,'not-performed');
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});
test('aliases for the same canonical publication produce one queued candidate',()=>{
 const a={...publication,identity:undefined,url:'https://arxiv.org/abs/2501.12345v2'};
 const b={...publication,identity:undefined,id:'alias',url:'https://arxiv.org/pdf/2501.12345v2'};
 const result=prepareGlobalWeekly({edition:{...edition,publications:[a,b]},state:{},scanSucceeded:true,now});
 assert.equal(result.state.queue.length,1);assert.equal(result.state.queue[0].identity,'arxiv:2501.12345');
});
