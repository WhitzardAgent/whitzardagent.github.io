const unique=values=>[...new Set(values)];
export function readComparisonState(search='') {
 const p=new URLSearchParams(search),date=p.get('asOf')??'';
 return {area:p.get('area')??'',group:p.get('group')??'',systems:unique((p.get('systems')??'').split(',').filter(Boolean)).slice(0,4),sort:['asc','desc'].includes(p.get('order'))?p.get('order'):'source',scope:p.get('scope')==='strict'?'strict':'all',asOf:/^\d{4}-\d{2}-\d{2}$/.test(date)?date:''};
}
export function writeComparisonState(search,state) {
 const p=new URLSearchParams(search);
 for(const [key,value] of Object.entries({area:state.area,group:state.group,systems:state.systems?.join(','),order:state.sort,scope:state.scope,asOf:state.asOf}))key==='systems'?p.set(key,value??''):value?p.set(key,value):p.delete(key);
 return p.toString();
}
export function projectComparison(dataset,state={}) {
 const ids=unique((Array.isArray(state.systems)?state.systems:dataset.rows.map(r=>r.resultId)).filter(id=>dataset.rows.some(r=>r.resultId===id))).slice(0,4);
 let rows=dataset.rows.filter(r=>ids.includes(r.resultId));
 if(state.asOf)rows=rows.filter(r=>r.publicSince&&r.publicSince<=state.asOf);
 if(state.scope==='strict'&&!dataset.rankAllowed)rows=[];
 if(state.sort==='asc'||state.sort==='desc')rows=[...rows].sort((a,b)=>(state.sort==='asc'?1:-1)*(a.value-b.value));
 return {rows,systems:ids,selectionValid:rows.length>=2&&rows.length<=4,rankAllowed:Boolean(dataset.rankAllowed),connectAllowed:Boolean(dataset.connectAllowed)};
}
export function comparisonCsv(rows,snapshot) {
 const cell=v=>'"'+String(v??'').replace(/"/g,'""')+'"';
 const headers=['snapshot','resultId','system','metric','value','unit','qualifier','interval','sample','configuration','evaluator','reporter','source','sourceVersion','locator','evaluationDate','reportDate','publicSince'];
 return '\uFEFF'+[headers,...rows.map(r=>[snapshot,r.resultId,r.system,r.metricId,r.value,r.unit,r.qualifier,r.intervalText,JSON.stringify(r.sample),JSON.stringify(r.configuration),r.attribution.evaluator,r.attribution.reporter,r.attribution.sourceUrl,r.sourceVersion,r.locator,r.evaluationDate,r.reportDate,r.publicSince])].map(row=>row.map(cell).join(',')).join('\r\n');
}
export function validatePublishedRun(run,context) {
 if(run.status!=='published')return [];
 const errors=[];
 if(run.origin!=='nuwa')errors.push('Published NUWA run requires nuwa origin');
 if(context)for(const id of run.resultIds??[]){const record=context.results.find(r=>r.id===id);if(!record?.evaluatorOrganizationIds?.some(id=>context.nuwaExecutorIds.includes(id)))errors.push('Result executor is not verified as NUWA: '+id);}
 for(const field of ['protocolVersion','system'])if(!run[field])errors.push('Missing '+field);
 if(!run.resultIds?.length)errors.push('Missing resultIds');
 for(const field of ['planId','endpoint','taskHash','harnessHash','configurationHash','startedAt','completedAt','aggregationVersion','sampleStates'])if(!run.receipt?.[field]||Array.isArray(run.receipt[field])&&!run.receipt[field].length)errors.push('Missing receipt '+field);
 for(const field of ['taskHash','harnessHash','configurationHash'])if(run.receipt?.[field]&&!/^[a-f0-9]{64}$/.test(run.receipt[field]))errors.push('Invalid receipt '+field);
 if(run.receipt?.startedAt&&run.receipt?.completedAt&&!(Date.parse(run.receipt.completedAt)>=Date.parse(run.receipt.startedAt)))errors.push('Invalid receipt chronology');
 return errors;
}
