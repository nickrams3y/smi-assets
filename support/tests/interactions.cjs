// Run with Playwright installed; uses an isolated system Chrome and a local server.
// Safari's link mouse-down blurs the input to no relatedTarget. Emulate that
// default action in Chrome so this regression stays covered without Safari CI.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
(async()=>{
 const server=http.createServer((req,res)=>{
  const name=new URL(req.url,'http://localhost').pathname.split('/').pop()||'index.html';
  if(!['index.html','hub.css','hub.js','articles.json'].includes(name)){res.writeHead(404).end();return;}
  res.setHeader('Content-Type',({'html':'text/html','css':'text/css','js':'text/javascript','json':'application/json'})[name.split('.').pop()]);
  res.end(fs.readFileSync(path.join(root,name)));
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 let browser;const passed=[];
 try{
  browser=await chromium.launch({channel:'chrome',headless:true});
  const base=`http://127.0.0.1:${server.address().port}/`,page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.addInitScript(()=>document.addEventListener('mousedown',event=>{
   if(event.button===0&&event.target.closest('.sh-live-results a')&&!event.defaultPrevented){document.activeElement.blur();event.preventDefault();}
  }));
  async function search(q='core'){
   await page.goto(base);await page.locator('#sh-query').fill(q);
   await page.locator('.sh-live-link').first().waitFor({state:'visible'});
  }
  async function heldClick(selector){
   const target=page.locator(selector).first(),bounds=await target.boundingBox();
   await page.mouse.move(bounds.x+bounds.width/2,bounds.y+bounds.height/2);await page.mouse.down();
   await page.waitForTimeout(250);
   assert(await target.isVisible(),'Suggestion disappeared between mouse-down and click');
   await page.mouse.up();
  }
  await search();await heldClick('.sh-live-link');
  await page.locator('.sh-article h1').waitFor();assert.match(page.url(),/#article=106079-/);passed.push('Safari-style mouse-down and delayed click open article');
  await search();await heldClick('.sh-live-all');
  await page.locator('.sh-results-head h1').waitFor();assert.match(page.url(),/#q=core$/);passed.push('View all results survives Safari-style blur');
  await search();await page.locator('#sh-query').press('ArrowDown');
  assert(await page.locator('.sh-live-link').evaluate(el=>el===document.activeElement));
  await page.keyboard.press('Enter');await page.locator('.sh-article h1').waitFor();passed.push('Arrow keys and Enter open article');
  await search();await page.locator('#sh-query').press('ArrowDown');await page.keyboard.press('Escape');
  assert(await page.locator('#sh-live-results').isHidden());assert(await page.locator('#sh-query').evaluate(el=>el===document.activeElement));passed.push('Escape closes suggestions and returns focus');
  await search();await page.locator('.sh-lead').click();assert(await page.locator('#sh-live-results').isHidden());passed.push('Outside click closes suggestions');
  await search();await page.locator('#sh-query').press('Tab');await page.keyboard.press('Tab');
  assert(await page.locator('.sh-live-link').evaluate(el=>el===document.activeElement));passed.push('Tab navigation reaches suggestions');
  await search();await page.locator('#sh-query').press('Enter');await page.locator('.sh-results-head h1').waitFor();assert.match(page.url(),/#q=core$/);passed.push('Search form submits normally');
  const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  mobile.on('pageerror',error=>errors.push(error.message));await mobile.goto(base);
  await mobile.locator('#sh-query').tap();await mobile.locator('.sh-mobile-dialog[open]').waitFor();
  await mobile.locator('#sh-query').fill('core');await mobile.locator('.sh-live-link[href*="106079"]').tap();
  await mobile.locator('.sh-article h1').waitFor();assert.equal(await mobile.locator('.sh-mobile-dialog').count(),0);assert.match(mobile.url(),/#article=106079-/);passed.push('Mobile tap opens article and closes search dialog');
  assert.deepEqual(errors,[]);console.log(JSON.stringify({passed,pageErrors:errors},null,2));
 }finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
})().catch(error=>{console.error(error);process.exitCode=1;});
