// Run the production section-boundary code against observed Ecwid option labels.
// This protects native field order while checking where our headings are added.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../site.js'),'utf8');
const fixtures=require('./product-option-fixtures.json');
const start=source.indexOf('let c=4,p=["Vehicle Details","Optional Upgrades"];');
const end=source.indexOf(',i.querySelectorAll(".sm-po-section-heading',start);
assert(start>=0&&end>start,'Section boundary code must be present');
function boundary(path,labels){
 const a=s=>(s||'').replace(/\s+/g,' ').trim().toLowerCase();
 const context={s:path,titles:labels.map(a),a,r:labels.map(textContent=>({querySelector:()=>({textContent})}))};
 vm.runInNewContext(source.slice(start,end)+';result=c;',context);return context.result;
}
for(const f of fixtures){
 const expected=f.labels.findIndex(x=>/extended warranty|upgrade to hd sync 4 display|choose your connectivity upgrade/i.test(x));
 // ACM keeps its optional evidence uploads in Vehicle Details, as approved.
 const intended=f.path.includes('sync-3-usb-hub')?f.labels.findIndex(x=>/^are you trading in/i.test(x)):expected;
 assert.equal(boundary(f.path,f.labels),intended,f.path);
}
const fiesta='/products/ford-sync-3-apim-and-screen-complete-upgrade-kit-for-fiesta-transit';
assert.equal(boundary(fiesta,['APIM','VIN','Extended Warranty Coverage','4" to 8" Conversion Programming','Choose Your Connectivity Upgrade']),2);
assert.equal(boundary(fiesta,['APIM','Model Year','VIN','Extended Warranty Coverage']),3);
assert.equal(boundary(fiesta,['APIM','VIN']),2);
// Register this enhancer without ever replacing the browser's global observer.
const begin=source.indexOf('(()=>{const e=document,t=t=>e.createElement(t),o=/(apim-');
const finish=source.indexOf('/* Keep the complimentary Sync 3.4 USB drive',begin);
assert(begin>=0&&finish>begin);
const NativeObserver=function NativeObserver(){};let registrations=0;
const context={document:{addEventListener(){}},window:{MutationObserver:NativeObserver},SMI_DOM_RUNNER:{add(callback){assert.equal(typeof callback,'function');registrations++}}};
vm.runInNewContext(source.slice(begin,finish),context);
assert.equal(context.window.MutationObserver,NativeObserver);assert.equal(registrations,1);
assert(!source.includes('window.MutationObserver='),'Do not overwrite the native observer');
console.log(`${fixtures.length} product option layouts, 3 Fiesta boundary cases, and native observer isolation passed.`);
