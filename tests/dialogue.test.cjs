const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const R=require('../v2/rules.js'),I=require('../v2/interactions.js');
const context=vm.createContext({});
vm.runInContext(fs.readFileSync(require.resolve('../assets/art.js'),'utf8'),context);
vm.runInContext(fs.readFileSync(require.resolve('../v2/story.js'),'utf8'),context);
function helperReview(mode){
 let s=R.act(R.fresh(),mode,'begin').state;
 for(const a of ['read-brief','ask-pass','open','prepare','collect-source','attach-source','proof-helper']){
  const p=a==='ask-pass'?{scope:'task'}:a==='proof-helper'?{scope:'file',shareLogin:false}:{};
  const result=R.act(s,mode,a,p);assert(!['blocked','refused'].includes(result.event.kind));s=result.state;
 }
 return s;
}
for(const mode of ['teen','agent']){
 test(`${mode}: helper replies identify the actual speaker and preserve task authority`,()=>{
  const s=helperReview(mode),key=I.eventSource(mode,s.last.speaker),source=I.speechSource(mode,key);
  assert.equal(key,'helper');assert.equal(source.name,mode==='teen'?'Sam':'Pip');assert.equal(source.kind,'Speaking');
  assert.equal(s.mission.version,1);assert.equal(s.mission.privateNotesAllowed,false);assert.equal(s.delivered,false);
 });
 test(`${mode}: every room control has a distinct speech source without pretending to be a person`,()=>{
  for(const key of ['parent','phone','laptop','brief','notebook','helper']){
   const source=I.speechSource(mode,key);assert.equal(source.key,key);
   assert(source.name);assert(source.point.every(Number.isFinite));
   assert(source.point[0]>0&&source.point[0]<1000);assert(source.point[1]>0&&source.point[1]<580);
   if(['phone','laptop'].includes(key))assert.equal(source.kind,'On screen');
   if(['brief','notebook'].includes(key))assert.equal(source.kind,'Reading');
  }
 });
 test(`${mode}: the 44px helper control stays beside the helper on narrow screens`,()=>{
  const [x,y]=vm.runInContext(`STORY_PINS.${mode}[5]`,context),face=I.speechSource(mode,'helper').point;
  assert(Math.hypot(x-face[0],y-face[1])*(358/1000)>28);
  assert(x/1000*358+22<=358);
 });
}
test('Pip remains drawn once, across messages, review, stopped runtime and task closure',()=>{
 for(const state of [{},{step:7,helperVisible:true},{step:3,helperVisible:true,hasIncoming:true},{step:7,verified:true},{step:7,paused:true},{step:7,revoked:true}]){
  const svg=vm.runInContext(`roomArt('agent',1,${JSON.stringify(state)})`,context);
  assert.equal((svg.match(/data-character="pip"/g)||[]).length,1);
  assert.match(svg,/data-face-x="839" data-face-y="385"/);
 }
});
test('an earlier Nova discovery resumes with Pip’s offer to format the draft',()=>{
 const original=R.act(R.fresh(),'agent','begin').state;
 const saved={...original,last:{title:'A resilient little plant.',speaker:'Nova',action:'discover',kind:'story'}};
 const restored=R.hydrate(saved,'agent');
 assert.equal(restored.last.speaker,'Pip');
 assert.match(restored.last.text,/tidy the headings/);
 assert.equal(restored.started,true);
});
test('thoughts, independent resource responses and conversations stay attributable',()=>{
 assert.equal(I.eventSource('teen','Alex'),'hero');assert.equal(I.eventSource('agent','Nova'),'hero');
 assert.equal(I.eventSource('teen','Teacher'),'reviewer');assert.equal(I.eventSource('agent','CRM resource PEP'),'laptop');
 assert.equal(I.eventSource('agent','Sponsor'),'parent');assert.equal(I.eventSource('teen','App control'),'phone');
 assert.equal(I.speechSource('agent','unknown-object').name,'Nova');
});

test('permission and service replies point to the responsible control even when narrated by the hero',()=>{
 assert.equal(I.eventSource('teen','Alex','ask-pass'),'parent');
 assert.equal(I.nextObject('teen','open','phone'),'laptop');
 assert.equal(I.eventSource('teen','Alex','open'),'laptop');
 assert.equal(I.eventSource('agent','Nova','open'),'phone');
 assert.equal(I.eventSource('agent','Nova','collect-source'),'source');
 assert.equal(I.eventSource('teen','School receipt','send-draft'),'laptop');
});

for(const mode of ['teen','agent']){
 test(`${mode}: shared scene beats distinguish a reviewer's message, the outside source and the resource denial`,()=>{
  const s=helperReview(mode),teen=mode==='teen';
  assert.deepEqual(Array.from(I.availableTools(R.fresh())),[]);
  assert.deepEqual(Array.from(I.availableTools(s)),['source','reviewer']);
  const approved=teen?s:R.act(s,mode,'approve-draft').state;
  const replied=R.act(approved,mode,'send-draft').state;
  assert.deepEqual(Array.from(I.availableTools(replied)),['source','reviewer','outside']);
  const compared=R.act(replied,mode,'inspect-request-source');
  const denied=R.act(compared.state,mode,'try-private');
  const source=event=>I.speechSource(mode,I.eventSource(mode,event.speaker,event.action,event.kind));
  assert.equal(source(compared.event).tool,'outside');
  assert.equal(source(compared.event).object,teen?'phone':'laptop');
  assert.equal(source(denied.event).key,'laptop');
  assert.equal(I.speechSource(mode,'reviewer').name,teen?'Ms Patel':'Morgan');
  assert.equal(denied.state.paused,false);
  const early=R.act(replied,mode,'try-extension');
  assert.equal(source(early.event).key,teen?'homework':'laptop');
  const bypass=R.act(denied.state,mode,'bypass-notes');
  assert.equal(source(bypass.event).key,'stop');
  assert.equal(bypass.state.paused,true);
 });
}
