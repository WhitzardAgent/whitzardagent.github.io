import {comparisonOptions,comparisonDataset} from '../../../../lib/nuwa-intelligence/platformData';
export function getStaticPaths(){return comparisonOptions.map(o=>({params:{id:o.id}}));}
export function GET({params}:any){return new Response(JSON.stringify({zh:comparisonDataset(params.id,'zh'),en:comparisonDataset(params.id,'en')}),{headers:{'Content-Type':'application/json'}});}
