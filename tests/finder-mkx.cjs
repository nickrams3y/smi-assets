const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const source = fs.readFileSync(process.argv[2] || path.join(__dirname, '../site.js'), 'utf8');
// Execute the production tables and recommendation handlers, with only UI rendering stubbed.
const tables = source.slice(source.indexOf('var D={Ford:'), source.indexOf('/* Product-card presentation'));
const helpers = source.slice(source.indexOf('function display(a,v)'), source.indexOf('var HKEY='));
const handlers = [...source.matchAll(/f\.addEventListener\("submit",function\(e\)\{([\s\S]*?)\n \}\);/g)];
assert.equal(handlers.length, 2);
let checks = 0;
for (const route of ['home', 'guide', 'upgrades', 'apims']) {
 for (const [make, model, year] of [['Lincoln','MKX',2015],['Lincoln','MKX',2016],['Lincoln','MKX',2017],['Ford','Fusion',2016],['Lincoln','MKZ',2016]]) {
  for (const system of ['8', '3', 'u']) {
   let result;
   const context = { b:{value:make},m:{value:model},y:{value:String(year)},s:{value:system},
    isApim:route==='apims',key:()=>model,has12:()=>false,
    show:(title,description,links)=>{result={title,description,links:links||[]}} };
   vm.createContext(context);
   vm.runInContext(tables + helpers + '\nvar V=F;function base(){return F[b.value][m.value]}', context);
   vm.runInContext('(function(e){'+handlers[route==='home'?0:1][1]+'})({preventDefault(){}})',context);
   assert.ok(result, `${route} ${model} ${year} ${system}`);
   const urls = result.links.map(x=>x[1]);
   if(system==='8' && year<=2016){
    assert.ok(urls.includes(context.U.n) && urls.includes(context.U.y), 'Sync 2 needs both complete kits');
    assert.ok(!urls.includes(context.U.an) && !urls.includes(context.U.ax), 'APIM alone cannot upgrade Sync 2');
    if(model==='MKX' && route!=='apims')assert.match(result.description,/recessed display/);
   } else if(system==='3'){
    assert.ok(urls.includes(context.U.an) && urls.includes(context.U.ax), 'Sync 3 keeps APIM replacement choices');
    assert.ok(!urls.includes(context.U.n) && !urls.includes(context.U.y), 'Sync 3 must not receive a Sync 2 conversion');
    if(model==='MKX' && route!=='apims')assert.ok(urls.includes(context.U.dr));
   } else {
    assert.ok(urls.includes(context.U.c), 'Uncertain systems or unsupported Sync 2 years need verification');
    assert.ok(!urls.includes(context.U.n));
   }
   checks++;
  }
 }
}
console.log(`${checks} recommendation cases passed across all four finder locations.`);
