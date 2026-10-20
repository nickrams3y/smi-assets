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
 const help=document.createElement('div');help.className='sm-contact-help';help.innerHTML='<p class="sm-contact-response">We typically reply within 24 hours.</p><div class="sm-contact-shortcuts"><p>Looking for a quick answer?</p><a href="https://simplymichigan.co/upgrade_guide">Upgrade guide <span aria-hidden="true">↗</span></a><a href="https://simplymichigan.co/install">Installation instructions <span aria-hidden="true">↗</span></a><a href="https://support.simplymichigan.co/">Visit our support center <span aria-hidden="true">↗</span></a></div>';intro.append(help);
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
