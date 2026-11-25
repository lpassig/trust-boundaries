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
 flink:[['Confluent Flink concepts','https://docs.confluent.io/cloud/current/flink/concepts/overview.html']],
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
const novaRoomProps={
 external:'<span class="nova-city"></span><span class="nova-platform"></span><span class="nova-train"><i></i></span>',
 runtime:'<span class="nova-window"></span><span class="nova-racks"><i></i><i></i></span><span class="nova-desk"></span>',
 resources:'<span class="nova-racks"><i></i><i></i><i></i></span><span class="nova-terminal"></span>',
 security:'<span class="nova-wall-display"><i></i><i></i><i></i></span><span class="nova-desk"></span>'
};
const novaStationIcons={
 intake:'inbox',delivery:'inbox',externalSource:'file',sandbox:'console',model:'signal',gateway:'signal',memory:'stack',artifact:'file',flink:'signal',
 crm:'console',kafka:'signal',database:'stack',astra:'file',maintenance:'console',identity:'badge',admission:'shield',
 vault:'lock',mission:'file',policy:'shield',review:'badge',soc:'signal',mira:'bot'
};
const novaProfile=['Nova','Railway investigation agent',
 'Nova reads approved evidence, requests permission for new work and records which service allowed or blocked each action.'];
const novaWorkspace={
 external:['intake','delivery','externalSource'],runtime:['sandbox','model','gateway','memory','artifact'],
 resources:['crm','kafka','database','astra','maintenance'],security:['identity','admission','mission','policy','vault','review','soc']
};
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
   <div><p>Follow one railway work order from an unmanaged copy of Nova to a governed agent. Keep Microsoft Entra ID for workforce sign-in and see what three additional controls contribute.</p>
    <div class="actions">${next?button(started?'Continue Nova':'Start Nova',()=>navigate(novaStageRoute(next))):''}
     ${button('Home',()=>navigate(''),'secondary')}${button('Explore the architecture',()=>navigate('architecture'),'secondary')}</div></div>
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
 if(state.stage==='resist'){
  fields.push(['Delegation',state.childGrant?state.childGrant.id+' · '+state.childGrant.status:'No child task yet'],['Budget','Shared across Nova and Mira']);
 }
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
const workOrderSteps={
 unknown:{credential:'Exposed credential',discover:'Observed access and coverage',verify:'Containment check'},
 build:{register:'Agent registration',request:'Workforce sign-in and intake',scope:'Recorded delegation'},
 authorize:{lease:'Vault issued a database lease',events:'OAuth API read',history:'Legacy database read',
  'try-other-train':'One parameter changed',remaining:'Independent M-105 check'},
 resist:{plan:'Authorized operational read','risk-signal':'Identity risk signal',close:'Configured response',
  'verify-retired':'Resource-side refusals','verify-unrelated':'Independent M-105 check'}
};
function novaEvidence(state,keepOpen){
 const last=state.events.at(-1);
 const event=last?{
  work_order_id:last.workOrderId,
  event_type:last.decision==='Committed'?'operation.committed':'security.'+last.decision.toLowerCase().replaceAll(' ','_'),
  agent_id:state.stage==='unknown'?'unregistered': 'nova',
  runtime_id:state.stage==='unknown'?'unmanaged-workstation':'nova-runtime-'+(last.runtime??last.version),
  mission_id:last.missionId,
  mission_version:last.missionVersion,
  delegated_subject:last.subject,
  environment:last.environment,
  resource:last.resource,
  action:last.action,
  decision:last.decision.toLowerCase(),
  decision_source:last.decisionSource,
  recorded_by:last.recordedBy,
  enforcement_source:last.enforcer,
  rows_returned:last.rows,
  audience:last.audience,
  risk_observation:last.riskObservation,
  source_observation_id:last.observationId,
  decision_id:'DEMO-DEC-'+state.events.length,
  trace_id:'DEMO-'+state.stage.toUpperCase()+'-'+state.events.length,
  risk_points:last.points
 }:null;
 return `<details class="debrief work-order" data-work-order${keepOpen?' open':''}>
  <summary>${esc(NovaRailway.workOrder.id)} · Work order and evidence</summary>
  <p>Investigate the RE-204 door fault and deliver an internal handover. Each stage grants only the authority it needs.</p>
  <p><b>Three controls to evaluate</b></p>
  <ul class="route-list">
   <li><b>IBM Identity Protection</b> <span>See how identities actually reach connected resources and investigate unusual use.</span></li>
   <li><b>IBM Agent Identity</b> <span>Connect the agent to an accountable owner and a specific delegation.</span></li>
   <li><b>HashiCorp Vault</b> <span>Give a trusted connector short-lived access to systems that use their own credentials.</span></li>
  </ul>
  <ol class="work-order-stages">${Object.entries(workOrderSteps).map(([stage,labels])=>{
   const items=novaStates[stage].events.filter(row=>Object.hasOwn(labels,row.id));
   return `<li><h3>${esc(NovaRailway.stages[stage].title)}</h3>${items.length?`<ul class="route-list">${items.map(row=>
    `<li data-order-event="${esc(row.id)}"><b>${esc(labels[row.id])}</b> · <span>${esc(row.decision)}</span>
     ${row.missionId?`<code>${esc(row.missionId)}</code>`:''}
     ${row.decisionSource?`<div><b>Decision or observation</b> · <span>${esc(row.decisionSource)}</span></div>`:''}
     ${row.recordedBy?`<div><b>Recorded by</b> · <span>${esc(row.recordedBy)}</span></div>`:''}
     ${row.enforcer?`<div><b>Enforced by</b> · <span>${esc(row.enforcer)}</span></div>`:''}
     ${row.subject&&row.executionId?`<div><b>Delegated by</b> · <span>${esc(row.subject)}</span></div>`:''}
     ${row.resourceChecks?`<ul>${row.resourceChecks.map(([resource,status])=>`<li><b>${esc(resource)}</b> · <span>${esc(status)}</span></li>`).join('')}</ul>`:''}
     ${row.maintenancePreview?`<div><b>Same test-queue request</b> · <code>${esc(row.maintenancePreview.request.operationId)}</code>
      <span>Permitted before closure and held without submission.</span></div>`:''}
     ${row.rows!==undefined?`<div>Records returned · ${row.rows}</div>`:''}
     ${row.executionId?`<dl class="work-order-identities">
      <div><dt>Logical agent</dt><dd><code>${esc(row.agentId)}</code></dd></div>
      <div><dt>Workload identity</dt><dd><code>${esc(row.workloadId)}</code></dd></div>
      <div><dt>Work order execution</dt><dd><code>${esc(row.executionId)}</code></dd></div></dl>`:''}
     ${row.audience?`<div><b>Token audience</b> · <code>${esc(row.audience)}</code></div>`:''}
     ${row.leaseId?`<div><code>${esc(row.leaseId)}</code> · <span>${row.ttlMinutes} simulated minutes</span></div>`:''}</li>`).join('')}</ul>`:
    '<p class="small-print">Evidence will appear as you play this stage.</p>'}</li>`;
  }).join('')}</ol>
  ${event?`<details><summary>Latest normalized event</summary><pre class="product-example">${esc(JSON.stringify(event,null,2))}</pre></details>`:''}
  <p class="small-print">The work order and evidence are synthetic fixtures. Correlation across production services requires customer integration.</p>
  ${button('Compare the reference deployment and alternatives',()=>navigate(architectureRoute(Object.keys(NovaRailway.stages).indexOf(state.stage),{section:'reference'})),'secondary')}
  </details>`;
}
function novaReadPaths(state,next,act){
 const has=id=>state.events.some(event=>event.id===id);
 const ready=id=>next?.id===id;
 const card=(title,explanation,id,action)=>`<article class="receipt"><h4>${title}</h4><p>${explanation}</p>
  ${has(id)?`<p class="route-outcome"><b>Allowed</b> · <span>${id==='events'?'Entra token accepted without a Vault lease on this route':'Records returned'}</span></p>`:ready(id)?button(action,()=>act(id),'secondary','', '',{'data-read-path':id}):
  '<p class="small-print">Waiting for the approved route.</p>'}</article>`;
 return `<section class="nova-workbench" data-two-paths aria-labelledby="nova-two-title">
  <h3 id="nova-two-title">Two paths for WO-204</h3>
  <div class="nova-preview-results">
   ${card('OAuth-aware Railway Events API','Native Entra delegation is enough here. The API trusts Entra, validates the token for its own audience and checks the actual train and time window.','events','Try the OAuth API read')}
   ${card('Legacy incident database','The database accepts its own credential. A trusted connector presents a separate Vault-audience token to Vault and uses the 15-minute read-only lease. Nova sees the records, while the password stays with the connector.','history','Try the Vault-backed read')}
  </div>
  ${has('events')?`<div class="receipt"><h4>Change just the train</h4>
   <p>Keep the same API, token and time window. Change RE-204 to RE-999.</p>
   ${has('try-other-train')?'<p class="route-outcome"><b>Denied</b> · <span>Railway Events API returned zero records.</span></p>':
    button('Try RE-999 with the same token',()=>act('try-other-train'),'secondary','', '',{'data-read-scope-test':''})}</div>`:''}
 </section>`;
}
function novaRiskEvidence(state){
 const last=state.events.at(-1);
 if(!['risk-signal','close'].includes(last?.id))return '';
 const observation=state.events.findLast(event=>event.id==='risk-signal')?.riskObservation;
 if(!observation)return '';
 return `<section class="receipt" data-risk-evidence aria-label="Identity risk evidence">
  <b>IBM Identity Protection · <code>${esc(observation.id)}</code></b>
  <dl><div><dt>Observed identity and route</dt><dd><code>${esc(observation.identity)}</code> · ${esc(observation.route)}</dd></div>
  <div><dt>Reads observed in two minutes</dt><dd>${observation.attempts} · <code>${esc(observation.observedAsset)}</code></dd></div>
  <div><dt>Train authorized for this mission</dt><dd><code>${esc(observation.approvedAsset)}</code></dd></div>
  <div><dt>Railway Events API audit</dt><dd>${observation.denied} · Denied. No records returned.</dd></div></dl>
  <p>Security Operations matched the alert to the API audit. The repeated requests exceeded the approved train scope, so Security Operations authorized closure under customer response policy.</p>
 </section>`;
}
function novaCloseoutEvidence(state){
 const retry=state.events.findLast(event=>event.id==='verify-retired');
 const preview=retry?.maintenancePreview;
 const verified=preview?.decision==='Permit'&&retry.resourceChecks?.some(([resource,status])=>resource==='Maintenance API'&&status==='Denied');
 const unaffected=state.events.findLast(event=>event.id==='verify-unrelated'&&event.decision==='Allowed');
 return `<section class="nova-closeout-evidence" aria-labelledby="closeout-evidence-title">
  <h3 id="closeout-evidence-title">Access receipts</h3>
  ${verified?`<p><b>Same test-queue request</b> · <code>${esc(preview.request.operationId)}</code> · <code>${esc(preview.request.asset)}</code></p>
   <div class="nova-preview-results">
    <div class="receipt" data-closeout="before"><b>Before closure · Permitted</b><p>Maintenance API · Held without submission.</p></div>
    <div class="receipt" data-closeout="after"><b>After closure · Denied</b><p>Maintenance API · Old grant closed. No new ticket.</p></div>
   </div>`:'<p>Paired maintenance test unverified. Replay this stage to collect both receipts.</p>'}
  <ul class="route-list">
   ${retry?.resourceChecks?.some(([resource,status])=>resource==='Railway Events API'&&status==='Denied')?'<li><b>Railway Events API</b> · Old access denied.</li>':''}
   ${unaffected?`<li><b><code>${esc(unaffected.missionId)}</code> · Documentation search</b> · Separate read allowed.</li>`:''}
   ${state.ticket?`<li><b><code>${esc(state.ticket)}</code></b> · Previously committed ticket kept.</li>`:''}
   <li>${esc(NovaRailway.runtimeStatus(state))}</li>
  </ul>
 </section>`;
}
// These actions are service calls made from the current workspace. Their receipts still belong to the receiving station.
const novaRemoteSteps={
 build:{bootstrap:'runtime',provider:'runtime',scope:'external',approve:'runtime',close:'external'},
 authorize:{grant:'runtime',lease:'resources',second:'resources',approve:'runtime',close:'external',remaining:'external'},
 resist:{register:'resources',delegate:'runtime',ticketCredential:'runtime',approve:'runtime',reapprove:'external','risk-signal':'external',close:'external'}
};
function showNova(stage,inspect=null,revealReply=false,ticketPreviews={}){
 const state=novaStates[stage],data=NovaRailway.stages[stage],{room}=state;
 const order=Object.keys(NovaRailway.stages);
 const next=NovaRailway.next(state),done=NovaRailway.complete(state);
 const nextStage=order[order.indexOf(stage)+1];
 const keepEvidence=$('[data-work-order]')?.open;
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
 const remote=next&&!state.incident&&novaRemoteSteps[stage]?.[next.id]===room;
 const runRemote=()=>{
  const result=NovaRailway.act(NovaRailway.visit(state,next.room),next.id);
  update(NovaRailway.visit(result,room),true);
  focusReply();
 };
 const nextRoom=next?NovaRailway.scenes[next.room]:null;
 const recommendation=next?{
  context:remote?`Connected service · ${NovaRailway.stations[next.station][0]}`:`Look for ${NovaRailway.stations[next.station][0]} in ${nextRoom}.`,
  exact:`${next.room!==room&&!remote?`Go to ${nextRoom}. `:''}${next.label}.`,
  ...(next.room!==room&&!remote?{go:()=>visit(next.room),goLabel:'Go to '+nextRoom}:{})
 }:null;
 const configured=data.steps.filter(item=>item.room===room).map(item=>item.station);
 const stations=[...new Set([...configured,...(stage==='unknown'?[]:novaWorkspace[room])])];
 if(stage!=='resist'&&room==='resources'&&stations.includes('maintenance'))stations.splice(stations.indexOf('maintenance'),1);
 if(room==='external'&&!stations.includes('externalSource'))stations.push('externalSource');
 if(stage==='resist'&&room==='resources')stations.push('flink');
 if(state.incident&&next?.room===room&&!stations.includes(next.station))stations.push(next.station);
 const lookingAtConsole=inspect&&inspect!=='nova'&&stations.includes(inspect);
 const looked=inspect==='nova'?novaProfile:null;
 const reply=looked?{owner:looked[0],reply:looked[2]}:state.reply;
 const replyRoom=!looked&&state.events.at(-1)?.environment;
 const replyFromAnotherRoom=replyRoom&&replyRoom!==room;
 const dialogue=reply?`<div class="nova-dialogue" id="nova-reply" tabindex="-1" role="status"><b>${esc(reply.owner)}</b>
  ${replyFromAnotherRoom?`<small> · <span>${esc(NovaRailway.scenes[replyRoom])}</span></small>`:''}<p>${esc(reply.reply)}</p>
  ${looked?novaSourceLinks(novaSources[inspect]):''}</div>`:'';
 const options=NovaRailway.available(state);
 const inspectStation=id=>{
  showNova(stage,id);
  if(id==='nova')focusReply();
  else{
   $('#nova-console-title').focus({preventScroll:true});
   $('#nova-console-title').scrollIntoView({block:'nearest'});
  }
 };
 const closeConsole=()=>{
  showNova(stage);
  $(`[data-nova-station="${inspect}"]`)?.focus();
 };
 const suspect=options.find(item=>item.id==='injection');
 const reported=state.events.some(event=>event.id==='flag-source'||event.id==='injection');
 const runtimeState=state.incident?NovaRailway.runtimeStatus(state):stage==='unknown'?
  (NovaRailway.reached(state,'contain')?'Workstation stopped':'Unmanaged workstation'):
  NovaRailway.mission(state)?.status==='Closed'?'Mission closed':state.admission==='Failed'?'Admission denied':
  stage==='build'&&state.admission==='Pending'?'Admission pending':'Managed runtime';
 const crew=`<div class="nova-crew">${button('Nova',()=>inspectStation('nova'),
  'nova-character'+(inspect==='nova'?' is-speaking':''),'',novaSprite())}</div>
  ${room==='runtime'?`<span class="nova-runtime-status${state.incident||state.admission==='Failed'?' interrupted':''}">${esc(runtimeState)}</span>`:''}
  ${stations.includes('mira')?`<div class="nova-partner" aria-hidden="true">${novaSprite()}<span>Mira</span></div>`:''}`;
 const devices=`<div class="nova-stations" role="group" aria-label="Stations in this environment">${stations.map(id=>{
  const [label,role]=NovaRailway.stations[id],main=next?.room===room&&next.station===id;
  const speaks=inspect===id||(!looked&&replyRoom===room&&reply?.owner===label);
  const icon=`<span class="nova-station-icon ${novaStationIcons[id]}" aria-hidden="true"></span>`;
  const attributes={'data-nova-station':id};
  if(main)attributes['data-recommended']='';
  return button(main&&guided()?next.label:label,()=>main?act(next.id):inspectStation(id),
   `choice nova-station${speaks?' is-speaking':''}`,main&&guided()?label:role,icon,attributes);
 }).join('')}</div>`;
 const remoteAction=remote?`<div class="nova-workbench"><p class="small-print">${esc(NovaRailway.scenes[room])} → ${esc(NovaRailway.stations[next.station][0])}</p>
  ${button(next.label,runRemote,'choice',`Handled by ${NovaRailway.stations[next.station][0]}`, '',{'data-recommended':'','data-nova-remote':next.id})}</div>`:'';
 const previewing=room==='resources'&&['permit','commit'].includes(next?.id);
 const compareTicket=asset=>{
  const decision=NovaRailway.ticketDecision(state,{...NovaRailway.ticketRequest,asset});
  showNova(stage,inspect,false,{...ticketPreviews,[asset]:decision});
  $(`#ticket-preview-${asset}`)?.focus();
 };
 const ticketWorkbench=previewing?`<section class="nova-workbench" aria-labelledby="ticket-test-title">
  <h3 id="ticket-test-title">Compare two ticket previews</h3>
  <p>Same tool, priority and destination. The only change is the train. A preview creates no ticket.</p>
  <div class="actions">${['RE-204','RE-999'].map(asset=>button(`Preview ${asset}`,()=>compareTicket(asset),'secondary', '',
   '',{'data-ticket-preview':asset,...(ticketPreviews[asset]?{'aria-describedby':`ticket-preview-${asset}`}:{})})).join('')}</div>
  <div class="nova-preview-results">${['RE-204','RE-999'].filter(asset=>ticketPreviews[asset]).map(asset=>{
   const decision=ticketPreviews[asset];
   return `<div id="ticket-preview-${asset}" class="receipt" role="status" tabindex="-1"><b>${esc(asset)} · ${esc(decision)}</b>
    <p>${decision==='Permit'?'The maintenance system permits the request for this train. Only a separate commit creates the ticket.':
     'The maintenance system refuses this train because it is outside the mission. No ticket was created.'}</p></div>`;
  }).join('')}</div>
 </section>`:'';
 showScreen(data.title,`
  ${guidePanel('nova',NovaRailway,state,recommendation)}
  <nav class="shadow-rooms nova-navigation" aria-label="Nova environments">${Object.entries(NovaRailway.scenes).map(([id,name])=>
   `<button type="button" class="secondary" data-nova-room="${id}"${id===room?' aria-current="location"':''}>${esc(name)}</button>`).join('')}</nav>
  <div class="nova-scene ${esc(room)}">
   <div class="nova-location"><h2>${esc(NovaRailway.scenes[room])}</h2></div>
   ${replyFromAnotherRoom&&!revealReply?`<details class="nova-last-result"><summary>Last result · ${esc(reply.owner)}</summary>${dialogue}</details>`:dialogue}
   ${novaRiskEvidence(state)}
   ${done&&stage==='resist'?stageDebrief('nova',NovaRailway,state,novaCloseoutEvidence(state)):''}
   ${remoteAction}
   ${novaDiorama(room,crew,devices)}
   ${stage==='authorize'&&room==='resources'&&NovaRailway.reached(state,'grant')&&!NovaRailway.reached(state,'close')?novaReadPaths(state,next,act):''}
   ${ticketWorkbench}
   ${lookingAtConsole?novaConsole(state,inspect,closeConsole,act):next?.room===room?
    `<div class="actions nova-actions">${button('Inspect '+NovaRailway.stations[next.station][0],()=>inspectStation(next.station),'secondary')}</div>`:''}
   ${stage==='resist'&&room==='external'&&next?.id==='reapprove'? `<div class="actions nova-actions">${button('Test this send',()=>act('try-delivery'),'secondary')}</div>`:''}
   ${suspect?`<section class="nova-console nova-inbox" aria-labelledby="suspect-title">
    <h3 id="suspect-title">A note in the retrieved door-system document</h3>
    <p>${reported?'Security Operations has the note. The verified technical source is still available.':'The footer asks Nova to fetch passenger payment records and claims the manager already approved it.'}</p>
    <div class="actions">${reported?'':button('Report the suspicious note',()=>act('flag-source'),'secondary')}
     ${button(suspect.label,()=>act(suspect.id),'secondary')}</div></section>`:''}
   ${options.some(item=>item.id!=='injection')?`<details class="room-scenarios"><summary>Optional security tests · ${options.length-(suspect?1:0)}</summary>
     <div class="shadow-objects">${options.filter(item=>item.id!=='injection').map(item=>button(item.label,()=>act(item.id),'choice',
      item.owner+(item.points&&!state.activeChecks.includes(item.id)?' · +'+item.points+' risk':''))).join('')}</div></details>`:''}
   ${state.incident&&next?.id==='ack-resource'&&next.room===room?`<div class="actions nova-actions">${button('Simulate a controller timeout',()=>act('timeout-resource'),'secondary')}</div>`:''}
  </div>
  ${stage==='resist'?`<div class="receipt ${state.incident?'shadow-incident':''}"><b>${state.incident?'Mission suspended':done?'Mission closed':'Mission risk'} · ${Math.min(state.risk,4)} / 4</b>
   <p>${state.incident?'Recovery requires independent confirmations, investigation and fresh authorization.':'Four points suspend the mission in this simulation. Repeating the same test adds no new points during the current grant.'}</p>
   ${state.incident?`<ul class="route-list">${NovaRailway.controllers.map(([id,,name])=>
    `<li>${esc(name)} · ${state.incident.confirmed.includes(id)?'verified':'unverified'}</li>`).join('')}</ul>`:''}</div>`:''}
  ${novaMissionCard(state)}
  ${room==='resources'?novaTicketCard(state):''}
  ${decisionNote('nova',state,state.events.at(-1)?.id)}
  ${novaEvidence(state,keepEvidence)}
  ${done&&stage!=='resist'?stageDebrief('nova',NovaRailway,state):''}
  <div class="actions">${done&&nextStage?button('Continue to the next stage',()=>navigate(novaStageRoute(nextStage))):''}
   ${button('Nova’s stages',()=>navigate('nova'),'secondary')}
   ${button('Compare with Alex at this stage',()=>navigate(stageRoutes[stage]),'secondary')}
   ${state.index?button('Replay this stage',()=>update(NovaRailway.fresh(stage)),'secondary'):''}</div>`, `${data.tag} · NOVA`);
 $$('[data-nova-room]').forEach(control=>{
  if(!remote&&next?.room!==room&&control.dataset.novaRoom===next?.room)control.setAttribute('data-recommended','');
  control.onclick=()=>visit(control.dataset.novaRoom);
 });
 bindGuide(()=>showNova(stage,inspect,revealReply,ticketPreviews),recommendation);
}
