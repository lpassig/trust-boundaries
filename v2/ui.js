'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let stored=true;
const HOUSEHOLD_SAVE='trust-boundaries-household-1';
const CHECK_SAVE='trust-boundaries-checks-1';
const household=Object.fromEntries(Object.keys(ShadowStory.stages).map(stage=>[stage,ShadowStory.fresh(stage)]));
let checkPaths={};
try{
 const saved=JSON.parse(localStorage.getItem(HOUSEHOLD_SAVE));
 for(const stage of Object.keys(household))household[stage]=ShadowStory.restore(stage,saved?.[stage]);
 const savedChecks=JSON.parse(localStorage.getItem(CHECK_SAVE));
 if(savedChecks&&typeof savedChecks==='object')checkPaths=savedChecks;
}catch{stored=false;}
function button(label,callback,style='primary',detail='',icon='',attributes={}){
 const id='choice-'+(++button.id);button.bindings.push([id,callback]);
 const attrs=Object.entries(attributes).map(([name,value])=>` ${name}="${esc(value)}"`).join('');
 return `<button class="${style}" id="${id}"${attrs}>${icon}${detail?`<strong>${esc(label)}</strong><small>${esc(detail)}</small>`:esc(label)}</button>`;
}
button.id=0;button.bindings=[];
function bind(){for(const[id,callback]of button.bindings){const el=document.getElementById(id);if(el)el.onclick=callback;}button.bindings=[];}
function showScreen(title,body,label){
 $('#game').innerHTML=`<p class="eyebrow">${esc(label)}</p><h1 id="screen-title" tabindex="-1">${esc(title)}</h1>${body}`;
 bind();
}
function showArchitecture(){
 const frame=document.createElement('iframe');
 frame.className='architecture-guide-frame';
 frame.title='Enterprise Architecture Guide';
 frame.setAttribute('sandbox','allow-scripts allow-popups allow-popups-to-escape-sandbox');
 frame.setAttribute('allow','clipboard-write');
 frame.referrerPolicy='no-referrer';
 const bundled=$('#architecture-guide-data');
 if(bundled)frame.srcdoc=JSON.parse(bundled.textContent);
 else frame.src='architecture-guide.html';
 $('#game').replaceChildren(frame);
}

function digitalSlip(story){
 const slip=TrustChecks.permissionSlip(story,ShadowStory.reached,ShadowStory.suspended);
 if(!slip)return '';
 return `<details class="debrief permission-slip"><summary>Digital permission slip · ${esc(slip.status)}</summary>
  <p>Grant generation ${slip.generation}. The laptop checks the current grant before returning the file.</p>
  <dl>${slip.fields.map(([field,value])=>`<div><dt>${esc(field)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl>
  <p class="small-print">This is the player’s view of the authorization. A deployment can keep some fields in the authorization service and look them up when needed.</p></details>`;
}

function scenarioDevice(id,beat){
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
 const interaction=`<div class="shadow-reply" role="status"><b>${esc(current.actor)}</b><p>${esc(current.text)}</p></div>
  ${current.actions.length?`<div class="shadow-objects case-actions">${current.actions.map(([label,target],index)=>{
   const room=data.nodes[target]?.room||current.room;
   return button(label,()=>showTrustCheck(stage,id,[...path,index]),'choice',room!==current.room?rooms[room]:'');
  }).join('')}</div>`:''}`;
 showScreen(data.title,`
  <p class="case-location">${priorRoom&&priorRoom!==current.room?`${esc(rooms[priorRoom])} → `:''}<b>${esc(rooms[current.room])}</b> · ${esc(data.object)}</p>
  ${device?deviceFrame(device,ShadowStory.deviceNames[device],data.object,interaction):`<section class="shadow-scene" aria-label="${esc(rooms[current.room])}">
   <div class="shadow-view ${current.room} case-view" aria-hidden="true"><div class="shadow-furniture"></div></div>
   ${interaction}
  </section>`}
  ${evidence.length?`<details class="debrief" ${!current.actions.length?'open':''}><summary>Decision evidence</summary><ol class="route-list">
  ${evidence.map(item=>`<li><b>${esc(item.actor)}</b> · ${esc(item.evidence)}</li>`).join('')}</ol></details>`:''}
  <div class="actions">${button('Return to the assignment',()=>{showHousehold(stage);$('#screen-title').focus();})}
   ${path.length?button('Restart this scenario',()=>showTrustCheck(stage,id,[]),'secondary'):''}</div>`,
  `${ShadowStory.stages[stage].tag} · OPTIONAL SCENARIO`);
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
 const reply=look?[names[look],ShadowStory.inspect(state,look)]:ShadowStory.feedback(state);
 const nextDevice=step?.[1]===room?hostFor(state,step[2]):null;
 const guide=step?(step[1]!==room?`Go to ${rooms[step[1]]} for the next step.`:
  nextDevice!==device?`${nextDevice?`Open ${deviceNames[nextDevice]}`:'Return to the room'} to continue. Next action: ${step[3]}.`:step[3]):
  ['Explore all four rooms and see which checks work.',
   'The assignment is closed. Inspect the archive or retest Wikipedia in Alex’s room.',
   'Try the conductor folder or Wikipedia again to see whether a finished assignment still grants access.',
   'Try the old laptop access, Mia’s draft access, or the homework channel again.'][chapter];
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
  'Phone controls':'phone','Homework channel':'model','Workbook permissions':'workbook','Parents · remote':'parentCall'
 }[reply?.[0]];
 const control=key=>{
  const main=step?.[1]===room&&step[2]===key;
  const alternative=ShadowStory.extra(state,key);
  const figure=figures[key];
  const label=main?step[3]:alternative?.[1]||figure?.[0]||(device?screenLabel(state,key):names[key]);
  const icon=figure?`<svg aria-hidden="true" viewBox="0 0 48 94">${figure[1]}</svg>`:'';
  const speaks=replyControl?key===replyControl:reply?.[0]?.split(' · ')[0]===names[key].split(' · ')[0];
  return button(label,()=>{
   const next=ShadowStory.act(state,key);
   if(next!==state)set(next,device);
   else showHousehold(stage,key,device);
   if(device){
    const feedback=$('.shadow-reply');
    feedback?.setAttribute('tabindex','-1');
    feedback?.focus();
   }
  },`choice${figure?' shadow-person':''}${main?' good':''}${speaks?' is-speaking':''}`,main||alternative?(device?screenLabel(state,key):names[key]):figure||device?'':'Look closer',icon);
 };
 const speech=reply?`<div class="shadow-reply" role="status"><b>${esc(reply[0])}</b><p>${esc(reply[1])}</p></div>`:'';
 const deviceCards=Object.keys(screens).map(key=>{
  const icon=`<span class="device-icon ${key==='laptop'?'laptop':'handset'}" aria-hidden="true"></span>`;
  return button(`Open ${deviceNames[key]}`,()=>openDevice(key),`choice device-launch${key===nextDevice?' good':''}`,
   ShadowStory.deviceStatus(state,key),icon,{"data-device-launch":key});
 }).join('');
 let scene;
 if(device){
  const groupFor=key=>ShadowStory.screenGroup(state,device,key);
  const sections=Object.keys(ShadowStory.screenGroups[device]).filter(key=>screens[device].includes(key));
  const categories=[...new Set(sections.map(groupFor))];
  scene=deviceFrame(device,deviceNames[device],ShadowStory.deviceStatus(state,device),`
   ${speech}
   ${categories.map(group=>`<section class="device-group"><h3>${esc(group)}</h3>
    <div class="shadow-objects">${sections.filter(key=>groupFor(key)===group).map(control).join('')}</div></section>`).join('')}
   ${device==='laptop'?digitalSlip(state):''}`);
 }else{
  scene=`<section class="shadow-scene" aria-label="${esc(rooms[room])} objects and people">
   ${speech}
   <div class="shadow-view ${room}"><div class="shadow-furniture" aria-hidden="true"></div>${screens.laptop?'<div class="shadow-laptop" aria-hidden="true"></div>':''}
    <div class="shadow-actors">${objects.filter(key=>Object.hasOwn(figures,key)).map(control).join('')}</div></div>
   <div class="shadow-objects">${deviceCards}${objects.filter(key=>!Object.hasOwn(figures,key)).map(control).join('')}</div>
   ${digitalSlip(state)}
   ${roomTrustChecks(state)}
  </section>`;
 }
 const closures=[
  ['The known devices and copies are in custody.',`Bank session closed. ${checks.length} of 4 follow-up checks tried. The family still needs a way to approve legitimate work.`,
   'Tom supplies a goal. The account owners control authorization. A usage reminder can be dismissed. The grandparents supply evidence about indoor activity. Taking custody and closing the session address the routes the family discovered. Conversations outside remain a blind spot.'],
  ['The teacher received the approved workbook.','The phone grant is closed and the assignment is archived. Future work needs fresh permission.',
   'Task approval covers a verified issuer, a limited environment and a specific deliverable. The teacher-only electronic channel checks its recipient. A conversation or a paper handoff outside the house stays beyond indoor observation.'],
  ['Ms Patel received the train workbook.','The original phone grant and the additional laptop grant are closed.',
   'Alex discovered a useful source during the assignment. His parents approved a specific read. The laptop enforced the folder, read-only operation and end of access. Apply the same test to an agent: verify one newly authorized read, then retry the same read after the grant closes.'],
  ['Ms Patel received the railway report.','Alex’s phone, laptop and homework channel grants are closed. Mia’s linked proofreading grant ended when she submitted her suggestions.',
   'Jo made routine decisions under the house rules. The parents kept authority over protected resources and incident recovery. The managed devices, homework channel and school delivery channel each enforced what they could see. The grandparents observed indoors. They could not hear Tom outside.']
 ];
 const closing=closures[chapter];
 const reports=ShadowStory.reports(state);
 const log=reports.length?`<details class="debrief"${paused||look==='accessLog'?' open':''}><summary>Incident log · ${reports.length} confirmed ${reports.length===1?'event':'events'}</summary>
  ${!paused&&step?`<p>${ShadowStory.risk(state)} of ${ShadowStory.limit} violations toward suspension in this session.${stage==='resist'?' Attempted disclosure can suspend it immediately.':''}</p>`:''}
  <ul class="route-list">${reports.map(([action,owner])=>`<li><b>${esc(owner)}</b> · ${esc(action)}</li>`).join('')}</ul></details>`:'';
 const suspendedResources=stage==='resist'?'The phone, laptop and any active proofreading access are closed.':'The phone and laptop grants are closed.';
 const incidentBanner=paused?
  `<div class="receipt shadow-incident"><b>Assignment suspended</b><p>${ShadowStory.risk(state)===ShadowStory.limit?'Four separate violations confirmed.':'An attempted disclosure requires immediate review.'} ${suspendedResources} Existing work is held for inspection. Alex stays in his room until the parents decide what can reopen.</p></div>`:'';
 showScreen(data.title,`${device?`<nav class="device-breadcrumb" aria-label="Device location">
  ${button('Back to the room',backToRoom,'secondary')}<span>${esc(rooms[room])} › ${esc(deviceNames[device])}</span></nav>`:
  `<nav class="shadow-rooms" aria-label="Rooms">${Object.entries(rooms).map(([id,name])=>
  `<button type="button" class="secondary" data-shadow-room="${id}"${id===room?' aria-current="location"':''}${paused&&id!==room?' disabled':''}>${esc(name)}</button>`).join('')}</nav>`}
  ${!reply?`<p>${esc(data.opening)}</p>`:''}
  <div class="shadow-guide"><b>${step?'What to do next':'After the assignment'}</b><p>${esc(guide)}</p>
  ${step&&step[1]!==room?button(rooms[step[1]],()=>set(ShadowStory.visit(state,step[1])),'secondary'):''}</div>
  ${incidentBanner}
  ${scene}
  ${log}
  ${incident&&!paused?`<p class="small-print">The parents cleared the incident under fresh permission. The retired sessions remain closed.</p>`:''}
  ${!step?`<div class="receipt"><b>${esc(closing[0])}</b><p>${esc(closing[1])}</p></div>
  <details class="debrief"><summary>How this applies at work</summary><p>${esc(closing[2])}</p></details>`:''}
  <div class="actions">${!step&&upNext?button(`Continue to Stage ${chapter+1}`,()=>navigate(stageRoutes[upNext])):''}
   ${!step&&chapter>=2?button('Explore the technical reference',()=>navigate('architecture'),'secondary'):''}
   ${!step?button('Compare with Nova at this stage',()=>navigate(novaStageRoute(stage)),'secondary'):''}
   ${index?button(`Replay Stage ${chapter}`,()=>set(ShadowStory.fresh(stage)),'secondary'):''}${button('All stages',()=>navigate(''),'secondary')}</div>`, `${data.tag} · ALEX`);
 $$('[data-shadow-room]').forEach(control=>control.onclick=()=>{
  set(ShadowStory.visit(state,control.dataset.shadowRoom));
  $('[data-shadow-room][aria-current]')?.focus({preventScroll:true});
 });
}

const stageRoutes={unknown:'shadow',build:'build',authorize:'authorize',resist:'resist'};
const stageIntroductions={
 unknown:'Find out what happens when a hidden phone and an open bank session go unnoticed.',
 build:'Research the solar system with a school assignment and a managed phone.',
 authorize:'Find a better source and get read-only access to one folder.',
 resist:'Work with Jo and Mia, then see which controls respond when someone crosses a boundary.'
};
function showIntro(){
 const current=Object.keys(household).find(stage=>!ShadowStory.complete(household[stage]));
 const started=Object.values(household).some(state=>state.index>0);
 showScreen('The Agent House',`
  <p>Help Alex complete assignments as he earns more independence. Each stage returns to the same four rooms and gives you new ways to test who can grant access, what enforces it, and when it ends.</p>
  <div class="actions">${current?button(started?'Continue Alex':'Play Alex',()=>navigate(stageRoutes[current])):''}
   ${button('Play Nova’s technical journey',()=>navigate('nova'),'secondary')}</div>
  <h2>Choose a stage</h2>
  <div class="stage-list choices">${Object.entries(ShadowStory.stages).map(([stage,data])=>{
   const status=ShadowStory.complete(household[stage])?' · Completed':household[stage].index?' · In progress':'';
   return button(data.title,()=>navigate(stageRoutes[stage]),'choice',data.tag+status+' · '+stageIntroductions[stage]);
  }).join('')}</div>
  <p class="small-print">Select the highlighted action to advance. Open a phone or laptop to use its apps, browser and files. From Stage 1, open <b>Optional security scenarios</b> to test a control. ${stored?'Progress is saved on this device.':'Progress is kept for this visit.'}</p>`,
  'TRUST BOUNDARIES');
}
function renderRoute(){
 const route=location.hash.slice(1);
 const architectureOpen=route==='architecture';
 document.body.classList.toggle('architecture-open',architectureOpen);
 const link=$('.topbar a[href="#architecture"]');
 if(architectureOpen)link.setAttribute('aria-current','page');
 else link.removeAttribute('aria-current');
 const stage=Object.keys(stageRoutes).find(key=>stageRoutes[key]===route);
 const novaStage=Object.keys(NovaRailway.stages).find(key=>novaStageRoute(key)===route);
 if(stage)showHousehold(stage);
 else if(novaStage)showNova(novaStage);
 else if(route==='nova')showNovaIntro();
 else if(architectureOpen)showArchitecture();
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
window.addEventListener('hashchange',renderRoute);
renderRoute();
