/* Processing-time notice on the active shipping-method step. */
(function(){
 'use strict';
 var id='sm-checkout-processing-note',styleId=id+'-style';
 function mount(){
  var step=document.querySelector('.ec-cart-step--delivery.ec-cart-step--current');
  var title=step&&step.querySelector('.ec-cart-step__title');
  var host=title&&title.parentElement;
  var note=document.getElementById(id);
  document.querySelectorAll('.sm-processing-note-host').forEach(function(el){
   if(el!==host)el.classList.remove('sm-processing-note-host');
  });
  if(!host){if(note)note.remove();return}
  if(!document.getElementById(styleId)){
   var style=document.createElement('style');style.id=styleId;
   style.textContent='.sm-processing-note-host{display:flex;flex-direction:column}'+
    '#'+id+'{order:-1;display:flex;align-items:flex-start;gap:11px;box-sizing:border-box;width:100%;margin:0 0 25px;padding:15px 17px;border:0;border-radius:4px;background:#f4f4f3;color:#4b4b48;font-family:inherit;text-align:left}'+
    '#'+id+' .sm-processing-clock{flex:0 0 19px;width:19px;height:19px;margin-top:2px;color:inherit}'+
    '#'+id+' p{flex:1;min-width:0;margin:0;padding:0;font-family:inherit;font-size:14px!important;font-weight:400;line-height:1.55!important;color:#4b4b48}'+
    '#'+id+' strong{font-size:inherit;font-weight:700;color:#242424}';
   document.head.appendChild(style);
  }
  if(!note){
   note=document.createElement('aside');note.id=id;note.setAttribute('role','note');
   note.innerHTML='<svg class="sm-processing-clock" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>'+
    '<p><strong>Processing time:</strong> Most items require 5 business days before shipping, unless otherwise noted in the product description.</p>';
  }
  host.classList.add('sm-processing-note-host');
  // Append after native children so Elm's child indexes stay intact.
  // CSS places the notice before the title without moving checkout controls.
  if(note.parentElement!==host)host.appendChild(note);
 }
 SMI_DOM_RUNNER.add(mount);
})();
