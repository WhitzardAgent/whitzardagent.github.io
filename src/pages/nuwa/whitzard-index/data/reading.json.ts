import {catalogue} from '../../../../data/nuwa-index';
import {readingManifest,loadResearchDossiers} from '../../../../lib/nuwa-intelligence/researchReading.mjs';
export function GET(){return Response.json(readingManifest(catalogue,{dossiers:loadResearchDossiers(catalogue)}));}
