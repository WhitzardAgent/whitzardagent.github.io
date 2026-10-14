// Run with an existing Playwright browser; no website/runtime dependency added.
import assert from "node:assert/strict";

export async function checkBrandBrowser(browser, baseUrl, { widths = [1440, 1024, 900, 808, 390], interactions = true } = {}) {
  const routes = ["/", "/agentguard", "/models", "/nuwa", "/open-ecosystem", "/nuwa/whitzard-index", "/about", "/nuwa/blog", "/news", "/waitlist", "/login", "/solutions"];
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
    const firstTab = page.getByRole("tab", { name: /数据与知识智能体/ });
    await firstTab.click();
    await firstTab.press("ArrowRight");
    assert.match(await page.locator("home-applications [aria-selected=true]").innerText(), /开发与运维智能体/);
    assert.equal(await page.locator(".home-applications__panel:visible").count(), 1);
    await page.locator("home-applications [aria-selected=true]").press("End");
    assert.match(await page.locator("home-applications [aria-selected=true]").innerText(), /多智能体平台/);
    await page.keyboard.press("Tab");
    assert.ok(await page.getByRole("tabpanel").evaluate(panel => panel === document.activeElement), "keyboard reaches selected use-case content");
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await page.locator(".home-applications__panel:visible").count(), 4, "mobile retains all use cases");

    await page.goto(new URL("/nuwa/whitzard-index", baseUrl).href, { waitUntil: "domcontentloaded" });
    await page.locator("astro-island:not([ssr])").first().waitFor({ state: "attached" });
    assert.ok(await page.getByRole("tab").evaluateAll(tabs => tabs.every(tab => document.getElementById(tab.getAttribute("aria-controls")))), "every evidence tab controls an existing panel");
    await page.getByRole("tab", { name: /Self-Replication/ }).click();
    assert.match(await page.getByRole("tabpanel").innerText(), /50%[\s\S]*90%/);
    await page.getByRole("tab", { name: /Self-Replication/ }).press("ArrowRight");
    assert.match(await page.getByRole("tabpanel").innerText(), />80%[\s\S]*>50%/);
    const labelSize = await page.locator(".wi-chart__label span").first().evaluate(el => parseFloat(getComputedStyle(el).fontSize));
    assert.ok(labelSize >= 12, "chart labels are readable");

    await page.goto(new URL("/waitlist", baseUrl).href, { waitUntil: "domcontentloaded" });
    await page.locator("astro-island:not([ssr])").first().waitFor({ state: "attached" });
    await page.getByRole("button", { name: "继续" }).click();
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
    const evidence = await staticPage.locator(".wi-evidence-noscript").innerText();
    assert.match(evidence, /AgentCyberRange[\s\S]*34.53%[\s\S]*74.1%/);
    assert.match(evidence, /Self-Replication[\s\S]*50%[\s\S]*90%/);
    assert.match(evidence, /OpenDeception[\s\S]*>80%[\s\S]*>50%/);
  } finally {
    await staticContext.close();
  }

  const reducedContext = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 1000 } });
  await reducedContext.route("https://cloud.umami.is/**", route => route.abort());
  const reducedPage = await reducedContext.newPage();
  try {
    await reducedPage.goto(new URL("/", baseUrl).href, { waitUntil: "domcontentloaded" });
    assert.equal(await reducedPage.locator(".brand-hero>.brand-artwork").evaluate(el => getComputedStyle(el).animationName), "none");
    await reducedPage.locator(".home-runtime-details summary").click();
    assert.equal(await reducedPage.locator(".boundary-flow__agentguard").evaluate(el => getComputedStyle(el).display), "grid", "runtime control gates retain their layout");
    assert.equal(await reducedPage.locator(".boundary-flow__decision").evaluate(el => getComputedStyle(el).display), "grid", "runtime outcome retains its layout");
    assert.match(await reducedPage.locator(".boundary-flow").innerText(), /安全处置完成|字段脱敏/);
  } finally {
    await reducedContext.close();
  }
  const touchContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await touchContext.route("https://cloud.umami.is/**", route => route.abort());
  const touchPage = await touchContext.newPage();
  try {
    await touchPage.goto(new URL("/nuwa/whitzard-index", baseUrl).href, { waitUntil: "domcontentloaded" });
    await touchPage.locator("astro-island:not([ssr])").first().waitFor({ state: "attached" });
    await touchPage.getByRole("tab", { name: /OpenDeception/ }).tap();
    assert.match(await touchPage.getByRole("tabpanel").innerText(), />80%[\s\S]*>50%/);
  } finally { await touchContext.close(); }
  return { combinations, keyboard: true, mobile: true, noJavaScript: true, reducedMotion: true, errors: [] };
}
