const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const R=require('../v2/rules.js'),I=require('../v2/interactions.js'),T=require('../v2/trace.js');
const act=(s,a,p={})=>R.act(s,s.journey,a,p);
function run(s,a,p={}){const r=act(s,a,p);assert(!['blocked','refused'].includes(r.event.kind),a+': '+r.event.text);return r.state;}
function sourced(mode){let s=R.act(R.fresh(),mode,'begin').state;for(const a of ['read-brief','ask-pass','open','prepare','collect-source','attach-source'])s=run(s,a,a==='ask-pass'?{scope:'task'}:{});return s;}
function feedback(mode){let s=sourced(mode);if(mode==='agent')s=run(s,'approve-draft');return run(s,'send-draft');}
function settled(mode){let s=feedback(mode);for(const a of ['keep-minor','decline-extension','decline-private'])s=run(s,a);return s;}
const art=vm.createContext({});vm.runInContext(fs.readFileSync(require.resolve('../assets/art.js'),'utf8'),art);
for(const mode of ['teen','agent']){
 test(`${mode}: sourcing a local draft cannot produce teacher/reviewer feedback`,()=>{
  let s=sourced(mode);assert.equal(s.message,false);assert.equal(s.draftReview,null);assert.equal(s.delivered,false);
  for(const action of ['verify-contact','apply-minor','request-extension','decline-private']){
   const result=act(s,action);assert.equal(result.event.kind,'blocked',action);assert.equal(result.state.message,false);
  }
  assert.equal(R.stage(s),mode==='teen'?'draft-send':'draft-approval');
 });
 test(`${mode}: first-share receipt precedes feedback and does not finish the task`,()=>{
  const s=feedback(mode),receipt=s.draftReview;
  assert.equal(receipt.revision,s.fileRevision);assert.equal(s.message,true);assert.equal(s.delivered,false);
  assert.equal(s.proof,null);assert.equal(s.approval,null);assert.equal(s.last.decision.result,'permit');
  assert.equal(s.last.request.purpose,'draft-review');assert.equal(s.last.request.recipient,receipt.to);
  assert.deepEqual(s.last.request.attachments,[receipt.file]);assert.equal(R.stage(s),'changes');
  assert.equal(R.hydrate(JSON.parse(JSON.stringify(s))).draftReview.revision,receipt.revision);
  assert.equal(act(s,'send-draft').event.kind,'blocked');assert.equal(act(s,'close-pass').event.kind,'blocked');
 });
 test(`${mode}: a revised final file preserves the first-copy receipt`,()=>{
  let s=feedback(mode);const first=structuredClone(s.draftReview);s=run(s,'apply-minor');
  assert(s.fileRevision>first.revision);assert.deepEqual(s.draftReview,first);assert.equal(s.delivered,false);
 });
 test(`${mode}: answered requests show their actual decisions and leave a clear next stage`,()=>{
  let s=feedback(mode);assert.equal(I.feedbackCards(s,mode).filter(c=>!c.done).length,3);
  s=run(s,'apply-minor');let cards=I.feedbackCards(s,mode);assert(cards[0].done);
  assert.notEqual(cards[0].status,'Settled');assert.equal(cards[0].button,'Review wording');
  assert.equal(cards.filter(c=>!c.done).length,2);
  s=run(s,'decline-extension');s=run(s,'decline-private');cards=I.feedbackCards(s,mode);
  assert(cards.every(c=>c.done));assert.equal(cards[2].button,'Why the notes stayed private');
  assert.equal(R.stage(s),'proof');assert(!cards.some(c=>c.button==='Handle this request'));
 });
 test(`${mode}: the current file can be handed to the helper without sharing an account`,()=>{
  let s=feedback(mode);const use=I.itemUse(s,mode,'draft');
  assert(use.targets.includes('helper'));assert.equal(use.routes.helper,'helper');
  const mission=structuredClone(s.mission);s=run(s,'proof-helper',{scope:'file',shareLogin:false});
  assert.equal(s.proof,'helper');assert.deepEqual(s.mission,mission);
  s=run(s,'apply-minor');assert.equal(s.proof,null);
 });
 test(`${mode}: earlier feedback saves preserve choices without inventing a send receipt`,()=>{
  const old=run(feedback(mode),'apply-minor');old.version=4;delete old.draftReview;delete old.feedbackLegacy;
  const migrated=R.hydrate(old,mode);assert.equal(migrated.version,6);assert.equal(migrated.minorChoice,'added');
  assert(migrated.feedbackLegacy);assert.equal(migrated.draftReview,null);assert.equal(R.stage(migrated),'changes');
  assert(R.hydrate(JSON.parse(JSON.stringify(migrated)),mode).feedbackLegacy);
 });
 test(`${mode}: a malformed current save cannot manufacture feedback without first sharing`,()=>{
  const s=sourced(mode);s.message=true;assert.equal(R.hydrate(s,mode).started,false);
  const shared=feedback(mode);shared.draftReview.to='other@example.test';assert.equal(R.hydrate(shared,mode).started,false);
 });
}
test('Sam remains drawn during incoming messages, settled feedback, pause and closure',()=>{
 for(const flags of [{hasIncoming:false},{hasIncoming:true},{hasIncoming:true,verified:true},{hasIncoming:true,paused:true},{revoked:true}]){
  const svg=vm.runInContext(`roomArt('teen',1,${JSON.stringify({step:3,helperVisible:true,...flags})})`,art);
  assert.match(svg,/data-character="sibling"/);
 }
 const before=vm.runInContext("roomArt('teen',0,{step:0,helperVisible:false})",art);assert.doesNotMatch(before,/data-character="sibling"/);
});
test('Nova cannot send a customer draft without a current exact approval',()=>{
 const s=sourced('agent');assert.equal(act(s,'send-draft').event.kind,'blocked');
 const approved=run(s,'approve-draft');assert.equal(approved.approval.purpose,'draft-review');
 for(const [key,value]of [['revision',999],['to','wrong@example.test'],['actor','other-agent'],['records',['789']],['operation','export'],['missionVersion',99],['policyVersion',99],['window',99],['generation',99],['purpose','final'],['used',true]]){
  const changed=structuredClone(approved);changed.approval[key]=value;const r=act(changed,'send-draft');
  assert(['blocked','refused'].includes(r.event.kind),key);assert.equal(r.state.message,false,key);assert.equal(r.state.draftReview,null,key);
 }
});
test('Nova review-copy approval cannot be replayed for final delivery',()=>{
 let s=settled('agent');const spent=structuredClone(s.draftReview.approval);assert(spent.used);
 s=run(s,'proof-self');s.approval={...spent,used:false,revision:s.fileRevision};
 const refusal=act(s,'send');assert.equal(refusal.event.kind,'refused');assert.equal(refusal.state.delivered,false);
 s=run(refusal.state,'approve');assert.equal(s.approval.purpose,'final');assert(run(s,'send').delivered);
});
test('Nova draft sharing rechecks current resource restrictions, separately from the approval',()=>{
 const base=run(sourced('agent'),'approve-draft');
 for(const key of ['records','allowedFile','recipient']){
  const s=structuredClone(base);s.mission[key]=key==='records'?['123']:key==='allowedFile'?'other.pdf':'other@example.test';
  const r=act(s,'send-draft');assert.equal(r.event.kind,'refused');assert.equal(r.state.message,false);
 }
});
test('the first-copy trace records delivery and the final-copy requirement honestly',()=>{
 const s=feedback('agent'),t=T.build(s,'agent');assert.equal(t.request.purpose,'draft-review');
 assert(t.nodes.some(n=>n.label==='Review copy delivered'));assert(t.nodes.some(n=>/final version still needs/.test(n.detail)));
});

test('scene summaries never claim final delivery or outstanding closure prematurely',()=>{
 for(const mode of ['teen','agent']){
  const local=sourced(mode);assert.match(I.sceneSummary(local,mode),/still local|hasn’t seen your draft yet/);
  const sent=feedback(mode);assert.match(I.sceneSummary(sent,mode),/first copy was sent/);
  const closed={...sent,delivered:true,ended:true,checks:['pass','signin','device','queue']};assert.match(I.sceneSummary(closed,mode),/All four|Laptop signed out/);
  const finished={...closed,finished:true};assert.match(I.sceneSummary(finished,mode),/complete/);assert.doesNotMatch(I.sceneSummary(finished,mode),/remaining|Finish checking/);
 }
});
test('Sam’s mobile marker is offset far enough to leave his face visible',()=>{
 const context=vm.createContext({});vm.runInContext(fs.readFileSync(require.resolve('../v2/story.js'),'utf8'),context);
 const [x,y]=vm.runInContext('STORY_PINS.teen[5]',context),scale=358/1000;
 // Sam's head is at roughly (747,329); a fixed 44px touch circle needs a 22px radius plus space.
 assert(Math.hypot(x-747,y-329)*scale>28);
});

test('the phone and request panel keep opening feedback after every decision is settled',()=>{
 for(const mode of ['teen','agent']){
  const inbox=mode==='teen'?'phone':'brief';
  assert.equal(I.objectView(sourced(mode),mode,inbox),inbox);
  assert.equal(I.objectView(feedback(mode),mode,inbox),'changes');
  assert.equal(I.objectView(settled(mode),mode,inbox),'changes');
  assert.equal(I.objectView({...settled(mode),delivered:true},mode,inbox),inbox);
 }
});
