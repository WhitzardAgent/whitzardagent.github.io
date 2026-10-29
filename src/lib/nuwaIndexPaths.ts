import { catalogue, historicalCatalogue } from '../data/nuwa-index';
export function indexDetailPaths() {
  return [
    ...(catalogue.sourceUnits??[]).map(u=>({params:{kind:"source",id:u.id},props:{kind:"source" as const,id:u.id}})),
    ...(catalogue.models??[]).map(m=>({params:{kind:"model",id:m.id},props:{kind:"model" as const,id:m.id}})),
    ...(catalogue.assessments??[]).map(a=>({params:{kind:"assessment",id:a.id},props:{kind:"assessment" as const,id:a.id}})),
    ...[...catalogue.works,...historicalCatalogue.works.filter(w=>!catalogue.works.some(c=>c.id===w.id))].map(w => ({ params: {kind:'work',id:w.id}, props:{kind:'work' as const,id:w.id} })),
    ...['monitoring','investigation'].map(id=>({params:{kind:'function',id},props:{kind:'function' as const,id}})),
    ...catalogue.functions.map(f => ({ params: {kind:'function',id:f.id}, props:{kind:'function' as const,id:f.id} })),
    ...catalogue.organizations.map(o => ({ params: {kind:'organization',id:o.id}, props:{kind:'organization' as const,id:o.id} })),
    ...catalogue.areas.map(a => ({ params: { kind: 'risk', id: a.id }, props: { kind: 'risk' as const, id: a.id } })),
    ...catalogue.benchmarks.map(b => ({ params: { kind: 'benchmark', id: b.id }, props: { kind: 'benchmark' as const, id: b.id } })),
    ...[...historicalCatalogue.results,...catalogue.results.filter(r=>!historicalCatalogue.results.some(h=>h.id===r.id))].map(r => ({ params: { kind: 'result', id: r.id }, props: { kind: 'result' as const, id: r.id } })),
  ];
}
