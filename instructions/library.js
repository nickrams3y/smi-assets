
(async function(){
 var root=document.getElementById('sm-install-library');if(!root||root.dataset.initialized)return;root.dataset.initialized='true';
 var all;try{var response=await fetch(root.dataset.source,{cache:'no-cache'});if(!response.ok)throw new Error('Unavailable');all=await response.json();if(!Array.isArray(all))throw new Error('Invalid catalog')}catch(error){root.querySelector('.sm-il-loading').textContent='The instruction library could not load. Please refresh the page or contact us for your guide.';return}
 root.innerHTML="\n <div class=\"sm-il-preview\" hidden><strong>Layout preview.</strong> Product groups below are draft placeholders. PDF files and guide-to-product matches have not been added yet.</div>\n <div class=\"sm-il-toolbar\">\n  <label for=\"sm-il-search\">Find your instructions</label>\n  <input id=\"sm-il-search\" type=\"search\" placeholder=\"Search by product, vehicle or screen size\" autocomplete=\"off\" aria-controls=\"sm-il-results\">\n  <p class=\"sm-il-hint\">Choose the guide for your product. Open a PDF to view it, or download a copy to keep.</p>\n  <div class=\"sm-il-filters\" role=\"group\" aria-label=\"Filter instructions by product type\"></div>\n </div>\n <p class=\"sm-il-status\" role=\"status\" aria-live=\"polite\"></p>\n <div id=\"sm-il-results\" class=\"sm-il-grid\"></div>\n <div class=\"sm-il-empty\" hidden></div>\n <div class=\"sm-il-help\"><div><strong>Not sure which instructions you need?</strong><p>Send us your order number and vehicle details, and we\u2019ll help you find the right guide.</p></div><a href=\"https://simplymichigan.co/contact-us\">Contact us \u2192</a></div>\n <noscript><p>Please enable JavaScript to browse the instruction library, or <a href=\"https://simplymichigan.co/contact-us\">contact us for your guide</a>.</p></noscript>\n \n";
 var preview=false,selected='All guides';
 function safeURL(value){try{var u=new URL(value);return u.protocol==='https:'?u.href:null}catch(e){return null}}
 var guides=all.map(function(g){return Object.assign({},g,{files:(g.files||[]).filter(function(f){return safeURL(f.url)})})}).filter(function(g){return preview||g.files.length});
 var grid=root.querySelector('.sm-il-grid'),search=root.querySelector('input'),status=root.querySelector('.sm-il-status'),empty=root.querySelector('.sm-il-empty'),filters=root.querySelector('.sm-il-filters');
 root.querySelector('.sm-il-preview').hidden=!preview;
 function make(tag,cls,text){var e=document.createElement(tag);if(cls)e.className=cls;if(text)e.textContent=text;return e}
 function normalize(s){return String(s).toLowerCase().replace(/[–—-]/g,'').replace(/[^a-z0-9]+/g,' ').trim()}
 var categories=['All guides'].concat(Array.from(new Set(guides.map(function(g){return g.category}))));
 categories.forEach(function(c){var b=make('button','sm-il-filter',c);b.type='button';b.setAttribute('aria-pressed',String(c===selected));b.addEventListener('click',function(){selected=c;render()});filters.append(b)});
 function render(){
  var words=normalize(search.value).split(' ').filter(Boolean);
  var shown=guides.filter(function(g){var hay=normalize([g.title,g.subtitle,g.category,g.keywords].join(' '));return(selected==='All guides'||g.category===selected)&&words.every(function(w){return hay.includes(w)})});
  Array.prototype.forEach.call(filters.children,function(b){b.setAttribute('aria-pressed',String(b.textContent===selected))});grid.replaceChildren();
  status.textContent=shown.length+' '+(preview?'product group':'guide group')+(shown.length===1?'':'s')+(words.length?' found':'');
  empty.hidden=shown.length>0;empty.textContent=guides.length?'No matching guides. Try a product name, such as APIM, or a vehicle model and year.':'The instruction library is being prepared. Please contact us for the instructions for your order.';
  shown.forEach(function(g){
   var card=make('article','sm-il-card'),top=make('div','sm-il-card-top'),icon=make('span','sm-il-icon','PDF');icon.setAttribute('aria-hidden','true');top.append(icon,make('span','sm-il-category',g.category));card.append(top,make('h2','',g.title),make('p','sm-il-subtitle',g.subtitle));
   var files=make('div','sm-il-files');
   if(!g.files.length)card.append(make('div','sm-il-pending','PDF not added yet'));
   g.files.forEach(function(f){
    var file=make('div','sm-il-file'),actions=make('div','sm-il-actions'),view=make('a','sm-il-view','View PDF ↗'),download=make('button','sm-il-download','Download'),error=make('p','sm-il-error');error.setAttribute('role','status');error.hidden=true;
    view.href=safeURL(f.url);view.target='_blank';view.rel='noopener noreferrer';view.setAttribute('aria-label','View '+g.title+' — '+f.label+' PDF (opens a new tab)');
    download.type='button';download.setAttribute('aria-label','Download '+g.title+' — '+f.label+' PDF');
    download.addEventListener('click',async function(){download.disabled=true;download.textContent='Downloading…';error.hidden=true;try{
     var response=await fetch(view.href);if(!response.ok)throw new Error('Unavailable');var blob=await response.blob();
     var signature=await blob.slice(0,5).text();if(signature!=='%PDF-')throw new Error('Not a PDF');
     var url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=g.id+'-'+String(f.label).toLowerCase().replace(/[^a-z0-9]+/g,'-')+'.pdf';a.hidden=true;document.body.append(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url)},60000);
    }catch(e){error.textContent='Use “View PDF” to open the guide, then save it from your browser.';error.hidden=false}finally{download.disabled=false;download.textContent='Download'}});
    file.append(make('span','sm-il-file-label',f.label));actions.append(view,download);file.append(actions,error);files.append(file)
   });card.append(files);grid.append(card)
  })
 }
 search.addEventListener('input',render);render();
})();
