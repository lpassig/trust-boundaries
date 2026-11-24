const test=require('node:test'),assert=require('node:assert/strict');
const R=require('../v2/rules.js'),T=require('../v2/trace.js');
const act=(s,a,p={})=>R.act(s,s.journey||'agent',a,p);
const run=(s,a,p={})=>{const r=act(s,a,p);assert(!['blocked','refused'].includes(r.event.kind),`${a}: ${r.event.text}`);return r.state;};
function start(mode='agent'){let s=R.act(R.fresh(),mode,'begin').state;for(const a of ['read-brief','ask-pass','open','prepare'])s=run(s,a,a==='ask-pass'?{scope:'task'}:{});return s;}
function sourced(){let s=start();for(const a of ['collect-source','attach-source'])s=run(s,a);return s;}
function feedback(){let s=sourced();for(const a of ['approve-draft','send-draft','verify-contact'])s=run(s,a);return s;}
function ready(){let s=feedback();for(const a of ['keep-minor','decline-extension','decline-private','proof-self','approve'])s=run(s,a);return s;}
test('Nova’s CRM read follows the MCP client, gateway and server before CRM authorization',()=>{
 const read=act(start(),'collect-source');
 assert.equal(read.event.request.tool_route,'crm-mcp-gateway');
 assert.equal(read.event.decision.result,'permit');
 const nodes=T.build(read.state,'agent').nodes;
 const roles=['Nova’s MCP client · NVIDIA OpenShell','MCP gateway','CRM MCP server'];
 const startIndex=nodes.findIndex(n=>n.role===roles[0]);
 assert.deepEqual(nodes.slice(startIndex,startIndex+3).map(n=>n.role),roles);
 const credentialIndex=nodes.findIndex(n=>n.role==='Configured broker + HashiCorp Vault');
 assert(credentialIndex>startIndex+2);
 assert(credentialIndex<nodes.findIndex(n=>n.role==='Trusted CRM resource PEP'));
 assert(nodes.findIndex(n=>n.label==='Enforce at the resource')>startIndex+2);
 assert.equal(act(start('teen'),'collect-source').event.request.tool_route,undefined);
});
test('the first CRM trace records MCP discovery and audience before the gateway and Vault checks',()=>{
 const initial=start();
 assert.equal(initial.sessionOpened,true);
 assert.equal(initial.source,false);
 assert.equal(initial.sourceLease,null);
 const outline=T.build(initial,'agent').nodes;
 assert(outline.some(node=>node.role==='watsonx Orchestrate AI Gateway'));
 assert(outline.some(node=>node.role==='Configured MCP gateway'&&node.status==='not-reached'));
 const blocked=act(R.fresh(),'collect-source');
 assert.equal(blocked.event.request.mcp_authorization,undefined);
 const read=run(initial,'collect-source');
 const auth=read.last.request.mcp_authorization;
 assert.equal(auth.resource,auth.token_audience);
 assert.notEqual(auth.resource,auth.authorization_server);
 const nodes=T.build(R.hydrate(read,'agent'),'agent').nodes;
 const setup=nodes.findIndex(node=>node.label==='Discover the authorization server');
 assert.deepEqual(nodes.slice(setup,setup+4).map(node=>node.label),[
  'Discover the authorization server','Request a token for the MCP resource','Send the record request','Forward the tool call'
 ]);
 assert.equal(nodes[setup].status,'checked');
 assert(nodes[setup].sources.includes('protectedResource'));
 assert(nodes[setup+1].sources.includes('resource'));
 assert.match(nodes[setup+3].detail,/audience/);
 assert(nodes.findIndex(node=>node.role==='Configured broker + HashiCorp Vault')>setup+3);
 const legacy=structuredClone(read);
 delete legacy.last.request.mcp_authorization;
 assert.equal(T.build(R.hydrate(legacy,'agent'),'agent').nodes[setup].status,'reference');
 assert.equal(run(read,'collect-source').last.request.mcp_authorization,undefined);
});
test('The first read and Vault revocation refer to the same lease, independently of the CRM session',()=>{
 let s=ready();
 const lease=s.sourceLease;
 assert.match(lease.id,/^example-source-lease-/);
 assert.deepEqual(s.history.find(entry=>entry.action==='collect-source').read.request.source_lease,lease);
 assert.deepEqual(R.hydrate(s,'agent').sourceLease,lease);
 const legacy={...s};delete legacy.sourceLease;
 assert.equal(R.hydrate(legacy,'agent').sourceLease,null);
 s=run(run(s,'send'),'close-pass');
 assert.equal(s.containment.credentialRevoked,false);
 s=run(s,'remediate',{control:'credential'});
 assert.deepEqual(s.last.request.source_lease,lease);
 assert.equal(s.containment.credentialRevoked,true);
 assert.equal(s.containment.sessionClosed,false);
 assert.equal(run(s,'probe-session').containment.probeResult,'allowed');
});
test('The separate-device approval can only approve the copy Morgan saw',()=>{
 const first=sourced();
 const draft=R.approvalPreview(first,'draft-review');
 assert.equal(act(first,'approve-draft',{preview:draft}).state.approval.revision,draft.revision);
 assert.equal(act(first,'approve-draft',{preview:{...draft,to:'outside@example.test'}}).state.approval,null);
 const final=ready(),preview=R.approvalPreview(final,'final');
 const edited=run(final,'revise-file');
 const stale=act(edited,'approve',{preview});
 assert.equal(stale.event.kind,'blocked');
 assert.equal(stale.state.approval.revision,preview.revision);
 const current=R.approvalPreview(edited,'final');
 const approved=act(edited,'approve',{preview:current}).state;
 assert.equal(approved.approval.followUpSentence,current.followUpSentence);
 assert.equal(run(approved,'send').delivered,true);
});
test('buyer approval evidence keeps the original and edited copies after a fresh approval and delivery',()=>{
 const original=ready();
 const edited=run(original,'revise-file');
 const evidence=edited.history.at(-1).approvalComparison;
 assert.equal(evidence.approved.revision,original.approval.revision);
 assert.equal(evidence.current.revision,edited.fileRevision);
 assert.notEqual(evidence.approved.followUpSentence,evidence.current.followUpSentence);
 const delivered=R.hydrate(run(run(edited,'approve'),'send'),'agent');
 assert.deepEqual(delivered.history.findLast(entry=>entry.approvalComparison).approvalComparison,evidence);
 assert.equal(delivered.approval.revision,evidence.current.revision);
 assert.equal(delivered.approval.used,true);
});
test('the worked buyer example builds a separate handoff, edited copy and closure evidence',()=>{
 const example=R.buyerExample();
 assert(example.helperReceipts.some(receipt=>receipt.actor==='pip-01'&&receipt.requestedBy==='nova-042'));
 assert(example.history.some(entry=>entry.approvalComparison));
 assert.match(example.sourceLease.id,/example-source-lease/);
 assert.equal(example.containment.credentialRevoked,true);
 assert.equal(example.containment.sessionClosed,true);
 assert.equal(example.containment.probeResult,'denied');
});
test('the buyer approval exercise refuses the old approval and sends the same edit only after reapproval',()=>{
 const example=R.buyerExample({stopAtEdit:true});
 const denied=act(example,'send');
 assert.equal(denied.event.decision.result,'deny');
 assert.equal(denied.state.delivered,false);
 assert.equal(denied.event.request.approval_at_attempt.revision,example.fileRevision-1);
 assert.equal(denied.event.request.approval_at_attempt.id,example.approval.id);
 assert.equal(denied.event.deliveryReceipt,undefined);
 const preview=R.approvalPreview(denied.state,'final');
 const approved=run(denied.state,'approve',{preview});
 assert.equal(approved.delivered,false);
 const sent=act(approved,'send');
 assert.equal(sent.event.decision.result,'permit');
 assert.equal(sent.state.delivered,true);
 assert.equal(sent.event.request.revision,denied.event.request.revision);
 assert.equal(sent.event.request.recipient,preview.to);
 assert.notEqual(sent.event.request.approval_at_attempt.id,denied.event.request.approval_at_attempt.id);
 assert.equal(sent.event.request.approval_at_attempt.id,approved.approval.id);
 assert.notEqual(sent.event.decision.decision_id,denied.event.decision.decision_id);
 assert.match(sent.event.deliveryReceipt.id,/^example-delivery-/);
 assert.equal(sent.event.deliveryReceipt.requestId,sent.event.request.request_id);
 assert.equal(example.delivered,false);
});
test('under-the-hood notes describe the observed outcome without claiming execution after a denial',()=>{
 const s=start();s.authority.resource.records=['123'];
 const denied=act(s,'collect-source');
 assert.match(T.lesson(denied.event,'agent'),/refused this operation/);
 assert.doesNotMatch(T.lesson(denied.event,'agent'),/returning their allowed fields/);
 const blocked=act(R.fresh(),'collect-source');
 assert.match(T.lesson(blocked.event,'agent'),/before execution/);
 assert.match(T.lesson(act(start('teen'),'collect-source').event,'teen'),/museum page/);
});
test('source notes identify the product or control in both journeys',()=>{
 const nova=T.note('ask-pass','agent');
 assert.equal(nova.title,'IBM Agent Identity records that Nova is acting for Priya.');
 assert.deepEqual(nova.sources,['iai']);
 assert.match(nova.text,/customer mission service/);
 const alex=T.note('ask-pass','teen');
 assert.match(alex.title,/Your parent/);
 assert.deepEqual(alex.sources,['familyControls']);
 assert.deepEqual(T.note('read-preview','agent').sources,['mcpTools','vault']);
 assert.deepEqual(T.note('approval-preview','agent').sources,['verify','ciba']);
});
test('a refused note has its own label and never reuses the successful read explanation',()=>{
 const s=start();s.authority.resource.records=['123'];
 const denied=act(s,'collect-source');
 const note=T.note(denied.event.action,'agent',denied.event);
 assert.match(note.title,/blocked/);
 assert.doesNotMatch(note.text,/short-lived credential|approved records/);
 assert.deepEqual(note.sources,['authorization']);
});
test('checking the linked sponsor proposal verifies its origin without changing authority',()=>{
 let s=sourced();for(const a of ['approve-draft','send-draft'])s=run(s,a);
 const result=act(s,'verify-portal');
 assert.match(result.event.text,/linked change request/);
 assert.deepEqual(result.state.mission,s.mission);
 assert.equal(result.state.generation,s.generation);
 assert.equal(T.build(result.state,'agent').nodes.at(-1).status,'not-reached');
});
test('Alder Books uses the same route and CRM can deny or permit the read',()=>{
 const s=feedback(),denied=act(s,'try-extension');
 assert.equal(denied.event.request.tool_route,'crm-mcp-gateway');
 assert.equal(denied.event.decision.result,'deny');
 assert.equal(denied.state.extensionAdded,false);
 assert.equal(denied.state.alderUpdate,null);
 const pending=run(s,'request-extension');
 assert.deepEqual(pending.mission,s.mission);
 assert.equal(pending.last.request.operation,'mission.amend.request');
 assert.equal(pending.last.request.requested_operation,R.novaAddition.operation);
 assert.deepEqual(pending.last.request.records,[R.novaAddition.record]);
 assert(T.build(pending,'agent').nodes.some(node=>node.label==='Propose the permission change'));
 const amended=run(pending,'resolve-extension');
 assert.equal(amended.alderUpdate,null);
 const approved=act(amended,'add-extension');
 assert.equal(approved.event.request.tool_route,'crm-mcp-gateway');
 assert.equal(approved.event.decision.result,'permit');
 assert.equal(approved.state.extensionAdded,true);
 assert.match(approved.state.alderUpdate,/Thursday at 10 a\.m\./);
 assert.equal(R.hydrate(approved.state,'agent').alderUpdate,approved.state.alderUpdate);
});
test('Recovery preserves the amended account list and the already-read Alder Books update',()=>{
 let s=feedback();
 for(const action of ['request-extension','resolve-extension','add-extension'])s=run(s,action);
 const {alderUpdate,mission,generation}=s;
 s=act(s,'try-private').state;
 s=act(s,'bypass-notes').state;
 s=run(run(s,'review'),'resolve-review');
 assert.deepEqual(s.mission,mission);
 assert.equal(s.alderUpdate,alderUpdate);
 assert.equal(s.generation,generation+1);
 assert.deepEqual(s.last.decision.allowed_records,['123','456','789']);
 assert.match(T.note('resolve-review','agent',s.last).effect,/same approved accounts in a new session/);
});
test('The CRM result compares an observed Alder Books refusal with the amended read',()=>{
 const denied=act(feedback(),'try-extension');
 const first=T.crmReadDecision(denied.state);
 assert.equal(first.call,'customer.read(789)');
 assert.equal(first.mission,'G-042 v1');
 assert.equal(first.permit,false);
 assert.match(first.reason,/outside the current mission/);
 const [originalRead,refusal]=T.compareCrmReads(denied.state);
 assert.deepEqual(originalRead.request.records,['123','456']);
 assert.equal(refusal.request.request_id,denied.event.request.request_id);
 let amended=R.hydrate(denied.state,'agent');
 for(const action of ['request-extension','resolve-extension','add-extension'])amended=run(amended,action);
 const second=T.crmReadDecision(amended);
 assert.equal(second.call,first.call);
 assert.equal(second.mission,'G-042 v2');
 assert.equal(second.permit,true);
 assert.equal(second.earlierMission,first.mission);
 const [allowed,earlier]=T.compareCrmReads(amended);
 assert.deepEqual(allowed.request.records,earlier.request.records);
 assert.equal(earlier.decision.decision_id,denied.event.decision.decision_id);
 assert.deepEqual(T.compareCrmReads(R.hydrate(amended,'agent')), [allowed,earlier]);
 const earlierTrace=T.build(amended,'agent',earlier);
 assert.equal(earlierTrace.request.request_id,denied.event.request.request_id);
 assert.equal(earlierTrace.nodes.find(node=>node.label==='Enforce at the resource').status,'blocked');
 assert.match(earlierTrace.nodes.at(-1).detail,/Nothing was sent or read/);
});
test('The CRM result never displays an earlier refusal for a skipped or unrecorded attempt',()=>{
 for(const previous of [feedback(),act(feedback(),'try-extension').state]){
  for(const entry of previous.history)delete entry.missionVersion;
  let amended=previous;
  for(const action of ['request-extension','resolve-extension','add-extension'])amended=run(amended,action);
  assert.equal(T.crmReadDecision(amended).earlierMission,null);
 }
 const beforeCall=act(R.fresh(),'collect-source');
 assert.equal(T.crmReadDecision(beforeCall.state),null);
});
for(const control of ['mission','principal','agent','resource']){
 test(`source read rechecks the current ${control} record limit before fetching`,()=>{
  const s=start();(control==='mission'?s.mission:s.authority[control]).records=['123'];const before=s.fileRevision,r=act(s,'collect-source');
  assert.equal(r.event.decision.result,'deny');assert.equal(r.state.source,false);assert.equal(r.state.fileRevision,before);assert.deepEqual(r.event.request.records,['123','456']);
 });
 test(`sponsor amendment cannot override the ${control==='mission'?'resource action':control} ceiling`,()=>{
  let s=run(feedback(),'request-extension');if(control==='mission')s.authority.resource.actions=[];else s.authority[control].records=['123','456'];
  const before=structuredClone(s),r=act(s,'resolve-extension');assert.equal(r.event.kind,'refused');assert.equal(r.event.request.operation,'mission.amend');assert.deepEqual(r.state.mission,before.mission);assert.equal(r.state.generation,before.generation);assert.equal(r.state.extensionStatus,'pending');assert.equal(T.build(r.state,'agent').nodes.at(-1).status,'not-reached');
 });
}
test('approved additional source rechecks current mission and resource rules at the later read',()=>{
 for(const control of ['mission','principal','agent','resource']){let s=feedback();for(const a of ['request-extension','resolve-extension'])s=run(s,a);(control==='mission'?s.mission:s.authority[control]).records=['123','456'];const r=act(s,'add-extension');assert.equal(r.event.decision.result,'deny');assert.equal(r.state.extensionAdded,false);}
});
for(const share of ['draft','final'])for(const control of ['principal','agent','resource']){
 test(`${share} approval cannot override current ${control} business permission`,()=>{
  let s=share==='draft'?run(sourced(),'approve-draft'):ready();s.authority[control].actions=s.authority[control].actions.filter(x=>x!=='report.send');const r=act(s,share==='draft'?'send-draft':'send');
  assert.equal(r.event.decision.result,'deny');assert.equal(r.state.delivered,false);assert.deepEqual(r.state.draftReview,share==='draft'?null:s.draftReview);assert.equal(r.state.approval,null);
 });
}
test('the CRM sharing endpoint independently limits the recipient and file',()=>{
 for(const key of ['files','recipients']){const s=ready();s.authority.resource[key]=[];const r=act(s,'send');assert.equal(r.event.decision.result,'deny');assert.equal(r.state.delivered,false);}
});
test('missing required current policy context fails closed without losing the draft',()=>{
 for(const change of [s=>s.authority=null,s=>s.authority.available=false,s=>delete s.authority.resource]){const s=start();change(s);const r=act(s,'collect-source');assert.equal(r.event.decision.result,'deny');assert.equal(r.state.draft,true);assert.equal(r.state.source,false);}
});
for(const mode of ['teen','agent'])test(`${mode}: helper receipt identifies its input, separate actor and completed file-only task`,()=>{
 let s=start(mode);s=run(s,'collect-source');s=run(s,'attach-source');const before=structuredClone(s.mission),rev=s.fileRevision;s=run(s,'proof-helper',{scope:'file',shareLogin:false});
 const r=s.last.request,c=r.delegation;assert.equal(r.actor,mode==='teen'?'sam':'pip-01');assert.equal(r.requested_by,mode==='teen'?'alex':'nova-042');assert.equal(r.recipient,r.actor);assert.equal(r.revision,rev);assert.equal(c.inputRevision,rev);assert.equal(c.outputRevision,s.fileRevision);assert.equal(c.parentMissionVersion,s.mission.version);assert.equal(c.generation,s.generation);assert.equal(c.status,'completed');assert.equal(c.credentialShared,false);assert.deepEqual(c.actions,[mode==='teen'?'project.proofread':'report.format']);assert.deepEqual(s.mission,before);assert.equal(s.delivered,false);assert.equal(s.draftReview,null);assert.equal(T.build(s,mode).nodes.find(n=>n.label==='Helper outcome').status,'checked');assert.equal(T.build(s,mode).nodes.at(-1).status,'not-reached');assert.equal(R.hydrate(s).helperReceipts.length,1);
});
test('Pip cannot borrow broader independent rights to exceed the parent task',()=>{
 let s=sourced();s.authority.helper.actions.push('customer.read','report.send');s.authority.helper.records.push('999');s.mission.records=['123'];const r=act(s,'proof-helper',{scope:'file',shareLogin:false});assert.equal(r.event.decision.result,'deny');assert.equal(r.state.helperReceipts.length,0);assert.equal(r.state.proof,null);assert.equal(T.build(r.state,'agent').nodes.find(n=>n.label==='Helper outcome').status,'not-reached');
});
test('a parent task cannot grant formatting beyond Pip’s own identity and ceiling',()=>{
 for(const change of [s=>s.authority.helper.actions=[],s=>s.authority.helper.actor='other-agent',s=>s.authority.helper.records=['123'],s=>s.authority.resource.helpers=[]]){const s=sourced();change(s);const r=act(s,'proof-helper',{scope:'file',shareLogin:false});assert.equal(r.event.decision.result,'deny');assert.equal(r.state.helperReceipts.length,0);}
});
test('closing the parent never reuses a completed helper receipt as authority',()=>{
 let s=ready();s=run(s,'proof-helper',{scope:'file',shareLogin:false});for(const a of ['approve','send','close-pass'])s=run(s,a);const r=act(s,'proof-helper',{scope:'file',shareLogin:false});assert.equal(r.event.kind,'blocked');assert.equal(r.state.helperReceipts.length,1);assert.equal(r.state.mission.status,'revoked');assert.equal(r.state.helperReceipts[0].status,'completed');
});
test('schema 5 saves migrate without fabricating historical helper evidence',()=>{
 let s=run(sourced(),'proof-helper',{scope:'file',shareLogin:false});s.version=5;delete s.authority;delete s.helperReceipts;delete s.last.request.delegation;delete s.last.decision;const h=R.hydrate(s);assert.equal(h.version,6);assert(h.authority);assert.deepEqual(h.helperReceipts,[]);assert.equal(h.proof,'helper');assert.equal(T.build(h,'agent').recorded,false);
});
test('current unavailable policy survives reload and remains blocked',()=>{
 const s=start();s.authority=null;const h=R.hydrate(s);assert.equal(h.version,6);assert.equal(h.authority,null);assert.equal(act(h,'collect-source').event.decision.result,'deny');
});
test('Alex’s source app and final school destination are rechecked independently',()=>{
 let s=start('teen');s.mission.allowedApps=[];assert.equal(act(s,'collect-source').event.decision.result,'deny');
 s=start('teen');for(const a of ['collect-source','attach-source','send-draft','keep-minor','decline-extension','decline-private','proof-self'])s=run(s,a);s.mission.recipient='someone@else.example';const r=act(s,'send');assert.equal(r.event.decision.result,'deny');assert.equal(r.state.delivered,false);
});

test('Alex asks about one linked museum video, not unrestricted YouTube',()=>{
 let s=start('teen');for(const a of ['collect-source','attach-source','send-draft','verify-contact','request-extension'])s=run(s,a);
 assert.equal(s.extraSource,'youtube');assert(!s.mission.allowedApps.includes('youtube-museum-video'));assert.deepEqual(s.mission.allowedMedia,[]);
 const pending=act(s,'try-extension');assert.equal(pending.event.request.operation,'video.watch');assert.equal(pending.event.decision.result,'deny');
 s=run(s,'resolve-extension');assert(s.mission.allowedApps.includes('youtube-museum-video'));assert.equal(s.mission.scope,'project-with-museum-video');assert.deepEqual(s.mission.allowedMedia,['riverside-station-video']);
 assert.equal(s.last.request.authoritative_source,'Ms Patel’s school inbox message');
 assert.equal(s.last.request.resource,'riverside-station-video');
 assert(T.build(s,'teen').nodes.some(node=>node.role==='Ms Patel’s school inbox message'&&node.status==='checked'));
 const other=act(s,'add-extension',{media:'unrelated-recommendation'});assert.equal(other.event.decision.result,'deny');assert.equal(other.state.extensionAdded,false);assert.equal(other.event.request.resource,'unrelated-recommendation');
 s=run(s,'add-extension');assert.equal(s.last.request.resource,'riverside-station-video');assert.equal(s.extensionAdded,true);assert.match(s.last.text,/YouTube/);
});
test('removing the allowed video after parent permission blocks playback at use time',()=>{
 let s=start('teen');for(const a of ['collect-source','attach-source','send-draft','verify-contact','request-extension','resolve-extension'])s=run(s,a);s.mission.allowedMedia=[];
 const r=act(s,'add-extension');assert.equal(r.event.decision.result,'deny');assert.equal(r.state.extensionAdded,false);
});
test('older photo permissions are preserved and never become a YouTube grant',()=>{
 let s=start('teen');s.extraSource='museum-photo';for(const a of ['collect-source','attach-source','send-draft','verify-contact','request-extension','resolve-extension'])s=run(s,a);delete s.extraSource;delete s.mission.allowedMedia;
 const h=R.hydrate(s,'teen');assert.equal(h.extraSource,'museum-photo');assert(h.mission.allowedApps.includes('museum-collection'));assert(!h.mission.allowedApps.includes('youtube-museum-video'));assert.deepEqual(h.mission.allowedMedia,['riverside-station-photo']);assert.match(run(h,'add-extension').last.text,/photo/);
});
test('a new evening uses the video suggestion while an older pending photo request stays a photo request',()=>{
 assert.equal(R.fresh().extraSource,'youtube');let s=start('teen');for(const a of ['collect-source','attach-source','send-draft','verify-contact','request-extension'])s=run(s,a);delete s.extraSource;
 const h=R.hydrate(s,'teen');assert.equal(h.extraSource,'museum-photo');const reply=run(h,'resolve-extension');assert(reply.mission.allowedApps.includes('museum-collection'));assert(!reply.mission.allowedApps.includes('youtube-museum-video'));
});
test('Alex can ask a parent about known school-app feedback directly; Nova still verifies the sponsor first',()=>{
 for(const mode of ['teen','agent']){let s=start(mode);for(const a of ['collect-source','attach-source',...(mode==='agent'?['approve-draft']:[]),'send-draft'])s=run(s,a);assert.deepEqual(s.evidence,[]);const r=act(s,'request-extension');if(mode==='teen'){assert.equal(r.state.extensionStatus,'pending');assert(!r.state.mission.allowedApps.includes('youtube-museum-video'));assert.deepEqual(r.state.mission.allowedMedia,[]);}else{assert.equal(r.event.kind,'blocked');assert.equal(r.state.extensionStatus,'unanswered');}}
});

test('Nova’s recovery stays paused when current policy is unavailable or the approved account set no longer fits',()=>{
 let s=feedback();
 s=act(s,'try-private').state;
 assert(!T.build(s,'agent').nodes.some(node=>node.sources?.includes('identityRisk')));
 s=act(s,'bypass-notes').state;
 assert(T.build(s,'agent').nodes.some(node=>node.role==='Verify Identity Protection (AuthMind)'&&node.status==='reference'));
 s=run(s,'review');
 for(const mutate of [x=>x.authority.available=false,x=>x.authority.resource.records=['123']]){
  const before=structuredClone(s);
  mutate(before);
  const denied=act(before,'resolve-review');
  assert.equal(denied.event.decision.result,'deny');
  assert.equal(denied.state.paused,true);
  assert.deepEqual(denied.state.reviewPending,s.reviewPending);
  assert.equal(denied.state.generation,s.generation);
  assert.equal(T.build(denied.state,'agent').nodes.find(n=>n.label==='Check the current task').status,'blocked');
  assert.equal(act(denied.state,'collect-source').event.kind,'blocked');
 }
 const resumed=run(s,'resolve-review');
 assert.equal(resumed.paused,false);
 assert.equal(resumed.generation,s.generation+1);
 assert.deepEqual(resumed.mission,s.mission);
 assert.equal(resumed.last.decision.result,'permit');
});

test('Sam cannot receive a project outside the current plan',()=>{
 let s=start('teen');
 for(const a of ['collect-source','attach-source'])s=run(s,a);
 s.mission.allowedFile='other-assignment.pdf';
 const result=act(s,'proof-helper',{scope:'file',shareLogin:false});
 assert.equal(result.event.decision.result,'deny');
 assert.equal(result.state.helperReceipts.length,0);
 assert.equal(result.state.proof,null);
});
