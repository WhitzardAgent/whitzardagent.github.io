import {catalogue} from '../../../../data/nuwa-index';
import {modelPanels} from '../../../../lib/nuwa-intelligence/modelPanels.mjs';
export function getStaticPaths(){return (catalogue.models??[]).map(m=>({params:{id:m.id},props:{id:m.id}}));}
export function GET({props}:{props:{id:string}}){return new Response(JSON.stringify({snapshotId:catalogue.snapshotId,modelId:props.id,en:modelPanels(catalogue,props.id,'en'),zh:modelPanels(catalogue,props.id,'zh')}),{headers:{'Content-Type':'application/json'}});}
