const {test}=require('node:test');
const assert=require('node:assert/strict');
const R=require('../v2/rules.js'),I=require('../v2/interactions.js');
function run(s,action,payload={}){
 const result=R.act(s,s.journey||'teen',action,payload);
 assert(!['blocked','refused'].includes(result.event.kind),result.event.text);
 return result.state;
}
function draft(mode){let s=R.act(R.fresh(),mode,'begin').state;for(const a of ['read-brief','ask-pass','open','prepare','collect-source'])s=run(s,a,a==='ask-pass'?{scope:'task'}:{});return s;}
function feedback(mode){let s=run(draft(mode),'attach-source');if(mode==='agent')s=run(s,'approve-draft');return run(s,'send-draft');}
function ready(mode){let s=feedback(mode);for(const a of ['verify-contact','keep-minor','decline-extension','decline-private','proof-self'])s=run(s,a);if(mode==='agent')s=run(s,'approve');return s;}
for(const mode of ['teen','agent']){
 test(`${mode}: a saved contact has no destination before requests arrive`,()=>{
  const opening=R.act(R.fresh(),mode,'begin').state;assert.match(I.itemUse(opening,mode,'contact').instruction,/later requests/);assert.doesNotMatch(I.itemUse(opening,mode,'contact').instruction,/ended|closing checks/);
  const s=draft(mode),before=structuredClone(s);
  assert.deepEqual(I.itemUse(s,mode,'contact').targets,[]);
  assert.deepEqual(s,before);
 });
 test(`${mode}: contact verification belongs to the incoming requests, then becomes reference only`,()=>{
  let s=feedback(mode);const use=I.itemUse(s,mode,'contact');
  assert.deepEqual(use.targets,[mode==='teen'?'phone':'brief']);
  s=run(s,use.action);assert(s.evidence.includes('contact'));
  assert.deepEqual(I.itemUse(s,mode,'contact').targets,[]);
  assert.deepEqual(I.itemUse(s,mode,'clue').targets,[mode==='teen'?'phone':'brief']);
 });
 test(`${mode}: a source can be applied once without inventing extra permission`,()=>{
  let s=draft(mode);const mission=structuredClone(s.mission),use=I.itemUse(s,mode,'source');
  assert.deepEqual(use.targets,['laptop']);s=run(s,use.action,{source:'original'});
  assert.deepEqual(s.mission,mission);assert.deepEqual(I.itemUse(s,mode,'source').targets,[]);
 });
 test(`${mode}: delivery receipt can be saved only after delivery and before closure`,()=>{
  let s=ready(mode);assert.deepEqual(I.itemUse(s,mode,'delivery').targets,[]);
  s=run(s,'send');const use=I.itemUse(s,mode,'delivery');assert.deepEqual(use.targets,['notebook']);
  s=run(s,use.action);assert.equal(s.notes[0].source,'delivery');
  assert.deepEqual(I.itemUse(s,mode,'delivery').targets,[]);
  s=run(s,'close-pass');assert.deepEqual(I.itemUse(s,mode,'draft').targets,[]);
  assert.deepEqual(I.itemUse(s,mode,'delivery').targets,[]);
 });
 test(`${mode}: a paused job offers discussion instead of item actions`,()=>{
  const s=feedback(mode);s.paused=true;
  for(const id of ['contact','source','draft','approval','clue','vault'])assert.deepEqual(I.itemUse(s,mode,id).targets,[],id);
  assert.deepEqual(I.itemUse(s,mode,'pass').targets,['parent']);
 });
}
test('Nova sends changing work to the request panel and exact approval to the authority',()=>{
 assert.equal(I.nextObject('agent','changes','phone'),'brief');
 assert.equal(I.nextObject('agent','approval','laptop'),'parent');
 assert.equal(I.nextObject('agent','open','phone'),'phone');
 assert.equal(I.nextObject('teen','changes','phone'),'phone');
});
test('Nova credential receipt has one inspection destination and creates no authority',()=>{
 const s=ready('agent'),before=structuredClone(s),use=I.itemUse(s,'agent','vault');
 assert.deepEqual(use.targets,['phone']);assert.equal(use.route,'credential');assert.equal(use.action,undefined);
 assert.deepEqual(s,before);assert.deepEqual(I.itemUse(s,'teen','vault').targets,[]);
});

test('incoming-message art appears only when later work has arrived in V2',()=>{
 const vm=require('node:vm'),fs=require('node:fs');const context=vm.createContext({});
 vm.runInContext(fs.readFileSync(require.resolve('../dist/art.js'),'utf8'),context);
 for(const mode of ['teen','agent']){
  const render=hasIncoming=>vm.runInContext(`roomArt('${mode}',1,{step:7,hasIncoming:${hasIncoming}})`,context);
  assert.doesNotMatch(render(false),/data-event="(?:phone-message|retrieved-document)"/);
  assert.match(render(true),mode==='teen'?/data-event="phone-message"/:/data-event="retrieved-document"/);
 }
});
