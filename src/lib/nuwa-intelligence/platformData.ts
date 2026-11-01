import {catalogue, publicReading, publicRelease} from '../../data/nuwa-index';
import {comparisonRows,comparisonPermissions} from './monitoring.mjs';
import {validatePublishedRun} from './platformComparison.mjs';
export const platformVersion='1.0.0';
export const platformDate='2026-11-01';
export const defaultComparisonId='cybergym-common-101-2m';
export const findings:any[]=publicReading.analyses??[];
export const programs=[
 {id:'cyber-capability',protocolId:'agentcyberrange',area:'cybersecurity',status:'preparing',title:{zh:'网络任务能力持续评测',en:'Continuous cyber capability evaluation'}},
 {id:'autonomy-control',protocolId:'replibench',area:'autonomy',status:'preparing',title:{zh:'自主性与可控性评测',en:'Autonomy and controllability evaluation'}},
 {id:'deception-oversight',protocolId:'opendeception',area:'deception',status:'preparing',title:{zh:'欺骗与监督评测',en:'Deception and oversight evaluation'}}
].map(p=>({...p,protocol:catalogue.benchmarks.find(b=>b.id===p.protocolId)??catalogue.benchmarks.find(b=>b.id.includes(p.protocolId))}));
export type PublishedRun={id:string;planId:string;origin:'nuwa';status:'published';protocolVersion:string;system:string;resultIds:string[];receipt:{planId:string;endpoint:string;taskHash:string;harnessHash:string;configurationHash:string;startedAt:string;completedAt:string;aggregationVersion:string;sampleStates:string[]}};
export const publishedRuns:PublishedRun[]=[];
for(const run of publishedRuns){const errors=validatePublishedRun(run,{results:catalogue.results,nuwaExecutorIds:['whitzard']});if(errors.length)throw Error(errors.join('\n'));if(!programs.some(p=>p.id===run.planId)||run.receipt.planId!==run.planId||run.resultIds.some(id=>!catalogue.results.some(r=>r.id===id)))throw Error('Invalid NUWA run references');}
const groups=catalogue.monitoring?.groups??[];
// Each selector option is one native protocol group and metric; no mixed unit charts.
export const comparisonOptions=groups.flatMap(g=>{
 const rows=comparisonRows(catalogue,g,{locale:'en'});
 const metrics=[...new Set(rows.map((r:any)=>r.metricId+'|'+r.unit))];
 return metrics.flatMap(key=>{const values=rows.filter((r:any)=>r.metricId+'|'+r.unit===key);return values.length>=2?[{id:metrics.length===1?g.id:g.id+'--'+encodeURIComponent(key),groupId:g.id,metricKey:key,title:g.title,areas:g.areas,benchmarkId:g.benchmarkId,count:values.length}]:[];});
});
export function comparisonDataset(id=defaultComparisonId,locale='zh'){
 const option=comparisonOptions.find(o=>o.id===id)??comparisonOptions.find(o=>o.id===defaultComparisonId)??comparisonOptions[0];
 const group=groups.find(g=>g.id===option?.groupId);
 if(!option||!group)return {id:'',snapshot:catalogue.snapshotId,title:{zh:'暂无结果',en:'No results'},rows:[],rankAllowed:false,connectAllowed:false,conditions:[],limits:{zh:'',en:''}};
 const permissions=comparisonPermissions(group);
 return {id:option.id,snapshot:catalogue.snapshotId,title:group.title,description:group.description,areas:group.areas,conditions:group.conditions,limits:group.limits,rankAllowed:permissions.rank,connectAllowed:permissions.connect,rows:comparisonRows(catalogue,group,{locale}).filter((r:any)=>r.metricId+'|'+r.unit===option.metricKey)};
}
export function findingFor(area:string){return findings.find(a=>a.area===area);}
export {catalogue,publicRelease};
