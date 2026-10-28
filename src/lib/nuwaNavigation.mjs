export const indexViews = ['framework', 'trend', 'research', 'benchmarks', 'methodology'];
export const researchFunctions = ['discovery', 'evaluation', 'governance'];
export const observationDimensions = ['propensity', 'capability', 'behavior'];

export function readIndexFilters(search) {
  const p = new URLSearchParams(search);
  const legacy = p.get('view');
  const legacyFunction=p.get('function'),functionAlias=legacyFunction==='monitoring'?'evaluation':legacyFunction==='investigation'?'governance':legacyFunction;
  const tag=p.get('tag')??(legacyFunction==='monitoring'?'risk-monitoring':legacyFunction==='investigation'?'incident-investigation':'');
  const aliases={overview:'trend',risks:'trend',models:'trend',library:'research',reports:'research',results:'benchmarks'};
  const view = aliases[legacy] ?? (indexViews.includes(legacy) ? legacy : !legacy&&p.has('series')?'methodology':'trend');
  return { ...(p.has('reviewScope')?{reviewScope:['bibliographic','source-note','local-review'].includes(p.get('reviewScope'))?p.get('reviewScope'):''}:{}), view, trendMode: legacy==='models'||p.get('trendMode')==='model'?'model':'topic', researchMode:legacy==='reports'||p.get('researchMode')==='reports'?'reports':'works', model:p.get('model')??'', resultSort:['coverage','name','updated'].includes(p.get('resultSort'))?p.get('resultSort')??'priority':'priority', scenario:p.get('scenario')==='multi-agent'?'multi-agent':'', area: p.get('area') ?? '', dimension: observationDimensions.includes(p.get('dimension')) ? p.get('dimension') : '', q: p.get('q') ?? '', benchmark: p.get('benchmark') ?? '', function: researchFunctions.includes(functionAlias) ? functionAlias : '', tag, organization: p.get('organization') ?? '', kind: p.get('kind') ?? '', year: p.get('year') ?? '', sort: ['relevance','updated'].includes(p.get('sort')) ? p.get('sort') ?? 'published' : 'published' };
}
export function readIndexLocation(search,hash=''){
 const p=new URLSearchParams(search),views={'#ni-overview':'overview','#ni-risks':'overview','#ni-models':'models','#ni-library':'library','#ni-reports':'reports','#ni-results':'results','#ni-methodology':'methodology'};
 if(p.get('view')==='framework'&&['#indicator-register','#source-series','#ni-methodology'].includes(hash))p.set('view','methodology');
 if(!p.has('view')&&views[hash])p.set('view',views[hash]);return readIndexFilters(p.toString());
}
export function writeIndexFilters(search, state) {
  const p = new URLSearchParams(search);
  for (const key of ['view','trendMode','researchMode','model','area','dimension','q','benchmark','function','organization','kind','year','sort','scenario','resultSort','tag','reviewScope']) {
    const value = state[key]?.trim();
    if (value && !(key === 'view' && value === 'trend' && !p.has('series')) && !(key === 'sort' && value === 'published') && !(key === 'trendMode' && value === 'topic') && !(key === 'researchMode' && value === 'works')) p.set(key,value); else p.delete(key);
  }
  return p.toString();
}
export {matchesIndexRecord} from './nuwaIndexFilters.mjs';
export function sortResearchRecords(records, sort = 'published', query = '') {
  const terms = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  const relevance = r => terms.reduce((n,t) => n + (r.title?.toLocaleLowerCase().includes(t) ? 5 : 0) + (r.search?.toLocaleLowerCase().includes(t) ? 1 : 0),0);
  return [...records].sort((a,b) => (sort === 'relevance' ? relevance(b)-relevance(a) : 0) || (sort === 'updated' ? (b.updatedOn ?? '').localeCompare(a.updatedOn ?? '') : 0) || (b.publicationDate ?? '').localeCompare(a.publicationDate ?? '') || a.id.localeCompare(b.id));
}

