import type {Text,Evidence} from '../../data/nuwa-index/types';
export type MonitorState={group:string;asOf:string;timeBasis:string;developer:string;q:string;display:string;sort:string;all:boolean};
export type MonitorRow={snapshotId?:string|null;experimentalConditions?:Evidence['experimentalConditions'];id:string;resultId:string;modelId:string|null;developerId:string|null;system:string;modelName:string;releaseDate:string|null;releaseDateBasis?:string;releaseSource?:string|null;modelMetadata?:import('../modelMetadata.mjs').ModelMetadata|null;publicSince:string|null;evaluationDate:string|null;reportDate:string|null;identity:string;metricId:string;label:Text;value:number;unit:string;precision:number;qualifier:string;interval:any;intervalText:string|null;dimension:string;configuration:Evidence['configuration'];trialCount:number|null;taskSet:string;protocol:string;sample:Text;limitations:Text;sourceId:string;sourceVersion:string;locator:string;attribution:{evaluator:string;reporter:string;evaluatorIds:string[];sourceId:string;sourceTitle:string;sourceUrl:string;origin:string;nuwa:string}};
export function resultAttribution(data:any,record:any,locale?:string):MonitorRow['attribution'];
export function resultAreas(data:any,record:any):string[];
export function benchmarkResultEntries(data:any,records?:any[]):any[];
export function filterBenchmarkEntries(entries:any[],filters?:any):any[];
export function comparisonPermissions(group:any):{rank:boolean;connect:boolean};
export function comparisonRows(data:any,group:any,state?:Partial<MonitorState>&{locale?:string}):MonitorRow[];
export function readMonitorState(search:string,namespace:string,groups:any[]):MonitorState;
export function writeMonitorState(search:string,namespace:string,state:MonitorState):string;
export function monitorValue(row:MonitorRow):string;
export function monitorSvg(rows:MonitorRow[],group:any,locale?:string,state?:Partial<MonitorState>&{embedded?:boolean}):string;
export function monitorCsv(rows:MonitorRow[],group:any,locale?:string):string;
export function modelBenchmarkMatrix(data:any,modelId:string):{benchmarkId:string;name:string;records:(MonitorRow&{groupId:string})[];status:string}[];
export function groupDependencies(data:any,group:any):string;
export function analysisState(data:any,group:any,analysis:any,options?:{verifiedForRender?:boolean}):string;
export function validateMonitoring(data:any):string[];
export function serializeMonitoringPayload(data:any):string;

export function analysisDependencies(data:any,group:any,analysis:any):string;
export function sortBenchmarkEntries(entries:any[],sort?:string,selections?:any[]):any[];
export function sortMonitorGroups(data:any,groups:any[]):any[];
export function monitorDisplayTitle(data:any,group:any,locale?:string):string;
export function monitorMenuSections(data:any,groups:any[],namespace:string,locale?:string):{label:string;groups:any[]}[];
export function monitorLegend(rows:any[],data:any,locale?:string):{developerId:string;label:string;color:string}[];

export function companyColor(id:string):string;
