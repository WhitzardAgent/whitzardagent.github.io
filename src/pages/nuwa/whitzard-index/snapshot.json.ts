import {catalogue,historicalCatalogue,currentEdition} from '../../../data/nuwa-index';
export function GET() { return new Response(JSON.stringify(currentEdition?catalogue:historicalCatalogue, null, 2), { headers: { 'Content-Type': 'application/json; charset=utf-8' } }); }
