/** Editorial presentation metadata. It never changes an observation or comparison permission. */
const T=(en,zh)=>({en,zh});
const definitions=[
 ['time-horizons',['metr-p50'],'metr-p50','50% task-completion horizon','50% 任务完成跨度','timeline'],
 ['time-horizons',['metr-p80'],'metr-p80','80% task-completion horizon','80% 任务完成跨度','timeline'],
 ['cybergym',['saferai-glm52-cybergym-pass-1','cybergym-official-score-10'],'reproduction','Vulnerability reproduction rate','漏洞复现率','timeline'],
 ['cybench',['cybench-m0','neo-kimi-k3-pass-1','neo-deepseek-v4-pass-1','saferai-glm52-cybench-pass-1'],'unguided','Unguided task success','无子任务引导的任务成功率','timeline'],
 ['cybench',['saferai-glm52-cybench-category-pass-1'],'category-pass1','Category pass@1','分类任务 Pass@1','bars'],
 ['cybench',['cybench-m1'],'subtask-guided','Subtask-guided performance','子任务引导下的表现','bars','subtask guided performance'],
 ['cybench',['cybench-m2'],'subtask','Subtask performance','子任务表现','bars','subtask performance'],
 ['exploitgym',['exploitgym-official-on-target'],'on-target','Intended-target successes','指定目标成功数','bars','intended target successes'],
 ['exploitgym',['exploitgym-official-flag-captured'],'flag-captured','Flag captures','Flag 捕获数','bars','flag captures'],
 ['secbench-pro',['secbench-pro-official-headline'],'headline','Headline success rate','Headline 成功率','bars','headline success rate'],
 ['secbench-pro',['secbench-pro-official-completed'],'completed','Completed-mode success rate','Completed 模式成功率','bars','completed mode success rate'],
 ['agentic-misalignment',['saferai-glm52-agentic-misalignment-harmful-action-rate'],'harmful-action-conditions','Harmful actions by experimental condition','实验条件下的有害行动','bars'],
];
export function metricDefinition(benchmarkId,metricId,record={}){
 if(benchmarkId==='agentcyberrange'){
  if(metricId==='web-level0-pass3'||metricId==='agentcyberrange-official-pass3'&&/^web/i.test(record.taskSet??''))return {family:'web-pass3',label:T('Web exploitation · Pass@3','Web 漏洞利用 · Pass@3'),defaultDisplay:'timeline',order:'desc'};
  if(metricId==='post-level0-pass3'||metricId==='agentcyberrange-official-pass3'&&/^post/i.test(record.taskSet??''))return {family:'post-pass3',label:T('Post exploitation · Pass@3','后渗透 · Pass@3'),defaultDisplay:'timeline',order:'desc'};
 }
 const d=definitions.find(d=>d[0]===benchmarkId&&d[1].includes(metricId));return d?{family:d[2],label:T(d[3],d[4]),defaultDisplay:d[5],legacyKey:d[6],order:'desc'}:null;
}
export const topicEditorial={
 autonomy:{lead:T('Long-horizon capability and the conditions for human control.','长程任务能力及维持人类控制所需的条件。'),indicators:['metr-p50','metr-p80','neo-kimi-k3-shutdown-bypass-rate'],view:'timeline',measurement:T('Human-expert task duration at 50% success · minutes, logarithmic scale','50% 成功概率对应的人类专家任务用时 · 分钟，对数刻度'),scope:T('METR’s software-task evaluations measure task difficulty. Shutdown and replication experiments test separate control questions.','METR 软件任务评测衡量任务难度；关闭与复制实验回答不同的控制问题。'),works:['time-horizons','replibench','palisade-shutdown'],benchmark:'time-horizons'},
 deception:{lead:T('Deceptive actions under goals, incentives and oversight.','目标、激励与监督条件下的欺骗行为。'),indicators:['saferai-glm52-agentic-misalignment-harmful-action-rate','neo-glm52-deceptionbench-m0','neo-glm52-deceptionbench-m1'],view:'bars',measurement:T('Harmful-action rate · model × goal × threat · 30 rollouts per condition','有害行动发生率 · 模型 × 目标 × 威胁 · 每种条件 30 次试验'),scope:T('SaferAI’s controlled scenarios retain all goal and threat conditions, including observed zeros and reported intervals.','SaferAI 受控情境保留全部目标与威胁条件，包括原文零值和报告区间。'),works:['agentic-misalignment','in-context-scheming','alignment-faking'],benchmark:'agentic-misalignment'},
 cybersecurity:{lead:T('Cyber task performance across models, budgets and evaluation protocols.','不同模型、预算与评测协议下的网络安全任务表现。'),indicators:['saferai-glm52-cybergym-pass-1','cybench-m0','web-level0-pass3','secbench-pro-official-headline','exploitgym-official-on-target'],view:'timeline',measurement:T('Vulnerability reproduction · source-reported rates, with task subsets separated','漏洞复现 · 原文报告发生率，任务子集分别展示'),scope:T('CyberGym measures vulnerability reproduction; Cybench, AgentCyberRange and ExploitGym test different task settings.','CyberGym 衡量漏洞复现；Cybench、AgentCyberRange 和 ExploitGym 采用不同任务设置。'),works:['cybergym','cybench','agentcyberrange'],benchmark:'cybergym'},
 cbrn:{lead:T('Scientific capabilities, misuse pathways and the reach of safeguards.','科研能力、滥用路径及防护措施的适用范围。'),indicators:[],view:'bars',measurement:T('Research coverage','研究覆盖'),scope:T('LAB-Bench measures research skills. End-to-end misuse and safeguard effectiveness require different evidence.','LAB-Bench 衡量科研技能；端到端滥用与防护效果需要其他证据。'),works:['lab-bench','biomysterybench','wmdp'],benchmark:'lab-bench'},
 disinformation:{lead:T('Persuasive generation, willingness and observed influence.','说服性生成、参与意愿及实际影响。'),indicators:['neo-kimi-k3-turn-1-persuasion-attempt-rate','saferai-glm52-ape-turn-1-persuasion-attempt-rate','neo-glm52-ape-persuasion-attempt-rate'],view:'bars',measurement:T('Persuasion attempts · source-specific conversational protocols','说服尝试 · 各来源的对话协议'),scope:T('An attempt to persuade is a generated behavior. Human belief change is a separate outcome.','说服尝试属于生成行为；人的信念变化属于另一类结果。'),works:['ape','conspiracy-persuasion','persusafety'],benchmark:'ape'},
 'autonomous-physical-harm':{lead:T('Actions, intervention and control in embodied systems.','具身系统中的行动、干预与控制。'),indicators:['observed-shutdown-resistance'],view:'bars',measurement:T('Observed responses to shutdown intervention','关闭干预下的可观察响应'),scope:T('Physical robot demonstrations and simulated trials are kept distinct. The present evidence is specific to the tested systems.','实体机器人演示与仿真试验分别整理，现有证据针对受测系统。'),works:['palisade-robot-shutdown','asimov'],benchmark:'palisade-robot-shutdown'},
};
export function selectTopicPresentation(data,area,groups){
 const config=topicEditorial[area];if(!config)throw Error(`Unknown NUWA topic: ${area}`);
 const selected=config.indicators.flatMap(id=>{const group=groups.find(g=>g.bindings.some(b=>b.metricId===id));return group?[group]:[];}).filter((g,i,list)=>list.findIndex(x=>x.id===g.id)===i);
 return {...config,groups:[...selected,...groups.filter(g=>!selected.some(s=>s.id===g.id))],indicatorIds:selected.map(g=>g.id),defaultDisplay:config.view,works:config.works.map(id=>data.works.find(w=>w.id===id)).filter(Boolean)};
}
export function researchCoverage(data){return data.areas.map(area=>({area:area.id,label:area.label,cells:data.functions.map(f=>{const works=data.works.filter(w=>w.primaryFunction===f.id&&w.areas.includes(area.id));return {functionId:f.id,label:f.label,count:works.length,workIds:works.map(w=>w.id)};})}));}

/** Numeric display order is independent of experimental comparability. */
export function primaryMetricOrder(group,rows=[]){
 const order=group?.metricPresentation?.order??(rows[0]?metricDefinition(group?.benchmarkId,rows[0].metricId,rows[0])?.order:null);
 return order==='asc'?'asc':'desc';
}
