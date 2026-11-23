/* Fictional operation replay. This visualizer makes no live authentication or API calls. */
const RequestTrace = (() => {
 const node=(label,role,status,detail)=>({label,role,status,detail});
 function build(s,mode){
  const teen=mode==='teen',e=s.last,r=e?.request,a=e?.action||'',m=s.mission;
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
  if(s.ended&&['check','check-closing-basics','sign-out-laptop','remediate','probe-session','controller-offline','controller-online','close-pass','finish','replay-containment'].includes(a)){
   const c=s.containment,probe=c.probeResult;
   return model(teen?'Close the homework access you opened.':'Close this task’s actual access routes.',teen?'You and the school session controls check this task’s access. A missing reply is not proof of sign-out.':'Independent controllers test this old task session using separate control authority after the agent runtime stops. They do not reactivate the revoked business mission.',[
    node(teen?'Homework agreement closed':'Mission and delegation withdrawn',teen?'Parent':'Customer mission service + IBM Agent Identity','checked',teen?'This homework agreement ended. Your normal school account has not been disabled.':'This mission is revoked; new governed business requests are denied.'),
    node(teen?'Phone locked':'Runtime stopped',teen?'Phone control':'OpenShell controller','checked','The managed task runtime is stopped. The service session introduced at the start needs its own check.'),
    node(teen?'Quick sign-in on this laptop':'Task credential',teen?'School sign-in settings':'Configured Vault receiver',c.credentialRevoked?'checked':'warning',c.credentialRevoked?'This task-scoped access is disabled. An already-open service session may remain.':'This task-scoped access still needs revocation.'),
    node(teen?'The tab you opened':'The CRM session opened at the start','Service-owned session',!c.controllerReachable?'pending':c.sessionClosed?'checked':'warning',!c.controllerReachable?'The controller is unreachable. Closure is unverified.':c.sessionClosed?'The controller reports this task session closed. Retest the old route.':'This service session is still open.'),
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
    nodes.push(node('Read the authoritative mission','Customer mission service','checked',`${d.mission_id} version ${d.mission_version}; policy version ${d.policy_version}; allowed summary records ${d.allowed_records.join(', ')}. Owner: ${d.authority_source}.`));
    nodes.push(node('Observe the actual operation','Trusted CRM resource PEP','checked',`${r.operation}${r.resource?'; source '+r.resource:''}; requested records ${r.records.join(', ')||'none'}${r.file?'; file '+r.file:''}${r.recipient?'; recipient '+r.recipient:''}. Evidence comes from the operation, not Nova’s explanation.`));
    nodes.push(node('Evaluate the exact request','Authorization decision service · proposed PDP integration',denied?'blocked':'checked',`${d.result.toUpperCase()}: ${d.reason} AuthZEN is a candidate interface. Richer approval and execution-binding semantics remain an application contract.`));
   }
   if(r.approval_at_attempt){
    const approval=r.approval_at_attempt;
    nodes.push(node('Compare approval with the attempted send','Recorded approval + actual CRM request',denied?'blocked':'checked',
     `Approved revision ${approval.revision} to ${approval.to}, policy version ${approval.policyVersion}. Actual revision ${r.revision} to ${r.recipient}, policy version ${d.policy_version}. Request ${r.request_id} links the check to its outcome.`));
   }
   if(!teen&&r.operation==='customer.read'&&!denied){
    nodes.push(node('Use scoped source access','Configured broker + HashiCorp Vault','reference','In this deployment pattern the broker uses a short-lived source-read credential outside the model context. CRM still checks the record scope. Expiry limits reuse of the credential, and CRM manages its existing session separately.'));
   }
   nodes.push(node(teen?'The responsible control checks this operation':'Enforce at the resource',teen?d.pep:'CRM resource PEP',denied?'blocked':'checked',teen?(denied?`Refused at ${d.pep}: ${d.reason} The rest of the homework can continue.`:`Permitted at ${d.pep}: ${d.reason} Device/app permission and the resource’s own rules remain distinct.`):share?(denied?`The resource refuses the actual send: ${d.reason} No approval is consumed for delivery.`:`The actual revision ${r.revision}, records, recipient and current authority match the one-use human approval.`):'The resource enforces this request under the current mission and its own policy.'));
   nodes.push(node(share&&!denied?(draftShare?'Review copy delivered':'Final file delivered'):'Actual outcome','Fictional resource receipt','checked',denied?'Nothing was sent or read by this refused attempt. Authorized work remains available.':share?(draftShare?'The approved review copy was delivered. Feedback follows this receipt; the final version still needs its own share approval.':'The final agreed report was delivered. Later revocation does not recall either delivered copy.'):a==='add-extension'?'The specifically approved addition was read and included in the draft.':'The originally agreed source was read successfully. This is the useful first result before later requests.'));
   return model(teen?'Follow this permission check.':'Trusted request, current mission, enforced outcome.','Earlier context is distinguished from the current operation. All evidence and services are fictional.',nodes,{...r,decision:d});
  }
  if(['approve','approve-draft'].includes(a)&&s.approval)return model('Approve one exact business share.','The human sees the current copy and its purpose before approval; the CRM must still check the actual send.',[...context(),node('Human sees the transaction','Designated approver · optional IBM Verify/CIBA','checked',`${s.approval.purpose==='draft-review'?'Review copy':'Final delivery'}: ${r.file} revision ${s.approval.revision}, records ${r.records.join(', ')}, recipient ${r.recipient}. Policy version ${s.approval.policyVersion}. The application binds the approval to this actor, mission, copy, window and single use.`),node('Delivery','Resource PEP','not-reached','Approval alone has not delivered anything.')]);
  if(a==='open')return model('Open the task workspace.','The service session is introduced here, so its later closure is a known loose end.',[...context(),node('Runtime and task access ready','Configured controllers','checked','The workspace and task service session are open. No source data has been read yet.'),node('First useful resource read','Resource PEP','not-reached','Build the outline, then open the agreed source.')]);
  if(['apply-minor','keep-minor','prepare','attach-source','proof-self','revise-file','change-recipient','wait-approval'].includes(a))return model('A document change is not a mission change.','This local content or preview step creates no new business authority.',[...context(),node('Current document',teen?'Project version':'Report revision','checked',`Revision ${s.fileRevision}. The current ${teen?'agreement':'mission'} stays at version ${m.version}.`),node('Share approval',teen?'School submission policy':'Exact action binding',s.approval?'context':'pending',teen?'Your own reviewed work can use the permitted school destination.':s.approval?`Recorded revision ${s.approval.revision}; current revision ${s.fileRevision}. A stale or expired approval cannot execute.`:'Any changed content must receive an appropriate current approval before the confidential share.'),node('External delivery','Result','not-reached','This step sends no file.')]);
  return model('A task starts with a request.','A request, agreement, document and delivery are separate story events.',[...context(),node('Current step','Local story application','checked',e.text),node('External delivery','Result','not-reached','This step sends no file.')]);
 }
 return {build};
})();
if(typeof module!=='undefined')module.exports=RequestTrace;
