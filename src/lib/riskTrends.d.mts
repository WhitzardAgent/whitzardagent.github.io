import type {TrendData,TrendState,TrendPoint} from './modelEvidence.mjs';
import type {TrendSeries} from '../data/nuwa-index/types';
export const developerColors:Record<string,string>;
export function selectedTrend(data:TrendData,state:TrendState):{series:TrendSeries;points:TrendPoint[]};
export function trendTable(points:TrendPoint[],locale:string,base:string):string;
export function trendSvg(points:TrendPoint[],series:TrendSeries,metricLabel:string,locale:string,options?:{standalone?:boolean;log?:boolean;base?:string}):string;
export function trendCsv(points:TrendPoint[],locale:string):string;
export function trendSourceMarkup(data:TrendData & {sources?:import('../data/nuwa-index/types').Source[];organizations?:import('../data/nuwa-index/types').Organization[]},series:TrendSeries,locale:'en'|'zh'):string;
