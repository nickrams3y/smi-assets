/* Simply Michigan Infotainment storefront enhancements. */
var SMI_DOM_RUNNER=(function(){
 var tasks=[],observer=null,timer=null,firstQueued=0,running=false,started=false;
 function observe(){observer.observe(document.body||document.documentElement,{childList:true,subtree:true})}
 function run(){
  timer=null;firstQueued=0;if(running)return;running=true;observer.disconnect();
  tasks.slice().forEach(function(task){try{task()}catch(error){console.error("SMI enhancement error",error)}});
  observe();running=false
 }
 function schedule(delay){
  var now=Date.now();if(!firstQueued)firstQueued=now;if(timer)clearTimeout(timer);
  timer=setTimeout(run,now-firstQueued>800?0:(delay==null?180:delay))
 }
 function start(){if(started)return;started=true;observer=new MutationObserver(function(){schedule(180)});observe();schedule(250)}
 function ready(){setTimeout(start,350)}
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",ready,{once:true});else ready();
 return{add:function(task){tasks.push(task);if(started)schedule(180)}}
})();

/* Mobile product previews: navigate Ecwid's existing swipe gallery, not a second gallery. */
(function(){
 var states=new WeakMap(),mobile=window.matchMedia('(max-width: 767px)');
 function imageURL(slide){
  var image=slide.querySelector('.details-gallery__thumb-bg');
  var match=image&&image.style.backgroundImage.match(/url\(["']?([^"')]+)["']?\)/);
  return match?match[1]:'';
 }
 function remove(gallery,state){
  if(state){state.scroller.removeEventListener('scroll',state.onScroll);cancelAnimationFrame(state.frame);state.row.remove();states.delete(gallery)}
  gallery.classList.remove('sm-mobile-gallery');
 }
 function enhance(){
  document.querySelectorAll('.product-details__gallery').forEach(function(gallery){
   var state=states.get(gallery),scroller=gallery.querySelector('.details-gallery__thumbs');
   // Only enhance the native horizontal mobile layout, and only after our CSS is ready.
   if(!mobile.matches||!scroller||getComputedStyle(scroller).overflowX!=='auto'||getComputedStyle(gallery).getPropertyValue('--sm-mobile-previews').trim()!=='1'){
    remove(gallery,state);return;
   }
   var slides=Array.prototype.filter.call(scroller.children,function(slide){return slide.classList.contains('details-gallery__thumb')});
   var urls=slides.map(imageURL),signature=urls.join('|');
   if(slides.length<2||urls.some(function(url){return !url})){remove(gallery,state);return}
   if(state&&state.scroller===scroller&&state.signature===signature&&state.row.isConnected){state.slides=slides;return}
   remove(gallery,state);
   var row=document.createElement('div');row.className='sm-gallery-previews';
   row.setAttribute('role','group');row.setAttribute('aria-label','Product image previews');
   state={scroller:scroller,slides:slides,row:row,signature:signature,frame:0,selected:-1};
   var buttons=urls.map(function(url,index){
    var button=document.createElement('button'),image=document.createElement('img');
    button.type='button';button.className='sm-gallery-preview';
    button.setAttribute('aria-label','View image '+(index+1)+' of '+urls.length);
    button.setAttribute('aria-pressed','false');
    // Reuse the exact gallery URL so the browser can reuse its existing request/cache.
    image.alt='';image.width=64;image.height=64;image.loading='lazy';image.decoding='async';image.src=url;
    button.appendChild(image);row.appendChild(button);
    button.addEventListener('click',function(){
     var left=state.slides[index].getBoundingClientRect().left-scroller.getBoundingClientRect().left+scroller.scrollLeft;
     scroller.scrollTo({left:left,behavior:'instant'});update();
    });
    button.addEventListener('keydown',function(event){
     var next=event.key==='ArrowRight'?Math.min(index+1,buttons.length-1):event.key==='ArrowLeft'?Math.max(index-1,0):event.key==='Home'?0:event.key==='End'?buttons.length-1:-1;
     if(next<0)return;event.preventDefault();buttons[next].focus({preventScroll:true});buttons[next].click();
    });
    return button;
   });
   function update(){
    if(!row.isConnected)return;
    var left=scroller.getBoundingClientRect().left,closest=0,distance=Infinity;
    state.slides.forEach(function(slide,index){var delta=Math.abs(slide.getBoundingClientRect().left-left);if(delta<distance){distance=delta;closest=index}});
    if(state.selected===closest)return;state.selected=closest;
    buttons.forEach(function(button,index){button.setAttribute('aria-pressed',String(index===closest))});
    // Keep the selected preview visible without scrolling the page vertically.
    var rect=buttons[closest].getBoundingClientRect(),bounds=row.getBoundingClientRect();
    if(rect.left<bounds.left)row.scrollLeft-=bounds.left-rect.left;
    else if(rect.right>bounds.right)row.scrollLeft+=rect.right-bounds.right;
   }
   state.onScroll=function(){if(state.frame)return;state.frame=requestAnimationFrame(function(){state.frame=0;update()})};
   scroller.addEventListener('scroll',state.onScroll,{passive:true});
   gallery.appendChild(row);gallery.classList.add('sm-mobile-gallery');states.set(gallery,state);update();
  });
 }
 SMI_DOM_RUNNER.add(enhance);
 window.addEventListener('resize',enhance);
 // A delayed stylesheet must not leave unstyled preview buttons on the page.
 document.addEventListener('load',function(event){if(event.target.tagName==='LINK')enhance()},true);
 window.addEventListener('load',enhance,{once:true});
})();
var SMI_NATIVE_MUTATION_OBSERVER=window.MutationObserver;
window.MutationObserver=function(callback){this.observe=function(){SMI_DOM_RUNNER.add(callback)};this.disconnect=function(){}};
(()=>{const e=document,t=t=>e.createElement(t),o=/(apim-(and-screen|replacement)|8-to-12|audio-control-module|sync-3-usb-hub|2019-2022-mustang-4-to-8|2013-2014-f-150-4-to-8|2015-2017-f-150-4-to-8|2018-2020-f-150-4-to-8|2020-2022-f-250-350-super-duty-4-to-8)/,s={d:"Choose Your Display",s:"SimplyCare Coverage",c:"Connectivity Upgrade Options",v:'4" to 8" Conversions',u:"Choose Based on Your Current System",r:"Trying to match your current color and you're unsure of what color you need?"},a=e=>(e||"").replace(/\s+/g," ").trim().toLowerCase();function l(){let s=location.pathname,l=o.test(s);if(e.documentElement.classList.toggle("sm-product-options-active",l),!l)return;let n=[...e.querySelectorAll("button")].find(e=>"add to bag"===a(e.textContent));if(n&&!e.querySelector(".sm-po-required-note")){let e=t("p");e.className="sm-po-required-note",n.insertAdjacentElement("afterend",e)}let i=e.querySelector(".details-product-options");if(!i||i.dataset.sm===s)return;let r=[...i.querySelectorAll(":scope > .details-product-option")];if(!r.length)return;let c=4,p=["Vehicle Details","Optional Upgrades"];(s.includes("2019-2022-mustang-4-to-8")||s.includes("2013-2014-f-150-4-to-8")||s.includes("2015-2017-f-150-4-to-8")||s.includes("2018-2020-f-150-4-to-8")||s.includes("2020-2022-f-250-350-super-duty-4-to-8"))?(c=Math.max(0,r.length-3),p=["Vehicle Details","Optional Upgrades"]):s.includes("8-to-12")?(c=r.findIndex(e=>/connectivity upgrade|extended warranty|upload a vin|include a complimentary sync 3\.4 update usb drive/.test(a((e.querySelector(".details-product-option__title")||e.querySelector("label")||{}).textContent))),c=c<0?r.length:c,p=["Truck & Upgrade Details","Optional Upgrades"]):s.includes("audio-control")?(c=9,p=["Vehicle Details","Optional Upgrades"]):s.includes("sync-3-usb-hub")?(c=1,p=["Choose Your Hub","Trade-In Details"]):s.includes("apim-replacement")&&(c=s.includes("without")?3:4,p=["Vehicle Details","Optional Upgrades"]),i.querySelectorAll(".sm-po-section-heading,.sm-po-section-intro").forEach(e=>e.remove());let f=s.includes("8-to-12")?r.findIndex(e=>/did you read the entire product page/.test(a((e.querySelector(".details-product-option__title")||e.querySelector("label")||{}).textContent))):-1;f<=c&&(f=-1);p.push("Review & Confirm");let d=!1;r.forEach((e,o)=>{if(0===o||o===c||o===f){let s=t("h3"),a=o===f?3:o?2:1;if(s.className="sm-po-section-heading",s.innerHTML=`<span class=sm-po-step-number>${a}</span><span>${p[a-1]}</span>`,i.insertBefore(s,e),!o&&c>0){let o=t("p");o.className="sm-po-section-intro",i.insertBefore(o,e)}}let l=e.querySelector(".details-product-option__title")||e.querySelector("label"),n=a(l&&l.textContent);e.classList.add("sm-po-card"),e.dataset.smPoKind=/replacement usb hub|which usb hub/.test(n)?"conditional":(s.includes("apim-and-screen")||s.includes("2019-2022-mustang-4-to-8")||s.includes("2013-2014-f-150-4-to-8")||s.includes("2015-2017-f-150-4-to-8")||s.includes("2018-2020-f-150-4-to-8")||s.includes("2020-2022-f-250-350-super-duty-4-to-8"))&&o>=c||/4(?:"|-inch)?\s*to\s*8|simplycare|extended warranty|wireless|connectivity upgrade|authentic usb-c|upload a (?:picture|vin)/.test(n)?"optional":"required",e.dataset.smNote="vehicle model"===n?"vehicle":"vin"===n?"vin":s.includes("apim-and-screen")&&/choose your display/.test(n)?"display":/connectivity upgrade/.test(n)?"connectivity":/upload a vin/.test(n)?"vin-photo":"";let r=/upgrade path/.test(n)?"u":/bezel and trim color/.test(n)?"r":/choose your display/.test(n)?"d":/extended warranty|simplycare/.test(n)?"s":/4(?:"|-inch)?\s*to\s*8/.test(n)?"v":!d&&/connectivity upgrade|built-in wireless/.test(n)?"c":"";if(r&&l&&!l.querySelector(".sm-po-help-button")){d=d||"c"===r;let e=t("button");e.type="button",e.className="sm-po-help-button",e.dataset.help=r,e.textContent="?",l.append(e)}let u=/^vehicle model$/.test(n)?"Select your vehicle":/^model year$/.test(n)?"Select model year":/choose your display/.test(n)?"Select your display type":"vin"===n?"Enter your 17 character VIN":"",m=u&&e.querySelector(".form-control__placeholder-inner");m&&(m.textContent=u)}),i.dataset.sm=s}e.addEventListener("click",o=>{let a=o.target.closest(".sm-po-help-button");if(a){o.preventDefault(),o.stopPropagation();let l=a.dataset.help,n=e.querySelector(".sm-po-dialog");n||(n=t("dialog"),n.className="sm-po-dialog",e.body.append(n)),n.dataset.help=l,n.innerHTML=`<div class=sm-po-dialog__header><h2 class=sm-po-dialog__title>${s[l]}</h2><button type=button class=sm-po-dialog__close aria-label=Close>×</button></div><div class=sm-po-dialog__body>${"<p class=sm-po-copy><b></b><span></span></p>".repeat(3)}<a class=sm-po-dialog__link href=https://support.simplymichigan.co/articles/104443-4-to-8-conversion-overview target=_blank>Read the conversion overview</a></div>`,n.showModal()}let l=o.target.closest(".sm-po-dialog__close");l&&l.closest("dialog").close()}),new MutationObserver(()=>requestAnimationFrame(l)).observe(e.documentElement,{childList:!0,subtree:!0}),l()})();

window.MutationObserver=SMI_NATIVE_MUTATION_OBSERVER;

/* Keep the complimentary Sync 3.4 USB drive with the optional upgrades. */
SMI_DOM_RUNNER.add(function(){
 if(!location.pathname.includes("8-to-12"))return;
 document.querySelectorAll(".details-product-option").forEach(function(card){
  var title=card.querySelector(".details-product-option__title")||card.querySelector("label");
  if(title&&/include a complimentary sync 3\.4 update usb drive/i.test(title.textContent||"")){
   card.classList.add("sm-po-card");
   card.dataset.smPoKind="optional";
  }
 });
});

(function(){
var D={Ford:{"C-Max":[2013,2015,"Standard"],Edge:[2011,2015,"Recessed"],Escape:[2013,2015,"Standard"],Expedition:[2015,2015,"Standard"],Explorer:[2011,2016,"Recessed"],"F-150":[2013,2015,"F150"],"F-250":[2013,2016,"Recessed"],"F-350":[2013,2016,"Recessed"],"F-450":[2013,2016,"Recessed"],Fiesta:[2013,2015,"Special"],Flex:[2014,2015,"Recessed"],Focus:[2012,2015,"Standard"],Fusion:[2013,2016,"Standard"],Mustang:[2015,2015,"Standard"],Taurus:[2013,2015,"Recessed"],Transit:[2015,2015,"Special"]},Lincoln:{MKC:[2015,2015,"Standard"],MKS:[2013,2015,"Recessed"],MKT:[2013,2015,"Recessed"],MKX:[2011,2015,"Recessed"],MKZ:[2013,2016,"Standard"]}};
var A={Ford:{"C-Max":[2013,2018],Edge:[2011,2024],Escape:[2013,2022],Expedition:[2015,2024],Explorer:[2011,2024],"F-150":[2013,2024],"F-250":[2013,2024],"F-350":[2013,2024],"F-450":[2013,2024],Fiesta:[2013,2019],Flex:[2014,2019],Focus:[2012,2018],Fusion:[2013,2020],Mustang:[2015,2023],Taurus:[2013,2019],Transit:[2015,2024],EcoSport:[2018,2022],Ranger:[2019,2023]},Lincoln:{Aviator:[2020,2021],Continental:[2017,2020],Corsair:[2020,2022],MKC:[2015,2019],MKS:[2013,2016],MKT:[2013,2019],MKX:[2011,2018],MKZ:[2013,2020],Nautilus:[2019,2023],Navigator:[2015,2021]}};
var P="https://simplymichigan.co/products/",U={n:P+"ford-lincoln-sync-3-apim-and-screen-complete-upgrade-kit-without-navigation",y:P+"ford-lincoln-sync-3-apim-and-screen-complete-upgrade-kit-with-navigation",t:P+"ford-f-150-f-250-sync-3-8-to-12-screen-upgrade-kit",s:P+"ford-sync-3-apim-and-screen-complete-upgrade-kit-for-fiesta-transit",f1314:P+"2013-2014-f-150-4-to-8-complete-sync-3-upgrade-kit",f1517:P+"2015-2017-f-150-4-to-8-complete-sync-3-upgrade-kit",f4:P+"2018-2020-f-150-4-to-8-complete-sync-3-upgrade-kit",sd4:P+"2020-2022-f-250-350-super-duty-4-to-8-complete-sync-3-upgrade-kit",m4:P+"2019-2022-mustang-4-to-8-complete-sync-3-upgrade-kit",an:P+"ford-lincoln-sync-3-apim-replacement-with-navigation",ax:P+"ford-lincoln-sync-3-apim-replacement-without-navigation",ds:P+"sync-3-display-screen-replacement-standard",dr:P+"sync-3-display-screen-replacement-recessed",d4:P+"sync-4-8-46-display-with-sync-3-conversion-bracket",acm:P+"audio-control-module-acm-receiver",g:"https://support.simplymichigan.co/articles/104443-4-to-8-conversion-overview",e:"https://simplymichigan.co/upgrade_guide",c:"https://simplymichigan.co/contact-us"};
function display(a,v){return a[2]==="F150"?(v>=2015?"Standard":"Recessed"):a[2]}
function replacements(t,twelve,sync4){var q=[];if(twelve)q.push(['12&quot; Upgrade Kit',U.t]);q.push(["APIM (Navigation)",U.an],["APIM (Non-Navigation)",U.ax]);if(t==="Special"){q.push(["Contact Us About a Display",U.c],["ACM Replacement",U.acm]);return q}q.push(['Sync 3 8.0&quot; Screen',t==="Standard"?U.ds:U.dr]);if(sync4)q.push(['Sync 4 8.46&quot; Screen Upgrade',U.d4]);q.push(["ACM Replacement",U.acm]);return q}
function conversionKit(make,model,year){
 if(make!=="Ford")return null;
 if(model==="F-150"){
  if(year>=2013&&year<=2014)return {name:"F-150",url:U.f1314,twelve:false};
  if(year>=2015&&year<=2017)return {name:"F-150",url:U.f1517,twelve:true};
  if(year>=2018&&year<=2020)return {name:"F-150",url:U.f4,twelve:true}
 }
 if(model==="Mustang"&&year>=2019&&year<=2022)return {name:"Mustang",url:U.m4,twelve:false};
 if((model==="F-250"||model==="F-350")&&year>=2020&&year<=2022)return {name:"Super Duty",url:U.sd4,twelve:true};
 return null
}
function conversionYearMax(make,model){if(make!=="Ford")return 0;if(model==="F-150")return 2020;if(model==="Mustang"||model==="F-250"||model==="F-350")return 2022;return 0}
var HKEY="smVehicleHandoffV1",HMAX=30*60*1000;
function clean(s){return (s||"").replace(/\s+/g," ").trim().toLowerCase()}
function remember(e){
 var link=e.target.closest(".sm-home-fit__actions a,.sm-fit__actions a");if(!link)return;var u=new URL(link.href,location.href);if(u.origin!==location.origin||!/^\/products\//.test(u.pathname))return;
 var home=!!link.closest(".sm-home-fit__actions"),p=home?"sm-home-fit-":"sm-fit-",b=document.getElementById(p+"brand"),m=document.getElementById(p+"model"),y=document.getElementById(p+"year"),s=document.getElementById(p+"system");if(!b||!m||!y||!s||!b.value||!m.value||!y.value||!s.value)return;
 var a=(D[b.value]||{})[m.value],v=+y.value,h={make:b.value,model:m.value,year:v,system:s.value,display:a?display(a,v):"",target:u.pathname.replace(/\/$/,""),created:Date.now()};try{sessionStorage.setItem(HKEY,JSON.stringify(h))}catch(x){}
}
function saved(){try{var h=JSON.parse(sessionStorage.getItem(HKEY)||"null");if(!h||Date.now()-h.created>HMAX){sessionStorage.removeItem(HKEY);return null}return h}catch(x){return null}}
function choose(row,test){var s=row.querySelector("select");if(!s)return false;var o=[].find.call(s.options,function(x){return x.value!=="Please choose"&&test(clean(x.textContent))});if(!o)return false;if(s.value!==o.value){s.value=o.value;s.dispatchEvent(new Event("input",{bubbles:true}));s.dispatchEvent(new Event("change",{bubbles:true}))}return true}
var prefillWait,lastPrefill;
function showPrefillNotice(h,box){if(box.querySelector(".sm-prefill-notice"))return;var old=document.querySelector(".sm-prefill-notice");if(old)old.remove();var n=document.createElement("div");n.className="sm-prefill-notice";n.setAttribute("role","status");n.innerHTML='<span class="sm-prefill-notice__copy"><strong>Vehicle details added</strong><span>'+h.year+" "+h.make+" "+h.model+". Please verify the selections before ordering.</span></span>";box.insertBefore(n,box.firstChild)}
function applyPrefill(h,box){
 if(!box.isConnected||box.dataset.smPrefilled)return;var done=[];
 box.querySelectorAll(":scope > .details-product-option").forEach(function(row){var t=clean((row.querySelector(".details-product-option__title")||row.querySelector("label")||{}).textContent),wanted=clean(h.make+" "+h.model),ok=false;
  if(/^(vehicle model|model|truck model)$/.test(t))ok=choose(row,function(x){var match=x===wanted||x.indexOf(wanted+" (")===0;if(!match)return false;return t!=="vehicle model"||!/^(standard|recessed)$/i.test(h.display)||x.indexOf(clean(h.display)+" display")!==-1});
  else if(t==="model year")ok=choose(row,function(x){return new RegExp("^"+h.year+"(?:\\s|\\(|$)").test(x)});
  else if(/choose your display/.test(t)&&h.display!=="Special")ok=choose(row,function(x){return x.indexOf(clean(h.display)+" 8.0")===0});
  else if(/choose your upgrade path/.test(t)){var p=h.system==="3"?'sync 3 (8")':h.system==="8"?'sync 2 (8")':h.system==="4"?'sync 3 (4")':"";if(p)ok=choose(row,function(x){return x.indexOf(p)===0})}
  if(ok)done.push(t)
 });
 if(!done.length)return;box.dataset.smPrefilled="1";lastPrefill={make:h.make,model:h.model,year:h.year,system:h.system,display:h.display,target:h.target,appliedAt:Date.now()};try{sessionStorage.removeItem(HKEY)}catch(x){}showPrefillNotice(lastPrefill,box)
}
function prefill(){var path=location.pathname.replace(/\/$/,""),box=document.querySelector(".details-product-options");if(lastPrefill&&path===lastPrefill.target&&box){if(!box.dataset.smPrefilled&&Date.now()-lastPrefill.appliedAt<10000){applyPrefill(lastPrefill,box);return}showPrefillNotice(lastPrefill,box)}var h=saved();if(!h||path!==h.target||!box||box.dataset.smPrefilled)return;clearTimeout(prefillWait);prefillWait=setTimeout(function(){applyPrefill(h,box)},1000)}
if(!document.documentElement.dataset.smVehicleHandoff){document.documentElement.dataset.smVehicleHandoff="1";document.addEventListener("click",remember,true)}
function landing(){if(!/\/products\/sync-2-to-sync-3-upgrades\/?$/.test(location.pathname))return;var c=document.getElementById("sm-fit-checker");if(!c)return;var title="Let's Find Your System",copy="Our plug and play upgrade kits make it easy for you to upgrade your vehicle to the faster, more modern Sync 3 system, complete with Apple CarPlay and Android Auto. Just enter your vehicle's information below to find the right kit for your vehicle.",t=document.getElementById("sm-fit-title"),top=c.previousElementSibling,b=document.getElementById("sm-fit-brand"),l=b&&b.closest("label"),bl=l&&l.querySelector("span"),bt=l&&[].find.call(l.childNodes,function(x){return x.nodeType===3&&x.nodeValue.trim()}),bo=b&&b.querySelector('option[value=""]'),privacy=c.querySelector(".sm-fit__privacy");if(t&&t.textContent!==title)t.textContent=title;if(bl&&bl.textContent!=="Make")bl.textContent="Make";else if(!bl&&bt&&bt.nodeValue.trim()!=="Make")bt.nodeValue="Make";if(bo&&bo.textContent!=="Select make")bo.textContent="Select make";if(privacy)privacy.remove();if(top){var x=top.querySelector('[aria-label="Three steps to choose a Sync 3 conversion kit"]'),p=[].find.call(top.querySelectorAll("p"),function(z){return /Our plug and play upgrade kits/.test(z.textContent)}),benefits=top.querySelector(".sm-landing-benefits");if(x)x.remove();if(p&&p.textContent!==copy)p.textContent=copy;if(!benefits){benefits=document.createElement("div");benefits.className="sm-landing-benefits";benefits.setAttribute("aria-label","Sync 3 upgrade benefits");benefits.innerHTML='<span class="sm-landing-benefit"><span aria-hidden="true">✓</span> Fully Tested</span><span class="sm-landing-benefit"><span aria-hidden="true">✓</span> VIN Programmed</span><span class="sm-landing-benefit"><span aria-hidden="true">✓</span> Plug &amp; Play</span><span class="sm-landing-benefit"><span aria-hidden="true">✓</span> 1 Year Warranty</span>';var badges=[].find.call(top.querySelectorAll("p"),function(z){return z.querySelector('img[alt="Android Auto"]')&&z.querySelector('img[alt="Apple CarPlay"]')});if(badges)badges.insertAdjacentElement("afterend",benefits);else top.appendChild(benefits)}}}
function apimLanding(){
 if(!/\/products\/sync-3-apims\/?$/.test(location.pathname))return;var steps=document.querySelector('[aria-label*="steps"][aria-label*="APIM"]'),checker=document.getElementById("sm-fit-checker"),scope=(steps&&steps.parentElement)||(checker&&checker.parentElement);if(!scope)return;
 var copy="Replace a failed Sync 3 APIM with a genuine Ford or Lincoln module that is fully tested, updated, and programmed to your VIN. Enter your vehicle details below to find the correct replacement.",p=[].find.call(scope.querySelectorAll(":scope > p"),function(x){return /Replace a failed Sync 3 APIM/.test(x.textContent)});if(p&&p.textContent!==copy)p.textContent=copy;
 if(checker){if(steps)steps.remove();return}checker=document.createElement("section");checker.id="sm-fit-checker";checker.className="sm-fit sm-fit--apim";checker.setAttribute("aria-labelledby","sm-fit-title");checker.innerHTML='<div class="sm-fit__heading"><span class="sm-fit__icon" aria-hidden="true">&#10003;</span><div><h3 id="sm-fit-title">Find the Right APIM</h3><p>Choose your vehicle and current system to see the correct replacement path.</p></div></div><form id="sm-fit-form" class="sm-fit__form"><label class="sm-fit__field"><span>Make</span><select id="sm-fit-brand" required><option value="">Select make</option><option>Ford</option><option>Lincoln</option></select></label><label class="sm-fit__field"><span>Model</span><select id="sm-fit-model" required disabled><option value="">Select model</option></select></label><label class="sm-fit__field"><span>Model year</span><select id="sm-fit-year" required disabled><option value="">Select model year</option></select></label><label class="sm-fit__field"><span>Current system</span><select id="sm-fit-system" required disabled><option value="">Select system</option><option value="8">8&quot; Sync 2 (touch screen)</option><option value="3">8&quot; Sync 3 (touch screen)</option><option value="4">4&quot; Base Sync (non-touch screen)</option><option value="u">I&rsquo;m not sure</option></select></label><button class="sm-fit__submit" type="submit">Find My Replacement</button></form><div id="sm-fit-result" class="sm-fit__result" aria-live="polite" hidden></div>';
 if(steps)steps.replaceWith(checker)
}
function faq(){
 var box=document.querySelector(".ec-store__category-page--39980905 .sm-upgrade-single-column");if(!box||box.dataset.smFaq)return;box.querySelectorAll("li").forEach(function(x){x.textContent=x.textContent.replace(/^2013-2015 Ford F-(250|350|450)$/, "2013-2016 Ford F-$1")});box.dataset.smFaq="1";var wrap=box.parentElement,h=[].find.call(wrap.children,function(x){return x.tagName==="H3"}),p=[].find.call(wrap.children,function(x){return x.tagName==="P"}),b=document.createElement("button"),d=document.createElement("dialog");
 b.type="button";b.className="sm-faq-launcher";b.innerHTML='<span class="sm-faq-launcher__icon" aria-hidden="true">?</span><span>Frequently Asked Questions</span>';d.className="sm-faq-dialog";d.innerHTML='<div class="sm-faq-dialog__header"><h2>Frequently Asked Questions</h2><button type="button" class="sm-faq-dialog__close" aria-label="Close">&times;</button></div><div class="sm-faq-dialog__body"></div>';wrap.insertBefore(b,box);if(h)h.remove();if(p)p.remove();d.querySelector(".sm-faq-dialog__body").appendChild(box);document.body.appendChild(d);
 b.addEventListener("click",function(){document.documentElement.classList.add("sm-faq-modal-open");d.showModal()});d.querySelector(".sm-faq-dialog__close").addEventListener("click",function(){d.close()});d.addEventListener("click",function(e){if(e.target===d)d.close()});d.addEventListener("close",function(){document.documentElement.classList.remove("sm-faq-modal-open")});box.querySelectorAll("details").forEach(function(x){x.addEventListener("toggle",function(){if(x.open)box.querySelectorAll("details").forEach(function(z){if(z!==x)z.open=false})})});
}
function support(){
 var n=document.querySelector('.ec-store__category-page--39980905 [role="note"][aria-label="Vehicle upgrade eligibility"]');if(!n)return;var g=n.querySelector("a");if(g)g.href=U.e;var row=n.closest(".sm-support-row");if(row){row.parentNode.insertBefore(n,row);row.remove()}
 var holder=n.querySelector(":scope > span:last-child")||n,line=g&&g.parentElement!==holder?g.parentElement:holder,old=n.querySelector(".sm-eligibility-contact");if(old){if(old.tagName==="A")return;var a=old.querySelector("a");if(a){line.appendChild(document.createTextNode(" Questions? "));a.className="sm-eligibility-contact";a.href=U.c;a.textContent="Contact us";line.appendChild(a);old.remove()}return}
 line.appendChild(document.createTextNode(" Questions? "));var q=document.createElement("a");q.className="sm-eligibility-contact";q.href=U.c;q.textContent="Contact us";line.appendChild(q)
}
function fitmentAlert(){
 if(document.documentElement.dataset.smFitmentAlert)return;document.documentElement.dataset.smFitmentAlert="1";
 document.addEventListener("click",function(e){var b=e.target.closest(".sm-fitment-alert");if(!b)return;e.preventDefault();e.stopPropagation();var d=document.querySelector(".sm-fitment-dialog");if(!d){d=document.createElement("dialog");d.className="sm-po-dialog sm-fitment-dialog";document.body.appendChild(d);d.addEventListener("click",function(x){if(x.target===d)d.close()});d.addEventListener("close",function(){document.documentElement.classList.remove("sm-po-modal-open")})}d.innerHTML='<div class="sm-po-dialog__header"><h2 class="sm-po-dialog__title">Lincoln MKZ and MKC Screen Fitment</h2><button type="button" class="sm-po-dialog__close" aria-label="Close">&times;</button></div><div class="sm-po-dialog__body"><p>Due to a redesigned display, MKZ and MKC vehicles will require bracket modification to complete the installation, as described <a href="https://support.simplymichigan.co/articles/104288-screen-fitment-and-converting-mkc-and-mkz-vehicles">here</a>. If we have brackets in stock, your conversion kit will include replacement brackets. Please verify with us before purchase to ensure that we have these brackets stocked if you\'re depending on them to complete your installation.</p></div>';document.documentElement.classList.add("sm-po-modal-open");if(!d.open)d.showModal()});
 document.addEventListener("click",function(e){var c=e.target.closest(".sm-fitment-dialog .sm-po-dialog__close");if(c){var d=c.closest("dialog");if(d.open)d.close()}})
}
function pricePromo(){
 var box=document.querySelector(".product-details__product-price-row .product-details-module__content");if(!box)return;
 var existing=box.querySelector(".sm-price-promo"),isTwelve=/\/products\/ford-f-150-f-250-sync-3-8-to-12-screen-upgrade-kit\/?$/.test(location.pathname);
 if(isTwelve){if(!existing){existing=document.createElement("div");box.appendChild(existing)}existing.className="sm-price-promo sm-price-promo--excluded";existing.setAttribute("role","note");delete existing.dataset.code;delete existing.dataset.amount;existing.innerHTML='<span class="sm-price-promo__check" aria-hidden="true">✓</span><span class="sm-price-promo__text">Automatically discounted — additional coupons do not apply</span>';return}
 var banner=[].find.call(document.querySelectorAll(".ins-tile__text"),function(x){return /use code\s+[a-z0-9_-]+\s+for\s+\d+(?:\.\d+)?%\s+off/i.test(x.textContent)}),match=banner&&banner.textContent.match(/use code\s+([a-z0-9_-]+)\s+for\s+(\d+(?:\.\d+)?%)\s+off/i);if(!match)return;
 var code=match[1].toUpperCase(),amount=match[2],promo=existing;
 if(!promo){promo=document.createElement("div");box.appendChild(promo)}promo.className="sm-price-promo";promo.setAttribute("role","note");if(!promo.querySelector(".sm-price-promo__copy"))promo.innerHTML='<span class="sm-price-promo__text"></span><button class="sm-price-promo__copy" type="button">Copy</button><span class="sm-price-promo__status" role="status" aria-live="polite"></span>';
 var set=function(el,rules){if(!el)return;Object.keys(rules).forEach(function(k){el.style.setProperty(k,rules[k],"important")})},sale=box.querySelector(".product-details__product-on-sale"),label=box.querySelector(".product-details__label-container"),compare=box.querySelector(".details-product-price-compare__container"),paypal=box.querySelector(".ec-paypal-pay-later-message"),copy=promo.querySelector(".sm-price-promo__copy"),status=promo.querySelector(".sm-price-promo__status");
 box.querySelectorAll(".product-details__product-price-discount,.details-product-price-discount__text,.details-product-price-discount__value").forEach(function(x){x.remove()});
 set(box,{display:"grid","grid-template-columns":"max-content max-content minmax(0, 1fr)","grid-template-areas":'"price sale-label comparison" "promotion promotion promotion" "paypal paypal paypal"',"align-items":"center","column-gap":"9px","row-gap":"7px"});box.dataset.smPricePromoLayout="1";set(box.querySelector(".product-details__product-price"),{"grid-area":"price"});set(sale,{display:"contents"});set(label,{"grid-area":"sale-label","justify-self":"start"});set(compare,{"grid-area":"comparison",margin:"0"});set(paypal,{"grid-area":"paypal",width:"100%"});
 set(promo,{"grid-area":"promotion",display:"inline-flex",width:"fit-content","max-width":"100%","align-items":"center",gap:"8px","justify-self":"start",padding:"7px 9px 7px 12px",color:"#222",background:"#f3f4f6",border:"1px solid #d7d9dd","border-radius":"999px","font-size":"13px","font-weight":"700","line-height":"1.25"});set(promo.querySelector(".sm-price-promo__text"),{"white-space":"nowrap"});set(copy,{appearance:"none",flex:"0 0 auto","min-height":"28px",padding:"4px 9px",color:"#222",background:"#fff",border:"1px solid #b9bdc4","border-radius":"999px",font:"inherit","font-size":"12px","line-height":"1.2"});set(status,{position:"absolute",width:"1px",height:"1px",padding:"0",margin:"-1px",overflow:"hidden",clip:"rect(0, 0, 0, 0)","white-space":"nowrap",border:"0"});
 if(promo.dataset.code===code&&promo.dataset.amount===amount)return;promo.dataset.code=code;promo.dataset.amount=amount;promo.querySelector(".sm-price-promo__text").textContent="Extra "+amount+" off with code "+code;promo.querySelector(".sm-price-promo__copy").textContent="Copy";promo.querySelector(".sm-price-promo__status").textContent=""
}
function lazyEmbeds(){
 document.querySelectorAll('iframe[src*="youtube.com/embed"],iframe[src*="youtube-nocookie.com/embed"]').forEach(function(frame){
  if(!frame.hasAttribute("loading"))frame.setAttribute("loading","lazy");
  if(!frame.hasAttribute("fetchpriority"))frame.setAttribute("fetchpriority","low")
 })
}
if(!document.documentElement.dataset.smPricePromoListener){document.documentElement.dataset.smPricePromoListener="1";document.addEventListener("click",function(e){var b=e.target.closest(".sm-price-promo__copy");if(!b)return;var promo=b.closest(".sm-price-promo"),code=promo.dataset.code,done=function(){b.textContent="Copied";promo.querySelector(".sm-price-promo__status").textContent="Code copied: "+code;setTimeout(function(){if(b.isConnected)b.textContent="Copy"},2200)};if(navigator.clipboard&&window.isSecureContext)navigator.clipboard.writeText(code).then(done).catch(function(){});else{var x=document.createElement("textarea");x.value=code;x.setAttribute("readonly","");x.style.position="fixed";x.style.opacity="0";document.body.appendChild(x);x.select();try{document.execCommand("copy");done()}catch(z){}x.remove()}})}
var SYSTEM_IMAGE_ROOT="https://nickrams3y.github.io/smi-assets/images/system-selector/";
function visualSystemPicker(s){
 if(!s)return function(){};var old=s.parentElement&&s.parentElement.nextElementSibling;if(old&&old.classList.contains("sm-system-picker"))return old.smRefresh||function(){};
 var label=s.closest("label"),group=document.createElement("div"),dialog=document.createElement("dialog"),choices=[["8",'8" Sync 2',"Touch screen","sync-2.jpg"],["3",'8" Sync 3',"Touch screen","sync-3.jpg"],["4",'4" Base Sync',"Non-touch screen","base-sync.jpg"],["u","Not sure","We can help identify it","not-sure.jpg"]];
 function cards(){return choices.map(function(x){return '<button type="button" class="sm-system-card" data-system="'+x[0]+'" role="radio" aria-checked="false"><img src="'+SYSTEM_IMAGE_ROOT+x[3]+'" alt="" loading="lazy" decoding="async"><span><strong>'+x[1]+'</strong><small>'+x[2]+'</small></span></button>'}).join("")}
 s.required=false;s.classList.add("sm-system-native");if(label)label.classList.add("sm-system-field-native");group.className="sm-system-picker";group.innerHTML='<span class="sm-system-picker__label">Current system</span><button type="button" class="sm-system-picker__trigger" aria-haspopup="dialog" aria-expanded="false"><img class="sm-system-picker__thumb" alt="" hidden><span class="sm-system-picker__value"><strong>Select system</strong><small>Tap to view pictures</small></span><span class="sm-system-picker__chevron" aria-hidden="true"></span></button>';dialog.className="sm-system-dialog";dialog.setAttribute("aria-labelledby","sm-system-dialog-title");dialog.innerHTML='<div class="sm-system-dialog__panel"><div class="sm-system-dialog__header"><div><h3 id="sm-system-dialog-title">Select your current system</h3><p>Choose the screen that looks most like the one in your vehicle.</p></div><button type="button" class="sm-system-dialog__close" aria-label="Close">&times;</button></div><div class="sm-system-picker__choices" role="radiogroup" aria-label="Current system">'+cards()+'</div></div>';if(label)label.insertAdjacentElement("afterend",group);else s.insertAdjacentElement("afterend",group);document.body.appendChild(dialog);
 var trigger=group.querySelector(".sm-system-picker__trigger"),thumb=group.querySelector(".sm-system-picker__thumb"),value=group.querySelector(".sm-system-picker__value"),chevron=group.querySelector(".sm-system-picker__chevron"),homeField=s.id==="sm-home-fit-system",set=function(el,k,v){el.style.setProperty(k,v,"important")};
 set(group,"grid-column","auto");set(group,"min-width","0");[["display","flex"],["width","100%"],["min-width","0"],["height",homeField?"44px":"46px"],["min-height",homeField?"44px":"46px"],["grid-column","auto"],["justify-self","stretch"],["justify-content","flex-start"],["align-items","center"],["margin","0"],["padding",homeField?"0 32px 0 11px":"0 36px 0 12px"],["border",homeField?"1px solid #cfcfcf":"1px solid #b9c0c7"],["border-radius",homeField?"7px":"8px"],["background","#fff"],["color","#222"],["box-shadow","none"],["text-align","left"]].forEach(function(x){set(trigger,x[0],x[1])});set(thumb,"display","none");set(value,"white-space","nowrap");set(value,"overflow","hidden");set(value.querySelector("small"),"display","none");set(value.querySelector("strong"),"overflow","hidden");set(value.querySelector("strong"),"text-overflow","ellipsis");set(value.querySelector("strong"),"font-weight",homeField?"700":"400");chevron.textContent="▾";[["width","auto"],["height","auto"],["top","50%"],["right","14px"],["margin","-7px 0 0"],["border","0"],["transform","none"],["font-size","14px"],["line-height","1"]].forEach(function(x){set(chevron,x[0],x[1])});
 function close(){if(dialog.open)dialog.close();trigger.setAttribute("aria-expanded","false")}
 function refresh(){var off=s.disabled,selected=choices.find(function(x){return s.value===x[0]});group.classList.toggle("is-disabled",off);trigger.disabled=off;set(trigger,"background",off?"#f1f1f1":"#fff");set(trigger,"color",off?"#777":"#222");set(value.querySelector("strong"),"color",off?"#777":"#222");dialog.querySelectorAll(".sm-system-card").forEach(function(b){var on=s.value===b.dataset.system;b.classList.toggle("is-selected",on);b.setAttribute("aria-checked",on?"true":"false")});if(selected){thumb.src=SYSTEM_IMAGE_ROOT+selected[3];thumb.hidden=false;value.querySelector("strong").textContent=selected[1];value.querySelector("small").textContent=selected[2]}else{thumb.removeAttribute("src");thumb.hidden=true;value.querySelector("strong").textContent="Select system";value.querySelector("small").textContent=off?"Complete the fields above first":"Tap to view pictures"}}
 trigger.addEventListener("click",function(){if(trigger.disabled)return;trigger.setAttribute("aria-expanded","true");dialog.showModal()});dialog.addEventListener("click",function(e){var b=e.target.closest(".sm-system-card");if(b){s.value=b.dataset.system;s.dispatchEvent(new Event("input",{bubbles:true}));s.dispatchEvent(new Event("change",{bubbles:true}));refresh();close();return}if(e.target===dialog||e.target.closest(".sm-system-dialog__close"))close()});dialog.addEventListener("close",function(){trigger.setAttribute("aria-expanded","false")});s.addEventListener("change",refresh);group.smRefresh=refresh;refresh();return refresh
}
function home(){
 var f=document.getElementById("sm-home-fit-form");if(!f||f.dataset.ready)return;f.dataset.ready="1";
 var b=document.getElementById("sm-home-fit-brand"),m=document.getElementById("sm-home-fit-model"),y=document.getElementById("sm-home-fit-year"),s=document.getElementById("sm-home-fit-system"),r=document.getElementById("sm-home-fit-result"),X={Ford:{"F-150":2020,"F-250":2022,"F-350":2022,Mustang:2022}},bl=b.closest("label").querySelector("span"),bo=b.querySelector('option[value=""]'),os=s.querySelector('option[value=""]'),o8=s.querySelector('option[value="8"]'),o3=s.querySelector('option[value="3"]');if(bl)bl.textContent="Make";if(bo)bo.textContent="Select make";if(os)os.textContent="Select system";if(o3)o3.textContent='8" Sync 3 (touch screen)';if(o8&&o3)s.insertBefore(o3,o8.nextSibling);var refreshSystem=visualSystemPicker(s);
 function base(){return (D[b.value]||{})[m.value]}
 function max(a){return (X[b.value]||{})[m.value]||a[1]}
 function system(){s.disabled=!(b.value&&m.value&&y.value);if(s.disabled)s.value="";refreshSystem()}
 function models(){m.innerHTML='<option value="">Select model</option>';years();Object.keys(D[b.value]||{}).forEach(function(k){var o=document.createElement("option");o.value=o.textContent=k;m.appendChild(o)});m.disabled=!b.value}
 function years(){var a=base();y.innerHTML='<option value="">Select year</option>';y.disabled=!a;if(a)for(var i=a[0];i<=max(a);i++){var o=document.createElement("option");o.value=o.textContent=i;y.appendChild(o)}system()}
 function has12(k,v){return b.value==="Ford"&&((k==="F-150"&&v>=2015&&v<=2020)||((k==="F-250"||k==="F-350")&&v>=2017&&v<=2022))}
 function actions(a){return '<div class="sm-home-fit__actions">'+a.map(function(x){return '<a href="'+x[1]+'">'+x[0]+'</a>'}).join("")+'</div>'}
 function show(t,p,a,n){r.className="sm-home-fit__result"+(n?" sm-home-fit__result--notice":"")+(t==="Your vehicle is eligible"||/^We have a complete kit for your /.test(t)?" sm-home-fit__result--eligible":"");r.innerHTML="<h3>"+t+"</h3><p>"+p+"</p>"+(a?actions(a):"");r.hidden=false}
 b.addEventListener("change",models);m.addEventListener("change",years);y.addEventListener("change",system);system();
 f.addEventListener("submit",function(e){e.preventDefault();var k=m.value,a=base(),v=+y.value,z=s.value;if(!b.value||!k||!a||!v||!z){show("Please complete all four fields","Select a make, model, year and current system.",0,1);return}
  if(z==="4"){
   var kit=conversionKit(b.value,k,v);if(kit){var links=[["View the "+kit.name+" Kit",kit.url]];if(kit.twelve)links.push(["12&quot; Upgrade Kit",U.t]);show("We have a complete kit for your "+kit.name,"This kit includes all of the hardware and programming needed to upgrade your factory 4&quot; system to Sync 3.",links);return}
   show("This vehicle may be convertible","A factory base Sync 4&quot; system needs additional hardware and programming. Review the conversion guide or contact us and we will help identify what you need.",[["Read the 4&quot; to 8&quot; Guide",U.g],["Contact Us",U.c]],1);return
  }
  if(z==="3"){var t=display(a,v),twelve=has12(k,v),q=replacements(t,twelve,!(b.value==="Lincoln"&&(k==="MKZ"||k==="MKC"))),p=twelve?'Your vehicle is eligible for our 12&quot; screen upgrade, which retains your existing Sync 3 system. We also offer VIN programmed APIM modules, replacement displays, and ACM replacements for your vehicle.':"We offer VIN programmed APIM modules, replacement displays, and ACM replacements for your vehicle.";show("Looking for replacement hardware?",p,q);return}
  if(z==="u"){show("We can identify it for you","Send us a clear dashboard photo and your model year, and we will identify your system.",[["Contact Us",U.c]],1);return}
  if(v<a[0]||v>a[1]){show("Let’s verify this combination","That model year was not normally equipped with Sync 2. Contact us and we will confirm what is currently installed.",[["Contact Us",U.c]],1);return}
  var t=display(a,v);if(t==="Special"){show("Your vehicle is eligible","Your "+v+" "+b.value+" "+k+" uses our dedicated Fiesta/Transit Sync 3 upgrade kit. Alternatively, if you’re looking to resolve an audio issue, we also offer ACM (audio control module) replacements.",[["View the Correct Kit",U.s],["ACM Replacement",U.acm]]);return}
  var q=[["Sync 3 Upgrade with Factory Navigation",U.y],["Sync 3 Upgrade without Factory Navigation",U.n]],f150=b.value==="Ford"&&k==="F-150"&&v===2015,p=f150?'Your 2015 Ford F-150 requires the <strong>standard display</strong>. Choose your preferred navigation option; every kit includes Apple CarPlay and Android Auto. Your truck is also eligible for our 12&quot; screen upgrade, allowing you to complete both upgrades together. If you’re looking to resolve an audio issue, we also offer ACM replacements.':"Your "+v+" "+b.value+" "+k+" requires the <strong>"+t.toLowerCase()+" display</strong>. Choose your preferred navigation option; every kit includes Apple CarPlay and Android Auto. Alternatively, if you’re looking to resolve an audio issue, we also offer ACM (audio control module) replacements.";if(has12(k,v))q.push(['12&quot; Upgrade Kit',U.t]);q.push(["ACM Replacement",U.acm]);show("Your vehicle is eligible",p,q)
 });
}
function init(){
 lazyEmbeds();
 fitmentAlert();
 pricePromo();
 prefill();
 landing();
 apimLanding();
 faq();
 support();
 home();
 var f=document.getElementById("sm-fit-form");if(!f||f.dataset.ready)return;f.dataset.ready=1;
 var b=document.getElementById("sm-fit-brand"),m=document.getElementById("sm-fit-model"),y=document.getElementById("sm-fit-year"),s=document.getElementById("sm-fit-system"),r=document.getElementById("sm-fit-result"),isApim=/\/products\/sync-3-apims\/?$/.test(location.pathname),V=isApim?A:D,bl=b.closest("label").querySelector("span"),bo=b.querySelector('option[value=""]');if(bl)bl.textContent="Make";if(bo)bo.textContent="Select make";if(m.tagName!=="SELECT"){var n=document.createElement("select");n.id=m.id;n.required=true;n.disabled=true;n.innerHTML='<option value="">Select model</option>';m.replaceWith(n);m=n;var d=document.getElementById("sm-fit-models");if(d)d.remove()}var o8=s.querySelector('option[value="8"]'),o3=s.querySelector('option[value="3"]'),o4=s.querySelector('option[value="4"]');if(o8)o8.textContent='8" Sync 2 (touch screen)';if(o3)o3.textContent='8" Sync 3 (touch screen)';if(o8&&o3)s.insertBefore(o3,o8.nextSibling);if(o4)o4.textContent='4" Base Sync (non-touch screen)';var refreshSystem=visualSystemPicker(s);
 function key(){return m.value}
 function system(){s.disabled=!(b.value&&m.value&&y.value);if(s.disabled)s.value="";refreshSystem()}
 function models(){m.innerHTML='<option value="">Select model</option>';years();Object.keys(V[b.value]||{}).forEach(function(k){var o=document.createElement("option");o.value=o.textContent=k;m.appendChild(o)});m.disabled=!b.value}
 function years(){var k=key(),a=k&&V[b.value][k],end=a&&(isApim?a[1]:Math.max(a[1],conversionYearMax(b.value,k)));y.innerHTML='<option value="">Select model year</option>';y.disabled=!a;if(a)for(var i=a[0];i<=end;i++){var o=document.createElement("option");o.value=o.textContent=i;y.appendChild(o)}system()}
 function buttons(a){return '<div class="sm-fit__actions">'+a.map(function(x){return '<a'+(x[2]?' class="sm-fit__secondary"':'')+' href="'+x[1]+'">'+x[0]+'</a>'}).join("")+'</div>'}
 function show(t,p,a,n){r.className="sm-fit__result"+(n?" sm-fit__result--notice":"")+(t==="Your vehicle is eligible"||/^We have a complete kit for your /.test(t)?" sm-fit__result--eligible":"");r.innerHTML="<h4>"+t+"</h4><p>"+p+"</p>"+(a?buttons(a):"");r.hidden=false}
 b.addEventListener("change",models);m.addEventListener("change",years);y.addEventListener("change",system);system();
 f.addEventListener("submit",function(e){e.preventDefault();var k=key(),a=k&&V[b.value][k],v=+y.value,z=s.value;if(!b.value||!k||!a||!v||!z){show("Please complete all four fields","Select a make, model, year and current system.",0,1);return}
 if(isApim){
  if(z==="3"){show("Your vehicle uses Sync 3","Choose the replacement APIM you prefer. Both options are tested, fully updated, and programmed to your VIN before shipping.",[["APIM with Factory Navigation",U.an],["APIM without Factory Navigation",U.ax]]);return}
  if(z==="8"){show("You currently have Sync 2","A replacement APIM alone will not upgrade a Sync 2 system. Choose a complete Sync 3 upgrade kit instead; both options include Apple CarPlay and Android Auto.",[["Sync 3 Upgrade with Factory Navigation",U.y],["Sync 3 Upgrade without Factory Navigation",U.n]],1);return}
  if(z==="4"){var kit=conversionKit(b.value,k,v);if(kit){var links=[["View the "+kit.name+" Kit",kit.url]];if(kit.twelve)links.push(["12&quot; Upgrade Kit",U.t]);show("We have a complete kit for your "+kit.name,"A replacement APIM alone will not upgrade a factory 4&quot; base system. This complete kit includes the additional hardware and programming needed for the conversion.",links);return}show("You need a complete conversion kit","A replacement APIM alone will not upgrade a factory 4&quot; base system. Use our conversion guide to identify the additional hardware and programming your vehicle requires.",[["Find a Complete Upgrade",P+"sync-2-to-sync-3-upgrades"],["Read the 4&quot; to 8&quot; Guide",U.g]],1);return}
  show("We can identify it for you","Send us a clear dashboard photo along with your vehicle model and year, and we will identify your system.",[["Contact Us",U.c]],1);return
 }
 if(z==="4"){var kit=conversionKit(b.value,k,v);if(kit){var links=[["View the "+kit.name+" Kit",kit.url]];if(kit.twelve)links.push(["12&quot; Upgrade Kit",U.t]);show("We have a complete kit for your "+kit.name,"This kit includes all of the hardware and programming needed to upgrade your factory 4&quot; system to Sync 3.",links);return}show("This may be convertible","A factory 4&quot; base Sync system needs additional hardware and programming. Unfortunately we don't currently stock a complete kit for your vehicle, but we can definitely get you most of the way there. You would just need to source a few parts elsewhere. Review the conversion guide and contact us if you have any questions; we would be happy to help.",[["Read the 4&quot; to 8&quot; Guide",U.g],["Contact Us",U.c,1]],1);return}
 if(z==="3"){var t=display(a,v),twelve=b.value==="Ford"&&k==="F-150"&&v===2015,q=replacements(t,twelve,!(b.value==="Lincoln"&&(k==="MKZ"||k==="MKC"))),p=twelve?'Your vehicle is eligible for our 12&quot; screen upgrade, which retains your existing Sync 3 system. We also offer VIN programmed APIM modules, replacement displays, and ACM replacements for your vehicle.':"We offer VIN programmed APIM modules, replacement displays, and ACM replacements for your vehicle.";show("Looking for replacement hardware?",p,q);return}
 if(z==="u"){show("We can identify it for you","Send us a clear dashboard photo and your model year, and we will identify your system.",[["Send Us Your Details",U.c]],1);return}
 if(v<a[0]||v>a[1]){show("Let’s verify this combination","That model year was not normally equipped with Sync 2. Contact us and we will confirm what is currently installed.",[["Contact Us",U.c]],1);return}
 var t=display(a,v);if(t==="Special"){show("Your vehicle is eligible","Your "+v+" "+b.value+" "+k+" uses our dedicated 6.5-inch Fiesta/Transit Sync 3 upgrade kit. Alternatively, if you’re looking to resolve an audio issue, we also offer ACM (audio control module) replacements.",[["View the Correct Kit",U.s],["ACM Replacement",U.acm]]);return}
 var q=[["Sync 3 Upgrade with Factory Navigation",U.y],["Sync 3 Upgrade without Factory Navigation",U.n]],f150=b.value==="Ford"&&k==="F-150"&&v===2015,p=f150?'Your 2015 Ford F-150 requires the <strong>standard display</strong>. Choose your preferred navigation option; every kit includes Apple CarPlay and Android Auto. Your truck is also eligible for our 12&quot; screen upgrade, allowing you to complete both upgrades together. If you’re looking to resolve an audio issue, we also offer ACM replacements.':"Your "+v+" "+b.value+" "+k+" requires the <strong>"+t.toLowerCase()+" display</strong>. Choose your system with or without factory navigation; both kits include Apple CarPlay and Android Auto. Alternatively, if you’re looking to resolve an audio issue, we also offer ACM (audio control module) replacements.";if(f150)q.push(["12&quot; Upgrade Kit",U.t]);q.push(["ACM Replacement",U.acm]);show("Your vehicle is eligible",p,q)
 });
}
SMI_DOM_RUNNER.add(init);
})();

(function(){
 if(document.documentElement.dataset.smUpgradeDialogs)return;
 document.documentElement.dataset.smUpgradeDialogs="1";
 function close(dialog){
  if(!dialog)return;
  if(typeof dialog.close==="function"&&dialog.open)dialog.close();else dialog.removeAttribute("open");
  document.documentElement.classList.remove("sm-upgrade-modal-open")
 }
 document.addEventListener("click",function(event){
  var opener=event.target.closest("[data-sm-upgrade-open]");
  if(opener){
   event.preventDefault();
   var dialog=document.getElementById(opener.getAttribute("data-sm-upgrade-open"));
   if(!dialog)return;
   if(!dialog.dataset.smUpgradeBound){dialog.dataset.smUpgradeBound="1";dialog.addEventListener("close",function(){document.documentElement.classList.remove("sm-upgrade-modal-open")})}
   document.documentElement.classList.add("sm-upgrade-modal-open");
   if(typeof dialog.showModal==="function"){if(!dialog.open)dialog.showModal()}else dialog.setAttribute("open","");
   return
  }
  var closer=event.target.closest("[data-sm-upgrade-close]");
  if(closer){event.preventDefault();close(closer.closest("dialog"));return}
  if(event.target.matches&&event.target.matches("dialog.sm-upgrade-modal"))close(event.target)
 })
})();

(function(){
 function enhanceTextDisclosures(){
  var root=document.querySelector(".product-details__product-description");
  if(!root)return;
  var policyPreviews={
   "warranty":"Your hardware is covered for one year from the purchase date. If a covered component fails, we’ll replace it.",
   "processing time":"Most orders are prepared and shipped within five business days, although processing times may vary.",
   "shipping":"Free domestic shipping is included to all 50 states. Every order is securely packaged to protect its contents during transit.",
   "returns and cancellations":"Free domestic returns are available within 30 days. We’ll provide a prepaid return label at no charge."
  };
  root.querySelectorAll('details[style*="border-left:3px solid #9a9a9a"]').forEach(function(detail){
   var summary=detail.querySelector(":scope > summary");
   if(!summary)return;
   detail.classList.add("sm-text-disclosure");
   summary.querySelectorAll("span").forEach(function(span){
    if(!span.classList.contains("sm-disclosure-action")&&span.textContent.trim().toLowerCase()==="read more"){
     span.classList.add("sm-disclosure-legacy-action");
     var previewRow=span.parentElement;
     if(previewRow&&previewRow!==summary){
      previewRow.classList.add("sm-disclosure-preview-row");
      Array.prototype.forEach.call(previewRow.children,function(child){
       if(child!==span)child.classList.add("sm-disclosure-preview")
      })
     }
    }
   });
   var directTitle=Array.prototype.map.call(summary.childNodes,function(node){return node.nodeType===3?node.textContent:""}).join(" ").replace(/\s+/g," ").trim();
   var titleKey=directTitle.toLowerCase(),previewCopy=policyPreviews[titleKey];
   if(previewCopy&&!summary.querySelector(":scope > .sm-disclosure-preview-row")){
    Array.prototype.forEach.call(summary.childNodes,function(node){if(node.nodeType===3)node.remove()});
    var titleSpan=document.createElement("span");
    titleSpan.className="sm-disclosure-title";
    titleSpan.textContent=directTitle;
    var row=document.createElement("span");
    row.className="sm-disclosure-preview-row";
    var preview=document.createElement("span");
    preview.className="sm-disclosure-preview";
    preview.textContent=previewCopy;
    row.appendChild(preview);
    summary.insertBefore(titleSpan,summary.firstChild);
    summary.insertBefore(row,summary.querySelector(":scope > .sm-disclosure-action"))
   }
   var hasPreview=!!summary.querySelector(":scope > .sm-disclosure-preview-row");
   detail.classList.toggle("sm-text-disclosure--preview",hasPreview);
   detail.classList.toggle("sm-text-disclosure--plain",!hasPreview);
   var action=summary.querySelector(":scope > .sm-disclosure-action");
   if(!action){
    action=document.createElement("span");
    action.className="sm-disclosure-action";
    action.setAttribute("aria-hidden","true");
    summary.appendChild(action)
   }
   function update(){action.textContent=detail.open?"Close":"Read More"}
   if(!detail.dataset.smDisclosureBound){
    detail.dataset.smDisclosureBound="1";
    detail.addEventListener("toggle",update)
   }
   update()
  })
 }
 SMI_DOM_RUNNER.add(enhanceTextDisclosures)
})();

/* Reuse the product-description photos in the connectivity question-mark dialog. */
(function(){
 var photos=[
  {file:'usb-c-wireless-hub.jpg',alt:'USB-C and USB-A hub with built-in wireless Apple CarPlay and Android Auto'},
  {file:'oem-usb-c-upgrade.jpg',alt:'Ford OEM USB-C and USB-A hub with vehicle-specific bezels'},
  {file:'wireless-adapter.jpg',alt:'Wireless Apple CarPlay and Android Auto USB adapter'}
 ];
 document.addEventListener('click',function(event){
  if(!event.target.closest('.sm-po-help-button[data-help="c"]'))return;
  // The existing help handler creates fresh paragraphs before this listener runs.
  var dialog=document.querySelector('.sm-po-dialog[open][data-help="c"]');
  if(!dialog)return;
  var sources=document.querySelectorAll('.product-details .sm-upgrade-card__image img, .product-details .sm-upgrade-modal__image img');
  dialog.querySelectorAll('.sm-po-copy').forEach(function(paragraph,index){
   var photo=photos[index];if(!photo||paragraph.querySelector('img'))return;
   var source=Array.prototype.find.call(sources,function(img){return img.src.split('?')[0].endsWith('/'+photo.file)});
   var img=document.createElement('img');
   img.className='sm-po-connectivity-photo';img.width=160;img.height=140;
   img.alt=source?source.alt:photo.alt;img.decoding='async';
   // Some descriptions omit the OEM card; reuse its shared photo for the existing OEM explanation.
   img.src=source?source.src:'https://cdn.jsdelivr.net/gh/nickrams3y/smi-assets@main/images/product-upgrades/'+photo.file;
   img.addEventListener('error',function(){img.remove();paragraph.classList.remove('sm-po-copy--photo')},{once:true});
   paragraph.classList.add('sm-po-copy--photo');paragraph.prepend(img);
  });
  dialog.scrollTop=0;
 });
})();

/* Explain connectivity choices while preserving Ecwid's option values and pricing. */
(function(){
 var nextID=0;
 var copy={
  wired:{label:'Wired connection',features:['Apple CarPlay & Android Auto via USB cable','No connectivity upgrade charge'],note:'Plug your phone into a the included compatible USB hub to use CarPlay or Android Auto.'},
  wireless:{label:'Wireless USB-C hub',features:['Wireless Apple CarPlay & Android Auto','USB-C and USB-A ports','Up to 30W fast charging','No separate adapter needed'],note:''},
  adapter:{label:'Wireless USB adapter',features:['Wireless Apple CarPlay & Android Auto','Plugs into a compatible USB port','No USB hub replacement needed'],note:'Adds wireless connectivity. It does not upgrade your USB ports or charging speed.'},
  standard:{label:'Dual USB-A hub',features:['Two USB-A ports','Wired Apple CarPlay & Android Auto'],note:'This hub does not add wireless connectivity. Connect your phone with a USB cable.'},
  standardBundle:{label:'USB-A hub + wireless adapter',features:['Dual USB-A hub','Wireless Apple CarPlay & Android Auto','Separate USB adapter included'],note:'The adapter provides wireless connectivity through the USB hub.'},
  oem:{label:'Ford OEM USB-C hub',features:['Authentic Ford USB-C and USB-A hub','Wired Apple CarPlay & Android Auto','Normal charging speed'],note:'This hub does not add wireless connectivity. Available for eligible vehicles only.'},
  bundle:{label:'OEM hub + wireless adapter',features:['Authentic Ford USB-C and USB-A hub','Wireless Apple CarPlay & Android Auto','Wireless connectivity through a separate USB adapter'],note:'Normal charging speed. The OEM USB-C hub is available for eligible vehicles only.'}
 };
 function kind(value){
  var s=value.toLowerCase();
  if(/no upgrade|^wired connection/.test(s))return 'wired';
  if(/standard usb hub|dual usb-a/.test(s))return /wireless/.test(s)?'standardBundle':'standard';
  if(/ford.*oem/.test(s)&&/wireless/.test(s))return 'bundle';
  if(/usb.c.*hub/.test(s)&&/built.in.*wireless|fast charging/.test(s))return 'wireless';
  if(/ford.*oem.*usb.c/.test(s))return 'oem';
  if(/wireless.*adapter/.test(s))return 'adapter';
  return '';
 }
 function refresh(row){
  var select=row.querySelector('select'),title=row.querySelector('.details-product-option__title');
  if(!select||!title||!/connectivity upgrade/i.test(title.textContent)||getComputedStyle(row).getPropertyValue('--sm-connectivity-card').trim()!=='1')return;
  var choices=Array.prototype.map.call(select.options,function(option){
   var key=kind(option.value),item=copy[key],match=option.textContent.match(/\s+\(([+-][^)]*)\)\s*$/),price=match?match[1]:'';
   var size=option.value.match(/- (Small|Large) version, (.+)$/i),name=item?item.label+(size?' — '+size[1].toLowerCase():''):'';
   return {key:key,item:item,price:price,name:name,size:size?size[1]+' hub: '+size[2]:''};
  });
  if(!choices.some(function(choice){return choice.item}))return;
  var intro=row.querySelector('.sm-connectivity-intro'),summary=row.querySelector('.sm-connectivity-summary');
  if(!intro){
   intro=document.createElement('div');intro.className='sm-connectivity-intro';
   var reassurance=document.createElement('p');
   if(!select.id)select.id='sm-connectivity-'+(++nextID);
   reassurance.textContent=/apim-and-screen|complete-sync-3-upgrade-kit/.test(location.pathname)?'Wired Apple CarPlay and Android Auto are already included with this kit. Upgrades are optional.':'Wired Apple CarPlay and Android Auto use a USB cable and a compatible USB hub. These upgrades are optional.';
   intro.append(reassurance);title.insertAdjacentElement('afterend',intro);
  }
  if(!summary){
   summary=document.createElement('div');summary.className='sm-connectivity-summary';summary.id=select.id+'-summary';summary.setAttribute('aria-live','polite');summary.setAttribute('aria-atomic','true');
   row.appendChild(summary);
   var described=(select.getAttribute('aria-describedby')||'').split(/\s+/).filter(Boolean);if(described.indexOf(summary.id)<0)described.push(summary.id);select.setAttribute('aria-describedby',described.join(' '));
  }
  row.classList.add('sm-connectivity-option');
  var selected=choices[select.selectedIndex],item=selected&&selected.item;
  // Ecwid owns all option names, selected labels, values, and prices; only add the explanation.
  var signature=item?selected.name+'|'+selected.price+'|'+selected.size:'';
  if(summary.dataset.choice===signature)return;
  summary.dataset.choice=signature;summary.hidden=!item;summary.replaceChildren();if(!item)return;
  var head=document.createElement('div'),heading=document.createElement('strong'),price=document.createElement('span'),list=document.createElement('ul'),note=document.createElement('p');
  head.className='sm-connectivity-summary__head';heading.textContent=selected.name;price.className='sm-connectivity-summary__price';price.textContent=selected.price||(selected.key==='wired'?'Included':'Optional');head.append(heading,price);
  var features=item.features.concat(selected.size?[selected.size]:[]);
  features.forEach(function(text){var li=document.createElement('li'),check=document.createElement('span'),content=document.createElement('span');check.className='sm-connectivity-summary__check';check.setAttribute('aria-hidden','true');check.textContent='✓';content.textContent=text;li.append(check,content);list.appendChild(li)});
  summary.append(head,list);
  if(item.note){note.className='sm-connectivity-summary__note';note.textContent=item.note;summary.append(note)}
 }
 function enhance(){document.querySelectorAll('.details-product-option').forEach(refresh)}
 SMI_DOM_RUNNER.add(enhance);
 document.addEventListener('change',function(event){if(!event.target.matches('.details-product-option select'))return;var row=event.target.closest('.details-product-option');requestAnimationFrame(function(){if(row.isConnected)refresh(row)})});
 document.addEventListener('load',function(event){if(event.target.tagName==='LINK')enhance()},true);
 window.addEventListener('load',enhance,{once:true});
})();

/* Stock wording follows Ecwid's rendered inventory state, including option changes. */
(function(){
 function enhanceStock(){
  document.querySelectorAll('.product-details .details-product-purchase__place').forEach(function(label){
   var text=label.querySelector(':scope > span:not(.sm-stock-icon)');
   if(!text)return;
   var current=text.textContent.trim(),state='',wording=current;
   if(/^In stock(?:, ready to ship)?$/i.test(current)){state='available';wording='In stock, ready to ship'}
   else if(/^Out of stock, available for pre-order$/i.test(current)){state='preorder';wording='Out of stock, available for pre-order'}
   var icon=label.querySelector('.sm-stock-icon');
   label.classList.toggle('sm-stock-status',!!state);
   label.classList.toggle('sm-stock-status--available',state==='available');
   label.classList.toggle('sm-stock-status--preorder',state==='preorder');
   if(!state){if(icon)icon.remove();return}
   if(text.textContent!==wording)text.textContent=wording;
   if(!icon){icon=document.createElement('span');icon.className='sm-stock-icon';icon.setAttribute('aria-hidden','true');label.prepend(icon)}
   var mark=state==='available'?'✓':'×';if(icon.textContent!==mark)icon.textContent=mark;
  });
 }
 SMI_DOM_RUNNER.add(enhanceStock);
})();

/* Group the two installation embeds into one on-demand, three-video gallery. */
(function(){
 var videos=[
  {id:'OWrfQuf2pgI',title:'Is a Sync 3 Upgrade Worth It?',creator:'Nine Finger Wrenching'},
  {id:'etDgW6yLIIU',title:'Sync 2 to Sync 3 Installation',creator:'Auto Freak Garage'},
  {id:'DOY7z6q39AU',title:'2014 F-150 Sync 3 Upgrade',creator:'The Futzer'}
 ];
 function image(id,large){
  var img=document.createElement('img');img.alt='';img.width=large?1280:480;img.height=large?720:360;img.loading='lazy';img.decoding='async';
  var fallback='https://i.ytimg.com/vi/'+id+'/hqdefault.jpg';
  function recover(){if(img.src!==fallback)img.src=fallback}
  img.addEventListener('error',recover);if(large)img.addEventListener('load',function(){if(img.naturalWidth<200)recover()});
  img.src=large?'https://i.ytimg.com/vi/'+id+'/maxresdefault.jpg':fallback;return img;
 }
 function build(){
  var gallery=document.createElement('section');gallery.className='sm-video-gallery';gallery.setAttribute('aria-label','See the Upgrade in Action');
  gallery.innerHTML='<h2 class="sm-video-gallery__heading">See the Upgrade in Action</h2><p class="sm-video-gallery__intro">Watch real installs and see the results for yourself.</p><div class="sm-video-gallery__player"></div><div class="sm-video-gallery__caption"><div class="sm-video-gallery__details" aria-live="polite"><strong></strong><span></span></div><a class="sm-video-gallery__external" target="_blank" rel="noopener noreferrer">Watch on YouTube ↗</a></div><div class="sm-video-gallery__choices" role="group" aria-label="Choose a video"></div>';
  var player=gallery.querySelector('.sm-video-gallery__player'),details=gallery.querySelector('.sm-video-gallery__details'),external=gallery.querySelector('.sm-video-gallery__external'),choices=gallery.querySelector('.sm-video-gallery__choices'),selected=-1;
  var buttons=videos.map(function(video,index){
   var button=document.createElement('button');button.type='button';button.className='sm-video-gallery__choice';
   var thumb=document.createElement('span'),copy=document.createElement('span'),title=document.createElement('strong'),creator=document.createElement('span');
   thumb.className='sm-video-gallery__thumb';copy.className='sm-video-gallery__choice-copy';title.textContent=video.title;creator.textContent=video.creator;
   thumb.appendChild(image(video.id,false));copy.append(title,creator);button.append(thumb,copy);choices.appendChild(button);
   button.addEventListener('click',function(){select(index)});return button;
  });
  function select(index){
   if(selected===index)return;selected=index;var video=videos[index];
   // Removing the previous iframe stops its video before another can play.
   player.replaceChildren();gallery.dataset.video=video.id;
   details.querySelector('strong').textContent=video.title;details.querySelector('span').textContent=video.creator;
   external.href='https://www.youtube.com/watch?v='+video.id;
   buttons.forEach(function(button,i){button.setAttribute('aria-pressed',String(i===index))});
   var poster=document.createElement('button'),play=document.createElement('span');poster.type='button';poster.className='sm-video-gallery__poster';poster.setAttribute('aria-label','Play '+video.title+' by '+video.creator);
   play.className='sm-video-gallery__play';play.setAttribute('aria-hidden','true');play.textContent='▶';poster.append(image(video.id,true),play);player.appendChild(poster);
   poster.addEventListener('click',function(){
    var frame=document.createElement('iframe');frame.title=video.title+' — '+video.creator;frame.width=760;frame.height=428;
    frame.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';
    frame.src='https://www.youtube-nocookie.com/embed/'+video.id+'?autoplay=1&playsinline=1&rel=0';
    player.replaceChildren(frame);frame.focus();
   });
  }
  select(0);return gallery;
 }
 function enhanceVideos(){
  document.querySelectorAll('.product-details__product-description').forEach(function(description){
   if(description.querySelector('.sm-video-gallery')||getComputedStyle(description).getPropertyValue('--sm-video-gallery').trim()!=='1')return;
   var frames=Array.prototype.filter.call(description.querySelectorAll('iframe'),function(frame){return /^https:\/\/www\.youtube(?:-nocookie)?\.com\/embed\/(etDgW6yLIIU|DOY7z6q39AU)(?:[?/#]|$)/.test(frame.src)});
   if(!videos.slice(1).every(function(video){return frames.some(function(frame){return frame.src.indexOf('/embed/'+video.id)>=0})}))return;
   var gallery=build();frames[0].before(gallery);frames.forEach(function(frame){frame.remove()});
  });
 }
 SMI_DOM_RUNNER.add(enhanceVideos);
 document.addEventListener('load',function(event){if(event.target.tagName==='LINK')enhanceVideos()},true);
})();
