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

const themeSource=source.slice(source.indexOf('var PRICE_PROMO_THEME='),source.indexOf('function pricePromo(){'));
vm.runInContext(themeSource,context);
assert.equal(context.pricePromoTheme('BF26'),'ticket');assert.equal(context.pricePromoTheme('BF26-12'),'ticket');assert.equal(context.pricePromoTheme('HELLOFALL'),'gray');
vm.runInContext('PRICE_PROMO_THEME="gray"',context);assert.equal(context.pricePromoTheme('BF26'),'gray');assert.equal(context.pricePromoTheme('BF26-12'),'gray');
console.log('Black Friday offer scoping and gray-style switch passed.');

vm.runInContext(themeSource,context);
const end=Date.parse('2026-12-01T05:00:00Z');
assert.equal(context.PRICE_PROMO_END,end);
assert.equal(context.pricePromoRemaining(end-((2*86400+3*3600+4*60+5)*1000)),'Ends in 2d 03:04:05');
assert.equal(context.pricePromoRemaining(Date.parse('2026-11-30T00:00:00-05:00')),'Ends in 1d 00:00:00');
assert.equal(context.pricePromoRemaining(end-1000),'Ends in 0d 00:00:01');
assert.equal(context.pricePromoRemaining(end-1),'Ends in 0d 00:00:01');
assert.equal(context.pricePromoRemaining(end),'Sale ended');
assert.equal(context.pricePromoRemaining(end+86400000),'Sale ended');
console.log('Countdown Eastern deadline, day rollover, and expiry passed.');

// One interval per page; text-only ticks must not trigger the DOM rebuild observer.
let clockNow=end-2500, ticks=0, clears=0, mounted=true;
const clockNode={firstChild:{nodeType:3,data:''}};
context.Date={parse:Date.parse,now:()=>clockNow};
context.document={querySelectorAll:()=>mounted?[clockNode]:[],querySelector:()=>mounted?clockNode:null};
context.setInterval=()=>{ticks++;return ticks};context.clearInterval=()=>{clears++};
context.startPricePromoClock();context.startPricePromoClock();
assert.equal(ticks,1);assert.equal(clockNode.firstChild.data,'Ends in 0d 00:00:03');
clockNow=end-1500;context.updatePricePromoClock();assert.equal(clockNode.firstChild.data,'Ends in 0d 00:00:02');
mounted=false;context.updatePricePromoClock();assert.equal(clears,1);
mounted=true;context.startPricePromoClock();assert.equal(ticks,2);
clockNow=end;context.updatePricePromoClock();assert.equal(clockNode.firstChild.data,'Sale ended');assert.equal(clears,2);
context.startPricePromoClock();assert.equal(ticks,2);
console.log('Countdown single interval, text updates, navigation cleanup, and expiry passed.');
