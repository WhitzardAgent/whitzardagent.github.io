import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {organizationBrand, organizationMarkMarkup} from '../src/lib/organizationBrands.mjs';
const catalogue=JSON.parse(await readFile(new URL('../src/data/nuwa-index/catalogue.json',import.meta.url),'utf8'));
const supplemental=JSON.parse(await readFile(new URL('../src/data/nuwa-index/model-developer-brands.json',import.meta.url),'utf8'));
const registry=JSON.parse(await readFile(new URL('../src/data/nuwa-index/organization-brands.json',import.meta.url),'utf8'));

test('every catalogue institution has one explicit presentation-only brand disposition',()=>{
  assert.equal(registry.schemaVersion,1);
  assert.deepEqual(registry.organizations.map(r=>r.organizationId).sort(),catalogue.organizations.map(o=>o.id).sort());
  assert.equal(new Set(registry.organizations.map(r=>r.organizationId)).size,registry.organizations.length);
  for(const record of registry.organizations){
    const org=catalogue.organizations.find(o=>o.id===record.organizationId);
    assert.equal(record.officialHomepage,org.homepage);
    assert.match(record.retrievedOn,/^\d{4}-\d{2}-\d{2}$/);
    assert.ok(record.note);
    assert.equal(record.status,record.asset?'available':'unavailable');
  }
});

test('all rendered marks are bounded local PNG files with matching hashes and real dimensions',async()=>{
  const expected=[];
  for(const {asset} of [...registry.organizations,...supplemental.organizations]){
    if(!asset)continue;
    assert.match(asset.path,/^\/assets\/organizations\/[a-z0-9-]+\.png$/);
    assert.equal(asset.format,'png');
    assert.ok(['light','dark'].includes(asset.background));
    if(asset.kind==='project-supplied-mark'){
      assert.match(asset.sourceUrl,/^\/assets\/research\/[a-z0-9/-]+\.webp$/);
      const supplied=await readFile(new URL(`../public${asset.sourceUrl}`,import.meta.url));
      assert.equal(createHash('sha256').update(supplied).digest('hex'),asset.sourceSha256);
    }else assert.ok(asset.sourceUrl.startsWith('https://'));
    assert.ok(asset.sourcePage.startsWith('https://'));
    const bytes=await readFile(new URL(`../public${asset.path}`,import.meta.url));
    assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
    assert.equal(bytes.readUInt32BE(16),asset.width);
    assert.equal(bytes.readUInt32BE(20),asset.height);
    assert.ok(asset.width>0&&asset.width<=160&&asset.height>0&&asset.height<=160);
    assert.ok(bytes.length<128_000);
    assert.equal(createHash('sha256').update(bytes).digest('hex'),asset.sha256);
    expected.push(asset.path.split('/').at(-1));
  }
  assert.deepEqual((await readdir(new URL('../public/assets/organizations/',import.meta.url))).sort(),expected.sort());
});

test('dynamic marks retain escaped full names and give unknown identities a text-only fallback',()=>{
  const name='Full <Institution> & "Lab"';
  const markup=organizationMarkMarkup('openai',name);
  assert.match(markup,/alt=""/);
  assert.match(markup,/Full &lt;Institution&gt; &amp; &quot;Lab&quot;/);
  assert.match(markup,/width="20" height="20"/);
  assert.doesNotMatch(markup,/https:\/\//);
  assert.equal(organizationBrand('unknown'),null);
  assert.doesNotMatch(organizationMarkMarkup('unknown',name),/<img/);
  assert.match(organizationMarkMarkup('openai',name,{size:'large'}),/width="40" height="40"/);
});
