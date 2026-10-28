/** Conceptual pathways are navigation, never additional empirical edges. */
const dualUseIds = ['cybersecurity', 'cbrn', 'disinformation', 'autonomous-physical-harm'];
const mechanisms = [
  {id:'autonomy', label:{en:'Autonomy',zh:'自主性'}, pathway:{en:'Persistence · proliferation',zh:'持续行动 · 扩散'}, workIds:['replibench','palisade-robot-shutdown']},
  {id:'deception', label:{en:'Deception',zh:'欺骗'}, pathway:{en:'Concealment · oversight evasion',zh:'隐瞒 · 监督规避'}, workIds:['in-context-scheming','stealth-evals']},
];
const capabilities = [
  {id:'coding',label:{en:'Coding',zh:'编程'},workIds:['swe-bench-pro']},
  {id:'science',label:{en:'Science',zh:'科学研究'},workIds:['paperbench']},
  {id:'content',label:{en:'Content',zh:'内容生成'},workIds:['ape']},
  {id:'robotics',label:{en:'Robotics',zh:'机器人'},workIds:['palisade-robot-shutdown']},
];
export function frameworkRelationships(catalogue) {
  const works = ids => ids.map(id => {
    const work=catalogue.works.find(w=>w.id===id);
    if(!work || !catalogue.sources.some(s=>s.id===work.sourceId)) throw new Error(`Missing framework source: ${id}`);
    return work;
  });
  return {
    domains:dualUseIds.map(id=>catalogue.areas.find(a=>a.id===id)),
    mechanisms:mechanisms.map(m=>({...m,domainIds:[...dualUseIds],relation:'conceptual',works:works(m.workIds)})),
    capabilities:capabilities.map(c=>({...c,relation:'enabling',works:works(c.workIds)})),
  };
}
/** Uses the existing research search contract and guarantees a matching work. */
export function frameworkResearchQuery(work) {
  return new URLSearchParams({view:'research',q:work.title}).toString();
}
