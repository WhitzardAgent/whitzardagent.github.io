import test from 'node:test';import assert from 'node:assert/strict';
import {loadMonitoringDrafts} from '../src/lib/nuwa-intelligence/localReview.mjs';
test('default build never reads or returns private editorial drafts',()=>{let reads=0;const result=loadMonitoringDrafts({snapshotId:'x'}, {},()=>{reads++;throw Error('private read');});assert.deepEqual(result,[]);assert.equal(reads,0);});
test('local review requires explicit external root and rejects mismatched snapshots',()=>{assert.throws(()=>loadMonitoringDrafts({snapshotId:'x'},{NUWA_LOCAL_REVIEW:'1'},()=>{}),/NUWA_PRIVATE_ROOT/);assert.throws(()=>loadMonitoringDrafts({snapshotId:'x'},{NUWA_LOCAL_REVIEW:'1',NUWA_PRIVATE_ROOT:'/tmp/nuwa-review-outside'},()=>JSON.stringify({snapshotId:'other',analyses:[]})),/snapshot/);});
