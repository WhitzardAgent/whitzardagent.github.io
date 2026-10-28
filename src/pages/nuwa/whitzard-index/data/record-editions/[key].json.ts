const editions=Object.values(import.meta.glob<any>('../../../../../data/nuwa-index/record-editions/*.json',{eager:true,import:'default'}));
export function getStaticPaths(){return editions.flatMap(edition=>edition.records.map((record:any)=>({params:{key:`${edition.snapshotId}--${record.work.id}`},props:{record}})));}
export function GET({props}:{props:{record:any}}){return Response.json(props.record);}
