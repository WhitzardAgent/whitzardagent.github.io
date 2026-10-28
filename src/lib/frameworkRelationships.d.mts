import type {Catalogue, ResearchWork, Text, Area} from '../data/nuwa-index/types';
export function frameworkRelationships(catalogue:Catalogue):{domains:Area[];mechanisms:{id:string;label:Text;pathway:Text;domainIds:string[];relation:string;works:ResearchWork[]}[];capabilities:{id:string;label:Text;relation:string;works:ResearchWork[]}[]};
export function frameworkResearchQuery(work:ResearchWork):string;
