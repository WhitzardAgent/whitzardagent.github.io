import presentationPolicy from '../../data/nuwa-index/presentation-policy.json' with {type:'json'};
/** Presentation projections only: they never promote source review or comparison status. */
import {contextualizeObservations,separateConditionScopes,taskConditionText} from './observationContext.mjs';
import {metricDefinition} from './editorial.mjs';
import {comparisonRows,comparisonPermissions,resultAreas} from './monitoring.mjs';
const T=(en,zh=en)=>({en,zh});
const norm=s=>String(s??'').toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g,' ').trim();
const hash=s=>{let n=2166136261;for(const c of s)n=Math.imul(n^c.charCodeAt(0),16777619);return(n>>>0).toString(36);};
const unknown=v=>!v||/not (?:disclosed|specified|established|reported)|unknown|unspecified|未披露|未注明|未确定/i.test(String(v));
export function measurementFamily(record,metric){
 const b=record.benchmarkId,l=norm(metric.label?.en),task=norm(record.taskSet);let key=l,title=metric.label;
 const definition=metricDefinition(b,metric.id,record);
 if(definition)return {id:`${definition.legacyKey??(b==='time-horizons'?l:definition.family)}|${metric.unit}|${metric.dimension}`,label:definition.label};
 if(b==='cybergym'&&metric.unit==='%'&&(/success rate|reproduction|cybergym pass 1/.test(l))){key='reproduction';title=T('Vulnerability reproduction rate','漏洞复现率');}
 if(b==='cybench'){
  if(/category/.test(l)){key='category-pass1';title=T('Category pass@1','分类任务 Pass@1');}
  else if(/unguided|^(?:cybench )?pass 1$/.test(l)){key='unguided';title=T('Unguided task success','无子任务引导的任务成功率');}
 }
 if(b==='agentcyberrange'){
  if(/web/.test(l)||(!/post/.test(l)&&/web/.test(task))){key='web-pass3';title=T('Web exploitation · Pass@3','Web 漏洞利用 · Pass@3');}
  else if(/post/.test(l+' '+task)){key='post-pass3';title=T('Post exploitation · Pass@3','后渗透 · Pass@3');}
 }
 if(record.experimentalConditions?.goal&&record.experimentalConditions?.threat){key='harmful-action-conditions';title=T('Harmful actions','有害行动发生率');}
 if(b==='deceptionbench'){
  if(/single turn/.test(l)){key='single-turn';title=T('Single-turn deception','单轮欺骗');}
  else if(/multi turn/.test(l)){key='multi-turn';title=T('Multi-turn deception under pressure','压力条件下的多轮欺骗');}
  // Other labels are deliberately not assumed to use the same turn/pressure protocol.
 }
 return {id:`${key}|${metric.unit}|${metric.dimension}`,label:title??T(key)};
}
function facetFor(r,m){
 // Retain task scopes for condition footnotes or separate experimental panels.
 const task=String(r.taskSet??'Task scope not disclosed').trim();
 const category=/category/.test(norm(m.label?.en))?String(r.configuration?.category??r.protocol??''):'';
 const key=`${norm(task)}|${category}`;
 return {id:'scope-'+hash(key),label:T(task),taskSet:task};
}
export function buildDisplaySets(data,{area,benchmarkId}={}){
 const sets=new Map(),resultMap=new Map(data.results.map(r=>[r.id,r]));
 for(const sourceGroup of [...data.monitoring?.groups??[],...data.candidateMonitoringGroups??[]]){
  if(benchmarkId&&sourceGroup.benchmarkId!==benchmarkId)continue;
  const benchmark=data.benchmarks.find(b=>b.id===sourceGroup.benchmarkId);if(!benchmark||benchmark.kind==='report')continue;
  for(const binding of sourceGroup.bindings??[]){
   const r=resultMap.get(binding.resultId),metric=r?.metrics.find(m=>m.id===binding.metricId);if(!r||!metric||!Number.isFinite(metric.value))continue;
   const areas=sourceGroup.areas?.length?sourceGroup.areas:resultAreas(data,r);if(area&&!areas.includes(area))continue;
   const family=measurementFamily(r,metric),id=`panorama-${benchmark.id}-${hash(family.id)}`;
   if(!sets.has(id))sets.set(id,{id,revision:'display-1',benchmarkId:benchmark.id,title:T(`${benchmark.name} · ${family.label.en}`,`${benchmark.name} · ${family.label.zh}`),description:T('Published measurements across source reports. Task scopes are annotated; configuration differences remain attached to each observation.','跨来源报告的已发表测量。任务范围通过注释区分，配置差异保留在每条观测中。'),level:'panorama',conditionsComplete:false,review:{status:'presentation-only'},areas:[],sourceIds:[],sourceGroupIds:[],bindings:[],facets:[],limits:T('Compare results within the stated task and configuration.','结合任务范围与运行配置解读结果。'),defaultDisplay:'timeline'});
   const set=sets.get(id),key=`${r.id}|${metric.id}`,prior=set.bindings.find(b=>b.key===key),facet=facetFor(r,metric);
   const exactLinks=[...new Set((data.assessmentEvidence??[]).filter(l=>l.resultId===r.id).map(l=>l.modelId).filter(Boolean))];
   const modelId=binding.modelId??(exactLinks.length===1?exactLinks[0]:null);
   const p=comparisonPermissions(sourceGroup),complete=!unknown(r.configuration?.harness)&&!unknown(r.configuration?.budget)&&!unknown(r.taskSet)&&!unknown(r.trialCount);
   const meta={...binding,modelId,key,facetId:facet.id,sourceGroupId:sourceGroup.id,comparisonLevel:sourceGroup.level,conditionStatus:p.rank?'matched':complete?'conditional':'incomplete',canRank:p.rank,canConnect:p.connect};
   if(!prior)set.bindings.push(meta);else if(!prior.modelId&&modelId)Object.assign(prior,meta);
   if(!set.facets.some(f=>f.id===facet.id))set.facets.push(facet);
   set.areas=[...new Set([...set.areas,...areas])];set.sourceIds=[...new Set([...set.sourceIds,r.sourceId,...sourceGroup.sourceIds??[]])];set.sourceGroupIds=[...new Set([...set.sourceGroupIds,sourceGroup.id])];
  }
 }
 for(const set of sets.values()){
  separateConditionScopes(set,resultMap);
  // Only source-reviewed measurement aliases are deduplicated. Other apparent repeats remain.
  const aliases=data.monitoring?.measurementAliases??[];
  set.aliasBindings=[];set.bindings=set.bindings.filter(b=>{const alias=aliases.find(a=>a.resultId===b.resultId&&a.metricId===b.metricId);const canonical=alias&&set.bindings.find(x=>x.resultId===alias.canonicalResultId&&x.metricId===alias.canonicalMetricId);if(!canonical)return true;canonical.quotedResultIds=[...new Set([...(canonical.quotedResultIds??[]),b.resultId])];set.aliasBindings.push({...b,canonicalKey:canonical.key});return false;});
  set.facets=set.facets.filter(f=>[...set.bindings,...set.aliasBindings].some(b=>b.facetId===f.id));
  if(presentationPolicy.sameMeasurementScopes==='annotated'&&set.facets.length>1&&!set.facets.some(f=>f.condition)&&!set.bindings.some(b=>resultMap.get(b.resultId)?.experimentalConditions)){
   set.scopePresentation='annotated';set.presentationVersion=presentationPolicy.version;
   set.scopeNotes=set.facets.map(f=>({en:f.label.en,zh:f.label.zh}));
  }
 }
 const tiers=new Map((data.monitoring?.benchmarkSelections??[]).map((s,i)=>[s.benchmarkId,(s.tier==='core'?0:s.tier==='supplement'?1000:2000)+i]));
 return [...sets.values()].sort((a,b)=>{const topicPriority=s=>area==='deception'?(s.benchmarkId==='deceptionbench'&&/single.turn/i.test(s.title.en)?0:s.benchmarkId==='deceptionbench'?1:3):area==='cybersecurity'?(s.benchmarkId==='cybergym'&&/reproduction rate/i.test(s.title.en)?0:1):1;const dated=s=>s.bindings.filter(b=>data.models?.find(m=>m.id===b.modelId)?.releaseDate).length,primary=s=>/50% task|reproduction rate|single.turn deception|Web exploitation|Unguided task|Headline success|Turn.1 persuasion/i.test(s.title.en)?1:0;return topicPriority(a)-topicPriority(b)||primary(b)-primary(a)||(dated(b)>=2?1:0)-(dated(a)>=2?1:0)||(tiers.get(a.benchmarkId)??9999)-(tiers.get(b.benchmarkId)??9999)||b.bindings.length-a.bindings.length||a.id.localeCompare(b.id);});
}
export function displayRows(data,set,state={}){
 const allBindings=[...set.bindings,...set.aliasBindings??[]],base=comparisonRows(data,{...set,bindings:allBindings},state),bindings=new Map(allBindings.map(b=>[`${b.resultId}|${b.metricId}`,b]));
 const activeKeys=new Set(base.map(r=>r.resultId+'|'+r.metricId));const visible=base.filter(r=>{const b=bindings.get(r.resultId+'|'+r.metricId);return !b?.canonicalKey||!activeKeys.has(b.canonicalKey);});
 const rows=visible.map(r=>{const b=bindings.get(`${r.resultId}|${r.metricId}`)??{},facet=set.facets?.find(f=>f.id===b.facetId);return {...r,key:`${r.resultId}|${r.metricId}`,conditionStatus:b.conditionStatus??'incomplete',canRank:b.canRank??false,canConnect:b.canConnect??false,sourceGroupId:b.sourceGroupId,comparisonLevel:b.comparisonLevel,facetId:b.facetId??'source',facetLabel:facet?.label??T(r.taskSet),conditionScope:Boolean(facet?.condition),quotedResultIds:(b.quotedResultIds??[]).filter(id=>base.some(x=>x.resultId===id))};}).filter(r=>(!state.facet||state.facet==='all'||r.facetId===state.facet)&&(state.evidence!=='strict'||r.conditionStatus==='matched'));
 const contextual=contextualizeObservations(rows);
 const presented=set.scopePresentation==='annotated'?contextual.map(r=>{const n=set.facets.findIndex(f=>f.id===r.facetId)+1;return {...r,sourceFacetId:r.facetId,facetId:'combined-scopes',facetLabel:set.title,scopeReference:n,observationLabel:{en:r.observationLabel.en+` [${n}]`,zh:r.observationLabel.zh+` [${n}]`}};}):contextual;
 return projectEvidenceRows(presented,{locale:state.locale,filters:state.gridFilters,sortField:state.gridSortField,sortDirection:state.gridSortDirection,rankAllowed:rows.length>0&&rows.every(r=>r.canRank)&&new Set(rows.map(r=>r.sourceGroupId)).size===1});
}
function fieldValue(row,key,locale='en'){return ({system:row.system,modelName:row.modelName,value:row.value,conditionStatus:row.conditionStatus,protocol:row.taskSet,taskSet:taskConditionText(row,locale),harness:row.configuration?.harness,evaluator:row.attribution?.evaluator,releaseDate:row.releaseDate,reportDate:row.reportDate})[key]??row[key];}
function matches(value,f){
 if(!f)return true;if(f.conditions?.length)return f.operator==='OR'?f.conditions.some(c=>matches(value,c)):f.conditions.every(c=>matches(value,c));
 const missing=value===null||value===undefined||value==='';if(f.type==='blank')return missing;if(f.type==='notBlank')return !missing;if(missing)return false;
 if(f.filterType==='number'){const n=Number(value),v=Number(f.filter);return({equals:n===v,notEqual:n!==v,greaterThan:n>v,greaterThanOrEqual:n>=v,lessThan:n<v,lessThanOrEqual:n<=v,inRange:n>=v&&n<=Number(f.filterTo)})[f.type]??true;}
 const v=String(value).toLowerCase(),s=String(f.filter??f.dateFrom??'').toLowerCase().slice(0,f.filterType==='date'?10:undefined);
 return({contains:v.includes(s),notContains:!v.includes(s),equals:v===s,notEqual:v!==s,startsWith:v.startsWith(s),endsWith:v.endsWith(s),greaterThan:v>s,lessThan:v<s,inRange:v>=s&&v<=String(f.dateTo??'').slice(0,10)})[f.type]??true;
}
export function projectEvidenceRows(rows,{filters={},sortField,sortDirection='asc',rankAllowed=false,locale='en'}={}){
 const shown=rows.filter(r=>Object.entries(filters??{}).every(([key,f])=>matches(fieldValue(r,key,locale),f)));
 if(!sortField)return shown;
 const direction=sortDirection==='desc'?-1:1;return [...shown].sort((a,b)=>{const av=fieldValue(a,sortField,locale),bv=fieldValue(b,sortField,locale);if(av==null)return bv==null?0:1;if(bv==null)return-1;return direction*(typeof av==='number'&&typeof bv==='number'?av-bv:String(av).localeCompare(String(bv)));});
}
export function displayCoverage(data){const sets=buildDisplaySets(data),rows=sets.flatMap(s=>displayRows(data,s));return {snapshotId:data.snapshotId,summary:{sets:sets.length,observations:rows.length,dated:rows.filter(r=>r.releaseDate).length,unlocated:rows.filter(r=>!r.releaseDate).length},sets:sets.map(s=>{const rs=rows.filter(r=>s.bindings.some(b=>b.key===r.key));return{id:s.id,benchmarkId:s.benchmarkId,label:s.title.en,observations:rs.length,dated:rs.filter(r=>r.releaseDate).length,facets:s.facets.length};}),records:rows.map(r=>({resultId:r.resultId,metricId:r.metricId,status:r.releaseDate?'timeline':r.modelId?'release-date-unresolved':'identity-unresolved',condition:r.conditionStatus,facet:r.facetId}))};}
