import {validateMonitoringBindings} from './nuwa-intelligence/monitoringIntegrity.mjs';
import {validateMonitoring} from './nuwa-intelligence/monitoring.mjs';
import {validateIntelligence} from './nuwa-intelligence/publication.mjs';
import {validateModelEvidence} from './modelEvidence.mjs';
import {researchFunctions,observationDimensions} from './nuwaNavigation.mjs';
export * from './nuwaNavigation.mjs';
const legacyResearchFunctions = ['discovery','evaluation','monitoring','investigation','governance'];

export function comparisonKey(record, metric) {
  const c = record.configuration;
  if (!record.comparisonGroup || ![record.benchmarkId, record.benchmarkVersion, record.taskSet, record.protocol, c?.modelVersion, c?.harness, c?.tools, c?.budget, metric.id, metric.unit].every(v => typeof v === 'string' && v.trim()) || !Number.isFinite(metric.value) || metric.qualifier && metric.qualifier !== 'exact') return null;
  return [record.benchmarkId, record.benchmarkVersion, record.taskSet, record.protocol, record.comparisonGroup, metric.id, metric.unit].join('|');
}

export function validateCatalogue(data) {
  const errors = [];
  const bilingual = (v, at) => { if (!v || !['en', 'zh'].every(k => typeof v[k] === 'string' && v[k].trim())) errors.push(`${at}: missing bilingual text`); };
  const required = (o, fields, at) => { for (const key of fields) if (typeof o[key] !== 'string' || !o[key].trim()) errors.push(`${at}: missing ${key}`); };
  const date = (v, at) => { if (v !== null && (typeof v !== 'string' || !/^\d{4}-\d{2}(?:-\d{2})?$/.test(v) || Number.isNaN(Date.parse(v)))) errors.push(`${at}: invalid date`); };
  const maps = {};
  if (!['2.0','3.0','3.1','4.0','5.0','5.1','5.2'].includes(data.schemaVersion)) errors.push('Unknown schemaVersion');
  required(data, ['snapshotId', 'verifiedOn'], 'snapshot');
  date(data.verifiedOn, 'snapshot');
  for (const collection of ['sources', 'families', 'areas', 'questions', 'benchmarks', 'results', 'concepts']) {
    maps[collection] = new Map();
    if (!Array.isArray(data[collection])) { errors.push(`${collection}: missing collection`); continue; }
    for (const item of data[collection]) {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.id) || maps[collection].has(item.id)) errors.push(`${collection}: duplicate or invalid ID ${item.id}`);
      maps[collection].set(item.id, item);
      if (item.draft || item.private || item.status === 'pending') errors.push(`${item.id}: draft/private/pending data in public catalogue`);
    }
  }
  const ref = (collection, id, at) => { if (!maps[collection]?.has(id)) errors.push(`${at}: unknown ${collection} reference ${id}`); };
  for (const s of data.sources ?? []) {
    required(s, ['title', 'version', 'url', 'verifiedOn', 'type'], s.id);
    try { if (new URL(s.url).protocol !== 'https:') throw new Error(); } catch { errors.push(`${s.id}: invalid HTTPS source`); }
    date(s.publicationDate, s.id); date(s.verifiedOn, s.id);
  }
  if (JSON.stringify((data.families ?? []).map(f => f.id)) !== JSON.stringify(['agentic-risk', 'dual-use-risk'])) errors.push('NUWA must have the two approved risk families in order');
  for (const f of data.families ?? []) { bilingual(f.label, f.id); bilingual(f.description, f.id); }
  const approvedAreas = { 'agentic-risk': ['autonomy', 'deception'], 'dual-use-risk': ['cybersecurity', 'cbrn', 'disinformation', 'autonomous-physical-harm'] };
  for (const [family, ids] of Object.entries(approvedAreas)) if (JSON.stringify((data.areas ?? []).filter(a => a.family === family).map(a => a.id)) !== JSON.stringify(ids)) errors.push(`${family}: risk entries differ from approved hierarchy`);
  for (const a of data.areas ?? []) {
    for (const key of ['label', 'definition', 'scope', 'threatModel', 'gap']) bilingual(a[key], `${a.id}.${key}`);
    ref('families', a.family, a.id);
  }
  for (const q of data.questions ?? []) {
    ref('areas', q.area, q.id);
    for (const key of ['label', 'definition', 'include', 'exclude']) bilingual(q[key], `${q.id}.${key}`);
    if (!q.sourceIds?.length) errors.push(`${q.id}: no research citation`);
    for (const sourceId of q.sourceIds ?? []) ref('sources', sourceId, q.id);
  }
  for (const b of data.benchmarks ?? []) {
    required(b, ['name', 'version'], b.id); ref('sources', b.sourceId, b.id);
    if (!['benchmark', 'study', 'report'].includes(b.kind)) errors.push(`${b.id}: invalid evaluation kind`);
    if (!observationDimensions.includes(b.primaryDimension)) errors.push(`${b.id}: invalid primary observation dimension`);
    for (const key of ['summary', 'measures', 'limitations', 'assessmentSubject', 'classificationNote']) bilingual(b[key], `${b.id}.${key}`);
    if (!Array.isArray(b.links)) errors.push(`${b.id}: missing evidence links`);
    for (const link of b.links ?? []) {
      ref('questions', link.questionId, b.id);
      if (!observationDimensions.includes(link.dimension)) errors.push(`${b.id}: invalid link dimension`);
      if (!['direct', 'enabling', 'context'].includes(link.relation)) errors.push(`${b.id}: invalid link relation`);
      required(link, ['locator'], `${b.id}.link`);
      bilingual(link.subject, `${b.id}.link.subject`); bilingual(link.rationale, `${b.id}.link.rationale`);
    }
  }
  for (const r of data.results ?? []) {
    required(r, ['system', 'sourceVersion', 'locator', 'benchmarkVersion', 'taskSet', 'protocol'], r.id);
    ref('sources', r.sourceId, r.id); ref('benchmarks', r.benchmarkId, r.id);
    if (!['model', 'system', 'deployment'].includes(r.subjectType)) errors.push(`${r.id}: institution grades cannot enter model results`);
    if (!['benchmark-result', 'controlled-experiment', 'deployment-observation', 'incident-report'].includes(r.evidenceType)) errors.push(`${r.id}: unsupported evidence type`);
    for (const key of ['publicationDate', 'evaluationDate', 'verifiedOn']) date(r[key], `${r.id}.${key}`);
    if (r.sourceVersion !== maps.sources?.get(r.sourceId)?.version) errors.push(`${r.id}: source version mismatch`);
    try { if (new URL(r.sourceUrl).protocol !== 'https:') throw new Error(); } catch { errors.push(`${r.id}: invalid HTTPS result source`); }
    if (r.benchmarkVersion !== maps.benchmarks?.get(r.benchmarkId)?.version) errors.push(`${r.id}: protocol version mismatch`);
    for (const key of ['sampleSize', 'sourceFinding', 'limitations']) bilingual(r[key], `${r.id}.${key}`);
    if (r.interpretation !== null) bilingual(r.interpretation, `${r.id}.interpretation`);
    if (!r.configuration || !['modelVersion', 'harness', 'tools', 'budget'].every(k => r.configuration[k] === null || typeof r.configuration[k] === 'string' && r.configuration[k].trim())) errors.push(`${r.id}: configuration fields must be explicit text or null`);
    if(r.experimentalConditions&&!['goal','threat'].every(k=>typeof r.experimentalConditions[k]==='string'&&r.experimentalConditions[k].trim()))errors.push(`${r.id}: incomplete experimental conditions`);
    if (!r.metrics?.length) errors.push(`${r.id}: no metric`);
    const metrics = new Set();
    for (const m of r.metrics ?? []) {
      required(m, ['id', 'unit'], `${r.id}.metric`);
      if (metrics.has(m.id)) errors.push(`${r.id}: duplicate metric ${m.id}`); metrics.add(m.id);
      if (!Number.isFinite(m.value)) errors.push(`${r.id}: metric must be finite`);
      if (m.unit === '%' && (m.value < 0 || m.value > 100)) errors.push(`${r.id}: percentage must be 0–100`);
      if (!['exact', 'greater-than', 'less-than', 'approximate'].includes(m.qualifier)) errors.push(`${r.id}: invalid qualifier`);
      bilingual(m.label, r.id); bilingual(m.meaning, r.id);
      if (!observationDimensions.includes(m.dimension)) errors.push(`${r.id}.${m.id}: invalid metric dimension`);
      bilingual(m.dimensionRationale, `${r.id}.${m.id}.dimensionRationale`);
      if (r.comparisonGroup && comparisonKey(r, m) === null) errors.push(`${r.id}: incomplete comparable protocol`);
    }
  }
  for (const c of data.concepts ?? []) { for (const key of ['label', 'definition', 'include', 'exclude']) bilingual(c[key], c.id); ref('sources', c.sourceId, c.id); }
  if (['3.0','3.1','4.0','5.0','5.1','5.2'].includes(data.schemaVersion)) {
    for (const name of ['works','organizations','relations','functions']) if (!Array.isArray(data[name])) errors.push(`${name}: missing collection`);
    const works = new Map((data.works ?? []).map(w => [w.id,w]));
    const orgs = new Map((data.organizations ?? []).map(o => [o.id,o]));
    if (works.size !== data.works?.length) errors.push('Duplicate work ID');
    if (orgs.size !== data.organizations?.length) errors.push('Duplicate organization ID');
    const https = (url,at) => { try { if(new URL(url).protocol !== 'https:') throw Error(); } catch { errors.push(`${at}: invalid HTTPS URL`); } };
    const allowedFunctions=data.researchFunctionVersion==='2.0'?researchFunctions:legacyResearchFunctions;
    if (JSON.stringify(data.functions?.map(f => f.id)) !== JSON.stringify(allowedFunctions)) errors.push('Research functions differ from their declared taxonomy version');
    for (const o of data.organizations ?? []) { bilingual(o.name,o.id); if(o.homepage) https(o.homepage,o.id); }
    for (const w of data.works ?? []) {
      required(w,['id','title','sourceId','attributionSourceId','originalUrl','updatedOn'],w.id);
      if (w.draft || w.private || w.status === 'pending') errors.push(`${w.id}: draft/private/pending work`);
      if (!allowedFunctions.includes(w.primaryFunction)) errors.push(`${w.id}: invalid research function`);
      if ('primaryDimension' in w) errors.push(`${w.id}: observation dimension belongs to protocols, not works`);
      if (!['benchmark','study','method','dataset','incident-report','technical-report'].includes(w.kind)) errors.push(`${w.id}: invalid work kind`);
      ref('sources',w.sourceId,w.id); ref('sources',w.attributionSourceId,w.id); https(w.originalUrl,w.id);
      if (w.originalUrl.includes('inspect_evals')) errors.push(`${w.id}: original source cannot be an implementation register`);
      date(w.publicationDate,w.id); date(w.updatedOn,w.id);
      for (const key of ['summary','scopeNote']) bilingual(w[key],`${w.id}.${key}`);
      for (const key of ['question','method','finding','supports','limits','connections']) if(!['4.0','5.0','5.1','5.2'].includes(data.schemaVersion)||w.note?.[key]!==null)bilingual(w.note?.[key],`${w.id}.note.${key}`);
      for(const tag of w.tags??[])if(!data.researchTags?.some(t=>t.id===tag))errors.push(`${w.id}: unknown research tag ${tag}`);
      for (const id of w.areas ?? []) ref('areas',id,w.id);
      for (const id of w.protocolIds ?? []) ref('benchmarks',id,w.id);
      for (const c of w.contributions ?? []) { if(!orgs.has(c.organizationId)) errors.push(`${w.id}: unknown organization ${c.organizationId}`); ref('sources',c.sourceId,w.id); required(c,['locator'],w.id); if(!['research','evaluation','publisher','implementation'].includes(c.role)) errors.push(`${w.id}: invalid contribution role`); }
      for (const f of w.secondaryFunctions ?? []) { if(!allowedFunctions.includes(f.function) || f.function === w.primaryFunction) errors.push(`${w.id}: invalid secondary function`); bilingual(f.rationale,w.id); }
    }
    for(const r of data.results ?? []) {
      if(r.researchWorkId && (!works.has(r.researchWorkId) || !works.get(r.researchWorkId).protocolIds.includes(r.benchmarkId))) errors.push(`${r.id}: result work must reference the evaluated protocol`);
      for(const id of r.evaluatorOrganizationIds ?? []) if(!orgs.has(id)) errors.push(`${r.id}: unknown evaluator organization ${id}`);
    }
    for (const r of data.relations ?? []) { if(!works.has(r.from) || !works.has(r.to) || r.from === r.to) errors.push('Invalid research relation'); ref('sources',r.sourceId,'relation'); required(r,['locator'],'relation'); bilingual(r.rationale,'relation'); if(!['introduces','uses','replicates','extends','questions','mitigates'].includes(r.type)) errors.push('Invalid relation type'); }
    if (!data.coverageAudit?.cutoff || !data.coverageAudit?.sourceGroups?.length) errors.push('Missing source coverage audit');
  }
  if (['3.1','4.0','5.0','5.1','5.2'].includes(data.schemaVersion)) {
    const audits=data.visualAudits??[], charts=data.charts??[], figures=data.figures??[];
    if((audits.length!==data.benchmarks.length) || new Set(audits.map(a=>a.protocolId)).size!==audits.length) errors.push('Every protocol needs one visual audit');
    for(const chart of charts){
      ref('benchmarks',chart.protocolId,chart.id);
      for(const id of chart.recordIds){ref('results',id,chart.id);if(maps.results.get(id)?.benchmarkId!==chart.protocolId)errors.push(`${chart.id}: mismatched protocol`);}
      for(const id of chart.sourceIds)ref('sources',id,chart.id);
      for(const mid of chart.metricIds)if(!chart.recordIds.some(id=>maps.results.get(id)?.metrics.some(m=>m.id===mid)))errors.push(`${chart.id}: metric has no reported values`);
      if(!chart.metricIds.includes(chart.defaultMetricId))errors.push(`${chart.id}: missing default metric`);
      if(chart.domain[0]!==0 || chart.domain[1]<=0)errors.push(`${chart.id}: chart must start at zero`);
      if(chart.basis==='verified-comparison' && (!chart.comparisonGroupId || chart.recordIds.some(id=>maps.results.get(id)?.comparisonGroup!==chart.comparisonGroupId)))errors.push(`${chart.id}: unverified comparison`);
      for(const key of ['title','description','meaning','conditions','dateLabel'])bilingual(chart[key],chart.id);
    }
    for(const figure of figures){ref('benchmarks',figure.protocolId,figure.id);ref('sources',figure.sourceId,figure.id);if(!figure.src.startsWith('/images/')||figure.width<=0||figure.height<=0)errors.push(`${figure.id}: invalid figure asset`);}
    for(const audit of audits){ref('benchmarks',audit.protocolId,'audit');if(audit.chartId&&!charts.some(c=>c.id===audit.chartId))errors.push('Unknown audit chart');if(audit.figureId&&!figures.some(f=>f.id===audit.figureId))errors.push('Unknown audit figure');}
    for(const r of data.results)for(const m of r.metrics){const ci=m.uncertainty;if(ci&&(!Number.isFinite(ci.lower)||!Number.isFinite(ci.upper)||ci.lower>m.value||ci.upper<m.value||ci.provenance!=='source-reported'))errors.push(`${r.id}: invalid reported interval`);}
  }
  if ('mappings' in data) errors.push('External framework mappings must not be part of the NUWA public catalogue');
  errors.push(...validateModelEvidence(data));
  errors.push(...validateIntelligence(data),...validateMonitoring(data),...validateMonitoringBindings(data));
  return errors;
}

export function csvResults(results) {
  const cell = value => {
    let s = value == null ? '' : String(value);
    if (/^[\s]*[=+@-]/.test(s)) s = `'${s}`;
    return /[",\r\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
  };
  const rows = [['record_id','benchmark','system','metric','observation_dimension','value','unit','qualifier','interval','evaluation_date','publication_date','verified_on','source_version','source_url','model_revision','harness','tool_access','budget','sample_scope','limitations','goal_condition','threat_condition','reasoning']];
  for (const r of results) for (const m of r.metrics) rows.push([r.id,r.benchmarkId,r.system,m.label.en,m.dimension,m.value,m.unit,m.qualifier,m.interval,r.evaluationDate,r.publicationDate,r.verifiedOn,r.sourceVersion,r.sourceUrl,r.configuration?.modelVersion,r.configuration?.harness,r.configuration?.tools,r.configuration?.budget,r.sampleSize?.en,r.limitations?.en,r.experimentalConditions?.goal,r.experimentalConditions?.threat,r.experimentalConditions?.reasoning]);
  return rows.map(row => row.map(cell).join(',')).join('\r\n') + '\r\n';
}

/** @template {{data: any}} T @param {T[]} entries @param {string[]} snapshotIds @returns {T[]} */
export function publishableReports(entries, snapshotIds) {
  return entries.filter(entry => {
    const d = entry.data;
    if (d.draft || !d.approved || !d.approvalReference?.trim() || !d.articleSlug || !snapshotIds.includes(d.snapshotId)) return false;
    const pair = entries.filter(peer => peer.data.pair === d.pair);
    if (pair.length !== 2 || !['en', 'zh'].every(locale => pair.filter(peer => peer.data.locale === locale).length === 1)) return false;
    return pair.every(peer => !peer.data.draft && peer.data.approved && peer.data.approvalReference?.trim() && peer.data.articleSlug === d.articleSlug && peer.data.snapshotId === d.snapshotId && peer.data.period === d.period && +peer.data.date === +d.date);
  });
}

export function immutableSnapshotErrors(before, after) {
  return Object.entries(before).flatMap(([file, bytes]) => !(file in after) ? [`${file}: released snapshot cannot be deleted`] : after[file] !== bytes ? [`${file}: released snapshot is immutable`] : []);
}

export function factUpdatePolicy(before, after, files) {
  const errors = validateCatalogue(after);
  if (JSON.stringify(before) !== JSON.stringify(after) && before.snapshotId === after.snapshotId) errors.push('Changed evidence requires a new snapshot ID.');
  for (const file of files) if (!/^src\/data\/nuwa-index\/(?:catalogue\.json|snapshots\/[\d.-]+\.json)$/.test(file) && file !== 'docs/website-v2/nuwa-index-search-log.json') errors.push(`${file}: outside the fact-update scope`);
  const taxonomyChanged = ['families', 'areas', 'questions', 'concepts', 'functions', 'works', 'organizations', 'relations','models','assessments','protocolVariants','assessmentEvidence','trendSeries','scenarioAssociations','sourceVersions','observationEvidence','claims','reviewSummaries','sourceUnits','officialObservations','evidenceLineage','mappingCorrections','comparisonSets','monitoringSignals','evidenceGaps','monitoring'].some(key => JSON.stringify(before[key]) !== JSON.stringify(after[key]));
  const judgmentsChanged = after.results.some(r => {
    const old = before.results.find(prior => prior.id === r.id);
    if (!old) return r.interpretation !== null || r.comparisonGroup !== null;
    return ['interpretation', 'comparisonGroup', 'subjectType', 'evidenceType', 'benchmarkId'].some(key => JSON.stringify(old[key]) !== JSON.stringify(r[key]));
  });
  // A new dossier introduces a scientific scope and risk mapping, even when its scores are factual.
  const mappingsChanged = after.benchmarks.some(b => {
    const old = before.benchmarks.find(prior => prior.id === b.id);
    return !old || ['links', 'kind', 'primaryDimension', 'assessmentSubject', 'measures', 'limitations', 'classificationNote'].some(key => JSON.stringify(old[key]) !== JSON.stringify(b[key]));
  });
  const framingChanged = ['title', 'coverage', 'schemaVersion', 'charts', 'figures'].some(key => JSON.stringify(before[key]) !== JSON.stringify(after[key]));
  const metricClassificationsChanged = after.results.some(r => {
    const old = before.results.find(prior => prior.id === r.id);
    return r.metrics.some(m => {
      const previous = old?.metrics.find(metric => metric.id === m.id)
        ?? before.results.filter(prior => prior.benchmarkId === r.benchmarkId).flatMap(prior => prior.metrics).find(metric => metric.id === m.id);
      return !previous || previous.dimension !== m.dimension || JSON.stringify(previous.dimensionRationale) !== JSON.stringify(m.dimensionRationale);
    });
  });
  return { errors, requiresApproval: taxonomyChanged || judgmentsChanged || mappingsChanged || metricClassificationsChanged || framingChanged };
}

export function reportPeriodLabel(period,locale='en'){return ({en:{baseline:'Monitoring baseline',weekly:'Weekly review',monthly:'Monthly synthesis'},zh:{baseline:'监测基线',weekly:'周度回顾',monthly:'月度综述'}}[locale]??{} )[period]??period;}
