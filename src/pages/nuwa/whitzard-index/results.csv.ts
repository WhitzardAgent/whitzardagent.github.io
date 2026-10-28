import { catalogue } from '../../../data/nuwa-index';
import { csvResults } from '../../../lib/nuwaIndex.mjs';
export function GET() { return new Response(csvResults(catalogue.results), { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="nuwa-index-${catalogue.snapshotId}.csv"` } }); }
