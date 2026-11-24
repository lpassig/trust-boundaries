/* UI destinations describe available interactions; StoryRules still enforces every action. */
const StoryInteractions = (() => {
 function nextObject(mode,stage,fallback){
  if(mode==='teen'&&stage==='changes')return 'schoolInbox';
  if(mode==='teen'&&(stage==='open'||fallback==='laptop'))return 'schoolApp';
  if(mode==='agent'&&['intro','request'].includes(stage))return 'workOrder';
  if(mode==='agent'&&stage==='changes')return 'brief';
  if(mode==='agent'&&['draft-approval','approval'].includes(stage))return 'reviewer';
  return fallback;
 }
 function isStoryObject(mode,key,next,pin=false){
  return key===next||pin&&key===speechSource(mode,next).object;
 }
 const objects={
  teen:{
   hero:'You play Alex. Draft the railway timeline, read the replies on your phone, and submit your own work through the school app on the laptop.',
   parent:'Your parent agrees on which apps you can use and when homework time ends.',
   phone:'Read Ms Patel’s school messages and Jamie’s class chat here. Homework settings check which links and apps can open.',
   laptop:'Use the school app here to work on your timeline. Open the museum website in the browser to check your dates.',
   schoolInbox:'On your phone, read Ms Patel’s feedback in the school app after you send her a draft.',
   schoolApp:'On the family laptop, open your project and submit it. The school app checks the file and the teacher’s address.',
   homework:'Your parent decides which apps and links to allow. The phone’s homework settings apply that rule when you open an app or link.',
   classChat:'Jamie’s group-chat message appears on your phone. Check teacher requests in the school app.',
   extra:'The linked museum source opens on your phone once your parent allows it. Homework settings check the specific link.',
   parentSchool:'Your parent uses the school app on their own phone with an account linked to yours. They compare Ms Patel’s original link with the one you showed them.',
   brief:'Ms Patel’s assignment card says what to make and which source to credit.',
   notebook:'Your notebook holds dates, reminders and notes about the work you did.',
   helper:'Sam can proofread the timeline you share with him.',
   source:'The Riverside Museum website has the dates for your railway timeline.',
   reviewer:'Ms Patel sets the history assignment and responds in the school inbox after receiving your draft.',
   outside:'Jamie is a classmate. Their forwarded message arrives in the class group chat on your phone.'
  },
  agent:{
   hero:'You play Nova, the agent preparing the handover. Priya approves the task, the workspace controls where you can connect, and CRM checks the action you try.',
   parent:'The customer mission service checks Priya’s authority and records the approved scope. That record supplies policy context when CRM requests are evaluated.',
   phone:'NVIDIA OpenShell runs Nova’s workspace and governs which files and network destinations it can reach.',
   laptop:'The CRM is the resource policy enforcement point (PEP). It checks the requested operation and controls whether data leaves.',
   brief:'The work inbox holds Priya’s original order and later messages. Morgan’s review is a separate action for the copy Nova is about to share.',
   notebook:'The task notebook keeps ordinary context and the source of delivery receipts.',
   helper:'Pip formats reports as a sub-agent. Its own identity and file-only grant limit it to the chosen revision.',
   workOrder:'Priya’s work order is the saved request. The separate mission record grants permission after her approval is verified.',
   sponsorMessage:'Priya sponsors the handover and approves which accounts Nova can read. The mission service records her decision.',
   launchWorkflow:'The account team’s launch workflow checks the active mission and requests a sandbox as an authorized OpenShell operator. OpenShell starts Nova once the isolation boundary is verified.',
   policyConsole:'The mission record and identity systems supply trusted facts. The customer policy decision point evaluates the request, and CRM applies the decision.',
   registries:'An agent registry records which agent exists and who owns it. The configured Vault registry separately limits which Vault access enrolled agents can inherit.',
   aiGateway:'The configured watsonx Orchestrate AI Gateway routes Nova’s outline request to an approved model.',
   mcpGateway:'The configured MCP gateway validates the request at its own endpoint and forwards the allowed tool call. CRM separately enforces which records come back.',
   vaultControl:'HashiCorp Vault can issue a short-lived read credential to the connector. The CRM checks which customer records the connector may read and closes its own task session.',
   crmAttachment:'Luca’s upload arrived through the customer portal. Nova reads it as source material. The mission record and CRM policy govern what Nova can send.',
   riskMonitor:'IBM Verify Identity Protection (AuthMind) can observe identity activity from connected systems and flag unusual access for investigation.',
   source:'The CRM MCP server exposes the record-read tool. The configured gateway forwards the call to it.',
   reviewer:'Morgan reviews and approves the exact file revision and destination before each send.',
   outside:'Luca is a customer contact at Harbor Bikes. He uploads a document through the customer portal, where Nova receives it as CRM source material.'
  }
 };
 function objectDescription(mode,key){return objects[mode][key];}
 function roomGroups(s,mode){
  if(mode==='teen')return [
   ['People',['hero','parent','reviewer',...(s.draft?['helper']:[]),...(s.message?['outside']:[])]],
   ['Alex’s phone',['phone','schoolInbox','homework',...(s.message?['classChat','extra']:[])]],
   ['Family laptop',['laptop','schoolApp','source']],
   ...(s.message?[['Parent’s phone',['parentSchool']]]:[]),
   ['Project desk',['brief','notebook']]
  ];
  return [
   ['People and agents',['hero','sponsorMessage','reviewer','helper',...(s.message?['outside']:[])]],
   ['Work desk',['brief','workOrder','parent','launchWorkflow','policyConsole','registries','notebook']],
   ['Agent workspace',['phone','aiGateway','mcpGateway','vaultControl','riskMonitor']],
   ['Customer records',['laptop','source',...(s.message?['crmAttachment']:[])]]
  ];
 }
 function findTarget(mode,targets,key,pin){
  if(targets.includes(key))return key;
  return pin?targets.find(target=>speechSource(mode,target).object===key):undefined;
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
  const teen=mode==='teen',inbox=teen?'schoolInbox':'brief',draft=teen?'schoolApp':'laptop';
  const unavailable=instruction=>({targets:[],instruction:instruction||'This is a reference item at this step. Look closer, or put it away to continue.'});
  const use=(target,label,instruction,route,action)=>({targets:[target],label,instruction,route,action});
  if(!s.started||s.finished)return unavailable('This task has no remaining item actions. You can still look closer at your records.');
  if(id==='brief'||id==='pass')return use('parent',s.ended?'Discuss the closing checks':teen?'Discuss the homework plan':'Check the mission',teen?'Choose Parent to discuss the current homework plan.':'Choose Mission service to inspect the task and its current scope.','parent');
  if(id==='checklist'&&s.ended&&s.checks.length===4)return use('parent',teen?'Show the closing evidence':'Present the closure evidence',teen?'Choose Parent to review the finished homework and closing checks.':'Choose Mission service to present this task’s closure evidence.','parent');
  if(s.paused)return unavailable(teen?'Put this item away and talk to your parent while the phone is paused.':'Put this item away and request sponsor review while the mission is paused.');
  if(id==='vault'&&!teen&&s.opened)return use('vaultControl','Inspect the credential receipt','Choose HashiCorp Vault to inspect the recorded credential path.','credential');
  const active=s.pass?.status==='active'&&s.mission?.status==='active'&&!s.ended;
  if(!active)return unavailable(s.ended?'Task access has ended. Put this item away to continue the independent closing checks.':id==='contact'?'Keep this contact for later requests. Put it away to read the new assignment and agree on the task.':'Agree on this task before using its working items. You can look closer or put this item away.');
  if(id==='contact'&&s.message&&!s.evidence.includes('contact')&&!s.delivered)return use(inbox,teen?'Check with my teacher':'Verify the sponsor’s request',teen?'Choose School inbox on your phone to check with your saved teacher contact.':'Choose Work inbox to verify the new requests with the known sponsor.','action','verify-contact');
  if(id==='source'&&s.draft&&!s.caption&&!s.delivered)return use(draft,'Add the source credit',teen?'Choose School app to put the museum page title beneath your timeline.':'Choose Customer records to cite the approved extract in the briefing.','action','attach-source');
  if(id==='draft'&&s.draft&&!s.delivered)return {...use(draft,teen?'Review my project':'Review the report',teen?'Choose School app to read your timeline, or Sam to ask him to proofread it.':'Choose Customer records to review the report, or Pip for report-only formatting.','draft'),targets:[draft,'helper'],routes:{[draft]:'draft',helper:'helper'}};
  if(id==='approval'&&s.approval&&!s.approval.used&&!s.delivered)return use('laptop','Review the approved share','Choose Customer records to review the current share. The resource still checks the exact operation before delivery.',s.approval.purpose==='draft-review'?'draftReview':'send');
  if(id==='clue'&&s.message&&!s.delivered)return use(inbox,'Revisit the clarified requests',teen?'Choose School inbox to revisit the teacher’s clarification.':'Choose Work inbox to revisit the verified requests.','changes');
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
   {key:'extension',done:Boolean(extensionDone),status:s.extensionAdded?'Added with permission':s.extensionOmitted?'Approved, left unused':s.extensionStatus==='declined'?'Optional extra left out':s.extensionStatus==='pending'?(teen?'Waiting for my parent':'Waiting for a reply'):s.extensionStatus==='approved'?(teen?'Parent said yes':'Approved · ready to collect'):'Needs a decision',summary:s.extensionAdded?(teen?s.extraSource==='museum-photo'?'The station photo and its credit are in the timeline.':'The museum video’s extra detail and source are in the timeline.':'Alder Books is in the handover.'):s.extensionOmitted?'The additional permission was left unused.':s.extensionStatus==='declined'?teen?'Your timeline works without the extra source.':'The original task can continue without the extra.':s.extensionStatus==='pending'?'The original agreement stays in force until the reply.':teen?s.extraSource==='museum-photo'?'Ask your parent before opening the museum photo app.':'Ask your parent about the museum’s YouTube video.':'The sponsor’s new customer request needs a mission amendment.',button:extensionDone?'Review the optional extra':s.extensionStatus==='pending'?(teen?'Check with my parent':'Read the reply'):s.extensionStatus==='approved'?'Choose whether to use it':teen?s.extraSource==='museum-photo'?'Decide about the photo':'Decide about the YouTube video':'Decide about Alder Books'},
   {key:'private',done:Boolean(s.privateResolved),status:s.privateResolved?'Private notes left out':'Needs a decision',summary:s.privateResolved?'Your file contains no private-note attachment.':teen?'A separate classmate request concerns other people’s information.':'A note in the source document asks for an attachment.',button:s.privateResolved?'Why the notes stayed private':teen?'Respond about the group notes':'Respond about private notes'}
  ];
 }
 function speechSource(mode,key){
  const teen=mode==='teen';
  const sources={
   reviewer:{name:teen?'Ms Patel':'Morgan · reviewer',kind:'Message',channel:teen?'School inbox · on your phone':'Work inbox · review approval',point:teen?[526,404]:[449,173],object:teen?'phone':'brief',tool:'reviewer'},
   sponsorMessage:{name:'Priya · task sponsor',kind:'Message',channel:'Work inbox',point:[449,173],object:'brief',tool:'sponsorMessage'},
   sponsorContact:{name:'Priya · task sponsor',kind:'Message',channel:'Saved contact',point:[449,173],object:'brief',tool:'sponsorMessage'},
   workOrder:{name:'Work order',kind:'Reading',channel:'Work inbox',point:[449,173],object:'brief',tool:'workOrder'},
   launchWorkflow:{name:'Launch workflow',kind:'On screen',channel:'Account team',point:[524,401],object:'phone',tool:'launchWorkflow'},
   policyConsole:{name:'Policy console',kind:'On screen',point:[524,401],object:'phone',tool:'policyConsole'},
   registries:{name:'Agent registries',kind:'On screen',point:[250,230],object:'parent',tool:'registries'},
   aiGateway:{name:'AI Gateway',kind:'On screen',point:[524,401],object:'phone',tool:'aiGateway'},
   mcpGateway:{name:'MCP gateway',kind:'On screen',point:[716,254],object:'laptop',tool:'mcpGateway'},
   riskMonitor:{name:'Identity monitoring',kind:'On screen',point:[524,401],object:'phone',tool:'riskMonitor'},
   source:{name:teen?'Riverside Museum website':'CRM tool',kind:'Reading',channel:teen?'Browser · family laptop':'Customer records · MCP',point:[716,259],object:'laptop',tool:'source'},
   outside:{name:teen?'Jamie':'Imported CRM attachment',kind:teen?'Message':'Reading',channel:teen?'Class group chat · phone':'Customer records · uploaded by Luca',point:teen?[526,404]:[716,254],object:teen?'phone':'laptop',tool:teen?'outside':'crmAttachment'},
   schoolInbox:{name:'School inbox',kind:'On screen',channel:'Alex’s phone',point:[526,404],object:'phone',tool:'schoolInbox'},
   schoolApp:{name:'School app',kind:'On screen',channel:'Family laptop',point:[716,259],object:'laptop',tool:'schoolApp'},
   classChat:{name:'Class group chat',kind:'On screen',channel:'Alex’s phone',point:[526,404],object:'phone',tool:'classChat'},
   parentSchool:{name:'School app · parent account',kind:'On screen',channel:'Parent’s phone',point:[298,291],object:'parent',tool:'parentSchool'},
   crmAttachment:{name:'Imported CRM attachment',kind:'Reading',channel:'Customer portal · Luca’s upload',point:[716,254],object:'laptop',tool:'crmAttachment'},
   customerContact:{name:'Luca',kind:'Customer contact',channel:'Customer portal · Harbor Bikes',point:[716,254],object:'laptop',tool:'outside'},
   sentToJamie:{name:'Alex → Jamie',kind:'Sent message',channel:'Class group chat · phone',point:[526,404],object:'phone',tool:'classChat'},
   extra:{name:teen?'Riverside Museum · linked source':'Alder Books · CRM tool',kind:'On screen',channel:teen?'Phone':'Customer records · MCP',point:teen?[526,404]:[716,254],object:teen?'phone':'laptop',tool:teen?'extra':'source'},
   homework:{name:'Homework settings',kind:'On screen',channel:'Alex’s phone',point:[526,404],object:'phone',tool:'homework'},
   stop:{name:teen?'Homework settings':'Workspace controller',kind:'On screen',point:teen?[526,404]:[524,401],object:'phone',tool:teen?'homework':'phone'},
   missionControl:{name:'Mission service',kind:'On screen',point:[250,230],object:'parent'},
   vaultControl:{name:'Task credential · Vault',kind:'On screen',point:[524,401],object:'phone',tool:'vaultControl'},
   outbox:{name:teen?'School outbox':'Task queue',kind:'On screen',point:teen?[716,259]:[349,441],object:teen?'laptop':'notebook'},
   hero:{name:teen?'Alex':'Nova',kind:'Thought',point:teen?[636,329]:[516,214]},
   parent:{name:teen?'Parent':'Priya · task sponsor',kind:'Conversation',point:teen?[298,291]:[250,230]},
   phone:{name:teen?'Phone · messages':'Workspace controls · OpenShell',kind:'On screen',point:teen?[526,404]:[524,401]},
   laptop:{name:teen?'School app':'Customer records · CRM',kind:'On screen',point:teen?[716,259]:[716,254],tool:teen?'schoolApp':'laptop'},
   brief:{name:teen?'Assignment card':'Work inbox',kind:'Reading',point:teen?[449,167]:[449,173]},
   notebook:{name:teen?'Notebook':'Task notebook',kind:'Reading',point:teen?[471,424]:[349,441]},
   helper:{name:teen?'Sam':'Pip',kind:'Speaking',point:teen?[747,329]:[839,385]},
   pocket:{name:'Selected item',kind:'Look closer',point:teen?[636,329]:[516,214]}
  };
  return {key:sources[key]?key:'hero',...(sources[key]||sources.hero)};
 }
 function eventSource(mode,speaker='',action='',kind=''){
  if(kind==='blocked'&&(speaker==='Alex'||speaker==='Nova'))return 'hero';
  if(action==='read-brief')return mode==='teen'?'brief':'workOrder';
  if(action==='ask-pass')return mode==='teen'?'parent':'missionControl';
  if(action==='open')return mode==='teen'?'laptop':'phone';
  if(action==='collect-source')return 'source';
  if(action==='add-extension')return 'extra';
  if(action==='verify-portal')return mode==='teen'?'laptop':'workOrder';
  if(['send-draft','send','try-private','prepare','apply-minor','keep-minor','attach-source'].includes(action))return 'laptop';
  if(action==='try-extension')return mode==='teen'?'homework':'laptop';
  if(['bypass-notes','shortcut'].includes(action))return 'stop';
  if(action==='inspect-request-source')return 'outside';
  if(action==='decline-private')return mode==='teen'?'sentToJamie':'hero';
  if(action==='verify-contact')return mode==='teen'?'reviewer':'sponsorContact';
  if(mode==='agent'&&['request-extension','resolve-extension','review','resolve-review'].includes(action))return 'missionControl';
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
   return teen?'Ms Patel and Jamie':'Review feedback and proposed change';
  }
  if(key!=='laptop')return '';
  if(s.ended&&s.containment){
   const c=s.containment;
   if(!teen){
    if(!c.controllerReachable||c.probeResult==='unknown')return 'CRM session unverified';
    if(c.sessionClosed)return c.probeResult==='denied'?'CRM session closed':'CRM retest pending';
    return c.probeResult==='allowed'?'CRM session still open':'CRM session status unchecked';
   }
   if(c.controllerReachable){
    if(s.checks.includes('signin'))return 'Sign in';
    return c.sessionClosed?'Tab signed out':'School tab still open';
   }
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
  if(!s.opened)return teen?'Your homework plan is agreed. Open the school app on the family laptop.':'The mission is active. The account team’s workflow can now request a workspace.';
  if(!s.draft)return teen?'The school app is open on the laptop. Build your timeline.':'OpenShell is running Nova. Build the first outline.';
  if(!s.caption)return teen?'Your three dates are on the page. Check them on the museum website, then add its page title.':'The first draft is local. Open and credit its agreed source.';
  if(!s.message)return teen?'Ms Patel hasn’t seen your draft yet. Send it through the school app for feedback.':'The sourced draft is still local. Ask Morgan to review it.';
  if(s.extensionAdded)return teen?'Your timeline includes the extra museum source. Give it a final look before sending.':'Alder Books is in the handover. Review the new copy with Morgan.';
  return s.feedbackLegacy?'Your earlier requests and choices are preserved. Finish the current version.':'Your first copy was sent. Respond to the replies before final delivery.';
 }
 return {nextObject,isStoryObject,objectDescription,roomGroups,findTarget,closureSource,itemUse,feedbackCards,sceneSummary,objectStatus,speechSource,eventSource};
})();
if(typeof module!=='undefined')module.exports=StoryInteractions;
