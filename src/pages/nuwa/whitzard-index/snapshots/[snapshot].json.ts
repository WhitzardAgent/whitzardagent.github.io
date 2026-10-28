import type { APIRoute } from 'astro';
import { snapshots } from '../../../../data/nuwa-index';
export const getStaticPaths = () => snapshots.map(snapshot => ({ params: { snapshot: snapshot.snapshotId }, props: { snapshot } }));
export const GET: APIRoute = ({ props }) => new Response(JSON.stringify(props.snapshot, null, 2), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
