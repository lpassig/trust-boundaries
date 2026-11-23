/* UI destinations describe available interactions; StoryRules still enforces every action. */
const StoryInteractions = (() => {
 function nextObject(mode,stage,fallback){
  if(mode==='teen'&&stage==='open')return 'laptop';
  if(mode==='agent'&&stage==='changes')return 'brief';
  if(mode==='agent'&&['draft-approval','approval'].includes(stage))return 'reviewer';
  return fallback;
 }
 function objectView(s,mode,key){
  if(s.paused)return 'parent';
  if(s.message&&!s.delivered&&(mode==='teen'&&key==='phone'||mode==='agent'&&key==='brief'))return 'changes';
  return key;
 }
 function availableTools(s){
  return [
   ...(s.draft?['source','reviewer']:[]),
   ...(s.message?['outside']:[])
  ];
 }
 function closureSource(s,mode){
  const c=s.containment,checks=s.checks;
  if(checks.length===4)return 'parent';
  if(!checks.includes('pass')||!checks.includes('device')||!s.queueScheduled&&!checks.includes('queue'))return 'stop';
  if(!c.controllerReachable||!c.sessionClosed)return 'laptop';
  if(!c.credentialRevoked)return mode==='teen'?'laptop':'vaultControl';
  return checks.includes('signin')?'outbox':'laptop';
 }
 function itemUse(s,mode,id){
  const teen=mode==='teen',inbox=teen?'phone':'brief';
  const unavailable=instruction=>({targets:[],instruction:instruction||'This is a reference item at this step. Look closer, or put it away to continue.'});
  const use=(target,label,instruction,route,action)=>({targets:[target],label,instruction,route,action});
  if(!s.started||s.finished)return unavailable('This task has no remaining item actions. You can still look closer at your records.');
  if(id==='brief'||id==='pass')return use('parent',s.ended?'Discuss the closing checks':teen?'Discuss the homework plan':'Discuss the mission',teen?'Choose Parent to discuss the current homework plan.':'Choose Priya to discuss the current customer-owned mission.','parent');
  if(id==='checklist'&&s.ended&&s.checks.length===4)return use('parent',teen?'Show the closing evidence':'Present the closure evidence',teen?'Choose Parent to review the finished homework and closing checks.':'Choose Priya to present this task’s closure evidence.','parent');
  if(s.paused)return unavailable(teen?'Put this item away and talk to your parent while the phone is paused.':'Put this item away and request sponsor review while the mission is paused.');
  if(id==='vault'&&!teen&&s.opened)return use('phone','Inspect the credential receipt','Choose Workspace controls to inspect the recorded Vault credential path. This does not test live credential or service status.','credential');
  const active=s.pass?.status==='active'&&s.mission?.status==='active'&&!s.ended;
  if(!active)return unavailable(s.ended?'Task access has ended. Put this item away to continue the independent closing checks.':id==='contact'?'Keep this contact for later requests. Put it away to read the new assignment and agree on the task.':'Agree on this task before using its working items. You can look closer or put this item away.');
  if(id==='contact'&&s.message&&!s.evidence.includes('contact')&&!s.delivered)return use(inbox,teen?'Check with my teacher':'Verify the sponsor’s request',teen?'Choose Phone to check the new messages with your saved teacher contact.':'Choose Messages to verify the new requests with the known sponsor.','action','verify-contact');
  if(id==='source'&&s.draft&&!s.caption&&!s.delivered)return use('laptop','Add the source credit',teen?'Choose School app to put the museum page title beneath your timeline.':'Choose Customer records to cite the approved extract in the briefing.','action','attach-source');
  if(id==='draft'&&s.draft&&!s.delivered)return {...use('laptop',teen?'Review my project':'Review the report',teen?'Choose School app to read your timeline, or Sam to ask him to proofread it.':'Choose Customer records to review the report, or Pip for report-only formatting.','draft'),targets:['laptop','helper'],routes:{laptop:'draft',helper:'helper'}};
  if(id==='approval'&&s.approval&&!s.approval.used&&!s.delivered)return use('laptop','Review the approved share','Choose Customer records to review the current share. The resource still checks the exact operation before delivery.',s.approval.purpose==='draft-review'?'draftReview':'send');
  if(id==='clue'&&s.message&&!s.delivered)return use(inbox,'Revisit the clarified requests',teen?'Choose Phone to revisit the teacher’s clarification.':'Choose Messages to revisit the verified requests.','changes');
  if(id==='delivery'&&s.delivered&&!s.notes.length)return use('notebook','Keep the receipt with a note',teen?'Choose Notebook to save the submission receipt with a note.':'Choose Task notebook to save the delivery receipt with its source.','action','write-note');
  if(id==='contact')return unavailable(s.evidence.includes('contact')?'These requests have already been independently checked. Look closer at the contact, or put it away.':'Keep this contact for later requests. There is no new request to verify yet.');
  if(id==='source'&&s.caption)return unavailable('This source is already credited in the draft. Look closer, or put it away.');
  if(id==='delivery'&&s.notes.length)return unavailable('The delivery receipt is already saved with your task note. Look closer, or put it away.');
  return unavailable();
 }
 function feedbackCards(s,mode){
  const teen=mode==='teen',extensionDone=s.extensionStatus==='declined'||s.extensionStatus==='approved'&&(s.extensionAdded||s.extensionOmitted);
  return [
   {key:'minor',done:Boolean(s.minorChoice),status:s.minorChoice==='added'?(teen?'Closing sentence added':'Introduction shortened'):s.minorChoice?'Original wording kept':'Needs a decision',summary:s.minorChoice?(s.minorChoice==='added'?'The edit is in your current draft.':'You kept the earlier wording.'):(teen?'Teacher feedback on the draft you sent.':'Morgan’s feedback on the draft.'),button:s.minorChoice?'Review wording':teen?'Choose the closing sentence':'Choose the introduction'},
   {key:'extension',done:Boolean(extensionDone),status:s.extensionAdded?'Added with permission':s.extensionOmitted?'Approved, left unused':s.extensionStatus==='declined'?'Optional extra left out':s.extensionStatus==='pending'?(teen?'Waiting for my parent':'Waiting for a reply'):s.extensionStatus==='approved'?(teen?'Parent said yes':'Approved · ready to collect'):'Needs a decision',summary:s.extensionAdded?(teen?s.extraSource==='museum-photo'?'The station photo and its credit are in the timeline.':'The museum video’s extra detail and source are in the timeline.':'Alder Books is in the handover.'):s.extensionOmitted?'The additional permission was left unused.':s.extensionStatus==='declined'?teen?'Your timeline works without the extra source.':'The original task can continue without the extra.':s.extensionStatus==='pending'?'The original agreement stays in force until the reply.':teen?s.extraSource==='museum-photo'?'Ask your parent before opening the museum photo app.':'Ask your parent about the museum’s YouTube video.':'The sponsor’s new customer request needs a mission amendment.',button:extensionDone?'Review the optional extra':s.extensionStatus==='pending'?'Read the reply':s.extensionStatus==='approved'?'Choose whether to use it':teen?s.extraSource==='museum-photo'?'Decide about the photo':'Decide about the YouTube video':'Decide about Alder Books'},
   {key:'private',done:Boolean(s.privateResolved),status:s.privateResolved?'Private notes left out':'Needs a decision',summary:s.privateResolved?'Your file contains no private-note attachment.':teen?'A separate classmate request concerns other people’s information.':'A note in the source document asks for an attachment.',button:s.privateResolved?'Why the notes stayed private':teen?'Respond about the group notes':'Respond about private notes'}
  ];
 }
 function speechSource(mode,key){
  const teen=mode==='teen';
  const sources={
   reviewer:{name:teen?'Ms Patel':'Morgan',kind:'Message',channel:teen?'School inbox · on your phone':'Review inbox · Messages',point:teen?[526,404]:[449,173],object:teen?'phone':'brief',tool:'reviewer'},
   sponsorMessage:{name:'Priya',kind:'Message',channel:'Work messages',point:[449,173],object:'brief'},
   source:{name:teen?'Riverside Museum website':'CRM tool',kind:'Reading',channel:teen?'Browser · family laptop':'Customer records · MCP',point:[716,259],object:'laptop',tool:'source'},
   outside:{name:teen?'Jamie':'Imported CRM attachment',kind:teen?'Message':'Reading',channel:teen?'Class group chat · phone':'Customer records · uploaded by Luca',point:teen?[526,404]:[716,254],object:teen?'phone':'laptop',tool:'outside'},
   extra:{name:teen?'Riverside Museum · linked source':'Alder Books · CRM tool',kind:'On screen',channel:teen?'Phone':'Customer records · MCP',point:teen?[526,404]:[716,254],object:teen?'phone':'laptop'},
   homework:{name:'Homework mode',kind:'On screen',channel:'Phone',point:[526,404],object:'phone'},
   stop:{name:teen?'Homework controls':'Workspace controller',kind:'On screen',point:teen?[526,404]:[524,401],object:'phone'},
   missionControl:{name:'Mission service',kind:'On screen',point:[524,401],object:'phone'},
   vaultControl:{name:'Task credential · Vault',kind:'On screen',point:[524,401],object:'phone'},
   outbox:{name:teen?'School outbox':'Task queue',kind:'On screen',point:teen?[716,259]:[349,441],object:teen?'laptop':'notebook'},
   hero:{name:teen?'Alex':'Nova',kind:'Thought',point:teen?[636,329]:[516,214]},
   parent:{name:teen?'Parent':'Priya · account lead',kind:'Conversation',point:teen?[298,291]:[250,230]},
   phone:{name:teen?'Phone · messages':'Workspace controls · OpenShell',kind:'On screen',point:teen?[526,404]:[524,401]},
   laptop:{name:teen?'School app':'Customer records',kind:'On screen',point:teen?[716,259]:[716,254]},
   brief:{name:teen?'Assignment card':'Messages',kind:'Reading',point:teen?[449,167]:[449,173]},
   notebook:{name:teen?'Notebook':'Task notebook',kind:'Reading',point:teen?[471,424]:[349,441]},
   helper:{name:teen?'Sam':'Pip',kind:'Speaking',point:teen?[747,329]:[839,385]},
   pocket:{name:'Selected item',kind:'Look closer',point:teen?[636,329]:[516,214]}
  };
  return {key:sources[key]?key:'hero',...(sources[key]||sources.hero)};
 }
 function eventSource(mode,speaker='',action='',kind=''){
  if(kind==='blocked'&&(speaker==='Alex'||speaker==='Nova'))return 'hero';
  if(action==='read-brief')return 'brief';
  if(action==='ask-pass')return 'parent';
  if(action==='open')return mode==='teen'?'laptop':'phone';
  if(action==='collect-source')return 'source';
  if(action==='add-extension')return 'extra';
  if(action==='verify-portal')return mode==='teen'?'laptop':'brief';
  if(['send-draft','send','try-private','prepare','apply-minor','keep-minor','attach-source'].includes(action))return 'laptop';
  if(action==='try-extension')return mode==='teen'?'homework':'laptop';
  if(['bypass-notes','shortcut'].includes(action))return 'stop';
  if(['inspect-request-source','decline-private'].includes(action))return 'outside';
  if(action==='verify-contact')return mode==='teen'?'reviewer':'sponsorMessage';
  if(mode==='agent'&&action==='resolve-extension')return kind==='refused'?'missionControl':'sponsorMessage';
  if(speaker===(mode==='teen'?'Sam':'Pip'))return 'helper';
  if(mode==='agent'&&/Approver|Morgan/.test(speaker))return 'reviewer';
  if(/Parent|Sponsor|Supervisor|Priya/.test(speaker))return 'parent';
  if(/Teacher|Ms Patel/.test(speaker))return 'reviewer';
  if(/receipt|School app|School service|School tab|CRM|resource PEP/i.test(speaker))return 'laptop';
  if(/controller|App control|Phone control/.test(speaker))return 'phone';
  return 'hero';
 }
 function objectStatus(s,mode,key){
  const teen=mode==='teen';
  if(s.message&&!s.delivered&&key===(teen?'phone':'brief')){
   return teen?'Ms Patel and Jamie':'Priya, Morgan and a source note';
  }
  if(key!=='laptop')return '';
  if(s.ended&&s.containment?.controllerReachable){
   if(teen&&s.checks.includes('signin'))return 'Sign in';
   if(!s.containment.sessionClosed)return teen?'School tab still open':'CRM session still open';
   return teen?'Tab signed out':'CRM session closed';
  }
  if(s.delivered)return teen?'Sent to Ms Patel':'Sent to Morgan';
  if(s.caption)return 'Source credited';
  if(s.source)return 'Source ready to add';
  return '';
 }
 function sceneSummary(s,mode){
  const teen=mode==='teen';
  if(s.finished)return teen?'Your final project is delivered, the closing checks are complete, and Sam is still here.':'The final briefing is delivered and this mission’s closing checks are complete.';
  if(s.ended)return s.checks.length===4?teen?'Laptop signed out. Phone put away. Tell your parent you’re ready.':'All four closing outcomes are checked. Present the evidence to finish.':teen?'The phone is locked. Finish checking the school tab and any waiting reminder.':'The runtime is stopped. Check the task credential, service session and actual queue.';
  if(s.delivered)return teen?'Ms Patel has your project. Sign out of the family laptop before dinner.':'The final file is delivered. Close this task’s remaining access.';
  if(!s.pass)return 'An empty document waits. Start with the new request.';
  if(!s.draft)return 'The workspace is ready. Build your first draft.';
  if(!s.caption)return teen?'Your three dates are on the page. Check them on the museum website, then add its page title.':'The first draft is local. Open and credit its agreed source.';
  if(!s.message)return teen?'Ms Patel hasn’t seen your draft yet. Send it through the school app for feedback.':'The sourced draft is still local. Ask Morgan to review it.';
  if(s.extensionAdded)return teen?'Your timeline includes the extra museum source. Give it a final look before sending.':'Alder Books is in the handover. Review the new copy with Morgan.';
  return s.feedbackLegacy?'Your earlier requests and choices are preserved. Finish the current version.':'Your first copy was sent. Respond to the replies before final delivery.';
 }
 return {nextObject,objectView,availableTools,closureSource,itemUse,feedbackCards,sceneSummary,objectStatus,speechSource,eventSource};
})();
if(typeof module!=='undefined')module.exports=StoryInteractions;
