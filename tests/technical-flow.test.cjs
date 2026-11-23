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
 assert(nodes.findIndex(n=>n.label==='Enforce at the resource')>startIndex+2);
 assert.equal(act(start('teen'),'collect-source').event.request.tool_route,undefined);
});
test('Alder Books uses the same route and CRM can deny or permit the read',()=>{
 const s=feedback(),denied=act(s,'try-extension');
 assert.equal(denied.event.request.tool_route,'crm-mcp-gateway');
 assert.equal(denied.event.decision.result,'deny');
 assert.equal(denied.state.extensionAdded,false);
 const approved=act(run(run(s,'request-extension'),'resolve-extension'),'add-extension');
 assert.equal(approved.event.request.tool_route,'crm-mcp-gateway');
 assert.equal(approved.event.decision.result,'permit');
 assert.equal(approved.state.extensionAdded,true);
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
 s=act(s,'bypass-notes').state;
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
