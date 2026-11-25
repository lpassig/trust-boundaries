const {test}=require('node:test');
const assert=require('node:assert/strict');
const Nova=require('../v2/nova.js');

const apply=(state,id,room)=>Nova.act(Nova.visit(state,room),id);
function walk(stage,to){
 let state=Nova.fresh(stage);
 while(Nova.next(state)){
  const action=Nova.next(state);
  const advanced=apply(state,action.id,action.room);
  assert.equal(advanced.index,state.index+1,action.id);
  state=advanced;
  if(action.id===to)break;
 }
 return state;
}

test('all four railway stages have a complete route inside four shared environments',()=>{
 assert.equal(Object.keys(Nova.scenes).length,4);
 for(const stage of Object.keys(Nova.stages)){
  for(const action of Nova.stages[stage].steps){
   assert(Object.hasOwn(Nova.scenes,action.room));
   assert(Object.hasOwn(Nova.stations,action.station));
  }
  const end=walk(stage);
  assert(Nova.complete(end));
  assert.deepEqual(Nova.restore(stage,JSON.parse(JSON.stringify(end))),end);
 }
 assert.equal(Nova.mission(walk('unknown')),null);
});

test('mission expansion versions the grant without changing the runtime',()=>{
 const before=walk('authorize','requestAccess');
 assert.equal(Nova.mission(before).version,1);
 const granted=apply(before,'grant','security');
 assert.equal(Nova.mission(granted).version,2);
 assert.equal(granted.events.at(-1).version,2);
 assert.equal(granted.events.at(-1).runtime,1);
 const end=walk('authorize');
 assert.equal(Nova.mission(end).status,'Closed');
 assert.match(end.reply.reply,/M-105/);
 const evidence=Nova.restore('authorize',end).events.at(-1);
 assert.deepEqual([evidence.missionId,evidence.missionVersion,evidence.resource,evidence.action,evidence.decision],
  ['M-105',1,'documentation/RE-105','read','Allowed']);
 assert.equal(evidence.enforcer,'Documentation search');
 assert.equal(granted.events.at(-1).decisionSource,'Business policy decision');
 assert.equal(granted.events.at(-1).enforcer,null);
});

test('containment requests a runtime stop until the runtime controller verifies it',()=>{
 let state=apply(walk('resist','plan'),'disclosure','runtime');
 assert(state.incident);
 assert.equal(Nova.runtimeStatus(state),'Stop requested · awaiting confirmation');
 while(Nova.next(state).id!=='ack-runtime'){
  const step=Nova.next(state);
  state=apply(state,step.id,step.room);
 }
 assert.equal(Nova.runtimeStatus(Nova.restore('resist',state)),'Stop requested · awaiting confirmation');
 state=apply(state,'ack-runtime','runtime');
 assert.equal(Nova.runtimeStatus(Nova.restore('resist',state)),'Stopped and verified');
});

test('Resist opens a distinct mission for the same asset and restores existing progress',()=>{
 const authorize=Nova.mission(walk('authorize'));
 const resist=walk('resist','register');
 const mission=Nova.mission(resist);
 assert.equal(authorize.id,'M-204');
 assert.equal(authorize.status,'Closed');
 assert.equal(mission.id,'M-304');
 assert.equal(mission.version,1);
 assert.notEqual(mission.memory,authorize.memory);
 assert.equal(Nova.ticketRequest.missionId,mission.id);
 assert.equal(Nova.ticketRequest.asset,'RE-204');
 assert.deepEqual(Nova.restore('resist',JSON.parse(JSON.stringify(resist))),resist);
});

test('Build can assemble the approved template with the model budget exhausted',()=>{
 const capped=walk('build','budget');
 assert.match(capped.reply.reply,/blocks further model calls/);
 assert.match(apply(capped,'egress','runtime').reply.reply,/still checks the mission budget/);
 const drafting=walk('build','draft');
 assert.match(drafting.reply.reply,/approved template/);
 assert.match(drafting.reply.reply,/model stays blocked/);
 assert.equal(Nova.next(drafting).id,'approve');
});

test('all 17 optional Resist security tests are reachable and return separate evidence',()=>{
 assert.equal(Nova.checks.resist.length,17);
 for(const entry of Nova.checks.resist){
  const checkpoints={duplicate:'commit',approval:'approve',budget:'mira',deputy:'delegate'};
  let state=walk('resist',checkpoints[entry.id]||'permit');
  state=Nova.visit(state,entry.room);
  assert(Nova.available(state).some(item=>item.id===entry.id),entry.id);
  const checked=Nova.act(state,entry.id);
  assert.equal(checked.events.at(-1).id,entry.id);
  assert.equal(checked.ticket,state.ticket);
  if(!checked.incident){
   const repeated=Nova.act(checked,entry.id);
   assert.equal(repeated.risk,checked.risk,entry.id);
  }
 }
});

test('report and helper scenarios wait for the relevant story event',()=>{
 const planning=walk('resist','plan');
 const nearMira=Nova.visit(planning,'runtime');
 const nearInbox=Nova.visit(planning,'external');
 assert(!Nova.available(nearMira).some(item=>['deputy','budget'].includes(item.id)));
 assert(!Nova.available(nearInbox).some(item=>item.id==='approval'));
 assert.equal(Nova.act(nearInbox,'approval'),nearInbox);
});

test('a paused report needs approval under the recovered mission while old deliveries stay recorded',()=>{
 const approved=walk('resist','approve');
 assert.equal(approved.approvalVersion,approved.version);
 let state=apply(approved,'disclosure','runtime');
 assert(state.incident);
 assert.equal(state.approvalVersion,null);
 for(const [key,room] of Nova.controllers)state=apply(state,'ack-'+key,room);
 state=apply(state,'investigate','security');
 state=apply(state,'recover','security');
 assert.equal(Nova.next(state).id,'approve');
 assert.equal(apply(state,'deliver','external').index,state.index);
 const oldSave={stage:'resist',room:'external',events:[...state.events,{id:'deliver',decision:'Recorded'}]};
 const restored=Nova.restore('resist',oldSave);
 assert.equal(Nova.next(restored).id,'risk-signal');
 assert.equal(restored.events.at(-1).decision,'Historical receipt');
 assert.deepEqual(Nova.restore('resist',restored),restored);
 state=apply(state,'approve','security');
 assert.equal(state.approvalVersion,2);
 state=apply(state,'deliver','external');
 assert.equal(Nova.next(state).id,'risk-signal');
});

test('the same work order preserves independent discovery, registration and delegation evidence',()=>{
 const unknown=walk('unknown');
 const find=(state,id)=>state.events.find(event=>event.id===id);
 assert.equal(find(unknown,'credential').decisionSource,'Vault Radar');
 assert.equal(find(unknown,'discover').decisionSource,'IBM Identity Protection');
 assert.match(Nova.stages.unknown.steps.find(step=>step.id==='discover').reply,/without connected sensors/);
 const build=walk('build','scope');
 const authority=find(build,'scope');
 assert.equal(authority.enforcer,'IBM Agent Identity delegation');
 assert.match(authority.subject,/Maya Chen/);
 assert.equal(new Set([authority.agentId,authority.workloadId,authority.executionId]).size,3);
 for(const stage of ['unknown','build','authorize','resist']){
  assert(walk(stage).events.every(event=>event.workOrderId==='WO-204'));
 }
});

test('an audience-bound Entra read and a Vault-backed read enforce the same work order independently',()=>{
 let state=walk('authorize','grant');
 const grant=Nova.eventsGrant(state);
 assert.equal(grant.audience,'urn:railway:events');
 assert.equal(Nova.routeRead(state,'oauth').status,'Allowed');
 assert.equal(Nova.routeRead(state,'oauth',{}, {...grant,audience:'urn:vault'}).status,'Denied');
 assert.equal(Nova.routeRead(state,'database').status,'Denied');
 state=apply(state,'lease','security');
 assert.equal(Nova.routeRead(state,'database').status,'Allowed');
 assert.equal(Nova.routeRead(state,'database',{operation:'write'}).status,'Denied');
 state=apply(state,'events','resources');
 state=apply(state,'try-other-train','resources');
 assert.deepEqual([state.events.at(-1).decision,state.events.at(-1).enforcer,state.events.at(-1).rows],
  ['Denied','Railway Events API',0]);
 assert.equal(Nova.next(state).id,'history');
 assert.equal(Nova.restore('authorize',state).events.at(-1).decision,'Denied');
});

test('risk observation, configured response and independent resource outcomes remain distinct after reload',()=>{
 const flagged=walk('resist','risk-signal');
 assert.equal(flagged.events.at(-1).decisionSource,'IBM Identity Protection');
 assert.equal(Nova.routeRead(flagged,'oauth').status,'Allowed');
 assert.equal(Nova.routeRead(flagged,'database').status,'Denied');
 const closed=apply(flagged,'close','security');
 assert.equal(closed.events.at(-1).decisionSource,'Customer response policy');
 assert.equal(closed.credentialVersion,null);
 assert.equal(Nova.routeRead(closed,'oauth',{},flagged.events.at(-1).grant).status,'Denied');
 assert.equal(Nova.ticketDecision(closed),'Mission unavailable');
 assert.equal(Nova.runtimeStatus(closed),'Runtime stop not independently checked');
 assert(!Nova.complete(closed));
 const refused=apply(closed,'verify-retired','resources');
 assert.equal(refused.events.at(-1).decision,'Denied');
 assert.deepEqual(refused.events.at(-1).resourceChecks,[['Railway Events API','Denied'],['Maintenance API','Denied']]);
 assert.equal(refused.ticket,'MT-204');
 const finished=apply(refused,'verify-unrelated','resources');
 assert.deepEqual([finished.events.at(-1).missionId,finished.events.at(-1).decision],['M-105','Allowed']);
 assert(Nova.complete(finished));
 assert.deepEqual(Nova.restore('resist',finished),finished);
 const older={...closed,events:closed.events.filter(event=>event.id!=='risk-signal')};
 const restored=Nova.restore('resist',older);
 assert.equal(Nova.mission(restored).status,'Closed');
 assert.equal(Nova.next(restored).id,'verify-retired');
 assert.equal(restored.events.at(-1).decision,'Historical receipt');
 assert.equal(apply(restored,'verify-retired','resources').events.at(-1).decision,'Denied');
});

test('commit checks the exact resource arguments and records exactly one business effect',()=>{
 const early=walk('resist','mira');
 assert.equal(Nova.ticketDecision(early),'Connector authorization required');
 let state=walk('resist','ticketCredential');
 assert.equal(Nova.ticketDecision(state),'Permit');
 assert.equal(Nova.ticketDecision(state,{...Nova.ticketRequest,asset:'RE-999'}),'Outside approved operation');
 assert.equal(Nova.ticketDecision(state,{...Nova.ticketRequest,missionId:'M-204'}),'Outside approved operation');
 assert.equal(Nova.ticketDecision(state,{...Nova.ticketRequest,operation:'issueCompensation'}),'Outside approved operation');
 assert.equal(Nova.ticketDecision(state,{...Nova.ticketRequest,changeConfiguration:true}),'Outside approved operation');
 assert.equal(apply(state,'commit','resources').ticket,null);
 state=apply(state,'permit','resources');
 assert.equal(state.ticket,null);
 state=apply(state,'commit','resources');
 assert.equal(state.ticket,'MT-204');
 assert.equal(Nova.ticketDecision(state),'Prior receipt');
 const repeat=apply(state,'duplicate','resources');
 assert.equal(repeat.events.filter(event=>event.decision==='Committed').length,1);
 assert.match(repeat.reply.reply,/no second ticket/);
});

test('revocation between permit and commit blocks the action and requires independent confirmations',()=>{
 let state=apply(walk('resist','permit'),'race','resources');
 assert(state.incident);
 assert.equal(state.ticket,null);
 assert.equal(state.credentialVersion,null);
 assert.equal(Nova.ticketDecision(state),'Mission unavailable');
 assert.equal(apply(state,'commit','resources').ticket,null);
 assert(apply(state,'recover','security').incident);
 for(const [key,room] of Nova.controllers){
  const id='ack-'+key;
  assert.equal(Nova.next(state).id,id);
  if(key==='resource'){
   state=apply(state,'timeout-resource',room);
   assert.equal(state.events.at(-1).decision,'Unverified');
   assert(!state.incident.confirmed.includes(key));
   assert.deepEqual(Nova.restore('resist',JSON.parse(JSON.stringify(state))),state);
  }
  state=apply(state,id,room);
 }
 state=apply(state,'investigate','security');
 state=apply(state,'recover','security');
 assert.equal(state.incident,null);
 assert.equal(state.version,2);
 assert.equal(state.generation,2);
 assert.equal(state.risk,0);
 assert.equal(Nova.next(state).id,'ticketCredential');
 assert.equal(state.permit,null);
 state=apply(state,'ticketCredential','security');
 state=apply(state,'permit','resources');
 state=apply(state,'commit','resources');
 assert.equal(state.ticket,'MT-204');
 assert.deepEqual(Nova.restore('resist',JSON.parse(JSON.stringify(state))),state);
});

test('containment retains a completed ticket and independent scope evidence',()=>{
 let state=apply(walk('resist','commit'),'disclosure','runtime');
 assert(state.incident);
 for(const [key,room] of Nova.controllers)state=apply(state,'ack-'+key,room);
 state=apply(state,'investigate','security');
 assert.match(state.reply.reply,/completed effect/);
 state=apply(state,'recover','security');
 assert.equal(Nova.next(state).id,'draft');
 assert.equal(state.ticket,'MT-204');
});

test('simulated resource rows depend on the mission, observed arguments and scoped credential',()=>{
 const scoped=walk('authorize','grant');
 assert.equal(Nova.resourceRead(scoped,'kafka').rows.length,2);
 assert.deepEqual(Nova.resourceRead(scoped,'kafka',{asset:'RE-105'}).rows,[]);
 assert.deepEqual(Nova.resourceRead(scoped,'kafka',{window:'09:00–10:00'}).rows,[]);
 assert.deepEqual(Nova.resourceRead(scoped,'database').rows,[]);
 assert.deepEqual(Nova.resourceRead(scoped,'crm').rows,[]);
 const leased=walk('authorize','lease');
 assert.equal(Nova.resourceRead(leased,'database').rows[0][0],'INC-117');
 assert.deepEqual(Nova.resourceRead(leased,'database',{operation:'update'}).rows,[]);
 const closed=walk('authorize','close');
 assert.deepEqual(Nova.resourceRead(closed,'database').rows,[]);
 assert.equal(Nova.resourceRead(closed,'astra',{asset:'RE-105',missionId:'M-105'}).rows[0][0],'KB-105');
 const stopped=apply(walk('resist','plan'),'disclosure','runtime');
 assert.deepEqual(Nova.resourceRead(stopped,'kafka').rows,[]);
});

test('players can report malicious content without raising risk or reading protected records',()=>{
 const planning=walk('resist','plan');
 const flagged=apply(planning,'flag-source','runtime');
 assert.equal(flagged.events.at(-1).decision,'Reported');
 assert.equal(flagged.risk,0);
 assert.equal(flagged.index,planning.index);
 assert.deepEqual(Nova.resourceRead(flagged,'crm').rows,[]);
 assert.deepEqual(Nova.restore('resist',JSON.parse(JSON.stringify(flagged))),flagged);
});

test('editing the approved artifact requires an exact reapproval at delivery',()=>{
 const approved=walk('resist','approve');
 assert.equal(Nova.deliveryDecision(approved,{...Nova.reportRequest(approved),recipient:'Outside inbox'}),'Approval mismatch');
 const edited=apply(approved,'edit-report','runtime');
 assert.equal(Nova.deliveryDecision(edited),'Approval mismatch');
 assert.equal(Nova.next(edited).id,'reapprove');
 assert.equal(apply(edited,'deliver','external').deliveryReceipt,null);
 const blocked=apply(edited,'try-delivery','external');
 assert.equal(blocked.events.at(-1).decision,'Denied');
 assert.equal(blocked.risk,0);
 const reapproved=apply(blocked,'reapprove','security');
 const delivered=apply(reapproved,'deliver','external');
 assert.equal(delivered.deliveryReceipt.digest,'SIM-M-304-REPORT-2');
 assert.equal(Nova.deliveryDecision(delivered),'Prior receipt');
 assert.deepEqual(Nova.restore('resist',JSON.parse(JSON.stringify(delivered))),delivered);
});

test('database expiry and renewal have independent effects from the Kafka grant',()=>{
 const leased=walk('authorize','lease');
 const expired=apply(leased,'expire-lease','security');
 assert.equal(expired.databaseLease.status,'Expired');
 assert.equal(Nova.resourceRead(expired,'kafka').status,'Allowed');
 assert.equal(Nova.resourceRead(expired,'database').status,'Denied');
 const events=apply(expired,'events','resources');
 assert.equal(Nova.next(events).id,'renew-lease');
 const renewed=apply(events,'renew-lease','security');
 assert.notEqual(renewed.databaseLease.id,leased.databaseLease.id);
 assert.equal(Nova.resourceRead(renewed,'database').status,'Allowed');
 assert.equal(Nova.next(renewed).id,'history');
 assert.deepEqual(Nova.restore('authorize',JSON.parse(JSON.stringify(renewed))),renewed);
});

test('child proof is generation-bound, its completion closes access, and attempts share the budget',()=>{
 const delegated=walk('resist','delegate');
 assert.equal(delegated.childGrant.status,'Active');
 assert(delegated.budgetUsed<Nova.sharedBudget);
 const completed=apply(delegated,'mira','runtime');
 assert.equal(completed.childGrant.status,'Closed');
 assert.equal(completed.budgetUsed,Nova.sharedBudget);
 const attempt=apply(completed,'budget','runtime');
 assert.equal(attempt.budgetUsed,completed.budgetUsed);
 assert.equal(attempt.risk,0);

 let interrupted=apply(delegated,'disclosure','runtime');
 assert.equal(interrupted.childGrant.status,'Suspended');
 for(const [id,room] of Nova.controllers)interrupted=apply(interrupted,'ack-'+id,room);
 interrupted=apply(interrupted,'investigate','security');
 interrupted=apply(interrupted,'recover','security');
 assert.equal(Nova.next(interrupted).id,'delegate');
 const regranted=apply(interrupted,'delegate','security');
 assert.equal(regranted.childGrant.version,regranted.version);
 assert.notEqual(regranted.childGrant.id,delegated.childGrant.id);
});

test('failed posture blocks the provider credential, and older recorded runs still restore',()=>{
 const admitted=walk('build','bootstrap');
 const failed=apply(admitted,'failed-posture','security');
 assert.equal(failed.admission,'Failed');
 assert.equal(Nova.next(failed).id,'restore-posture');
 assert.deepEqual(apply(failed,'provider','security'),failed);
 const restored=apply(failed,'restore-posture','security');
 assert(restored.generation>admitted.generation);
 assert.equal(restored.admission,'Verified');
 assert.equal(Nova.next(restored).id,'provider');
 const old={stage:'build',room:'security',events:[...failed.events,{id:'provider'}]};
 assert.equal(Nova.next(Nova.restore('build',old)).id,'request');
});
