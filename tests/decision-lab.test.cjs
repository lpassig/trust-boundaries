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
  assert.equal(outcome.result,'rejected');
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
