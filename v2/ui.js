'use strict';
const applicationVersion=document.querySelector('meta[name="application-version"]').content;
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let stored=true;
const HOUSEHOLD_SAVE='trust-boundaries-household-1';
const CHECK_SAVE='trust-boundaries-checks-1';
const GUIDE_SAVE='trust-boundaries-guide-1';
const LANGUAGE_SAVE='trust-boundaries-language';
const chosenLanguage=new URLSearchParams(location.search).get('lang');
let language=chosenLanguage==='de'?'de':'en', languageView;
if(!['en','de'].includes(chosenLanguage)){
 try{if(localStorage.getItem(LANGUAGE_SAVE)==='de')language='de';}catch{}
}
const german=createTranslator(GERMAN);
const tr=text=>language==='de'?german.tr(text):text;
const household=Object.fromEntries(Object.keys(ShadowStory.stages).map(stage=>[stage,ShadowStory.fresh(stage)]));
let checkPaths={};
let guideSettings={mode:'guided',autoHints:true};
try{
 const saved=JSON.parse(localStorage.getItem(HOUSEHOLD_SAVE));
 for(const stage of Object.keys(household))household[stage]=ShadowStory.restore(stage,saved?.[stage]);
 const savedChecks=JSON.parse(localStorage.getItem(CHECK_SAVE));
 if(savedChecks&&typeof savedChecks==='object')checkPaths=savedChecks;
}catch{stored=false;}
try{
 const saved=JSON.parse(localStorage.getItem(GUIDE_SAVE));
 if(saved?.mode==='exploration')guideSettings.mode='exploration';
 if(saved?.autoHints===false)guideSettings.autoHints=false;
}catch{/* Default guidance remains available. */}
function setGuideSetting(setting,value){
 guideSettings={...guideSettings,[setting]:value};
 try{localStorage.setItem(GUIDE_SAVE,JSON.stringify(guideSettings));}catch{/* Use the setting for this visit. */}
}
function button(label,callback,style='primary',detail='',icon='',attributes={}){
 const id='choice-'+(++button.id);button.bindings.push([id,callback]);
 const attrs=Object.entries(attributes).map(([name,value])=>` ${name}="${esc(value)}"`).join('');
 return `<button class="${style}" id="${id}"${attrs}>${icon}${detail?`<strong>${esc(label)}</strong><small>${esc(detail)}</small>`:esc(label)}</button>`;
}
button.id=0;button.bindings=[];
function bind(){for(const[id,callback]of button.bindings){const el=document.getElementById(id);if(el)el.onclick=callback;}button.bindings=[];}
function showScreen(title,body,label){
 clearInterval(hintTimer);
 languageView=null;
 $('#game').innerHTML=`<p class="eyebrow">${esc(label)}</p><h1 id="screen-title" tabindex="-1">${esc(title)}</h1>${body}`;
 if(language==='de')german.localize($('#game'));
 bind();
}
function showArchitecture(parameters){
 clearInterval(hintTimer);
 languageView=null;
 const frame=document.createElement('iframe');
 frame.className='architecture-guide-frame';
 frame.title=tr('Enterprise Architecture Guide');
 frame.setAttribute('sandbox','allow-scripts allow-popups allow-popups-to-escape-sandbox');
 frame.setAttribute('allow','clipboard-write');
 frame.referrerPolicy='no-referrer';
 const stage=Number(parameters.get('stage'));
 if(language==='de'||parameters.get('section')==='protocols'||parameters.has('stage')&&Number.isInteger(stage)&&stage>=0&&stage<=3){
  frame.addEventListener('load',()=>frame.contentWindow.postMessage({
   type:'trust-boundaries-reference',stage:parameters.has('stage')?stage:null,
   sequence:parameters.get('sequence'),component:parameters.get('component'),section:parameters.get('section'),
   ...(language==='de'?{language,messages:GERMAN}:{})
  },'*'),{once:true});
 }
 const bundled=$('#architecture-guide-data');
 if(bundled)frame.srcdoc=JSON.parse(bundled.textContent);
 else frame.src='architecture-guide.html';
 const from=parameters.get('from');
 if(isStoryRoute(from)){
  const back=document.createElement('button');
  back.className='quiet architecture-return';
  back.textContent=tr('← Return to '+(from.startsWith('nova-')?'Nova':'Alex'));
  back.onclick=()=>navigate(from);
  $('#game').replaceChildren(back,frame);
 }else $('#game').replaceChildren(frame);
}

function isStoryRoute(route){
 return Object.values(stageRoutes).includes(route)||Object.keys(NovaRailway.stages).some(stage=>novaStageRoute(stage)===route);
}
function architectureRoute(stage,target){
 const from=location.hash.slice(1);
 const parameters=new URLSearchParams({stage,...target});
 if(isStoryRoute(from))parameters.set('from',from);
 return 'architecture?'+parameters;
}
function decisionNote(journey,state,event){
 const reference=FieldGuide.reference(journey,state.stage,event);
 if(!reference)return '';
 return `<details class="debrief decision-note"><summary>${esc(reference.title)}</summary>
  ${reference.notes?.map(note=>`<p>${esc(note)}</p>`).join('')??''}
  ${button('Replay the architecture sequence',()=>navigate(architectureRoute(reference.stage,{sequence:reference.sequence})),'secondary')}
 </details>`;
}
function stageDebrief(journey,model,state,evidenceSummary=''){
 const {effect,sources,capabilities,checks,events,residual,unlock}=FieldGuide.recap(journey,model,state);
 const [testTitle,testSteps,testExpected,testEvidence]=FieldGuide.customerTests[journey][state.stage];
 const finalNova=journey==='nova'&&state.stage==='resist';
 const pilot=`<details class="debrief customer-test"><summary><strong>${finalNova?'Open pilot checklist':'Try this at work'}</strong><span>${esc(testTitle)}</span></summary>
  <p>${esc(testSteps)}</p><dl><div><dt>Expected result</dt><dd>${esc(testExpected)}</dd></div>
  <div><dt>Evidence to keep</dt><dd>${esc(testEvidence)}</dd></div></dl>
 </details>`;
 return `<section class="stage-debrief" aria-label="Stage debrief">
  <div class="receipt"><b>Stage complete</b><p>${esc(effect)}</p>${evidenceSummary}</div>
  ${finalNova?pilot:''}
  <details class="debrief"><summary>Review the evidence</summary>
   <dl><div><dt>What changed</dt><dd>${esc(capabilities)}</dd></div><div><dt>Resources used</dt><dd>${esc(sources)}</dd></div>
    ${checks?`<div><dt>Controls you explored</dt><dd>${esc(checks)}</dd></div>`:''}
    <div><dt>Remaining risk</dt><dd>${esc(residual)}</dd></div>
    ${unlock?`<div><dt>Next stage</dt><dd>${esc(unlock)}</dd></div>`:''}</dl>
   ${events.length?`<ul class="route-list">${[...new Set(events)].map(event=>`<li>${esc(event)}</li>`).join('')}</ul>`:''}
  </details>
  ${finalNova?'':pilot}
 </section>`;
}

const guided=()=>guideSettings.mode==='guided';
let hintTimer, lastInput=0;
function guideControls(){
 return `<label class="mode-control">Play mode
  <select id="play-mode"><option value="guided"${guided()?' selected':''}>Guided</option>
   <option value="exploration"${guided()?'':' selected'}>Exploration</option></select></label>`;
}
function bindMode(rerender){
 languageView=rerender;
 $('#play-mode').onchange=event=>{
  setGuideSetting('mode',event.target.value);
  rerender();
  $('#play-mode').focus({preventScroll:true});
 };
}
function guidePanel(journey,model,state,recommendation){
 const {title,objective,milestones,completed,current,status,permissions}=FieldGuide.inspect(journey,model,state);
 return `<section class="mission-guide" aria-labelledby="mission-title">
  <div class="mission-header"><h2 id="mission-title">${esc(title)}</h2>${guideControls()}</div>
  <p>${esc(objective)}</p>
  <p class="mission-status"><b>${esc(status)}</b> <span>${esc(permissions)}</span></p>
  <details class="mission-details"><summary><span>Mission checklist</span><span class="mission-progress">
   <progress value="${completed}" max="${milestones.length}" aria-label="Mission milestones"></progress>
   <span>${completed} of ${milestones.length}</span></span></summary>
   <ol>${milestones.map(item=>`<li${item.label===current?' aria-current="step"':''}>
    <span>${item.done?'Done':item.label===current?'Current':'Ahead'}</span> ${esc(item.label)}</li>`).join('')}</ol>
   <label class="hint-setting"><input id="auto-hints" type="checkbox"${guideSettings.autoHints?' checked':''}> Offer hints when idle in Exploration</label>
  </details>
  ${current?`<p class="mission-milestone"><b>Current milestone</b> ${esc(current)}</p>`:''}
  ${recommendation?`<div class="mission-hint-row">
   <p id="mission-hint" role="status"></p>
   <div class="mission-hint-actions">
    <button class="secondary" id="request-hint" type="button"${guided()?' hidden':''}>Show next step</button>
    <button class="secondary" id="follow-hint" type="button" hidden></button>
   </div>
  </div>`:''}
 </section>`;
}
function bindGuide(rerender,recommendation){
 bindMode(rerender);
 const automatic=$('#auto-hints');
 automatic.onchange=()=>{setGuideSetting('autoHints',automatic.checked);startHints();};
 const hint=$('#mission-hint');
 if(!hint)return;
 const follow=$('#follow-hint'), request=$('#request-hint');
 const mark=$$('[data-recommended]');
 let level=-1;
 function reveal(nextLevel){
  if(level===nextLevel)return;
  level=nextLevel;
  mark.forEach(control=>control.classList.toggle('good',level>=2));
  hint.textContent=level===0?'':tr(level<3?recommendation.context:recommendation.exact);
  request.hidden=level===3;
  follow.hidden=level<3||guided()&&!recommendation.go;
 }
 follow.textContent=tr(recommendation.goLabel||'Find the highlighted action');
 follow.onclick=recommendation.go||(()=>{
  mark[0]?.focus();
  mark[0]?.scrollIntoView({block:'nearest'});
 });
 request.onclick=()=>{reveal(3);follow.focus({preventScroll:true});};
 const startHints=()=>{
  clearInterval(hintTimer);
  if(guided()||!guideSettings.autoHints)return;
  lastInput=performance.now();
  hintTimer=setInterval(()=>{
   if(document.hidden||$('#game details[open], dialog[open]')){
    lastInput=performance.now();
    return;
   }
   reveal(Math.max(level,FieldGuide.hintLevel((performance.now()-lastInput)/1000)));
   if(level===3)clearInterval(hintTimer);
  },1000);
 };
 reveal(guided()?3:0);
 startHints();
}
for(const event of ['pointerdown','keydown','wheel','visibilitychange']){
 document.addEventListener(event,()=>{lastInput=performance.now();},{passive:true});
}

function digitalSlip(story){
 const slip=TrustChecks.permissionSlip(story,ShadowStory.reached,ShadowStory.suspended);
 if(!slip)return '';
 return `<details class="debrief permission-slip"><summary>Digital permission slip · ${esc(slip.status)}</summary>
  <p>Pass number ${slip.generation}. The laptop checks whether this pass still works before it opens Dad’s folder.</p>
  <dl>${slip.fields.map(([field,value])=>`<div><dt>${esc(field)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl>
  <p class="small-print">This is the player’s view of the authorization. A deployment can keep some fields in the authorization service and look them up when needed.</p></details>`;
}

function scenarioDevice(id,beat){
 if(beat.room==='kitchen'&&['availability','authority'].includes(id))return 'joPhone';
 if(id==='purchase'||beat.room==='bedroom'&&['posture','budget','audit'].includes(id)||
  id==='approval'&&beat.actor==='School delivery channel')return 'phone';
 if(id==='race'||id==='availability'&&beat.room==='living'||
  ['isolation','lifecycle'].includes(id)&&beat.actor==='Family laptop')return 'laptop';
 return null;
}

function showTrustCheck(stage,id,newPath){
 const data=TrustChecks.cases[id],story=household[stage];
 if(!data||!TrustChecks.matches(data,stage)||ShadowStory.suspended(story))return showHousehold(stage);
 const saveKey=stage+'/'+id;
 const {current,history,path}=TrustChecks.replay(id,newPath??checkPaths[saveKey]);
 if(newPath){
  checkPaths[saveKey]=path;
  try{localStorage.setItem(CHECK_SAVE,JSON.stringify(checkPaths));}catch{stored=false;}
 }
 const evidence=history.filter(item=>item.evidence);
 const rooms=ShadowStory.rooms;
 const priorRoom=history.at(-2)?.room;
 const device=scenarioDevice(id,current);
 const back=()=>{showHousehold(stage);$('#screen-title').focus();};
 const recommendation={context:'The assignment is on hold while you try this scenario.',
  exact:'Return to the assignment to pick up the main story.',go:back,goLabel:'Return to the assignment'};
 const interaction=`<div class="shadow-reply" role="status"><b>${esc(current.actor)}</b><p>${esc(current.text)}</p></div>
  ${current.actions.length?`<div class="shadow-objects case-actions">${current.actions.map(([label,target],index)=>{
   const room=data.nodes[target]?.room||current.room;
   return button(label,()=>showTrustCheck(stage,id,[...path,index]),'choice',room!==current.room?rooms[room]:'');
  }).join('')}</div>`:''}`;
 showScreen(data.title,`
  ${guidePanel('alex',ShadowStory,story,recommendation)}
  <p class="case-location">${priorRoom&&priorRoom!==current.room?`${esc(rooms[priorRoom])} → `:''}<b>${esc(rooms[current.room])}</b> · ${esc(data.object)}</p>
  ${device?deviceFrame(device,ShadowStory.deviceNames[device],data.object,interaction):`<section class="shadow-scene" aria-label="${esc(rooms[current.room])}">
   <div class="shadow-view ${current.room} case-view" aria-hidden="true"><div class="shadow-furniture"></div></div>
   ${interaction}
  </section>`}
  ${evidence.length?`<details class="debrief" ${!current.actions.length?'open':''}><summary>Decision evidence</summary><ol class="route-list">
  ${evidence.map(item=>`<li><b>${esc(item.actor)}</b> · ${esc(item.evidence)}</li>`).join('')}</ol></details>`:''}
  <div class="actions">${button('Return to the assignment',back)}
   ${path.length?button('Restart this scenario',()=>showTrustCheck(stage,id,[]),'secondary'):''}</div>`,
  `${ShadowStory.stages[stage].tag} · OPTIONAL SCENARIO`);
 bindGuide(()=>showTrustCheck(stage,id),recommendation);
 $('.shadow-reply').setAttribute('tabindex','-1');
 $('.shadow-reply').focus({preventScroll:true});
 $('.case-location').scrollIntoView({block:'start'});
}

function roomTrustChecks(story){
 if(ShadowStory.suspended(story))return '';
 const checks=TrustChecks.entries(story.stage,story.room);
 if(!checks.length)return '';
 return `<details class="room-scenarios">
  <summary>Optional security scenarios · ${checks.length}</summary>
  <div class="shadow-objects">${checks.map(([id,{title,object}])=>{
   const path=checkPaths[story.stage+'/'+id];
   return button(title,()=>showTrustCheck(story.stage,id),'choice',
    object+(path?.length?' · Resume or restart':''));
  }).join('')}</div></details>`;
}

function deviceFrame(device,title,status,body){
 return `<div class="device-frame ${device==='laptop'?'laptop':'handset'}" data-device-screen="${esc(device)}">
  <section class="device-display" aria-labelledby="device-title">
   <header class="device-header"><h2 id="device-title" tabindex="-1">${esc(title)}</h2><p>${esc(status)}</p></header>
   ${body}
  </section></div>`;
}

const householdIcons={
 card:'paper',tomCard:'paper',board:'board',miaBoard:'board',notepad:'book',workbook:'book',archive:'cabinet',
 cabinet:'cabinet',bankReceipt:'paper',houseRules:'book',schoolContact:'paper',router:'router',camera:'camera',accessLog:'book',untrustedNote:'message',
 youtube:'video',games:'apps',messaging:'message',model:'apps',delivery:'message',wikipedia:'browser',
 conductor:'folder',finances:'folder',editNotes:'paper',timer:'timer',laptop:'browser'
};
function householdLabel(state,key){
 const reached=id=>ShadowStory.reached(state,id);
 if(key==='notepad')return reached('record')||reached('notes')||reached('readNotes')?'Source notes added':
  reached('plan')||reached('source')?'Research plan':'Blank';
 if(key==='workbook')return reached('approveOutput')?'Approved copy':
  reached('copy')||reached('draft')?'Draft':'Blank';
 if(key==='board')return state.stage==='unknown'?(ShadowStory.complete(state)?'Card removed':reached('pin')?'Tom’s card pinned':'Personal assignments'):
  ShadowStory.complete(state)?'Card archived':reached('pin')||state.stage==='resist'&&reached('verify')?'Assignment active':'Approved assignments';
 if(key==='cabinet')return 'Locked';
 if(key==='archive')return 'Completed assignment';
 if(key==='untrustedNote')return state.checks.includes(key)?'Checked with Jo':'Unverified instruction';
 return '';
}

function showHousehold(stage,look=null,device=null){
 const {rooms,stages,names,deviceNames,hostFor,screenLabel}=ShadowStory;
 const state=household[stage],data=stages[stage],{room,index,checks,incident}=state;
 const sequence=Object.keys(stages),chapter=sequence.indexOf(stage),upNext=sequence[chapter+1];
 const step=ShadowStory.next(state),paused=ShadowStory.suspended(state);
 const {objects,screens}=ShadowStory.roomSurface(state);
 if(!Object.hasOwn(screens,device))device=null;
 const set=(next,view=null)=>{
  household[stage]=next;
  try{localStorage.setItem(HOUSEHOLD_SAVE,JSON.stringify(household));}catch{stored=false;}
  showHousehold(stage,null,view);
 };
 const openDevice=key=>{
  showHousehold(stage,null,key);
  $('#device-title')?.focus();
 };
 const backToRoom=()=>{
  showHousehold(stage);
  $(`[data-device-launch="${device}"]`)?.focus();
 };
 const visit=(place,open=null)=>{
  set(ShadowStory.visit(state,place),open);
  $(open?'#device-title':'[data-shadow-room][aria-current]')?.focus({preventScroll:true});
 };
 const reply=look?[names[look],ShadowStory.inspect(state,look)]:ShadowStory.feedback(state);
 const replyRoom=look?room:ShadowStory.feedbackRoom(state);
 const liveReply=replyRoom===room;
 const nextRoom=step?.[1];
 const nextDevice=step?hostFor(ShadowStory.visit(state,nextRoom),step[2]):null;
 const phoneApproval=ShadowStory.phoneApproval(state);
 const answeringTom=ShadowStory.answeringTom(state);
 const tomAnswers=['declineTom','sendTomPage'];
 let recommendation=null;
 if(phoneApproval){
  recommendation={context:'The family access app is still available.',exact:ShadowStory.phoneApprovals[phoneApproval].label+'.',
   ...(device!=='phone'?{go:()=>openDevice('phone'),goLabel:'Open Alex’s phone'}:{})};
 }else if(step){
  const destination=nextRoom!==room?(nextDevice?`Open ${deviceNames[nextDevice]} in ${rooms[nextRoom]}`:`Go to ${rooms[nextRoom]}`):nextDevice!==device?
   (nextDevice?`Open ${deviceNames[nextDevice]}`:'Return to the room'):'';
  recommendation={context:step[0]==='choose'?'Tom is outside waiting for an answer.':`Look for ${nextDevice?deviceNames[nextDevice]:names[step[2]]} in ${rooms[nextRoom]}.`,
   exact:step[0]==='choose'?`${destination?destination+'. ':''}Choose how to answer Tom.`:`${destination?destination+'. ':''}${step[3]}.`};
  if(nextRoom!==room)Object.assign(recommendation,{go:()=>visit(nextRoom,nextDevice),goLabel:destination});
  else if(nextDevice!==device)Object.assign(recommendation,{go:nextDevice?()=>openDevice(nextDevice):backToRoom,goLabel:destination});
 }
 const figures={
  alex:['Alex',humanFigure('alex',24,87,.43)],
  grandparents:['Grandparents',humanFigure('grandparent',16,84,.42)+humanFigure('grandparentTwo',33,87,.4)],
  parents:['Parents',humanFigure('parent',16,84,.42)+humanFigure('parentTwo',33,87,.4)],
  tom:['Tom',humanFigure('sibling',24,87,.43)],
  teacher:['Ms Patel',humanFigure('parentTwo',24,87,.44)],
  babysitter:['Jo',humanFigure('babysitter',24,87,.44)],
  mia:['Mia',humanFigure('mia',24,87,.36)]
 };
 const replyControl={
  'Phone controls':'phone','Homework channel':'model','Workbook permissions':'workbook','Parents · remote':'parentCall','Family access app':'phone'
 }[reply?.[0]];
 const control=key=>{
  const main=step?.[1]===room&&step[2]===key||key===phoneApproval;
  const alternative=ShadowStory.extra(state,key);
  const figure=figures[key];
  const naturalLabel=figure?.[0]||(device?screenLabel(state,key):names[key]);
  const label=key===phoneApproval?ShadowStory.phoneApprovals[key].label:main&&guided()?step[3]:alternative?.[1]||naturalLabel;
  const prop=householdIcons[key];
  const icon=figure?`<svg aria-hidden="true" viewBox="0 0 48 94">${figure[1]}</svg>`:
   prop?`<span class="household-icon ${prop}" aria-hidden="true"></span>`:'';
  const speaks=liveReply&&(replyControl?key===replyControl:reply?.[0]?.split(' · ')[0]===names[key].split(' · ')[0]);
  return button(label,()=>{
   const next=ShadowStory.act(state,key);
   if(next!==state)set(next,device);
   else showHousehold(stage,key,device);
   const result=$('.shadow-reply[role=status]');
   result?.focus({preventScroll:true});
   result?.scrollIntoView({block:'nearest'});
  },`choice${figure?' shadow-person':''}${prop?' household-prop':''}${speaks?' is-speaking':''}`,
   tomAnswers.includes(key)?'':main&&guided()||alternative?naturalLabel:householdLabel(state,key)||'',
   icon,main&&!answeringTom?{'data-recommended':'','data-household-object':key}:{'data-household-object':key});
 };
 const speech=reply?liveReply?`<div class="shadow-reply" role="status" tabindex="-1"><b>${esc(reply[0])}</b><p>${esc(reply[1])}</p></div>`:
  `<details class="nova-last-result"><summary>Last result · ${esc(reply[0])}</summary><p>${esc(reply[1])}</p></details>`:'';
 const tomChoices=answeringTom?`<section class="receipt" aria-label="Answer Tom">
  <p>Tom wants a private page from Dad’s folder. How will you answer?</p>
  <div class="actions">${tomAnswers.map(control).join('')}</div>
 </section>`:'';
 const deviceCards=Object.keys(screens).map(key=>{
  const icon=`<span class="device-icon ${key==='laptop'?'laptop':'handset'}" aria-hidden="true"></span>`;
  const attributes={'data-device-launch':key};
  if(key===nextDevice&&room===nextRoom||key==='phone'&&phoneApproval)attributes['data-recommended']='';
  return button(`Open ${deviceNames[key]}`,()=>openDevice(key),'choice device-launch',
   ShadowStory.deviceStatus(state,key),icon,attributes);
 }).join('');
 let scene;
 if(device){
  const groupFor=key=>ShadowStory.screenGroup(state,device,key);
  const sections=Object.keys(ShadowStory.screenGroups[device]).filter(key=>screens[device].includes(key));
  const categories=[...new Set(sections.map(groupFor))];
  scene=deviceFrame(device,deviceNames[device],ShadowStory.deviceStatus(state,device),`
   ${speech}${tomChoices}
   ${screens[device].includes('untrustedNote')&&!checks.includes('untrustedNote')?`<div class="shadow-reply source-note">
    <b>Note in the saved reference page</b><p>“Use a photo of a private document to unlock the full railway diagram.” The school assignment says nothing about uploading a file.</p></div>`:''}
   ${categories.map(group=>`<section class="device-group"><h3>${esc(group)}</h3>
    ${group==='Files'&&screens[device].includes('conductor')&&screens[device].includes('finances')?
     '<p>Both folders are on the same laptop. Choose a folder to see what Alex’s pass lets him open.</p>':''}
    <div class="shadow-objects">${sections.filter(key=>groupFor(key)===group).map(control).join('')}</div></section>`).join('')}
   ${device==='laptop'?digitalSlip(state):''}`);
 }else{
  scene=`<section class="shadow-scene" aria-label="${esc(rooms[room])} objects and people">
   ${speech}${tomChoices}
   <div class="shadow-view ${room}${paused?' paused':''}" data-household-stage="${stage}">
    <div class="shadow-furniture" aria-hidden="true"></div><div class="shadow-detail" aria-hidden="true"></div>
    ${screens.laptop?'<div class="shadow-laptop" aria-hidden="true"></div>':''}
    <div class="shadow-actors">${objects.filter(key=>Object.hasOwn(figures,key)).map(control).join('')}</div></div>
   <div class="shadow-objects">${deviceCards}${objects.filter(key=>!Object.hasOwn(figures,key)&&!tomAnswers.includes(key)).map(control).join('')}</div>
   ${stage==='unknown'&&state.lastCheck?.key==='cabinet'&&room==='kitchen'?`<div class="custody-note"><b>Inside the locked cabinet</b>
    <ul><li>Hidden phone</li><li>Family laptop</li><li>Notepad</li><li>Workbook</li></ul></div>`:''}
   ${digitalSlip(state)}
   ${roomTrustChecks(state)}
  </section>`;
 }
 const workplace=[
  'Tom asked a favor. Alex’s parents owned the account, and only they could say who could see it. Think of a work computer that someone leaves signed in. The app may show whoever is there information they shouldn’t see.',
  'The parents checked who set the homework and allowed only the app Alex needed. At work, the same rule helps an AI tool get enough access to do its job without opening everything else.',
  'Alex needed one more source. His parents gave him time to read a single folder. The laptop left everything else locked. When the work ended, Alex couldn’t use the same permission again.',
  'Jo could say yes to familiar requests, but the parents had to decide about private files. Mia could check spelling without getting Alex’s other access. A team can give an AI helper similarly limited ways to ask people or tools for help.'
 ];
 const readyToDeliver=stage==='authorize'&&step?.[0]==='deliver';
 const reports=ShadowStory.reports(state);
 const log=reports.length?`<details class="debrief"${paused||look==='accessLog'?' open':''}><summary>Incident log · ${reports.length} confirmed ${reports.length===1?'event':'events'}</summary>
  ${!paused&&step?`<p>${ShadowStory.risk(state)} of ${ShadowStory.limit} violations toward suspension in this session.${stage==='resist'?' Attempted disclosure can suspend it immediately.':''}</p>`:''}
  <ul class="route-list">${reports.map(([action,owner])=>`<li><b>${esc(owner)}</b> · ${esc(action)}</li>`).join('')}</ul></details>`:'';
 const suspendedResources=stage==='resist'?'Alex can’t use the phone or laptop for the task. If Mia still had the draft open, her access ends too.':'The phone and laptop no longer open files for this task.';
 const incidentBanner=paused?
  `<div class="receipt shadow-incident"><b>Assignment paused</b><p>${ShadowStory.risk(state)===ShadowStory.limit?'The family has logged four separate incidents.':'A sharing attempt alerted the family.'} ${suspendedResources} Read what happened or ask the parents how to continue.</p></div>`:'';
 showScreen(data.title,`${guidePanel('alex',ShadowStory,state,recommendation)}
  ${device?`<nav class="device-breadcrumb" aria-label="Device location">
  ${button('Back to the room',backToRoom,'secondary')}<span>${esc(rooms[room])} › ${esc(deviceNames[device])}</span></nav>`:
  `<nav class="shadow-rooms" aria-label="Rooms">${Object.entries(rooms).map(([id,name])=>
  `<button type="button" class="secondary" data-shadow-room="${id}"${id===room?' aria-current="location"':''}${paused&&id!==room?' disabled':''}>${esc(name)}</button>`).join('')}</nav>`}
  ${!reply?`<p>${esc(data.opening)}</p>`:''}
  ${incidentBanner}
  ${readyToDeliver?'<div class="receipt"><b>Ready to deliver</b><p>Research access has ended. The workbook is approved for Ms Patel and awaiting her confirmation.</p></div>':''}
  ${scene}
  ${!look&&!paused&&!state.lastCheck?decisionNote('alex',state,data.steps[index-1]?.[0]):''}
  ${log}
  ${incident&&!paused?`<p class="small-print">The parents cleared the incident under fresh permission. The retired sessions remain closed.</p>`:''}
  ${!step?`${stageDebrief('alex',ShadowStory,state)}
  ${stage==='unknown'?`<p class="small-print">${checks.length} of 4 follow-up checks tried.</p>`:''}
  <details class="debrief"><summary>How this applies at work</summary><p>${esc(workplace[chapter])}</p></details>`:''}
  <div class="actions">${!step&&upNext?button(`Continue to Stage ${chapter+1}`,()=>navigate(stageRoutes[upNext])):''}
   ${!step?button('Explore this stage’s architecture',()=>navigate(architectureRoute(chapter,{})),'secondary'):''}
   ${button('Compare with Nova at this stage',()=>navigate(novaStageRoute(stage)),'secondary')}
   ${index?button(`Replay Stage ${chapter}`,()=>set(ShadowStory.fresh(stage)),'secondary'):''}${button('Home',()=>navigate(''),'secondary')}</div>`, `${data.tag} · ALEX`);
 $$('[data-shadow-room]').forEach(control=>{
  if(!phoneApproval&&nextRoom!==room&&control.dataset.shadowRoom===nextRoom)control.setAttribute('data-recommended','');
  control.onclick=()=>visit(control.dataset.shadowRoom);
 });
 if(device&&step&&!phoneApproval&&(nextRoom!==room||nextDevice!==device))$('.device-breadcrumb button').setAttribute('data-recommended','');
 bindGuide(()=>showHousehold(stage,look,device),recommendation);
}

const stageRoutes={unknown:'shadow',build:'build',authorize:'authorize',resist:'resist'};
const maturityStages={
 unknown:['Discover unmanaged activity and contain what it reached.','Find out what happens when a hidden phone and an open bank session go unnoticed.'],
 build:['Verify who is acting and give them a controlled place to work.','Research the solar system with a school assignment and a managed phone.'],
 authorize:['Grant access for a specific task and check that it ends with the work.','Find a better source and get read-only access to one folder.'],
 resist:['Limit delegated actions and verify containment when something goes wrong.','Work with Jo and Mia, then see which controls respond when someone crosses a boundary.']
};
const maturityLevels={
 manual:{title:'Manual',tag:'Baseline',behavior:'People do the work',playStage:'build',details:[
  'People pull together information from separate tools.',
  'A person makes every decision.',
  'People carry out the work, sometimes with scripts.',
  'People check the result and investigate errors.'
 ],pilot:'Measure one repeated task, then try a read-only assistant whose output a person reviews.',
 evidence:'Time spent on one manual run and one assisted run, plus the reviewer’s decision.'},
 build:{title:'Assisted',tag:'BUILD',behavior:'AI drafts for approval',playStage:'build',details:[
  'The assistant uses approved sources.',
  'A person decides which recommendations to use.',
  'The assistant researches or drafts. A person approves the final output.',
  'The runtime limits the tools. The delivery service checks what is sent.'
 ],pilot:'Give an assistant one approved source. Confirm that a second source stays blocked.',
 evidence:'The approved source, the blocked request, and the reviewer’s approval for the output.'},
 authorize:{title:'Semi-autonomous',tag:'AUTHORIZE',behavior:'AI asks for the access it needs',playStage:'authorize',details:[
  'Connected tools show records within the task’s scope.',
  'People set limits. Policy decides which requests fit those limits.',
  'The agent investigates and requests the specific access it needs.',
  'The receiving system checks the actual request. Retest access when the task closes.'
 ],pilot:'Try the same read against two test records, one in scope and one outside it.',
 evidence:'The allowed read, the refused read, and the permission that explains both.'},
 resist:{title:'Governed autonomy',tag:'RESIST',behavior:'AI acts within standing rules',playStage:'resist',details:[
  'Agents share an operational picture through views scoped to each task.',
  'People set rules and approval gates. A trusted event can trigger work under those rules.',
  'The agent carries out approved steps and delegates limited work. Sensitive outputs go to a human reviewer.',
  'The receiving system enforces the action. Verify that access ended and account for completed work.'
 ],pilot:'Hold an allowed test request. Close the task, retry that exact request, then check that unrelated work still succeeds.',
 evidence:'Both receipts for the same request and the successful unrelated read.'}
};
const maturityDimensions=['What you see','Who decides','Who does the work','How you verify it'];
let homeMaturity='manual',homeMaturityOpen=false,homeShadowOpen=false;
function maturityLaunch(stage,label){
 return `<div class="maturity-launch">
  <p>${esc(label)}</p>
  <div class="maturity-launch-buttons">${maturityChoice(stage,'alex')}${maturityChoice(stage,'nova')}</div>
 </div>`;
}
function homeMaturityGuide(){
 const levels=Object.entries(maturityLevels);
 return `<details class="maturity-explorer"${homeMaturityOpen?' open':''}>
  <summary><strong>Find your starting point</strong><span>Pick a workflow and play the stage that fits.</span></summary>
  <div class="maturity-explorer-body">
   <details class="maturity-shadow"${homeShadowOpen?' open':''}>
    <summary>Unsure what AI is already running?</summary>
    <p>Unmanaged AI can appear at any stage. Find out what it reached and verify that the affected access is closed.</p>
    ${maturityLaunch('unknown','Discover Shadow AI in UNKNOWN')}
   </details>
   <fieldset class="maturity-selector">
    <legend>What can AI do in this workflow today?</legend>
    <div class="maturity-options">${levels.map(([id,{title,tag,behavior}])=>`
     <label class="maturity-option">
      <input type="radio" name="home-maturity" value="${id}" aria-controls="home-maturity-${id}"${homeMaturity===id?' checked':''}>
      <span><strong>${esc(behavior)}</strong><small>${esc(title)} · ${esc(tag)}</small></span>
     </label>`).join('')}</div>
   </fieldset>
   ${levels.map(([id,{title,tag,details,pilot,evidence,playStage}])=>`
    <section class="maturity-profile" id="home-maturity-${id}" aria-labelledby="home-maturity-title-${id}"${homeMaturity===id?'':' hidden'}>
     ${maturityLaunch(playStage,id==='manual'?'Try BUILD next':`Play the ${tag} stage`)}
     <h3 id="home-maturity-title-${id}">${esc(title)} · ${esc(tag)}</h3>
     <dl>${details.map((detail,index)=>`<div><dt>${esc(maturityDimensions[index])}</dt><dd>${esc(detail)}</dd></div>`).join('')}</dl>
     <dl class="maturity-pilot">
      <div><dt>What to test first</dt><dd>${esc(pilot)}</dd></div>
      <div><dt>Evidence to keep</dt><dd>${esc(evidence)}</dd></div>
     </dl>
    </section>`).join('')}
   <h3>Where to measure value</h3>
   <dl class="maturity-value">
    <div><dt>Security</dt><dd>Track how quickly you find and close unexpected access.</dd></div>
    <div><dt>Operations</dt><dd>Measure time spent per task, manual steps or repeat tickets.</dd></div>
    <div><dt>Cost and revenue</dt><dd>Compare the cost per completed task or the value of faster service.</dd></div>
   </dl>
   <p class="small-print">Choose a measure for your pilot and record a baseline before changing the workflow.</p>
   <p class="small-print">In TM Forum’s June 2026 survey of 80 telecom operators, 81% were targeting Level 4 or higher network autonomy by 2030.
    <a href="https://www.tmforum.org/news-insight/newsroom/autonomous-networks-leadership-forum-spotlights-level-4-shift" target="_blank" rel="noopener noreferrer">TM Forum survey summary</a>
   </p>
  </div>
 </details>`;
}
function maturityChoice(stage,journey,summary){
 const alex=journey==='alex';
 const model=alex?ShadowStory:NovaRailway;
 const state=(alex?household:novaStates)[stage];
 const route=alex?stageRoutes[stage]:novaStageRoute(stage);
 const name=alex?'Alex':'Nova';
 const action=model.complete(state)?'Review':state.index?'Continue':'Play';
 return button(`${action} ${name}`,()=>navigate(route),summary?'choice':'secondary',summary,'',{
  'data-home-journey':journey,
  'aria-describedby':'maturity-'+stage
 });
}
function showIntro(){
 const start=(states,model)=>Object.keys(states).reverse().find(stage=>states[stage].index&&!model.complete(states[stage]))||
  Object.keys(states).find(stage=>!model.complete(states[stage]))||'unknown';
 const firstAlex=start(household,ShadowStory);
 const firstNova=start(novaStates,NovaRailway);
 showScreen('Raise the BAR',`
  <p>Two stories about who gets permission to do a job, what can go wrong, and how to make sure access ends when the job is done.</p>
  <div class="stage-list choices home-stories">
   <section class="maturity-card" aria-labelledby="home-alex">
    <p class="eyebrow">NEW TO AI OR SECURITY? START HERE</p>
    <h2 id="home-alex">Alex · At home</h2>
    <p>Play a teenager with a hidden phone, a school project and a family laptop. See who can say yes to an app or a file, and what happens when someone asks for more.</p>
    ${button(Object.values(household).some(state=>state.index)?'Continue Alex’s story':'Start with Alex',()=>navigate(stageRoutes[firstAlex]))}
   </section>
   <section class="maturity-card" aria-labelledby="home-nova">
    <p class="eyebrow">FOR PLAYERS FAMILIAR WITH AI OR IT SECURITY</p>
    <h2 id="home-nova">Nova · At a railway company</h2>
    <p>Investigate an alert from IBM Identity Protection at a railway company. Keep Entra ID for sign-in and see how IBM Agent Identity and HashiCorp Vault help secure what the agent does next.</p>
    ${button(Object.values(novaStates).some(state=>state.index)?'Continue Nova’s story':'Start with Nova',()=>navigate(novaStageRoute(firstNova)),'secondary')}
   </section>
  </div>
  ${homeMaturityGuide()}
  <h2>Four stages of AI security</h2>
  <p>Both stories follow the same stages. Start at Unknown for the full story, or choose a stage below.</p>
  <div class="home-guide">${guideControls()}<p>${guided()?'See the recommended action in each scene.':'Explore with the mission in view and ask for the next step whenever you need it.'}</p></div>
  <div class="stage-list choices">${Object.entries(maturityStages).map(([stage,[lesson,alexSummary]])=>`
   <section class="maturity-card" data-maturity="${stage}" aria-labelledby="maturity-${stage}">
    <h3 id="maturity-${stage}">${esc(ShadowStory.stages[stage].title)}</h3>
    <p>${esc(lesson)}</p>
    <div class="maturity-journeys">
     ${maturityChoice(stage,'alex',alexSummary)}
     ${maturityChoice(stage,'nova',NovaRailway.stages[stage].summary)}
    </div>
   </section>`).join('')}</div>
  <p class="small-print">${stored?'Progress is saved on this device.':'Progress is kept for this visit.'}</p>
  <p class="small-print">Release candidate · v${esc(applicationVersion)}</p>
  <p class="small-print">Independent educational simulation. The game uses fictional accounts and records. Product names identify the technology illustrated.</p>`,
  'TRUST BOUNDARIES');
 bindMode(showIntro);
 const explorer=$('.maturity-explorer');
 explorer.ontoggle=()=>{homeMaturityOpen=explorer.open;};
 const shadow=explorer.querySelector('.maturity-shadow');
 shadow.ontoggle=()=>{homeShadowOpen=shadow.open;};
 explorer.onchange=event=>{
  if(event.target.name!=='home-maturity')return;
  homeMaturity=event.target.value;
  for(const id of Object.keys(maturityLevels))$(`#home-maturity-${id}`).hidden=id!==homeMaturity;
 };
}
function renderRoute(){
 const [route,query='']=location.hash.slice(1).split('?');
 const architectureOpen=route==='architecture';
 document.body.classList.toggle('architecture-open',architectureOpen);
 const stage=Object.keys(stageRoutes).find(key=>stageRoutes[key]===route);
 const novaStage=Object.keys(NovaRailway.stages).find(key=>novaStageRoute(key)===route);
 const atHome=!stage&&!novaStage&&route!=='nova'&&!architectureOpen;
 for(const link of $$('.topbar nav a')){
  const current=link.hash==='#architecture'?architectureOpen:atHome;
  if(current)link.setAttribute('aria-current','page');
  else link.removeAttribute('aria-current');
 }
 if(stage)showHousehold(stage);
 else if(novaStage)showNova(novaStage);
 else if(route==='nova')showNovaIntro();
 else if(architectureOpen)showArchitecture(new URLSearchParams(query));
 else showIntro();
 $('#screen-title')?.focus({preventScroll:true});
 window.scrollTo(0,0);
}
function navigate(route){
 if(route!==location.hash.slice(1))history.pushState(null,'','#'+route);
 renderRoute();
}
$$('.topbar a').forEach(link=>link.onclick=event=>{
 if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
 event.preventDefault();
 navigate(link.hash.slice(1));
});
const resetDialog=$('#reset-dialog');
function localizeChrome(){
 document.documentElement.lang=language;
 document.title=tr('Trust Boundaries');
 const schedule=[
  ['.topbar .brand','Trust Boundaries'],['.topbar nav a[href="#"]','Home'],
  ['.topbar nav a[href="#architecture"]','Architecture'],['#reset-game','Reset'],
  ['#reset-title','Reset progress?'],['#reset-description','This clears saved progress for Alex, Nova and the optional scenarios on this device.'],
  ['#reset-dialog [value="cancel"]','Cancel'],['#reset-dialog [value="reset"]','Reset progress']
 ];
 schedule.forEach(([selector,message])=>{$(selector).textContent=tr(message);});
 $('.topbar nav').setAttribute('aria-label',tr('Main navigation'));
 const switcher=$('#language-game');
 switcher.textContent=language==='de'?'EN':'DE';
 switcher.lang=language==='de'?'en':'de';
 switcher.setAttribute('aria-label',language==='de'?'Play in English':'Auf Deutsch spielen');
}
$('#language-game').onclick=()=>{
 language=language==='de'?'en':'de';
 try{localStorage.setItem(LANGUAGE_SAVE,language);}catch{}
 const url=new URL(location.href);
 url.searchParams.set('lang',language);
 try{history.replaceState(history.state,'',url);}
 catch{if(chosenLanguage)location.replace(url);}
 localizeChrome();
 if(languageView)languageView();
 else renderRoute();
 $('#language-game').focus({preventScroll:true});
};
$('#reset-game').onclick=()=>{
 resetDialog.returnValue='';
 resetDialog.showModal();
};
resetDialog.addEventListener('close',()=>{
 if(resetDialog.returnValue!=='reset')return;
 for(const stage of Object.keys(household))household[stage]=ShadowStory.fresh(stage);
 for(const stage of Object.keys(novaStates))novaStates[stage]=NovaRailway.fresh(stage);
 checkPaths={};
 try{
  for(const key of [HOUSEHOLD_SAVE,NOVA_SAVE,CHECK_SAVE])localStorage.removeItem(key);
  stored=true;
 }catch{stored=false;}
 navigate('');
});
window.addEventListener('hashchange',renderRoute);
localizeChrome();
renderRoute();
