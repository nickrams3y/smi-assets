const assert = require('node:assert/strict');
const {plan, problems} = require('../tool.js');
const run = (problem, answers = {}, system = 'Sync 3 · 8 inch') => plan({problem, answers, system});
const code = (p, a) => run(p, a).result?.code;
const reset = {reset:'no'};
assert.equal(code('screen', {...reset, screenSymptom:'black', audioWorks:'no'}), 'apim');
assert.equal(code('screen', {...reset, screenSymptom:'black', audioWorks:'yes'}), 'screen');
assert.equal(code('screen', {...reset, screenSymptom:'flicker', restartType:'display'}), 'screen');
assert.equal(code('screen', {...reset, screenSymptom:'flicker', restartType:'system'}), 'apim');
assert.equal(code('screen', {reset:'inaccessible',screenSymptom:'black',audioWorks:'no'}), 'apim');
for (const system of ['Sync 2 · 8 inch','Sync 3 · 8 inch']) {
 for (const p of ['screen','sync']) {
  assert.equal(run(p,{},system).questions.at(-1).id, 'reset');
  assert.equal(run(p,{reset:'fixed'},system).result.code, 'resolved');
  assert.equal(run(p,{reset:'fixed'},system).questions.length, 1);
  for (const answer of ['notyet','unable','unknown']) assert.equal(run(p,{reset:answer},system).result.code, 'support');
 }
 assert.equal(run('screen',{reset:'no',screenSymptom:'black',audioWorks:'no'},system).result.code,'apim');
 assert.equal(run('screen',{reset:'no',screenSymptom:'phantom'},system).result.code,'digitizer');
}
assert.equal(run('screen',{reset:'no',screenSymptom:'black',audioWorks:'no'},'Sync 2 · 8 inch').result.product,undefined);
for (const s of ['frozen','logo','slow','reboot']) assert.equal(code('sync',{...reset,syncSymptom:s}), 'apim');
for (const s of ['dead','phantom']) assert.equal(code('screen',{reset:'no',screenSymptom:s}), 'digitizer');
assert(!problems.some(p=>p[0]==='touch'));
assert.equal(code('sound',{soundSymptom:'acm',sources:'radio',speaker:'none'}), 'acm');
assert.equal(code('sound',{soundSymptom:'radioOff',speaker:'unable'}), 'acm');
assert.equal(code('sound',{soundSymptom:'acm',sources:'phone'}), 'support');
assert.equal(code('sound',{soundSymptom:'calls',speaker:'some'}), 'speaker');
for (const s of ['all','none','notyet','unable','unknown']) assert.equal(code('sound',{soundSymptom:'calls',speaker:s}), 'support');
assert.equal(code('sound',{soundSymptom:'amp',premium:'yes',speaker:'none'}), 'amplifier');
assert.match(run('sound',{soundSymptom:'amp',premium:'yes',speaker:'none'}).result.note, /Provisional/);
for (const premium of ['no','unknown']) assert.equal(code('sound',{soundSymptom:'amp',premium,speaker:'none'}), 'support');
const phone = {wired:'checked',cable:'checked',phonePort:'checked',power:'yes',hubData:'checked',apimPort:'checked',otherPhone:'neither'};
assert.deepEqual(run('phone',phone).questions.map(q=>q.id),['wired','cable','phonePort','power','hubData','apimPort','otherPhone']);
assert.equal(code('phone',phone), 'possible-apim');
assert.equal(run('phone',phone).result.product, undefined);
assert.equal(code('phone',{...phone,otherPhone:'other'}), 'phone');
assert.equal(code('phone',{...phone,otherPhone:'both'}), 'resolved');
assert.equal(code('phone',{...phone,wired:'fixed'}), 'wireless');
for (const id of ['cable','phonePort','hubData','apimPort']) assert.equal(code('phone',{...phone,[id]:'fixed'}), 'resolved');
assert.equal(code('phone',{...phone,power:'no',hubPower:'none'}), 'support');
assert.equal(code('phone',{...phone,power:'no',hubPower:'fixed'}), 'resolved');
assert.equal(code('phone',{...phone,power:'no',hubPower:'power'}), 'possible-apim');
assert.equal(run('phone',{},'Sync 2 · 8 inch').result.code,'support');
for (const p of ['screen','sync','phone']) assert.equal(run(p,{},'Not sure/Other system').result.code,'support');
// Walk every valid answer sequence: no missing terminal state, skipped question,
// malformed output, or recursive loop is allowed.
let terminals=0;
function walk(problem, answers={}) {
 const f=run(problem,answers);
 assert(f.questions.length<=8);
 if(f.result) {
  assert(f.result.title && f.result.description && f.result.note && f.result.steps.length);
  if(f.result.code==='resolved') assert.equal(f.result.product,undefined);
  terminals++; return;
 }
 const pending=f.questions.filter(q=>!answers[q.id]);
 assert.equal(pending.length,1);
 for(const o of pending[0].options) walk(problem,{...answers,[pending[0].id]:o.value});
}
for(const [p] of problems) walk(p);
console.log(`All routing assertions passed; ${terminals} terminal answer sequences checked.`);
