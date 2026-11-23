const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const architecture=require('../v2/architecture.js');

test('architecture steps resolve to a component and threat links resolve to a request',()=>{
 const products=vm.runInNewContext(fs.readFileSync(require.resolve('../v2/products.js'),'utf8')+'\nNOVA_PRODUCTS');
 const mapIds=architecture.groups.flatMap(([,ids])=>ids);
 assert.deepEqual(new Set(mapIds),new Set(Object.keys(architecture.components)));
 assert.equal(mapIds.length,new Set(mapIds).size);
 for(const component of Object.values(architecture.components)){
  if(component.product)assert(products.some(p=>p.id===component.product),component.product);
 }
 for(const [id,flow] of Object.entries(architecture.flows)){
  for(const [component] of flow.steps)assert(mapIds.includes(component),id+': '+component);
 }
 for(const threat of architecture.threats)assert(architecture.flows[threat.flow],threat.title);
 for(const [plane,components] of architecture.technical.topology){
  for(const id of components)assert(mapIds.includes(id),plane+': '+id);
 }
});

test('example decision binds the PEP observation to the approval and live versions',()=>{
 const {decisionExample:request,decisionResponse:response}=architecture.technical;
 assert.equal(response.request_id,request.request_id);
 assert.equal(response.action_digest,request.approval.action_digest);
 assert.equal(response.enforcement.consume_approval_id,request.approval.id);
 assert.equal(response.enforcement.expected_mission_version,request.mission.version);
 assert.equal(response.enforcement.expected_policy_version,request.mission.policy_version);
 assert.equal(response.enforcement.expected_session_generation,request.identity.session_generation);
});
