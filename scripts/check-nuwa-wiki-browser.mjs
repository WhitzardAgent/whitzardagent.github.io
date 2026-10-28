import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
export async function checkNuwaWikiBrowser(browser,base='http://127.0.0.1:4336'){
 const errors=[],shots='output/playwright/nuwa-wiki';await fs.mkdir(shots,{recursive:true});
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce',acceptDownloads:true});
 await context.route('https://cloud.umami.is/**',r=>r.abort());
 const page=await context.newPage();page.setDefaultTimeout(12000);page.on('pageerror',e=>errors.push(e.message));
 const root='/nuwa/whitzard-index/',pilots=['cybergym','cybench','agentcyberrange','agentic-misalignment','palisade-robot-shutdown'];let layouts=0;
 for(const prefix of ['/en',''])for(const width of [1440,1200,900,390]){
  await page.setViewportSize({width,height:1000});await page.goto(base+prefix+root+'?view=methodology');await page.locator('nuwa-index-explorer[data-enhanced=true]').waitFor();
  assert.equal(await page.locator('[data-index-view]').count(),5);assert.equal(await page.locator('[data-index-panel=methodology]').isVisible(),true);assert.equal(await page.locator('.nw-method-body>section').count(),7);
  assert.ok(await page.locator('#method-acknowledgements a[href^="https://"]').count()>50);assert.equal(await page.locator('.nk-update').count(),0);assert.equal(await page.locator('.nv-deeper-link').count(),0);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`method overflow ${prefix}/${width}`);
  if(width===1440||width===390)await page.screenshot({path:`${shots}/method-${prefix?'en':'zh'}-${width}.png`,fullPage:false});
  await page.locator('[data-index-view=trend]').click();assert.equal(await page.locator('[data-index-panel=trend]').isVisible(),true);await page.goBack();assert.equal(await page.locator('[data-index-panel=methodology]').isVisible(),true);
  for(const id of pilots){
   await page.goto(base+prefix+root+`benchmark/${id}/`);assert.equal(await page.locator('[data-wiki-content]').count(),1);assert.equal(await page.locator('[data-wiki-content] h2').count(),4);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`benchmark overflow ${id}/${prefix}/${width}`);
   assert.ok(await page.locator('.nw-evaluation-toc').isVisible());
   const refs=page.locator('[data-page-sources] li');const keys=await refs.evaluateAll(es=>es.map(e=>e.dataset.citationKey));assert.equal(new Set(keys).size,keys.length);
   assert.ok(!(await page.locator('[data-page-sources]').textContent()).includes('Used for:'));
   if(id==='palisade-robot-shutdown'){assert.equal(await page.locator('[data-citation-key="palisade:robot-shutdown-2026"]').count(),1);assert.match(await page.locator('[data-citation-key="palisade:robot-shutdown-2026"]').textContent(),/2026-02-11.*2026-02-12|2026-02-12.*2026-02-11/);}
   if((width===1440||width===390)&&id==='cybench')await page.screenshot({path:`${shots}/benchmark-${prefix?'en':'zh'}-${width}.png`,fullPage:false});
   layouts++;
   await page.goto(base+prefix+root+`work/${id}/`);assert.equal(await page.locator('[data-wiki-content]').count(),1);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`work overflow ${id}/${prefix}/${width}`);layouts++;
  }
  layouts++;
 }
 await page.setViewportSize({width:1440,height:1000});
 for(const query of ['?series=metr-horizon-1-1&metric=metr-p50','?view=framework#indicator-register','?view=framework#source-series']){await page.goto(base+'/en'+root+query);await page.locator('nuwa-index-explorer[data-enhanced=true]').waitFor();assert.equal(await page.locator('[data-index-panel=methodology]').isVisible(),true);}
 await page.goto(base+'/en'+root+'?view=trend&area=cybersecurity');await page.locator('nuwa-index-explorer[data-enhanced=true]').waitFor();assert.ok(await page.locator('.nm-monitor-plot svg image[href*="organizations"]').count()>0);await page.screenshot({path:`${shots}/trend-1440.png`});
 // Wiki body anchors must target an actual heading and remain valid on history navigation.
 await page.goto(base+'/en'+root+'benchmark/cybergym/');const anchor=page.locator('.nw-evaluation-toc nav a').nth(1);const href=await anchor.getAttribute('href');await anchor.click();assert.equal(await page.locator(href).count(),1);assert.equal(new URL(page.url()).hash,href);
 // An uncatalogued single-model name still has the known developer mark.
 await page.goto(base+'/en'+root+'benchmark/cybench/');await page.locator('[data-monitor-controls]:visible').first().waitFor();await page.locator('[data-monitor-views] [data-display=bars]').first().click();await page.locator('.nm-monitor-plot svg image[href*="organizations"]').first().waitFor({state:'attached'});assert.ok(await page.locator('.nm-monitor-plot svg image[href*="organizations"]').count()>0);
 assert.deepEqual(errors,[]);await context.close();
 const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:900}}),p=await nojs.newPage();await p.goto(base+'/en'+root+'benchmark/palisade-robot-shutdown/');assert.equal(await p.locator('[data-wiki-content] h2').count(),4);assert.equal(await p.locator('[data-citation-key="palisade:robot-shutdown-2026"]').count(),1);await p.goto(base+'/en'+root+'?view=methodology');assert.equal(await p.locator('#method-sources').isVisible(),true);assert.ok(await p.locator('[data-index-view=methodology]').count());await nojs.close();
 return {layouts,pilotArticles:10,methodSections:7,references:true,legacyLinks:true,logos:true,history:true,noJS:true};
}
