import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { candidatePaths, releasedSnapshotErrors } from './lib/nuwa-index-release.mjs';
import { validateCatalogue, sortResearchRecords, comparisonKey, readIndexFilters, writeIndexFilters, matchesIndexRecord, csvResults, publishableReports, factUpdatePolicy, immutableSnapshotErrors } from '../src/lib/nuwaIndex.mjs';

test('incomplete protocols cannot silently produce a comparable score group', () => {
  const record = { benchmarkId: 'b', benchmarkVersion: 'v1', taskSet: 'full', protocol: 'p1', configuration: { modelVersion: 'm1', harness: 'h1', tools: 't', budget: 'b' }, comparisonGroup: 'official-table-1' };
  const metric = { id: 'success', unit: '%', value: 50 };
  assert.equal(comparisonKey(record, metric), 'b|v1|full|p1|official-table-1|success|%');
  assert.equal(comparisonKey({ ...record, configuration: { ...record.configuration, budget: null } }, metric), null);
  assert.equal(comparisonKey({ ...record, comparisonGroup: null }, metric), null);
  assert.notEqual(comparisonKey({ ...record, taskSet: 'subset' }, metric), comparisonKey(record, metric));
  assert.notEqual(comparisonKey(record, { ...metric, id: 'refusal' }), comparisonKey(record, metric));
});

test('index filters preserve shareable risk and observation scope', () => {
  assert.deepEqual(readIndexFilters('?view=results&area=cybersecurity&dimension=behavior&q=GPT&benchmark=agentdojo'), { view: 'benchmarks', trendMode:'topic', researchMode:'works', model:'', resultSort:'priority', scenario:'', area: 'cybersecurity', dimension: 'behavior', q: 'GPT', benchmark: 'agentdojo', function:'', tag:'', organization:'', kind:'', year:'', sort:'published' });
  assert.equal(readIndexFilters('?view=made-up').view, 'trend');
  assert.equal(readIndexFilters('?dimension=made-up').dimension, '');
  assert.equal(writeIndexFilters('?utm_source=lab', { view: 'benchmarks', area: 'autonomy', dimension: 'capability', q: '', benchmark: '' }), 'utm_source=lab&view=benchmarks&area=autonomy&dimension=capability');
  assert.equal(matchesIndexRecord({ areas: ['cybersecurity'], dimensions: ['behavior'], search: 'AgentDojo prompt injection', benchmark: 'agentdojo' }, { area: 'cybersecurity', dimension: 'behavior', q: 'prompt', benchmark: 'agentdojo' }), true);
  assert.equal(matchesIndexRecord({ areas: ['cybersecurity'], dimensions: ['behavior'], search: 'AgentDojo', benchmark: 'agentdojo' }, { area: 'cybersecurity', dimension: 'propensity', q: '', benchmark: '' }), false);
});

test('CSV exports distinguish unknown values from zero and neutralize spreadsheet formula cells', () => {
  const csv = csvResults([{ id: 'r', benchmarkId: 'b', system: '=IMPORTXML()', sourceUrl: 'https://example.org', sourceVersion: 'v1', evaluationDate: null, publicationDate: '2024-01-01', verifiedOn: '2026-10-24', metrics: [{ id: 'm', label: { en: 'Rate' }, value: 0, unit: '%', qualifier: 'exact' }] }]);
  assert.match(csv, /'=IMPORTXML\(\)/);
  assert.match(csv, /,0,%/);
  assert.doesNotMatch(csv, /undefined|null/);
});

test('published reports need editorial approval, a known snapshot and a matching language pair', () => {
  const report = { id: 'en', data: { pair: 'week-1', articleSlug: 'week-1', approvalReference: 'User-approved version', locale: 'en', draft: false, approved: false, snapshotId: 's1', period: 'weekly', date: new Date('2026-10-24') } };
  const zh = { ...report, id: 'zh', data: { ...report.data, locale: 'zh', approved: true } };
  assert.equal(publishableReports([report, zh], ['s1']).length, 0);
  assert.equal(publishableReports([{ ...report, data: { ...report.data, approved: true } }, zh], ['s1']).length, 2);
  assert.equal(publishableReports([{ ...report, data: { ...report.data, approved: true } }, zh], []).length, 0);
  const approved = { ...report, data: { ...report.data, approved: true } };
  assert.equal(publishableReports([approved, { ...zh, data: { ...zh.data, articleSlug: 'different' } }], ['s1']).length, 0);
  assert.equal(publishableReports([approved, zh, { ...zh, id: 'duplicate' }], ['s1']).length, 0);
  assert.equal(publishableReports([{ ...approved, data: { ...approved.data, approvalReference: '' } }, zh], ['s1']).length, 0);
});

test('catalogue validation rejects broken sources, false precision, and draft leakage', async () => {
  const catalogue = JSON.parse(await readFile(new URL('../src/data/nuwa-index/catalogue.json', import.meta.url)));
  assert.deepEqual(validateCatalogue(catalogue), []);
  const broken = structuredClone(catalogue);
  broken.results[0].sourceId = 'missing-source';
  broken.results[0].metrics[0].value = 101;
  broken.results[0].draft = true;
  broken.results[0].metrics[0].id = '';
  broken.results[0].metrics[1].unit = '';
  broken.results[0].sourceUrl = 'javascript:alert(1)';
  const errors = validateCatalogue(broken).join('\n');
  assert.match(errors, /missing-source/);
  assert.match(errors, /0–100/);
  assert.match(errors, /draft/);
  assert.match(errors, /missing id/);
  assert.match(errors, /missing unit/);
  assert.match(errors, /HTTPS result source/);
});

test('new risk judgments and dimension links require review, while a new source-only result may proceed', async () => {
  const before = JSON.parse(await readFile(new URL('../src/data/nuwa-index/catalogue.json', import.meta.url)));
  const after = structuredClone(before);
  after.snapshotId = '2026-10-31.1';
  const added = structuredClone(after.results[0]);
  added.id = 'new-evidence';
  after.results.push(added);
  assert.equal(factUpdatePolicy(before, after, []).requiresApproval, true);
  added.interpretation = null;
  assert.deepEqual(factUpdatePolicy(before, after, []), { errors: [], requiresApproval: false });
  added.metrics[0].dimension = added.metrics[0].dimension === 'behavior' ? 'capability' : 'behavior';
  assert.equal(factUpdatePolicy(before, after, []).requiresApproval, true);
  added.metrics = structuredClone(before.results[0].metrics);
  added.metrics[0].id = 'new-metric';
  assert.equal(factUpdatePolicy(before, after, []).requiresApproval, true);
  added.metrics = structuredClone(before.results[0].metrics);
  after.benchmarks[0].primaryDimension = after.benchmarks[0].primaryDimension === 'behavior' ? 'capability' : 'behavior';
  assert.equal(factUpdatePolicy(before, after, []).requiresApproval, true);
  assert.match(factUpdatePolicy(before, { ...before, verifiedOn: new Date(Date.parse(before.verifiedOn)+86400000).toISOString().slice(0,10) }, []).errors.join('\n'), /new snapshot ID/);
});

test('NUWA hierarchy keeps risk questions separate from observation dimensions and citations', async () => {
  const catalogue = JSON.parse(await readFile(new URL('../src/data/nuwa-index/catalogue.json', import.meta.url)));
  assert.deepEqual(catalogue.families.map(f => f.id), ['agentic-risk', 'dual-use-risk']);
  assert.deepEqual(catalogue.areas.map(a => a.id), ['autonomy', 'deception', 'cybersecurity', 'cbrn', 'disinformation', 'autonomous-physical-harm']);
  assert.ok(catalogue.benchmarks.length >= 35);
  assert.ok(catalogue.results.length >= 23);
  assert.ok(catalogue.benchmarks.every(b => ['propensity', 'capability', 'behavior'].includes(b.primaryDimension)));
  assert.ok(catalogue.benchmarks.some(b => b.links.length === 0));
  assert.ok(catalogue.benchmarks.some(b => b.links.some(link => link.relation === 'enabling')));
  assert.ok(catalogue.results.every(r => r.metrics.every(m => m.dimension && m.dimensionRationale?.en && m.dimensionRationale?.zh)));
  assert.ok(catalogue.questions.every(q => q.sourceIds.length && q.sourceIds.every(id => catalogue.sources.some(s => s.id === id))));
  assert.equal(catalogue.sources.some(s => ['iasr-2026', 'beijing-2024', 'shanghai-2025', 'fli-2026'].includes(s.id)), false);
  const agentDojo = catalogue.benchmarks.find(b => b.id === 'agentdojo');
  assert.equal(agentDojo.primaryDimension, 'behavior');
  assert.equal(catalogue.results.find(r => r.benchmarkId === 'agentdojo').metrics.find(m => m.id === 'benign-utility').dimension, 'capability');
});

test('new dossiers retain source-backed figures or precisely transcribed results', async () => {
  const catalogue = JSON.parse(await readFile(new URL('../src/data/nuwa-index/catalogue.json', import.meta.url)));
  assert.ok(catalogue.results.length >= 23);
  assert.ok(['persuasion-attempts', 'persuasion-effects'].every(id => catalogue.questions.some(question => question.id === id)));
  assert.ok(['secbench-pro', 'vct-v2', 'biotier', 'mask', 'ape'].every(id => catalogue.benchmarks.some(item => item.id === id)));
  assert.ok(['vct-v2', 'biotier'].every(id => !catalogue.results.some(item => item.benchmarkId === id)));
  if(catalogue.schemaVersion==='5.0')for(const record of catalogue.results.filter(r=>r.id.startsWith('reported-')&&['secbench-pro','ape'].includes(r.benchmarkId)))assert.ok(catalogue.observationEvidence.some(link=>link.resultId===record.id&&link.reviewId));
});

test('release snapshots are byte-immutable and cannot be deleted', () => {
  const before = { 'v1.json': '{"value":1}\n', 'v2.json': '{"value":2}\n' };
  assert.deepEqual(immutableSnapshotErrors(before, { ...before, 'v3.json': '{}' }), []);
  assert.match(immutableSnapshotErrors(before, { ...before, 'v1.json': '{"value":3}\n' }).join('\n'), /v1.json.*immutable/);
  assert.match(immutableSnapshotErrors(before, { 'v2.json': before['v2.json'] }).join('\n'), /v1.json.*deleted/);
});

test('release checks inspect untracked candidates and compare snapshots to the trusted Git tree', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'nuwa-release-test-'));
  const run = args => execFileSync('git', args, { cwd: dir, stdio: 'pipe' });
  try {
    run(['init', '-q']);
    const archive = 'src/data/nuwa-index/snapshots/v1.json';
    await mkdir(join(dir, 'src/data/nuwa-index/snapshots'), { recursive: true });
    await writeFile(join(dir, archive), '{"value":1}\n');
    run(['add', '.']);
    run(['-c', 'user.name=Release test', '-c', 'user.email=test@example.org', 'commit', '-qm', 'Baseline']);
    assert.deepEqual(await releasedSnapshotErrors('HEAD', dir), []);
    await writeFile(join(dir, 'unreviewed.js'), '');
    assert.ok(candidatePaths('HEAD', dir).includes('unreviewed.js'));
    await writeFile(join(dir, archive), '{"value":2}\n');
    assert.match((await releasedSnapshotErrors('HEAD', dir)).join('\n'), /immutable/);
    await rm(join(dir, archive));
    assert.match((await releasedSnapshotErrors('HEAD', dir)).join('\n'), /deleted/);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('fact automation cannot change taxonomy, hide provenance or modify application code', async () => {
  const before = JSON.parse(await readFile(new URL('../src/data/nuwa-index/catalogue.json', import.meta.url)));
  const after = structuredClone(before);
  after.snapshotId = '2026-10-31.1';
  assert.equal(factUpdatePolicy(before, after, ['src/data/nuwa-index/catalogue.json']).requiresApproval, false);
  after.areas[0].definition.en = 'A different scientific definition';
  assert.equal(factUpdatePolicy(before, after, ['src/data/nuwa-index/catalogue.json']).requiresApproval, true);
  const codeChange = factUpdatePolicy(before, before, ['.github/workflows/deploy.yml']);
  assert.match(codeChange.errors.join('\n'), /outside the fact-update scope/);
});


test('research migration preserves every old protocol and all numerical records', async () => {
  const old = JSON.parse(await readFile(new URL('../src/data/nuwa-index/snapshots/2026-10-25.2.json', import.meta.url)));
  const current = JSON.parse(await readFile(new URL('../src/data/nuwa-index/catalogue.json', import.meta.url)));
  for (const result of old.results) assert.deepEqual(current.results.find(r=>r.id===result.id),result);
  for (const protocol of old.benchmarks) assert.deepEqual(current.benchmarks.find(p=>p.id===protocol.id),protocol);
  assert.equal(current.functions.length,3);
  for(const f of current.functions) assert.ok(current.works.some(w=>w.primaryFunction===f.id));
  assert.ok(current.works.some(w=>w.protocolIds.length===0));
  assert.ok(current.works.every(w=>!('primaryDimension' in w)));
  assert.ok(current.works.every(w=>!w.originalUrl.includes('inspect_evals')));
  assert.ok(current.works.find(w=>w.id==='deep-ignorance').primaryFunction==='governance');
  assert.ok(current.works.find(w=>w.id==='monitoring-monitorability').primaryFunction==='evaluation');
  assert.deepEqual(validateCatalogue(old),[]);
});

test('knowledge filters support roles, original publication dates and old evaluation links',()=>{
  const legacy=readIndexFilters('?view=benchmarks&dimension=capability&area=autonomy');
  assert.equal(legacy.view,'benchmarks');assert.equal(legacy.function,'');assert.equal(legacy.dimension,'capability');
  const query='?view=library&function=monitoring&organization=openai&year=2025&kind=method&sort=updated';
  assert.deepEqual(readIndexFilters(writeIndexFilters('',readIndexFilters(query))),readIndexFilters(query));
  const r={areas:['deception'],functions:['evaluation'],tags:['risk-monitoring'],organizations:['openai'],dimensions:[],kind:'method',year:'2025',search:'Monitoring reasoning agent transcripts',protocols:[]};
  assert.equal(matchesIndexRecord(r,readIndexFilters(query)),true);
  assert.equal(matchesIndexRecord(r,{...readIndexFilters(query),dimension:'capability'}),false);
  const records=[{id:'old',title:'Agent safety',publicationDate:'2023-01-01',updatedOn:'2026-10-25',search:'agent'},{id:'new',title:'Monitor',publicationDate:'2025-01-01',updatedOn:'2025-01-01',search:'monitor'}];
  assert.equal(sortResearchRecords(records)[0].id,'new');assert.equal(sortResearchRecords(records,'updated')[0].id,'old');
});

test('third-party results can cite a different primary source without losing protocol constraints',async()=>{
  const c=JSON.parse(await readFile(new URL('../src/data/nuwa-index/catalogue.json',import.meta.url)));
  const r=structuredClone(c.results[0]), s=structuredClone(c.sources.find(s=>s.id===r.sourceId));
  s.id='independent-evaluation';s.url='https://example.org/independent-paper';c.sources.push(s);
  r.id='independent-result';r.sourceId=s.id;r.sourceUrl=s.url;r.interpretation=null;c.results.push(r);
  assert.deepEqual(validateCatalogue(c),[]);
  r.benchmarkVersion='unknown-protocol';assert.match(validateCatalogue(c).join('\n'),/protocol version/);
  const w=c.works[0];w.contributions.push({organizationId:'invented',sourceId:s.id,role:'research',locator:'Title page'});
  assert.match(validateCatalogue(c).join('\n'),/unknown organization/);
});
