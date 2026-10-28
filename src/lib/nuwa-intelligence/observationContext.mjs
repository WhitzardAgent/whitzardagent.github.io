/** Display context from the existing extraction contract; original records remain untouched. */
const T=(en,zh=en)=>({en,zh});
const translations={
 'Conspiracy':'阴谋论','Undermining Control':'削弱控制','Noncontroversially Harmful overall':'明确有害话题（总体）',
 'Commit Physical Violence':'实施暴力','Human Trafficking':'人口贩运','Mass Murder':'大规模杀戮','Sexual Assault of Minors':'针对未成年人的性侵害','Torture Innocent People':'虐待无辜者',
 'Low harm':'低危害','Medium harm':'中等危害','High harm':'高危害','Single-turn':'单轮','single-turn':'单轮','Multi-turn':'多轮','multi-turn with pressure':'压力条件下的多轮',
 'English':'英语','Chinese':'中文','Observe':'观察模式','Redteam':'红队模式','Baseline':'基线','All-8':'全部八项线索',
 'No shutdown instruction':'无关闭指令','Explicitly allow shutdown':'明确允许关闭','Instructed to resist (competence check)':'要求抵抗（能力检查）',
};
export function reportedCondition(record){
 const parts=String(record.protocol??'').split(';').map(s=>s.trim());
 if(parts.at(-1)!=='source-specific configuration'||parts.length<3)return null;
 const en=parts.slice(1,-1).join(' · ');return en?T(en,translations[en]??en):null;
}

/** Split repeated systems by explicitly recorded within-report experimental conditions. */
export function separateConditionScopes(set,resultMap){
 const buckets=new Map();
 for(const b of set.bindings){const r=resultMap.get(b.resultId);if(r.experimentalConditions?.goal&&r.experimentalConditions?.threat)continue;
  const key=b.facetId+'|'+r.sourceId+'|'+r.system;
  if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push({b,r,condition:reportedCondition(r)});
 }
 const split=new Set();
 for(const items of buckets.values())if(items.every(i=>i.condition)&&new Set(items.map(i=>i.condition.en)).size>1)split.add(items[0].b.facetId+'|'+items[0].r.sourceId);
 const facets=new Map(set.facets.map(f=>[f.id,f]));
 for(const b of set.bindings){const r=resultMap.get(b.resultId),condition=reportedCondition(r);if(!condition||!split.has(b.facetId+'|'+r.sourceId))continue;
  const parent=facets.get(b.facetId),id=b.facetId+'-condition-'+encodeURIComponent(condition.en);
  if(!facets.has(id))facets.set(id,{...parent,id,label:set.facets.length===1?condition:T(parent.label.en+' · '+condition.en,parent.label.zh+' · '+condition.zh),condition});
  b.facetId=id;
 }
 set.facets=[...facets.values()].filter(f=>set.bindings.some(b=>b.facetId===f.id));
}

const known=v=>v&&!/not (?:disclosed|specified|reported)|unknown|unspecified|未披露/i.test(String(v));
/** Qualify only colliding labels; never collapse experiments or use their score as an identity. */
export function contextualizeObservations(rows){
 const copies=rows.map(r=>({...r,observationCondition:r.observationCondition??reportedCondition(r),observationLabel:T(r.system)})),buckets=new Map();
 for(const r of copies){const key=(r.facetId??'source')+'|'+r.system;if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(r);}
 for(const bucket of buckets.values()){
  if(bucket.length<2)continue;
  const fields=[r=>r.observationCondition,r=>r.modelName,r=>r.configuration?.modelVersion,r=>r.configuration?.budget,r=>r.trialCount==null?null:T(r.trialCount+' attempts',r.trialCount+' 次尝试'),r=>r.configuration?.tools,r=>r.experimentalConditions?.reasoning,r=>r.configuration?.harness,r=>r.attribution?.sourceTitle,r=>r.sourceVersion,r=>r.locator,r=>r.resultId];
  const pieces=new Map(bucket.map(r=>[r,[]]));
  for(const field of fields){
   const values=bucket.map(r=>field(r)),plain=v=>typeof v==='object'?v?.en:v;
   if(new Set(values.map(plain)).size<2)continue;
   bucket.forEach((r,i)=>{if(known(plain(values[i])))pieces.get(r).push(values[i]);});
   if(new Set(bucket.map(r=>pieces.get(r).map(plain).join(' · '))).size===bucket.length)break;
  }
  for(const r of bucket)r.observationLabel=T(r.system+'\n'+pieces.get(r).map(p=>p?.en??p).join(' · '),r.system+'\n'+pieces.get(r).map(p=>p?.zh??p).join(' · '));
 }
 return copies;
}

export const taskConditionText=(row,locale='en')=>[row.taskSet,row.observationCondition?.[locale]??reportedCondition(row)?.[locale],row.configuration?.budget,row.experimentalConditions?.goal,row.experimentalConditions?.threat].filter(Boolean).join(' · ');
