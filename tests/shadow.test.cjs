const {test}=require('node:test');
const assert=require('node:assert/strict');
const Shadow=require('../v2/shadow.js');

function play(){
 let state=Shadow.fresh();
 for(const [,room,key] of Shadow.steps){
  state=Shadow.visit(state,room);
  assert(Shadow.inRoom(state).includes(key));
  state=Shadow.act(state,key);
 }
 return state;
}

test('Tom gives Alex the assignment and room changes require the relevant action',()=>{
 const start=Shadow.fresh();
 assert.equal(Shadow.next(start)[4],'Tom');
 assert.equal(Shadow.act(Shadow.visit(start,'living'),'cards').index,0);
 assert.equal(Shadow.act(start,'cards').index,1);
 for(const room of Object.keys(Shadow.rooms)){
  const objects=Shadow.inRoom(Shadow.visit(start,room));
  assert(objects.includes('grandparents'));
  assert.equal(objects.includes('parents'),room==='kitchen');
 }
});

test('the balance is copied twice before discovery and both attempts are detected outside the kitchen',()=>{
 const held=play();
 assert.equal(Shadow.next(held),undefined);
 assert.deepEqual(Shadow.inRoom(held).slice(0,5),['parents','phone','laptop','workbook','notepad']);
 for(const key of ['laptop','workbook','notepad'])assert.match(Shadow.inspect(held,key),/parents are holding/);
 assert.equal(Shadow.act(held,'newPhone'),held);
 const phone=Shadow.act(Shadow.visit(held,'bedroom'),'newPhone');
 const both=Shadow.act(Shadow.visit(phone,'living'),'laptopAgain');
 assert.deepEqual(both.tests,['newPhone','laptopAgain']);
 assert.deepEqual(Shadow.act(both,'laptopAgain').tests,both.tests);
 assert.deepEqual(Shadow.restore(JSON.parse(JSON.stringify(both))),both);
});
