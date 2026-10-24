// Editorial discovery checks: the intended answer must be visible in the first
// five results, the smaller desktop suggestion limit used by both search boxes.
const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const data=JSON.parse(fs.readFileSync(path.join(__dirname,'../articles.json'),'utf8'));
const queries=JSON.parse(fs.readFileSync(path.join(__dirname,'search-queries.json'),'utf8'));
const context={window:{}};vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname,'../hub.js'),'utf8'),context);
const api=context.window.SMI_SUPPORT;
const engines={results:q=>api.rank(data.articles,q),suggestions:q=>api.suggest(data.articles,q).articles};
// Optionally exercise the actual self-contained Ecwid widget, without copying
// its ranker into this test or needing the widget in the asset repository.
if(process.argv[2]){
 const source=fs.readFileSync(process.argv[2],'utf8');
 const start=source.indexOf('function normalize('),end=source.indexOf('function queryURL(');
 assert(start>=0&&end>start,'Widget ranking functions were not found');
 const widget={articles:data.articles};vm.createContext(widget);
 vm.runInContext(source.slice(start,end),widget);
 engines.homepage=q=>widget.ranked(q);
}
assert.deepEqual(Object.keys(queries).sort(),data.articles.map(a=>a.id).sort());
const failures=[];let checks=0;
for(const a of data.articles){
 assert(a.searchTerms.length>0,`${a.id}: missing discovery terms`);
 const normalized=a.searchTerms.map(api.norm);
 assert.equal(normalized.length,new Set(normalized).size,`${a.id}: duplicate terms`);
 for(const q of queries[a.id])for(const [name,search]of Object.entries(engines)){
  checks++;
  const results=search(q),rank=results.findIndex(x=>x.id===a.id)+1;
  if(rank<1||rank>5)failures.push({id:a.id,query:q,engine:name,rank,top:results.slice(0,5).map(x=>({id:x.id,title:x.title}))});
 }
}
for(const [name,search]of Object.entries(engines)){
 assert.equal(search('zzzznotfound').length,0,`${name}: no-match query`);
 assert(search('CarPlay').slice(0,5).some(a=>a.id==='108333'),`${name}: CarPlay answer visible`);
 if(name!=='homepage')assert.equal(search('CarPlay')[0].id,'108333',`${name}: primary CarPlay answer`);
 assert.equal(search('no sound')[0].id,'105986',`${name}: primary no-sound answer`);
 for(const q of ['flic','flick','flicker','flash','blinking']){
  const ids=search(q).slice(0,5).map(a=>a.id);
  assert(ids.includes('104294')&&ids.includes('108493'),`${name}: both flicker answers for ${q}`);
 }
 assert(!search('ghost touch').slice(0,5).some(a=>a.category==='26653'),`${name}: unrelated policies in touch results`);
 assert(!search('Canada customs').slice(0,5).some(a=>a.category==='26647'),`${name}: unrelated troubleshooting in customs results`);
}
if(failures.length){console.error(JSON.stringify(failures,null,2));process.exitCode=1;}
console.log(`${checks} discovery checks across ${Object.keys(queries).length} articles and ${Object.keys(engines).length} search modes; ${failures.length} failures.`);
