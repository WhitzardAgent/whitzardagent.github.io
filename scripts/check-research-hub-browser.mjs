import assert from "node:assert/strict";
export async function checkResearchHubBrowser(browser, baseUrl, locale = "zh", width = 1440) {
  const prefix = locale === "en" ? "/en" : "";
  const context = await browser.newContext({ viewport: { width, height: 1000 }, hasTouch: width === 390 });
  await context.route("https://cloud.umami.is/**", route => route.abort());
  const page = await context.newPage();
  page.setDefaultTimeout(5000);
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  try {
    await page.goto(`${baseUrl}${prefix}/nuwa/research`, { waitUntil: "domcontentloaded" });
    assert.equal(await page.locator("h1").innerText(), "Research");
    await page.locator("astro-island:not([ssr])").waitFor({ state: "attached" });
    assert.equal(await page.locator(".research-card:not(.research-card--blog)").count(), 86);
    await page.getByLabel(locale === "zh" ? "成果类型" : "Publication type", { exact: true }).selectOption("technical-report");
    assert.equal(new URL(page.url()).searchParams.get("kind"), "technical-report");
    assert.ok(await page.locator('.research-card[data-research-kind="technical-report"]').count() > 0);
    assert.equal(await page.locator('.research-card[data-research-kind="publication"]').count(), 0);
    await page.getByLabel(locale === "zh" ? "成果类型" : "Publication type", { exact: true }).selectOption("publication");
    assert.ok(await page.locator('.research-card[data-research-kind="publication"]').count() > 0);
    assert.equal(await page.locator('.research-card[data-research-kind="technical-report"]').count(), 0);
    await page.getByRole("button", { name: "Blogs", exact: true }).click();
    assert.equal(await page.locator(".research-card--blog").count(), 3);
    assert.equal(await page.locator(".research-card:not(.research-card--blog)").count(), 0);
    assert.match((await page.locator(".research-card--blog").allInnerTexts()).join(" "), /The Science of Frontier AI Risk Evaluation/);
    assert.ok(await page.locator(".research-tags > div button").count() > 0, "Blogs exposes applicable tags");
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.locator("astro-island:not([ssr])").waitFor({ state: "attached" });
    assert.equal(await page.locator(".research-card--blog").count(), 3);
    await page.goto(`${baseUrl}${prefix}/nuwa/blog`, { waitUntil: "domcontentloaded" });
    await page.waitForURL(`**${prefix}/nuwa/research?kind=blogs`);
    await page.locator("astro-island:not([ssr])").waitFor({ state: "attached" });
    assert.equal(await page.locator(".research-card--blog").count(), 3);
    if (width === 390) {
      await page.locator(".menu-toggle").click();
      const mobileGroup = page.locator(".mobile-nav__group").nth(1);
      assert.equal(await mobileGroup.locator(".mobile-nav__children").isVisible(), false, "research category menu is initially collapsed");
      await mobileGroup.locator("[data-mobile-parent]").click();
      assert.equal(await mobileGroup.locator(".mobile-nav__children").isVisible(), true);
      await mobileGroup.locator("[data-mobile-parent]").click();
      assert.equal(await mobileGroup.locator(".mobile-nav__children").isVisible(), false);
    }
    const nav = page.locator(width === 390 ? ".mobile-navigation" : ".site-nav");
    if (width > 1200) {
      const group = page.locator(".site-nav__group--linked");
      const toggle = group.locator("[data-dropdown-toggle]");
      await toggle.focus();
      await toggle.press("ArrowDown");
      await group.locator("[data-dropdown-panel]").waitFor({ state: "visible" });
      assert.equal(await group.locator("[data-dropdown-panel]").isVisible(), true);
      await page.waitForFunction(() => document.activeElement?.matches(".site-nav__group--linked .site-nav__dropdown-link"));
      assert.equal(await group.locator(".site-nav__dropdown-link").first().evaluate(el => el === document.activeElement), true, "ArrowDown focuses the first research menu entry");
      await page.keyboard.press("Escape");
      await group.locator("[data-dropdown-panel]").waitFor({ state: "hidden" });
      assert.equal(await group.locator("[data-dropdown-panel]").isVisible(), false, "Escape closes the research menu");
      assert.equal(await toggle.evaluate(el => el === document.activeElement), true);
    }
    await nav.getByRole("link", { name: locale === "zh" ? "前沿研究" : "Frontier Research", exact: true }).click();
    await page.waitForURL(`**${prefix}/nuwa`);
    assert.ok(await page.locator('main a[href="'+prefix+'/nuwa/research"]').count() > 0);
    await page.goto(`${baseUrl}${prefix}/nuwa/whitzard-index`, { waitUntil: "domcontentloaded" });
    assert.equal(await page.locator("h1").innerText(), "NUWA Index");
    assert.match(await page.locator("main").innerText(), locale === "zh" ? /建设中/ : /Under construction/);
    assert.equal(await page.locator("main canvas, main svg, main table, main astro-island").count(), 0);
    assert.deepEqual(errors, []);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  } finally { await context.close(); }
}
