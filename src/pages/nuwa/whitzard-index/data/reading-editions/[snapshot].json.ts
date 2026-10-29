import {publicReading} from '../../../../../data/nuwa-index';
const editions=Object.values(import.meta.glob<any>('../../../../../data/nuwa-index/reading/*.json',{eager:true,import:'default'}));
export function getStaticPaths(){return [...editions,...(editions.some(e=>e.snapshotId===publicReading.snapshotId)?[]:[publicReading])].map(edition=>({params:{snapshot:edition.snapshotId},props:{edition}}));}
export function GET({props}:{props:{edition:any}}){return Response.json(props.edition);}
