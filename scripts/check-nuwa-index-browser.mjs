import {effectiveCatalogue} from '../src/lib/nuwa-intelligence/lineage.mjs';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
export async function checkNuwaIndexBrowser(browser,baseUrl,captureDir='output/playwright') {
  await mkdir(captureDir,{recursive:true});
  const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  await context.route('https://cloud.umami.is/**',r=>r.abort());
  const page=await context.newPage();page.setDefaultTimeout(10000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const data=effectiveCatalogue(await (await context.request.get(`${baseUrl}/en/nuwa/whitzard-index/snapshot.json`)).json());
  let layouts=0;
  try{
    for(const prefix of ['/en','']) for(const width of [1440,1200,1024,900,808,390]){
      await page.setViewportSize({width,height:1000});
      await page.goto(`${baseUrl}${prefix}/nuwa/whitzard-index/`,{waitUntil:'domcontentloaded'});
      await page.locator('nuwa-index-explorer[data-enhanced=true]').waitFor();
      for(const view of ['framework','trend','research','benchmarks']){
        await page.locator(`[data-index-view=${view}]`).click();
        assert.equal(await page.locator('.ni-view:not([hidden])').count(),1);
        assert.equal(await page.locator(`[data-index-panel=${view}]`).isVisible(),true);
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,`${prefix}/${view}/${width} overflow`);layouts++;
        if(prefix==='/en'&&[1440,390].includes(width)&&['trend','research'].includes(view)){
          await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:`${captureDir}/nuwa-knowledge-${view}-${width}.png`});
        }
      }
      for(const route of ['model/kimi-k3','model/glm-5-2','model/deepseek-v4-pro','assessment/neo-kimi-k3','assessment/saferai-glm52','work/deep-ignorance','work/monitoring-monitorability','work/hugging-face-incident','function/governance','organization/openai','risk/autonomy','benchmark/agentdojo','result/agentcyberrange-gpt56-20261024']){
        const response=await page.goto(`${baseUrl}${prefix}/nuwa/whitzard-index/${route}/`,{waitUntil:'domcontentloaded'});
        assert.equal(response.status(),200);assert.equal(await page.locator('main h1').count(),1);
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,`${prefix}/${route}/${width} overflow`);
        assert.equal(await page.locator('link[rel=alternate][hreflang]').count(),3);layouts++;
      }
    }
    await page.setViewportSize({width:1440,height:1000});
    await page.goto(`${baseUrl}/en/nuwa/whitzard-index/?view=library&function=monitoring&organization=openai`,{waitUntil:'domcontentloaded'});
    await page.locator('nuwa-index-explorer[data-enhanced=true]').waitFor();
    assert.ok(await page.locator('[data-work-record]:not([hidden])').count()>0);
    assert.equal(await page.locator('select[name=function]').inputValue(),'evaluation');
    assert.equal(await page.locator('select[name=organization]').inputValue(),'openai');
    await page.locator('[data-index-controls] input[name=q]').fill('monitorability');
    assert.ok(await page.locator('[data-work-record]:not([hidden])').count()>0);
    await Promise.all([page.waitForURL(/\/work\//),page.locator('[data-work-record]:not([hidden]) .nk-card__actions a').last().click()]);
    assert.match(page.url(),/\/work\//);
    await page.goBack({waitUntil:'domcontentloaded'});await page.locator('nuwa-index-explorer[data-enhanced=true]').waitFor();
    assert.equal(await page.locator('[data-index-controls] input[name=q]').inputValue(),'monitorability');
    await page.locator('[data-language-switch]').click();await page.waitForURL(u=>!u.pathname.startsWith('/en/'));
    assert.equal(new URL(page.url()).searchParams.get('organization'),'openai');
    await page.locator('[data-language-switch]').click();await page.waitForURL(u=>u.pathname.startsWith('/en/'));
    await page.locator('[data-index-controls] input[name=q]').fill('no-such-work-xyz');assert.equal(await page.locator('[data-index-empty]').isVisible(),true);
    await page.locator('[data-index-controls] button[type=reset]').click();assert.equal(await page.locator('[data-work-record]:not([hidden])').count(),data.works.length);
    assert.equal(await page.locator('[data-work-record] h3 a[href*="inspect_evals"]').count(),0);
    await page.locator('select[name=function]').selectOption('governance');assert.ok(await page.locator('[data-work-record]:not([hidden])').count()>0);
    await page.goBack();assert.equal(await page.locator('select[name=function]').inputValue(),'');await page.goForward();assert.equal(await page.locator('select[name=function]').inputValue(),'governance');
    await page.locator('[data-index-view=framework]').focus();await page.keyboard.press('ArrowRight');assert.equal(await page.locator('[data-index-view=trend]').getAttribute('aria-selected'),'true');
    await page.goto(`${baseUrl}/en/nuwa/whitzard-index/?view=benchmarks&area=autonomy&dimension=capability`,{waitUntil:'domcontentloaded'});await page.locator('nuwa-index-explorer[data-enhanced=true]').waitFor();assert.ok(await page.locator('[data-benchmark-parent]:not([hidden])').count()>0);
    await page.goto(`${baseUrl}/en/nuwa/whitzard-index/?view=results&benchmark=agentdojo&q=GPT-4o`,{waitUntil:'domcontentloaded'});await page.locator('nuwa-index-explorer[data-enhanced=true]').waitFor();assert.equal(await page.locator('#ni-benchmarks [data-index-record]:not([hidden])').count(),1);
    await page.locator('[data-index-controls] button[type=reset]').click();assert.deepEqual(await page.locator('#ni-benchmarks [data-result-ids]').evaluateAll(es=>[...new Set(es.flatMap(e=>e.dataset.resultIds.split(' ')))].sort()),data.results.map(r=>r.id).sort());
    await page.goto(`${baseUrl}/en/nuwa/whitzard-index/risk/autonomy/`,{waitUntil:'domcontentloaded'});await page.locator('nuwa-risk-matrix[data-enhanced=true]').waitFor();
    await page.locator('[data-matrix-link=cell-self-replication-capability]').click();assert.equal(await page.locator('#cell-self-replication-capability').isVisible(),true);assert.match(page.url(),/#cell-self-replication-capability$/);
    const old=await context.request.get(`${baseUrl}/en/nuwa/whitzard-index/snapshots/2026-10-25.2.json`);assert.equal(old.status(),200);assert.equal((await old.json()).schemaVersion,'2.0');
    const csv=await context.request.get(`${baseUrl}/en/nuwa/whitzard-index/results.csv`);assert.match(await csv.text(),/observation_dimension/);
    await page.goto(`${baseUrl}/en/nuwa/whitzard-index/work/deep-ignorance/`,{waitUntil:'domcontentloaded'});await page.screenshot({path:`${captureDir}/nuwa-knowledge-work-desktop.png`});
    assert.deepEqual(errors,[]);
  }finally{await context.close();}
  const staticContext=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:1000}});
  try{
    const p=await staticContext.newPage();await p.goto(`${baseUrl}/en/nuwa/whitzard-index/`,{waitUntil:'domcontentloaded'});
    assert.equal(await p.locator('.ni-view:visible').count(),4);assert.equal(await p.locator('[data-work-record]:visible').count(),data.works.length);assert.equal(await p.locator('[data-index-controls]').isVisible(),false);
    await p.locator('a[href$="/function/evaluation"]').first().click();assert.ok(await p.locator('.nk-card').count()>0);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
    await p.goto(`${baseUrl}/en/nuwa/whitzard-index/work/deep-ignorance/`,{waitUntil:'domcontentloaded'});assert.equal(await p.locator('#method').isVisible(),true);assert.equal(await p.locator('#limits').isVisible(),true);
  }finally{await staticContext.close();}
  const touch=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
  try{const p=await touch.newPage();await p.goto(`${baseUrl}/nuwa/whitzard-index/`,{waitUntil:'domcontentloaded'});await p.locator('[data-index-view=research]').tap();await p.locator('select[name=function]').selectOption('evaluation');assert.ok(await p.locator('[data-work-record]:not([hidden])').count()>0);}finally{await touch.close();}
  return {layouts,works:data.works.length,protocols:data.benchmarks.length,results:data.results.length,interactions:'search, role filters, sorting, history, legacy URLs, keyboard, touch, language, static pages, source links, exports',errors};
}
