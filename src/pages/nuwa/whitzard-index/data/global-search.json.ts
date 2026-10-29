import {catalogue,currentEdition} from '../../../../data/nuwa-index';
import {researchSearchDocuments} from '../../../../lib/nuwa-intelligence/researchLibrary';
export async function GET(){
 const documents=currentEdition?.documents??(await researchSearchDocuments()).flatMap((d:any)=>d.fields.flatMap((f:any)=>['en','zh'].filter(locale=>f[locale]).map(locale=>({id:`research:${d.id}:${f.kind}:${locale}`,objectId:d.id,type:'research',title:d.title,section:f.kind,locale,text:f[locale],url:`/nuwa/whitzard-index/work/${d.id}/`,areas:d.areas,primaryFunction:d.primaryFunction}))));
 return Response.json({schemaVersion:'nuwa-static-search-1',snapshotId:currentEdition?.candidateId??catalogue.snapshotId,mode:'static-lexical',documents});
}
