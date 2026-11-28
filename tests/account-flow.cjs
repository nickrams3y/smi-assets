// Run with node --test tests/account-flow.cjs and Playwright + Chrome installed.
const { before, after, test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { chromium } = require('playwright');

const bundle = path.join(__dirname, '../site.js');
const accountUrl = 'https://store.test/products/account';
const milestones = ['Received', 'Processing', 'Packing', 'Shipped', 'Delivered'];
const ups = '1Z999AA10123456784';
const postal = '9400111899223000000000';
const upsUrl = n => 'https://www.ups.com/track?tracknum=' + n;
const postalUrl = n => 'https://tools.usps.com/go/TrackConfirmAction?tLabels=' + n;
let browser;

before(async () => { browser = await chromium.launch({ channel: 'chrome' }); });
after(async () => { await browser?.close(); });

function parcel(id, number, href) {
  const link = href === undefined ? '' : '<a href="' + href + '"><span class="form-control__button-text">Track package</span></a>';
  return '<div id="' + id + '" class="ec-confirmation__section ec-confirmation__section--track">' +
    '<div>Tracking number: <span>' + number + '</span></div>' + link + '</div>';
}

function card(id, status, parcels = '') {
  // Deliberately give the payment badge a name that also matches a fulfillment milestone.
  return '<article class="ec-cart__order" id="' + id + '"><div class="ec-confirmation__section">' +
    '<button>More Actions</button><span class="ec-confirmation__status ec-confirmation__status--custom-payment-status-1">Delivered</span>' +
    '<span class="ec-confirmation__status fulfillment">' + status + '</span></div>' + parcels + '</article>';
}

function account(cards) {
  return '<div class="ec-store__account-page"><div class="ec-cart">' + cards + '</div></div>';
}

async function openFixture(t, cards) {
  const page = await browser.newPage();
  page.setDefaultTimeout(5000);
  const errors = [];
  const unexpected = [];
  t.after(async () => {
    await page.close();
    assert.deepEqual(errors, [], 'Uncaught or runner-caught browser errors');
    assert.deepEqual(unexpected, [], 'Unexpected network requests');
  });
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  await page.route('**/*', route => {
    const url = new URL(route.request().url());
    if (url.href === accountUrl) {
      return route.fulfill({ contentType: 'text/html; charset=utf-8', body: '<!doctype html><main>' + account(cards) + '</main>' });
    }
    if (url.origin === 'https://nickrams3y.github.io' && url.pathname === '/smi-assets/support/chat-widget.js') {
      return route.fulfill({ contentType: 'text/javascript', body: '' });
    }
    unexpected.push(url.href);
    return route.abort();
  });
  await page.goto(accountUrl);
  // Only the Ecwid lifecycle is substituted. Run the shipped bundle, including its scheduler.
  await page.evaluate(() => {
    window.Ecwid = {
      OnPageLoad: { add(callback) { window.beginPage = callback; } },
      OnPageLoaded: { add(callback) { window.endPage = callback; callback(); } }
    };
  });
  await page.addScriptTag({ path: bundle });
  await page.locator('.sm-account-help').waitFor({ state: 'attached', timeout: 5000 });
  // Drain the shared startup pass so a pending full scan cannot rescue a broken observer.
  await page.evaluate(() => {
    window.initialScanComplete = false;
    SMI_DOM_RUNNER.add(() => { window.initialScanComplete = true; });
  });
  await page.waitForFunction(() => window.initialScanComplete);
  return page;
}

function waitForHref(page, selector, expected) {
  return page.waitForFunction(([s, url]) => document.querySelector(s)?.getAttribute('href') === url,
    [selector, expected], { timeout: 5000 });
}

function changeTextNode(page, selector, value) {
  // Updating Text.data specifically exercises characterData; textContent would replace a child.
  return page.locator(selector).evaluate((node, text) => { node.firstChild.data = text; }, value);
}

test('each order has its own accessible milestones, status copy and estimate', { timeout: 20000 }, async t => {
  const cases = [
    ['Awaiting Processing', 0, 'Order received'],
    ['Processing', 1, 'Processing your order', '5 business days'],
    ['  PROCESSING  —  Preparing   Programming ', 1, 'In the programming queue', '5 business days'],
    ['Processing – Preparing for Shipment', 2, 'Getting ready to ship'],
    ['Shipped', 3, 'Your order has shipped', '24 hours'],
    ['Delivered', 4, 'Delivered'],
    ['On hold - Pending instructions', 0, 'Waiting for your reply'],
    ['On hold — Awaiting inventory', 0, 'Waiting for inventory']
  ];
  const page = await openFixture(t, cases.map(([status], i) => card('o' + i, status)).join('') + card('unknown', 'Ready for pickup'));
  for (const [i, [status, step, title, estimate]] of cases.entries()) {
    const order = page.locator('#o' + i);
    const panel = order.getByRole('region', { name: 'Order progress' });
    assert.equal(await panel.count(), 1, status);
    const steps = panel.getByRole('list', { name: 'Fulfillment milestones' }).getByRole('listitem');
    assert.deepEqual(await steps.allTextContents(), milestones);
    assert.deepEqual(await panel.locator('li[aria-current="step"]').allTextContents(), [milestones[step]]);
    assert.deepEqual(await panel.locator('li.sm-step-done').allTextContents(), milestones.slice(0, step));
    assert.deepEqual(await panel.getByRole('heading').allTextContents(), [title]);
    assert.equal(await panel.evaluate(el => el.classList.contains('sm-order-progress--held')), status.startsWith('On hold'));
    assert.equal(await panel.locator('svg[aria-hidden="true"]').count(), milestones.length);
    if (estimate) assert.ok((await panel.textContent()).includes(estimate), status);
    assert.equal(await order.locator('.ec-confirmation__section + .sm-order-progress').count(), 1);
  }
  assert.equal(await page.locator('#unknown .sm-order-progress').count(), 0);
});

test('carrier destinations are exact and scoped to their own parcel and order', { timeout: 20000 }, async t => {
  const other = 'https://carrier.example/parcel/123';
  const intl = 'EC123456789US';
  const shortPostal = '92000000000000000000';
  const page = await openFixture(t, card('one', 'Shipped',
    parcel('ups', ' 1z999aa1-0123456784 ', postalUrl(postal)) +
    parcel('usps', postal, upsUrl(ups)) + parcel('short', shortPostal) + parcel('secondUps', '1Z999AA10123456785')) +
    card('two', 'Shipped', parcel('intl', intl) + parcel('private', postal, other) +
    parcel('ambiguous', '123456789012', other) + parcel('none', 'custom-code')));
  for (const [id, url, label] of [
    ['ups', upsUrl(ups), 'Track with UPS'], ['usps', postalUrl(postal), 'Track with USPS'],
    ['short', postalUrl(shortPostal), 'Track with USPS'], ['intl', postalUrl(intl), 'Track with USPS'],
    ['secondUps', upsUrl('1Z999AA10123456785'), 'Track with UPS'],
    ['private', other, 'Track package'], ['ambiguous', other, 'Track package']
  ]) {
    const link = page.locator('#' + id).getByRole('link');
    assert.equal(await link.count(), 1);
    assert.equal(await link.getAttribute('href'), url, id);
    assert.equal(await link.textContent(), label, id);
  }
  const generated = page.locator('#short a');
  assert.deepEqual(await generated.evaluate(a => [a.target, a.relList.contains('noopener'), a.relList.contains('noreferrer')]),
    ['_blank', true, true]);
  assert.equal(await page.locator('#none a').count(), 0);
});

test('text-node and href-only changes update native anchors and status in place', { timeout: 20000 }, async t => {
  const original = postalUrl(postal);
  const page = await openFixture(t, card('one', 'Processing', parcel('p', ups, original)));
  await waitForHref(page, '#p a', upsUrl(ups));
  await page.evaluate(() => {
    window.originalAnchor = document.querySelector('#p a');
    window.originalPanel = document.querySelector('.sm-order-progress');
  });
  await changeTextNode(page, '#one .fulfillment', 'Shipped');
  await page.getByText('Use the carrier link in your shipping details to track your package.').waitFor();
  await page.locator('#p a').evaluate(a => { a.href = 'https://carrier.example/new'; });
  await waitForHref(page, '#p a', upsUrl(ups));
  await changeTextNode(page, '#p > div > span', 'custom');
  await waitForHref(page, '#p a', 'https://carrier.example/new');
  assert.equal(await page.locator('#p a').textContent(), 'Track package');
  assert.ok(await page.evaluate(() => window.originalAnchor === document.querySelector('#p a') &&
    window.originalPanel === document.querySelector('.sm-order-progress')));
  await page.locator('#p a').evaluate(a => a.removeAttribute('href'));
  await page.getByText('Watch for your shipping email with tracking details.').waitFor();
  await page.locator('#p a').evaluate(a => { a.href = 'https://carrier.example/updated'; });
  await page.getByText('Use the carrier link in your shipping details to track your package.').waitFor();
  await changeTextNode(page, '#one .fulfillment', 'Delivery Canceled');
  await page.locator('#one .sm-order-progress').waitFor({ state: 'detached' });
});

test('fallback follows number changes and yields to a native link', { timeout: 20000 }, async t => {
  const page = await openFixture(t, card('one', 'Shipped', parcel('p', 'unknown')));
  await page.getByText('Watch for your shipping email with tracking details.').waitFor();
  await changeTextNode(page, '#p > div > span', ups);
  await waitForHref(page, '#p a.sm-account-track', upsUrl(ups));
  await page.evaluate(() => { window.firstFallback = document.querySelector('#p a'); });
  await page.getByText('Use the carrier link in your shipping details to track your package.').waitFor();
  await changeTextNode(page, '#p > div > span', postal);
  await waitForHref(page, '#p a.sm-account-track', postalUrl(postal));
  assert.ok(await page.evaluate(() => window.firstFallback === document.querySelector('#p a')));
  await changeTextNode(page, '#p > div > span', 'unknown');
  await page.locator('#p a').waitFor({ state: 'detached' });
  await page.getByText('Watch for your shipping email with tracking details.').waitFor();
  await changeTextNode(page, '#p > div > span', ups);
  await waitForHref(page, '#p a.sm-account-track', upsUrl(ups));
  await page.locator('#p').evaluate(el => el.insertAdjacentHTML('beforeend', '<a href="/old">Track package</a>'));
  await waitForHref(page, '#p a:not(.sm-account-track)', upsUrl(ups));
  assert.equal(await page.locator('#p a').count(), 1);
  await page.locator('#p a').evaluate(a => a.remove());
  await waitForHref(page, '#p a.sm-account-track', upsUrl(ups));
});

test('replaced order nodes and SPA navigation bind the new root and release the old one', { timeout: 20000 }, async t => {
  const page = await openFixture(t, card('old', 'Processing'));
  await page.locator('#old').evaluate((el, html) => { el.outerHTML = html; }, card('new', 'Shipped', parcel('p', ups)));
  await waitForHref(page, '#p a', upsUrl(ups));
  await page.evaluate(() => {
    window.oldRoot = document.querySelector('.ec-store__account-page');
    window.beginPage({ type: 'CATEGORY' });
    history.pushState({}, '', '/products/category');
    oldRoot.remove();
    window.endPage();
    window.runs = 0;
    SMI_DOM_RUNNER.add(() => { window.runs++; });
  });
  await page.waitForFunction(() => window.runs > 0);
  await page.evaluate(() => {
    oldRoot.querySelector('#p span').firstChild.data = 'unknown';
  });
  assert.equal(await page.evaluate(() => oldRoot.querySelector('#p a')?.href), upsUrl(ups));
  await page.evaluate(html => {
    window.beginPage({ type: 'ACCOUNT' });
    history.pushState({}, '', '/products/account');
    document.querySelector('main').innerHTML = html;
    window.endPage();
  }, account(card('returned', 'Delivered', parcel('back', postal))));
  await waitForHref(page, '#back a', postalUrl(postal));
  assert.deepEqual(await page.locator('[aria-current="step"]').allTextContents(), ['Delivered']);
});

test('a shared rescan leaves settled account DOM alone', { timeout: 20000 }, async t => {
  const page = await openFixture(t, card('one', 'Shipped', parcel('p', ups, postalUrl(postal))));
  await waitForHref(page, '#p a', upsUrl(ups));
  await page.evaluate(() => {
    window.writes = 0;
    window.runs = 0;
    const watch = new MutationObserver(records => { window.writes += records.length; });
    watch.observe(document.querySelector('.ec-store__account-page'),
      { childList:true, subtree:true, attributes:true, characterData:true });
    SMI_DOM_RUNNER.add(() => { window.runs++; });
  });
  await page.waitForFunction(() => window.runs > 0);
  // Observe several real debounce intervals to catch a self-sustaining chain.
  await new Promise(resolve => setTimeout(resolve, 650));
  assert.deepEqual(await page.evaluate(() => [window.writes, window.runs]), [0, 1]);
  assert.equal(await page.locator('.sm-order-progress').count(), 1);
  assert.equal(await page.locator('#p a').count(), 1);
});
