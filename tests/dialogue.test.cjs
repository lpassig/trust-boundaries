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
test('thoughts, independent resource responses and conversations stay attributable',()=>{
 assert.equal(I.eventSource('teen','Alex'),'hero');assert.equal(I.eventSource('agent','Nova'),'hero');
 assert.equal(I.eventSource('teen','Teacher'),'phone');assert.equal(I.eventSource('agent','CRM resource PEP'),'laptop');
 assert.equal(I.eventSource('agent','Sponsor'),'parent');assert.equal(I.eventSource('teen','App control'),'phone');
 assert.equal(I.speechSource('agent','unknown-object').name,'Nova');
});

test('permission and service replies point to the responsible control even when narrated by the hero',()=>{
 assert.equal(I.eventSource('teen','Alex','ask-pass'),'parent');
 assert.equal(I.eventSource('agent','Nova','open'),'phone');
 assert.equal(I.eventSource('agent','Nova','collect-source'),'laptop');
 assert.equal(I.eventSource('teen','School receipt','send-draft'),'laptop');
});
