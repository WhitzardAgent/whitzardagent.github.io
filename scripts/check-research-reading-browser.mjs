import assert from "node:assert/strict";

export async function checkResearchReadingBrowser(browser, baseUrl) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  await context.route("https://cloud.umami.is/**", route => route.abort());
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  let layouts = 0;
  const articlePath = "/nuwa/blog/agentcyberrange";
  try {
    for (const width of [1440, 1200, 1024, 900, 808, 390]) for (const prefix of ["", "/en"]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const route of ["/", "/nuwa", "/nuwa/research", "/nuwa/research?kind=blogs", "/news", articlePath, "/nuwa/blog/self-replication"]) {
        const response = await page.goto(`${baseUrl}${prefix}${route}`, { waitUntil: "domcontentloaded" });
        assert.equal(response.status(), 200);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${prefix}${route} overflow at ${width}`);
        assert.equal(await page.locator("main h1").count(), 1);
        if (route === "/") {
          const hero = await page.locator(".brand-hero--home").evaluate(el => {
            const rect = el.getBoundingClientRect(), mark = el.querySelector(".brand-hero__signature");
            const signature = mark.getBoundingClientRect(), actions = el.querySelector(".brand-hero__actions").getBoundingClientRect();
            const style = getComputedStyle(mark);
            return { height: rect.height, clear: signature.top > actions.bottom && signature.bottom <= rect.bottom, color: style.color, background: style.backgroundColor, border: style.borderWidth, shadow: style.boxShadow };
          });
          assert.ok(hero.height <= 760 && hero.clear, `compact home hero and visible signature: ${prefix}/${width}`);
          assert.equal(hero.color, "rgb(255, 255, 255)");
          assert.equal(hero.background, "rgba(0, 0, 0, 0)");
          assert.equal(hero.border, "0px");
          assert.equal(hero.shadow, "none", "no signature background frame or box shadow");
        }
        if (route.startsWith("/nuwa/research")) {
          const frames = await page.locator(".research-card__teaser").evaluateAll(nodes => nodes.map(node => {
            const frame = node.getBoundingClientRect(), image = node.querySelector("img").getBoundingClientRect();
            return { height: frame.height, contained: image.top >= frame.top && image.bottom <= frame.bottom && image.left >= frame.left && image.right <= frame.right };
          }));
          const expectedHeight = width <= 700 ? 200 : width <= 980 ? 216 : 248;
          assert.ok(frames.length && frames.every(frame => Math.abs(frame.height - expectedHeight) < 1 && frame.contained), `uniform teaser frames with no escaping images: ${prefix}/${width}`);
          for (const preview of await page.locator("a.research-card__teaser").all()) {
            assert.match(await preview.getAttribute("href"), /^https?:\/\//, "preview keeps its original full paper source");
          }
        }
        if (route.includes("/nuwa/blog/")) {
          assert.equal(await page.locator(".rb-toc__desktop").isVisible(), width >= 1200);
          assert.equal(await page.locator(".rb-toc__mobile").isVisible(), width < 1200);
          const links = await page.locator(".rb-toc__desktop a").first().getAttribute("href");
          assert.ok(links?.startsWith("#"));
          assert.equal(await page.locator(".rb-companion").evaluate(el => getComputedStyle(el).position), "static");
          assert.ok(await page.locator(".rb-prose").evaluate(el => el.getBoundingClientRect().width) <= 1000);
          if (route === articlePath) {
            assert.equal(await page.locator(".rb-prose .rb-figure").count(), 3);
            assert.equal(await page.locator('.rb-prose img[src$="results-comparison.webp"]').count(), 1, "no repeated cover");
            assert.match(await page.locator('meta[property="og:image"]').getAttribute("content"), /results-comparison.webp$/);
          }
          const validAnchors = await page.locator(".rb-toc a").evaluateAll(anchors => anchors.every(anchor => document.getElementById(decodeURIComponent(anchor.hash.slice(1)))));
          assert.ok(validAnchors, "all heading anchors exist");
        } else {
          const selector = route === "/news" ? '.news-card[href*="/nuwa/blog/agentcyberrange"] img' : '[data-highlight-id="agentcyberrange"] img';
          assert.match(await page.locator(selector).first().getAttribute("src"), /results-comparison/);
        }
        layouts++;
      }
    }
    for (const prefix of ["", "/en"]) {
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.goto(`${baseUrl}${prefix}${articlePath}`, { waitUntil: "domcontentloaded" });
      await page.evaluate(() => document.fonts.ready);
      const links = page.locator(".rb-toc__desktop a");
      const firstId = await links.nth(1).getAttribute("data-section");
      const secondId = await links.nth(2).getAttribute("data-section");
      await links.nth(1).focus();
      await links.nth(1).press("Enter");
      await page.waitForFunction(id => document.querySelector('.rb-toc__desktop a[aria-current="location"]')?.getAttribute("data-section") === id, firstId);
      assert.ok(await page.locator(`[id="${firstId}"]`).evaluate(el => el.getBoundingClientRect().top) >= 80, "navigation does not cover target");
      await links.nth(2).click();
      await page.waitForFunction(id => document.querySelector('.rb-toc__desktop a[aria-current="location"]')?.getAttribute("data-section") === id, secondId);
      await page.goBack();
      await page.waitForURL(url => decodeURIComponent(url.hash.slice(1)) === firstId);
      await page.goForward();
      await page.waitForURL(url => decodeURIComponent(url.hash.slice(1)) === secondId);
      for (const image of await page.locator(".rb-figure img").all()) {
        await image.scrollIntoViewIfNeeded();
        await image.evaluate(el => el.decode());
        assert.ok(await image.evaluate(el => el.naturalWidth > 0 && Math.abs(el.width / el.height - el.naturalWidth / el.naturalHeight) < .01), "uncropped image");
      }
      const original = page.locator(".rb-figure__original").first();
      await original.focus();
      const popupPromise = context.waitForEvent("page");
      await original.press("Enter");
      const popup = await popupPromise;
      await popup.waitForLoadState("domcontentloaded");
      assert.match(popup.url(), /results-comparison-original.png$/);
      await popup.close();
      await page.locator(".rb-toc__desktop").evaluate(el => {
        const list = el.querySelector("ol"), last = list.lastElementChild;
        for (let i = 0; i < 40; i++) list.append(last.cloneNode(true));
        list.scrollTop = list.scrollHeight;
      });
      assert.ok(await page.locator(".rb-toc__desktop ol").evaluate(el => el.scrollHeight > el.clientHeight && el.scrollTop > 0), "long contents scrolls internally");
      await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(300);
      assert.ok(await page.locator(".rb-toc").evaluate(el => el.getBoundingClientRect().bottom <= el.closest(".rb-article__layout").getBoundingClientRect().bottom + 1), "contents stays inside article");

      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(`${baseUrl}${prefix}${articlePath}`, { waitUntil: "domcontentloaded" });
      await page.locator(".rb-toc__mobile summary").press("Enter");
      assert.equal(await page.locator(".rb-toc__mobile").getAttribute("open"), "");
      await page.locator(".rb-toc__mobile a").nth(2).click();
      await page.waitForURL(url => decodeURIComponent(url.hash.slice(1)) === secondId);
      assert.equal(await page.locator(".rb-toc__mobile").getAttribute("open"), null);
      await page.waitForFunction(id => document.querySelector('.rb-toc__mobile a[aria-current="location"]')?.getAttribute("data-section") === id, secondId);
      await page.waitForFunction(id => {
        const heading = document.getElementById(id);
        return Math.abs(heading.getBoundingClientRect().top - parseFloat(getComputedStyle(heading).scrollMarginTop)) < 2;
      }, secondId);
      await page.reload({ waitUntil: "domcontentloaded" });
      await page.waitForFunction(id => document.querySelector('.rb-toc__mobile a[aria-current="location"]')?.getAttribute("data-section") === id, secondId).catch(async error => {
        const state = await page.evaluate(id => ({ hash: location.hash, scrollY, active: document.querySelector('.rb-toc__mobile a[aria-current]')?.getAttribute("data-section"), targetTop: document.getElementById(id)?.getBoundingClientRect().top, fonts: document.fonts.status, open: document.querySelector(".rb-toc__mobile").open }), secondId);
        throw new Error(`${prefix || "zh"} reload state: ${JSON.stringify(state)}; ${error.message}`);
      });
    }
    assert.deepEqual(errors, []);
  } finally { await context.close(); }

  for (const options of [{ javaScriptEnabled: false }, { reducedMotion: "reduce" }]) {
    const fallback = await browser.newContext({ ...options, viewport: { width: 390, height: 844 } });
    await fallback.route("https://cloud.umami.is/**", route => route.abort());
    const view = await fallback.newPage();
    try {
      for (const prefix of ["", "/en"]) {
        await view.goto(`${baseUrl}${prefix}${articlePath}`, { waitUntil: "domcontentloaded" });
        assert.equal(await view.locator(".rb-figure").count(), 3);
        await view.locator(".rb-toc__mobile summary").click();
        const link = view.locator(".rb-toc__mobile a").nth(1);
        const id = await link.getAttribute("data-section");
        await link.click();
        await view.waitForURL(url => decodeURIComponent(url.hash.slice(1)) === id);
        if (options.reducedMotion) assert.equal(await view.locator("html").evaluate(el => getComputedStyle(el).scrollBehavior), "auto");
        await view.goto(`${baseUrl}${prefix}/nuwa/research`, { waitUntil: "domcontentloaded" });
        await view.waitForLoadState("load");
        assert.equal(await view.locator(".research-card:not(.research-card--blog)").count(), 86, "all original publications remain available");
        assert.ok(await view.locator(".research-card__teaser").evaluateAll(nodes => nodes.every(node => {
          const frame = node.getBoundingClientRect(), image = node.querySelector("img").getBoundingClientRect();
          return Math.abs(frame.height - 200) < 1 && image.top >= frame.top && image.bottom <= frame.bottom;
        })), "fallback research previews remain bounded");
      }
    } finally { await fallback.close(); }
  }
  return { layouts, bilingualContents: true, originalImages: true, history: true, noJavaScript: true, reducedMotion: true, errors };
}
