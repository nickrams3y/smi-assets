const fs=require('fs'),vm=require('vm'),assert=require('assert');
const data=JSON.parse(fs.readFileSync(__dirname+'/../articles.json','utf8'));
const context={window:{}};vm.createContext(context);vm.runInContext(fs.readFileSync(__dirname+'/../hub.js','utf8'),context);
const rank=(q,c)=>context.window.SMI_SUPPORT.rank(data.articles,q,c);
assert.equal(data.articles.length,74);assert.equal(new Set(data.articles.map(a=>a.id)).size,74);
for(const c of data.categories)assert.equal(data.articles.filter(a=>a.category===c.id).length,c.count);
for(const a of data.articles){
 assert(a.title&&a.body&&a.slug);assert(!/<(?:script|iframe|form)\b|\son\w+=/i.test(a.body));
 for(const m of a.body.matchAll(/https:\/\/nickrams3y.github.io\/smi-assets\/support\/media\/([^"\s]+)/g))assert(fs.existsSync(__dirname+'/../media/'+m[1]));
 for(const m of a.body.matchAll(/#article=([^"\s]+)/g))assert(data.articles.some(x=>x.slug===decodeURIComponent(m[1])));
}
assert.equal(rank('CarPlay')[0].id,'108333');assert.equal(rank('no sound')[0].id,'105986');
assert(rank('USB C').some(a=>a.id==='104458'));assert(rank('GPS').some(a=>a.id==='104287'));
assert.equal(rank('zzzznotfound').length,0);assert(rank('CarPlay','26651').every(a=>a.category==='26651'));
console.log('74 articles, category counts, migrated links/media, sanitized markup and search checks passed.');
