/* Simply Michigan AI support launcher. Load the chat only after a visitor opens it. */
(function(){'use strict';
 if(window.SMI_CHAT_WIDGET)return;
 var chatURL='https://simply-michigan-support.s98wfrdp7b.workers.dev/',chatOrigin=new URL(chatURL).origin;
 var icon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M5 4h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-6 4V6a2 2 0 0 1 2-2Z"/><path d="M7 9h10M7 13h6"/></svg>';
 var style=document.createElement('style');style.id='smi-chat-widget-style';style.textContent=`
 .smi-ai-launcher,.smi-ai-open{font-family:inherit;line-height:1.3;display:inline-flex;align-items:center;justify-content:center;gap:9px;background:#315b40;color:#fff!important;border:1px solid #315b40;border-radius:999px;padding:13px 20px;min-height:48px;text-decoration:none!important;box-sizing:border-box;cursor:pointer}
 .smi-ai-launcher{position:fixed;right:20px;bottom:96px;z-index:1000;box-shadow:0 3px 14px #16372326;font-size:14px;font-weight:600}
 .smi-ai-launcher[hidden]{display:none}.smi-ai-launcher svg,.smi-ai-card-icon svg{width:21px;height:21px;flex-shrink:0}.smi-ai-launcher:hover,.smi-ai-open:hover{background:#244a31}
 .smi-ai-launcher:focus-visible,.smi-ai-open:focus-visible,.smi-ai-dialog a:focus-visible{outline:3px solid #f36b32;outline-offset:3px}
 .smi-ai-dialog-bar:focus{outline:none}
 .smi-ai-dialog .smi-ai-close:focus-visible{outline:2px solid #315b40;outline-offset:-3px}
 .smi-ai-card{display:flex;align-items:center;gap:18px;margin:0 0 26px;padding:24px 28px;border:1px solid #d6e0d4;border-radius:16px;background:#f3f6f1;text-align:left;font-family:inherit;box-sizing:border-box}
 .smi-ai-card-icon{display:flex;align-items:center;justify-content:center;flex-shrink:0;width:46px;height:46px;border-radius:12px;background:#e4ede2;color:#315b40}
 :is(#sm-support, .sm-contact-intro) .smi-ai-card h2{margin:0 0 6px;font-size:20px;line-height:1.3;color:#253a2b;font-weight:650;letter-spacing:-.3px}:is(#sm-support, .sm-contact-intro) .smi-ai-card p{margin:0;font-size:14px;line-height:1.5;color:#555f55}.smi-ai-card-copy{flex:1}.smi-ai-open{border-radius:10px;white-space:nowrap;font-size:14px;font-weight:600}
 .smi-ai-dialog{box-sizing:border-box;position:fixed;inset:auto 20px 20px auto;margin:0;padding:0;width:min(520px,calc(100vw - 32px));height:min(780px,calc(100dvh - 40px));max-width:none;max-height:none;border:1px solid #cbd5c8;border-radius:18px;box-shadow:0 14px 60px #0004;overflow:hidden;background:#f5f5f2;color:#202820;font-family:inherit}
 .smi-ai-dialog[open]{display:flex;flex-direction:column}.smi-ai-dialog::backdrop{background:#15221940}.smi-ai-dialog-bar{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:6px 8px 6px 16px;border-bottom:1px solid #dce2d8;background:#fff;flex-shrink:0}.smi-ai-dialog-bar a{font-size:12px;color:#315b40;text-decoration:underline}.smi-ai-close{width:44px;height:44px;display:flex;align-items:center;justify-content:center;border:0;background:transparent;color:#334235;border-radius:8px;cursor:pointer}.smi-ai-close:hover{background:#edf2e9}.smi-ai-close svg{width:22px;height:22px}.smi-ai-frame{display:block;width:100%;flex:1;min-height:0;border:0;background:#f5f5f2}
 @media(max-width:600px){.smi-ai-launcher{right:16px;bottom:70px;min-height:44px;padding:11px 17px;font-size:13px}.smi-ai-card{padding:18px;gap:12px;flex-wrap:wrap;border-radius:14px}.smi-ai-card-icon{width:38px;height:38px}.smi-ai-card-copy{flex:1;min-width:190px}:is(#sm-support, .sm-contact-intro) .smi-ai-card h2{font-size:18px}:is(#sm-support, .sm-contact-intro) .smi-ai-card p{font-size:14px}.smi-ai-open{width:100%;min-height:44px}.smi-ai-dialog{inset:8px;width:calc(100vw - 16px);height:calc(100dvh - 16px);border-radius:14px}.smi-ai-dialog-bar{padding-block:2px}}
 #smi-ai-contact-card{display:grid;grid-template-columns:auto minmax(0,1fr);grid-column:1/-1;align-items:start;gap:12px;margin:0;padding:16px}
 #smi-ai-contact-card .smi-ai-card-icon{width:36px;height:36px}
 #smi-ai-contact-card .smi-ai-card-copy{min-width:0}
 #smi-ai-contact-card h2{font-size:18px}
 #smi-ai-contact-card .smi-ai-open{grid-column:1/-1;width:100%;min-height:44px}
 .sm-contact-description:has(+ #smi-ai-contact-card) p:has(> a[href="${chatURL}"]:only-child){display:none}
 `;document.head.append(style);
 var launcher=document.createElement('a');launcher.className='smi-ai-launcher';launcher.href=chatURL;launcher.target='_blank';launcher.rel='noopener';launcher.setAttribute('aria-haspopup','dialog');launcher.setAttribute('aria-controls','smi-ai-dialog');launcher.setAttribute('aria-expanded','false');launcher.innerHTML=icon+'<span>AI Support</span>';document.body.append(launcher);
 var dialog,frame,previousFocus,savedOverflow,resizeObserver,observedContacts,scheduled=false;
 function sizePanel(){if(!dialog?.open)return;if(matchMedia('(max-width:600px)').matches){var v=window.visualViewport;dialog.style.top=((v?.offsetTop||0)+8)+'px';dialog.style.height=Math.max(160,(v?.height||innerHeight)-16)+'px';dialog.style.bottom='auto'}else{dialog.style.top='';dialog.style.height='';dialog.style.bottom=''}}
 function close(){if(!dialog?.open)return;dialog.close();document.body.style.overflow=savedOverflow;launcher.setAttribute('aria-expanded','false');previousFocus?.isConnected&&previousFocus.focus({preventScroll:true});}
 function open(event){if(event){if(event.button>0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault()}previousFocus=event?.currentTarget || document.activeElement;if(!dialog){dialog=document.createElement('dialog');dialog.id='smi-ai-dialog';dialog.className='smi-ai-dialog';dialog.setAttribute('aria-label','Simply Michigan AI support');dialog.innerHTML='<div class="smi-ai-dialog-bar" tabindex="-1"><a href="'+chatURL+'" target="_blank" rel="noopener noreferrer">Open in a full page</a><button class="smi-ai-close" type="button" aria-label="Close AI chat"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button></div>';frame=document.createElement('iframe');frame.className='smi-ai-frame';frame.title='Simply Michigan AI support assistant';frame.referrerPolicy='no-referrer';frame.src=chatURL;dialog.append(frame);document.body.append(dialog);dialog.querySelector('button').onclick=close;
   // WebKit can keep the page inert until it dispatches the native close event.
   dialog.addEventListener('close', () => requestAnimationFrame(() => {
     if (!dialog.open && document.activeElement === document.body && previousFocus?.isConnected) {
       previousFocus.focus({preventScroll:true});
     }
   }));
   dialog.addEventListener('cancel',e=>{e.preventDefault();close()});dialog.addEventListener('click',e=>{if(e.target===dialog){var r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close()}})}if(dialog.open)return;savedOverflow=document.body.style.overflow;document.body.style.overflow='hidden';dialog.showModal();launcher.setAttribute('aria-expanded','true');sizePanel();
   // Pointer users see the toolbar without a ring. Enter moves focus to Close.
   const initialFocus = event?.detail > 0 ? '.smi-ai-dialog-bar' : '.smi-ai-close';
   dialog.querySelector(initialFocus).focus({preventScroll:true});
 }
 launcher.addEventListener('click',open);
 window.addEventListener('message',e=>{if(e.origin===chatOrigin&&e.source===frame?.contentWindow&&e.data?.type==='smi-chat-close')close()});
 function createCard(page){
  const card=document.createElement('section');
  const titleId='smi-ai-'+page+'-title';
  card.id='smi-ai-'+page+'-card';
  card.className='smi-ai-card';
  card.setAttribute('aria-labelledby',titleId);
  card.innerHTML='<div class="smi-ai-card-icon">'+icon+'</div><div class="smi-ai-card-copy"><h2 id="'+titleId+'">Ask our AI support assistant</h2><p>Find the right part or troubleshoot your Sync system.</p></div><a class="smi-ai-open" href="'+chatURL+'" target="_blank" rel="noopener" aria-haspopup="dialog" aria-controls="smi-ai-dialog">Open chat</a>';
  card.querySelector('a').addEventListener('click',open);
  return card;
 }
 function position(){scheduled=false;var contacts=document.getElementById('tile-contacts-widget');if(contacts!==observedContacts){resizeObserver?.disconnect();observedContacts=contacts;if(contacts&&window.ResizeObserver){resizeObserver=new ResizeObserver(queue);resizeObserver.observe(contacts)}}var rect=contacts?.getBoundingClientRect(),visible=rect&&rect.height>0&&rect.bottom>0&&getComputedStyle(contacts).visibility!=='hidden';launcher.hidden=!!(visible&&rect.height>110);var bottom=visible?Math.max(16,innerHeight-rect.top+12):20;var value=bottom+'px';if(launcher.style.bottom!==value)launcher.style.bottom=value;
 const quick=document.querySelector('#sm-support .sh-hero + .sh-quick');
 if(quick && !document.getElementById('smi-ai-support-card')) quick.before(createCard('support'));
 const description=document.querySelector('.sm-contact-description');
 if(description?.querySelector('a[href="'+chatURL+'"]') && !document.getElementById('smi-ai-contact-card')) description.after(createCard('contact'));
 }
 function queue(){if(!scheduled){scheduled=true;requestAnimationFrame(position)}}
 new MutationObserver(queue).observe(document.body,{childList:true,subtree:true});window.addEventListener('resize',()=>{queue();sizePanel()});window.visualViewport?.addEventListener('resize',sizePanel);window.visualViewport?.addEventListener('scroll',sizePanel);window.addEventListener('hashchange',queue);queue();
 window.SMI_CHAT_WIDGET={open,close};
})();
