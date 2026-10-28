import { historicalCatalogue as catalogue } from '../../../data/nuwa-index';
export function GET() { return new Response(JSON.stringify(catalogue, null, 2), { headers: { 'Content-Type': 'application/json; charset=utf-8' } }); }
