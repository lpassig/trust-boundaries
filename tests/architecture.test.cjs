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
});
