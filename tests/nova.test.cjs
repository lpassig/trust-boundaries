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
  let state=walk('resist',entry.id==='duplicate'?'commit':'permit');
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
