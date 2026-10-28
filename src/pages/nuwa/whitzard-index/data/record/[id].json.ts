import {getCollection} from 'astro:content';
import {catalogue,publicReading} from '../../../../../data/nuwa-index';
import {readingStatus,loadResearchDossiers} from '../../../../../lib/nuwa-intelligence/researchReading.mjs';
import {digest} from '../../../../../lib/nuwa-intelligence/sourceVersions.mjs';
export function getStaticPaths(){return catalogue.works.filter(work=>!work.localReviewBatchId).map(work=>({params:{id:work.id},props:{id:work.id}}));}
export async function GET({props}:{props:{id:string}}){
 const work=catalogue.works.find(w=>w.id===props.id)!,wiki=(await getCollection('nuwaWiki')).filter(e=>e.data.recordId===work.id).map(e=>({locale:e.data.locale,updatedOn:e.data.updatedOn,body:e.body??'',sha256:digest(e.body??''),sourceRefs:e.data.sourceRefs})),source=catalogue.sources.find(s=>s.id===work.sourceId),versions=catalogue.sourceVersions?.filter(v=>v.sourceId===work.sourceId)??[],payload={schemaVersion:'nuwa-record-2',snapshotId:catalogue.snapshotId,work,source,sourceVersions:versions,readingScope:readingStatus(work,{dossier:loadResearchDossiers(catalogue).find((d:any)=>d.id===work.id)}),readingDossier:publicReading.works.find((d:any)=>d.id===work.id),contextUpdate:publicReading.supplement.updates.find((u:any)=>u.id===work.id)??null,retainedWikiEditions:wiki,relatedProtocolIds:work.protocolIds,sourceClaims:catalogue.claims?.filter(c=>versions.some(v=>v.id===c.sourceVersionId))??[],scope:'Published NUWA reading edition and source evidence. Publication does not establish independent evidence review or experimental replication.'};
 return Response.json({...payload,contentHash:digest(payload)});
}
