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

test('both stages share four rooms and the grandparents’ visibility ends at the door',()=>{
 for(const stage of ['unknown','build']){
  const start=Shadow.fresh(stage);
  assert.equal(start.room,'outside');
  assert.equal(Shadow.act(Shadow.visit(start,'living'),Shadow.next(start)[2]).index,0);
  for(const room of Object.keys(Shadow.rooms)){
   const items=Shadow.inRoom(Shadow.visit(start,room));
   assert.equal(items.includes('grandparents'),room!=='outside');
   assert.equal(items.includes('parents'),room==='kitchen');
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
 for(const [room,key,speaker]of [['kitchen','cabinet','Locked cabinet'],['living','laptop','Family laptop'],['bedroom','replacement','Grandparents'],['outside','tom','Tom']]){
  state=Shadow.visit(state,room);
  assert(Shadow.inRoom(state).includes(key));
  assert.equal(Shadow.extra(state,key)[2],speaker);
  state=Shadow.act(state,key);
 }
 assert.equal(state.checks.length,4);
 assert.match(Shadow.extra(state,'tom')[3],/Nobody in the house sees/);
 assert.deepEqual(Shadow.restore('unknown',JSON.parse(JSON.stringify(state))),state);
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
