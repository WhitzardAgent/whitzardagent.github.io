import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

/** Reading-order acceptance: source scope stays visible while topics and history change. */
export async function checkNuwaEvidenceReadingBrowser(browser,base='http://127.0.0.1:4336'){
 const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
 const shots='output/playwright/nuwa-evidence-reading';await fs.mkdir(shots,{recursive:true});
 await context.route('https://cloud.umami.is/**',route=>route.abort());
 const page=await context.newPage();page.setDefaultTimeout(15000);page.setDefaultNavigationTimeout(60000);
 const results=[],geometry=[];
 try{
  for(const prefix of ['/en','']){
   await page.goto(base+prefix+'/nuwa/whitzard-index/',{waitUntil:'domcontentloaded'});
   await page.locator('nuwa-index-explorer[data-enhanced=true]').waitFor();
   const topic=page.locator('[data-risk-panel=autonomy]');
   const takeaway=topic.locator('[data-topic-takeaway]');
   assert.ok(await takeaway.isVisible(),'mobile shows a scoped takeaway before chart controls');
   const plot=await topic.locator('[data-monitor-plot]').first().boundingBox();
   assert.ok(plot.y<844*2,`mobile chart starts within second screen: ${plot.y}`);
   const controls=await topic.locator('[data-monitor-controls]').first().boundingBox();
   const brief=await takeaway.boundingBox();assert.ok(brief.y+brief.height<=controls.y,'takeaway precedes controls');
   geometry.push({locale:prefix?'en':'zh',width:390,takeaway:brief,controls,plot});
   await page.screenshot({path:`${shots}/${prefix?'en':'zh'}-trend-390.png`});
   await page.locator('[data-risk-select]').selectOption('deception');
   assert.equal(new URL(page.url()).searchParams.get('area'),'deception');
   assert.equal(await page.locator('[data-risk-panel=deception]').isVisible(),true);
   await page.locator('[data-risk-panel=deception] [data-monitor-controls]').first().waitFor({state:'visible'});
   assert.equal(await page.locator('[data-risk-panel=deception] [data-lazy-topic-src]').count(),0,'selected topic has replaced its lazy placeholder');
   await page.goBack();assert.equal(await page.locator('[data-risk-select]').inputValue(),'autonomy');
   await page.locator('[data-index-view=research]').click();
   await page.locator('[data-work-record]:visible').first().waitFor();
   const coverage=page.locator('[data-research-coverage]');
   assert.equal(await coverage.getAttribute('open'),null,'coverage starts collapsed');
   assert.ok(await page.locator('[data-work-record]:visible').count()>0);
   const readingOrder=await coverage.evaluate(el=>({precededByRecords:Boolean(el.previousElementSibling?.matches('[data-library-grid]')),siblings:[...el.parentElement.children].map(child=>child.tagName+'.'+child.className)}));
   assert.ok(readingOrder.precededByRecords,`records precede optional coverage: ${JSON.stringify(readingOrder)}`);
   const firstRecord=await page.locator('[data-work-record]:visible').first().boundingBox();
   assert.ok(firstRecord.y<844,'first research record starts in the mobile initial viewport');
   geometry.push({locale:prefix?'en':'zh',width:390,researchFirstRecord:firstRecord});
   await page.screenshot({path:`${shots}/${prefix?'en':'zh'}-research-390.png`});
   await page.setViewportSize({width:1440,height:900});
   await page.goto(base+prefix+'/nuwa/whitzard-index/',{waitUntil:'domcontentloaded'});await page.locator('nuwa-index-explorer[data-enhanced=true]').waitFor();
   const fullPlot=await page.locator('[data-risk-panel=autonomy] [data-monitor-plot]').first().boundingBox();
   assert.ok(fullPlot.y+fullPlot.height<=900,`desktop full plot: ${JSON.stringify(fullPlot)}`);
   assert.ok((await page.locator('[data-risk-panel=autonomy] [data-topic-takeaway]').boundingBox()).y<900);
   geometry.push({locale:prefix?'en':'zh',width:1440,takeaway:await page.locator('[data-risk-panel=autonomy] [data-topic-takeaway]').boundingBox(),plot:fullPlot});
   await page.screenshot({path:`${shots}/${prefix?'en':'zh'}-trend-1440.png`});
   await page.locator('[data-index-view=research]').click();await page.locator('[data-work-record]:visible').first().waitFor();
   const desktopFirstRecord=await page.locator('[data-work-record]:visible').first().boundingBox();assert.ok(desktopFirstRecord.y<900,'first research record starts in the desktop initial viewport');
   geometry.push({locale:prefix?'en':'zh',width:1440,researchFirstRecord:desktopFirstRecord});
   await page.screenshot({path:`${shots}/${prefix?'en':'zh'}-research-1440.png`});
   await page.goto(base+prefix+'/nuwa/whitzard-index/work/time-horizons/',{waitUntil:'domcontentloaded'});
   assert.ok(await page.locator('[data-research-dossier]').count()>0);
   const titleSize=await page.locator('.ni-header h1').evaluate(el=>parseFloat(getComputedStyle(el).fontSize));
   assert.ok(titleSize>=32&&titleSize<=40,`work title supports sustained reading: ${titleSize}`);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   await page.screenshot({path:`${shots}/${prefix?'en':'zh'}-work-1440.png`});
   results.push(prefix?'en':'zh');await page.setViewportSize({width:390,height:844});
  }
 }finally{await context.close();}
 const result={locales:results,mobileTakeaway:true,topicHistory:true,recordsFirst:true,desktopChart:true,geometry};
 await fs.writeFile(`${shots}/reading-geometry.json`,JSON.stringify(result,null,2)+'\n');return result;
}
