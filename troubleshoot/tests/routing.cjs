const assert=require('node:assert/strict');
const {plan,problems,systems,restoreProgress}=require('../tool.js');
const run=(problem,answers={},system='Sync 3 · 8 inch')=>plan({problem,answers,system});
const sound={audioOpen:'yes',volume:'yes',sources:'both',affected:'all',premium:'premium'};
// Incomplete or ambiguous tests must never become a part recommendation.
for(const speaker of ['unknown','unable','notyet'])for(const premium of ['premium','standard','aftermarket','unknown']){
 const r=run('sound',{...sound,premium,speaker}).result;
 assert.equal(r.code,'support');assert.equal(r.product,undefined);assert.match(r.description,/completed, interpretable/);
}
for(const system of ['Not sure/Other system','Sync 2 · 8 inch','Sync 3 Lite · 4 inch']){
 const f=run('sound',{...sound,speaker:'none'},system);
 assert.equal(f.result.code,'support');assert.equal(f.result.product,undefined);assert(!f.questions.some(q=>q.id==='speaker'));
}
for(const audioOpen of ['no','unknown']){
 const f=run('sound',{...sound,audioOpen,speaker:'none'});
 assert.equal(f.result.code,'support');assert(!f.questions.some(q=>q.id==='speaker'));
 assert(f.questions.some(q=>q.id==='premium'));
}
assert.equal(run('sound',{...sound,speaker:'none'}).result.code,'audio-system');
assert.equal(run('sound',{...sound,speaker:'some'}).result.code,'speaker');
assert.equal(run('sound',{...sound,speaker:'all'}).result.code,'audio-playback');
assert.match(run('sound',{...sound,sources:'unknown',speaker:'all'}).result.title,/Compare normal/);
assert(!/phone-audio path/.test(run('sound',{...sound,sources:'unknown',speaker:'all'}).result.title));
assert.match(run('sound',{...sound,sources:'phone',speaker:'all'}).result.title,/phone playback/);
for(const system of ['Sync 2 · 8 inch','Sync 3 · 8 inch']){
 const resetGuide=system.startsWith('Sync 2')?undefined:'reset';
 assert.equal(run('screen',{screenSymptom:'black'},system).questions.at(-1).guide,resetGuide);
 assert.equal(run('screen',{screenSymptom:'damage'},system).result.code,'screen-damage');
 assert(!run('screen',{screenSymptom:'damage'},system).questions.some(q=>q.id==='reset'));
 for(const problem of ['screen','sync']){
  const base=problem==='screen'?{screenSymptom:'black'}:{};
  assert.equal(run(problem,{...base,reset:'fixed'},system).result.code,'resolved');
  for(const reset of ['notyet','unable','unknown'])assert.equal(run(problem,{...base,reset},system).result.code,'support');
 }
 const f=run('screen',{screenSymptom:'black',reset:'inaccessible',audioWorks:'no'},system);
 assert.equal(f.result.code,'apim');assert.match(f.result.title,/software, and power/);
 if(system.startsWith('Sync 2'))assert.equal(f.result.product,undefined);
 for(const screenSymptom of ['dead','phantom']){
  const r=run('screen',{screenSymptom,reset:'no'},system).result;
  assert.equal(r.code,'digitizer');assert.match(r.description,/software or connection/);
 }
}
const phone={phoneFeature:'carplay',connection:'wired',worked:'yes',permissions:'checked',wired:'checked',cable:'checked',phonePort:'checked',restartPhone:'checked',otherPhone:'neither',power:'yes',hubData:'checked',apimPort:'checked'};
assert.equal(run('phone',{...phone,wired:'fixed'}).result.code,'resolved');
assert.equal(run('phone',{...phone,connection:'wireless',wired:'fixed'}).result.code,'wireless');
const ids=run('phone',phone).questions.map(q=>q.id);
for(const id of ['power','hubData','apimPort'])assert(ids.indexOf('otherPhone')<ids.indexOf(id));
assert.equal(run('phone',phone).result.code,'connection-review');
assert.equal(run('phone',{...phone,otherPhone:'other'}).result.code,'phone');
assert.equal(run('phone',{...phone,otherPhone:'both'}).result.code,'resolved');
for(const otherPhone of ['notyet','unable','unknown']){
 const f=run('phone',{...phone,otherPhone});assert.equal(f.result.code,'support');assert(!f.questions.some(q=>q.id==='hubData'));
}
for(const id of ['permissions','cable','phonePort','restartPhone','hubData','apimPort'])assert.equal(run('phone',{...phone,[id]:'fixed'}).result.code,'resolved');
assert.equal(run('phone',{...phone,power:'no',hubPower:'fixed'}).result.code,'resolved');
assert.equal(run('phone',{...phone,power:'no',hubPower:'none'}).result.code,'support');
assert.equal(run('phone',{...phone,power:'no',hubPower:'power'}).result.code,'connection-review');
// Reload cannot resurrect obsolete flows, expired progress, or downstream answers.
const saved={version:2,saved:1000,state:{step:3,origin:'elsewhere',year:'2018',model:'Ford F-150',started:'Last week',system:'Sync 3 · 8 inch',problem:'screen',trigger:'battery',answers:{screenSymptom:'phantom',reset:'no',audioWorks:'no'}}};
const restored=restoreProgress(saved,2000);assert.equal(restored.step,3);assert.equal(restored.model,'Ford F-150');assert.equal(restored.answers.audioWorks,undefined);
assert.equal(restoreProgress(saved,86402000).step,0);
assert.equal(restoreProgress({...saved,version:1},2000).origin,'');
assert.equal(restoreProgress({...saved,state:{...saved.state,origin:'bad'}},2000).step,0);
assert.equal(restoreProgress({...saved,state:{...saved.state,answers:{screenSymptom:'black'}}},2000).step,2);
// Focused-check navigation survives reload only for questions in the current path.
const focused={...saved,state:{...saved.state,step:2,currentCheck:'reset'}};
assert.equal(restoreProgress(focused,2000).currentCheck,'reset');
assert.equal(restoreProgress({...focused,state:{...focused.state,currentCheck:'audioWorks'}},2000).currentCheck,'');
assert.equal(restoreProgress({...focused,state:{...focused.state,currentCheck:'<script>'}},2000).currentCheck,'');
assert(!problems.some(p=>p[0]==='touch'));
let terminals=0;
function walk(problem,system,answers={}){
 const f=run(problem,answers,system);assert(f.questions.length<=14);
 if(f.result){
  assert(f.result.title&&f.result.description&&f.result.note&&f.result.steps.length);
  assert(!/replacement is the likely|likely needs replacement/i.test(f.result.title));
  if(problem==='sound'||f.result.code==='resolved')assert.equal(f.result.product,undefined);
  terminals++;return;
 }
 const pending=f.questions.filter(q=>!answers[q.id]);assert.equal(pending.length,1);
 for(const o of pending[0].options)walk(problem,system,{...answers,[pending[0].id]:o.value});
}
for(const system of systems)for(const [problem]of problems)walk(problem,system);
console.log(`Passed routing, uncertainty, guide selection, phone order, and progress validation; ${terminals} terminal sequences.`);
