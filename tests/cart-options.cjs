const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../site.js'),'utf8');
function uniqueMarker(marker) {
 const first=source.indexOf(marker);
 assert(first>=0, 'Missing section marker: '+marker);
 assert.equal(source.lastIndexOf(marker),first,'Duplicate section marker: '+marker);
 return first;
}
const start=uniqueMarker("/* Keep cart summaries consistent without moving Ecwid's managed option nodes. */");
const end=uniqueMarker('/* Style the native account flow and route each parcel using its own displayed number. */');
assert(end>start,'Cart summary must precede account flow');
assert.equal(source.indexOf('\n/* ',start)+1,end,'Review cart test boundaries after inserting a section');
const cartSummary=new vm.Script(source.slice(start,end),{filename:'site.js',lineOffset:source.slice(0,start).split('\n').length-1});
function run(labels){
 const rows=labels.map(label=>({label,value:'original selection',dataset:{},querySelector:()=>({textContent:label+':'})}));
 const options={classList:{add(){}},querySelectorAll:()=>rows};
 cartSummary.runInNewContext({document:{querySelectorAll:()=>[options]},SMI_DOM_RUNNER:{add:f=>f()}});
 assert(rows.every(r=>/^[0-4]$/.test(r.dataset.smCartOrder)),'All option rows must receive a rank');
 assert.deepEqual(rows.map(r=>r.label),labels,'Native order must not change');
 assert(rows.every(r=>r.value==='original selection'),'Selections must not change');
 return rows.map((r,i)=>({...r,index:i})).sort((a,b)=>Number(a.dataset.smCartOrder)-Number(b.dataset.smCartOrder)||a.index-b.index).map(r=>r.label);
}
assert.deepEqual(run(['Extended Warranty Coverage','Choose Your Connectivity Upgrade','Vehicle Model','Model Year','VIN','Choose Your Display']),['Vehicle Model','Model Year','VIN','Choose Your Display','Extended Warranty Coverage','Choose Your Connectivity Upgrade']);
assert.deepEqual(run(['VIN','Model','Model Year','Does your vehicle have SiriusXM?','Extended Warranty Coverage']),['Model','Model Year','VIN','Does your vehicle have SiriusXM?','Extended Warranty Coverage']);
assert.deepEqual(run(['Sync 3 Software Build','Vehicle Model Year','APIM Type']),['Vehicle Model Year','Sync 3 Software Build','APIM Type']);
assert.deepEqual(run(['Truck Model','Model Year','VIN','Choose Your Upgrade Path']),['Truck Model','Model Year','VIN','Choose Your Upgrade Path']);
console.log('4 cart option sequences passed; native field order and selections unchanged.');
