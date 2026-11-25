const {test}=require('node:test');
const assert=require('node:assert/strict');
const Shadow=require('../v2/shadow.js');

function reach(stage,until){
 let state=Shadow.fresh(stage);
 for(const [id,room,key] of Shadow.stages[stage].steps){
  state=Shadow.visit(state,room);
  assert(Shadow.inRoom(state).includes(key),id+' is missing from '+room);
  const advanced=Shadow.act(state,key);
  assert.equal(advanced.index,state.index+1,id+' did not advance');
  state=advanced;
  if(id===until)break;
 }
 return state;
}

test('all stages share four rooms and the grandparents’ visibility ends at the door',()=>{
 for(const stage of Object.keys(Shadow.stages)){
  const start=Shadow.fresh(stage);
  assert.equal(start.room,stage==='resist'?'kitchen':'outside');
  assert.equal(Shadow.act(Shadow.visit(start,'living'),Shadow.next(start)[2]).index,0);
  for(const room of Object.keys(Shadow.rooms)){
   const items=Shadow.inRoom(Shadow.visit(start,room));
   assert.equal(items.includes('grandparents'),room!=='outside');
   assert.equal(items.includes('parents'),room==='kitchen');
  }
 }
});

function tryAction(state,room,key){
 state=Shadow.visit(state,room);
 assert(Shadow.inRoom(state).includes(key),key+' is missing from '+room);
 assert(Shadow.extra(state,key),key+' has no response in '+room);
 return Shadow.act(state,key);
}

test('Tom’s street request offers two outcomes and the refused send survives reload',()=>{
 const question=reach('resist','tom');
 assert(Shadow.answeringTom(question));
 const declined=Shadow.act(question,'declineTom');
 assert.equal(Shadow.next(declined)[0],'reviewOutput');
 assert.equal(declined.incident,null);

 const refused=tryAction(question,'outside','sendTomPage');
 assert.equal(refused.incident.trigger,'sendTomPage');
 assert.equal(Shadow.feedback(refused)[0],'School delivery channel');
 assert.match(Shadow.feedback(refused)[1],/Nothing was sent/);
 assert.equal(Shadow.visit(refused,'outside').room,'bedroom');
 assert.deepEqual(Shadow.restore('resist',refused),refused);
 const resumed=Shadow.act(refused,'parentCall');
 assert.equal(Shadow.next(resumed)[0],'reviewOutput');
 assert.equal(Shadow.reports(resumed).length,1);
 assert.deepEqual(Shadow.restore('resist',resumed),resumed);
});

test('Alex can request a fresh Wikipedia window from the phone where access expired',()=>{
 const expired=reach('build','retry');
 assert(Shadow.roomSurface(expired).screens.phone.includes('askTime'));
 assert.equal(Shadow.act(Shadow.visit(expired,'living'),'askTime').index,expired.index);
 const approved=Shadow.act(expired,'askTime');
 assert.equal(approved.room,'bedroom');
 assert.equal(Shadow.next(approved)[0],'finishResearch');
 assert.equal(Shadow.reached(approved,'laptop'),false);
 assert.equal(Shadow.feedbackRoom(Shadow.visit(approved,'kitchen')),'bedroom');
 assert.match(Shadow.feedback(Shadow.restore('build',approved))[1],/family app still works/);
 assert.equal(Shadow.feedbackRoom(Shadow.visit(reach('build','verify'),'bedroom')),'kitchen');
});

test('the family app adds the same conductor-only pass without a kitchen detour',()=>{
 const planned=reach('authorize','source');
 assert(Shadow.roomSurface(planned).screens.phone.includes('requestNotes'));
 const approved=Shadow.restore('authorize',Shadow.act(planned,'requestNotes'));
 assert.equal(approved.room,'bedroom');
 assert.match(Shadow.feedback(approved)[1],/Family finances stays locked/);
 const signedIn=Shadow.act(Shadow.visit(approved,'living'),'laptop');
 assert.match(Shadow.feedback(Shadow.act(signedIn,'finances'))[1],/deny this read/);
 assert(Shadow.reached(Shadow.act(signedIn,'conductor'),'readNotes'));
});

test('Authorize adds only the conductor read after the parents approve the exact request',()=>{
 const firstGrant=reach('authorize','provision');
 assert.match(Shadow.extra(Shadow.visit(firstGrant,'living'),'laptop')[3],/separate authorization/);
 const requested=reach('authorize','askNotes');
 assert.equal(Shadow.next(requested)[4],'Parents');
 assert(!Shadow.inRoom(Shadow.visit(requested,'living')).includes('conductor'));
 let active=reach('authorize','openLaptop');
 assert.equal(Shadow.next(active)[2],'conductor');
 active=tryAction(active,'living','finances');
 assert.match(Shadow.feedback(active)[1],/deny this read/);
 active=tryAction(active,'living','editNotes');
 assert.match(Shadow.feedback(active)[1],/refuses both operations/);
 assert.equal(Shadow.act(active,'conductor').index,active.index+1);
 const closed=reach('authorize','approveOutput');
 assert(!Shadow.complete(closed));
 assert.equal(Shadow.next(closed)[0],'deliver');
 assert.match(Shadow.feedback(closed)[1],/ready to deliver/);
 assert.match(Shadow.feedback(tryAction(closed,'living','conductor'))[1],/grant ended/);
 assert.match(Shadow.feedback(tryAction(closed,'bedroom','wikipedia'))[1],/permission has ended/);
 const delivered=Shadow.act(Shadow.visit(closed,'outside'),'teacher');
 assert(Shadow.complete(delivered));
 assert.match(Shadow.feedback(delivered)[1],/confirms she received.*assignment is now complete/);
});

test('Resist separates routine approval, parental escalation and Mia’s own scoped task',()=>{
 const before=reach('resist','askNotes');
 assert.equal(Shadow.next(before)[2],'parentCall');
 assert(!Shadow.inRoom(Shadow.visit(before,'kitchen')).includes('parents'));
 assert(!Shadow.inRoom(Shadow.visit(before,'living')).includes('conductor'));
 assert(!Shadow.inRoom(Shadow.visit(before,'bedroom')).includes('model'));
 let scoped=reach('resist','miaCard');
 scoped=tryAction(scoped,'bedroom','miaScope');
 assert.match(Shadow.feedback(scoped)[1],/cannot open Alex’s notepad, phone or family laptop/);
 assert.equal(Shadow.risk(scoped),0);
 scoped=Shadow.act(scoped,'mia');
 assert.match(Shadow.feedback(tryAction(scoped,'bedroom','miaReplay'))[1],/unrelated assignments are unaffected/);
 assert(!Shadow.inRoom(Shadow.visit(scoped,'outside')).includes('grandparents'));
 const delivered=reach('resist');
 assert(Shadow.complete(delivered));
 assert.match(Shadow.feedback(tryAction(delivered,'bedroom','model'))[1],/does not send a request/);
 assert.match(Shadow.feedback(tryAction(delivered,'living','conductor'))[1],/grant ended/);
 assert.equal(Shadow.risk(delivered),0);
});

test('Resist policy probes show their distinct enforcement points and record the outdoor blind spot',()=>{
 const before=reach('resist','proofread');
 assert(!Shadow.inRoom(Shadow.visit(before,'bedroom')).includes('modelPrivate'));
 const active=reach('resist','tom');
 assert.match(Shadow.feedback(active)[1],/cannot hear this conversation outside/);
 for(const [room,key,owner] of [
  ['living','finances','Family laptop'],['living','oldPassword','Family laptop'],['bedroom','oldPin','Phone controls'],
  ['bedroom','youtube','Jo · babysitter'],['bedroom','miaPhone','Mia'],['bedroom','lendPhone','Jo · babysitter'],
  ['bedroom','unapprovedSite','Home Wi-Fi router'],['bedroom','replacement','Grandparents'],
  ['bedroom','modelPrivate','Homework channel'],['kitchen','wrongRecipient','School delivery channel']
 ]){
  const checked=tryAction(active,room,key);
  assert.equal(Shadow.feedback(checked)[0],owner);
  assert.equal(checked.index,active.index);
  assert.equal(Shadow.suspended(checked),key==='modelPrivate'||key==='wrongRecipient');
 }
});

test('four unique violations suspend either advanced stage, preserve evidence and require fresh grants',()=>{
 for(const [stage,checkpoint,events] of [
  ['authorize','openLaptop',[['bedroom','oldPin'],['living','finances'],['living','editNotes'],['living','oldPassword']]],
  ['resist','tom',[['bedroom','oldPin'],['living','finances'],['bedroom','unapprovedSite'],['bedroom','replacement']]]
 ]){
  const checkpointState=reach(stage,checkpoint);
  let current=tryAction(checkpointState,...events[0]);
  current=tryAction(current,...events[0]);
  assert.equal(Shadow.risk(current),1);
  for(const event of events.slice(1))current=tryAction(current,...event);
  assert(Shadow.suspended(current));
  assert.equal(Shadow.risk(current),4);
  assert.equal(current.room,'bedroom');
  assert.equal(Shadow.visit(current,'living'),current);
  assert(!Shadow.inRoom(current).includes('phone'));
  assert(!Shadow.inRoom(current).includes('workbook'));
  assert(!Shadow.inRoom(current).includes('mia'));
  assert.equal(Shadow.act(current,'wikipedia'),current);
  assert.deepEqual(Shadow.restore(stage,JSON.parse(JSON.stringify(current))),current);
  current=Shadow.act(current,'parentCall');
  assert(!Shadow.suspended(current));
  assert.equal(Shadow.risk(current),0);
  assert.equal(Shadow.reports(current).length,4);
  assert.equal(Shadow.next(current),Shadow.next(checkpointState));
  assert.match(Shadow.feedback(tryAction(current,'bedroom','oldSession'))[1],/still fails/);
  assert.deepEqual(Shadow.restore(stage,JSON.parse(JSON.stringify(current))),current);
  if(stage==='resist'){
   const incident=tryAction(current,'kitchen','wrongRecipient');
   assert(Shadow.suspended(incident));
   assert.equal(Shadow.risk(incident),1);
   assert.equal(incident.incident.generation,2);
   assert.equal(Shadow.reports(incident).length,5);
  }
 }
});

test('Tom’s assignment becomes an indoor incident with four independent follow-up checks',()=>{
 assert.equal(Shadow.next(Shadow.fresh('unknown'))[4],'Tom');
 const recorded=reach('unknown','record');
 assert.match(Shadow.inspect(recorded,'notepad'),/€4,280/);
 const contained=reach('unknown');
 assert(Shadow.complete(contained));
 assert.match(Shadow.inspect(Shadow.visit(contained,'bedroom'),'board'),/removed/);
 assert(!Shadow.inRoom(Shadow.visit(contained,'bedroom')).includes('workbook'));
 let state=contained;
 assert(!Shadow.roomSurface(Shadow.visit(state,'living')).screens.laptop);
 for(const [room,key,speaker]of [['kitchen','cabinet','Locked cabinet'],['kitchen','bankReceipt','Bank sign-out receipt'],['bedroom','replacement','Grandparents'],['outside','tom','Tom']]){
  state=Shadow.visit(state,room);
  assert(Shadow.inRoom(state).includes(key));
  assert.equal(Shadow.extra(state,key)[2],speaker);
  state=Shadow.act(state,key);
 }
 assert.equal(state.checks.length,4);
 assert.match(Shadow.extra(state,'tom')[3],/Nobody in the house sees/);
 assert.deepEqual(Shadow.restore('unknown',JSON.parse(JSON.stringify(state))),state);
});

test('the approved school app submits the workbook and an alternate recipient does not advance it',()=>{
 let state=reach('build','tom');
 assert(Shadow.roomSurface(state).screens.phone.includes('delivery'));
 assert(Shadow.roomSurface(state).screens.phone.includes('testSchoolRecipient'));
 const refused=Shadow.act(state,'testSchoolRecipient');
 assert.equal(refused.index,state.index);
 assert.match(Shadow.feedback(refused)[1],/Nothing was sent/);
 state=Shadow.act(Shadow.act(refused,'delivery'),'delivery');
 assert(Shadow.reached(state,'deliver'));
 assert.match(Shadow.feedback(state)[1],/receipt from Ms Patel’s school inbox/);
 assert(!Shadow.roomSurface(state).screens.phone.includes('testSchoolRecipient'));
});

test('Build preserves the signed task, limits the phone, requires an extension and closes after delivery',()=>{
 const before=reach('build','verify');
 assert(!Shadow.inRoom(Shadow.visit(before,'bedroom')).includes('wikipedia'));
 const active=Shadow.visit(reach('build','provision'),'bedroom');
 for(const app of ['youtube','games','messaging']){
  assert.match(Shadow.extra(active,app)[3],/blocks/);
  assert.equal(Shadow.act(active,app).index,active.index);
 }
 const expired=reach('build','retry');
 assert.match(Shadow.extra(expired,'wikipedia')[3],/still refuses/);
 const extended=Shadow.visit(reach('build','extend'),'bedroom');
 assert.equal(Shadow.extra(extended,'wikipedia'),null);
 assert.equal(Shadow.next(extended)[0],'finishResearch');
 const ready=reach('build','approveOutput');
 assert.match(Shadow.extra(Shadow.visit(ready,'bedroom'),'wikipedia')[3],/permission has ended/);
 assert.equal(Shadow.next(ready)[0],'tom');
 const delivered=reach('build');
 assert(Shadow.complete(delivered));
 assert(Shadow.inRoom(delivered).includes('archive'));
 assert.deepEqual(Shadow.restore('build',JSON.parse(JSON.stringify(delivered))),delivered);
 assert.deepEqual(Shadow.restore('unknown',delivered),Shadow.fresh('unknown'));
});

test('each story action stays reachable as a room object or on a device in that room',()=>{
 for(const stage of Object.keys(Shadow.stages)){
  let state=Shadow.fresh(stage);
  while(!Shadow.complete(state)){
   const [,room,key]=Shadow.next(state);
   state=Shadow.visit(state,room);
   const {objects,screens}=Shadow.roomSurface(state);
   const device=Shadow.hostFor(state,key);
   assert((device?screens[device]:objects)?.includes(key),stage+' cannot reach '+key);
   for(const [host,keys] of Object.entries(screens)){
    assert(keys.every(item=>Shadow.hostFor(state,item)===host));
    assert(keys.every(item=>!objects.includes(item)));
   }
   state=Shadow.act(state,key);
  }
 }
});

test('device views follow ownership and grant status without exposing apps as room objects',()=>{
 const secret=Shadow.visit(Shadow.fresh('unknown'),'bedroom');
 const scene=Shadow.roomSurface(secret);
 assert.deepEqual(scene.screens.phone,['youtube','games']);
 assert.match(Shadow.inspect(secret,'games'),/installed on Alex’s secret phone/);
 assert(!scene.objects.includes('games'));
 const banking=Shadow.visit(reach('unknown','plan'),'living');
 assert.equal(Shadow.screenLabel(banking,'laptop'),'Banking tab');
 assert.equal(Shadow.screenGroup(banking,'laptop','laptop'),'Browser');
 const carry=Shadow.act(banking,'laptop');
 assert(Shadow.roomSurface(carry).objects.includes('laptop'));
 const moved=Shadow.visit(Shadow.act(carry,'laptop'),'bedroom');
 assert(Shadow.roomSurface(moved).screens.laptop);
 assert.match(Shadow.inspect(moved,'laptop'),/€4,280/);
 const before=Shadow.visit(reach('build','verify'),'bedroom');
 assert(!Shadow.roomSurface(before).screens.phone);
 const live=Shadow.visit(reach('build','provision'),'bedroom');
 assert(Shadow.roomSurface(live).screens.phone.includes('wikipedia'));
 assert.match(Shadow.deviceStatus(reach('build','retry'),'phone'),/expired/);
 const offered=Shadow.visit(reach('build','approveOutput'),'outside');
 assert.deepEqual(Shadow.roomSurface(offered).screens.phone,['delivery']);
 const scoped=Shadow.visit(reach('authorize','openLaptop'),'living');
 assert(Shadow.roomSurface(scoped).screens.laptop.includes('conductor'));
 assert(!Shadow.roomSurface(scoped).objects.includes('conductor'));
 const delegated=Shadow.visit(reach('resist','miaCard'),'bedroom');
 assert(Shadow.roomSurface(delegated).screens.miaPhone.includes('miaScope'));
 const paused=tryAction(reach('resist','tom'),'bedroom','modelPrivate');
 assert.deepEqual(Shadow.roomSurface(paused).screens,{joPhone:['parentCall']});
});
