import fs from 'node:fs';import path from 'node:path';
import {assertPrivateRoot,assertPrivateOutput} from '../src/lib/nuwa-intelligence/privateStore.mjs';
import {prepareWeeklyUpdate,recordWeeklyDelivery}from'../src/lib/nuwa-intelligence/weeklyUpdates.mjs';
const arg=name=>process.argv[process.argv.indexOf(name)+1];
if(!process.argv.includes('--root')||!process.argv.includes('--state'))throw Error('Usage: --root <external private root> --state <state.json> [--input <normalized scan.json> --out <review.json> | --delivered <content hash>]');
const root=assertPrivateRoot(arg('--root')),stateFile=assertPrivateOutput(arg('--state'),root),state=fs.existsSync(stateFile)?JSON.parse(fs.readFileSync(stateFile,'utf8')):{};
function write(file,value){fs.mkdirSync(path.dirname(file),{recursive:true});const tmp=file+'.tmp';fs.writeFileSync(tmp,JSON.stringify(value,null,2)+'\n');fs.renameSync(tmp,file);}
if(process.argv.includes('--delivered')){write(stateFile,recordWeeklyDelivery(state,arg('--delivered')));console.log('Recorded delivery of the exact prepared review. No publication performed.');}
else{
 if(!process.argv.includes('--input')||!process.argv.includes('--out'))throw Error('Input and output are required');
 const input=JSON.parse(fs.readFileSync(assertPrivateOutput(arg('--input'),root),'utf8')),out=assertPrivateOutput(arg('--out'),root),result=prepareWeeklyUpdate({...input,state});
 write(out,{window:result.window,batch:result.batch,shouldNotify:result.shouldNotify});write(stateFile,result.state);
 console.log(JSON.stringify({reviewPrepared:Boolean(result.batch),changedReview:result.shouldNotify,contentHash:result.batch?.contentHash??null,lastSuccessfulScanAt:result.state.lastSuccessfulScanAt,publication:'not-performed'}));
}
