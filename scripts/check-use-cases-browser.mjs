import assert from "node:assert/strict";

export async function checkUseCasesBrowser(browser, baseUrl) {
  const errors = [];
  const context = await browser.newContext();
  await context.route("https://cloud.umami.is/**", route => route.abort());
  const page = await context.newPage();
  page.on("pageerror", error => errors.push(error.message));
  let layouts = 0;
  try {
    for (const width of [1440, 1024, 900, 808, 390]) for (const prefix of ["", "/en"]) for (const route of ["/", "/solutions", "/agentguard"]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(`${baseUrl}${prefix}${route}`, { waitUntil: "domcontentloaded" });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${prefix}${route}: overflow at ${width}`);
      const section = page.locator(route === "/" ? "home-applications" : route === "/solutions" ? ".use-case-explorer" : ".ag-product-use-cases");
      const names = prefix ? ["Office productivity", "Development & operations", "Computer-use agents", "AI workflows"] : ["通用办公", "开发运维", "GUI 智能体", "AI 工作流"];
      for (const name of names) assert.ok((await section.textContent()).includes(name));
      if (route !== "/agentguard") {
        assert.equal(await section.locator(".security-dimensions").count(), 4);
        for (const list of await section.locator(".security-dimensions").all()) assert.equal(await list.locator("li").count(), 4);
      }
      if (route === "/solutions") {
        assert.equal(await page.locator(".use-case-controls__list article").count(), 4);
        for (const article of await page.locator(".use-case-controls__list article").all()) assert.equal(await article.locator("a").count(), 2);
      }
      layouts++;
    }
    for (const prefix of ["", "/en"]) {
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.goto(`${baseUrl}${prefix}/solutions`, { waitUntil: "domcontentloaded" });
      const tabs = page.locator(".use-case-explorer [role=tab]");
      await tabs.first().waitFor();
      await tabs.nth(0).click();
      await tabs.nth(0).press("ArrowRight");
      assert.equal(await tabs.nth(1).getAttribute("aria-selected"), "true");
      await tabs.nth(1).press("End");
      assert.equal(await tabs.nth(3).getAttribute("aria-selected"), "true");
      await tabs.nth(3).press("Home");
      assert.equal(await tabs.nth(0).getAttribute("aria-selected"), "true");
      await tabs.nth(0).press("Tab");
      assert.equal(await page.locator(".use-case-explorer [role=tabpanel]:visible").evaluate(el => el === document.activeElement), true);
      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForFunction(() => document.querySelectorAll(".use-case-explorer__panel:not([hidden])").length === 4);
      assert.equal(await page.locator(".use-case-explorer__panel:visible").count(), 4);
      await page.goto(`${baseUrl}${prefix}/agentguard`, { waitUntil: "domcontentloaded" });
      await page.locator(".ag-product-use-cases a").nth(2).click();
      await page.waitForURL(url => url.pathname === `${prefix}/solutions` && url.hash === "#use-case-03");
      assert.equal(await page.locator("#use-case-03 h3").textContent(), prefix ? "Computer-use agents" : "GUI 智能体");
    }
    assert.deepEqual(errors, []);
  } finally { await context.close(); }

  for (const options of [{ javaScriptEnabled: false }, { reducedMotion: "reduce" }]) {
    const fallback = await browser.newContext({ ...options, viewport: { width: 390, height: 844 } });
    await fallback.route("https://cloud.umami.is/**", route => route.abort());
    const view = await fallback.newPage();
    try {
      for (const prefix of ["", "/en"]) for (const route of ["/", "/solutions"]) {
        await view.goto(`${baseUrl}${prefix}${route}`, { waitUntil: "domcontentloaded" });
        const selector = route === "/" ? ".home-applications__panel" : ".use-case-explorer__panel";
        assert.equal(await view.locator(`${selector}:visible`).count(), 4);
        assert.equal(await view.locator(`${selector}:visible .security-dimensions li`).count(), 16);
      }
    } finally { await fallback.close(); }
  }
  return { layouts, bilingualKeyboardAndLinks: true, noJavaScript: true, reducedMotion: true, errors };
}
