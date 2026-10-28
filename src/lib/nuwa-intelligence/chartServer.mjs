import {LegacyGridContainLabel} from 'echarts/features';
import {init,use} from 'echarts/core';
import {BarChart,ScatterChart,LineChart,HeatmapChart} from 'echarts/charts';
import {GridComponent,TooltipComponent,AriaComponent,MarkLineComponent,TitleComponent,VisualMapComponent} from 'echarts/components';
import {SVGRenderer} from 'echarts/renderers';
import {monitorChartOption,monitorChartHeight} from './monitorChart.mjs';
use([LegacyGridContainLabel,BarChart,ScatterChart,LineChart,HeatmapChart,GridComponent,TooltipComponent,AriaComponent,MarkLineComponent,TitleComponent,VisualMapComponent,SVGRenderer]);
const cache=new Map();
export function renderMonitorChart(rows,group,locale='en',state={}){
 const key=JSON.stringify([rows,group.id,group.level,group.review,locale,state]);if(cache.has(key))return cache.get(key);
 const chart=init(null,null,{renderer:'svg',ssr:true,width:state.compact?850:1100,height:monitorChartHeight(rows,state)});try{chart.setOption(monitorChartOption(rows,group,locale,state));const svg=chart.renderToSVGString();if(cache.size>1200)cache.clear();cache.set(key,svg);return svg;}finally{chart.dispose();}
}
