import assert from "node:assert/strict";

export async function checkResearchHighlightsBrowser(browser, baseUrl) {
  const results = [];
  for (const locale of ["zh", "en"]) for (const width of [1440, 900, 808, 390]) {
    const prefix = locale === "en" ? "/en" : "";
    const context = await browser.newContext({ viewport: { width, height: 1000 }, hasTouch: width === 390, reducedMotion: "reduce" });
    await context.route("https://cloud.umami.is/**", route => route.abort());
    const page = await context.newPage();
    page.setDefaultTimeout(6000);
    const errors = [];
    page.on("pageerror", e => errors.push(e.message));
    try {
      for (const path of ["/", "/nuwa", "/nuwa/research", "/news", "/nuwa/blog/agentcyberrange", "/nuwa/whitzard-index"]) {
        await page.goto(`${baseUrl}${prefix}${path}`, { waitUntil: "domcontentloaded" });
        if (path === "/nuwa/research") await page.locator("astro-island:not([ssr])").waitFor({ state: "attached" });
        await page.evaluate(() => document.fonts.ready);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${locale}/${width}${path} overflow`);
        const text = await page.locator("main").innerText();
        assert.doesNotMatch(text, /96\s*(家|organizations)|白泽指数|Whitzard Index/);
        assert.equal(await page.locator('link[rel="canonical"]').getAttribute("href"), `https://whitzard.tech${prefix}${path === "/" && locale === "en" ? "/" : path}`);
        if (["/", "/nuwa", "/nuwa/research"].includes(path)) {
          assert.equal(await page.locator('[data-highlight-id="agentcyberrange"]').count(), 1);
          assert.match(text, /100\+/);
        }
        if (path === "/") {
          assert.equal(await page.locator('.home-latest a[href*="/nuwa/blog/agentcyberrange"]').count(), 0);
          assert.equal(await page.locator(".research-logo-wall li").count(), 6);
        }
        if (path === "/news") {
          assert.equal(await page.locator(`.news-card[href="${prefix}/nuwa/blog/agentcyberrange"] img`).count(), 1);
        }
        if (path === "/nuwa/blog/agentcyberrange") {
          assert.equal(await page.locator(".research-logo-wall li").count(), 23);
          assert.match(await page.locator(".rb-companion").innerText(), locale === "zh" ? /项目与资源/ : /Project & resources/i);
          assert.match(text, /200\+/);
          for (const image of await page.locator(".research-logo-wall img, .rb-cover img").all()) {
            await image.scrollIntoViewIfNeeded();
            await image.evaluate(img => img.decode());
          }
          const broken = await page.locator("main img").evaluateAll(imgs => imgs.filter(img => img.complete && !img.naturalWidth).length);
          assert.equal(broken, 0);
          if (width === 390) {
            await page.locator(".research-logo-wall").scrollIntoViewIfNeeded();
            await page.screenshot({ path: `/tmp/nuwa-logos-${locale}-mobile.png` });
          }
        }
        if (path === "/nuwa/whitzard-index") {
          assert.equal(await page.locator("h1").innerText(), "NUWA Index");
          assert.match(text, locale === "zh" ? /建设中/ : /Under construction/);
          assert.equal(await page.locator("main table, main svg, main astro-island").count(), 0);
        }
        results.push({ locale, width, path });
      }

      await page.goto(`${baseUrl}${prefix}/nuwa/research?kind=technical-report`, { waitUntil: "domcontentloaded" });
      await page.locator("astro-island:not([ssr])").waitFor({ state: "attached" });
      assert.equal(await page.locator('.research-card[data-research-kind="technical-report"]').count(), 6);
      assert.equal(await page.getByRole("button", { name: "Publications", exact: true }).getAttribute("aria-pressed"), "true");
      await page.getByRole("button", { name: "Publications", exact: true }).click();
      assert.equal(await page.locator(".research-card:not(.research-card--blog)").count(), 86);
      await page.getByRole("button", { name: "Blogs", exact: true }).click();
      assert.equal(await page.locator(".research-card--blog").count(), 3);
      assert.equal(await page.locator(".research-card:not(.research-card--blog)").count(), 0);
      await page.locator(".research-card--blog").filter({ hasText: "AgentCyberRange" }).locator(".research-card__tags button").first().click();
      assert.equal(await page.locator(".research-card--blog").count(), 1);
      await page.reload({ waitUntil: "domcontentloaded" });
      await page.locator("astro-island:not([ssr])").waitFor({ state: "attached" });
      assert.equal(await page.locator(".research-card--blog").count(), 1);
      await page.getByRole("button", { name: "Publications", exact: true }).click();
      await page.goBack();
      assert.equal(await page.locator(".research-card--blog").count(), 1);

      await page.goto(`${baseUrl}${prefix}/nuwa`, { waitUntil: "domcontentloaded" });
      await page.locator(".site-nav__group--research[data-dropdown-enhanced]").waitFor({ state: "attached" });
      if (width === 1440) {
        const group = page.locator(".site-nav__group--research");
        const toggle = group.locator("[data-dropdown-toggle]");
        await toggle.focus(); await toggle.press("ArrowDown");
        await page.waitForFunction(() => document.activeElement?.matches(".site-nav__lab-intro"));
        assert.equal(await group.locator('[role="menuitem"]').count(), 4);
        assert.equal(await group.locator(".site-nav__dropdown").evaluate(el => getComputedStyle(el).gridTemplateColumns.split(" ").length), 1);
        await page.screenshot({ path: `/tmp/nuwa-navigation-${locale}.png` });
        await page.keyboard.press("Escape");
        assert.equal(await toggle.getAttribute("aria-expanded"), "false");
        await page.waitForFunction(() => document.activeElement?.matches(".site-nav__group--research [data-dropdown-toggle]"));
      } else {
        await page.locator(".menu-toggle").click();
        const group = page.locator(".mobile-nav__group--research");
        await group.locator("[data-mobile-parent]").click();
        assert.equal(await group.locator(".mobile-navigation__sublink").count(), 4);
        await group.getByRole("link", { name: "NUWA Index", exact: true }).click();
        await page.waitForURL(`**${prefix}/nuwa/whitzard-index`);
        assert.equal(await page.locator(".menu-toggle").getAttribute("aria-expanded"), "false");
      }

      await page.goto(`${baseUrl}${prefix}/nuwa/blog`, { waitUntil: "domcontentloaded" });
      await page.waitForURL(`**${prefix}/nuwa/research?kind=blogs`);
      await page.locator("astro-island:not([ssr])").waitFor({ state: "attached" });
      assert.equal(await page.locator(".research-card--blog").count(), 3);
      await page.goto(`${baseUrl}${prefix}/nuwa`, { waitUntil: "domcontentloaded" });
      await page.locator(".research-highlight").scrollIntoViewIfNeeded();
      await page.screenshot({ path: `/tmp/nuwa-highlight-${locale}-${width}.png` });
      assert.deepEqual(errors, [], `${locale}/${width} console errors`);
    } finally { await context.close(); }
  }
  for (const locale of ["zh", "en"]) {
    const prefix = locale === "en" ? "/en" : "";
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 1000 } });
    const page = await context.newPage();
    try {
      await page.goto(`${baseUrl}${prefix}/nuwa/research`);
      assert.equal(await page.locator(".research-card:not(.research-card--blog)").count(), 86);
      assert.equal(await page.locator(".research-card--blog").count(), 3);
      assert.equal(await page.locator(".research-filters").isVisible(), false);
      await page.goto(`${baseUrl}${prefix}/nuwa/blog/agentcyberrange`);
      assert.equal(await page.locator(".research-logo-wall li").count(), 23);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    } finally { await context.close(); }
  }
  return { layouts: results.length, localeWidths: 8, noJavaScript: 2 };
}
