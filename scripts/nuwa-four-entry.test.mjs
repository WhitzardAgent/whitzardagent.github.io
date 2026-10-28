import test from 'node:test';
import assert from 'node:assert/strict';
import {readIndexFilters,writeIndexFilters,indexViews} from '../src/lib/nuwaIndex.mjs';
test('five entries default to Trend and preserve legacy scoped links',()=>{
 assert.deepEqual(indexViews,['framework','trend','research','benchmarks','methodology']);
 assert.equal(readIndexFilters('').view,'trend');
 for(const [old,view,mode] of [['overview','trend','topic'],['models','trend','model'],['library','research','topic'],['reports','research','topic'],['results','benchmarks','topic'],['methodology','methodology','topic']]){
  const s=readIndexFilters(`?view=${old}&area=cybersecurity&q=agent`);assert.equal(s.view,view);assert.equal(s.trendMode,mode);assert.equal(s.area,'cybersecurity');assert.equal(s.q,'agent');
 }
 assert.equal(readIndexFilters('?view=reports').researchMode,'reports');
 const url='?view=trend&trendMode=model&model=glm-5-2&area=deception&mon-topic-deception-display=timeline';
 const s=readIndexFilters(url);assert.deepEqual(readIndexFilters(writeIndexFilters(url,s)),s);assert.match(writeIndexFilters(url,s),/mon-topic-deception-display=timeline/);
});
test('model-aware monitoring review binds release dates and date sources',async()=>{const{monitorBindingHash}=await import('../src/lib/nuwa-intelligence/monitoringIntegrity.mjs');const d={results:[{id:'r',sourceId:'s'}],models:[{id:'m',releaseDate:'2026-01-01',releaseSourceId:'launch'}],sources:[{id:'s'},{id:'launch',title:'Launch'}],monitoring:{identityResolutions:[]}};const g={id:'g',bindings:[{resultId:'r',modelId:'m'}],sourceIds:['s'],review:{dependencyVersion:'model-metadata-2'}};const before=monitorBindingHash(d,g);d.models[0].releaseDate='2026-02-01';assert.notEqual(before,monitorBindingHash(d,g));const after=monitorBindingHash(d,g);d.sources[1].title='Correction';assert.notEqual(after,monitorBindingHash(d,g));});
test('legacy hash navigation preserves scoped filters and resolves history consistently',async()=>{const{readIndexLocation}=await import('../src/lib/nuwaIndex.mjs');const s=readIndexLocation('?organization=anthropic&q=monitor','#ni-library');assert.equal(s.view,'research');assert.equal(s.organization,'anthropic');assert.equal(s.q,'monitor');assert.equal(readIndexLocation('?organization=openai','#ni-models').trendMode,'model');assert.equal(readIndexLocation('?view=framework','#ni-library').view,'framework');});
test('model filters use their own scope instead of inherited Research text',async()=>{const {readModelScope,filterModelOptions}=await import('../src/lib/nuwa-intelligence/modelPanels.mjs');assert.deepEqual(readModelScope('?view=trend&q=monitorability&organization=far'),{query:'',developer:''});assert.deepEqual(readModelScope('?view=models&q=Kimi&organization=moonshot'),{query:'Kimi',developer:'moonshot'});assert.equal(filterModelOptions([{name:'Kimi K3',developerId:'moonshot'}],{query:'zzz',developer:''}).length,0);});
test('legacy source-series links open the archived source view, while explicit Trend remains selectable',()=>{assert.equal(readIndexFilters('?series=metr-horizon-1-1&metric=metr-p50').view,'methodology');const q=writeIndexFilters('?series=metr-horizon-1-1&metric=metr-p50',{...readIndexFilters(''),view:'trend'});assert.equal(readIndexFilters(q).view,'trend');});
