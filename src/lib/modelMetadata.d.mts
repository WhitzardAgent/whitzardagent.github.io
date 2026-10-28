export interface ModelMetadataSource {url:string;title:string;locator:string;checkedOn:string;sha256?:string}
export interface ModelMetadata {modelId:string;release:{status:string;date:string|null;event:string|null;note?:{en:string;zh:string};sources:ModelMetadataSource[];events:{kind:string;date:string;sourceUrl:string}[]};parameters:{status:string;total:number|null;active:number|null;architecture:string|null;sources:ModelMetadataSource[];note?:{en:string;zh:string}};reportedRelease:{date:string|null;sourceId:string|null;basis:string}}
export const modelMetadataRegistry:{schemaVersion:number;updatedOn:string;dateConvention:string;models:ModelMetadata[]};
export function modelMetadata(model:any):ModelMetadata|null;
export function modelRelease(model:any):string|null;
export function parameterLabel(parameters:ModelMetadata['parameters']|undefined,locale?:string):string;
export function modelMetadataReferences(model:any,locale?:string):any[];
export function validateModelMetadata(models:any[]):string[];

export function modelMetadataSources(models:any[],sources?:any[]):any[];
