(function(){
'use strict';
const guides={speaker:'https://files.simplymichigan.co/speaker-walk-around-self-test-instructions.pdf?v=20261018-originals',reset:'https://files.simplymichigan.co/sync-3-reset-instructions.pdf?v=20261018-originals'};
const contact='https://simplymichigan.co/contact-us';
const products={apim:'https://simplymichigan.co/products/sync-3-apims'};
const systems=['Not sure/Other system','Sync 2 · 8 inch','Sync 3 · 8 inch','Sync 3 Lite · 4 inch'];
const problems=[['sound','volume-x','Sound problems','No sound, popping, distorted audio, or unusual call audio'],['screen','monitor','Screen or touchscreen problems','Black screen, flickering, touch not working, or phantom touches'],['sync','refresh-cw','Sync freezes or restarts','Stuck logo, slow response, or repeated reboots'],['phone','smartphone','CarPlay, Android Auto, or USB','Your phone will not connect or stay connected']];
const option=(value,label)=>({value,label});
const unknown=option('unknown','Not sure');
const yesNo=[option('yes','Yes'),option('no','No'),unknown];
const checked=[option('fixed','It works now'),option('checked','Checked — still not working'),option('notyet','I haven’t checked yet'),option('unable','I need help with this check')];
const questions={
 audioOpen:{title:'Can you open Audio and change radio stations?',options:[option('yes','Yes'),option('no','No — Audio will not open, the radio will not turn on, or controls are grey'),unknown]},
 volume:{title:'Does the volume number or bar move when you turn the volume control?',help:'This is an observation, not a way to identify a failed module by itself.',options:yesNo},
 sources:{title:'Which audio sources have the problem?',options:[option('radio','AM / FM only'),option('phone','Phone audio only — AM / FM works'),option('both','Both AM / FM and phone audio'),option('untested','I can’t test the radio or phone audio'),unknown]},
 affected:{title:'Which speakers are affected during normal playback?',options:[option('all','All speakers'),option('some','Only certain speakers'),option('calls','Only calls sound like they come from a few speakers'),unknown]},
 premium:{title:'Which audio package does your vehicle have?',help:'Look for the audio brand on a speaker grille or your vehicle’s original equipment information. The volume display alone cannot distinguish an ACM fault from an amplifier fault.',options:[option('premium','Sony, B&O, THX, or Revel'),option('standard','Standard factory audio'),option('aftermarket','Aftermarket audio equipment'),unknown]},
 speaker:{title:'Did you hear sound during the speaker self test?',help:'Use this test only if Audio opens and you can select FM. Record the named positions that play or stay silent. Test tones can be loud. If you cannot start or interpret it, choose that answer below.',guide:'speaker',options:[option('all','Yes, every speaker tested'),option('some','Some speakers played, but one or more did not'),option('none','No speakers played'),option('notyet','I haven’t run the test yet'),option('unable','I couldn’t start the test'),unknown]},
 reset:{title:'Did resetting the system fix the issue?',help:'Do a soft reset and, if the issue remains and you’re able to access the Settings menu, do a master reset. A master reset erases saved settings and paired phones.',guide:'reset',options:[option('fixed','Yes — the reset fixed it'),option('temporary','It helped, but the issue returned'),option('no','I completed both resets — no change'),option('inaccessible','Soft reset did not help; I can’t access the menu for a master reset'),option('notyet','I haven’t tried the resets yet'),option('unable','I couldn’t complete the resets'),unknown]},
 screenSymptom:{title:'What does the screen do?',options:[option('black','Completely black'),option('flicker','Flickers, or the display turns on and off repeatedly'),option('dead','Picture is visible, but touch does not respond'),option('phantom','Picture is visible, but the screen taps or moves by itself'),option('damage','Cracked or physically damaged'),unknown]},
 audioWorks:{title:'Does audio still work while the screen is black?',options:yesNo},
 restartType:{title:'When the screen turns off and on, does the whole Sync system restart too?',help:'For example, does audio stop and the startup logo return? This helps separate a display problem from a system reboot.',options:[option('display','Only the picture cuts out — audio continues'),option('system','The whole system restarts / startup logo returns'),unknown]},
 syncSymptom:{title:'What happens most often?',options:[option('frozen','Frozen on one screen'),option('logo','Stuck on the startup logo'),option('slow','Slow response'),option('reboot','Repeated reboots'),unknown]},
 phoneFeature:{title:'What are you trying to use?',options:[option('carplay','Apple CarPlay'),option('android','Android Auto'),option('usb','Other USB / phone audio'),unknown]},
 connection:{title:'How are you connecting your phone?',options:[option('wired','USB cable'),option('wireless','Wireless adapter or wireless USB hub'),unknown]},
 worked:{title:'Has it worked before with this phone and this USB hub?',options:yesNo},
 permissions:{title:'Check compatibility and connection permissions',help:'Confirm your phone and installed hub support the feature you selected. Unlock the phone and accept connection prompts. For CarPlay, check Siri and that CarPlay is allowed in your iPhone settings. For Android Auto, check that it is enabled in the vehicle and review the phone’s connection prompts.',options:checked},
 restartPhone:{title:'Restart the phone and Sync, then reconnect',help:'Restart your phone. With the vehicle parked, perform the soft reset in the Sync 3 guide, then reconnect and accept any prompts. A master reset is not required for this check.',guide:'reset',options:checked},
 wired:{title:'Test a direct wired connection',help:'Remove any separate wireless adapter. Connect your phone directly to the vehicle’s USB hub using a cable. We want to test the wired connection first.',options:[option('fixed','A direct cable works now'),option('checked','Using a direct cable — still not working'),option('notyet','I haven’t tried a direct cable'),option('unable','I need help testing wired')]},
 cable:{title:'Verify the cable supports data transfer',help:'Use an authentic Apple or Samsung cable appropriate for your phone, or a high-quality third-party cable explicitly labeled for data transfer. Charging alone does not verify data transfer; some cables are charge-only.',options:[option('fixed','A different data cable fixed it'),option('checked','Verified a good data cable — still not working'),option('notyet','I haven’t verified the cable'),option('unable','I need help choosing a cable')]},
 phonePort:{title:'Check the port on your phone',help:'Check for pocket lint or other debris preventing a solid connection. If it needs cleaning, follow the phone manufacturer’s guidance or have it serviced.',options:checked},
 power:{title:'Does the phone charge from the vehicle’s USB hub?',help:'Use the verified cable. Charging suggests the hub is receiving power, but does not prove its data connection works.',options:yesNo},
 hubPower:{title:'Check the power connection behind the USB hub',help:'Have the power cable on the back of the USB hub checked. If you cannot safely access it, choose “I need help” rather than pulling apart the dashboard.',options:[option('fixed','Checking the connection restored CarPlay / Android Auto'),option('power','Power restored, but CarPlay / Android Auto still fails'),option('none','Connection checked — still no power'),option('notyet','I haven’t checked it'),option('unable','I need help')]},
 hubData:{title:'Check the USB data cable behind the hub',help:'Have the USB data cable checked at the back of the hub. Keep the power cable and data cable checks separate. Choose “I need help” if you cannot access it.',options:checked},
 apimPort:{title:'Check the data cable at the APIM',help:'Confirm that the hub’s USB data cable is connected to the proper USB port on the APIM module. Use the installation instructions for your setup or ask us to identify it; do not guess between ports.',options:checked},
 otherPhone:{title:'Try another compatible phone',help:'Test another person’s phone using the same wired setup and a suitable verified data cable. Unlock it and accept any connection prompts.',options:[option('other','The other phone works, but mine does not'),option('neither','Neither phone works'),option('both','Both phones work now'),option('notyet','I haven’t tried another phone'),option('unable','I don’t have another phone to test'),unknown]}
};
const contactStep='Contact us using the link below. Your answers here will automatically be attached to the message to help us guide you.';
const makeResult=(code,title,description,steps,note,product)=>({code,title,description,steps,note,product});
function support(title,description,steps){return makeResult('support',title,description,steps||[contactStep],'We’ll review the symptoms before recommending a replacement.');}
function solved(title,description){return makeResult('resolved',title,description,['Continue using the system and check that the improvement lasts.','If the problem returns, note what happened and contact us.'],'No replacement is recommended based on this result.');}
function plan(state){
 const list=[],a=state.answers||{};let result=null;
 function ask(id){let q={...questions[id]};if(id==='reset'&&state.system==='Sync 2 · 8 inch'){delete q.guide;q.help+=' Contact us if you need help with the Sync 2 reset procedure.';}list.push({...q,id});return q.options.some(o=>o.value===a[id])?a[id]:null;}
 function done(value){result=value||null;return {questions:list,result};}
 if(!problems.some(p=>p[0]===state.problem))return done();
 const touchscreen=['Sync 2 · 8 inch','Sync 3 · 8 inch'].includes(state.system);
 if(state.system==='Not sure/Other system')return done(support('Let’s identify your system first','If the screen is dead or you are unsure, send your vehicle’s year and model, whether the system was replaced, and a photo of the dashboard and physical controls. A 4-inch clock screen alone does not identify the underlying hardware.'));
 if(!touchscreen&&state.problem!=='sound')return done(support('Confirm your system with us','Guided screen, reset, and phone checks for Sync 3 Lite are not available here yet. Contact us with your symptoms and vehicle details; we’ll help you choose the appropriate checks.'));
 if(state.problem==='phone'&&state.system!=='Sync 3 · 8 inch')return done(support('Let us review your phone connection','The CarPlay / Android Auto checks here are for Sync 3. Tell us about your Sync 2 phone or USB issue, including any added equipment, so we can guide you.'));
 function resetChecks(){
  const reset=ask('reset');if(!reset)return false;
  if(reset==='fixed'){result=solved('Resetting the system resolved the issue','You reported that the system is working again.');return false;}
  if(!['no','temporary','inaccessible'].includes(reset)){result=support(reset==='notyet'?'Try the resets first':'Let us help with the reset steps','Start with a soft reset and, if the issue remains and you can access the Settings menu, do a master reset. Then update your answer.');return false;}
  return true;
 }
 function apim(){return makeResult('apim','Check the APIM, software, and power next','The symptoms can involve the APIM, but an unsuccessful reset does not confirm a failed module. Let us review the software, power, and connections before you order.',[contactStep,'Have the software version, power supply, and module connections reviewed before choosing a replacement.'],'A power, connection, configuration, or software issue can produce similar symptoms.',state.system==='Sync 3 · 8 inch'?{label:'View APIM replacements',href:products.apim}:undefined);}
 function screen(){return makeResult('screen','Check the display and its connections','The screen or its connections may be involved. These answers do not isolate a failed display.',['Have the display cable and its connections checked before replacing the screen.','Contact us with your vehicle details and a photo so we can confirm the correct display.'],'A screen that loses its picture and a complete system reboot need different checks.');}
 if(state.problem==='sound'){
  const audio=ask('audioOpen');if(!audio)return done();
  const volume=ask('volume');if(!volume)return done();
  const sources=ask('sources');if(!sources)return done();
  const affected=ask('affected');if(!affected)return done();
  const premium=ask('premium');if(!premium)return done();
  if(audio!=='yes')return done(support('Review radio operation before running the speaker test','The linked test needs Audio to open with FM selected. Do not treat an unavailable test as failed speakers or a failed ACM. We need to review system operation, power, connections, and the installed audio hardware.'));
  if(state.system!=='Sync 3 · 8 inch')return done(support('Confirm the correct audio test for your system','Send the observations above. The linked speaker-test procedure is for a compatible Sync 3 setup; we will identify the appropriate test for your system before interpreting it.'));
  const test=ask('speaker');if(!test)return done();
  if(['notyet','unable','unknown'].includes(test))return done(support(test==='notyet'?'Complete the speaker test when you can':'Let us help with the speaker test','We do not have a completed, interpretable speaker test. Tell us what prevented it or which part of the result was unclear. No component has been isolated.'));
  if(test==='some')return done(makeResult('speaker','Check the silent speaker positions and their circuits','Record each named position that stayed silent. The speaker, wiring, or amplifier output may be responsible.',['Include the silent positions in your message.','Have those circuits checked before replacing a speaker or module.',contactStep],'A silent test position does not identify which component failed.'));
  if(test==='none')return done(makeResult('audio-system','Check audio-system power, connections, and modules','No test tones were heard. This does not establish an ACM or amplifier failure, and does not mean every speaker has failed.',[contactStep,premium==='premium'?'Have the ACM and factory amplifier power, ground, connections, and communication checked.':'Have the audio hardware, power supply, grounds, and connections checked; confirm whether a separate amplifier is installed.'],'The test result alone cannot distinguish power, wiring, ACM, or amplifier faults.'));
  if(sources==='phone')return done(support('Compare phone playback and call audio','All tested positions played and you reported that AM / FM works. Review the phone, connection settings, and call-audio behavior before replacing vehicle hardware.',['Try another compatible phone using the same connection.','For connection failures, use the CarPlay / Android Auto / USB checks.',contactStep]));
  if(['unknown','untested'].includes(sources))return done(support('Compare normal radio and phone playback','All tested positions played, but we do not know which normal audio sources fail. Compare AM / FM with phone audio if possible, or tell us why that comparison cannot be completed.'));
  return done(makeResult('audio-playback','Investigate why normal playback fails','All tested speaker positions played. The ACM is one possibility, but we have not isolated the fault. Source settings, software, connections, and any separate amplifier still need review.',[contactStep,'Compare the affected sources and have the audio system checked before choosing a replacement.'],'Working test tones do not prove every part of the normal playback path is working.'));
 }
 if(state.problem==='screen'){
  const symptom=ask('screenSymptom');if(!symptom)return done();
  if(symptom==='damage')return done(makeResult('screen-damage','Arrange a screen damage assessment','A reset cannot repair cracked glass or physical display damage. Contact us with a photo and your vehicle’s year and model.',[contactStep,'Confirm the correct display or digitizer repair before ordering.'],'Physical damage does not rule out an additional electrical or connection problem.'));
  if(!resetChecks())return done(result);
  if(['dead','phantom'].includes(symptom))return done(makeResult('digitizer','Check the touchscreen and its connections','A digitizer fault is possible, but software or connection problems can also cause unresponsive or unwanted touches. Review those before choosing a repair.',['Contact us with a photo of your screen and vehicle details.','We can help confirm the correct digitizer repair or replacement screen option.'],'A failed reset alone does not confirm a defective digitizer.'));
  if(symptom==='black'){const audio=ask('audioWorks');if(!audio)return done();return done(audio==='no'?apim():audio==='yes'?screen():support('Check whether audio still works','This helps distinguish a display problem from a broader system problem.'));}
  if(symptom==='flicker'){const type=ask('restartType');if(!type)return done();return done(type==='display'?screen():type==='system'?apim():support('Distinguish screen flicker from system restarts','Watch whether the startup logo returns and whether audio stops at the same time. Send a short video if you are not sure.'));}
  return done(support('Show us what the screen is doing','Send a photo or video, your reset results, and your vehicle details.'));
 }
 if(state.problem==='sync'){
  if(!resetChecks())return done(result);
  const symptom=ask('syncSymptom');if(!symptom)return done();
  return done(symptom==='unknown'?support('Describe what happens after startup','Tell us whether Sync freezes, shows a stuck logo, responds slowly, or repeatedly reboots.'):apim());
 }
 function checkStep(id,title,description){const answer=ask(id);if(!answer)return false;if(answer==='fixed'){result=solved('Your connection is working again','The most recent check restored the connection.');return false;}if(answer!=='checked'){result=support(title,description);return false;}return true;}
 const feature=ask('phoneFeature');if(!feature)return done();
 if(['usb','unknown'].includes(feature))return done(support('Tell us about the phone or USB feature','Describe the feature you want to use, your phone model, and what happens when you connect it. We can help identify the right checks.'));
 if(!ask('connection'))return done();
 if(!ask('worked'))return done();
 if(!checkStep('permissions','Confirm compatibility and permissions','Check that the phone, installed hub, and chosen feature are compatible, or contact us for help identifying them.'))return done(result);
 const wired=ask('wired');if(!wired)return done();
 if(wired==='fixed'&&a.connection!=='wireless')return done(solved('The wired connection is working','You reported that connecting directly with a cable works now.'));
 if(wired==='fixed')return done(makeResult('wireless','Focus on the wireless adapter or hub','Your direct wired connection works. The remaining problem appears specific to wireless operation.',['Keep using the working wired connection while troubleshooting.','Tell us which wireless adapter or hub you use so we can review its setup.'],'An APIM replacement is not recommended from this result.'));
 if(wired!=='checked')return done(support('Test a direct wired connection first','Remove any separate wireless adapter, then connect directly to the USB hub with a suitable data cable.'));
 if(!checkStep('cable','Verify a data-capable cable first','Use a genuine Apple or Samsung cable suitable for your phone, or a high-quality third-party cable marked for data transfer.'))return done(result);
 if(!checkStep('phonePort','Check the phone port next','Look for debris preventing a full connection. Follow the phone manufacturer’s cleaning guidance or ask for help.'))return done(result);
 if(!checkStep('restartPhone','Restart the phone and Sync first','Try the phone restart and Sync soft reset, or tell us why you cannot complete them.'))return done(result);
 const phone=ask('otherPhone');if(!phone)return done();
 if(phone==='both')return done(solved('Both phones now connect','You reported that the wired connection works with both devices.'));
 if(phone==='other')return done(makeResult('phone','Focus on your phone or its settings','Another compatible phone works with the same wired setup. This points toward your device rather than an infotainment replacement.',['Review your phone’s connection permissions and CarPlay / Android Auto settings.',contactStep],'No APIM replacement is recommended from this comparison.'));
 if(phone!=='neither')return done(support('Compare with another compatible phone','Try another compatible phone with the same wired setup if available. If you cannot, contact us before inspecting connections behind the dashboard.'));
 const power=ask('power');if(!power)return done();
 if(power==='unknown')return done(support('Check whether the hub powers the phone','Using the verified cable, check whether the phone indicates charging. Let us know if you cannot establish this.'));
 if(power==='no'){
  const powerCheck=ask('hubPower');if(!powerCheck)return done();
  if(powerCheck==='fixed')return done(solved('Checking the power connection fixed it','You reported that CarPlay or Android Auto now works.'));
  if(powerCheck!=='power')return done(support(powerCheck==='none'?'The hub still has no power':'Check the hub power connection','Have the USB hub’s power connection and supply checked. Contact us if it still has no power or you need help accessing it.'));
 }
 if(!checkStep('hubData','Check the USB data cable at the hub','Have the connection at the back of the hub checked, or contact us for help.'))return done(result);
 if(!checkStep('apimPort','Confirm the correct APIM USB connection','Have the hub’s data cable connection and the correct APIM port verified. Send us photos if you need help identifying it.'))return done(result);
 return done(makeResult('connection-review','Let us review the USB system next','The issue remains with two compatible phones after the basic checks and connection checks. The USB hub, data cable, software, and APIM need further review.',[contactStep,'Have the hub, cabling, and APIM checked before ordering hardware.'],'These checks do not isolate a failed APIM or USB hub.'));
}
const origins={original:'Original factory infotainment system',smi:'Upgraded / replaced system from Simply Michigan Infotainment',elsewhere:'Upgraded / replaced elsewhere',unknown:'Not sure'};
const triggers={unknown:'Not sure / no obvious change',installation:'After installation or replacement',update:'After a software update',battery:'After battery work or a flat battery',other:'Another change'};
const freshState=()=>({step:0,origin:'',order:'',year:'',model:'',started:'',trigger:'unknown',problem:'',system:'Not sure/Other system',currentCheck:'',answers:{}});
const progressKey='sm-troubleshooting-progress-v2';
function restoreProgress(raw,now=Date.now()){
 const clean=freshState();
 if(!raw||raw.version!==2||!Number.isFinite(raw.saved)||now-raw.saved>86400000||raw.saved>now+60000||!raw.state)return clean;
 const saved=raw.state;
 if(Object.hasOwn(origins,saved.origin))clean.origin=saved.origin;
 if(systems.includes(saved.system))clean.system=saved.system;
 for(const key of ['model','started'])if(typeof saved[key]==='string')clean[key]=saved[key].slice(0,120);
 if(typeof saved.year==='string'&&/^\d{4}$/.test(saved.year))clean.year=saved.year;
 if(clean.origin==='smi'&&/^SM[0-9]{1,18}$/.test(saved.order||''))clean.order=saved.order;
 if(Object.hasOwn(triggers,saved.trigger))clean.trigger=saved.trigger;
 if(problems.some(p=>p[0]===saved.problem))clean.problem=saved.problem;
 if(saved.answers&&typeof saved.answers==='object')for(const [id,q] of Object.entries(questions))if(q.options.some(o=>o.value===saved.answers[id]))clean.answers[id]=saved.answers[id];
 const visible=new Set(plan(clean).questions.map(q=>q.id));for(const id of Object.keys(clean.answers))if(!visible.has(id))delete clean.answers[id];
 if(typeof saved.currentCheck==='string'&&visible.has(saved.currentCheck))clean.currentCheck=saved.currentCheck;
 clean.step=Number.isInteger(saved.step)?Math.max(0,Math.min(3,saved.step)):0;
 if(!clean.origin)clean.step=0;else if(clean.step>1&&!clean.problem)clean.step=1;else if(clean.step===3&&!plan(clean).result)clean.step=2;
 return clean;
}
// Export the decision flow and progress validation for regression checks.
if(typeof module!=='undefined'&&module.exports){module.exports={plan,questions,systems,problems,restoreProgress};return;}
if(window.SMI_TROUBLESHOOT)return;
let state=freshState();try{state=restoreProgress(JSON.parse(sessionStorage.getItem(progressKey)))}catch(e){}
let storageAvailable=true;
function saveProgress(){try{if(!state.origin&&!state.problem&&!state.year&&!state.model&&!state.started){sessionStorage.removeItem(progressKey);return;}sessionStorage.setItem(progressKey,JSON.stringify({version:2,saved:Date.now(),state}));storageAvailable=true;}catch(e){storageAvailable=false;}}
const imageRoot='https://nickrams3y.github.io/smi-assets/images/system-selector/';
const systemCards=[['Sync 2 · 8 inch','sync-2.jpg','8 inch touchscreen'],['Sync 3 · 8 inch','sync-3.jpg','8 inch touchscreen'],['Sync 3 Lite · 4 inch','base-sync.jpg','4 inch non-touchscreen'],['Not sure/Other system','not-sure.jpg','']];
const icons={
'volume-x':'<path d="M11 5 6 9H3v6h3l5 4Z"/><path d="m17 9 5 6m0-6-5 6"/>',
monitor:'<rect x="3" y="3" width="18" height="13" rx="2"/><path d="M12 16v5m-4 0h8"/>',
hand:'<path d="M8 12V6a2 2 0 0 1 4 0v6-8a2 2 0 0 1 4 0v8-6a2 2 0 0 1 4 0v10c0 4-3 6-6 6h-2c-3 0-4-2-6-5l-3-4a2 2 0 0 1 3-2l2 2"/>',
'refresh-cw':'<path d="M20 7a9 9 0 0 0-15-1L2 9m0-6v6h6m-4 8a9 9 0 0 0 15 1l3-3m0 6v-6h-6"/>',
smartphone:'<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/>'};
function escape(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function guideLink(key){return '<a class="sm-button sm-secondary sm-guide" href="'+guides[key]+'" target="_blank" rel="noopener">'+(key==='speaker'?'Speaker self-test instructions':'Sync 3 reset instructions')+' ↗</a>';}
window.SMI_TROUBLESHOOT={mount:function(root){
 if(root.dataset.initialized)return;root.dataset.initialized='true';
 root.innerHTML='<div class="sm-wrap"><p class="sm-preview">Early version · Results identify a likely next step, not a confirmed diagnosis. Contact us to verify the right replacement for your vehicle.</p><div class="sm-stepper" aria-label="Your progress"><span data-step="0"><b>1</b> Your system</span><em></em><span data-step="1"><b>2</b> The problem</span><em></em><span data-step="2"><b>3</b> Checks</span><em></em><span data-step="3"><b>4</b> Results</span></div><section class="sm-panel" id="sm-tool-body" aria-label="Troubleshooting questions"></section><div class="sm-bottom">Prefer to talk to us? <a href="'+contact+'">Contact support</a></div><div class="sm-progress-tools"><span data-progress-note>Progress stays in this tab for up to 24 hours.</span><button type="button" class="sm-back" data-action="reset">Start over</button></div></div>';
 const body=root.querySelector('#sm-tool-body');
 function contextFields(){return '<details class="sm-context-details" '+([state.year,state.model,state.started].some(Boolean)||state.trigger!=='unknown'?'open':'')+'><summary>Vehicle and timing <span class="sm-optional">(optional)</span></summary><fieldset><legend class="sm-sr-only">Vehicle and timing</legend><p class="sm-question-help">These details help us give a useful answer if you contact us.</p><div class="sm-context-fields"><label>Model year<input data-context="year" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" placeholder="2018" value="'+escape(state.year)+'"></label><label>Make and model<input data-context="model" maxlength="120" placeholder="Ford F-150" value="'+escape(state.model)+'"></label><label>When did the issue start?<input data-context="started" maxlength="120" placeholder="For example, last week" value="'+escape(state.started)+'"></label><label>Did it follow a change?<select data-context="trigger">'+Object.entries(triggers).map(([value,label])=>'<option value="'+value+'" '+(state.trigger===value?'selected':'')+'>'+escape(label)+'</option>').join('')+'</select></label></div></fieldset></details>';}
 function renderChecks(flow){
  const ids=flow.questions.map(q=>q.id);
  if(!ids.includes(state.currentCheck))state.currentCheck=(flow.questions.find(q=>!state.answers[q.id])||flow.questions.at(-1))?.id||'';
  const index=ids.indexOf(state.currentCheck),q=flow.questions[index],next=flow.questions[index+1];
  const history=flow.questions.filter(item=>state.answers[item.id]&&item.id!==state.currentCheck);
  return '<h2>Let’s work through the checks</h2><p class="sm-lead">'+escape(problems.find(p=>p[0]===state.problem)[2])+' · '+escape(state.system)+'</p>'+
   (history.length?'<details class="sm-answer-history"><summary>Review saved answers ('+history.length+')</summary><ol>'+history.map(item=>'<li><div><strong>'+escape(item.title)+'</strong><span>'+escape(item.options.find(o=>o.value===state.answers[item.id]).label)+'</span></div><button type="button" class="sm-edit" data-action="edit-check" data-target="'+item.id+'" aria-label="Change answer: '+escape(item.title)+'">Edit</button></li>').join('')+'</ol></details>':'')+
   (q?'<div class="sm-check-number">Check '+(index+1)+'</div><fieldset class="sm-current-check" data-question="'+q.id+'"'+(q.help?' aria-describedby="sm-check-help"':'')+'><legend tabindex="-1">'+escape(q.title)+'</legend>'+(q.help?'<p class="sm-question-help" id="sm-check-help">'+escape(q.help)+'</p>':'')+(q.guide?guideLink(q.guide)+'<p class="sm-guide-hint">PDF opens in a new tab. Your answers stay here.</p>':'')+'<div class="sm-answers">'+q.options.map(o=>'<label class="sm-answer"><input type="radio" name="'+q.id+'" value="'+o.value+'" '+(state.answers[q.id]===o.value?'checked':'')+'><span>'+escape(o.label)+'</span></label>').join('')+'</div></fieldset>':'')+
   '<p class="sm-flow-status" role="status">'+(!q?'We can help you choose the appropriate checks.':!state.answers[q.id]?'Choose an answer to continue.':next?'Answer saved. Continue when you’re ready.':'Your next step is ready.')+'</p><div class="sm-actions"><button type="button" class="sm-back" data-action="'+(index>0?'previous-check':'back')+'">← '+(index>0?'Previous check':'Change problem')+'</button>'+
   (next?'<button type="button" class="sm-button" data-action="next-check" data-target="'+next.id+'">Next check →</button>':'<button type="button" class="sm-button" data-action="next" '+(flow.result?'':'disabled')+'>See my next step →</button>')+'</div>';
 }
 function focusCheck(){const field=body.querySelector('[data-question]');if(!field)return;field.querySelector('legend').focus({preventScroll:true});body.scrollIntoView({block:'start',behavior:'auto'});}
 function render(focusHeading){
  root.querySelector('.sm-progress-tools button').hidden=state.step===3;
  const flow=state.problem?plan(state):null;
  root.querySelectorAll('[data-step]').forEach(el=>{const active=Number(el.dataset.step)===state.step;el.classList.toggle('active',active);el.classList.toggle('complete',Number(el.dataset.step)<state.step);if(active)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');});
  if(state.step===0){body.innerHTML='<h2>Tell us about your system</h2><fieldset><legend>Where did your current infotainment system come from?</legend><div class="sm-answers sm-origin">'+Object.entries(origins).map(([value,label])=>'<label class="sm-answer"><input type="radio" name="origin" value="'+value+'" '+(state.origin===value?'checked':'')+'><span>'+escape(label)+'</span></label>').join('')+'</div></fieldset>'+(state.origin==='smi'?'<div class="sm-order"><label for="sm-order">Order number <span>(optional)</span></label><input id="sm-order" type="text" placeholder="SM1234" pattern="SM[0-9]+" maxlength="20" autocomplete="off" value="'+escape(state.order)+'" aria-describedby="sm-order-hint"><p id="sm-order-hint">You can find this in your order confirmation email. Leave it blank if you don’t have it.</p></div>':'')+'<fieldset><legend>Your current system</legend><p class="sm-question-help">Choose your system’s usual appearance. If it is black or you’re unsure, choose Not sure/Other system.</p><div class="sm-system-pictures">'+systemCards.map(([value,file,detail])=>'<label class="sm-system-picture"><input type="radio" name="currentSystem" value="'+escape(value)+'" '+(state.system===value?'checked':'')+'><img src="'+imageRoot+file+'" alt="'+escape(value)+' infotainment system" width="320" height="180"><strong>'+escape(value)+'</strong>'+(detail?'<small>'+escape(detail)+'</small>':'')+'</label>').join('')+'</div></fieldset>'+contextFields()+'<div class="sm-actions"><span></span><button type="button" class="sm-button" data-action="next" '+(!state.origin?'disabled':'')+'>Continue →</button></div>';}
  else if(state.step===1){body.innerHTML='<h2>What’s going wrong?</h2><p class="sm-lead">Choose the main problem. We’ll take it one step at a time.</p><div class="sm-grid">'+problems.map(p=>'<button type="button" class="sm-choice" data-problem="'+p[0]+'" aria-pressed="'+(p[0]===state.problem)+'"><span class="sm-icon"><svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false">'+icons[p[1]]+'</svg></span><span><strong>'+escape(p[2])+'</strong><small>'+escape(p[3])+'</small></span></button>').join('')+'</div><div class="sm-actions"><button type="button" class="sm-back" data-action="back">← Back</button><button type="button" class="sm-button" data-action="next" '+(!state.problem?'disabled':'')+'>Continue →</button></div>';}
  else if(state.step===2){body.innerHTML=renderChecks(flow);}
  else{const r=flow.result;if(!r){state.step=2;render(true);return;}
   const usedGuides=[...new Set(flow.questions.filter(q=>q.guide&&!q.guide.startsWith('reset')).map(q=>q.guide))];
   body.innerHTML='<div class="sm-result-label">Your next step</div><div class="sm-result" data-result="'+r.code+'"><h3>'+escape(r.title)+'</h3><p>'+escape(r.description)+'</p><p class="sm-result-note">'+escape(r.note)+'</p></div>'+usedGuides.map(guideLink).join(' ')+'<div class="sm-next-title">'+(r.code==='resolved'?'What to do next':'Recommended next steps')+'</div><ol class="sm-next">'+r.steps.map(x=>'<li>'+escape(x)+'</li>').join('')+'</ol><div class="sm-actions sm-result-buttons">'+(r.product?'<a class="sm-button sm-secondary" href="'+r.product.href+'" target="_blank" rel="noopener">'+escape(r.product.label)+' ↗</a>':'')+'<a class="sm-button" data-action="help" href="'+contact+'">Get personalized help →</a></div><button type="button" class="sm-back" data-action="back">← Review answers</button><details class="sm-result-summary"><summary>Preview what we’ll receive</summary><p>Your answers and the guidance below will accompany your message when you choose Get personalized help.</p><pre>'+escape(summary())+'</pre></details><div class="sm-actions"><button type="button" class="sm-button sm-secondary" data-action="copy">Copy results</button><button type="button" class="sm-button sm-restart" data-action="reset">↻ Start over</button></div><p class="sm-copy-status" role="status"></p><textarea class="sm-summary" aria-label="Your troubleshooting summary" readonly hidden></textarea>';
  }
  saveProgress();root.querySelector('[data-progress-note]').textContent=storageAvailable?'Progress stays in this tab for up to 24 hours.':'Your browser cannot save progress. Keep this page open and copy your results before leaving.';
  if(focusHeading){const h=body.querySelector('h2,h3');h.tabIndex=-1;h.focus({preventScroll:true});const box=root.getBoundingClientRect();if(box.top<0||box.top>innerHeight/2)root.scrollIntoView({block:'start',behavior:'auto'});}
 }
 root.addEventListener('click',e=>{const choice=e.target.closest('[data-problem]');if(choice){if(state.problem!==choice.dataset.problem){state.answers={};state.currentCheck='';}state.problem=choice.dataset.problem;render();body.querySelector('[data-problem="'+state.problem+'"]').focus({preventScroll:true});return;}
  const action=e.target.closest('[data-action]');if(!action||action.disabled)return;
  if(['next-check','edit-check','previous-check'].includes(action.dataset.action)){const flow=plan(state),index=flow.questions.findIndex(q=>q.id===state.currentCheck);state.currentCheck=action.dataset.action==='previous-check'?flow.questions[index-1]?.id:action.dataset.target;render();focusCheck();return;}
  if(action.dataset.action==='copy'){copySummary(action);return;}
  if(action.dataset.action==='help'){
   saveProgress();
   try{const id=Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);sessionStorage.setItem('sm-troubleshooting-handoff',JSON.stringify({id,created:Date.now(),summary:summary(),order:state.origin==='smi'?state.order:''}));action.href=contact+'?troubleshooting='+encodeURIComponent(id);}
   catch(err){e.preventDefault();const fallback=body.querySelector('.sm-summary');fallback.value=summary();fallback.hidden=false;body.querySelector('.sm-copy-status').innerHTML='Your browser could not carry the results automatically. Copy the summary below and paste it into your message on our <a href="'+contact+'">contact page</a>.';}return;
  }
  if(action.dataset.action==='next'){if(state.step===0){if(!state.origin)return;for(const input of body.querySelectorAll('input'))if(!input.checkValidity()){const details=input.closest('details');if(details)details.open=true;input.reportValidity();return;}}if(state.step===1&&!state.problem)return;if(state.step===2&&!plan(state).result)return;state.step=Math.min(3,state.step+1);if(state.step===2&&!plan(state).questions.length)state.step=3;}
  if(action.dataset.action==='back'){state.step=Math.max(0,state.step-1);if(state.step===2&&!plan(state).questions.length)state.step=1;}
  if(action.dataset.action==='reset'){state=freshState();try{sessionStorage.removeItem('sm-troubleshooting-handoff');sessionStorage.removeItem(progressKey)}catch(e){}}
  render(true);
 });
 root.addEventListener('input',e=>{if(e.target.id==='sm-order'){state.order=e.target.value.toUpperCase().trim();e.target.value=state.order;}else if(['year','model','started','trigger'].includes(e.target.dataset.context)){state[e.target.dataset.context]=e.target.value;}else return;saveProgress();});
 root.addEventListener('change',e=>{
  const system=e.target.name==='currentSystem',name=e.target.name,value=e.target.value;
  if(['year','model','started','trigger'].includes(e.target.dataset.context)){state[e.target.dataset.context]=value;saveProgress();return;}
  if(name==='origin'){state.origin=value;if(value!=='smi')state.order='';render();body.querySelector('input[name=origin][value='+value+']').focus({preventScroll:true});return;}
  if(system){state.system=value;state.answers={};state.currentCheck='';}
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
 function summary(){const flow=plan(state),r=flow.result;return ['Simply Michigan troubleshooting results','Problem: '+problems.find(p=>p[0]===state.problem)[2],'System history: '+(origins[state.origin]||'Not specified'),...(state.origin==='smi'?['Order number: '+(state.order||'Not provided')]:[]),'System: '+state.system,'Vehicle: '+([state.year,state.model].filter(Boolean).join(' ')||'Not provided'),'Issue started: '+(state.started||'Not provided'),'Followed a change: '+triggers[state.trigger],...flow.questions.map(q=>q.title+' '+(q.options.find(o=>o.value===state.answers[q.id])?.label||'Not answered')),'Next step: '+r.title,r.description,'Note: '+r.note].join('\n');}
 async function copySummary(button){const status=body.querySelector('.sm-copy-status'),fallback=body.querySelector('.sm-summary');button.disabled=true;try{await navigator.clipboard.writeText(summary());status.textContent='Copied. Paste your results into your message to us.';fallback.hidden=true;}catch(e){fallback.value=summary();fallback.hidden=false;fallback.focus();fallback.select();status.textContent='Select and copy the summary below, then include it in your message to us.';}finally{button.disabled=false;}}
 render();
}};
})();
