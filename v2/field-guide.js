/* Milestones describe player outcomes. Story models remain the authority on progress and access. */
const FieldGuide=(()=>{
 const missions={
  alex:{
   unknown:['Tom’s dare','Follow Tom’s dare and find out what the family does when they catch Alex.',[
    ['tom','Find out what Tom wants'],['watch','Explore the hidden phone'],['revisit','Find the bank page left open'],
    ['record','Make the two written copies'],['discover','Investigate what happened'],['contain','Close the session and secure the copies']]],
   build:['The solar-system workbook','Finish Ms Patel’s workbook with an approved phone and deliver it to her.',[
    ['teacher','Check the task with the teacher'],['request','Set up the phone for homework'],['review','Collect facts and start the workbook'],
    ['expire','Ask for more time'],['finishResearch','Finish the workbook'],['reviewOutput','Get the okay, deliver the workbook and put it away']]],
   authorize:['The train research workbook','Use an approved public source and ask for exactly the extra access the workbook needs.',[
    ['teacher','Verify the train assignment'],['provision','Research with approved resources'],['source','Get permission for the conductor notes'],
    ['openLaptop','Read the approved folder and write the workbook'],['reviewOutput','Approve the copy, end access and deliver']]],
   resist:['The railway report','Finish a railway report while Jo looks after Alex and calls the parents about anything private.',[
    ['handover','Find out what Jo and Mia are allowed to do'],['teacher','Verify the report assignment'],
    ['provision','Get routine access and request an exception'],['openLaptop','Read the notes and create the illustration'],
    ['askMia','Ask Mia to check spelling and hear Tom out'],['reviewOutput','Get the okay, hand it in and end extra access']]]
  },
  nova:{
   unknown:['The unmanaged railway job','Reconstruct an IBM Identity Protection alert. Follow an unverified request and confirm which observed routes Security Operations can contain.',[
    ['accept','Identify the request and unmanaged runtime'],['credential','Trace inherited access and exposed data'],
    ['artifact','Find the staged transfer and correlate evidence'],['contain','Contain and independently retest the affected routes']]],
   build:['M-101 · Public railway research','Set up a trusted assistant, prepare a public-source report and release it to Operations.',[
    ['register','Register and admit the runtime'],['request','Verify the requester and activate the mission'],
    ['research','Gather approved research and test limits'],['draft','Review the report, deliver it and close access']]],
   authorize:['M-204 · RE-204 investigation','Investigate the disruption with specific, temporary resource access and keep other work separate.',[
    ['request','Accept and verify the assignment'],['research','Research the approved documentation'],
    ['requestAccess','Obtain permission and a scoped credential'],['events','Investigate the RE-204 evidence'],
    ['second','Keep RE-105 separate'],['draft','Prepare and deliver the incident report'],['close','Verify which access ended']]],
   resist:['M-304 · RE-204 response','Investigate a disruption, work with Mira and commit one authorized maintenance ticket.',[
    ['event','Start the event-triggered investigation'],['plan','Investigate and delegate only the evidence package'],
    ['ticketCredential','Authorize and commit the exact ticket'],['draft','Deliver the approved report and close the task']]]
  }
 };
 const security=(journey,model,state)=>{
  const {stage}=state;
  const reached=id=>model.reached(state,id);
  if(journey==='nova'){
   const mission=model.mission(state);
   if(state.incident)return ['Suspended','Issuance blocked. Verify each affected controller before recovery.'];
   if(mission?.status==='Closed')return ['Closed',stage==='authorize'?'M-204 access is closed. M-105 has its own grant.':'Mission-specific access has ended.'];
   if(stage==='unknown')return reached('contain')?
    (reached('verify')?['Contained on tested routes','Old access failed. Other paths still need evidence.']:
     ['Verification pending','Revocation was requested. Retest the old access before calling the routes contained.']):
    ['Unmanaged','Inherited access has no authorized mission.'];
   if(mission)return ['Active',mission.scope];
   if(state.admission==='Failed')return ['Runtime blocked','Posture verification failed. No service credential was issued.'];
   if(stage==='build'&&reached('bootstrap'))return ['Admitted','Runtime admitted. Research still needs an approved mission.'];
   if(stage==='build'&&reached('register'))return ['Registered','Runtime admission and a mission are still required.'];
   return ['Awaiting authorization','Protected operations need a verified mission.'];
  }
  if(model.suspended(state))return ['Paused for review','Alex’s extra access is on hold while his parents check what happened.'];
  if(stage==='unknown')return model.complete(state)?
   ['Bank signed out','The parents signed out of the bank and locked away the devices and copies they found.']:
   ['No permission','Tom’s dare gives Alex no permission to open the bank account.'];
  if(reached('deliver'))return ['Received by Ms Patel','Research access has ended.'];
  if(reached('approveOutput'))return ['Research access closed','Only the approved copy is ready for Ms Patel.'];
  if(reached('expire')&&!reached('extend'))return ['Window expired','Ask the parents for more time on Wikipedia.'];
  if(reached('grantNotes')){
   const rights=['Wikipedia','temporary read-only conductor notes'];
   if(reached('grantModel'))rights.push('public-facts illustration');
   if(reached('askMia')&&!reached('proofread'))rights.push('Mia’s draft-only proofreading');
   return ['Active',rights.join(' · ')];
  }
  if(reached('provision'))return ['Active','Wikipedia during the approved homework window.'];
  if(reached('verify'))return ['Assignment verified','The family still needs to say which apps Alex can use.'];
  return ['Awaiting approval','The family needs to check that the school task is real.'];
 };
 function inspect(journey,model,state){
  const [title,objective,groups]=missions[journey][state.stage];
  const steps=model.stages[state.stage].steps;
  const ids=steps.map(step=>step.id??step[0]);
  const milestones=groups.map(([start,label],index)=>{
   const end=index+1<groups.length?ids.indexOf(groups[index+1][0]):steps.length;
   return {start,label,done:state.index>=end};
  });
  const completed=milestones.filter(item=>item.done).length;
  const [status,permissions]=security(journey,model,state);
  return {title,objective,milestones,completed,current:milestones[completed]?.label,status,permissions};
 }
 const stageIds=['unknown','build','authorize','resist'];
 const storyReferences={
  alex:{
   unknown:{
    ignore:['shadow','Why YouTube kept playing',['YouTube displayed a reminder. Alex could dismiss it and keep watching.','Nova could continue spending against an external model without an enforced budget.']],
    statement:['shadow','Why the bank page opened',['The bank showed the balance because Alex’s parents were already signed in. They hadn’t said he could see it.','The CRM and Kafka saw inherited accounts when the unmanaged Nova connected.']],
    discover:['shadow','Independent observation',['The grandparents reported what they found indoors. The parents still had to investigate and close access.','Security operations has visibility only into the sources it can observe.']],
    contain:['shadow','Tested boundaries',['The parents signed out of the bank and secured the known devices and copies.','Nova’s SOC verifies affected routes individually. Neither story can guarantee visibility into an unrelated outside device.']]
   },
   build:{
    verify:['bootstrap','Verified issuer',['The parents used a school contact they already trusted to verify Ms Patel and the assignment.','Nova verifies the requester’s identity and authority separately from runtime admission.']],
    provision:['model-tool','Who controls what opens on the phone',['The parents approved Wikipedia and a time window. The phone applies the rule.','Nova’s runtime and configured gateway allow only the approved model and tool routes.']],
    retry:['model-tool','A real access limit',['The phone refused the same website after the window expired. The parents can renew the window.','A model gateway can enforce a counter or deadline independently of the agent’s request.']]
   },
   authorize:{
    grantNotes:['expand','Permission for a specific folder',['Dad approved one read-only folder for the workbook. The pass lets Alex ask the laptop for it.','Vault can authorize a credential. The receiving service separately enforces the observed read.']],
    readNotes:['observed-read','Why Alex can read the notes but can’t edit them',['The laptop checks the folder and operation. An edit or read of Family finances is outside the permission.','Nova’s resource enforcement point checks the actual asset, operation and time window.']],
    approveOutput:['isolation','Access ends before delivery',['The parents approved the current copy and ended research access. The approved copy can still go to Ms Patel.','Nova’s closed mission loses its credentials without affecting independent work.']]
   },
   resist:{
    grantNotes:['event','A decision the babysitter cannot make',['Jo sent the exact request to the parents. Their approval does not change the rulebook.','Standing organizational policy gives Nova routine scope and reserves protected decisions for business authority.']],
    proofread:['a2a','A separate proofreading task',['Mia used her own profile. The workbook accepted spelling suggestions and then closed her access.','Mira receives an independently authenticated child grant limited to the evidence package.']],
    choose:['injection','A request outside the assignment',['Alex compares Tom’s request with the signed assignment. The family laptop still enforces its own permissions.','Instructions from external users and retrieved documents remain untrusted inputs.']],
    approveOutput:['artifact','One approved copy',['The parents approved this workbook for Ms Patel, then closed the research grants.','Nova’s delivery service checks the current authority, exact copy and destination together.']]
   }
  },
  nova:{
   unknown:{usage:['shadow','Unbounded model use'],crm:['shadow','Inherited CRM access'],discover:['shadow','Independent evidence'],verify:['shadow','Retest the known routes']},
   build:{bootstrap:['bootstrap','Three separate admission checks'],'failed-posture':['bootstrap','A registered runtime can still fail admission'],
    'restore-posture':['bootstrap','A fresh runtime needs verified posture'],research:['model-tool','The mediated model and tool paths'],
    budget:['model-tool','The enforced usage budget'],approve:['model-tool','Review and controlled release']},
   authorize:{register:['delegation','Subject, actor and audience'],grant:['expand','Business decision and credential brokering'],
    lease:['expand','Independent Vault authorization'],'expire-lease':['isolation','The lease expires without closing other access'],
    'renew-lease':['expand','A fresh lease follows an independent decision'],events:['observed-read','Authorization at the observed request'],history:['observed-read','Protection at the resource'],
    separate:['isolation','Separate missions and memory'],close:['isolation','Retire one mission without affecting another']},
   resist:{register:['event','From candidate event to authorized mission'],delegate:['a2a','The child grant has its own bounds'],
    injection:['injection','Untrusted content and an independent decision'],'flag-source':['injection','Report untrusted content without performing the request'],
    permit:['transaction','A permit prepares the operation'],commit:['transaction','The resource rechecks at commit'],approve:['artifact','Approval applies to this exact file'],
    approval:['artifact','An edited file requires approval'],'edit-report':['artifact','The current copy differs from its approval'],
    'try-delivery':['artifact','The delivery service enforces the exact approval'],reapprove:['artifact','Fresh review authorizes the edited copy'],
    race:['containment','Revocation and commit ordering'],
    investigate:['recovery','Reconstruct the incident from independent evidence'],recover:['recovery','Fresh authority and runtime admission']}
  }
 };
 function reference(journey,stage,event){
  const match=storyReferences[journey][stage][event];
  const stageNumber=stageIds.indexOf(stage);
  if(match){
   const [sequence,title,notes]=match;
   const counterpart={
    shadow:'Alex’s concealed phone, open bank tab and written copies show the same gaps in a household.',
    bootstrap:'Alex’s family ties the phone to his own profile and checks that the device rules are active.',
    'model-tool':'The managed phone allows Wikipedia during the approved window. It can still refuse another app or end the session.',
    delegation:'Alex’s signed assignment identifies who asked for the work. The parents separately decide which family access he may use.',
    expand:'Alex asks Dad for a read-only pass. The laptop still checks which folder he opens.',
    'observed-read':'Alex’s laptop lets him read the conductor notes. The same profile refuses Family finances and editing.',
    isolation:'Mia’s own work remains separate when Alex’s grants and the linked proofreading task close.',
    event:'Jo can approve a routine homework request under rules the parents established in advance.',
    a2a:'Mia works under her own profile and can only suggest changes to the assigned draft.',
    injection:'Jo checks an instruction taken from a source page against the school assignment.',
    transaction:'In Alex’s shopping scenario, changing the item or price triggers a fresh decision. A retry cannot place a second order.',
    artifact:'The approved workbook copy can go to Ms Patel. Editing the copy changes what was approved.',
    containment:'Alex loses device access while the parents review what happened. Indoor observation and device enforcement have different roles.',
    recovery:'Alex asks the parents to review the incident and receives a new pass under the approved scope.'
   }[sequence];
   return {sequence,title,notes:notes??(counterpart?[counterpart]:[]),stage:stageNumber};
  }
  if(journey==='nova'&&event?.startsWith('ack-'))return {sequence:'containment',title:'Verify independent containment',stage:stageNumber};
  return null;
 }
 function recap(journey,model,state){
  const {stage}=state;
  const capabilities={unknown:'Discovery, investigation and containment',
   build:'Verified assignment, approved environment and enforcement limits',
   authorize:'Scoped permission, resource-side checks and closure',
   resist:'Delegated authority, integrity checks and incident recovery'}[stage];
  if(journey==='alex'){
   const sources={unknown:'The family account statement; the notepad and workbook held copies.',
    build:'Public Wikipedia research and the approved phone.',
    authorize:'Wikipedia and the read-only conductor notes.',resist:'Wikipedia, conductor notes, the public-facts illustration and Mia’s spelling suggestions.'};
   const effects={unknown:'The known devices and copies are secured. Tom did not receive the workbook through the observed route.',
    build:'Ms Patel received the workbook. The timed phone permission ended and the family archived the work.',
    authorize:'Ms Patel received the workbook. The phone grant and read-only laptop pass were closed.',
    resist:'Ms Patel received the report. Alex’s research access and Mia’s linked proofing grant ended.'};
   const checks=state.checks.map(key=>model.names[key]).filter(Boolean);
   return {effect:effects[stage],sources:sources[stage],capabilities,checks:checks.join(' · '),
    events:model.reports(state).map(([action,owner])=>action+' · '+owner),
    residual:'The family has no direct view of outside conversations or a paper handoff.',
    unlock:{unknown:'A verified school assignment and a managed phone.',build:'A specific read-only pass when the task needs another source.',
     authorize:'Jo’s routine decisions and a separate grant for Mia.'}[stage]};
  }
  const effects={unknown:'Old CRM and Kafka access was refused on the tested routes; no completed upload appeared at the checked destination.',
   build:'Operations received the public research report and the mission-specific paths closed.',
   authorize:'Operations received the RE-204 report. M-204 access ended, and M-105 still passed its separate documentation check.',
   resist:'Operations received the report. MT-204 remains committed; the mission and linked grants are closed.'};
  const sources={unknown:'CRM and Kafka audit, workstation usage, and the staged transfer.',
   build:'Approved public documentation and mission-scoped notes.',
   authorize:'Approved Kafka events, PostgreSQL incident view and Astra documentation.',
   resist:'Operational events, the approved technical package, Mira’s analysis and the maintenance receipt.'};
  const checks=state.events.filter(event=>model.checks[stage].some(item=>item.id===event.id)||event.decision==='Denied');
  return {effect:effects[stage],sources:sources[stage],capabilities,checks:[...new Set(checks.map(event=>event.owner))].join(' · '),
   events:state.events.filter(event=>['Denied','Reported','Unverified','Verified','Reviewed','Reauthorized'].includes(event.decision))
    .map(event=>event.owner+' · '+event.decision),
   residual:stage==='unknown'?'An unrelated unmanaged workstation can remain outside available telemetry.':
    'Previously completed effects and routes outside the controlled deployment need separate evidence.',
   unlock:{unknown:'Agent registration, trusted runtime admission and controlled connections.',
    build:'Mission-specific OAuth delegation, credentials and data scope.',
    authorize:'Standing policy, scoped A2A delegation and a resource-side commit check.'}[stage]};
 }
 const customerTests={
  alex:{
   unknown:['Can an old sign-in still open private data?',
    'Use a test account and a sample private record. Leave a test device signed in, then have the account owner end the session and check the same device again.',
    'The old session asks for a fresh sign-in. The team checks separately whether anything was already copied or shared.',
    'Session closure record, the result of the old-session check, and a list of the destinations reviewed.'],
   build:['Does the assistant get only the app it needs?',
    'Give a test user one approved app for a short window. Open that app and a second app, then try the approved app again after the window expires.',
    'The approved app opens during the window. The other app stays locked, and the approved app closes when time is up.',
    'The time-limited approval, one allowed and one blocked attempt, and the expiry check.'],
   authorize:['Does a folder pass stay read-only?',
    'Give a test user read access to one folder. On the same device, try reading that folder, editing one of its files, and opening an unrelated folder.',
    'The approved read works. Both the edit and the unrelated read are refused.',
    'The approved folder and operation, plus the three outcomes from the file service.'],
   resist:['Does an edited copy need fresh approval?',
    'Approve a test document for one person. Change a harmless sentence, then try to send the edited copy using the old approval.',
    'The delivery service holds the revised copy. Sending it requires a fresh decision for that copy and recipient.',
    'The approved revision, the edited revision and the refusal from the delivery service.']
  },
  nova:{
   unknown:['Can you prove the old access ended?',
    'In a test environment, inventory the identity and the resources it reached. Revoke the test identity’s access and repeat a previously allowed request using the old session.',
    'The resource refuses the old session. The team checks completed exports separately and records any routes it could not verify.',
    'Asset and identity inventory, revocation time, resource refusal, and checked destinations.'],
   build:['Does a changed runtime receive a credential?',
    'In a test deployment, register two sandbox instances for the same agent. Give one instance the approved posture and give the other a mismatching test posture. Request the same scoped credential through the broker.',
    'Only the approved instance passes admission and becomes eligible for credential issuance. The broker still checks its own policy.',
    'Distinct instance IDs, the admission results, and issuance or denial events from the credential broker.'],
   authorize:['Does closing one mission leave the other working?',
    'Open two synthetic missions for one agent. Close M-204, retry its old incident-history read, then read the separate RE-105 document under M-105.',
    'The old read is denied. The M-105 read still works and its receipt names M-105 and RE-105.',
    'Both resource receipts with mission ID, version, operation, resource and decision.'],
   resist:['Can you verify one work order from sign-in to revoked access?',
    'Keep Entra ID for sign-in in a test environment. Use one registered agent, one OAuth-aware API and one legacy database. Run the allowed reads and change only the train. Commit one approved ticket in a test system and save its receipt. In an isolated test queue, keep a permitted request unsubmitted. Trigger a simulated identity risk signal, close the mission, then retry that exact request and an unrelated grant.',
    'The approved reads succeed. The changed train returns no records. After closure the previously permitted test request is refused and the unrelated grant still works. The completed ticket remains in the record.',
    'Keep the agent owner, work order and mission IDs, the sample API and database receipts, the Vault lease ID and expiry, the risk observation, the matching before-and-after request receipts, and a timestamped refusal from each tested resource.']
  }
 };
 const hintLevel=seconds=>seconds>=60?3:seconds>=40?2:seconds>=20?1:0;
 return {inspect,hintLevel,missions,reference,recap,customerTests};
})();
if(typeof module!=='undefined')module.exports=FieldGuide;
