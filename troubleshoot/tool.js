(function(){
'use strict';
const guides={speaker:'https://files.simplymichigan.co/speaker-walk-around-self-test-instructions.pdf?v=20261018-originals',reset:'https://files.simplymichigan.co/sync-3-reset-instructions.pdf?v=20261018-originals'};
const contact='https://simplymichigan.co/contact-us';
const products={apim:'https://simplymichigan.co/products/sync-3-apims'};
const systems=['Not sure/Other system','Sync 2 · 8 inch','Sync 3 · 8 inch','Sync 3 Lite · 4 inch'];
const problems=[['sound','volume-x','Sound problems','No sound, popping, distorted audio, or unusual call audio'],['screen','monitor','Screen or touchscreen problems','Black screen, flickering, touch not working, or phantom touches'],['sync','refresh-cw','Sync freezes or forgets settings','Stuck logo, slow response, repeated reboots, or settings and phones not saving'],['phone','smartphone','CarPlay, Android Auto, or USB','Your phone will not connect or stay connected']];
const option=(value,label)=>({value,label});
const unknown=option('unknown','Not sure');
const yesNo=[option('yes','Yes'),option('no','No'),unknown];
const checked=[option('fixed','It works now'),option('checked','Checked — still not working'),option('notyet','I haven’t checked yet'),option('unable','I need help with this check')];
const questions={
 audioAfterInstall:{title:'Did audio work before the APIM installation, then stop immediately afterward?',options:[option('yes','Yes — audio worked before this APIM installation'),option('no','No / this was not an APIM installation'),unknown]},
 acmRemoved:{title:'Was the ACM / CD player also removed during installation?',help:'This tells us which connections may have been disturbed.',options:yesNo},
 audioOpen:{title:'Can you open Audio and change radio stations?',options:[option('yes','Yes'),option('no','No — Audio will not open, the radio will not turn on, or controls are grey'),unknown]},
 otherControls:{title:'Do the other Sync menus still open and respond?',help:'For example, can you open Settings? This separates an Audio-only problem from the whole system freezing.',options:yesNo},
 soundSymptom:{title:'What happens to the sound?',options:[option('silent','No sound'),option('noise','Static, popping, or distorted sound'),option('intermittent','Sound cuts out and comes back'),unknown]},
 volumeBehavior:{title:'How does the volume control respond?',help:'Watch the volume number or bar while turning the knob. An unusual response is a clue, but does not identify a failed part on its own.',options:[option('normal','The display changes normally'),option('erratic','It responds only sometimes or behaves unusually'),option('none','The display does not change'),unknown]},
 playbackNow:{title:'After the test, does normal playback work?',help:'Check the source that had the problem. Working test tones alone do not mean the original problem is gone.',options:[option('fixed','Yes — normal playback works and the problem has not returned'),option('still','No — the original problem is still happening'),option('returned','It works sometimes, but the problem comes back'),unknown]},
 acmTried:{title:'Has a tested, correctly matched and programmed ACM already been tried?',help:'If you are unsure about the replacement or its programming, choose Not sure.',options:[option('unchanged','Yes — the same problem remains'),option('fixed','Yes — that fixed the problem'),option('notyet','No'),unknown]},
 sources:{title:'Which audio sources have the problem?',options:[option('radio','AM / FM only — phone audio works'),option('phone','Phone audio only — AM / FM works'),option('both','Both AM / FM and phone audio'),option('untested','I can’t test the radio or phone audio'),unknown]},
 affected:{title:'Which speakers are affected during normal playback?',options:[option('all','All speakers'),option('some','Only certain speakers'),option('calls','Only calls sound like they come from a few speakers'),unknown]},
 premium:{title:'Which audio package does your vehicle have?',help:'Look for the audio brand on a speaker grille or your vehicle’s original equipment information. The volume display alone cannot distinguish an ACM fault from an amplifier fault.',options:[option('premium','Sony, B&O, THX, or Revel'),option('standard','Standard factory audio'),option('aftermarket','Aftermarket audio equipment'),unknown]},
 speaker:{title:'Did you hear sound during the speaker self test?',help:'Use this test only if Audio opens and you can select FM. Record the named positions that play or stay silent. Test tones can be loud. If you cannot start or interpret it, choose that answer below.',guide:'speaker',options:[option('all','Yes, every speaker tested'),option('some','Some speakers played, but one or more did not'),option('none','No speakers played'),option('notyet','I haven’t run the test yet'),option('unable','I couldn’t start the test'),unknown]},
 softReset:{title:'Did a soft reset fix the issue?',help:'With the vehicle parked, follow the soft reset steps in the guide. A master reset is not required for this check.',guide:'reset',options:[option('fixed','Yes — the issue is gone'),option('temporary','It helped, but the issue returned'),option('no','I completed the soft reset — no change'),option('notyet','I haven’t tried a soft reset yet'),option('unable','I couldn’t complete the soft reset'),unknown]},
 screenSymptom:{title:'What does the screen do?',options:[option('black','Completely black'),option('flicker','Flickers, or the display turns on and off repeatedly'),option('dead','Picture is visible, but touch does not respond'),option('phantom','Picture is visible, but the screen taps or moves by itself'),option('damage','Cracked or physically damaged'),unknown]},
 blackReplacement:{title:'Was an APIM replacement installed to fix this same black screen?',options:[option('unchanged','Yes — the screen was black before, and is still black'),option('no','No'),unknown]},
 mainConnections:{title:'Check the main connections behind the infotainment system',help:'Make sure the main connections at the back of the system are in the correct places and fully seated. A connector can look plugged in without being pushed all the way in. Choose “I need help” if you cannot access them safely.',options:checked},
 restartType:{title:'When the picture returns, has Sync restarted or is it still on the same screen?',help:'Watch whether the same screen remains and music keeps playing, or whether the startup logo returns and the system reloads.',options:[option('display','The same screen returns and music keeps playing'),option('system','Sync restarts / the startup logo returns'),unknown]},
 syncSymptom:{title:'What happens most often?',options:[option('frozen','Frozen on one screen'),option('logo','Stuck on the startup logo'),option('slow','Slow or laggy response'),option('reboot','Repeated reboots'),option('settings','Settings do not save'),option('prompts','Startup messages, such as 911 Assist, return every time'),option('phones','Paired phones are forgotten'),unknown]},
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
 function ask(id){
  let q={...questions[id]};
  if(id==='softReset'&&state.system!=='Sync 3 · 8 inch'){delete q.guide;q.help='With the vehicle parked, use the soft reset procedure for your '+state.system+' system. Contact us if you need the correct procedure. A master reset is not required for this check.';}
  if(id==='softReset'&&['settings','prompts','phones'].includes(a.syncSymptom))q.help+=' After restarting the vehicle, check whether settings and paired phones are still saved and whether startup prompts return the next time you start.';
  if(id==='permissions'&&a.worked!=='yes')q.help='Since this setup has not been confirmed working before, verify compatibility and installation first. '+q.help;
  if(id==='mainConnections'&&a.acmRemoved==='yes')q.help+=' Also check that the connections on the back of the ACM / CD player were reconnected fully.';
  if(state.system==='Sync 3 Lite · 4 inch'){
   if(id==='softReset')q.help='With the vehicle parked, press and hold the Forward Seek and Power buttons to restart the system. Check whether the original problem remains. A master reset is not required.'+(['settings','prompts','phones'].includes(a.syncSymptom)?' Check that settings and paired phones remain saved the next time you start the vehicle.':'');
   if(id==='screenSymptom')q.options=q.options.filter(o=>!['dead','phantom'].includes(o.value));
   if(id==='audioOpen'){q.title='Can you turn on the radio and change stations using the controls?';q.options=[option('yes','Yes'),option('no','No — the radio stays off or the controls do not respond'),unknown];}
  }
  list.push({...q,id});return q.options.some(o=>o.value===a[id])?a[id]:null;
 }
 function done(value){
  if(value?.code==='apim'&&state.origin==='smi')value={...value,product:undefined,steps:['Contact us about your existing order so we can review the APIM issue and help with the next step.','Include your order number if available. Your troubleshooting answers will accompany your message.']};
  result=value||null;return {questions:list,result};
 }
 if(!problems.some(p=>p[0]===state.problem))return done();
 const afterInstall=state.trigger==='installation'||state.started==='Since installation / replacement';
 if(state.system==='Not sure/Other system')return done(support('Let’s identify your system first','If the screen is dead or you are unsure, send your vehicle’s year and model, whether the system was replaced, and a photo of the dashboard and physical controls. A 4-inch clock screen alone does not identify the underlying hardware.'));
 if(state.problem==='phone'&&state.system!=='Sync 3 · 8 inch')return done(support('Let us review your phone connection','These CarPlay / Android Auto checks are for an 8-inch Sync 3 setup. Tell us about the phone or USB feature you use with your '+state.system+' system, including any added equipment, so we can guide you.'));
 function resetChecks(){
  const reset=ask('softReset');if(!reset)return false;
  if(reset==='fixed'){result=solved('The soft reset resolved the issue','You reported that the original problem is no longer happening.');return false;}
  if(!['no','temporary'].includes(reset)){result=support(reset==='notyet'?'Try a soft reset first':'Get help with the soft reset','Complete the soft reset, then update your answer with whether the original problem remains. A master reset is not required. Contact us if you cannot complete the check.');return false;}
  return true;
 }
 function installationChecks(){
  const connections=ask('mainConnections');if(!connections)return false;
  if(connections==='fixed'){result=solved('Checking the connections fixed the problem','You reported that fully seating the infotainment connections restored normal operation.');return false;}
  if(connections!=='checked'){result=support('Check the main connections before choosing a replacement','Confirm the main rear connections are in the correct places and fully seated, then update this answer. If you need help accessing them, contact us with your installation details.');return false;}
  return true;
 }
 function apim(description){const sync3=state.system==='Sync 3 · 8 inch';return makeResult('apim','The APIM is the likely cause',description+(a.softReset==='temporary'?' The soft reset only helped temporarily.':''),['Contact us with these results to confirm the appropriate APIM replacement for your system.','If the problem started after installation, have the connections and configuration reviewed first.'],'These symptoms point to the APIM, but do not confirm a failed module on their own.',sync3?{label:'View APIM replacements',href:products.apim}:undefined);}
 function screen(){return makeResult('screen','The screen assembly is the likely cause','The picture flashes off and on, but Sync stays on the same screen and music continues. This points to the display or its circuit board rather than a complete Sync restart.',['Have the display connection checked. If it is secure and the symptom continues, the screen assembly is the likely repair.','Contact us with a photo or short video to confirm the appropriate screen.'],'This pattern concerns the display assembly, not the touch-sensitive digitizer.');}
 if(state.problem==='sound'){
  if(afterInstall){
   const changed=ask('audioAfterInstall');if(!changed)return done();
   if(changed==='unknown')return done(support('Confirm when audio stopped working','Tell us whether audio already failed before the APIM installation or stopped only afterward. That distinction helps us choose between an installation check and the usual sound troubleshooting.'));
   if(changed==='yes'){
    const removed=ask('acmRemoved');if(!removed)return done();
    if(!installationChecks())return done(result);
    return done(makeResult('installation-audio','Review the audio loss after installation','Audio worked before the APIM installation but is still missing after checking that the rear connections are fully seated. This is an unusual installation-related change.',[contactStep,removed==='yes'?'Tell us that the ACM / CD player was also removed and its rear connections have been checked.':removed==='no'?'Tell us that the ACM / CD player was not removed.':'Tell us which parts were removed during installation, if you can confirm them.'],'Have us review the installation and replacement APIM before choosing another audio component.'));
   }
  }
  const audio=ask('audioOpen');if(!audio)return done();
  if(audio==='unknown')return done(support('Check whether Audio opens first','With the vehicle parked, tap Audio and try selecting an FM station. Update this answer with whether the controls respond. This determines which audio checks to use.'));
  if(audio==='no'){
   const other=ask('otherControls');if(!other)return done();
   if(other!=='yes')return done(support(other==='no'?'Troubleshoot the unresponsive Sync system first':'Check whether the problem is limited to Audio',other==='no'?'Other menus are also unresponsive, so this is not just a radio-control failure. Use the Sync freezes or forgets settings path next.':'Try opening Settings or another Sync menu, then update this answer. A frozen system and an Audio-only failure need different checks.'));
   const tried=ask('acmTried');if(!tried)return done();
   if(tried==='fixed')return done(solved('Replacing the ACM restored audio','You reported that the replacement ACM fixed the problem.'));
   if(tried==='unchanged')return done(support('Review why the replacement ACM is still unresponsive','A tested replacement did not restore Audio controls. Have the ACM connections, power, and communication checked before trying another module. The unavailable speaker test does not establish an amplifier fault.'));
   return done(makeResult('acm-likely','The ACM is the likely cause','Audio will not open or the radio stays off, while the other Sync menus respond. This is the usual ACM failure pattern we see. A CD player that also stops responding can be another sign.',['Contact us with these results so we can review the ACM and the correct replacement for your vehicle.','Skip the speaker self test while Audio cannot open.'],'An unavailable speaker test is not a failed test. Confirm ACM power and connections before replacement.'));
  }
  const symptom=ask('soundSymptom');if(!symptom)return done();
  if(symptom==='unknown')return done(support('Describe what happens to the sound','Check whether audio is completely silent, noisy, or cutting in and out. Update this answer, or send us a short description so we can choose the right check.'));
  const sources=ask('sources');if(!sources)return done();
  if(sources==='phone')return done(makeResult('phone-audio','Focus on the phone audio connection','AM / FM works, so start with the phone source that fails.',['Try another compatible phone using the same connection.','If the other phone works, review the original phone’s settings. If neither works, use the CarPlay, Android Auto, or USB troubleshooting path.',contactStep],'Working radio audio makes a complete loss of vehicle audio less likely.'));
  if(['untested','unknown'].includes(sources))return done(support('Compare FM and phone playback next','Try a known local FM station, then phone audio if available. Update this answer with which source fails. If you cannot compare them, tell us which source you use and what prevents the check.'));
  const affected=ask('affected');if(!affected)return done();
  if(affected==='calls')return done(support('Compare call audio with music playback','Check whether the same speakers play during FM or music playback. If music uses those speakers normally, tell us which phone and connection you use and which positions are missing only during calls.'));
  if(state.system!=='Sync 3 · 8 inch')return done(support('Confirm the correct audio test for your system','Send the observations above. The linked speaker-test procedure is for a compatible Sync 3 setup; we will identify the appropriate test for your system before interpreting it.'));
  const test=ask('speaker');if(!test)return done();
  if(['notyet','unable','unknown'].includes(test))return done(support(test==='notyet'?'Run the speaker test next':'Get help completing the speaker test',test==='notyet'?'Use the linked instructions, note which named speakers play, then return and update this answer. The result will separate missing speaker positions from a loss of all test audio.':'Tell us where the test stopped or what result was unclear. Do not select “No speakers played” unless the test actually ran without sound.'));
  if(test==='some')return done(makeResult('speaker','A speaker problem is likely','When the other speakers play but one or two stay silent, those silent speakers are the first place to check.',['Write down each named speaker position that stayed silent.','Have those speakers and their wiring checked before replacing the ACM.',contactStep],'If the speakers and wiring check out, the amplifier output for those positions may need testing.'));
  if(test==='all'){
   const playback=ask('playbackNow');if(!playback)return done();
   if(playback==='fixed'&&symptom!=='intermittent')return done(solved('Normal playback is working now','Every tested speaker played, and you confirmed that the original problem is no longer happening during normal playback.'));
   if(playback==='unknown')return done(support('Check normal playback after the test','Every tested speaker played. Try the source that originally failed and update this answer with whether the original symptom remains.'));
   if(playback==='returned'||symptom==='intermittent')return done(makeResult('intermittent-audio','Check the system while the sound problem is happening','Every tested speaker played, but you described a problem that comes and goes. A passing test between episodes does not isolate that fault.',['When it happens again, note whether Audio still opens and stations change.','If Audio opens, repeat the speaker test during the fault and update these answers. Record popping or distortion in a short video if possible.',contactStep],'Do not replace speakers simply because normal playback sometimes cuts out.'));
   if(affected==='some')return done(makeResult('speaker-playback','Check the affected speaker positions during playback','Every tested speaker played, but only certain speakers have the problem during normal playback.',['Check balance and fade settings, then compare the same positions on FM and phone audio.','Note whether those positions are silent or distorted and send us the results.',contactStep],'A passing tone test does not explain a position-specific playback problem.'));
   if(sources==='radio')return done(makeResult('radio-source','Focus on radio reception and playback','The speaker test played at every position, and the problem affects AM / FM only.',['Compare several known local FM stations.','If the problem remains across stations while phone audio works, have the radio reception path and ACM checked.',contactStep],'The working phone audio and test tones do not point to a complete amplifier failure.'));
   if(symptom==='noise')return done(makeResult('acm-noise','Check the ACM for the popping or distortion','Popping or distortion across radio and phone playback can be an ACM symptom, even when every speaker plays test tones.',['Record the noise and note whether it occurs at all speakers or only some.','Have the ACM audio output checked while the noise is present before choosing a replacement.',contactStep],'Passing test tones do not rule out a fault that occurs during normal playback.'));
   return done(makeResult('audio-playback','Check why normal playback is silent','Every speaker played test tones, but both radio and phone playback are still silent. The test showed the speakers could play at that time; it did not explain the loss of normal audio.',['Check mute and volume during normal FM playback.','If playback remains silent, have the ACM output and any amplifier input checked during the fault.',contactStep],'This result does not justify replacing all speakers or identify an ACM versus amplifier fault.'));
  }
  if(sources==='radio')return done(support('Confirm the speaker test result','You reported that phone audio works, but no test tones played. Repeat the test using the guide and confirm it actually started. Tell us whether phone audio still works afterward before treating this as a loss of all audio.'));
  const premium=ask('premium');if(!premium)return done();
  if(premium==='aftermarket')return done(makeResult('aftermarket-audio','Check the aftermarket audio installation','Audio controls respond, but no speaker test tones played. Added audio equipment needs checks specific to its installation.',['Have the installer check the added amplifier, interfaces, and connections.','Include the equipment names and whether it previously worked when contacting us.',contactStep],'The factory ACM/amplifier symptom patterns alone cannot diagnose an aftermarket installation.'));
  const volume=ask('volumeBehavior');if(!volume)return done();
  const tried=ask('acmTried');if(!tried)return done();
  if(tried==='fixed')return done(solved('Replacing the ACM restored audio','You reported that the replacement ACM fixed the original problem.'));
  if(premium==='premium'&&(tried==='unchanged'||(symptom==='silent'&&affected==='all'&&volume==='erratic')))return done(makeResult('amplifier-check','Check the factory amplifier next',tried==='unchanged'?'Audio controls work, no test tones played, and a tested replacement ACM did not change the problem. The factory amplifier is the next component to check.':'Audio opens and stations change, but there is no sound and the volume control responds unusually. This matches the pattern in amplifier faults we have seen.',['Have the factory amplifier’s power, ground, connections, and audio input/output checked before replacing it.',contactStep],'A silent speaker test alone cannot distinguish an ACM fault from an amplifier fault.'));
  return done(makeResult('audio-system','Check the ACM and amplifier audio path','No speaker test tones played even though Audio controls respond. Both an ACM fault and an amplifier fault can cause this result.',[tried==='unchanged'?'A tested replacement ACM made no difference. Confirm whether a separate amplifier is installed and check its operation next.':premium==='premium'?'Have the ACM output and factory amplifier input/output checked to locate where audio is lost.':'Confirm whether a separate amplifier is installed, then have the ACM output and any amplifier checked.',contactStep],'No test sound does not mean all the speakers failed. The available answers do not distinguish the ACM from the amplifier.'));
 }
 if(state.problem==='screen'){
  const symptom=ask('screenSymptom');if(!symptom)return done();
  if(symptom==='damage')return done(makeResult('screen-damage','Arrange a screen damage assessment','A reset cannot repair cracked glass or physical display damage. Contact us with a photo and your vehicle’s year and model.',[contactStep,'Confirm the correct display or digitizer repair before ordering.'],'Physical damage does not rule out an additional electrical or connection problem.'));
  if(symptom==='unknown')return done(support('Show us what the screen is doing','Send a photo or video. Tell us whether the picture is missing, the screen is flashing, or only touch is affected.'));
  let replacement=null;
  if(symptom==='black'){
   replacement=ask('blackReplacement');if(!replacement)return done();
   if((afterInstall||replacement==='unchanged')&&!installationChecks())return done(result);
  }
  if(symptom==='flicker'){
   const type=ask('restartType');if(!type)return done();
   if(type==='display')return done(screen());
   if(type==='unknown')return done(support('Distinguish screen flashing from Sync restarting','Watch whether the same screen returns and music keeps playing, or the startup logo returns and the whole system reloads. Send a short video if you are not sure.'));
   if(afterInstall&&!installationChecks())return done(result);
  }
  if(!resetChecks())return done(result);
  if(['dead','phantom'].includes(symptom))return done(makeResult('digitizer','The digitizer is the likely cause',symptom==='dead'?'The picture is visible, but touch still does not respond after a soft reset. This is a typical digitizer symptom.':'The screen acts as though someone is touching it, and the problem remains after a soft reset. This is a typical digitizer symptom.',['Contact us with a photo or short video so we can confirm the appropriate digitizer repair or replacement screen.','Have the touchscreen connections checked before repair.'],'The digitizer is the touch-sensitive layer of the screen.'));
  if(symptom==='black'&&replacement==='unchanged')return done(makeResult('display-check','Check the display next','The screen was black before the APIM replacement and remains black after checking the main connections and trying a soft reset. The display is the next component to investigate.',['Contact us with these results and the details of the APIM replacement.','Have the display and its connection checked before replacing another APIM.'],'An unchanged black screen after an APIM replacement points us toward the display, but does not confirm it has failed.'));
  if(symptom==='black')return done(apim('A black screen that remains after a soft reset is the most common APIM failure symptom we see. Audio often continues to play even when the APIM has failed.'));
  return done(apim('The whole Sync system restarts, rather than just losing its picture, and a soft reset did not provide a lasting fix. This usually points to the APIM.'));
 }
 if(state.problem==='sync'){
  const symptom=ask('syncSymptom');if(!symptom)return done();
  if(symptom==='unknown')return done(support('Describe what happens after startup','Tell us whether Sync freezes, gets stuck on the logo, responds slowly, restarts, or forgets saved settings and phones.'));
  if(afterInstall&&['frozen','logo','reboot'].includes(symptom)&&!installationChecks())return done(result);
  if(!resetChecks())return done(result);
  const descriptions={frozen:'Sync remains frozen after a soft reset.',logo:'Sync remains stuck on the startup logo after a soft reset.',slow:'Sync remains slow or laggy after a soft reset.',reboot:'Sync keeps restarting after a soft reset.',settings:'Settings still do not save after a soft reset.',prompts:'Startup prompts such as 911 Assist return every time, even after a soft reset.',phones:'Sync still forgets paired phones after a soft reset.'};
  return done(apim(descriptions[symptom]+' This is a typical APIM failure symptom we see.'));
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
 return done(makeResult('apim',feature==='carplay'?'The APIM is the likely cause':'Check the APIM next','The connection still fails with two compatible phones after checking permissions, a data cable, the phone port, a soft reset, hub power, and the data connections.'+(feature==='carplay'?' At this stage, the APIM is usually the cause in the CarPlay cases we see.':''),['Contact us with these results to review the APIM and confirm the appropriate replacement.','Include any recent installation or software changes.'],'USB hubs and harnesses rarely fail in the cases we see, but these checks cannot conclusively isolate the failed component.',{label:'View APIM replacements',href:products.apim}));
}
const origins={original:'Original factory infotainment system',smi:'Upgraded / replaced system from Simply Michigan Infotainment',elsewhere:'Upgraded / replaced elsewhere',unknown:'Not sure'};
const triggers={unknown:'Not sure / no obvious change',installation:'After installation or replacement',update:'After a software update',battery:'After battery work or a flat battery',other:'Another change'};
// Intake choices collect vehicle context; they do not determine product fitment.
const vehicleModels={Ford:['C-Max','EcoSport','Edge','Escape','Expedition','Expedition MAX','Explorer','F-150','F-250','F-350','F-450','Fiesta','Flex','Focus','Fusion','Mustang','Ranger','Taurus','Transit'],Lincoln:['Aviator','Continental','Corsair','MKC','MKS','MKT','MKX','MKZ','Nautilus','Navigator']};
const latestModelYear=new Date().getFullYear()+1;
const modelYears=[...Array.from({length:latestModelYear-2008+1},(_,i)=>String(latestModelYear-i)),'2007 or earlier','Not sure'];
const issueStarted=['Today','2–7 days ago','1–4 weeks ago','1–6 months ago','More than 6 months ago','Since installation / replacement','Not sure'];
function contextComplete(s){return ['year','model','started'].every(k=>typeof s[k]==='string'&&s[k].trim())&&Object.hasOwn(triggers,s.trigger);}
const freshState=()=>({step:0,origin:'',order:'',year:'',model:'',started:'',trigger:'',problem:'',system:'Not sure/Other system',currentCheck:'',answers:{}});
const progressKey='sm-troubleshooting-progress-v2';
function restoreProgress(raw,now=Date.now()){
 const clean=freshState();
 if(!raw||raw.version!==2||!Number.isFinite(raw.saved)||now-raw.saved>86400000||raw.saved>now+60000||!raw.state)return clean;
 const saved=raw.state;
 if(Object.hasOwn(origins,saved.origin))clean.origin=saved.origin;
 if(systems.includes(saved.system))clean.system=saved.system;
 for(const key of ['model','started'])if(typeof saved[key]==='string')clean[key]=saved[key].slice(0,120);
 if(typeof saved.year==='string'&&(/^\d{4}$/.test(saved.year)||modelYears.includes(saved.year)))clean.year=saved.year;
 if(clean.origin==='smi'&&/^SM[0-9]{1,18}$/.test(saved.order||''))clean.order=saved.order;
 if(Object.hasOwn(triggers,saved.trigger))clean.trigger=saved.trigger;
 if(problems.some(p=>p[0]===saved.problem))clean.problem=saved.problem;
 if(saved.answers&&typeof saved.answers==='object')for(const [id,q] of Object.entries(questions))if(q.options.some(o=>o.value===saved.answers[id]))clean.answers[id]=saved.answers[id];
 const flow=plan(clean),visible=new Set(flow.questions.map(q=>q.id));for(const id of Object.keys(clean.answers))if(!flow.questions.some(q=>q.id===id&&q.options.some(o=>o.value===clean.answers[id])))delete clean.answers[id];
 if(typeof saved.currentCheck==='string'&&visible.has(saved.currentCheck))clean.currentCheck=saved.currentCheck;
 clean.step=Number.isInteger(saved.step)?Math.max(0,Math.min(3,saved.step)):0;
 if(!clean.origin||!contextComplete(clean))clean.step=0;else if(clean.step>1&&!clean.problem)clean.step=1;else if(clean.step===3&&!plan(clean).result)clean.step=2;
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
 function contextSelect(key,placeholder,groups){
  const selected=state[key],values=groups.flatMap(g=>g.options.map(o=>o.value));
  const item=o=>'<option value="'+escape(o.value)+'" '+(selected===o.value?'selected':'')+'>'+escape(o.label)+'</option>';
  return '<select data-context="'+key+'" required><option value="">'+escape(placeholder)+'</option>'+
   (selected&&!values.includes(selected)?item({value:selected,label:selected+' (previously entered)'}):'')+
   groups.map(g=>(g.label?'<optgroup label="'+escape(g.label)+'">':'')+g.options.map(item).join('')+(g.label?'</optgroup>':'')).join('')+'</select>';
 }
 function contextFields(){
  const choices=values=>[{options:values.map(value=>({value,label:value}))}];
  const models=Object.entries(vehicleModels).map(([make,models])=>({label:make,options:models.map(model=>({value:make+' '+model,label:make+' '+model}))}));
  models.push({options:[{value:'Other / not listed',label:'Other / not listed'},{value:'Not sure',label:'Not sure'}]});
  return '<section class="sm-context-details" aria-labelledby="sm-other-info"><h3 id="sm-other-info">Other information</h3><p class="sm-question-help">Please complete each field. Choose “Not sure” if you don’t know.</p><div class="sm-context-fields">'+
   '<label>Model year'+contextSelect('year','Select model year',choices(modelYears))+'</label>'+
   '<label>Make and model'+contextSelect('model','Select make and model',models)+'</label>'+
   '<label>When did the issue first start?'+contextSelect('started','Select when it started',choices(issueStarted))+'</label>'+
   '<label>Did it follow a change?'+contextSelect('trigger','Select an answer',[{options:Object.entries(triggers).map(([value,label])=>({value,label}))}])+'</label></div></section>';
 }

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
   body.innerHTML='<div class="sm-result-label">Your next step</div><div class="sm-result" data-result="'+r.code+'"><h3>'+escape(r.title)+'</h3><p>'+escape(r.description)+'</p><p class="sm-result-note">'+escape(r.note)+'</p></div>'+usedGuides.map(guideLink).join(' ')+'<div class="sm-next-title">'+(r.code==='resolved'?'What to do next':'Recommended next steps')+'</div><ol class="sm-next">'+r.steps.map(x=>'<li>'+escape(x)+'</li>').join('')+'</ol><div class="sm-actions sm-result-buttons">'+(r.product?'<a class="sm-button sm-secondary" href="'+r.product.href+'" target="_blank" rel="noopener">'+escape(r.product.label)+' ↗</a>':'')+'<a class="sm-button" data-action="help" href="'+contact+'">'+(r.code==='apim'&&state.origin==='smi'?'Get order support':'Get personalized help')+' →</a></div><button type="button" class="sm-back" data-action="back">← Review answers</button><details class="sm-result-summary"><summary>Preview what we’ll receive</summary><p>Your answers and the guidance below will accompany your message when you choose Get personalized help.</p><pre>'+escape(summary())+'</pre></details><div class="sm-actions"><button type="button" class="sm-button sm-secondary" data-action="copy">Copy results</button><button type="button" class="sm-button sm-restart" data-action="reset">↻ Start over</button></div><p class="sm-copy-status" role="status"></p><textarea class="sm-summary" aria-label="Your troubleshooting summary" readonly hidden></textarea>';
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
  if(action.dataset.action==='next'){if(state.step===0){if(!state.origin)return;for(const input of body.querySelectorAll('input,select'))if(!input.checkValidity()){const details=input.closest('details');if(details)details.open=true;input.reportValidity();return;}}if(state.step===1&&!state.problem)return;if(state.step===2&&!plan(state).result)return;state.step=Math.min(3,state.step+1);if(state.step===2&&!plan(state).questions.length)state.step=3;}
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
