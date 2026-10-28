import {modelMarkMarkup,modelMarkSvg} from './modelMarks.mjs';
export const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function intervalFor(metric) {
  if(metric.uncertainty) return metric.uncertainty;
  if(!metric.interval?.includes('95%')) return null;
  const m=metric.interval.match(/±\s*([\d.]+)\s*pp/);
  return m ? {lower:Math.max(0,metric.value-Number(m[1])),upper:Math.min(100,metric.value+Number(m[1])),level:95,kind:'confidence',provenance:'source-reported'} : null;
}
export function formatMetric(metric) {
  const precision=metric.precision??(['web-level0-pass3','post-level0-pass3','benign-utility','attacked-utility','targeted-asr'].includes(metric.id)?2:undefined);
  const sign={'greater-than':'>','less-than':'<',approximate:'≈'}[metric.qualifier]??'';
  return sign+Number(metric.value).toLocaleString('en',{minimumFractionDigits:precision??0,maximumFractionDigits:precision??2})+(metric.unit==='%'?'%':metric.unit==='score'?'':` ${metric.unit}`);
}
export function readChartState(search,spec,records) {
 const p=new URLSearchParams(search), key=k=>spec.queryPrefix?`${spec.queryPrefix}.${k}`:k, requested=p.get(key('metric'));
 return {metric:spec.metricIds.includes(requested)||requested==='paired'&&spec.pairedMetricIds?.length ? requested : spec.defaultMetricId, systems:p.getAll(key('system')).filter(id=>records.some(r=>r.id===id)),view:p.get(key('chartView'))==='table'?'table':'chart',all:p.get(key('all'))==='1'};
}
export function writeChartState(search,state,spec) {
 const p=new URLSearchParams(search),key=k=>spec.queryPrefix?`${spec.queryPrefix}.${k}`:k;
 for(const k of ['metric','system','chartView','all'])p.delete(key(k));
 if(state.metric!==spec.defaultMetricId)p.set(key('metric'),state.metric);
 for(const id of state.systems)p.append(key('system'),id);
 if(state.view==='table')p.set(key('chartView'),'table');
 if(state.all)p.set(key('all'),'1');
 return p.toString();
}
export function chartRows(spec,records,state) {
 const selected=records.filter(r=>!state.systems.length||state.systems.includes(r.id));
 const metricIds=spec.layout==='panels'?spec.metricIds:state.metric==='paired'?spec.pairedMetricIds:[state.metric];
 const available=selected.filter(r=>r.metrics.some(m=>metricIds.includes(m.id)));
 return {rows:state.all?available:available.slice(0,12),total:available.length,metricIds};
}
export function metricLabel(records,id,locale) {return records.flatMap(r=>r.metrics).find(m=>m.id===id)?.label[locale]??id;}
export function chartMarkup(spec,records,state,locale) {
 const {rows,metricIds}=chartRows(spec,records,state),en=locale==='en', e=escapeHtml;
 const scale=x=>Math.max(0,Math.min(100,(x-spec.domain[0])/(spec.domain[1]-spec.domain[0])*100));
 return metricIds.map((id,series)=>`<section class="ec-panel" aria-label="${e(metricLabel(records,id,locale))}"><div class="ec-panel__heading"><h3>${e(metricLabel(records,id,locale))}</h3><span>${e(spec.domain[0])}–${e(spec.domain[1])}${records.flatMap(r=>r.metrics).find(m=>m.id===id)?.unit==='%'?'%':''}</span></div><div class="ec-axis" aria-hidden="true"><span>${spec.domain[0]}</span><span>${(spec.domain[0]+spec.domain[1])/2}</span><span>${spec.domain[1]}</span></div>${rows.map(r=>{
  const m=r.metrics.find(m=>m.id===id);const value=m?formatMetric(m)+(m.conditionNote?' *':''):en?'Not reported':'未报告',interval=m?intervalFor(m):null;
  const detail=[r.system,value,m?.interval,m?.meaning[locale],r.configuration.harness,r.sampleSize[locale]].filter(Boolean).join(' · ');
  return `<div class="ec-row"><div class="ec-row__label">${modelMarkMarkup(r.system)}${e(r.system)}${spec.protocolId==='self-replication'?`<small>${e(r.sampleSize[locale])} ${en?'Controlled experiment':'受控实验'}</small>`:''}</div><div class="ec-row__plot" tabindex="0" role="img" aria-label="${e(detail)}"><svg viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden="true"><path class="ec-grid" d="M0 0V12 M50 0V12 M100 0V12"/>${m?`<rect class="ec-bar ec-bar--${series%2}" x="0" y="3" width="${scale(m.value)}" height="6" rx=".6"/>${m.qualifier!=='exact'?`<path class="ec-threshold" d="M${scale(m.value)} 0V12"/>`:''}${interval?`<path class="ec-interval" d="M${scale(interval.lower)} 6H${scale(interval.upper)} M${scale(interval.lower)} 2V10 M${scale(interval.upper)} 2V10"/>`:''}`:''}</svg><span class="ec-tip">${e(detail)}</span></div><strong class="ec-row__value">${e(value)}</strong></div>`;
 }).join('')}</section>`).join('');
}
export function tableMarkup(spec,records,state,locale) {
 const {rows}=chartRows(spec,records,state),metricIds=state.allMetrics?spec.metricIds:chartRows(spec,records,state).metricIds,e=escapeHtml,en=locale==='en';
 return `<table><caption>${e(spec.title[locale])} · ${en?'source order':'原文顺序'}</caption><thead><tr><th scope="col">${en?'System / configuration':'系统 / 配置'}</th>${metricIds.map(id=>`<th scope="col">${e(metricLabel(records,id,locale))}</th>`).join('')}<th scope="col">${en?'Publication / verification':'发表 / 核验日期'}</th></tr></thead><tbody>${rows.map(r=>`<tr><th scope="row">${modelMarkMarkup(r.system)}${e(r.system)}<small>${e(r.configuration.harness??(en?'Harness not specified':'未注明 Harness'))}</small></th>${metricIds.map(id=>{const m=r.metrics.find(m=>m.id===id);return `<td>${m?e(formatMetric(m)):en?'Not reported':'未报告'}${m?.interval?`<small>${e(m.interval)}</small>`:''}${m?.conditionNote?`<small>${e(m.conditionNote[locale])}</small>`:''}</td>`;}).join('')}<td><small>${r.publicationDate?(en?'Published':'发表'):(en?'Source checked':'来源核验')}</small>${e(r.publicationDate??r.verifiedOn)}</td></tr>`).join('')}</tbody></table>`;
}
export function chartCsv(spec,records,state,locale) {
 const {rows,metricIds}=chartRows(spec,records,state);
 const quote=s=>{let v=String(s??'');if(/^[\s]*[=+@-]/.test(v))v="'"+v;return '"'+v.replaceAll('"','""')+'"';};
 // Export keeps original result fields explicit; it does not change the legacy snapshot CSV contract.
 return [['record_id','system','metric','value','unit','qualifier','reported_interval','harness','source_url','source_version','source_locator','model_revision','tools','budget','sample_scope','evaluation_date','publication_date','verified_on','metric_conditions','uncertainty_lower','uncertainty_upper','confidence_level','condition_note'],...rows.flatMap(r=>r.metrics.filter(m=>metricIds.includes(m.id)).map(m=>[r.id,r.system,m.label[locale],m.value,m.unit,m.qualifier,m.interval,r.configuration.harness,r.sourceUrl,r.sourceVersion,r.locator,r.configuration.modelVersion,r.configuration.tools,r.configuration.budget,r.sampleSize[locale],r.evaluationDate,r.publicationDate,r.verifiedOn,m.meaning[locale],intervalFor(m)?.lower,intervalFor(m)?.upper,intervalFor(m)?.level,m.conditionNote?.[locale]]))].map(row=>row.map(quote).join(',')).join('\r\n');
}
export function chartSvg(spec,records,state,locale) {
 const {rows,metricIds,total}=chartRows(spec,records,state),e=escapeHtml,width=1200,rowH=74,panelH=rows.length*rowH+100;
 const scale=x=>Math.max(0,Math.min(600,(x-spec.domain[0])/(spec.domain[1]-spec.domain[0])*600));
 const wrap=(s,n=45)=>String(s).match(new RegExp(`.{1,${n}}(?:\\s|$)|.{1,${n}}`,'g'))??[s];
 const dateNote=locale==='en'?`Evaluation date: ${[...new Set(records.map(r=>r.evaluationDate??'not specified'))].join(', ')}; source checked: ${[...new Set(records.map(r=>r.verifiedOn))].join(', ')}`:`评测日期：${[...new Set(records.map(r=>r.evaluationDate??'未注明'))].join('、')}；来源核验：${[...new Set(records.map(r=>r.verifiedOn))].join('、')}`;
 const conditions=[...wrap(spec.conditions[locale],130),dateNote],head=120+conditions.length*20;
 const credits=[...new Set(records.map(r=>r.sourceUrl+' · '+r.locator))].flatMap(s=>wrap(s,135));
 const height=head+panelH*metricIds.length+credits.length*20+45;
 return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="#f7f9f6"/><style>text{font-family:Arial,sans-serif;fill:#192b41;font-size:17px}.minor{font-size:13px}</style><text x="30" y="38" font-size="24">${e(spec.title[locale])}</text><text x="30" y="66" class="minor">NUWA Index · ${e(spec.description[locale])} · ${rows.length}/${total}</text>${conditions.map((line,i)=>`<text x="30" y="${90+i*20}" class="minor">${e(line)}</text>`).join('')}${metricIds.map((id,j)=>`<g transform="translate(30 ${head+j*panelH})"><text y="0" font-weight="bold">${e(metricLabel(records,id,locale))}</text><text x="430" y="25" class="minor">${spec.domain[0]}</text><text x="1020" y="25" class="minor">${spec.domain[1]}</text>${rows.map((r,i)=>{const m=r.metrics.find(m=>m.id===id),ci=m&&intervalFor(m);return `<g transform="translate(0 ${45+i*rowH})">${modelMarkSvg(r.system)}${wrap(r.system).map((line,k)=>`<text x="26" y="${k*19+14}" class="minor">${e(line)}</text>`).join('')}<path d="M430 0V45 M730 0V45 M1030 0V45" stroke="#d7e2df"/>${m?`<rect x="430" y="10" width="${scale(m.value)}" height="22" fill="#267c76"/>${ci?`<path d="M${430+scale(ci.lower)} 21H${430+scale(ci.upper)} M${430+scale(ci.lower)} 5V37 M${430+scale(ci.upper)} 5V37" stroke="#142d43" stroke-width="2"/>`:''}<text x="1050" y="27">${e(formatMetric(m))}${m.conditionNote?' *':''}</text>`:`<text x="1050" y="27">—</text>`}</g>`;}).join('')}</g>`).join('')}${credits.map((line,i)=>`<text x="30" y="${head+panelH*metricIds.length+15+i*20}" class="minor">${e(line)}</text>`).join('')}</svg>`;
}
