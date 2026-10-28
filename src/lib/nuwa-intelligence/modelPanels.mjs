import {comparisonRows,sortMonitorGroups} from './monitoring.mjs';
export function modelPanels(data,modelId,locale='en'){
 const grouped=new Map();
 for(const group of sortMonitorGroups(data,data.monitoring?.groups??[])){
  if(!group.bindings.some(b=>b.modelId===modelId))continue;
  const rows=comparisonRows(data,group,{locale}).filter(r=>r.modelId===modelId);if(!rows.length)continue;
  const b=data.benchmarks.find(b=>b.id===group.benchmarkId);if(!b||b.kind==='report')continue;
  if(!grouped.has(b.id))grouped.set(b.id,{id:b.id,name:b.name,dimension:b.primaryDimension,areas:b.links.map(l=>data.questions.find(q=>q.id===l.questionId)?.area).filter(Boolean),groups:[]});
  grouped.get(b.id).groups.push({group:{id:group.id,title:group.title,description:group.description,level:group.level,review:{status:group.review?.status},conditionsComplete:group.conditionsComplete,limits:group.limits,areas:group.areas},rows});
 }
 const core=(data.monitoring?.benchmarkSelections??[]).filter(s=>s.tier==='core').map(s=>s.benchmarkId);
 return [...grouped.values()].sort((a,b)=>(core.includes(a.id)?core.indexOf(a.id):999)-(core.includes(b.id)?core.indexOf(b.id):999)||a.name.localeCompare(b.name));
}
export function readModelScope(search){const p=new URLSearchParams(search),legacy=p.get('view')==='models';return {query:p.get('modelSearch')??(legacy?p.get('q')??'':''),developer:p.get('modelDeveloper')??(legacy?p.get('organization')??'':'')};}
export function filterModelOptions(models,scope){const terms=scope.query.trim().toLowerCase().split(/\s+/).filter(Boolean);return models.filter(m=>(!scope.developer||m.developerId===scope.developer)&&terms.every(t=>`${m.name} ${m.family??''} ${(m.aliases??[]).join(' ')}`.toLowerCase().includes(t)));}
