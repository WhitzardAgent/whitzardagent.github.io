import assert from "node:assert/strict";

// Use the existing QA browser. No new runtime or test dependency.
export async function checkProductsBrowser(browser, baseUrl) {
  const errors = [];
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  await context.route("https://cloud.umami.is/**", route => route.abort());
  const page = await context.newPage();
  page.on("pageerror", error => errors.push(error.message));
  let layouts = 0;
  try {
    for (const width of [1440, 1024, 900, 808, 390]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const prefix of ["", "/en"]) {
        for (const route of ["/", "/gateway", "/agentguard", "/solutions"]) {
          await page.goto(`${baseUrl}${prefix}${route}`, { waitUntil: "domcontentloaded" });
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${prefix}${route} overflow at ${width}`);
          assert.equal(await page.locator("main h1").count(), 1);
          assert.equal(await page.locator(".home-runtime-details, .boundary-flow, .risk-simulator, .ag-system-map, .influence-engine").count(), 0);
          assert.doesNotMatch(await page.locator("main").innerText(), /执行模拟|模拟运行中|Run simulation|Simulation running/);
          if (route === "/") {
            const cards = page.locator(".home-product-pair > article");
            assert.equal(await cards.count(), 2);
            const [first, second] = await Promise.all([cards.nth(0).boundingBox(), cards.nth(1).boundingBox()]);
            assert.ok(Math.abs(first.width - second.width) < 2, "equal product widths");
            assert.ok(width >= 1024 ? Math.abs(first.y - second.y) < 2 : second.y >= first.y + first.height, "responsive product arrangement");
            for (const img of await cards.locator("img").all()) {
              await img.scrollIntoViewIfNeeded();
              await img.evaluate(el => el.decode());
              assert.ok(await img.evaluate(el => Math.abs(el.width / el.height - el.naturalWidth / el.naturalHeight) < .01), "uncropped real screenshot");
            }
            assert.equal(await page.locator('.brand-hero__actions a[href="#products"]').count(), 1);
          }
          if (route === "/gateway") {
            assert.equal(await page.locator("main form, main input, main astro-island").count(), 0, "static product page, no imitation login");
            assert.match(await page.locator("figcaption").innerText(), prefix ? /Shown in Chinese/ : /登录界面/);
            assert.match(await page.locator(".gateway-access").innerText(), prefix ? /planned/ : /计划/);
            assert.equal(await page.locator('link[rel="canonical"]').getAttribute("href"), `https://whitzard.tech${prefix}/gateway`);
            assert.equal(await page.locator(".language-switch").getAttribute("href"), prefix ? "/gateway" : "/en/gateway");
          }
          if (route === "/agentguard") {
            for (const id of ["system-map", "engine", "runtime"]) assert.equal(await page.locator(`#${id}`).count(), 1);
            assert.equal(await page.locator("video[autoplay], .ag-trust__signal").count(), 0);
            assert.equal(await page.locator(".ag-trust__runtime").evaluate(el => getComputedStyle(el, "::after").animationName), "none");
          }
          layouts++;
        }
      }
    }
    for (const prefix of ["", "/en"]) {
      await page.goto(`${baseUrl}${prefix}/gateway`, { waitUntil: "domcontentloaded" });
      await page.locator(".language-switch").click();
      await page.waitForURL(url => url.pathname === (prefix ? "/gateway" : "/en/gateway"));
      await page.goto(`${baseUrl}${prefix}/waitlist`, { waitUntil: "domcontentloaded" });
      await page.locator("astro-island:not([ssr])").first().waitFor({ state: "attached" });
      for (const [name, value] of [["name", "QA Preview"], ["email", "preview@example.com"], ["organization", "Preview team"], ["role", "Reviewer"]]) await page.locator(`[name="${name}"]`).fill(value);
      await page.getByRole("button", { name: prefix ? /^Continue/ : /^继续/ }).click();
      await page.locator('select[name="interest"]').selectOption("WhitzardGateway");
      assert.equal(await page.locator('select[name="interest"]').inputValue(), "WhitzardGateway");
      // Never submit the form or send a real request during QA.
    }
  } finally { await context.close(); }

  for (const options of [{ javaScriptEnabled: false }, { reducedMotion: "reduce" }]) {
    const fallback = await browser.newContext({ ...options, viewport: { width: 390, height: 844 } });
    await fallback.route("https://cloud.umami.is/**", route => route.abort());
    const view = await fallback.newPage();
    try {
      for (const prefix of ["", "/en"]) {
        await view.goto(`${baseUrl}${prefix}/`, { waitUntil: "domcontentloaded" });
        assert.equal(await view.locator(".home-product-pair > article:visible").count(), 2);
        await view.goto(`${baseUrl}${prefix}/gateway`, { waitUntil: "domcontentloaded" });
        assert.equal(await view.locator(".gateway-columns article:visible").count(), 3);
        assert.equal(await view.locator(".gateway-scenarios article:visible").count(), 3);
        await view.goto(`${baseUrl}${prefix}/agentguard`, { waitUntil: "domcontentloaded" });
        assert.equal(await view.locator(".ag-controls__grid article:visible").count(), 3);
        if (options.javaScriptEnabled === false) {
          await view.goto(`${baseUrl}${prefix}/solutions`, { waitUntil: "domcontentloaded" });
          assert.equal(await view.locator(".use-case-explorer__content:visible").count(), 4);
        }
      }
    } finally { await fallback.close(); }
  }
  assert.deepEqual(errors, [], "no browser runtime errors");
  return { layouts, bilingualGatewayForms: 2, noJavaScript: true, reducedMotion: true, errors };
}
