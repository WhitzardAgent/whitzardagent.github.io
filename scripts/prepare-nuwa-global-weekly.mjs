import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {canonicalDocumentId} from '../src/lib/nuwa-intelligence/sourceVersions.mjs';
import {prepareWeeklyUpdate} from '../src/lib/nuwa-intelligence/weeklyUpdates.mjs';
import {assertPrivateRoot,assertPrivateOutput} from '../src/lib/nuwa-intelligence/privateStore.mjs';

export function prepareGlobalWeekly({edition,state={},scanSucceeded,now}){
 const candidates=edition.publications.map(p=>({
  publicationId:p.identity??canonicalDocumentId(p.url),url:p.url,
  version:p.fullSource?.version??p.sourceVersion??null,
  sourceHashes:[...new Set([p.sourceHash,p.fullSource?.sha256].filter(Boolean))].sort(),
  content:{title:p.title,kind:p.kind,authors:p.authors??[],organization:p.organization??null,
   en:p.en,zh:p.zh,scope:p.scope,observations:p.observations??[]}
 }));
 for(const p of candidates)if(!p.content.en||!p.content.zh)throw Error(`Missing bilingual content: ${p.publicationId}`);
 return prepareWeeklyUpdate({state,candidates,scanSucceeded,now,baseSnapshotId:edition.baseSnapshotId});
}

function main(args){
 const options={};
 for(let i=0;i<args.length;i++){
  const key=args[i];
  if(key==='--scan-succeeded'){options.scanSucceeded=true;continue;}
  if(!['--root','--candidate','--state','--now'].includes(key)||!args[i+1]||args[i+1].startsWith('--'))throw Error(`Unknown or incomplete argument: ${key}`);
  options[key.slice(2)]=args[++i];
 }
 // This flag attests a completed substantive research scan, not HTTP availability.
 if(options.scanSucceeded!==true)throw Error('Require --scan-succeeded after a successful substantive source search; HTTP availability alone is insufficient.');
 const root=assertPrivateRoot(options.root);
 const candidateFile=assertPrivateOutput(options.candidate??path.join(root,'complete/candidate.json'),root);
 const inputState=path.resolve(options.state??path.join(root,'../weekly/state.json'));
 const stateOut=assertPrivateOutput(path.join(root,'weekly-review/state.json'),root);
 const reviewOut=assertPrivateOutput(path.join(root,'weekly-review/review.json'),root);
 if(fs.existsSync(inputState)&&fs.realpathSync(inputState)===path.resolve(stateOut))throw Error('Input state must remain read-only; use the existing weekly state as --state.');
 const stateFile=fs.existsSync(stateOut)?stateOut:inputState;
 const state=fs.existsSync(stateFile)?JSON.parse(fs.readFileSync(stateFile,'utf8')):{};
 const edition=JSON.parse(fs.readFileSync(candidateFile,'utf8'));
 const result=prepareGlobalWeekly({edition,state,scanSucceeded:true,now:options.now});
 function write(file,value){fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file+'.tmp',JSON.stringify(value,null,2)+'\n');fs.renameSync(file+'.tmp',file);}
 write(reviewOut,{candidateId:edition.candidateId,window:result.window,batch:result.batch,shouldNotify:result.shouldNotify,publication:'not-performed'});
 write(stateOut,result.state);
 console.log(JSON.stringify({candidateId:edition.candidateId,reviewOut,stateOut,reviewPrepared:Boolean(result.batch),shouldNotify:result.shouldNotify,publication:'not-performed'}));
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))main(process.argv.slice(2));
