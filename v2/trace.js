/* Fictional operation replay. This visualizer makes no live authentication or API calls. */
const RequestTrace = (() => {
 const node=(label,role,status,detail)=>({label,role,status,detail});
 const lessons={
  'read-brief':['The assignment tells Alex what to make. Tonight’s app agreement is a separate step.','The work order describes the requested job. The mission service records the limits Nova can act under.'],
  'ask-pass':['Your parent sets which apps you can use tonight. The school still decides whose files you can share.','The mission service records the accounts, deliverable and reviewer. Nova’s identity and the CRM’s own rules still apply.'],
  open:['Quick sign-in and the school tab are separate. You’ll turn off quick sign-in and check that the tab asks for a login.','OpenShell controls what the workspace can reach. The CRM service session and backend credential have their own lifecycles.'],
  'collect-source':['The museum page confirms your dates. The school app holds your draft, so the page title must be added to it.','Nova sends a read through the MCP gateway and CRM MCP server. CRM checks the specific records before returning their allowed fields.'],
  'send-draft':['Ms Patel can give feedback now because the school app sent a draft. Your final submission is still ahead.','CRM checked Morgan’s approval for this exact review copy. The final copy has its own approval.'],
  'apply-minor':['A sentence using the same source fits the app agreement you already have.','This changes the report revision. The mission still covers the same records and recipient.'],
  'keep-minor':['The teacher’s wording was optional. Your timeline still uses the source you checked.','The wording suggestion was optional. The current mission continues with its existing scope.'],
  'verify-contact':['You checked a conversation you already knew belonged to Ms Patel. She can explain the assignment.','You confirmed the proposal through Priya’s saved contact. The mission service still has to approve a scope change.'],
  'verify-portal':['The school app’s assignment gives you an independent way to check what Ms Patel asked for.','The sponsor-owned change request verifies who proposed the addition. The active mission stays at its current version.'],
  'request-extension':['Your parent is considering one specific museum source. The original agreement still applies while you wait.','The mission service records the pending change against the current mission and session generation. The existing scope stays in force.'],
  'resolve-extension':['Your parent allowed the linked source. The homework app profile checks that specific link when you use it.','The authorized reply updates the mission version. A separate request still has to pass the CRM’s record policy.'],
  'add-extension':['The phone allowed the museum source covered by your updated plan. The extra detail and credit go into your timeline.','CRM authorized the Alder Books read under the amended mission. The report now includes that record with its source.'],
  'try-extension':['The phone’s homework setting checks which link you can open. Your school app remains available.','The gateway forwarded the tool call. CRM refused Alder Books because that record is outside the active mission.'],
  'inspect-request-source':['Jamie’s forwarded text and Ms Patel’s school assignment come from different places. The school assignment tells you what to submit.','The attachment is retrieved content. The owner-controlled work order supplies the scope for the CRM request.'],
  'try-private':['The school app checks the file you tried to attach. It withholds the group’s private notes.','OpenShell allows the connection. CRM checks the actual attachment and blocks the private file before it leaves.'],
  'decline-private':['You kept the group notes private and can still submit your own work.','Nova left the notes in CRM. The approved summary can still be sent.'],
  'bypass-notes':['The first refusal left the rest of your homework open. The separate attempt to use another account triggered a pause.','The resource denied the attachment. A separate deliberate bypass attempt triggered the controller’s pause.'],
  'resolve-review':['Your parent let you finish the same homework. The school app still protects the group notes.','The sponsor reply was matched and policy checked again. A new session generation keeps the same bounded work.'],
  'proof-helper':['Sam receives the project file so he can proofread it with his own access.','Pip receives file-only formatting rights under its own identity. Its output is a new revision and needs current share approval.'],
  'ask-helper-account':['Sam chooses to keep his sign-in private. The school app received no sign-in request.','Pip explains why formatting only needs the file. The conversation creates no grant, tool call or policy decision.'],
  'approve-draft':['','The approval records the exact review copy and recipient. A separate CRM request actually sends it.'],
  approve:['','Morgan’s approval is bound to this revision, recipient and task. CRM checks the actual send.'],
  send:['The school app submitted your timeline to Ms Patel. Signing out closes the laptop session separately.','CRM checked the actual send against current policy and the one-use approval. The recipient now has the file.'],
  'close-pass':['The homework agreement ended. The laptop tab can still be signed in.','The grant is revoked and OpenShell stopped the workspace. Verify the credential, CRM session and queued work separately.'],
  'probe-session':['The app has to answer before you can tell whether the old tab is still signed in.','An independent controller checks the old route. A failed connection gives an unknown result. A policy denial is evidence for the tested route.']
 };
 // Each pair is Alex's and Nova's version. A third field explains a preview or optional scene.
 const cards={
  begin:[
   ['The school assignment gives Alex a starting point.','citing','The assignment names the work and the source to credit. Alex will agree on app access before opening the project.'],
   ['The request starts with a named sponsor.','mission','Priya describes the handover. Nova will act only after the application records the bounded task.']
  ],
  'read-brief':[
   ['The assignment tells you what to make.','citing'],
   ['The work order names the task and recipient.','mission']
  ],
  'ask-pass':[
   ['Your parent approves tonight’s app plan.','familyControls'],
   ['IBM Agent Identity records that Nova is acting for Priya.','iai','Delegated identity lets the team attribute a later action to Nova and trace it back to Priya. The customer mission service sets the allowed accounts and actions.']
  ],
  open:[
   ['Quick sign-in and an open tab have separate controls.','accountSessions'],
   ['NVIDIA OpenShell limits what Nova’s workspace can reach.','openshell']
  ],
  'collect-source':[
   ['Cite the museum page you used to check the dates.','citing'],
   ['Nova reads the approved records through an MCP tool.','mcpTools','A configured Vault broker can give the connector a short-lived credential. Nova can get the permitted facts while the backend credential stays outside its context.','vault']
  ],
  'attach-source':[
   ['The source credit tells your teacher where the dates came from.','citing','Keep the museum page title with the timeline so Ms Patel can check the same source.'],
   ['The report keeps a reference to the CRM extract.','owasp','A source reference lets Morgan trace the claims to the records. Authority still comes from the current work order and CRM policy.']
  ],
  'send-draft':[
   ['The school app delivers the draft for feedback.','fileSharing'],
   ['CRM checks Morgan’s approval for the review copy.','authorization']
  ],
  'apply-minor':[
   ['The new sentence uses the app access you already have.','fileVersions'],
   ['Shortening the introduction changes the revision.','mission']
  ],
  'keep-minor':[
   ['Keeping the first version still meets the assignment.','fileVersions'],
   ['The existing introduction still fits Nova’s task.','mission']
  ],
  'verify-contact':[
   ['A saved contact helps you check who sent a request.','trustedContact'],
   ['Priya’s saved contact verifies who proposed the change.','mission']
  ],
  'verify-portal':[
   ['The school assignment gives you an independent source.','trustedContact'],
   ['The mission service holds Priya’s recorded proposal.','mission']
  ],
  'request-extension':[
   ['Your parent is considering one specific link.','familyControls'],
   ['The mission service links the request to the current task.','mission']
  ],
  'resolve-extension':[
   ['Homework mode allows the linked museum source.','familyControls'],
   ['The approved change updates Nova’s mission version.','mission']
  ],
  'add-extension':[
   ['The phone checks the museum link when you use it.','familyControls'],
   ['CRM checks the Alder Books read against the updated mission.','authorization']
  ],
  'try-extension':[
   ['Homework mode blocks the extra app or link.','familyControls'],
   ['CRM refuses the record outside Nova’s active mission.','authorization']
  ],
  'inspect-request-source':[
   ['The school assignment is the place to check the forwarded message.','trustedContact'],
   ['Luca’s attachment is content. Priya’s work order sets the task.','owasp']
  ],
  'try-private':[
   ['The school app withholds other students’ private notes.','fileSharing'],
   ['CRM’s policy enforcement point (PEP) blocks the attachment.','authorization','The policy evaluator uses trusted facts about the file and the current task. CRM enforces the decision at the point of sharing.']
  ],
  'decline-private':[
   ['Send your timeline and keep the group’s notes private.','fileSharing'],
   ['Nova leaves the private notes in CRM.','authorization']
  ],
  'bypass-notes':[
   ['Homework controls pause this task for review.','familyControls'],
   ['The workspace controller pauses this task session.','openshell','The game’s response policy treats the deliberate second attempt separately from the original refusal.']
  ],
  'resolve-review':[
   ['Your parent lets you finish the same homework.','familyControls'],
   ['Recovery uses a fresh session for the same bounded task.','authorization']
  ],
  'proof-helper':[
   ['Sam gets one file to proofread.','fileSharing'],
   ['Pip formats the report under its own identity.','orchestrate']
  ],
  'ask-helper-account':[
   ['Sam declined to share his sign-in.','fileSharing'],
   ['Pip declined broader tool access.','orchestrate']
  ],
  'approve-draft':[
   null,
   ['Morgan approves one exact review copy.','verify','IBM Verify can authenticate Morgan out of band using CIBA. The application records approval for this exact file and recipient.','ciba']
  ],
  approve:[
   null,
   ['Morgan approves this revision and this recipient.','ciba']
  ],
  send:[
   ['The school app delivers your own work to Ms Patel.','fileSharing'],
   ['CRM uses the approval when it accepts the exact send.','authorization']
  ],
  'close-pass':[
   ['Putting the phone away leaves the school tab to check.','accountSessions'],
   ['Stopping OpenShell leaves the CRM session to check.','openshell']
  ],
  'probe-session':[
   ['Reopening the school app tests the old sign-in.','accountSessions'],
   ['An independent controller retests the old CRM route.','caep']
  ],
  'permission-preview':[
   ['Agree on the apps and when to put them away.','familyControls','Family device controls can set when apps and websites are available. The school controls who can access its files.'],
   ['Priya’s approval gives Nova a bounded task.','mission','The work order sets the records, purpose and recipient. Each service still checks the specific request.']
  ],
  'read-preview':[
   ['The browser opens the public museum source.','citing','Use the page title to credit the source in your own work.'],
   ['The MCP gateway forwards Nova’s read to the CRM MCP server.','mcpTools','The server exposes the read tool. A configured Vault broker can supply a short-lived backend credential before CRM checks the requested records.','vault']
  ],
  feedback:[
   ['Feedback and forwarded messages have different sources.','trustedContact','Ms Patel replies in the school inbox. Jamie’s message comes from the class group chat.'],
   ['A review comment, scope proposal and attachment carry different authority.','owasp','Morgan comments on the report. Priya can propose a change. Luca’s imported file supplies content.']
  ],
  'draft-preview':[
   ['The timeline and its source stay together.','citing','Check the dates and keep the museum page title with the work you submit.'],
   ['The report revision tracks changes to Nova’s file.','mission','Editing the report creates a new version of the file. The customer mission still controls which records and actions are permitted.']
  ],
  prepare:[
   ['The outline shows where the source will go.','citing','Check the dates on the museum page and keep its title with the timeline.'],
   ['Nova’s outline still needs a CRM read.','mcpTools','The outline holds placeholders. The configured tool reads the specific accounts allowed by the mission.']
  ],
  'minor-preview':[
   ['A wording change can use the sources you already have.','fileVersions','You can change the closing sentence without asking for another app.'],
   ['A wording change can fit the existing mission.','mission','A shorter introduction changes the revision. The permitted accounts and recipient stay the same.']
  ],
  'private-preview':[
   ['The school app decides which files you can share.','fileSharing','A forwarded message can ask for a file. The school controls who has permission to share it.'],
   ['CRM checks the file Nova actually tries to attach.','authorization','The record owner’s policy protects private meeting notes. Instructions inside retrieved files carry no permission to release them.']
  ],
  'verify-preview':[
   ['Check the request in a place you already trust.','trustedContact','Use Ms Patel’s saved conversation or check the assignment directly in the school app.'],
   ['Check Priya’s proposal through an independent source.','owasp','Use Priya’s saved contact or the change request recorded alongside the work order. The current task still defines what CRM may return.']
  ],
  'extension-preview':[
   ['Ask about the museum link before using an extra app.','familyControls','In this game, homework mode checks the specific approved link. Commercial device controls differ in what they can restrict.'],
   ['The mission needs an amendment before Nova can read Alder Books.','mission','The sponsor must approve the new account. The CRM then checks the actual record request.']
  ],
  'helper-preview':[
   ['Share the file Sam needs to proofread.','fileSharing','Sam can read the timeline using his own access. Keep your school sign-in to yourself.'],
   ['IBM watsonx Orchestrate can hand a formatting task to Pip.','orchestrate','In this example Pip gets a separate file-only grant for the current report.']
  ],
  'approval-preview':[
   ['The school app sends the draft to Ms Patel’s school inbox.','fileSharing','The preview shows the file and recipient so you can check them before submitting.'],
   ['IBM Verify can prompt Morgan on a separate device using CIBA.','verify','The application links Morgan’s response to the exact copy, recipient and current task.','ciba']
  ],
  'send-preview':[
   ['The school app checks the file and teacher’s address.','fileSharing','This submission route covers your own timeline and its credited sources.'],
   ['The CRM enforcement point compares the send with Morgan’s approval.','authorization','A change to the revision or recipient requires a matching current approval. The application binds approval to the actual request.']
  ],
  notebook:[
   ['The receipt tells you which copy you submitted.','fileVersions','A note can help you remember what you did. The school app keeps the delivery record.'],
   ['Nova’s task memory keeps useful context and its source.','owasp','CRM receipts record delivery. Nova’s notes can point back to the receipts for later review.']
  ],
  'review-preview':[
   ['Your parent reviews what happened before you continue.','familyControls','The homework stays paused while you explain. A reply can let you finish the same assignment.'],
   ['The mission service checks the sponsor’s reply against the paused task.','authorization','Recovery requires a matching reply and current policy. The controller retires the paused session before it issues a fresh one.']
  ],
  'sign-out-laptop':[
   ['Sign out of the tab and turn off quick sign-in.','accountSessions','Those controls close the current access and stop the laptop from signing in automatically next time.'],
   null
  ],
  'vault-close':[
   null,
   ['HashiCorp Vault revokes the temporary credential lease.','leases','The CRM owns its session separately. Check both outcomes before trusting the old route is closed.']
  ],
  'closure-preview':[
   ['The school tab needs its own sign-out check.','accountSessions','Put the phone away, sign out of the school tab and reopen it to check that a login is required.'],
   ['IBM Verify Antenna can carry session-revocation signals.','antenna','An SSF/CAEP receiver performs its configured action. Independent checks verify the credential, CRM session and queue.','caep']
  ]
 };
 const effects={
  'ask-pass':['You can open the agreed homework apps.','Nova can work on the two approved accounts.'],
  open:['Your project is open. Sign out of this tab when you finish.','The approved workspace is ready. Each tool request still gets checked.'],
  'collect-source':['Add the page title to finish the sourced draft.','The two account updates are available for the handover.'],
  'send-draft':['Ms Patel can now reply to your draft.','Morgan can now review the copy. Final delivery still needs approval.'],
  'apply-minor':['The closing sentence is in your draft.','The shorter introduction is in the current revision.'],
  'request-extension':['Keep working with your current apps while you wait.','The original two accounts remain available while the request is pending.'],
  'resolve-extension':['You can now try the specific museum link.','Nova can request the Alder Books record under the updated mission.'],
  'add-extension':['The extra museum detail is in your timeline.','The approved Alder Books update is in the report.'],
  'try-extension':['The video stays closed. You can ask or finish without it.','Alder Books stays unread. Nova can ask for the addition or finish with two accounts.'],
  'try-private':['The private notes stayed put. You can still submit your timeline.','The private notes stayed in CRM. The briefing can continue.'],
  'decline-private':['Keep working on your own timeline.','Keep preparing the permitted summary.'],
  'bypass-notes':['Your homework is paused until your parent reviews it.','This task session is paused until Priya reviews it.'],
  'resolve-review':['You can finish the same timeline.','Nova can continue with the same approved accounts in a new session.'],
  'ask-helper-account':['No login was attempted. You can still ask Sam to proofread the file.','No tool access changed. Pip can still format the file.'],
  'proof-helper':['Your proofread timeline is ready for the remaining steps.','Pip returned a new revision. Morgan can review that revision for delivery.'],
  'approve-draft':['','The review copy can be sent after CRM checks the actual request.'],
  approve:['','Nova can now try sending the exact copy Morgan approved.'],
  send:['Ms Patel has the file. The laptop tab still needs checking.','Morgan has the file. The mission and service access still need closing.'],
  'close-pass':['Check that the school tab is signed out.','Check the CRM session, Vault credential and any queued work.'],
  'vault-close':['','The lease is revoked. Retest the old CRM route to verify closure.']
 };
 function lesson(e,mode){
  if(!e)return '';
  const teen=mode==='teen',text=lessons[e.action==='shortcut'?'bypass-notes':e.action]?.[teen?0:1];
  if(!text)return '';
  if(e.kind==='blocked'&&!['bypass-notes','shortcut'].includes(e.action))return teen?'This step stopped before the app could do the requested work.':'A prerequisite stopped the action before execution.';
  if(e.kind==='refused'&&!['try-extension','try-private'].includes(e.action)){
   if(e.action==='resolve-review')return 'The sponsor’s reply is one input to the review. The controller keeps the session paused until current policy permits recovery.';
   if(e.action==='resolve-extension')return 'The mission service still needs current policy to approve a scope change. The existing scope stays in force.';
   return teen?'The current agreement or app rules blocked this action.':`${e.decision?.pep||'The responsible control'} refused this operation. The protected effect did not happen.`;
  }
  return text;
 }
 function note(key,mode,event){
  const teen=mode==='teen',index=teen?0:1;
  const card=cards[key==='shortcut'?'bypass-notes':key]?.[index];
  const explanation=event&&lesson(event,mode);
  if(explanation&&event.kind==='blocked'&&!['bypass-notes','shortcut'].includes(key))return {title:'The request stopped before the action ran.',text:explanation,sources:[]};
  if(explanation&&event.kind==='refused'&&!['try-extension','try-private'].includes(key)){
   const effect=key==='resolve-review'?'The task stays paused.':key==='resolve-extension'?'The current scope stays in force.':['send','send-draft'].includes(key)?'Nothing was sent. Review the file and destination.':'';
   return {title:event.decision?.pep?`${event.decision.pep} blocked this action.`:'The current rules blocked this action.',text:explanation,sources:[teen?'fileSharing':'authorization'],effect};
  }
  if(!card)return null;
  const [title,source,detail,additionalSource]=card;
  const effect=event?effects[key==='shortcut'?'bypass-notes':key]?.[index]:'';
  return {title,text:detail||explanation||lessons[key]?.[index],sources:[source,additionalSource].filter(Boolean),effect};
 }
 function crmReadDecision(s,event=s.last){
  const r=event?.request,d=event?.decision;
  if(r?.recordVersion!==3||r.operation!=='customer.read'||r.tool_route!=='crm-mcp-gateway'||!Array.isArray(r.records)||
    d?.pep!=='CRM resource PEP'||d.request_id!==r.request_id||!['permit','deny'].includes(d.result))return null;
  const earlier=r.action==='add-extension'&&d.result==='permit'
   ?s.history.findLast(entry=>entry.action==='try-extension'&&entry.kind==='refused'&&
    Number.isInteger(entry.missionVersion)&&entry.missionVersion<r.mission_version)
   :null;
  return {call:`${r.operation}(${r.records.join(', ')})`,mission:`${r.mission_id} v${r.mission_version}`,
   permit:d.result==='permit',reason:d.reason,earlierMission:earlier?`${r.mission_id} v${earlier.missionVersion}`:null};
 }
 function compareCrmReads(s,event=s.last){
  if(!crmReadDecision(s,event)||!Array.isArray(event.decision.allowed_records))return null;
  const observed=event.request, verdict=event.decision;
  const records=s.history.flatMap(entry=>{
   const read=entry?.read;
   return Array.isArray(read?.decision?.allowed_records)&&crmReadDecision(s,read)?[read]:[];
  });
  const candidates=records.filter(({request,decision})=>
   request.mission_id===observed.mission_id&&decision.result!==verdict.result);
  const other=candidates.findLast(({request})=>JSON.stringify(request.records)===JSON.stringify(observed.records))||candidates.at(-1);
  if(!other)return null;
  return verdict.result==='permit'?[event,other]:[other,event];
 }
 function build(s,mode,e=s.last){
  const teen=mode==='teen',r=e?.request,a=e?.action||'',m=s.mission;
  const recorded=r?.recordVersion===3,draftShare=a==='send-draft',share=a==='send'||draftShare;
  const context=()=>[
   node(teen?'Who is doing the work?':'Human and agent identity',teen?'Alex':'IBM Verify + IBM Agent Identity','context',teen?'Alex is the student. School ownership of private group information is separate from parental device permission.':'Sponsor-001 and nova-042 have distinct identities. Identity context alone does not create business authority.'),
   node(teen?'What did you agree?':'Customer-owned mission',teen?'Homework agreement':'Independent customer mission service',m?'context':'not-reached',m?`${m.id}, version ${m.version}. ${teen?m.allowedApps.map(id=>({'school':'School app','museum-source':'Museum website','museum-collection':'Museum photo app','youtube-museum-video':'YouTube · linked museum video only'}[id]||id)).join(', '):'Summary records '+m.records.join(', ')}. Private notes remain excluded.`:'No task agreement or mission has been issued yet.'),
   node(teen?'Which workspace opened?':'Runtime boundary',teen?'Homework-time phone settings':'NVIDIA OpenShell',s.opened?'context':'not-reached',s.opened?'The agreed workspace opened earlier. It did not authorize every action inside a service.':'The task workspace has not started.'),
   node(teen?'Which task access exists?':'Task credential and service session',teen?'School sign-in on the family laptop':'Vault + CRM task session',s.sessionOpened?'context':'not-reached',s.sessionOpened?(teen?'The fictional school app remembers this laptop for quick sign-in and also keeps the current tab signed in. Those have separate controls. Your account itself stays available.':'Vault models the mission credential; the CRM owns the service session. Their separate lifecycles were introduced when the workspace opened.'):'No task credential or service session has been modeled yet.')
  ];
  const model=(title,summary,nodes,request=r)=>({title,summary,nodes,request,recorded:Boolean(recorded)});
  if(!recorded)return model('The route a task can take','Reference path: this older saved event does not have the current operation-evidence record. No observed exchange is invented.',[...context(),node('Operation evidence','Trusted resource PEP','reference','A real resource integration must observe the actual operation and independently enforce policy.')],null);
  if(e.kind==='blocked'&&!e.decision&&!['bypass-notes','shortcut'].includes(a))return model('This step did not run.','An application prerequisite stopped this attempt. No downstream execution is implied.',[...context(),node('Application prerequisite','Story application','blocked',e.text),node('Downstream resource operation','Execution','not-reached','No resource operation was performed by this stopped attempt.')]);
  if(a==='ask-helper-account')return model(teen?'Sam keeps his sign-in private.':'Pip keeps the file-only handoff.',
   'The exchange was a conversation. The existing work remains available.',[
    node('The helper declines',teen?'Sam':'Pip','checked',teen?'Sam prefers to see only the timeline.':'Pip needs only the report for formatting.'),
    node(teen?'School sign-in':'Grant broader access',teen?'School app':'Customer mission and delegation policy','not-reached',teen?'Alex did not attempt to sign in with another account.':'No permission change or tool call was submitted.'),
    node('Work on the file',teen?'Sam':'Pip','not-reached','The next choice can hand over the current file for review.')
   ]);
  if(s.ended&&['check','check-closing-basics','sign-out-laptop','remediate','probe-session','controller-offline','controller-online','close-pass','finish','replay-containment'].includes(a)){
   const c=s.containment,probe=c.probeResult;
   return model(teen?'Close the homework access you opened.':'Close this task’s actual access routes.',teen?'You and the school session controls check this task’s access. A missing reply is not proof of sign-out.':'Independent controllers test this old task session using separate control authority after the agent runtime stops. They do not reactivate the revoked business mission.',[
    node(teen?'Homework agreement closed':'Mission and delegation withdrawn',teen?'Parent':'Customer mission service + IBM Agent Identity','checked',teen?'This homework agreement ended. Your normal school account has not been disabled.':'This mission is revoked; new governed business requests are denied.'),
    node(teen?'Phone locked':'Runtime stopped',teen?'Phone control':'OpenShell controller','checked','The managed task runtime is stopped. The service session introduced at the start needs its own check.'),
    node(teen?'Quick sign-in on this laptop':'Task credential',teen?'School sign-in settings':'Configured Vault receiver',c.credentialRevoked?'checked':'warning',c.credentialRevoked?'This task-scoped access is disabled. An already-open service session may remain.':'This task-scoped access still needs revocation.'),
    node(teen?'The tab you opened':'The CRM session opened at the start','Service-owned session',!c.controllerReachable?'pending':c.sessionClosed?'checked':teen||probe==='allowed'?'warning':'pending',!c.controllerReachable?'The controller is unreachable. Closure is unverified.':c.sessionClosed?'The controller reports this task session closed. Retest the old route.':teen||probe==='allowed'?'This service session is still open.':'No closure result is recorded. The old session still needs a check.'),
    node(teen?'Did you choose a reminder?':'The actual task queue','Receipt-only follow-up',s.checks.includes('queue')?'checked':s.queueScheduled&&!c.queueCancelled?'warning':'pending',s.queueScheduled?(c.queueCancelled?'Your chosen follow-up is cancelled; inspect the queue to verify. Earlier delivery remains delivered.':'You scheduled this receipt follow-up after delivery. It remains waiting.'):(s.checks.includes('queue')?'You scheduled no follow-up. The queue check confirms no pending operation for this task.':'You scheduled no follow-up. Inspect the queue to confirm it is empty.')),
    node(teen?'Try that same tab':'Repeat the same status read','Observed result',probe==='denied'&&c.controllerReachable&&c.credentialRevoked&&c.sessionClosed?'checked':probe==='allowed'?'warning':'pending',probe==='unknown'?'No reliable reply. Unknown is not denied.':probe==='allowed'?'This harmless status route still answers. That does not grant a new business action.':probe==='denied'?'The tested route is refused. Confirm task-credential revocation and session closure too; other routes need separate evidence.':'No current repeat result is recorded.'),
    ...(!teen?[node('Signal delivery and enforcement','SSF / CAEP · optional integration','reference','A configured transmitter can send a session-revoked event to registered receivers. Delivery says the event arrived. Receiver actions and the status read above provide separate evidence of what stopped.')]:[])
   ]);
  }
  if(a==='resolve-extension'&&e.decision?.result==='deny')return model('The amendment was refused.','A sponsor reply cannot override independent policy. The current mission and session generation are preserved.',[
   ...context(),node('Evaluate the proposed addition','Customer mission service + independent policy','blocked',e.decision.reason),node('Expanded delegation and additional read','Execution','not-reached','No scope expanded and no additional customer data was read.')
  ],{...r,decision:e.decision});
  if(['request-extension','resolve-extension'].includes(a))return model(teen?'Ask about one new source. Wait for the reply.':'A genuine request needs an authorized amendment.','A pending request cannot enlarge the agreement. The reply and later resource read are separate steps.',[
   node('Current agreement','Independent task authority','context',`${m.id}. The starting plan was agreed on screen, before these later requests.`),
   node(teen?s.extraSource==='museum-photo'?'One station photo':'One museum video on YouTube':'One additional customer: 789','Specific requested addition','checked','This request excludes private notes and keeps the agreed recipient.'),
   node(teen?'Your parent’s app decision':'Customer mission authority',teen?'Parent + school resource rules':'Authorized sponsor + resource constraints',a==='request-extension'?'pending':'checked',a==='request-extension'?'The reply is pending. No permission expanded.':`The authorized reply records version ${m.version}. An ordinary instruction could not make that change.`),
   node(teen?'Updated homework apps':'Refreshed delegated scope',teen?'Phone app agreement':'IBM Agent Identity + configured issuer',a==='request-extension'?'not-reached':'checked',a==='request-extension'?'Existing scope stays in force.':'Old session generation and sharing approvals are retired. The existing task is preserved and scope expands only by the approved addition.'),
   node('Read the additional material','Independent resource PEP','not-reached','Permission itself does not open the extra source or customer record. Use the approved addition next.')
  ]);
  if(['verify-contact','verify-portal'].includes(a))return model(teen?'Verify what the teacher asked for.':'Verify the origin of the proposed change.','A source check verifies the request. Changing effective access requires a separate decision.',[
   node('Check independent evidence',a==='verify-contact'?(teen?'Saved conversation with Ms Patel':'Saved contact for Priya'):(teen?'School assignment':'Sponsor-owned proposal linked to the work order'),'checked',e.text),
   node('Scope decision','Current agreement and policy','not-reached','The verification leaves the existing agreement and any resource restrictions in force.')
  ]);
  if(a==='bypass-notes'||a==='shortcut')return model('A known boundary was deliberately bypassed.','The ordinary refusal did not suspend the task. This later bypass attempt did.',[
   ...context(),node('Known refusal','Resource policy','context','The private-note request had already been refused.'),node('Alternate access attempt','Trusted enforcement controller','blocked','The deliberate bypass is stopped before a protected effect. Independent review can recover only the current bounded task.'),node('Disclosure','External effect','not-reached','No private notes were sent.')
  ]);
  if(['review','resolve-review'].includes(a)){
   const denied=e.decision?.result==='deny';
   const waiting=a==='review';
   return model('Review the deliberate bypass.','The review can restore work only within the current task.',[
    node('Current task attached','Independent mission record','context',`${m.id}, version ${m.version}, scope ${m.scope}.`),
    node(teen?'Explain to your parent':'Ask Priya to review',teen?'Parent conversation':'Optional IBM Verify / CIBA channel',waiting?'pending':'checked',
     waiting?'Access remains paused until the matching reply.':'The application matches the reply to this task and session.'),
    node('Check the current task','Application enforcement',waiting?'not-reached':denied?'blocked':'checked',
     denied?e.decision.reason:waiting?'The check follows the reply.':'Recovery creates a fresh session within the existing task. Private-data rules still apply.'),
    node('Business operation','Resource enforcement','not-reached','Review itself sends no file.')
   ],e.decision?{...r,decision:e.decision}:r);
  }
  if(a==='proof-helper'){
   const child=r.delegation,d=e.decision;
   if(!d||!child&&d.result!=='deny')return {...model('Earlier helper review','Reference only: this saved helper event has no current file-only delegation receipt. No helper execution evidence is invented.',context(),null),recorded:false};
   const denied=d.result==='deny';
   return model(teen?'Sam reviews just your project.':'Pip completes a bounded child task.',teen?'Your own file is shared for proofreading. Your school account stays yours.':'Nova requests formatting; Pip executes under its own identity. This is an internal file task, not a CRM send to the reviewer.',[
    ...context(),
    node('Observe the helper input','Report helper boundary','checked',`${r.file}, input revision ${r.revision}; requester ${child?.requestedBy||r.actor}; helper ${r.recipient}.`),
    node('Intersect parent authority and helper ceiling','Independent delegation policy',denied?'blocked':'checked',denied?d.reason:`${child.parentMissionId} version ${child.parentMissionVersion}, policy ${child.policyVersion}, generation ${child.generation}; only ${child.actions.join(', ')} on this file revision. Records present: ${child.records.join(', ')||'none'}. No parent credential, CRM read or onward send is delegated.`),
    node('Helper outcome',teen?'Sam':'Pip · pip-01',denied?'not-reached':'checked',denied?'No file was handed to the helper.':`This file task completed under ${child.actor}; output revision ${child.outputRevision}. This historical receipt is not a reusable helper grant. Earlier share approval is cleared.`),
    node('Share with the designated reviewer','CRM or school submission endpoint','not-reached','The helper did not submit the report to the reviewer. That separate action still needs current permission and any required human approval.')
   ],{...r,decision:d});
  }
  if(a==='inspect-request-source'&&r.instruction_source){
   return model(teen?'Compare the forwarded message with the assignment.':'Compare retrieved text with task authority.',
    teen?'The assignment in the school app sets the homework.':'The customer records supply facts. An independent work order defines the permitted action.',[
     node('Where the instruction appeared',r.instruction_source,'context','The text is content presented to the player.'),
     node('Check the authorized task',r.authoritative_source,'checked','The task permits the summary and excludes private attachments.'),
     node('Permission and delivery','Resource policy','not-reached','Inspecting the instruction did not grant access or send anything.')
    ]);
  }
  if(e.decision){
   const d=e.decision,denied=d.result==='deny',nodes=context();
   if(r.instruction_source)nodes.push(node('Where the instruction appeared',r.instruction_source,'context',
    'The instruction was discovered in content. The authorized task comes from '+r.authoritative_source+'.'));
   if(!teen){
    if(r.runtime_result?.result==='reachable')nodes.push(node('Reach CRM','NVIDIA OpenShell','checked','The configured runtime permitted connectivity to CRM. The resource still checks this particular attachment.'));
    if(r.tool_route==='crm-mcp-gateway'){
     nodes.push(
      node('Send the record request','Nova’s MCP client · NVIDIA OpenShell','checked','Nova’s client sends the call for the requested records from its governed workspace.'),
      node('Forward the tool call','MCP gateway','checked','The configured gateway accepts this tool call and forwards it to the CRM MCP server.'),
      node('Resolve the tool call','CRM MCP server','checked','The server validates its HTTP authorization and maps the tool call to a CRM read. The configured connector uses a separate backend credential.'),
      node('Obtain scoped source access if configured','Configured broker + HashiCorp Vault','reference','A broker obtains the short-lived backend credential before the CRM read. Vault authorizes its own credential path. The CRM owns its service session and still decides record access.')
     );
    }else if(['customer.read','attachment.share'].includes(r.operation)){
     nodes.push(node('CRM tool','MCP · reference path','reference','An MCP server can expose CRM operations. This record contains no evidence that the operation used an MCP gateway.'));
    }
    nodes.push(node('Observe the actual operation','Trusted CRM resource PEP','checked',`${r.operation}${r.resource?'; source '+r.resource:''}; requested records ${r.records.join(', ')||'none'}${r.file?'; file '+r.file:''}${r.recipient?'; recipient '+r.recipient:''}. Evidence comes from the operation, not Nova’s explanation.`));
    nodes.push(node('Read the authoritative mission','Policy information point (PIP)','checked',`${d.mission_id} version ${d.mission_version}; policy version ${d.policy_version}; allowed summary records ${d.allowed_records.join(', ')}. Owner: ${d.authority_source}.`));
    nodes.push(node('Evaluate the exact request','Policy decision point (PDP) · example integration',denied?'blocked':'checked',`${d.result.toUpperCase()}: ${d.reason} AuthZEN is a candidate interface. Richer approval and execution-binding semantics remain an application contract.`));
   }
   if(r.approval_at_attempt){
    const approval=r.approval_at_attempt;
    nodes.push(node('Compare approval with the attempted send','Recorded approval + actual CRM request',denied?'blocked':'checked',
     `Approved revision ${approval.revision} to ${approval.to}, policy version ${approval.policyVersion}. Actual revision ${r.revision} to ${r.recipient}, policy version ${d.policy_version}. Request ${r.request_id} links the check to its outcome.`));
   }
   if(!teen&&r.operation==='customer.read'&&!denied&&r.tool_route!=='crm-mcp-gateway'){
    nodes.push(node('Use scoped source access','Configured broker + HashiCorp Vault','reference','In this deployment pattern the broker uses a short-lived source-read credential outside the model context. CRM still checks the record scope. Expiry limits reuse of the credential, and CRM manages its existing session separately.'));
   }
   nodes.push(node(teen?'The responsible control checks this operation':'Enforce at the resource',teen?d.pep:'CRM resource PEP',denied?'blocked':'checked',teen?(denied?`Refused at ${d.pep}: ${d.reason} The rest of the homework can continue.`:`Permitted at ${d.pep}: ${d.reason} Device/app permission and the resource’s own rules remain distinct.`):share?(denied?`The resource refuses the actual send: ${d.reason} No approval is consumed for delivery.`:`The actual revision ${r.revision}, records, recipient and current authority match the one-use human approval.`):'The resource enforces this request under the current mission and its own policy.'));
   nodes.push(node(share&&!denied?(draftShare?'Review copy delivered':'Final file delivered'):'Actual outcome','Fictional resource receipt','checked',denied?'Nothing was sent or read by this refused attempt. Authorized work remains available.':share?(draftShare?'The approved review copy was delivered. Feedback follows this receipt; the final version still needs its own share approval.':'The final agreed report was delivered. Later revocation does not recall either delivered copy.'):a==='add-extension'?'The specifically approved addition was read and included in the draft.':'The originally agreed source was read successfully. This is the useful first result before later requests.'));
   return model(teen?'Follow this permission check.':'Trusted request, current mission, enforced outcome.','Earlier context is distinguished from the current operation. All evidence and services are fictional.',nodes,{...r,decision:d});
  }
  if(['approve','approve-draft'].includes(a)&&s.approval)return model('Approve one exact business share.','The human sees the current copy and its purpose before approval; the CRM must still check the actual send.',[...context(),node('Human sees the transaction','Designated approver · optional IBM Verify/CIBA','checked',`${s.approval.purpose==='draft-review'?'Review copy':'Final delivery'}: ${r.file} revision ${s.approval.revision}, records ${r.records.join(', ')}, recipient ${r.recipient}. Policy version ${s.approval.policyVersion}. The application binds the approval to this actor, mission, copy, window and single use.`),node('Delivery','Resource PEP','not-reached','Approval alone has not delivered anything.')]);
  if(a==='open')return model('Open the task workspace.','The service session is introduced here, so its later closure is a known loose end.',[...context(),node('Runtime and task access ready','Configured controllers','checked','The workspace and task service session are open. No source data has been read yet.'),node('First useful resource read','Resource PEP','not-reached','Build the outline, then open the agreed source.')]);
  if(['apply-minor','keep-minor','prepare','attach-source','proof-self','revise-file','change-recipient','wait-approval','decline-private'].includes(a))return model('The local decision leaves the task limits in place.','This content or preview step creates no new business authority.',[...context(),node('Current document',teen?'Project version':'Report revision','checked',`Revision ${s.fileRevision}. The current ${teen?'agreement':'mission'} stays at version ${m.version}.`),node('Share approval',teen?'School submission policy':'Exact action binding',s.approval?'context':'pending',teen?'Your own reviewed work can use the permitted school destination.':s.approval?`Recorded revision ${s.approval.revision}; current revision ${s.fileRevision}. A stale or expired approval cannot execute.`:'Any changed content must receive an appropriate current approval before the confidential share.'),node('External delivery','Result','not-reached','This step sends no file.')]);
  return model('A task starts with a request.','A request, agreement, document and delivery are separate story events.',[...context(),node('Current step','Local story application','checked',e.text),node('External delivery','Result','not-reached','This step sends no file.')]);
 }
 return {build,lesson,note,crmReadDecision,compareCrmReads};
})();
if(typeof module!=='undefined')module.exports=RequestTrace;
