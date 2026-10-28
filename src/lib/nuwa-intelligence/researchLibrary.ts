import {getCollection} from 'astro:content';
import {catalogue,researchSupplement} from '../../data/nuwa-index';
import {buildSearchDocument} from './researchDiscovery.mjs';
import {loadResearchDossiers} from './researchReading.mjs';
let documents:Promise<any[]>;
export function researchSearchDocuments(){
 return documents??=(async()=>{
  const wiki=await getCollection('nuwaWiki'),dossiers=loadResearchDossiers(catalogue);
  return catalogue.works.map(work=>{const body=Object.fromEntries(wiki.filter(e=>e.data.recordId===work.id).map(e=>[e.data.locale,e.body??'']));const update=researchSupplement?.updates.find((u:any)=>u.id===work.id);if(update)for(const locale of ['en','zh'])body[locale]=[body[locale]??'',update.text[locale]].join(' ');return buildSearchDocument(work,catalogue,{body,dossier:dossiers.find((d:any)=>d.id===work.id&&d.review?.state!=='review-pending')});});
 })();
}
