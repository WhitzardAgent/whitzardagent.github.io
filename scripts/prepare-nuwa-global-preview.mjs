import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
import {compileCandidate} from '../src/lib/nuwa-intelligence/researchCandidate.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const out=process.argv[2];if(!out||path.resolve(out).startsWith(root+path.sep))throw Error('Use an external private output directory');
const c=JSON.parse(fs.readFileSync(path.join(root,'src/data/nuwa-index/catalogue.json'))),reading=JSON.parse(fs.readFileSync(path.join(root,`src/data/nuwa-index/reading/${c.snapshotId}.json`)));
const packages=process.argv[3]?JSON.parse(fs.readFileSync(process.argv[3])):[];
const candidate=compileCandidate(c,reading,{baseSnapshotId:c.snapshotId,packages});fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'candidate.json'),JSON.stringify(candidate,null,2));console.log(JSON.stringify({candidateId:candidate.candidateId,works:candidate.works.length,protocols:candidate.protocols.length,chunks:candidate.documents.length,packages:packages.length}));
