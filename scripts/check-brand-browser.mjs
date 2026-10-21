// Run with an existing Playwright browser; no website/runtime dependency added.
import assert from "node:assert/strict";

export async function checkBrandBrowser(browser, baseUrl, { widths = [1440, 1024, 900, 808, 390], interactions = true } = {}) {
  const routes = ["/", "/agentguard", "/gateway", "/models", "/nuwa", "/open-ecosystem", "/nuwa/whitzard-index", "/about", "/nuwa/research", "/news", "/waitlist", "/login", "/solutions"];
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  // Third-party analytics must not make local functional checks nondeterministic.
  await context.route("https://cloud.umami.is/**", route => route.abort());
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  let combinations = 0;
  try {
    for (const width of widths) {
      await page.setViewportSize({ width, height: 1000 });
      for (const locale of ["", "/en"]) {
        for (const route of routes) {
          const pathname = locale + route;
          await page.goto(new URL(pathname, baseUrl).href, { waitUntil: "domcontentloaded" });
          await page.waitForFunction(() => Array.from(document.images).every(img => img.loading === "lazy" || img.complete));
          assert.equal(await page.locator("main h1").count(), 1, `${pathname}: one content H1`);
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth) <= 1, `${pathname} at ${width}px: horizontal overflow`);
          assert.equal(await page.locator("footer").getByText("上海白泽驭智科技有限公司", { exact: true }).count(), 1, `${pathname}: formal company identity`);
          assert.equal(await page.locator("html").getAttribute("lang"), locale ? "en" : "zh-CN");
          assert.equal(await page.locator('link[rel="canonical"]').getAttribute("href"), `https://whitzard.tech${pathname}`);
          assert.equal(await page.locator('link[hreflang="zh-CN"]').getAttribute("href"), `https://whitzard.tech${route}`);
          assert.equal(await page.locator('link[hreflang="en"]').getAttribute("href"), `https://whitzard.tech/en${route}`);
          assert.ok(await page.locator('script[type="application/ld+json"]').evaluateAll(scripts => scripts.some(script => JSON.parse(script.textContent).legalName === "上海白泽驭智科技有限公司")));
          combinations++;
        }
      }
    }

    if (!interactions) return { combinations, errors };

    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(new URL("/", baseUrl).href, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => document.querySelector("home-applications")?.getAttribute("data-enhanced") === "desktop");
    const firstTab = page.getByRole("tab", { name: /通用办公/ });
    await firstTab.click();
    await firstTab.press("ArrowRight");
    assert.match(await page.locator("home-applications [aria-selected=true]").innerText(), /开发运维/);
    assert.equal(await page.locator(".home-applications__panel:visible").count(), 1);
    await page.locator("home-applications [aria-selected=true]").press("End");
    assert.match(await page.locator("home-applications [aria-selected=true]").innerText(), /AI 工作流/);
    await page.keyboard.press("Tab");
    assert.ok(await page.getByRole("tabpanel").evaluate(panel => panel === document.activeElement), "keyboard reaches selected use-case content");
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await page.locator(".home-applications__panel:visible").count(), 4, "mobile retains all use cases");

    await page.goto(new URL("/nuwa/whitzard-index", baseUrl).href, { waitUntil: "domcontentloaded" });
    assert.match(await page.locator("main").innerText(), /NUWA Index[\s\S]*建设中/);
    assert.equal(await page.locator("main astro-island, main table, main svg").count(), 0, "index does not render withdrawn evidence");

    await page.goto(new URL("/waitlist", baseUrl).href, { waitUntil: "domcontentloaded" });
    await page.locator("astro-island:not([ssr])").first().waitFor({ state: "attached" });
    await page.getByRole("button", { name: /^继续/ }).click();
    assert.equal(await page.getByRole("alert").count(), 4, "required fields prevent advancing");

    await page.goto(new URL("/", baseUrl).href, { waitUntil: "domcontentloaded" });
    const menu = page.getByRole("button", { name: "打开导航" });
    await menu.click();
    assert.equal(await page.locator(".menu-toggle").getAttribute("aria-expanded"), "true");
    await page.waitForFunction(() => document.querySelector(".mobile-navigation")?.contains(document.activeElement));
    await page.locator(".menu-toggle").focus();
    await page.keyboard.press("Shift+Tab");
    assert.ok(await page.locator(".mobile-navigation").evaluate(panel => panel.contains(document.activeElement)), "mobile menu wraps focus");
    await page.keyboard.press("Tab");
    assert.ok(await page.locator(".menu-toggle").evaluate(button => button === document.activeElement));
    await page.locator(".menu-toggle").press("Escape");
    assert.equal(await page.locator(".menu-toggle").getAttribute("aria-expanded"), "false");
    await page.locator(".language-switch").click();
    await page.waitForURL(url => url.pathname === "/en/");
    await page.waitForFunction(() => document.documentElement.lang === "en");
    await page.locator(".language-switch").click();
    await page.waitForURL(url => url.pathname === "/");
    await page.waitForFunction(() => document.documentElement.lang === "zh-CN");
    await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
    await page.waitForFunction(() => document.querySelector("hero-motion-controller")?.getAttribute("data-motion-active") === "false");
    assert.equal(await page.locator(".brand-hero>.brand-artwork").evaluate(el => getComputedStyle(el).animationPlayState), "paused", "offscreen hero pauses");
    assert.deepEqual(errors, [], "no browser runtime errors");
  } finally {
    await context.close();
  }

  const staticContext = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  await staticContext.route("https://cloud.umami.is/**", route => route.abort());
  const staticPage = await staticContext.newPage();
  try {
    await staticPage.goto(new URL("/", baseUrl).href);
    assert.equal(await staticPage.locator(".home-applications__panel:visible").count(), 4, "no-JS use cases remain complete");
    await staticPage.goto(new URL("/nuwa/whitzard-index", baseUrl).href);
    assert.match(await staticPage.locator("main").innerText(), /建设中/);
    assert.equal(await staticPage.locator("main astro-island, main table").count(), 0);
  } finally {
    await staticContext.close();
  }

  const reducedContext = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 1000 } });
  await reducedContext.route("https://cloud.umami.is/**", route => route.abort());
  const reducedPage = await reducedContext.newPage();
  try {
    await reducedPage.goto(new URL("/", baseUrl).href, { waitUntil: "domcontentloaded" });
    assert.equal(await reducedPage.locator(".brand-hero>.brand-artwork").evaluate(el => getComputedStyle(el).animationName), "none");
    assert.equal(await reducedPage.locator(".home-runtime-details, .boundary-flow").count(), 0, "simulated execution is removed");
    assert.equal(await reducedPage.locator(".home-product-pair > article").count(), 2);
    assert.equal(await reducedPage.locator(".home-product-screen").first().evaluate(el => getComputedStyle(el).transform), "none", "real screenshots remain undistorted");
  } finally {
    await reducedContext.close();
  }
  const touchContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await touchContext.route("https://cloud.umami.is/**", route => route.abort());
  const touchPage = await touchContext.newPage();
  try {
    await touchPage.goto(new URL("/nuwa/whitzard-index", baseUrl).href, { waitUntil: "domcontentloaded" });
    await touchPage.getByRole("link", { name: "返回女娲实验室 →", exact: true }).tap();
    await touchPage.waitForURL("**/nuwa");
  } finally { await touchContext.close(); }
  return { combinations, keyboard: true, mobile: true, noJavaScript: true, reducedMotion: true, errors: [] };
}
