/* Set PayPal's background before Ecwid measures it and chooses the message text color. */
/* Runs in the head before product markup is painted; do not defer this small bootstrap. */
(()=>{const s=document.createElement("style");s.id="sm-product-loading-style";s.textContent='#tile-product-details #ecwid-paypal-pay-later-product-message{background:#173b63!important}#tile-product-details div.ecwid-productBrowser{background:#fff!important}html.sm-product-pending #tile-product-details .product-details__sidebar>*{visibility:hidden!important}html.sm-product-pending #tile-product-details .product-details__product-description .sm-platform-logos{display:none!important}';document.head.appendChild(s)})();
(()=>{if(window.SMI_PRODUCT_BOOT)return;let r=document.documentElement,t,p,f=false,c='sm-product-pending';function end(){clearTimeout(t);clearInterval(p);f=false;r.classList.remove(c)}function check(){if(f&&getComputedStyle(r).getPropertyValue('--sm-product-layout-styles').trim()==='1')end()}function begin(){end();r.classList.add(c);t=setTimeout(end,6000);p=setInterval(check,50)}window.SMI_PRODUCT_BOOT={begin,cancel:end,finish(){if(r.classList.contains(c)){f=true;check()}}};if(/^\/products(?:\/|$)/.test(location.pathname))begin();addEventListener('pageshow',e=>{if(e.persisted)end()})})();

/* Enable contact placeholders before the first paint. Restore the native link
   and phone note if the contact or chat script takes too long to load. */
if (/^\/(?:en\/)?contact-us\/?$/.test(location.pathname)) {
  const root = document.documentElement;
  root.classList.add('sm-contact-loading');
  setTimeout(() => root.classList.remove('sm-contact-loading'), 5000);
}
