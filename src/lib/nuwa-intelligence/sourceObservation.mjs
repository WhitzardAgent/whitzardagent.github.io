/** Preserve counts as distinct source fields. A task denominator is not a trial count. */
export function observationCounts(o){
 return Object.fromEntries(['numerator','denominator','trials'].map(key=>[key,{value:Number.isFinite(o[key])?o[key]:null,unit:o[`${key}Unit`]??null}]));
}
/** Public fields copied from a reviewed extraction; unreported counts stay unknown. */
export function observationSample(o){
 const counts=observationCounts(o),parts=[];
 if(counts.numerator.value!==null&&counts.denominator.value!==null)parts.push(`${counts.numerator.value}/${counts.denominator.value}`);
 else if(counts.denominator.value!==null)parts.push(`Source denominator: ${counts.denominator.value}${counts.denominator.unit?` ${counts.denominator.unit}`:' (unit not disclosed)'}`);
 if(counts.trials.value!==null){
  const perCondition=o.rawFields?.goal_condition&&o.rawFields?.threat_condition;
  parts.push(`${counts.trials.value} ${counts.trials.unit??'trials'}${perCondition?' per condition':''}`);
 }
 if(!parts.length)return {en:'Sample size not disclosed',zh:'样本量未披露'};
 const zh=[];
 if(counts.numerator.value!==null&&counts.denominator.value!==null)zh.push(`${counts.numerator.value}/${counts.denominator.value}`);
 else if(counts.denominator.value!==null)zh.push(`来源分母：${counts.denominator.value}${counts.denominator.unit?` ${counts.denominator.unit}`:'（单位未披露）'}`);
 if(counts.trials.value!==null)zh.push(`${o.rawFields?.goal_condition&&o.rawFields?.threat_condition?'每种条件 ':''}${counts.trials.value} ${counts.trials.unit??'次试验'}`);
 return {en:parts.join('; '),zh:zh.join('；')};
}
const kinds=['confidence','range','standard-error','standard-deviation','credible','unspecified'];
/** Retain the printed source form. Never derive endpoints from a ± token or a figure. */
export function observationUncertainty(o){
 const raw=o.uncertainty??o.rawFields?.printed_ci??o.rawFields?.CI;
 if(raw===undefined||raw===null||raw==='')return null;
 const typed=typeof raw==='object'&&!Array.isArray(raw)?raw:{},printed=typeof raw==='string'?raw:'';
 const percentLevel=printed.match(/(\d+(?:\.\d+)?)\s*%/),level=typed.level??(percentLevel?Number(percentLevel[1]):null);
 const kind=typed.kind??(/\bCI\b|confidence|bootstrap/i.test(printed)||typed.reportedPlusMinus!==undefined&&typed.level!==undefined?'confidence':'unspecified');
 return {raw:structuredClone(raw),kind:kinds.includes(kind)?kind:'unspecified',level,levelUnit:typed.levelUnit??(level===null?null:percentLevel?'percent':level<=1?'fraction':'percent'),method:typed.method??(/bootstrap/i.test(printed)?'bootstrap':null),samples:typed.samples??null,reportedPlusMinus:typed.reportedPlusMinus??null,lower:typed.lower??null,upper:typed.upper??null,provenance:'source-reported'};
}
export function observationInterval(o){
 const u=observationUncertainty(o);if(!u)return null;
 if(typeof u.raw==='string')return u.raw;
 const level=u.level===null?'':`${u.levelUnit==='fraction'?u.level*100:u.level}% `;
 const bounds=u.lower!==null&&u.upper!==null?` [${u.lower}–${u.upper}]`:'';
 return `${level}${u.kind==='confidence'?'CI':u.kind}${u.method?` (${u.method})`:''}${u.reportedPlusMinus!==null?`; reported ±${u.reportedPlusMinus}`:''}${bounds}${u.samples!==null?`; ${u.samples} resamples`:''}`;
}
export function observationSemantics(o){
 return {counts:observationCounts(o),reportedDate:o.reportedDate??null,dateSemantics:o.dateSemantics??'unspecified',qualifier:o.qualifier??null,roles:structuredClone(o.roles??{}),rawFields:structuredClone(o.rawFields??{}),inheritedFields:structuredClone(o.inheritedFields??{})};
}
export function observationConditions(o){
 const f=o.rawFields;
 return f?.goal_condition&&f?.threat_condition?{goal:f.goal_condition,threat:f.threat_condition,reasoning:o.mode??null}:undefined;
}
