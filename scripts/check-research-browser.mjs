import assert from "node:assert/strict";

export async function checkResearchBrowser(browser, baseUrl) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  await context.route("https://cloud.umami.is/**", route => route.abort());
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  page.setDefaultTimeout(5000);
  try {
    await page.goto(new URL("/nuwa/research", baseUrl).href, { waitUntil: "domcontentloaded" });
    await page.locator("astro-island:not([ssr])").waitFor({ state: "attached" });
    assert.ok(await page.locator(".research-card__tags button").count() > 0, "every research card exposes interactive tag badges");
    await page.locator(".research-card__tags").getByRole("button", { name: "筛选标签：AI 欺骗", exact: true }).first().click();
    assert.equal(new URL(page.url()).searchParams.get("tag"), "ai-deception");
    assert.equal(await page.locator(".research-card").count(), 2);
    await page.getByLabel("搜索", { exact: true }).fill("OpenDeception");
    assert.equal(await page.locator(".research-card").count(), 1);
    await page.getByRole("button", { name: "重置", exact: true }).click();
    assert.equal(await page.locator(".research-card:not(.research-card--blog)").count(), 86);
    await page.locator(".research-tags > div button").nth(0).click();
    await page.locator(".research-tags > div button").nth(1).click();
    assert.equal(new URL(page.url()).searchParams.getAll("tag").length, 2);
    assert.equal(await page.locator(".research-card").count(), 37, "OR combines model-security and software-security records");
    await page.getByLabel("搜索", { exact: true }).fill("a-nonexistent-research-title-xyz");
    assert.equal(await page.locator(".research-card").count(), 0);
    assert.equal(await page.locator(".research-empty").isVisible(), true);
    await page.getByRole("button", { name: "重置", exact: true }).click();
    await page.goBack({ waitUntil: "domcontentloaded" });
    assert.equal(await page.locator(".research-card").count(), 0);
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.locator("astro-island:not([ssr])").waitFor({ state: "attached" });
    assert.equal(await page.locator(".research-card").count(), 0);
    assert.ok(Number.isFinite(await page.evaluate(() => history.state.index)), "preserve Astro route history state");
    await page.locator(".research-library-hero").getByRole("link", { name: "女娲实验室", exact: true }).click();
    await page.waitForURL("**/nuwa");
    await page.getByRole("link", { name: "Research →", exact: true }).first().click();
    await page.waitForURL("**/nuwa/research");
    await page.locator("astro-island:not([ssr])").waitFor({ state: "attached" });
    assert.equal(await page.locator(".research-card:not(.research-card--blog)").count(), 86);
    await page.goBack({ waitUntil: "domcontentloaded" });
    await page.waitForURL("**/nuwa");
    await page.goForward({ waitUntil: "domcontentloaded" });
    await page.waitForURL("**/nuwa/research");
    await page.locator("astro-island:not([ssr])").waitFor({ state: "attached" });
    assert.deepEqual(errors, [], "no hydration errors on Astro client navigation or history changes");
  } finally { await context.close(); }
}

export async function checkResearchLayouts(browser, baseUrl) {
  const results = [];
  for (const locale of ["zh", "en"]) for (const width of [1440, 1024, 900, 808, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: "reduce", hasTouch: width === 390 });
    await context.route("https://cloud.umami.is/**", route => route.abort());
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    page.setDefaultTimeout(5000);
    await page.goto(new URL(`${locale === "en" ? "/en" : ""}/nuwa/research`, baseUrl).href, { waitUntil: "domcontentloaded" });
    await page.locator("astro-island:not([ssr])").waitFor({ state: "attached" });
    assert.equal(await page.locator(".research-card:not(.research-card--blog)").count(), 86);
    assert.equal(await page.locator(".research-card__teaser img").count(), 87);
    assert.equal(await page.locator(".research-card.has-visual").count(), 50);
    assert.equal(await page.locator(".research-card:not(.research-card--blog) .research-card__teaser--brand").count(), 36);
    assert.equal(await page.locator(".research-card:not(.has-visual) .research-card__credit").count(), 0);
    const layout = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      columns: getComputedStyle(document.querySelector(".research-card-grid")).gridTemplateColumns.split(" ").length,
      broken: [...document.querySelectorAll(".research-card__teaser img")].filter(img => img.complete && !img.naturalWidth).length,
    }));
    assert.equal(layout.overflow, false, `${locale}/${width} horizontal overflow`);
    assert.equal(layout.columns, width > 700 ? 2 : 1);
    assert.equal(layout.broken, 0);
    const tag = page.locator(".research-card__tags button").first();
    if (width === 390) await tag.tap();
    else { await tag.focus(); await tag.press("Enter"); }
    assert.ok(new URL(page.url()).searchParams.get("tag"));
    await page.locator(".research-selected-tags button").first().click();
    assert.equal(await page.locator(".research-card:not(.research-card--blog)").count(), 86);
    assert.deepEqual(errors, []);
    results.push({ locale, width, ...layout });
    await context.close();
  }
  for (const locale of ["zh", "en"]) {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 1000 } });
    const page = await context.newPage();
    await page.goto(new URL(`${locale === "en" ? "/en" : ""}/nuwa/research`, baseUrl).href, { waitUntil: "domcontentloaded" });
    assert.equal(await page.locator(".research-card:not(.research-card--blog)").count(), 86);
    assert.equal(await page.locator(".research-card__teaser img").count(), 87);
    assert.equal(await page.locator(".research-filters").isVisible(), false);
    assert.equal(await page.locator(".research-tags").isVisible(), false);
    await context.close();
  }
  return results;
}
