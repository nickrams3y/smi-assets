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
      body: route.request().frame() === page.mainFrame()
        ? '<meta name="viewport" content="width=device-width,initial-scale=1"><main id="shop" style="height:2500px">Support articles</main>'
        : '<body style="margin:0;height:100dvh;display:grid;align-items:end"><textarea aria-label="Your message"></textarea></body>'
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
    // Mobile emulation resizes the page but does not open an iPhone keyboard.
    // Replay its independent viewport pan while typing inside the chat frame.
    const input = page.frameLocator('.smi-ai-frame').getByRole('textbox');
    for (const draft of ['Hello', 'One more question']) {
      await input.focus();
      for (const [top, height, event] of [[0, 440, 'resize'], [185, 440, 'scroll'], [130, 400, 'resize']]) {
        await page.evaluate(({ top, height, event }) => {
          Object.defineProperties(visualViewport, {
            offsetTop: { configurable: true, value: top },
            height: { configurable: true, value: height }
          });
          visualViewport.dispatchEvent(new Event(event));
        }, { top, height, event });
        const panel = await chat.boundingBox();
        assert.equal(panel.y, top);
        assert.equal(panel.height, height);
        const field = await input.boundingBox();
        assert(field.y >= top && field.y + field.height <= top + height + 1);
      }
      await input.fill(draft);
      await input.blur();
      await page.evaluate(() => {
        delete visualViewport.offsetTop;
        delete visualViewport.height;
        visualViewport.dispatchEvent(new Event('resize'));
      });
      assert.equal((await chat.boundingBox()).y, 0);
      assert.equal(await input.inputValue(), draft);
    }
    await chat.getByRole('link', { name: 'Back to support' }).click();
    await page.addScriptTag({ path: path.join(__dirname, '../chat-widget.js') });
    assert(await page.locator('#shop').isVisible());
    await page.evaluate(() => scrollTo(0, 500));
    assert(await page.evaluate(() => scrollY > 0));
    console.log('Full-page chat stays in view during keyboard pans, and the support page scrolls normally.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
