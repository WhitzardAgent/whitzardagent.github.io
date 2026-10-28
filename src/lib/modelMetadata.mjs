import {documentKey} from './researchCitations.mjs';
import registry from '../data/nuwa-index/model-metadata.json' with {type:'json'};
export const modelMetadataRegistry=registry;
const records=new Map(registry.models.map(m=>[m.modelId,m]));
/** Current, independently maintained facts. Report dates remain in historical snapshots. */
export function modelMetadata(model){
 if(model?.modelMetadata)return model.modelMetadata;
 return records.get(model?.id)??null;
}
export function modelRelease(model){
 const metadata=modelMetadata(model);
 return metadata?metadata.release.status==='verified'?metadata.release.date:null:model?.releaseDate??null;
}
export function parameterLabel(parameters,locale='en'){
 const en=locale==='en';if(!parameters||parameters.status==='pending')return en?'Not yet verified':'待核实';if(parameters.status==='not-disclosed')return en?'Not disclosed':'未披露';
 const format=n=>n==null?'—':n>=1e12?`${n/1e12}T`:`${n/1e9}B`;
 return `${format(parameters.total)}${parameters.active==null?'':` · ${format(parameters.active)} ${en?'active':'激活'}`}`;
}
export function modelMetadataReferences(model,locale='en'){
 const m=modelMetadata(model);if(!m)return [];
 return [['release',m.release.sources,locale==='en'?'Model release metadata':'模型发布元数据'],['parameters',m.parameters.sources,locale==='en'?'Model parameters':'模型参数规模']].flatMap(([field,sources,appliesTo])=>sources.map((s,i)=>({...s,sourceId:`model-meta-${m.modelId}-${field}-${i}`,appliesTo})));
}
export function modelMetadataSources(models,sources=[]){return models.flatMap(m=>modelMetadataReferences(m).map(({sourceId,...source})=>({...source,id:sourceId,documentId:sources.find(s=>documentKey(s.url)===documentKey(source.url))?.documentId})));}
export function validateModelMetadata(models){
 const errors=[],ids=new Set(models.map(m=>m.id)),seen=new Set();
 for(const m of registry.models){
  if(!ids.has(m.modelId)||seen.has(m.modelId))errors.push(`${m.modelId}: unknown or duplicate metadata`);seen.add(m.modelId);
  const r=m.release,p=m.parameters;
  if(r.status==='verified'&&(!/^\d{4}-\d{2}-\d{2}$/.test(r.date??'')||!r.sources.length))errors.push(`${m.modelId}: release needs a dated official source`);
  if(r.status!=='verified'&&r.date!==null)errors.push(`${m.modelId}: unresolved date must remain null`);
  if(p.status==='disclosed'&&(!(p.total>0)||!p.sources.length||p.active!=null&&(!(p.active>0)||p.active>p.total)))errors.push(`${m.modelId}: invalid parameters`);
  if(p.status!=='disclosed'&&(p.total!==null||p.active!==null))errors.push(`${m.modelId}: unresolved size must remain null`);
  for(const s of [...r.sources,...p.sources])if(!/^https:\/\//.test(s.url)||!s.locator||!s.checkedOn)errors.push(`${m.modelId}: incomplete metadata source`);
 }
 for(const id of ids)if(!seen.has(id))errors.push(`${id}: missing metadata record`);
 return errors;
}
