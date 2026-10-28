import {canonicalDocumentId,digest} from './sourceVersions.mjs';
const DAY=86400000;
export function weeklyScanWindow(state={},now=new Date().toISOString()){
 const end=Date.parse(now),prior=state.lastSuccessfulScanAt?Date.parse(state.lastSuccessfulScanAt):end-7*DAY;
 if(!Number.isFinite(end)||!Number.isFinite(prior)||prior>end)throw Error('Invalid successful scan cutoff');
 return {from:new Date(prior-2*DAY).toISOString(),to:new Date(end).toISOString(),overlapDays:2};
}
export function weeklyCandidateIdentity(candidate){return candidate.publicationId??canonicalDocumentId(candidate.url);}
export function weeklyCandidateFingerprint(candidate){return digest({identity:weeklyCandidateIdentity(candidate),version:candidate.version??null,sourceHashes:[...(candidate.sourceHashes??[])].sort(),content:candidate.content});}
export function prepareWeeklyUpdate({state={},candidates,now,baseSnapshotId,scanSucceeded}){
 if(scanSucceeded!==true)throw Error('An unsuccessful scan cannot advance the cutoff or prepare a publishable batch');
 if(!baseSnapshotId||!Array.isArray(candidates))throw Error('Base snapshot and normalized candidates are required');
 const window=weeklyScanWindow(state,now),queue=new Map((state.queue??[]).map(c=>[c.identity,c])),seen=new Map();
 for(const input of candidates){
  if(!input.url||!input.content||!input.sourceHashes?.length)throw Error('Candidate needs original URL, content and source hashes');
  const identity=weeklyCandidateIdentity(input),fingerprint=weeklyCandidateFingerprint(input);
  if(seen.has(identity)&&seen.get(identity)!==fingerprint)throw Error(`Resolve conflicting publication versions before preparing: ${identity}`);
  seen.set(identity,fingerprint);const prior=queue.get(identity),unchanged=prior?.fingerprint===fingerprint;
  queue.set(identity,{...input,identity,fingerprint,disposition:unchanged?prior.disposition:'awaiting-review',approval:unchanged&&prior.approval?.baseSnapshotId===baseSnapshotId?prior.approval:null,firstSeenAt:prior?.firstSeenAt??window.to,lastSeenAt:window.to});
 }
 const ordered=[...queue.values()].sort((a,b)=>a.identity.localeCompare(b.identity));
 const pending=ordered.filter(c=>['awaiting-review','approved'].includes(c.disposition));
 const contentHash=digest({baseSnapshotId,candidates:pending.map(c=>({identity:c.identity,fingerprint:c.fingerprint}))});
 const hasReview=pending.length>0,unchangedBatch=state.pendingReview?.contentHash===contentHash;
 const batch=hasReview?{schemaVersion:'nuwa-weekly-review-1',id:unchangedBatch?state.pendingReview.id:`nuwa-weekly-${window.to.slice(0,10)}-${contentHash.slice(0,12)}`,createdAt:unchangedBatch?state.pendingReview.createdAt:window.to,baseSnapshotId,contentHash,publication:'awaiting-user-review',candidates:pending}:null;
 return {window,batch,shouldNotify:Boolean(batch&&contentHash!==state.lastDeliveredReviewHash),state:{...state,lastSuccessfulScanAt:window.to,lastPublishedSnapshotId:state.lastPublishedSnapshotId??null,queue:ordered,pendingReview:batch?{id:batch.id,createdAt:batch.createdAt,contentHash:batch.contentHash}:null}};
}
export function recordWeeklyDelivery(state,contentHash){if(state.pendingReview?.contentHash!==contentHash)throw Error('Only the exact prepared review may be marked delivered');return {...state,lastDeliveredReviewHash:contentHash};}
export function assertWeeklyPublicationApproval(batch,approval,currentSnapshotId){
 if(!batch||!approval||approval.actor!=='user'||!approval.reference||approval.contentHash!==batch.contentHash||approval.baseSnapshotId!==batch.baseSnapshotId||currentSnapshotId!==batch.baseSnapshotId)throw Error('Publication requires user approval bound to this exact content and current base snapshot');
 return true;
}
