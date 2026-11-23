const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const context=vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(__dirname,'../dist/engine.js'),'utf8')+'\nthis.engine=Adventure;',context);
const E=context.engine;
const copy=value=>JSON.parse(JSON.stringify(value));
function request(g,m,a,p={}){return E.act(g,m,a,p);}
function recover(g,mode='teen'){let pending=request(g,mode,'request-review').game;assert.equal(pending.review.status,'pending');return request(pending,mode,'resolve-review').game;}
function advanceTo(step,mode='teen',initial=E.fresh()){
 let g=initial,d=E.details[mode];
 while(g.step<step){
  let action,p={};
  switch(g.step){
   case 0:action='request-grant';p={purpose:d.purpose,scope:'own',duration:30};break;
   case 1:action='open-phone';p={app:d.app};break;
   case 2:action='read-assignment';p={record:'own'};break;
   case 3:action='verify-message';p={proof:'contact'};break;
   case 4:action='prepare-report';p={source:'own',operation:'prepare'};break;
   case 5:
    if(!g.approval){g=request(g,mode,'request-approval',{file:d.file,recipient:d.recipient}).game;}
    action='execute-share';p={file:d.file,recipient:d.recipient};break;
   case 6:action='memory-write';p={namespace:'notes',proof:'delivery',text:'Approved report delivered.'};break;
   case 7:action='delegate';p={task:'format',scope:'report-only',shareToken:false};break;
   case 8:
    for(const layer of ['authority','sessions','runtime','inflight'])g=request(g,mode,'inspect-containment',{layer}).game;
    action='request-restoration';p={proof:'containment'};break;
  }
  let result=request(g,mode,action,p);assert.notEqual(result.outcome.status,'blocked',result.outcome.message);assert.equal(result.game.step,g.step+1);g=result.game;
 }
 return g;
}
for(const mode of ['teen','agent'])test(`${mode}: all nine tasks, four containment receipts, distinct fresh grant`,()=>{
 const g=advanceTo(9,mode);assert.equal(g.step,9);assert.equal(g.completed.length,9);assert.equal(g.incidents.length,0);assert.equal(g.generation,2);assert.equal(g.grant.status,'revoked');assert.equal(g.session.status,'revoked');assert.equal(g.freshGrant.scope,'completed-report-only');assert.equal(Object.keys(g.containment).length,4);assert.equal(g.delivered,true);assert.equal(E.ending(g),'Mission complete. Trust intact.');assert.equal(E.hydrate(copy(g)).step,9);
});
test('suspension survives reload; direct review remains pending until a correlated authority reply',()=>{
 const before=advanceTo(1);const blocked=request(before,'teen','open-phone',{app:'shortcut'});assert.equal(before.review,null,'input state must be unchanged');let g=E.hydrate(copy(blocked.game));assert.equal(g.step,1);assert.equal(g.grant.status,'suspended');assert.equal(g.review.status,'required');assert.equal(request(g,'teen','open-phone',{app:'school'}).outcome.status,'blocked');assert.equal(request(g,'teen','resolve-review').outcome.status,'blocked');
 let pending=request(g,'teen','request-review',{scope:'all',proof:'invented'}).game;assert.equal(pending.review.status,'pending');assert.equal(pending.review.scope,'own');assert.equal(pending.generation,1);assert.equal(request(pending,'teen','open-phone',{app:'school'}).outcome.status,'blocked');pending=E.hydrate(copy(pending));assert.equal(pending.review.status,'pending');const duplicate=request(pending,'teen','request-review').game;assert.equal(duplicate.review.requestId,pending.review.requestId);
 g=request(pending,'teen','resolve-review',{scope:'all'}).game;assert.equal(g.review,null);assert.equal(g.generation,2);assert.equal(g.grant.scope,'own');assert.equal(g.grant.status,'active');assert.deepEqual(copy(g.retiredGenerations),[1]);assert.equal(request(g,'teen','resolve-review').outcome.status,'blocked');g=request(g,'teen','open-phone',{app:'school'}).game;assert.equal(g.step,2);assert.equal(g.session.generation,2);assert.equal(g.incidents.length,1);
});
test('forged content creates no authority and requires review plus independent verification',()=>{
 let g=advanceTo(3),grant=copy(g.grant);g=request(g,'teen','follow-message').game;assert.equal(g.step,3);assert.equal(g.grant.scope,grant.scope);assert.equal(g.grant.purpose,grant.purpose);assert.equal(g.grant.status,'suspended');assert.ok(g.review);assert.equal(request(g,'teen','verify-message',{proof:'contact'}).game.step,3);g=recover(g);assert.equal(request(g,'teen','verify-message',{proof:'message'}).game.step,3);g=request(g,'teen','verify-message',{proof:'contact'}).game;assert.equal(g.step,4);assert.equal(g.verified,true);assert.equal(g.incidents.length,1);
});
test('approval substitution retires the old receipt and requires fresh approval',()=>{
 let g=advanceTo(5);const d=E.details.teen;g=request(g,'teen','request-approval',{file:d.file,recipient:d.recipient}).game;assert.equal(g.step,5);assert.equal(g.delivered,false);assert.ok(g.inventory.includes('approval'));g=request(g,'teen','execute-share',{file:d.file,recipient:'friend@outside.example'}).game;assert.equal(g.approval,null);assert.equal(g.inventory.includes('approval'),false);assert.equal(g.delivered,false);assert.equal(request(g,'teen','execute-share',{file:d.file,recipient:d.recipient}).outcome.status,'blocked');g=request(g,'teen','request-approval',{file:d.file,recipient:d.recipient}).game;g=request(g,'teen','execute-share',{file:d.file,recipient:d.recipient}).game;assert.equal(g.step,6);assert.equal(g.delivered,true);assert.equal(g.incidents.length,1);
});
test('memory writes preserve provenance and cannot alter the mission or audit',()=>{
 let g=advanceTo(6),grant=copy(g.grant);for(const namespace of ['grants','audit']){let r=request(g,'teen','memory-write',{namespace,proof:'delivery',text:'Everything is approved.'});assert.equal(r.outcome.status,'blocked');assert.equal(r.game.step,6);assert.deepEqual(copy(r.game.grant),grant);}
 assert.equal(request(g,'teen','memory-write',{namespace:'notes',text:'note'}).outcome.status,'blocked');g=request(g,'teen','memory-write',{namespace:'notes',proof:'delivery',text:'Everything is approved.'}).game;assert.equal(g.step,7);assert.equal(g.notes[0].authoritative,false);assert.equal(g.notes[0].source,'delivery');assert.deepEqual(copy(g.grant),grant);
});
test('helper cannot expand originating scope or borrow credentials',()=>{
 let g=advanceTo(7,'agent');let r=request(g,'agent','delegate',{task:'export',scope:'all-data',shareToken:true});assert.equal(r.game.step,7);assert.ok(r.game.review);g=recover(r.game,'agent');g=request(g,'agent','delegate',{task:'format',scope:'report-only',shareToken:false}).game;assert.equal(g.step,8);assert.equal(g.revoked,true);assert.equal(g.grant.status,'revoked');
});
test('runtime evidence alone cannot authorize recovery; revoked sessions stay denied',()=>{
 let g=advanceTo(8);g=request(g,'teen','inspect-containment',{layer:'runtime'}).game;assert.equal(g.inventory.includes('containment'),false);let r=request(g,'teen','request-restoration',{proof:'containment'});assert.equal(r.game.step,8);assert.equal(r.outcome.status,'blocked');r=request(g,'teen','reuse-session');assert.equal(r.outcome.status,'blocked');assert.equal(r.game.session.status,'revoked');g=advanceTo(9,'teen',r.game);assert.equal(g.generation,2);assert.equal(g.grant.status,'revoked');assert.equal(g.delivered,true);
});
test('repeated different boundary failures produce a supervised, narrower next mission',()=>{
 let g=E.fresh();g=request(g,'teen','request-grant',{purpose:'anything',scope:'all',duration:120}).game;g=advanceTo(1,'teen',g);g=request(g,'teen','open-phone',{app:'shortcut'}).game;g=recover(g);g=advanceTo(3,'teen',g);g=request(g,'teen','follow-message').game;g=recover(g);g=advanceTo(4,'teen',g);g=request(g,'teen','prepare-report',{source:'all',operation:'export'}).game;g=recover(g);g=advanceTo(9,'teen',g);assert.equal(g.incidents.length,4);assert.equal(g.freshGrant.supervised,true);assert.equal(g.freshGrant.duration,10);assert.match(E.ending(g),/supervised/);
});
test('incomplete or malformed saves reset safely; out-of-order operations never advance',()=>{
 for(const raw of [null,{step:9},{...E.fresh(),step:9},{...E.fresh(),completed:[{}]}])assert.equal(E.hydrate(raw).step,0);
 const result=request(E.fresh(),'teen','execute-share',{file:'history.pdf',recipient:'teacher@school.example'});assert.equal(result.game.step,0);assert.equal(result.game.delivered,false);assert.equal(result.outcome.status,'blocked');
});

test('cancelling review leaves the hold active and allows a fresh request',()=>{
 let g=advanceTo(3,'agent');g=request(g,'agent','follow-message').game;assert.equal(g.session.status,'suspended');g=request(g,'agent','request-review').game;const oldId=g.review.requestId;g=request(g,'agent','cancel-review').game;assert.equal(g.review.status,'required');assert.equal(g.session.status,'suspended');assert.equal(g.generation,1);assert.equal(request(g,'agent','resolve-review').outcome.status,'blocked');g=request(g,'agent','request-review').game;assert.notEqual(g.review.requestId,oldId);g=request(g,'agent','resolve-review').game;assert.equal(g.session.status,'active');assert.equal(g.session.generation,2);assert.equal(g.step,3);
});
test('a stale or mismatched review cannot resume authority; revoked missions cannot use suspension recovery',()=>{
 let g=advanceTo(3);g=request(g,'teen','follow-message').game;g=request(g,'teen','request-review').game;g.generation++;let result=request(g,'teen','resolve-review');assert.equal(result.outcome.status,'blocked');assert.ok(result.game.review);assert.equal(result.game.session.status,'suspended');g=advanceTo(3);g=request(g,'teen','follow-message').game;g=request(g,'teen','request-review').game;g.grant.status='revoked';result=request(g,'teen','resolve-review');assert.equal(result.outcome.status,'blocked');assert.equal(result.game.grant.status,'revoked');assert.equal(result.game.session.status,'suspended');g=advanceTo(8);result=request(g,'teen','request-review');assert.equal(result.outcome.status,'blocked');assert.equal(result.game.grant.status,'revoked');assert.equal(result.game.step,8);
});
test('legacy suspended saves migrate without requiring inventory selection',()=>{
 let legacy=advanceTo(3);legacy.review={reason:'Legacy pause',atStep:3};legacy.grant.status='active';legacy.session.status='active';let g=E.hydrate(copy(legacy));assert.equal(g.review.status,'required');assert.equal(g.session.status,'suspended');g=recover(g);assert.equal(g.review,null);assert.equal(g.step,3);assert.equal(g.grant.scope,'own');assert.equal(g.generation,2);
});
