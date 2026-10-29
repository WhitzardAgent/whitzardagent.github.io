import fs from 'node:fs';
import path from 'node:path';
import {assembleCurrentEdition,loadGlobalPackages,loadChannelScans} from '../src/lib/nuwa-intelligence/currentEdition.mjs';
import {assertPrivateRoot} from '../src/lib/nuwa-intelligence/privateStore.mjs';
const root=assertPrivateRoot(process.argv[2]);
const base=JSON.parse(fs.readFileSync('src/data/nuwa-index/catalogue.json','utf8'));
const reading=JSON.parse(fs.readFileSync(`src/data/nuwa-index/reading/${base.snapshotId}.json`,'utf8'));
const packages=loadGlobalPackages(root);
const imageRoot='public/images/nuwa-index/candidate';
for(const p of packages)for(const f of p.originalFigures??[]){fs.mkdirSync(imageRoot,{recursive:true});fs.copyFileSync(f.path,path.join(imageRoot,f.sha256+'.png'));}
const edition=assembleCurrentEdition(base,reading,packages,loadChannelScans(root));
fs.mkdirSync(path.join(root,'complete'),{recursive:true});fs.writeFileSync(path.join(root,'complete/candidate.json'),JSON.stringify(edition,null,2));
fs.writeFileSync(path.join(root,'complete/changes.json'),JSON.stringify({candidateId:edition.candidateId,changes:edition.changes,scopeDispositions:edition.scopeDispositions},null,2));
console.log(JSON.stringify({candidateId:edition.candidateId,works:edition.catalogue.works.length,protocols:edition.catalogue.benchmarks.length,documents:edition.documents.length,opinions:edition.opinions.length}));
