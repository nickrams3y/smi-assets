(function(){
'use strict';
const guides={speaker:'https://files.simplymichigan.co/speaker-walk-around-self-test-instructions.pdf',reset:'https://files.simplymichigan.co/sync-3-reset-instructions.pdf'};
const contact='https://simplymichigan.co/contact-us';
const products={acm:'https://simplymichigan.co/products/audio-control-module-acm-receiver',apim:'https://simplymichigan.co/products/sync-3-apims'};
const systems=['Not sure/Other system','Sync 2 · 8 inch','Sync 3 · 8 inch','Sync 3 Lite · 4 inch'];
const problems=[['sound','volume-x','Sound problems','No sound, popping, distorted audio, or unusual call audio'],['screen','monitor','Screen or touchscreen problems','Black screen, flickering, touch not working, or phantom touches'],['sync','refresh-cw','Sync freezes or restarts','Stuck logo, slow response, or repeated reboots'],['phone','smartphone','CarPlay, Android Auto, or USB','Your phone will not connect or stay connected']];
const option=(value,label)=>({value,label});
const unknown=option('unknown','Not sure');
const yesNo=[option('yes','Yes'),option('no','No'),unknown];
const checked=[option('fixed','It works now'),option('checked','Checked — still not working'),option('notyet','I haven’t checked yet'),option('unable','I need help with this check')];
const questions={
 soundSymptom:{title:'Which best describes the sound problem?',options:[option('acm','No sound, popping, or distorted audio'),option('radioOff','Audio / radio will not turn on, or the audio page is grey'),option('amp','The radio turns on, but there is no sound and the volume control has no effect'),option('calls','Calls sound like they come through one door speaker, the tweeters, or the center dash speaker'),unknown]},
 sources:{title:'Does the issue affect normal radio audio as well as phone audio?',options:[option('radio','AM / FM is affected too'),option('phone','Only calls / phone audio'),unknown]},
 premium:{title:'Does your vehicle have a separate factory amplifier?',help:'Factory Sony, B&O, THX, or Revel branding can help us identify the audio system. Choose “Not sure” if you do not know.',options:[option('yes','Yes — factory premium audio / separate amplifier'),option('no','No — standard audio'),unknown]},
 speaker:{title:'Did you hear sound during the speaker self test?',help:'Follow the guide and note which speakers play. Test tones can be loud.',guide:'speaker',options:[option('all','Yes, every speaker tested'),option('some','Some speakers played, but one or more did not'),option('none','No speakers played'),option('notyet','I haven’t run the test yet'),option('unable','I couldn’t start the test'),unknown]},
 reset:{title:'Did resetting the system fix the issue?',help:'Do a soft reset and, if the issue remains and you’re able to access the Settings menu, do a master reset. A master reset erases saved settings and paired phones.',guide:'reset',options:[option('fixed','Yes — the reset fixed it'),option('temporary','It helped, but the issue returned'),option('no','I completed both resets — no change'),option('inaccessible','Soft reset did not help; I can’t access the menu for a master reset'),option('notyet','I haven’t tried the resets yet'),option('unable','I couldn’t complete the resets'),unknown]},
 screenSymptom:{title:'After the resets, what does the screen do?',options:[option('black','Completely black'),option('flicker','Flickers, or the display turns on and off repeatedly'),option('dead','Picture is visible, but touch does not respond'),option('phantom','Picture is visible, but the screen taps or moves by itself'),option('damage','Cracked or physically damaged'),unknown]},
 audioWorks:{title:'Does audio still work while the screen is black?',options:yesNo},
 restartType:{title:'When the screen turns off and on, does the whole Sync system restart too?',help:'For example, does audio stop and the startup logo return? This helps separate a display problem from a system reboot.',options:[option('display','Only the picture cuts out — audio continues'),option('system','The whole system restarts / startup logo returns'),unknown]},
 syncSymptom:{title:'What happens most often?',options:[option('frozen','Frozen on one screen'),option('logo','Stuck on the startup logo'),option('slow','Slow response'),option('reboot','Repeated reboots'),unknown]},
 wired:{title:'Step 1 — Test a direct wired connection',help:'Remove any separate wireless adapter. Connect your phone directly to the vehicle’s USB hub using a cable. We want to test the wired connection first.',options:[option('fixed','Wired works — only wireless has the problem'),option('checked','Using a direct cable — still not working'),option('notyet','I haven’t tried a direct cable'),option('unable','I need help testing wired')]},
 cable:{title:'Step 2 — Verify the cable supports data transfer',help:'Use an authentic Apple or Samsung cable appropriate for your phone, or a high-quality third-party cable explicitly labeled for data transfer. Charging alone does not verify data transfer; some cables are charge-only.',options:[option('fixed','A different data cable fixed it'),option('checked','Verified a good data cable — still not working'),option('notyet','I haven’t verified the cable'),option('unable','I need help choosing a cable')]},
 phonePort:{title:'Step 3 — Check the port on your phone',help:'Check for pocket lint or other debris preventing a solid connection. If it needs cleaning, follow the phone manufacturer’s guidance or have it serviced.',options:checked},
 power:{title:'Step 4 — Does the phone charge from the vehicle’s USB hub?',help:'Use the verified cable. Charging suggests the hub is receiving power, but does not prove its data connection works.',options:yesNo},
 hubPower:{title:'Check the power connection behind the USB hub',help:'Have the power cable on the back of the USB hub checked. If you cannot safely access it, choose “I need help” rather than pulling apart the dashboard.',options:[option('fixed','Checking the connection restored CarPlay / Android Auto'),option('power','Power restored, but CarPlay / Android Auto still fails'),option('none','Connection checked — still no power'),option('notyet','I haven’t checked it'),option('unable','I need help')]},
 hubData:{title:'Step 5 — Check the USB data cable behind the hub',help:'Have the USB data cable checked at the back of the hub. Keep the power cable and data cable checks separate. Choose “I need help” if you cannot access it.',options:checked},
 apimPort:{title:'Step 6 — Check the data cable at the APIM',help:'Confirm that the hub’s USB data cable is connected to the proper USB port on the APIM module. Use the installation instructions for your setup or ask us to identify it; do not guess between ports.',options:checked},
 otherPhone:{title:'Step 7 — Try another compatible phone',help:'Test another person’s phone using the same wired setup and a suitable verified data cable. Unlock it and accept any connection prompts.',options:[option('other','The other phone works, but mine does not'),option('neither','Neither phone works'),option('both','Both phones work now'),option('notyet','I haven’t tried another phone'),option('unable','I don’t have another phone to test'),unknown]}
};
const contactStep='Contact us using the link below. Your answers here will automatically be attached to the message to help us guide you.';
const fitmentStep=part=>'Check the '+part+' replacement options and confirm fitment with your vehicle’s year and model.';
const makeResult=(code,title,description,steps,note,product)=>({code,title,description,steps,note,product});
function support(title,description,steps){return makeResult('support',title,description,steps||[contactStep],'We’ll review the symptoms before recommending a replacement.');}
function solved(title,description){return makeResult('resolved',title,description,['Continue using the system and check that the improvement lasts.','If the problem returns, note what happened and contact us.'],'No replacement is recommended based on this result.');}
function plan(state){
 const list=[],a=state.answers||{};let result=null;
 function ask(id){const q=questions[id];list.push({...q,id});return q.options.some(o=>o.value===a[id])?a[id]:null;}
 function done(value){result=value||null;return {questions:list,result};}
 if(!problems.some(p=>p[0]===state.problem))return done();
 const touchscreen=['Sync 2 · 8 inch','Sync 3 · 8 inch'].includes(state.system);
 if(!touchscreen&&state.problem!=='sound')return done(support('Confirm your system with us','These screen and reset checks are written for the 8-inch Sync 2 and Sync 3 systems. Go back to “Your system” and select the matching picture, or contact us for help.'));
 if(state.problem==='phone'&&state.system!=='Sync 3 · 8 inch')return done(support('Let us review your phone connection','The CarPlay / Android Auto checks here are for Sync 3. Tell us about your Sync 2 phone or USB issue, including any added equipment, so we can guide you.'));
 function resetChecks(){
  const reset=ask('reset');if(!reset)return false;
  if(reset==='fixed'){result=solved('Resetting the system resolved the issue','You reported that the system is working again.');return false;}
  if(!['no','temporary','inaccessible'].includes(reset)){result=support(reset==='notyet'?'Try the resets first':'Let us help with the reset steps','Start with a soft reset and, if the issue remains and you can access the Settings menu, do a master reset. Then update your answer.');return false;}
  return true;
 }
 function apim(){return makeResult('apim','An APIM replacement is the likely next step','Your reported symptoms point toward the Sync module (APIM). We recommend reviewing your vehicle details and reset results before ordering.',[contactStep,fitmentStep('APIM')],'A power, connection, configuration, or software issue can produce similar symptoms.',state.system==='Sync 3 · 8 inch'?{label:'View APIM replacements',href:products.apim}:undefined);}
 function screen(){return makeResult('screen','A replacement screen is the likely next step','Your reported display symptoms point toward the screen.',['Have the display cable and its connections checked before replacing the screen.','Contact us with your vehicle details and a photo so we can confirm the correct display.'],'A screen that loses its picture and a complete system reboot need different checks.');}
 if(state.problem==='sound'){
  const symptom=ask('soundSymptom');if(!symptom)return done();
  if(symptom==='unknown')return done(support('Tell us what the audio system is doing','Please describe whether the radio turns on, whether the volume indicator moves, and which speakers or sources are affected.'));
  if(['acm','radioOff'].includes(symptom)){
   if(symptom==='acm'){const sources=ask('sources');if(!sources)return done();if(sources!=='radio')return done(support('Check the phone-audio path first','If normal radio audio works, a phone-specific issue needs different checks. Use the CarPlay / Android Auto / USB path for connection problems, or describe your call-audio symptoms to us.'));}
   const test=ask('speaker');if(!test)return done();
   if(test==='notyet')return done(support('Run the speaker self test next','Open the instructions, then record which speakers played. If the test is unavailable on your system, choose “I couldn’t start the test.”'));
   if(test==='some')return done(makeResult('speaker','Check the silent speaker(s) and their wiring','One or more speakers did not play during the test. A speaker replacement may be needed.',['Write down exactly which speakers failed the test.','Have those speakers and their wiring checked before replacing a module.'],'A failed test alone cannot separate a bad speaker from wiring or an amplifier output problem.'));
   return done(makeResult('acm','An ACM replacement is the likely next step','Your radio/audio symptoms point toward the audio control module (ACM).',[contactStep,fitmentStep('ACM')],'No sound can also involve power, wiring, or a separate amplifier. This is a likely cause, not a confirmed diagnosis.',{label:'View ACM replacement',href:products.acm}));
  }
  if(symptom==='calls'){
   const test=ask('speaker');if(!test)return done();
   if(test==='some')return done(makeResult('speaker','A speaker may need to be replaced','Your call-audio symptoms and one or more failed speaker-test positions point toward a speaker or its circuit.',['Note each speaker that did not play during the test.','Have the speaker and wiring checked to confirm the fault before replacement.'],'The test does not independently rule out wiring or an amplifier output fault.'));
   if(test==='none')return done(support('Check the wider audio system','No speakers played during the test. That does not mean every speaker has failed.',['Tell us whether AM / FM produces sound.','Send your self-test result and vehicle/audio-system details so we can review the ACM, amplifier, and connections.']));
   if(test==='all')return done(support('The speakers played during the test','Do not replace a speaker based only on where call audio seems to come from.',['Compare normal radio audio with calls.','Tell us which speakers you hear during calls and whether another phone behaves the same way.']));
   return done(support(test==='notyet'?'Run the speaker self test next':'Let us help with the speaker self test','Use the instructions to record which speakers play, or tell us why you could not complete the test.'));
  }
  const premium=ask('premium');if(!premium)return done();
  const test=ask('speaker');if(!test)return done();
  if(test==='notyet')return done(support('Run the speaker self test next','Record whether every speaker, some speakers, or no speakers produce a tone.'));
  if(test==='some')return done(support('Check the silent speakers and their circuits','Because some speakers played, we need the individual speaker results before recommending an amplifier.'));
  if(test==='all')return done(support('Compare test tones with normal audio','You heard all tested speakers. Tell us whether normal radio audio is silent and whether the volume indicator responds.'));
  if(premium!=='yes')return done(support('Confirm the audio hardware first','We have not confirmed that your vehicle has a separate amplifier. Send your vehicle’s year, model, and audio-system details before choosing an ACM or amplifier.'));
  return done(makeResult('amplifier','The amplifier is the next component to investigate','Your radio turns on, but you report no sound and no effect from the volume control. A separate amplifier or its connections may be involved.',['Have the amplifier’s power, ground, connections, and communication checked.','Send us your vehicle’s year, model, and self-test results before replacing hardware.'],'Provisional guidance: the amplifier theory is still being verified. No amplifier purchase is recommended yet.'));
 }
 if(state.problem==='screen'){
  if(!resetChecks())return done(result);
  const symptom=ask('screenSymptom');if(!symptom)return done();
  if(['dead','phantom'].includes(symptom))return done(makeResult('digitizer','The touchscreen digitizer likely needs replacement','The picture is visible, but touch is unresponsive or registers touches by itself. That points toward the digitizer, the touch-sensitive layer of the screen.',['Contact us with a photo of your screen and vehicle details.','We can help confirm the correct digitizer repair or replacement screen option.'],'Have the touch/display connections checked before replacing hardware.'));
  if(symptom==='black'){const audio=ask('audioWorks');if(!audio)return done();return done(audio==='no'?apim():audio==='yes'?screen():support('Check whether audio still works','This helps distinguish a display problem from a broader system problem.'));}
  if(symptom==='flicker'){const type=ask('restartType');if(!type)return done();return done(type==='display'?screen():type==='system'?apim():support('Distinguish screen flicker from system restarts','Watch whether the startup logo returns and whether audio stops at the same time. Send a short video if you are not sure.'));}
  return done(symptom==='damage'?screen():support('Show us what the screen is doing','Send a photo or video, your reset results, and your vehicle details.'));
 }
 if(state.problem==='sync'){
  if(!resetChecks())return done(result);
  const symptom=ask('syncSymptom');if(!symptom)return done();
  return done(symptom==='unknown'?support('Describe what happens after startup','Tell us whether Sync freezes, shows a stuck logo, responds slowly, or repeatedly reboots.'):apim());
 }
 function checkStep(id,title,description){const answer=ask(id);if(!answer)return false;if(answer==='fixed'){result=solved('Your connection is working again','The most recent check restored the wired connection.');return false;}if(answer!=='checked'){result=support(title,description);return false;}return true;}
 const wired=ask('wired');if(!wired)return done();
 if(wired==='fixed')return done(makeResult('wireless','Focus on the wireless adapter or hub','Your direct wired connection works. The remaining problem appears specific to wireless operation.',['Keep using the working wired connection while troubleshooting.','Tell us which wireless adapter or hub you use so we can review its setup.'],'An APIM replacement is not recommended from this result.'));
 if(wired!=='checked')return done(support('Test a direct wired connection first','Remove any separate wireless adapter, then connect directly to the USB hub with a suitable data cable.'));
 if(!checkStep('cable','Verify a data-capable cable first','Use a genuine Apple or Samsung cable suitable for your phone, or a high-quality third-party cable marked for data transfer.'))return done(result);
 if(!checkStep('phonePort','Check the phone port next','Look for debris preventing a full connection. Follow the phone manufacturer’s cleaning guidance or ask for help.'))return done(result);
 const power=ask('power');if(!power)return done();
 if(power==='unknown')return done(support('Check whether the hub powers the phone','Using the verified cable, check whether the phone indicates charging. Let us know if you cannot establish this.'));
 if(power==='no'){
  const powerCheck=ask('hubPower');if(!powerCheck)return done();
  if(powerCheck==='fixed')return done(solved('Checking the power connection fixed it','You reported that CarPlay or Android Auto now works.'));
  if(powerCheck!=='power')return done(support(powerCheck==='none'?'The hub still has no power':'Check the hub power connection','Have the USB hub’s power connection and supply checked. Contact us if it still has no power or you need help accessing it.'));
 }
 if(!checkStep('hubData','Check the USB data cable at the hub','Have the connection at the back of the hub checked, or contact us for help.'))return done(result);
 if(!checkStep('apimPort','Confirm the correct APIM USB connection','Have the hub’s data cable connection and the correct APIM port verified. Send us photos if you need help identifying it.'))return done(result);
 const phone=ask('otherPhone');if(!phone)return done();
 if(phone==='both')return done(solved('Both phones now connect','You reported that the wired connection works with both devices.'));
 if(phone==='other')return done(makeResult('phone','Focus on your phone or its settings','Another compatible phone works with the same wired setup. This points toward your device rather than an infotainment replacement.',['Review your phone’s connection permissions and CarPlay / Android Auto settings.','Contact your phone manufacturer or share the device details with us.'],'No APIM replacement is recommended from this comparison.'));
 if(phone==='neither')return done(makeResult('possible-apim','Contact us for the next diagnostic step','The issue remains with another compatible phone after the cable, port, power, and connection checks. An APIM replacement is possible, but needs further review.',[contactStep,'We’ll review the USB hub, cabling, and APIM before recommending a replacement.'],'These checks do not rule out a USB hub or data-cable fault.'));
 return done(support('Compare with another compatible phone','Try another phone using the same wired setup if available. If you cannot, contact us with the checks you have completed.'));
}
// The pure decision flow is also available to the local regression tests.
if(typeof module!=='undefined'&&module.exports){module.exports={plan,questions,systems,problems};return;}
if(window.SMI_TROUBLESHOOT)return;
const freshState=()=>({step:0,origin:'',order:'',problem:'',system:'Not sure/Other system',answers:{}});
let state=freshState();
const imageRoot='https://nickrams3y.github.io/smi-assets/images/system-selector/';
const systemCards=[['Sync 2 · 8 inch','sync-2.jpg','8 inch touchscreen'],['Sync 3 · 8 inch','sync-3.jpg','8 inch touchscreen'],['Sync 3 Lite · 4 inch','base-sync.jpg','4 inch non-touchscreen'],['Not sure/Other system','not-sure.jpg','']];
const origins={original:'Original factory infotainment system',smi:'Upgraded / replaced system from Simply Michigan Infotainment'};
const icons={
'volume-x':'<path d="M11 5 6 9H3v6h3l5 4Z"/><path d="m17 9 5 6m0-6-5 6"/>',
monitor:'<rect x="3" y="3" width="18" height="13" rx="2"/><path d="M12 16v5m-4 0h8"/>',
hand:'<path d="M8 12V6a2 2 0 0 1 4 0v6-8a2 2 0 0 1 4 0v8-6a2 2 0 0 1 4 0v10c0 4-3 6-6 6h-2c-3 0-4-2-6-5l-3-4a2 2 0 0 1 3-2l2 2"/>',
'refresh-cw':'<path d="M20 7a9 9 0 0 0-15-1L2 9m0-6v6h6m-4 8a9 9 0 0 0 15 1l3-3m0 6v-6h-6"/>',
smartphone:'<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/>'};
function escape(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function guideLink(key){return '<a class="sm-button sm-secondary sm-guide" href="'+guides[key]+'" target="_blank" rel="noopener">'+(key==='speaker'?'Speaker self-test instructions':'Sync reset instructions')+' ↗</a>';}
window.SMI_TROUBLESHOOT={mount:function(root){
 if(root.dataset.initialized)return;root.dataset.initialized='true';
 root.innerHTML='<div class="sm-wrap"><p class="sm-preview">Early version · Results identify a likely next step, not a confirmed diagnosis. Contact us to verify the right replacement for your vehicle.</p><div class="sm-stepper" aria-label="Your progress"><span data-step="0"><b>1</b> Your system</span><em></em><span data-step="1"><b>2</b> The problem</span><em></em><span data-step="2"><b>3</b> Checks</span><em></em><span data-step="3"><b>4</b> Results</span></div><section class="sm-panel" id="sm-tool-body" aria-label="Troubleshooting questions"></section><div class="sm-bottom">Prefer to talk to us? <a href="'+contact+'">Contact support</a></div></div>';
 const body=root.querySelector('#sm-tool-body');
 function render(focusHeading){
  const flow=state.problem?plan(state):null;
  root.querySelectorAll('[data-step]').forEach(el=>{const active=Number(el.dataset.step)===state.step;el.classList.toggle('active',active);if(active)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');});
  if(state.step===0){body.innerHTML='<h2>Tell us about your system</h2><fieldset><legend>Is the system we’re troubleshooting your original infotainment system or an upgraded / replaced system from Simply Michigan Infotainment?</legend><div class="sm-answers sm-origin">'+Object.entries(origins).map(([value,label])=>'<label class="sm-answer"><input type="radio" name="origin" value="'+value+'" '+(state.origin===value?'checked':'')+'><span>'+escape(label)+'</span></label>').join('')+'</div></fieldset>'+(state.origin==='smi'?'<div class="sm-order"><label for="sm-order">Order number <span>(optional)</span></label><input id="sm-order" type="text" placeholder="SM1234" pattern="SM[0-9]+" maxlength="20" autocomplete="off" value="'+escape(state.order)+'" aria-describedby="sm-order-hint"><p id="sm-order-hint">You can find this in your order confirmation email. Leave it blank if you don’t have it.</p></div>':'')+'<fieldset><legend>Your current system</legend><p class="sm-question-help">Choose the picture that looks most like your system.</p><div class="sm-system-pictures">'+systemCards.map(([value,file,detail])=>'<label class="sm-system-picture"><input type="radio" name="currentSystem" value="'+escape(value)+'" '+(state.system===value?'checked':'')+'><img src="'+imageRoot+file+'" alt="'+escape(value)+' infotainment system" width="320" height="180"><strong>'+escape(value)+'</strong>'+(detail?'<small>'+escape(detail)+'</small>':'')+'</label>').join('')+'</div></fieldset><div class="sm-actions"><span></span><button type="button" class="sm-button" data-action="next" '+(!state.origin?'disabled':'')+'>Continue →</button></div>';}
  else if(state.step===1){body.innerHTML='<h2>What’s going wrong?</h2><p class="sm-lead">Choose the main problem. We’ll take it one step at a time.</p><div class="sm-grid">'+problems.map(p=>'<button type="button" class="sm-choice" data-problem="'+p[0]+'" aria-pressed="'+(p[0]===state.problem)+'"><span class="sm-icon"><svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false">'+icons[p[1]]+'</svg></span><span><strong>'+escape(p[2])+'</strong><small>'+escape(p[3])+'</small></span></button>').join('')+'</div><div class="sm-actions"><button type="button" class="sm-back" data-action="back">← Back</button><button type="button" class="sm-button" data-action="next" '+(!state.problem?'disabled':'')+'>Continue →</button></div>';}
  else if(state.step===2){body.innerHTML='<h2>Let’s work through the checks</h2><p class="sm-lead">'+escape(problems.find(p=>p[0]===state.problem)[2])+' · Answer each check to see what comes next.</p>'+flow.questions.map(q=>'<fieldset'+(q.guide?' class="sm-self-test"':'')+'><legend>'+escape(q.title)+'</legend>'+(q.help?'<p class="sm-question-help">'+escape(q.help)+'</p>':'')+(q.guide?guideLink(q.guide)+'<p class="sm-guide-hint">PDF opens in a new tab. Your answers stay here.</p>':'')+'<div class="sm-answers">'+q.options.map(o=>'<label class="sm-answer"><input type="radio" name="'+q.id+'" value="'+o.value+'" '+(state.answers[q.id]===o.value?'checked':'')+'><span>'+escape(o.label)+'</span></label>').join('')+'</div></fieldset>').join('')+(!flow.questions.length?'<p class="sm-lead">Go back to review your system choice, or continue to get help identifying it.</p>':'')+'<p class="sm-flow-status" role="status">'+(flow.result?'Your next step is ready.':'Answer the next question to continue.')+'</p><div class="sm-actions"><button type="button" class="sm-back" data-action="back">← Back</button><button type="button" class="sm-button" data-action="next" '+(flow.result?'':'disabled')+'>See my next step →</button></div>';}
  else{const r=flow.result;if(!r){state.step=2;render(true);return;}
   const usedGuides=[...new Set(flow.questions.filter(q=>q.guide&&q.guide!=='reset').map(q=>q.guide))];
   body.innerHTML='<div class="sm-result-label">Your next step</div><div class="sm-result" data-result="'+r.code+'"><h3>'+escape(r.title)+'</h3><p>'+escape(r.description)+'</p><p class="sm-result-note">'+escape(r.note)+'</p></div>'+usedGuides.map(guideLink).join(' ')+'<div class="sm-next-title">'+(r.code==='resolved'?'What to do next':'Recommended next steps')+'</div><ol class="sm-next">'+r.steps.map(x=>'<li>'+escape(x)+'</li>').join('')+'</ol><div class="sm-actions sm-result-buttons">'+(r.product?'<a class="sm-button sm-secondary" href="'+r.product.href+'" target="_blank" rel="noopener">'+escape(r.product.label)+' ↗</a>':'')+'<a class="sm-button" data-action="help" href="'+contact+'">Get personalized help →</a></div><button type="button" class="sm-back" data-action="back">← Review answers</button><div class="sm-actions"><button type="button" class="sm-button sm-secondary" data-action="copy">Copy results</button><button type="button" class="sm-button sm-restart" data-action="reset">↻ Start over</button></div><p class="sm-copy-status" role="status"></p><textarea class="sm-summary" aria-label="Your troubleshooting summary" readonly hidden></textarea>';
  }
  if(focusHeading){const h=body.querySelector('h2,h3');h.tabIndex=-1;h.focus({preventScroll:true});const box=root.getBoundingClientRect();if(box.top<0||box.top>innerHeight/2)root.scrollIntoView({block:'start',behavior:'auto'});}
 }
 root.addEventListener('click',e=>{const choice=e.target.closest('[data-problem]');if(choice){if(state.problem!==choice.dataset.problem)state.answers={};state.problem=choice.dataset.problem;render();body.querySelector('[data-problem="'+state.problem+'"]').focus({preventScroll:true});return;}
  const action=e.target.closest('[data-action]');if(!action||action.disabled)return;
  if(action.dataset.action==='copy'){copySummary(action);return;}
  if(action.dataset.action==='help'){
   try{const id=Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);sessionStorage.setItem('sm-troubleshooting-handoff',JSON.stringify({id,created:Date.now(),summary:summary(),order:state.origin==='smi'?state.order:''}));action.href=contact+'?troubleshooting='+encodeURIComponent(id);}
   catch(err){e.preventDefault();const fallback=body.querySelector('.sm-summary');fallback.value=summary();fallback.hidden=false;body.querySelector('.sm-copy-status').innerHTML='Your browser could not carry the results automatically. Copy the summary below and paste it into your message on our <a href="'+contact+'">contact page</a>.';}return;
  }
  if(action.dataset.action==='next'){if(state.step===0){if(!state.origin)return;const input=body.querySelector('#sm-order');if(input&&!input.reportValidity())return;}if(state.step===1&&!state.problem)return;if(state.step===2&&!plan(state).result)return;state.step=Math.min(3,state.step+1);}
  if(action.dataset.action==='back')state.step=Math.max(0,state.step-1);
  if(action.dataset.action==='reset'){state=freshState();try{sessionStorage.removeItem('sm-troubleshooting-handoff')}catch(e){}}
  render(true);
 });
 root.addEventListener('input',e=>{if(e.target.id==='sm-order'){state.order=e.target.value.toUpperCase().trim();e.target.value=state.order;}});
 root.addEventListener('change',e=>{
  const system=e.target.name==='currentSystem',name=e.target.name,value=e.target.value;
  if(name==='origin'){state.origin=value;if(value!=='smi')state.order='';render();body.querySelector('input[name=origin][value='+value+']').focus({preventScroll:true});return;}
  if(system){state.system=value;state.answers={};}
  else if(e.target.type==='radio'){
   const before=plan(state).questions,index=before.findIndex(q=>q.id===name);if(index<0)return;
   if(!before[index].options.some(o=>o.value===value))return;
   // Changing an earlier answer invalidates later checks, even if both routes use them.
   if(state.answers[name]!==value)before.slice(index+1).forEach(q=>delete state.answers[q.id]);
   state.answers[name]=value;
   const visible=new Set(plan(state).questions.map(q=>q.id));Object.keys(state.answers).forEach(k=>{if(!visible.has(k))delete state.answers[k];});
  }else return;
  render();const target=body.querySelector('input[name="'+name+'"][value="'+value+'"]');if(target)target.focus({preventScroll:true});
 });
 function summary(){const flow=plan(state),r=flow.result;return ['Simply Michigan troubleshooting results','Problem: '+problems.find(p=>p[0]===state.problem)[2],'System history: '+(origins[state.origin]||'Not specified'),...(state.origin==='smi'?['Order number: '+(state.order||'Not provided')]:[]),'System: '+state.system,...flow.questions.map(q=>q.title+' '+(q.options.find(o=>o.value===state.answers[q.id])?.label||'Not answered')),'Next step: '+r.title,r.description].join('\n');}
 async function copySummary(button){const status=body.querySelector('.sm-copy-status'),fallback=body.querySelector('.sm-summary');button.disabled=true;try{await navigator.clipboard.writeText(summary());status.textContent='Copied. Paste your results into your message to us.';fallback.hidden=true;}catch(e){fallback.value=summary();fallback.hidden=false;fallback.focus();fallback.select();status.textContent='Select and copy the summary below, then include it in your message to us.';}finally{button.disabled=false;}}
 render();
}};
})();
