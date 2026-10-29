export function protocolProfileText(profile,key,locale='en'){
 const en=locale==='en',unknown=en?'Not established by the retained material':'现有材料尚未确定',copy=profile?.[locale];
 if(profile?.review?.state==='review-pending')return en?'Source changed; measurement interpretation requires review.':'来源有变化；测量解读需要重新复核。';
 if(copy&&Object.hasOwn(copy,key))return copy[key]??unknown;
 const value=profile?.[key];if(typeof value==='string')return value;if(value?.[locale])return value[locale];
 if(key==='statistics')return value?.sourceMethods?.[locale]??unknown;
 if(key==='conditions'){if(value?.reviewedProtocolDesign?.[locale])return value.reviewedProtocolDesign[locale];const notes=[...new Set((value?.variants??[]).map(v=>v.configuration?.[locale]).filter(Boolean))];return notes.length?`${en?'Retained configuration notes; not independently reverified in this reading:':'既有配置笔记；此次阅读未独立重新核实：'} ${notes.join(' · ')}`:unknown;}
 return unknown;
}
export function protocolComparison(catalogue,ids,locale='en',{profiles=[]}={}){
 ids=[...new Set(ids)];if(ids.length<2||ids.length>4)throw Error('Choose 2 to 4 protocols');
 const protocols=ids.map(id=>{const b=catalogue.benchmarks.find(b=>b.id===id);if(!b)throw Error(`Unknown protocol ${id}`);return b;});
 const en=locale==='en',unknown=en?'Not established by the retained material':'现有材料尚未确定';
 const keys=[['measurement',en?'Measurement target':'测量对象'],['task',en?'Tasks and population':'任务与样本'],['scoring',en?'Scoring and success':'判分与成功标准'],['conditions',en?'System and resource conditions':'系统与资源条件'],['statistics',en?'Statistical meaning':'统计含义'],['validity',en?'Validity and limitations':'效度与限制'],['usage',en?'Appropriate research use':'适用研究问题']];
 const rows=keys.map(([id,label])=>({id,label,cells:protocols.map(b=>{const p=profiles.find(p=>p.id===b.id),w=catalogue.works.find(w=>w.protocolIds.includes(b.id));if(p)return protocolProfileText(p,id,locale);if(id==='measurement')return b.measures[locale];if(id==='task')return b.assessmentSubject[locale];if(id==='scoring')return w?.note?.method?.[locale]??unknown;if(id==='validity')return b.limitations[locale];if(id==='conditions')return en?'Consult each result’s harness, tools, budget, task subset and attempts; undocumented conditions remain unknown.':'逐条查看 Harness、工具、预算、任务子集与尝试次数；未披露条件保持未知。';if(id==='usage')return b.classificationNote[locale];return unknown;})}));
 rows.unshift({id:'readingScope',label:en?'Reading and editorial scope':'阅读与编辑范围',cells:protocols.map(b=>{const p=profiles.find(p=>p.id===b.id);return p?.review?.state==='review-pending'?(en?'Source changed · review pending':'来源变化 · 待复核'):p?(en?'Published model-assisted note · independent review pending':'已公开的模型辅助解读 · 独立复核待完成'):(en?'Retained catalogue notes · editorial approval not recorded':'既有目录笔记 · 未记录编辑批准');})});
 return {protocols:protocols.map(b=>({id:b.id,name:b.name,version:b.version,sourceId:b.sourceId})),rows,rankAllowed:false,scope:en?'Measurement profiles; heterogeneous scores are not ranked or pooled.':'此处比较测量设计；不同协议的成绩不排序、不合并。'};
}
