const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../site.js'),'utf8');
const start=source.indexOf('/* Keep cart summaries consistent without moving Ecwid');assert(start>=0);
function run(labels){
 const rows=labels.map(label=>({label,value:'original selection',dataset:{},querySelector:()=>({textContent:label+':'})}));
 const options={classList:{add(){}},querySelectorAll:()=>rows};
 vm.runInNewContext(source.slice(start),{document:{querySelectorAll:()=>[options]},SMI_DOM_RUNNER:{add:f=>f()}});
 assert.deepEqual(rows.map(r=>r.label),labels,'Native order must not change');
 assert(rows.every(r=>r.value==='original selection'),'Selections must not change');
 return rows.map((r,i)=>({...r,index:i})).sort((a,b)=>Number(a.dataset.smCartOrder)-Number(b.dataset.smCartOrder)||a.index-b.index).map(r=>r.label);
}
assert.deepEqual(run(['Extended Warranty Coverage','Choose Your Connectivity Upgrade','Vehicle Model','Model Year','VIN','Choose Your Display']),['Vehicle Model','Model Year','VIN','Choose Your Display','Extended Warranty Coverage','Choose Your Connectivity Upgrade']);
assert.deepEqual(run(['VIN','Model','Model Year','Does your vehicle have SiriusXM?','Extended Warranty Coverage']),['Model','Model Year','VIN','Does your vehicle have SiriusXM?','Extended Warranty Coverage']);
assert.deepEqual(run(['Sync 3 Software Build','Vehicle Model Year','APIM Type']),['Vehicle Model Year','Sync 3 Software Build','APIM Type']);
assert.deepEqual(run(['Truck Model','Model Year','VIN','Choose Your Upgrade Path']),['Truck Model','Model Year','VIN','Choose Your Upgrade Path']);
console.log('4 cart option sequences passed; native field order and selections unchanged.');
