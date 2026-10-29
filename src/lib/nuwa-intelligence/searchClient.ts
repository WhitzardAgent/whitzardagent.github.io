import {createStaticSearchIndex,searchStatic} from './staticSearch.mjs';
let cached:Promise<{version:string;index:ReturnType<typeof createStaticSearchIndex>}>|null=null;
async function staticIndex(){
 if(!cached)cached=fetch('/nuwa/whitzard-index/data/global-search.json').then(async response=>{if(!response.ok)throw Error('service');const payload=await response.json();return {version:payload.snapshotId,index:createStaticSearchIndex(payload.documents)};}).catch(error=>{cached=null;throw error;});
 return cached;
}
export async function searchNuwa(request:{query:string;locale?:string;snapshotId?:string;filters?:Record<string,string>;cursor?:string|null},{signal,endpoint}:{signal?:AbortSignal;endpoint?:string}={}){
 if(endpoint){const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(request),signal});if(!response.ok)throw Error('service');return response.json();}
 const data=await staticIndex();if(signal?.aborted)throw new DOMException('Aborted','AbortError');return searchStatic(data.index,request,data.version);
}
