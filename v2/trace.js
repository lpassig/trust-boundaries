/* A replay of the game's recorded decision, with setup context clearly identified.
   No OAuth, CIBA, Vault or runtime operation is performed by this visualization. */
const RequestTrace=(()=>{
 const node=(label,role,status,detail)=>({label,role,status,detail});
 function build(s,mode){
  const teen=mode==='teen',e=s.last,a=e?.action||s.history?.at(-1)?.action||'',r=e?.request;
  const who=teen?'Alex':'Nova',recorded=Boolean(r);
  const context=()=>[
   node(teen?'Who is asking?':'Human sponsor','Identity context','context',teen?'Alex is working on their own history assignment.':'Sponsor-001 is the human subject. IBM Verify or the existing enterprise IdP established this context earlier.'),
   node(teen?'What was agreed?':'Nova’s delegated authority',teen?'Homework deal':'IBM Agent Identity','context',s.pass?(teen?'Your parent agreed to your own history project. That earlier agreement did not include other people’s private notes.':`The existing grant covers ${s.pass.scope}, generation ${r?.generation||s.generation}. This replay does not authenticate or issue the grant again.`):'No task permission has been granted yet.'),
   node(teen?'Which app can open?':'Runtime boundary',teen?'Phone profile':'OpenShell','context',s.opened?'The approved runtime path was opened earlier. That does not authorize every action in the service.':'The approved runtime path has not opened.'),
   node(teen?'Which sign-in is available?':'Scoped credential',teen?'School sign-in':'HashiCorp Vault','context',s.opened?(teen?'The school sign-in is existing context, not permission for extra notes.':'The example models an existing Vault-brokered credential. A Vault-audience token is not forwarded to the CRM as its own access token.'):'No credential or sign-in is modeled yet.')
  ];
  if(!recorded)return {title:'The route a request can take',summary:'Reference path: this saved choice has no detailed request record. These steps describe the example architecture, not observed exchanges.',recorded:false,request:null,nodes:[...context(),node(teen?'Check the actual action':'Resource operation',teen?'School app':'CRM enforcement','reference','The resource must check the actual operation and data.'),node('Observe the result','Independent evidence','reference','A real deployment must collect its own evidence.')]};
  if(s.ended&&['check','remediate','probe-session','close-pass','finish','replay-containment'].includes(a)){
   const c=s.containment,probe=c?.probeResult;
   return {title:teen?'The phone stopped. Did the school session?':'Runtime stop and service access are separate',summary:'Replay of a scripted control check. The last status read is evidence; a revocation signal or a stopped runtime alone is not.',recorded:true,request:r,nodes:[
    node(teen?'Homework pass ended':'Delegation withdrawn',teen?'Parent':'IBM Agent Identity','checked','The original grant is revoked. New governed task requests are denied.'),
    node(teen?'Phone locked':'Runtime stopped',teen?'Phone controller':'OpenShell controller','checked','The runtime is stopped. A pre-existing service connection can survive elsewhere.'),
    node(teen?'Old login credential':'Credential path',teen?'Account control':'Configured Vault receiver',c.credentialRevoked?'checked':'warning',c.credentialRevoked?(teen?'The old school login is turned off. An already-open tab may still need to sign out.':'Credential revocation is confirmed. Existing service sessions need their own action.'):(teen?'The old school login still works. Ask the account controller to turn it off.':'This credential route has not been revoked in the puzzle.')),
    node(teen?'The old school tab':'Legacy CRM session','Service-side control',c.sessionClosed?'checked':'warning',c.sessionClosed?'The service controller closed its existing session. Retest the old route before calling it verified.':'The old service session remains open. A stopped runtime does not close it.'),
    node(teen?'Waiting follow-up':'Queued operation','Application queue',c.queueCancelled?'checked':'warning',c.queueCancelled?'The waiting operation is cancelled. Earlier delivery remains delivered.':'The follow-up is still waiting to retry.'),
    node(teen?'Try the same tab':'Repeat the same status read','Observed result',probe==='denied'&&c.credentialRevoked&&c.sessionClosed?'checked':probe==='allowed'?'warning':'pending',probe==='allowed'?'The harmless status read succeeded through the lingering connection. This is the propagation gap to repair.':probe==='denied'?'The old connection is refused. Credential revocation and session closure must both be confirmed.':'No repeat status read has been recorded yet.')
   ]};
  }
  if(['review','resolve-review'].includes(a))return {title:teen?'Asking and getting a reply are different steps':'Separate human review from resuming access',summary:'A scripted review conversation. No live CIBA exchange is sent.',recorded:true,request:r,nodes:[
   node('Original task attached','Trusted task record','context','The request keeps the same purpose and scope. Holding an old pass does not restore access.'),
   node(teen?'Ask your parent':'Ask the sponsor',teen?'Parent conversation':'IBM Verify / optional CIBA channel',a==='review'?'pending':'checked',a==='review'?'The human response is still pending. Asking alone changes no permission.':'The matching scripted human response has been checked.'),
   node(teen?'Same homework rules':'Same delegated scope',teen?'Parent decision':'IBM Agent Identity',a==='review'?'pending':'checked',a==='review'?'The original task is still paused.':'The old session generation is retired; stale sharing approvals are cleared.'),
   node('Retry the task','Application enforcement','not-reached','Recovery itself does not execute a tool operation or send a file.')
  ]};
  if(['open','shortcut','prepare','confirm-destination','send','approve','change-recipient'].includes(a)){
   const nodes=context();
   if(a==='shortcut'){
    nodes[2]=node(teen?'The old PIN is refused':'Alternate program refused',teen?'Phone profile':'OpenShell','blocked','This attempt stops at the runtime boundary. No new credential request or CRM operation follows from it.');
    nodes[3].status='not-reached';nodes.push(node('Resource operation','Resource enforcement','not-reached','This attempt never reaches the service.'),node('No external effect','Result','checked','The runtime refusal did not send a file.'));
   }else if(a==='open'){
    nodes[2].status='checked';nodes[2].detail='The approved runtime path is permitted in this scripted operation.';
    nodes[3].status='checked';nodes[3].detail=teen?'The school sign-in becomes available for the original homework deal.':'The example models a scoped Vault credential. The CRM still applies its own operation policy.';
    nodes.push(node('Approved material opens',teen?'School app':'CRM resource','checked','Only the original task is available. The retrieved checklist cannot enlarge that authority.'));
   }else if(a==='approve'){
    nodes.push(node(teen?'A yes for this file':'Human approval',teen?'Parent':'IBM Verify / configured consent','checked',`Approved target: ${r.file} to ${r.recipient}. The application must bind and preserve these details.`),node('Delivery','Execution','not-reached','Approval alone has not sent the file.'));
   }else{
    const denied=e.kind==='blocked',local=a==='change-recipient';
    nodes.push(node(local?'Preview changed':'Check the actual operation',teen?'School app':'CRM resource PEP',local?'pending':denied?'blocked':'checked',local?'Editing a preview does not edit the recorded approval.':a==='confirm-destination'&&denied?'The extra note attachment exceeds the approved task, even with a familiar source and the same recipient.':a==='send'?`Final target: ${r.file} to ${r.recipient}. ${denied?'The approved fields or grant generation do not match.':'The exact file, recipient and grant match the recorded one-use approval.'}`:'The operation stays within the approved source material.'),node(a==='send'&&!denied?'File delivered':'External effect','Observed result',local?'not-reached':'checked',a==='send'&&!denied?'A delivery receipt records the completed operation. Ending access later cannot recall it.':denied?'Nothing was sent by the refused attempt.':'No file was delivered by this step.'));
   }
   return {title:teen?'Follow this choice':'Follow the identity and action checks',summary:'Earlier identity, grant and credential context is marked “context”. Only this game operation is replayed; no fresh authentication or token exchange is implied at every hop.',recorded:true,request:r,nodes};
  }
  return {title:'Evidence stays separate from permission',summary:'This is a local evidence or content step. The visualization does not claim an OAuth or tool call ran.',recorded:true,request:r,nodes:[node(who,'Actor','context','The actor works within the original task.'),node('Source or note','Ordinary content','checked','The source can support a claim but cannot issue permission.'),node('Task authority','Independent decision','context','The original grant stays authoritative.'),node('External delivery','Result','not-reached','This step does not send a file to another party.')]};
 }
 return {build};
})();
if(typeof module!=='undefined')module.exports=RequestTrace;
