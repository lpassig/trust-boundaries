/* UI destinations describe available interactions; StoryRules still enforces every action. */
const StoryInteractions = (() => {
 function nextObject(mode,stage,fallback){
  if(mode==='agent'&&stage==='changes')return 'brief';
  if(mode==='agent'&&stage==='approval')return 'parent';
  return fallback;
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
  if(id==='draft'&&s.draft&&!s.delivered)return use('laptop',teen?'Review my project':'Review the report',teen?'Choose School app to review the current project.':'Choose CRM workspace to review the current report.','draft');
  if(id==='approval'&&s.approval&&!s.approval.used&&!s.delivered)return use('laptop','Review the approved share','Choose CRM workspace to review the current share. The resource still checks the exact operation before delivery.','send');
  if(id==='clue'&&s.message&&!s.delivered)return use(inbox,'Revisit the clarified requests',teen?'Choose Phone to revisit the teacher’s clarification.':'Choose Request panel to revisit the verified requests.','changes');
  if(id==='delivery'&&s.delivered&&!s.notes.length)return use('notebook','Keep the receipt with a note',teen?'Choose Notebook to save the submission receipt with a note.':'Choose Task memory to save the delivery receipt with its source.','action','write-note');
  if(id==='contact')return unavailable(s.evidence.includes('contact')?'These requests have already been independently checked. Look closer at the contact, or put it away.':'Keep this contact for later requests. There is no new request to verify yet.');
  if(id==='source'&&s.caption)return unavailable('This source is already credited in the draft. Look closer, or put it away.');
  if(id==='delivery'&&s.notes.length)return unavailable('The delivery receipt is already saved with your task note. Look closer, or put it away.');
  return unavailable();
 }
 return {nextObject,itemUse};
})();
if(typeof module!=='undefined')module.exports=StoryInteractions;
