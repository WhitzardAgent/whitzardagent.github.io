import {createHash} from 'node:crypto';
export function canonicalJson(value){if(Array.isArray(value))return `[${value.map(canonicalJson).join(',')}]`;if(value&&typeof value==='object')return `{${Object.keys(value).filter(k=>value[k]!==undefined).sort().map(k=>`${JSON.stringify(k)}:${canonicalJson(value[k])}`).join(',')}}`;return JSON.stringify(value);}
export const digest=value=>createHash('sha256').update(typeof value==='string'?value:canonicalJson(value)).digest('hex');
export function canonicalDocumentId(url){const a=url.match(/(?:arxiv\.org\/(?:abs|pdf|html)\/|doi\.org\/10\.48550\/arxiv\.)(\d{4}\.\d{4,5})/i);if(a)return `arxiv:${a[1]}`;const u=new URL(url);u.hash='';return u.href.replace(/\/$/,'');}
export function makeSourceVersion(input){
 if(!input.sourceId||!input.artifacts?.length)throw Error('sourceId and captured artifacts required');
 if(input.publicationDate&&['file-mtime','http-last-modified','capture','model-release'].includes(input.publicationDateBasis))throw Error('Invalid publication date basis');
 for(const a of input.artifacts)if(!/^[a-f0-9]{64}$/.test(a.sha256)||!/^https?:/.test(a.url)||!['document','data','renderer'].includes(a.role))throw Error('Invalid source artifact');
 const identity={sourceId:input.sourceId,documentId:input.documentId??canonicalDocumentId(input.artifacts[0].url),contractVersion:input.contractVersion??'nuwa-source-1',artifacts:input.artifacts.map(({role,url,sha256})=>({role,url,sha256})).sort((a,b)=>(a.role+a.url).localeCompare(b.role+b.url))};
 return {...identity,id:`${input.sourceId}--${digest(identity).slice(0,16)}`,bundleHash:digest(identity),artifacts:input.artifacts.map(({role,url,sha256,capturedAt})=>({role,url,sha256,capturedAt:capturedAt??null})),publicationDate:input.publicationDate??null,revisionDate:input.revisionDate??null,availabilityDate:input.availabilityDate??null,availabilityBasis:input.availabilityBasis??'unknown'};
}
/** Local page renders, parser output and HTTP headers belong to extraction provenance, not the original source bundle. */
export function sourceArtifactsForPackage(pkg){const selected=new Map();for(const a of pkg.artifacts??[]){if(!a.url||a.derived||/headers?(?:\.|$)/i.test(a.path??''))continue;const key=[a.role,a.url,a.sha256].join('|');if(!selected.has(key)||a.capturedAt&&!selected.get(key).capturedAt)selected.set(key,a);}return [...selected.values()];}
