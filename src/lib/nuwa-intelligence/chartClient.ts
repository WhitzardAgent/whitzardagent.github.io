import {modelSizeDescription,modelSizeMark,modelSizeScale} from './modelSize.mjs';
import {LegacyGridContainLabel} from 'echarts/features';
import {init,use,type EChartsType} from 'echarts/core';
import {BarChart,ScatterChart,LineChart,HeatmapChart} from 'echarts/charts';
import {GridComponent,TooltipComponent,AriaComponent,MarkLineComponent,TitleComponent,VisualMapComponent} from 'echarts/components';
import {SVGRenderer} from 'echarts/renderers';
import {monitorChartOption,monitorChartHeight} from './monitorChart.mjs';
use([LegacyGridContainLabel,BarChart,ScatterChart,LineChart,HeatmapChart,GridComponent,TooltipComponent,AriaComponent,MarkLineComponent,TitleComponent,VisualMapComponent,SVGRenderer]);
const instances=new WeakMap<HTMLElement,{chart:EChartsType;resize:ResizeObserver;overlay?:()=>void;onSelect?:(keys:string[])=>void}>();
export function drawMonitorChart(el:HTMLElement,rows:any[],group:any,locale:string,state:any={},onSelect?:(keys:string[])=>void){
 if(el.hidden||el.getBoundingClientRect().width===0)return;
 let entry=instances.get(el);if(!entry){el.replaceChildren();el.style.height=`${monitorChartHeight(rows,state)}px`;const chart=init(el,null,{renderer:'svg'});const resize=new ResizeObserver(()=>{if(el.isConnected&&el.clientWidth>0){chart.resize();instances.get(el)?.overlay?.();}});resize.observe(el);entry={chart,resize};instances.set(el,entry);}
 el.style.height=`${monitorChartHeight(rows,state)}px`;
 const chartState={...state,narrow:el.clientWidth<700};el.style.height=`${monitorChartHeight(rows,chartState)}px`;entry.onSelect=onSelect;const options=monitorChartOption(rows,group,locale,chartState);if(el.clientWidth<700&&!Array.isArray(options.grid)){options.grid.left=state.display==='timeline'?46:8;options.grid.right=state.display==='timeline'?12:65;if(state.display!=='timeline')options.yAxis.axisLabel.width=Math.min(150,el.clientWidth*.36);}
 entry.chart.resize();entry.chart.setOption(options,true);
 const chart=entry.chart;entry.overlay=()=>{
  const svg=el.querySelector('svg');if(!svg)return;svg.querySelector('[data-keyboard-points]')?.remove();const ns='http://www.w3.org/2000/svg',g=document.createElementNS(ns,'g');g.setAttribute('data-keyboard-points','');
  const shown=options.series.flatMap((s:any)=>s.data?.filter((d:any)=>d.record).map((d:any,index:number)=>({r:d.record,axis:s.xAxisIndex??0,index,value:s.type==='heatmap'?d.value.slice(0,2):null}))??[]);
  for(const {r,axis,index,value} of shown){
   const coordinates:number[]=value??(state.display==='timeline'?[Date.parse(r.releaseDate),r.value]:[r.value,index]);const point=chart.convertToPixel({xAxisIndex:axis,yAxisIndex:axis},coordinates);if(!point||!point.every(Number.isFinite))continue;
   const a=document.createElementNS(ns,'a');a.setAttribute('href',`${locale==='en'?'/en':''}/nuwa/whitzard-index/result/${r.resultId}/`);a.setAttribute('aria-label',`${r.system}: ${r.value}${r.unit??''}. ${modelSizeDescription(r,locale)}. ${r.observationCondition?.[locale]??r.observationCondition?.en??''}. ${r.experimentalConditions?.goal??''}. ${r.experimentalConditions?.threat??''}. ${r.configuration?.harness??''}. ${r.configuration?.budget??''}. ${r.attribution?.evaluator??''}`);
   const circle=document.createElementNS(ns,'circle');circle.setAttribute('cx',String(point[0]));circle.setAttribute('cy',String(point[1]));circle.setAttribute('r',String(Math.max(9,modelSizeMark(r).diameter/2+3)));circle.setAttribute('fill','transparent');circle.setAttribute('stroke','transparent');a.setAttribute('tabindex','0');
   const choose=(event:Event)=>{if(event instanceof MouseEvent&&(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey))return;if(!entry?.onSelect)return;event.preventDefault();const matches=state.display==='timeline'?shown.filter((p:any)=>p.axis===axis&&p.r.releaseDate===r.releaseDate&&p.r.value===r.value).map((p:any)=>p.r.key??p.r.resultId+'|'+p.r.metricId):[r.key??r.resultId+'|'+r.metricId];entry.onSelect([...new Set<string>(matches as string[])]);};
   a.addEventListener('click',choose);a.addEventListener('keydown',event=>{if(event.key===' '){choose(event);}});
   a.addEventListener('focus',()=>{circle.setAttribute('stroke','#153e61');circle.setAttribute('stroke-width','2');const series=options.series.findIndex((s:any)=>s.data?.some((p:any)=>p.record?.resultId===r.resultId));if(series>=0)chart.dispatchAction({type:'showTip',seriesIndex:series,dataIndex:options.series[series].data.findIndex((p:any)=>p.record?.resultId===r.resultId)});});a.addEventListener('blur',()=>{circle.setAttribute('stroke','transparent');chart.dispatchAction({type:'hideTip'});});a.append(circle);g.append(a);
  }svg.append(g);
 };entry.overlay();
}
export function disposeMonitorChart(el:HTMLElement){const v=instances.get(el);if(v){v.resize.disconnect();v.chart.dispose();instances.delete(el);}}

/** Standalone SVG uses the same chart grammar and carries attribution/configuration. */
export async function exportMonitorChart(rows:any[],group:any,locale:string,state:any={}){
 const h=monitorChartHeight(rows,{...state,all:true,exportAll:true}),chart=init(null,null,{renderer:'svg',ssr:true,width:1100,height:h});chart.setOption(monitorChartOption(rows,group,locale,{...state,all:true,exportAll:true}));let svg=chart.renderToSVGString();chart.dispose();
 const paths=[...new Set([...svg.matchAll(/href="(\/assets\/organizations\/[^"<>]+)"/g)].map(m=>m[1]))];
 for(const path of paths){const response=await fetch(path);if(!response.ok)throw new Error('Unable to embed chart mark: '+path);const blob=await response.blob();const image=await new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=reject;reader.readAsDataURL(blob);});svg=svg.replaceAll(`href="${path}"`,`href="${image}"`);}

 const escape=(value:unknown)=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
 const sources=[...new Map(rows.map(r=>[r.sourceId,`[${r.sourceId}] ${r.attribution?.sourceTitle??''} · ${r.sourceVersion??''} · ${r.attribution?.sourceUrl??''}`])).values()];
 const snapshotId=rows[0]?.snapshotId??group.snapshotId??'not recorded';
 const exportMetadata={modelSizeEncoding:state.display==='timeline'?modelSizeScale:null,snapshotId,groupId:group.id,scope:'Source compilation; not an independent NUWA experiment.',records:rows.map(r=>({resultId:r.resultId,metricId:r.metricId,sourceId:r.sourceId,sourceVersion:r.sourceVersion,locator:r.locator,modelSize:modelSizeMark(r),parameterSources:r.modelMetadata?.parameters?.sources??[],configuration:r.configuration,experimentalConditions:r.experimentalConditions,sampleCounts:r.sampleCounts,reportedUncertainty:r.reportedUncertainty}))};
 const sizeNote=state.display==='timeline'?[locale==='en'?'Point size = total-parameter bands: ≤4B / >4–<40B / 40–150B / >150B. Dashed = unknown. Fixed bands, not proportional area.':'点大小 = 总参数档位：≤4B / >4–<40B / 40–150B / >150B。虚线 = 尺寸未知；档位大小不代表比例面积。',modelSizeScale.source]:[];
 const texts=[...sizeNote,group.title?.[locale]??group.title?.en??'',`${locale==='en'?'Evidence snapshot':'证据快照'} ${snapshotId}`, locale==='en'?'NUWA: source compilation and protocol review.':'NUWA：来源汇编与协议核查。',...new Set(rows.map(r=>`${r.system} · ${modelSizeDescription(r,locale)} · ${r.label?.[locale]??r.label?.en??''}: ${r.qualifier==='greater-than'?'>':r.qualifier==='less-than'?'<':''}${r.value}${r.unit??''} · ${r.intervalText??''} · ${r.observationCondition?.[locale]??r.observationCondition?.en??''} · ${r.experimentalConditions?`${r.experimentalConditions.goal}; ${r.experimentalConditions.threat}; ${r.sample?.[locale]??''}`:`release ${r.releaseDate??'not verified'}`}  · ${r.configuration?.harness??'—'} · ${r.configuration?.budget??'—'} · attempts ${r.trialCount??'not disclosed'} · evaluator ${r.attribution?.evaluator??'—'} · [${r.sourceId}]`)),...sources,...new Set(rows.map(r=>r.releaseSource).filter(Boolean))];
 const lines=texts.flatMap(t=>String(t).match(/.{1,125}/gu)??['']);const footer=lines.map((t,i)=>`<text x="30" y="${h+40+i*18}" font-family="system-ui,sans-serif" font-size="11" fill="#294c52">${escape(t)}</text>`).join('');
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1100" height="${h+60+lines.length*18}" viewBox="0 0 1100 ${h+60+lines.length*18}"><metadata>${escape(JSON.stringify(exportMetadata))}</metadata><rect width="100%" height="100%" fill="#fafcf9"/>${svg}${footer}</svg>`;
}
