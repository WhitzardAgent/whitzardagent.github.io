/** Build private reading profiles from the work that defines the protocol, never from a later model report that merely uses it. */
export function extendProtocolReadings(profiles,works,catalogue){
 return profiles.map(profile=>{
  if(profile.review?.sourceReading&&!['pending','selected-sections-of-protocol-defining-work'].includes(profile.review.sourceReading))return profile;
  const work=works.find(w=>w.id===profile.id),definition=catalogue.works.find(w=>w.id===profile.id&&w.protocolIds.includes(profile.id));
  if(!definition||!work?.en?.takeaway||!work?.zh?.takeaway)return profile;
  const localized=locale=>{const copy=work[locale],m=work.measurementProfile?.[locale]??{};return {measurement:m.measurement??copy.question,task:m.task??copy.design,scoring:m.scoring??copy.scoring??null,conditions:m.conditions??copy.conditions??null,statistics:m.statistics?`${locale==='en'?'Source-reported result statements; this does not establish trial counts, denominators or an estimator:':'来源报告的结果表述；这不等同于已确定运行次数、分母或估计方法：'} ${m.statistics}`:null,validity:m.validity??copy.limits,usage:m.usage??copy.decisionRelevance};};
  return {...profile,en:localized('en'),zh:localized('zh'),sourceRefs:work.sourceRefs,review:{...profile.review,sourceScope:work.review.sourceScope,sourceReading:'selected-sections-of-protocol-defining-work',evidenceApproval:'pending-human-review',editorialApproval:'pending-human-review',humanSignoff:null,fieldBasis:'Source-specific measurement reading; unknown scoring, system conditions and statistical methods remain null. Existing variant metadata is retained separately.'}};
 });
}
