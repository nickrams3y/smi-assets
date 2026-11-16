const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(require('node:path').join(__dirname,'../site.js'),'utf8');
const fn=source.slice(source.indexOf('function bannerPromo('),source.indexOf('function pricePromo('));
const context={};vm.createContext(context);vm.runInContext(fn,context);
for(const [text,code,amount] of [
 ['Fall into savings 🍁 Use code HELLOFALL for 10% off your order. Exclusions apply.','HELLOFALL','10%'],
 ['Black Friday starts now! Save 14% on most items with code BF26. Exclusions apply.','BF26','14%'],
 ['Black Friday Deals are here! Save 14% off most items. Use code BF26. Exclusions apply.','BF26','14%'],
 ['Save 5% with code bf26-12.','BF26-12','5%'],
 ['Use code TEST_5 for 5.5% off.','TEST_5','5.5%']
]){const actual=context.bannerPromo(text);assert.equal(actual.code,code);assert.equal(actual.amount,amount)}
for(const text of ['No current offer','Save 14%','Use code BF26','Save 10% today. Save 20% with code NEW']){
 const actual=context.bannerPromo(text);
 if(text.includes('NEW')){assert.equal(actual.amount,'20%');assert.equal(actual.code,'NEW')}else assert.equal(actual,null);
}
console.log('Coupon announcement format regressions passed.');
