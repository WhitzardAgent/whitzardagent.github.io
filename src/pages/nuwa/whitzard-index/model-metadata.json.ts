import {modelMetadataRegistry} from '../../../lib/modelMetadata.mjs';
export const GET=()=>new Response(JSON.stringify(modelMetadataRegistry),{headers:{'Content-Type':'application/json; charset=utf-8'}});
