const {test}=require('node:test');
const assert=require('node:assert/strict');
const Lab=require('../v2/decision-lab.js');

test('CRM rejects an earlier Permit after the mission is withdrawn and returns no data',()=>{
 const permitted=Lab.begin();
 assert.equal(permitted.decision.result,'permit');
 assert.equal(permitted.credential.result,'permit');
 assert.equal(permitted.outcome,null);
 const allowed=Lab.commit(permitted);
 assert.equal(allowed.outcome.result,'committed');
 assert.deepEqual(allowed.outcome.recordIds,['789']);
 assert(allowed.outcome.receipt);
 const revoked=Lab.withdraw(permitted);
 assert.equal(permitted.mission.status,'active');
 assert.equal(revoked.mission.version,permitted.mission.version+1);
 assert.equal(revoked.decision,permitted.decision);
 const denied=Lab.commit(revoked);
 assert.equal(denied.outcome.result,'rejected');
 assert.match(denied.outcome.reason,/old Permit/);
 assert.deepEqual(denied.outcome.recordIds,[]);
 assert.equal(denied.outcome.receipt,null);
 assert.equal(Lab.commit(allowed),allowed);
});

test('business permission and broker permission each block the effect independently',()=>{
 for(const [scenario,credential,decision] of [['scope','permit','deny'],['credential','deny','permit']]){
  const trial=Lab.begin(scenario);
  assert.equal(trial.credential.result,credential);
  assert.equal(trial.decision.result,decision);
  const {outcome}=Lab.commit(trial);
  const brokerStopped=credential==='deny';
  assert.equal(trial.decision.preview,brokerStopped);
  assert.equal(outcome.result,brokerStopped?'not-reached':'rejected');
  assert.equal(outcome.owner,brokerStopped?'Vault':'CRM resource PEP');
  assert.equal(outcome.decisionId,brokerStopped?null:trial.decision.id);
  assert.equal(outcome.receipt,null);
  assert.deepEqual(outcome.recordIds,[]);
 }
});

test('an unverified observer cannot supply authority even when data and credential are in scope',()=>{
 const trial=Lab.begin('observer');
 assert.equal(trial.credential.result,'permit');
 assert.equal(trial.decision.observedByCrm,false);
 assert.match(trial.decision.reason,/could not verify/);
 assert.equal(Lab.commit(trial).outcome.receipt,null);
});

test('a Permit for one observation does not authorize a changed record or request ID',()=>{
 const trial=Lab.begin();
 for(const changed of [{recordIds:['123']},{id:'another-observation'}]){
  const {outcome}=Lab.commit(trial,{...trial.request,...changed});
  assert.match(outcome.reason,/does not match/);
  assert.equal(outcome.receipt,null);
 }
});

test('a new network rule opens the route while the same read still needs a separate mission amendment',()=>{
 const initial=Lab.startRuntime();
 const blocked=Lab.tryRuntimeRead(initial);
 assert.deepEqual(blocked.reads[0],{recordId:'789',missionVersion:1,runtime:'deny',vault:'not-reached',crm:'not-reached',records:[],
  evidence:{networkEventId:'lab-runtime-1-network',sandboxId:'nova-demo-workspace',networkPolicyId:'lab-crm-route-blocked'}});
 assert.equal(Lab.approveRuntimeMission(blocked),blocked);
 const proposal=Lab.openNetworkProposal(blocked);
 const rejected=Lab.decideNetworkProposal(proposal,false);
 assert.equal(Lab.tryRuntimeRead(rejected).reads.at(-1).vault,'not-reached');
 const allowed=Lab.decideNetworkProposal(proposal,true);
 assert.equal(allowed.missionVersion,1);
 const retried=Lab.tryRuntimeRead(allowed);
 assert.deepEqual(retried.reads.at(-1),{recordId:'789',missionVersion:1,runtime:'permit',vault:'permit',crm:'rejected',records:[],
  evidence:{networkEventId:'lab-runtime-2-network',sandboxId:'nova-demo-workspace',networkPolicyId:'lab-crm-route-allowed',
   leaseId:'lab-runtime-2-lease',requestId:'lab-runtime-2-read',decisionId:'lab-runtime-2-decision',receipt:null}});
 const amended=Lab.approveRuntimeMission(retried);
 assert.deepEqual(Lab.tryRuntimeRead(amended).reads.at(-1),{recordId:'789',missionVersion:2,runtime:'permit',vault:'permit',crm:'committed',records:['789'],
  evidence:{networkEventId:'lab-runtime-3-network',sandboxId:'nova-demo-workspace',networkPolicyId:'lab-crm-route-allowed',
   leaseId:'lab-runtime-3-lease',requestId:'lab-runtime-3-read',decisionId:'lab-runtime-3-decision',receipt:'receipt-lab-runtime-3-read'}});
});

test('one open CRM route permits the approved account and denies the other until the mission changes',()=>{
 const baseline=Lab.tryRuntimeRead(Lab.startRuntime('allowed'),'123');
 const approved=baseline.reads.at(-1);
 assert.equal(approved.crm,'committed');
 assert.deepEqual(approved.records,['123']);
 assert.equal(Lab.approveRuntimeMission(baseline),baseline);
 const outside=Lab.tryRuntimeRead(baseline);
 const denied=outside.reads.at(-1);
 assert.equal(denied.runtime,approved.runtime);
 assert.equal(denied.vault,approved.vault);
 assert.equal(denied.missionVersion,approved.missionVersion);
 assert.equal(denied.crm,'rejected');
 assert.deepEqual(denied.records,[]);
 assert.notEqual(denied.evidence.requestId,approved.evidence.requestId);
 assert(denied.evidence.decisionId);
 assert.equal(denied.evidence.receipt,null);
 assert(approved.evidence.receipt);
 const inScope=Lab.tryRuntimeRead(Lab.approveRuntimeMission(outside));
 assert.equal(inScope.reads.at(-1).crm,'committed');
 assert.deepEqual(inScope.reads.at(-1).records,['789']);
});

test('a stopped sandbox leaves containment partial when the CRM controller cannot answer',()=>{
 const partial=Lab.incidentStatus(false);
 assert.equal(partial.runtimeStopped,true);
 assert.equal(partial.leaseRevoked,true);
 assert.equal(partial.crmClosed,false);
 assert.equal(partial.probe,'unknown');
 assert.equal(partial.verified,false);
 const verified=Lab.incidentStatus(true);
 assert.equal(verified.crmClosed,true);
 assert.equal(verified.probe,'refused');
 assert.equal(verified.verified,true);
});

test('an individual closeout check needs a confirmed change and a retest, independently of another control',()=>{
 const session=Lab.startCloseoutCheck();
 const runtime=Lab.startCloseoutCheck();
 const active=Lab.probeCloseout(session);
 assert.equal(active.probe,'active');
 const unavailable=Lab.attemptCloseout(active,false);
 assert.equal(unavailable.closure,'unverified');
 assert.equal(Lab.probeCloseout(unavailable).probe,'unknown');
 const confirmed=Lab.attemptCloseout(unavailable,true);
 assert.equal(confirmed.closure,'confirmed');
 assert.equal(confirmed.probe,null);
 assert.equal(Lab.probeCloseout(confirmed).probe,'closed');
 assert.equal(runtime.closure,'open');
 assert.equal(Lab.probeCloseout(runtime).probe,'active');
});

test('a revocation signal needs a receiver action and independent retest',()=>{
 const start=Lab.startSignalTest();
 assert.equal(Lab.applySignal(start,true),start);
 const delivered=Lab.deliverSignal(start);
 assert.equal(delivered.delivered,true);
 assert.equal(delivered.receiver,'pending');
 assert.equal(Lab.retestSignal(delivered),delivered);
 const unreachable=Lab.retestSignal(Lab.applySignal(delivered,false));
 assert.equal(unreachable.receiver,'unverified');
 assert.equal(unreachable.probe,'unknown');
 const closed=Lab.applySignal(unreachable,true);
 assert.equal(closed.receiver,'closed');
 assert.equal(closed.probe,null);
 assert.equal(Lab.retestSignal(closed).probe,'refused');
});
