export function readComparisonState(search?:string):{area:string;group:string;systems:string[];sort:string;scope:string;asOf:string};
export function writeComparisonState(search:string,state:any):string;
export function projectComparison(dataset:any,state?:any):{rows:any[];systems:string[];selectionValid:boolean;rankAllowed:boolean;connectAllowed:boolean};
export function comparisonCsv(rows:any[],snapshot:string):string;
export function validatePublishedRun(run:any,context?:{results:any[];nuwaExecutorIds:string[]}):string[];
