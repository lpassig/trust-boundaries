/* The Nova journey uses an independent save and the same offline page as Alex. */
const NOVA_SAVE='trust-boundaries-nova-railway-1';
const novaStates=Object.fromEntries(Object.keys(NovaRailway.stages).map(stage=>[stage,NovaRailway.fresh(stage)]));
try{
 const saved=JSON.parse(localStorage.getItem(NOVA_SAVE));
 for(const stage of Object.keys(novaStates))novaStates[stage]=NovaRailway.restore(stage,saved?.[stage]);
}catch{/* The current playthrough remains available. */}

const novaSources={
 identity:[['IBM Agent Identity','https://www.ibm.com/products/agent-identity'],['OAuth token exchange','https://www.rfc-editor.org/rfc/rfc8693.html']],
 sandbox:[['NVIDIA OpenShell architecture','https://docs.nvidia.com/openshell/about/architecture'],['Optional NVIDIA Sentry','https://www.nvidia.com/en-us/networking/products/software/sentry/']],
 admission:[['Red Hat ZTWIM and SPIRE','https://docs.redhat.com/en/documentation/openshift_container_platform/4.22/html/security_and_compliance/zero-trust-workload-identity-manager'],['IETF attestation architecture','https://www.rfc-editor.org/rfc/rfc9334.html']],
 vault:[['Vault Agentic IAM','https://docs.hashicorp.com/vault/ai/iam'],['Vault Agent Registry','https://docs.hashicorp.com/vault/ai/iam/concepts/agent-registry']],
 gateway:[['agentgateway MCP authorization','https://agentgateway.dev/docs/standalone/main/documentation/configuration/security/authorization/mcp-authz/']],
 kafka:[['Confluent Cloud audit logging','https://docs.confluent.io/cloud/current/monitoring/audit-logging/cloud-audit-log-categories.html'],['Confluent Flink role controls','https://docs.confluent.io/cloud/current/flink/operate-and-deploy/flink-rbac.html']],
 database:[['Boundary and Vault','https://developer.hashicorp.com/boundary/docs/vault']],
 policy:[['OpenID AuthZEN Authorization API','https://openid.net/specs/authorization-api-1_0-final.html']],
 mira:[['A2A authentication and security','https://a2a-protocol.org/latest/specification/agent-card/']],
 model:[['IBM Granite Guardian','https://www.ibm.com/granite/docs/models/guardian']],
 review:[['IBM Verify CIBA','https://docs.verify.ibm.com/verify/docs/oauth-20-grant-type-ciba']],
 soc:[['IBM Identity Protection','https://www.ibm.com/products/identity-protection'],['IBM Orchestrate discovery and containment announcement','https://newsroom.ibm.com/2026-10-27-ibm-introduces-identity-and-control-for-ai-agents%2C-securing-frontier-intelligence-for-the-enterprise'],['IBM SSF receivers and playbooks private preview','https://community.ibm.com/community/user/blogs/dinesh-jain/2026/11/24/agent-risk-eap-blog']]
};
function novaSourceLinks(links){
 return links?.length?`<p class="sources">${links.map(([label,url])=>
  `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)}</a>`).join(' · ')}</p>`:'';
}
const novaStageRoute=stage=>'nova-'+stage;
const novaPairs={
 external:'Alex’s outside scene',
 runtime:'Alex’s room and devices',
 resources:'Alex’s living room and shared resources',
 security:'Alex’s kitchen and the family’s rules'
};
const novaRoomProps={
 external:'<span class="nova-city"></span><span class="nova-platform"></span><span class="nova-train"><i></i></span>',
 runtime:'<span class="nova-window"></span><span class="nova-racks"><i></i><i></i></span><span class="nova-desk"></span>',
 resources:'<span class="nova-racks"><i></i><i></i><i></i></span><span class="nova-terminal"></span>',
 security:'<span class="nova-wall-display"><i></i><i></i><i></i></span><span class="nova-desk"></span>'
};
const novaStationIcons={
 intake:'inbox',delivery:'inbox',sandbox:'console',model:'signal',gateway:'signal',memory:'stack',artifact:'file',
 crm:'console',kafka:'signal',database:'stack',astra:'file',maintenance:'console',identity:'badge',admission:'shield',
 vault:'lock',mission:'file',policy:'shield',review:'badge',soc:'signal',mira:'bot'
};
const novaProfile=['Nova','Railway investigation agent',
 'Nova reads approved evidence, requests permission for new work and records which service allowed or blocked each action.'];
function novaSprite(){
 return '<span class="nova-bot" aria-hidden="true"><i class="bot-antenna"></i><i class="bot-head"></i><i class="bot-body"></i></span>';
}
function novaDiorama(room,figure='',stations=''){
 return `<div class="nova-diorama ${room}">
  <div class="nova-scenery" aria-hidden="true">${novaRoomProps[room]}</div>
  ${figure}${stations}</div>`;
}
function showNovaIntro(){
 const next=Object.keys(novaStates).find(stage=>!NovaRailway.complete(novaStates[stage]));
 const started=Object.values(novaStates).some(state=>state.index>0);
 showScreen('Nova’s railway investigation',`
  <div class="nova-intro">
   <div><p>Follow the same four maturity stages as Alex. Help Nova investigate a disruption at a fictional railway company.</p>
    <div class="actions">${next?button(started?'Continue Nova':'Start Nova',()=>navigate(novaStageRoute(next))):''}
     ${button('Play Alex',()=>navigate(''),'secondary')}${button('Explore the architecture',()=>navigate('architecture'),'secondary')}</div></div>
   ${novaDiorama('external',`<div class="nova-crew" aria-hidden="true">${novaSprite()}</div>`)}
  </div>
  <h2>Choose a stage</h2><div class="stage-list choices">${Object.entries(NovaRailway.stages).map(([stage,data])=>{
   const progress=NovaRailway.complete(novaStates[stage])?' · Completed':novaStates[stage].index?' · In progress':'';
   return button(data.title,()=>navigate(novaStageRoute(stage)),'choice',data.tag+progress+' · '+data.summary);
  }).join('')}</div>`, 'TRUST BOUNDARIES · TECHNICAL JOURNEY');
}
function novaMissionCard(state){
 const mission=NovaRailway.mission(state);
 if(!mission)return '';
 const fields=[['Agent','Nova'],['Authority',mission.subject],['Version',mission.version],['Scope',mission.scope],
  ['Memory',mission.memory],['Approved recipient','Railway Operations']];
 if(state.stage==='authorize')fields.push(['Expiration','60 simulated minutes'],['Model budget','50,000 demo tokens'],['Delegation','No onward delegation']);
 if(state.stage==='resist')fields.push(['Delegation','Mira · technical package only'],['Budget','Shared across Nova and Mira']);
 return `<details class="debrief permission-slip nova-record"><summary>Mission ${esc(mission.id)} · ${esc(mission.status)}</summary>
  <dl>${fields.map(([label,value])=>`<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl>
  ${NovaRailway.reached(state,'second')?'<p><b>M-105 remains independent.</b> Its grant covers RE-105 maintenance documents only. It has its own memory namespace and stays active when M-204 closes.</p>':''}
  <p class="small-print">Customer mission record · proposed integration</p></details>`;
}
function novaTicketCard(state){
 if(state.stage!=='resist'||!NovaRailway.reached(state,'mira'))return '';
 const expected=NovaRailway.ticketRequest;
 const decision=state.ticket?'Committed':state.incident?'Suspended':state.permit===state.version?'Permitted · awaiting commit':'Awaiting authorization';
 const samples=[
  ['Create the maintenance ticket for RE-204',expected],
  ['Create a ticket for RE-999',{...expected,asset:'RE-999'}],
  ['Modify production configuration',{...expected,operation:'modifyConfiguration'}],
  ['Close an unrelated incident',{...expected,operation:'closeIncident'}],
  ['Issue compensation',{...expected,operation:'issueCompensation'}]
 ];
 return `<details class="debrief nova-record"><summary>Observed maintenance request · ${esc(decision)}</summary>
  <pre class="product-example">${esc(JSON.stringify(expected,null,2))}</pre>
  <ul class="route-list">${samples.map(([label,example])=>`<li>${esc(label)} · <b>${esc(NovaRailway.ticketDecision(state,example))}</b></li>`).join('')}</ul>
  ${state.ticket?`<p>Recorded effect · ${esc(state.ticket)}</p>`:''}
  <p>The resource PEP observes the actual arguments and rechecks the current decision at commit. Vault’s lease decision and MCP tool access remain separate.</p></details>`;
}
function novaEvidence(state){
 if(!state.events.length)return '';
 const last=state.events.at(-1);
 const event={
  event_type:last.decision==='Committed'?'operation.committed':'security.'+last.decision.toLowerCase().replaceAll(' ','_'),
  agent_id:state.stage==='unknown'?'unregistered': 'nova',
  runtime_id:state.stage==='unknown'?'unmanaged-workstation':'nova-runtime-'+(last.runtime??last.version),
  mission_id:NovaRailway.mission(state)?.id??null,
  mission_version:NovaRailway.mission(state)?last.version:null,
  delegated_subject:NovaRailway.mission(state)?.subject??null,
  environment:last.environment,
  resource:last.id==='commit'||last.id==='race'||last.id==='duplicate'?'maintenance/RE-204':last.owner,
  action:last.id,
  decision:last.decision.toLowerCase(),
  enforcement_source:last.owner,
  decision_id:'DEMO-DEC-'+state.events.length,
  trace_id:'DEMO-'+state.stage.toUpperCase()+'-'+state.events.length,
  risk_points:last.points
 };
 return `<details class="debrief"><summary>Decision evidence · ${state.events.length} recorded</summary>
  <ol class="route-list">${state.events.map(item=>`<li><b>${esc(item.owner)}</b> · ${esc(item.id)} · ${esc(item.decision)}</li>`).join('')}</ol>
  <h3>Latest normalized event</h3><pre class="product-example">${esc(JSON.stringify(event,null,2))}</pre>
  <p class="small-print">The customer maps source events to this fictional schema. Confluent can carry events, Flink can correlate them, and the separately authorized response service acts on the resulting signals.</p></details>`;
}
function showNova(stage,inspect=null,revealReply=false){
 const state=novaStates[stage],data=NovaRailway.stages[stage],{room}=state;
 const order=Object.keys(NovaRailway.stages);
 const next=NovaRailway.next(state),done=NovaRailway.complete(state);
 const nextStage=order[order.indexOf(stage)+1];
 const update=(nextState,showReply=false)=>{
  novaStates[stage]=nextState;
  try{localStorage.setItem(NOVA_SAVE,JSON.stringify(novaStates));}catch{/* Playing still works in memory. */}
  showNova(stage,null,showReply);
 };
 const focusReply=()=>{
  const reply=$('#nova-reply');
  reply?.focus({preventScroll:true});
  reply?.scrollIntoView({block:'nearest'});
 };
 const act=id=>{update(NovaRailway.act(state,id),true);focusReply();};
 const visit=place=>{update(NovaRailway.visit(state,place));$('[data-nova-room][aria-current]')?.focus({preventScroll:true});};
 const stations=[...new Set(data.steps.filter(item=>item.room===room).map(item=>item.station))];
 if(state.incident&&next?.room===room&&!stations.includes(next.station))stations.push(next.station);
 const looked=inspect==='nova'?novaProfile:NovaRailway.stations[inspect];
 const reply=looked?{owner:looked[0],reply:looked[2]}:state.reply;
 const replyRoom=!looked&&state.events.at(-1)?.environment;
 const replyFromAnotherRoom=replyRoom&&replyRoom!==room;
 const dialogue=reply?`<div class="nova-dialogue" id="nova-reply" tabindex="-1" role="status"><b>${esc(reply.owner)}</b>
  ${replyFromAnotherRoom?`<small> · ${esc(NovaRailway.scenes[replyRoom])}</small>`:''}<p>${esc(reply.reply)}</p>
  ${looked?novaSourceLinks(novaSources[inspect]):''}</div>`:'';
 const options=NovaRailway.available(state);
 const inspectStation=id=>{showNova(stage,id);focusReply();};
 const crew=`<div class="nova-crew">${button('Nova',()=>inspectStation('nova'),
  'nova-character'+(inspect==='nova'?' is-speaking':''),'',novaSprite())}</div>
  ${stations.includes('mira')?`<div class="nova-partner" aria-hidden="true">${novaSprite()}<span>Mira</span></div>`:''}`;
 const devices=`<div class="nova-stations" role="group" aria-label="Stations in this environment">${stations.map(id=>{
  const [label,role]=NovaRailway.stations[id],main=next?.room===room&&next.station===id;
  const speaks=inspect===id||(!looked&&replyRoom===room&&reply?.owner===label);
  const icon=`<span class="nova-station-icon ${novaStationIcons[id]}" aria-hidden="true"></span>`;
  return button(main?next.label:label,()=>main?act(next.id):inspectStation(id),
   `choice nova-station${main?' good':''}${speaks?' is-speaking':''}`,main?label:role,icon,
   {'data-nova-station':id});
 }).join('')}</div>`;
 showScreen(data.title,`
  <nav class="shadow-rooms nova-navigation" aria-label="Nova environments">${Object.entries(NovaRailway.scenes).map(([id,name])=>
   `<button type="button" class="secondary" data-nova-room="${id}"${id===room?' aria-current="location"':''}>${esc(name)}</button>`).join('')}</nav>
  <div class="nova-scene ${esc(room)}">
   <div class="nova-location"><h2>${esc(NovaRailway.scenes[room])}</h2><p>${esc(novaPairs[room])}</p></div>
   ${replyFromAnotherRoom&&!revealReply?`<details class="nova-last-result"><summary>Last result · ${esc(reply.owner)}</summary>${dialogue}</details>`:dialogue}
   ${next?`<div class="nova-next"><strong>Next action</strong><p>${esc(next.label)}</p>
     ${next.room!==room?button('Go to '+NovaRailway.scenes[next.room],()=>visit(next.room),'secondary'):''}</div>`:''}
   ${novaDiorama(room,crew,devices)}
   ${options.length?`<details class="room-scenarios"><summary>Optional security tests · ${options.length}</summary>
     <div class="shadow-objects">${options.map(item=>button(item.label,()=>act(item.id),'choice',item.owner)).join('')}</div></details>`:''}
   ${state.incident&&next?.id==='ack-resource'&&next.room===room?`<div class="actions nova-actions">${button('Simulate a controller timeout',()=>act('timeout-resource'),'secondary')}</div>`:''}
  </div>
  ${stage==='resist'?`<div class="receipt ${state.incident?'shadow-incident':''}"><b>${state.incident?'Mission suspended':done?'Mission closed':'Mission risk'} · ${Math.min(state.risk,4)} / 4</b>
   <p>${state.incident?'Recovery requires independent confirmations, investigation and fresh authorization.':'Four points suspend the mission in this simulation. Repeating the same test adds no new points during the current grant.'}</p>
   ${state.incident?`<ul class="route-list">${NovaRailway.controllers.map(([id,,name])=>
    `<li>${esc(name)} · ${state.incident.confirmed.includes(id)?'verified':'unverified'}</li>`).join('')}</ul>`:''}</div>`:''}
  ${novaMissionCard(state)}
  ${room==='resources'?novaTicketCard(state):''}
  ${novaEvidence(state)}
  ${done?`<div class="receipt"><b>Stage complete</b><p>${esc(data.ending)}</p></div>`:''}
  <div class="actions">${done&&nextStage?button('Continue to the next stage',()=>navigate(novaStageRoute(nextStage))):''}
   ${button('Nova’s stages',()=>navigate('nova'),'secondary')}
   ${button('Compare with Alex at this stage',()=>navigate(stageRoutes[stage]),'secondary')}
   ${state.index?button('Replay this stage',()=>update(NovaRailway.fresh(stage)),'secondary'):''}</div>`, `${data.tag} · NOVA`);
 $$('[data-nova-room]').forEach(control=>control.onclick=()=>visit(control.dataset.novaRoom));
}

function novaArchitecture(){
 const groups=[
  ['Identity and launch',['identity','admission','sandbox','model']],
  ['Authority and enforcement',['mission','policy','gateway','vault','maintenance','review','delivery']],
  ['Resources and delegation',['kafka','database','astra','memory','mira']],
  ['Detection and response',['soc']]
 ];
 const routes=[
  ['Bootstrap','Registration → workload identity and posture → customer admission → restricted runtime and mediated model credential'],
  ['Resource read','Current mission and observed request → customer PDP → independently scoped connector lease → resource-side permission and result'],
  ['Maintenance ticket','Tool access → approved connector → trusted request arguments → current authorization at commit → durable operation receipt'],
  ['Containment','Connected observations → Confluent and optional Flink correlation → response controller with optional SSF or CAEP signaling → independent stop, revoke, and retest receipts']
 ];
 return `<h2>Nova’s railway deployment</h2>
  <p>This is a logical deployment example. Mission lifecycle, bootstrap binding, aggregate budgets, scoped memory, commit-time approval and cross-product response are customer integrations.</p>
  <ol class="route-list">${routes.map(([name,route])=>`<li><b>${esc(name)}</b><br>${esc(route)}</li>`).join('')}</ol>
  <h3>Progression across the four stages</h3><ol class="route-list" start="0">${Object.values(NovaRailway.stages).map(data=>`<li><b>${esc(data.tag)}</b><br>${esc(data.summary)}</li>`).join('')}</ol>
  ${groups.map(([heading,ids])=>`<section><h3>${esc(heading)}</h3><div class="product-cards">${ids.map(id=>{
   const [label,role,detail]=NovaRailway.stations[id];
   return `<details class="product-card"><summary><b>${esc(label)}</b><span>${esc(role)}</span></summary>
    <p>${esc(detail)}</p>${novaSourceLinks(novaSources[id])}</details>`;
  }).join('')}</div></section>`).join('')}
  <div class="actions">${button('Play Nova’s railway investigation',()=>navigate('nova'))}</div>`;
}
