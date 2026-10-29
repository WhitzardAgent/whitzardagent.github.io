import {execFileSync} from 'node:child_process';
execFileSync(process.execPath,['scripts/check-nuwa-publication.mjs',...process.argv.slice(2)],{stdio:'inherit'});
execFileSync(process.execPath,['scripts/check-nuwa-global-publication.mjs'],{stdio:'inherit'});
