import {catalogue,currentEdition} from '../../../../../data/nuwa-index';
import {researchCitation} from '../../../../../lib/nuwa-intelligence/researchCite.mjs';
export function getStaticPaths(){return catalogue.works.flatMap(w=>['zh','en'].map(locale=>({params:{locale,id:w.id},props:{id:w.id,locale}})));}
export function GET({props}:{props:{id:string;locale:string}}){const work=catalogue.works.find(w=>w.id===props.id)!;return new Response(researchCitation(work,catalogue,{format:'ris',kind:'original',locale:props.locale})+((work.localReviewBatchId||currentEdition)?'':'\n'+researchCitation(work,catalogue,{format:'ris',kind:'nuwa',locale:props.locale})),{headers:{'Content-Type':'application/x-research-info-systems; charset=utf-8'}});}
