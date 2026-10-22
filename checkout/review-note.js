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
