// Run with node --test and Playwright WebKit installed. All requests use local fixtures.
const { before, after, test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { webkit, devices } = require('playwright');

const shop = 'https://simplymichigan.co';
const worker = 'https://simply-michigan-support.s98wfrdp7b.workers.dev';
const product = 'audio-control-module-acm-reciever';
const script = path.join(__dirname, '../chat-widget.js');
const shell = '<meta name="viewport" content="width=device-width,initial-scale=1"><main id="sm-support" style="height:1800px"><div class="sh-hero">Support</div><div class="sh-quick"></div></main>';
let browser;
before(async () => { browser = await webkit.launch(); });
after(async () => { await browser?.close(); });

async function fixture(t, { url = shop+'/products/'+product, device, replies = ['ready'], storefront = shell } = {}) {
  const context = await browser.newContext(device || { viewport:{ width:1280, height:850 } });
  const page = await context.newPage();
  const requests = [], errors = [], activity = [];
  let release;
  const delayed = new Promise(resolve => { release = resolve; });
  t.after(async () => {
    release();
    await context.close();
    assert.deepEqual(errors, []);
  });
  page.on('pageerror', error => errors.push(error.message));
  await context.route('**/*', async route => {
    const target = new URL(route.request().url());
    if (target.origin === shop) return route.fulfill({ contentType:'text/html', body:storefront });
    if(target.origin===worker && target.pathname==='/api/launcher-activity'){
      activity.push(route.request().postDataJSON());
      return route.fulfill({status:204,headers:{'Access-Control-Allow-Origin':shop}});
    }
    if (target.origin !== worker || target.pathname !== '/') return route.abort();
    const mode = replies[requests.length];
    requests.push(target.href);
    if (mode === 'abort') return route.abort('failed');
    if (mode === '503') return route.fulfill({ status:503, contentType:'text/html', body:'Unavailable' });
    if (mode === 'hold') await delayed;
    const body = '<textarea aria-label="Message"></textarea><script>' +
      'let product = new URLSearchParams(location.hash.slice(1)).get("product") || "";' +
      'function announce(){ parent.postMessage({type:"smi-chat-start-page",product},' + JSON.stringify(shop) + '); }' +
      (mode === 'hold' ? 'addEventListener("message",({source,origin,data})=>{if(source===parent && origin===' + JSON.stringify(shop) +
        ' && data?.type==="smi-chat-page"){product=data.product; document.body.dataset.product=product; announce();}});' : '') +
      (mode === 'ready' || mode === 'hold' ? 'announce();' : '') + '</script>';
    await route.fulfill({ contentType:'text/html', body });
  });
  await page.clock.install();
  await page.goto(url, { waitUntil:'domcontentloaded' });
  await page.addScriptTag({ path:script });
  const panel = page.locator('#smi-ai-dialog');
  return { page, context, panel, status:panel.getByRole('status'), actions:panel.locator('.smi-ai-recovery'),
    launcher:page.locator('.smi-ai-launcher'), input:page.frameLocator('.smi-ai-frame').getByRole('textbox'), requests, release, activity };
}

test('Healthy chat is lazy, retains drafts and restores focus to the actual opener', async t => {
  const {page,panel,status,actions,input,requests} = await fixture(t,{url:shop+'/support'});
  const opener = page.locator('#smi-ai-support-card .smi-ai-open');
  await opener.waitFor();
  assert.equal(await page.locator('iframe').count(),0);
  assert.equal(requests.length,0);
  await opener.focus();
  await page.keyboard.press('Enter');
  const close = panel.getByRole('button',{name:'Close AI chat'});
  assert.ok(await close.evaluate(el => el === document.activeElement));
  await input.fill('Local draft');
  await page.clock.fastForward(20000);
  assert.equal(await status.textContent(),'');
  assert.ok(await actions.isHidden());
  assert.equal(await page.evaluate(() => document.body.style.overflow),'hidden');
  await close.focus();
  await page.keyboard.press('Escape');
  await panel.waitFor({state:'hidden'});
  await page.waitForFunction(() => document.activeElement.matches('#smi-ai-support-card .smi-ai-open'));
  assert.equal(await page.evaluate(() => document.body.style.overflow),'');
  await opener.click();
  assert.equal(await input.inputValue(),'Local draft');
  assert.equal(requests.length,1);
});

for (const [name, device] of [['desktop',undefined],['mobile',{...devices['iPhone 13'],viewport:{width:320,height:568}}]]) {
  test(name+' slow iframe offers help, then opens in place without interrupting focus', async t => {
    const {page,panel,status,actions,launcher,input,requests,release} = await fixture(t,{device,replies:['hold']});
    await launcher.click();
    await panel.waitFor();
    assert.equal(await panel.locator('iframe').getAttribute('src'),worker+'/#product='+product);
    await page.clock.fastForward(8000);
    assert.equal(await status.textContent(),'');
    const toolbar = panel.locator('.smi-ai-dialog-bar');
    assert.ok(await toolbar.evaluate(el => el === document.activeElement));
    await page.clock.fastForward(5000);
    await actions.waitFor();
    assert.match(await status.innerText(),/taking longer.*keep waiting/i);
    assert.ok(await toolbar.evaluate(el => el === document.activeElement));
    const link = actions.getByRole('link',{name:'Contact Us',exact:true});
    assert.equal(await link.getAttribute('href'),shop+'/contact-us');
    const bounds = await link.boundingBox(), dialog = await panel.boundingBox();
    assert.ok(bounds.height>=44 && bounds.x>=dialog.x && bounds.x+bounds.width<=dialog.x+dialog.width+1);
    await link.focus();
    release();
    await actions.waitFor({state:'hidden'});
    await input.waitFor();
    assert.equal(await status.textContent(),'');
    assert.ok(await panel.getByRole('link',{name:'Contact support',exact:true}).evaluate(el => el === document.activeElement),'the permanent contact link takes focus when the temporary one disappears');
    assert.equal(requests.length,1,'a slow frame finishes without an automatic reload');
  });
}

test('A delayed startup signal after closing keeps the launcher focused and the same chat ready on reopen', async t => {
  const { page, panel, actions, launcher, input, requests } = await fixture(t, { replies:['silent'] });
  await launcher.click();
  await input.fill('Local draft before closing');
  await page.clock.fastForward(15000);
  await actions.waitFor();
  await actions.getByRole('button', { name:'Try again' }).focus();
  await page.keyboard.press('Escape');
  await panel.waitFor({ state:'hidden' });

  // The frame is still alive and can finish starting while the shopper is back on the storefront.
  await input.evaluate(el => el.ownerDocument.defaultView.announce());
  await page.waitForFunction(() => document.querySelector('.smi-ai-recovery').hidden);
  assert.ok(await launcher.evaluate(el => el === document.activeElement));
  await launcher.click();
  await page.clock.fastForward(15000);
  assert.ok(await actions.isHidden());
  assert.equal(await input.inputValue(), 'Local draft before closing');
  assert.equal(requests.length, 1);
});

test('An HTTP error document cannot declare readiness. Contact Us and a manual retry both work', async t => {
  const {page,context,panel,status,actions,launcher,input,requests} = await fixture(t,{replies:['503','silent']});
  await launcher.click();
  await page.frameLocator('.smi-ai-frame').getByText('Unavailable').waitFor();
  await page.clock.fastForward(15000);
  await actions.waitFor();
  await page.evaluate(worker => {
    const source=document.querySelector('.smi-ai-frame').contentWindow;
    // WebKit won't construct a MessageEvent from an already detached window.
    // Keep the event that the old frame could have queued before the retry.
    window.queuedReady=new MessageEvent('message',{origin:worker,source,data:{type:'smi-chat-start-page',product:'wrong-product'}});
    const data={type:'smi-chat-start-page',product:''};
    dispatchEvent(new MessageEvent('message',{data,origin:location.origin,source}));
    dispatchEvent(new MessageEvent('message',{data,origin:worker,source:window}));
  },worker);
  assert.ok(await actions.isVisible());
  const [contact] = await Promise.all([context.waitForEvent('page'),actions.getByRole('link',{name:'Contact Us',exact:true}).click()]);
  await contact.waitForURL(shop+'/contact-us');
  await contact.close();
  await actions.getByRole('button',{name:'Try again'}).click();
  await input.waitFor();
  assert.equal(await panel.locator('iframe').count(),1);
  assert.equal(requests.length,2);
  assert.equal(await panel.locator('iframe').getAttribute('src'),worker+'/#product='+product);
  await page.evaluate(() => dispatchEvent(window.queuedReady));
  await page.clock.fastForward(15000);
  assert.ok(await actions.isVisible(),'late message from the replaced iframe was ignored');
  assert.match(await panel.locator('.smi-chat-full-link').getAttribute('href'),new RegExp('#product='+product+'$'));
  await input.focus();
  await input.evaluate(el => el.ownerDocument.defaultView.announce());
  await actions.waitFor({state:'hidden'});
  assert.ok(await input.evaluate(el => el===el.ownerDocument.activeElement));
  assert.equal(await status.textContent(),'');
});

test('Retry keeps the product from opening, including after a fresh open on another product', async t => {
  const {page,panel,launcher,actions,requests,input}=await fixture(t,{replies:['503','503','ready']});
  const retry=actions.getByRole('button',{name:'Try again'});
  const changePage=slug=>page.evaluate(slug=>history.pushState({},'', '/products/'+slug),slug);
  const unavailable=page.frameLocator('.smi-ai-frame').getByText('Unavailable');
  await launcher.click();
  await unavailable.waitFor();
  await page.clock.fastForward(15000);
  await changePage('different-product');
  await retry.click();
  assert.equal(await panel.locator('iframe').getAttribute('src'),worker+'/#product='+product);
  await unavailable.waitFor();
  await panel.getByRole('button',{name:'Close AI chat'}).click();
  await launcher.click();
  assert.equal(await panel.locator('.smi-chat-full-link').getAttribute('href'),shop+'/support?chat=1&from=launcher#product=different-product');
  await page.clock.fastForward(15000);
  await changePage('third-product');
  await retry.click();
  await input.waitFor();
  assert.equal(await panel.locator('iframe').getAttribute('src'),worker+'/#product=different-product');
  await page.waitForFunction(()=>document.querySelector('.smi-chat-full-link').hash==='#product=different-product');
  assert.equal(requests.length,3);
});

test('Reopening a pending frame from another product delivers the opening page when startup finishes', async t => {
  const {page,panel,launcher,requests,release} = await fixture(t,{replies:['hold']});
  await launcher.click();
  await page.clock.fastForward(15000);
  await panel.getByRole('button',{name:'Try again'}).waitFor();
  await panel.getByRole('button',{name:'Close AI chat'}).click();
  await page.evaluate(()=>history.pushState({},'','/products/second-product'));
  await launcher.click();
  release();
  await page.frameLocator('.smi-ai-frame').locator('body[data-product="second-product"]').waitFor({timeout:4000});
  await page.waitForFunction(()=>document.querySelector('.smi-chat-full-link').hash==='#product=second-product');
  assert.ok(await panel.getByRole('button',{name:'Try again'}).isHidden());
  assert.equal(requests.length,1);
});

test('Close during loading cancels the notice. Reopen reuses the frame. Explicit errors recover', async t => {
  const {page,panel,status,actions,launcher,input,requests} = await fixture(t,{replies:['silent','ready']});
  await launcher.click();
  await input.waitFor();
  await panel.getByRole('button',{name:'Close AI chat'}).click();
  await page.clock.fastForward(20000);
  assert.equal(await panel.locator('[role=status]').textContent(),'');
  assert.ok(await launcher.evaluate(el => el===document.activeElement));
  await launcher.click();
  await page.clock.fastForward(15000);
  assert.ok(await actions.isVisible());
  assert.equal(requests.length,1);
  await panel.locator('iframe').dispatchEvent('error');
  assert.match(await status.innerText(),/couldn’t open here/i);
  const retry=actions.getByRole('button',{name:'Try again'});
  await retry.focus();
  await page.keyboard.press('Enter');
  await actions.waitFor({state:'hidden'});
  await input.waitFor();
  await page.clock.fastForward(15000);
  assert.equal(await status.textContent(),'');
  assert.equal(requests.length,2);
});

test('Keyboard retry announces its progress, keeps a contact option focused and lets a slow retry finish', async t => {
  const {page,panel,status,actions,launcher,input,requests,release}=await fixture(t,{replies:['503','hold']});
  await launcher.focus();
  await page.keyboard.press('Enter');
  await page.frameLocator('.smi-ai-frame').getByText('Unavailable').waitFor();
  await page.clock.fastForward(15000);
  const retry=actions.getByRole('button',{name:'Try again'});
  await retry.focus();
  await page.keyboard.press('Enter');
  assert.equal(await status.textContent(),'Opening chat again…');
  assert.ok(await actions.isHidden());
  const tree=await panel.ariaSnapshot();
  assert.match(tree,/status: Opening chat again…/);
  assert.doesNotMatch(tree,/button "Try again"|link "Contact Us"/);
  const contact=panel.getByRole('link',{name:'Contact support',exact:true});
  assert.ok(await contact.evaluate(el=>el===document.activeElement && el.matches(':focus-visible')));
  await page.clock.fastForward(8000);
  assert.equal(await status.textContent(),'Opening chat again…');
  await page.clock.fastForward(5000);
  await actions.waitFor();
  assert.match(await status.innerText(),/taking longer.*keep waiting/i);
  release();
  await input.waitFor();
  await actions.waitFor({state:'hidden'});
  assert.equal(await status.textContent(),'');
  assert.ok(await contact.evaluate(el=>el===document.activeElement));
  assert.equal(requests.length,2);
  await page.keyboard.press('Escape');
  await page.waitForFunction(()=>document.activeElement.matches('.smi-ai-launcher'));
});

test('Mobile full-page chat offers a contact alternative when the iframe request is blocked', async t => {
  const {page,panel,status,actions,requests} = await fixture(t,{url:shop+'/support?chat=1#product='+product,device:devices['iPhone 13'],replies:['abort']});
  await panel.waitFor();
  await page.clock.fastForward(16000);
  await actions.waitFor();
  assert.match(await status.innerText(),/taking longer|couldn’t open here/i);
  assert.equal(await page.locator('#sm-support').boundingBox(),null);
  assert.equal(await page.locator('.smi-ai-launcher').count(),0);
  assert.equal(await actions.getByRole('link',{name:'Contact Us',exact:true}).getAttribute('href'),shop+'/contact-us');
  assert.equal(requests.length,1);
  await panel.getByRole('link',{name:'Back to support'}).click();
  await page.waitForURL(shop+'/support');
});

test('Contact Us works by keyboard even when the browser blocks every chat iframe', async t => {
  const blockFrames = '<meta http-equiv="Content-Security-Policy" content="frame-src \'none\'">';
  const {page, context, panel, actions, launcher, requests} = await fixture(t, {storefront:blockFrames+shell});
  await launcher.focus();
  await page.keyboard.press('Enter');
  await panel.waitFor();
  await page.clock.fastForward(15000);
  await actions.waitFor();
  assert.equal(requests.length, 0, 'the browser blocked the frame before it could reach the chat service');
  const retry = actions.getByRole('button', {name:'Try again'});
  await retry.focus();
  await page.keyboard.press('Enter');
  await page.clock.fastForward(15000);
  await actions.waitFor();
  assert.equal(requests.length, 0);
  const contact = actions.getByRole('link', {name:'Contact Us', exact:true});
  await retry.focus();
  // A default macOS WebKit session uses Option-Tab to include links.
  await page.keyboard.press(process.platform === 'darwin' ? 'Alt+Tab' : 'Tab');
  assert.ok(await contact.evaluate(el => el === document.activeElement));
  const [contactPage] = await Promise.all([context.waitForEvent('page'), page.keyboard.press('Enter')]);
  await contactPage.waitForURL(shop+'/contact-us');
});

const contactPage = '<meta name="viewport" content="width=device-width,initial-scale=1">'+
  '<main><section class="sm-contact-intro"><div class="sm-contact-description"><p><a href="'+worker+'/">AI Support</a></p></div></section>'+
  '<form style="margin-top:120vh"><div class="sm-contact-form-heading"><h2>Send us a message</h2></div>'+
  '<label>Your name <input required></label><label>Your message <textarea id="contact-us-ZNGYK5-message"></textarea></label>'+
  '<button>Send message</button></form></main>';

for (const mobile of [false,true]) {
  test((mobile?'Mobile':'Desktop')+' Contact Us returns to the existing form and keeps the draft', async t => {
    const url=shop+(mobile?'/en/contact-us/?from=support':'/contact-us');
    const {page,context,panel,actions,launcher,requests}=await fixture(t,{
      url, storefront:contactPage, device:mobile?devices['iPhone 13']:undefined, replies:['503']
    });
    const form=page.locator('form'), message=form.getByLabel('Your message');
    if (!mobile) await form.locator('.sm-contact-form-heading').evaluate(el=>el.remove());
    await message.fill('Local test draft');
    const opener=mobile?page.locator('#smi-ai-contact-card .smi-ai-open'):launcher;
    await opener.click();
    await page.clock.fastForward(15000);
    const contact=actions.getByRole('link',{name:'Contact Us',exact:true});
    await contact.waitFor();
    if (mobile) await contact.tap();
    else { await contact.focus(); await page.keyboard.press('Enter'); }
    assert.ok(await panel.isHidden(),'contact handoff closes the chat');
    assert.equal(context.pages().length,1,'the customer stays in the original tab');
    assert.equal(page.url(),url);
    assert.equal(await message.inputValue(),'Local test draft');
    const target=mobile?form.getByRole('heading',{name:'Send us a message'}):form;
    await target.evaluate(el=>new Promise(resolve=>requestAnimationFrame(resolve)));
    assert.ok(await target.evaluate(el=>el===document.activeElement));
    const bounds=await target.boundingBox();
    assert.ok(bounds.y<page.viewportSize().height && bounds.y+bounds.height>0,'form is in view');
    assert.equal(await page.evaluate(()=>document.body.style.overflow),'');
    await page.keyboard.press('Tab');
    assert.ok(await form.getByLabel('Your name').evaluate(el=>el===document.activeElement));
    assert.equal(requests.length,1);
  });
}

test('A focused Contact Us link still reaches the original form when startup finishes', async t => {
  const {page,context,panel,actions,launcher,release}=await fixture(t,{
    url:shop+'/contact-us',storefront:contactPage,replies:['hold']
  });
  const draft=page.getByLabel('Your message');
  await draft.fill('Local test draft');
  await launcher.focus();
  await page.keyboard.press('Enter');
  await page.clock.fastForward(15000);
  await actions.getByRole('link',{name:'Contact Us',exact:true}).focus();
  release();
  await actions.waitFor({state:'hidden'});
  const contact=panel.getByRole('link',{name:'Contact support',exact:true});
  assert.ok(await contact.evaluate(el=>el===document.activeElement && el.matches(':focus-visible')));
  await page.keyboard.press('Enter');
  await panel.waitFor({state:'hidden'});
  assert.equal(context.pages().length,1);
  assert.equal(await draft.inputValue(),'Local test draft');
  await page.waitForFunction(()=>document.activeElement?.textContent==='Send us a message');
});

test('Contact Us keeps its ordinary link when the contact form is unavailable', async t => {
  const {page,context,panel,actions,launcher}=await fixture(t,{
    url:shop+'/contact-us/?from=support', storefront:contactPage, replies:['503']
  });
  await page.locator('form').evaluate(el=>{el.hidden=true;});
  await launcher.click();
  await page.clock.fastForward(15000);
  const link=actions.getByRole('link',{name:'Contact Us',exact:true});
  const [contact]=await Promise.all([context.waitForEvent('page'),link.click()]);
  await contact.waitForURL(shop+'/contact-us');
  assert.ok(await panel.isVisible());
  await contact.close();
});

async function observeChatStartup(page) {
  await page.evaluate(() => {
    const frame = document.querySelector('.smi-ai-frame');
    window.addEventListener('message', function ready(event) {
      if (event.source === frame.contentWindow && event.data?.type === 'smi-chat-start-page') {
        window.removeEventListener('message', ready);
        document.body.dataset.chatTestReady = 'yes';
      }
    });
  });
}

async function pressWhileOpening(page, target, release, panel) {
  await observeChatStartup(page);
  const box = await target.boundingBox();
  await page.mouse.move(box.x + box.width/2, box.y + box.height/2);
  await page.mouse.down();
  release();
  await page.waitForFunction(() => document.body.dataset.chatTestReady === 'yes');
  assert.ok(await panel.isVisible());
}
for (const onContactPage of [false,true]) {
  const label=onContactPage ? 'returns to the existing form' : 'opens the contact page';
  test('Contact Us '+label+' when chat becomes ready during the press', async t => {
    const {page,context,panel,actions,launcher,release,requests} = await fixture(t,{
      url:onContactPage ? shop+'/contact-us' : shop+'/products/'+product, storefront:onContactPage ? contactPage : shell, replies:['hold']
    });
    if(onContactPage)await page.getByLabel('Your message').fill('Local test draft');
    await launcher.click();
    await page.clock.fastForward(15000);
    await pressWhileOpening(page,actions.getByRole('link',{name:'Contact Us'}),release,panel);
    const destination=onContactPage ? null : context.waitForEvent('page',{timeout:3500});
    await page.mouse.up();
    if(onContactPage){
      await panel.waitFor({state:'hidden',timeout:2500});
      assert.equal(await page.getByLabel('Your message').inputValue(),'Local test draft');
      await page.waitForFunction(()=>document.activeElement?.textContent==='Send us a message');
    }else{
      const popup=await destination;
      await popup.waitForURL(shop+'/contact-us');
      assert.ok(await panel.isVisible());
      assert.ok(await actions.isHidden());
      await popup.close();
    }
    assert.equal(requests.length,1);
  });
}

test('Escape returns focus after the storefront redraws the chat opener', async t => {
  const {page,panel,actions,requests} = await fixture(t,{url:shop+'/support',replies:['503']});
  const opener = page.locator('#smi-ai-support-card .smi-ai-open');
  await opener.focus();
  await page.keyboard.press('Enter');
  await page.clock.fastForward(15000);
  await actions.getByRole('button',{name:'Try again'}).focus();
  const old=await opener.elementHandle();
  await page.locator('#smi-ai-support-card').evaluate(el=>el.remove());
  await opener.waitFor({timeout:3500});
  assert.equal(await old.evaluate(el=>el.isConnected),false);
  await page.keyboard.press('Escape');
  await panel.waitFor({state:'hidden'});
  await page.waitForFunction(()=>document.activeElement===document.querySelector('#smi-ai-support-card .smi-ai-open'),{},{timeout:2000});
  assert.equal(requests.length,1);
});

test('A retry pressed during startup keeps the working iframe and draft', async t => {
  const {page,panel,actions,launcher,release,input,requests}=await fixture(t,{replies:['hold']});
  await launcher.click();
  await page.clock.fastForward(15000);
  await pressWhileOpening(page,actions.getByRole('button',{name:'Try again'}),release,panel);
  // Put text in the already-loaded document without moving the pressed pointer.
  await input.evaluate(el=>{el.value='Draft in the original frame'});
  await page.mouse.up();
  await actions.waitFor({state:'hidden'});
  assert.equal(await input.inputValue(),'Draft in the original frame');
  assert.equal(requests.length,1);
});

test('Releasing a Contact Us press outside the link cancels it as chat becomes ready', async t => {
  const {page,panel,actions,launcher,release,input,requests,context}=await fixture(t,{replies:['hold']});
  await launcher.click();
  await page.clock.fastForward(15000);
  await pressWhileOpening(page,actions.getByRole('link',{name:'Contact Us'}),release,panel);
  const close=await panel.getByRole('button',{name:'Close AI chat'}).boundingBox();
  await page.mouse.move(close.x+5,close.y+5);
  await page.mouse.up();
  await actions.waitFor({state:'hidden',timeout:2500});
  assert.ok(await panel.isVisible());
  assert.ok(await input.isVisible());
  assert.equal(context.pages().length,1);
  assert.equal(requests.length,1);
});

test('A delayed touch click on Contact Us still reaches the form after pointer release', async t => {
  const {page,panel,actions,launcher,release,requests}=await fixture(t,{
    url:shop+'/contact-us',storefront:contactPage,device:devices['iPhone 13'],replies:['hold']
  });
  await page.getByLabel('Your message').fill('Mobile test draft');
  await launcher.tap();
  await page.clock.fastForward(15000);
  const link=actions.getByRole('link',{name:'Contact Us'});
  const target=await link.elementHandle();
  const box=await link.boundingBox();
  const touch={pointerId:7,pointerType:'touch',isPrimary:true,button:0,clientX:box.x+6,clientY:box.y+6};
  // Model the interval between the touch events and the browser's click.
  await observeChatStartup(page);
  await target.dispatchEvent('pointerdown',{...touch,buttons:1});
  release();
  await page.waitForFunction(()=>document.body.dataset.chatTestReady==='yes');
  await target.dispatchEvent('pointerup',{...touch,buttons:0});
  await page.clock.runFor(350);
  assert.ok(await link.isVisible(),'the pressed link stays available for the delayed click');
  await page.evaluate(({clientX,clientY})=>document.elementFromPoint(clientX,clientY).click(),touch);
  await panel.waitFor({state:'hidden',timeout:2500});
  assert.equal(await page.getByLabel('Your message').inputValue(),'Mobile test draft');
  assert.equal(requests.length,1);
});

test('Closing after the support card is removed returns focus to AI Support', async t => {
  const {page,panel,launcher}=await fixture(t,{url:shop+'/support',replies:['503']});
  const opener=page.locator('#smi-ai-support-card .smi-ai-open');
  await opener.focus();
  await page.keyboard.press('Enter');
  await page.locator('#sm-support').evaluate(el=>el.remove());
  await page.keyboard.press('Escape');
  await panel.waitFor({state:'hidden'});
  assert.ok(await launcher.evaluate(el=>document.activeElement===el));
});

test('A late startup signal preserves the draft, selection and typing focus inside chat', async t => {
  const {page,actions,launcher,input,requests}=await fixture(t,{device:devices['iPhone 13'],replies:['silent']});
  await launcher.tap();
  await input.fill('Sync drops');
  await input.evaluate(el=>el.setSelectionRange(5,10));
  await page.clock.fastForward(15000);
  assert.ok(await actions.isVisible());
  await input.evaluate((el,origin)=>parent.postMessage({type:'smi-chat-start-page',product:''},origin),shop);
  await actions.waitFor({state:'hidden'});
  const field=await input.evaluate(el=>({focused:el===document.activeElement,start:el.selectionStart,end:el.selectionEnd}));
  assert.deepEqual(field,{focused:true,start:5,end:10});
  await page.keyboard.insertText('disconnects');
  assert.equal(await input.inputValue(),'Sync disconnects');
  assert.equal(requests.length,1);
});

test('Floating visits track once, keep test markers and exclude support card opens',async t=>{
  const {page,launcher,panel,activity}=await fixture(t,{url:shop+'/support?chat_test=1'});
  const card=page.locator('#smi-ai-support-card .smi-ai-open');
  await card.waitFor();
  await card.click();
  await panel.getByRole('button',{name:'Close AI chat'}).click();
  assert.ok(activity.every(e=>e.stage==='seen'));
  assert.equal(await launcher.innerText(),'Ask a question');
  await launcher.click();
  const frame=page.frames().find(f=>f.url().startsWith(worker));
  const submitted=page.waitForResponse(r=>r.url().endsWith('/api/launcher-activity') && r.request().postDataJSON().stage==='sent');
  await frame.evaluate(origin=>{
    parent.postMessage({type:'smi-chat-submitted',test:true},origin);
    parent.postMessage({type:'smi-chat-submitted',test:true},origin);
  },shop);
  await submitted;
  assert.deepEqual(activity.map(e=>e.stage),['seen','opened','sent']);
  assert.ok(activity.every(e=>e.test && e.id===activity[0].id));
});

test('Toolbar actions keep their destinations and fit beside Close on a small phone',async t=>{
  const device={...devices['iPhone 13'],viewport:{width:320,height:640}};
  const {launcher,panel}=await fixture(t,{device});
  await launcher.click();
  const full=panel.getByRole('link',{name:'Open in a full page'});
  const support=panel.locator('.smi-ai-dialog-bar').getByRole('link',{name:'Contact support'});
  assert.equal(new URL(await full.getAttribute('href')).pathname,'/support');
  assert.equal(await support.getAttribute('href'),shop+'/contact-us');
  const close=panel.getByRole('button',{name:'Close AI chat'});
  const [a,b,c]=await Promise.all([full.boundingBox(),support.boundingBox(),close.boundingBox()]);
  assert.equal(a.y,b.y);
  assert.ok(a.height>=44 && b.height>=44 && a.x+a.width<=b.x && b.x+b.width<=c.x);
  assert.equal(await full.evaluate(el=>getComputedStyle(el).borderTopStyle),'solid');
});
