import assert from "node:assert/strict";

export async function checkNavigationBrowser(browser, baseUrl) {
  let desktopCases = 0;
  for (const locale of ["zh", "en"]) for (const width of [1440, 1280]) {
    const prefix = locale === "en" ? "/en" : "";
    const context = await browser.newContext({ viewport: { width, height: 1000 } });
    await context.route("https://cloud.umami.is/**", route => route.abort());
    const page = await context.newPage();
    page.setDefaultTimeout(6000);
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    try {
      await page.goto(`${baseUrl}${prefix}/`, { waitUntil: "domcontentloaded" });
      await page.locator("[data-dropdown-enhanced]").first().waitFor();
      const groups = page.locator(".site-nav [data-dropdown]");
      for (const group of await groups.all()) {
        const toggle = group.locator("[data-dropdown-toggle]");
        const panel = group.locator("[data-dropdown-panel]");
        const triggerBox = await group.boundingBox();
        await page.mouse.move(triggerBox.x + triggerBox.width / 2, triggerBox.y + triggerBox.height / 2);
        await page.waitForFunction(el => el.classList.contains("is-open"), await group.elementHandle());
        await page.waitForTimeout(260);
        const panelBox = await panel.boundingBox();
        // A slow trip through the visual gap must not dismiss the menu.
        await page.mouse.move(triggerBox.x + triggerBox.width / 2, (triggerBox.y + triggerBox.height + panelBox.y) / 2, { steps: 8 });
        await page.waitForTimeout(420);
        assert.equal(await toggle.getAttribute("aria-expanded"), "true", "hover bridge remains interactive");
        const last = panel.locator("a").last();
        const box = await last.boundingBox();
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 18 });
        await page.waitForTimeout(260);
        assert.equal(await last.isVisible(), true, "diagonal movement reaches the last menu item");
        await page.mouse.move(20, 400);
        await page.waitForTimeout(80);
        assert.equal(await toggle.getAttribute("aria-expanded"), "true", "brief pointer exit has a grace period");
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.waitForTimeout(300);
        assert.equal(await toggle.getAttribute("aria-expanded"), "true", "reentry cancels pending dismissal");
        await page.mouse.move(20, 400);
        await page.waitForTimeout(350);
        assert.equal(await toggle.getAttribute("aria-expanded"), "false", "hover-only menu closes after departure");
        await toggle.click();
        await page.mouse.move(20, 400);
        await page.waitForTimeout(350);
        assert.equal(await toggle.getAttribute("aria-expanded"), "true", "first click pins rather than closes a hover-open menu");
        await toggle.click();
        assert.equal(await toggle.getAttribute("aria-expanded"), "false", "second click dismisses");
        await toggle.click();
        await page.mouse.click(20, 400);
        assert.equal(await toggle.getAttribute("aria-expanded"), "false", "outside click dismisses");
        await toggle.focus();
        await toggle.press("ArrowDown");
        await page.waitForFunction(el => document.activeElement === el, await panel.locator("a").first().elementHandle());
        await page.mouse.move(20, 400);
        await page.waitForTimeout(350);
        assert.equal(await toggle.getAttribute("aria-expanded"), "true", "keyboard focus is not dismissed by the pointer");
        await page.keyboard.press("Escape");
        assert.equal(await toggle.getAttribute("aria-expanded"), "false");
        assert.equal(await toggle.evaluate(el => document.activeElement === el), true, "Escape restores trigger focus");
        await toggle.press("ArrowDown");
        await last.focus();
        await page.keyboard.press("Tab");
        assert.equal(await toggle.getAttribute("aria-expanded"), "false", "Tab out dismisses the old menu");
        desktopCases++;
        await page.mouse.click(20, 400);
      }
      const research = page.locator(".site-nav__group--research");
      const products = groups.first();
      await products.hover();
      await research.hover();
      assert.equal(await page.locator(".site-nav .is-open[data-dropdown]").count(), 1, "switching categories leaves one menu open");
      const destination = research.locator('a[role="menuitem"]').filter({ hasText: "Blogs" });
      await destination.click();
      await page.waitForURL(url => url.pathname === `${prefix}/nuwa/research` && url.searchParams.get("kind") === "blogs");
      assert.deepEqual(errors, []);
    } finally { await context.close(); }
  }
  for (const javaScriptEnabled of [true, false]) {
    const context = await browser.newContext({ javaScriptEnabled, hasTouch: true, viewport: { width: 390, height: 844 } });
    await context.route("https://cloud.umami.is/**", route => route.abort());
    const page = await context.newPage();
    try {
      await page.goto(`${baseUrl}/nuwa`, { waitUntil: "domcontentloaded" });
      if (javaScriptEnabled) {
        await page.locator("[data-dropdown-enhanced]").first().waitFor({ state: "attached" });
        await page.locator(".menu-toggle").tap();
        await page.locator(".mobile-nav__group--research [data-mobile-parent]").tap();
        await page.locator(".mobile-nav__group--research").getByRole("link", { name: "Blogs", exact: true }).tap();
        await page.waitForURL(url => url.searchParams.get("kind") === "blogs");
        assert.equal(await page.locator(".menu-toggle").getAttribute("aria-expanded"), "false");
      } else {
        await page.setViewportSize({ width: 1440, height: 1000 });
        const research = page.locator(".site-nav__group--research");
        await research.locator("button").focus();
        assert.equal(await research.locator('[role="menu"]').isVisible(), true, "CSS focus fallback remains available without JS");
      }
    } finally { await context.close(); }
  }
  return { desktopCases, touchAndNoJsCases: 2 };
}
