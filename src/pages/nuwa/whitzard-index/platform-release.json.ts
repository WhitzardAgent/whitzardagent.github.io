import {execFileSync} from 'node:child_process';
import {platformVersion,platformDate,publishedRuns,programs} from '../../../lib/nuwa-intelligence/platformData';
import {publicRelease} from '../../../data/nuwa-index';
export function GET(){return new Response(JSON.stringify({platformVersion,buildCommit:process.env.GITHUB_SHA??execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),publishedOn:platformDate,evidenceSnapshot:publicRelease.snapshotId,scope:'platform-release-no-new-experiments',programs:programs.map(({id,status,protocolId})=>({id,status,protocolId})),publishedRuns}),{headers:{'Content-Type':'application/json'}});}
