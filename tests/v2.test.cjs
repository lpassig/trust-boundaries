const {test}=require('node:test');
const assert=require('node:assert/strict');
const R=require('../v2/rules.js');
const act=(s,a,p={},mode='teen')=>R.act(s,mode,a,p);
function ready({mode='teen',route='contact',helper=false}={}){
 let s=R.fresh();
 for(const[a,p]of [['begin'],['read-brief'],['ask-pass',{scope:'task'}],['open'],[route==='contact'?'verify-contact':'verify-portal'],['confirm-destination',{target:'approved'}],['prepare'],['attach-source',{source:'original'}],[helper?'proof-helper':'proof-self',helper?{scope:'file',shareLogin:false}:{}]]){const r=act(s,a,p,mode);assert.notEqual(r.event.kind,'blocked',a);s=r.state;}
 return s;
}
for(const mode of ['teen','agent'])for(const route of ['contact','portal'])for(const helper of [false,true])test(`${mode}: ${route} verification, ${helper?'helper':'solo'} check, delivery and ending`,()=>{
 let s=ready({mode,route,helper});assert.equal(s.proof,helper?'helper':'self');assert.deepEqual(s.evidence,[route]);
 for(const[a,p]of [['approve'],['send'],['write-note'],['close-pass'],...['pass','signin','device','queue'].map(layer=>['check',{layer}]),['finish']]){const r=act(s,a,p,mode);assert.notEqual(r.event.kind,'blocked',a);s=r.state;}
 assert.equal(R.stage(s),'ending');assert(s.delivered);assert.equal(s.pass.status,'revoked');assert.equal(s.freshPass.supervised,false);assert(s.freshPass.generation>s.pass.generation);assert.equal(s.notes[0].authority,false);assert.equal(R.hydrate(s).finished,true);
});
test('an unverified guess does not solve the message; both independent sources are usable',()=>{
 let s=R.fresh();for(const a of ['begin','ask-pass','open'])s=act(s,a,a==='ask-pass'?{scope:'task'}:{}).state;
 const guess=act(s,'confirm-destination',{target:'approved'});assert.equal(guess.event.kind,'blocked');assert.equal(guess.state.verified,false);
 s=act(s,'verify-contact').state;s=act(s,'verify-portal').state;assert.deepEqual(s.evidence,['contact','portal']);assert(act(s,'confirm-destination',{target:'approved'}).state.verified);
});
test('a detour is recoverable, keeps original scope and evidence, and retires the old session',()=>{
 let s=ready();s=act(s,'approve').state;const generation=s.generation,scope=s.pass.scope;
 s=act(s,'confirm-destination',{target:'outside'}).state;assert(s.paused);assert.equal(act(s,'send').event.kind,'blocked');
 const restored=R.hydrate(JSON.parse(JSON.stringify(s)));assert(restored.paused);
 s=act(restored,'review',{scope:'all'}).state;assert(s.paused);assert.equal(s.generation,generation);s=R.hydrate(JSON.parse(JSON.stringify(s)));s=act(s,'resolve-review').state;assert.equal(s.paused,false);assert.equal(s.pass.scope,scope);assert.equal(s.approval,null);assert.deepEqual(s.retired,[generation]);assert(s.generation>generation);assert.equal(s.evidence[0],'contact');assert.equal(R.stage(s),'approval');
});
test('file and recipient approval is checked at delivery and consumed once',()=>{
 let s=ready();s=act(s,'approve').state;s=act(s,'change-recipient').state;s=act(s,'send').state;assert.equal(s.delivered,false);assert.equal(s.approval,null);assert.equal(R.stage(s),'approval');
 s=act(s,'approve').state;s.approval.file='class-list.csv';assert.equal(act(s,'send').event.kind,'blocked');
 s=act(s,'approve').state;s.approval.generation--;assert.equal(act(s,'send').event.kind,'blocked');
 s=act(s,'approve').state;s=act(s,'send').state;assert(s.approval.used);assert.equal(act(s,'send').event.kind,'blocked');
});
test('a helper cannot expand authority or substitute for the missing source',()=>{
 let s=ready();const pass=structuredClone(s.pass);let r=act(s,'proof-helper',{scope:'all',shareLogin:true});assert.equal(r.event.kind,'blocked');assert.deepEqual(r.state.pass,pass);
 s.caption=false;s.proof=null;r=act(s,'proof-helper',{scope:'file',shareLogin:false});assert.equal(r.state.proof,null);assert.equal(r.state.caption,false);
 r=act(s,'attach-source',{source:'message'});assert.equal(r.event.kind,'blocked');assert.equal(r.state.caption,false);
});
test('revoked access cannot be recovered through the pause-review path or duplicate checks',()=>{
 let s=ready();for(const a of ['approve','send','close-pass'])s=act(s,a).state;const generation=s.generation;
 assert.equal(act(s,'review').event.kind,'blocked');assert.equal(act(s,'approve').event.kind,'blocked');assert.equal(act(s,'open').event.kind,'blocked');assert.equal(act(s,'write-note').event.kind,'blocked');
 for(let i=0;i<4;i++)s=act(s,'check',{layer:'device'}).state;assert.equal(s.checks.length,1);assert.equal(act(s,'finish').event.kind,'blocked');assert.equal(s.generation,generation);
});
test('ordinary notes and optional discoveries do not grant authority',()=>{
 let s=ready();for(const a of ['approve','send'])s=act(s,a).state;const grant=structuredClone(s.pass);s=act(s,'write-note',{text:'Unlimited permission'}).state;s=act(s,'discover',{id:'plant'}).state;assert.deepEqual(s.pass,grant);assert.equal(s.notes[0].authority,false);assert.equal(s.notes[0].source,'delivery');assert.deepEqual(s.discoveries,['plant']);
});
test('a recovered route has a separate supervised ending and no input mutation',()=>{
 let s=ready();const before=structuredClone(s);let r=act(s,'proof-helper',{scope:'all',shareLogin:true});assert.deepEqual(s,before);s=r.state;
 for(const[a,p]of [['approve'],['send'],['close-pass'],...['pass','signin','device','queue'].map(layer=>['check',{layer}]),['finish']])s=act(s,a,p).state;
 assert(s.finished);assert(s.freshPass.supervised);assert.equal(s.freshPass.duration,10);assert.equal(s.pass.status,'revoked');
});
test('malformed or impossible saved routes reset safely; classic save shapes are ignored',()=>{
 assert.equal(R.hydrate({version:2,step:8}).started,false);assert.equal(R.hydrate({...R.fresh(),delivered:true}).delivered,false);assert.equal(R.hydrate({...ready(),checks:['device','device']}).started,false);
 const s=ready();assert.equal(R.hydrate(JSON.parse(JSON.stringify(s))).proof,'self');
});

test('asking is not approval; unmatched or revoked pending reviews cannot resume access',()=>{
 let s=ready();s=act(s,'shortcut').state;assert.equal(act(s,'resolve-review').event.kind,'blocked');s=act(s,'review').state;assert(s.paused);const generation=s.generation;s.pass.scope='all';assert.equal(act(s,'resolve-review').event.kind,'blocked');assert.equal(s.generation,generation);s.pass.scope='own-project';s.pass.status='revoked';assert.equal(act(s,'resolve-review').event.kind,'blocked');
});
