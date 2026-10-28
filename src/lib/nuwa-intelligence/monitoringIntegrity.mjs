import {digest} from './sourceVersions.mjs';
import {effectiveCatalogue} from './lineage.mjs';
import {analysisState,groupDependencies} from './monitoring.mjs';
export function monitorBindingHash(data,group){return digest({dependencies:groupDependencies(effectiveCatalogue(data),group),conditions:group.conditions,level:group.level,sourceIds:group.sourceIds});}
export function validateMonitoringBindings(data){const errors=[],effective=effectiveCatalogue(data);for(const g of data.monitoring?.groups??[]){if(!/^[a-f0-9]{64}$/.test(g.review?.dependencyHash??''))errors.push(`${g.id}: missing monitoring review binding`);else if(g.review.dependencyHash!==monitorBindingHash(data,g))errors.push(`${g.id}: stale monitoring review binding`);}for(const a of data.monitoring?.analyses??[]){const g=data.monitoring?.groups?.find(g=>g.id===a.groupId);if(!g||analysisState(effective,g,a)!=='current')errors.push(`${a.id}: analysis binding stale or incomplete`);}return errors;}
