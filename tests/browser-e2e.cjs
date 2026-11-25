const assert = require('node:assert/strict');
const {spawn} = require('node:child_process');
const {mkdtempSync,rmSync,writeFileSync} = require('node:fs');
const {tmpdir} = require('node:os');
const path = require('node:path');
const {pathToFileURL} = require('node:url');

// Run with local Chromium or Google Chrome. No game credentials or real browser profile are used.
const profile = mkdtempSync(path.join(tmpdir(),'trust-scene-qa-'));
const game = path.resolve(process.argv[2] || 'docs/index.html');
const executable = process.env.CHROME || (process.platform==='darwin'
  ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' : 'chromium');
const chrome = spawn(executable, [
  '--headless', '--remote-debugging-pipe', '--no-first-run', '--disable-background-networking',
  '--disable-sync', '--disable-component-update', '--disable-features=IsolateSandboxedIframes',
  '--disable-background-timer-throttling', '--disable-renderer-backgrounding',
  '--user-data-dir='+profile, 'about:blank'
], {stdio:['ignore','ignore','inherit','pipe','pipe']});
const pending = new Map();
const pointerBindings = new Map();
const captureBindings = new Map();
let buffer='', serial=0;
chrome.stdio[4].setEncoding('utf8');
chrome.stdio[4].on('data', chunk=>{
  buffer += chunk;
  let end;
  while ((end=buffer.indexOf('\0'))>=0) {
    const message=JSON.parse(buffer.slice(0,end));
    buffer=buffer.slice(end+1);
    if(message.method==='Runtime.bindingCalled'&&message.params.name==='nativeTap'){
      pointerBindings.get(message.sessionId)?.(JSON.parse(message.params.payload));
      continue;
    }
    if(message.method==='Runtime.bindingCalled'&&message.params.name==='captureScene'){
      captureBindings.get(message.sessionId)?.(message.params.payload);
      continue;
    }
    const waiting=pending.get(message.id);
    if (!waiting) continue;
    pending.delete(message.id);
    if(message.error)waiting.reject(new Error(JSON.stringify(message.error)));
    else waiting.resolve(message.result);
  }
});
chrome.on('error',error=>{console.error(error.message);process.exitCode=1;});
chrome.on('exit', code=>{
  rmSync(profile,{recursive:true,force:true});
  for(const waiting of pending.values())waiting.reject(new Error('Chrome exited '+code));
});
function call(method,params={},sessionId){
  const id=++serial;
  return new Promise((resolve,reject)=>{
    pending.set(id,{resolve,reject});
    chrome.stdio[3].write(JSON.stringify({id,method,params,sessionId})+'\0');
  });
}
async function testPage(width,height,exercise,hook){
  const {browserContextId}=await call('Target.createBrowserContext');
  const {targetId}=await call('Target.createTarget',{url:'about:blank',browserContextId});
  const {sessionId}=await call('Target.attachToTarget',{targetId,flatten:true});
  const send=(method,params)=>call(method,params,sessionId);
  await send('Emulation.setDeviceMetricsOverride',{width,height,mobile:width<500,deviceScaleFactor:1});
  await send('Runtime.enable');
  await send('Runtime.addBinding',{name:'nativeTap'});
  if(process.env.TRUST_QA_SCREENSHOTS){
   await send('Runtime.addBinding',{name:'captureScene'});
   captureBindings.set(sessionId,async name=>{
    try{
     const {data}=await send('Page.captureScreenshot',{format:'png'});
     writeFileSync(path.join(process.env.TRUST_QA_SCREENSHOTS,name+'-'+width+'.png'),Buffer.from(data,'base64'));
     await send('Runtime.evaluate',{expression:'window.finishCapture()'});
    }catch(error){
     await send('Runtime.evaluate',{expression:'window.finishCapture('+JSON.stringify(String(error))+')'});
    }
   });
  }
  if(width<500)await send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});
  let pointerCount=0;
  pointerBindings.set(sessionId,async ({x,y})=>{
    try{
      pointerCount++;
      if(width<500){
        await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
        await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
      }else{
        await send('Input.dispatchMouseEvent',{type:'mouseMoved',x,y});
        await send('Input.dispatchMouseEvent',{type:'mousePressed',x,y,button:'left',clickCount:1});
        await send('Input.dispatchMouseEvent',{type:'mouseReleased',x,y,button:'left',clickCount:1});
      }
      await send('Runtime.evaluate',{expression:'window.finishTap()'});
    }catch(error){
      await send('Runtime.evaluate',{expression:'window.finishTap('+JSON.stringify(String(error))+')'});
    }
  });
  await send('Page.enable');
  await send('Network.enable');
  await send('Network.emulateNetworkConditions',{offline:true,latency:0,downloadThroughput:0,uploadThroughput:0});
  await send('Page.navigate',{url:pathToFileURL(game).href});
  for(let tries=0;tries<40;tries++){
    const loaded=await send('Runtime.evaluate',{expression:"document.readyState==='complete' && Boolean(document.querySelector('#game button'))",returnByValue:true});
    if(loaded.result.value)break;
    await new Promise(resolve=>setTimeout(resolve,50));
  }
  const enablePointer="window.tap="+tap.toString()+";window.deviceAction="+deviceAction.toString()+
   ";window.closeDevice="+closeDevice.toString()+";window.capture="+capture.toString()+";";
  const value=await send('Runtime.evaluate',{expression:enablePointer+'('+exercise.toString()+')()',returnByValue:true,awaitPromise:true});
  pointerBindings.delete(sessionId);
  captureBindings.delete(sessionId);
  if(value.exceptionDetails)throw new Error(value.exceptionDetails.exception?.description||value.exceptionDetails.text);
  if(hook)await hook(send);
  if(process.env.TRUST_QA_SCREENSHOTS){
   const {data}=await send('Page.captureScreenshot',{format:'png'});
   writeFileSync(path.join(process.env.TRUST_QA_SCREENSHOTS,exercise.name+'-'+width+'.png'),Buffer.from(data,'base64'));
  }
  await call('Target.disposeBrowserContext',{browserContextId});
  return {...value.result.value,nativeInputs:pointerCount};
}
async function tap(el){
  el.scrollIntoView({behavior:'instant',block:'center',inline:'nearest'});
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  const rect=el.getBoundingClientRect();
  const x=rect.left+rect.width/2,y=rect.top+rect.height/2;
  const target=document.elementFromPoint(x,y);
  if(!target||!el.contains(target))throw Error('Pointer cannot reach '+(el.textContent.trim()||el.getAttribute('aria-label'))+' in '+document.querySelector('#screen-title')?.textContent+' at '+x+','+y+' owning '+target?.tagName+':'+target?.id+' '+target?.className);
  await new Promise((resolve,reject)=>{
    window.finishTap=error=>error?reject(Error(error)):resolve();
    nativeTap(JSON.stringify({x,y}));
  });
  await new Promise(resolve=>requestAnimationFrame(resolve));
}
async function capture(name){
 if(!window.captureScene)return;
 window.scrollTo(0,0);
 await new Promise(requestAnimationFrame);
 await new Promise((resolve,reject)=>{
  window.finishCapture=error=>error?reject(Error(error)):resolve();
  window.captureScene(name);
 });
}


async function closeDevice(){
 const back=document.querySelector('.device-breadcrumb button');
 if(back)await tap(back);
}
async function deviceAction(prefix){
 const pick=()=>[...document.querySelectorAll('#game button')].find(b=>b.getClientRects().length&&b.textContent.trim().startsWith(prefix));
 let target=pick();
 if(!target){
  await closeDevice();
  target=pick();
 }
 if(!target){
  const devices=[...document.querySelectorAll('[data-device-launch]')].map(b=>b.dataset.deviceLaunch);
  for(const device of devices){
   await tap(document.querySelector('[data-device-launch="'+device+'"]'));
   target=pick();
   if(target)break;
   await closeDevice();
  }
 }
 if(!target)throw Error('Unavailable action '+prefix+' in '+document.querySelector('#screen-title').textContent);
 await tap(target);
}

async function immersionReview(){
 const q=s=>document.querySelector(s);
 const ensure=(value,message)=>{if(!value)throw Error(message);};
 const action=async prefix=>{
  const el=[...document.querySelectorAll('#game button')].find(item=>item.getClientRects().length&&item.textContent.trim().startsWith(prefix));
  if(!el)throw Error('Missing '+prefix);
  await tap(el);
  ensure(document.documentElement.scrollWidth<=innerWidth,'Page widened after '+prefix);
 };
 const home=async()=>tap(q('.topbar nav a[href="#"]'));
 const alexRoom=async room=>{
  await closeDevice();
  await tap(q('[data-shadow-room="'+room+'"]'));
 };
 const novaRoom=async room=>tap(q('[data-nova-room="'+room+'"]'));
 const stages=['unknown','build','authorize','resist'];
 for(const [index,stage] of stages.entries()){
  await home();
  await tap(q('[data-maturity="'+stage+'"] [data-home-journey=alex]'));
  await capture('alex-'+stage);
  let count=0;
  while(!ShadowStory.complete(household[stage])){
   const prior=household[stage];
   const [id,room,key,label]=ShadowStory.next(prior);
   await alexRoom(room);
   await deviceAction(label);
   ensure(household[stage].index===prior.index+1,'Alex stalled at '+id);
   if(stage==='authorize'&&id==='approveOutput')ensure(q('#game').textContent.includes('Ready to deliver'),'Alex’s receipt is unclear');
   if(++count>50)throw Error('Alex did not finish');
  }
 }
 await alexRoom('kitchen');
 await tap(q('.room-scenarios summary'));
 await action('Jo’s access app is offline');
 ensure(q('[data-device-screen=joPhone]')&&q('.shadow-reply').textContent.includes('Can’t connect to Family Access'),'The outage is not shown on Jo’s phone');
 await action('Ask Jo for more time in the folder');
 ensure(q('.shadow-reply').textContent.includes('current pass unchanged'),'New pass appears during outage');
 await action('Ask Jo for the original laptop password');
 ensure(q('.shadow-reply').textContent.includes('Use your current pass'),'Fallback is unclear');
 await action('Check the existing session');
 ensure(q('[data-device-screen=laptop]')&&q('.shadow-reply').textContent.includes('until the timer runs out'),'Offline window is unclear');
 await action('Let the access timer run out');
 ensure(q('.shadow-reply').textContent.includes('Your pass has expired'),'Expired pass is not blocked');
 await action('Try again when Jo’s app comes back');
 ensure(q('[data-device-screen=joPhone]')&&q('.shadow-reply').textContent.includes('app issues a new pass'),'Recovery is unclear');
 await action('Return to the assignment');
 ensure(ShadowStory.complete(household.resist),'Optional scenario changed Alex’s main journey');
 const alexSave=localStorage.getItem('trust-boundaries-household-1');
 const runNova=async (stage,checkpoint)=>{
  let count=0;
  while(!NovaRailway.complete(novaStates[stage])){
   const next=NovaRailway.next(novaStates[stage]);
   await novaRoom(next.room);
   await action(next.label);
   if(next.id===checkpoint)break;
   if(++count>60)throw Error('Nova did not finish');
  }
 };
 await home();
 await tap(q('[data-maturity=unknown] [data-home-journey=nova]'));
 for(const stage of stages.slice(0,3)){
  await capture('nova-'+stage);
  if(stage==='build'){
   await runNova(stage,'bootstrap');
   await tap(q('.room-scenarios summary'));
   await action('Test a registered agent with failed posture');
   ensure(q('.mission-status').textContent.includes('Runtime blocked'),'Failed posture did not block runtime admission');
   ensure(NovaRailway.next(novaStates.build).id==='restore-posture','Failed posture did not offer recovery');
  }
  await runNova(stage);
  await action('Continue to the next stage');
 }
 await capture('nova-resist');
 await runNova('resist','plan');
 await novaRoom('external');
 ensure(q('.nova-scene h2').textContent.includes('Intake & delivery'),'Internal delivery still looks external');
 ensure(!q('#game').textContent.includes('Test a report changed after approval'),'Approval scenario appears before the file is approved');
 await runNova('resist','approve');
 await novaRoom('external');
 await tap(q('.room-scenarios summary'));
 await action('Test a report changed after approval');
 ensure(q('#nova-reply').textContent.includes('original approved copy is still ready to send'),'Edited-copy result made the original status unclear');
 await novaRoom('runtime');
 await tap(q('.room-scenarios summary'));
 await action('Test a classified model payload');
 ensure(novaStates.resist.incident&&novaStates.resist.approvalVersion===null,'An incident did not retire the prior report approval');
 await runNova('resist','recover');
 ensure(NovaRailway.next(novaStates.resist).id==='approve','Recovered mission skips reapproval');
 await runNova('resist','approve');
 await novaRoom('runtime');
 await action('Report workspace');
 await action('Clarify the report’s recommendation');
 ensure(NovaRailway.next(novaStates.resist).id==='reapprove','An edited copy kept its approval');
 await novaRoom('external');
 await action('Test this send');
 ensure(q('#nova-reply').textContent.includes('Nothing was sent'),'Delivery did not refuse the edited copy');
 await runNova('resist');
 ensure(novaStates.resist.deliveryReceipt.digest==='SIM-M-304-REPORT-2','Fresh approval did not bind the edited copy');
 ensure(q('#game').textContent.includes('Stage complete'),'No stage completion receipt');
 ensure(localStorage.getItem('trust-boundaries-household-1')===alexSave,'Nova changed Alex’s saved game');
 return {width:innerWidth,stagePlaythroughs:8,joPhoneOutage:true,reapprovalAfterPause:true};
}
async function explorationReview(){
 const q=s=>document.querySelector(s);
 const check=(condition,message)=>{if(!condition)throw Error(message);};
 const buttons=()=>[...document.querySelectorAll('#game button')];
 const action=async text=>{
  const el=buttons().find(item=>item.getClientRects().length&&item.textContent.trim().startsWith(text));
  check(el,'Missing '+text);
  await tap(el);
 };
 const mode=value=>{
  q('#play-mode').value=value;
  q('#play-mode').dispatchEvent(new Event('change',{bubbles:true}));
 };
 await tap(q('[data-maturity=unknown] [data-home-journey=alex]'));
 check(q('.mission-guide h2').textContent==='Tom’s dare','No Alex mission panel');
 check(q('#mission-hint').textContent.includes('Meet Tom'),'Guided help is absent');
 await action('Meet Tom');
 mode('exploration');
 check(household.unknown.index===1,'Mode change cleared Alex’s step');
 check(!q('[data-recommended].good')&&!q('#mission-hint').textContent,'Exploration shows a full hint too early');
 await tap(q('#request-hint'));
 check(q('[data-recommended].good')&&q('#mission-hint').textContent.includes('Accept Tom'),'Explicit help did not reveal what to do');
 await action('Compare with Nova');
 check(q('#play-mode').value==='exploration','Changing stories changed the preferred mode');
 check(q('.mission-guide h2').textContent==='The unmanaged railway job','Nova opened at the wrong stage');
 await tap(q('[data-nova-room=resources]'));
 check(q('#mission-hint').textContent==='','Visiting a room revealed an unsolicited next step');
 const nativeNow=performance.now.bind(performance);
 let elapsed=0;
 performance.now=()=>nativeNow()+elapsed;
 const tick=async ms=>{elapsed+=ms;await new Promise(resolve=>setTimeout(resolve,1100));};
 q('.mission-details').open=true;
 await tick(65000);
 check(!q('#mission-hint').textContent,'Hints advanced while the player was reading an open panel');
 q('.mission-details').open=false;
 await tick(20000);
 check(q('#mission-hint').textContent.includes('Work intake')&&!q('[data-recommended].good'),'Context hint did not come before highlighting');
 await tick(20500);
 check(q('[data-recommended].good')&&q('#follow-hint').hidden,'Highlight came without its intended timing');
 await tick(20500);
 check(!q('#follow-hint').hidden,'Exact guidance did not appear after the final idle step');
 await tap(q('#follow-hint'));
 performance.now=nativeNow;
 check(q('[data-nova-room=external][aria-current]'),'Hint did not lead back to the right room');
 mode('guided');
 await action('Inspect the unverified request');
 check(novaStates.unknown.index===1,'Nova did not advance after changing mode');
 await tap(q('.topbar nav a[href="#"]'));
 await tap(q('[data-maturity=authorize] [data-home-journey=nova]'));
 const advanceNova=async id=>{
  for(let max=0;max<30;max++){
   const next=NovaRailway.next(novaStates.authorize);
   if(!next)throw Error('AUTHORIZE finished before '+id);
   await tap(q('[data-nova-room='+next.room+']'));
   await action(next.label);
   if(next.id===id)return;
  }
  throw Error('AUTHORIZE did not reach '+id);
 };
 await advanceNova('lease');
 await tap(q('[data-nova-room=security]'));
 await action('Credential controls');
 check(q('.nova-console').textContent.includes('DB-M204-1 · Active'),'Vault console does not show the active lease');
 await capture('nova-vault-console');
 await action('Advance to lease expiry');
 await tap(q('[data-nova-room=resources]'));
 await action('Incident history');
 check(q('.nova-console').textContent.includes('no active, in-scope lease'),'PostgreSQL console opened an expired lease');
 check(!q('.nova-console table'),'Expired credential disclosed database rows');
 await advanceNova('renew-lease');
 await advanceNova('history');
 await tap(q('[data-nova-room=resources]'));
 await action('Incident history');
 check(q('.nova-console table').textContent.includes('INC-117'),'Expected incident row is absent');
 check(q('.console-table').scrollWidth<=q('.console-table').clientWidth,'Mobile incident table clips its columns');
 await capture('nova-database-console');
 await action('Close console');
 await tap(q('.decision-note summary'));
 await action('Replay the architecture sequence');
 check(location.hash.includes('observed-read')&&q('.architecture-return'),'Decision did not link to its own sequence');
 return {width:innerWidth,modeSwitch:true,reload:true,resourceChecks:true};
}
async function verifyReference(send){
 const evaluate=async (expression,contextId)=>{
  const response=await send('Runtime.evaluate',{expression,contextId,awaitPromise:true,returnByValue:true});
  if(response.exceptionDetails)throw Error(response.exceptionDetails.exception?.description||response.exceptionDetails.text);
  return response.result.value;
 };
 const wait=async predicate=>{
  for(let count=0;count<30;count++){
   if(await predicate())return;
   await new Promise(resolve=>setTimeout(resolve,100));
  }
  throw Error('Browser outcome was not reached');
 };
 async function openFrame(probe){
  let context;
  await wait(async()=>{
   const frame=(await send('Page.getFrameTree')).frameTree.childFrames?.[0]?.frame;
   if(!frame||frame.url==='about:blank')return false;
   try{
    const result=await send('Page.createIsolatedWorld',{frameId:frame.id,worldName:'verify-reference'});
    context=result.executionContextId;
    return await evaluate(probe,context);
   }catch(error){
    if(!String(error).includes('Cannot find context'))throw error;
    return false;
   }
  });
  return script=>evaluate(script,context);
 }
 const inspect=await openFrame("document.querySelector('#seqSelect option:checked')?.textContent.includes('actual resource parameters')");
 assert.equal(await inspect("document.querySelector('.nav button[aria-current]').dataset.jump"),'sequences');
 assert.equal(await evaluate("document.querySelector('iframe').contentDocument"),null);
 assert.match(await inspect("document.querySelector('#seqSource').textContent"),/^sequenceDiagram/);
 assert.equal(await inspect("document.querySelectorAll('#seqCanvas [data-msg]').length"),11);
 assert.equal(await inspect("document.querySelectorAll('#seqTranscript li').length"),11);
 await inspect("document.querySelector('#next').click()");
 assert.match(await inspect("document.querySelector('#stepCounter').textContent"),/^Step 2/);
 let sequences=0;
 for(let stage=0;stage<4;stage++){
  const count=await inspect(`document.querySelector('[data-stage="${stage}"]').click();document.querySelector('#seqSelect').length`);
  assert(await inspect("document.querySelector('#architectureCanvas svg g.node').getAttribute('aria-label')"));
  sequences+=count;
  for(let flow=0;flow<count;flow++){
   const replay=await inspect(`(()=>{
    const select=document.querySelector('#seqSelect');
    select.selectedIndex=${flow};
    select.dispatchEvent(new Event('change'));
    document.querySelector('#next').click();
    return {source:document.querySelector('#seqSource').textContent,step:document.querySelector('#stepCounter').textContent,
     text:document.querySelectorAll('#seqTranscript li').length,rows:document.querySelectorAll('#seqCanvas [data-msg]').length};
   })()`);
   assert.match(replay.source,/^sequenceDiagram/);
   assert.match(replay.step,/^Step 2/);
   assert(replay.text>=replay.rows&&replay.rows>1);
  }
 }
 assert.equal(sequences,15);
 assert.equal(await inspect("document.querySelector('#labDecision').textContent.startsWith('PERMIT')"),true);
 await evaluate("document.querySelector('.architecture-return').click()");
 assert.equal(await evaluate('location.hash'),'#nova-authorize');
 assert.equal(await evaluate("NovaRailway.reached(novaStates.authorize,'history')"),true);
 await send('Page.reload');
 await wait(()=>evaluate("document.readyState==='complete'&&document.querySelector('.mission-guide')!==null"));
 assert.equal(await evaluate("NovaRailway.reached(novaStates.authorize,'history')"),true);
 assert.equal(await evaluate("novaStates.authorize.databaseLease.id"),'DB-M204-2');
 assert.equal(await evaluate("household.unknown.index"),1);
 await evaluate("document.querySelector('[data-nova-station=database]').click()");
 await evaluate("document.querySelector('.nova-console details').open=true");
 await evaluate("[...document.querySelectorAll('.nova-console button')].find(button=>button.textContent.startsWith('Locate this component')).click()");
 const component=await openFrame("document.querySelector('#detailTitle').textContent.includes('PostgreSQL')");
 assert.equal(await component("document.querySelector('#detail').hidden"),false);
 assert.equal(await component("document.querySelector('#full').classList.contains('active')"),true);
 const tree=await send('Accessibility.getFullAXTree');
 assert(tree.nodes.some(node=>node.name?.value?.includes('Return to Nova')));
 await evaluate("document.querySelector('#reset-game').click()");
 assert.equal(await evaluate("document.activeElement.value"),'cancel');
 await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
 await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
 await wait(()=>evaluate("!document.querySelector('#reset-dialog').open"));
 assert.equal(await evaluate("household.unknown.index"),1);
 await evaluate("document.querySelector('#reset-game').click();document.querySelector('#reset-dialog button[value=reset]').click()");
 await wait(()=>evaluate("document.querySelector('#screen-title')?.textContent==='Raise the BAR'"));
 assert.equal(await evaluate("household.unknown.index"),0);
 assert.equal(await evaluate("novaStates.authorize.index"),0);
}
async function surfaceReview(){
 const check=(condition,message)=>{if(!condition)throw Error(message);};
 const q=selector=>document.querySelector(selector);
 const all=selector=>[...document.querySelectorAll(selector)];
 const results={householdObjects:0,devices:0,novaStations:0};
 for(const stage of Object.keys(ShadowStory.stages)){
  const visited=new Set();
  let state=ShadowStory.fresh(stage);
  for(;;){
   for(const room of Object.keys(ShadowStory.rooms)){
    const snapshot=ShadowStory.visit(state,room);
    household[stage]=snapshot;
    showHousehold(stage);
    for(const device of [null,...Object.keys(ShadowStory.roomSurface(snapshot).screens)]){
     household[stage]=snapshot;
     showHousehold(stage);
     if(device){
      q('[data-device-launch='+device+']').click();
      check(q('[data-device-screen='+device+']'),'No device screen for '+device);
      results.devices++;
     }
     const keys=all('[data-household-object]').map(control=>control.dataset.householdObject);
     for(const key of keys){
      const label=room+'/'+device+'/'+key;
      if(visited.has(label))continue;
      visited.add(label);
      household[stage]=snapshot;
      showHousehold(stage,null,device);
      q('[data-household-object='+key+']').click();
      check(q('.shadow-reply')?.textContent.trim(),'No reaction for '+label);
      results.householdObjects++;
     }
    }
   }
   const next=ShadowStory.next(state);
   if(!next)break;
   state=ShadowStory.act(ShadowStory.visit(state,next[1]),next[2]);
  }
 }
 for(const stage of Object.keys(NovaRailway.stages)){
  for(const room of Object.keys(NovaRailway.scenes)){
   const snapshot=NovaRailway.visit(NovaRailway.fresh(stage),room);
   novaStates[stage]=snapshot;
   showNova(stage);
   const ids=all('[data-nova-station]').map(control=>control.dataset.novaStation);
   for(const id of ids){
    novaStates[stage]=snapshot;
    showNova(stage);
    const station=q('[data-nova-station='+id+']');
    if(station.hasAttribute('data-recommended')){
     q('.nova-actions button').click();
    }else station.click();
    check(q('#nova-console-title')?.textContent.trim(),'No console for '+stage+'/'+id);
    q('.nova-console button').click();
    check(!q('#nova-console-title'),'Console did not close for '+id);
    results.novaStations++;
   }
  }
 }
 return results;
}
(async()=>{
 const cases=[];
 cases.push(await testPage(390,844,explorationReview,verifyReference));
 cases.push(await testPage(390,844,immersionReview));
 cases.push(await testPage(1280,900,immersionReview));
 cases.push(await testPage(1280,900,surfaceReview));
 console.log(JSON.stringify(cases,null,2));
})().catch(error=>{console.error(error);process.exitCode=1;}).finally(()=>chrome.kill());
