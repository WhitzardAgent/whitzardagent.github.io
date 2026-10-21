import assert from "node:assert/strict";
import { checkBrandBrowser } from "./check-brand-browser.mjs";

export async function checkEditorialBrowser(browser, baseUrl, { layouts = true } = {}) {
  const baseline = layouts ? await checkBrandBrowser(browser, baseUrl, { widths: [1440, 900, 808, 390], interactions: false }) : { combinations: 0, errors: [] };
  assert.deepEqual(baseline.errors, []);
  let scenarios = 0;
  for (const locale of ["zh", "en"]) for (const javaScriptEnabled of [true, false]) {
    const prefix = locale === "zh" ? "" : "/en";
    const context = await browser.newContext({ javaScriptEnabled, reducedMotion: "reduce", viewport: { width: 390, height: 844 } });
    await context.route("https://cloud.umami.is/**", route => route.abort());
    const page = await context.newPage();
    try {
      await page.goto(`${baseUrl}${prefix}/about`, { waitUntil: "domcontentloaded" });
      assert.deepEqual(await page.locator(".team-list h3").allTextContents(), locale === "zh" ? ["戴嘉润", "潘旭东"] : ["Dr. Jiarun Dai", "Dr. Xudong Pan"]);
      assert.doesNotMatch(await page.locator("main").innerText(), /洪赓|Geng Hong|师从|杨珉|supervision|Strategic.*Partner/);
      const link = page.locator('.site-footer__links a[href="https://security.fudan.edu.cn/"]');
      await link.scrollIntoViewIfNeeded();
      assert.equal(await link.isVisible(), true);
      await link.focus();
      assert.equal(await link.evaluate(el => document.activeElement === el), true);
      assert.match(await link.innerText(), locale === "zh" ? /复旦大学系统软件与安全实验室/ : /Fudan University Security Lab/);
      await page.goto(`${baseUrl}${prefix}/nuwa`, { waitUntil: "domcontentloaded" });
      assert.equal(await page.getByRole("heading", { name: locale === "zh" ? "核心问题" : "Core questions", exact: true }).count(), 1);
      assert.equal(await page.getByRole("heading", { name: locale === "zh" ? "研究方向" : "Research areas", exact: true }).count(), 1);
      assert.doesNotMatch(await page.locator("main").innerText(), /经典研究|全球关注|LANDMARK RESEARCH|What questions does NUWA work on/);
      await page.goto(`${baseUrl}${prefix}/nuwa/research?member=geng-hong`, { waitUntil: "domcontentloaded" });
      if (javaScriptEnabled) {
        await page.locator("astro-island:not([ssr])").waitFor({ state: "attached" });
        await page.waitForFunction(() => [...document.querySelectorAll(".research-filters select")].some(select => select.value === "geng-hong"));
        assert.equal(await page.getByRole("combobox", { name: locale === "zh" ? /^作者/ : /^Author/ }).inputValue(), "geng-hong");
        assert.ok(await page.locator(".research-card").count() > 0);
      } else assert.equal(await page.locator(".research-card:not(.research-card--blog)").count(), 86);
      scenarios++;
    } finally { await context.close(); }
  }
  return { layoutCombinations: baseline.combinations, founderAndAuthorScenarios: scenarios, errors: baseline.errors };
}
