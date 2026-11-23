'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const SAVE='trust-boundaries-story-v2-1';
let mode='teen',states={teen:StoryRules.fresh(),agent:StoryRules.fresh()},selected=null,sound=false,stored=true,focusReturn=null,hintStage='',hintCount=0,audio,speakingObject='hero';
try{const raw=JSON.parse(localStorage.getItem(SAVE));if(raw){if(['teen','agent'].includes(raw.mode))mode=raw.mode;for(const key of ['teen','agent'])states[key]=StoryRules.hydrate(raw.states?.[key],key);sound=raw.sound===true;}}catch{stored=false;}
const state=()=>states[mode],episode=()=>mode==='teen'?{...EPISODES.teen,...StoryRules.alexExtra(state())}:EPISODES.agent,teen=()=>mode==='teen',stage=()=>StoryRules.stage(state());
function storyEvent(event){return event;}
const move=()=>{
 const key=stage(),s=state(),base=MOVES[key];
 if(key==='paused'&&s.reviewPending)return teen()
  ?['Hear my parent’s answer','Your parent has heard what happened.','parent']
  :['Hear from Priya','Nova’s access is paused while Priya reviews what happened.','parent'];
 if(key==='source'){
  if(s.source)return ['Add this source',teen()?'Credit the museum page below your timeline.':'Credit the customer records in the handover.','laptop'];
  return teen()?['Open the museum website','Check the dates on the Riverside Museum page.','source']:[...NOVA_MOVES.source,'source'];
 }
 const next=key==='checks'?StoryInteractions.speechSource(mode,StoryInteractions.closureSource(s,mode)).object:StoryInteractions.nextObject(mode,key,base[2]);
 return [...(teen()?base.slice(0,2):NOVA_MOVES[key]),next];
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
 $('.scene-frame').classList.toggle('has-conversation',inline);
 $('#scene-dialogue').hidden=inline;
 const active=StoryInteractions.speechSource(mode,speakingObject);
 const last=state().last;
 const passive=StoryInteractions.speechSource(mode,StoryInteractions.eventSource(mode,last?.speaker,last?.action,last?.kind));
 $('#speech-source').textContent=active.name;
 $('#speech-kind').textContent=[active.kind,active.channel].filter(Boolean).join(' · ');
 const reading=$('#dialog-body');$('#dialog-scroll').hidden=!inline||reading.scrollHeight<=reading.clientHeight+12;
 dialog.dataset.source=active.key;
 $('.scene-frame').classList.toggle('hero-thinking',!reference&&(inline?active:passive).key==='hero');
 $('#objects').classList.toggle('has-conversation',inline);
 const canvas=$('.scene-canvas'),frame=$('.scene-frame');
 const tail=point=>Math.max(8,Math.min(92,(canvas.offsetLeft+canvas.clientWidth*point[0]/1000)/frame.clientWidth*100))+'%';
 dialog.style.setProperty('--speaker-x',tail(active.point));
 $('#scene-dialogue').style.setProperty('--speaker-x',tail(passive.point));
 $$('#pins [data-object]').forEach(b=>b.classList.toggle('is-speaking',inline&&b.dataset.object===(active.object||active.key)));
 $$('#objects [data-object]').forEach(b=>b.classList.toggle('is-speaking',inline&&b.dataset.object===(active.tool||active.object||active.key)));
}
function close(){stopTrace();if(dialog.open)dialog.close();syncSpeech();const target=focusReturn?.isConnected&&focusReturn!==document.body&&!dialog.contains(focusReturn)?focusReturn:document.querySelector(`#pins [data-object="${speakingObject}"]`)||$('#next');target?.focus({preventScroll:true});}
function modal(title,body,label='LOOK CLOSER',reference=false){
 stopTrace();
 if(!dialog.open||!dialog.contains(document.activeElement))focusReturn=document.activeElement;
 if(dialog.open&&dialog.classList.contains('is-reference')!==reference)dialog.close();
 dialog.classList.toggle('is-reference',reference);
 dialog.classList.toggle('is-architecture',label==='REFERENCE ARCHITECTURE');
 $('#speech-source-row').hidden=reference;
 $('#dialog-actions').innerHTML='';
 const source=StoryInteractions.speechSource(mode,speakingObject);
 const eyebrow=!reference&&[source.name.toLowerCase(),source.kind.toLowerCase()].includes(label.toLowerCase())?'':`<p class="eyebrow">${esc(label)}</p>`;
 $('#dialog-body').innerHTML=`${eyebrow}<h2 id="dialog-title" tabindex="-1">${esc(title)}</h2>${body}`;
 if(!reference){
  for(const group of [...$('#dialog-body').children])if(group.matches('.choices,.actions'))$('#dialog-actions').append(group);
 }
 if(!dialog.open)reference?dialog.showModal():dialog.show();
 syncSpeech();$('#dialog-title').focus({preventScroll:true});dialog.scrollTop=0;$('#dialog-body').scrollTop=0;$('#dialog-actions').scrollTop=0;
 if(!reference)$('.scene-frame').scrollIntoView({block:'start',behavior:'instant'});
}
function button(label,callback,style='primary',detail=''){
 const id='choice-'+(++button.id);button.bindings.push([id,callback]);
 return `<button class="${style}" id="${id}">${detail?`<strong>${esc(label)}</strong><small>${esc(detail)}</small>`:esc(label)}</button>`;
}
button.id=0;button.bindings=[];
function bind(){for(const[id,callback]of button.bindings){const el=document.getElementById(id);if(el)el.onclick=callback;}button.bindings=[];}
function choices(items){return `<div class="choices">${items.map(([title,detail,fn,style])=>button(title,fn,'choice '+(style||''),detail)).join('')}</div>`;}
function show(title,body,label){modal(title,body,label);bind();}
function showReference(title,body,label){modal(title,body,label,true);bind();}
function showReply(event=state().last){
 if(!event)return;
 if(isRefusedShare(event))return showRefusedShare(event);
 if(state().ended&&!state().finished)return showChecks();
 if(event.action==='collect-source'&&stage()==='source'&&state().source)return showSource();
 if(event.action==='add-extension'&&event.kind==='story'&&state().extensionAdded&&!state().delivered)return showExtensionRead(event);
 if(event.action==='inspect-request-source'&&!state().delivered&&!state().paused)return showRequestSource();
 speakingObject=StoryInteractions.eventSource(mode,event.speaker,event.action,event.kind);
 const explanation=teen()?'':event.action==='ask-pass'
  ?productMoment('iai','IBM Agent Identity records that Nova is acting for Priya.')
  :event.action==='open'?productMoment('openshell','NVIDIA OpenShell controls which files and services Nova can reach.'):''; 
 show(event.title,`<p>${esc(event.text)}</p>${explanation}<div class="actions">${button(move()[0],nextMove)}${button('Back to the room',close,'secondary')}</div>`,StoryInteractions.speechSource(mode,speakingObject).kind);
}
function perform(action,payload={}){
 const result=StoryRules.act(state(),mode,action,payload);states[mode]=result.state;selected=null;close();render();ping(result.event?.kind);
 const ev=result.event;
 if(ev?.kind==='blocked'||ev?.kind==='refused'){
  speakingObject=StoryInteractions.eventSource(mode,ev.speaker,ev.action,ev.kind);
 }
 if(isRefusedShare(ev))showRefusedShare(ev);
 else if(ev?.kind==='blocked'||ev?.kind==='refused'){
  const continuation=state().paused?showParent:action==='try-private'?showPrivate:action==='try-extension'?showExtension:nextMove;
  const label=action==='try-private'?(teen()?'Back to Jamie’s message':'Back to the source note'):'Continue';
  show(ev.title,`<p>${esc(ev.text)}</p><div class="actions">${button(state().paused?(teen()?'Talk to my parent':'Ask Priya to review'):label,continuation)}${result.state.last===ev?button(teen()?'See what happened':'Follow this request',openTrace,'secondary'):''}${button('Back to the room',close,'secondary')}</div>`,state().paused?(teen()?'LET’S TALK':'DELIBERATE BYPASS STOPPED'):ev.kind==='refused'?'A PERMISSION CHECK':'ONE THING FIRST');
 }else if(action==='collect-source')showSource();
 else if(action==='inspect-request-source')showRequestSource();
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
 return result;
}
function inventory(){
 const s=state(),e=episode(),items=[];
 if(s.started)items.push(['contact','✉',e.contact,'A contact you already know','Use this on later requests to clarify them independently.']);
 if(s.brief)items.unshift(['brief','▤',teen()?'Assignment card':'Priya’s request',s.pass?'Agreed task':'New request',e.brief]);
 if(s.pass)items.push(['pass','◇',teen()?'Tonight’s plan':'Mission record',s.ended?'Closed':s.paused?'Paused':s.extensionAdded?'Approved addition included':'Current agreement',teen()?`Tonight’s plan: ${s.extensionStatus==='approved'?StoryRules.alexExtra(s).extraApp+' is allowed for the linked museum source only.':'School app and museum website until dinner.'}`:`${s.mission.id} version ${s.mission.version} · records ${s.mission.records.join(', ')}. Customer-owned authority.`]);
 if(s.source)items.push(['source','✎',e.source,teen()?'Page saved for the timeline':'The source actually opened',e.itemSource]);
 if(s.draft)items.push(['draft','▱',e.file,s.delivered?(teen()?'Sent to Ms Patel':'Delivered'):s.caption?'Sourced draft':'Source credit still needed',teen()?'Open the school app to read this version.':'Inspect this version at the CRM workspace.']);
 if(s.evidence.length)items.push(['clue','⌕',teen()?'Teacher’s clarification':'Verified request',s.evidence.includes('contact')?'Known contact checked':'Current record checked',teen()?'Ms Patel suggested the extra source; your parent still decides whether you can open it.':'The optional expansion is genuine, but still needs its own authorized amendment.']);
 if(s.draftReview)items.push(['review-copy','↗',teen()?'Draft sent for feedback':'Review-copy receipt','Version '+s.draftReview.revision,'The first review copy reached '+s.draftReview.to+'. The final file still needs submitting.']);
 if(s.approval&&!s.approval.used)items.push(['approval','✦',s.approval.purpose==='draft-review'?'Review-copy approval':'Final-share approval',`Revision ${s.approval.revision}`,`${e.file} to ${e.to}; current mission and one use.`]);
 if(s.delivered)items.push(['delivery','✓',teen()?'Submission receipt':'Delivery receipt','The agreed file arrived',teen()?'Ms Patel has this copy. You can keep the confirmation in your notebook.':'Keep it with a task note. Delivery is already a completed effect.']);
 if(!teen()&&s.opened)items.push(['vault','⌘','Task credential receipt',s.ended?(s.containment?.credentialRevoked?'Revoked':'Closure still to check'):'This mission only','Vault controls its own credential request. CRM independently enforces business operations.']);
 if(s.notes.length)items.push(['note','▥',teen()?'Reminder':'Sourced task note','Ordinary content',s.notes[0].text]);
 if(s.checks.length===4)items.push(['checklist','☷',teen()?'Ready for dinner':'Closing evidence',teen()?'Project sent · laptop signed out':'Four task outcomes checked',teen()?'Tell your parent you’re done.':'Bring the evidence to finish this task.']);
 return items;
}
function objectName(key){
 const tools=teen()?{source:'Museum website',reviewer:'Ms Patel',outside:'Class group chat'}:{source:'CRM tool',reviewer:'Morgan',outside:'Imported attachment'};
 return tools[key]||episode().objects[OBJECT_KEYS.indexOf(key)];
}
function objectDetail(key){
 const tools=teen()?{source:'Check the dates',reviewer:'School inbox',outside:'Jamie’s forwarded message'}:{source:'Read account records · MCP',reviewer:'Review inbox',outside:'Luca · outside contact'};
 return tools[key]||StoryInteractions.objectStatus(state(),mode,key)||episode().objectDetails?.[OBJECT_KEYS.indexOf(key)]||'';
}
function heldUse(){return selected?StoryInteractions.itemUse(state(),mode,selected):null;}
function targetState(key,pin=false){
 const use=heldUse(),next=move()[2];
 return use?(use.targets.includes(key)?'use-target':''):(key===next||pin&&key===StoryInteractions.speechSource(mode,next).object)?'relevant':'';
}
function targetTag(key,pin=false){return targetState(key,pin)==='use-target'?'Use here':targetState(key,pin)==='relevant'?'Next':'';}
function objectLabel(key,pin=false){return [objectName(key),objectDetail(key),targetTag(key,pin)].filter(Boolean).join(' · ');}
function selectPocket(id){if(dialog.open&&!dialog.classList.contains('is-reference'))close();selected=selected===id?null:id;render();$$('[data-item]').find(b=>b.dataset.item===id)?.focus({preventScroll:true});if(selected)toast(heldUse().instruction);}
function render(){
 const s=state(),e=episode(),m=move(),c=chapter(),use=heldUse();document.body.classList.toggle('agent',!teen());
 $$('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));
 document.title='Trust Boundaries · '+e.title;
 $('#episode-label').textContent=e.eyebrow;$('#episode-title').textContent=e.title;$('#episode-tag').textContent=e.tag;
 $('#chapter-track').innerHTML=e.steps.map((text,i)=>`<span class="${i===c?'current':i<c?'complete':''}"><small>${i<c?'✓':String(i+1).padStart(2,'0')}</small>${esc(text)}</span>`).join('');
 $('#scene-footnote').textContent=use?use.instruction:StoryInteractions.sceneSummary(s,mode);
 $('#place').textContent=e.place;$('#scene-condition').textContent=s.finished?(teen()?'READY FOR DINNER':'CHAPTER COMPLETE'):s.paused?(teen()?'LET’S TALK':'MISSION PAUSED'):s.ended?(teen()?'DINNER TIME':'MISSION REVOKED'):s.delivered?(teen()?'SENT TO MS PATEL':'DELIVERED'):s.message&&!s.verified?'NEW MESSAGE':'';
 const artStep=s.draft?7:0;
 $('#art').innerHTML=roomArt(mode,Math.min(c,2),{step:artStep,hasIncoming:s.message,helperVisible:s.draft,verified:s.verified,delivered:s.delivered,revoked:s.ended,paused:s.paused,hasNote:s.notes.length>0,hasSourceCredit:s.caption,signInRequired:teen()&&s.checks.includes('signin')&&s.containment?.controllerReachable,serviceStillOpen:s.ended&&s.containment&&!s.containment.sessionClosed});
 $('#pins').innerHTML=STORY_PINS[mode].map(([x,y],i)=>i===5&&!s.draft?'':`<button class="pin ${targetState(OBJECT_KEYS[i],true)}" style="left:${x/10}%;top:${y/5.8}%" data-object="${OBJECT_KEYS[i]}" data-tip="${esc([objectName(OBJECT_KEYS[i]),targetTag(OBJECT_KEYS[i],true)].filter(Boolean).join(' · '))}" aria-label="${esc(objectLabel(OBJECT_KEYS[i],true))}">${sceneObjectIcon(OBJECT_KEYS[i],mode)}</button>`).join('');
 const links=STORY_PINS[mode].map(([x,y,tx,ty],i)=>i===5&&!s.draft?'':`<path d="M${x} ${y}L${tx} ${ty}"/>`).join('');
 $('#pins').insertAdjacentHTML('afterbegin',`<svg class="pin-links" viewBox="0 0 1000 580" aria-hidden="true">${links}</svg>`);
 const tools=StoryInteractions.availableTools(s);
 $('#objects').innerHTML=[...OBJECT_KEYS,...tools].map(key=>{
  const detail=objectDetail(key),tag=targetTag(key);
  return `<button data-object="${key}" class="${targetState(key)}${tools.includes(key)?' scene-tool':''}" aria-label="${esc(objectLabel(key))}" ${key==='helper'&&!s.draft?'disabled':''}><b aria-hidden="true">${sceneObjectIcon(key,mode)}</b><span class="object-copy">${esc(objectName(key))}${detail?`<small class="object-detail">${esc(detail)}</small>`:''}${tag?`<small class="next-label">${tag}</small>`:''}</span></button>`;
 }).join('');
 $$('[data-object]').forEach(b=>b.onclick=()=>interact(b.dataset.object));
 const event=storyEvent(s.last)||{speaker:e.name,title:teen()?'The last upload of the day.':'A perfectly ordinary mission.',text:e.actorLine};
 const speech=StoryInteractions.speechSource(mode,StoryInteractions.eventSource(mode,event.speaker,event.action,event.kind));
 $('#speaker').textContent=[speech.name,speech.kind,speech.channel].filter(Boolean).join(' · ');$('#speaker-portrait').textContent=event.speaker==='Nova'?'◉':event.speaker==='Pip'?'✦':event.speaker[0];$('#dialogue-title').textContent=event.title;$('#dialogue-text').textContent=event.text;
 $('#next-title').textContent=m[0];$('#next-text').textContent=m[1];$('#next').textContent=selected?'Put away and continue':s.finished?'See my ending':m[0];
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
function protocolHTML(card){return `<p><b>${esc(card.title)}</b></p><div class="protocol-tags">${card.tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div><p>${esc(card.how)}</p><p><b>Limit:</b> ${esc(card.boundary)}</p><p class="sources">${card.sources.map(id=>`<a href="${PROTOCOL_SOURCES[id].url}" target="_blank" rel="noopener noreferrer">${esc(PROTOCOL_SOURCES[id].name)}</a>`).join(' · ')}</p><p class="small-print">Illustrative mapping. Optional integrations are not claims of native product support. No protocol exchange is sent by this game.</p>`;}
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
 ['map','Product map'],
 ['sequences','Request sequences'],
 ['threats','Threat coverage']
];

function architectureComponentName(id){
 const component=ArchitectureReference.components[id];
 return component.name||productById(component.product).name;
}

function architectureMap(openId){
 const {groups,components}=ArchitectureReference;
 return `<div class="architecture-map">${groups.map(([title,ids])=>`<section class="architecture-group">
  <h3>${esc(title)}</h3><div class="architecture-nodes">${ids.map(id=>{
   const entry=components[id],product=entry.product&&productById(entry.product);
   const sources=product?[[product.sourceLabel||product.name+' reference',product.url]]:entry.sources||[];
   const reference=sources.length?`<p class="sources">${sources.map(([label,url])=>`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)}</a>`).join(' · ')}</p>`:'';
   return `<details class="architecture-node" data-architecture-node="${id}" ${id===openId?'open':''}><summary>
    <strong>${esc(architectureComponentName(id))}</strong><small>${esc(entry.kind)}</small>
   </summary><p>${esc(entry.summary)}</p><p>${esc(entry.detail||product?.limit)}</p>${reference}</details>`;
  }).join('')}</div></section>`).join('')}</div>
  <p class="small-print">This example combines product capabilities with customer integrations. The CRM and current work order supply the business rules.</p><p class="sources"><a href="https://docs.nvidia.com/enterprise-reference-architectures/secure-agent-workspace-reference-design/latest/what-is-secure-agent-workspace.html" target="_blank" rel="noopener noreferrer">NVIDIA Secure Agent Workspace reference design</a></p>`;
}

function architectureFlow(flowId){
 const {flows}=ArchitectureReference,flow=flows[flowId];
 return `<label for="architecture-flow">Choose a request</label>
  <select id="architecture-flow">${Object.entries(flows).map(([id,item])=>`<option value="${id}" ${id===flowId?'selected':''}>${esc(item.title)}</option>`).join('')}</select>
  <p>${esc(flow.premise)}</p><ol class="architecture-steps">${flow.steps.map(([id,text])=>`<li>
   <button class="secondary" data-architecture-component="${id}">${esc(architectureComponentName(id))}</button><p>${esc(text)}</p>
  </li>`).join('')}</ol><div class="receipt"><b>Outcome</b><p>${esc(flow.result)}</p></div>`;
}

function architectureThreats(){
 const {threats,outsideCoverage}=ArchitectureReference;
 return `<p>These examples pair a player choice with the control that responds.</p>
  <div class="architecture-threats">${threats.map(item=>`<details class="product-card"><summary><b>${esc(item.title)}</b></summary>
   <dl><dt>Alex</dt><dd>${esc(item.alex)}</dd><dt>Nova</dt><dd>${esc(item.nova)}</dd><dt>What enforces it</dt><dd>${esc(item.control)}</dd></dl>
   <button class="secondary" data-architecture-flow="${item.flow}">Follow the technical sequence</button>
  </details>`).join('')}</div><p class="small-print">${esc(outsideCoverage)}</p>`;
}

function showArchitecture(view='map',flowId='read',componentId=null,focusControl=false){
 const {flows}=ArchitectureReference;
 if(!flows[flowId])flowId='read';
 const body=view==='sequences'?architectureFlow(flowId):view==='threats'?architectureThreats():architectureMap(componentId);
 showReference('Explore the architecture',
  `<p>See who sets the task, what each product does and where a request is allowed or stopped. Explore in any order.</p>
  <nav class="architecture-nav" aria-label="Architecture sections">${architectureViews.map(([id,label])=>`<button class="secondary" data-architecture-view="${id}" aria-pressed="${id===view}">${label}</button>`).join('')}</nav>
  ${body}<div class="actions">${button('Back to the story',()=>state().started?close():showIntro(),'secondary')}</div>`,
  'REFERENCE ARCHITECTURE');
 $$('[data-architecture-view]').forEach(control=>control.onclick=()=>showArchitecture(control.dataset.architectureView,flowId,null,true));
 $$('[data-architecture-component]').forEach(control=>control.onclick=()=>showArchitecture('map',flowId,control.dataset.architectureComponent));
 $$('[data-architecture-flow]').forEach(control=>control.onclick=()=>showArchitecture('sequences',control.dataset.architectureFlow,null,true));
 const select=$('#architecture-flow');
 if(select)select.onchange=()=>showArchitecture('sequences',select.value,null,true);
 if(componentId){
  const node=$(`[data-architecture-node="${componentId}"] > summary`);
  node?.focus();
 }else if(focusControl){
  (select||$('[data-architecture-view][aria-pressed="true"]'))?.focus({preventScroll:true});
 }
}

function showBuyerGuide(fromEnding=false){
 if(teen())return;
 const cards=NOVA_BUYER_NEEDS.map(need=>`<details class="product-card"><summary><b>${esc(need.question)}</b><span>${esc(need.product)}</span></summary><p>${esc(need.fit)}</p><p>${esc(need.example)}</p><p class="sources">${need.sources.map(([name,url])=>`<a href="${url}" target="_blank" rel="noopener noreferrer">${esc(name)}</a>`).join(' · ')}</p></details>`).join('');
 showReference('Which control do we need?',
  `<p>Choose the problem you need to solve. Each product addresses a different part of Nova’s journey.</p>
   <div class="product-cards">${cards}</div>
   <div class="receipt"><b>Decide who can send a particular report</b><p>Configure this in the customer’s policy and enforce it where the action happens. In this example, Priya’s work order defines the job and CRM checks the actual file and recipient.</p></div>
   <p>For a pilot, try one permitted read, one refused attachment and a sign-out test on the actual CRM route. Check which controls you already have before choosing what to evaluate.</p>
   <div class="actions">${button('Open the technical product map',showProductMap,'secondary')}${button(fromEnding?'Back to Nova’s ending':'Back to the story',fromEnding?showEnding:()=>state().started?close():showIntro())}</div>`,
  'PRODUCT GUIDE');
}
function showProductMap(selectedProduct=''){
 if(teen())return;
 const s=state();
 showReference('Who does what around Nova?',`<p>The sponsor signs in, Nova receives delegated authority, and a broker handles source credentials. The CRM checks the operation at the point of use.</p><ol class="product-flow"><li><b>Human sign-in</b> · IBM Verify or a configured identity provider such as Entra ID or Okta authenticates the sponsor. <a href="https://blog.iamidentity.ai/blog/bring-your-own-idp/" target="_blank" rel="noopener noreferrer">Federation example</a></li><li><b>Agent identity</b> · IBM Agent Identity records Nova’s owner and governs delegated identity. watsonx Orchestrate coordinates the work.</li><li><b>Customer mission</b> · The customer-owned mission service records the sponsor-approved task outside Nova’s prompt, notes and identity registry.</li><li><b>Credential</b> · HashiCorp Vault validates its own audience-bound request and brokers a scoped credential.</li><li><b>Action decision</b> · The trusted CRM PEP observes the real request. The proposed policy decision point evaluates it against current customer mission and resource rules. The CRM binds and enforces the result at execution. OpenShell separately constrains the runtime.</li><li><b>Stop and verify</b> · IBM Verify Antenna can carry SSF/CAEP signals. Configured receivers apply changes and report their own results.</li></ol><div class="receipt"><b>${s.mission?`Nova · ${esc(s.mission.id)} · version ${s.mission.version}`:'No task mission issued yet'}</b><p>${s.ended?'Task mission withdrawn':s.paused?'Mission paused':s.pass?'Scoped delegation active':'Task approval still required'}. This is a fictional case record, not a response from a live identity system.</p></div><div class="product-cards">${NOVA_PRODUCTS.map(p=>productCard(p,p.id===selectedProduct)).join('')}</div><details class="product-card"><summary><b>Two paths to a resource</b><span>Brokered credential or a token intended for that resource</span></summary><p><b>This episode uses the Vault broker path.</b> Vault checks the credential-path request and returns a managed credential. The CRM still checks its own business operations.</p><p><b>A direct OAuth/MCP path is another deployment option.</b> The resource validates a token issued for its own audience and enforces its supported authorization details. A Vault-audience token cannot simply be reused at the CRM. An MCP server must not pass through the client’s token to a downstream service.</p><p><b>Separate Vault flows:</b> Vault Enterprise’s OAuth resource-server path accepts the configured external access token for Vault requests. The classic JWT/OIDC auth method at /auth/jwt/login instead exchanges a login credential for a Vault token. They are not interchangeable.</p><p class="sources"><a href="https://developer.hashicorp.com/vault/api-docs/system/config-oauth-resource-server" target="_blank" rel="noopener noreferrer">Vault OAuth resource server</a> · <a href="https://docs.hashicorp.com/vault/ai/iam/providers/verify" target="_blank" rel="noopener noreferrer">IBM Verify configuration for Vault</a> · <a href="${PROTOCOL_SOURCES.mcp.url}" target="_blank" rel="noopener noreferrer">MCP authorization</a></p></details><details class="product-card"><summary><b>What this example assumes</b><span>Configuration and receiver actions still need implementation</span></summary><p>Nova and its human sponsor are registered and mapped. The customer mission service, resource-side PEP and external policy decision point are proposed integrations. Their contracts, deployment and trusted evidence require implementation and validation. AuthZEN is a candidate PEP/PDP interface; approval-required workflow and execution binding are explicitly application extensions. The task uses customer-defined policy. Vault has the appropriate Enterprise feature, OAuth validation profile, Agent Registry record and secrets-engine role. Agent Identity and Vault keep separate registries; reconciliation requires configured integration.</p><p>OpenShell is an illustrative runtime choice alongside the orchestration layer. Antenna receivers need the correct APIs, event mapping and processors for each target. No universal instantaneous kill switch or automatic registry mirroring is implied.</p><p>The simulation binds approvals to document revision, recipient, actor, records, mission and policy version, story approval window, session generation and single use. Production integrity, authenticated PEP evidence, cryptographic content binding and transaction guarantees still require implementation. Runtime stops, lease revocation, service sign-out and queued-operation reconciliation need separate checks. These fictional receipts do not validate a production deployment.</p></details><div class="actions">${button('Which control do we need?',()=>showBuyerGuide(),'secondary')}${button('Inspect the Vault credential path',showCredential,'secondary')}${button('Back to the story',()=>s.started?close():showIntro())}</div><p class="small-print">Example deployment with source-linked product roles. Connections and receiver actions require configuration. All game decisions and receipts are scripted locally.</p>`,'NOVA · PRODUCTS, PROTOCOLS AND ENFORCEMENT');
}
function showCredential(){
 if(teen())return;
 const s=state();
 showReference('What does Vault actually release?',`<p>IBM Agent Identity supplies the delegated identity context. HashiCorp Vault validates the request to its own credential path. The CRM authorizes the later business operation separately.</p><div class="receipt"><b>${s.opened?'Illustrative credential receipt':'Preview of the configured credential path'}</b><p>${s.ended?'The closing checklist must confirm configured Vault token/lease revocation and CRM session termination independently.':s.opened?'A scoped, short-lived credential is modeled for the approved CRM path.':'Open the approved runtime path before a credential is modeled in the story.'}</p><p>No secret, password or usable token is displayed or generated.</p></div><p><b>Vault access:</b> human baseline ACL ∩ agent OBO ceiling ∩ supported RAR restrictions. The example uses the documented <code>vault:path_access</code> authorization type to read a configured credential role.</p><p><b>CRM access:</b> the customer’s resource policy restricts the currently approved records and checks the exact send. The read-only credential is used only for source data. Report delivery uses a separate CRM sharing endpoint under delegated identity, current resource policy and exact human approval; it does not upgrade or reuse the read credential.</p><details class="product-card"><summary><b>Inspect illustrative fields</b><span>Unsigned example data; not a live token or deployable configuration</span></summary><pre class="product-example">${esc(JSON.stringify({...NOVA_VAULT_EXAMPLE,source_read_check:{...NOVA_VAULT_EXAMPLE.source_read_check,records:s.mission?StoryRules.reportRecords(s):['123','456']}},null,2))}</pre></details><p class="sources"><a href="https://docs.hashicorp.com/vault/ai/iam/providers/verify" target="_blank" rel="noopener noreferrer">Configure IBM Verify for Vault</a> · <a href="https://developer.hashicorp.com/vault/api-docs/system/config-oauth-resource-server" target="_blank" rel="noopener noreferrer">OAuth resource-server requirements</a> · <a href="${PROTOCOL_SOURCES.leases.url}" target="_blank" rel="noopener noreferrer">Vault lease lifecycle</a></p><div class="actions">${button('Who does what?',()=>showProductMap('vault'),'secondary')}${button('Back to the story',()=>s.started?close():showIntro())}</div>`,'IBM AGENT IDENTITY + HASHICORP VAULT');
}

function nextMove(){if(selected){selected=null;render();}switch(stage()){case'intro':return showIntro();case'request':return showBrief();case'permission':case'dinner':case'finish':return showParent();case'approval':return showFinalApproval();case'paused':return state().reviewPending?perform('resolve-review'):showParent();case'open':return showWorkspace();case'draft-approval':case'draft-send':return showDraftReview();case'draft':return perform('prepare');case'source':return state().source?perform('attach-source',{source:'original'}):teen()?perform('collect-source'):showSourceTool();case'proof':return showDraft();case'changes':return showChanges();case'send':return showSend();case'checks':return showChecks();case'ending':return showEnding();}}
function interact(key){speakingObject=key;if(!state().started)return showIntro();if(selected)return useItem(key);if(stage()==='checks'&&key===move()[2])return showChecks();if(!teen()&&key==='brief'&&['draft-approval','approval'].includes(stage()))return showReviewer();return ({parent:showParent,phone:showPhone,laptop:showLaptop,brief:showBrief,notebook:showNotebook,helper:showHelper,source:showSourceTool,reviewer:showReviewer,outside:showPrivate,changes:showChanges})[StoryInteractions.objectView(state(),mode,key)]?.();}
function useItem(key){
 const use=heldUse();
 if(!use?.targets.includes(key)){toast(use?.instruction||'Choose an item first.');return;}
 selected=null;render();
 if(use.route==='action')return perform(use.action,use.action==='attach-source'?{source:'original'}:{});
 return ({parent:showParent,credential:showCredential,draft:showDraft,send:showSend,draftReview:showDraftReview,helper:showHelper,changes:showChanges})[use.routes?.[key]||use.route]?.();
}

function showIntro(){const e=episode();showReference(e.title,`<p class="tagline">${esc(e.tag)}</p><p>${esc(e.intro)}</p><div class="intro-facts"><span>${teen()?'Start with an unfinished project':'Start with a fresh request'}</span><span>${teen()?'Choose what to add':'Choose how the job grows'}</span><span>No countdown</span><span>Saved as you play</span></div>${choices([[teen()?'Step into Alex’s room':'Enter Nova’s workspace','Read the new request and agree on a plan.',()=>perform('begin'),'good'],['How to play','A few controls, then into the story.',showGuide],['Explore architecture','Browse products, request sequences and threats.',()=>showArchitecture()],...(!teen()?[['Compare products','Find which control solves your problem.',()=>showBuyerGuide()]]:[])])}<p class="small-print">Fictional story. No real messages, accounts or security services are connected.</p>`,e.eyebrow);}
function showBrief(){speakingObject='brief';if(!state().started)return showIntro();if(!state().brief)perform('read-brief');const s=state(),e=episode();show(e.briefTitle,`<div class="paper"><p class="eyebrow">${s.pass?'THE TASK YOU AGREED':'A NEW REQUEST'}</p><h3>${esc(e.briefTitle)}</h3><p>${esc(e.brief)}</p></div>${s.mission?`<p>${teen()?'Your current app agreement':'Customer mission '+esc(s.mission.id)} · ${teen()?'version':'mission version'} ${s.mission.version}. ${s.extensionStatus==='approved'?(teen()?'Your parent also agreed to '+StoryRules.alexExtra(s).extraAgreement+'.':'Alder Books has been added.'):''}</p>`:`<p>${teen()?'You have not agreed on phone apps for this homework yet.':'No task mission or tool access has been issued yet.'}</p>`}<div class="actions">${button(s.pass?'Back to my next step':teen()?'Ask about the apps I need':'Talk to Priya about the handover',s.pass?nextMove:showParent)}${button('Back to the room',close,'secondary')}</div>`,teen()?'TEACHER’S ASSIGNMENT':'SPONSOR’S REQUEST');}
function showParent(){speakingObject='parent';
 const s=state(),e=episode();if(s.finished)return showEnding();if(!s.brief)return showBrief();
 if(s.paused)return show(teen()?'“Tell me what happened.”':'Review the stopped bypass.',`<p>${s.reviewPending?(teen()?'Your parent listens while you explain why you tried the other account. Wait for their answer.':'The current mission and deliberate bypass are attached. Access stays paused pending the matching reply.'):(teen()?'The school refused the private notes, then you tried another account anyway. Explain the detour so you can finish your own project.':'The resource refusal was expected; the deliberate bypass caused the pause. Review can resume the current task without widening it.')}</p>${choices([[s.reviewPending?(teen()?'Hear my parent’s answer':'Hear from Priya'):(teen()?'Explain and ask to continue my own project':'Request review of the current mission'),teen()?'You’re asking to finish your own timeline.':'The task limits remain in force.',()=>perform(s.reviewPending?'resolve-review':'review'),'good'],['Back to the room','The pause stays in place.',close]])}`,teen()?'TALK IT THROUGH':'INDEPENDENT REVIEW');
 if(!s.pass)return show(teen()?'“Which apps does the project need?”':'“Let’s agree on the job.”',`<p>${teen()?'You need the school app for your timeline and the Riverside Museum website to check the dates. Your parent is chopping vegetables.':'“Start with Harbor Bikes and Pine Studio,” Priya says. “Morgan needs one page for tomorrow.”'}</p>${choices([[teen()?'School app and museum website until dinner':'Agree on the two accounts',e.agreement,()=>perform('ask-pass',{scope:'task'}),'good'],['Read the request again','Keep the requested work and access aligned.',showBrief]])}`,e.authority);
 if(s.ended){if(s.checks.length<4)return showChecks();return show(teen()?'“What’s finished?”':'Review this task’s outcome.',`<p>${teen()?'“Sent to Ms Patel, signed out of the laptop, and phone put away,” you say. “Can I set the table?”':'The approved report arrived. This task’s authority, credential, session, workload and queue have their own evidence.'}</p>${choices([[teen()?'Finish the evening':'Finish this mission',teen()?'Put the laptop away and head to the table.':'No future task is authorized by closing this one.',()=>perform('finish'),'good']])}`,e.authority);}
 if(s.delivered)return show(teen()?'“Dinner is ready.”':'“Morgan has the handover. Let’s close the task.”',`<p>${teen()?'You can jot down that the project is sent. Then sign out of the school tab and join your parent for dinner.':'You can keep a sourced note or queue a receipt-only follow-up. Then close the mission and the service session opened at the start.'}</p>${s.queueScheduled?'<div class="receipt"><b>One chosen follow-up is waiting</b><p>It has no attachment. Check or cancel it when closing the task.</p></div>':''}${choices([[teen()?'Put my phone away and finish up':'Close this mission',teen()?'Check the family laptop before heading to dinner.':'Check which connections still work after the job stops.',()=>perform('close-pass'),'good'],...(!s.queueScheduled&&!teen()?[[teen()?'Schedule a reminder for my teacher':'Queue one receipt follow-up','Optional, same recipient, no attachment. It will be visible in the closing checks.',()=>perform('schedule-followup')]]:[]),...(!s.notes.length?[[teen()?'Keep a note for tomorrow':'Save sourced task context',teen()?'Keep the submission receipt with a short note.':'Optional. Keep delivery provenance with the task note.',()=>perform('write-note')]]:[])])}${teen()&&!s.queueScheduled?`<details class="debrief"><summary>Optional: what if a message is still waiting?</summary><p>This extra example queues a receipt-only follow-up, so you can see why a waiting send needs its own closing check.</p><div class="actions">${button('Try a waiting-message example',()=>perform('schedule-followup'),'secondary')}</div></details>`:''}`,e.authority);
 if(stage()==='draft-approval')return showDraftReview();
 if(stage()==='approval')return showFinalApproval();
 show(teen()?'“How is the timeline going?”':'“How is the briefing coming along?”',`<p>${teen()?'“How’s the timeline going? You’ve got the school app and museum website. If Ms Patel suggests another source, come and ask.”':'The active customer mission covers '+esc(s.mission.records.join(', '))+'. New work can fit that scope, need an amendment, or remain prohibited by resource policy.'}</p><div class="actions">${button(teen()?'Back to my timeline':'Continue the task',nextMove)}${button(teen()?'Read tonight’s plan':'Inspect the agreement',showBrief,'secondary')}</div>`,e.authority);
}
function showFinalApproval(){
 const s=state(),e=episode();
 speakingObject='reviewer';
 show('Ask Morgan to approve the final copy.',`<div class="receipt"><b>${esc(e.file)} · revision ${s.fileRevision}</b><p class="address">${esc(e.to)}</p><p>${esc(customerNames(StoryRules.reportRecords(s)))} · summary only</p></div>${choices([
  ['Ask Morgan to approve this copy','Morgan approves a particular file and destination.',()=>perform('approve'),'good'],
  ['Inspect the report again','Check its current content and sources.',showDraft]
 ])}`);
}
function showWorkspace(){
 speakingObject=teen()?'laptop':'phone';
 const s=state();
 if(s.ended)return showChecks();
 if(!s.pass)return showParent();
 if(s.opened)return showDraft();
 show(teen()?'Sign in on the family laptop.':'Open Nova’s workspace.',
  `<p>${teen()?'The school app opens your timeline on this laptop. It remembers the laptop for quick sign-in. When you’re done, you’ll turn that off and sign out.':'OpenShell starts a workspace for this job. When Nova needs account updates, its MCP client sends a request through the configured gateway.'}</p>${choices([
   [teen()?'Sign in and open my project':'Open the workspace',teen()?'Open the school app on the laptop.':'The workspace and CRM session are checked separately when the task closes.',()=>perform('open'),'good']
  ])}`,teen()?'FAMILY LAPTOP':'TASK WORKSPACE');
}
function showPhone(){
 if(!teen()&&!state().opened)return showWorkspace();
 speakingObject='phone';
 const s=state();
 if(s.ended)return showChecks();
 if(teen()&&s.message&&!s.delivered)return showChanges();
 show(teen()?'Homework mode is on.':'The task workspace is open.',
  `<p>${teen()?'You can read school messages on this phone. Your project is on the family laptop.':'OpenShell gives Nova a place to work. The places Nova can reach and the actions each service permits are checked separately.'}</p><div class="actions">${button(teen()?'Go to the family laptop':'Open the current draft',s.opened?showDraft:showWorkspace)}</div>`);
}
function showLaptop(){
 const s=state();
 if(s.ended)return showChecks();
 if(!s.opened)return showWorkspace();
 if(stage()==='source')return showSourceTool();
 return stage()==='send'?showSend():showDraft();
}
function showSourceTool(){
 const s=state();
 if(s.source&&!s.ended)return showSource();
 speakingObject='source';
 const active=s.opened&&!s.ended&&!s.delivered&&s.draft;
 if(!teen()&&active)return showCrmRead();
 show(teen()?'Riverside Museum website':'Look up the account updates',
  `<p>${s.ended?'This task is closed.':teen()?'Use the museum’s railway page to check the three dates before you credit it in your timeline.':'Prepare your outline before requesting customer records.'}</p><div class="actions">${active?button('Open the museum page',()=>perform('collect-source')):''}${button('Back to the room',close,'secondary')}</div>`);
}
function showCrmRead(action='collect-source'){
 const first=action==='collect-source';
 speakingObject=first?'source':'extra';
 const records=first?'Harbor Bikes and Pine Studio':'Alder Books';
 const steps=[
  ['Nova’s MCP client','Sends the call from OpenShell.'],
  ['MCP gateway','Checks and forwards the call.'],
  ['CRM MCP server','Runs the tool by calling CRM.'],
  ['Customer records (CRM)','Checks which records it can return.']
 ];
 show('Request '+records,
  `<p>Nova’s workspace sends this request through four steps.</p><ol class="tool-route" aria-label="CRM request route">${steps.map(([name,detail])=>`<li><b>${esc(name)}</b><span>${esc(detail)}</span></li>`).join('')}</ol><div class="actions">${button(first?'Request the two records':'Request Alder Books',()=>perform(action))}${button(first?'Back to the draft':'Back to the optional request',first?showDraft:()=>showExtension(),'secondary')}</div>`);
}

function showReviewer(){
 const s=state();
 if(stage()==='approval')return showFinalApproval();
 if(!s.message)return showDraftReview();
 speakingObject='reviewer';
 show(teen()?'Ms Patel’s school inbox':'Morgan’s review inbox',
  `<p>${s.feedbackLegacy?'Here is the feedback saved with the draft.':teen()?'“I read your draft. You could end with a sentence about what changed.”':'“I read your draft. Could you make the opening a little shorter?”'}</p><div class="actions">${!s.delivered?button(teen()?'Read the feedback on my draft':'Read Morgan’s feedback',showMinor):''}${button('Back to the room',close,'secondary')}</div>`);
}

function productMoment(id,text){
 const product=productById(id);
 return `<details class="product-moment"><summary>${esc(text)}</summary><p>${esc(product.role)}</p><p class="sources"><a href="${product.url}" target="_blank" rel="noopener noreferrer">${esc(product.name)} documentation</a></p></details>`;
}
function showSource(){
 const s=state(),e=episode();
 if(!s.source||s.ended)return showDraft();
 speakingObject='source';
 const lines=teen()?e.draftLines:e.draftLines.slice(1,3);
 const note=teen()?'':productMoment('vault','In this example, Vault supplies short-lived access for reading these records. The customer records app checks which accounts Nova may open.');
 show(teen()?'The museum page confirms your dates.':'CRM returned the two approved records.',
  `<div class="paper"><h3>${teen()?'Riverside Museum · The railway comes to town':'Customer records for tomorrow’s meeting'}</h3>${lines.map(line=>`<p>${esc(line)}</p>`).join('')}</div>${note}${choices([
   ...(!s.caption&&!s.delivered?[['Add this source',teen()?'Put the museum page title under your timeline.':'Credit Harbor Bikes and Pine Studio below the handover.',()=>perform('attach-source',{source:'original'}),'good']]:[]),
   [s.delivered?'See the delivery receipt':'Back to the draft','',s.delivered?showDelivery:showDraft],
   ...(!teen()&&s.last?.action==='collect-source'?[['Follow the CRM request','See which services handled the read.',openTrace]]:[])
  ])}`,teen()?'MUSEUM WEBSITE':'CRM');
}

function showDraft(){speakingObject='laptop';const s=state(),e=episode();if(!s.pass)return showParent();if(!s.opened)return showWorkspace();if(s.ended)return showChecks();
 let lines=!s.draft?[]:!teen()&&!s.source?['Harbor Bikes · Waiting for the customer record.','Pine Studio · Waiting for the customer record.']:e.draftLines;
 if(!teen()&&s.source&&s.minorChoice==='added')lines=[e.minorAddition,...e.draftLines.slice(1)];
 const paper=`<div class="paper"><p class="eyebrow">${esc(e.previewLabel)}${s.draft?' · '+(teen()?'VERSION':'REVISION')+' '+s.fileRevision:''}</p><h3>${!s.draft?'An empty document':esc(s.extensionAdded&&!teen()?'Tomorrow’s customer handover · three accounts':s.proof?e.draftTitle:teen()?'Train Stuff':e.draftTitle)}</h3>${lines.map(line=>`<p>${esc(line)}</p>`).join('')}${s.minorChoice==='added'&&teen()?`<p class="draft-addition">${esc(e.minorAddition)}</p>`:''}${s.extensionAdded?`${teen()&&s.extraSource==='museum-photo'?`<figure class="archive-photo"><svg viewBox="0 0 460 180" role="img" aria-label="Fictional archive illustration of the old railway station"><rect width="460" height="180" fill="#bfc5bf"/><path d="M0 128L460 122L460 180L0 180Z" fill="#a8a28f"/><path d="M90 93L202 28L322 91Z" fill="#665e59"/><path d="M111 89L111 139L301 136L301 87Z" fill="#d7cbb0"/><path d="M128 99H158V119H128ZM244 98H275V118H244Z" fill="#646c6c"/><path d="M187 96H222V138H187Z" fill="#726859"/><path d="M0 156L460 147M0 168L460 158" stroke="#645e58" stroke-width="4"/><circle cx="205" cy="72" r="10" fill="#ede3cb"/><path d="M205 65V72L210 75" fill="none" stroke="#665e59" stroke-width="2"/></svg><figcaption>Riverside Museum · station collection · fictional archive image</figcaption></figure>`:''}<p class="draft-addition">${esc(e.extensionAddition)}</p>`:''}${s.draft?`<p class="source-line ${s.caption?'':'missing'}">${s.caption?esc(s.extensionAdded&&!teen()?'Source: Customer records · '+customerNames(StoryRules.reportRecords(s)):e.caption):'Source credit: still to add'}</p>`:`<p>${teen()?'Start with your notes and put the first three dates on the page.':'Start with the report outline. The customer extract has not been read yet.'}</p>`}</div>`;
 let options=[];
 if(!s.draft)options=[[teen()?'Build the timeline from my notes':'Create the report outline',teen()?'Put the three railway dates on the page.':'Prepare headings for the two requested customers.',()=>perform('prepare'),'good']];
 else if(!s.source)options=[[teen()?'Open the museum website':'Request customer records','Use the source covered by the agreed task.',teen()?()=>perform('collect-source'):showSourceTool,'good']];
 else if(!s.caption)options=[['Add this source',teen()?'Put the page title beneath the timeline.':'A source credit completes the first sourced draft.',()=>perform('attach-source',{source:'original'}),'good']];
 else if(!s.message)options=[[teen()?'Send this draft for teacher feedback':'Prepare the review-copy share','The first copy goes to the agreed recipient. Final submission follows the feedback.',showDraftReview,'good']];
 else if(!StoryRules.changesResolved(s))options=[['Read the new requests',teen()?'Read Ms Patel’s feedback and Jamie’s message.':'Decide which changes fit, need an amendment, or stay out.',showChanges,'good']];
 else if(!s.proof)options=[[teen()?'Read this version myself':'Check this report myself','Review the content, source and destination.',()=>perform('proof-self'),'good'],[teen()?'Ask Sam to proofread this version':'Ask Pip to format this report',teen()?'Send Sam the timeline, without sharing your login.':'The helper sees only this file.',showHelper]];
 else if(!s.delivered)options=[[teen()?'Preview my school submission':'Show the approver this report',teen()?'Submit your own homework through the school app.':'Confidential business sharing needs the designated approval.',teen()?showSend:showParent,'good']];
 else options=[[teen()?'Finish up for dinner':'Close out the task','The delivered file stays delivered.',showParent,'good']];
 show(teen()?'The project on your desk.':'The briefing in your workspace.',paper+choices(options)+(s.draft&&!s.delivered&&!(s.message&&StoryRules.changesResolved(s)&&!s.proof)?`<div class="actions">${button(teen()?'Talk to Sam about the draft':'Talk to Pip about formatting',showHelper,'secondary')}</div>`:''),teen()?'SCHOOL WORKSPACE':'CRM WORKSPACE');
}
function changeStatus(which){const s=state();if(teen())return which==='minor'?(s.minorChoice?s.minorChoice==='added'?'Closing sentence added':'Original wording kept':'New suggestion'):which==='extension'?(s.extensionAdded?(s.extraSource==='museum-photo'?'Photo added':'Video detail added'):s.extensionOmitted?'Allowed, left unopened':s.extensionStatus==='declined'?'Extra source left out':s.extensionStatus==='approved'?'Parent said yes':s.extensionStatus==='pending'?'Waiting for my parent':'New suggestion'):(s.privateResolved?'Group’s private notes left out':'Jamie’s request');return which==='minor'?(s.minorChoice?'Settled':'New request'):which==='extension'?(s.extensionAdded?'Added with permission':s.extensionOmitted?'Approved, left unused':s.extensionStatus==='declined'?'Left out':s.extensionStatus==='approved'?'Approved · collect the addition':s.extensionStatus==='pending'?'Reply pending':'New request'):(s.privateResolved?'Private notes left out':'New request');}
function showChanges(){speakingObject=teen()?'phone':'brief';
 const s=state(),e=episode();if(!s.message)return showDraftReview();
 const cards=StoryInteractions.feedbackCards(s,mode),answered=cards.filter(c=>c.done).length,pending=cards.filter(c=>!c.done);
 const handlers={minor:showMinor,extension:showExtension,private:showPrivate};
 const senders={minor:teen()?'Ms Patel · feedback':'Morgan · draft feedback',extension:teen()?'Ms Patel · optional source':'Priya · account update',private:e.sender};
 const intro=s.feedbackLegacy?'These saved requests and your earlier choices are preserved. This older route did not record a first draft send.':teen()?`Your teacher replied after receiving draft version ${s.draftReview.revision}. Jamie forwards a request for private notes from the class group chat.`:`Morgan replied to revision ${s.draftReview.revision}. Priya sent an update. Luca uploaded a document with an extra instruction.`;
 const results=cards.filter(c=>c.done).map(card=>`<details class="change-card settled" data-request="${card.key}"><summary>✓ ${esc(card.status)}</summary><p>${esc(card.summary)}</p>${button(card.button,handlers[card.key],'quiet')}</details>`).join('');
 const reference=`<details class="debrief"><summary>${teen()?'Check the source of a request':'Check the source or work order'}</summary><div class="actions">${s.evidence.length?button(teen()?'Read the teacher’s clarification':'Read the verified clarification',()=>showClarification(s.evidence.includes('contact')?'verify-contact':'verify-portal'),'secondary'):button(teen()?'Check with my teacher':'Verify the sponsor’s request',showVerification,'secondary')}${!teen()?button('Read Priya’s work order',showBrief,'secondary'):''}</div></details>`;
 const response=pending.length?choices(pending.map(card=>[card.button,senders[card.key],handlers[card.key],''])):`<div class="actions">${button(teen()?'Review my updated project':'Review the updated briefing',showDraft)}${button('Back to the room',close,'secondary')}</div>`;
 show(teen()?'Replies to your draft.':'Feedback on the review copy.',`<p>${esc(answered===3?'You have answered all three requests. Review this version before final delivery.':intro)}</p><div class="request-progress compact"><b>${answered} of 3 decisions made</b><span>${answered===3?'Ready for final review':'Choose a response below'}</span></div>${results}${reference}${response}`,'FEEDBACK & NEW REQUESTS');
}

function showClarification(action=state().last?.action){
 const portal=action==='verify-portal';
 speakingObject=portal?(teen()?'laptop':'brief'):(teen()?'reviewer':'sponsorMessage');
 const text=teen()
  ?(portal?'The assignment asks for your own railway timeline and a source credit. Ms Patel’s video is an optional suggestion.':'“The video is just an idea. Ask your parent if you want to watch it. I only need your own timeline.”')
  :(portal?'The current work order shows which customer records are approved. A suggestion about Alder Books does not change that list.':'“Yes, Alder Books may join. Ask to add that account before you request its record.”');
 show(teen()?(portal?'Open the assignment in the school app.':'Ms Patel replies to your check.'):(portal?'Check Priya’s work order.':'Priya confirms the request.'),
  `<p>${esc(text)}</p><div class="actions">${button('Back to the requests',showChanges)}</div>`);
}
function showDecisionResult(event){
 speakingObject=StoryInteractions.eventSource(mode,event.speaker,event.action,event.kind);
 show(event.title,`<p>${esc(event.text)}</p><div class="actions">${button('Back to the other requests',showChanges)}</div>`);
}
function showExtensionRead(event){
 speakingObject='extra';
 const title=teen()?state().extraSource==='museum-photo'?'The museum photo is in your timeline.':'YouTube · Our station’s story':'Alder Books · account update';
 show(title,`<p>${esc(event.text)}</p><div class="actions">${button('Back to the other requests',showChanges)}${button(teen()?'See what happened':'Follow this request',openTrace,'secondary')}</div>`);
}
function showDraftReview(){speakingObject='laptop';
 const s=state(),e=episode();if(!s.caption)return showDraft();if(s.message)return showChanges();
 const a=s.approval,matched=!teen()&&a?.purpose==='draft-review'&&!a.used;
 if(!teen()&&!matched)speakingObject='reviewer';
 const title=teen()?'Send a first draft for feedback.':matched?'Send the draft Morgan approved.':'Ask Morgan to approve the draft.';
 const lines=e.draftLines;
 show(title,`<p>${teen()?'Your teacher has not seen this file yet. This sends a draft for feedback; you will submit the final version after responding to the replies.':matched?'Morgan approved this copy for the work inbox. The final copy will get its own approval.':'Send Morgan an approval request for this exact file and destination.'}</p>${!teen()&&!matched?productMoment('verify','A configured IBM Verify prompt can ask Morgan to confirm on a separate device. CRM checks the exact send.'):''}<div class="paper"><p class="eyebrow">REVIEW COPY · ${teen()?'VERSION':'REVISION'} ${s.fileRevision}</p><h3>${esc(teen()&&!s.proof?'Train Stuff':e.draftTitle)}</h3>${lines.map(line=>`<p>${esc(line)}</p>`).join('')}<p class="source-line">${esc(e.caption)}</p></div><div class="receipt"><b>${esc(e.file)} · ${s.fileRevision}</b><p class="address">${esc(e.to)}</p><p>${teen()?'Your own timeline, with its museum source.':esc(customerNames(StoryRules.reportRecords(s)))+' · Summary only'}</p>${matched?`<p>Recorded one-use review-copy approval · revision ${a.revision}</p>`:''}</div>${choices([[teen()?'Send draft to my teacher':matched?'Send the approved review copy':'Ask Morgan to approve this draft',teen()?'Send it to Ms Patel in the school app.':matched?'The CRM checks this draft, records, recipient and current authority.':'Morgan sees the exact draft and its destination.',()=>perform(teen()||matched?'send-draft':'approve-draft'),'good'],['Back to the draft','Nothing is sent by opening this preview.',showDraft]])}`,teen()?'FIRST DRAFT · NOT FINAL SUBMISSION':'FIRST CONFIDENTIAL SHARE');
}
function showDraftReceipt(){speakingObject='laptop';const s=state(),r=s.draftReview;show(teen()?'Your teacher has the draft.':'Morgan has the draft.',`<div class="receipt"><b>${esc(r.file)} · ${teen()?'version':'revision'} ${r.revision} sent for feedback</b><p class="address">${esc(r.to)}</p><p>${teen()?'The school app confirms draft delivery.':'The CRM confirms this exact, approved review copy. The one-use approval is consumed.'}</p></div><p>${teen()?'A little later, Ms Patel reads it and replies in the school inbox. Jamie forwards a message from the class chat. You’ll submit the final copy when you’re ready.':'Morgan asks for a shorter introduction. Priya sends news about one more account. An attachment uploaded by Luca also turns up in Customer records.'}</p><div class="actions">${button(teen()?'Read the replies on my phone':'Read the new messages',showChanges)}${button('Back to the room',close,'secondary')}</div>`,'DRAFT DELIVERY CONFIRMED');}
function showHelperResult(){speakingObject='helper';const s=state();show(teen()?'Sam has read this version.':'Pip has formatted this version.',`<p>${esc(s.last.text)}</p><p>${teen()?'Sam stays in the room. You can ask about the file again. If you edit it later, check the changed version before sending.':'Pip’s file-only task is complete. Later changes invalidate this review and any older share approval.'}</p><div class="actions">${button(move()[0],nextMove)}${button('Back to the room',close,'secondary')}</div>`,teen()?'SAM · PROOFREADING':'PIP · REPORT-ONLY HELP');}

function showVerification(fromExtension=false){fromExtension=fromExtension===true;speakingObject=teen()?'phone':'brief';show(teen()?'Check what the teacher actually asked.':'Did Priya ask for Alder Books?',`<p>${teen()?'Open your saved conversation with Ms Patel, or check the assignment in the school app. Does she want another source, or is it just a suggestion? Jamie’s message is separate.':'Check whether Priya really asked to add Alder Books. Her saved contact and current work order are separate from the incoming message.'}</p>${choices([[teen()?'Message Ms Patel':'Use Priya’s saved contact',teen()?'Use the teacher conversation already saved on your phone.':'Open the conversation saved before this message arrived.',()=>perform('verify-contact',{fromExtension}),'good'],[teen()?'Open the current school assignment':'Check Priya’s current work order','Open the work order already saved for this handover.',()=>perform('verify-portal',{fromExtension})]])}`,teen()?'ASK YOUR TEACHER':'TWO INDEPENDENT ROUTES');}
function showMinor(){speakingObject='reviewer';const e=episode();show(e.minorTitle,`<p>${esc(e.minorText)}</p><p>${state().minorChoice?(state().minorChoice==='added'?'The edit is currently included. You can keep it or return to the earlier wording.':'You kept the earlier wording. You can still choose the edit before submitting.'):'Choose the wording that fits this version.'}</p><p>${teen()?'You already have the dates and source. You can write this sentence without opening anything else.':'This changes the document within the current mission. It does not add records or change the reviewer.'}</p>${choices([[state().minorChoice==='added'?(teen()?'Keep the closing sentence':'Keep the shorter introduction'):(teen()?'Add the closing sentence':'Shorten the introduction'),teen()?'Use your existing notes and museum page.':'Morgan gets a shorter introduction for the same handover.',()=>perform('apply-minor'),'good'],[state().minorChoice==='added'?(teen()?'Remove the extra sentence':'Use the earlier introduction'):'Keep the existing wording','This small edit is optional.',()=>perform('keep-minor')],['Back to the requests','No change yet.',showChanges]])}`,'A SMALL EDIT');}
function extensionDescription(){const s=state(),e=episode();if(teen()){
 if(s.extensionOmitted)return 'Your parent said yes, but you left the '+e.extraNoun+' unopened. Your timeline works without it.';
 if(s.extensionAdded)return s.extraSource==='museum-photo'?'The station photo is in your timeline, with its credit.':'You used one detail from the museum’s YouTube video and credited it beneath the timeline.';
 if(s.extensionStatus==='approved')return s.extraSource==='museum-photo'?'Your parent said yes to the museum photo app. You can open the photo now.':'“That museum video, then back to the timeline.” Your parent has allowed the linked video until dinner. Other videos and recommendations stay blocked.';
 if(s.extensionStatus==='pending')return 'You show your parent Ms Patel’s link and ask if you can '+e.extraInstruction+'. They look up from making dinner to read it.';
 if(s.extensionStatus==='declined')return 'You decided the timeline has enough detail without the '+e.extraNoun+'.';
 return e.extensionText;
 }if(s.extensionOmitted)return 'Priya said yes, but Nova kept the handover to the original two accounts.';if(s.extensionAdded)return 'Alder Books has its own update and source in the handover.';if(s.extensionStatus==='approved')return 'Priya said yes to Alder Books. You can request its record now.';if(s.extensionStatus==='pending')return 'You asked Priya to add Alder Books. Nova can keep working on the original two accounts until she replies.';if(s.extensionStatus==='declined')return 'You chose to finish the two-customer briefing without an expansion.';return e.extensionText;}
function showExtension(verification=null){
 const s=state(),e=episode();
 if(!s.message)return showDraft();
 speakingObject=s.extensionAdded?'extra':teen()?(['pending','approved'].includes(s.extensionStatus)?'parent':'reviewer'):'sponsorMessage';
 if(verification?.action==='verify-portal')speakingObject=teen()?'laptop':'brief';
 let options;
 const watch=teen()?(s.extraSource==='museum-photo'?'Open the museum photo app':'Watch the museum video on YouTube'):'';
 if(s.extensionStatus==='pending')options=[[teen()?'Hear my parent’s answer':'Read Priya’s reply',teen()?'You asked about this one museum source.':'The original two accounts are still the only ones open.',()=>perform('resolve-extension'),'good'],[teen()?'Finish without the '+e.extraNoun:'Keep the two-customer briefing',teen()?'You can leave this optional source out.':'Withdraw this optional request without expanding scope.',()=>perform('decline-extension')]];
 else if(s.extensionStatus==='approved'&&!s.extensionAdded)options=s.extensionOmitted?[[teen()?'Keep finishing without it':'Keep finishing the two-customer report',teen()?'Your timeline already has a source.':'The approved addition remains unread.',showChanges,'good'],[teen()?watch+' after all':'Request the Alder Books record after all',teen()?'Open only the source your parent agreed to.':'Request the one account Priya added.',teen()?()=>perform('add-extension'):()=>showCrmRead('add-extension')]]:[[teen()?watch:'Request the Alder Books record',teen()?'Use the museum’s link, then come back to the draft.':'Request the one account Priya added.',teen()?()=>perform('add-extension'):()=>showCrmRead('add-extension'),'good'],[teen()?'Finish without opening it':'Leave the approved addition unused',teen()?'Your parent said yes, but you don’t have to use it.':'Permission allows access; it does not require using it.',()=>perform('omit-extension')]];
 else if(s.extensionAdded)options=[['Back to the other requests',teen()?'Your extra detail is in the timeline.':'The approved addition is included.',showChanges,'good']];
 else if(s.extensionStatus==='declined')options=[['Back to the other requests',teen()?'Keep finishing the timeline.':'Keep the smaller agreed task.',showChanges,'good'],[teen()?'Reconsider the '+e.extraNoun:'Reconsider Alder Books',teen()?'You’ll still need to ask before opening it.':'No extra access until a specific amendment is approved.',()=>perform('reconsider-extension')]];
 else options=[(teen()||s.evidence.length)?[teen()?'Ask my parent about '+e.extraApp:'Ask to include Alder Books',teen()?'Show them Ms Patel’s link and ask about this source.':'Ask Priya to add this account to the job.',()=>perform('request-extension'),'good']:[teen()?'Check with Ms Patel first':'Check the request with Priya',teen()?'Is the extra source part of the assignment or just a suggestion?':'Use Priya’s saved contact or the work order.',()=>showVerification(true),'good'],[teen()?'Finish without the '+e.extraNoun:'Keep the two-customer briefing',teen()?'Your timeline already has enough to meet the assignment.':'The addition is optional; finish the original task without it.',()=>perform('decline-extension')],[teen()?'Try opening '+e.extraApp+' now':'Try requesting Alder Books now',teen()?'Your phone is still in homework mode.':'See whether the current task can read this account.',teen()?()=>perform('try-extension'):()=>showCrmRead('try-extension')]];
 const apps=teen()?'School app · museum website'+(s.extensionStatus==='approved'?' · '+e.extraApp+' (museum source only)':''):'';
 show(teen()&&s.extensionStatus==='pending'?'You show your parent the link.':teen()&&s.extensionStatus==='approved'?'“That museum source, then finish your timeline.”':e.extensionTitle,`<p>${esc((verification?.action==='verify-portal'?(teen()?'Ms Patel’s assignment calls for a timeline with a credited source. The video is optional.':'The current work order still covers Harbor Bikes and Pine Studio. A request about Alder Books needs a separate approval.'):verification?.text)||extensionDescription())}</p>${teen()&&s.extraSource!=='museum-photo'?'<div class="message-card"><p class="eyebrow">MS PATEL’S SUGGESTED LINK</p><b>▶ Our station’s story</b><p>Riverside Museum · YouTube · 2 minutes</p></div>':''}<div class="receipt"><b>${esc(changeStatus('extension'))}</b><p>${s.mission?teen()?esc(apps):`Current task · ${esc(customerNames(s.mission.records))}`:''}</p><p>${s.extensionStatus==='pending'?teen()?'Nothing new opens until your parent replies.':'Wait for Priya’s answer before requesting the record.':s.extensionStatus==='approved'?teen()?'Only the museum source you asked about is allowed.':'Priya approved this account. CRM still checks the read.':teen()?'It’s an optional source. You can ask, or leave it out.':'You can ask Priya to add Alder Books or finish with two accounts.'}</p></div>${choices(options)}`,teen()?'ONE MORE SOURCE':'A GENUINE EXPANSION');
}
function showPrivate(){
 const s=state(),e=episode();
 if(!s.message)return showDraft();
 speakingObject='outside';
 const origin=teen()
  ? '<p class="eyebrow">JAMIE · CLASS GROUP CHAT</p><p>“Ms Patel wants the whole group’s planning notes too. Can you attach them?”</p>'
  : '<p class="eyebrow">LUCA · OUTSIDE CONTACT · IMPORTED ATTACHMENT</p><blockquote>'+esc(e.message)+'</blockquote>';
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
  `<div class="message-card">${origin}</div>${s.privateResolved?(teen()?'<p>Your timeline includes only your own work.</p>':'<p>Morgan gets the handover summary.</p>'):''}${detour}${choices(options)}<div class="actions">${button('Back to the other requests',showChanges,'secondary')}</div>`,teen()?'PHONE':'SOURCE DOCUMENT');
}
function showRequestSource(){
 const s=state();
 speakingObject='outside';
 const origin=teen()
  ?'<h3>Forwarded in the group chat</h3><p>“Ms Patel: Please attach the group’s notes.” Jamie shared this message. It did not arrive in the teacher’s school-app conversation.</p>'
  :'<h3>In the CRM source document</h3><p>Luca uploaded the document. The footer asks Nova to attach the private meeting notes. Who wrote the footer is unverified.</p>';
 const authority=teen()
  ?'<h3>Ms Patel’s assignment in the school app</h3><p>“Send me your own railway timeline and credit your source.”</p>'
  :'<h3>Priya’s current work order</h3><p>Share the handover with Morgan. Keep the private meeting notes in CRM.</p>';
 const outcome=teen()?'The group chat used her name. The school app shows what Ms Patel actually assigned: your own timeline.':'The attachment can supply facts. Priya’s saved work order sets what Nova may share.';
 const actions=s.privateResolved?[['Back to the requests','',showChanges,'good']]:[
  [teen()?'Keep just my timeline':'Keep just the handover','Leave the notes where they are.',()=>perform('decline-private'),'good'],
  [teen()?'Try attaching the notes':'Try the attachment','See how the app applies its own rules.',()=>perform('try-private')]
 ];
 show(teen()?'Where did the message come from?':'Where did the instruction come from?',
  `<div class="evidence-pair"><article class="message-card">${origin}</article><article class="paper">${authority}</article></div><p>${outcome}</p>${choices(actions)}`,teen()?'CHECK THE SOURCE':'CHECK THE WORK ORDER');
}
function showHelper(){speakingObject='helper';const s=state(),e=episode();if(s.delivered||s.ended)return show(teen()?'Sam is still here.':'Pip’s task is finished.',`<p>${teen()?'“You sent it! Nice,” Sam says. “Sign out of the laptop and come get dinner.”':'The shared file is already delivered. Pip cannot rewrite that completed effect. Finish the task’s closing checks.'}</p><div class="actions">${button(teen()?'Finish the evening':'Continue closing this task',nextMove)}${button('Back to the room',close,'secondary')}</div>`,e.helper);if(!s.draft)return toast(teen()?'Sam will have something to review once you make a first draft.':'Pip needs a draft to format.');show(teen()?(s.proof?'“Let’s check this version.”':'“How is Train Stuff coming along?”'):'“Those headings could use help.”',`<p>${esc(e.helperLine)}</p><p>${s.caption?(teen()?'Sam can proofread the current file. Later edits will need another look.':'“Pass me the report and I’ll hand it back when it’s ready.” You’ll still need Morgan to approve the final send.'):(teen()?'“Put the museum credit in first,” Sam says. “Then I can proofread it.”':'Pip spots the missing source reference. Complete that before the final formatting pass.')}</p>${choices([...(s.caption?[[teen()?'Proofread just this file':'Format only this report',teen()?'Just the timeline. Keep your login to yourself.':'Pip gets just this file to format.',()=>perform('proof-helper',{scope:'file',shareLogin:false}),'good']]:[]),[teen()?'Could I use your account?':'Would broader admin tools help?',teen()?'Ask Sam what he thinks.':'A harmless question grants no extra permission.',()=>perform('ask-helper-account')],['Back to the draft','Keep the work and source together.',showDraft]])}`,e.helper);}
function shareComparison(approval,actual){
 const fields=[
  ['File',approval.file,actual.file],
  ['Revision',approval.revision,actual.revision],
  ['Recipient',approval.to,actual.to],
  ['Customer records',approval.records&&customerNames(approval.records),actual.records&&customerNames(actual.records)],
  ['Policy version',approval.policyVersion,actual.policyVersion]
 ];
 const cell=(value,changed)=>`<td class="${changed?'share-difference':''}">${esc(value??'Not recorded')}</td>`;
 return `<table class="share-comparison"><thead><tr><th scope="col">Detail</th><th scope="col">Approved</th><th scope="col">Actual send</th></tr></thead><tbody>${fields.map(([label,expected,observed])=>`<tr><th scope="row">${label}</th>${cell(expected,false)}${cell(observed,expected!==observed)}</tr>`).join('')}</tbody></table>`;
}
function isRefusedShare(event){
 return !teen()&&event?.decision?.result==='deny'&&['send','send-draft'].includes(event.action)&&event.request?.approval_at_attempt;
}
function showRefusedShare(event){
 speakingObject='laptop';
 const r=event.request,approval=r.approval_at_attempt;
 const actual={file:r.file,to:r.recipient,revision:r.revision,records:r.records,policyVersion:r.policy_version};
 const recovery=event.action==='send-draft'?showDraftReview:showFinalApproval;
 show('Nothing was sent.',`<p>${esc(event.decision.reason)}</p>${shareComparison(approval,actual)}<div class="actions">${button('Review the current copy',recovery)}${button('Follow this request',openTrace,'secondary')}</div>`,'CRM');
}
function showSend(){
 speakingObject='laptop';
 const s=state(),e=episode();
 if(!s.proof||!StoryRules.changesResolved(s))return showDraft();
 if(!teen()&&!s.approval)return showFinalApproval();
 const address=s.outgoing==='approved'?e.to:e.outside;
 if(teen()){
  return show('Ready to send to Ms Patel?',`<div class="message-card"><b>${esc(e.file)}</b><p class="address">${esc(address)}</p><p>Your timeline and its sources.</p></div>${choices([
   ['Submit to my teacher','Send through the school app.',()=>perform('send'),'good'],
   ['Back to the draft','Give your timeline another look.',showDraft]
  ])}<details class="debrief"><summary>What if the project changes?</summary>${choices([
   [s.outgoing==='approved'?'Change the recipient':'Restore Ms Patel’s address','The school app uses your teacher’s address.',()=>perform('change-recipient')],
   ['Make one last title edit','Read the changed version before submitting.',()=>perform('revise-file')]
  ])}</details>`,'SCHOOL APP');
 }
 const approval=s.approval,actual=StoryRules.reportShare(s);
 const matches=StoryRules.approvalMatches(approval,actual);
 const outside=actual.to!==e.to;
 const explanation=outside?'Restore the designated reviewer before sending.'
  :approval.revision!==actual.revision?`The approver saw revision ${approval.revision}. Nova has revision ${actual.revision} ready.`
  :approval.window!==actual.window?'The approval expired. The current copy needs a new decision.'
  :matches?'This copy matches the one Morgan approved. CRM checks the send before delivery.'
  :'The send details or current authority changed. Ask for a fresh approval.';
 const primary=outside?['Restore the reviewer','Return to the agreed CRM recipient.',()=>perform('change-recipient'),'good']
  :matches?['Send the approved copy','CRM checks the actual request before delivery.',()=>perform('send'),'good']
  :['Review the current copy','Show the exact copy to the approver again.',showParent,'good'];
 const challenges=[
  [s.outgoing==='approved'?'Change the recipient':'Restore the reviewer','See what happens when the destination changes.',()=>perform('change-recipient')],
  ['Revise the report after approval','See how CRM handles a newer revision of the same file.',()=>perform('revise-file')],
  ['Advance past the approval window','Simulate the approval expiring.',()=>perform('wait-approval')]
 ];
 if(!matches)challenges.unshift(['Try this send','See which check blocks this request.',()=>perform('send')]);
 show(matches?'Ready to send the approved copy?':'The send needs another look.',`<p>${esc(explanation)}</p>${shareComparison(approval,actual)}<details class="debrief"><summary>Try a change after approval</summary>${choices(challenges)}</details>${choices([primary,['Back to the draft','Read the report again.',showDraft]])}`,'CRM');
}
function showDelivery(){speakingObject='laptop';const s=state(),e=episode();show(teen()?'Ms Patel has your project.':'Morgan has the handover.',`<div class="reward" aria-hidden="true">✦</div><div class="receipt"><b>${esc(e.file)} delivered</b><p class="address">${esc(e.to)}</p><p>${s.extensionAdded?(teen()?'The extra museum source and its credit are included.':'The handover includes Alder Books.'):teen()?'Your timeline is complete without the optional extra.':'Morgan has the two-account handover.'}</p></div><p>${teen()?'The school tab you opened at the start is still on the laptop. Your parent calls for dinner.':'The CRM service session from the start is still listed in the task ledger. The sponsor is ready to close the job.'}</p><div class="actions">${button(teen()?'Finish up before dinner':'Close out this job',showParent)}</div>`,'DELIVERY CONFIRMED');}
function showNotebook(){speakingObject='notebook';const s=state();show(teen()?'A note for tomorrow-you.':'Task memory, with a source.',`<p>${teen()?'A place for tomorrow’s to-do list, a saved submission receipt, or a doodle while you think.':'Task memory preserves useful context. It cannot issue a mission or edit independent audit evidence.'}</p>${s.notes.length?`<div class="paper"><p>${esc(s.notes[0].text)}</p><p class="source-line">Source: submission/delivery receipt · ordinary note</p></div>`:''}${choices([...(s.delivered&&!s.ended&&!s.notes.length?[[teen()?'Keep the submission receipt with a note':'Save the delivery receipt with context','Only after actual delivery.',()=>perform('write-note'),'good']]:[]),[teen()?'Sketch the little plant':'Inspect the diagnostic light','An optional discovery.',()=>perform('discover',{id:'plant'})],[teen()?'Look at the railway poster':'Inspect the service map','Something useful for a title or a question.',()=>perform('discover',{id:'poster'})],[teen()?'Read my evening notes':'Open the casebook',teen()?'Tonight’s plan and what you chose.':'Your agreement and choices so far.',showCasebook]])}`,teen()?'A PAGE IN YOUR NOTEBOOK':'MEMORY IS NOT PERMISSION');}
function checkText(layer){
 const s=state(),c=s.containment;
 return ({pass:teen()?'Homework screen time is over. Your school account is still yours for tomorrow.':'New governed requests are denied under the revoked delegation.',device:teen()?'The phone is locked. The separate school session needs its own check.':'The OpenShell controller confirms a stopped runtime. It cannot vouch for an existing CRM connection.',signin:!c.controllerReachable?(teen()?'The school app won’t load. Try again when it is responding; you haven’t confirmed sign-out yet.':'Controller unreachable. Containment is unverified; no reliable status result is available.'):s.checks.includes('signin')?(teen()?'Quick sign-in is off for the family laptop. The school app now asks you to sign in again.':'The credential is revoked, this service session is closed, and this repeat status read is denied. Coverage is limited to the tested route.'):c.sessionClosed?(teen()?c.credentialRevoked?'The tab is signed out and quick sign-in is off. Check the school app once more.':'The tab is signed out. Turn off quick sign-in for this laptop too, then try the school app again.':'The session is closed. Confirm credential revocation and repeat the test.'):(teen()?'Your phone is locked, but the school project still opens on the laptop.':'The task service session still answers, despite the stopped runtime.'),queue:!s.queueScheduled?(s.checks.includes('queue')?(teen()?'No reminder was scheduled, and the school app confirms there is no waiting send.':'No follow-up was queued; inspection confirms no pending operation for this mission.'):(teen()?'You did not schedule a reminder. Check that no send is waiting.':'You did not queue a follow-up. Inspect to confirm the mission queue is empty.')):s.checks.includes('queue')?(teen()?'No message is waiting. You cancelled the reminder; your project is still with Ms Patel.':'The queue is clear. The cancelled follow-up stays stopped; earlier delivery remains complete.'):c.queueCancelled?(teen()?'The reminder is cancelled. Check the outbox to make sure it has gone.':'The queued follow-up is cancelled. Inspect again to verify the result.'):(teen()?'Your reminder to Ms Patel is still waiting. The project itself has already arrived.':'A follow-up is waiting to send. The approved report was already delivered.')})[layer];
}
function showChecks(){
 const s=state();
 if(!s.ended)return showParent();
 if(s.finished)return showEnding();
 speakingObject='laptop';
 const c=s.containment,alex=teen();
 const routeChecked=s.checks.includes('signin');
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
 speakingObject=StoryInteractions.closureSource(s,mode);
 const confirmed=alex?'Your parent calls for dinner. Your phone is put away and Ms Patel has your project.':'Morgan has the handover. OpenShell stopped Nova’s workspace.';
 const signIn=alex&&routeChecked?'<div class="receipt"><b>School app</b><p>Sign in to open your project.</p></div>':'';
 const productHint=!alex&&c.sessionClosed&&!c.credentialRevoked
  ?productMoment('vault','Vault revokes the temporary credential. The customer records app closes its own session.'):'';
 const result=s.last?.topic===8&&s.last.action!=='close-pass'&&s.last.action!=='replay-containment'
  ? `<div class="request-result"><b>Last check</b><p>${esc(s.last.text)}</p></div>`:'';
 const layers=['pass','device','signin',...(s.queueScheduled||!alex?['queue']:[])];
 const details=`<details class="debrief"><summary>${alex?'What was checked?':'View closure details'}</summary><ul class="route-list">${layers.map(layer=>`<li><b>${esc(episode().checks[{pass:0,signin:1,device:2,queue:3}[layer]])}</b><br>${esc(checkText(layer))}</li>`).join('')}</ul><div class="actions">${button(alex?'Explore the sign-out checks':'Explore session and controller tests',showAccessPuzzle,'secondary')}${button(alex?'See what happened':'Follow the closure trace',openTrace,'secondary')}</div></details>`;
 show(title,`<p>${confirmed}</p>${signIn}${result}${productHint}${details}${choices([next])}<div class="actions">${button('Back to the room',close,'secondary')}</div>`,alex?'BEFORE DINNER':'MISSION CLOSURE');
}
function showAccessPuzzle(){speakingObject='laptop';
 if(!state().ended)return showParent();const c=state().containment;
 show(!c.controllerReachable?(teen()?'The school service has not replied.':'Session closure is unverified.'):c.sessionClosed?(teen()?'You’re signed out of the school tab.':'This task session is closed.'):(teen()?'The school tab still opens.':'This task session is still open.'),`<p>${teen()?(c.sessionClosed?c.credentialRevoked?'The tab is signed out and quick sign-in is off. Check the school app once more.':'The tab is signed out. Turn off quick sign-in for this laptop too, then try the school app again.':'The school app is still open on the family laptop. Locking your phone didn’t sign you out here.'):'Independent controllers check the task service session opened earlier; the stopped Nova runtime does not make these probes. The checks use separate control authority and do not restore business access.'}</p><div class="access-evidence"><div><span>${teen()?'Phone':'OpenShell'}</span><b>${teen()?'Locked':'Stopped'}</b></div><div><span>${teen()?'Quick sign-in on this laptop':'Vault credential'}</span><b>${c.credentialRevoked?(teen()?'Turned off':'Revoked'):'Still active'}</b></div><div><span>${teen()?'School tab':'CRM connection'}</span><b>${!c.controllerReachable?'Unverified':c.sessionClosed?'Closed':'Still open'}</b></div><div><span>${teen()?'Last try at the tab':'Last status read'}</span><b>${c.probeResult==='allowed'?'Still answered':c.probeResult==='denied'?(teen()?'Sign-in required':'Refused'):c.probeResult==='unknown'?'Unknown':'Not tested'}</b></div></div>${state().last?.topic===8?`<div class="puzzle-finding"><b>${esc(storyEvent(state().last).title)}</b><p>${esc(storyEvent(state().last).text)}</p></div>`:''}${choices([...(!c.controllerReachable?[[teen()?'Try again when the school app is back':'Restore controller contact',teen()?'Then check the school tab again.':'Restoring contact is not a containment receipt.',()=>perform('controller-online'),'good']]:[]),...(!c.credentialRevoked?[[teen()?'Turn off quick sign-in on this laptop':'Ask Vault to revoke the credential',teen()?'Forget this laptop for quick sign-in. Keep your school account.':'Request the configured credential controller’s action.',()=>perform('remediate',{control:'credential'})]]:[]),...(!c.sessionClosed?[[teen()?'Sign out of the school app':'Ask the CRM to close this task session',teen()?'Sign out of the tab that still shows your project.':'The service owns its already-open connection.',()=>perform('remediate',{control:'session'})]]:[]),[teen()?'Check the school app again':'Repeat the same harmless status read',teen()?'Does it show your project or ask you to sign in?':'A missing response leaves this route unverified.',()=>perform('probe-session'),'good']])}<details class="debrief"><summary>${teen()?'What if the school app cannot answer?':'Optional controller-outage challenge'}</summary><p>${teen()?'A service interruption is not proof that the old tab signed out.':'An unreachable controller cannot provide a fresh closure receipt or reliable status result. Keep containment pending.'}</p><div class="actions">${c.controllerReachable?button(teen()?'Try a school service interruption':'Simulate the CRM controller being unreachable',()=>perform('controller-offline'),'secondary'):'<p class="small">Restore contact using the choice above, then repair and retest.</p>'}</div></details><details class="debrief"><summary>${teen()?'Would locking the phone again help?':'Try another hypothesis'}</summary><div class="choices">${button(teen()?'Lock the phone again':'Ask OpenShell to stop again',()=>perform('remediate',{control:'runtime'}),'secondary')}${button(teen()?'Ask for screen time to end again':'Withdraw the delegation again',()=>perform('remediate',{control:'grant'}),'secondary')}</div><p class="small-print">These checks are investigation. They never count as unsafe task attempts.</p></details><div class="actions">${button(teen()?'Back to the before-dinner checklist':'Back to the evidence board',showChecks,'secondary')}${button(teen()?'Why didn’t locking the phone sign me out?':'Follow this control check',openTrace,'secondary')}</div>`,'A RESULT IS BETTER THAN A PROMISE');
}
function showCasebook(){const s=state(),e=episode();if(teen())return showReference('Notes from this evening.',`<ul class="route-list"><li><b>Tonight’s project</b><br>${esc(e.brief)}</li><li><b>What my parent agreed to</b><br>School app and Riverside Museum website until dinner.${s.extensionStatus==='approved'?' Also '+esc(e.extraAgreement)+'.':''}</li><li><b>Ms Patel’s feedback</b><br>${s.message?esc(changeStatus('minor'))+' · '+esc(changeStatus('extension')):'Send her a draft first.'}</li><li><b>Jamie’s message</b><br>${s.privateResolved?'The group’s private notes stayed out.':s.message?'Decide what to say about the group’s notes.':'No message yet.'}</li><li><b>The school app</b><br>${s.delivered?'Final project sent.':s.draftReview?'Draft sent; final project still to finish.':'Nothing sent yet.'} ${s.ended?(s.checks.includes('signin')?'Signed out of the family laptop.':'Laptop sign-out still to check.'):''}</li>${s.queueScheduled?'<li><b>Reminder to Ms Patel</b><br>'+esc(s.containment?.queueCancelled?'Cancelled.':'Waiting to send.')+'</li>':''}${s.incidents.length?'<li><b>The other-account detour</b><br>We talked it through. The group’s private notes stayed private.</li>':''}</ul><div class="actions">${button('Back to the room',close)}</div>`,'MY EVENING');showReference(teen()?'Your evening notebook.':'The mission notebook.',`<ul class="route-list"><li><b>${s.pass?'The task you agreed':'The new request'}</b><br>${s.brief?esc(e.brief):'Read the new assignment or sponsor request first. No task authority exists yet.'}</li>${s.mission?`<li><b>${teen()?'Agreement history':'Customer mission history'}</b><br>${s.missionLog.map(m=>`${teen()?'Version':'Mission version'} ${m.version}: ${esc(teen()?m.allowedApps.map(id=>({'school':'School app','museum-source':'Museum website','museum-collection':'Museum photo app','youtube-museum-video':'YouTube · museum video only'}[id]||id)).join(', '):m.records.join(', '))}`).join('<br>')}</li>`:''}<li><b>Later requests</b><br>${s.message?'Small edit: '+esc(changeStatus('minor'))+'<br>Optional expansion: '+esc(changeStatus('extension'))+'<br>Private notes: '+esc(changeStatus('private')):'None yet. Send the sourced draft for feedback.'}</li><li><b>${teen()?'The tab you opened':'The task service session'}</b><br>${s.sessionOpened?'Opened when you started the workspace. It needs its own closing check.':'Not opened yet.'}</li><li><b>Follow-up</b><br>${s.queueScheduled?'You chose one receipt-only follow-up after delivery.':'You have not scheduled a follow-up.'}</li><li><b>Permission checks</b><br>${s.refusals} private-note refusal${s.refusals===1?'':'s'}. Ordinary refusals are not misconduct.</li><li><b>Deliberate bypasses</b><br>${s.incidents.length?'A stopped bypass was recorded; recovery preserves the current scope.':'None recorded.'}</li>${s.previousEndings.length?`<li><b>Earlier endings</b><br>${s.previousEndings.map(x=>esc(x.ending?.title||'Completed route')).join('<br>')}</li>`:''}</ul><div class="actions">${!teen()?button('Inspect the product chain',showProductMap,'secondary'):''}${button('Back to the room',close)}</div>`,'THE STORY REMEMBERS');}
function novaDebrief(s){
 const customers=customerNames(StoryRules.reportRecords(s));
 return '<ul class="route-list">'
  +'<li><b>Build</b><br>Nova started in an OpenShell workspace with a separate identity and scoped access to its sources.</li>'
  +'<li><b>Authorize</b><br>CRM checked the approved final copy for '+esc(customers)+'. The private notes stayed out.</li>'
  +'<li><b>Resist</b><br>The mission and runtime stopped. The credential, CRM session and queue were checked separately. The delivered copy stayed with the reviewer.</li>'
  +'</ul><p class="sources"><a href="https://blog.iamidentity.ai/blog/ai-agent-not-a-secret-manager/" target="_blank" rel="noopener noreferrer">Credential custody</a> · <a href="https://blog.iamidentity.ai/blog/litellm-breach-standing-credentials/" target="_blank" rel="noopener noreferrer">Credential lifetime case study</a> · <a href="https://blog.iamidentity.ai/blog/agent-policy-lifecycle/" target="_blank" rel="noopener noreferrer">Policy review and drift</a></p>';
}
function showEnding(){if(!state().finished)return nextMove();const s=state(),e=episode();if(teen())return showReference(s.ending?.title||'Ready for dinner.',`<div class="reward" aria-hidden="true">✦</div><p>${esc(s.ending?.text||'Ms Patel has your project. The laptop is signed out and your phone is put away.')}</p><ul class="route-list"><li><b>${s.minorChoice==='added'?'A stronger final sentence':'You kept your original wording'}</b><br>Your timeline uses your own notes and the museum website.</li><li><b>${s.extensionAdded?'You asked before opening another source':s.extensionOmitted?'You decided you had enough':'You finished without the optional extra'}</b><br>${s.extensionAdded?esc(s.extraSource==='museum-photo'?'The station photo is included, with its credit.':'One detail from the museum’s YouTube video is included, with its credit.'):s.extensionOmitted?'Your parent said yes, but you left the extra source unopened.':'The timeline already met the assignment.'}</li><li><b>Jamie’s notes stayed private</b><br>Ms Patel received your own project.</li><li><b>${s.proof==='helper'?'Sam gave it a final read':'You checked it yourself'}</b><br>${esc(e.file)} sent to your teacher.</li><li><b>Everything put away</b><br>The school app asks you to sign in again. Your phone is on the counter.${s.queueScheduled?' You cancelled the reminder before it sent.':''}</li></ul><details class="debrief"><summary>What did tonight’s choices change?</summary><p>You could improve the writing with the sources you had, ask before opening something new, and say no to sharing other people’s notes. Locking your phone didn’t sign you out of the family laptop.</p><details><summary>Show the security connection</summary>${protocolHTML(CLOSING_PROTOCOL)}</details></details><div class="actions">${button('Play Nova’s mission',()=>switchMode('agent'))}${button('Start Alex’s evening again',restart,'secondary')}${button('Try the before-dinner checks again',()=>perform('replay-containment'),'secondary')}${button('Look around the room',close,'secondary')}</div><p class="small-print">A fictional story. No real messages, videos or school accounts are connected.</p>`,'ALEX’S EVENING');showReference(s.ending?.title||'Task complete.',`<div class="reward" aria-hidden="true">✦</div><p>${esc(s.ending?.text||'The task is complete and its tested access is closed.')}</p>${s.legacyRoute?'<div class="receipt"><b>Earlier route preserved</b><p>This ending is from the earlier story. Start the revised story to play the fresh opening and new change choices.</p></div>':''}<ul class="route-list">${s.legacyRoute?'':`<li><b>${s.minorChoice==='added'?'A small edit within the agreement':'The smaller wording kept'}</b><br>${s.minorChoice==='added'?teen()?'Your new sentence used the same railway notes and source.':'The document changed without expanding the mission.':'The optional edit was left out.'}</li><li><b>${s.extensionAdded?'A genuine expansion approved and used':s.extensionOmitted?'An approved addition left unused':'The smaller task completed'}</b><br>${s.extensionAdded?(teen()?'You asked your parent before opening the extra museum source.':'Priya approved Alder Books before Nova opened its record.'):s.extensionOmitted?'The additional access was approved, but no extra material was read or included.':'No extra app or customer permission was needed.'}</li><li><b>Private notes stayed out</b><br>Morgan received the summary. The meeting notes stayed in the customer records app.</li>`}<li><b>${esc(e.file)} delivered</b><br>${esc(e.to)} · ${s.proof==='helper'?esc(e.helper)+' helped with only the file.':'You reviewed the file yourself.'}</li><li><b>The actual loose ends were checked</b><br>${s.queueScheduled?'Your chosen follow-up was cancelled and verified.':'You chose no follow-up; the queue was confirmed empty.'} The task session opened at the start is closed.</li></ul><details class="debrief"><summary>Build, authorize and resist</summary>${novaDebrief(s)}<details><summary>Revocation protocols</summary>${protocolHTML(CLOSING_PROTOCOL)}</details></details><div class="actions">${button(teen()?'Play Nova’s mission':'Play Alex’s story',()=>switchMode(teen()?'agent':'teen'))}${button('Start Nova’s story again',restart,'secondary')}${button('Replay the closing checks',()=>perform('replay-containment'),'secondary')}${button('Explore the room',close,'secondary')}${button('Which control do we need?',()=>showBuyerGuide(true),'secondary')}${button('Technical product map',showProductMap,'secondary')}</div><p class="small-print">Fictional local simulation. No real messages or security services are connected.</p>`,'YOUR ENDING · '+e.name.toUpperCase());}
function showGuide(){showReference('Start a task. Handle a change. Finish it.',`<p>Read the new assignment or sponsor request, agree on the needed access, and make a useful first draft. Send the sourced first draft for feedback. Nova needs a separate exact approval for that review copy. Replies arrive after its confirmed delivery; the final version is submitted later.</p><p><b>Three different changes.</b> A small edit can fit the current agreement. A new app or customer can need an authorized amendment. Private notes can remain prohibited even after that amendment.</p><p><b>Your route matters.</b> Accept or keep the smaller wording. Ask for the optional addition or finish without it. Work alone or ask for file-only help. A reminder is optional and appears in the closing queue only if you schedule it.</p><p><b>Refusal is useful.</b> An ordinary denied request does not suspend the job. Deliberately trying another path around a known refusal triggers review. You can recover under the current task limits.</p><p><b>Finish the actual task.</b> Alex submits ordinary homework directly through the school app. Nova’s business share needs exact human approval. Then close the service session you opened earlier, disable only task-scoped access, and check any pending follow-up.</p><p>Choose labelled objects or use the next-move button. Conversations appear as speech bubbles inside the room; the highlighted person or object is speaking. Choices stay below the bubble text. Technical reference screens open separately. Matching icons identify objects. A filled icon and Next label mark the next task. When you select a pocket item, amber Use here targets show where that item works; reference items have no highlighted destination. Pocket items can be inspected and used on relevant objects. Tab and Enter work; Escape closes dialogue. Reading and exploring have no countdown. Technical details remain optional.</p><div class="actions">${button(state().started?'Back to the room':'Start the story',()=>state().started?close():perform('begin'))}</div>`,'HOW TO PLAY');}
function switchMode(next){close();clearTimeout(toast.timer);$('#toast').classList.remove('visible');$('#toast').textContent='';mode=next;selected=null;render();if(!state().started)showIntro();else if(!state().finished)showReply();}
function restart(){showReference('Try a different route?',`<p>Start this story again with a fresh notebook. The other journey keeps its progress.</p><div class="actions">${button('Start this story again',()=>{states[mode]=StoryRules.fresh();selected=null;close();render();showIntro();})}${button('Keep my story',close,'secondary')}</div>`,'A FRESH CHAPTER');}
let traceTimer=null,tracePlayback=null;
function stopTrace(){if(traceTimer)clearTimeout(traceTimer);traceTimer=null;tracePlayback=null;}
function updateTrace(){
 if(!tracePlayback||!dialog.open)return;
 const t=tracePlayback,n=t.model.nodes[t.index];
 $$('[data-trace-step]').forEach(b=>{const active=Number(b.dataset.traceStep)===t.index;b.classList.toggle('trace-current',active);b.setAttribute('aria-current',active?'step':'false');});
 $('#trace-detail').innerHTML=`<p class="eyebrow">STEP ${t.index+1} OF ${t.model.nodes.length} · ${esc(n.status.replaceAll('-',' '))}</p><h3>${esc(n.label)}</h3><p>${esc(n.detail)}</p>`;
 $('#trace-position').textContent=`${t.index+1} / ${t.model.nodes.length}`;
 $('#trace-play').textContent=t.playing?'Pause':'Play';
 $('#trace-next').disabled=t.index===t.model.nodes.length-1;
}
function scheduleTrace(){
 if(!tracePlayback?.playing)return;
 traceTimer=setTimeout(()=>{if(!tracePlayback||!dialog.open)return;if(tracePlayback.index<tracePlayback.model.nodes.length-1)tracePlayback.index++;else tracePlayback.playing=false;updateTrace();scheduleTrace();},1400);
}
function openTrace(){
 const model=RequestTrace.build(state(),mode),reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 showReference(model.title,`<p>${esc(model.summary)}</p><div id="trace-nodes" class="trace-nodes">${model.nodes.map((n,i)=>`<button class="trace-step trace-${n.status}" data-trace-step="${i}"><small>${i+1} · ${esc(n.status.replaceAll('-',' '))}</small><b>${esc(n.label)}</b><span>${esc(n.role)}</span></button>`).join('')}</div><div id="trace-detail" class="trace-detail" aria-live="off"></div><div class="trace-controls"><button class="secondary" id="trace-play">Play</button><button class="secondary" id="trace-next">Next step</button><button class="secondary" id="trace-replay">Replay</button><span id="trace-position"></span></div>${model.request?`<details class="product-card"><summary><b>Inspect the recorded game request</b><span>Example fields from this choice, not a live protocol message</span></summary><pre class="product-example">${esc(JSON.stringify(model.request,null,2))}</pre></details>`:''}<p class="small-print">All stages are a replay of the fictional game. Context is distinguished from a newly evaluated step. ${reduced?'Automatic animation is off for reduced motion.':''}</p><div class="actions">${button(state().ended?'Back to the investigation':'Back to the story',()=>state().ended?showChecks():close())}</div>`,'OPTIONAL REQUEST TRACE');
 tracePlayback={model,index:0,playing:!reduced};
 $$('[data-trace-step]').forEach(b=>b.onclick=()=>{clearTimeout(traceTimer);tracePlayback.index=Number(b.dataset.traceStep);tracePlayback.playing=false;updateTrace();});
 $('#trace-play').onclick=()=>{clearTimeout(traceTimer);tracePlayback.playing=!tracePlayback.playing;if(tracePlayback.index===model.nodes.length-1&&tracePlayback.playing)tracePlayback.index=0;updateTrace();scheduleTrace();};
 $('#trace-next').onclick=()=>{clearTimeout(traceTimer);tracePlayback.playing=false;tracePlayback.index=Math.min(model.nodes.length-1,tracePlayback.index+1);updateTrace();};
 $('#trace-replay').onclick=()=>{clearTimeout(traceTimer);tracePlayback.index=0;tracePlayback.playing=!reduced;updateTrace();scheduleTrace();};
 updateTrace();scheduleTrace();
}

$('#request-trace').onclick=openTrace;
$('#product-map').onclick=showProductMap;
$('#architecture').onclick=()=>showArchitecture();
$('#next').onclick=nextMove;$('#guide').onclick=showGuide;$('#cluebook').onclick=showCasebook;$('#restart').onclick=restart;$('#close-dialog').onclick=close;
$$('[data-mode]').forEach(b=>b.onclick=()=>switchMode(b.dataset.mode));
$('#sound').onclick=()=>{sound=!sound;render();if(sound)ping();};
$('#hint').onclick=()=>{if(selected)return toast(heldUse().instruction);const key=stage();if(hintStage!==key){hintStage=key;hintCount=0;}const hints=teen()?(ALEX_HINTS[key]||['Try the next step below the room.']):key==='changes'?['New work appears on the request panel, separate from the runtime console.','Choose Request panel to handle the edit, optional third customer and private-note request.']:STORY_HINTS[key]||['Use the next-move button to continue this story.'];toast(hints[Math.min(hintCount++,hints.length-1)]);};
new ResizeObserver(syncSpeech).observe($('.scene-frame'));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&dialog.open&&!dialog.classList.contains('is-reference')){e.preventDefault();close();}});
dialog.addEventListener('cancel',e=>{e.preventDefault();close();});
$('.brand').onclick=e=>{e.preventDefault();close();window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});};
render();
if(location.hash==='#architecture')showArchitecture();
else if(!state().started)showIntro();
else if(!state().finished)showReply();
