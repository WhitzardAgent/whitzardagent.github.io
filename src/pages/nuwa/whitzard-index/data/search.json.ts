import {catalogue,researchSupplement} from '../../../../data/nuwa-index';
import {researchSearchDocuments} from '../../../../lib/nuwa-intelligence/researchLibrary';
export async function GET(){return Response.json({schemaVersion:'nuwa-search-1',snapshotId:catalogue.snapshotId,reviewKey:researchSupplement?.reviewFingerprint??'',documents:await researchSearchDocuments()});}
