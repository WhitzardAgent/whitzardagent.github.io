export interface CitationEntry {key:string;id:string;title:string;url:string;sourceIds:string[];links:{url:string;kind:string}[];dates:{value:string;role:string}[];anchorAliases:string[];versions:string[];locators:string[];appliesTo:string[];authors:string[];publicationDate:string|null}
export function documentKey(url:string):string;
export function collectPageSources(references:any[],sources?:any[]):CitationEntry[];
export function citationDisplay(entry:{versions:string[];dates:{value:string}[];locators:string[]},locale?:string):{versions:string;locations:string;hiddenLocationCount:number};
export function citationAuthors(authors:string[]):string[];
