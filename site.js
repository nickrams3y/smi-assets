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

/* Migrate remaining legacy support links in native Ecwid sections and SPA content. */
SMI_DOM_RUNNER.add(function(){
 document.querySelectorAll('a[href*="support.simplymichigan.co"]').forEach(function(link){
  try{
   var old=new URL(link.getAttribute('href'),location.href);
   if(old.hostname!=="support.simplymichigan.co")return;
   var article=old.pathname.match(/^\/articles\/(\d+)/),category=old.pathname.match(/^\/categories\/(\d+)/);
   link.setAttribute('href','https://simplymichigan.co/support'+(article?'#article='+article[1]:category?'#category='+category[1]:''));
  }catch(error){}
 });
});

/* Contact page enhancement: bundled to avoid a second network request. */
(function(){
'use strict';
if(window.SMI_TROUBLESHOOT_CONTACT)return;
const key='sm-troubleshooting-handoff',ttl=30*60*1000;
function read(){
 try{const id=new URL(location.href).searchParams.get('troubleshooting'),data=JSON.parse(sessionStorage.getItem(key)||'null');
  if(!data||!id||data.id!==id||typeof data.created!=='number'||Date.now()-data.created>ttl||data.created>Date.now()||typeof data.summary!=='string'||data.summary.length>16000)return null;
  return data;
 }catch(e){return null;}
}
function setValue(el,value){const proto=el.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(proto,'value').set.call(el,value);el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));}
// Restyle Ecwid's existing controls without replacing its form or submit handler.
function decorate(form,native){
 if(form.dataset.smContactDesign)return;
 const grid=form.closest('.section__grid'),content=grid?.closest('.section__content'),intro=grid?.querySelector('h1')?.closest('.order-1');
 if(!grid||!content||!intro)return;
 form.dataset.smContactDesign='20261019';form.classList.add('sm-contact-form');
 grid.classList.add('sm-contact-layout');content.classList.add('sm-contact-content');content.parentElement.classList.add('sm-contact-spacing');intro.classList.add('sm-contact-intro');form.parentElement.classList.add('sm-contact-form-column');
 const heading=intro.querySelector('h1'),description=intro.querySelector('h1')?.parentElement.nextElementSibling;
 if(description)description.classList.add('sm-contact-description');
 const eyebrow=document.createElement('p');eyebrow.className='sm-contact-eyebrow';eyebrow.textContent='Here to help';heading.before(eyebrow);
 // Quick-answer links are saved in Ecwid; retain fallback for older cached page HTML.
 if(!description?.querySelector('a[href="https://simplymichigan.co/upgrade_guide"]')){
 const help=document.createElement('div');help.className='sm-contact-help';help.innerHTML='<p class="sm-contact-response">We typically reply within 24 hours.</p><div class="sm-contact-shortcuts"><p>Looking for a quick answer?</p><a href="https://simplymichigan.co/upgrade_guide">Upgrade guide <span aria-hidden="true">↗</span></a><a href="https://simplymichigan.co/install">Installation instructions <span aria-hidden="true">↗</span></a><a href="https://simplymichigan.co/support">Visit our support center <span aria-hidden="true">↗</span></a></div>';intro.append(help);
 }
 const title=document.createElement('div');title.className='sm-contact-form-heading';title.innerHTML='<h2>Send us a message</h2><span>* Required</span>';form.prepend(title);
 // Copy and placeholders live in Ecwid, so the first render matches the enhanced form.
 ['name','email','additionalNote','message'].forEach(suffix=>{const input=form.querySelector('[id$="-'+suffix+'"]');if(!input)return;const field=input.parentElement;field.dataset.smContactField=suffix;if(input.required)field.dataset.smContactRequired='true';});
 const submit=form.querySelector('button[id$="-submit-button"]');
 if(submit)submit.parentElement.dataset.smContactActions='true';
 const photoNote=native.parentElement.querySelector(':scope > div.mt-2');
 if(photoNote)photoNote.classList.add('sm-contact-photo-note');
 if(!document.getElementById('sm-contact-design-style')){const style=document.createElement('style');style.id='sm-contact-design-style';style.textContent=`
:is(.sm-contact-content,.section__content:has(#contact-us-ZNGYK5-message)){max-width:1080px!important;width:100%!important}
:is(.sm-contact-spacing,.section__container:has(#contact-us-ZNGYK5-message)){margin-top:52px!important;margin-bottom:56px!important}
:is(.sm-contact-layout,.section__content:has(#contact-us-ZNGYK5-message) > .section__grid){display:grid!important;grid-template-columns:minmax(220px,.8fr) minmax(0,1.55fr)!important;gap:48px!important;align-items:start!important;color:#252728}
:is(.sm-contact-layout,.section__content:has(#contact-us-ZNGYK5-message) > .section__grid)>:is(.sm-contact-intro,.section__content:has(#contact-us-ZNGYK5-message) > .section__grid > .order-1),:is(.sm-contact-layout,.section__content:has(#contact-us-ZNGYK5-message) > .section__grid)>:is(.sm-contact-form-column,.section__content:has(#contact-us-ZNGYK5-message) > .section__grid > .order-2){grid-column:auto!important;min-width:0;margin:0!important}
:is(.sm-contact-intro,.section__content:has(#contact-us-ZNGYK5-message) > .section__grid > .order-1) h1{font-size:38px!important;line-height:1.14!important;letter-spacing:-1px!important;font-weight:700!important;text-align:left!important;color:#252728!important}
:is(.sm-contact-intro,.section__content:has(#contact-us-ZNGYK5-message) > .section__grid > .order-1) .section__grid{gap:16px!important}
.sm-contact-eyebrow{font-size:11px;letter-spacing:1.7px;text-transform:uppercase;font-weight:700;color:#666966;margin:0 0 12px}
:is(.sm-contact-description,.section__content:has(#contact-us-ZNGYK5-message) > .section__grid > .order-1 .section__grid > div:has(> p):not(:has(> h1))) p{font-size:15px!important;line-height:1.65!important;color:#666966!important;text-align:left!important;margin:0!important}
.sm-contact-response{font-size:13px;line-height:1.5;color:#666966;margin:22px 0 0}
.sm-contact-shortcuts{border-top:1px solid #dedfda;margin-top:28px;padding-top:22px;font-size:13px;line-height:1.6}
.sm-contact-shortcuts p{color:#666966;margin:0 0 12px}
.sm-contact-shortcuts a{display:block;width:fit-content;margin:10px 0;color:#252728!important;font-weight:600;text-decoration:underline!important;text-underline-offset:4px}
:is(.sm-contact-form,form:has(#contact-us-ZNGYK5-message)){box-sizing:border-box;background:#fff;border:1px solid #dedfda;border-radius:16px;padding:28px;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);column-gap:18px;color:#252728}
:is(.sm-contact-form,form:has(#contact-us-ZNGYK5-message))>*{grid-column:1/-1;min-width:0}
:is(.sm-contact-form,form:has(#contact-us-ZNGYK5-message)) .sm-contact-form-heading{display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin-bottom:25px;order:-2}
.sm-contact-form-heading h2{font-size:20px!important;font-weight:600!important;line-height:1.3!important;letter-spacing:-.3px;color:#252728!important;margin:0}
.sm-contact-form-heading>span{font-size:11px;color:#666966;white-space:nowrap}
:is(.sm-contact-form,form:has(#contact-us-ZNGYK5-message)) :is([data-sm-contact-field="name"],div:has(> #contact-us-ZNGYK5-name)),:is(.sm-contact-form,form:has(#contact-us-ZNGYK5-message)) :is([data-sm-contact-field="email"],div:has(> #contact-us-ZNGYK5-email)){grid-column:auto}
:is(.sm-contact-form,form:has(#contact-us-ZNGYK5-message)) :is([data-sm-contact-field],div:has(> :is(#contact-us-ZNGYK5-name,#contact-us-ZNGYK5-email,#contact-us-ZNGYK5-additionalNote,#contact-us-ZNGYK5-message))){margin:0 0 20px!important}
:is(.sm-contact-form,form:has(#contact-us-ZNGYK5-message)) :is([data-sm-contact-field],div:has(> :is(#contact-us-ZNGYK5-name,#contact-us-ZNGYK5-email,#contact-us-ZNGYK5-additionalNote,#contact-us-ZNGYK5-message))) label{font-size:13px!important;line-height:1.45!important;font-weight:600!important;color:#252728!important;margin-bottom:8px}
:is(.sm-contact-form,form:has(#contact-us-ZNGYK5-message)) :is([data-sm-contact-required],div:has(> :is(#contact-us-ZNGYK5-name,#contact-us-ZNGYK5-email,#contact-us-ZNGYK5-message))) label:after{content:' *'}
:is([data-sm-contact-field],div:has(> :is(#contact-us-ZNGYK5-name,#contact-us-ZNGYK5-email,#contact-us-ZNGYK5-additionalNote,#contact-us-ZNGYK5-message)))>div:first-child>span{display:none!important}
:is(.sm-contact-form,form:has(#contact-us-ZNGYK5-message)) :is([data-sm-contact-field],div:has(> :is(#contact-us-ZNGYK5-name,#contact-us-ZNGYK5-email,#contact-us-ZNGYK5-additionalNote,#contact-us-ZNGYK5-message))) input,:is(.sm-contact-form,form:has(#contact-us-ZNGYK5-message)) :is([data-sm-contact-field],div:has(> :is(#contact-us-ZNGYK5-name,#contact-us-ZNGYK5-email,#contact-us-ZNGYK5-additionalNote,#contact-us-ZNGYK5-message))) textarea{box-sizing:border-box;width:100%;border:1px solid #dedfda!important;border-radius:7px!important;background:#fff!important;color:#252728!important;padding:12px!important;font-family:inherit!important;font-size:16px!important;line-height:1.45!important;font-style:normal!important;box-shadow:none!important}
:is(.sm-contact-form,form:has(#contact-us-ZNGYK5-message)) :is([data-sm-contact-field],div:has(> :is(#contact-us-ZNGYK5-name,#contact-us-ZNGYK5-email,#contact-us-ZNGYK5-additionalNote,#contact-us-ZNGYK5-message))) input::placeholder,:is(.sm-contact-form,form:has(#contact-us-ZNGYK5-message)) :is([data-sm-contact-field],div:has(> :is(#contact-us-ZNGYK5-name,#contact-us-ZNGYK5-email,#contact-us-ZNGYK5-additionalNote,#contact-us-ZNGYK5-message))) textarea::placeholder{color:#747873!important;opacity:1!important;font-style:normal!important}
:is(.sm-contact-form,form:has(#contact-us-ZNGYK5-message)) :is([data-sm-contact-field],div:has(> :is(#contact-us-ZNGYK5-name,#contact-us-ZNGYK5-email,#contact-us-ZNGYK5-additionalNote,#contact-us-ZNGYK5-message))) textarea:not([hidden]){height:128px!important;min-height:128px!important;resize:vertical}
:is(.sm-contact-form,form:has(#contact-us-ZNGYK5-message)) :is([data-sm-contact-field],div:has(> :is(#contact-us-ZNGYK5-name,#contact-us-ZNGYK5-email,#contact-us-ZNGYK5-additionalNote,#contact-us-ZNGYK5-message))) input:focus-visible,:is(.sm-contact-form,form:has(#contact-us-ZNGYK5-message)) :is([data-sm-contact-field],div:has(> :is(#contact-us-ZNGYK5-name,#contact-us-ZNGYK5-email,#contact-us-ZNGYK5-additionalNote,#contact-us-ZNGYK5-message))) textarea:focus-visible,:is(.sm-contact-form,form:has(#contact-us-ZNGYK5-message)) button:focus-visible{outline:2px solid #777f79!important;outline-offset:3px!important}
:is([data-sm-contact-field="additionalNote"],div:has(> #contact-us-ZNGYK5-additionalNote)){max-width:240px}
:is(.sm-contact-photo-note,#contact-us-ZNGYK5-message ~ div.mt-2){margin:20px 0 0!important;background:#f7f7f5;border:1px solid #e5e5e1;border-radius:9px;padding:15px 16px;font-size:13px;line-height:1.55;color:#60655f}
:is(.sm-contact-photo-note,#contact-us-ZNGYK5-message ~ div.mt-2)>p:first-child{display:block;font-size:13px;color:#353a35;font-weight:600}
:is(.sm-contact-photo-note,#contact-us-ZNGYK5-message ~ div.mt-2) p{font-size:13px!important;line-height:1.55!important;margin:4px 0 0!important}
:is(.sm-contact-photo-note,#contact-us-ZNGYK5-message ~ div.mt-2)>p:first-child{margin:0!important}
:is(.sm-contact-photo-note,#contact-us-ZNGYK5-message ~ div.mt-2)>p:has(>br:only-child){display:none}
:is(.sm-contact-form,form:has(#contact-us-ZNGYK5-message)) :is([data-sm-contact-actions],form:has(#contact-us-ZNGYK5-message) > div:has(> button[id$="-submit-button"])){display:block!important;margin:22px 0 0!important}
:is([data-sm-contact-actions],form:has(#contact-us-ZNGYK5-message) > div:has(> button[id$="-submit-button"])) button[id$='-submit-button']{width:100%!important;height:auto!important;min-height:48px;border-radius:8px!important;padding:13px 18px!important;background:#242726!important;color:#fff!important}
:is([data-sm-contact-actions],form:has(#contact-us-ZNGYK5-message) > div:has(> button[id$="-submit-button"])) button[id$='-submit-button'] span{filter:none!important;font-size:15px!important;line-height:1.5!important;font-weight:600!important;color:#fff!important;margin:0!important}
:is([data-sm-contact-actions],form:has(#contact-us-ZNGYK5-message) > div:has(> button[id$="-submit-button"])) p{font-family:inherit!important;font-size:11px!important;line-height:1.6!important;text-align:center;color:#666966!important;margin:10px 0 0!important}
:is([data-sm-contact-actions],form:has(#contact-us-ZNGYK5-message) > div:has(> button[id$="-submit-button"])) p:empty{display:none}
:is(.sm-contact-form,form:has(#contact-us-ZNGYK5-message)) .sm-attached-results{order:-1;background:#eef7f0;border:0;border-radius:8px;padding:14px;margin:0 0 22px;color:#276344}
:is(.sm-contact-form,form:has(#contact-us-ZNGYK5-message)) .sm-attached-heading{gap:8px;align-items:center}
:is(.sm-contact-form,form:has(#contact-us-ZNGYK5-message)) .sm-attached-heading>span{width:20px;height:20px}
:is(.sm-contact-form,form:has(#contact-us-ZNGYK5-message)) .sm-attached-heading strong{font-size:14px;line-height:1.4}
:is(.sm-contact-form,form:has(#contact-us-ZNGYK5-message)) .sm-attached-results p,:is(.sm-contact-form,form:has(#contact-us-ZNGYK5-message)) .sm-attached-results summary,:is(.sm-contact-form,form:has(#contact-us-ZNGYK5-message)) .sm-attached-results button{font-size:12px;line-height:1.5}
:is(.sm-contact-form,form:has(#contact-us-ZNGYK5-message)) .sm-attached-results p{margin:7px 0 9px}
:is(.sm-contact-form,form:has(#contact-us-ZNGYK5-message)) .sm-attached-results button{min-height:36px;padding:5px 10px}
@media(max-width:760px){
:is(.sm-contact-spacing,.section__container:has(#contact-us-ZNGYK5-message)){margin-top:30px!important;margin-bottom:36px!important}
:is(.sm-contact-layout,.section__content:has(#contact-us-ZNGYK5-message) > .section__grid){grid-template-columns:minmax(0,1fr)!important;gap:26px!important}
:is(.sm-contact-intro,.section__content:has(#contact-us-ZNGYK5-message) > .section__grid > .order-1) h1{font-size:32px!important;max-width:400px}
:is(.sm-contact-intro,.section__content:has(#contact-us-ZNGYK5-message) > .section__grid > .order-1) .section__grid{gap:12px!important}
.sm-contact-response{margin-top:14px}
:is(.sm-contact-form,form:has(#contact-us-ZNGYK5-message)){padding:22px}
}
@media(max-width:480px){:is(.sm-contact-form,form:has(#contact-us-ZNGYK5-message)){padding:19px;grid-template-columns:minmax(0,1fr)}:is([data-sm-contact-field="additionalNote"],div:has(> #contact-us-ZNGYK5-additionalNote)){max-width:none}.sm-contact-form-heading h2{font-size:18px!important}:is(.sm-contact-intro,.section__content:has(#contact-us-ZNGYK5-message) > .section__grid > .order-1) h1{font-size:30px!important}}

/* Match the enhancement geometry before the optional JavaScript arrives. */
.section__content:has(#contact-us-ZNGYK5-message) > .section__grid > .order-1 .section__grid > div:has(>h1):not(:has(.sm-contact-eyebrow))::before{content:"Here to help";display:block;font-size:11px;line-height:16.5px;letter-spacing:1.7px;text-transform:uppercase;font-weight:700;color:#666966;margin:0 0 12px}
.sm-contact-eyebrow{line-height:16.5px}
.section__content:has(#contact-us-ZNGYK5-message) > .section__grid > .order-1:not(:has(.sm-contact-help))::after{content:"We typically reply within 24 hours.";display:block;font-size:13px;line-height:19.5px;color:#666966;margin:22px 0 0}
form:has(#contact-us-ZNGYK5-message):not(:has(.sm-contact-form-heading))::before{content:"Send us a message";display:block;grid-column:1/-1;order:-2;font-size:20px;font-weight:600;line-height:26px;letter-spacing:-.3px;color:#252728;margin:0 0 25px}
@media(max-width:760px){.section__content:has(#contact-us-ZNGYK5-message) > .section__grid > .order-1:not(:has(.sm-contact-help))::after{margin-top:14px}}
@media(max-width:480px){form:has(#contact-us-ZNGYK5-message):not(:has(.sm-contact-form-heading))::before{font-size:18px;line-height:23.4px}}

/* Native quick-answer content renders before the optional enhancement script. */
.section__content:has(#contact-us-ZNGYK5-message) > .section__grid > .order-1:has(.section__grid a[href="https://simplymichigan.co/upgrade_guide"])::after{display:none!important}
.section__content:has(#contact-us-ZNGYK5-message) > .section__grid > .order-1:has(.section__grid a[href="https://simplymichigan.co/upgrade_guide"]) > .sm-contact-help{display:none!important}
.section__content:has(#contact-us-ZNGYK5-message) > .section__grid > .order-1 .section__grid > div:has(a[href="https://simplymichigan.co/upgrade_guide"]) p:is(:empty,:has(> br:only-child)){display:none}
.section__content:has(#contact-us-ZNGYK5-message) > .section__grid > .order-1 .section__grid > div:has(a[href="https://simplymichigan.co/upgrade_guide"]) p:has(+ p + p + p + p > a):not(:has(a)):not(:has(+ p + p > a)){font-size:13px!important;line-height:19.5px!important;margin-top:22px!important}
.section__content:has(#contact-us-ZNGYK5-message) > .section__grid > .order-1 .section__grid > div:has(a[href="https://simplymichigan.co/upgrade_guide"]) p:has(+ p + p > a):not(:has(a)){border-top:1px solid #dedfda;margin:28px 0 12px!important;padding-top:22px;font-size:13px!important;line-height:20.8px!important}
.section__content:has(#contact-us-ZNGYK5-message) > .section__grid > .order-1 .section__grid > div:has(a[href="https://simplymichigan.co/upgrade_guide"]) p:has(> a){font-size:13px!important;line-height:20.8px!important;margin:10px 0!important}
.section__content:has(#contact-us-ZNGYK5-message) > .section__grid > .order-1 .section__grid > div:has(a[href="https://simplymichigan.co/upgrade_guide"]) a{display:inline-block;opacity:1!important;border-bottom:0!important;font-size:13px!important;line-height:20.8px!important;color:#252728!important;font-weight:600;text-decoration:underline!important;text-underline-offset:4px}
@media(max-width:760px){
.section__content:has(#contact-us-ZNGYK5-message) > .section__grid > .order-1 .section__grid > div:has(a[href="https://simplymichigan.co/upgrade_guide"]) p:has(+ p + p + p + p > a):not(:has(a)):not(:has(+ p + p > a)){margin-top:14px!important}
}

/* Compact mobile contact introduction and native quick-answer cards. */
@media(max-width:760px){

.section__content:has(#contact-us-ZNGYK5-message) > .section__grid > .order-1{text-align:center!important}
.section__content:has(#contact-us-ZNGYK5-message) > .section__grid > .order-1 h1{text-align:center!important;margin-left:auto!important;margin-right:auto!important;max-width:440px;font-size:30px!important;line-height:1.16!important}
.section__content:has(#contact-us-ZNGYK5-message) > .section__grid > .order-1 .section__grid > div:has(>p) p{text-align:center!important}
.section__content:has(#contact-us-ZNGYK5-message) > .section__grid > .order-1 .section__grid > div:has(a[href="https://simplymichigan.co/upgrade_guide"]){display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:8px;row-gap:8px}
.section__content:has(#contact-us-ZNGYK5-message) > .section__grid > .order-1 .section__grid > div:has(a[href="https://simplymichigan.co/upgrade_guide"]) p{text-align:center!important}
.section__content:has(#contact-us-ZNGYK5-message) > .section__grid > .order-1 .section__grid > div:has(a[href="https://simplymichigan.co/upgrade_guide"]) p:has(p){display:contents!important}
.section__content:has(#contact-us-ZNGYK5-message) > .section__grid > .order-1 .section__grid > div:has(a[href="https://simplymichigan.co/upgrade_guide"]) p:not(:has(p)){grid-column:1/-1}
.section__content:has(#contact-us-ZNGYK5-message) > .section__grid > .order-1 .section__grid > div:has(a[href="https://simplymichigan.co/upgrade_guide"]) p:has(>a){grid-column:auto;display:flex!important;margin:0!important;min-width:0}
.section__content:has(#contact-us-ZNGYK5-message) > .section__grid > .order-1 .section__grid > div:has(a[href="https://simplymichigan.co/upgrade_guide"]) p:has(>a)>a{box-sizing:border-box;display:flex!important;align-items:center;justify-content:center;width:100%;min-height:60px;padding:10px 9px;border:1px solid #dedfda!important;border-radius:9px;background:#fff;text-decoration:none!important;font-size:13px!important;line-height:1.4!important;text-align:center;overflow-wrap:break-word;text-wrap:balance}
.section__content:has(#contact-us-ZNGYK5-message) > .section__grid > .order-1 .section__grid > div:has(a[href="https://simplymichigan.co/upgrade_guide"]) p:has(>a)>a:focus-visible{outline:2px solid #777f79;outline-offset:3px}
.section__content:has(#contact-us-ZNGYK5-message) > .section__grid > .order-1 .section__grid > div:has(a[href="https://simplymichigan.co/upgrade_guide"]) p:has(>a)>a:active{background:#efefec}
.section__content:has(#contact-us-ZNGYK5-message) > .section__grid > .order-1 .section__grid > div:has(a[href="https://simplymichigan.co/upgrade_guide"]) p:has(+p+p+p+p>a):not(:has(a)):not(:has(+p+p>a)){margin-top:4px!important}
.section__content:has(#contact-us-ZNGYK5-message) > .section__grid > .order-1 .section__grid > div:has(a[href="https://simplymichigan.co/upgrade_guide"]) p:has(+p+p>a):not(:has(a)){margin:10px 0 2px!important;padding-top:14px}
:is(.sm-contact-spacing,.section__container:has(#contact-us-ZNGYK5-message)){margin-top:24px!important;margin-bottom:28px!important}
:is(.sm-contact-layout,.section__content:has(#contact-us-ZNGYK5-message)>.section__grid){gap:22px!important}
:is(.sm-contact-photo-note,#contact-us-ZNGYK5-message~div.mt-2){padding:12px 13px;margin-top:14px!important}
:is(.sm-contact-photo-note,#contact-us-ZNGYK5-message~div.mt-2) p{font-size:12px!important;line-height:1.5!important}
:is(.sm-contact-form,form:has(#contact-us-ZNGYK5-message)){text-align:left}
.sm-contact-shortcuts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:18px;padding-top:14px}
.sm-contact-shortcuts p{grid-column:1/-1;text-align:center;margin:0 0 2px}
.sm-contact-shortcuts a{display:flex;align-items:center;justify-content:center;box-sizing:border-box;width:100%;min-height:60px;margin:0;padding:10px 9px;border:1px solid #dedfda;border-radius:9px;background:#fff;text-decoration:none!important;line-height:1.4}
}
`;document.head.append(style);}
}

function mount(){
 if(!/^\/(?:en\/)?contact-us\/?$/.test(location.pathname))return;
 const data=read();
 const native=document.querySelector('textarea[id^="contact-us-"][id$="-message"]'),form=native?.closest('form');
 if(!form)return;
 decorate(form,native);
 if(form.dataset.smTroubleshooting)return;
 if(!data){if(new URL(location.href).searchParams.has('troubleshooting')&&!document.getElementById('sm-results-unavailable')){const warning=document.createElement('p');warning.id='sm-results-unavailable';warning.setAttribute('role','status');warning.append('Your troubleshooting results are no longer available in this tab. ');const resume=document.createElement('a');resume.href='https://simplymichigan.co/troubleshoot';resume.textContent='Return to the guide';warning.append(resume,' or paste your copied results into the message below.');form.prepend(warning);}return;}
 form.dataset.smTroubleshooting='true';
 const label=form.querySelector('label[for="'+native.id+'"]'),required=native.required;
 const comment=native.cloneNode(false);comment.id=native.id+'-comment';comment.removeAttribute('name');comment.value=native.value;comment.required=required;comment.placeholder='Add your question or anything else we should know. Your troubleshooting results will be included automatically.';
 const separator='\n\n--- Troubleshooting results ---\n';
 if(comment.value.includes(separator))comment.value=comment.value.split(separator)[0];
 native.insertAdjacentElement('afterend',comment);native.hidden=true;native.style.setProperty('display','none','important');native.required=false;native.setAttribute('aria-hidden','true');if(label)label.htmlFor=comment.id;
 const notice=document.createElement('div');notice.className='sm-attached-results';notice.innerHTML='<div class="sm-attached-heading"><span aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m5 12 4 4L19 6" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span><strong>Troubleshooting results attached</strong></div><p>We’ll receive your answers with this message.</p><details><summary>View attached results</summary><pre></pre></details><button type="button">Remove results</button>';
 notice.querySelector('pre').textContent=data.summary;
 if(!document.getElementById('sm-attached-results-style')){const css=document.createElement('style');css.id='sm-attached-results-style';css.textContent='.sm-attached-results{background:#f0f7f2;border:1px solid #c4ddcb;border-radius:10px;padding:18px;margin:0 0 26px;color:#245c3c;font:inherit;line-height:1.5}.sm-attached-heading{display:flex;gap:10px;align-items:flex-start}.sm-attached-heading>span{display:grid;place-items:center;flex:none;background:#28744b;color:#fff;border-radius:50%;width:24px;height:24px}.sm-attached-heading>span svg{display:block;width:16px!important;height:16px!important;max-width:16px;max-height:16px;fill:none;flex:none;stroke:currentColor}.sm-attached-results strong{font-size:16px}.sm-attached-results p,.sm-attached-results summary,.sm-attached-results button{font-size:14px}.sm-attached-results p{margin:8px 0 12px}.sm-attached-results summary{cursor:pointer;text-decoration:underline}.sm-attached-results pre{white-space:pre-wrap;overflow-wrap:anywhere;font:inherit;font-size:13px;max-height:260px;overflow:auto;background:#fff;padding:12px;margin-top:10px;color:#252729}.sm-attached-results button{margin-top:12px;background:transparent;border:1px solid #8aab96;border-radius:5px;padding:7px 12px;color:#245c3c;cursor:pointer}';document.head.appendChild(css);}
 const sync=()=>setValue(native,comment.value+separator+data.summary);
 comment.addEventListener('input',sync);
 const submit=e=>{if(!comment.reportValidity()){e.preventDefault();e.stopImmediatePropagation();return;}sync();};
 form.addEventListener('submit',submit,true);
 const order=form.querySelector('input[id$="-additionalNote"]');if(order&&!order.value&&typeof data.order==='string'&&/^SM\d+$/.test(data.order))setValue(order,data.order);
 sync();document.getElementById('sm-results-unavailable')?.remove();form.prepend(notice);
 notice.querySelector('button').addEventListener('click',()=>{observer.disconnect();form.removeEventListener('submit',submit,true);setValue(native,comment.value);native.hidden=false;native.style.removeProperty('display');native.required=required;native.removeAttribute('aria-hidden');if(label)label.htmlFor=native.id;comment.remove();notice.remove();try{sessionStorage.removeItem(key);const url=new URL(location.href);url.searchParams.delete('troubleshooting');history.replaceState(history.state,'',url.href)}catch(e){}native.focus();});
 // Clear the temporary handoff only after Ecwid displays its success state.
 const observer=new MutationObserver(()=>{
  if(!form.isConnected){observer.disconnect();return;}
  const sent=native.disabled&&!form.querySelector('button[id$="-submit-button"]')&&Array.from(form.querySelectorAll('p')).some(p=>p.textContent.trim()==='Your message has been sent');
  if(!sent)return;observer.disconnect();comment.disabled=true;
  notice.querySelector('strong').textContent='Your troubleshooting results were included with your message.';
  notice.querySelector('p').remove();notice.querySelector('button').remove();
  try{sessionStorage.removeItem(key);const url=new URL(location.href);url.searchParams.delete('troubleshooting');history.replaceState(history.state,'',url.href)}catch(e){}
 });
 observer.observe(document.body,{childList:true,subtree:true});
}
window.SMI_TROUBLESHOOT_CONTACT={mount};
// Let Ecwid finish hydrating its native form before attaching behavior.
// The native-markup stylesheet already supplies the layout during this interval.
if(typeof SMI_DOM_RUNNER!=='undefined')SMI_DOM_RUNNER.add(mount);else mount();
})();


/* Use Ecwid's existing 800px derivative for small Instant Site product cards.
   Keep this early: replacing a pending oversized image can cancel its download.
   Product detail galleries, zoom images, and uploaded originals are not changed. */
(function(){
 var selector='.ins-tile__product-card .ins-picture--full',states=new WeakMap();
 function restore(picture,state){
  state.sources.forEach(function(item){if(item.node.parentElement===picture&&item.node.srcset===state.url)item.node.srcset=item.srcset});
  if(state.img.getAttribute('src')===state.url)state.img.setAttribute('src',state.src);
  picture.removeAttribute('data-sm-card-thumbnail');
 }
 function optimize(){
  document.querySelectorAll(selector).forEach(function(picture){
   var img=picture.querySelector('img'),sources=Array.from(picture.querySelectorAll('source'));
   if(!img)return;
   var state=states.get(picture),width=img.getBoundingClientRect().width;
   if(width>400){if(state)restore(picture,state);return}
   if(width<=0)return;
   // Ecwid supplies the medium derivative as the 1x image for its 500px breakpoint.
   var medium=sources.find(function(source){return source.media==='(min-width: 500px)'});
   if(!medium)return;
   if(state&&state.img===img){
    if(state.failed&&medium.srcset===state.medium)return;
    if(sources.every(function(source){return source.srcset===state.url}))return;
   }
   // Do not add another download when a fast connection/cache has finished the image.
   if(img.complete&&img.naturalWidth>0)return;
   var options=medium.srcset.split(',');
   if(options.length<2)return;
   var url=options[0].trim().split(/\s+/)[0];
   if(!/^https:\/\/d2j6dbq0eux0bg.cloudfront.net\/images\/20154142\/products\/\d+\/\d+\.(?:jpg|png|webp)$/.test(url))return;
   if(url.slice(0,url.lastIndexOf('/'))!==img.src.slice(0,img.src.lastIndexOf('/')))return;
   if(state&&state.onError)state.img.removeEventListener('error',state.onError);
   state={img:img,url:url,src:img.getAttribute('src'),medium:medium.srcset,sources:sources.map(function(source){return{node:source,srcset:source.srcset}}),failed:false};
   state.onError=function(){if(states.get(picture)!==state)return;state.failed=true;restore(picture,state)};
   states.set(picture,state);
   img.addEventListener('error',state.onError,{once:true});
   sources.forEach(function(source){source.srcset=url});
   img.src=url;
   picture.setAttribute('data-sm-card-thumbnail','800');
  });
 }
 optimize();
 SMI_DOM_RUNNER.add(optimize);
 var resizeTimer;
 window.addEventListener('resize',function(){clearTimeout(resizeTimer);resizeTimer=setTimeout(optimize,150)});
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
(()=>{const e=document,t=t=>e.createElement(t),o=/(apim-(and-screen|replacement)|8-to-12|audio-control-module|sync-3-usb-hub|2019-2022-mustang-4-to-8|2019-2023-ranger-4-to-8|2017-2019-f-250-f-350-super-duty-4-to-8|2013-2014-f-150-4-to-8|2015-2017-f-150-4-to-8|2018-2020-f-150-4-to-8|2020-2022-f-250-350-super-duty-4-to-8)/,s={d:"Choose Your Display",s:"SimplyCare Coverage",c:"Connectivity Upgrade Options",v:'4" to 8" Conversions',u:"Choose Based on Your Current System",r:"Trying to match your current color and you're unsure of what color you need?"},a=e=>(e||"").replace(/\s+/g," ").trim().toLowerCase();function l(){let s=location.pathname,l=o.test(s);if(e.documentElement.classList.toggle("sm-product-options-active",l),!l)return;let n=[...e.querySelectorAll("button")].find(e=>"add to bag"===a(e.textContent));if(n&&!e.querySelector(".sm-po-required-note")){let e=t("p");e.className="sm-po-required-note",n.insertAdjacentElement("afterend",e)}let i=e.querySelector(".details-product-options");if(!i||i.dataset.sm===s)return;let r=[...i.querySelectorAll(":scope > .details-product-option")];if(!r.length)return;let c=4,p=["Vehicle Details","Optional Upgrades"];(s.includes("2019-2022-mustang-4-to-8")||s.includes("2019-2023-ranger-4-to-8")||s.includes("2017-2019-f-250-f-350-super-duty-4-to-8")||s.includes("2013-2014-f-150-4-to-8")||s.includes("2015-2017-f-150-4-to-8")||s.includes("2018-2020-f-150-4-to-8")||s.includes("2020-2022-f-250-350-super-duty-4-to-8"))?(c=Math.max(0,r.length-3),p=["Vehicle Details","Optional Upgrades"]):s.includes("8-to-12")?(c=r.findIndex(e=>/connectivity upgrade|extended warranty|upload a vin|include a complimentary sync 3\.4 update usb drive/.test(a((e.querySelector(".details-product-option__title")||e.querySelector("label")||{}).textContent))),c=c<0?r.length:c,p=["Truck & Upgrade Details","Optional Upgrades"]):s.includes("audio-control")?(c=9,p=["Vehicle Details","Optional Upgrades"]):s.includes("sync-3-usb-hub")?(c=1,p=["Choose Your Hub","Trade-In Details"]):s.includes("apim-replacement")&&(c=s.includes("without")?3:4,p=["Vehicle Details","Optional Upgrades"]),i.querySelectorAll(".sm-po-section-heading,.sm-po-section-intro").forEach(e=>e.remove());let f=s.includes("8-to-12")?r.findIndex(e=>/did you read the entire product page/.test(a((e.querySelector(".details-product-option__title")||e.querySelector("label")||{}).textContent))):-1;f<=c&&(f=-1);p.push("Review & Confirm");let d=!1;r.forEach((e,o)=>{if(0===o||o===c||o===f){let s=t("h3"),a=o===f?3:o?2:1;if(s.className="sm-po-section-heading",s.innerHTML=`<span class=sm-po-step-number>${a}</span><span>${p[a-1]}</span>`,i.insertBefore(s,e),!o&&c>0){let o=t("p");o.className="sm-po-section-intro",i.insertBefore(o,e)}}let l=e.querySelector(".details-product-option__title")||e.querySelector("label"),n=a(l&&l.textContent);e.classList.add("sm-po-card"),e.dataset.smPoKind=/replacement usb hub|which usb hub/.test(n)?"conditional":(s.includes("apim-and-screen")||s.includes("2019-2022-mustang-4-to-8")||s.includes("2019-2023-ranger-4-to-8")||s.includes("2017-2019-f-250-f-350-super-duty-4-to-8")||s.includes("2013-2014-f-150-4-to-8")||s.includes("2015-2017-f-150-4-to-8")||s.includes("2018-2020-f-150-4-to-8")||s.includes("2020-2022-f-250-350-super-duty-4-to-8"))&&o>=c||/4(?:"|-inch)?\s*to\s*8|simplycare|extended warranty|wireless|connectivity upgrade|authentic usb-c|upload a (?:picture|vin)/.test(n)?"optional":"required",e.dataset.smNote="vehicle model"===n?"vehicle":"vin"===n?"vin":s.includes("apim-and-screen")&&/choose your display/.test(n)?"display":/connectivity upgrade/.test(n)?"connectivity":/upload a vin/.test(n)?"vin-photo":"";let r=/upgrade path/.test(n)?"u":/bezel and trim color/.test(n)?"r":/choose your display/.test(n)?"d":/extended warranty|simplycare/.test(n)?"s":/4(?:"|-inch)?\s*to\s*8/.test(n)?"v":!d&&/connectivity upgrade|built-in wireless/.test(n)?"c":"";if(r&&l&&!l.querySelector(".sm-po-help-button")){d=d||"c"===r;let e=t("button");e.type="button",e.className="sm-po-help-button",e.dataset.help=r,e.textContent="?",l.append(e)}let u=/^vehicle model$/.test(n)?"Select your vehicle":/^model year$/.test(n)?"Select model year":/choose your display/.test(n)?"Select your display type":"vin"===n?"Enter your 17 character VIN":"",m=u&&e.querySelector(".form-control__placeholder-inner");m&&(m.textContent=u)}),i.dataset.sm=s}e.addEventListener("click",o=>{let a=o.target.closest(".sm-po-help-button");if(a){o.preventDefault(),o.stopPropagation();let l=a.dataset.help,n=e.querySelector(".sm-po-dialog");n||(n=t("dialog"),n.className="sm-po-dialog",e.body.append(n)),n.dataset.help=l,n.innerHTML=`<div class=sm-po-dialog__header><h2 class=sm-po-dialog__title>${s[l]}</h2><button type=button class=sm-po-dialog__close aria-label=Close>×</button></div><div class=sm-po-dialog__body>${"<p class=sm-po-copy><b></b><span></span></p>".repeat(3)}<a class=sm-po-dialog__link href=https://simplymichigan.co/support#article=104443-4-to-8-conversion-overview target=_blank>Read the conversion overview</a></div>`,n.showModal()}let l=o.target.closest(".sm-po-dialog__close");l&&l.closest("dialog").close()}),new MutationObserver(()=>requestAnimationFrame(l)).observe(e.documentElement,{childList:!0,subtree:!0}),l()})();

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
var D={Ford:{"C-Max":[2013,2015,"Standard"],Edge:[2011,2015,"Recessed"],Escape:[2013,2015,"Standard"],Expedition:[2015,2015,"Standard"],Explorer:[2011,2016,"Recessed"],"F-150":[2013,2015,"F150"],"F-250":[2013,2016,"Recessed"],"F-350":[2013,2016,"Recessed"],"F-450":[2013,2016,"Recessed"],Fiesta:[2013,2015,"Special"],Flex:[2013,2015,"Recessed"],Focus:[2012,2015,"Standard"],Fusion:[2013,2016,"Standard"],Mustang:[2015,2015,"Standard"],Taurus:[2013,2015,"Recessed"],Transit:[2015,2015,"Special"]},Lincoln:{MKC:[2015,2015,"Standard"],MKS:[2013,2015,"Recessed"],MKT:[2013,2015,"Recessed"],MKX:[2011,2015,"Recessed"],MKZ:[2013,2016,"Standard"],Navigator:[2015,2015,"Standard"]}};
var A={Ford:{"C-Max":[2013,2018],Edge:[2011,2024],Escape:[2013,2022],Expedition:[2015,2024],Explorer:[2011,2024],"F-150":[2013,2024],"F-250":[2013,2024],"F-350":[2013,2024],"F-450":[2013,2024],Fiesta:[2013,2019],Flex:[2013,2019],Focus:[2012,2018],Fusion:[2013,2020],Mustang:[2015,2023],Taurus:[2013,2019],Transit:[2015,2024],EcoSport:[2018,2022],Ranger:[2019,2023]},Lincoln:{Aviator:[2020,2021],Continental:[2017,2020],Corsair:[2020,2022],MKC:[2015,2019],MKS:[2013,2016],MKT:[2013,2019],MKX:[2011,2018],MKZ:[2013,2020],Nautilus:[2019,2023],Navigator:[2015,2021]}};
/* Factory 4-inch SYNC 3 Lite replacement ranges from the published product fitment table.
   These ranges describe applications, not universal APIM interchangeability. */
var L={"F-150":[2018,2020],Expedition:[2018,2021],"Expedition MAX":[2018,2021],EcoSport:[2018,2022],Mustang:[2019,2023],Ranger:[2019,2023],Edge:[2019,2019],Escape:[2020,2022],"F-250":[2020,2022],"F-350":[2020,2022],Transit:[2020,2025]};
function finderVehicles(source){
 var result={};Object.keys(source).forEach(function(make){result[make]={};Object.keys(source[make]).forEach(function(model){result[make][model]=source[make][model].slice()})});
 Object.keys(L).forEach(function(model){var range=L[model],existing=result.Ford[model];if(existing){existing[0]=Math.min(existing[0],range[0]);existing[1]=Math.max(existing[1],range[1])}else result.Ford[model]=[range[0],range[1],"Unverified"]});return result
}
/* All three finders share the replacement catalog; D only limits Sync 2 conversions.
   Retain existing display guidance where known, otherwise offer a fitment check. */
var F=finderVehicles(A);
Object.keys(F).forEach(function(make){Object.keys(F[make]).forEach(function(model){var conversion=(D[make]||{})[model];F[make][model][2]=conversion?conversion[2]:"Unverified"})});
/* Navigator display fitment is confirmed here for 2015 only. */
F.Lincoln.Navigator[2]={2015:"Standard"};
/* Confirmed standard replacement display for 2019–2023 Ranger. */
F.Ford.Ranger[2]="Standard";
A=F;
var P="https://simplymichigan.co/products/",U={n:P+"ford-lincoln-sync-3-apim-and-screen-complete-upgrade-kit-without-navigation",y:P+"ford-lincoln-sync-3-apim-and-screen-complete-upgrade-kit-with-navigation",t:P+"ford-f-150-f-250-sync-3-8-to-12-screen-upgrade-kit",s:P+"ford-sync-3-apim-and-screen-complete-upgrade-kit-for-fiesta-transit",f1314:P+"2013-2014-f-150-4-to-8-complete-sync-3-upgrade-kit",f1517:P+"2015-2017-f-150-4-to-8-complete-sync-3-upgrade-kit",f4:P+"2018-2020-f-150-4-to-8-complete-sync-3-upgrade-kit",sd1719:P+"2017-2019-f-250-f-350-super-duty-4-to-8-complete-sync-3-upgrade-kit",sd4:P+"2020-2022-f-250-350-super-duty-4-to-8-complete-sync-3-upgrade-kit",m4:P+"2019-2022-mustang-4-to-8-complete-sync-3-upgrade-kit",r4:P+"2019-2023-ranger-4-to-8-complete-sync-3-upgrade-kit",an:P+"ford-lincoln-sync-3-apim-replacement-with-navigation",ax:P+"ford-lincoln-sync-3-apim-replacement-without-navigation",lite:P+"ford-sync-3-lite-apim-replacement-for-4-non-touchscreen-systems",ds:P+"sync-3-display-screen-replacement-standard",dr:P+"sync-3-display-screen-replacement-recessed",d4:P+"sync-4-8-46-display-with-sync-3-conversion-bracket",acm:P+"audio-control-module-acm-receiver",g:"https://simplymichigan.co/support#article=104443-4-to-8-conversion-overview",e:"https://simplymichigan.co/upgrade_guide",c:"https://simplymichigan.co/contact-us"};
function display(a,v){if(a[2]&&typeof a[2]==="object")return a[2][v]||"Unverified";return a[2]==="F150"?(v>=2015?"Standard":"Recessed"):a[2]}
function replacements(t,twelve,sync4){var q=[];if(twelve)q.push(['12&quot; Upgrade Kit',U.t]);q.push(["APIM (Navigation)",U.an],["APIM (Non-Navigation)",U.ax]);if(t==="Special"||t==="Unverified"){q.push(["Contact Us About a Display",U.c],["ACM Replacement",U.acm]);return q}q.push(['Sync 3 8.0&quot; Screen',t==="Standard"?U.ds:U.dr]);if(sync4)q.push(['Sync 4 8.46&quot; Screen Upgrade',U.d4]);q.push(["ACM Replacement",U.acm]);return q}
function conversionKit(make,model,year){
 if(make!=="Ford")return null;
 if(model==="F-150"){
  if(year>=2013&&year<=2014)return {name:"F-150",url:U.f1314,twelve:false};
  if(year>=2015&&year<=2017)return {name:"F-150",url:U.f1517,twelve:true};
  if(year>=2018&&year<=2020)return {name:"F-150",url:U.f4,twelve:true}
 }
 if(model==="Mustang"&&year>=2019&&year<=2022)return {name:"Mustang",url:U.m4,twelve:false};
 if(model==="Ranger"&&year>=2019&&year<=2023)return {name:"Ranger",url:U.r4,twelve:false};
 if((model==="F-250"||model==="F-350"||model==="F-450")&&year>=2017&&year<=2019)return {name:"Super Duty",url:U.sd1719,twelve:model!=="F-450"};
 if((model==="F-250"||model==="F-350")&&year>=2020&&year<=2022)return {name:"Super Duty",url:U.sd4,twelve:true};
 return null
}
function liteReplacement(make,model,year,show){
 var range=make==="Ford"&&L[model];if(!range||year<range[0]||year>range[1])return false;
 var links=[["APIM (Sync 3 Lite Non-Touchscreen)",U.lite]],kit=conversionKit(make,model,year);
 var copy="Keep your factory 4-inch non-touchscreen Sync 3 Lite system with a replacement APIM. We will verify your vehicle's eligibility using your VIN before shipping.";
 if(model==="Transit")copy+=" Factory Sync 3 Lite is required; base radio and E-Transit models are excluded.";
 if(model==="Expedition"||model==="Expedition MAX")copy+=" Availability depends on factory equipment; some applications are fleet/XL configurations.";
 if(kit){links.push(["Upgrade to 8&quot; Sync 3",kit.url]);if(kit.twelve)links.push(["12&quot; Upgrade Kit",U.t]);copy+=" Prefer a larger screen? Choose a complete upgrade kit below."}
 else links.push(["Questions About Your System?",U.c,1]);
 show(kit?"Replacement and upgrade options":"4-inch Sync 3 Lite replacement",copy,links);return true
}
function conversionYearMax(make,model){if(make!=="Ford")return 0;if(model==="F-150")return 2020;if(model==="Ranger")return 2023;if(model==="Mustang"||model==="F-250"||model==="F-350")return 2022;return 0}
var HKEY="smVehicleHandoffV1",HMAX=30*60*1000;
function clean(s){return (s||"").replace(/\s+/g," ").trim().toLowerCase()}
function remember(e){
 var link=e.target.closest(".sm-home-fit__actions a,.sm-fit__actions a");if(!link)return;var u=new URL(link.href,location.href);if(u.origin!==location.origin||!/^\/products\//.test(u.pathname))return;
 var home=!!link.closest(".sm-home-fit__actions"),p=home?"sm-home-fit-":"sm-fit-",b=document.getElementById(p+"brand"),m=document.getElementById(p+"model"),y=document.getElementById(p+"year"),s=document.getElementById(p+"system");if(!b||!m||!y||!s||!b.value||!m.value||!y.value||!s.value)return;
 var a=(F[b.value]||{})[m.value],v=+y.value,h={make:b.value,model:m.value,year:v,system:s.value,display:a?display(a,v):"",target:u.pathname.replace(/\/$/,""),created:Date.now()};try{sessionStorage.setItem(HKEY,JSON.stringify(h))}catch(x){}
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
 document.addEventListener("click",function(e){var b=e.target.closest(".sm-fitment-alert");if(!b)return;e.preventDefault();e.stopPropagation();var d=document.querySelector(".sm-fitment-dialog");if(!d){d=document.createElement("dialog");d.className="sm-po-dialog sm-fitment-dialog";document.body.appendChild(d);d.addEventListener("click",function(x){if(x.target===d)d.close()});d.addEventListener("close",function(){document.documentElement.classList.remove("sm-po-modal-open")})}d.innerHTML='<div class="sm-po-dialog__header"><h2 class="sm-po-dialog__title">Lincoln MKZ and MKC Screen Fitment</h2><button type="button" class="sm-po-dialog__close" aria-label="Close">&times;</button></div><div class="sm-po-dialog__body"><p>Due to a redesigned display, MKZ and MKC vehicles will require bracket modification to complete the installation, as described <a href="https://simplymichigan.co/support#article=104288-screen-fitment-and-converting-mkc-and-mkz-vehicles">here</a>. If we have brackets in stock, your conversion kit will include replacement brackets. Please verify with us before purchase to ensure that we have these brackets stocked if you\'re depending on them to complete your installation.</p></div>';document.documentElement.classList.add("sm-po-modal-open");if(!d.open)d.showModal()});
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
 set(promo,{"grid-area":"promotion",display:"inline-flex",width:"fit-content","max-width":"100%","align-items":"center",gap:"8px","justify-self":"start",padding:"7px 9px 7px 12px",color:"#222",background:"#f3f4f6",border:"1px solid #d7d9dd","border-radius":"10px","font-size":"13px","font-weight":"700","line-height":"1.25"});set(promo.querySelector(".sm-price-promo__text"),{"white-space":"nowrap"});set(copy,{appearance:"none",flex:"0 0 auto","min-height":"28px",padding:"4px 9px",color:"#222",background:"#fff",border:"1px solid #b9bdc4","border-radius":"7px",font:"inherit","font-size":"12px","line-height":"1.2"});set(status,{position:"absolute",width:"1px",height:"1px",padding:"0",margin:"-1px",overflow:"hidden",clip:"rect(0, 0, 0, 0)","white-space":"nowrap",border:"0"});
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
 var b=document.getElementById("sm-home-fit-brand"),m=document.getElementById("sm-home-fit-model"),y=document.getElementById("sm-home-fit-year"),s=document.getElementById("sm-home-fit-system"),r=document.getElementById("sm-home-fit-result"),X={Ford:{"F-150":2020,"F-250":2022,"F-350":2022,Mustang:2022,Ranger:2023}},bl=b.closest("label").querySelector("span"),bo=b.querySelector('option[value=""]'),os=s.querySelector('option[value=""]'),o8=s.querySelector('option[value="8"]'),o3=s.querySelector('option[value="3"]');if(bl)bl.textContent="Make";if(bo)bo.textContent="Select make";if(os)os.textContent="Select system";if(o3)o3.textContent='8" Sync 3 (touch screen)';if(o8&&o3)s.insertBefore(o3,o8.nextSibling);var refreshSystem=visualSystemPicker(s);
 function base(){return (F[b.value]||{})[m.value]}
 function max(a){return Math.max((X[b.value]||{})[m.value]||0,a[1])}
 function system(){s.disabled=!(b.value&&m.value&&y.value);if(s.disabled)s.value="";refreshSystem()}
 function models(){m.innerHTML='<option value="">Select model</option>';years();Object.keys(F[b.value]||{}).forEach(function(k){var o=document.createElement("option");o.value=o.textContent=k;m.appendChild(o)});m.disabled=!b.value}
 function years(){var a=base();y.innerHTML='<option value="">Select year</option>';y.disabled=!a;if(a)for(var i=a[0];i<=max(a);i++){var o=document.createElement("option");o.value=o.textContent=i;y.appendChild(o)}system()}
 function has12(k,v){return b.value==="Ford"&&((k==="F-150"&&v>=2015&&v<=2020)||((k==="F-250"||k==="F-350")&&v>=2017&&v<=2022))}
 function actions(a){return '<div class="sm-home-fit__actions">'+a.map(function(x){return '<a href="'+x[1]+'">'+x[0]+'</a>'}).join("")+'</div>'}
 function show(t,p,a,n){r.className="sm-home-fit__result"+(n?" sm-home-fit__result--notice":"")+(t==="Your vehicle is eligible"||/^We have a complete kit for your /.test(t)?" sm-home-fit__result--eligible":"");r.innerHTML="<h3>"+t+"</h3><p>"+p+"</p>"+(a?actions(a):"");r.hidden=false}
 b.addEventListener("change",models);m.addEventListener("change",years);y.addEventListener("change",system);system();
 f.addEventListener("submit",function(e){e.preventDefault();var k=m.value,a=base(),v=+y.value,z=s.value;if(!b.value||!k||!a||!v||!z){show("Please complete all four fields","Select a make, model, year and current system.",0,1);return}
  if(z==="4"&&liteReplacement(b.value,k,v,show))return;
  if(z==="4"){
   var kit=conversionKit(b.value,k,v);if(kit){var links=[["View the "+kit.name+" Kit",kit.url]];if(kit.twelve)links.push(["12&quot; Upgrade Kit",U.t]);show("We have a complete kit for your "+kit.name,"This kit includes all of the hardware and programming needed to upgrade your factory 4&quot; system to Sync 3.",links);return}
   show("This vehicle may be convertible","A factory base Sync 4&quot; system needs additional hardware and programming. Review the conversion guide or contact us and we will help identify what you need.",[["Read the 4&quot; to 8&quot; Guide",U.g],["Contact Us",U.c]],1);return
  }
  if(z==="3"){var t=display(a,v),twelve=has12(k,v),q=replacements(t,twelve,!(b.value==="Lincoln"&&(k==="MKZ"||k==="MKC"))),p=twelve?'Your vehicle is eligible for our 12&quot; screen upgrade, which retains your existing Sync 3 system. We also offer VIN programmed APIM modules, replacement displays, and ACM replacements for your vehicle.':"We offer VIN programmed APIM modules, replacement displays, and ACM replacements for your vehicle.";show("Looking for replacement hardware?",p,q);return}
  if(z==="u"){show("We can identify it for you","Send us a clear dashboard photo and your model year, and we will identify your system.",[["Contact Us",U.c]],1);return}
  var sync2=(D[b.value]||{})[k];if(!sync2||v<sync2[0]||v>sync2[1]){show("Let’s verify this combination","That model year was not normally equipped with Sync 2. Contact us and we will confirm what is currently installed.",[["Contact Us",U.c]],1);return}
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
 var b=document.getElementById("sm-fit-brand"),m=document.getElementById("sm-fit-model"),y=document.getElementById("sm-fit-year"),s=document.getElementById("sm-fit-system"),r=document.getElementById("sm-fit-result"),isApim=/\/products\/sync-3-apims\/?$/.test(location.pathname),V=isApim?A:F,bl=b.closest("label").querySelector("span"),bo=b.querySelector('option[value=""]');if(bl)bl.textContent="Make";if(bo)bo.textContent="Select make";if(m.tagName!=="SELECT"){var n=document.createElement("select");n.id=m.id;n.required=true;n.disabled=true;n.innerHTML='<option value="">Select model</option>';m.replaceWith(n);m=n;var d=document.getElementById("sm-fit-models");if(d)d.remove()}var o8=s.querySelector('option[value="8"]'),o3=s.querySelector('option[value="3"]'),o4=s.querySelector('option[value="4"]');if(o8)o8.textContent='8" Sync 2 (touch screen)';if(o3)o3.textContent='8" Sync 3 (touch screen)';if(o8&&o3)s.insertBefore(o3,o8.nextSibling);if(o4)o4.textContent='4" Base Sync (non-touch screen)';var refreshSystem=visualSystemPicker(s);
 function key(){return m.value}
 function system(){s.disabled=!(b.value&&m.value&&y.value);if(s.disabled)s.value="";refreshSystem()}
 function models(){m.innerHTML='<option value="">Select model</option>';years();Object.keys(V[b.value]||{}).forEach(function(k){var o=document.createElement("option");o.value=o.textContent=k;m.appendChild(o)});m.disabled=!b.value}
 function years(){var k=key(),a=k&&V[b.value][k],end=a&&(isApim?a[1]:Math.max(a[1],conversionYearMax(b.value,k)));y.innerHTML='<option value="">Select model year</option>';y.disabled=!a;if(a)for(var i=a[0];i<=end;i++){var o=document.createElement("option");o.value=o.textContent=i;y.appendChild(o)}system()}
 function buttons(a){return '<div class="sm-fit__actions">'+a.map(function(x){return '<a'+(x[2]?' class="sm-fit__secondary"':'')+' href="'+x[1]+'">'+x[0]+'</a>'}).join("")+'</div>'}
 function show(t,p,a,n){r.className="sm-fit__result"+(n?" sm-fit__result--notice":"")+(t==="Your vehicle is eligible"||/^We have a complete kit for your /.test(t)?" sm-fit__result--eligible":"");r.innerHTML="<h4>"+t+"</h4><p>"+p+"</p>"+(a?buttons(a):"");r.hidden=false}
 b.addEventListener("change",models);m.addEventListener("change",years);y.addEventListener("change",system);system();
 f.addEventListener("submit",function(e){e.preventDefault();var k=key(),a=k&&V[b.value][k],v=+y.value,z=s.value;if(!b.value||!k||!a||!v||!z){show("Please complete all four fields","Select a make, model, year and current system.",0,1);return}
 if(z==="4"&&liteReplacement(b.value,k,v,show))return;
 if(isApim){
  if(z==="3"){show("Your vehicle uses Sync 3","Choose the replacement APIM you prefer. Both options are tested, fully updated, and programmed to your VIN before shipping.",[["APIM with Factory Navigation",U.an],["APIM without Factory Navigation",U.ax]]);return}
  if(z==="8"){var sync2=(D[b.value]||{})[k];if(!sync2||v<sync2[0]||v>sync2[1]){show("Let’s verify this combination","That model year was not normally equipped with Sync 2. Contact us and we will confirm what is currently installed.",[["Contact Us",U.c]],1);return}if(display(a,v)==="Special"){show("You currently have Sync 2","A replacement APIM alone will not upgrade a Sync 2 system. Your "+v+" "+b.value+" "+k+" uses our dedicated 6.5-inch Fiesta/Transit Sync 3 upgrade kit, available with or without factory navigation.",[["View the Correct Kit",U.s]],1);return}var screenNote=b.value==="Lincoln"&&k==="Navigator"&&v===2015?"Your 2015 Lincoln Navigator requires the <strong>standard display</strong>. ":"";show("You currently have Sync 2",screenNote+"A replacement APIM alone will not upgrade a Sync 2 system. Choose a complete Sync 3 upgrade kit instead; both options include Apple CarPlay and Android Auto.",[["Sync 3 Upgrade with Factory Navigation",U.y],["Sync 3 Upgrade without Factory Navigation",U.n]],1);return}
  if(z==="4"){var kit=conversionKit(b.value,k,v);if(kit){var links=[["View the "+kit.name+" Kit",kit.url]];if(kit.twelve)links.push(["12&quot; Upgrade Kit",U.t]);show("We have a complete kit for your "+kit.name,"A replacement APIM alone will not upgrade a factory 4&quot; base system. This complete kit includes the additional hardware and programming needed for the conversion.",links);return}show("You need a complete conversion kit","A replacement APIM alone will not upgrade a factory 4&quot; base system. Use our conversion guide to identify the additional hardware and programming your vehicle requires.",[["Find a Complete Upgrade",P+"sync-2-to-sync-3-upgrades"],["Read the 4&quot; to 8&quot; Guide",U.g]],1);return}
  show("We can identify it for you","Send us a clear dashboard photo along with your vehicle model and year, and we will identify your system.",[["Contact Us",U.c]],1);return
 }
 if(z==="4"){var kit=conversionKit(b.value,k,v);if(kit){var links=[["View the "+kit.name+" Kit",kit.url]];if(kit.twelve)links.push(["12&quot; Upgrade Kit",U.t]);show("We have a complete kit for your "+kit.name,"This kit includes all of the hardware and programming needed to upgrade your factory 4&quot; system to Sync 3.",links);return}show("This may be convertible","A factory 4&quot; base Sync system needs additional hardware and programming. Unfortunately we don't currently stock a complete kit for your vehicle, but we can definitely get you most of the way there. You would just need to source a few parts elsewhere. Review the conversion guide and contact us if you have any questions; we would be happy to help.",[["Read the 4&quot; to 8&quot; Guide",U.g],["Contact Us",U.c,1]],1);return}
 if(z==="3"){var t=display(a,v),twelve=b.value==="Ford"&&k==="F-150"&&v===2015,q=replacements(t,twelve,!(b.value==="Lincoln"&&(k==="MKZ"||k==="MKC"))),p=twelve?'Your vehicle is eligible for our 12&quot; screen upgrade, which retains your existing Sync 3 system. We also offer VIN programmed APIM modules, replacement displays, and ACM replacements for your vehicle.':"We offer VIN programmed APIM modules, replacement displays, and ACM replacements for your vehicle.";show("Looking for replacement hardware?",p,q);return}
 if(z==="u"){show("We can identify it for you","Send us a clear dashboard photo and your model year, and we will identify your system.",[["Send Us Your Details",U.c]],1);return}
 var sync2=(D[b.value]||{})[k];if(!sync2||v<sync2[0]||v>sync2[1]){show("Let’s verify this combination","That model year was not normally equipped with Sync 2. Contact us and we will confirm what is currently installed.",[["Contact Us",U.c]],1);return}
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

/* Read processing estimates from the current product's full policy, never its preview. */
var SMI_PROCESSING_POLICY=(function(){
 function read(root){
  if(!root||!/^\/products\/(?:ford-lincoln-sync-3-apim-(?:and-screen-complete-upgrade-kit|replacement)-(?:with|without)-navigation|ford-sync-3-apim-and-screen-complete-upgrade-kit-for-fiesta-transit|ford-sync-3-lite-apim-replacement-for-4-non-touchscreen-systems|ford-f-150-f-250-sync-3-8-to-12-screen-upgrade-kit|audio-control-module-acm-(?:receiver|reciever)|(?:2013-2014-f-150|2015-2017-f-150|2018-2020-f-150|2020-2022-f-250-350-super-duty|2017-2019-f-250-f-350-super-duty|2019-2022-mustang|2019-2023-ranger)-4-to-8-complete-sync-3-upgrade-kit)\/?$/.test(location.pathname))return null;
  var detail=Array.prototype.find.call(root.querySelectorAll('details'),function(item){
   var summary=item.querySelector(':scope > summary');if(!summary)return false;
   var title=summary.querySelector('.sm-disclosure-title');
   var text=title?title.textContent:Array.prototype.map.call(summary.childNodes,function(node){return node.nodeType===3?node.textContent:''}).join(' ');
   return /^Processing Time$/i.test(text.trim());
  });
  if(!detail)return null;
  var copy=detail.cloneNode(true);copy.querySelector('summary').remove();
  var body=copy.textContent.replace(/\s+/g,' ').trim();
  var times=body.match(/\b\d+(?:\s*(?:[-–—]|to)\s*\d+)?\s+business days\b/gi);
  if(!times)return null;
  var estimate,preview;
  if(times.length===1){
   var time=times[0].replace(/\s*(?:[-–—]|\bto\b)\s*/g,'–');
   estimate=/–/.test(time)?'typically '+time:'usually within '+time;
   preview=/–/.test(time)?'Typical processing time is '+time+'.':'Most orders ship within '+time+'.';
  }else{
   // Fiesta/Transit has a usual estimate followed by an explicit longer allowance.
   var allowance=body.match(/Most orders ship within (\d+ business days); however, .*?additional processing and should ship within (\d+ business days)\./i);
   if(!allowance)return null; // Do not guess when a policy has multiple unexplained estimates.
   estimate='usually within '+allowance[1]+'; allow up to '+allowance[2];
   preview=allowance[0];
  }
  var caveat=/Certain configurations may take longer\./i.test(body)?' Certain configurations may take longer.':'';
  return{detail:detail,note:'Processing time: '+estimate+'.'+caveat,preview:preview+caveat};
 }
 return{read:read};
})();

(function(){
 function enhanceTextDisclosures(){
  var root=document.querySelector(".product-details__product-description");
  if(!root)return;
  var policyPreviews={
   "warranty":"Your hardware is covered for one year from the purchase date. If a covered component fails, we’ll replace it.",
   "shipping":"Free domestic shipping is included to all 50 states. Every order is securely packaged to protect its contents during transit.",
   "returns and cancellations":"Free domestic returns are available within 30 days. We’ll provide a prepaid return label at no charge."
  };
  var processing=SMI_PROCESSING_POLICY.read(root);
  root.querySelectorAll('details[style*="border-left:3px solid #9a9a9a"]').forEach(function(detail){
   var summary=detail.querySelector(":scope > summary");
   if(!summary||detail.classList.contains("sm-care-disclosure"))return;
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
   if(processing&&processing.detail===detail)previewCopy=processing.preview;
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
   var processingPreview=summary.querySelector('.sm-disclosure-preview');
   if(processing&&processing.detail===detail&&processingPreview&&processingPreview.textContent!==processing.preview)processingPreview.textContent=processing.preview;
   var hasPreview=!!summary.querySelector(":scope > .sm-disclosure-preview-row");
   detail.classList.toggle("sm-text-disclosure--preview",hasPreview);
   detail.classList.toggle("sm-text-disclosure--plain",!hasPreview);
   var action=summary.querySelector(":scope > .sm-disclosure-action, .sm-care-layout .sm-disclosure-action");
   if(!action){
    action=document.createElement("span");
    action.className="sm-disclosure-action";
    action.setAttribute("aria-hidden","true");
    summary.appendChild(action)
   }
   function update(){var care=detail.classList.contains("sm-care-disclosure");action.textContent=care?(detail.open?"Click or tap on the card to close":"Click or tap on the card to view more"):(detail.open?"Close":"Read More")}
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
   var processing=SMI_PROCESSING_POLICY.read(label.closest('.product-details').querySelector('.product-details__product-description'));
   var note=label.parentElement.querySelector(':scope > .sm-stock-processing');
   var noteCopy=state==='available'&&processing?processing.note:'';
   if(noteCopy){
    if(!note){note=document.createElement('div');note.className='sm-stock-processing';label.after(note)}
    if(note.textContent!==noteCopy)note.textContent=noteCopy;
   }else if(note)note.remove();
   label.classList.toggle('sm-stock-status--processing',!!noteCopy);
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
  {id:'etDgW6yLIIU',title:'Sync 2 to Sync 3 Installation',creator:'Auto Freak Garage'},
  {id:'OWrfQuf2pgI',title:'Is a Sync 3 Upgrade Worth It?',creator:'Nine Finger Wrenching'},
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
   if(!['etDgW6yLIIU','DOY7z6q39AU'].every(function(id){return frames.some(function(frame){return frame.src.indexOf('/embed/'+id)>=0})}))return;
   var gallery=build();frames[0].before(gallery);frames.forEach(function(frame){frame.remove()});
  });
 }
 SMI_DOM_RUNNER.add(enhanceVideos);
 document.addEventListener('load',function(event){if(event.target.tagName==='LINK')enhanceVideos()},true);
})();

/* A small mobile scroll bar reflects and controls Ecwid's existing product row. */
(function(){
 var state=null,mobile=window.matchMedia('(max-width: 767px)');
 function cleanup(){
  if(!state)return;
  state.row.removeEventListener('scroll',state.sync);state.resize.disconnect();
  state.row.classList.remove('sm-arrivals-dragging');state.bar.remove();state=null;
 }
 function enhance(){
  var tile=document.getElementById('tile-category-products-eqfZnr');
  var row=tile&&tile.querySelector('.ins-tile__body-inner');
  if(!mobile.matches||!row){cleanup();return}
  if(state&&state.row===row&&state.bar.isConnected){state.sync();return}
  cleanup();
  var bar=document.createElement('input');bar.type='range';bar.className='sm-arrivals-scroll';
  bar.min='0';bar.max='1000';bar.step='1';bar.value='0';bar.setAttribute('aria-label','Scroll through new arrivals');
  var dragging=false;
  function sync(){
   var max=row.scrollWidth-row.clientWidth;bar.hidden=max<=1;
   bar.style.setProperty('--sm-scroll-thumb',Math.max(32,bar.clientWidth*row.clientWidth/Math.max(1,row.scrollWidth))+'px');
   if(!dragging)bar.value=String(Math.round(Math.max(0,Math.min(1,row.scrollLeft/Math.max(1,max)))*1000));
   bar.setAttribute('aria-valuetext',Math.round(Number(bar.value)/10)+'% through new arrivals');
  }
  function finish(){dragging=false;row.classList.remove('sm-arrivals-dragging');sync()}
  bar.addEventListener('pointerdown',function(){dragging=true;row.classList.add('sm-arrivals-dragging')});
  bar.addEventListener('input',function(){
   row.classList.add('sm-arrivals-dragging');
   row.scrollLeft=Number(bar.value)/1000*(row.scrollWidth-row.clientWidth);sync();
  });
  bar.addEventListener('change',finish);bar.addEventListener('pointerup',finish);bar.addEventListener('pointercancel',finish);bar.addEventListener('blur',finish);
  row.closest('.ins-tile__slider').after(bar);
  row.addEventListener('scroll',sync,{passive:true});
  var resize=new ResizeObserver(sync);resize.observe(row);resize.observe(bar);
  state={row:row,bar:bar,sync:sync,resize:resize};sync();
 }
 SMI_DOM_RUNNER.add(enhance);mobile.addEventListener('change',enhance);
})();

/* Announce the newly available jump-seat configuration on the 12-inch kit only. */
(function(){
 function seatAvailabilityBanner(){
  var active=/\/products\/ford-f-150-f-250-sync-3-8-to-12-screen-upgrade-kit\/?$/.test(location.pathname);
  var details=active&&document.querySelector('.product-details');
  document.querySelectorAll('.sm-seat-availability').forEach(function(banner){
   if(!details||banner.nextElementSibling!==details)banner.remove();
  });
  if(!details||getComputedStyle(details).getPropertyValue('--sm-seat-availability').trim()!=='1'||details.previousElementSibling?.classList.contains('sm-seat-availability'))return;
  var banner=document.createElement('div');banner.className='sm-seat-availability';banner.setAttribute('role','note');
  banner.innerHTML='<span class="sm-seat-availability__check" aria-hidden="true">✓</span><span><strong>Fold down / bench seat configurations</strong> are now available in limited quantities.</span>';
  details.before(banner);
 }
 SMI_DOM_RUNNER.add(seatAvailabilityBanner);
 document.addEventListener('load',function(event){if(event.target.tagName==='LINK')seatAvailabilityBanner()},true);
})();

/* The 12-inch fold-down center-seat kit is currently offered in silver only. */
(function(){
 var locked=new WeakMap(),syncing=false,noteID='sm-bench-seat-color-note';
 function release(select){
  var state=locked.get(select);if(!state)return;
  select.disabled=state.disabled;locked.delete(select);
  var described=(select.getAttribute('aria-describedby')||'').split(/\s+/).filter(function(id){return id&&id!==noteID});
  if(described.length)select.setAttribute('aria-describedby',described.join(' '));else select.removeAttribute('aria-describedby');
 }
 function syncColor(){
  if(syncing)return;syncing=true;
  try{
   var active=/\/products\/ford-f-150-f-250-sync-3-8-to-12-screen-upgrade-kit\/?$/.test(location.pathname);
   var box=active&&document.querySelector('.details-product-options');
   var seat=box&&box.querySelector('select[aria-label="Do you have a center console or fold down center seat (bench seat)?"]');
   var color=box&&box.querySelector('select[aria-label="Bezel and Trim Color"]');
   var silver=color&&Array.from(color.options).find(function(option){return option.value==='Silver'});
   var limited=seat&&seat.value==='Fold down center seat (bench seat)'&&silver;
   document.querySelectorAll('.sm-bench-color-locked').forEach(function(row){
    if(limited&&row.contains(color))return;
    var old=row.querySelector('select');if(old)release(old);
    row.classList.remove('sm-bench-color-locked');var note=row.querySelector('.sm-bench-color-note');if(note)note.remove();
   });
   if(!limited)return;
   // Notify Ecwid before locking so its order selection, label and price all update.
   if(color.value!==silver.value){
    color.value=silver.value;
    color.dispatchEvent(new Event('input',{bubbles:true}));
    color.dispatchEvent(new Event('change',{bubbles:true}));
   }
   if(!locked.has(color))locked.set(color,{disabled:color.disabled});
   color.disabled=true;
   var row=color.closest('.details-product-option');row.classList.add('sm-bench-color-locked');
   var note=row.querySelector('.sm-bench-color-note');
   if(!note){note=document.createElement('p');note.id=noteID;note.className='sm-bench-color-note';note.setAttribute('role','status');note.textContent='The fold-down center seat version is currently available in silver only.';row.appendChild(note)}
   var described=(color.getAttribute('aria-describedby')||'').split(/\s+/).filter(Boolean);
   if(described.indexOf(noteID)<0){described.push(noteID);color.setAttribute('aria-describedby',described.join(' '))}
  }finally{syncing=false}
 }
 SMI_DOM_RUNNER.add(syncColor);
 document.addEventListener('change',function(event){
  if(syncing||!event.target.matches('.details-product-options select'))return;
  syncColor();requestAnimationFrame(syncColor);
 });
})();

/* Keep Ecwid's live SKU beneath the product purchase controls. */
(function(){
 var mobile=window.matchMedia('(max-width: 767px)');
 function placeSKU(){
  document.querySelectorAll('.product-details__sidebar').forEach(function(sidebar){
   var sku=sidebar.querySelector(':scope > .product-details__product-sku');
   var purchase=sidebar.querySelector(':scope > .details-product-purchase');
   if(!sku||!purchase)return;
   if(purchase.nextElementSibling!==sku)purchase.after(sku);
   sku.style.marginTop='12px';
   sku.style.marginBottom=mobile.matches?'24px':'0';
  });
 }
 SMI_DOM_RUNNER.add(placeSKU);
 mobile.addEventListener('change',placeSKU);
})();

/* Load the unadvertised troubleshooting tool only on its own page. */
(function(){
 var task=null,retryAt=0,attempt=0,base='https://nickrams3y.github.io/smi-assets/troubleshoot/';
 function active(){return /^\/(?:en\/)?troubleshoot\/?$/.test(location.pathname)}
 function asset(tag,id,url){return new Promise(function(resolve,reject){
  var el=document.getElementById(id);
  if(el&&el.dataset.loaded==='true'){resolve();return}
  if(el)el.remove();el=document.createElement(tag);el.id=id;
  if(tag==='link'){el.rel='stylesheet';el.href=url}else{el.src=url;el.async=true}
  var timeout=setTimeout(function(){el.remove();reject(new Error('Troubleshooter asset timed out'))},15000);
  el.onload=function(){clearTimeout(timeout);el.dataset.loaded='true';resolve()};
  el.onerror=function(){clearTimeout(timeout);el.remove();reject(new Error('Troubleshooter asset unavailable'))};
  document.head.appendChild(el);
 })}
 function mount(){
  if(!active()){var old=document.getElementById('sm-troubleshoot');if(old)old.remove();return}
  var tile=document.getElementById('tile-text-ohZTvt');if(!tile)return;
  var root=document.getElementById('sm-troubleshoot');
  if(!root){root=document.createElement('section');root.id='sm-troubleshoot';root.setAttribute('aria-label','Infotainment troubleshooter');tile.after(root);root.innerHTML='<p style="text-align:center;padding:24px" role="status">Loading troubleshooting guide…</p>'}
  if(root.dataset.initialized)return;
  if(window.SMI_TROUBLESHOOT&&document.getElementById('sm-troubleshoot-css')?.dataset.loaded==='true'){window.SMI_TROUBLESHOOT.mount(root);return}
  if(task||Date.now()<retryAt)return;
  task=Promise.all([asset('link','sm-troubleshoot-css',base+'tool.css?v=20261018c'+(attempt?'&retry='+attempt:'')),asset('script','sm-troubleshoot-js',base+'tool.js?v=20261018d'+(attempt?'&retry='+attempt:''))]).then(function(){task=null;mount()}).catch(function(){
   task=null;attempt++;retryAt=Date.now()+30000;
   if(!root.isConnected)return;
   root.innerHTML='<p style="text-align:center;padding:24px" role="status">The guide could not load. <button type="button">Try again</button> or <a href="https://simplymichigan.co/contact-us">contact support</a>.</p>';
   root.querySelector('button').onclick=function(){retryAt=0;root.innerHTML='<p style="text-align:center;padding:24px" role="status">Loading troubleshooting guide…</p>';mount()};
  });
 }
 SMI_DOM_RUNNER.add(mount);
})();

/* The support library is fetched only on the dedicated support page. */
(function(){
 var task=null,failed=false,base='https://nickrams3y.github.io/smi-assets/support/';
 function active(){return /^\/(?:en\/)?support\/?$/.test(location.pathname)}
 function asset(tag,id,file){return new Promise(function(resolve,reject){
  var el=document.getElementById(id);if(el&&el.dataset.loaded==='true'){resolve();return}
  if(el)el.remove();el=document.createElement(tag);el.id=id;
  if(tag==='link'){el.rel='stylesheet';el.href=base+file}else{el.src=base+file;el.async=true}
  var timer=setTimeout(function(){el.remove();reject(new Error('Support asset timed out'))},15000);
  el.onload=function(){clearTimeout(timer);el.dataset.loaded='true';resolve()};
  el.onerror=function(){clearTimeout(timer);el.remove();reject(new Error('Support asset unavailable'))};document.head.appendChild(el);
 })}
 function mount(){
  var root=document.getElementById('sm-support'),tile=document.getElementById('tile-text-3SJuj7');
  if(!active()){if(root){if(window.SMI_SUPPORT)window.SMI_SUPPORT.unmount();root.remove()}if(tile)tile.hidden=false;return}
  if(document.querySelector('#sm-support[data-native]'))return;
  if(!tile)return;
  if(!root){root=document.createElement('section');root.id='sm-support';root.setAttribute('aria-label','Support library');root.style.minHeight='60vh';root.innerHTML='<p style="text-align:center;padding:32px" role="status">Loading support articles…</p>';tile.after(root)}
  if(root.dataset.initialized)return;
  if(window.SMI_SUPPORT&&document.getElementById('sm-support-css')?.dataset.loaded==='true'){tile.hidden=true;window.SMI_SUPPORT.mount(root);return}
  if(task||failed)return;
  task=Promise.all([asset('link','sm-support-css','hub.css?v=20261020c'),asset('script','sm-support-js','hub.js?v=20261020c')]).then(function(){task=null;mount()}).catch(function(){
   task=null;failed=true;if(!root.isConnected)return;
   root.innerHTML='<p style="text-align:center;padding:32px" role="status">The support library could not load. <button type="button">Try again</button> or <a href="https://simplymichigan.co/contact-us">contact us for help</a>.</p>';
   root.querySelector('button').onclick=function(){failed=false;mount()};
  });
 }
 SMI_DOM_RUNNER.add(mount);
})();

/* BEGIN checkout/review-note.js */
/* Informational Google review reminder. Bundled in site.js; no extra request. */
(function(){
 'use strict';
 var id='sm-checkout-review-note',styleId=id+'-style';
 function mount(){
  var payment=document.querySelector('.ec-cart-step--payment.ec-cart-step--current');
  var comments=payment&&payment.querySelector('.ec-form--comments');
  var section=comments&&comments.closest('.ec-cart-step__section');
  var note=document.getElementById(id);
  if(!section){if(note)note.remove();return}
  if(!document.getElementById(styleId)){
   var style=document.createElement('style');style.id=styleId;
   style.textContent='#sm-checkout-review-note{display:flex;align-items:flex-start;gap:13px;box-sizing:border-box;width:100%;margin:22px 0 0;padding:19px;border:1px solid #e2e2e2;border-radius:10px;background:#f5f5f4;color:#252525;font-family:inherit;text-align:left}'+
    '.ec-cart-step--payment .ec-cart-step__section:has(> #sm-checkout-review-note){padding-bottom:20px!important}'+
    '#sm-checkout-review-note{margin-bottom:0!important}'+
    '#sm-checkout-review-note .sm-review-icon{display:block;flex:0 0 23px;width:23px;height:23px;margin:2px 0 0;color:#646464}'+
    '#sm-checkout-review-note .sm-review-copy{min-width:0;flex:1}'+
    '#sm-checkout-review-note .sm-review-title{display:block;margin:0 0 8px;padding:0;font-family:inherit;font-size:16px;font-weight:700;line-height:1.4;color:#252525}'+
    '#sm-checkout-review-note p{margin:0;padding:0;font-family:inherit;font-size:14px!important;font-weight:400;line-height:1.6!important;color:#555}'+
    '#sm-checkout-review-note p.sm-review-thanks{margin-top:10px;font-size:13px!important;color:#696969}'+
    '@media(max-width:440px){#sm-checkout-review-note{padding:16px 14px;gap:10px}}';
   document.head.appendChild(style);
  }
  if(!note){
   note=document.createElement('aside');note.id=id;
   note.setAttribute('aria-labelledby',id+'-title');
   note.innerHTML='<svg class="sm-review-icon" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M21 15a3 3 0 0 1-3 3H7l-5 4V5a3 3 0 0 1 3-3h13a3 3 0 0 1 3 3z"/><path d="M12 14l-4-4a2.4 2.4 0 0 1 4-2.5A2.4 2.4 0 0 1 16 10z"/></svg>'+
    '<div class="sm-review-copy"><strong class="sm-review-title" id="'+id+'-title">A small favor for our small business</strong>'+
    '<p>After placing your order, please consider accepting Google’s invitation to receive a review survey after delivery. Your honest feedback helps Simply Michigan grow and helps other customers shop with confidence.</p>'+
    '<p class="sm-review-thanks">It’s completely optional, and we appreciate your support!</p></div>';
  }
  // Append after the comments section's native children. Inserting a sibling
  // before payment controls shifts Elm's child indexes and breaks checkout patches.
  if(note.parentElement!==section)section.appendChild(note);
 }
 SMI_DOM_RUNNER.add(mount);
})();
/* END checkout/review-note.js */

/* Shared soft-gray panels. Decoration only: never move Ecwid-owned controls. */
(function(){
 'use strict';
 function mark(box){
  var summary=box.tagName==='DETAILS'?box.querySelector(':scope > summary'):null;
  var head=summary||box;
  var title=(head.querySelector('strong,h2,h3,.sm-disclosure-title')||head).textContent.trim();
  var label=box.getAttribute('aria-label')||'';
  // Keep Nick's original policies, promos, kit contents and green benefit cards.
  var original=/^(Warranty|Processing Time|Shipping|Returns(?: and Cancellations)?|SimplyCare)/i.test(title)||
   /^(Kit contents|Military and first responder discounts|Audio Control Module replacement|Back in stock)$/i.test(label)||
   box.id==='sm-12-inch-upgrade-ad'||
   (parseFloat(box.style.borderTopWidth)>=3&&box.querySelector(':scope > [aria-hidden]'));
  if(original){
   box.classList.remove('sm-bubble','sm-bubble-benefit','sm-bubble-support');
   head.removeAttribute('data-sm-bubble-icon');
   box.querySelectorAll('.sm-bubble-old-icon').forEach(function(icon){icon.classList.remove('sm-bubble-old-icon')});
   return;
  }
  if(box.classList.contains('sm-bubble'))return;
  var icon=/questions|support|not sure/i.test(title)?'?':/discount/i.test(title)?'★':/warning|important|required|compatib|issue|intended/i.test(title)?'!':/return|cancel|trade/i.test(title)?'↩':/shipping|stock|contents/i.test(title)?'✓':/warranty|care|tested|programmed|play|updated/i.test(title)?'✓':'i';
  box.classList.add('sm-bubble');head.setAttribute('data-sm-bubble-icon',icon);
  if(/^Have a USB hub to trade in\?$/i.test(title)){box.classList.add('sm-hub-trade-in');head.removeAttribute('data-sm-bubble-icon')}
  if(/^(?:⚠\uFE0F?\s*)?Sync software version 3\.4 is required\.?$/i.test(title)){box.classList.add('sm-hub-software-note');head.removeAttribute('data-sm-bubble-icon')}
  // Reuse an existing decorative badge where present; photographs stay in place.
  var first=head.firstElementChild;
  if(first&&first.getAttribute('aria-hidden')==='true'&&!first.querySelector('img')&&first.textContent.trim().length<=2){
   first.classList.add('sm-bubble-old-icon');
  }
  if(box.getAttribute('aria-label')==='Simply Michigan support center')box.classList.add('sm-bubble-support');
  if(box.style.borderTopWidth==='3px'&&box.querySelector(':scope > [aria-hidden]'))box.classList.add('sm-bubble-benefit');
 }
 function decorate(){
  document.querySelectorAll('.product-details__product-description, .ec-store__category-description, .grid__description, .ins-tile--custom-code, .ins-tile--text, #sm-support .sh-body').forEach(function(root){
   root.querySelectorAll('div[style],section[style],aside[style],details[style]').forEach(function(box){
    if(box.closest('dialog,.sm-upgrade-dialog')||box.matches('.sm-hub-mobile-scroll-hint'))return;
    var style=box.style;
    var notice=parseFloat(style.borderLeftWidth)>=3;
    var benefit=parseFloat(style.borderTopWidth)>=3&&box.querySelector(':scope > [aria-hidden]');
    var trade=box.querySelector(':scope > strong')&&/have a usb hub to trade/i.test(box.querySelector(':scope > strong').textContent);
    if(style.borderRadius&&(notice||benefit||trade||box.getAttribute('role')==='note'||box.getAttribute('aria-label')==='Kit contents'))mark(box);
   });
  });
  document.querySelectorAll('.details-product-options').forEach(function(options){
   // Adjacent backgrounds form a single section without wrappers that could
   // disturb Ecwid's DOM reconciliation, option handlers or validation.
   options.querySelectorAll(':scope > .sm-po-card').forEach(function(card){
    var next=card.nextElementSibling;
    var end=!next||next.classList.contains('sm-po-section-heading')||!next.matches('.sm-po-card');
    card.classList.toggle('sm-po-group-end',end);
   });
  });
 }
 SMI_DOM_RUNNER.add(decorate);
})();

/* Match the simplified Facebook heading's accessible label to its visible text. */
SMI_DOM_RUNNER.add(function(){
 var section=document.getElementById('smi-facebook-section');if(!section)return;
 var heading=section.querySelector('.smi-fb-eyebrow');if(!heading)return;
 var label=heading.querySelector('span:not(.smi-fb-mark)');
 if(label&&!label.querySelector('.smi-fb-heading-line')&&/^Simply Michigan Infotainment on Facebook$/i.test(label.textContent.trim())){
  label.replaceChildren();
  ['Simply Michigan','Infotainment on','Facebook'].forEach(function(text,i){
   if(i)label.appendChild(document.createTextNode(' '));
   var line=document.createElement('span');line.className='smi-fb-heading-line';line.textContent=text;label.appendChild(line);
  });
 }
 heading.id='smi-facebook-label';heading.setAttribute('role','heading');heading.setAttribute('aria-level','2');
 section.setAttribute('aria-labelledby',heading.id);
 var old=section.querySelector('#smi-facebook-title');
 if(old&&old.textContent.trim()==='A little more Simply Michigan.')old.remove();
});

/* SimplyCare uses an inner grid because Safari does not lay out summary children as a grid reliably. */
SMI_DOM_RUNNER.add(function(){
 document.querySelectorAll('.product-details__product-description details').forEach(function(detail){
  var summary=detail.querySelector(':scope > summary');if(!summary||summary.querySelector('.sm-care-layout'))return;
  var title=summary.querySelector(':scope > span:not(.sm-disclosure-preview-row):not(.sm-disclosure-action)');
  if(!title||!/^SimplyCare\+?$/.test(title.textContent.trim()))return;
  var preview=summary.querySelector(':scope > .sm-disclosure-preview-row');
  var action=summary.querySelector(':scope > .sm-disclosure-action');
  if(!preview||!action)return;
  detail.classList.add('sm-care-disclosure');title.classList.add('sm-care-title');
  var layout=document.createElement('span');layout.className='sm-care-layout';
  var copy=document.createElement('span');copy.className='sm-care-copy';
  var frame=document.createElement('span');frame.className='sm-care-image';frame.setAttribute('aria-hidden','true');
  var img=document.createElement('img');img.src='https://nickrams3y.github.io/smi-assets/images/product-upgrades/simplycare-protection.webp';
  img.alt='';img.width=320;img.height=320;img.loading='lazy';img.decoding='async';
  frame.appendChild(img);copy.appendChild(title);copy.appendChild(preview);
  layout.appendChild(frame);layout.appendChild(copy);layout.appendChild(action);summary.appendChild(layout);
  function update(){action.textContent=detail.open?'Click or tap on the card to close':'Click or tap on the card to view more'}
  detail.addEventListener('toggle',update);update();
 });
});

/* Approved compact product promotions; preserve links and the expanded upgrade content. */
SMI_DOM_RUNNER.add(function(){
 var root=document.querySelector('.product-details__product-description');if(!root)return;
 function layout(photo,title,description,action){
  var row=document.createElement('span');row.className='sm-promo-layout';
  photo.classList.add('sm-promo-photo');
  var copy=document.createElement('span');copy.className='sm-promo-copy';
  var heading=document.createElement('strong');heading.className='sm-promo-title';heading.textContent=title;
  var desc=document.createElement('span');desc.className='sm-promo-description';desc.textContent=description;
  copy.append(heading,desc);action.removeAttribute('style');action.classList.add('sm-promo-action');row.append(photo,copy,action);return row;
 }
 root.querySelectorAll('#sm-12-inch-upgrade-ad').forEach(function(card){
  if(card.classList.contains('sm-promo-card'))return;
  var summary=card.querySelector(':scope > summary');if(!summary)return;
  var photo=summary.querySelector('img');if(!photo)return;photo=photo.parentElement;
  var action=document.createElement('span');action.setAttribute('aria-hidden','true');action.textContent='Click or tap on the card to view more';
  summary.replaceChildren(layout(photo,'Upgrading to Sync 3? See the 12" Option.','Available for the F-150 and F-250. Click or tap for more information.',action));
  card.classList.add('sm-promo-card');
  card.addEventListener('toggle',function(){action.textContent=card.open?'Click or tap on the card to close':'Click or tap on the card to view more'});
 });
 root.querySelectorAll('[aria-label="Audio Control Module replacement"]').forEach(function(card){
  if(card.classList.contains('sm-promo-card'))return;
  var photo=card.querySelector('img'),action=card.querySelector('a');if(!photo||!action)return;
  photo=photo.parentElement;action.textContent='Click or tap on the card to view ACM replacements';
  card.replaceChildren(layout(photo,'Need to fix an audio issue?','If your screen works normally but your vehicle has no sound, your audio control module (ACM) may be the cause.',action));
  card.classList.add('sm-promo-card');
 });
});

/* Shorter approved highlight copy, preserving product-specific descriptions. */
SMI_DOM_RUNNER.add(function(){
 document.querySelectorAll('.product-details__product-description [aria-label="Product highlights"] > div').forEach(function(card){
  var copy=card.querySelector(':scope > span:last-child');if(!copy)return;
  var title=copy.querySelector(':scope > strong'),description=copy.querySelector(':scope > span');if(!title||!description)return;
  var heading=title.textContent.trim(),text=description.textContent.trim(),replacement='';
  if(heading==='1 Year Warranty & Free Returns')title.textContent='1 Year Warranty';
  if(heading==='VIN Programmed'&&/include everything your vehicle needs/.test(text))replacement='Programmed to include everything your vehicle needs, including backup cameras, steering wheel controls, climate controls, climate seats and more.';
  if(heading==='Plug & Play'&&/^Easy installation/.test(text))replacement="Easy installation! Plug and play, just swap out the hardware and you're done. No technical knowledge required.";
  if(replacement&&text!==replacement)description.textContent=replacement;
 });
});

/* Shared compact highlights retain each product's original feature copy. */
SMI_DOM_RUNNER.add(function(){
 document.querySelectorAll('.product-details__product-description [aria-label="Product highlights"]').forEach(function(panel){
  var cards=Array.from(panel.children);
  if(cards.length===4&&cards.every(function(card){return card.matches('div')&&card.querySelector(':scope > [aria-hidden="true"]')&&card.querySelector(':scope > span:last-child > strong')&&card.querySelector(':scope > span:last-child > span')}))panel.classList.add('sm-compact-highlights');
 });
});

/* Approved shorter copy for the two standard Sync 3 kits. */
SMI_DOM_RUNNER.add(function(){
 if(!/^\/products\/ford-lincoln-sync-3-apim-and-screen-complete-upgrade-kit-with(?:out)?-navigation\/?$/.test(location.pathname))return;
 var panel=document.querySelector('.product-details__product-description [aria-label="Product highlights"]');
 if(!panel)return;
 var descriptions={
  'Plug & Play':'Swap the hardware. No technical knowledge required.',
  'VIN Programmed':'Configured for your vehicle’s factory features.',
  '1 Year Warranty':'Your order is covered. SimplyCare extension available.',
  'Fully Updated':'Updated to the latest Sync 3.4 software version.'
 };
 var cards=Array.from(panel.children);
 if(cards.length!==4||!cards.every(function(card){var title=card.querySelector(':scope > span:last-child > strong');return title&&descriptions[title.textContent.trim()]}))return;
 panel.classList.add('sm-compact-highlights');
 cards.forEach(function(card){
  var copy=card.querySelector(':scope > span:last-child'),title=copy.querySelector('strong'),description=copy.querySelector(':scope > span');
  var text=descriptions[title.textContent.trim()];if(description&&description.textContent!==text)description.textContent=text;
 });
});

/* Concise feature copy; exact source matches preserve product-specific distinctions. */
SMI_DOM_RUNNER.add(function(){
 var replacements={
  "A complete conversion kit built specifically for 2020–2022 Super Duty trucks equipped with the factory 4\" Sync system.": "For 2020–2022 Super Duty trucks with factory 4\" Sync.",
  "Your authentic Ford OEM Sync 3 APIM is programmed to your VIN before shipping and arrives fully updated.": "Authentic Ford OEM APIM, VIN-programmed and fully updated.",
  "We'll email the custom ACM, FCIM and/or HVAC files needed to complete your conversion with FORScan.": "Custom ACM, FCIM and/or HVAC files emailed. FORScan required.",
  "Applies to everything in your order. Extended coverage is available through SimplyCare or SimplyCare+.": "Your order is covered. SimplyCare or SimplyCare+ extensions available.",
  "A complete conversion kit built specifically for 2019–2023 Rangers equipped with the factory 4\" Sync system.": "For 2019–2023 Rangers with factory 4\" Sync.",
  "Your Gen 4 Sync 3 APIM is programmed to your VIN before shipping and arrives fully updated.": "Gen 4 APIM, VIN-programmed and fully updated.",
  "A complete conversion kit built specifically for 2019–2022 Mustangs equipped with the factory 4\" Sync system.": "For 2019–2022 Mustangs with factory 4\" Sync.",
  "A complete conversion kit built specifically for 2017–2019 F-250s equipped with the factory 4\" Sync system.": "For 2017–2019 F-250s with factory 4\" Sync.",
  "A complete conversion kit built specifically for 2015–2017 F-150s equipped with the factory 4\" Sync system.": "For 2015–2017 F-150s with factory 4\" Sync.",
  "A complete conversion kit built specifically for 2018–2020 F-150s equipped with the factory 4\" Sync system.": "For 2018–2020 F-150s with factory 4\" Sync.",
  "A complete conversion kit built specifically for 2013–2014 F-150s equipped with the factory 4\" Sync system.": "For 2013–2014 F-150s with factory 4\" Sync.",
  "Easy installation! Plug and play, just swap out the hardware and you're done. No technical knowledge required.": "Swap the hardware. No technical knowledge required.",
  "We'll program your new infotainment system for your exact vehicle before it ships.": "Programmed for your exact vehicle before shipping.",
  "Applies to everything in your order. If anything happens, you're covered. Extended warranty with SimplyCare is available.": "Your order is covered. SimplyCare extension available.",
  "Updated to the latest Sync 3.4 software and 2025 maps when the navigation option is selected.": "Latest Sync 3.4; 2025 maps with navigation selected.",
  "Transfer your factory controls, connect the supplied hardware, and you're done. No cutting or permanent modifications are required. We'll also include a plastic pry tool to aid with installation.": "Transfer factory controls. No cutting or permanent modifications.",
  "The supplied hardware handles the required screen resolution settings. FORScan is optional for adjusting appearance settings after installation.": "Screen settings handled automatically. FORScan optional for appearance changes.",
  "Sync 3 works great with your vehicle, keep it! Avoid the drawbacks of upgrading to Sync 4 while retaining the full functionality of your system.": "Keep Sync 3 and your vehicle’s existing features.",
  "Built directly into the hub. No separate dongle or adapter required.": "Built into the hub. No dongle needed.",
  "USB-C PD charging tested at approximately 30W for faster phone charging.": "USB-C PD charging, tested at approximately 30W.",
  "Replace your existing USB hub and reuse your supplied bezel where applicable.": "Swap your hub. Reuse the supplied bezel where applicable.",
  "Two sizes are available to match different Ford and Lincoln vehicles.": "Two sizes for different Ford and Lincoln vehicles.",
  "Programmed to include everything your vehicle needs, including backup cameras, steering wheel controls, climate controls, climate seats and more.": "Configured for your vehicle’s factory features.",
  "Prepared for your compatible vehicle before shipping. Replace the existing APIM and keep your factory 4-inch system.": "Replace your APIM; keep your compatible factory 4-inch system.",
  "Your replacement APIM is programmed for your vehicle using the VIN supplied with your order.": "Programmed for your exact vehicle before shipping.",
  "Designed to replace your original ACM using the factory wiring and connectors.": "Uses your vehicle’s factory wiring and connectors.",
  "We'll use your VIN and original module information to prepare the correct ACM for your vehicle.": "Matched and programmed using your VIN and original ACM details.",
  "Every module is inspected and tested for normal operation before shipment.": "Inspected and tested before shipping."
};
 document.querySelectorAll('.product-details__product-description .sm-compact-highlights > div > span:last-child > span').forEach(function(description){
  var current=description.textContent.trim(),shorter=replacements[current];
  if(shorter&&current!==shorter)description.textContent=shorter;
 });
});

/* Full-card upgrade triggers with a quiet hint in place of the dark button. */
SMI_DOM_RUNNER.add(function(){
 document.querySelectorAll('.product-details__product-description article.sm-upgrade-card').forEach(function(card){
  if(card.classList.contains('sm-tap-upgrade'))return;
  var copy=card.querySelector('.sm-upgrade-card__copy'),button=card.querySelector('button[data-sm-upgrade-open]');if(!copy||!button)return;
  var title=copy.querySelector('strong');if(!title)return;
  var description=document.createElement('span');description.className='sm-upgrade-card__description';
  Array.from(copy.childNodes).forEach(function(node){if(node!==title)description.appendChild(node)});copy.appendChild(description);
  button.textContent='Click or tap on the card to view more';button.setAttribute('aria-label','View details: '+title.textContent.trim());
  card.classList.add('sm-tap-upgrade');
 });
});

/* One disclosure for each product's existing ordering policies; preserve source copy. */
(function(){
 var icons={shield:'<path d="M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6l-8-3Z"/><path d="m8 12 3 3 5-6"/>',box:'<path d="m3 7 9-4 9 4v10l-9 4-9-4V7Zm0 0 9 4 9-4M12 11v10M7 5l10 4"/>',truck:'<path d="M3 5h11v12H3V5Zm11 5h4l3 4v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',returns:'<path d="M3 10a9 9 0 1 1 1 8M3 4v6h6"/>'};
 function icon(name){return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+icons[name]+'</svg>'}
 function title(detail){var s=detail.querySelector(':scope > summary'),t=s&&s.querySelector('.sm-disclosure-title');return (t?t.textContent:s?Array.from(s.childNodes).filter(function(n){return n.nodeType===3}).map(function(n){return n.textContent}).join(' '):'').trim()}
 function body(detail){var clone=detail.cloneNode(true);clone.querySelector('summary').remove();return clone.textContent.replace(/\s+/g,' ').trim()}
 function enhance(){
  var root=document.querySelector('.product-details__product-description');if(!root||root.querySelector('.sm-order-card'))return;
  var names=['Warranty','Processing Time','Shipping','Returns and Cancellations'];
  var all=Array.from(root.querySelectorAll('details'));
  var sources=names.map(function(name){return all.find(function(d){return title(d).toLowerCase()===name.toLowerCase()||(name==='Returns and Cancellations'&&title(d).toLowerCase()==='returns')})});
  var hubPage=location.pathname.replace(/\/$/,'')==='/products/sync-3-usb-hub-with-built-in-wireless-apple-carplay-android-auto-and-pd-30w-fast-charging';
  if(sources.some(function(d){return !d})&&!(hubPage&&sources[2]&&sources[3]))return;
  var texts=sources.map(function(d){return d?body(d):''}),processing=SMI_PROCESSING_POLICY.read(root);
  var estimate=texts[1].match(/\b\d+(?:\s*(?:[-–—]|to)\s*\d+)?\s+business days\b/gi)||[];
  var timeLabel='Processing time',timeNote='See timing below';
  if(processing&&estimate.length===1){timeLabel=estimate[0];timeNote=/[-–—]|\bto\b/.test(timeLabel)?'Typical processing time':'Most orders ship within';if(/Certain configurations may take longer/i.test(texts[1]))timeNote+='; some take longer'}
  else if(processing&&estimate.length>1){timeLabel=estimate[0];timeNote='Allow up to '+estimate[estimate.length-1]}
  var facts=[
   ['shield',/\b(?:1|one) year\b/i.test(texts[0])?'1 year warranty':'Warranty','Hardware coverage'],
   ['box',timeLabel,timeNote],
   ['truck',/free domestic shipping/i.test(texts[2])?'Free shipping':'Shipping',/all 50 states/i.test(texts[2])?'All 50 states':'See shipping details'],
   ['returns',/\b30[ -]day|within 30 days/i.test(texts[3])?'30 day returns':'Returns',/free 30[ -]day domestic returns|prepaid return label at no charge/i.test(texts[3])?'Free domestic returns':'See return details']
  ].filter(function(f,i){return !!sources[i]});
  var card=document.createElement('details');card.className='sm-order-card';
  var summary=document.createElement('summary');summary.className='sm-order-summary';
  summary.innerHTML='<span class="sm-order-badge">'+icon('shield')+'</span><span class="sm-order-heading">Ordering &amp; peace of mind</span><span class="sm-order-intro">Warranty, processing, shipping and returns — all in one place.</span>';
  if(facts.length===2){card.classList.add('sm-order-card--two');summary.querySelector('.sm-order-intro').textContent='Shipping and returns — all in one place.'}
  var highlights=document.createElement('span');highlights.className='sm-order-facts';
  facts.forEach(function(f){var item=document.createElement('span');item.className='sm-order-fact';item.innerHTML=icon(f[0]);var copy=document.createElement('span'),strong=document.createElement('strong'),small=document.createElement('small');strong.textContent=f[1];small.textContent=f[2];copy.append(strong,small);item.append(copy);highlights.append(item)});
  summary.append(highlights);
  var hint=document.createElement('span');hint.className='sm-order-hint';hint.setAttribute('aria-hidden','true');hint.innerHTML='<span>Click or tap to view all details</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';summary.append(hint);
  var full=document.createElement('div');full.className='sm-order-full';
  sources.forEach(function(source,i){
   if(!source)return;
   var section=document.createElement('section');section.className='sm-order-section';var heading=document.createElement('h3');heading.textContent=i===1?'Processing time':i===3?'Returns and cancellations':names[i];section.append(heading);
   Array.from(source.childNodes).forEach(function(n){if(n.nodeType===1&&n.tagName==='SUMMARY')return;section.append(n.cloneNode(true))});
   section.querySelectorAll('[style],[id]').forEach(function(el){el.removeAttribute('style');el.removeAttribute('id')});
   var walker=document.createTreeWalker(section,NodeFilter.SHOW_TEXT),node;while((node=walker.nextNode()))node.nodeValue=node.nodeValue.replace(/30-day/g,'30 day');
   full.append(section);
  });
  var headings=Array.from(root.querySelectorAll('h2,h3'));
  var kitHeading=headings.find(function(heading){return /^kit contents$/i.test(heading.textContent.trim())});
  var contactHeading=headings.find(function(heading){return /^contact us$/i.test(heading.textContent.trim())});
  card.append(summary,full);
  if(kitHeading){
   var kitEnd=kitHeading.nextElementSibling;
   while(kitEnd&&!( /^H[1-6]$/.test(kitEnd.tagName)&&Number(kitEnd.tagName.slice(1))<=Number(kitHeading.tagName.slice(1))))kitEnd=kitEnd.nextElementSibling;
   if(kitEnd)kitEnd.before(card);else kitHeading.parentElement.append(card);
  }else (hubPage?sources.find(function(source){return !!source}):contactHeading||sources.find(function(source){return !!source})).before(card);
  sources.forEach(function(source){if(source){source.classList.add('sm-order-source');source.hidden=true}});
  card.addEventListener('toggle',function(){hint.firstElementChild.textContent=card.open?'Click or tap to close':'Click or tap to view all details'});
 }
 SMI_DOM_RUNNER.add(enhance);
})();

/* Shared platform badges and ordering details follow the shopping flow. */
(function(){
 var mobile=window.matchMedia('(max-width:767px)');
 function arrange(){
  var description=document.querySelector('.product-details__product-description');if(!description)return;
  var product=description.closest('.product-details');if(!product)return;
  var gallery=product.querySelector('.product-details__gallery'),price=product.querySelector('.product-details__product-price-row');
  product.querySelectorAll('.sm-platform-logos').forEach(function(row){if(row.smSourceAnchor&&!description.contains(row.smSourceAnchor))row.remove()});
  var badges=product.querySelector('.sm-platform-logos');
  if(!badges){
   var android=description.querySelector('img[alt="Android Auto"]'),apple=description.querySelector('img[alt="Apple CarPlay"]');
   if(android&&apple&&android.parentElement===apple.parentElement){badges=android.parentElement;badges.smSourceAnchor=document.createComment('Compatibility artwork source');badges.before(badges.smSourceAnchor);badges.classList.add('sm-platform-logos');badges.setAttribute('aria-label','Apple CarPlay and Android Auto compatibility')}
  }
  if(badges&&gallery&&price){
   if(mobile.matches){if(badges.parentElement!==gallery)gallery.appendChild(badges)}
   else if(price.nextElementSibling!==badges)price.after(badges);
  }
  var policies=description.querySelector('.sm-order-card');
  // The hub keeps its explicitly requested position below Contact us.
  var hubPage=/\/products\/sync-3-usb-hub-with-built-in-wireless-apple-carplay-android-auto-and-pd-30w-fast-charging\/?$/.test(location.pathname);
  if(!policies||hubPage)return;
  var panel=description.querySelector('[aria-label="Product highlights"]');
  if(!panel)return;
  // The first product-highlights list precedes installation videos and kit contents.
  var bullets=panel.nextElementSibling;
  while(bullets&&!bullets.matches('ul,ol,h2,h3,section,.sm-video-gallery,iframe,details'))bullets=bullets.nextElementSibling;
  if(bullets&&bullets.matches('ul,ol')&&bullets.nextElementSibling!==policies)bullets.after(policies);
 }
 SMI_DOM_RUNNER.add(arrange);mobile.addEventListener('change',arrange);
})();
