import {currentEdition,publicReading,catalogue} from '../../../../data/nuwa-index';
export function GET(){return Response.json({version:currentEdition?.candidateId??catalogue.snapshotId,publication:currentEdition?'local-review':'published',reading:currentEdition?.reading??publicReading});}
