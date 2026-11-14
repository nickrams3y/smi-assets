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
 // Desktop resources mirror the Ecwid-authored links; mobile keeps the native order.
 const resourceLinks=description?Array.from(description.querySelectorAll('p > a')):[];
 const resourceHeading=description?Array.from(description.querySelectorAll('p')).find(p=>p.textContent.trim()==='Looking for a quick answer?'):null;
 if(resourceHeading&&resourceLinks.length===4){
  const resources=document.createElement('nav');resources.className='sm-contact-resources';resources.setAttribute('aria-label','Quick answers');
  const resourceTitle=document.createElement('h2');resourceTitle.textContent=resourceHeading.textContent;resources.append(resourceTitle);
  resourceLinks.forEach(link=>resources.append(link.cloneNode(true)));
  form.before(resources);
 }
 const title=document.createElement('div');title.className='sm-contact-form-heading';title.innerHTML='<h2>Send us a message</h2><span>* Required</span>';form.prepend(title);
 // Copy and placeholders live in Ecwid, so the first render matches the enhanced form.
 ['name','email','additionalNote','message'].forEach(suffix=>{const input=form.querySelector('[id$="-'+suffix+'"]');if(!input)return;const field=input.parentElement;field.dataset.smContactField=suffix;if(input.required)field.dataset.smContactRequired='true';});
 const submit=form.querySelector('button[id$="-submit-button"]');
 if(submit)submit.parentElement.dataset.smContactActions='true';
 const photoNote=native.parentElement.querySelector(':scope > div.mt-2');
 if(photoNote)photoNote.classList.add('sm-contact-photo-note');
 /* Contact styles live in site.css so they apply before this enhancer runs. */
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
