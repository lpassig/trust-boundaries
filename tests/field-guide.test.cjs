const {test}=require('node:test');
const assert=require('node:assert/strict');
const FieldGuide=require('../v2/field-guide.js');
const Alex=require('../v2/shadow.js');
const Nova=require('../v2/nova.js');

for(const [journey,model] of Object.entries({alex:Alex,nova:Nova})){
 for(const stage of Object.keys(model.stages)){
  test(journey+' '+stage+' shows ordered milestones and closes the checklist on completion',()=>{
   let state=model.fresh(stage);
   const initial=FieldGuide.inspect(journey,model,state);
   const starts=initial.milestones.map(item=>item.start);
   const stepIds=model.stages[stage].steps.map(step=>step.id??step[0]);
   assert.equal(initial.completed,0);
   assert.equal(starts[0],stepIds[0]);
   assert.deepEqual(starts,[...new Set(stepIds.filter(id=>starts.includes(id)))]);
   while(!model.complete(state)){
    const step=model.next(state);
    const before=FieldGuide.inspect(journey,model,state);
    const room=step.room??step[1];
    const action=step.id??step[2];
    const after=model.act(model.visit(state,room),action);
    const updated=FieldGuide.inspect(journey,model,after);
    assert.equal(after.index,state.index+1,step.id??step[0]);
    assert(updated.completed===before.completed||updated.completed===before.completed+1);
    state=after;
   }
   const complete=FieldGuide.inspect(journey,model,state);
   assert.equal(complete.completed,complete.milestones.length);
   assert.equal(complete.current,undefined);
   assert(FieldGuide.recap(journey,model,state).effect);
  });
 }
}
test('idle hints have three progressive levels',()=>{
 assert.deepEqual([0,19,20,39,40,59,60].map(FieldGuide.hintLevel),[0,0,1,1,2,2,3]);
});
