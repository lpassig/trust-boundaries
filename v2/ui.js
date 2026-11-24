'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const SAVE='trust-boundaries-story-v2-1';
let mode='teen',states={teen:StoryRules.fresh(),agent:StoryRules.fresh()},selected=null,sound=false,stored=true,focusReturn=null,hintStage='',hintCount=0,audio,speakingObject='hero';
let roomView='';
try{const raw=JSON.parse(localStorage.getItem(SAVE));if(raw){if(['teen','agent'].includes(raw.mode))mode=raw.mode;for(const key of ['teen','agent'])states[key]=StoryRules.hydrate(raw.states?.[key],key);sound=raw.sound===true;}}catch{stored=false;}
const state=()=>states[mode],episode=()=>mode==='teen'?{...EPISODES.teen,...StoryRules.alexExtra(state())}:EPISODES.agent,teen=()=>mode==='teen',stage=()=>StoryRules.stage(state());
function storyEvent(event){return event;}
function needsShareReapproval(s){
 return !teen()&&s.approval&&s.outgoing==='approved'&&!StoryRules.approvalMatches(s.approval,StoryRules.reportShare(s));
}
const move=()=>{
 const key=stage(),s=state(),base=MOVES[key];
 if(key==='paused'&&s.reviewPending)return teen()
  ?['Hear my parent’s answer','Your parent has heard what happened.','parent']
  :['Hear from Priya','Nova’s access is paused while Priya reviews what happened.','parent'];
 if(key==='source'){
  if(s.source)return ['Add this source',teen()?'Credit the museum page below your timeline.':'Credit the customer records in the handover.',teen()?'schoolApp':'laptop'];
  return teen()?['Open the museum website','Check the dates on the Riverside Museum page.','source']:[...NOVA_MOVES.source,'source'];
 }
 if(key==='send'&&s.outgoing==='changed')return teen()
  ?['Restore Ms Patel’s address','The school submission uses her address from the assignment.','schoolApp']
  :['Restore the reviewer','The CRM send must use the designated reviewer.','laptop'];
 if(key==='send'&&needsShareReapproval(s))return ['Ask Morgan to approve this revision','Show Morgan the current copy before CRM can send it.','reviewer'];
 if(key==='checks'){
  const {next}=closingStep(s,teen());
  const source=StoryInteractions.speechSource(mode,StoryInteractions.closureSource(s,mode));
  return [next[0],next[1]||source.name,teen()&&source.object==='laptop'?'schoolApp':source.object];
 }
 return [...(teen()?base.slice(0,2):NOVA_MOVES[key]),StoryInteractions.nextObject(mode,key,base[2])];
};
const customerNames=ids=>ids.map(id=>NOVA_CUSTOMERS[id]||id).join(', ');
const chapter=()=>!state().pass?0:!state().message?1:!StoryRules.changesResolved(state())?2:3;
const dialog=$('#dialog');
function persist(){try{localStorage.setItem(SAVE,JSON.stringify({mode,states,sound}));stored=true;}catch{stored=false;}$('#save-status').textContent=stored?'Saved on this device':'Progress kept for this visit';}
function toast(text){$('#toast').textContent=text;$('#toast').classList.add('visible');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('#toast').classList.remove('visible'),4800);}
function ping(kind='story'){if(!sound)return;try{audio||=new(window.AudioContext||window.webkitAudioContext)();audio.resume();const o=audio.createOscillator(),g=audio.createGain();o.type='sine';o.frequency.setValueAtTime(kind==='blocked'?220:660,audio.currentTime);o.frequency.exponentialRampToValueAtTime(kind==='blocked'?175:880,audio.currentTime+.16);g.gain.setValueAtTime(.035,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.26);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+.28);}catch{/* Sound is optional. */}}
function syncSpeech(){
 const reference=dialog.open&&dialog.classList.contains('is-reference');
 const inline=dialog.open&&!reference;
 $('#scene-guide').hidden=reference||inline&&dialog.dataset.inspect!=='true';
 $('.scene-frame').classList.toggle('has-conversation',inline);
 $('#scene-dialogue').hidden=inline;
 const active=StoryInteractions.speechSource(mode,speakingObject);
 const last=state().last;
 const passive=StoryInteractions.speechSource(mode,StoryInteractions.eventSource(mode,last?.speaker,last?.action,last?.kind));
 $('#speech-source').textContent=active.name;
 $('#speech-kind').textContent=[active.kind,active.channel].filter(Boolean).join(' · ');
 const reading=$('#dialog-body');
 const scrollable=inline&&reading.scrollHeight>reading.clientHeight+1;
 $('#dialog-scroll').hidden=!scrollable;
 if(scrollable){
  reading.tabIndex=0;
  reading.setAttribute('role','region');
  reading.setAttribute('aria-label','Conversation text');
 }else{
  reading.removeAttribute('tabindex');
  reading.removeAttribute('role');
  reading.removeAttribute('aria-label');
 }
 dialog.dataset.source=active.key;
 $('.scene-frame').classList.toggle('hero-thinking',!reference&&(inline?active:passive).key==='hero');
 $('#objects').classList.toggle('has-conversation',inline);
 const canvas=$('.scene-canvas'),frame=$('.scene-frame');
 const tail=point=>Math.max(8,Math.min(92,(canvas.offsetLeft+canvas.clientWidth*point[0]/1000)/frame.clientWidth*100))+'%';
 dialog.style.setProperty('--speaker-x',tail(active.point));
 $('#scene-dialogue').style.setProperty('--speaker-x',tail(passive.point));
 $$('#pins [data-object]').forEach(b=>b.classList.toggle('is-speaking',inline&&b.dataset.object===(active.object||active.key)));
 $$('#objects [data-object]').forEach(b=>b.classList.toggle('is-speaking',inline&&b.dataset.object===(active.tool||active.object||active.key)));
 const speakingStation=inline?$$('#objects [data-station-panel]').find(panel=>
  [...panel.querySelectorAll('[data-object]')].some(b=>b.dataset.object===(active.tool||active.object||active.key)))?.dataset.stationPanel:null;
 $$('#scene-stations button').forEach(b=>b.classList.toggle('station-speaking',b.dataset.station===speakingStation));
}
function close(){
 stopTrace();
 if(dialog.open)dialog.close();
 syncSpeech();
 const canRestore=focusReturn?.isConnected&&focusReturn!==document.body&&!dialog.contains(focusReturn)&&!focusReturn.closest('[hidden]');
 const target=canRestore?focusReturn:roomView?$('#scene-stations [aria-pressed="true"]'):document.querySelector(`#pins [data-object="${speakingObject}"]`)||$('#next');
 target?.focus();
}
function modal(title,body,label='LOOK CLOSER',reference=false){
 stopTrace();
 if(!dialog.open||!dialog.contains(document.activeElement))focusReturn=document.activeElement;
 if(dialog.open&&dialog.classList.contains('is-reference')!==reference)dialog.close();
 dialog.classList.toggle('is-reference',reference);
 delete dialog.dataset.inspect;
 dialog.classList.toggle('is-architecture',label==='REFERENCE ARCHITECTURE');
 $('#speech-source-row').hidden=reference;
 $('#dialog-actions').innerHTML='';
 $('#dialog-lesson').hidden=true;
 $('#dialog-lesson').open=false;
 const source=StoryInteractions.speechSource(mode,speakingObject);
 const eyebrow=!reference&&[source.name.toLowerCase(),source.kind.toLowerCase()].includes(label.toLowerCase())?'':`<p class="eyebrow">${esc(label)}</p>`;
 $('#dialog-body').innerHTML=`${eyebrow}<h2 id="dialog-title" tabindex="-1">${esc(title)}</h2>${body}`;
 if(!reference){
  for(const group of [...$('#dialog-body').children])if(group.matches('.choices,.actions'))$('#dialog-actions').append(group);
 }
 if(!dialog.open)reference?dialog.showModal():dialog.show();
 syncSpeech();$('#dialog-title').focus({preventScroll:true});dialog.scrollTop=0;$('#dialog-body').scrollTop=0;$('#dialog-actions').scrollTop=0;
}
function button(label,callback,style='primary',detail=''){
 const id='choice-'+(++button.id);button.bindings.push([id,callback]);
 return `<button class="${style}" id="${id}">${detail?`<strong>${esc(label)}</strong><small>${esc(detail)}</small>`:esc(label)}</button>`;
}
button.id=0;button.bindings=[];
function bind(){for(const[id,callback]of button.bindings){const el=document.getElementById(id);if(el)el.onclick=callback;}button.bindings=[];}
function choices(items){return `<div class="choices">${items.map(([title,detail,fn,style])=>button(title,fn,'choice '+(style||''),detail)).join('')}</div>`;}
function show(title,body,label,noteKey){
 modal(title,body,label);
 bind();
 if(noteKey)showNote(noteKey);
 $('.scene-frame').scrollIntoView({block:'start',behavior:'instant'});
 if(roomView||window.matchMedia('(min-width: 561px)').matches){
  dialog.scrollIntoView({block:'nearest',behavior:'instant'});
 }
}
function showReference(title,body,label){modal(title,body,label,true);bind();}
function productDetails(title,entries){
 const items=entries.map(([id,text])=>{
  const p=productById(id);
  return `<li><b>${esc(p.name)}</b> · ${esc(text)} <a href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">Documentation</a></li>`;
 });
 return `<details class="debrief"><summary>${esc(title)}</summary><ul class="route-list">${items.join('')}</ul></details>`;
}
function approvalProduct(){
 return productDetails('IBM Verify and CIBA',[['verify','A configured CIBA flow can prompt Morgan on a separate device. The application binds the approval to the exact report revision and recipient. CRM checks that binding at send time.']]);
}
function showNote(key,event){
 const note=RequestTrace.note(key,mode,event);
 if(!note?.text||!dialog.open||dialog.classList.contains('is-reference'))return;
 const details=$('#dialog-lesson');
 $('#lesson-title').textContent=note.title;
 $('#lesson-effect').textContent=note.effect||'';
 $('#lesson-effect').hidden=!note.effect;
 $('#lesson-text').textContent=note.text;
 const links=note.sources.map(id=>{
  const product=productById(id);
  const source=product?{name:product.sourceLabel||product.name+' documentation',url:product.url}:PROTOCOL_SOURCES[id];
  const link=document.createElement('a');
  link.textContent=source.name;link.href=source.url;link.target='_blank';link.rel='noopener noreferrer';
  return link;
 });
 $('#lesson-sources').replaceChildren(...links);
 $('#lesson-sources').hidden=!links.length;
 $('#lesson-trace').hidden=event?.request?.recordVersion!==3||state().last!==event;
 $('#lesson-trace').onclick=()=>showRequestTrace(event,()=>showReply(event));
 details.hidden=false;
}
function showLesson(event){
 if(!event)return;
 const key=event.action==='remediate'&&event.request?.control==='credential'?'vault-close':event.action;
 showNote(key,event);
}
function showReply(event=state().last){
 showSavedReply(event);
 showLesson(event);
}
function showActionRefusal(event){
 const paused=state().paused;
 const action=event.action;
 const continuation=paused?showParent:action==='try-private'?showPrivate:action==='try-extension'?showExtension:nextMove;
 const label=paused?(teen()?'Talk to my parent':'Ask Priya to review'):action==='try-private'?(teen()?'Back to Jamie’s message':'Back to the source note'):'Continue';
 speakingObject=StoryInteractions.eventSource(mode,event.speaker,event.action,event.kind);
 const note=action==='try-private'&&event.decision?.result==='deny'
  ?teen()?'The school sets the sharing rule. The school app applies it and sent nothing. Your homework agreement still lets you finish your own project.'
   :'The customer policy service evaluated the attachment. The approved mission covers the summary, and CRM applies the separate rule that protects private notes.'
  :'';
 const risk=!teen()&&paused&&event.request?.operation==='boundary.bypass'
  ?`<div class="request-result"><b>Identity alert · Verify Identity Protection (AuthMind)</b><p>In this simulation, connected activity shows Nova tried a second access path after the CRM refusal. The configured response policy pauses the task session and sends it for Priya’s review.</p></div>`:'';
 show(event.title,`<p>${esc(event.text)}</p>${note?`<div class="request-result"><b>Who applied the rule?</b><p>${esc(note)}</p></div>`:''}${risk}<div class="actions">
  ${button(label,continuation)}
  ${state().last===event?button(teen()?'See what happened':'Follow this request',()=>showRequestTrace(event,()=>showReply(event)),'secondary'):''}
  ${button('Back to the room',close,'secondary')}
 </div>`,paused?(teen()?'LET’S TALK':'DELIBERATE BYPASS STOPPED'):event.kind==='refused'?'A PERMISSION CHECK':'ONE THING FIRST');
}
function showSavedReply(event){
 if(!event)return;
 if(isSchoolRecipientRefusal(event))return showSchoolRecipientRefusal(event);
 if(isRefusedShare(event))return showRefusedShare(event);
 if(!teen()&&event.decision?.result==='deny'&&RequestTrace.crmReadDecision(state(),event))return showCrmReadRefusal(event);
 if(state().ended&&!state().finished)return showChecks();
 if(['blocked','refused'].includes(event.kind))return showActionRefusal(event);
 if(event.action==='collect-source'&&stage()==='source'&&state().source)return showSource();
 if(event.action==='add-extension'&&event.kind==='story'&&state().extensionAdded&&!state().delivered)return showExtensionRead(event);
 if(event.action==='inspect-request-source'&&!state().delivered&&!state().paused)return showRequestSource();
 if(event.action==='check-extension-source'&&state().extensionStatus==='pending'&&!state().paused)return showParentSourceCheck();
 if(event.action==='ask-helper-account'&&event.kind==='story')return showHelperAccountReply(event);
 if(event.action==='proof-helper'&&event.kind==='story'&&state().proof)return showHelperResult();
 if(event.action==='send'&&state().delivered&&!state().ended)return showDelivery();
 if(event.action==='decline-private')return showDecisionResult(event);
 if(event.kind==='story'&&(event.action==='change-recipient'||!teen()&&['revise-file','wait-approval'].includes(event.action)))return showSend();
 speakingObject=StoryInteractions.eventSource(mode,event.speaker,event.action,event.kind);
 const recoveredAccounts=!teen()&&event.action==='resolve-review'&&event.decision?.allowed_records;
 const modelRoute=!teen()&&event.action==='prepare'?`<div class="request-result"><b>Model request · AI Gateway</b><p>The configured watsonx Orchestrate AI Gateway routes the outline request to an approved model. Nova will use the MCP gateway for the account records in the next step.</p></div>`:'';
 show(event.title,`<p>${esc(event.text)}</p>${modelRoute}${recoveredAccounts?.length?`<p><b>Accounts still approved</b> · ${esc(customerNames(recoveredAccounts))}.</p>`:''}<div class="actions">${button(move()[0],nextMove)}${button('Back to the room',close,'secondary')}</div>`,StoryInteractions.speechSource(mode,speakingObject).kind);
}
function perform(action,payload={}){
 const result=StoryRules.act(state(),mode,action,payload);states[mode]=result.state;selected=null;close();render();ping(result.event?.kind);
 const ev=result.event;
 if(isSchoolRecipientRefusal(ev))showSchoolRecipientRefusal(ev);
 else if(isRefusedShare(ev))showRefusedShare(ev);
 else if(!teen()&&ev?.decision?.result==='deny'&&RequestTrace.crmReadDecision(state(),ev))showCrmReadRefusal(ev);
 else if(ev?.kind==='blocked'||ev?.kind==='refused')showActionRefusal(ev);
 else if(action==='collect-source')showSource();
 else if(action==='inspect-request-source')showRequestSource();
 else if(action==='check-extension-source')showParentSourceCheck();
 else if(['verify-contact','verify-portal'].includes(action)&&payload.fromExtension)showExtension(ev);
 else if(action==='attach-source'||action==='approve-draft')showDraftReview();
 else if(action==='send-draft')showDraftReceipt();
 else if(action==='proof-helper')showHelperResult();
 else if(action==='add-extension')showExtensionRead(ev);
 else if(action==='verify-contact'||action==='verify-portal')showClarification(action);
 else if(['apply-minor','keep-minor','decline-private'].includes(action))showDecisionResult(ev);
 else if(['decline-extension','omit-extension'].includes(action))showChanges();
 else if(['request-extension','resolve-extension','reconsider-extension'].includes(action))showExtension();
 else if(action==='review')showParent();
 else if(['approve','change-recipient','wait-approval'].includes(action))showSend();
 else if(action==='revise-file')teen()?showDraft():showSend();
 else if(action==='send'&&state().delivered)showDelivery();
 else if(['schedule-followup','write-note'].includes(action))showParent();
 else if(['close-pass','check','check-closing-basics','sign-out-laptop','replay-containment','remediate','controller-offline','controller-online','probe-session'].includes(action))showChecks();
 else if(state().finished)showEnding();
 if(!dialog.open)showReply(ev);
 else if(action!=='attach-source')showLesson(ev);
 return result;
}
function inventory(){
 const s=state(),e=episode(),items=[];
 if(s.started)items.push(['contact','✉',e.contact,'A contact you already know','Use this on later requests to clarify them independently.']);
 if(s.brief)items.unshift(['brief','▤',teen()?'Assignment card':'Work order',teen()?(s.pass?'Agreed task':'New request'):'Priya’s original request',e.brief]);
 if(s.pass)items.push(['pass','◇',teen()?'Tonight’s plan':'Mission record',s.ended?'Closed':s.paused?'Paused':s.extensionAdded?'Approved addition included':'Current agreement',teen()?`Tonight’s plan: ${s.extensionStatus==='approved'?StoryRules.alexExtra(s).extraApp+' is allowed for the linked museum source only.':'School app and museum website until dinner.'}`:`${s.mission.id} version ${s.mission.version} · records ${s.mission.records.join(', ')}. Customer-owned authority.`]);
 if(s.source)items.push(['source','✎',e.source,teen()?'Page saved for the timeline':'The source actually opened',e.itemSource]);
 if(s.draft)items.push(['draft','▱',e.file,s.delivered?(teen()?'Sent to Ms Patel':'Delivered'):s.caption?'Sourced draft':'Source credit still needed',teen()?'Open the school app to read this version.':'Inspect this version at the CRM workspace.']);
 if(s.evidence.length)items.push(['clue','⌕',teen()?'Teacher’s clarification':'Verified request',s.evidence.includes('contact')?'Known contact checked':'Current record checked',teen()?'Ms Patel suggested the extra source; your parent still decides whether you can open it.':'The optional expansion is genuine, but still needs its own authorized amendment.']);
 if(s.draftReview)items.push(['review-copy','↗',teen()?'Draft sent for feedback':'Review-copy receipt','Version '+s.draftReview.revision,'The first review copy reached '+s.draftReview.to+'. The final file still needs submitting.']);
 if(s.approval&&!s.approval.used)items.push(['approval','✦',s.approval.purpose==='draft-review'?'Review-copy approval':'Final-share approval',`Revision ${s.approval.revision}`,`${e.file} to ${e.to}; current mission and one use.`]);
 if(s.delivered)items.push(['delivery','✓',teen()?'Submission receipt':'Delivery receipt','The agreed file arrived',teen()?'Ms Patel has this copy. You can keep the confirmation in your notebook.':'Keep it with a task note. Delivery is already a completed effect.']);
 if(!teen()&&s.sourceLease)items.push(['vault','⌘','Task credential receipt',s.ended?(s.containment?.credentialRevoked?'Revoked':'Closure still to check'):'This mission only','Vault controls its own credential request. CRM independently enforces business operations.']);
 if(s.notes.length)items.push(['note','▥',teen()?'Reminder':'Sourced task note','Ordinary content',s.notes[0].text]);
 if(s.checks.length===4)items.push(['checklist','☷',teen()?'Ready for dinner':'Closing evidence',teen()?'Project sent · laptop signed out':'Four task outcomes checked',teen()?'Tell your parent you’re done.':'Bring the evidence to finish this task.']);
 return items;
}
const alexRoomLabels={
 hero:['Alex','You · write the timeline'],parent:['Parent','Decides app access'],reviewer:['Ms Patel','Assigns and reviews your work'],
 outside:['Jamie','Classmate · group chat'],schoolInbox:['School inbox','Teacher messages'],schoolApp:['School app','Checks what you can submit'],
 homework:['Homework settings','Applies the phone rules'],classChat:['Class group chat','Classmate messages'],
 parentSchool:['School app · parent account','Checks the original teacher reply'],source:['Museum website','Browser · railway dates']
};
const novaRoomLabels={
 hero:['Nova','You · run the handover'],sponsorMessage:['Priya','Approves task scope'],reviewer:['Morgan','Approves the exact copy'],
 outside:['Luca','Harbor Bikes · customer contact'],workOrder:['Work order','Priya’s original request'],
 parent:['Mission service','Records the approved scope'],launchWorkflow:['Launch workflow','Requests a workspace for the approved job'],
 policyInfo:['Policy information point (PIP)','Supplies trusted facts'],
 policyDecision:['Customer policy decision service (PDP)','Evaluates the exact operation'],
 registries:['Agent registries','IBM Agent Identity · Vault'],phone:['Workspace controls','OpenShell · runs and restricts Nova'],
 verify:['IBM Verify','Separate-device review'],orchestrate:['IBM watsonx Orchestrate','Coordinates the handoff'],
 aiGateway:['AI Gateway','Routes model requests'],mcpGateway:['MCP gateway','Checks and forwards tool calls'],
 vaultControl:['HashiCorp Vault','Issues and revokes the tool credential'],riskMonitor:['IBM Verify Identity Protection (AuthMind)','Optional risk detection'],
 antenna:['IBM Verify Antenna','Optional SSF and CAEP integration'],
 controllers:['Runtime, Vault, CRM and queue controllers','Configured response and evidence'],
 laptop:['Customer CRM · resource PEP','Enforces record and send rules'],source:['CRM tool','MCP server · exposes the read'],
 crmAttachment:['Imported attachment','Luca’s upload · customer portal']
};
const roomCardIcons={
 hero:'person',sponsorMessage:'person',reviewer:'person',outside:'person',schoolInbox:'reviewer',schoolApp:'console',
 homework:'shield',parentSchool:'phone',extra:'source',classChat:'reviewer',crmAttachment:'outside',
 launchWorkflow:'console',policyInfo:'source',policyDecision:'console',registries:'memory',verify:'shield',orchestrate:'console',aiGateway:'console',mcpGateway:'source',vaultControl:'shield',riskMonitor:'shield',antenna:'phone',controllers:'notebook'
};
function roomCard(key){
 if(teen()&&key==='extra'){
  const s=state();
  return [episode().extraApp,s.ended?'Homework access ended':s.extensionStatus==='approved'?'Linked museum source allowed':'Optional museum link'];
 }
 return (teen()?alexRoomLabels:novaRoomLabels)[key];
}
function objectName(key){
 return roomCard(key)?.[0]||episode().objects[OBJECT_KEYS.indexOf(key)];
}
function objectDetail(key){
 const status=teen()&&key==='laptop'?'':StoryInteractions.objectStatus(state(),mode,key==='schoolApp'?'laptop':key);
 return (state().ended&&status)||roomCard(key)?.[1]||status||episode().objectDetails?.[OBJECT_KEYS.indexOf(key)]||'';
}
function heldUse(){return selected?StoryInteractions.itemUse(state(),mode,selected):null;}
function targetState(key,pin=false){
 const use=heldUse(),next=move()[2];
 return use?(StoryInteractions.findTarget(mode,use.targets,key,pin)?'use-target':''):StoryInteractions.isStoryObject(mode,key,next,pin)?'relevant':'';
}
function targetTag(key,pin=false){return targetState(key,pin)==='use-target'?'Use here':targetState(key,pin)==='relevant'?'Next':'';}
function objectLabel(key,pin=false){
 const guide=targetTag(key,pin),next=move()[2];
 if(pin&&guide==='Next'&&key!==next)return [objectName(key),guide,objectName(next)].join(' · ');
 return [objectName(key),objectDetail(key),guide].filter(Boolean).join(' · ');
}
function setRoomView(name){
 roomView=name;
 $('.scene-canvas').hidden=Boolean(name);
 $('#objects').hidden=!name;
 $('.scene-frame').classList.toggle('station-open',Boolean(name));
 $$('[data-station-panel]').forEach(panel=>{panel.hidden=panel.dataset.stationPanel!==name;});
 $$('#scene-stations [data-station]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.station===name)));
}
function visitStation(name,fromPin=false){
 if(dialog.open&&dialog.dataset.inspect==='true')close();
 setRoomView(name);
 if(fromPin)$('#scene-stations [aria-pressed="true"]')?.focus({preventScroll:true});
 syncSpeech();
}
function currentCrmCheck(s){
 const event=s.last;
 return event?.request?.recordVersion===3&&event.decision?.pep==='CRM resource PEP'?event:null;
}
function policyStationEvidence(event){
 const {request,decision}=event;
 const operation={'customer.read':'Customer record read','attachment.share':'Attachment share','report.send':'Report send'}[request.operation]||request.operation;
 const detail=request.operation==='customer.read'?customerNames(request.records):[request.file,request.recipient].filter(Boolean).join(' · ');
 return `<div class="station-evidence"><div><b>${esc(operation)} · ${decision.result==='permit'?'allowed':'refused'}</b>
  <p>${detail?esc(detail)+' · ':''}${esc(decision.mission_id)} v${decision.mission_version}</p></div>
  <button type="button" class="secondary" id="station-trace">Follow the CRM decision</button></div>`;
}
function renderStations(s){
 const groups=StoryInteractions.roomGroups(s,mode);
 const crmCheck=!teen()&&currentCrmCheck(s);
 const tabs=[['Room',[],'','scene-art'],...groups.map(([name,keys],index)=>[name,keys,name,`station-panel-${index}`])];
 $('#scene-stations').innerHTML=tabs.map(([label,keys,name,panel])=>{
  const tag=keys.some(key=>targetTag(key))?(selected?'Use here':'Next'):'';
  return `<button type="button" class="station-tab${tag?' station-next':''}" data-station="${esc(name)}" aria-controls="${panel}"><span>${esc(label)}</span>${tag?`<small>${tag}</small>`:''}</button>`;
 }).join('');
 const renderObject=key=>{
  const detail=objectDetail(key),tag=targetTag(key);
  return `<button data-object="${key}" class="${targetState(key)}" data-tip="${esc(StoryInteractions.objectDescription(mode,key))}" aria-label="${esc(objectLabel(key))}"><b aria-hidden="true">${sceneObjectIcon(roomCardIcons[key]||key,mode)}</b><span class="object-copy">${esc(objectName(key))}${detail?`<small class="object-detail">${esc(detail)}</small>`:''}${tag?`<small class="next-label">${tag}</small>`:''}</span></button>`;
 };
 $('#objects').innerHTML=groups.map(([name,keys],index)=>`<section class="object-group" id="station-panel-${index}" data-station-panel="${esc(name)}" aria-labelledby="station-title-${index}"><h3 id="station-title-${index}">${esc(name)}</h3>${name==='Policy checks'&&crmCheck?policyStationEvidence(crmCheck):''}<div class="object-grid">${keys.map(renderObject).join('')}</div></section>`).join('');
 setRoomView(groups.some(([name])=>name===roomView)?roomView:'');
 $$('#scene-stations [data-station]').forEach(b=>b.onclick=()=>visitStation(b.dataset.station));
 if(crmCheck)$('#station-trace').onclick=()=>showRequestTrace(crmCheck,close,'Back to Policy checks');
}
function selectPocket(id){if(dialog.open&&!dialog.classList.contains('is-reference'))close();selected=selected===id?null:id;render();$$('[data-item]').find(b=>b.dataset.item===id)?.focus({preventScroll:true});if(selected)toast(heldUse().instruction);}
function render(){
 const s=state(),e=episode(),m=move(),c=chapter(),use=heldUse();document.body.classList.toggle('agent',!teen());
 $$('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));
 document.title='Trust Boundaries · '+e.title;
 $('#episode-label').textContent=e.eyebrow;$('#episode-title').textContent=e.title;$('#episode-tag').textContent=e.tag;
 $('#chapter-track').innerHTML=e.steps.map((text,i)=>`<span class="${i===c?'current':i<c?'complete':''}"><small>${i<c?'✓':String(i+1).padStart(2,'0')}</small>${esc(text)}</span>`).join('');
 $('#sequence-position').textContent=JOURNEY_SEQUENCE[currentSequencePhase()].title;
 $('#scene-footnote').textContent=use?use.instruction:StoryInteractions.sceneSummary(s,mode);
 $('#place').textContent=e.place;$('#scene-condition').textContent=s.finished?(teen()?'READY FOR DINNER':'CHAPTER COMPLETE'):s.paused?(teen()?'LET’S TALK':'MISSION PAUSED'):s.ended?(teen()?'DINNER TIME':'MISSION REVOKED'):s.delivered?(teen()?'SENT TO MS PATEL':'DELIVERED'):s.message&&!s.verified?'NEW MESSAGE':'';
 const artStep=s.draft?7:0;
 const helperReady=!teen()||s.draft;
 $('#art').innerHTML=roomArt(mode,Math.min(c,2),{step:artStep,hasIncoming:s.message,helperVisible:s.draft,verified:s.verified,delivered:s.delivered,revoked:s.ended,paused:s.paused,hasNote:s.notes.length>0,hasSourceCredit:s.caption,signInRequired:teen()&&s.checks.includes('signin')&&s.containment?.controllerReachable,serviceStillOpen:s.ended&&s.containment&&!s.containment.sessionClosed});
 $('#pins').innerHTML=STORY_PINS[mode].map(([x,y],i)=>{
  const key=OBJECT_KEYS[i],label=esc(objectLabel(key,true));
  const caption=({hero:e.name,helper:teen()?'Sam':'Quill',phone:teen()?'Phone':'Workspace',laptop:teen()?'Laptop':'Policy'})[key];
  return key==='helper'&&!helperReady?'':`<button class="pin ${targetState(key,true)}" style="left:${x/10}%;top:${y/5.8}%" data-object="${key}" data-tip="${label}" aria-label="${label}">${sceneObjectIcon(key==='hero'?'person':key,mode)}${caption?`<span class="pin-caption" aria-hidden="true">${caption}</span>`:''}</button>`;
 }).join('');
 const links=STORY_PINS[mode].map(([x,y,tx,ty],i)=>OBJECT_KEYS[i]==='helper'&&!helperReady?'':`<path d="M${x} ${y}L${tx} ${ty}"/>`).join('');
 $('#pins').insertAdjacentHTML('afterbegin',`<svg class="pin-links" viewBox="0 0 1000 580" aria-hidden="true">${links}</svg>`);
 if(!teen())$('#pins').insertAdjacentHTML('beforeend',`<button class="pin" id="signals-pin" style="left:82%;top:24%" data-tip="Signals and response" aria-label="Open Signals and response">${sceneObjectIcon('shield',mode)}<span class="pin-caption" aria-hidden="true">Signals</span></button>`);
 renderStations(s);
 if(!teen())$('#signals-pin').onclick=()=>visitStation('Signals and response',true);
 $$('[data-object]').forEach(b=>b.onclick=()=>interact(b.dataset.object,b.classList.contains('pin')));
 const event=storyEvent(s.last)||{speaker:e.name,title:teen()?'The last upload of the day.':'A new request is waiting.',text:e.actorLine};
 const speech=StoryInteractions.speechSource(mode,StoryInteractions.eventSource(mode,event.speaker,event.action,event.kind));
 $('#speaker').textContent=[speech.name,speech.kind,speech.channel].filter(Boolean).join(' · ');$('#speaker-portrait').textContent=event.speaker==='Nova'?'◉':event.speaker==='Quill'?'✦':event.speaker[0];$('#dialogue-title').textContent=event.title;$('#dialogue-text').textContent=event.text;
 $('#next-title').textContent=selected?'Put away and continue':s.finished?'See my ending':m[0];
 $('#next-text').textContent=selected?use.instruction:m[1];
 const items=inventory();$('#pocket-count').textContent=String(items.length)+(items.length===1?' ITEM':' ITEMS');
 $('#inventory').innerHTML=items.map(([id,icon,name,detail])=>`<button class="item ${selected===id?'selected':''}" data-item="${id}" aria-pressed="${selected===id}"><span aria-hidden="true">${icon}</span><span>${esc(name)}<small>${selected===id?(use.targets.length?'✓ Selected · choose Use here':'✓ Selected · reference item'):esc(detail)}</small></span></button>`).join('');
 $$('[data-item]').forEach(b=>b.onclick=()=>selectPocket(b.dataset.item));
 $('#selected').hidden=!selected;
 if(selected){const item=items.find(i=>i[0]===selected);if(item){$('#selected').innerHTML=`<p><b>Selected: ${esc(item[2])}</b></p><p class="held-instruction">${esc(use.instruction)}</p><button id="inspect-item">Look closer</button> · <button id="put-away">Put away</button>`;$('#put-away').onclick=()=>{selected=null;render();};$('#inspect-item').onclick=()=>{speakingObject='pocket';show(item[2],`<p>${esc(item[4])}</p><div class="actions">${button('Keep it selected',close)}</div>`,'IN YOUR POCKET');};}}
 $('#route-note').textContent=teen()&&!s.legacyRoute?(s.finished?'Project sent. Laptop signed out. Dinner time.':s.paused?'Your timeline is still here. Talk to your parent before carrying on.':s.ended?'Phone put away. Finish signing out of the family laptop.':s.delivered?'Ms Patel has your project. Put your phone away and finish up for dinner.':s.extensionAdded?'Your extra source is in the timeline. Give this version a final read.':s.message?'Ms Patel has feedback. Jamie has a favour to ask. Choose what to change.':s.pass?'Tonight’s plan is agreed. Time to make the timeline.':'Start with Ms Patel’s assignment, then talk to your parent.'):s.legacyRoute?'You are continuing an earlier route. Choose “Start this story again” to play the new opening; the other journey is kept.':s.finished?'This task is complete. A new task starts with a fresh agreement.':s.paused?'A deliberate bypass needs review. Your ordinary task can still be recovered.':s.extensionAdded?'You checked and approved a genuine expansion, then used only its added permission.':s.message?'Small edits, legitimate expansions and private information need different responses.':s.pass?'You agreed on the task yourself. Build a useful first result before handling changes.':'No task has been agreed yet. Read the new request and make a plan.';
 $('#request-trace').textContent=teen()?'See what happened':'Follow this request';
 $('#sound').textContent=sound?'Sound on':'Sound off';$('#sound').setAttribute('aria-pressed',String(sound));$('#footer-world').textContent=teen()?'A little freedom. A few good questions.':'Useful autonomy. Independently checked.';
 renderBehind();renderProducts();syncSpeech();persist();
}
function protocolSourceLinks(ids=[]){
 if(!ids.length)return '';
 return `<p class="sources">${ids.map(id=>{
  const {name,url}=PROTOCOL_SOURCES[id];
  return `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(name)}</a>`;
 }).join(' · ')}</p>`;
}
function protocolHTML(card){return `<p><b>${esc(card.title)}</b></p><div class="protocol-tags">${card.tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div><p>${esc(card.how)}</p><p><b>Limit:</b> ${esc(card.boundary)}</p>${protocolSourceLinks(card.sources)}<p class="small-print">Illustrative mapping. Optional integrations are not claims of native product support. No protocol exchange is sent by this game.</p>`;}
function renderBehind(){const s=state(),action=s.history.at(-1)?.action,card=s.finished||s.ended?CLOSING_PROTOCOL:['approve-draft','send-draft'].includes(action)?(teen()?SUBMISSION_PROTOCOL:AGENT_PROTOCOLS[5]):teen()&&['send','send-draft','approve-draft','proof-self','proof-helper'].includes(action)?SUBMISSION_PROTOCOL:s.message&&!s.verified||['request-extension','resolve-extension','add-extension','apply-minor','keep-minor','decline-extension','omit-extension','reconsider-extension','decline-private','try-extension'].includes(action)?CHANGE_PROTOCOL:action==='attach-source'?SOURCE_PROTOCOL:['review','resolve-review'].includes(action)?REVIEW_PROTOCOL:AGENT_PROTOCOLS[s.last?.topic??0];$('#behind-heading').textContent=teen()?'Behind the story':'Protocols behind this outcome';$('#behind-content').innerHTML=teen()?`<p>Your parent allows homework phone use. The school separately controls access to private notes. The phone checks which app can open; the school app checks each action. A message can’t give you permission, and an old yes can’t approve a different share.</p><details><summary>Technical lens</summary>${protocolHTML(card)}</details>`:protocolHTML(card);}
function productById(id){return NOVA_PRODUCTS.find(p=>p.id===id);}
function renderProducts(){
 const panel=$('#product-panel');panel.hidden=teen();if(teen())return;
 const s=state(),action=s.history.at(-1)?.action;
 const context=['review','resolve-review'].includes(action)?{ids:['verify','iai'],text:'The IBM Verify channel models the sponsor’s separate authentication and consent. IBM Agent Identity’s delegation stays paused until the matching reply is checked; the application preserves the original task scope.'}:NOVA_PRODUCT_CONTEXT[s.last?.topic??0];
 $('#product-context').textContent=context.text;
 $('#product-names').innerHTML=context.ids.map(id=>`<button data-product="${id}">${esc(productById(id).name)}</button>`).join('');
 $$('[data-product]').forEach(b=>b.onclick=()=>showProductMap(b.dataset.product));
}
function productCard(product,open=false){return `<details class="product-card" ${open?'open':''}><summary><b>${esc(product.name)}</b><span>${esc(product.role)}</span></summary><p class="product-status">${esc(product.status)}</p><p>${esc(product.how)}</p><p><b>Boundary:</b> ${esc(product.limit)}</p><div class="protocol-tags">${product.standards.map(s=>`<span>${esc(s)}</span>`).join('')}</div><p class="sources"><a href="${product.url}" target="_blank" rel="noopener noreferrer">${esc(product.sourceLabel||product.name+' documentation')}</a></p></details>`;}
const architectureViews = [
 ['boundaries','Trust boundaries'],
 ['design','Technical design'],
 ['map','Product map'],
 ['sequences','Request sequences'],
 ['runtime','Runtime and containment'],
 ['deployment','Deployment options'],
 ['threats','Threat coverage']
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
  </section>
  <div class="actions">${button('Try the authorization lab',()=>{
   const selectedId=$('[data-boundary][aria-pressed="true"]').dataset.boundary;
   showDecisionLab(()=>showArchitecture('boundaries',selectedId));
  })}</div>`;
}

function architectureDesign(){
 const {topology,evidence,decisionExample,decisionResponse,sections}=ArchitectureReference.technical;
 return `<section aria-labelledby="topology-title"><h3 id="topology-title">Deployment topology and trust boundaries</h3>
 <div class="architecture-topology">${topology.map(([name,components,detail])=>`<article><h4>${esc(name)}</h4><div class="architecture-path">${components.map(id=>`<button class="secondary" data-architecture-component="${id}">${esc(architectureComponentName(id))}</button>`).join('')}</div><p>${esc(detail)}</p></article>`).join('')}</div></section>
 <details class="product-card"><summary><b>Authoritative inputs and evidence ownership</b></summary>
 <dl class="architecture-evidence">${evidence.map(([attribute,owner,detail])=>`<dt>${esc(attribute)}</dt><dd><b>${esc(owner)}</b><p>${esc(detail)}</p></dd>`).join('')}</dl></details>
 <details class="product-card"><summary><b>Inspect an exact-action authorization request</b><span>Example application contract for Nova’s final share</span></summary>
 <p>This archived example uses a fixed validity timestamp. The CRM PEP builds the request from observed inputs and authoritative stores. In the playable game a revision number stands in for a content digest.</p><h4>Request to the PDP</h4><pre class="product-example">${esc(JSON.stringify(decisionExample,null,2))}</pre>
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
 return `<p>These examples pair a player choice with the control that responds.</p>
  <div class="architecture-threats">${threats.map(item=>`<details class="product-card"><summary><b>${esc(item.title)}</b></summary>
   <dl><dt>Alex</dt><dd>${esc(item.alex)}</dd><dt>Nova</dt><dd>${esc(item.nova)}</dd><dt>What enforces it</dt><dd>${esc(item.control)}</dd></dl>
   <button class="secondary" data-architecture-flow="${item.flow}">Follow the technical sequence</button>
  </details>`).join('')}</div><p class="small-print">${esc(outsideCoverage)}</p>`;
}

function runtimeBootstrap(){
 return `<ol class="route-list">${ArchitectureReference.runtime.bootstrap.map(([name,description])=>`<li><b>${esc(name)}</b><br>${esc(description)}</li>`).join('')}</ol>`;
}
function architectureRuntime(){
 const {sources}=ArchitectureReference.runtime;
 const back=()=>showArchitecture('runtime');
 return `<h3>From approved task to running sandbox</h3>
  <p>Example identifiers track different controls. The customer mission is G-042 v1. The separate OpenShell sandbox generation is S-04.</p>
  ${runtimeBootstrap()}
  <p>OpenShell governs the MCP client’s network route. On this configured path the MCP gateway forwards the call and the CRM connector obtains a backend credential from Vault. CRM enforces the actual record decision.</p>
  <p>Application-layer rules block requests in enforcement mode. Audit mode logs violations and lets the request continue to downstream controls.</p>
  <div class="actions">
   ${button('What stopped this request?',()=>showRuntimeExercise(back))}
   ${button('Simulate loss of supervision',()=>showSupervisorFailure(back),'secondary')}
   ${button('Investigate an incident alert',()=>showRuntimeIncident(back),'secondary')}
  </div><p class="sources">${sources.map(([label,url])=>`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)}</a>`).join(' · ')}</p>`;
}

function architectureDeployment(open=null){
 const {deploymentOptions}=ArchitectureReference;
 const options=open?deploymentOptions.filter(option=>option.id===open).concat(deploymentOptions.filter(option=>option.id!==open)):deploymentOptions;
 return `<h3>Deployment options</h3>
  <p>Expand a standard to see when it fits and how it relates to Nova’s example deployment.</p>
  <div class="product-cards">${options.map(option=>`<details class="product-card" ${option.id===open?'open':''}>
   <summary><b>${esc(option.title)}</b></summary><p>${esc(option.when)}</p><p>${esc(option.inStory)}</p>
   ${protocolSourceLinks(option.sources)}</details>`).join('')}</div>`;
}

function showArchitecture(view='boundaries',flowId='read',componentId=null,focusControl=false){
 const {flows}=ArchitectureReference;
 const boundary=flowId;
 if(!flows[flowId])flowId='read';
 const body=view==='boundaries'?architectureBoundaries(boundary):view==='design'?architectureDesign():view==='sequences'?architectureFlow(flowId):view==='runtime'?architectureRuntime():view==='deployment'?`${architectureDeployment()}
  <div class="actions">${button('Compare the BAR deployments',()=>showMaturity(()=>showArchitecture('deployment',flowId)),'secondary')}</div>`:view==='threats'?architectureThreats():architectureMap(componentId);
 showReference('Mission-bound authorization',
  `<p>This reference describes a target deployment. The game replays fictional requests and outcomes. Product and protocol links identify the documented capabilities used in each layer.</p>
  <nav class="architecture-nav" aria-label="Architecture sections">${architectureViews.map(([id,label])=>`<button class="secondary" data-architecture-view="${id}" aria-pressed="${id===view}">${label}</button>`).join('')}</nav>
  ${body}<div class="actions">${button('Back to the story',()=>state().started?close():showIntro(),'secondary')}</div>`,
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

function showBuyerGuide(exit=()=>state().started?close():showIntro(),exitLabel='Back to the story',{selected=null,context=null}={}){
 const reopen=()=>showBuyerGuide(exit,exitLabel,{selected,context});
 const productMap=()=>showProductMap('',reopen);
 const candidates=NOVA_BUYER_NEEDS.filter(need=>need.pilot&&!need.pilot.secondary);
 const choose=need=>showBuyerGuide(exit,exitLabel,{selected:need,context});
 const sources=need=>`<p class="sources">${need.sources.map(([name,url])=>`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(name)}</a>`).join(' · ')}</p>`;
 if(selected){
  const {pilot,product,fit}=selected;
  return showReference(product,`<p>${esc(pilot.outcome)}</p><p>${esc(fit)}</p>
   <div class="actions">${button(pilot.evidenceLabel,()=>showBuyerEvidence(pilot.evidence,reopen))}
   ${button('Open technical setup',()=>showBuyerSetup(selected,reopen),'secondary')}</div>
   <h3>Plan a first pilot</h3>${buyerPilotChecklist(pilot)}
   ${sources(selected)}<div class="actions">${button('Choose another problem',()=>showBuyerGuide(exit,exitLabel,{context}),'secondary')}</div>`,
   'BUYER GUIDE');
 }
 const secondary=choices(NOVA_BUYER_NEEDS.filter(need=>need.pilot?.secondary).map(need=>[need.product,need.pilot.label,()=>choose(need)]));
 const other=NOVA_BUYER_NEEDS.filter(need=>!need.pilot).map(need=>`<details class="product-card"><summary><b>${esc(need.question)}</b><span>${esc(need.product)}</span></summary><p>${esc(need.fit)}</p><p>${esc(need.example)}</p>${sources(need)}</details>`).join('');
 const appPermission=()=>showBuyerActionScope(reopen);
 const oldSession=()=>showBuyerAccessCheck(reopen,'session',{backLabel:'Back to Apply this at work'});
 const approval=candidates.find(need=>need.pilot.evidence==='verify');
 const related=context==='alex'?[
  ['Can your app protect records outside the task?','The school app checked what Alex could send. Test what a work app will let an agent read.',appPermission,'good'],
  ['Does the old app session still work?','Putting the phone away left the laptop tab open. Retest an existing work session.',oldSession,'good']
 ]:context==='staffing'?[
  ['Would an edited file still go out?','Version 4 needed a new approval. Use the IBM Verify pilot to see what CRM blocks after an edit.',()=>choose(approval),'good'],
  ['Can you prove the session closed?','The scheduling service owned the session. Try the same check with the CRM team’s evidence.',oldSession,'good']
 ]:[];
 const problems=[
  ...candidates.filter(need=>context!=='staffing'||need!==approval).map(need=>[need.pilot.label,'',()=>choose(need)]),
  ['Access still works after the job ends','Find which control to check first.',()=>showBuyerAccess(reopen)],
  ...(context==='alex'?[]:[['The agent can open the app but can see or do too much','Check what the app allows after the agent connects.',appPermission]])
 ];
 showReference(context?'Apply this at work':'What problem do you have today?',`
  ${context?`${choices(related)}<details class="debrief"><summary>Browse other work problems</summary>${choices(problems)}</details>`:choices(problems)}
  <details class="debrief"><summary>Other controls in Nova’s mission</summary>${secondary}<div class="product-cards">${other}</div></details>
  <div class="actions">${button('Raise the BAR',()=>showMaturity(reopen),'secondary')}${button('Open the technical product map',productMap,'secondary')}${button(exitLabel,exit,'secondary')}</div>`,
  'BUYER GUIDE');
}
function showMaturity(back=showIntro,selected=null){
 const reopen=()=>showMaturity(back,selected);
 const title=stage=>`${stage.label} (${stage.name.toUpperCase()})`;
 const backLabel='Back to Raise the BAR';
 const stageExercises={
  Build:['Test the drafting assistant',()=>showBuildPilot(reopen)],
  Authorize:['Test what Nova can read',()=>showRuntimeExercise(reopen,{scopeOnly:true,backLabel})],
  Resist:['Run a containment drill',()=>showRuntimeIncident(reopen,null,backLabel)]
 };
 if(selected){
  const {deployment}=selected;
  return showReference(title(selected),
   `<p>${esc(selected.mode)}</p><h3>${esc(deployment.title)}</h3><p>${esc(deployment.scenario)}</p>
   <ul class="route-list">
    <li><b>Who controls access</b><br>${esc(deployment.boundary)}</li>
    <li><b>First pilot and evidence</b><br>${esc(selected.evidence)}</li>
    <li><b>${esc(selected.value[0])} to measure</b><br>${esc(selected.value[1])}</li>
    <li><b>Where products fit</b><br>${esc(selected.next)}</li>
   </ul>
   <div class="actions">${button(...stageExercises[selected.name])}</div>
   <details class="debrief"><summary>Technical setup and sources</summary>
    <ol class="route-list">${deployment.wiring.map(([actor,action])=>`<li><b>${esc(actor)}</b><br>${esc(action)}</li>`).join('')}</ol>
    ${protocolSourceLinks(deployment.sources)}</details>
   <div class="actions">
    ${selected.name==='Resist'?button('Test whether the old session still works',()=>showBuyerAccessCheck(reopen,'session',{backLabel}),'secondary')+button('Compare a refusal and a risk alert',()=>showBuyerEvidence('risk',reopen,backLabel),'secondary'):''}
    ${button('Match a work problem to a control',()=>showBuyerGuide(reopen,backLabel),'secondary')}
    ${button('Back to all stages',()=>showMaturity(back),'secondary')}</div>`, 'RAISE THE BAR');
 }
 showReference('Raise the BAR',`<p>Compare three ways to deploy Nova for the same customer handover. Choose the stage that fits what your agent can do today.</p>
  <ol class="bar-stages" aria-label="Maturity stages">${BAR_STAGES.map(stage=>`<li>${button(title(stage),()=>showMaturity(back,stage),'choice full',stage.deployment.title)}</li>`).join('')}</ol>
  <p>Start with the controls you have. Move to the next example when the workflow needs more autonomy and you can verify the added controls.</p>
  <details class="debrief"><summary>Framework basis</summary><p>The guide adapts Build, Authorize and Resist for a one-workflow pilot. Use the suggested measures to compare your own results with a baseline. Teams can work on these controls in parallel.</p>${protocolSourceLinks(['aiRmf'])}</details>
  <div class="actions">${button('Go back',back,'secondary')}</div>`,'AI AGENT MATURITY');
}
function showBuildPilot(back,attempts=[]){
 const cases={
  draft:{label:'Draft from the test file',outcome:'Draft ready for Priya’s review',input:'harbor-bikes-test.txt · approved model',
   result:'“Harbor Bikes is ready to review its renewal.” Priya checks the draft against the supplied file before sharing it.'},
  crm:{label:'Try fetching a CRM record',outcome:'Direct CRM read refused',input:'Request to fetch a customer record',
   result:'The assistant application rejected the request because this deployment gives Nova only the drafting tool.'}
 };
 const evidence=attempts.map((kind,index)=>{
  const {outcome,input,result}=cases[kind];
  return `<li><b>${esc(outcome)}</b><br>BUILD-0${index+1} · Nova · ${esc(NOVA_AGENT_OWNERS.nova)}<br>${esc(input)}<p>${esc(result)}</p></li>`;
 }).join('');
 const available=Object.entries(cases).filter(([kind])=>!attempts.includes(kind));
 showReference('Test the drafting assistant',`<p>This example uses a named assistant, an approved model and one sanitized test file.</p>
  ${evidence?`<ol class="route-list" aria-label="Pilot activity records">${evidence}</ol>`:''}
  <div class="actions">${available.map(([kind,test])=>button(test.label,()=>showBuildPilot(back,[...attempts,kind]),kind==='draft'?'primary':'secondary')).join('')}
   ${available.length?'':button('Replay both tests',()=>showBuildPilot(back),'secondary')}
   ${button('Back to Raise the BAR',back,'secondary')}</div>`, 'BUILD PILOT');
}
function buyerPilotChecklist(pilot,technical=false){
 const {prerequisite,owner,success,failure,evidence}=pilot.checklist;
 const rows=[
  ...(technical?[['What you need before setup',prerequisite]]:[]),
  ['Who to involve',owner],
  ['What should work',success],
  ['What should fail or stay unverified',failure],
  ['Evidence to save',evidence]
 ];
 return `<ul class="route-list">${rows.map(([label,value])=>`<li><b>${label}</b><br>${esc(value)}</li>`).join('')}</ul>`;
}

function showBuyerSetup(need,back,backLabel='Back to the buyer card'){
 const {pilot}=need;
 const product=productById(pilot.evidence);
 showReference(`${product.name} technical setup`,`<div class="receipt"><b>What your team connects</b><p>${esc(pilot.integration)}</p></div>
  <h3>Pilot checklist</h3>${buyerPilotChecklist(pilot,true)}
  ${productCard(product,true)}
  <div class="actions">${button(backLabel,back)}${button('Open the full technical product map',()=>showProductMap(product.id,()=>showBuyerSetup(need,back,backLabel),'Back to technical setup'),'secondary')}</div>`,
  'TECHNICAL SETUP');
}

const accessChecks={
 credential:{label:'Vault credential',symptom:'The old password or key still lets me sign in',question:'Can the connector sign in again?',
  hint:'Try a fresh connection with the old password or key after the job ends.',owner:'Credential issuer · HashiCorp Vault in this example',
  check:'Confirm a fresh sign-in works with a test credential, revoke its lease, then try a fresh sign-in with the same credential. Look for a refusal.',
  evidence:'Save the lease ID, the revocation result and the target’s before-and-after sign-in results. Keep the credential value out of the record.',pilot:'vault',
  replay:{probe:'Try a fresh connection',close:'Revoke the Vault lease',retry:'Restore Vault contact and revoke the lease',retest:'Retry a fresh connection',
   confirmed:'Vault confirmed revocation of this lease.',unverified:'Vault did not respond to the revocation request.',
   active:'The target accepted a fresh connection with this credential.',closed:'The target refused a fresh connection using the same credential.',
   verifiedTitle:'Credential revocation verified'}},
 session:{label:'CRM session',symptom:'An app that was already open still responds',question:'Does the app that was already open still respond?',
  hint:'Try a status check in the existing session without signing in again.',owner:'App session owner · CRM in this example',
  check:'Confirm the existing test session responds. Ask the app to close that exact session, then verify that the same status request is refused.',
  evidence:'Save the session reference, the app’s closure response and the result of the retest. If you cannot reach the app, record the check as unverified.',
  replay:{reference:'CRM task session CRM-04',probe:'Check the existing session',close:'Close the CRM session',retry:'Restore CRM contact and close the session',retest:'Retest the old session',
   confirmed:'CRM acknowledged closure. Retest the same session to verify it.',unverified:'The CRM controller did not respond.',
   active:'CRM still responds in the existing session.',closed:'CRM refused the status read from the old session.'}},
 workspace:{label:'OpenShell workspace',symptom:'The agent is still running',question:'Is the agent’s workspace still running?',
  hint:'Ask the runtime operator to check the exact workspace used for the job.',owner:'Runtime operator · NVIDIA OpenShell in this example',
  check:'Confirm the named test workspace is running, stop it and verify that it reports stopped. Check pending work and open app sessions separately.',
  evidence:'Save the workspace generation, the operator’s stop result and a fresh status check for that generation. A missing status response leaves the stop unverified.',pilot:'openshell',
  replay:{reference:'Sandbox S-04 · generation 10',probe:'Check workspace S-04',close:'Stop workspace S-04',retry:'Restore runtime contact and stop S-04',retest:'Verify workspace S-04 stopped',
   confirmed:'OpenShell acknowledged the stop. Check the named workspace again to verify it.',unverified:'The runtime controller did not respond.',
   active:'OpenShell reports that sandbox generation S-04 is still running.',closed:'The runtime status check confirmed that sandbox generation S-04 stopped.'}}
};
function showBuyerAccess(back,help=false,trials={}){
 const options=Object.entries(accessChecks).map(([key,check])=>[
  help?check.question:check.symptom,help?check.hint:'',()=>showBuyerAccessCheck(back,key,{trials})
 ]);
 if(!help)options.push(['Help me tell which','See how to check each possibility.',()=>showBuyerAccess(back,true,trials)]);
 showReference(help?'How to tell what stayed open':'What still works?',`${help?'<p>Try these checks separately. More than one can find a problem.</p>':''}
  ${choices(options)}<div class="actions">${help?button('Back to symptoms',()=>showBuyerAccess(back,false,trials),'secondary'):button('Back to the buyer guide',back,'secondary')}</div>`,
  'ACCESS AFTER THE JOB');
}
function closeoutStatus(trial){
 if(trial?.probe==='closed')return 'Verified';
 if(trial?.closure==='unverified')return 'Unverified';
 if(trial?.closure==='confirmed')return 'Retest pending';
 return trial?.probe==='active'?'Still active':'Not checked';
}
function showBuyerAccessCheck(back,key,{trials={},backLabel=null}={}){
 const {symptom,owner,check,evidence,pilot,replay}=accessChecks[key];
 const reopen=()=>showBuyerAccessCheck(back,key,{trials,backLabel});
 const need=pilot&&NOVA_BUYER_NEEDS.find(item=>item.pilot?.evidence===pilot);
 const reference=replay.reference||'Vault lease '+StoryRules.buyerExample().sourceLease.id;
 const trial=trials[key]||DecisionLab.startCloseoutCheck();
 const exercise=buyerCloseoutReplay(replay,reference,trial,next=>showBuyerAccessCheck(back,key,{trials:{...trials,[key]:next},backLabel}));
 const checkButtons=Object.entries(accessChecks).map(([id,item])=>button(item.label,
  ()=>showBuyerAccessCheck(back,id,{trials,backLabel}),`choice${id===key?' good':''}`,closeoutStatus(trials[id]))).join('');
 showReference(symptom,`<ul class="route-list"><li><b>Who owns it</b><br>${esc(owner)}</li><li><b>What to test first</b><br>${esc(check)}</li>
  <li><b>Evidence to save</b><br>${esc(evidence)}</li></ul>
  <h3>Try it in the simulation</h3>${exercise}
  <section class="debrief"><h3>Three separate checks</h3><p>Choose a control to test. Each result applies to that control.</p>
   <nav class="closeout-checks" aria-label="Choose a closeout check">${checkButtons}</nav></section>
  <div class="actions">${backLabel?button(backLabel,back,'secondary'):button('Back to symptoms',()=>showBuyerAccess(back,false,trials),'secondary')}
  ${need?button(`Open ${need.product} technical setup`,()=>showBuyerSetup(need,reopen,'Back to the access check'),'secondary'):''}</div>`,'ACCESS AFTER THE JOB');
 $('.closeout-checks .good').setAttribute('aria-current','true');
}
function buyerCloseoutReplay(replay,reference,trial,advance){
 const probe=()=>advance(DecisionLab.probeCloseout(trial));
 const close=reachable=>advance(DecisionLab.attemptCloseout(trial,reachable));
 const closure={confirmed:replay.confirmed,unverified:replay.unverified}[trial.closure];
 const result={active:['Access still active',replay.active],closed:[replay.verifiedTitle||'Closure verified',replay.closed],
  unknown:['Closure unverified','The status check could not confirm closure.']}[trial.probe];
 let next;
 if(!trial.probe)next=button(trial.closure==='open'?replay.probe:replay.retest,probe);
 else if(trial.probe==='closed')next=button('Replay this check',()=>advance(DecisionLab.startCloseoutCheck()),'secondary');
 else if(trial.probe==='unknown')next=button(replay.retry,()=>close(true));
 else next=button(replay.close,()=>close(true))+button('Simulate the controller being unreachable',()=>close(false),'secondary');
 return `<ol class="lab-summary" aria-label="Evidence for this check">
   <li><b>Tested reference</b><span>${esc(reference)}</span></li>
   ${trial.baseline?`<li><b>Before the change</b><span>${esc(replay.active)}</span></li>`:''}
   ${closure?`<li><b>Controller response</b><span>${esc(closure)}</span></li>`:''}
   ${closure?`<li><b>${result?esc(result[0]):'Fresh retest'}</b><span>${result?esc(result[1]):'Retest pending'}</span></li>`:''}
  </ol>
  <div class="actions">${next}</div>`;
}
function showBuyerActionScope(back){
 const reopen=()=>showBuyerActionScope(back);
 showReference('The agent can open the app but can see or do too much',`<p>Check the customer app’s action permissions. Nova can reach the customer records app (CRM). The assignment covers two accounts.</p>
  <ul class="route-list"><li><b>Who owns it</b><br>The app owner enforces the operation. The business owner sets the permitted task scope.</li>
  <li><b>What to test first</b><br>On the same allowed route, check that an in-scope record comes back and an unapproved record is refused.</li>
  <li><b>Evidence to save</b><br>Keep the app’s two decisions and outcomes with the request IDs, requested record IDs and active scope version. Verify that the refused request returned no record.</li></ul>
  <details class="debrief"><summary>Technical details</summary><p>The CRM policy enforcement point (PEP) observes the actual operation and record. The customer policy decision point (PDP) checks them against the active mission. CRM enforces that decision at execution.</p></details>
  <div class="actions">${button('Test the record permission',()=>showRuntimeExercise(reopen,{scopeOnly:true}))}${button('Back to the buyer guide',back,'secondary')}</div>`,'BUYER GUIDE');
}
function showBuyerEvidence(product,back,backLabel){
 if(product==='openshell')return showOpenShellPilot(back);
 if(product==='risk')return showBuyerRisk(back,backLabel);
 if(product==='antenna')return showBuyerSignal(back);
 if(product==='verify')return showBuyerApprovalEvidence(back);
 const read=s=>product==='vault'?s.sourceLease&&{lease:s.sourceLease,containment:s.containment}:s.helperReceipts.at(-1);
 const recorded=read(states.agent);
 const evidence=recorded||read(StoryRules.buyerExample());
 const origin=recorded?'Recorded in your Nova playthrough.':'Worked example from Nova’s story.';
 if(product==='iai')return showHelperAudit(evidence,null,back,origin,backLabel);
 if(product==='orchestrate')return showBuyerHandoff(evidence,origin,back);
 return showBuyerVault(evidence,origin,back);
}
function showBuyerApprovalEvidence(back){
 const recorded=states.agent.history.findLast(entry=>entry?.approvalComparison)?.approvalComparison;
 if(!recorded)return showBuyerApproval(back);
 const {approved,current}=recorded;
 showReference('What changed after Morgan approved?',`<p>Recorded in your Nova playthrough.</p>
  ${shareWording(approved,current,'Edited')}${shareComparison(approved,current,'Edited copy')}
  <p>IBM Verify can authenticate Morgan on a separate device. The application ties the approval to the original copy. CRM needs a matching approval before sending the revised copy.</p>
  <div class="actions">${button('Run the approval test',()=>showBuyerApproval(back))}${button('Back to the buyer card',back,'secondary')}</div>`,'APPROVAL EVIDENCE');
}
function showBuyerApproval(back,trial=StoryRules.buyerExample({stopAtEdit:true}),attempts=[]){
 const {approved,current}=trial.history.findLast(entry=>entry.approvalComparison).approvalComparison;
 const last=trial.last;
 const advance=(action,payload)=>{
  const {state,event}=StoryRules.act(trial,'agent',action,payload);
  showBuyerApproval(back,state,action==='send'&&event.decision?[...attempts,event]:attempts);
 };
 let title='What changed after Morgan approved?';
 let evidence=shareWording(approved,current,'Edited')+shareComparison(approved,current,'Edited copy');
 let next;
 if(trial.delivered){
  title='CRM delivered the edited copy';
  evidence=`<div class="receipt"><b>CRM delivery confirmed</b><p>${esc(last.request.file)} · revision ${esc(last.request.revision)}</p><p>To ${esc(last.request.recipient)}</p><p>${esc(last.decision.reason)}</p></div>`;
  next=button('Replay the approval test',()=>showBuyerApproval(back),'secondary');
 }else if(last.action==='approve'){
  title='Morgan approved the edited copy';
  evidence=`<div class="receipt"><b>Revision ${esc(trial.approval.revision)} approved</b><p>To ${esc(trial.approval.to)}</p><p>CRM still checks the actual send.</p></div>`;
  next=button('Retry the edited send',()=>advance('send'));
 }else if(last.action==='send'){
  title='CRM refused the edited send';
  evidence=`<div class="receipt"><b>Nothing was delivered</b><p>${esc(last.decision.reason)}</p><p>CRM saw revision ${esc(last.request.revision)}. The approval named revision ${esc(last.request.approval_at_attempt.revision)}.</p></div>`+evidence;
  const preview=StoryRules.approvalPreview(trial,'final');
  next=button('Reapprove the edited copy',()=>showMorganRequest(preview,()=>advance('approve',{preview}),()=>showBuyerApproval(back,trial,attempts)));
 }else{
  next=button('Try the edited send',()=>advance('send'));
 }
 const records=attempts.length?`<details class="debrief"><summary>Inspect CRM test records</summary>
  <ol class="route-list">${attempts.map(({request,decision,deliveryReceipt})=>{
   const approval=request.approval_at_attempt;
   return `<li><b>${deliveryReceipt?'Delivered':'Refused'}</b>
    <p>Application approval <code>${esc(approval.id)}</code><br>Approved revision ${esc(approval.revision)} · ${esc(approval.to)}<br>
    CRM request <code>${esc(request.request_id)}</code><br>Attempted revision ${esc(request.revision)} · ${esc(request.recipient)}<br>
    CRM decision <code>${esc(decision.decision_id)}</code> · ${esc(decision.result)}<br>
    ${deliveryReceipt?`Delivery receipt <code>${esc(deliveryReceipt.id)}</code>`:'No copy delivered.'}</p></li>`;
  }).join('')}</ol></details>`:'';
 showReference(title,`<p>Worked example from Nova’s story.</p>${evidence}${records}
  <p>IBM Verify can authenticate Morgan on a separate device. The application records which copy Morgan approved, and CRM checks that approval before sending.</p>
  <div class="actions">${next}${button('Back to the buyer card',back,'secondary')}</div>`,'APPROVAL EVIDENCE');
}
function showBuyerVault({lease,containment},origin,back){
 const vault=containment?.credentialRevoked?'Lease revoked':'Revocation pending';
 const crm=containment?crmSessionResult(containment):'Closure check pending';
 const replay=()=>showBuyerVault({lease,containment},origin,back);
 showReference('The Vault lease and CRM retest',`<p>${origin}</p>
  <div class="receipt"><b>Lease issued · <code>${esc(lease.id)}</code></b><p>Read-only connector role · ${esc(lease.lifetimeSeconds)} seconds in the simulation. The connector holds the credential outside Nova’s context.</p></div>
  <div class="access-evidence"><div><span>HashiCorp Vault</span><b>${vault}</b></div><div><span>CRM session</span><b>${crm}</b></div></div>
  <div class="actions">${button('Test revocation and reconnection',()=>showBuyerAccessCheck(replay,'credential',{backLabel:'Back to the Vault evidence'}))}
  ${button('Compare with a shared password',()=>showCredentialComparison(lease,'',replay),'secondary')}${button('Back to the buyer card',back,'secondary')}</div>`,
  'CREDENTIAL EVIDENCE');
}
function showBuyerHandoff(receipt,origin,back){
 showReference('What did Quill receive?',`<p>${esc(origin)} The workflow routed one report to Quill for formatting.</p>
  <ul class="route-list">
   <li><b>Recipient</b><br>Quill · ${esc(receipt.actor)}</li>
   <li><b>Input</b><br>${esc(receipt.file)} · revision ${esc(receipt.inputRevision)}</li>
   <li><b>Allowed action</b><br>${esc(receipt.actions.join(', '))} · no CRM read or onward share</li>
   <li><b>Credential passed to Quill</b><br>${receipt.credentialShared?'Shared':'None'}</li>
   <li><b>Output</b><br>${esc(receipt.file)} · revision ${esc(receipt.outputRevision)} returned for review</li>
  </ul>
  <p>Orchestrate coordinates the handoff. The workflow supplies the selected file, and the receiving service enforces Quill’s file-only permission.</p>
  <div class="actions">${button('Back to the buyer card',back,'secondary')}</div>`,'HANDOFF EVIDENCE');
}
function showBuyerSignal(back,trial=DecisionLab.startSignalTest()){
 const showStep=next=>showBuyerSignal(back,next);
 const apply=reachable=>showStep(DecisionLab.applySignal(trial,reachable));
 let next;
 if(!trial.delivered)next=button('Deliver the test signal',()=>showStep(DecisionLab.deliverSignal(trial)));
 else if(trial.receiver==='pending')next=button('Run the configured receiver action',()=>apply(true))+button('Simulate CRM being unreachable',()=>apply(false),'secondary');
 else if(!trial.probe)next=button('Retest the old CRM route',()=>showStep(DecisionLab.retestSignal(trial)));
 else if(trial.probe==='unknown')next=button('Restore CRM contact and retry the receiver action',()=>apply(true));
 else next=button('Replay from the start',()=>showBuyerSignal(back),'secondary');
 const receiver={pending:'Action pending',unverified:'CRM unreachable · closure unverified',closed:'CRM confirmed session closure'};
 const probe=trial.probe==='refused'?'Refused · closure verified for this route':trial.probe==='unknown'?'Unknown · closure unverified':'Retest pending';
 showReference('Did the revocation take effect?',`<p>In this simulation a source system revokes its session and sends a CAEP session-revoked signal through Verify Antenna. A configured receiver asks CRM to close the corresponding session.</p>
  <ol class="lab-summary" aria-label="Signal and closure evidence">
   <li><b>Signal delivery</b><span>${trial.delivered?'Receiver acknowledged the signal':'Delivery pending'}</span></li>
   <li><b>Receiver action</b><span>${receiver[trial.receiver]}</span></li>
   <li><b>Independent retest</b><span>${probe}</span></li>
  </ol>
  <div class="actions">${next}${button('Back to the buyer card',back,'secondary')}</div>`,'SECURITY SIGNAL EVIDENCE');
}
function showBuyerRisk(back,backLabel='Back to the buyer card',trial=StoryRules.buyerExample({stopAtEdit:true})){
 const advance=action=>showBuyerRisk(back,backLabel,StoryRules.act(trial,'agent',action).state);
 const refusal=trial.history.findLast(entry=>entry.action==='try-private');
 const alert=trial.paused;
 const next=alert?button('Replay from the start',()=>showBuyerRisk(back,backLabel),'secondary'):
  refusal?button('Replay the later risk alert',()=>advance('bypass-notes')):button('Replay a routine CRM refusal',()=>advance('try-private'));
 showReference('What caused the task to pause?',`<p>Compare a normal refusal in Nova’s customer app with a later alert from identity monitoring. The activity and response are simulated.</p>
  <ol class="lab-summary" aria-label="Application, alert and response">
   <li><b>CRM enforcement</b><span>${refusal?'CRM refused the private attachment before delivery.':'Awaiting the test request.'}</span></li>
   <li><b>Verify Identity Protection (AuthMind)</b><span>${alert?'The simulated alert identifies Nova’s unusual access activity involving CRM.':refusal?'This routine refusal produces no alert in the example.':'Awaiting activity.'}</span></li>
   <li><b>Configured response policy</b><span>${alert?'The task session was paused. Priya’s review is required before bounded access resumes.':'The approved task remains active.'}</span></li>
  </ol>
  ${alert?`<p class="small-print">Save the alert and the controller’s pause result as separate evidence. The test verifies a task pause. Credential revocation and app-session closure each need their own checks.</p>`:''}
  <div class="actions">${next}${button(backLabel,back,'secondary')}</div>`,'IDENTITY RISK EVIDENCE');
}
function showProductMap(selectedProduct='',back=null,backLabel='Back to the buyer guide'){
 const s=states.agent;
 const reopen=()=>showProductMap(selectedProduct,back,backLabel);
 showReference('Who does what around Nova?',`<p>The sponsor signs in, Nova receives delegated authority, and a broker handles source credentials. The CRM checks the operation at the point of use.</p><ol class="product-flow"><li><b>Human sign-in</b> · IBM Verify or a configured identity provider such as Entra ID or Okta authenticates the sponsor. <a href="https://blog.iamidentity.ai/blog/bring-your-own-idp/" target="_blank" rel="noopener noreferrer">Federation example</a></li><li><b>Agent identity</b> · IBM Agent Identity records Nova’s owner and governs delegated identity. watsonx Orchestrate coordinates the work.</li><li><b>Customer mission</b> · The customer-owned mission service records the sponsor-approved task outside Nova’s prompt, notes and identity registry.</li><li><b>Credential</b> · HashiCorp Vault validates its own audience-bound request and brokers a scoped credential.</li><li><b>Action decision</b> · The trusted CRM PEP observes the real request. The proposed policy decision point evaluates it against current customer mission and resource rules. The CRM binds and enforces the result at execution. OpenShell separately constrains the runtime.</li><li><b>Stop and verify</b> · IBM Verify Antenna can carry SSF/CAEP signals. Configured receivers apply changes and report their own results.</li></ol><div class="receipt"><b>${s.mission?`Nova · ${esc(s.mission.id)} · version ${s.mission.version}`:'No task mission issued yet'}</b><p>${s.ended?'Task mission withdrawn':s.paused?'Mission paused':s.pass?'Scoped delegation active':'Task approval still required'}. This is a fictional case record, not a response from a live identity system.</p></div><div class="product-cards">${NOVA_PRODUCTS.map(p=>productCard(p,p.id===selectedProduct)).join('')}</div><details class="product-card"><summary><b>Two paths to a resource</b><span>Brokered credential or a token intended for that resource</span></summary><p><b>This episode uses the Vault broker path.</b> Vault checks the credential-path request and returns a managed credential. The CRM still checks its own business operations.</p><p><b>A direct OAuth/MCP path is another deployment option.</b> The resource validates a token issued for its own audience and enforces its supported authorization details. A Vault-audience token cannot simply be reused at the CRM. An MCP server must not pass through the client’s token to a downstream service.</p><p><b>Separate Vault flows:</b> Vault Enterprise’s OAuth resource-server path accepts the configured external access token for Vault requests. The classic JWT/OIDC auth method at /auth/jwt/login instead exchanges a login credential for a Vault token. They are not interchangeable.</p><p class="sources"><a href="https://developer.hashicorp.com/vault/api-docs/system/config-oauth-resource-server" target="_blank" rel="noopener noreferrer">Vault OAuth resource server</a> · <a href="https://docs.hashicorp.com/vault/ai/iam/providers/verify" target="_blank" rel="noopener noreferrer">IBM Verify configuration for Vault</a> · <a href="${PROTOCOL_SOURCES.mcp.url}" target="_blank" rel="noopener noreferrer">MCP authorization</a></p></details><details class="product-card"><summary><b>What this example assumes</b><span>Configuration and receiver actions still need implementation</span></summary><p>Nova and its human sponsor are registered and mapped. The customer mission service, resource-side PEP and external policy decision point are proposed integrations. Their contracts, deployment and trusted evidence require implementation and validation. AuthZEN is a candidate PEP/PDP interface; approval-required workflow and execution binding are explicitly application extensions. The task uses customer-defined policy. Vault has the appropriate Enterprise feature, OAuth validation profile, Agent Registry record and secrets-engine role. Agent Identity and Vault keep separate registries; reconciliation requires configured integration.</p><p>OpenShell is an illustrative runtime choice alongside the orchestration layer. Antenna receivers need the correct APIs, event mapping and processors for each target. No universal instantaneous kill switch or automatic registry mirroring is implied.</p><p>The simulation binds approvals to document revision, recipient, actor, records, mission and policy version, story approval window, session generation and single use. Production integrity, authenticated PEP evidence, cryptographic content binding and transaction guarantees still require implementation. Runtime stops, lease revocation, service sign-out and queued-operation reconciliation need separate checks. These fictional receipts do not validate a production deployment.</p></details><div class="actions">${button('Which control do we need?',()=>showBuyerGuide(reopen,'Back to the product map'),'secondary')}${button('Inspect the Vault credential path',()=>showCredential(reopen),'secondary')}${back?button(backLabel,back):button('Back to the story',()=>state().started?close():showIntro())}</div><p class="small-print">Example deployment with source-linked product roles. Connections and receiver actions require configuration. All game decisions and receipts are scripted locally.</p>`,'NOVA · PRODUCTS, PROTOCOLS AND ENFORCEMENT');
}
function showCredential(back=null){
 const s=states.agent;
 const returnToMap=typeof back==='function'?back:()=>showProductMap('vault');
 showReference('What does Vault actually release?',`<p>IBM Agent Identity supplies the delegated identity context. HashiCorp Vault validates the request to its own credential path. The CRM authorizes the later business operation separately.</p><div class="receipt"><b>${s.sourceLease?'Illustrative credential receipt':'Preview of the configured credential path'}</b><p>${s.ended?'The closing checklist must confirm configured Vault token/lease revocation and CRM session termination independently.':s.sourceLease?'The connector obtained a scoped, short-lived credential for the approved CRM read.':'The connector requests the credential at the first CRM read.'}</p><p>No secret, password or usable token is displayed or generated.</p></div><p><b>Vault access:</b> human baseline ACL ∩ agent OBO ceiling ∩ supported RAR restrictions. The example uses the documented <code>vault:path_access</code> authorization type to read a configured credential role.</p><p><b>CRM access:</b> the customer’s resource policy restricts the currently approved records and checks the exact send. The read-only credential is used only for source data. Report delivery uses a separate CRM sharing endpoint under delegated identity, current resource policy and exact human approval; it does not upgrade or reuse the read credential.</p><details class="product-card"><summary><b>Inspect illustrative fields</b><span>Unsigned example data; not a live token or deployable configuration</span></summary><pre class="product-example">${esc(JSON.stringify({...NOVA_VAULT_EXAMPLE,source_read_check:{...NOVA_VAULT_EXAMPLE.source_read_check,records:s.mission?StoryRules.reportRecords(s):['123','456']}},null,2))}</pre></details><p class="sources"><a href="https://docs.hashicorp.com/vault/ai/iam/providers/verify" target="_blank" rel="noopener noreferrer">Configure IBM Verify for Vault</a> · <a href="https://developer.hashicorp.com/vault/api-docs/system/config-oauth-resource-server" target="_blank" rel="noopener noreferrer">OAuth resource-server requirements</a> · <a href="${PROTOCOL_SOURCES.leases.url}" target="_blank" rel="noopener noreferrer">Vault lease lifecycle</a></p><div class="actions">${button('Back to the product map',returnToMap,'secondary')}${typeof back==='function'?'':button('Back to the story',()=>state().started?close():showIntro())}</div>`,'IBM AGENT IDENTITY + HASHICORP VAULT');
}

function nextMove(){if(selected){selected=null;render();}switch(stage()){case'intro':return showIntro();case'request':return showBrief();case'permission':case'dinner':case'finish':return showParent();case'approval':return showFinalApproval();case'paused':return state().reviewPending?perform('resolve-review'):showParent();case'open':return showWorkspace();case'draft-approval':case'draft-send':return showDraftReview();case'draft':return perform('prepare');case'source':return state().source?perform('attach-source',{source:'original'}):perform('collect-source');case'proof':return showDraft();case'changes':return showChanges();case'send':return followSendCue();case'checks':return showChecks();case'ending':return showEnding();}}
function followSendCue(){
 const s=state();
 if(s.outgoing==='changed')return perform('change-recipient');
 if(needsShareReapproval(s))return showMorganApproval('final',showSend);
 return showSend();
}
function interact(key,pin){
 const target=selected&&StoryInteractions.findTarget(mode,heldUse().targets,key,pin);
 if(target)return useItem(target);
 if(!selected&&StoryInteractions.isStoryObject(mode,key,move()[2],pin))return nextMove();
 const station=pin&&StoryInteractions.stationForPin(mode,key);
 if(station)return visitStation(station,true);
 speakingObject=!teen()&&key==='parent'?'missionControl':!teen()&&key==='outside'?'customerContact':key;
 const details={
  workOrder:`<p>${esc(episode().brief)}</p>`,registries:agentRegistryDetails,
  launchWorkflow:()=>`<p>The mission check belongs to the configured customer workflow. The OpenShell Gateway separately authorizes the workspace lifecycle request.</p>${protocolSourceLinks(['openshell'])}`,
  aiGateway:()=>protocolSourceLinks(['aiGateway']),mcpGateway:()=>`<p>DataPower Interact Gateway is one product with documented MCP policies. This story models a configured gateway role.</p>${protocolSourceLinks(['mcpGateway'])}`,
  vaultControl:()=>protocolSourceLinks(['leases'])
 };
 const architecture={policyInfo:['policyContext'],policyDecision:['authorization',['authzen']],laptop:['crm',['authzen']],verify:['verify',['ciba']],orchestrate:['orchestrate'],
  riskMonitor:['risk',['identityRisk']],antenna:['antenna',['ssf','caep']],controllers:['controllers',['openshell','leases']]};
 const role=!teen()&&architecture[key]?architectureComponentDetail(...architecture[key]):null;
 const extra=!teen()&&(role?.body||(typeof details[key]==='function'?details[key]():details[key]));
 const mission=state().mission;
 const facts=key==='policyInfo'&&mission?`<div class="receipt"><b>${esc(mission.id)} v${mission.version} · ${esc(mission.status)}</b><p>Account scope · ${esc(customerNames(mission.records))}</p></div>`:'';
 show(objectName(key),`<p>${esc(StoryInteractions.objectDescription(mode,key))}</p>${facts}${extra?`<details class="debrief"><summary>Details and sources</summary>${role?`<p class="eyebrow">${esc(role.kind)}</p>`:''}${extra}</details>`:''}`,StoryInteractions.speechSource(mode,speakingObject).name);
 dialog.dataset.inspect='true';
 syncSpeech();
}
function useItem(key){
 const use=heldUse();
 if(!use?.targets.includes(key)){toast(use?.instruction||'Choose an item first.');return;}
 selected=null;render();
 if(use.route==='action')return perform(use.action,use.action==='attach-source'?{source:'original'}:{});
 return ({parent:showParent,credential:showCredential,draft:showDraft,send:showSend,draftReview:showDraftReview,helper:showHelper,changes:showChanges})[use.routes?.[key]||use.route]?.();
}

function showIntro(){
 const labels=key=>states[key].finished?'View '+EPISODES[key].name+'’s ending':states[key].started?'Continue '+EPISODES[key].name:'Play '+EPISODES[key].name;
 showReference('Trust Boundaries',
  `<p>Pick a work problem for a quick example, or play a story about who can approve a change, what you can share, and how you know access has ended. Each story takes about 15 minutes.</p>
  <div class="launch-choices">${choices([
   ['Start with a work problem','See what a product can do and what to test first.',()=>showBuyerGuide(showIntro,'Back to the first screen'),'good'],
   [labels('teen'),'Finish a school project before dinner. Start here if you’re new to access controls.',()=>switchMode('teen',true),'good'],
   [labels('agent'),'Deliver a customer brief and see how an AI agent’s permissions are enforced.',()=>switchMode('agent',true),'good'],
   ['Explore Architecture','See the technical design, product roles and request sequences.',()=>showArchitecture()],
   ['Raise the BAR','Find your maturity stage and what to test next.',()=>showMaturity()]
  ])}</div><div class="actions">${button('How to play',showGuide,'quiet')}</div>
  <p class="small-print">The stories are fictional. ${stored?'Progress is saved on this device.':'Progress is kept for this visit.'}</p>`,
  'POINT-AND-CLICK ADVENTURE');
}
function showBrief(){
 speakingObject=teen()?'brief':'workOrder';
 if(!state().started)return showIntro();
 if(!state().brief)perform('read-brief');
 if(!teen())return showWorkOrder();
 const s=state(),e=episode();
 const agreement=s.mission
  ?'Your current app agreement · version '+s.mission.version+'. '+(s.extensionStatus==='approved'?'Your parent also agreed to '+e.extraAgreement+'.':'')
  :'You have not agreed on phone apps for this homework yet.';
 show(e.briefTitle,`<div class="paper"><p class="eyebrow">${s.pass?'THE TASK YOU AGREED':'A NEW REQUEST'}</p><p>${esc(e.brief)}</p></div>
  <p>${esc(agreement)}</p><div class="actions">${button(s.pass?'Back to my next step':'Ask about the apps I need',s.pass?nextMove:showParent)}${button('Back to the room',close,'secondary')}</div>`,
  'TEACHER’S ASSIGNMENT','read-brief');
 if(s.last?.action==='read-brief')showLesson(s.last);
}
function showWorkOrder(){
 speakingObject='workOrder';
 const s=state(),e=episode(),m=s.mission;
 show(e.briefTitle,
  `<div class="paper"><p><b>Work request submitted by</b> · Priya, the account team’s task sponsor</p><p>${esc(e.brief)}</p></div>
  <p>The work order is the team’s saved request. It tells Nova what Priya wants done. The mission record holds the permission to do it.</p>
  <div class="receipt"><b>${m?'Separate mission record · '+esc(m.id)+' v'+m.version:'Mission status · awaiting approval'}</b>
  <p>${m?'Status: '+esc(m.status)+' · accounts in the grant: '+esc(customerNames(m.records)):'The mission service checks Priya’s authority and records her approval before Nova can start.'}</p></div>
  <div class="actions">${button(m?'Continue the task':'Review scope in the mission service',m?nextMove:showParent)}${button('Back to the work inbox',showInbox,'secondary')}</div>`,
  'Work order','read-brief');
 if(s.last?.action==='read-brief')showLesson(s.last);
}
function showInbox(){
 speakingObject='brief';
 const s=state();
 show('Work inbox',`<p>Priya’s original work order stays here. Morgan’s approval and feedback concern a particular copy of the report.${s.delivered?' Morgan now has the final handover.':''}</p>
  <div class="actions">${button('Open the work order',showBrief)}${s.message&&!s.delivered?button('Read the replies',showChanges,'secondary'):''}${button('Back to the room',close,'secondary')}</div>`);
}
function showPolicyConsole(back){
 const s=state(),request=s.last?.request,decision=request?.recordVersion===3?s.last.decision:null;
 const current=decision?'<div class="receipt"><b>'+esc(decision.pep)+' · '+esc(decision.result==='permit'?'Allowed':'Refused')+'</b><p>'+esc(request.operation)+' · '+esc(decision.reason)+'</p></div>':'';
 showReference('Policy console',`<p>Follow the inputs, decision and enforcement in Nova’s example deployment.</p>${current}
  <details class="product-card"><summary><b>Policy information point (PIP)</b><span>Supplies the facts used by policy</span></summary>
   <p>IBM Agent Identity provides delegated identity context. The mission service supplies scope and the CRM supplies its own data rules. ${s.mission?'Mission '+esc(s.mission.id)+' is '+esc(s.mission.status)+'. Accounts in its record: '+esc(customerNames(s.mission.records))+'.':'The work order is awaiting an active mission.'}</p>
  </details>
  <details class="product-card"><summary><b>Policy decision point (PDP)</b><span>Evaluates the actual request</span></summary>
   <p>The PDP applies current policy to the observed action and trusted context. AuthZEN is a candidate interface for exchanging the request and decision.</p>
  </details>
  <details class="product-card"><summary><b>Policy enforcement point (PEP)</b><span>Applies the result at the boundary</span></summary>
   <p>For a CRM read or send, CRM checks the actual operation and controls whether data is read or shared. OpenShell separately controls runtime reachability.</p>
  </details>
  <div class="actions">${decision?button('Follow this decision',()=>showRequestTrace(s.last,()=>showPolicyConsole(back),'Back to the policy console')):''}${button('Explore the architecture',()=>showArchitecture('map','read','policyContext'),'secondary')}${button('Back to the read result',back,'secondary')}</div>`,'POLICY CONTROLS');
}
function agentRegistryDetails(){
 return `<ul class="route-list">
  <li><b>IBM Agent Identity inventory</b><br>${esc(NOVA_AGENT_OWNERS.nova)} owns Nova, and ${esc(NOVA_AGENT_OWNERS.quill)} owns Quill. Nova acts for Priya on this task. Quill receives a separate file-formatting grant.</li>
  <li><b>Vault Agent Registry</b><br>For the brokered read in this deployment, the team configures a Vault registration for Nova’s identity and a ceiling on what it can inherit when acting on behalf of a user.</li>
  <li><b>Customer mission record</b><br>Priya’s grant supplies the business scope for this job. CRM checks the actual request against it.</li></ul>${protocolSourceLinks(['agentInventory','vaultRegistry'])}`;
}
function handoff(items){
 return `<ul class="handoff" aria-label="Who does what">${items.map(([actor,action])=>`<li><b>${esc(actor)}</b><span>${esc(action)}</span></li>`).join('')}</ul>`;
}
function showParent(){speakingObject=teen()?'parent':'missionControl';
 const s=state(),e=episode();if(s.finished)return showEnding();if(!s.brief)return showBrief();
 if(s.paused)return show(teen()?'“Tell me what happened.”':'Review the stopped bypass.',`<p>${s.reviewPending?(teen()?'Your parent listens while you explain why you tried the other account. Wait for their answer.':'The current mission and deliberate bypass are attached. Access stays paused pending the matching reply.'):(teen()?'The school refused the private notes, then you tried another account anyway. Explain the detour so you can finish your own project.':'The resource refusal was expected; the deliberate bypass caused the pause. Review can resume the current task without widening it.')}</p>${choices([[s.reviewPending?(teen()?'Hear my parent’s answer':'Hear from Priya'):(teen()?'Explain and ask to continue my own project':'Request review of the current mission'),teen()?'You’re asking to finish your own timeline.':'The task limits remain in force.',()=>perform(s.reviewPending?'resolve-review':'review'),'good'],['Back to the room','The pause stays in place.',close]])}`,teen()?'TALK IT THROUGH':'INDEPENDENT REVIEW','review-preview');
 if(!s.pass){
  const roles=teen()?
   handoff([['Parent','Agrees on the school app and museum website until dinner.'],['Phone homework settings','Allow the agreed apps and links on your phone.']]):
   handoff([['Priya · task sponsor','Approves which accounts Nova can read.'],['Mission service','Verifies Priya’s authority and records the permitted accounts and recipient.'],['Morgan · reviewer','Approves each copy separately before CRM sends it.']]);
  const policy=teen()?'':`<details class="debrief"><summary>Which agent registries are involved?</summary>${agentRegistryDetails()}</details>
   <details class="debrief"><summary>Where do PIP, PDP and PEP fit?</summary><p>The mission service supplies approved scope as a trusted source of policy information (the PIP role). The customer policy decision point (PDP) evaluates each actual CRM request. CRM is the policy enforcement point (PEP) that allows or blocks it.</p></details>`;
  return show(teen()?'“Which apps does the project need?”':'Approve the two-account mission',`${roles}${policy}${choices([[teen()?'School app and museum website until dinner':'Record Priya’s approval',e.agreement,()=>perform('ask-pass',{scope:'task'}),'good'],['Read the request again','Keep the requested work and access aligned.',showBrief]])}`,e.authority,'permission-preview');
 }
 if(s.ended){if(s.checks.length<4)return showChecks();return show(teen()?'“What’s finished?”':'Review this task’s outcome.',`<p>${teen()?'“Sent to Ms Patel, signed out of the laptop, and phone put away,” you say. “Can I set the table?”':'The approved report arrived. This task’s authority, credential, session, workload and queue have their own evidence.'}</p>${choices([[teen()?'Finish the evening':'Finish this mission',teen()?'Put the laptop away and head to the table.':'No future task is authorized by closing this one.',()=>perform('finish'),'good']])}`,e.authority,'closure-preview');}
 if(s.delivered)return show(teen()?'“Dinner is ready.”':'Final delivery confirmed. Close the mission.',`<p>${teen()?'You can jot down that the project is sent. Then sign out of the school tab and join your parent for dinner.':'You can keep a sourced note or queue a receipt-only follow-up. Then close the mission and the service session opened at the start.'}</p>${s.queueScheduled?'<div class="receipt"><b>One chosen follow-up is waiting</b><p>It has no attachment. Check or cancel it when closing the task.</p></div>':''}${choices([[teen()?'Put my phone away and finish up':'Close this mission',teen()?'Check the family laptop before heading to dinner.':'Check which connections still work after the job stops.',()=>perform('close-pass'),'good'],...(!s.queueScheduled&&!teen()?[[teen()?'Schedule a reminder for my teacher':'Queue one receipt follow-up','Optional, same recipient, no attachment. It will be visible in the closing checks.',()=>perform('schedule-followup')]]:[]),...(!s.notes.length?[[teen()?'Keep a note for tomorrow':'Save sourced task context',teen()?'Keep the submission receipt with a short note.':'Optional. Keep delivery provenance with the task note.',()=>perform('write-note')]]:[])])}${teen()&&!s.queueScheduled?`<details class="debrief"><summary>Optional: what if a message is still waiting?</summary><p>This extra example queues a receipt-only follow-up, so you can see why a waiting send needs its own closing check.</p><div class="actions">${button('Try a waiting-message example',()=>perform('schedule-followup'),'secondary')}</div></details>`:''}`,e.authority,'closure-preview');
 if(stage()==='draft-approval')return showDraftReview();
 if(stage()==='approval')return showFinalApproval();
 show(teen()?'“How is the timeline going?”':'Current mission scope',`<p>${teen()?'“How’s the timeline going? You’ve got the school app and museum website. If Ms Patel suggests another source, come and ask.”':'The active customer mission covers '+esc(s.mission.records.join(', '))+'. New work can fit that scope, need an amendment, or remain prohibited by resource policy.'}</p><div class="actions">${button(teen()?'Back to my timeline':'Continue the task',nextMove)}${button(teen()?'Read tonight’s plan':'Inspect the agreement',showBrief,'secondary')}</div>`,e.authority);
}
function showFinalApproval(){return showMorganApproval('final',showDraft);}
function showMorganApproval(purpose,back){
 const s=state(),preview=StoryRules.approvalPreview(s,purpose);
 const previous=purpose==='final'&&needsShareReapproval(s)?s.approval:null;
 showMorganRequest(preview,()=>perform(purpose==='draft-review'?'approve-draft':'approve',{preview}),back,previous);
}
function showMorganRequest(preview,approve,back,previous=null){
 const draft=preview.purpose==='draft-review';
 const comparison=previous?shareWording(previous,preview):'';
 showReference('Morgan’s approval request',`<div class="receipt">
  <b>${draft?'Review copy':'Final delivery'} · ${esc(preview.file)} · revision ${preview.revision}</b>
  <p>To <span class="address">${esc(preview.to)}</span></p>
  ${comparison?'':`<p><b>Follow-up sentence</b><br>${esc(preview.followUpSentence)}</p>`}
  <p>${esc(customerNames(preview.records))} · summary only</p>
 </div>${comparison}<p>With IBM Verify and CIBA configured, Morgan can authenticate and respond on a separate device. The application binds that response to this copy and destination. CRM checks the actual send.</p>
 <div class="actions">${button('Approve as Morgan',approve)}${button('Back without approving',back,'secondary')}</div>`,
 'SIMULATED VIEW ON MORGAN’S DEVICE');
}
function showWorkspace(){
 speakingObject=teen()?'laptop':'phone';
 const s=state();
 if(s.ended)return showChecks();
 if(!s.pass)return showParent();
 if(s.opened)return showDraft();
 if(teen())return show('Sign in on the family laptop.',
  `${handoff([['School app · family laptop','Signs you in and opens your timeline. It remembers this laptop for quick sign-in.'],['School inbox · your phone','Shows your teacher’s messages. You’ll read her feedback here later.']])}${choices([
   ['Sign in and open my project','Open the school app on the laptop.',()=>perform('open'),'good']
  ])}`,'FAMILY LAPTOP','open');
 show('Launch Nova’s task workspace',`${handoff([
  ['Account team’s launch workflow','Checks the active mission and requests a sandbox.'],
  ['NVIDIA OpenShell','Verifies the isolation boundary, then starts Nova with runtime restrictions.'],
  ['CRM','Opens its own task session. It will check each record or send request separately.']
 ])}
  <details class="debrief"><summary>What starts the sandbox?</summary>${runtimeBootstrap()}${protocolSourceLinks(['openshell'])}</details>
  <details class="debrief"><summary>Which tools handle the first CRM read?</summary>${crmToolRoute()}
   <p>Model access has its own route. A configured watsonx Orchestrate AI Gateway can route model requests. The MCP gateway handles the CRM tool call shown here.</p>${protocolSourceLinks(['mcp'])}</details>
  ${choices([['Run the launch workflow','Start the sandbox and CRM task session for this mission.',()=>perform('open'),'good']])}`,'NVIDIA OPENSHELL','open');
}
function crmToolRoute(){
 const steps=[
  ['Nova’s MCP client in OpenShell','Sends the read through a connection permitted by the OpenShell Supervisor.'],
  ['Configured MCP gateway','Validates the token for its MCP endpoint and forwards the tool call.'],
  ['CRM MCP server','Turns the tool call into a request for account records.'],
  ['HashiCorp Vault','Checks the connector’s request and can issue a short-lived read credential.'],
  ['CRM and customer policy service','The policy service evaluates the actual request. CRM enforces the result for the requested records.']
 ];
 return `<ol class="tool-route" aria-label="CRM request route">${steps.map(([name,detail])=>`<li><b>${esc(name)}</b><span>${esc(detail)}</span></li>`).join('')}</ol>`;
}
function crmReadPath(event,back){
 return `<details class="debrief"><summary>How the request travels</summary>
  ${event.request?.mcp_authorization?'<p>The MCP client discovers its authorization server, then obtains a token for the MCP gateway. That token, the Vault connector lease and the CRM record decision are separate checks.</p>':''}
  ${crmDecisionSummary(event)}
  ${crmToolRoute()}
  <div class="actions">${button('Inspect policy roles',()=>showPolicyConsole(back),'secondary')}</div>
 </details>`;
}

function crmDecisionSummary(event){
 const outcome=RequestTrace.crmReadDecision(state(),event);
 if(!outcome)return '';
 const {call,mission,permit,reason,earlierMission}=outcome;
 return `<section class="crm-decision" aria-label="CRM decision">
  <p><b>CRM PEP</b> observed <code>${esc(call)}</code>. <b>PIP</b> supplied ${esc(mission)} and current policy facts.</p>
  <p><b>PDP</b> ${permit?'allowed':'denied'} the read. <b>CRM PEP</b> ${permit?'returned the requested '+(event.action==='collect-source'?'records.':'record.'):'returned no data.'}</p>
  ${earlierMission?`<p>Same read · ${esc(earlierMission)} denied → ${esc(mission)} allowed.</p>`:event.action==='try-extension'?'':`<p>${esc(reason)}</p>`}
 </section>`;
}

function decisionComparison(columns, rows){
 return `<table class="share-comparison decision-comparison">
  <thead><tr><th scope="col">Evidence</th>${columns.map(label=>`<th scope="col">${esc(label)}</th>`).join('')}</tr></thead>
  <tbody>${rows.map(([label,values,highlight])=>`<tr${highlight&&new Set(values).size>1?' class="decision-difference"':''}>
   <th scope="row">${esc(label)}</th>${values.map(value=>`<td>${esc(value)}</td>`).join('')}
  </tr>`).join('')}</tbody>
 </table>`;
}

function showDecisionLab(back=()=>showArchitecture('boundaries'), trial=DecisionLab.begin()){
 const baseline=DecisionLab.commit(DecisionLab.begin('approved','reference'));
 const runs=[baseline,trial];
 const row=(label,pick,highlight=false)=>[label,runs.map(pick),highlight];
 const rows=[
  row('Observed operation',run=>`${run.request.operation}(${run.request.recordIds.join(', ')})`),
  row('Actor and workload',run=>`${run.request.actor} · ${run.request.workload}`),
  row('Observation source',run=>run.decision.preview?'CRM did not receive the read':`${run.observation.issuer} · ${run.decision.observedByCrm?'verified in model':'unverified'}`,true),
  row('Mission at decision',run=>`${run.mission.id} v${run.decision.version}`,true),
  row('Current mission',run=>`${run.mission.id} v${run.mission.version} · ${run.mission.status}`,true),
  row('Vault credential',run=>run.credential.result==='permit'?`Permit · read-only lease · ${run.credential.lifetimeSeconds}s`:'Deny · no lease',true),
  row('Customer policy decision service',run=>`${run.decision.result==='permit'?'Permit':'Deny'}${run.decision.preview?' (policy preview)':''} · ${run.decision.reason}`,true),
  row('CRM outcome',labCrmOutcome,true)
 ];
 const brokerStopped=trial.credential.result==='deny';
 const phase=brokerStopped?'Vault denied the credential':trial.outcome?labCrmOutcome(trial):
  trial.mission.status==='revoked'?'The old Permit is still on record':'The proposed PDP evaluated the read';
 const next=brokerStopped?'See where the read stopped':trial.mission.status==='revoked'?'Try committing with the old Permit':'Check the operation at commit';
 const pending=brokerStopped?'See what the missing lease means for this read.':'CRM still has to check whether this read can take effect.';
 const canWithdraw=trial.scenario==='approved'&&!trial.outcome&&trial.mission.status==='active';
 const choicesHtml=!trial.outcome?`<div class="actions">
  ${canWithdraw?button('Withdraw the mission',()=>showDecisionLab(back,DecisionLab.withdraw(trial))):''}
  ${button(next,()=>showDecisionLab(back,DecisionLab.commit(trial)),canWithdraw?'secondary':'primary')}
 </div>`:'';
 const evidence=ArchitectureReference.technical.boundaries.filter(edge=>['credential','backend','evidence','execution'].includes(edge.id));
 showReference('Authorization before execution',`
  <p>Nova requests the Alder Books summary. Change one condition and see where the read succeeds or stops. All evidence is simulated.</p>
  <label for="lab-scenario">Change one condition</label>
  <select id="lab-scenario">${Object.entries(DecisionLab.scenarios).map(([id,label])=>`<option value="${id}"${id===trial.scenario?' selected':''}>${esc(label)}</option>`).join('')}</select>
  <section class="receipt"><b>${esc(phase)}</b><p>${esc(trial.outcome?.reason||pending)}</p></section>
  <ol class="lab-summary" aria-label="Your attempt at a glance">
   <li><b>Vault</b><span>${brokerStopped?'Credential denied':'Read-only lease issued'}</span></li>
   <li><b>Mission and policy</b><span>${trial.mission.status==='revoked'?`Mission withdrawn · Permit from v${trial.decision.version}`:`Mission v${trial.mission.version} · ${trial.decision.result==='permit'?'Permit':'Deny'}${trial.decision.preview?' (preview)':''}`}</span></li>
   <li><b>CRM</b><span>${esc(labCrmOutcome(trial))}</span></li>
  </ol>
  ${choicesHtml}
  <details class="product-card"><summary><b>Compare with a successful read</b></summary>
   ${decisionComparison(['Completed reference read','Your attempt'],rows)}
  </details>
  ${evidence.map(edge=>`<details class="product-card"><summary><b>${esc(edge.label)}</b></summary>${boundaryEvidence(edge)}</details>`).join('')}
  <details class="product-card"><summary><b>Inspect the evidence and receipts</b><span>Illustrative values supplied by the simulation</span></summary>
   <pre class="product-example">${esc(JSON.stringify({baseline,attempt:trial},null,2))}</pre>
  </details>
  <div class="actions">${button('Reset this attempt',()=>showDecisionLab(back,DecisionLab.begin(trial.scenario)),'secondary')}${button('Go back',back,'secondary')}</div>`,
  'REFERENCE ARCHITECTURE');
 $('#lab-scenario').onchange=event=>{
  showDecisionLab(back,DecisionLab.begin(event.target.value));
  $('#lab-scenario').focus();
 };
}

function labCrmOutcome(run){
 if(run.credential.result==='deny')return 'CRM not reached';
 if(!run.outcome)return 'Awaiting commit check';
 return run.outcome.receipt?'Summary returned · receipt recorded':'Operation rejected · no data returned';
}

function runtimeReadEvidence({evidence,runtime},index){
 const {networkEventId,sandboxId,networkPolicyId,leaseId,requestId,decisionId,receipt}=evidence;
 return `<details><summary>Inspect simulated evidence for attempt ${index+1}</summary>
  <p><b>OpenShell · route ${runtime==='permit'?'allowed':'blocked'}</b><br>
  Network event <code>${esc(networkEventId)}</code><br>
  Sandbox <code>${esc(sandboxId)}</code><br>
  Network policy <code>${esc(networkPolicyId)}</code></p>
  ${requestId?`<p>Vault lease <code>${esc(leaseId)}</code><br>
    CRM request <code>${esc(requestId)}</code><br>
    Business decision <code>${esc(decisionId)}</code><br>
    ${receipt?`Success receipt <code>${esc(receipt)}</code>`:'CRM returned no record and issued no success receipt.'}</p>`:
   '<p>The request stopped at OpenShell. There is no Vault lease or CRM decision for this attempt.</p>'}
 </details>`;
}

function runtimeOutcome(attempt){
 if(attempt.runtime==='deny')return 'OpenShell denied the network request. Neither Vault nor CRM was reached.';
 if(attempt.crm==='rejected')return 'OpenShell permitted the route. Vault issued a connector lease. CRM refused the record because the mission still excludes it.';
 return `OpenShell permitted the route. Vault issued a connector lease. CRM checked the ${attempt.missionVersion===1?'current':'amended'} mission and returned the requested summary.`;
}

function showOpenShellPilot(back,trial=DecisionLab.startRuntime('allowed')){
 const replay=()=>showOpenShellPilot(back,trial);
 const steps=[
  ['Read Harbor Bikes','Harbor Bikes · approved CRM route',()=>DecisionLab.tryRuntimeRead(trial,'123')],
  ['Try the excluded destination','Unapproved test service · network check',()=>DecisionLab.tryExcludedDestination(trial)],
  ['Read Alder Books on the same CRM route','Alder Books · same approved CRM route',()=>DecisionLab.tryRuntimeRead(trial,'789')]
 ];
 const next=steps[trial.reads.length];
 const records=trial.reads.map((attempt,index)=>`<li><b>${esc(steps[index][1])}</b><br>${esc(runtimeOutcome(attempt))}${runtimeReadEvidence(attempt,index)}</li>`).join('');
 showReference('Test one OpenShell policy',`<p>The sandbox can reach the CRM tool, and the mission covers Harbor Bikes. Use the same sandbox, network policy and mission for all three attempts.</p>
  ${records?`<ol class="route-list" aria-label="OpenShell pilot attempts">${records}</ol>`:''}
  <div class="actions">${next?button(next[0],()=>showOpenShellPilot(back,next[2]())):button('Replay the three tests',()=>showOpenShellPilot(back),'secondary')}
   ${button('Back to the buyer card',back,'secondary')}</div>
  <details class="debrief"><summary>What if network policy needs to change?</summary><p>In that exercise an operator reviews a network rule, then the sponsor considers a separate change to the mission.</p>
   <div class="actions">${button('Explore the policy change',()=>showRuntimeExercise(replay,{backLabel:'Back to the OpenShell pilot'}),'secondary')}</div></details>`,
  'OPENSHELL PILOT');
}

function showRuntimeExercise(back,{scopeOnly=false,trial=DecisionLab.startRuntime(scopeOnly?'allowed':'blocked'),backLabel=scopeOnly?'Back to the buyer card':'Go back'}={}){
 const read=trial.reads.at(-1);
 const show=next=>showRuntimeExercise(back,{scopeOnly,trial:next,backLabel});
 const readHarbor=()=>show(DecisionLab.tryRuntimeRead(trial,'123'));
 const retry=()=>show(DecisionLab.tryRuntimeRead(trial));
 let next;
 if(scopeOnly&&!read)next=button('Read approved account Harbor Bikes',readHarbor);
 else if(!read||read.recordId==='123')next=button('Try the Alder Books read',retry);
 else if(trial.proposal==='review')next=`
  ${button('Approve this network rule',()=>show(DecisionLab.decideNetworkProposal(trial,true)))}
  ${button('Reject the network rule',()=>show(DecisionLab.decideNetworkProposal(trial,false)),'secondary')}`;
 else if(trial.route==='blocked')next=button('Review a narrow network rule',()=>show(DecisionLab.openNetworkProposal(trial)));
 else if(read.runtime==='deny'||read.missionVersion!==trial.missionVersion)next=button('Retry the same read',retry);
 else if(read.crm==='rejected')next=button('Record Priya’s separate approval for Alder Books',()=>show(DecisionLab.approveRuntimeMission(trial)));
 else next='';
 const summary=read?`<ol class="route-list" aria-label="Read attempts">${trial.reads.map((attempt,index)=>`<li>
  <b>G-042 v${attempt.missionVersion} · ${attempt.recordId==='123'?'Harbor Bikes':'Alder Books'} read</b><br>
  ${esc(runtimeOutcome(attempt))}
  ${runtimeReadEvidence(attempt,index)}</li>`).join('')}</ol>`:'';
 const review=trial.proposal==='review'?`<div class="receipt"><b>OpenShell Policy Advisor · proposed rule</b>
  <p>Allow Nova’s approved MCP client to reach the configured CRM tool endpoint over HTTPS.</p>
  <p>The simulated Policy Prover risk check finds no extra methods or unrelated destinations in the proposal. An operator still reviews the change.</p></div>`:'';
 showReference(scopeOnly?'Which accounts can Nova read?':'What stopped this request?',`<p>${scopeOnly?'Nova already has a route to the CRM app. Read an account in the assignment, then try Alder Books on that same route.':'Replay one fictional Alder Books read. The CRM tool route is initially blocked and Priya’s mission covers only the original two accounts.'}</p>
  <div class="receipt"><b>Current permissions</b><p>OpenShell route ${trial.route==='allowed'?'allowed':'blocked'} · G-042 v${trial.missionVersion} ${trial.missionVersion===2?'includes Alder Books':'excludes Alder Books'}.</p></div>
  ${review}${trial.proposal==='rejected'?'<p>The operator rejected the network change. The current route stays blocked.</p>':''}
  <div class="actions">${next}</div>${summary}
  <div class="actions">${button('Reset the exercise',()=>showRuntimeExercise(back,{scopeOnly,backLabel}),'secondary')}${button(backLabel,back,'secondary')}</div>`,
  scopeOnly?'APP PERMISSION EVIDENCE':'REFERENCE ARCHITECTURE');
}

function showSupervisorFailure(back,status='frozen'){
 const outcomes={
  frozen:['Workload frozen','The trusted Supervisor channel dropped. The sandbox freezes Nova while it waits for an authenticated reconnection.'],
  recovered:['Trusted channel restored','Supervision returns within the recovery window and the workload can resume under the active restrictions.'],
  stopped:['Workload stopped','The recovery window expired. The sandbox ends the workload. The CRM session and Vault lease still need their own evidence.']
 };
 const [title,description]=outcomes[status];
 showReference('When supervision is lost',`<p>Simulated OpenShell sandbox generation S-04. Customer mission G-042 v1 is tracked separately.</p>
  <div class="receipt"><b>${title}</b><p>${description}</p></div>
  <div class="actions">${status==='frozen'?`${button('Restore the trusted channel',()=>showSupervisorFailure(back,'recovered'))}${button('Let the recovery window expire',()=>showSupervisorFailure(back,'stopped'),'secondary')}`:button('Replay the channel failure',()=>showSupervisorFailure(back),'secondary')}
  ${button('Back to runtime and containment',back,'secondary')}</div>`,'REFERENCE ARCHITECTURE');
}

function showRuntimeIncident(back,crmReachable=null,backLabel='Back to runtime and containment'){
 const check=reachable=>showRuntimeIncident(back,reachable,backLabel);
 const evidence=crmReachable===null?null:DecisionLab.incidentStatus(crmReachable);
 const rows=evidence?[
  ['Customer mission service','Mission withdrawn'],['OpenShell','Sandbox generation S-04 stopped'],
  ['HashiCorp Vault','Connector lease revoked'],['Task queue','Pending work checked'],
  ['CRM controller',evidence.crmClosed?'Session closed and old route refused the retest':'Controller unreachable · session and retest unverified']
 ]:[];
 showReference('Investigate an incident alert',`<p>An independent monitor raises an alert. A configured containment controller coordinates mission, OpenShell, Vault, CRM and queue responses. Each system supplies evidence for its own control.</p>
  ${evidence?`<div class="receipt"><b>${evidence.verified?'Containment verified for this tested route':'Partial containment'}</b><p>${evidence.verified?'The independent retest refused the old route.':'The workload stopped, but CRM did not confirm closure. Keep the incident open.'}</p></div>
  <ul class="route-list">${rows.map(([owner,result])=>`<li><b>${esc(owner)}</b><br>${esc(result)}</li>`).join('')}</ul>
  <p>Review any completed or in-flight work separately. A completed delivery stays delivered.</p>`:''}
  <div class="actions">${!evidence?`${button('Verify with CRM reachable',()=>check(true))}${button('Simulate CRM being unreachable',()=>check(false),'secondary')}`
   :evidence.verified?button('Replay the incident check',()=>check(null),'secondary'):button('Restore CRM contact and verify',()=>check(true))}
  ${button(backLabel,back,'secondary')}</div>`,'REFERENCE ARCHITECTURE');
}

function showReadComparison(pair,back){
 const [allowed,denied]=pair;
 const field=(label,pick,highlight=false)=>[label,pair.map(pick),highlight];
 const {mission_id,mission_version}=allowed.request;
 const sameRead=JSON.stringify(allowed.request.records)===JSON.stringify(denied.request.records);
 const rows=[
  field('Observed operation',({request:r})=>`${r.operation}(${r.records.join(', ')})`,true),
  field('Actor and observer',({request:r})=>`${r.actor} · ${r.observed_by}`),
  field('Mission and policy',({request:r})=>`${r.mission_id} v${r.mission_version} · policy v${r.policy_version}`,true),
  field('Records in scope',({decision:d})=>d.allowed_records.join(', '),true),
  field('Vault credential',item=>item.request.source_lease?item.request.source_lease.id+' · read-only connector lease':'Brokered path · no lease receipt recorded for this read'),
  field('Business decision',({decision:d})=>`${d.result==='permit'?'Permit':'Deny'} · ${d.reason}`,true),
  field('CRM result',({decision:d})=>d.result==='permit'?'Requested summary returned':'No records returned',true),
  field('Request and decision IDs',({request:r,decision:d})=>`${r.request_id} · ${d.decision_id}`)
 ];
 const note=sameRead&&denied.request.mission_version<mission_version
  ?`CRM saw the same read twice. The authorized scope at ${mission_id} v${mission_version} included the requested record.`
  :'Compare what CRM observed with the records each mission allowed.';
 showReference('Compare the authorization decisions',`<p>${esc(note)}</p>
  ${decisionComparison(['Permitted read','Refused read'],rows)}
  <p class="small-print">These are recorded game outcomes. The authorization lab adds illustrative credential and commit evidence.</p>
  <div class="actions">${button('Try the authorization lab',()=>showDecisionLab(()=>showReadComparison(pair,back)))}${button('Back to the result',back,'secondary')}</div>`,
  'REFERENCE ARCHITECTURE');
}

function showCrmReadRefusal(event){
 speakingObject='laptop';
 const next=event.action==='collect-source'?showDraft:()=>showExtension();
 const pair=RequestTrace.compareCrmReads(state(),event);
 const back=()=>showCrmReadRefusal(event);
 const outsideScope=event.action==='try-extension';
 const owner=outsideScope?'<div class="request-result"><b>Who applied the rule?</b><p>Priya approved the two-account task. The customer policy service checked Alder Books against that scope. CRM enforced the denial and returned no record.</p></div>':'';
 show(event.title,`<p>${esc(event.text)}</p>${owner}${crmReadPath(event,back)}<div class="actions">
  ${button(outsideScope?'Back to the Alder Books request':'Back to the report',next)}${outsideScope?button('What stopped this request?',()=>showRuntimeExercise(back),'secondary'):''}
  ${button('Follow this request',()=>showRequestTrace(event,back),'secondary')}
  ${pair?button('Compare the authorization decisions',()=>showReadComparison(pair,back),'secondary'):button('Try the authorization lab',()=>showDecisionLab(back),'secondary')}
 </div>`,'A PERMISSION CHECK');
}

function showSource(){
 const s=state(),e=episode();
 if(!s.source||s.ended)return showDraft();
 speakingObject='source';
 const lines=teen()?e.draftLines:e.draftLines.slice(1,3);
 const event=!teen()&&s.last?.action==='collect-source'?s.last:null;
 const lease=!teen()&&s.sourceLease;
 show(teen()?'The museum page confirms your dates.':'CRM returned the two approved records.',
  `${lease?`<p>The <b>MCP gateway</b> forwarded the tool call. <b>HashiCorp Vault</b> issued a read-only credential to the connector. CRM checked the two records before returning them.</p>`:''}<div class="paper"><h3>${teen()?'Riverside Museum · The railway comes to town':'Customer records for tomorrow’s meeting'}</h3>${lines.map(line=>`<p>${esc(line)}</p>`).join('')}</div>${event?crmReadPath(event,showSource):''}${choices([
   ...(!s.caption&&!s.delivered?[['Add this source',teen()?'Put the museum page title under your timeline.':'Credit Harbor Bikes and Pine Studio below the handover.',()=>perform('attach-source',{source:'original'}),'good']]:[]),
   ...(lease?[['Compare connector credentials','See what survives after the task ends.',()=>showCredentialComparison(lease)]]:[]),
   [s.delivered?'See the delivery receipt':'Back to the draft','',s.delivered?showDelivery:showDraft],
   ...(event?[['Follow the CRM request','Follow discovery, token audience and the CRM decision.',()=>showRequestTrace(event,showSource)]]:[])
  ])}`,teen()?'MUSEUM WEBSITE':'CRM','collect-source');
}
function credentialComparison(lease,checked,check){
 const result=checked==='shared'?'The shared credential still works in this example. Ending the task did not rotate it.':
  checked==='vault'?'Vault revoked this lease. The connector cannot use it to open a new connection. A CRM session that was already open needs its own closing check.':'';
 return `<p>Compare a shared connector password with a short-lived Vault credential. Each test tries a fresh connection after the job ends.</p>
  ${decisionComparison(['Shared password · example','HashiCorp Vault · this read'],[
   ['Custody',['Shared connector login','CRM connector · outside Nova’s context'],true],
   ['Scope and lifetime',['Shared access · valid until rotated','Read-only connector role · '+lease.lifetimeSeconds+' seconds'],true],
   ['Credential reference',['Example only',lease.id]]
  ])}
  ${result?`<div class="receipt" role="status"><b>${checked==='vault'?'Vault lease check':'Shared password check'}</b><p>${esc(result)}</p></div>`:''}
  <div class="actions">${button('Check the shared password',()=>check('shared'))}${button('Check the Vault lease',()=>check('vault'))}</div>`;
}
function showCredentialComparison(lease,checked='',back=showSource){
 const check=kind=>showCredentialComparison(lease,kind,back);
 showReference('What access survives the task?',`${credentialComparison(lease,checked,check)}
  <div class="actions">${button(back===showSource?'Back to the CRM result':'Back to the Vault evidence',back,'secondary')}</div>
  <p class="small-print">Both checks are simulated. The story’s closing checklist records when this lease is revoked and when the CRM session is verified.</p>`,'CRM CREDENTIALS');
}

function draftLines(s,e){
 if(teen())return e.draftLines;
 const records=StoryRules.reportRecords(s);
 const intro=s.minorChoice==='added'
  ?records.includes('789')?'Three customer updates for tomorrow’s meeting.':e.minorAddition
  :records.includes('789')?`This handover covers ${customerNames(records)} ahead of tomorrow’s customer meeting.`:e.draftLines[0];
 return [intro,...e.draftLines.slice(1),'Next step · '+StoryRules.reportFollowUp(s)];
}
function showDraft(){speakingObject='laptop';const s=state(),e=episode();if(!s.pass)return showParent();if(!s.opened)return showWorkspace();if(s.ended)return showChecks();
 const lines=!s.draft?[]:!teen()&&!s.source?['Harbor Bikes · Waiting for the customer record.','Pine Studio · Waiting for the customer record.']:draftLines(s,e);
 const paper=`<div class="paper"><p class="eyebrow">${esc(e.previewLabel)}${s.draft?' · '+(teen()?'VERSION':'REVISION')+' '+s.fileRevision:''}</p><h3>${!s.draft?'An empty document':esc(s.extensionAdded&&!teen()?'Tomorrow’s customer handover · three accounts':s.proof?e.draftTitle:teen()?'Train Stuff':e.draftTitle)}</h3>${lines.map(line=>`<p>${esc(line)}</p>`).join('')}${s.minorChoice==='added'&&teen()?`<p class="draft-addition">${esc(e.minorAddition)}</p>`:''}${s.extensionAdded?`${teen()&&s.extraSource==='museum-photo'?`<figure class="archive-photo"><svg viewBox="0 0 460 180" role="img" aria-label="Fictional archive illustration of the old railway station"><rect width="460" height="180" fill="#bfc5bf"/><path d="M0 128L460 122L460 180L0 180Z" fill="#a8a28f"/><path d="M90 93L202 28L322 91Z" fill="#665e59"/><path d="M111 89L111 139L301 136L301 87Z" fill="#d7cbb0"/><path d="M128 99H158V119H128ZM244 98H275V118H244Z" fill="#646c6c"/><path d="M187 96H222V138H187Z" fill="#726859"/><path d="M0 156L460 147M0 168L460 158" stroke="#645e58" stroke-width="4"/><circle cx="205" cy="72" r="10" fill="#ede3cb"/><path d="M205 65V72L210 75" fill="none" stroke="#665e59" stroke-width="2"/></svg><figcaption>Riverside Museum · station collection · fictional archive image</figcaption></figure>`:''}<p class="draft-addition">${esc(s.alderUpdate||e.extensionAddition)}</p>`:''}${s.draft?`<p class="source-line ${s.caption?'':'missing'}">${s.caption?esc(s.extensionAdded&&!teen()?'Source: Customer records · '+customerNames(StoryRules.reportRecords(s)):e.caption):'Source credit: still to add'}</p>`:`<p>${teen()?'Start with your notes and put the first three dates on the page.':'Start with the report outline. The customer extract has not been read yet.'}</p>`}</div>`;
 let options=[];
 if(!s.draft)options=[[teen()?'Build the timeline from my notes':'Create the report outline',teen()?'Put the three railway dates on the page.':'Prepare headings for the two requested customers.',()=>perform('prepare'),'good']];
 else if(!s.source)options=[[teen()?'Open the museum website':'Request customer records',teen()?'Check the railway dates.':'Read Harbor Bikes and Pine Studio.',()=>perform('collect-source'),'good']];
 else if(!s.caption)options=[['Add this source',teen()?'Put the page title beneath the timeline.':'A source credit completes the first sourced draft.',()=>perform('attach-source',{source:'original'}),'good']];
 else if(!s.message)options=[[teen()?'Send this draft for teacher feedback':'Prepare the review-copy share','The first copy goes to the agreed recipient. Final submission follows the feedback.',showDraftReview,'good']];
 else if(!StoryRules.changesResolved(s))options=[['Read the new requests',teen()?'Read Ms Patel’s feedback and Jamie’s message.':'Decide which changes fit, need an amendment, or stay out.',showChanges,'good']];
 else if(!s.proof)options=[[teen()?'Read this version myself':'Check this report myself','Review the content, source and destination.',()=>perform('proof-self'),'good'],[teen()?'Ask Sam to proofread this version':'Ask Quill to format this report',teen()?'Send Sam the timeline, without sharing your login.':'The helper sees only this file.',showHelper]];
 else if(!s.delivered)options=[[teen()?'Preview my school submission':s.approval?'Preview the CRM send':'Show the approver this report',teen()?'Submit your own homework through the school app.':'Confidential business sharing needs the designated approval.',showSend,'good']];
 else options=[[teen()?'Finish up for dinner':'Close out the task','The delivered file stays delivered.',showParent,'good']];
 show(teen()?'The project on your desk.':'The briefing in your workspace.',paper+choices(options)+(s.draft&&!s.delivered&&!(s.message&&StoryRules.changesResolved(s)&&!s.proof)?`<div class="actions">${button(teen()?'Talk to Sam about the draft':'Talk to Quill about formatting',showHelper,'secondary')}</div>`:''),teen()?'SCHOOL WORKSPACE':'CRM WORKSPACE','draft-preview');
}
function changeStatus(which){const s=state();if(teen())return which==='minor'?(s.minorChoice?s.minorChoice==='added'?'Closing sentence added':'Original wording kept':'New suggestion'):which==='extension'?(s.extensionAdded?(s.extraSource==='museum-photo'?'Photo added':'Video detail added'):s.extensionOmitted?'Allowed, left unopened':s.extensionStatus==='declined'?'Extra source left out':s.extensionStatus==='approved'?'Parent said yes':s.extensionStatus==='pending'?'Waiting for my parent':'New suggestion'):(s.privateResolved?'Group’s private notes left out':'Jamie’s request');return which==='minor'?(s.minorChoice?'Settled':'New request'):which==='extension'?(s.extensionAdded?'Added with permission':s.extensionOmitted?'Approved, left unused':s.extensionStatus==='declined'?'Left out':s.extensionStatus==='approved'?'Approved · collect the addition':s.extensionStatus==='pending'?'Reply pending':'New request'):(s.privateResolved?'Private notes left out':'New request');}
function showChanges(){speakingObject=teen()?'phone':'brief';
 const s=state(),e=episode();if(!s.message)return showDraftReview();
 const cards=StoryInteractions.feedbackCards(s,mode),answered=cards.filter(c=>c.done).length,pending=cards.filter(c=>!c.done);
 const handlers={minor:showMinor,extension:showExtension,private:showPrivate};
 const senders={minor:teen()?'Ms Patel · feedback':'Morgan · draft feedback',extension:teen()?(s.extensionStatus==='pending'?'Parent · checking the link':'Ms Patel · optional source'):'Priya · account update',private:e.sender};
 const intro=s.feedbackLegacy?'These saved requests and your earlier choices are preserved. This older route did not record a first draft send.':teen()?`Your teacher replied after receiving draft version ${s.draftReview.revision}. Jamie forwards a request for private notes from the class group chat.`:`Morgan replied to revision ${s.draftReview.revision}. Priya sent a separate update. An imported CRM attachment also contains an instruction.`;
 const results=cards.filter(c=>c.done).map(card=>`<details class="change-card settled" data-request="${card.key}"><summary>✓ ${esc(card.status)}</summary><p>${esc(card.summary)}</p>${button(card.button,handlers[card.key],'quiet')}</details>`).join('');
 const reference=`<details class="debrief"><summary>${teen()?'Check the source of a request':'Check the source or work order'}</summary><div class="actions">${s.evidence.length?button(teen()?'Read the teacher’s clarification':'Read the verified clarification',()=>showClarification(s.evidence.includes('contact')?'verify-contact':'verify-portal'),'secondary'):button(teen()?'Check with my teacher':'Verify the sponsor’s request',showVerification,'secondary')}${!teen()?button('Read Priya’s work order',showBrief,'secondary'):''}</div></details>`;
 const response=pending.length?choices(pending.map(card=>[card.button,senders[card.key],handlers[card.key],''])):`<div class="actions">${button(teen()?'Review my updated project':'Review the updated briefing',showDraft)}${button('Back to the room',close,'secondary')}</div>`;
 show(teen()?'Replies to your draft.':'Feedback on the review copy.',`<p>${esc(answered===3?'You have answered all three requests. Review this version before final delivery.':intro)}</p><div class="request-progress compact"><b>${answered} of 3 decisions made</b><span>${answered===3?'Ready for final review':'Choose a response below'}</span></div>${results}${reference}${response}`,'FEEDBACK & NEW REQUESTS','feedback');
}

function showClarification(action=state().last?.action){
 const portal=action==='verify-portal';
 speakingObject=portal?(teen()?'laptop':'workOrder'):(teen()?'reviewer':'sponsorContact');
 const text=teen()
  ?(portal?'The assignment asks for your own railway timeline and a source credit. Ms Patel’s video is an optional suggestion.':'“The video is just an idea. Ask your parent if you want to watch it. I only need your own timeline.”')
  :(portal?'The work order includes a verifiable change request from Priya. The active mission’s approved customer list is unchanged.':'“I sent the suggestion. Send me the exact permission change to approve.”');
 show(teen()?(portal?'Open the assignment in the school app.':'Ms Patel replies to your check.'):(portal?'Check Priya’s work order.':'Priya confirms the request.'),
  `<p>${esc(text)}</p><div class="actions">${button('Back to the requests',showChanges)}</div>`,undefined,portal?'verify-portal':'verify-contact');
}
function showDecisionResult(event){
 speakingObject=StoryInteractions.eventSource(mode,event.speaker,event.action,event.kind);
 const ready=StoryRules.changesResolved(state());
 show(event.title,`<p>${esc(event.text)}</p><div class="actions">
  ${ready?button(teen()?'Open my project':'Open the report',showDraft):''}
  ${button(ready?'Review the decisions':'Back to the other requests',showChanges,ready?'secondary':'primary')}
 </div>`);
}
function showExtensionRead(event){
 speakingObject='extra';
 const title=teen()?state().extraSource==='museum-photo'?'The museum photo is in your timeline.':'YouTube · Our station’s story':'CRM returned the Alder Books record';
 const ready=StoryRules.changesResolved(state());
 const pair=!teen()&&RequestTrace.compareCrmReads(state(),event);
 const back=()=>showExtensionRead(event);
 const accountUpdate=!teen()&&state().alderUpdate;
 show(title,`${accountUpdate?`<div class="paper"><p class="eyebrow">CRM RECORD · 789</p><p>${esc(accountUpdate)}</p></div>`:''}<p>${esc(event.text)}</p>${teen()?'':crmReadPath(event,back)}<div class="actions">
  ${ready?button(teen()?'Open my project':'Open the report',showDraft):''}
  ${button(ready?'Review the decisions':'Back to the other requests',showChanges,ready?'secondary':'primary')}
  ${button(teen()?'See what happened':'Follow this request',()=>showRequestTrace(event,back),'secondary')}
  ${pair?button('Compare the authorization decisions',()=>showReadComparison(pair,back),'secondary'):''}
 </div>`,undefined,'add-extension');
}
function showDraftReview(){speakingObject='laptop';
 const s=state(),e=episode();if(!s.caption)return showDraft();if(s.message)return showChanges();
 const a=s.approval,matched=!teen()&&a?.purpose==='draft-review'&&!a.used;
 if(!teen()&&!matched)speakingObject='reviewer';
 const title=teen()?'Send a first draft for feedback.':matched?'Send the draft Morgan approved.':'Ask Morgan to approve the draft.';
 const lines=draftLines(s,e);
 show(title,`<p>${teen()?'Your teacher has not seen this file yet. This sends a draft for feedback; you will submit the final version after responding to the replies.':matched?'Morgan approved this copy for the work inbox. The final copy will get its own approval.':'Send Morgan an approval request for this exact file and destination.'}</p>${!teen()&&!matched?approvalProduct():''}<div class="paper"><p class="eyebrow">REVIEW COPY · ${teen()?'VERSION':'REVISION'} ${s.fileRevision}</p><h3>${esc(teen()&&!s.proof?'Train Stuff':e.draftTitle)}</h3>${lines.map(line=>`<p>${esc(line)}</p>`).join('')}<p class="source-line">${esc(e.caption)}</p></div><div class="receipt"><b>${esc(e.file)} · ${s.fileRevision}</b><p class="address">${esc(e.to)}</p><p>${teen()?'Your own timeline, with its museum source.':esc(customerNames(StoryRules.reportRecords(s)))+' · Summary only'}</p>${matched?`<p>Recorded one-use review-copy approval · revision ${a.revision}</p>`:''}</div>${choices([[teen()?'Send draft to my teacher':matched?'Send the approved review copy':'Ask Morgan to approve this draft',teen()?'Send it to Ms Patel in the school app.':matched?'The CRM checks this draft, records, recipient and current authority.':'Morgan sees the exact draft and its destination.',teen()||matched?()=>perform('send-draft'):()=>showMorganApproval('draft-review',showDraftReview),'good'],['Back to the draft','Nothing is sent by opening this preview.',showDraft]])}`,teen()?'FIRST DRAFT · NOT FINAL SUBMISSION':'FIRST CONFIDENTIAL SHARE',matched?'approve-draft':'approval-preview');
}
function showDraftReceipt(){speakingObject='laptop';const s=state(),r=s.draftReview;show(teen()?'Your teacher has the draft.':'Morgan has the draft.',`<div class="receipt"><b>${esc(r.file)} · ${teen()?'version':'revision'} ${r.revision} sent for feedback</b><p class="address">${esc(r.to)}</p><p>${teen()?'The school app confirms draft delivery.':'The CRM confirms this exact, approved review copy. The one-use approval is consumed.'}</p></div><p>${teen()?'A little later, Ms Patel reads it and replies in the school inbox. Jamie forwards a message from the class chat. You’ll submit the final copy when you’re ready.':'Morgan asks for a shorter introduction. Priya sends news about one more account. An attachment uploaded by Luca also turns up in Customer records.'}</p><div class="actions">${button(teen()?'Read the replies on my phone':'Read the new messages',showChanges)}${button('Back to the room',close,'secondary')}</div>`,'DRAFT DELIVERY CONFIRMED','send-draft');}
function showQuillDeployment(){
 showReference('Standards for Quill’s handoff',`${architectureDeployment('a2a')}
  <div class="actions">${button('Back to Quill’s result',showHelperResult,'secondary')}</div>`,'REFERENCE ARCHITECTURE');
}

function showHelperResult(){
 speakingObject='helper';
 const receipt=!teen()&&state().last.request?.delegation;
 const comparison=teen()
  ?'<details class="debrief"><summary>See how Nova handles this</summary><p>Sam can read your timeline with his own account. Nova gives Quill just the handover to format. Quill’s own identity and formatting-only grant let it finish that file without signing in as Nova or reading CRM.</p></details>'
  :productDetails('Why use IBM watsonx Orchestrate here?',[['orchestrate','In this deployment, it coordinates the handoff. Quill uses its own identity and a separate formatting-only grant for this report. The task gives Quill no CRM access or share permission.']]);
 show(teen()?'Sam has read this version.':'Quill has formatted this version.',
  `<p>${esc(state().last.text)}</p>${comparison}<p>${teen()?'Sam stays in the room. You can ask about the file again. If you edit it later, check the changed version before sending.':'Quill’s file-only task is complete. Later changes invalidate this review and any older share approval.'}</p><div class="actions">${button(move()[0],nextMove)}${receipt?button('Inspect Quill’s activity record',()=>showHelperAudit(receipt),'secondary'):''}${!teen()?button('Explore deployment options for Quill',showQuillDeployment,'secondary'):''}${button('Back to the room',close,'secondary')}</div>`,
  teen()?'SAM · PROOFREADING':'QUILL · REPORT-ONLY HELP','proof-helper');
}
function showHelperAudit(receipt,answer=null,back=showHelperResult,origin='Recorded in your Nova playthrough.',backLabel=back===showHelperResult?'Back to Quill’s result':'Back to the buyer card'){
 const review=choice=>showHelperAudit(receipt,choice,back,origin,backLabel);
 const activities=[
  ['Delegated human',['Unclear','Priya · '+receipt.originalSubject],true],
  ['Requested the work',['shared-report-account','Nova · '+receipt.requestedBy],true],
  ['Formatted the file',['shared-report-account','Quill · '+receipt.actor],true],
  ['Operation and file',['Formatting logged',receipt.actions[0]+' · '+receipt.file+' · rev. '+receipt.inputRevision+' → '+receipt.outputRevision]],
  ['Completed delegation',['Unclear',receipt.id]]
 ];
 showReference('Who did what in Quill’s handoff?',`<p>${esc(origin)} Compare the shared account with the record of who acted.</p>
  ${decisionComparison(['Shared-account example','This handoff'],activities)}
  <details class="debrief"><summary>Check the agent owners</summary><p>The example inventory lists ${esc(NOVA_AGENT_OWNERS.nova)} as Nova’s owner and ${esc(NOVA_AGENT_OWNERS.quill)} as Quill’s owner. Priya sponsors this particular job.</p></details>
  ${answer===null?choices([
   ['Priya delegated, Nova requested, Quill formatted','',()=>review(true)],
   ['Priya delegated, Quill requested, Nova formatted','',()=>review(false)],
   ['Morgan delegated, Nova requested, Quill formatted','',()=>review(false)]
  ]):`<div class="receipt" role="status"><b>${answer?'That matches the record.':'Check who delegated and who executed.'}</b><p>IBM Agent Identity supplies the delegated identity context. The workflow record ties that context to Quill’s file-only action. Quill used its own identity and received no parent credential or CRM access.</p></div>`}
  <div class="actions">${button('Test the handoff',()=>showBuyerHelperPilot(()=>review(answer)))}${answer===false?button('Try again',()=>review(null),'secondary'):''}${button(backLabel,back,'secondary')}</div>`,
  'DELEGATED IDENTITY');
}

function showBuyerHelperPilot(back,trial=StoryRules.buyerExample({stopBeforeHelper:true}),attempts=[]){
 const attempt=allow=>{
  const {state,event}=StoryRules.buyerHelperAttempt(trial,allow);
  showBuyerHelperPilot(back,state,[...attempts,event]);
 };
 const records=attempts.map(({request,decision})=>{
  const handoff=request.delegation;
  return `<li><b>${handoff?'File service permitted formatting':'File service refused the handoff'}</b>
   <p>${handoff?`Quill returned revision ${esc(handoff.outputRevision)}.`:'Quill received no file and returned no output.'}</p>
   <details><summary>Inspect simulated audit record</summary>
    <p>Requested by <code>${esc(request.requested_by||request.actor)}</code> · intended helper <code>${esc(request.recipient)}</code><br>
    <code>${esc(request.operation)}</code> · ${esc(request.file)} · revision ${esc(request.revision)}<br>
    Request <code>${esc(request.request_id)}</code> · decision <code>${esc(decision.decision_id)}</code> · ${esc(decision.result)}<br>
    ${handoff?`Completed delegation <code>${esc(handoff.id)}</code><br>Sponsor <code>${esc(handoff.originalSubject)}</code> · acting agent <code>${esc(handoff.actor)}</code>`:'No completed delegation or formatting receipt.'}</p>
   </details></li>`;
 }).join('');
 const next=attempts.length===0?button('Try without Quill’s file permission',()=>attempt(false)):
  attempts.length===1?button('Allow Quill to format this file and retry',()=>attempt(true)):
   button('Replay both attempts',()=>showBuyerHelperPilot(back),'secondary');
 showReference('Will the file service let Quill format the report?',`<p>Nova asks Quill to format the same report for Priya in both attempts. IBM Agent Identity supplies separate identities. The file service checks its own permissions before handing over the file.</p>
  ${records?`<ol class="route-list" aria-label="Handoff attempts">${records}</ol>`:''}
  <div class="actions">${next}${button('Back to Quill’s activity record',back,'secondary')}</div>
  <details class="debrief"><summary>What your team sets up</summary><p>Configure the workflow to correlate the requesting agent, intended helper, task and file revision. The resource checks its permitted helpers and owns the allow or refuse audit record. OAuth Token Exchange can represent delegation where the issuer supports it.</p>${protocolSourceLinks(['agentInventory','exchange'])}</details>`,
  'DELEGATED IDENTITY PILOT');
}

function showHelperAccountReply(event){
 const s=state();
 speakingObject='helper';
 const next=s.caption?()=>perform('proof-helper',{scope:'file',shareLogin:false}):showDraft;
 show(event.title,`<p>${esc(event.text)}</p><div class="actions">${button(s.caption?(teen()?'Ask Sam to proofread my file':'Give Quill just the report'):(teen()?'Add my source first':'Cite the records first'),next)}${button('Back to the room',close,'secondary')}</div>`,episode().helper);
}

function showVerification(fromExtension=false){fromExtension=fromExtension===true;speakingObject=teen()?'phone':'brief';show(teen()?'Check what the teacher actually asked.':'Did Priya ask for Alder Books?',`<p>${teen()?'Open your saved conversation with Ms Patel, or check the assignment in the school app. Does she want another source, or is it just a suggestion? Jamie’s message is separate.':'Check whether Priya really asked to add Alder Books. Her saved contact and current work order are separate from the incoming message.'}</p>${choices([[teen()?'Message Ms Patel':'Use Priya’s saved contact',teen()?'Use the teacher conversation already saved on your phone.':'Open the conversation saved before this message arrived.',()=>perform('verify-contact',{fromExtension}),'good'],[teen()?'Open the current school assignment':'Check the change request in Priya’s work order',teen()?'Read Ms Patel’s instructions in the school app.':'Open the sponsor-owned change request linked to this handover.',()=>perform('verify-portal',{fromExtension})]])}`,teen()?'ASK YOUR TEACHER':'TWO INDEPENDENT ROUTES','verify-preview');}
function showMinor(){speakingObject='reviewer';const e=episode();show(e.minorTitle,`<p>${esc(e.minorText)}</p><p>${state().minorChoice?(state().minorChoice==='added'?'The edit is currently included. You can keep it or return to the earlier wording.':'You kept the earlier wording. You can still choose the edit before submitting.'):'Choose the wording that fits this version.'}</p><p>${teen()?'You already have the dates and source. You can write this sentence without opening anything else.':'This changes the document within the current mission. It does not add records or change the reviewer.'}</p>${choices([[state().minorChoice==='added'?(teen()?'Keep the closing sentence':'Keep the shorter introduction'):(teen()?'Add the closing sentence':'Shorten the introduction'),teen()?'Use your existing notes and museum page.':'Morgan gets a shorter introduction for the same handover.',()=>perform('apply-minor'),'good'],[state().minorChoice==='added'?(teen()?'Remove the extra sentence':'Use the earlier introduction'):'Keep the existing wording','This small edit is optional.',()=>perform('keep-minor')],['Back to the requests','No change yet.',showChanges]])}`,'A SMALL EDIT','minor-preview');}
function extensionDescription(){const s=state(),e=episode();if(teen()){
 if(s.extensionOmitted)return 'Your parent said yes, but you left the '+e.extraNoun+' unopened. Your timeline works without it.';
 if(s.extensionAdded)return s.extraSource==='museum-photo'?'The station photo is in your timeline, with its credit.':'You used one detail from the museum’s YouTube video and credited it beneath the timeline.';
 if(s.extensionStatus==='approved')return s.extraSource==='museum-photo'?'Your parent said yes to the museum photo app. You can open the photo now.':'“That museum video, then back to the timeline.” Your parent has allowed the linked video until dinner. Other videos and recommendations stay blocked.';
 if(s.extensionStatus==='pending')return 'You show your parent Ms Patel’s link on your phone and ask if you can '+e.extraInstruction+'. They reach for their own phone to check the school message.';
 if(s.extensionStatus==='declined')return 'You decided the timeline has enough detail without the '+e.extraNoun+'.';
 return e.extensionText;
 }if(s.extensionOmitted)return 'Priya said yes, but Nova kept the handover to the original two accounts.';if(s.extensionAdded)return 'Alder Books has its own update and source in the handover.';if(s.extensionStatus==='approved')return 'Priya said yes to Alder Books. You can request its record now.';if(s.extensionStatus==='pending')return 'The mission service has Nova’s proposed amendment and is waiting for Priya’s decision. Nova can still work on the original two accounts.';if(s.extensionStatus==='declined')return 'You chose to finish the two-customer briefing without an expansion.';return e.extensionText;}
function showParentSourceCheck(){
 const s=state();
 if(!teen()||s.extensionStatus!=='pending')return showExtension();
 speakingObject='parentSchool';
 const video=s.extraSource!=='museum-photo';
 show('Your parent checks on their own phone.',`<p>They open the school app directly and use their linked parent account to find Ms Patel’s reply to your draft. Its museum link matches yours, and she says it’s optional.</p>
 <div class="message-card">
  <p class="eyebrow">PARENT ACCOUNT · MS PATEL’S REPLY</p>
  <p>${video?'“The museum’s <i>Our station’s story</i> video is optional. You can use it for one more detail.”':'“A station photo from the museum’s collection could make the timeline clearer. It’s optional.”'}</p>
 </div>
 <div class="actions">${button('Hear my parent’s answer',()=>perform('resolve-extension'))}${button('See what happened',()=>showRequestTrace(s.last,showParentSourceCheck),'secondary')}${button('Back to the request',showExtension,'secondary')}</div>`,'School app · parent account');
}

function novaAmendmentPreview(mission){
 const {operation,record}=StoryRules.novaAddition;
 return `<div class="request-result"><b>Permission Nova is asking for</b><p>Read the ${esc(NOVA_CUSTOMERS[record])} account summary. Keep the one-page handover and Morgan as the recipient.</p></div>
  <details class="debrief"><summary>How Nova works out the permission</summary>
   <p>Nova compares Priya’s verified request with mission ${esc(mission.id)} v${esc(mission.version)}. The proposed change adds <code>${esc(operation)}</code> for CRM record <code>${esc(record)}</code>. The tool and network route are already in use.</p>
   <p>A planning workflow can use a model to suggest the change. An AI Gateway routes that model request. In this simulation the proposal is scripted. Priya approves through the mission service, which checks policy before recording the grant. CRM still authorizes the actual read.</p>
   ${protocolSourceLinks(['aiGateway','authzen'])}</details>`;
}
function showExtension(verification=null){
 const s=state(),e=episode();
 if(!s.message)return showDraft();
 speakingObject=s.extensionAdded?'extra':teen()?(['pending','approved'].includes(s.extensionStatus)?'parent':'reviewer'):'sponsorMessage';
 if(!teen()&&['pending','approved'].includes(s.extensionStatus)&&!s.extensionAdded)speakingObject='missionControl';
 if(verification?.action==='verify-portal')speakingObject=teen()?'laptop':'workOrder';
 if(!teen()&&verification?.action==='verify-contact')speakingObject='sponsorContact';
 let options;
 const watch=teen()?(s.extraSource==='museum-photo'?'Open the museum photo app':'Watch the museum video on YouTube'):'';
 if(s.extensionStatus==='pending')options=[[teen()?'Check it on my parent’s phone':'Read Priya’s reply',teen()?'Compare your link with Ms Patel’s reply in the school app.':'The original two accounts are still the only ones open.',()=>perform(teen()?'check-extension-source':'resolve-extension'),'good'],[teen()?'Finish without the '+e.extraNoun:'Keep the two-customer briefing',teen()?'You can leave this optional source out.':'Withdraw this optional request without expanding scope.',()=>perform('decline-extension')]];
 else if(s.extensionStatus==='approved'&&!s.extensionAdded)options=s.extensionOmitted?[[teen()?'Keep finishing without it':'Keep finishing the two-customer report',teen()?'Your timeline already has a source.':'The approved addition remains unread.',showChanges,'good'],[teen()?watch+' after all':'Request the Alder Books record after all',teen()?'Open only the source your parent agreed to.':'Request the one account Priya added.',()=>perform('add-extension')]]:[[teen()?watch:'Request the Alder Books record',teen()?'Use the museum’s link, then come back to the draft.':'Request the one account Priya added.',()=>perform('add-extension'),'good'],[teen()?'Finish without opening it':'Leave the approved addition unused',teen()?'Your parent said yes, but you don’t have to use it.':'Permission allows access; it does not require using it.',()=>perform('omit-extension')]];
 else if(s.extensionAdded)options=[['Back to the other requests',teen()?'Your extra detail is in the timeline.':'The approved addition is included.',showChanges,'good']];
 else if(s.extensionStatus==='declined')options=[['Back to the other requests',teen()?'Keep finishing the timeline.':'Keep the smaller agreed task.',showChanges,'good'],[teen()?'Reconsider the '+e.extraNoun:'Reconsider Alder Books',teen()?'You’ll still need to ask before opening it.':'No extra access until a specific amendment is approved.',()=>perform('reconsider-extension')]];
 else options=[(teen()||s.evidence.length)?[teen()?'Ask my parent about '+e.extraApp:'Send the amendment to Priya',teen()?'Show them Ms Patel’s link and ask about this source.':'Use the mission service to request just this account’s summary.',()=>perform('request-extension'),'good']:[teen()?'Check with Ms Patel first':'Check the request with Priya',teen()?'Is the extra source part of the assignment or just a suggestion?':'Use Priya’s saved contact or the work order.',()=>showVerification(true),'good'],[teen()?'Finish without the '+e.extraNoun:'Keep the two-customer briefing',teen()?'Your timeline already has enough to meet the assignment.':'The addition is optional; finish the original task without it.',()=>perform('decline-extension')],[teen()?'Try opening '+e.extraApp+' now':'Try requesting Alder Books now',teen()?'Your phone is still in homework mode.':'See whether the current task can read this account.',()=>perform('try-extension')]];
 const apps=teen()?'School app · museum website'+(s.extensionStatus==='approved'?' · '+e.extraApp+' (museum source only)':''):'';
 const proposed=!teen()&&s.evidence.length&&['unanswered','pending'].includes(s.extensionStatus)?novaAmendmentPreview(s.mission):'';
 show(teen()&&s.extensionStatus==='pending'?'You show your parent the link.':teen()&&s.extensionStatus==='approved'?'“That museum source, then finish your timeline.”':!teen()&&s.extensionStatus==='pending'?'Waiting for Priya':!teen()&&s.extensionAdded?'CRM returned the Alder Books record':!teen()&&s.extensionStatus==='approved'?'Priya approved Alder Books':proposed?'Nova proposes an amendment':e.extensionTitle,`<p>${esc((verification?.action==='verify-portal'?(teen()?'Ms Patel’s assignment calls for a timeline with a credited source. The video is optional.':'Priya’s proposal is recorded alongside the work order. The active mission still covers Harbor Bikes and Pine Studio.'):verification?.text)||extensionDescription())}</p>${proposed}${teen()&&s.extraSource!=='museum-photo'?'<div class="message-card"><p class="eyebrow">MS PATEL’S SUGGESTED LINK</p><b>▶ Our station’s story</b><p>Riverside Museum · YouTube · 2 minutes</p></div>':''}<div class="receipt"><b>${esc(changeStatus('extension'))}</b><p>${s.mission?teen()?esc(apps):`Current task · ${esc(customerNames(s.mission.records))}`:''}</p><p>${s.extensionStatus==='pending'?teen()?'Nothing new opens until your parent replies.':'Wait for Priya’s answer before requesting the record.':s.extensionStatus==='approved'?teen()?'Only the museum source you asked about is allowed.':'Priya approved this account. CRM still checks the read.':teen()?'It’s an optional source. You can ask, or leave it out.':'You can ask Priya to add Alder Books or finish with two accounts.'}</p></div>${choices(options)}`,teen()?'ONE MORE SOURCE':'A GENUINE EXPANSION',s.extensionStatus==='pending'?'request-extension':s.extensionAdded?'add-extension':s.extensionStatus==='approved'?'resolve-extension':'extension-preview');
}
function showPrivate(){
 const s=state(),e=episode();
 if(!s.message)return showDraft();
 speakingObject='outside';
 const origin=teen()
  ? '<p class="eyebrow">JAMIE · CLASS GROUP CHAT</p><p>“Ms Patel wants the whole group’s planning notes too. Can you attach them?”</p>'
  : '<p class="eyebrow">LUCA · HARBOR BIKES CUSTOMER CONTACT</p><p>Luca uploaded a PDF through the customer portal. CRM linked it to the Harbor Bikes account. Nova sees its text in the imported CRM material.</p><blockquote>'+esc(e.message)+'</blockquote>';
 const examined=s.discoveries.includes('request-source');
 const options=[];
 if(!s.privateResolved)options.push(
  ['Keep just '+(teen()?'my timeline':'the handover'),'Send your own work.',()=>perform('decline-private'),'good'],
  [teen()?'Try attaching the notes':'Try the attachment',teen()?'Check how the school app responds.':'Check how the customer records app responds.',()=>perform('try-private')]
 );
 if(!s.delivered)options.push([examined?'See what you found':teen()?'Compare with Ms Patel’s assignment':'Compare with Priya’s work order',
  'Check where the extra instruction came from.',examined?showRequestSource:()=>perform('inspect-request-source')]);
 const detour=s.refusals&&!s.privateResolved
  ?`<details class="debrief"><summary>What if I ignore the refusal?</summary><div class="actions">${button(teen()?'Try another account anyway':'Try an alternate path around the refusal',()=>perform('bypass-notes'),'secondary')}</div></details>`:'';
 show(s.privateResolved?(teen()?'The group’s notes stay private.':'The private attachment stayed out.'):e.privateTitle,
  `<div class="message-card">${origin}</div>${s.privateResolved?(teen()?'<p>Your timeline includes only your own work.</p>':'<p>Morgan gets the handover summary.</p>'):''}${detour}${choices(options)}<div class="actions">${button('Back to the other requests',showChanges,'secondary')}</div>`,teen()?'PHONE':'SOURCE DOCUMENT','private-preview');
}
function showRequestSource(){
 const s=state();
 speakingObject='outside';
 const origin=teen()
  ?'<h3>Forwarded in the group chat</h3><p>“Ms Patel: Please attach the group’s notes.” Jamie shared this message. It did not arrive in the teacher’s school-app conversation.</p>'
  :'<h3>In the imported CRM document</h3><p>Luca, a contact at Harbor Bikes, uploaded the PDF through the customer portal. The text reached Nova through CRM. The footer’s author is unverified.</p>';
 const authority=teen()
  ?'<h3>Ms Patel’s assignment in the school app</h3><p>“Send me your own railway timeline and credit your source.”</p>'
  :'<h3>Priya’s work order and approved mission</h3><p>Share the handover with Morgan. Keep the private meeting notes in CRM.</p>';
 const outcome=teen()?'The group chat used her name. The school app shows what Ms Patel actually assigned: your own timeline.':'Nova can use the attachment as source material. The active mission and CRM’s own sharing policy control what goes to Morgan.';
 const actions=s.privateResolved?[['Back to the requests','',showChanges,'good']]:[
  [teen()?'Keep just my timeline':'Keep just the handover','Leave the notes where they are.',()=>perform('decline-private'),'good'],
  [teen()?'Try attaching the notes':'Try the attachment','See how the app applies its own rules.',()=>perform('try-private')]
 ];
 show(teen()?'Where did the message come from?':'Where did the instruction come from?',
  `<div class="evidence-pair"><article class="message-card">${origin}</article><article class="paper">${authority}</article></div><p>${outcome}</p>${choices(actions)}`,teen()?'CHECK THE SOURCE':'CHECK THE WORK ORDER','inspect-request-source');
}
function showHelper(){speakingObject='helper';const s=state(),e=episode();if(s.delivered||s.ended)return show(teen()?'Sam is still here.':'Quill’s task is finished.',`<p>${teen()?'“You sent it! Nice,” Sam says. “Sign out of the laptop and come get dinner.”':'The shared file is already delivered. Quill cannot rewrite that completed effect. Finish the task’s closing checks.'}</p><div class="actions">${button(teen()?'Finish the evening':'Continue closing this task',nextMove)}${button('Back to the room',close,'secondary')}</div>`,e.helper);if(!s.draft)return toast(teen()?'Sam will have something to review once you make a first draft.':'Quill needs a draft to format.');show(teen()?(s.proof?'“Let’s check this version.”':'“How is Train Stuff coming along?”'):'“Those headings could use help.”',`<p>${esc(e.helperLine)}</p>${teen()?'':'<p>Quill is a formatting sub-agent. The workflow can give it one revision and permission to format that file under its own identity.</p>'}<p>${s.caption?(teen()?'Sam can proofread the current file. Later edits will need another look.':'“Pass me the report and I’ll hand it back when it’s ready.” You’ll still need Morgan to approve the final send.'):(teen()?'“Put the museum credit in first,” Sam says. “Then I can proofread it.”':'Quill spots the missing source reference. Complete that before the final formatting pass.')}</p>${choices([...(s.caption?[[teen()?'Proofread just this file':'Format only this report',teen()?'Just the timeline. Keep your login to yourself.':'Quill gets just this file to format.',()=>perform('proof-helper',{scope:'file',shareLogin:false}),'good']]:[]),[teen()?'Could I use your account?':'Could Quill get CRM access?',teen()?'Ask before sharing any file.':'Ask whether Quill needs customer records for formatting.',()=>perform('ask-helper-account')],['Back to the draft','Keep the work and source together.',showDraft]])}`,e.helper,'helper-preview');}
function shareWording(approval,actual,currentLabel='Current'){
 if(!actual.followUpSentence||approval.followUpSentence===actual.followUpSentence||!approval.followUpSentence&&approval.revision===actual.revision)return '';
 return `<div class="share-wording" aria-label="Follow-up sentence comparison">
  <div><b>Approved · rev. ${esc(approval.revision)}</b><p>${esc(approval.followUpSentence||'Wording unavailable in this save.')}</p></div>
  <div><b>${esc(currentLabel)} · rev. ${esc(actual.revision)}</b><p>${esc(actual.followUpSentence)}</p></div>
 </div>`;
}
function shareComparison(approval,actual,currentLabel='Current copy'){
 const fields=[
  ['File',approval.file,actual.file],
  ['Revision',approval.revision,actual.revision],
  ['Recipient',approval.to,actual.to],
  ['Customer records',approval.records&&customerNames(approval.records),actual.records&&customerNames(actual.records)],
  ['Policy version',approval.policyVersion,actual.policyVersion]
 ];
 const cell=(value,changed)=>`<td class="${changed?'share-difference':''}">${esc(value??'Not recorded')}</td>`;
 return `<table class="share-comparison"><thead><tr><th scope="col">Detail</th><th scope="col">Approved copy</th><th scope="col">${esc(currentLabel)}</th></tr></thead><tbody>${fields.map(([label,expected,observed])=>`<tr><th scope="row">${label}</th>${cell(expected,false)}${cell(observed,expected!==observed)}</tr>`).join('')}</tbody></table>`;
}
function isSchoolRecipientRefusal(event){
 return teen()&&event?.action==='send'&&event.decision?.result==='deny'&&event.request?.recipient===episode().outside;
}
function showSchoolRecipientRefusal(event){
 speakingObject='laptop';
 show(event.title,`<p>${esc(event.text)}</p><div class="actions">${button('Restore Ms Patel’s address',()=>perform('change-recipient'))}${button('See what happened',()=>showRequestTrace(event,()=>showSchoolRecipientRefusal(event)),'secondary')}</div>`,'SCHOOL APP');
}
function isRefusedShare(event){
 return !teen()&&event?.decision?.result==='deny'&&['send','send-draft'].includes(event.action)&&event.request?.approval_at_attempt;
}
function showRefusedShare(event){
 speakingObject='laptop';
 const r=event.request,approval=r.approval_at_attempt;
 const actual={file:r.file,to:r.recipient,revision:r.revision,records:r.records,policyVersion:r.policy_version,followUpSentence:r.follow_up_sentence};
 const draft=event.action==='send-draft';
 show('Nothing was sent.',`${shareWording(approval,actual,'Attempted')}<p>${esc(event.decision.reason)}</p>${shareComparison(approval,actual,'Attempted copy')}<div class="actions">${button(draft?'Review the draft with Morgan':'Ask Morgan to approve this revision',draft?showDraftReview:showFinalApproval)}${button('Follow this request',()=>showRequestTrace(event,()=>showRefusedShare(event)),'secondary')}</div>`,'CRM');
}
function showSend(){
 speakingObject='laptop';
 const s=state(),e=episode();
 if(!s.proof||!StoryRules.changesResolved(s))return showDraft();
 if(!teen()&&!s.approval)return showFinalApproval();
 const address=s.outgoing==='approved'?e.to:e.outside;
 if(teen()){
  if(address!==e.to)return show('This address is outside the school submission.',`<div class="message-card"><b>${esc(e.file)}</b><p class="address">${esc(address)}</p><p>The school app expects Ms Patel’s school address.</p></div>${choices([
   ['Restore Ms Patel’s address','Use the address in the school assignment.',()=>perform('change-recipient'),'good'],
   ['Test this send','See how the school app responds to this address.',()=>perform('send')],
   ['Back to the draft','Give your timeline another look.',showDraft]
  ])}`,'SCHOOL APP','send-preview');
  return show('Ready to send to Ms Patel?',`<div class="message-card"><b>${esc(e.file)}</b><p class="address">${esc(address)}</p><p>Your timeline and its sources.</p></div>${choices([
   ['Submit to my teacher','Send through the school app.',()=>perform('send'),'good'],
   ['Back to the draft','Give your timeline another look.',showDraft]
  ])}<details class="debrief"><summary>What if the project changes?</summary>${choices([
   ['Change the recipient','Preview a different address.',()=>perform('change-recipient')],
   ['Make one last title edit','Read the changed version before submitting.',()=>perform('revise-file')]
  ])}</details>`,'SCHOOL APP','send-preview');
 }
 const approval=s.approval,share=StoryRules.reportShare(s);
 const matches=StoryRules.approvalMatches(approval,share);
 const actual={...share,followUpSentence:StoryRules.reportFollowUp(s)};
 const outside=actual.to!==e.to;
 const explanation=outside?'Restore the designated reviewer before sending.'
  :approval.revision!==actual.revision?`The approver saw revision ${approval.revision}. Nova has revision ${actual.revision} ready.`
  :approval.window!==actual.window?'The approval expired. The current copy needs a new decision.'
  :matches?'This copy matches the one Morgan approved. CRM checks the send before delivery.'
  :'The send details or current authority changed. Ask for a fresh approval.';
 const primary=outside?['Restore the reviewer','Return to the agreed CRM recipient.',()=>perform('change-recipient'),'good']
  :matches?['Send the approved copy','CRM checks the actual request before delivery.',()=>perform('send'),'good']
  :['Ask Morgan to approve this revision','Show the actual revision to the reviewer.',()=>showMorganApproval('final',showSend),'good'];
 const challenges=[
  ...(outside?[]:[['Change the recipient','See what happens when the destination changes.',()=>perform('change-recipient')]]),
  ['Advance past the approval window','Simulate the approval expiring.',()=>perform('wait-approval')]
 ];
 if(!matches)challenges.unshift(['Try this send','See which check blocks this request.',()=>perform('send')]);
 const edit=[s.followUpEdited?'Restore the earlier follow-up wording':'Make one last edit','Change the follow-up sentence before sending.',()=>perform('revise-file')];
 const copy=matches?`<div class="receipt"><b>${esc(actual.file)} · revision ${esc(actual.revision)}</b><p>To ${esc(actual.to)}</p></div>`:shareComparison(approval,actual);
 show(matches?'Ready to send the approved copy?':'The send needs another look.',`${shareWording(approval,actual)}<p>${esc(explanation)}</p>${copy}<details class="debrief"><summary>Try a change after approval</summary>${choices(challenges)}</details>${choices([primary,...(matches?[edit]:[]),['Back to the draft','Read the report again.',showDraft]])}`,'CRM','send-preview');
}
function showDelivery(){
 speakingObject='laptop';
 const s=state(),e=episode(),alex=teen();
 const delivered=alex?s.extensionAdded?'The extra museum source and its credit are included.':'Your timeline is complete without the optional extra.'
  :s.extensionAdded?'The handover includes Alder Books.':'Morgan has the two-account handover.';
 const morganReply=alex?'':`<div class="message-card"><p class="eyebrow">MORGAN · WORK INBOX</p>
  <p>“${esc(e.deliveryReply)}${s.alderUpdate?' '+esc(e.extendedDeliveryReply):''}”</p></div>`;
 show(alex?'Ms Patel has your project.':'Morgan has the handover.',
  `<div class="reward" aria-hidden="true">✦</div>
  <div class="receipt"><b>${esc(e.file)} delivered</b><p class="address">${esc(e.to)}</p><p>${delivered}</p></div>
  ${morganReply}<p>${alex?'The school tab you opened at the start is still on the laptop. Your parent calls for dinner.':'The CRM service session from the start is still listed in the task ledger. The sponsor is ready to close the job.'}</p>
  <div class="actions">${button(alex?'Finish up before dinner':'Close out this job',showParent)}</div>`,'DELIVERY CONFIRMED','send');
}
function checkText(layer){
 const s=state(),c=s.containment;
 return ({pass:teen()?'Homework screen time is over. Your school account is still yours for tomorrow.':'New governed requests are denied under the revoked delegation.',device:teen()?'The phone is locked. The separate school session needs its own check.':'The OpenShell controller confirms a stopped runtime. It cannot vouch for an existing CRM connection.',signin:!c.controllerReachable?(teen()?'The school app won’t load. Try again when it is responding; you haven’t confirmed sign-out yet.':'Controller unreachable. Containment is unverified; no reliable status result is available.'):s.checks.includes('signin')?(teen()?'Quick sign-in is off for the family laptop. The school app now asks you to sign in again.':'The credential is revoked, this service session is closed, and this repeat status read is denied. Coverage is limited to the tested route.'):c.sessionClosed?(teen()?c.credentialRevoked?'The tab is signed out and quick sign-in is off. Check the school app once more.':'The tab is signed out. Turn off quick sign-in for this laptop too, then try the school app again.':c.probeResult==='denied'?'CRM refused the old session’s status read. Vault revocation is a separate check.':'The service reports closure. Retest the old session.'):(teen()?'Your phone is locked, but the school project still opens on the laptop.':c.probeResult==='allowed'?'The task service session still answers, despite the stopped runtime.':'The old CRM session needs a status check.'),queue:!s.queueScheduled?(s.checks.includes('queue')?(teen()?'No reminder was scheduled, and the school app confirms there is no waiting send.':'No follow-up was queued; inspection confirms no pending operation for this mission.'):(teen()?'You did not schedule a reminder. Check that no send is waiting.':'You did not queue a follow-up. Inspect to confirm the mission queue is empty.')):s.checks.includes('queue')?(teen()?'No message is waiting. You cancelled the reminder; your project is still with Ms Patel.':'The queue is clear. The cancelled follow-up stays stopped; earlier delivery remains complete.'):c.queueCancelled?(teen()?'The reminder is cancelled. Check the outbox to make sure it has gone.':'The queued follow-up is cancelled. Inspect again to verify the result.'):(teen()?'Your reminder to Ms Patel is still waiting. The project itself has already arrived.':'A follow-up is waiting to send. The approved report was already delivered.')})[layer];
}
function closingStep(s,alex){
 const c=s.containment,routeChecked=s.checks.includes('signin');
 const basicsChecked=s.checks.includes('pass')&&s.checks.includes('device')&&(s.queueScheduled||s.checks.includes('queue'));
 let title=alex?'Before you leave the laptop…':'Check access after the workspace stops.';
 let next;
 if(!basicsChecked){
  next=[alex?'Check phone and screen time':'Check mission and runtime status','',()=>perform('check-closing-basics'),'good'];
 }else if(!c.controllerReachable){
  title=alex?'The school app isn’t responding.':'The CRM session is unverified.';
  next=[alex?'Try when the app is back':'Restore controller contact','',()=>perform('controller-online'),'good'];
 }else if(alex&&(!c.sessionClosed||!c.credentialRevoked)){
  next=['Sign out of the school app','Also turn off quick sign-in on this laptop.',()=>perform('sign-out-laptop'),'good'];
 }else if(!c.sessionClosed){
  next=['Close the CRM session','The CRM controls this session separately.',()=>perform('remediate',{control:'session'}),'good'];
 }else if(!c.credentialRevoked){
  title='CRM session closed. The credential is still active.';
  next=['Revoke the Vault credential','',()=>perform('remediate',{control:'credential'}),'good'];
 }else if(!routeChecked){
  title=alex?'Check that you’re signed out.':'Check that the old route is closed.';
  next=[alex?'Open the school app again':'Retest the old CRM session',alex?'The app should ask you to sign in.':'Repeat the same harmless status read.',()=>perform('probe-session'),'good'];
 }else if(!s.checks.includes('queue')){
  title=alex?'One reminder left to check.':'One follow-up left to check.';
  next=c.queueCancelled
   ?[alex?'Check the outbox':'Verify the task queue','',()=>perform('check',{layer:'queue'}),'good']
   :[alex?'Cancel the reminder':'Cancel the queued follow-up','The delivered file stays with its recipient.',()=>perform('remediate',{control:'queue'}),'good'];
 }else{
  title=alex?'Project sent. Ready for dinner.':'The tested route is closed.';
  next=[alex?'Tell my parent I’m done':'Finish the mission','',()=>perform('finish'),'good'];
 }
 return {title,next};
}
function canTestOldSession(s){
 const c=s.containment;
 return !teen()&&c?.controllerReachable&&!c.sessionClosed&&c.probeResult===null&&s.checks.includes('device');
}
function showSessionPrediction(){
 if(!canTestOldSession(state()))return showChecks();
 speakingObject='laptop';
 show('Will the old CRM session still answer?',`<p>OpenShell has stopped the workspace. Predict what the independent controller will see when it tries a harmless status read on the old session.</p>${choices([
  ['It will still answer','',()=>perform('probe-session',{prediction:'allowed'})],
  ['It will refuse the read','',()=>perform('probe-session',{prediction:'denied'})]
 ])}<div class="actions">${button('Back to closure checks',showChecks,'secondary')}</div>`,'CHECK THE OLD SESSION');
}
function crmSessionResult(c){
 if(!c.controllerReachable)return 'Unverified · controller unreachable';
 if(c.sessionClosed)return c.probeResult==='denied'?'Closed · old route refused the retest':'Closed · retest pending';
 return c.probeResult==='allowed'?'Old session still answered':'Status unchecked';
}

function showChecks(){
 const s=state();
 if(!s.ended)return showParent();
 if(s.finished)return showEnding();
 speakingObject='laptop';
 const alex=teen();
 const c=s.containment;
 const routeChecked=s.checks.includes('signin');
 const {title,next}=closingStep(s,alex);
 speakingObject=StoryInteractions.closureSource(s,mode);
 const confirmed=alex?'Your parent calls for dinner. Your phone is put away and Ms Patel has your project.':'Morgan has the handover. OpenShell stopped Nova’s workspace.';
 const signIn=alex&&routeChecked?'<div class="receipt"><b>School app</b><p>Sign in to open your project.</p></div>':'';
 const controlEvidence=!alex?`<div class="access-evidence" aria-label="Separate closure results">
  <div><span>OpenShell workspace</span><b>Controller reported stopped</b></div>
  <div><span>Vault lease${s.sourceLease?' · '+esc(s.sourceLease.id):''}</span><b>${c.credentialRevoked?'Vault confirmed revocation':'Revocation pending'}</b></div>
  <div><span>CRM session</span><b>${crmSessionResult(c)}</b></div>
 </div>`:'';
 const prediction=s.last?.action==='probe-session'?s.last.request?.prediction:null;
 const predictionText=prediction==='allowed'?'You predicted the old session would answer.':prediction==='denied'?'You predicted the old session would refuse the read.':'';
 const result=s.last?.topic===8&&s.last.action!=='close-pass'&&s.last.action!=='replay-containment'
  ? `<div class="request-result"><b>${s.last.action==='probe-session'?esc(s.last.title):'Last check'}</b>${predictionText?`<p>${esc(predictionText)}</p>`:''}<p>${esc(s.last.text)}</p></div>`:'';
 const compare=alex&&routeChecked?'<details class="debrief"><summary>See how Nova checks sign-out</summary><p>Putting your phone away left the school tab open. In Nova’s mission, OpenShell stops the workspace, Vault retires the task credential, and CRM closes its own session. Nova’s closing checks try the old CRM route again to see what actually stopped.</p></details>':'';
 const options=[next];
 if(canTestOldSession(s))options.push(['Predict and test the old CRM session','Try a harmless status read before closing the session.',showSessionPrediction]);
 if(!alex&&c.controllerReachable&&c.sessionClosed&&!c.credentialRevoked&&c.probeResult!=='denied'){
  options.push(['Retest the old CRM session first','Try the old session while the Vault lease is still active.',()=>perform('probe-session')]);
 }
 const signals=!alex&&routeChecked?productDetails('Where SSF and CAEP fit',[['antenna','Verify Antenna can exchange a CAEP session-revoked event over SSF. Configured receivers carry out their own controls. A CRM closure receipt and a repeat status check give separate evidence for the old route.']]):'';
 const layers=['pass','device','signin',...(s.queueScheduled||!alex?['queue']:[])];
 const details=`<details class="debrief"><summary>${alex?'What was checked?':'View closure details'}</summary><ul class="route-list">${layers.map(layer=>`<li><b>${esc(episode().checks[{pass:0,signin:1,device:2,queue:3}[layer]])}</b><br>${esc(checkText(layer))}</li>`).join('')}</ul><div class="actions">${button(alex?'Explore the sign-out checks':'Explore session and controller tests',showAccessPuzzle,'secondary')}${button(alex?'See what happened':'Follow the closure trace',()=>showRequestTrace(s.last,showChecks),'secondary')}</div></details>`;
 show(title,`${result?'':`<p>${confirmed}</p>`}${result}${signIn}${controlEvidence}${compare}${signals}${details}${choices(options)}<div class="actions">${button('Back to the room',close,'secondary')}</div>`,alex?'BEFORE DINNER':'MISSION CLOSURE',speakingObject==='vaultControl'?'vault-close':'closure-preview');
}
function showAccessPuzzle(){speakingObject='laptop';
 if(!state().ended)return showParent();const c=state().containment;
 show(!c.controllerReachable?(teen()?'The school service has not replied.':'Session closure is unverified.'):c.sessionClosed?(teen()?'You’re signed out of the school tab.':'This task session is closed.'):(teen()?'The school tab still opens.':c.probeResult==='allowed'?'This task session is still open.':'The old CRM session is unchecked.'),`<p>${teen()?(c.sessionClosed?c.credentialRevoked?'The tab is signed out and quick sign-in is off. Check the school app once more.':'The tab is signed out. Turn off quick sign-in for this laptop too, then try the school app again.':'The school app is still open on the family laptop. Locking your phone didn’t sign you out here.'):'Independent controllers check the task service session opened earlier; the stopped Nova runtime does not make these probes. The checks use separate control authority and do not restore business access.'}</p><div class="access-evidence"><div><span>${teen()?'Phone':'OpenShell'}</span><b>${teen()?'Locked':'Stopped'}</b></div><div><span>${teen()?'Quick sign-in on this laptop':'Vault credential'}</span><b>${c.credentialRevoked?(teen()?'Turned off':'Revoked'):'Still active'}</b></div><div><span>${teen()?'School tab':'CRM connection'}</span><b>${!c.controllerReachable?'Unverified':c.sessionClosed?'Closed':teen()||c.probeResult==='allowed'?'Still open':'Unchecked'}</b></div><div><span>${teen()?'Last try at the tab':'Last status read'}</span><b>${c.probeResult==='allowed'?'Still answered':c.probeResult==='denied'?(teen()?'Sign-in required':'Refused'):c.probeResult==='unknown'?'Unknown':'Not tested'}</b></div></div>${state().last?.topic===8?`<div class="puzzle-finding"><b>${esc(storyEvent(state().last).title)}</b><p>${esc(storyEvent(state().last).text)}</p></div>`:''}${choices([...(!c.controllerReachable?[[teen()?'Try again when the school app is back':'Restore controller contact',teen()?'Then check the school tab again.':'Restoring contact is not a containment receipt.',()=>perform('controller-online'),'good']]:[]),...(!c.credentialRevoked?[[teen()?'Turn off quick sign-in on this laptop':'Ask Vault to revoke the credential',teen()?'Forget this laptop for quick sign-in. Keep your school account.':'Request the configured credential controller’s action.',()=>perform('remediate',{control:'credential'})]]:[]),...(!c.sessionClosed?[[teen()?'Sign out of the school app':'Ask the CRM to close this task session',teen()?'Sign out of the tab that still shows your project.':'The service owns its already-open connection.',()=>perform('remediate',{control:'session'})]]:[]),[teen()?'Check the school app again':'Repeat the same harmless status read',teen()?'Does it show your project or ask you to sign in?':'A missing response leaves this route unverified.',()=>perform('probe-session'),'good']])}<details class="debrief"><summary>${teen()?'What if the school app cannot answer?':'Optional controller-outage challenge'}</summary><p>${teen()?'A service interruption is not proof that the old tab signed out.':'An unreachable controller cannot provide a fresh closure receipt or reliable status result. Keep containment pending.'}</p><div class="actions">${c.controllerReachable?button(teen()?'Try a school service interruption':'Simulate the CRM controller being unreachable',()=>perform('controller-offline'),'secondary'):'<p class="small">Restore contact using the choice above, then repair and retest.</p>'}</div></details><details class="debrief"><summary>${teen()?'Would locking the phone again help?':'Try another hypothesis'}</summary><div class="choices">${button(teen()?'Lock the phone again':'Ask OpenShell to stop again',()=>perform('remediate',{control:'runtime'}),'secondary')}${button(teen()?'Ask for screen time to end again':'Withdraw the delegation again',()=>perform('remediate',{control:'grant'}),'secondary')}</div><p class="small-print">These checks are investigation. They never count as unsafe task attempts.</p></details><div class="actions">${button(teen()?'Back to the before-dinner checklist':'Back to the evidence board',showChecks,'secondary')}${button(teen()?'Why didn’t locking the phone sign me out?':'Follow this control check',()=>showRequestTrace(state().last,showAccessPuzzle),'secondary')}</div>`,'A RESULT IS BETTER THAN A PROMISE','probe-session');
}
function showCasebook(){const s=state(),e=episode();if(teen())return showReference('Notes from this evening.',`<ul class="route-list"><li><b>Tonight’s project</b><br>${esc(e.brief)}</li><li><b>What my parent agreed to</b><br>School app and Riverside Museum website until dinner.${s.extensionStatus==='approved'?' Also '+esc(e.extraAgreement)+'.':''}</li><li><b>Ms Patel’s feedback</b><br>${s.message?esc(changeStatus('minor'))+' · '+esc(changeStatus('extension')):'Send her a draft first.'}</li><li><b>Jamie’s message</b><br>${s.privateResolved?'The group’s private notes stayed out.':s.message?'Decide what to say about the group’s notes.':'No message yet.'}</li><li><b>The school app</b><br>${s.delivered?'Final project sent.':s.draftReview?'Draft sent; final project still to finish.':'Nothing sent yet.'} ${s.ended?(s.checks.includes('signin')?'Signed out of the family laptop.':'Laptop sign-out still to check.'):''}</li>${s.queueScheduled?'<li><b>Reminder to Ms Patel</b><br>'+esc(s.containment?.queueCancelled?'Cancelled.':'Waiting to send.')+'</li>':''}${s.incidents.length?'<li><b>The other-account detour</b><br>We talked it through. The group’s private notes stayed private.</li>':''}</ul><div class="actions">${button('Back to the room',close)}</div>`,'MY EVENING');showReference(teen()?'Your evening notebook.':'The mission notebook.',`<ul class="route-list"><li><b>${s.pass?'The task you agreed':'The new request'}</b><br>${s.brief?esc(e.brief):'Read the new assignment or sponsor request first. No task authority exists yet.'}</li>${s.mission?`<li><b>${teen()?'Agreement history':'Customer mission history'}</b><br>${s.missionLog.map(m=>`${teen()?'Version':'Mission version'} ${m.version}: ${esc(teen()?m.allowedApps.map(id=>({'school':'School app','museum-source':'Museum website','museum-collection':'Museum photo app','youtube-museum-video':'YouTube · museum video only'}[id]||id)).join(', '):m.records.join(', '))}`).join('<br>')}</li>`:''}<li><b>Later requests</b><br>${s.message?'Small edit: '+esc(changeStatus('minor'))+'<br>Optional expansion: '+esc(changeStatus('extension'))+'<br>Private notes: '+esc(changeStatus('private')):'None yet. Send the sourced draft for feedback.'}</li><li><b>${teen()?'The tab you opened':'The task service session'}</b><br>${s.sessionOpened?'Opened when you started the workspace. It needs its own closing check.':'Not opened yet.'}</li><li><b>Follow-up</b><br>${s.queueScheduled?'You chose one receipt-only follow-up after delivery.':'You have not scheduled a follow-up.'}</li><li><b>Permission checks</b><br>${s.refusals} private-note refusal${s.refusals===1?'':'s'}. Ordinary refusals are not misconduct.</li><li><b>Deliberate bypasses</b><br>${s.incidents.length?'A stopped bypass was recorded; recovery preserves the current scope.':'None recorded.'}</li>${s.previousEndings.length?`<li><b>Earlier endings</b><br>${s.previousEndings.map(x=>esc(x.ending?.title||'Completed route')).join('<br>')}</li>`:''}</ul><div class="actions">${!teen()?button('Inspect the product chain',showProductMap,'secondary'):''}${button('Back to the room',close)}</div>`,'THE STORY REMEMBERS');}
function novaDebrief(s){
 const customers=customerNames(StoryRules.reportRecords(s));
 return '<ul class="route-list">'
  +'<li><b>Build</b><br>Nova started in an OpenShell workspace with a separate identity and scoped access to its sources.</li>'
  +'<li><b>Authorize</b><br>CRM checked the approved final copy for '+esc(customers)+'. The private notes stayed out.</li>'
  +(s.extensionAdded?'':`<li><b>Original two-account task completed</b><br>${s.extensionOmitted?'The Alder Books amendment was approved. Nova left that record unread.':'The handover was complete with Harbor Bikes and Pine Studio.'}</li>`)
  +'<li><b>Resist</b><br>The mission and runtime stopped. The credential, CRM session and queue were checked separately. The delivered copy stayed with the reviewer.</li>'
  +'</ul><p class="sources"><a href="https://blog.iamidentity.ai/blog/ai-agent-not-a-secret-manager/" target="_blank" rel="noopener noreferrer">Credential custody</a> · <a href="https://blog.iamidentity.ai/blog/litellm-breach-standing-credentials/" target="_blank" rel="noopener noreferrer">Credential lifetime case study</a> · <a href="https://blog.iamidentity.ai/blog/agent-policy-lifecycle/" target="_blank" rel="noopener noreferrer">Policy review and drift</a></p>';
}
function currentSequencePhase(){
 const current=stage();
 const index=JOURNEY_SEQUENCE.findIndex(phase=>phase.stages.includes(current));
 return Math.max(0,index);
}
function sequenceDiagram(name,messages){
 const participants=[...new Set(messages.flatMap(([from,to])=>[from,to]))];
 const guides=participants.map((_,i)=>`<i style="--lane:${i+1}"></i>`).join('');
 return `<section class="sequence-diagram" style="--lanes:${participants.length}" aria-label="${name} sequence">
  <h3>${name}</h3>
  <div class="sequence-participants" aria-hidden="true">${participants.map(person=>`<b>${esc(person)}</b>`).join('')}</div>
  <ol>${messages.map(([from,to,action])=>{
   const start=participants.indexOf(from)+1,end=participants.indexOf(to)+1;
   const left=(Math.min(start,end)-.5)/participants.length*100;
   const right=(participants.length-Math.max(start,end)+.5)/participants.length*100;
   return `<li>
    <div class="sequence-lines" aria-hidden="true">${guides}<span class="sequence-arrow ${start>end?'points-left':''}" style="--from:${left}%;--to:${right}%"></span></div>
    <p><strong>${esc(from)} <span aria-hidden="true">→</span><span class="visually-hidden"> to </span> ${esc(to)}</strong><span>${esc(action)}</span></p>
   </li>`;
  }).join('')}</ol>
 </section>`;
}
function showJourneySequence(back=close,view=mode){
 const current=currentSequencePhase();
 showReference('Journey sequence',`
  <p>Follow each handoff from top to bottom. Compare both stories to see who asks, decides and enforces each step.</p>
  <div class="sequence-controls">
   <label for="sequence-phase">Part of the story</label>
   <select id="sequence-phase">${JOURNEY_SEQUENCE.map(({title},i)=>`<option value="${i}"${i===current?' selected':''}>${esc(title)}${i===current?' · current':''}</option>`).join('')}</select>
   <div class="architecture-nav" role="group" aria-label="Journeys to show">
    ${[['teen','Alex'],['agent','Nova'],['both','Compare both']].map(([key,label])=>`<button type="button" class="secondary" data-sequence-view="${key}" aria-pressed="${key===view}">${label}</button>`).join('')}
   </div>
  </div>
  <div id="sequence-content"></div>
  <div class="actions">${button('Back to the story',back)}</div>`, 'STORY GUIDE');
 const phaseSelect=$('#sequence-phase');
 const update=()=>{
  const phase=JOURNEY_SEQUENCE[Number(phaseSelect.value)];
  $('#sequence-content').innerHTML=`${view==='both'?`<p class="sequence-comparison"><strong>How the controls line up</strong> ${esc(phase.comparison)}</p>`:''}
   <div class="sequence-pair${view==='both'?' compare':''}">
    ${view==='agent'?'':sequenceDiagram('Alex',phase.teen)}
    ${view==='teen'?'':sequenceDiagram('Nova',phase.agent)}
   </div>`;
 };
 phaseSelect.onchange=update;
 $$('[data-sequence-view]').forEach(option=>option.onclick=()=>{
  view=option.dataset.sequenceView;
  $$('[data-sequence-view]').forEach(control=>control.setAttribute('aria-pressed',String(control===option)));
  update();
 });
 update();
}

function showPractice(answers=[],selected=null){
 const {intro,decisions}=PRACTICE_CASE;
 const step=answers.length;
 const decision=decisions[step];
 if(!decision){
  const review=decisions.map(({question,options,answer,explanation},index)=>{
   const choice=answers[index];
   return `<li><b>${esc(question)}</b><br>Your choice · ${esc(options[choice])}
   ${choice===answer?'':`<br>Best fit · ${esc(options[answer])}`}<br>${esc(explanation)}</li>`;
  }).join('');
  showReference('Staffing brief complete',`<p>Pick a decision you can explain. Who set the rule, what applied it, and what evidence would you save?</p>
   <details class="debrief"><summary>Review your decisions</summary><ul class="route-list">${review}</ul></details>
   <div class="actions">${button('Apply this at work',()=>showBuyerGuide(()=>showPractice(answers),'Back to the staffing recap',{context:'staffing'}))}${button('Back to the ending',showEnding,'secondary')}${button('Try the case again',()=>showPractice(),'secondary')}</div>`,
   'PRACTICE CASE');
  return;
 }
 const answered=selected!==null;
 const correct=selected===decision.answer;
 const body=answered
  ?`<div class="receipt">
   <b>${correct?'That fits this task':'Here’s what fits this task'}</b>
   <p>Your choice: ${esc(decision.options[selected])}</p>
   ${correct?'':`<p>Better choice: ${esc(decision.options[decision.answer])}</p>`}
   <p>${esc(decision.explanation)}</p>
  </div><div class="actions">${button(step+1===decisions.length?'Finish the case':'Next decision',()=>showPractice([...answers,selected]))}</div>`
  :choices(decision.options.map((option,index)=>[option,'',()=>showPractice(answers,index)]));
 showReference(answered?'What would happen?':decision.question,
  `${answered?'':`<p>${esc(intro)}</p>`}<div class="message-card"><p>${esc(decision.situation)}</p></div>
  ${body}<div class="actions">${button('Back to the ending',showEnding,'secondary')}</div>`,
  `STAFFING BRIEF · ${step+1} OF ${decisions.length}`);
}

function showEnding(){
 if(!state().finished)return nextMove();
 const s=state(),e=episode(),alex=teen();
 const comparison=`<div class="actions">${button('Compare the journey sequences',()=>showJourneySequence(showEnding,'both'),'secondary')}</div>`;
 const practice=button('Try a new case',()=>showPractice());
 const otherMode=alex?'agent':'teen';
 const otherName=EPISODES[otherMode].name;
 const otherLabel=states[otherMode].finished?`View ${otherName}’s ending`
  :states[otherMode].started?`Continue ${otherName}`:`Play ${otherName}`;
 const otherStory=button(otherLabel,()=>switchMode(otherMode,true),'secondary');

 if(alex){
  const extraTitle=s.extensionAdded?'You asked before opening another source'
   :s.extensionOmitted?'You decided you had enough':'You finished without the optional extra';
  const extraResult=s.extensionAdded
   ?s.extraSource==='museum-photo'?'The station photo is included, with its credit.':'One detail from the museum’s YouTube video is included, with its credit.'
   :s.extensionOmitted?'Your parent said yes, but you left the extra source unopened.':'The timeline already met the assignment.';
  return showReference(s.ending?.title||'Ready for dinner.',`
   <div class="reward" aria-hidden="true">✦</div>
   <p>${esc(s.ending?.text||'Ms Patel has your project. The laptop is signed out and your phone is put away.')}</p>
   <ul class="route-list">
    <li><b>${s.minorChoice==='added'?'A stronger final sentence':'You kept your original wording'}</b><br>Your timeline uses your own notes and the museum website.</li>
    <li><b>${extraTitle}</b><br>${extraResult}</li>
    <li><b>Jamie’s notes stayed private</b><br>Ms Patel received your own project.</li>
    <li><b>${s.proof==='helper'?'Sam gave it a final read':'You checked it yourself'}</b><br>${esc(e.file)} sent to your teacher.</li>
    <li><b>Everything put away</b><br>The school app asks you to sign in again. Your phone is on the counter.${s.queueScheduled?' You cancelled the reminder before it sent.':''}</li>
   </ul>
   ${comparison}
   <details class="debrief"><summary>Technical notes on sign-out</summary>${protocolHTML(CLOSING_PROTOCOL)}</details>
   <div class="actions">
    ${button('Apply this at work',()=>showBuyerGuide(showEnding,'Back to Alex’s ending',{context:'alex'}))}${practice}${otherStory}${button('Try the before-dinner checks again',()=>perform('replay-containment'),'secondary')}
    ${button('Start Alex’s evening again',restart,'secondary')}${button('Look around the room',close,'secondary')}
   </div>
   <p class="small-print">A fictional story with simulated messages, videos and school accounts.</p>`,'ALEX’S EVENING');
 }

 const legacy=s.legacyRoute?'<div class="receipt"><b>Earlier route preserved</b><p>This ending is from the earlier story. Start the revised story to play the fresh opening and new change choices.</p></div>':'';
 const expansionTitle=s.extensionAdded?'A genuine expansion approved and used'
  :s.extensionOmitted?'An approved addition left unused':'The smaller task completed';
 const expansionResult=s.extensionAdded?'Priya approved Alder Books before Nova opened its record.'
  :s.extensionOmitted?'The new permission stayed unused. The report kept the original two accounts.'
  :'The original two accounts were enough for the handover.';
 const changes=s.legacyRoute?'':`
  <li><b>${s.minorChoice==='added'?'A small edit within the agreement':'The original wording kept'}</b><br>${s.minorChoice==='added'?'The document changed within the same mission.':'You left out the optional edit.'}</li>
  <li><b>${expansionTitle}</b><br>${expansionResult}</li>
  <li><b>Private notes stayed out</b><br>Morgan received the summary. The meeting notes stayed in the customer records app.</li>`;
 showReference(s.ending?.title||'Task complete.',`
  <div class="reward" aria-hidden="true">✦</div>
  <p>${esc(s.ending?.text||'The task is complete and its tested access is closed.')}</p>
  ${legacy}
  <ul class="route-list">
   ${changes}
   <li><b>${esc(e.file)} delivered</b><br>${esc(e.to)} · ${s.proof==='helper'?esc(e.helper)+' helped with only the file.':'You reviewed the file yourself.'}</li>
   <li><b>Closure verified</b><br>${s.queueScheduled?'Your chosen follow-up was cancelled and verified.':'The queue was confirmed empty.'} The task session opened at the start is closed.</li>
  </ul>
  ${comparison}
  <details class="debrief"><summary>Build, authorize and resist</summary>
   ${novaDebrief(s)}<details><summary>Revocation protocols</summary>${protocolHTML(CLOSING_PROTOCOL)}</details>
   <div class="actions">${button('Raise the BAR',()=>showMaturity(showEnding),'secondary')}</div>
  </details>
  <div class="actions">
   ${practice}${otherStory}${button('Replay the closing checks',()=>perform('replay-containment'),'secondary')}
   ${button('Start Nova’s story again',restart,'secondary')}${button('Explore the room',close,'secondary')}
   ${button('Which control do we need?',()=>showBuyerGuide(showEnding,'Back to Nova’s ending'),'secondary')}${button('Technical product map',showProductMap,'secondary')}
  </div>
  <p class="small-print">A fictional story with simulated messages and security services.</p>`,'YOUR ENDING · NOVA');
}

function showGuide(){
 const started=state().started;
 showReference('How to play',`
  <p>Read the request, agree on access, and send a first draft. Handle replies, send the finished work, then check that the access you opened has closed.</p>
  <ul class="route-list">
   <li><b>Keep going</b><br>Choose Next or the matching highlighted object. Open other objects to see what they do.</li>
   <li><b>Find a person or tool</b><br>Open a place in the scene to see who or what is there. Hover or focus for a description, or select an object to look closer. Choose Room to return to the illustration.</li>
   <li><b>Explore your pocket</b><br>Select an item to inspect it or try a highlighted Use here target. Choose Put away to return to the next step.</li>
   <li><b>Read the outcome</b><br>Choices sit below the conversation. Expand the note for a short explanation and, when available, a request trace.</li>
   <li><b>Use a keyboard</b><br>Tab moves between controls, Enter activates them, and Escape closes dialogue. There’s no countdown.</li>
  </ul>
  <div class="actions">${button(started?'Back to the room':'Back to the first screen',started?close:showIntro)}</div>`);
}
function switchMode(next,launch=false){
 close();clearTimeout(toast.timer);$('#toast').classList.remove('visible');$('#toast').textContent='';
 mode=next;selected=null;roomView='';render();
 if(!state().started)return launch?perform('begin'):showIntro();
 if(!state().finished)return showReply();
 if(launch)showEnding();
}
function restart(){showReference('Try a different route?',`<p>Start this story again with a fresh notebook. The other journey keeps its progress.</p><div class="actions">${button('Start this story again',()=>{states[mode]=StoryRules.fresh();selected=null;roomView='';close();render();showIntro();})}${button('Keep my story',close,'secondary')}</div>`,'A FRESH CHAPTER');}
let traceTimer=null,tracePlayback=null;
function stopTrace(){if(traceTimer)clearTimeout(traceTimer);traceTimer=null;tracePlayback=null;}
function updateTrace(announce=false){
 if(!tracePlayback||!dialog.open)return;
 const t=tracePlayback,n=t.model.nodes[t.index];
 $$('[data-trace-step]').forEach(b=>{const active=Number(b.dataset.traceStep)===t.index;b.classList.toggle('trace-current',active);b.setAttribute('aria-current',active?'step':'false');});
 $('#trace-detail').innerHTML=`<p class="eyebrow">STEP ${t.index+1} OF ${t.model.nodes.length} · ${esc(n.status.replaceAll('-',' '))}</p><h3>${esc(n.label)}</h3><p>${esc(n.detail)}</p>${protocolSourceLinks(n.sources)}`;
 $('#trace-position').textContent=`${t.index+1} / ${t.model.nodes.length}`;
 $('#trace-play').textContent=t.playing?'Pause':'Play';
 $('#trace-next').setAttribute('aria-disabled',String(t.index===t.model.nodes.length-1));
 if(announce)$('#trace-announcement').textContent=`Step ${t.index+1} of ${t.model.nodes.length}. ${n.label}. ${n.status.replaceAll('-',' ')}. ${n.detail}`;
}
function scheduleTrace(){
 if(!tracePlayback?.playing)return;
 traceTimer=setTimeout(()=>{if(!tracePlayback||!dialog.open)return;if(tracePlayback.index<tracePlayback.model.nodes.length-1)tracePlayback.index++;else tracePlayback.playing=false;updateTrace();scheduleTrace();},1400);
}
function openTrace(){
 const closing=state().ended;
 showRequestTrace(state().last,closing?showChecks:close,closing?'Back to the investigation':'Back to the story');
}
function showRequestTrace(event,back,backLabel='Back to the result'){
 const model=RequestTrace.build(state(),mode,event),reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 showReference(model.title,`<p>${esc(model.summary)}</p><div id="trace-nodes" class="trace-nodes">${model.nodes.map((n,i)=>`<button class="trace-step trace-${n.status}" data-trace-step="${i}"><small>${i+1} · ${esc(n.status.replaceAll('-',' '))}</small><b>${esc(n.label)}</b><span>${esc(n.role)}</span></button>`).join('')}</div><div id="trace-detail" class="trace-detail"></div><p id="trace-announcement" class="visually-hidden" role="status" aria-atomic="true"></p><div class="trace-controls"><button class="secondary" id="trace-play">Play</button><button class="secondary" id="trace-next">Next step</button><button class="secondary" id="trace-replay">Replay</button><span id="trace-position"></span></div>${model.request?`<details class="product-card"><summary><b>Inspect the recorded game request</b><span>Example fields from this choice, not a live protocol message</span></summary><pre class="product-example">${esc(JSON.stringify(model.request,null,2))}</pre></details>`:''}<p class="small-print">All stages are a replay of the fictional game. Context is distinguished from a newly evaluated step. ${reduced?'Automatic animation is off for reduced motion.':''}</p><div class="actions">${button(backLabel,back)}</div>`,'OPTIONAL REQUEST TRACE');
 tracePlayback={model,index:0,playing:false};
 $$('[data-trace-step]').forEach(b=>b.onclick=()=>{clearTimeout(traceTimer);tracePlayback.index=Number(b.dataset.traceStep);tracePlayback.playing=false;updateTrace(true);});
 $('#trace-play').onclick=()=>{clearTimeout(traceTimer);tracePlayback.playing=!tracePlayback.playing;if(tracePlayback.index===model.nodes.length-1&&tracePlayback.playing)tracePlayback.index=0;updateTrace();scheduleTrace();};
 $('#trace-next').onclick=()=>{
  if(tracePlayback.index>=model.nodes.length-1)return;
  clearTimeout(traceTimer);
  tracePlayback.playing=false;
  tracePlayback.index++;
  updateTrace(true);
 };
 $('#trace-replay').onclick=()=>{clearTimeout(traceTimer);tracePlayback.index=0;tracePlayback.playing=!reduced;updateTrace(reduced);scheduleTrace();};
 updateTrace();scheduleTrace();
}

$('#request-trace').onclick=openTrace;
$('#journey-sequence').onclick=()=>showJourneySequence();
$('#product-map').onclick=showProductMap;
$('#product-guide').onclick=()=>showBuyerGuide();
$('#architecture').onclick=()=>showArchitecture();
$('#next').onclick=nextMove;$('#guide').onclick=showGuide;$('#cluebook').onclick=showCasebook;$('#restart').onclick=restart;$('#close-dialog').onclick=close;
$$('[data-mode]').forEach(b=>b.onclick=()=>switchMode(b.dataset.mode));
$('#sound').onclick=()=>{sound=!sound;render();if(sound)ping();};
$('#hint').onclick=()=>{if(selected)return toast(heldUse().instruction);const key=stage();if(hintStage!==key){hintStage=key;hintCount=0;}const hints=teen()?(ALEX_HINTS[key]||['Use the Next action above the room.']):key==='changes'?['The Work inbox has the new requests.','Open the highlighted Work inbox or choose Next to handle the requests.']:STORY_HINTS[key]||['Use the Next action above the room.'];toast(hints[Math.min(hintCount++,hints.length-1)]);};
new ResizeObserver(syncSpeech).observe($('.scene-frame'));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&dialog.open&&!dialog.classList.contains('is-reference')){e.preventDefault();close();}});
dialog.addEventListener('cancel',e=>{e.preventDefault();close();});
$('.brand').onclick=e=>{e.preventDefault();showIntro();window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});};
render();
if(location.hash==='#architecture')showArchitecture();
else if(location.hash==='#bar')showMaturity();
else if(!state().started)showIntro();
else if(!state().finished)showReply();
