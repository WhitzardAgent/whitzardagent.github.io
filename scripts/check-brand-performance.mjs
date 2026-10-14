// Local lab measurement, not a claim about production/Core Web Vitals field data.
export async function measureBrandPage(browser, url) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
  await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: 1_600_000 / 8, uploadThroughput: 750_000 / 8 });
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await page.addInitScript(() => {
    window.__brandVitals = { cls: 0, lcp: 0, shifts: [] };
    new PerformanceObserver(list => {
      for (const entry of list.getEntries()) if (!entry.hadRecentInput) {
        window.__brandVitals.cls += entry.value;
        window.__brandVitals.shifts.push(entry.value);
      }
    }).observe({ type: "layout-shift", buffered: true });
    new PerformanceObserver(list => {
      for (const entry of list.getEntries()) window.__brandVitals.lcp = entry.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
  });
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForFunction(() => performance.now() >= 30000, null, { timeout: 40000 });
    return await page.evaluate(() => {
      const resources = performance.getEntriesByType("resource");
      const sum = filter => resources.filter(filter).reduce((total, entry) => total + entry.encodedBodySize, 0);
      return {
        url: location.href,
        conditions: "390×844, DPR 1, cold cache, CPU 4×, 1.6 Mbps download, 150 ms latency, 30 s observation",
        ...window.__brandVitals,
        fontBytes: sum(entry => /\.woff2($|\?)/.test(entry.name)),
        javaScriptBytes: sum(entry => /\.js($|\?)/.test(entry.name)),
        brandImageBytes: sum(entry => entry.name.includes("/assets/brand/")),
        fontsReady: document.fonts.status,
        overflow: document.documentElement.scrollWidth - innerWidth,
        fontCount: resources.filter(entry => /\.woff2($|\?)/.test(entry.name)).length,
      };
    });
  } finally { await context.close(); }
}
