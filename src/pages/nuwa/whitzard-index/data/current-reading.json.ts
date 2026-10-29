import {currentEdition,publicReading,catalogue} from '../../../../data/nuwa-index';
export function GET(){return Response.json({version:currentEdition?.candidateId??catalogue.snapshotId,publication:currentEdition?.publication?.state??'published',reading:currentEdition?.reading??publicReading});}
