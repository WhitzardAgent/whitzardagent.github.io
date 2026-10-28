import type {ResearchWork} from '../../data/nuwa-index/types';
export function metricDefinition(benchmarkId:string,metricId:string,record?:any):any;
export const topicEditorial:Record<string,any>;
export function selectTopicPresentation(data:any,area:string,groups:any[]):{groups:any[];indicatorIds:string[];defaultDisplay:string;works:ResearchWork[];lead:any;measurement:any;scope:any;benchmark:string};
export function researchCoverage(data:any):{area:string;label:any;cells:{functionId:string;label:any;count:number;workIds:string[]}[]}[];

export function primaryMetricOrder(group:any,rows?:any[]):'asc'|'desc';
