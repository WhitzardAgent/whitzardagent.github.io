import {comparisonOptions,comparisonDataset,defaultComparisonId} from '../../../../lib/nuwa-intelligence/platformData';
import {projectComparison,comparisonCsv} from '../../../../lib/nuwa-intelligence/platformComparison.mjs';
export function getStaticPaths(){return comparisonOptions.filter(o=>o.id===defaultComparisonId).flatMap(o=>['zh','en'].map(locale=>({params:{id:(locale==='en'?'en--':'')+o.id},props:{locale,groupId:o.id}})));}
export function GET({props}:any){const d=comparisonDataset(props.groupId,props.locale);return new Response(comparisonCsv(projectComparison(d,{systems:d.rows.slice(0,3).map((r:any)=>r.resultId)}).rows,d.snapshot),{headers:{'Content-Type':'text/csv;charset=utf-8'}});}
