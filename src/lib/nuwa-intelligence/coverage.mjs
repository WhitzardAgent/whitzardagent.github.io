import {effectiveCatalogue} from './lineage.mjs';
const unique=values=>[...new Set(values.filter(Boolean))];
const sourcedReleaseDate=(data,model)=>model?.releaseDate&&(data.sources??[]).some(s=>s.id===model.releaseSourceId)?model.releaseDate:null;

/** Read only explicit catalogue relationships. Names, aliases, fine-tune bases and row dates never resolve identity. */
export function resolvedObservationModel(data,resultId) {
 const record=data.results?.find(r=>r.id===resultId);
 if(!record)return {modelId:null,model:null,status:'missing-result',modelIds:[],releaseDate:null,releaseSourceId:null,origins:[]};
 const official=(data.officialObservations??[]).filter(o=>o.resultId===resultId);
 const links=(data.assessmentEvidence??[]).filter(l=>l.resultId===resultId);
 const bindings=(data.monitoring?.groups??[]).flatMap(g=>(g.bindings??[]).filter(b=>b.resultId===resultId));
 const modelIds=unique([...official,...links,...bindings].map(item=>item.modelId));
 const known=modelIds.filter(id=>data.models?.some(m=>m.id===id));
 const modelId=modelIds.length===1&&known.length===1?known[0]:null;
 const model=data.models?.find(m=>m.id===modelId)??null;
 // A model release date must carry its own source. A reported leaderboard date is never a release date.
 const releaseDate=sourcedReleaseDate(data,model);
 return {modelId,model,status:modelIds.length>1?'conflict':modelId?'linked':modelIds.length?'unknown-model':'not-linked',modelIds,releaseDate,releaseSourceId:releaseDate?model.releaseSourceId:null,origins:unique([official.some(o=>o.modelId===modelId)&&modelId?'official-observation':null,links.some(l=>l.modelId===modelId)&&modelId?'assessment-evidence':null,bindings.some(b=>b.modelId===modelId)&&modelId?'monitoring-binding':null])};
}

/** Coverage describes linked published records, never negative findings or matched comparisons. */
export function buildCoverageAudit(catalogue) {
 const data=effectiveCatalogue(catalogue),results=new Map(data.results.map(r=>[r.id,r]));
 const identities=new Map(data.results.map(r=>[r.id,resolvedObservationModel(data,r.id)]));
 const groups=data.monitoring?.groups??[],official=data.officialObservations??[];
 const officialSourceCounts=(data.sourceUnits??[]).filter(u=>u.kind==='official').map(u=>{
  const observations=official.filter(o=>o.unitId===u.id),linked=observations.filter(o=>identities.get(o.resultId)?.modelId);
  return {unitId:u.id,sourceId:u.sourceId,total:observations.length,modelLinked:linked.length,missingIdentity:observations.length-linked.length,releaseDated:linked.filter(o=>identities.get(o.resultId).releaseDate).length,missingReleaseDate:linked.filter(o=>!identities.get(o.resultId).releaseDate).length,monitoringLinked:linked.filter(o=>groups.some(g=>g.bindings?.some(b=>b.resultId===o.resultId&&b.modelId===identities.get(o.resultId).modelId))).length,protocolLinked:observations.filter(o=>(data.assessmentEvidence??[]).some(l=>l.resultId===o.resultId&&l.variantId&&data.protocolVariants.some(v=>v.id===l.variantId))).length};
 });
 const describe=o=>({observationId:o.id,resultId:o.resultId,unitId:o.unitId,system:o.system,sourceId:results.get(o.resultId)?.sourceId??null,locator:o.locator??null});
 const missingIdentity=official.filter(o=>!identities.get(o.resultId)?.modelId).map(describe);
 const missingReleaseDates=official.filter(o=>identities.get(o.resultId)?.modelId&&!identities.get(o.resultId)?.releaseDate).map(o=>({...describe(o),modelId:identities.get(o.resultId).modelId}));
 const identityConflicts=data.results.filter(r=>identities.get(r.id).status==='conflict').map(r=>({resultId:r.id,modelIds:identities.get(r.id).modelIds}));
 const coreBenchmarks=(data.monitoring?.benchmarkSelections??[]).filter(s=>s.tier==='core').map(s=>({benchmarkId:s.benchmarkId,name:data.benchmarks?.find(b=>b.id===s.benchmarkId)?.name??s.benchmarkId}));
 const models=unique(data.monitoring?.cohortModelIds??data.models?.map(m=>m.id)??[]).map(id=>data.models?.find(m=>m.id===id)).filter(Boolean).map(m=>({modelId:m.id,name:m.name,releaseDate:sourcedReleaseDate(data,m),releaseSourceId:sourcedReleaseDate(data,m)?m.releaseSourceId:null}));
 const protocols=coreBenchmarks.flatMap(b=>{
  const found=groups.filter(g=>g.benchmarkId===b.benchmarkId);
  return found.length?found.map(g=>({protocolId:g.id,benchmarkId:b.benchmarkId,level:g.level,sourceIds:g.sourceIds??[],title:g.title??null,protocolKnown:true})): [{protocolId:`no-protocol:${b.benchmarkId}`,benchmarkId:b.benchmarkId,level:null,sourceIds:[],title:null,protocolKnown:false}];
 });
 const cells=protocols.flatMap(p=>{
  const group=groups.find(g=>g.id===p.protocolId),bindings=(group?.bindings??[]).filter(b=>results.has(b.resultId));
  return models.map(model=>{
   const own=bindings.filter(b=>identities.get(b.resultId)?.modelId===model.modelId);
   const resultIds=unique(own.map(b=>b.resultId));
   const missing=[];
   if(!p.protocolKnown)missing.push('protocol');
   if(!resultIds.length)missing.push('linked-observation');
   if(resultIds.length){
    if(!model.releaseDate)missing.push('release-date');
    if(own.some(b=>!b.publicSince))missing.push('evidence-availability-date');
    if(resultIds.some(id=>!results.get(id).evaluationDate))missing.push('evaluation-date');
    if(own.some(b=>!(data.monitoring?.identityResolutions??[]).some(i=>i.id===b.resolutionId&&i.status==='resolved'&&i.resolvedVersion)))missing.push('exact-model-version');
   }
   return {modelId:model.modelId,benchmarkId:p.benchmarkId,protocolId:p.protocolId,status:resultIds.length?'reported':'not-linked',resultIds,missing};
  });
 });
 return {snapshotId:data.snapshotId,method:'explicit-catalogue-links-1',counts:{rawResults:catalogue.results.length,effectiveResults:data.results.length,cohortModels:models.length,coreBenchmarks:coreBenchmarks.length,protocols:protocols.length,officialObservations:official.length,officialModelLinked:official.filter(o=>identities.get(o.resultId)?.modelId).length,reportedCells:cells.filter(c=>c.status==='reported').length,totalCells:cells.length},officialSourceCounts,missingIdentity,missingReleaseDates,identityConflicts,models,coreBenchmarks,protocols,cells};
}
