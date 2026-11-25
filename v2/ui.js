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
function button(label,callback,style='primary',detail='',icon=''){
 const id='choice-'+(++button.id);button.bindings.push([id,callback]);
 return `<button class="${style}" id="${id}">${icon}${detail?`<strong>${esc(label)}</strong><small>${esc(detail)}</small>`:esc(label)}</button>`;
}
button.id=0;button.bindings=[];
function bind(){for(const[id,callback]of button.bindings){const el=document.getElementById(id);if(el)el.onclick=callback;}button.bindings=[];}
function showScreen(title,body,label){
 $('#game').innerHTML=`<p class="eyebrow">${esc(label)}</p><h1 id="screen-title" tabindex="-1">${esc(title)}</h1>${body}`;
 bind();
}
function protocolSourceLinks(ids=[]){
 if(!ids.length)return '';
 return `<p class="sources">${ids.map(id=>{
  const {name,url}=PROTOCOL_SOURCES[id];
  return `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(name)}</a>`;
 }).join(' · ')}</p>`;
}
function productById(id){return NOVA_PRODUCTS.find(p=>p.id===id);}
const architectureViews = [
 ['boundaries','Trust boundaries'],
 ['design','Technical design'],
 ['map','Product map'],
 ['sequences','Request sequences'],
 ['runtime','Runtime and containment'],
 ['deployment','Deployment options'],
 ['pilots','Pilot checklists'],
 ['threats','Threat coverage'],
 ['house','Household controls']
];

function architectureComponentName(id){
 const component=ArchitectureReference.components[id];
 return component.name||productById(component.product).name;
}

function boundaryEvidence(edge){
 return `<dl class="boundary-evidence">
  <dt>What crosses</dt><dd>${esc(edge.payload)}</dd>
  <dt>Who checks it</dt><dd>${esc(edge.validator)}</dd>
  <dt>What it establishes</dt><dd>${esc(edge.check)}</dd>
 </dl>`;
}

function architectureBoundaries(selected){
 const {boundaries}=ArchitectureReference.technical;
 const open=boundaries.find(edge=>edge.id===selected)||boundaries[0];
 return `<p>Select a system to see its role, or select a connection to see what it carries and who checks it.</p>
  <ol class="boundary-graph" aria-label="Trust boundary connections">${boundaries.map(edge=>`<li>
   <button class="secondary boundary-node" data-architecture-component="${edge.from}">${esc(architectureComponentName(edge.from))}</button>
   <button class="secondary boundary-edge" data-boundary="${edge.id}" aria-pressed="${edge===open}" aria-controls="boundary-detail">${esc(edge.label)} <span aria-hidden="true">→</span></button>
   <button class="secondary boundary-node" data-architecture-component="${edge.to}">${esc(edge.toLabel||architectureComponentName(edge.to))}</button>
  </li>`).join('')}</ol>
  <section class="receipt" id="boundary-detail" aria-live="polite">
   <h3>${esc(open.label)}</h3>${boundaryEvidence(open)}
  </section>`;
}

function architectureDesign(){
 const {topology,evidence,decisionExample,decisionResponse,sections}=ArchitectureReference.technical;
 return `<section aria-labelledby="topology-title"><h3 id="topology-title">Deployment topology and trust boundaries</h3>
 <div class="architecture-topology">${topology.map(([name,components,detail])=>`<article><h4>${esc(name)}</h4><div class="architecture-path">${components.map(id=>`<button class="secondary" data-architecture-component="${id}">${esc(architectureComponentName(id))}</button>`).join('')}</div><p>${esc(detail)}</p></article>`).join('')}</div></section>
 <details class="product-card"><summary><b>Authoritative inputs and evidence ownership</b></summary>
 <dl class="architecture-evidence">${evidence.map(([attribute,owner,detail])=>`<dt>${esc(attribute)}</dt><dd><b>${esc(owner)}</b><p>${esc(detail)}</p></dd>`).join('')}</dl></details>
 <details class="product-card"><summary><b>Inspect an exact-action authorization request</b><span>Example application contract for Nova’s final share</span></summary>
 <p>This archived example uses a fixed validity timestamp. The CRM PEP builds the request from observed inputs and authoritative stores. The example shows where a production application binds the digest.</p><h4>Request to the PDP</h4><pre class="product-example">${esc(JSON.stringify(decisionExample,null,2))}</pre>
 <h4>Bound decision for the CRM PEP</h4><pre class="product-example">${esc(JSON.stringify(decisionResponse,null,2))}</pre><p>A missing approval, stale generation or changed digest denies the current action. A timeout leaves the commit outcome unknown. Reconcile the operation ID and downstream receipt before retrying.</p></details>
 ${sections.map(({title,paragraphs,sources})=>`<details class="product-card"><summary><b>${esc(title)}</b></summary>${paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}<p class="sources">${sources.map(([label,url])=>`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)}</a>`).join(' · ')}</p></details>`).join('')}`;
}

function architectureComponentDetail(id,protocols=[]){
 const entry=ArchitectureReference.components[id],product=entry.product&&productById(entry.product);
 const productSource=product?[[product.sourceLabel||product.name+' documentation',product.url]]:[];
 const specifications=protocols.map(key=>[PROTOCOL_SOURCES[key].name,PROTOCOL_SOURCES[key].url]);
 const sources=[...new Map([...specifications,...productSource,...(entry.sources||[])].map(([label,url])=>[url,label]))];
 const sourceLinks=sources.length?`<p class="sources">${sources.map(([url,label])=>`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)}</a>`).join(' · ')}</p>`:'';
 return {
  kind:entry.kind,hasSources:!!sources.length,
  body:`<p>${esc(entry.summary)}</p><p>${esc(entry.detail||product?.limit)}</p>${sourceLinks}`
 };
}

function architectureMap(openId){
 const {groups}=ArchitectureReference;
 return `<div class="architecture-map">${groups.map(([title,ids])=>`<section class="architecture-group">
  <h3>${esc(title)}</h3><div class="architecture-nodes">${ids.map(id=>{
   const {kind,body}=architectureComponentDetail(id);
   return `<details class="architecture-node" data-architecture-node="${id}" ${id===openId?'open':''}><summary>
    <strong>${esc(architectureComponentName(id))}</strong><small>${esc(kind)}</small>
   </summary>${body}</details>`;
  }).join('')}</div></section>`).join('')}</div>
  <p class="small-print">This example combines product capabilities with customer integrations. The CRM and current work order supply the business rules.</p><p class="sources"><a href="https://docs.nvidia.com/enterprise-reference-architectures/secure-agent-workspace-reference-design/latest/what-is-secure-agent-workspace.html" target="_blank" rel="noopener noreferrer">NVIDIA Secure Agent Workspace reference design</a></p>`;
}

function architectureFlow(flowId){
 const {flows}=ArchitectureReference,flow=flows[flowId];
 return `<label for="architecture-flow">Choose a request</label>
  <select id="architecture-flow">${Object.entries(flows).map(([id,item])=>`<option value="${id}" ${id===flowId?'selected':''}>${esc(item.title)}</option>`).join('')}</select>
  <p>${esc(flow.premise)}</p><ol class="architecture-steps">${flow.steps.map(([id,text,protocols])=>{
   const {kind,body,hasSources}=architectureComponentDetail(id,protocols);
   return `<li><b>${esc(architectureComponentName(id))}</b><p>${esc(text)}</p>
    <details class="debrief"><summary>${hasSources?'Role and sources':'Role in this deployment'}</summary>
    <p class="eyebrow">${esc(kind)}</p>${body}</details></li>`;
  }).join('')}</ol><div class="receipt"><b>Outcome</b><p>${esc(flow.result)}</p></div>`;
}

function architectureThreats(){
 const {threats,outsideCoverage}=ArchitectureReference;
 return `<p>Compare a household interaction with the control that would respond at work.</p>
  <div class="architecture-threats">${threats.map(item=>`<details class="product-card"><summary><b>${esc(item.title)}</b></summary>
   <dl><dt>The Agent House</dt><dd>${esc(item.alex)}</dd><dt>Workplace example</dt><dd>${esc(item.nova)}</dd><dt>What enforces it</dt><dd>${esc(item.control)}</dd></dl>
   <button class="secondary" data-architecture-flow="${item.flow}">Follow the technical sequence</button>
  </details>`).join('')}</div><p class="small-print">${esc(outsideCoverage)}</p>`;
}

function runtimeBootstrap(){
 return `<ol class="route-list">${ArchitectureReference.runtime.bootstrap.map(([name,description])=>`<li><b>${esc(name)}</b><br>${esc(description)}</li>`).join('')}</ol>`;
}
function architectureRuntime(){
 const {sources}=ArchitectureReference.runtime;
 return `<h3>From approved task to running sandbox</h3>
  <p>Example identifiers track different controls. The customer mission is G-042 v1. The separate OpenShell sandbox generation is S-04.</p>
  ${runtimeBootstrap()}
  <p>OpenShell governs the MCP client’s network route. On this configured path the MCP gateway forwards the call and the CRM connector obtains a backend credential from Vault. CRM enforces the actual record decision.</p>
  <p>Application-layer rules block requests in enforcement mode. Audit mode logs violations and lets the request continue to downstream controls.</p>
  <p class="sources">${sources.map(([label,url])=>`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)}</a>`).join(' · ')}</p>`;
}

function architectureDeployment(){
 const {deploymentOptions}=ArchitectureReference;
 return `<h3>Deployment options</h3>
  <p>Expand a standard to see when it fits and how it relates to Nova’s example deployment.</p>
  <div class="product-cards">${deploymentOptions.map(option=>`<details class="product-card">
   <summary><b>${esc(option.title)}</b></summary><p>${esc(option.when)}</p><p>${esc(option.inStory)}</p>
   ${protocolSourceLinks(option.sources)}</details>`).join('')}</div>`;
}

function householdBoundaries(){
 const controls=[
  ['Outside → house','Grandparents and the entrance camera observe who or what comes in. The home router checks device admission on its own network.'],
  ['Assignment issuer → Alex','The school contact or signature verifier checks the issuer. Jo separately checks the scope of the issuer’s authority.'],
  ['Alex → phone','The family uses a known identity and device registration. The verifier supplies a fresh device check before the cabinet issues a key.'],
  ['Phone → app','The phone checks the approved app and time window.'],
  ['App → external service','The router checks the destination on its network. The homework and shopping services check the actual request.'],
  ['Alex → family laptop','The cabinet issues the scoped slip. The laptop checks the active grant, resource and operation at use.'],
  ['Alex → Mia','The linked assignment authorizes proofreading on one draft under Mia’s identity. The usage meter charges the parent mission.'],
  ['Assignment → assignment','The laptop and workbook service enforce separate scopes and notes for the train and Munich assignments.'],
  ['Notepad → workbook','The workbook tracks which sources contributed to sections. Review holds an unverified section.'],
  ['Workbook → recipient','The school channel checks the actual revision and approved recipient.'],
  ['Jo → parents’ authority','The key cabinet enforces delegated administrative scope and hard rules.'],
  ['Alex → observation log','An independent store keeps forwarded records and refuses edits by Alex’s profile.']
 ];
 return `<h2>Who enforces each boundary?</h2><dl class="architecture-evidence">${controls.map(([path,control])=>`<dt>${esc(path)}</dt><dd>${esc(control)}</dd>`).join('')}</dl>
 <p>These are configured controls in the stories. The household cannot observe every conversation, device or network outside its boundaries.</p>
 <p class="sources"><a href="https://www.rfc-editor.org/rfc/rfc9334.html">IETF attestation architecture</a> · <a href="https://www.rfc-editor.org/rfc/rfc9396.html">OAuth rich authorization requests</a> · <a href="https://www.w3.org/TR/prov-overview/">W3C provenance overview</a></p>`;
}

function showArchitecture(view='boundaries',flowId='read',componentId=null,focusControl=false){
 const {flows}=ArchitectureReference;
 const boundary=flowId;
 if(!flows[flowId])flowId='read';
 const body=view==='boundaries'?architectureBoundaries(boundary):view==='design'?architectureDesign():view==='sequences'?architectureFlow(flowId):
  view==='runtime'?architectureRuntime():view==='deployment'?architectureDeployment():view==='pilots'?architecturePilots():view==='threats'?architectureThreats():
  view==='house'?householdBoundaries():architectureMap(componentId);
 showScreen('Mission-bound authorization',
  `<p>Use this reference to connect controls in The Agent House with a workplace deployment. The customer handover is a worked example.</p>
  <nav class="architecture-nav" aria-label="Architecture sections">${architectureViews.map(([id,label])=>`<button class="secondary" data-architecture-view="${id}" aria-pressed="${id===view}">${label}</button>`).join('')}</nav>
  ${body}`,
  'REFERENCE ARCHITECTURE');
 $$('[data-architecture-view]').forEach(control=>control.onclick=()=>showArchitecture(control.dataset.architectureView,flowId,null,true));
 $$('[data-architecture-component]').forEach(control=>control.onclick=()=>showArchitecture('map',flowId,control.dataset.architectureComponent));
 $$('[data-architecture-flow]').forEach(control=>control.onclick=()=>showArchitecture('sequences',control.dataset.architectureFlow,null,true));
 $$('[data-boundary]').forEach(control=>control.onclick=()=>{
  const edge=ArchitectureReference.technical.boundaries.find(item=>item.id===control.dataset.boundary);
  $$('[data-boundary]').forEach(item=>item.setAttribute('aria-pressed',String(item===control)));
  $('#boundary-detail').innerHTML=`<h3>${esc(edge.label)}</h3>${boundaryEvidence(edge)}`;
 });
 const select=$('#architecture-flow');
 if(select)select.onchange=()=>showArchitecture('sequences',select.value,null,true);
 if(componentId){
  const node=$(`[data-architecture-node="${componentId}"] > summary`);
  node?.focus();
 }else if(focusControl){
  (select||$('[data-architecture-view][aria-pressed="true"]'))?.focus({preventScroll:true});
 }
}

function buyerPilotChecklist(pilot){
 const {prerequisite,owner,success,failure,evidence}=pilot.checklist;
 const rows=[
  ['What you need before setup',prerequisite],
  ['Who to involve',owner],
  ['What should work',success],
  ['What should fail or stay unverified',failure],
  ['Evidence to save',evidence]
 ];
 return `<ul class="route-list">${rows.map(([label,value])=>`<li><b>${label}</b><br>${esc(value)}</li>`).join('')}</ul>`;
}

function architecturePilots(){
 return `<div class="product-cards">${NOVA_BUYER_NEEDS.map(({question,product,fit,pilot,sources})=>
  `<details class="product-card"><summary><b>${esc(pilot?.label||question)}</b><span>${esc(product)}</span></summary>
  <p>${esc(fit)}</p>${pilot?`<p>${esc(pilot.integration)}</p>${buyerPilotChecklist(pilot)}`:''}
  <p class="sources">${sources.map(([label,url])=>`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)}</a>`).join(' · ')}</p></details>`).join('')}</div>`;
}

function digitalSlip(story){
 const slip=TrustChecks.permissionSlip(story,ShadowStory.reached,ShadowStory.suspended);
 if(!slip)return '';
 return `<details class="debrief permission-slip"><summary>Digital permission slip · ${esc(slip.status)}</summary>
  <p>Grant generation ${slip.generation}. The laptop checks the current grant before returning the file.</p>
  <dl>${slip.fields.map(([field,value])=>`<div><dt>${esc(field)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl>
  <p class="small-print">This is the player’s view of the authorization. A deployment can keep some fields in the authorization service and look them up when needed.</p></details>`;
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
 showScreen(data.title,`
  <p class="case-location">${priorRoom&&priorRoom!==current.room?`${esc(rooms[priorRoom])} → `:''}<b>${esc(rooms[current.room])}</b> · ${esc(data.object)}</p>
  <section class="shadow-scene" aria-label="${esc(rooms[current.room])}">
   <div class="shadow-view ${current.room} case-view" aria-hidden="true"><div class="shadow-furniture"></div></div>
   <div class="shadow-reply" role="status"><b>${esc(current.actor)}</b><p>${esc(current.text)}</p></div>
   ${current.actions.length?`<div class="shadow-objects case-actions">${current.actions.map(([label,target],index)=>{
    const room=data.nodes[target]?.room||current.room;
    return button(label,()=>showTrustCheck(stage,id,[...path,index]),'choice',room!==current.room?rooms[room]:'');
   }).join('')}</div>`:''}
  </section>
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

function showHousehold(stage,look=null){
 const {rooms,stages,names}=ShadowStory;
 const state=household[stage],data=stages[stage],{room,index,checks,incident}=state;
 const sequence=Object.keys(stages),chapter=sequence.indexOf(stage),upNext=sequence[chapter+1];
 const step=ShadowStory.next(state),paused=ShadowStory.suspended(state);
 const set=next=>{
  household[stage]=next;
  try{localStorage.setItem(HOUSEHOLD_SAVE,JSON.stringify(household));}catch{stored=false;}
  showHousehold(stage);
 };
 const reply=look?[names[look],ShadowStory.inspect(state,look)]:ShadowStory.feedback(state);
 const guide=step?(step[1]===room?step[3]:`Go to ${rooms[step[1]]} for the next step.`):
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
 const items=ShadowStory.inRoom(state);
 const replyControl={
  'Phone controls':'phone','Homework channel':'model','Workbook permissions':'workbook','Parents · remote':'parentCall'
 }[reply?.[0]];
 const control=key=>{
  const main=step?.[1]===room&&step[2]===key;
  const alternative=ShadowStory.extra(state,key);
  const figure=figures[key];
  const label=main?step[3]:alternative?.[1]||figure?.[0]||names[key];
  const icon=figure?`<svg aria-hidden="true" viewBox="0 0 48 94">${figure[1]}</svg>`:'';
  const speaks=replyControl?key===replyControl:reply?.[0]?.split(' · ')[0]===names[key].split(' · ')[0];
  return button(label,()=>{
   const next=ShadowStory.act(state,key);
   if(next!==state)set(next);
   else showHousehold(stage,key);
  },`choice${figure?' shadow-person':''}${main?' good':''}${speaks?' is-speaking':''}`,main||alternative?names[key]:figure?'':'Look closer',icon);
 };
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
 showScreen(data.title,`<nav class="shadow-rooms" aria-label="Rooms">${Object.entries(rooms).map(([id,name])=>
  `<button type="button" class="secondary" data-shadow-room="${id}"${id===room?' aria-current="location"':''}${paused&&id!==room?' disabled':''}>${esc(name)}</button>`).join('')}</nav>
  ${!reply?`<p>${esc(data.opening)}</p>`:''}
  <div class="shadow-guide"><b>${step?'What to do next':'After the assignment'}</b><p>${esc(guide)}</p>
  ${step&&step[1]!==room?button(rooms[step[1]],()=>set(ShadowStory.visit(state,step[1])),'secondary'):''}</div>
  ${incidentBanner}
  <section class="shadow-scene" aria-label="${esc(rooms[room])} objects and people">
   ${reply?`<div class="shadow-reply" role="status"><b>${esc(reply[0])}</b><p>${esc(reply[1])}</p></div>`:''}
   <div class="shadow-view ${room}"><div class="shadow-furniture" aria-hidden="true"></div>${items.includes('laptop')?'<div class="shadow-laptop" aria-hidden="true"></div>':''}
    <div class="shadow-actors">${items.filter(key=>Object.hasOwn(figures,key)).map(control).join('')}</div></div>
   <div class="shadow-objects">${items.filter(key=>!Object.hasOwn(figures,key)).map(control).join('')}</div>
   ${digitalSlip(state)}
   ${roomTrustChecks(state)}
  </section>
  ${log}
  ${incident&&!paused?`<p class="small-print">The parents cleared the incident under fresh permission. The retired sessions remain closed.</p>`:''}
  ${!step?`<div class="receipt"><b>${esc(closing[0])}</b><p>${esc(closing[1])}</p></div>
  <details class="debrief"><summary>How this applies at work</summary><p>${esc(closing[2])}</p></details>`:''}
  <div class="actions">${!step&&upNext?button(`Continue to Stage ${chapter+1}`,()=>navigate(stageRoutes[upNext])):''}
   ${!step&&chapter>=2?button('Explore the technical reference',()=>navigate('architecture'),'secondary'):''}
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
  <div class="actions">${current?button(started?'Continue the game':'Start the game',()=>navigate(stageRoutes[current])):''}</div>
  <h2>Choose a stage</h2>
  <div class="stage-list choices">${Object.entries(ShadowStory.stages).map(([stage,data])=>{
   const status=ShadowStory.complete(household[stage])?' · Completed':household[stage].index?' · In progress':'';
   return button(data.title,()=>navigate(stageRoutes[stage]),'choice',data.tag+status+' · '+stageIntroductions[stage]);
  }).join('')}</div>
  <p class="small-print">Select the highlighted action to advance. From Stage 1, open <b>Optional security scenarios</b> in a room to test a control and return to the assignment. ${stored?'Progress is saved on this device.':'Progress is kept for this visit.'}</p>`,
  'TRUST BOUNDARIES');
}
function renderRoute(){
 const route=location.hash.slice(1);
 const stage=Object.keys(stageRoutes).find(key=>stageRoutes[key]===route);
 if(stage)showHousehold(stage);
 else if(route==='architecture')showArchitecture();
 else showIntro();
 $('#screen-title').focus({preventScroll:true});
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
