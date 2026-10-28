import fs from 'node:fs';import path from 'node:path';
import {assertPrivateRoot} from './privateStore.mjs';
import {loadResearchSyntheses} from './researchReading.mjs';
import {analysisState} from './monitoring.mjs';
export function loadMonitoringDrafts(catalogue,environment=process.env,read=file=>fs.readFileSync(file,'utf8')){
 if(environment.NUWA_LOCAL_REVIEW!=='1')return loadResearchSyntheses(catalogue,environment).filter(a=>a.groupId&&a.status==='published-note');
 const root=assertPrivateRoot(environment.NUWA_DOSSIER_ROOT??environment.NUWA_PRIVATE_ROOT),data=JSON.parse(read(path.join(root,'analysis-drafts.json')));
 if(data.snapshotId!==catalogue.snapshotId)throw Error('Local editorial draft snapshot does not match catalogue');
 return (data.analyses??[]).filter(a=>{const g=catalogue.monitoring?.groups?.find(g=>g.id===a.groupId);return g&&analysisState(catalogue,g,a)==='local-review';});
}
