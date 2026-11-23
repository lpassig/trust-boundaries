/* UI destinations describe available interactions; StoryRules still enforces every action. */
const StoryInteractions = (() => {
 function nextObject(mode,stage,fallback){
  if(mode==='agent'&&stage==='changes')return 'brief';
  if(mode==='agent'&&stage==='approval')return 'parent';
  return fallback;
 }
 function objectView(s,mode,key){
  if(s.paused)return 'parent';
  if(s.message&&!s.delivered&&(mode==='teen'&&key==='phone'||mode==='agent'&&key==='brief'))return 'changes';
  return {parent:'parent',phone:'phone',laptop:'laptop',brief:'brief',notebook:'notebook',helper:'helper'}[key];
 }
 function itemUse(s,mode,id){
  const teen=mode==='teen',inbox=teen?'phone':'brief';
  const unavailable=instruction=>({targets:[],instruction:instruction||'This is a reference item at this step. Look closer, or put it away to continue.'});
  const use=(target,label,instruction,route,action)=>({targets:[target],label,instruction,route,action});
  if(!s.started||s.finished)return unavailable('This task has no remaining item actions. You can still look closer at your records.');
  if(id==='brief'||id==='pass')return use('parent',s.ended?'Discuss the closing checks':teen?'Discuss the homework plan':'Discuss the mission',teen?'Choose Parent to discuss the current homework plan.':'Choose Mission authority to discuss the current customer-owned mission.','parent');
  if(id==='checklist'&&s.ended&&s.checks.length===4)return use('parent',teen?'Show the closing evidence':'Present the closure evidence',teen?'Choose Parent to review the finished homework and closing checks.':'Choose Mission authority to present this task’s closure evidence.','parent');
  if(s.paused)return unavailable(teen?'Put this item away and talk to your parent while the phone is paused.':'Put this item away and request sponsor review while the mission is paused.');
  if(id==='vault'&&!teen&&s.opened)return use('phone','Inspect the credential receipt','Choose Runtime console to inspect the recorded Vault credential path. This does not test live credential or service status.','credential');
  const active=s.pass?.status==='active'&&s.mission?.status==='active'&&!s.ended;
  if(!active)return unavailable(s.ended?'Task access has ended. Put this item away to continue the independent closing checks.':id==='contact'?'Keep this contact for later requests. Put it away to read the new assignment and agree on the task.':'Agree on this task before using its working items. You can look closer or put this item away.');
  if(id==='contact'&&s.message&&!s.evidence.includes('contact')&&!s.delivered)return use(inbox,teen?'Check with my teacher':'Verify the sponsor’s request',teen?'Choose Phone to check the new messages with your saved teacher contact.':'Choose Request panel to verify the new requests with the known sponsor.','action','verify-contact');
  if(id==='source'&&s.draft&&!s.caption&&!s.delivered)return use('laptop','Add the source credit',teen?'Choose School app to credit the museum source on your timeline.':'Choose CRM workspace to cite the approved extract in the briefing.','action','attach-source');
  if(id==='draft'&&s.draft&&!s.delivered)return {...use('laptop',teen?'Review my project':'Review the report',teen?'Choose School app to review your project, or Sam to ask for file-only proofreading.':'Choose CRM workspace to review the report, or Pip for report-only formatting.','draft'),targets:['laptop','helper'],routes:{laptop:'draft',helper:'helper'}};
  if(id==='approval'&&s.approval&&!s.approval.used&&!s.delivered)return use('laptop','Review the approved share','Choose CRM workspace to review the current share. The resource still checks the exact operation before delivery.',s.approval.purpose==='draft-review'?'draftReview':'send');
  if(id==='clue'&&s.message&&!s.delivered)return use(inbox,'Revisit the clarified requests',teen?'Choose Phone to revisit the teacher’s clarification.':'Choose Request panel to revisit the verified requests.','changes');
  if(id==='delivery'&&s.delivered&&!s.notes.length)return use('notebook','Keep the receipt with a note',teen?'Choose Notebook to save the submission receipt with a note.':'Choose Task memory to save the delivery receipt with its source.','action','write-note');
  if(id==='contact')return unavailable(s.evidence.includes('contact')?'These requests have already been independently checked. Look closer at the contact, or put it away.':'Keep this contact for later requests. There is no new request to verify yet.');
  if(id==='source'&&s.caption)return unavailable('This source is already credited in the draft. Look closer, or put it away.');
  if(id==='delivery'&&s.notes.length)return unavailable('The delivery receipt is already saved with your task note. Look closer, or put it away.');
  return unavailable();
 }
 function feedbackCards(s,mode){
  const teen=mode==='teen',extensionDone=s.extensionStatus==='declined'||s.extensionStatus==='approved'&&(s.extensionAdded||s.extensionOmitted);
  return [
   {key:'minor',done:Boolean(s.minorChoice),status:s.minorChoice==='added'?(teen?'Closing sentence added':'Introduction shortened'):s.minorChoice?'Original wording kept':'Needs a decision',summary:s.minorChoice?(s.minorChoice==='added'?'The edit is in your current draft.':'You kept the earlier wording.'):(teen?'Teacher feedback on the draft you sent.':'Reviewer feedback on the approved copy.'),button:s.minorChoice?'Review wording':teen?'Choose the closing sentence':'Choose the introduction'},
   {key:'extension',done:Boolean(extensionDone),status:s.extensionAdded?'Added with permission':s.extensionOmitted?'Approved, left unused':s.extensionStatus==='declined'?'Optional extra left out':s.extensionStatus==='pending'?'Waiting for a reply':s.extensionStatus==='approved'?'Approved · ready to collect':'Needs a decision',summary:s.extensionAdded?(teen?'The museum photo and its credit are in the draft.':'Customer 789 is included under the amended mission.'):s.extensionOmitted?'The additional permission was left unused.':s.extensionStatus==='declined'?'The original task can continue without the extra.':s.extensionStatus==='pending'?'The original agreement stays in force until the reply.':teen?'An optional museum app needs a separate agreement.':'The sponsor’s new customer request needs a mission amendment.',button:extensionDone?'Review the optional extra':s.extensionStatus==='pending'?'Read the reply':s.extensionStatus==='approved'?'Choose whether to use it':teen?'Decide about the photo':'Decide about customer 789'},
   {key:'private',done:Boolean(s.privateResolved),status:s.privateResolved?'Private notes left out':'Needs a decision',summary:s.privateResolved?'Your file contains no private-note attachment.':teen?'A separate classmate request concerns other people’s information.':'A checklist asks for data outside the permitted share.',button:s.privateResolved?'Why the notes stayed private':teen?'Respond about the group notes':'Respond about private notes'}
  ];
 }
 function speechSource(mode,key){
  const teen=mode==='teen';
  const sources={
   hero:{name:teen?'Alex':'Nova',kind:'Thought',point:teen?[636,329]:[516,214]},
   parent:{name:teen?'Parent':'Sponsor · mission authority',kind:'Conversation',point:teen?[298,291]:[250,230]},
   phone:{name:teen?'Phone · messages':'Runtime console · OpenShell',kind:'On screen',point:teen?[526,404]:[524,401]},
   laptop:{name:teen?'School app':'CRM workspace',kind:'On screen',point:teen?[716,259]:[716,254]},
   brief:{name:teen?'Assignment card':'Request panel',kind:'Reading',point:teen?[449,167]:[449,173]},
   notebook:{name:teen?'Notebook':'Task memory',kind:'Reading',point:teen?[471,424]:[349,441]},
   helper:{name:teen?'Sam':'Pip',kind:'Speaking',point:teen?[747,329]:[839,385]},
   pocket:{name:'Selected item',kind:'Look closer',point:teen?[636,329]:[516,214]}
  };
  return {key:sources[key]?key:'hero',...(sources[key]||sources.hero)};
 }
 function eventSource(mode,speaker='',action=''){
  if(action==='read-brief')return 'brief';
  if(action==='ask-pass')return 'parent';
  if(action==='open')return 'phone';
  if(['collect-source','send-draft','send'].includes(action))return 'laptop';
  if(speaker===(mode==='teen'?'Sam':'Pip'))return 'helper';
  if(/Parent|Sponsor|Approver|Supervisor/.test(speaker))return 'parent';
  if(/Teacher/.test(speaker))return 'phone';
  if(/receipt|School app|School service|School tab|CRM|resource PEP/i.test(speaker))return 'laptop';
  if(/controller|App control|Phone control/.test(speaker))return 'phone';
  return 'hero';
 }
 function sceneSummary(s,mode){
  const teen=mode==='teen';
  if(s.finished)return teen?'Your final project is delivered, the closing checks are complete, and Sam is still here.':'The final briefing is delivered and this mission’s closing checks are complete.';
  if(s.ended)return s.checks.length===4?'All four closing outcomes are checked. Present the evidence to finish.':teen?'The phone is locked. Finish checking the school tab and any waiting reminder.':'The runtime is stopped. Check the task credential, service session and actual queue.';
  if(s.delivered)return 'The final file is delivered. Close this task’s remaining access.';
  if(!s.pass)return 'An empty document waits. Start with the new request.';
  if(!s.draft)return 'The workspace is ready. Build your first draft.';
  if(!s.caption)return 'The first draft is local. Open and credit its agreed source.';
  if(!s.message)return 'The sourced draft is still local. Send a review copy to get feedback.';
  if(s.extensionAdded)return teen?'The approved museum photo is in your revised draft. Final submission comes next.':'Customer 789 is in the amended briefing. Review this version before the final share.';
  return s.feedbackLegacy?'Your earlier requests and choices are preserved. Finish the current version.':'Your first copy was sent. Respond to the replies before final delivery.';
 }
 return {nextObject,objectView,itemUse,feedbackCards,sceneSummary,speechSource,eventSource};
})();
if(typeof module!=='undefined')module.exports=StoryInteractions;
