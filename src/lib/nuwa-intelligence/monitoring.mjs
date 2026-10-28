import {modelSizeMark,modelSizeScale} from './modelSize.mjs';
import {organizationBrand} from '../organizationBrands.mjs';
import {resolveDeveloper,reportedBrandIds} from '../modelBrandIdentity.mjs';
import {reportedCondition} from './observationContext.mjs';
import {modelMetadata,modelRelease} from '../modelMetadata.mjs';
import {resultGroups} from '../modelEvidence.mjs';
import {matchesIndexRecord} from '../nuwaIndexFilters.mjs';

const text=(v,locale='en')=>typeof v==='string'?v:v?.[locale]??v?.en??'';
const unique=a=>[...new Set(a.filter(Boolean))];
const names=(data,ids,locale)=>unique(ids).map(id=>text(data.organizations?.find(o=>o.id===id)?.name,locale)||id);
export function resultAttribution(data,record,locale='en') {
 const links=(data.assessmentEvidence??[]).filter(l=>l.resultId===record.id);
 const evaluatorIds=unique([...links.flatMap(l=>l.origin==='reused'?l.originalExecutorIds??[]:l.executorIds??[]),...(record.evaluatorOrganizationIds??[])]);
 const reports=links.map(l=>data.assessments?.find(a=>a.id===l.assessmentId)).filter(Boolean);
 const unit=data.sourceUnits?.find(u=>u.sourceId===record.sourceId);
 const source=data.sources?.find(s=>s.id===record.sourceId);
 return {evaluator:names(data,evaluatorIds,locale).join(' · ')||unit?.executor||(locale==='en'?'Not disclosed':'未披露'),reporter:names(data,reports.flatMap(a=>a.publisherIds??[]),locale).join(' · ')||unit?.reporter||source?.title||record.sourceId,evaluatorIds,sourceId:record.sourceId,sourceTitle:source?.title??record.sourceId,sourceUrl:source?.url??record.sourceUrl,origin:links.some(l=>l.origin==='reused')?'reused':links[0]?.origin??'source-reported',nuwa:locale==='en'?'Compiled by NUWA':'NUWA 整理'};
}
export function resultAreas(data,record) {
 const links=(data.assessmentEvidence??[]).filter(l=>l.resultId===record.id);
 const areas=links.flatMap(l=>data.protocolVariants?.find(v=>v.id===l.variantId)?.riskAssociations?.map(a=>a.area)??[]);
 const benchmark=data.benchmarks.find(b=>b.id===record.benchmarkId);
 return unique(areas.length?areas:(benchmark?.links??[]).map(l=>data.questions.find(q=>q.id===l.questionId)?.area));
}
export function benchmarkResultEntries(data,records=data.results) {
 const entries=[];
 for(const sourceGroup of resultGroups(data,records)) {
  if(!sourceGroup.benchmark)continue;
  let entry=entries.find(e=>e.id===sourceGroup.benchmark.id);
  if(!entry){entry={id:sourceGroup.benchmark.id,benchmark:sourceGroup.benchmark,latestEvidenceDate:'',groups:[]};entries.push(entry);}
  const groupsByRecord=sourceGroup.records.map(r=>({...r,areas:resultAreas(data,r),search:[r.system,r.sourceId,data.sources?.find(s=>s.id===r.sourceId)?.title,...Object.values(r.configuration??{}),r.taskSet].filter(Boolean).join(' ')}));
  entry.groups.push({...sourceGroup,records:groupsByRecord});const dates=sourceGroup.records.flatMap(r=>[r.publicationDate??'',data.sources?.find(s=>s.id===r.sourceId)?.publicationDate??'',...(data.assessments??[]).filter(a=>a.sourceId===r.sourceId).map(a=>a.updatedDate??a.publicationDate??'')]);entry.latestEvidenceDate=[entry.latestEvidenceDate,...dates].sort().at(-1)??'';
 }
 return filterBenchmarkEntries(entries,{});
}
export function filterBenchmarkEntries(entries,filters={}) {
 return entries.flatMap(entry=>{
  const groups=entry.groups.flatMap(group=>{const records=group.records.filter(r=>matchesIndexRecord({areas:r.areas,dimensions:r.metrics.map(m=>m.dimension),benchmark:entry.id,search:`${entry.benchmark.name} ${r.search}`},{...filters,function:'',tag:'',organization:'',kind:'',year:'',scenario:''}));return records.length?[{...group,records}]:[];});
  const records=[...new Map(groups.flatMap(g=>g.records).map(r=>[r.id,r])).values()];
  return records.length?[{...entry,groups,observationCount:records.length,systemCount:unique(records.map(r=>`${r.system}|${JSON.stringify(r.configuration)}`)).length,sourceCount:unique(records.map(r=>r.sourceId)).length}]:[];
 });
}
export function comparisonPermissions(group) {
 const approved=group?.review?.status==='accepted'&&group.conditionsComplete===true;
 return {rank:approved&&['matched','longitudinal'].includes(group.level),connect:approved&&group.level==='longitudinal'};
}
export function comparisonRows(data,group,state={}) {
 const rows=(group?.bindings??[]).flatMap(binding=>{
  const r=data.results.find(r=>r.id===binding.resultId),metric=r?.metrics.find(m=>m.id===binding.metricId);if(!r||!metric)return [];
  const model=data.models?.find(m=>m.id===binding.modelId),identity=data.monitoring?.identityResolutions?.find(i=>i.id===binding.resolutionId);
  const brand=resolveDeveloper(r.system,data),developerId=model?.developerId??brand?.organizationId??null;
  const metadata=modelMetadata(model),releaseDate=modelRelease(model)??null,publicSince=binding.publicSince??null;
  if(state.asOf&&state.timeBasis!=='retrospective'&&(!publicSince||publicSince>state.asOf))return [];
  if(state.asOf&&releaseDate&&releaseDate>state.asOf)return [];
  if(state.developer&&developerId!==state.developer)return [];
  const attribution=resultAttribution(data,r,state.locale??'en');
  if(state.q&&!`${r.system} ${r.taskSet} ${r.protocol} ${attribution.evaluator} ${attribution.reporter} ${JSON.stringify(r.configuration)} ${JSON.stringify(r.experimentalConditions??{})}`.toLowerCase().includes(state.q.toLowerCase()))return [];
  return [{snapshotId:data.snapshotId??null,id:r.id,resultId:r.id,modelId:binding.modelId??null,developerId,developerIds:developerId?[developerId]:reportedBrandIds(r.system),brandAttribution:brand?.basis??(model?'model-record':null),system:r.system,modelName:model?.name??r.system,releaseDate,releaseDateBasis:metadata?'developer-release':model?.releaseDateBasis,modelMetadata:metadata,releaseSource:metadata?.release.sources[0]?.url??null,publicSince,evaluationDate:r.evaluationDate,reportDate:data.sources.find(s=>s.id===r.sourceId)?.publicationDate??r.publicationDate,identity:identity?.status??'source-reported',metricId:metric.id,label:metric.label,value:metric.value,unit:metric.unit,precision:metric.precision??2,qualifier:metric.qualifier,interval:metric.uncertainty??null,intervalText:metric.interval,reportedUncertainty:metric.reportedUncertainty??null,sampleCounts:r.sampleCounts??null,dimension:metric.dimension,configuration:r.configuration,trialCount:r.trialCount??null,taskSet:r.taskSet,experimentalConditions:r.experimentalConditions,protocol:r.protocol,observationCondition:reportedCondition(r),sample:r.sampleSize,limitations:r.limitations,sourceId:r.sourceId,sourceVersion:r.sourceVersion,locator:r.locator,attribution}];
 });
 if(state.sort==='value')return rows.sort((a,b)=>b.value-a.value);
 return rows;
}
export function readMonitorState(search,namespace,groups) {
 const p=new URLSearchParams(search),key=k=>`mon-${namespace}-${k}`;const group=groups.find(g=>g.id===p.get(key('group')))?.id??groups[0]?.id??'';
 const v=p.get(key('asOf'));return {group,asOf:/^\d{4}-\d{2}-\d{2}$/.test(v??'')?v:'',timeBasis:p.get(key('time'))==='contemporaneous'?'contemporaneous':'retrospective',developer:p.get(key('developer'))??'',q:p.get(key('q'))??'',display:['table','timeline'].includes(p.get(key('display')))?p.get(key('display')):'bars',sort:['source','name','release','value','value-asc'].includes(p.get(key('sort')))?p.get(key('sort')):'metric',all:p.get(key('all'))==='1'};
}
export function writeMonitorState(search,namespace,state) {
 const p=new URLSearchParams(search);for(const [key,value] of Object.entries({group:state.group,asOf:state.asOf,time:state.timeBasis,developer:state.developer,q:state.q,display:state.display,sort:state.sort,all:state.all?'1':''})){const k=`mon-${namespace}-${key}`;if(value)p.set(k,value);else p.delete(k);}return p.toString();
}
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const monitorValue=row=>`${row.qualifier==='greater-than'?'>':row.qualifier==='less-than'?'<':row.qualifier==='approximate'?'≈':''}${row.value.toLocaleString('en',{maximumFractionDigits:row.precision})}${row.unit==='%'?'%':` ${row.unit}`}`;
export function monitorSvg(rows,group,locale='en',state={}) {
 const en=locale==='en',isTime=state.display==='timeline',shown=state.all||isTime?rows:rows.slice(0,12),W=1080,unit=rows[0]?.unit??'';
 const metadata=shown.map(r=>`${r.modelName} (${r.system}); ${text(r.label,locale)}: ${monitorValue(r)}; ${text(r.sample,locale)}; ${r.taskSet}; ${JSON.stringify(r.configuration)}; ${r.trialCount??'?'} attempts; evaluator ${r.attribution.evaluator}; reporter ${r.attribution.reporter}; ${r.attribution.sourceUrl}; ${r.sourceVersion}; ${r.locator}; released ${r.releaseDate??'?'}; evaluated ${r.evaluationDate??'?'}; published ${r.reportDate??'?'}; public ${r.publicSince??'?'}; ${r.intervalText??''}; ${text(r.limitations,locale)}`).join('\n');
 const color=r=>companyColor(r.developerId??'unresolved');
 let marks='',H;
 if(isTime){
  const left=92,right=38,top=108,bottom=460,dated=shown.filter(r=>r.releaseDate),dates=dated.map(r=>Date.parse(r.releaseDate)),lo=Math.min(...dates),hi=Math.max(...dates),pw=W-left-right;
  const horizon=shown.some(r=>r.metricId==='metr-p50'||r.metricId==='metr-p80'),log=horizon,upper=Math.max(unit==='%'?100:1,...shown.map(r=>r.interval?.upper??r.value))* (unit==='%'?1:1.15),lower=log?Math.min(...shown.map(r=>r.interval?.lower??r.value).filter(v=>v>0))*.7:0;
  const x=date=>left+(Date.parse(date)-lo)/Math.max(1,hi-lo)*pw,y=v=>bottom-(log?(Math.log(Math.max(v,lower))-Math.log(lower))/(Math.log(upper)-Math.log(lower)):v/upper)*(bottom-top);
  const ticks=log?[1,4,16,64,256,960,3840].filter(v=>v>=lower&&v<=upper):[0,.25,.5,.75,1].map(v=>v*upper);H=590;
  marks+=ticks.map(v=>`<path d="M${left} ${y(v)}H${W-right}" stroke="#dce6df"/><text x="${left-12}" y="${y(v)+4}" text-anchor="end" font-size="12">${Number(v.toPrecision(3))}</text>`).join('');
  if(horizon&&upper>960)marks+=`<rect x="${left}" y="${top}" width="${pw}" height="${Math.max(0,y(960)-top)}" fill="#f3ece0"/><text x="${left+10}" y="${top+19}" font-size="11">${en?'Above 16 hours: unreliable with this task suite':'高于 16 小时：当前任务集测量不可靠'}</text>`;
  marks+=dated.map(r=>`<a href="${locale==='en'?'/en':''}/nuwa/whitzard-index/result/${esc(r.resultId)}/"><g data-value="${r.value}" tabindex="0"><title>${esc(`${r.system}; ${monitorValue(r)}; ${r.releaseDate}; ${r.attribution.evaluator}`)}</title>${r.interval?`<path d="M${x(r.releaseDate)} ${y(r.interval.lower)}V${y(r.interval.upper)}M${x(r.releaseDate)-5} ${y(r.interval.lower)}H${x(r.releaseDate)+5}M${x(r.releaseDate)-5} ${y(r.interval.upper)}H${x(r.releaseDate)+5}" stroke="${color(r)}"/>`:''}<circle cx="${x(r.releaseDate)}" cy="${y(r.value)}" r="5" fill="${color(r)}" stroke="#fafcf9" stroke-width="1.5"/></g></a>`).join('');
  marks+=`<text x="${left}" y="${bottom+25}" font-size="11">${dates.length?new Date(lo).toISOString().slice(0,10):''}</text><text x="${W-right}" y="${bottom+25}" text-anchor="end" font-size="11">${dates.length?new Date(hi).toISOString().slice(0,10):''}</text><text x="${W/2}" y="${bottom+49}" text-anchor="middle" font-size="12">${en?'Model release date':'模型发布日期'}</text><text x="${left}" y="${bottom+76}" font-size="11">${en?'Source compilation; no NUWA experiment. Unknown release dates remain in the table.':'来源汇编；非 NUWA 实验。发布日期未知的结果保留在表格中。'}</text>`;
  if(!dated.length)marks+=`<text x="${left}" y="250" font-size="16">${en?'No verified release dates in this selection. Use the result chart or table.':'当前选择无已核实发布日期，请查看结果图或表格。'}</text>`;
 }else{
  const left=350,right=110,top=100,rowH=63,chartH=Math.max(90,shown.length*rowH),domain=unit==='%'?100:Math.max(1,...shown.map(r=>r.interval?.upper??r.value))*1.1,x=v=>left+v/domain*(W-left-right);H=top+chartH+83;
  marks+=[0,.25,.5,.75,1].map(t=>`<path d="M${x(domain*t)} ${top-8}V${top+chartH}" stroke="#d9e5de"/><text x="${x(domain*t)}" y="${top+chartH+20}" text-anchor="middle" font-size="11">${Number((domain*t).toPrecision(3))}</text>`).join('');
  marks+=shown.map((r,i)=>{const cy=top+i*rowH+20;return `<a href="${locale==='en'?'/en':''}/nuwa/whitzard-index/result/${esc(r.resultId)}/"><g tabindex="0"><title>${esc(`${r.system}; ${monitorValue(r)}; ${r.attribution.evaluator}`)}</title><text x="16" y="${cy}" font-size="13">${esc(r.system.length>46?r.system.slice(0,44)+'…':r.system)}</text><rect x="${left}" y="${cy-16}" width="${Math.max(0,x(r.value)-left)}" height="19" rx="2" fill="${color(r)}"/>${r.interval?`<path d="M${x(r.interval.lower)} ${cy-7}H${x(r.interval.upper)}M${x(r.interval.lower)} ${cy-14}V${cy}M${x(r.interval.upper)} ${cy-14}V${cy}" stroke="#142e42"/>`:''}<text x="${W-right+12}" y="${cy}" font-size="14">${esc(monitorValue(r))}</text><text x="16" y="${cy+18}" font-size="10">${esc(r.attribution.evaluator)}</text></g></a>`;}).join('');
  marks+=`<text x="16" y="${top+chartH+53}" font-size="11">${en?'NUWA: source compilation; no NUWA experiment. Full labels, conditions and provenance in the data table.':'NUWA：来源汇编；非 NUWA 实验。完整名称、条件与出处见数据表。'}</text>`;
 }
 const sources=unique(shown.map(r=>r.attribution.sourceTitle)).join(' · ');
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(text(group.title,locale))}"><desc>${esc(metadata)}</desc><style>text{font-family:Arial,sans-serif;fill:#1b3141}a:focus g{outline:2px solid #1b5a78}</style><rect width="100%" height="100%" fill="#fafcf9"/>${state.embedded?`<text x="16" y="51" font-size="13">${esc(text(rows[0]?.label,locale))} (${esc(unit)})</text>`:`<text x="16" y="27" font-size="18">${esc(text(group.title,locale))}</text><text x="16" y="51" font-size="12">${esc(text(rows[0]?.label,locale))} · ${esc(unit)} · ${esc(group.level)}</text><text x="16" y="72" font-size="11">${esc(text(group.description,locale).slice(0,150))}</text>`}${marks}<metadata>Snapshot: ${esc(rows[0]?.snapshotId??group.snapshotId??'not recorded')}; ${esc(sources)}; ${esc(metadata)}</metadata></svg>`;
}
export function monitorCsv(rows,group,locale='en') {
 const fields=['resultId','model','metric','value','unit','qualifier','interval','harness','tools','budget','attempts','taskSet','releaseDate','evaluationDate','reportDate','publicSince','evaluator','reporter','source','sourceVersion','locator','comparison','nuwaRole','conditionStatus','taskFacet','sourceGroup','quotedResultIds','goalCondition','threatCondition','reasoning','releaseSource','releaseDateBasis','totalParameters','activeParameters','parameterStatus','protocol','observationCondition','observationLabel','reportedUncertainty','sampleCounts','snapshotId','totalParameterBand','sizeEncoding'];const quote=v=>'"'+String(v??'').replace(/"/g,'""')+'"';return [fields,...rows.map(r=>[r.resultId,r.system,text(r.label,locale),r.value,r.unit,r.qualifier,r.intervalText??(r.interval?JSON.stringify(r.interval):''),r.configuration.harness,r.configuration.tools,r.configuration.budget,r.trialCount,r.taskSet,r.releaseDate,r.evaluationDate,r.reportDate,r.publicSince,r.attribution.evaluator,r.attribution.reporter,r.attribution.sourceUrl,r.sourceVersion,r.locator,r.comparisonLevel??group.level,r.attribution.nuwa,r.conditionStatus??'',r.facetId??'',r.sourceGroupId??group.id,(r.quotedResultIds??[]).join(' '),r.experimentalConditions?.goal,r.experimentalConditions?.threat,r.experimentalConditions?.reasoning,r.releaseSource,r.releaseDateBasis,r.modelMetadata?.parameters.total,r.modelMetadata?.parameters.active,r.modelMetadata?.parameters.status,r.protocol,text(r.observationCondition,locale),text(r.observationLabel,locale),r.reportedUncertainty?JSON.stringify(r.reportedUncertainty):'',r.sampleCounts?JSON.stringify(r.sampleCounts):'',r.snapshotId??group.snapshotId??'',modelSizeMark(r).id,modelSizeScale.version])].map(row=>row.map(quote).join(',')).join('\r\n');
}
export function modelBenchmarkMatrix(data,modelId) {
 return unique((data.monitoring?.groups??[]).map(g=>g.benchmarkId)).map(benchmarkId=>{const groups=data.monitoring.groups.filter(g=>g.benchmarkId===benchmarkId);const all=groups.flatMap(g=>comparisonRows(data,g,{}).filter(r=>r.modelId===modelId).map(r=>({...r,groupId:g.id})));const records=[...new Map(all.map(r=>[`${r.resultId}|${r.metricId}`,r])).values()].filter(r=>!(data.monitoring.measurementAliases??[]).some(a=>a.resultId===r.resultId&&a.metricId===r.metricId&&all.some(x=>x.resultId===a.canonicalResultId&&x.metricId===a.canonicalMetricId)));return {benchmarkId,name:data.benchmarks.find(b=>b.id===benchmarkId)?.name??benchmarkId,records,status:records.length?'linked':'not-linked'};});
}
function canonical(value){if(value===undefined)return 'null';if(value===null||typeof value!=='object')return JSON.stringify(value);return Array.isArray(value)?`[${value.map(canonical).join(',')}]`:`{${Object.keys(value).sort().map(k=>JSON.stringify(k)+':'+canonical(value[k])).join(',')}}`;}
export function groupDependencies(data,group){
 const modelMetadata=group.review?.dependencyVersion==='model-metadata-2'?(data.models??[]).filter(m=>group.bindings.some(b=>b.modelId===m.id)).map(({id,name,developerId,releaseDate,releaseSourceId,releaseDateBasis})=>({id,name,developerId,releaseDate,releaseSourceId,releaseDateBasis})):null;
 const identities=group.bindings.map(b=>data.monitoring?.identityResolutions?.find(i=>i.id===b.resolutionId)??null);
 const sourceIds=new Set([...(group.sourceIds??[]),...(modelMetadata??[]).map(m=>m.releaseSourceId),...identities.flatMap(i=>i?.sourceIds??[]),...group.bindings.map(b=>data.results.find(r=>r.id===b.resultId)?.sourceId)].filter(Boolean));
 return canonical({...(modelMetadata?{modelMetadata}:{}),scope:{revision:group.revision,benchmarkId:group.benchmarkId,title:group.title,description:group.description,limits:group.limits,conditions:group.conditions,sourceIds:group.sourceIds,level:group.level},bindings:group.bindings,results:group.bindings.map(b=>data.results.find(r=>r.id===b.resultId)??null),identities,mappingCorrections:data.mappingCorrections??[],sources:(data.sources??[]).filter(s=>sourceIds.has(s.id)),sourceVersions:(data.sourceVersions??[]).filter(v=>sourceIds.has(v.sourceId))});
}
export function analysisDependencies(data,group,analysis){const ids=new Set(analysis.sourceIds??[]),versions=(data.sourceVersions??[]).filter(v=>ids.has(v.sourceId));return canonical({group:groupDependencies(data,group),observations:(analysis.resultIds??[]).map(id=>data.results.find(r=>r.id===id)??null),sources:(data.sources??[]).filter(s=>ids.has(s.id)),sourceVersions:versions,claims:(data.claims??[]).filter(c=>versions.some(v=>v.id===c.sourceVersionId))});}
export function analysisState(data,group,analysis,{verifiedForRender=false}={}) {
 if(!analysis)return 'missing';if(!['reviewed','local-review','published-note'].includes(analysis.status))return 'draft';
 if(!Array.isArray(analysis.resultIds)||!Array.isArray(analysis.sourceIds)||!analysis.resultIds.length||!analysis.sourceIds.length||!verifiedForRender&&!analysis.dependencies)return 'stale';
 if(analysis.groupId!==group.id||analysis.groupRevision!==group.revision||analysis.resultIds?.some(id=>!data.results.some(r=>r.id===id))||analysis.sourceIds?.some(id=>!data.sources.some(s=>s.id===id))||!verifiedForRender&&analysis.dependencies!==analysisDependencies(data,group,analysis))return 'stale';return analysis.status==='local-review'?'local-review':'current';
}
export function validateMonitoring(data) {
 const m=data.monitoring;if(!m)return ['5.1','5.2'].includes(data.schemaVersion)?[`schema${data.schemaVersion}: missing monitoring`]:[];const errors=[],seen=new Set();
 for(const g of m.groups??[]){if(m.version==='1.1'&&g.review?.dependencyVersion!=='model-metadata-2')errors.push(`${g.id}: model-aware monitoring binding required`);if(seen.has(g.id))errors.push(`${g.id}: duplicate monitoring group`);seen.add(g.id);if(!data.benchmarks.some(b=>b.id===g.benchmarkId))errors.push(`${g.id}: unknown benchmark`);if(['matched','longitudinal'].includes(g.level)&&(!g.conditionsComplete||g.review?.status!=='accepted'||!g.conditions?.length||g.conditions.some(c=>c.state!=='matched')))errors.push(`${g.id}: complete reviewed comparison conditions required`);for(const b of g.bindings??[]){const r=data.results.find(r=>r.id===b.resultId);if(!r)errors.push(`${g.id}: unknown result ${b.resultId}`);if(r&&r.benchmarkId!==g.benchmarkId)errors.push(`${g.id}: result benchmark mismatch`);if(r&&!r.metrics.some(m=>m.id===b.metricId))errors.push(`${g.id}: unknown metric`);if(b.modelId&&!data.models.some(m=>m.id===b.modelId))errors.push(`${g.id}: unknown model`);if(['matched','longitudinal'].includes(g.level)&&(!b.resolutionId||!m.identityResolutions?.some(i=>i.id===b.resolutionId&&i.status==='resolved')))errors.push(`${g.id}: resolved version required`);}if(g.review?.status!=='accepted')errors.push(`${g.id}: unapproved monitoring group`);}
 for(const c of m.resultCorrections??[]){if(c.review?.status!=='accepted'||!data.results.some(r=>r.id===c.resultId)||Object.keys(c.changes??{}).some(k=>k!=='trialCount')||!c.locator||!c.reason?.en||!c.reason?.zh)errors.push(`${c.resultId}: invalid or unapproved result correction`);}
 for(const a of m.measurementAliases??[]){const r=data.results.find(r=>r.id===a.resultId),target=data.results.find(r=>r.id===a.canonicalResultId);if(a.review?.status!=='accepted'||!r||!target||r.benchmarkId!==target.benchmarkId||!r.metrics.some(m=>m.id===a.metricId)||!target.metrics.some(m=>m.id===a.canonicalMetricId))errors.push(`${a.resultId}: invalid measurement alias`);}
 for(const s of m.benchmarkSelections??[])if(!data.benchmarks.some(b=>b.id===s.benchmarkId)||!s.rationale?.en||!s.rationale?.zh)errors.push(`${s.benchmarkId}: invalid representative selection`);
 for(const a of m.analyses??[]){
  if(a.status!=='reviewed')errors.push(`${a.id}: unapproved analysis in public catalogue`);
  const group=m.groups?.find(g=>g.id===a.groupId);
  if(!a.approvalReference||a.review?.status!=='accepted')errors.push(`${a.id}: analysis approval reference required`);
  if(!group||a.snapshotId!==data.snapshotId||!a.methodVersion||!Array.isArray(a.resultIds)||!a.resultIds.length||!Array.isArray(a.sourceIds)||!a.sourceIds.length||!a.dependencies)errors.push(`${a.id}: analysis binding incomplete`);
  for(const key of ['heading','analysis','takeaway','limits','nextCheck'])if(!a[key]?.en||!a[key]?.zh)errors.push(`${a.id}: analysis binding text missing ${key}`);
 }
 return errors;
}
export function serializeMonitoringPayload(data){return JSON.stringify(data).replace(/</g,()=>String.fromCharCode(92)+'u003c');}
export function sortBenchmarkEntries(entries,sort='priority',selections=[]){
 const areas=['autonomy','deception','cybersecurity','cbrn','disinformation','autonomous-physical-harm'],tiers={core:0,supplement:1,background:2,excluded:3};
 const priority=e=>{const s=selections.find(s=>s.benchmarkId===e.id);return (tiers[s?.tier]??4)*10+Math.min(...(s?.areas??[]).map(a=>areas.indexOf(a)).filter(i=>i>=0),9);};
 return [...entries].sort((a,b)=>(sort==='coverage'?(b.sourceCount??0)-(a.sourceCount??0)||(b.observationCount??0)-(a.observationCount??0):sort==='updated'?(b.latestEvidenceDate??'').localeCompare(a.latestEvidenceDate??''):sort==='name'?0:priority(a)-priority(b))||a.benchmark.name.localeCompare(b.benchmark.name));
}
export function sortMonitorGroups(data,groups){const level=g=>g.level==='matched'||g.level==='longitudinal'?0:g.level==='descriptive'?1:2;const date=g=>(g.sourceIds??[]).flatMap(id=>[(data.assessments??[]).filter(a=>a.sourceId===id).map(a=>a.updatedDate??a.publicationDate??'').sort().at(-1)??'',data.sources.find(s=>s.id===id)?.publicationDate??'']).sort().at(-1)??'';return [...groups].sort((a,b)=>level(a)-level(b)||date(b).localeCompare(date(a))||text(a.title).localeCompare(text(b.title)));}
export function monitorDisplayTitle(data,group,locale='en'){
 let title=text(group.title,locale);for(const sourceId of group.sourceIds??[]){if(!title.includes(sourceId))continue;const r=data.results.find(r=>r.sourceId===sourceId&&group.bindings.some(b=>b.resultId===r.id));const reporter=r?resultAttribution(data,r,locale).reporter:data.sources.find(s=>s.id===sourceId)?.title??sourceId;title=title.replace(sourceId,reporter);}return title;
}
export function monitorMenuSections(data,groups,namespace,locale='en'){
 const en=locale==='en',sections=[];for(const g of groups){let label;if(['descriptive','matched','longitudinal'].includes(g.level))label=en?'Cross-report comparison':'跨报告比较';else if(namespace.startsWith('benchmark-')){const record=data.results.find(r=>g.bindings.some(b=>b.resultId===r.id));label=record?resultAttribution(data,record,locale).reporter:en?'Source protocols':'来源协议';}else label=data.benchmarks.find(b=>b.id===g.benchmarkId)?.name??g.benchmarkId;let section=sections.find(s=>s.label===label);if(!section){section={label,groups:[]};sections.push(section);}section.groups.push(g);}return sections;
}
const companyColors={openai:'#315c99',anthropic:'#247d73','google-deepmind':'#997443',google:'#997443',deepseek:'#6c6593',moonshot:'#8f4c4c','z-ai':'#326b8a',zai:'#326b8a',meta:'#626c83'};
export function companyColor(id){if(companyColors[id])return companyColors[id];const colors=['#247d73','#315c99','#997443','#6c6593','#8f4c4c'];return colors[[...String(id??'unknown')].reduce((n,c)=>n+c.charCodeAt(0),0)%colors.length];}
export function monitorLegend(rows,data,locale='en'){return unique(rows.map(r=>r.developerId??'unresolved')).map(id=>({developerId:id==='unresolved'?'':id,label:text(data.organizations?.find(o=>o.id===id)?.name,locale)||organizationBrand(id)?.displayName||(locale==='en'?'Developer not resolved':'开发机构未确定'),color:companyColor(id)}));}
