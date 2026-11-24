// Run with node --test tests/lincoln-display-fitment.cjs (Playwright required).
// Use BROWSER=webkit for WebKit. Only the test browser receives the local site.js.
const assert = require('node:assert/strict');
const path = require('node:path');
const { test } = require('node:test');
const { chromium, webkit } = require('playwright');

const standard = 'STANDARD 8.0" Sync 3 Display';
const recessed = 'RECESSED 8.0" Sync 3 Display';
const standardHD = 'STANDARD 8.46" Sync 4 HD Display with Conversion Bracket';
const recessedHD = 'RECESSED 8.46" Sync 4 HD Display with Conversion Bracket';

for (const kit of ['without', 'with']) {
  test(kit + ' navigation kit limits MKC and MKZ families to standard 8.0"', async t => {
    const browser = process.env.BROWSER === 'webkit'
      ? await webkit.launch() : await chromium.launch({ channel: 'chrome' });
    t.after(() => browser.close());
    const page = await browser.newPage();
    let served = false;
    await page.route('https://nickrams3y.github.io/smi-assets/site.js*', async route => {
      await route.fulfill({ path: path.join(__dirname, '../site.js'), contentType: 'application/javascript',
        headers: { 'access-control-allow-origin': '*' } });
      served = true;
    });
    const url = 'https://simplymichigan.co/products/ford-lincoln-sync-3-apim-and-screen-complete-upgrade-kit-' + kit + '-navigation';
    await page.goto(url, { waitUntil: 'commit' });
    const box = page.locator('.details-product-options:visible').first();
    await box.locator('.sm-connectivity-summary').waitFor({ state: 'attached' });
    assert.ok(served, 'The local candidate must be loaded');
    const model = box.getByRole('combobox', { name: 'Vehicle Model', exact: true });
    const display = box.getByRole('combobox', { name: 'Choose Your Display', exact: true });
    const notice = box.locator('.sm-display-fit-notice');
    const price = page.locator('.product-details__sidebar [itemprop="price"]:visible').first();
    const basePrice = (await price.innerText()).trim();
    const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
    const base = Number(basePrice.replace(/[$,]/g, ''));
    assert.ok(base > 0);

    async function expectHD(vehicle, screen) {
      await model.selectOption(vehicle);
      await display.selectOption(screen);
      assert.equal(await display.inputValue(), screen);
      const label = await display.locator('option:checked').textContent();
      const extra = Number(label.match(/\(\+\$([\d,.]+)\)/)[1].replace(/,/g, ''));
      assert.ok(extra > 0);
      await price.filter({ hasText: money.format(base + extra) }).waitFor({ timeout: 6000 });
      assert.equal((await price.innerText()).trim(), money.format(base + extra));
      assert.equal(await notice.count(), 0);
    }

    for (const vehicle of ['Lincoln MKC (2015+) Standard Display', 'Lincoln MKZ (2013+) Standard Display',
                           'Lincoln MKZ Hybrid (2013+) Standard Display']) {
      await expectHD('Ford Fusion (2013+) Standard Display', standardHD);
      await model.selectOption(vehicle);
      assert.equal(await display.inputValue(), standard, vehicle);
      await price.filter({ hasText: basePrice }).waitFor({ timeout: 6000 });
      assert.equal(await notice.count(), 0);

      for (const invalid of [standardHD, recessedHD, recessed]) {
        // Observe what native Ecwid field listeners receive after document capture.
        const delivered = await display.evaluateHandle(select => {
          const result = [];
          for (const type of ['input', 'change']) {
            select.addEventListener(type, () => result.push([type, select.value]), { once: true });
          }
          return result;
        });
        await display.selectOption(invalid);
        assert.deepEqual(await delivered.jsonValue(), [['input', standard], ['change', standard]], vehicle + ': ' + invalid);
        await delivered.dispose();
        assert.equal(await display.inputValue(), standard);
        assert.equal((await price.innerText()).trim(), basePrice);
        assert.match(await notice.innerText(), /⚠️.*standard 8\.0.*8\.46.*won’t fit/i);
        assert.equal(await notice.getAttribute('role'), 'status');
      }
    }
    // Ecwid can also restore field values during a render, without a selection event.
    await display.evaluate((select, value) => {
      select.value = value;
      select.after(document.createComment('simulated storefront render'));
    }, standardHD);
    await display.locator('option:checked').filter({ hasText: standard }).waitFor({ state: 'attached' });
    assert.equal(await display.inputValue(), standard);
    assert.equal((await price.innerText()).trim(), basePrice);
    await expectHD('Lincoln MKX (2011+) Recessed Display', recessedHD);
  });
}
