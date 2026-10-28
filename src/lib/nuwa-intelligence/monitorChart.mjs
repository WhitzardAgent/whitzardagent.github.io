import {modelSizeMark,modelSizeDescription} from './modelSize.mjs';
import {contextualizeObservations} from './observationContext.mjs';
import {primaryMetricOrder} from './editorial.mjs';
import {organizationBrand} from '../organizationBrands.mjs';
import {comparisonPermissions,companyColor,monitorValue} from './monitoring.mjs';
const label=(v,locale)=>typeof v==='string'?v:v?.[locale]??v?.en??'';
const html=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const isConditionMatrix=rows=>rows.length>0&&rows.every(r=>r.experimentalConditions?.goal&&r.experimentalConditions?.threat);
export function chartFacets(rows,state={}){
 const eligible=state.display==='timeline'?rows.filter(r=>r.releaseDate):rows;const groups=[...new Map(eligible.map(r=>[r.facetId??'source',{id:r.facetId??'source',label:r.facetLabel??{en:r.taskSet??'',zh:r.taskSet??''}}])).values()];
 const pageSize=state.compact&&(isConditionMatrix(rows)||rows.some(r=>r.conditionScope))?1:4;
 const page=Math.max(0,Math.min(Number(state.facetPage)||0,Math.max(0,Math.ceil(groups.length/pageSize)-1)));
 return {all:groups,visible:state.exportAll?groups:groups.slice(page*pageSize,page*pageSize+pageSize),page,pageSize,pages:Math.max(1,Math.ceil(groups.length/pageSize))};
}
export function normalizeChartState(rows,state={}){const scopes=chartFacets(rows,state),max=Math.max(0,...scopes.visible.map(f=>rows.filter(r=>(r.facetId??'source')===f.id).length));return {...state,facetPage:scopes.page,systemPage:Math.max(0,Math.min(Number(state.systemPage)||0,Math.max(0,Math.ceil(max/12)-1)))};}
export function chartVisibleRows(rows,state={}){const ids=new Set(chartFacets(rows,state).visible.map(f=>f.id));return rows.filter(r=>ids.has(r.facetId??'source')&&(state.display!=='timeline'||r.releaseDate));}
const systemRowHeight=(rows,narrow=false)=>Math.max(46,...rows.map(r=>(r.observationLabel?.en??r.system).split('\n').reduce((n,line)=>n+Math.max(1,Math.ceil(line.length/(narrow?19:32))),0)*18+12));
export function monitorChartOption(rows,group,locale='en',state={}){
 if(isConditionMatrix(rows))return conditionMatrixOption(rows,group,locale,state);
 state=normalizeChartState(rows,state);const facets=chartFacets(rows,state);
 if(facets.visible.length>1){
  const columns=state.narrow?1:2,gap=42,panelHeight=state.display==='timeline'?290:Math.max(280,...facets.visible.map(f=>(state.exportAll?rows.filter(r=>r.facetId===f.id).length:Math.min(12,rows.filter(r=>r.facetId===f.id).length))*systemRowHeight(rows,state.narrow)+120));
  const grids=[],xs=[],ys=[],series=[],titles=[];let common;
  facets.visible.forEach((f,i)=>{const rs=rows.filter(r=>(r.facetId??'source')===f.id),option=singleChart(rs,group,locale,{...state,facetOnly:true}),col=i%columns,row=Math.floor(i/columns),width=100/columns;
   common??=option;const left=col*width+(state.display==='timeline'?6:2),right=100-(col+1)*width+(state.display==='timeline'?3:5),top=55+row*(panelHeight+gap);
   grids.push({...option.grid,left:left+'%',right:right+'%',top,height:panelHeight-105,containLabel:state.display!=='timeline'});xs.push({...option.xAxis,gridIndex:i});ys.push({...option.yAxis,gridIndex:i});series.push(...option.series.map(s=>({...s,xAxisIndex:i,yAxisIndex:i})));titles.push({text:label(f.label,locale),left:col*width+2+'%',top:row*(panelHeight+gap)+7,textStyle:{fontSize:12,fontWeight:500,width:state.narrow?280:360,overflow:'break',lineHeight:17,color:'#34534f'}});
  });return {...common,title:titles,grid:grids,xAxis:xs,yAxis:ys,series};
 }
 const option=singleChart(rows.filter(r=>!facets.visible.length||facets.visible.some(f=>f.id===(r.facetId??'source'))),group,locale,state);
 if(rows.some(r=>r.conditionScope)&&facets.visible[0]){option.title={text:label(facets.visible[0].label,locale),left:12,top:6,textStyle:{fontSize:13,fontWeight:550,color:'#34534f',width:state.narrow?280:650,overflow:'break',lineHeight:17}};option.grid.top=76;}
 return option;
}
/** Order whole task facets before paging; display order does not establish comparability. */
export function orderChartRows(rows,group,state={}){
 if(state.gridSortField)return rows;
 const requested=state.sort??'metric',sort=requested==='metric'?(primaryMetricOrder(group,rows)==='asc'?'value-asc':'value'):requested;if(sort==='source')return rows;
 const facets=[...new Set(rows.map(r=>r.facetId??'source'))];
 return facets.flatMap(f=>rows.filter(r=>(r.facetId??'source')===f).sort((a,b)=>{
  if(sort==='name')return a.system.localeCompare(b.system,'en',{numeric:true});
  if(sort==='value'||sort==='value-asc')return (sort==='value'?-1:1)*(a.value-b.value);
  return a.releaseDate&&b.releaseDate?b.releaseDate.localeCompare(a.releaseDate):a.releaseDate?-1:b.releaseDate?1:0;
 }));
}
function modelAxisLabels(rows,labels=rows.map(r=>r.system),width=190){
 const rich={name:{fontSize:11,lineHeight:18}},marks=[];for(const [i,r]of rows.entries()){const ids=r.developerIds??[r.developerId],tokens=[];for(const [j,id]of ids.entries()){const asset=organizationBrand(id)?.asset;if(asset){const key='brand'+i+(j?'_'+j:'');rich[key]={width:16,height:16,verticalAlign:'middle',backgroundColor:{image:asset.path},padding:[0,0,0,0]};tokens.push('{'+key+'|}');}}marks[i]=tokens.join(' ');}
 return {fontSize:11,lineHeight:18,align:'left',margin:width+35,rich,formatter:(_,index)=>`${marks[index]?marks[index]+'  ':''}{name|${labels[index]}}`};
}
function singleChart(rows,group,locale,state){
 rows=orderChartRows(rows.some(r=>!r.observationLabel)?contextualizeObservations(rows):rows,group,state);
 const en=locale==='en',timeline=state.display==='timeline',visible=timeline?rows.filter(r=>r.releaseDate):group.level==='panorama'&&!state.exportAll?rows.slice((state.systemPage??0)*12,(state.systemPage??0)*12+12):state.all?rows:rows.slice(0,12),metric=rows[0],metricName=metric?`${label(metric.label,locale)}${metric.unit?` (${metric.unit})`:''}`:(en?'Reported value':'原文数值');
 const positive=visible.length>0&&visible.every(r=>r.value>0),log=timeline&&positive&&Math.max(...visible.map(r=>r.value))/Math.min(...visible.map(r=>r.value))>=100&&metric?.unit!=='%';
 const series=[],developers=[...new Set(visible.map(r=>r.developerId??'unresolved'))];
 const tooltip={trigger:'item',confine:true,extraCssText:'max-width:360px;white-space:normal;line-height:1.7',formatter:p=>{const r=p.data?.record;if(!r)return '';return `<strong>${html(r.system)}</strong><br>${html(label(r.label,locale))}: ${html(monitorValue(r))}<br>${html(modelSizeDescription(r,locale))}<br>${html(en?'Released':'发布')}: ${html(r.releaseDate??'—')}<br>${html(label(r.observationCondition,locale)||r.taskSet||'')}<br>${html([r.configuration?.harness,r.configuration?.budget].filter(Boolean).join(' · ')||'—')}<br>${html(r.attribution?.evaluator??'—')}`;}};
 const common={animation:false,backgroundColor:'transparent',textStyle:{fontFamily:'Geist Local,MiSans,system-ui,sans-serif',color:'#334e5b'},aria:{enabled:true,description:`${label(group.title,locale)}. ${metricName}. ${en?'Point sizes encode total-parameter bands; dashed outlines mean size unknown. Full data and source conditions follow the chart.':'点大小表示总参数档位；虚线轮廓表示尺寸未知。完整数据与来源条件见下表。'}`},tooltip};
 const mark=r=>({symbol:r.conditionStatus==='incomplete'?'rect':r.conditionStatus==='conditional'?'diamond':'circle',symbolSize:modelSizeMark(r).diameter,itemStyle:{color:r.conditionStatus&&r.conditionStatus!=='matched'?'#fafcf9':companyColor(r.developerId??'unresolved'),borderColor:companyColor(r.developerId??'unresolved'),borderType:modelSizeMark(r).known?'solid':'dashed',borderWidth:state.selected===(r.key??r.resultId+'|'+r.metricId)?3:1.8}});
 const upper=Math.max(100,...visible.map(r=>r.interval?.upper??r.value));
 if(timeline){
  for(const developer of developers){const rs=visible.filter(r=>(r.developerId??'unresolved')===developer).sort((a,b)=>a.releaseDate.localeCompare(b.releaseDate));
   series.push({name:developer,type:comparisonPermissions(group).connect?'line':'scatter',symbolSize:10,showSymbol:true,connectNulls:false,lineStyle:{width:1.6},itemStyle:{color:companyColor(developer)},data:rs.map(r=>({value:[Date.parse(r.releaseDate),r.value],...mark(r),record:r}))});
  }
  if(group.benchmarkId==='time-horizons'&&series[0])series[0].markLine={silent:true,symbol:'none',label:{formatter:en?'16 hours · measurement limit':'16 小时 · 测量限制',position:'insideEndTop',fontSize:10},lineStyle:{color:'#8e917d',type:'dashed'},data:[{yAxis:metric?.unit==='h'?16:960}]};
  for(const r of visible)if(Number.isFinite(r.interval?.lower)&&Number.isFinite(r.interval?.upper))series.push({type:'line',name:'interval',silent:true,tooltip:{show:false},symbol:'none',lineStyle:{width:1,color:companyColor(r.developerId??'unresolved'),opacity:.65},data:[[Date.parse(r.releaseDate),r.interval.lower],[Date.parse(r.releaseDate),r.interval.upper]]});
  return {...common,grid:{left:65,right:35,top:58,bottom:65},xAxis:{type:'time',name:en?'Model public release date':'模型公开发布日期',nameLocation:'middle',nameGap:40,axisLabel:{hideOverlap:true,formatter:value=>new Date(value).toISOString().slice(0,visible.length&&Math.max(...visible.map(r=>Date.parse(r.releaseDate)))-Math.min(...visible.map(r=>Date.parse(r.releaseDate)))<180*86400000?10:7)},splitLine:{show:false},axisLine:{lineStyle:{color:'#b6c9bf'}}},yAxis:{type:log?'log':'value',name:metricName+(log?(en?' · log scale':' · 对数刻度'):''),logBase:10,nameLocation:'end',nameTextStyle:{align:'left',fontSize:12},min:metric?.unit==='%'?0:undefined,max:metric?.unit==='%'?upper:undefined,splitLine:{lineStyle:{color:'#e1e9e3'}},axisLabel:{fontSize:11}},series};
 }
 const intervals=visible.flatMap((r,index)=>Number.isFinite(r.interval?.lower)&&Number.isFinite(r.interval?.upper)?[{type:'line',silent:true,tooltip:{show:false},symbol:'none',lineStyle:{width:2,color:'#344f5b'},data:[[r.interval.lower,index],[r.interval.upper,index]]}]:[]);
 return {...common,grid:{left:12,right:65,top:42,bottom:40,containLabel:true},xAxis:{type:'value',min:0,max:metric?.unit==='%'?upper:undefined,name:metricName,nameLocation:'middle',nameGap:28,axisLabel:{fontSize:12},splitLine:{lineStyle:{color:'#e1e9e3'}}},yAxis:{type:'category',inverse:true,data:visible.map(r=>label(r.observationLabel,locale)||r.system),axisLine:{show:false},axisTick:{show:false},axisLabel:{...modelAxisLabels(visible,visible.map(r=>label(r.observationLabel,locale)||r.system),state.narrow?105:190),width:state.narrow?140:225,overflow:'break'}},series:[{type:'bar',barMaxWidth:22,label:{show:true,position:'right',offset:[0,-11],fontSize:11,formatter:p=>monitorValue(p.data.record)},data:visible.map(r=>({value:r.value,record:r,itemStyle:{color:companyColor(r.developerId??'unresolved'),borderRadius:[0,3,3,0]}}))},...intervals]};
}
export function monitorChartHeight(rows,state={}){if(isConditionMatrix(rows)){const n=chartFacets(rows,{...state,display:'bars'}).visible.length;return Math.ceil(n/(state.narrow||state.compact&&!state.exportAll?1:2))*570;}const fs=chartFacets(rows,state).visible;if(fs.length>1){const cols=state.narrow?1:2,panel=state.display==='timeline'?290:Math.max(280,...fs.map(f=>(state.exportAll?rows.filter(r=>(r.facetId??'source')===f.id).length:Math.min(12,rows.filter(r=>(r.facetId??'source')===f.id).length))*systemRowHeight(rows,state.narrow)+120));return Math.ceil(fs.length/cols)*(panel+42);}const shown=chartVisibleRows(rows,state);return state.display==='timeline'?(state.compact?300:400):Math.max(260,Math.min(state.exportAll?shown.length:12,shown.length)*systemRowHeight(shown,state.narrow)+100);}

/** Factorial experiments use their measured goal/threat axes, not model release dates. */
function conditionMatrixOption(rows,group,locale,state){
 const en=locale==='en',facets=chartFacets(rows,{...state,display:'bars'}).visible,columns=state.narrow||state.compact&&!state.exportAll?1:2;
 const grids=[],xs=[],ys=[],series=[],titles=[];
 for(const [i,f]of facets.entries()){
  const rs=rows.filter(r=>(r.facetId??'source')===f.id),threats=[...new Set(rs.map(r=>r.experimentalConditions.threat))];
  const rowKeys=[...new Set(rs.map(r=>r.system+'|'+r.experimentalConditions.goal))];
  const col=i%columns,row=Math.floor(i/columns),left=col*100/columns+2,right=100-(col+1)*100/columns+3,top=row*570;
  titles.push({text:label(f.label,locale).replace(/^Agentic Misalignment /,''),subtext:en?'Harmful actions (%) · 30 rollouts per condition':'有害行动发生率（%）· 每种条件 30 次试验',left:left+'%',top:top+6,textStyle:{fontSize:14,fontWeight:550,color:'#153e45'},subtextStyle:{fontSize:11,color:'#4b625d'}});
  grids.push({left:left+'%',right:right+'%',top:top+90,height:430,containLabel:true});
  xs.push({type:'category',gridIndex:i,data:threats,position:'top',axisTick:{show:false},axisLine:{show:false},axisLabel:{fontSize:11,interval:0}});
  ys.push({type:'category',gridIndex:i,inverse:true,data:rowKeys.map(k=>k.replace('|','\n')),axisTick:{show:false},axisLine:{show:false},axisLabel:{...modelAxisLabels(rowKeys.map(k=>rs.find(r=>r.system+'|'+r.experimentalConditions.goal===k)),rowKeys.map(k=>k.replace('|','\n'))),fontSize:10,lineHeight:14,interval:0}});
  series.push({type:'heatmap',xAxisIndex:i,yAxisIndex:i,label:{show:true,fontSize:11,lineHeight:15,formatter:p=>monitorValue(p.data.record)+'\n'+(p.data.record.intervalText??'')},data:rs.map(r=>({value:[threats.indexOf(r.experimentalConditions.threat),rowKeys.indexOf(r.system+'|'+r.experimentalConditions.goal),r.value],record:r,itemStyle:{color:r.value===0?'#f0f4f1':r.value<20?'#c7e0d3':r.value<40?'#6aa58e':'#235b50',borderColor:'#fff',borderWidth:2},label:{color:r.value>=40?'#fff':'#203c36'}}))});
 }
 return {animation:false,textStyle:{fontFamily:'Geist Local,MiSans,system-ui,sans-serif'},aria:{enabled:true,description:en?'Source-reported harmful-action rates by model, goal and threat.':'来源报告的模型、目标及威胁条件下有害行动发生率。'},title:titles,grid:grids,xAxis:xs,yAxis:ys,visualMap:{show:false,type:'piecewise',dimension:2,pieces:[{value:0,color:'#f0f4f1'},{gt:0,lt:20,color:'#c7e0d3'},{gte:20,lt:40,color:'#6aa58e'},{gte:40,color:'#235b50'}]},tooltip:{confine:true,formatter:p=>{const r=p.data.record;return [r.system,r.experimentalConditions.goal,r.experimentalConditions.threat,monitorValue(r)+' '+(r.intervalText??''),r.sample?.[locale],r.attribution?.evaluator].map(html).join('<br>');}},series};
}
