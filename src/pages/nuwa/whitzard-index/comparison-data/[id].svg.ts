import {comparisonOptions,comparisonDataset,defaultComparisonId} from '../../../../lib/nuwa-intelligence/platformData';
import {projectComparison} from '../../../../lib/nuwa-intelligence/platformComparison.mjs';
import {monitorSvg} from '../../../../lib/nuwa-intelligence/monitoring.mjs';
export function getStaticPaths(){return comparisonOptions.filter(o=>o.id===defaultComparisonId).flatMap(o=>['zh','en'].map(locale=>({params:{id:(locale==='en'?'en--':'')+o.id},props:{locale,groupId:o.id}})));}
export function GET({props}:any){const d=comparisonDataset(props.groupId,props.locale),rows=projectComparison(d,{systems:d.rows.slice(0,3).map((r:any)=>r.resultId)}).rows;return new Response(monitorSvg(rows,{...d,level:'descriptive'},props.locale,{display:'bars',all:true}),{headers:{'Content-Type':'image/svg+xml'}});}
