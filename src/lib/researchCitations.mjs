import identities from '../data/nuwa-index/document-identities.json' with {type:'json'};
/** A document identity is independent of its HTML/PDF URL or fragment. */
export function documentKey(url) {
  try {
    const u=new URL(url);const value=decodeURIComponent(u.href).toLowerCase();
    const arxiv=value.match(/(?:arxiv\.org\/(?:abs|html|pdf)\/|10\.48550\/arxiv\.)(\d{4}\.\d+)/);
    if(arxiv)return `arxiv:${arxiv[1]}`;
    if(u.hostname.toLowerCase().endsWith('doi.org'))return `doi:${decodeURIComponent(u.pathname).slice(1).toLowerCase()}`;
    u.hash='';for(const k of [...u.searchParams.keys()])if(/^utm_|^(ref|source)$/.test(k))u.searchParams.delete(k);
    return u.href.replace(/\/$/,'');
  }catch{return String(url);}
}
export function collectPageSources(references,sources=[]) {
  const map=new Map();const byId=new Map(sources.map(s=>[s.id,s]));const byUrl=new Map(sources.flatMap(s=>[s.url,...(s.aliases??[])].map(url=>[documentKey(url),s])));
  for(const ref of references??[]) {
    const s=ref.sourceId?byId.get(ref.sourceId):byUrl.get(documentKey(ref.url))??ref;
    if(!s?.url)continue;
    const identity=identities.documents.find(d=>d.sourceIds.includes(s.id));
    const key=identity?.id||documentKey(s.documentId||s.url);
    const explicitVersion=ref.url?.match(/(\d{4}\.\d{4,5}v\d+)/)?.[1];
    let entry=map.get(key);
    if(!entry){entry={key,id:`source-${key.replace(/[^a-z0-9]+/gi,'-')}`,title:identity?.title??s.title??ref.title??s.url,url:s.url,sourceIds:[],links:[],dates:[],anchorAliases:[],versions:[],locators:[],appliesTo:[],authors:s.authors??[],publicationDate:s.publicationDate??null};map.set(key,entry);}
    const oldAnchor=`source-${(s.documentId||documentKey(s.url)).replace(/[^a-z0-9]+/gi,'-')}`;
    if(oldAnchor!==entry.id&&!entry.anchorAliases.includes(oldAnchor))entry.anchorAliases.push(oldAnchor);
    if(!entry.links.some(l=>l.url===s.url))entry.links.push({url:s.url,kind:/\.pdf(?:$|[?#])/i.test(s.url)?'pdf':/doi\.org/.test(s.url)?'doi':/arxiv\.org/.test(s.url)?'arxiv':'web'});
    if(s.publicationDate&&!entry.dates.some(d=>d.value===s.publicationDate&&d.role===(identity?.dateRoles?.[s.id]??'publication')))entry.dates.push({value:s.publicationDate,role:identity?.dateRoles?.[s.id]??'publication'});
    for(const id of [s.id,ref.sourceId].filter(Boolean))if(!entry.sourceIds.includes(id))entry.sourceIds.push(id);
    if(!entry.authors.length&&s.authors?.length)entry.authors=s.authors;
    for(const [field,value] of [['versions',[s.version,ref.version,explicitVersion&&!entry.versions.some(v=>v===explicitVersion.match(/v\d+$/)?.[0]||v.includes(explicitVersion))&&ref.version!==explicitVersion.match(/v\d+$/)?.[0]&&!s.version?.includes(explicitVersion)?'arXiv:'+explicitVersion:null].filter(Boolean)],['locators',ref.locator],['appliesTo',ref.appliesTo]])for(const text of Array.isArray(value)?value:[value])if(text&&!entry[field].includes(text))entry[field].push(text);
  }
  return [...map.values()];
}

/** Bibliography typography is deliberately smaller than the underlying locator inventory. */
export function citationDisplay(entry,locale='en'){
 const versions=[...new Set(entry.versions.filter(v=>!/(?:\bbundle\b|\bcaptur(?:ed|e)\b|\.js\b|\b[a-f0-9]{16,}\b)/i.test(v)).map(v=>/^arxiv:/i.test(v)?v.match(/v\d+$/)?.[0]??'arXiv':v).filter(v=>!entry.dates.some(d=>v.includes(d.value))&&!/^technical report\s*·?\s*$/i.test(v)))].join(' / ');
 const locators=entry.locators.filter(l=>!/^No complete|^No substantive|^No section-level/i.test(l)),shown=[];let length=0;
 for(const locator of locators){if(shown.length>=3||length+locator.length>220)break;shown.push(locator);length+=locator.length+2;}
 const hiddenLocationCount=locators.length-shown.length;
 return {versions,locations:shown.join('; '),hiddenLocationCount};
}

export function citationAuthors(authors=[]){
 return authors.filter(a=>!/[{}@]/.test(a)).map(a=>a.replace(/\s+\d+(?:\s+\d+)?\s+footnotemark:\s*\d+/gi,'').replace(/[†‡*]+$/g,'').trim()).filter(Boolean);
}
