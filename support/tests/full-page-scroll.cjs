// Run with Playwright and its WebKit browser installed.
const assert = require('node:assert/strict');
const path = require('node:path');
const { webkit, devices } = require('playwright');

(async () => {
  const browser = await webkit.launch();
  try {
    const page = await browser.newPage({ ...devices['iPhone 13'] });
    await page.route('**/*', route => route.fulfill({
      contentType: 'text/html',
      body: '<meta name="viewport" content="width=device-width,initial-scale=1"><main id="shop" style="height:2500px">Support articles</main>'
    }));
    await page.goto('https://simplymichigan.co/support?chat=1');
    await page.addScriptTag({ path: path.join(__dirname, '../chat-widget.js') });
    const chat = page.locator('.smi-ai-full-page[open]');
    await chat.waitFor();
    // The storefront must have no painted surface, even during Safari's elastic scrolling.
    assert.equal(await page.locator('#shop').boundingBox(), null);
    for (const height of [480, 800]) {
      await page.setViewportSize({ width: 390, height });
      await page.evaluate(() => scrollTo(0, 500));
      await page.waitForFunction(() => {
        const box = document.querySelector('.smi-ai-full-page').getBoundingClientRect();
        return box.top === 0 && Math.abs(box.height - visualViewport.height) < 1;
      });
      assert.equal(await page.evaluate(() => scrollY), 0);
    }
    await chat.getByRole('link', { name: 'Back to support' }).click();
    await page.addScriptTag({ path: path.join(__dirname, '../chat-widget.js') });
    assert(await page.locator('#shop').isVisible());
    await page.evaluate(() => scrollTo(0, 500));
    assert(await page.evaluate(() => scrollY > 0));
    console.log('Full-page chat is isolated, and the support page scrolls normally.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
