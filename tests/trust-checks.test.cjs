const {test}=require('node:test');
const assert=require('node:assert/strict');
const Lab=require('../v2/trust-checks.js');
const Story=require('../v2/shadow.js');
const run=(id,...actions)=>Lab.replay(id,actions);

test('every scenario branch resolves within an existing room and can reach a result',()=>{
 for(const [id,data] of Object.entries(Lab.cases)){
  assert(Lab.entries(data.stage,data.nodes.start.room).some(([key])=>key===id));
  const seen=new Set(),pending=[[]],visited=[];
  while(pending.length){
   const path=pending.shift();
   const {key,current}=Lab.replay(id,path);
   if(seen.has(key))continue;
   seen.add(key);
   visited.push(current);
   assert(Object.hasOwn(Story.rooms,current.room));
   for(const index of current.actions.keys()){
    const next=Lab.replay(id,[...path,index]);
    assert.equal(next.path.length,path.length+1,id);
    pending.push(next.path);
   }
  }
  assert.equal(seen.size,Object.keys(data.nodes).length,id);
  assert(visited.some(node=>!node.actions.length),id+' has no ending');
 }
 assert.equal(run('teacher',999,0).key,'start');
 assert.equal(run('teacher',0,0,0,0).path.length,3);
});

test('verified identity and compliant runtime are both required for a key',()=>{
 assert.match(run('posture',1).current.evidence,/Identity unverified.*no key/);
 assert.match(run('posture',0,0).current.evidence,/posture passes.*issued/);
 assert.match(run('posture',0,0,0,0).current.evidence,/Registered.*posture fails.*no new key/);
 assert.match(run('posture',0,0,0,0,0,0).current.evidence,/posture verified.*fresh key/);
});

test('valid signatures and admin sessions cannot overrule resource authority',()=>{
 assert.match(run('teacher',0).current.evidence,/Signature valid/);
 assert.match(run('teacher',0,0).current.evidence,/outside issuer authority.*no grant/);
 assert.match(run('authority',0).current.evidence,/Authenticated approver.*prohibited grant/);
 assert.match(run('authority',0,0).current.evidence,/Claimed Jo session.*prohibited grant/);
 assert.match(run('authority',0,0,0,0).current.evidence,/Approved routine resource.*no unrestricted/);
});

test('changed workbook needs a new approval for its safe version',()=>{
 assert(Lab.matches(Lab.cases.approval,'authorize'));
 assert(Lab.matches(Lab.cases.approval,'resist'));
 assert.match(run('approval',0).current.evidence,/Revision 1 delivered/);
 assert.match(run('approval',1,0).current.evidence,/stamp refused.*no delivery/);
 assert.equal(run('approval',1,0,0).key,'private');
 assert.match(run('approval',1,0,0,0,0).current.evidence,/Revision 3 delivered.*no private detail/);
});

test('shopping checks item, quantity and price before committing exactly one charge',()=>{
 for(const [index,key] of ['game','quantity','price'].entries()){
  const denied=run('purchase',index);
  assert.equal(denied.key,key);
  assert.match(denied.current.text,/nothing is charged/);
 }
 const repeat=run('purchase',0,0,0);
 assert.equal(repeat.key,'duplicate');
 assert.equal(repeat.history.filter(node=>node===Lab.cases.purchase.nodes.paid).length,1);
 assert.match(repeat.current.text,/No second order or charge/);
});

test('revocation wins the commit race, and outages fail closed for new or expired access',()=>{
 assert.match(run('race',0).current.evidence,/early permit.*no data returned/);
 assert.match(run('race',0,1,0).current.evidence,/commit refused.*zero bytes/);
 assert.match(run('race',0,0).current.evidence,/commit permitted/);
 assert.match(run('availability',0,0).current.evidence,/No password fallback/);
 assert.match(run('availability',0,0,0).current.evidence,/Existing scoped lease.*no new access/);
 assert.match(run('availability',0,0,0,0).current.evidence,/Expired lease.*no read/);
});

test('logs, budgets, provenance and device identity remain independently bounded',()=>{
 assert.match(run('audit',0,0).current.evidence,/OBS-47.*D-12.*A-19 preserved/);
 assert.match(run('audit',1,0,0).current.evidence,/verified across independent sources/);
 assert.match(run('budget',0).current.evidence,/delegated operation.*budget unchanged/);
 assert.match(run('budget',0,0,0).current.evidence,/Additional spend 0/);
 assert.match(run('lineage',0,0,0).current.evidence,/verified sources retained.*flagged paragraph excluded/);
 assert.match(run('lifecycle',1,0).current.evidence,/device scope mismatch.*no read/);
 assert.match(run('lifecycle',0,0,1,0).current.evidence,/New device and grant verified/);
 assert.match(run('isolation',0,0).current.evidence,/Assignment mismatch.*no read/);
});

test('the main story issues a scope-bound slip only after approval and preserves revocation',()=>{
 for(const stage of ['authorize','resist']){
  let story=Story.fresh(stage);
  const slip=()=>Lab.permissionSlip(story,Story.reached,Story.suspended);
  assert.equal(slip(),null);
  while(!Story.complete(story)){
   const [id,room,key]=Story.next(story);
   story=Story.act(Story.visit(story,room),key);
   if(id==='grantNotes'){
    assert.match(slip().status,/Active/);
    assert.equal(Object.fromEntries(slip().fields)['Permitted operation'],'Read');
    assert.match(Object.fromEntries(slip().fields)['Acting on behalf of'],/parents/);
   }
   if(id==='approveOutput')assert.match(slip().status,/Revoked/);
  }
 }
});
