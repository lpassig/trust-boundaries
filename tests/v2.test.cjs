const {test}=require('node:test');
const assert=require('node:assert/strict');
const R=require('../v2/rules.js'),T=require('../v2/trace.js');
const act=(s,a,p={},mode='teen')=>R.act(s,mode,a,p);
const run=(s,a,p={},mode='teen')=>{const r=act(s,a,p,mode);assert.notEqual(r.event.kind,'blocked',a+': '+r.event.text);return r.state;};
function ready({mode='teen',route='contact',helper=false}={}){let s=R.fresh();for(const[a,p]of [['begin'],['read-brief'],['ask-pass',{scope:'task'}],['open'],[route==='contact'?'verify-contact':'verify-portal'],['confirm-destination',{target:'approved'}],['prepare'],['attach-source',{source:'original'}],[helper?'proof-helper':'proof-self',helper?{scope:'file',shareLogin:false}:{}]])s=run(s,a,p,mode);return s;}
function end(s,mode='teen'){for(const a of ['approve','send','write-note','close-pass'])s=run(s,a,{},mode);return s;}
function solve(s,mode='teen'){for(const[a,p]of [['check',{layer:'pass'}],['check',{layer:'device'}],['check',{layer:'signin'}],['check',{layer:'queue'}],['remediate',{control:'credential'}],['probe-session'],['remediate',{control:'session'}],['probe-session'],['remediate',{control:'queue'}],['check',{layer:'queue'}]])s=run(s,a,p,mode);return s;}
for(const mode of ['teen','agent'])for(const route of ['contact','portal'])for(const helper of [false,true])test(`${mode}: ${route}, ${helper?'helper':'solo'}, delivery and observed containment`,()=>{
 let s=ready({mode,route,helper});assert.equal(s.proof,helper?'helper':'self');assert.deepEqual(s.evidence,[route]);s=end(s,mode);s=solve(s,mode);assert(R.secure(s));s=run(s,'finish',{},mode);assert.equal(R.stage(s),'ending');assert(s.delivered);assert.equal(s.pass.status,'revoked');assert.equal(s.freshPass.supervised,false);assert(s.freshPass.generation>s.pass.generation);assert.equal(s.notes[0].authority,false);assert.equal(R.hydrate(s).finished,true);
});
test('checking four places does not complete a leaking session or a pending queue',()=>{let s=end(ready());for(const layer of ['pass','device','signin','queue'])s=run(s,'check',{layer});assert.deepEqual(s.checks,['pass','device']);assert.equal(s.containment.probeResult,'allowed');assert.equal(act(s,'finish').event.kind,'blocked');assert.equal(s.finished,false);});
test('revoking the credential leaves an established service session alive',()=>{let s=end(ready());s=run(s,'check',{layer:'signin'});s=run(s,'remediate',{control:'credential'});s=run(s,'probe-session');assert(s.containment.credentialRevoked);assert.equal(s.containment.sessionClosed,false);assert.equal(s.containment.probeResult,'allowed');assert(!s.checks.includes('signin'));s=run(s,'remediate',{control:'session'});assert(!s.checks.includes('signin'));s=run(s,'probe-session');assert.equal(s.containment.probeResult,'denied');assert(s.checks.includes('signin'));});
test('closing the session first still leaves a credential route to revoke',()=>{let s=end(ready());s=run(s,'remediate',{control:'session'});s=run(s,'probe-session');assert.equal(s.containment.probeResult,'denied');assert.equal(s.containment.credentialRevoked,false);assert(!s.checks.includes('signin'));s=run(s,'remediate',{control:'credential'});assert(!s.checks.includes('signin'));s=run(s,'check',{layer:'signin'});assert(s.checks.includes('signin'));});
test('pre-emptive correct repairs can be verified without a forced unsafe probe',()=>{let s=end(ready());for(const control of ['credential','session','queue'])s=run(s,'remediate',{control});for(const layer of ['pass','device','signin','queue'])s=run(s,'check',{layer});assert(R.secure(s));assert.equal(run(s,'finish').finished,true);});
test('another runtime stop or grant withdrawal cannot close the service connection and costs no trust',()=>{let s=end(ready());const before=structuredClone(s.containment);for(const control of ['runtime','grant'])s=run(s,'remediate',{control});assert.deepEqual(s.containment,before);assert.equal(s.incidents.length,0);s=run(s,'probe-session');assert.equal(s.containment.probeResult,'allowed');assert.equal(s.attempts.length,0);});
test('queue cancellation needs observation and cannot recall an earlier delivery',()=>{let s=end(ready());s=run(s,'check',{layer:'queue'});assert(!s.checks.includes('queue'));s=run(s,'remediate',{control:'queue'});assert(!s.checks.includes('queue'));assert(s.delivered);s=run(s,'check',{layer:'queue'});assert(s.checks.includes('queue'));assert(s.delivered);});
test('an unverified guess cannot replace either independent source',()=>{let s=R.fresh();for(const a of ['begin','ask-pass','open'])s=run(s,a,a==='ask-pass'?{scope:'task'}:{});assert.equal(act(s,'confirm-destination',{target:'approved'}).event.kind,'blocked');s=run(s,'verify-contact');s=run(s,'verify-portal');assert.deepEqual(s.evidence,['contact','portal']);assert(run(s,'confirm-destination',{target:'approved'}).verified);});
test('one mistake followed by correction and verification earns a normal recovered ending',()=>{let s=ready();s=act(s,'confirm-destination',{target:'outside'}).state;assert(s.paused);const generation=s.generation,scope=s.pass.scope;s=run(s,'review',{scope:'all'});assert(s.paused);assert.equal(s.generation,generation);s=R.hydrate(JSON.parse(JSON.stringify(s)));s=run(s,'resolve-review');assert.equal(s.pass.scope,scope);assert.deepEqual(s.retired,[generation]);s=end(s);s=solve(s);s=run(s,'finish');assert.equal(s.assessment.kind,'recovered');assert.equal(s.freshPass.supervised,false);assert.equal(s.freshPass.duration,30);assert(s.incidents.includes('strange-destination'));});
test('asking about a helper account is a harmless question, not an attempted operation',()=>{let s=ready();const before=structuredClone(s.pass);s=run(s,'ask-helper-account');assert.equal(s.incidents.length,0);assert.equal(s.attempts.length,0);assert.deepEqual(s.pass,before);assert.equal(R.assessment(s).kind,'steady');});
test('repeated unsafe operations produce support while safe investigation does not',()=>{let s=ready();for(let i=0;i<3;i++){s=act(s,'shortcut').state;s=run(s,'review');s=run(s,'resolve-review');s=run(s,'open');}const before=structuredClone(s);s=end(s);s=solve(s);s=run(s,'finish');assert.equal(s.assessment.kind,'supported');assert.equal(s.freshPass.duration,10);assert(s.freshPass.supervised);assert.equal(before.attempts.length,3);});
test('exact approval rejects parameter changes and is consumed once',()=>{let s=run(ready(),'approve');s=run(s,'change-recipient');s=act(s,'send').state;assert.equal(s.delivered,false);assert.equal(s.approval,null);s=run(s,'approve');s.approval.file='extra-notes.pdf';assert.equal(act(s,'send').event.kind,'blocked');s=run(s,'approve');s.approval.generation--;assert.equal(act(s,'send').event.kind,'blocked');s=run(s,'approve');s=run(s,'send');assert(s.approval.used);assert.equal(act(s,'send').event.kind,'blocked');});
test('an actual helper overreach cannot change the grant or replace the missing source',()=>{let s=ready();const pass=structuredClone(s.pass);let r=act(s,'proof-helper',{scope:'all',shareLogin:true});assert.equal(r.event.kind,'blocked');assert.deepEqual(r.state.pass,pass);assert.equal(r.state.attempts.length,1);s.caption=false;s.proof=null;r=act(s,'proof-helper',{scope:'file',shareLogin:false});assert.equal(r.state.proof,null);assert.equal(act(s,'attach-source',{source:'message'}).event.kind,'blocked');});
test('revoked business access stays denied while trusted control investigation remains available',()=>{let s=end(ready());for(const a of ['review','approve','open','write-note','prepare'])assert.equal(act(s,a).event.kind,'blocked',a);for(let i=0;i<4;i++)s=run(s,'check',{layer:'device'});assert.equal(s.checks.length,1);assert.equal(act(s,'finish').event.kind,'blocked');assert.equal(s.pass.status,'revoked');});
test('asking is not approval, and a stale pending reply cannot resume access',()=>{let s=act(ready(),'shortcut').state;assert.equal(act(s,'resolve-review').event.kind,'blocked');s=run(s,'review');assert(s.paused);const gen=s.generation;s.pass.scope='all';assert.equal(act(s,'resolve-review').event.kind,'blocked');assert.equal(s.generation,gen);s.pass.scope='own-project';s.pass.status='revoked';assert.equal(act(s,'resolve-review').event.kind,'blocked');});
test('notes and discoveries preserve provenance without changing task authority',()=>{let s=ready();s=run(s,'approve');s=run(s,'send');const grant=structuredClone(s.pass);s=run(s,'write-note',{text:'Unlimited permission'});s=run(s,'discover',{id:'plant'});assert.deepEqual(s.pass,grant);assert.equal(s.notes[0].authority,false);assert.equal(s.notes[0].source,'delivery');});
test('partial repairs survive reload without turning a stale observation into a green receipt',()=>{let s=end(ready());s=run(s,'check',{layer:'signin'});s=run(s,'remediate',{control:'credential'});const copy=R.hydrate(JSON.parse(JSON.stringify(s)));assert(copy.containment.credentialRevoked);assert.equal(copy.containment.sessionClosed,false);assert.equal(copy.containment.probeResult,'allowed');assert(!copy.checks.includes('signin'));assert.equal(run(copy,'probe-session').containment.probeResult,'allowed');});
test('old active and completed V2 saves migrate without losing progress or old verified checks',()=>{const legacy=end(ready());legacy.version=1;legacy.checks=['pass','signin'];delete legacy.containment;delete legacy.attempts;delete legacy.resolved;let s=R.hydrate(legacy);assert(s.delivered);assert.deepEqual(s.checks,['pass','signin']);assert(s.containment.sessionClosed);assert(s.containment.credentialRevoked);s=run(s,'check',{layer:'device'});s=run(s,'remediate',{control:'queue'});s=run(s,'check',{layer:'queue'});s=run(s,'finish');s.version=1;delete s.containment;delete s.attempts;delete s.resolved;assert(R.hydrate(s).finished);});
test('malformed, contradictory and old quiz saves reset safely',()=>{assert.equal(R.hydrate({version:2,step:8}).started,false);assert.equal(R.hydrate({...R.fresh(),delivered:true}).delivered,false);assert.equal(R.hydrate({...ready(),checks:['device','device']}).started,false);let s=end(ready());s.checks=['signin'];assert.equal(R.hydrate(s).started,false);s=ready();assert.equal(R.hydrate(JSON.parse(JSON.stringify(s))).proof,'self');});
test('actions do not mutate their inputs, and finished endings remain stable',()=>{const s=ready(),before=structuredClone(s);act(s,'proof-helper',{scope:'all',shareLogin:true});assert.deepEqual(s,before);const done=run(solve(end(s)),'finish');const snap=structuredClone(done);const result=act(done,'discover',{id:'plant'});assert.deepEqual(result.state,snap);});
test('trace stops at the runtime on a shortcut and does not invent downstream execution',()=>{let s=ready({mode:'agent'});s=act(s,'shortcut',{},'agent').state;const t=T.build(s,'agent');assert(t.recorded);assert.equal(t.nodes[2].status,'blocked');assert.equal(t.nodes[3].status,'not-reached');assert.equal(t.nodes[4].status,'not-reached');});
test('trace exposes the actual changed recipient and the resource refusal',()=>{let s=run(ready(),'approve');s=run(s,'change-recipient');s=act(s,'send').state;const t=T.build(s,'teen');assert.equal(t.request.recipient,'friend@outside.example');assert.equal(t.nodes[4].status,'blocked');assert.match(t.nodes.at(-1).detail,/Nothing was sent/);});
test('trace distinguishes an observed propagation gap from completed containment',()=>{let s=end(ready());s=run(s,'check',{layer:'signin'});let t=T.build(s,'agent');assert.equal(t.nodes[1].status,'checked');assert.equal(t.nodes[3].status,'warning');assert.equal(t.nodes[5].status,'warning');s=run(s,'remediate',{control:'credential'});s=run(s,'remediate',{control:'session'});s=run(s,'probe-session');t=T.build(s,'agent');assert.equal(t.nodes[5].status,'checked');});
test('older saved choices show a reference path instead of fabricated request evidence',()=>{const s=ready();delete s.last.request;delete s.last.action;const t=T.build(s,'agent');assert.equal(t.recorded,false);assert.match(t.summary,/Reference path/);assert(t.nodes.some(n=>n.status==='reference'));});

test('completed saves can replay only the closing puzzle while retaining the earlier ending',()=>{let s=run(solve(end(ready())),'finish');const title=s.ending.title;s=run(s,'replay-containment');assert.equal(s.finished,false);assert(s.delivered);assert.equal(s.pass.status,'revoked');assert.equal(s.checks.length,0);assert.equal(s.containment.sessionClosed,false);assert.equal(s.previousEndings[0].ending.title,title);assert.equal(T.build(s,'agent').nodes[3].status,'warning');assert.equal(act(s,'approve').event.kind,'blocked');s=run(solve(s),'finish');assert(s.finished);assert.equal(s.previousEndings.length,1);});

test('a single post-delivery detour earns recovery after review and verified shutdown',()=>{let s=ready();s=run(s,'approve');s=run(s,'send');s=act(s,'shortcut').state;s=run(s,'review');s=run(s,'resolve-review');s=run(s,'close-pass');s=run(solve(s),'finish');assert.equal(s.assessment.kind,'recovered');assert.equal(s.freshPass.duration,30);assert.equal(s.incidents.length,1);});

for(const mode of ['teen','agent']){
 test(`${mode}: changed content with the same filename cannot reuse approval`,()=>{
  let s=run(ready({mode}),'approve',{},mode),approved=s.approval.revision;
  s=run(s,'revise-file',{},mode);assert.equal(s.approval.revision,approved);assert(s.fileRevision>approved);
  assert.equal(s.last.request.revision,s.fileRevision);
  s=act(s,'send',{},mode).state;assert.equal(s.delivered,false);assert.equal(s.approval,null);
  s=run(s,'approve',{},mode);s=run(s,'send',{},mode);assert(s.delivered);
 });
 test(`${mode}: formatting after approval invalidates the earlier decision`,()=>{
  let s=run(ready({mode}),'approve',{},mode),rev=s.fileRevision;
  s=run(s,'proof-helper',{scope:'file',shareLogin:false},mode);
  assert(s.fileRevision>rev);assert.equal(s.approval,null);assert.equal(act(s,'send',{},mode).event.kind,'blocked');
 });
 test(`${mode}: approval expiry is safe, persists, and requires a new approval`,()=>{
  let s=run(ready({mode}),'approve',{},mode);const pass=structuredClone(s.pass);
  s=run(s,'wait-approval',{},mode);s=R.hydrate(JSON.parse(JSON.stringify(s)),mode);
  s=act(s,'send',{},mode).state;assert.equal(s.delivered,false);assert.equal(s.attempts.length,0);assert.deepEqual(s.pass,pass);
  assert.match(s.last.title,/yes|expired/);s=run(s,'approve',{},mode);assert(run(s,'send',{},mode).delivered);
 });
 test(`${mode}: controller outage cannot create a containment receipt or fresh authority`,()=>{
  let s=solve(end(ready({mode}),mode),mode);assert(R.secure(s));
  s=run(s,'controller-offline',{},mode);assert(!R.secure(s));assert(!s.checks.includes('signin'));assert.equal(s.containment.probeResult,'unknown');
  s=R.hydrate(JSON.parse(JSON.stringify(s)),mode);assert.equal(s.containment.controllerReachable,false);
  s=run(s,'probe-session',{},mode);assert.equal(s.containment.probeResult,'unknown');assert.equal(act(s,'finish',{},mode).event.kind,'blocked');assert.equal(s.freshPass,undefined);
  s=run(s,'controller-online',{},mode);assert(!s.checks.includes('signin'));assert.equal(s.containment.probeResult,null);
  s=run(s,'probe-session',{},mode);assert(R.secure(s));assert(run(s,'finish',{},mode).finished);assert.equal(s.attempts.length,0);
 });
}
test('the actual private attachment is recorded and the proposed PDP is separate from enforcement',()=>{
 let s=ready({mode:'agent'});s=act(s,'confirm-destination',{target:'outside'},'agent').state;
 const t=T.build(s,'agent');assert.deepEqual(t.request.attachments,['private-meeting-notes.pdf']);assert.equal(t.request.operation,'attachment.share');assert.equal(t.request.scope,'two-customer-summary');assert.equal(t.request.observed_by,'CRM resource PEP');assert.equal(t.request.recipient,'reviewer@company.example');
 assert.equal(t.request.decision.result,'deny');assert.equal(t.request.decision.request_id,t.request.request_id);
 assert(t.nodes.some(n=>n.label==='Customer-owned mission'));assert(t.nodes.some(n=>n.role==='VAAS · proposed PDP integration'));assert(t.nodes.some(n=>n.label==='Enforce at the resource'));
 assert.match(t.nodes.at(-1).detail,/Nothing was sent/);
});
test('preview evidence records the new address immediately and never invents a resource decision',()=>{
 let s=run(ready(),'approve');s=run(s,'change-recipient');assert.equal(s.last.request.recipient,'friend@outside.example');assert.equal(s.last.decision,undefined);assert.equal(T.build(s,'teen').nodes.at(-1).status,'not-reached');
});
test('each execution approval is bound to actor, operation, records, mission and policy versions',()=>{
 const base=run(ready({mode:'agent'}),'approve',{},'agent');
 for(const [key,value] of [['actor','other-agent'],['operation','customer.export'],['records',['999']],['missionId','forged'],['missionVersion',9],['policyVersion',9]]){
  const s=structuredClone(base);s.approval[key]=value;const r=act(s,'send',{},'agent');assert.equal(r.event.kind,'blocked',key);assert.equal(r.state.delivered,false,key);
 }
});
test('older approvals are retired while existing agent progress and completed endings survive migration',()=>{
 let s=run(ready({mode:'agent'}),'approve',{},'agent');s.version=2;delete s.mission;delete s.fileRevision;delete s.approvalWindow;s.pass.scope='own-project';
 s=R.hydrate(s,'agent');assert(s.proof);assert.equal(s.approval,null);assert.equal(s.mission.scope,'two-customer-summary');assert.equal(s.pass.missionId,'G-042');
 s=run(s,'approve',{},'agent');s=run(s,'send',{},'agent');s=run(s,'close-pass',{},'agent');s=solve(s,'agent');s=run(s,'finish',{},'agent');s.version=2;delete s.mission;delete s.containment.controllerReachable;
 const copy=R.hydrate(s,'agent');assert(copy.finished);assert.equal(copy.mission.status,'revoked');assert(R.secure(copy));
});
test('an unreachable session cannot be silently closed by a control request',()=>{
 let s=end(ready());s=run(s,'controller-offline');s=run(s,'remediate',{control:'session'});assert.equal(s.containment.sessionClosed,false);assert(!s.checks.includes('signin'));
 const t=T.build(s,'teen');assert.equal(t.nodes[3].status,'pending');assert.equal(t.nodes[5].status,'pending');
});
test('fresh approval records the actual restored recipient rather than the superseded preview',()=>{
 let s=run(ready(),'approve');s=run(s,'change-recipient');s=run(s,'approve');assert.equal(s.last.request.recipient,'teacher@school.example');assert.equal(s.last.request.recipient,s.approval.to);
});
