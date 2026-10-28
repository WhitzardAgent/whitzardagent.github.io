import {catalogue} from '../../../../data/nuwa-index';
import {monitorDataSubset} from '../../../../lib/nuwa-intelligence/monitorPayload.mjs';
import {buildDisplaySets} from '../../../../lib/nuwa-intelligence/panorama.mjs';
import {selectTopicPresentation} from '../../../../lib/nuwa-intelligence/editorial.mjs';
import {displayRows} from '../../../../lib/nuwa-intelligence/panorama.mjs';
import {isConditionMatrix} from '../../../../lib/nuwa-intelligence/monitorChart.mjs';
export function getStaticPaths(){return catalogue.areas.flatMap(area=>['zh','en'].map(locale=>({params:{key:`${catalogue.snapshotId}--${locale}--${area.id}`},props:{area:area.id,locale}})));}
export function GET({props}:{props:{area:string;locale:string}}){const p=selectTopicPresentation(catalogue,props.area,buildDisplaySets(catalogue,{area:props.area})),groups=p.groups,rows=groups[0]?displayRows(catalogue,groups[0],{locale:props.locale}):[],defaultDisplay=isConditionMatrix(rows)?'bars':p.defaultDisplay==='timeline'&&rows.filter((r:any)=>r.releaseDate).length<2?'bars':p.defaultDisplay;return Response.json({snapshotId:catalogue.snapshotId,data:monitorDataSubset(catalogue,groups),groups,namespace:`topic-${props.area}`,locale:props.locale,analyses:[],defaultDisplay,compact:true});}
