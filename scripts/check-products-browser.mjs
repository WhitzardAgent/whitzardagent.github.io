import assert from "node:assert/strict";

// Uses the existing QA browser without adding a runtime dependency.
export async function checkProductsBrowser(browser, baseUrl) {
  const ids = ["whitzardaudit", "whitzardgateway", "agentguard", "whitzardeval"];
  const errors = [];
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
  await context.route("https://cloud.umami.is/**", route => route.abort());
  const page = await context.newPage();
  page.on("pageerror", error => errors.push(error.message));
  let layouts = 0;
  try {
    for (const prefix of ["", "/en"]) {
      await page.goto(`${baseUrl}${prefix}/`);
      for (const width of [1440, 1024, 808, 390]) {
        await page.setViewportSize({ width, height: 1000 });
        for (const id of ids) {
          await page.locator(`[data-product-tab="${id}"]`).click();
          const panel = page.locator(`[data-product-panel="${id}"]`);
          assert.ok(await panel.isVisible());
          assert.equal(await page.locator("[data-product-panel]:visible").count(), 1);
          await panel.locator("img").evaluate(image => image.decode());
          assert.ok(await panel.locator("img").evaluate(image => Math.abs(image.clientWidth / image.clientHeight - 4 / 3) < .01), "full screenshot keeps its aspect ratio");
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `overflow at ${width}`);
          layouts++;
        }
      }
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.goto(`${baseUrl}${prefix}/`);
      await page.locator('[data-product-tab="whitzardaudit"]').focus();
      await page.keyboard.press("ArrowRight");
      await page.waitForURL(url => url.hash === "#product-whitzardgateway");
      assert.ok(await page.evaluate(() => history.state !== null), "fragment entry belongs to Astro history");
      await page.locator('.brand-hero a[href$="/contact"]').click();
      await page.waitForURL(url => url.pathname.replace(/\/$/, "").endsWith("/contact"));
      await page.goBack();
      await page.locator("product-showcase").waitFor({ state: "visible" });
      assert.equal(await page.locator('[data-product-tab][aria-selected="true"]').getAttribute("data-product-tab"), "whitzardgateway", "Back restores homepage content and selection");
      await page.goForward();
      await page.locator(".contact-hero").waitFor({ state: "visible" });

      for (const [route, id] of [["agentguard", "agentguard"], ["gateway", "whitzardgateway"]]) {
        await page.goto(`${baseUrl}${prefix}/${route}/`);
        await page.waitForURL(url => url.hash === `#product-${id}`);
        assert.equal(await page.locator(".ag-hero,.gateway-hero").count(), 0);
        assert.equal(await page.locator('[data-product-tab][aria-selected="true"]').getAttribute("data-product-tab"), id);
      }
      await page.locator("[data-language-switch]").click();
      await page.waitForURL(url => url.pathname === (prefix ? "/" : "/en/") && url.hash === "#product-whitzardgateway");
      await page.goto(`${baseUrl}${prefix}/contact/?product=whitzardeval`);
      assert.equal(await page.locator('[data-product-enquiry="whitzardeval"]').getAttribute("aria-current"), "true");
    }
    await page.goto(`${baseUrl}/#product-whitzardeval`);
    await page.locator('[data-product-panel]:visible [data-product-zoom]').first().click();
    assert.equal(await page.locator("dialog[open]").count(), 1);
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("dialog[open]").count(), 0);
  } finally { await context.close(); }

  const fallback = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  try {
    const view = await fallback.newPage();
    for (const prefix of ["", "/en"]) {
      await view.goto(`${baseUrl}${prefix}/`);
      assert.equal(await view.locator("[data-product-panel]:visible").count(), 4);
      assert.ok(await view.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    }
  } finally { await fallback.close(); }
  const touch = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
  try {
    const view = await touch.newPage();
    await view.goto(`${baseUrl}/`);
    await view.locator(".menu-toggle").tap();
    await view.locator("[data-mobile-parent]").first().tap();
    assert.equal(await view.locator(".product-nav__mobile-row:visible").count(), 4);
    await view.locator('.product-nav__mobile-row[href$="#product-agentguard"]').tap();
    assert.equal(await view.locator('.menu-toggle').getAttribute("aria-expanded"), "false");
    assert.equal(await view.locator('[data-product-panel]:visible').getAttribute("data-product-panel"), "agentguard");
  } finally { await touch.close(); }
  assert.deepEqual(errors, [], "no browser runtime errors");
  return { layouts, historyRegression: true, legacyRedirects: true, noJavaScript: true, touch: true, errors };
}
