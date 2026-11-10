const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../site.js'),'utf8');
const lines=source.split('\n').filter(s=>s.includes('b.addEventListener("change",models);'));
assert.equal(lines.length,2,'Test both homepage and category initialization');
for(const line of lines)for(const initial of [{make:'Ford',model:'',expected:'models'},{make:'',model:'',expected:'system'},{make:'Ford',model:'Escape',expected:'system'}]){
 const calls=[],listeners=[];const field=value=>({value,addEventListener(event,handler){listeners.push(handler)}});
 const b=field(initial.make),m=field(initial.model),y=field('2014');
 vm.runInNewContext(line,{b,m,y,models:()=>calls.push('models'),years(){},system:()=>calls.push('system')});
 assert.deepEqual(calls,[initial.expected]);assert.equal(listeners.length,3);assert.equal(b.value,initial.make);assert.equal(m.value,initial.model);assert.equal(y.value,'2014');
}
console.log('6 finder startup cases passed: early Make selection recovers; existing selections retained.');
