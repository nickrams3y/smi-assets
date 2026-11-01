const assert=require('node:assert/strict');
const {plan,problems,systems,restoreProgress}=require('../tool.js');
const run=(problem,answers={},system='Sync 3 · 8 inch')=>plan({problem,answers,system});
const sound={audioOpen:'yes',soundSymptom:'silent',sources:'both',affected:'all',premium:'premium',volumeBehavior:'erratic',acmTried:'notyet'};
// Test absence is different from a completed test with no sound.
for(const speaker of ['unknown','unable','notyet']){
 const f=run('sound',{...sound,speaker});
 assert.equal(f.result.code,'support');assert.equal(f.result.product,undefined);
 assert(!f.questions.some(q=>q.id==='premium'));
}
for(const system of ['Not sure/Other system','Sync 2 · 8 inch','Sync 3 Lite · 4 inch']){
 const f=run('sound',{...sound,speaker:'none'},system);
 assert.equal(f.result.code,'support');assert.equal(f.result.product,undefined);assert(!f.questions.some(q=>q.id==='speaker'));
}
const unavailable=run('sound',{...sound,audioOpen:'no',otherControls:'yes',speaker:'none'});
assert.equal(unavailable.result.code,'acm-likely');
assert(!unavailable.questions.some(q=>q.id==='speaker'));
assert(!unavailable.questions.some(q=>q.id==='volumeBehavior'));
for(const otherControls of ['no','unknown'])assert.equal(run('sound',{...sound,audioOpen:'no',otherControls}).result.code,'support');
assert.equal(run('sound',{...sound,audioOpen:'unknown'}).result.code,'support');
assert.equal(run('sound',{...sound,audioOpen:'no',otherControls:'yes',acmTried:'unchanged'}).result.code,'support');
assert.equal(run('sound',{...sound,speaker:'none'}).result.code,'amplifier-check');
assert.equal(run('sound',{...sound,speaker:'none',volumeBehavior:'normal'}).result.code,'audio-system');
assert.equal(run('sound',{...sound,speaker:'none',volumeBehavior:'normal',acmTried:'unchanged'}).result.code,'amplifier-check');
for(const premium of ['standard','unknown'])assert.equal(run('sound',{...sound,speaker:'none',premium}).result.code,'audio-system');
assert.equal(run('sound',{...sound,speaker:'none',premium:'aftermarket'}).result.code,'aftermarket-audio');
assert.equal(run('sound',{...sound,speaker:'none',acmTried:'fixed'}).result.code,'resolved');
for(const soundSymptom of ['noise','intermittent'])assert.equal(run('sound',{...sound,soundSymptom,speaker:'none'}).result.code,'audio-system');
assert.equal(run('sound',{...sound,affected:'some',speaker:'none'}).result.code,'audio-system');
assert.equal(run('sound',{...sound,speaker:'some'}).result.code,'speaker');
// Hearing every test tone requires a normal-playback check; it does not by itself resolve the fault.
assert.equal(run('sound',{...sound,speaker:'all'}).result,null);
assert.equal(run('sound',{...sound,speaker:'all'}).questions.at(-1).id,'playbackNow');
assert.equal(run('sound',{...sound,speaker:'all',playbackNow:'fixed'}).result.code,'resolved');
assert.equal(run('sound',{...sound,speaker:'all',playbackNow:'still'}).result.code,'audio-playback');
assert.equal(run('sound',{...sound,speaker:'all',playbackNow:'returned'}).result.code,'intermittent-audio');
assert.equal(run('sound',{...sound,soundSymptom:'intermittent',speaker:'all',playbackNow:'fixed'}).result.code,'intermittent-audio');
assert.equal(run('sound',{...sound,soundSymptom:'noise',speaker:'all',playbackNow:'still'}).result.code,'acm-noise');
assert.equal(run('sound',{...sound,soundSymptom:'noise',affected:'some',speaker:'all',playbackNow:'still'}).result.code,'speaker-playback');
assert.equal(run('sound',{...sound,sources:'radio',speaker:'all',playbackNow:'still'}).result.code,'radio-source');
assert.equal(run('sound',{...sound,sources:'radio',speaker:'none'}).result.code,'support');
const phoneOnly=run('sound',{...sound,sources:'phone',speaker:'none'});
assert.equal(phoneOnly.result.code,'phone-audio');assert(!phoneOnly.questions.some(q=>q.id==='speaker'));
assert.equal(run('sound',{...sound,sources:'unknown'}).result.code,'support');
for(const system of ['Sync 2 · 8 inch','Sync 3 · 8 inch']){
 const resetGuide=system.startsWith('Sync 2')?undefined:'reset';
 assert.equal(run('screen',{screenSymptom:'black',blackReplacement:'no'},system).questions.at(-1).guide,resetGuide);
 assert.equal(run('screen',{screenSymptom:'damage'},system).result.code,'screen-damage');
 assert(!run('screen',{screenSymptom:'damage'},system).questions.some(q=>q.id==='softReset'));
 for(const problem of ['screen','sync']){
  const base=problem==='screen'?{screenSymptom:'black',blackReplacement:'no'}:{syncSymptom:'frozen'};
  assert.equal(run(problem,{...base,softReset:'fixed'},system).result.code,'resolved');
  for(const reset of ['notyet','unable','unknown'])assert.equal(run(problem,{...base,softReset:reset},system).result.code,'support');
 }
 const f=run('screen',{screenSymptom:'black',blackReplacement:'no',softReset:'no',audioWorks:'no'},system);
 assert.equal(f.result.code,'apim');assert.match(f.result.title,/APIM|Sync 2/);
 if(system.startsWith('Sync 2'))assert.equal(f.result.product,undefined);
 for(const screenSymptom of ['dead','phantom']){
  const r=run('screen',{screenSymptom,softReset:'no'},system).result;
  assert.equal(r.code,'digitizer');assert.match(r.description,/digitizer symptom/);
 }
}
const phone={phoneFeature:'carplay',connection:'wired',worked:'yes',permissions:'checked',wired:'checked',cable:'checked',phonePort:'checked',restartPhone:'checked',otherPhone:'neither',power:'yes',hubData:'checked',apimPort:'checked'};
assert.equal(run('phone',{...phone,wired:'fixed'}).result.code,'resolved');
assert.equal(run('phone',{...phone,connection:'wireless',wired:'fixed'}).result.code,'wireless');
const ids=run('phone',phone).questions.map(q=>q.id);
for(const id of ['power','hubData','apimPort'])assert(ids.indexOf('otherPhone')<ids.indexOf(id));
assert.equal(run('phone',phone).result.code,'apim');
assert.equal(run('phone',{...phone,otherPhone:'other'}).result.code,'phone');
assert.equal(run('phone',{...phone,otherPhone:'both'}).result.code,'resolved');
for(const otherPhone of ['notyet','unable','unknown']){
 const f=run('phone',{...phone,otherPhone});assert.equal(f.result.code,'support');assert(!f.questions.some(q=>q.id==='hubData'));
}
for(const id of ['permissions','cable','phonePort','restartPhone','hubData','apimPort'])assert.equal(run('phone',{...phone,[id]:'fixed'}).result.code,'resolved');
assert.equal(run('phone',{...phone,power:'no',hubPower:'fixed'}).result.code,'resolved');
assert.equal(run('phone',{...phone,power:'no',hubPower:'none'}).result.code,'support');
assert.equal(run('phone',{...phone,power:'no',hubPower:'power'}).result.code,'apim');
// Reload cannot resurrect obsolete flows, expired progress, or downstream answers.
const saved={version:2,saved:1000,state:{step:3,origin:'elsewhere',year:'2018',model:'Ford F-150',started:'Last week',system:'Sync 3 · 8 inch',problem:'screen',trigger:'battery',answers:{screenSymptom:'phantom',softReset:'no',audioWorks:'no'}}};
const restored=restoreProgress(saved,2000);assert.equal(restored.step,3);assert.equal(restored.model,'Ford F-150');assert.equal(restored.answers.audioWorks,undefined);
assert.equal(restoreProgress(saved,86402000).step,0);
assert.equal(restoreProgress({...saved,version:1},2000).origin,'');
assert.equal(restoreProgress({...saved,state:{...saved.state,origin:'bad'}},2000).step,0);
assert.equal(restoreProgress({...saved,state:{...saved.state,answers:{screenSymptom:'black',blackReplacement:'no'}}},2000).step,2);
// Focused-check navigation survives reload only for questions in the current path.
const focused={...saved,state:{...saved.state,step:2,currentCheck:'softReset'}};
assert.equal(restoreProgress(focused,2000).currentCheck,'softReset');
assert.equal(restoreProgress({...focused,state:{...focused.state,currentCheck:'audioWorks'}},2000).currentCheck,'');
assert.equal(restoreProgress({...focused,state:{...focused.state,currentCheck:'<script>'}},2000).currentCheck,'');
const oldSound={...saved,state:{...saved.state,problem:'sound',answers:{audioOpen:'yes',volume:'yes',sources:'both',affected:'all',premium:'premium',speaker:'none'}}};
const resumedSound=restoreProgress(oldSound,2000);
assert.equal(resumedSound.step,2);assert.deepEqual(resumedSound.answers,{audioOpen:'yes'});
const oldReset={...saved,state:{...saved.state,answers:{screenSymptom:'black',blackReplacement:'no',reset:'no',audioWorks:'yes'}}};
assert.equal(restoreProgress(oldReset,2000).step,2);
assert.deepEqual(restoreProgress(oldReset,2000).answers,{screenSymptom:'black',blackReplacement:'no'});
// Black screen stays on the APIM route regardless of obsolete audio observations.
for(const audioWorks of ['yes','no','unknown'])assert.equal(run('screen',{screenSymptom:'black',blackReplacement:'no',softReset:'no',audioWorks}).result.code,'apim');
assert.match(run('screen',{screenSymptom:'black',blackReplacement:'no',softReset:'no'}).result.description,/Audio often continues/);
const flashing=run('screen',{screenSymptom:'flicker',restartType:'display'});
assert.equal(flashing.result.code,'screen');assert(!flashing.questions.some(q=>q.id==='softReset'));
assert.equal(run('screen',{screenSymptom:'flicker',restartType:'system',softReset:'no'}).result.code,'apim');
assert.equal(run('screen',{screenSymptom:'flicker',restartType:'system',softReset:'fixed'}).result.code,'resolved');
assert.equal(run('screen',{screenSymptom:'flicker',restartType:'unknown'}).result.code,'support');
for(const syncSymptom of ['frozen','logo','slow','reboot','settings','prompts','phones']){
 for(const softReset of ['no','temporary'])assert.equal(run('sync',{syncSymptom,softReset}).result.code,'apim');
 assert.equal(run('sync',{syncSymptom,softReset:'fixed'}).result.code,'resolved');
}
assert.match(run('sync',{syncSymptom:'settings',softReset:'no'}).questions.at(-1).help,/next time you start/);
assert.match(run('sync',{syncSymptom:'slow',softReset:'temporary'}).result.description,/only helped temporarily/);
assert.match(run('phone',phone).result.title,/likely cause/);
assert.equal(run('phone',{...phone,phoneFeature:'android'}).result.title,'Check the APIM next');
assert.match(run('phone',{...phone,worked:'no'}).questions.find(q=>q.id==='permissions').help,/installation first/);
// Customer ownership changes the action, not the diagnostic evidence.
for(const system of ['Sync 2 · 8 inch','Sync 3 · 8 inch','Sync 3 Lite · 4 inch']){
 const state={system,problem:'screen',answers:{screenSymptom:'black',blackReplacement:'no',softReset:'no'}};
 const order=plan({...state,origin:'smi'}).result;
 assert.equal(order.code,'apim');assert.equal(order.product,undefined);assert.match(order.steps[0],/existing order/);
 const regular=plan({...state,origin:'original'}).result;
 assert.equal(regular.code,'apim');assert.equal(Boolean(regular.product),system==='Sync 3 · 8 inch');
 assert.equal(plan(state).questions.at(-1).guide,system==='Sync 3 · 8 inch'?'reset':undefined);
}
assert.equal(plan({system:'Sync 3 · 8 inch',problem:'phone',answers:phone,origin:'smi'}).result.product,undefined);
const lite=run('screen',{},'Sync 3 Lite · 4 inch');
assert(!lite.questions[0].options.some(o=>['dead','phantom'].includes(o.value)));
assert.equal(run('screen',{screenSymptom:'flicker',restartType:'display'},'Sync 3 Lite · 4 inch').result.code,'screen');
assert.equal(run('sync',{syncSymptom:'frozen',softReset:'no'},'Sync 3 Lite · 4 inch').result.code,'apim');
assert.match(run('sound',{},'Sync 3 Lite · 4 inch').questions[0].title,/using the controls/);
const invalidLite=restoreProgress({...saved,state:{...saved.state,system:'Sync 3 Lite · 4 inch'}},2000);
assert.equal(invalidLite.answers.screenSymptom,undefined);assert.equal(invalidLite.step,2);
const sameBlack={screenSymptom:'black',blackReplacement:'unchanged',mainConnections:'checked',softReset:'no'};
assert.equal(run('screen',sameBlack).result.code,'display-check');
assert.equal(run('screen',{...sameBlack,mainConnections:'notyet'}).result.code,'support');
assert.equal(run('screen',{...sameBlack,mainConnections:'fixed'}).result.code,'resolved');
assert.equal(run('screen',{...sameBlack,softReset:'fixed'}).result.code,'resolved');
for(const intake of [{trigger:'installation'},{started:'Since installation / replacement'}]){
 const state={system:'Sync 3 · 8 inch',problem:'screen',...intake,answers:{screenSymptom:'black',blackReplacement:'no'}};
 assert.equal(plan(state).questions.at(-1).id,'mainConnections');assert.equal(plan(state).result,null);
}
assert.match(run('sync',{syncSymptom:'frozen'},'Sync 3 Lite · 4 inch').questions.at(-1).help,/Forward Seek and Power/);
const lostAfterInstall={system:'Sync 3 · 8 inch',problem:'sound',trigger:'installation',answers:{audioAfterInstall:'yes',acmRemoved:'yes',mainConnections:'checked'}};
const installationAudio=plan(lostAfterInstall);
assert.equal(installationAudio.result.code,'installation-audio');assert.equal(installationAudio.result.product,undefined);
assert.match(installationAudio.questions.at(-1).help,/back of the ACM/);
assert(!installationAudio.questions.some(q=>q.id==='speaker'));
assert.equal(plan({...lostAfterInstall,answers:{...lostAfterInstall.answers,mainConnections:'fixed'}}).result.code,'resolved');
assert.equal(plan({...lostAfterInstall,answers:{audioAfterInstall:'no'}}).questions.at(-1).id,'audioOpen');
assert.equal(plan({...lostAfterInstall,answers:{audioAfterInstall:'unknown'}}).result.code,'support');
assert(!problems.some(p=>p[0]==='touch'));
let terminals=0;
function walk(problem,system,answers={},context={}){
 const f=plan({...context,problem,answers,system});assert(f.questions.length<=14);
 if(f.result){
  assert(f.result.title&&f.result.description&&f.result.note&&f.result.steps.length);
  assert(!/replacement is the likely|likely needs replacement/i.test(f.result.title));
  if(problem==='sound'||f.result.code==='resolved')assert.equal(f.result.product,undefined);
  terminals++;return;
 }
 const pending=f.questions.filter(q=>!answers[q.id]);assert.equal(pending.length,1);
 for(const o of pending[0].options)walk(problem,system,{...answers,[pending[0].id]:o.value},context);
}
for(const system of systems)for(const [problem]of problems){walk(problem,system);if(problem!=='phone')walk(problem,system,{},{trigger:'installation'});}
console.log(`Passed routing, uncertainty, guide selection, phone order, and progress validation; ${terminals} terminal sequences.`);
