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
 const buttonText=form.querySelector('button[id$="-submit-button"] span.leading-5');
 if(buttonText&&buttonText.textContent==='Submit')buttonText.textContent='Send message';
 if(form.dataset.smContactDesign)return;
 const grid=form.closest('.section__grid'),content=grid?.closest('.section__content'),intro=grid?.querySelector('h1')?.closest('.order-1');
 if(!grid||!content||!intro)return;
 form.dataset.smContactDesign='20261019';form.classList.add('sm-contact-form');
 grid.classList.add('sm-contact-layout');content.classList.add('sm-contact-content');content.parentElement.classList.add('sm-contact-spacing');intro.classList.add('sm-contact-intro');form.parentElement.classList.add('sm-contact-form-column');
 const heading=intro.querySelector('h1'),description=intro.querySelector('h1')?.parentElement.nextElementSibling;
 heading.textContent='Let’s get you connected.';
 if(description){description.classList.add('sm-contact-description');description.querySelector('p').textContent='Questions about your vehicle, help with an order, or something else? Send us a message.';}
 const eyebrow=document.createElement('p');eyebrow.className='sm-contact-eyebrow';eyebrow.textContent='Here to help';heading.before(eyebrow);
 const help=document.createElement('div');help.className='sm-contact-help';help.innerHTML='<p class="sm-contact-response">We typically reply within 24 hours.</p><div class="sm-contact-shortcuts"><p>Looking for a quick answer?</p><a href="https://simplymichigan.co/install">Installation instructions <span aria-hidden="true">↗</span></a><a href="https://support.simplymichigan.co/">Visit our support center <span aria-hidden="true">↗</span></a></div>';intro.append(help);
 const title=document.createElement('div');title.className='sm-contact-form-heading';title.innerHTML='<h2>Send us a message</h2><span>* Required</span>';form.prepend(title);
 const fields=[['name','Your name','First and last name'],['email','Email address','you@example.com'],['additionalNote','Order number (optional)','SM1234'],['message','How can we help?','Tell us what’s going on. For vehicle questions, include the year and model.']];
 fields.forEach(([suffix,labelText,placeholder])=>{const input=form.querySelector('[id$="-'+suffix+'"]');if(!input)return;const field=input.parentElement;field.dataset.smContactField=suffix;if(input.required)field.dataset.smContactRequired='true';const label=field.querySelector('label');if(label)label.textContent=labelText;input.placeholder=placeholder;});
 const submit=form.querySelector('button[id$="-submit-button"]');
 if(submit){submit.parentElement.dataset.smContactActions='true';const text=submit.querySelector('span.leading-5');if(text)text.textContent='Send message';
 const note=document.createElement('div');note.className='sm-contact-photo-note';note.innerHTML='<strong>Need to send a photo or proof for a military discount?</strong><p>You can attach it when you reply to our email.</p>';submit.parentElement.before(note);}
 if(!document.getElementById('sm-contact-design-style')){const style=document.createElement('style');style.id='sm-contact-design-style';style.textContent=`
.sm-contact-content{max-width:1080px!important;width:100%!important}
.sm-contact-spacing{margin-top:52px!important;margin-bottom:56px!important}
.sm-contact-layout{display:grid!important;grid-template-columns:minmax(220px,.8fr) minmax(0,1.55fr)!important;gap:48px!important;align-items:start!important;color:#252728}
.sm-contact-layout>.sm-contact-intro,.sm-contact-layout>.sm-contact-form-column{grid-column:auto!important;min-width:0;margin:0!important}
.sm-contact-intro h1{font-size:38px!important;line-height:1.14!important;letter-spacing:-1px!important;font-weight:700!important;text-align:left!important;color:#252728!important}
.sm-contact-intro .section__grid{gap:16px!important}
.sm-contact-eyebrow{font-size:11px;letter-spacing:1.7px;text-transform:uppercase;font-weight:700;color:#666966;margin:0 0 12px}
.sm-contact-description p{font-size:15px!important;line-height:1.65!important;color:#666966!important;text-align:left!important;margin:0!important}
.sm-contact-response{font-size:13px;line-height:1.5;color:#666966;margin:22px 0 0}
.sm-contact-shortcuts{border-top:1px solid #dedfda;margin-top:28px;padding-top:22px;font-size:13px;line-height:1.6}
.sm-contact-shortcuts p{color:#666966;margin:0 0 12px}
.sm-contact-shortcuts a{display:block;width:fit-content;margin:10px 0;color:#252728!important;font-weight:600;text-decoration:underline!important;text-underline-offset:4px}
.sm-contact-form{box-sizing:border-box;background:#fff;border:1px solid #dedfda;border-radius:16px;padding:28px;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);column-gap:18px;color:#252728}
.sm-contact-form>*{grid-column:1/-1;min-width:0}
.sm-contact-form .sm-contact-form-heading{display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin-bottom:25px;order:-2}
.sm-contact-form-heading h2{font-size:20px!important;font-weight:600!important;line-height:1.3!important;letter-spacing:-.3px;color:#252728!important;margin:0}
.sm-contact-form-heading>span{font-size:11px;color:#666966;white-space:nowrap}
.sm-contact-form [data-sm-contact-field="name"],.sm-contact-form [data-sm-contact-field="email"]{grid-column:auto}
.sm-contact-form [data-sm-contact-field]{margin:0 0 20px!important}
.sm-contact-form [data-sm-contact-field] label{font-size:13px!important;line-height:1.45!important;font-weight:600!important;color:#252728!important;margin-bottom:8px}
.sm-contact-form [data-sm-contact-required] label:after{content:' *'}
[data-sm-contact-field]>div:first-child>span{display:none!important}
.sm-contact-form [data-sm-contact-field] input,.sm-contact-form [data-sm-contact-field] textarea{box-sizing:border-box;width:100%;border:1px solid #dedfda!important;border-radius:7px!important;background:#fff!important;color:#252728!important;padding:12px!important;font-family:inherit!important;font-size:16px!important;line-height:1.45!important;font-style:normal!important;box-shadow:none!important}
.sm-contact-form [data-sm-contact-field] input::placeholder,.sm-contact-form [data-sm-contact-field] textarea::placeholder{color:#747873!important;opacity:1!important;font-style:normal!important}
.sm-contact-form [data-sm-contact-field] textarea:not([hidden]){height:128px!important;min-height:128px!important;resize:vertical}
.sm-contact-form [data-sm-contact-field] input:focus-visible,.sm-contact-form [data-sm-contact-field] textarea:focus-visible,.sm-contact-form button:focus-visible{outline:2px solid #777f79!important;outline-offset:3px!important}
[data-sm-contact-field="additionalNote"]{max-width:240px}
.sm-contact-photo-note{background:#f7f7f5;border:1px solid #e5e5e1;border-radius:9px;padding:15px 16px;font-size:13px;line-height:1.55;color:#60655f}
.sm-contact-photo-note strong{display:block;font-size:13px;color:#353a35;font-weight:600}
.sm-contact-photo-note p{margin:4px 0 0}
.sm-contact-form [data-sm-contact-actions]{display:block!important;margin:22px 0 0!important}
[data-sm-contact-actions] button[id$='-submit-button']{width:100%!important;height:auto!important;min-height:48px;border-radius:8px!important;padding:13px 18px!important;background:#242726!important;color:#fff!important}
[data-sm-contact-actions] button[id$='-submit-button'] span{filter:none!important;font-size:15px!important;line-height:1.5!important;font-weight:600!important;color:#fff!important;margin:0!important}
[data-sm-contact-actions] p{font-family:inherit!important;font-size:11px!important;line-height:1.6!important;text-align:center;color:#666966!important;margin:10px 0 0!important}
[data-sm-contact-actions] p:empty{display:none}
.sm-contact-form .sm-attached-results{order:-1;background:#eef7f0;border:0;border-radius:8px;padding:14px;margin:0 0 22px;color:#276344}
.sm-contact-form .sm-attached-heading{gap:8px;align-items:center}
.sm-contact-form .sm-attached-heading>span{width:20px;height:20px}
.sm-contact-form .sm-attached-heading strong{font-size:14px;line-height:1.4}
.sm-contact-form .sm-attached-results p,.sm-contact-form .sm-attached-results summary,.sm-contact-form .sm-attached-results button{font-size:12px;line-height:1.5}
.sm-contact-form .sm-attached-results p{margin:7px 0 9px}
.sm-contact-form .sm-attached-results button{min-height:36px;padding:5px 10px}
@media(max-width:760px){
.sm-contact-spacing{margin-top:30px!important;margin-bottom:36px!important}
.sm-contact-layout{grid-template-columns:minmax(0,1fr)!important;gap:26px!important}
.sm-contact-intro h1{font-size:32px!important;max-width:400px}
.sm-contact-intro .section__grid{gap:12px!important}
.sm-contact-response{margin-top:14px}
.sm-contact-shortcuts{display:none}
.sm-contact-form{padding:22px}
}
@media(max-width:480px){.sm-contact-form{padding:19px;grid-template-columns:minmax(0,1fr)}[data-sm-contact-field="additionalNote"]{max-width:none}.sm-contact-form-heading h2{font-size:18px!important}.sm-contact-intro h1{font-size:30px!important}}
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
if(typeof SMI_DOM_RUNNER!=='undefined')SMI_DOM_RUNNER.add(mount);else mount();
})();
