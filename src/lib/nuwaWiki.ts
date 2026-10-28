import {getCollection,render} from 'astro:content';
import type {Locale} from '../i18n/config';
let entries:ReturnType<typeof getCollection<'nuwaWiki'>>;
export async function wikiFor(recordId:string,locale:Locale){
 entries??=getCollection('nuwaWiki');
 const entry=(await entries).find(e=>e.data.recordId===recordId&&e.data.locale===locale);
 if(!entry)return null;
 const {Content,headings}=await render(entry);return {entry,Content,headings};
}
