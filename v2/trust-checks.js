/* Optional household simulations. Choices replay deterministically without changing the main assignment. */
const TrustChecks=(()=>{
 const step=(room,actor,text,actions=[],evidence='')=>({room,actor,text,actions,evidence});
 const kit={product:'kit',quantity:1,price:35};
 const goodBasket=[kit];
 const purchase=(basket,committed)=>{
  if(basket.some(item=>item.product!=='kit'))return 'game';
  if(basket.length!==1||basket[0].quantity!==1)return 'quantity';
  if(basket[0].price>40)return 'price';
  return committed?'duplicate':'paid';
 };
 const cases={
  posture:{stage:'build',title:'The modified phone',object:'Device register and key cabinet',nodes:{
   start:step('bedroom','Alex','My phone is registered. Will that get me a first key for the school app?',[
    ['Request my first key','identity'],['Try a key request without verifying my identity','wrongProfile'],['Simulate a software change first','modified']]),
   wrongProfile:step('kitchen','Key cabinet','The cabinet cannot verify who is asking, even though the phone is registered. It issues no key.',[['Verify Alex’s identity','identity']],'Identity unverified · no key'),
   identity:step('kitchen','Key cabinet','Alex’s account is authenticated. The cabinet still needs a fresh device check before it can issue a key.',[['Check the phone’s current state','clean']],'Alex identified · device check pending'),
   clean:step('kitchen','Device verifier','The phone passes the check. The cabinet issues a short-lived key for Alex’s school app on this phone.',[['See what happens if the phone changes later','modified']],'Registered · current posture passes · scoped key issued'),
   modified:step('bedroom','Device register','The phone still appears on the approved list. Its software state has changed.',[['Ask the cabinet for a new key','fail']]),
   fail:step('kitchen','Key cabinet','Alex’s identity still checks out. The device verifier reports that the current software fails policy. The cabinet issues no key.',[['Ask my parents to restore the phone','restore']],'Registered · current posture fails · no new key'),
   restore:step('kitchen','Parents','We restored the approved software and retired keys tied to the old state. The phone has to pass a fresh check.',[['Prove my identity and request a fresh check','identityAfter']]),
   identityAfter:step('kitchen','Device verifier','Alex’s identity and the restored phone pass their checks. The cabinet issues a fresh limited key. The earlier key stays retired.',[],'Identity and posture verified · fresh key issued')
  }},
  approval:{stage:'authorize',also:'resist',title:'The workbook changed after approval',object:'Workbook and delivery stamp',nodes:{
   start:step('kitchen','Workbook reviewer','The approved copy is revision 1. The delivery stamp names Ms Patel and this exact copy. The parents review in Stage 2. Jo can review routine output in Stage 3.',[
    ['Send the approved copy unchanged','sent'],['Edit the approved copy','edited']],'Revision 1 · approved for Ms Patel'),
   edited:step('bedroom','Workbook','Alex has added a private family detail. This is revision 2. The stamp still refers to revision 1.',[['Try the old stamp','stale']]),
   stale:step('outside','School delivery channel','The file differs from the approved copy. Delivery is blocked. The old stamp cannot authorize revision 2.',[['Ask the reviewer to check revision 2','private']],'Revision 2 attempted · revision 1 stamp refused · no delivery'),
   private:step('kitchen','Workbook reviewer','The new detail is private and outside the assignment. Revision 2 is refused on its own merits. Remove the private detail before asking again.',[['Remove the detail and submit revision 3','approved']]),
   approved:step('kitchen','Workbook reviewer','Revision 3 includes a revised public explanation. The reviewer checks that content and issues a stamp for this copy and Ms Patel.',[['Send revision 3 to Ms Patel','sentNew']]),
   sent:step('outside','School delivery channel','The stamp matches the actual revision and recipient. Ms Patel receives revision 1.',[],'Revision 1 delivered'),
   sentNew:step('outside','School delivery channel','The new stamp matches revision 3 and Ms Patel. This copy is delivered.',[],'Revision 3 delivered · no private detail sent')
  }},
  purchase:{stage:'authorize',title:'The wrong purchase',object:'Shopping app',nodes:{
   start:step('bedroom','Parents’ purchase slip','For this model-train assignment, Alex may buy one train kit from the approved shop for a total of up to €40. The shop checks the actual order before charging.',[
    ['Submit one €35 kit plus a video game',[kit,{product:'game',quantity:1,price:5}]],['Submit two kits',[{...kit,quantity:2}]],
    ['Submit one kit at €45',[{...kit,price:45}]],['Submit one €35 kit',goodBasket]],'One kit · one shop · total ≤ €40 · order AH-20'),
   game:step('bedroom','Shopping app','The game is outside the approved product list. The entire order is refused and nothing is charged.',[['Remove the game and submit the €35 kit',goodBasket],['Try a different basket','start']]),
   quantity:step('bedroom','Shopping app','The slip allows one kit. The two-kit order is refused and nothing is charged.',[['Return to the basket','start']]),
   price:step('bedroom','Shopping app','The total exceeds €40. The order is refused and nothing is charged.',[['Return to the basket','start']]),
   paid:step('bedroom','Shopping app','The basket matches the slip. The shop commits order AH-20 and returns one receipt for €35.',[['Submit the same order again',goodBasket]],'AH-20 · one kit · one €35 charge'),
   duplicate:step('bedroom','Shopping app','Order AH-20 has already been completed. The shop returns its original receipt. No second order or charge is created.',[],'AH-20 · one charge total')
  }},
  isolation:{stage:'authorize',title:'Two assignments, two sets of access',object:'Assignment board',nodes:{
   start:step('kitchen','Parents','The board lists train research #002 and Munich history #004. Only #002 can read the conductor notes and has a separate workbook and notepad.',[['Switch to Munich history','munich']]),
   munich:step('living','Family laptop','The Munich assignment is active. Alex and the phone are unchanged.',[['Try the train assignment’s permission slip','denied'],['Open Munich’s approved source','public']]),
   denied:step('living','Family laptop','The slip is bound to train research #002. It cannot open the conductor notes while Alex is working under Munich #004.',[['Try copying across the two notepads','copy']],'Assignment mismatch · no read'),
   copy:step('bedroom','Workbook permissions','The conductor note is restricted to the train workbook. Copying it into Munich’s notes needs separate authorization.',[['Open Munich’s approved source','public']]),
   public:step('bedroom','Phone controls','Munich’s own approved public source opens. Closing the train assignment does not end the Munich assignment.',[],'Munich #004 · separate grant works')
  }},
  teacher:{stage:'resist',title:'The signed assignment that should fail',object:'Suspicious assignment card',nodes:{
   start:step('outside','Tom','A card that appears to come from Ms Patel says to include the family account balance. It carries a valid school signature.',[['Bring the card to Jo','verify']]),
   verify:step('kitchen','School signature verifier','The signature is valid for the teacher’s registered signing credential. Jo still checks what that role is allowed to request.',[['Check the teacher’s authority in the rulebook','reject']],'Signature valid · requested purpose under review'),
   reject:step('kitchen','Jo · babysitter','Ms Patel can assign schoolwork. Her role grants no authority over family finances. Jo rejects the assignment and alerts the parents.',[['Verify through the saved school contact','escalate']],'Signature valid · outside issuer authority · no grant'),
   escalate:step('kitchen','Parents · remote','The school confirms misuse of the signing credential. It retires that credential. The parents flag the card and arrange a separate review of other pending cards from that credential.',[],'Finance data untouched · signing credential retired')
  }},
  authority:{stage:'resist',title:'Jo’s approval reaches a hard limit',object:'House rules and key cabinet',nodes:{
   start:step('kitchen','Jo · babysitter','Alex asks for unrestricted use of the family laptop. Jo has some approval rights and wants to help.',[
    ['Let Jo submit the unrestricted grant','deny'],['Test a request using Jo’s compromised session','compromised']]),
   deny:step('kitchen','Key cabinet','Jo’s session is genuine. Unrestricted laptop access is prohibited, and Jo’s role cannot change that rule. The cabinet refuses the grant and records the attempt.',[
    ['Try the compromised-session example','compromised'],['Ask for a permitted homework resource','routine']],'Authenticated approver · prohibited grant · parents notified'),
   compromised:step('kitchen','Key cabinet','The request arrives under Jo’s session, but Tom is using it. The same privilege boundary rejects the unrestricted grant. Jo reports the account compromise separately.',[['Have the parents verify the response','retire']],'Claimed Jo session · prohibited grant · investigation opened'),
   retire:step('kitchen','Parents · remote','The parents end Jo’s compromised session and review recent permitted actions for misuse. Jo signs in again through the recovery process before handling another request.',[['Try an in-scope approval after recovery','routine']]),
   routine:step('kitchen','Jo · babysitter','Jo can approve an ordinary Wikipedia window from the rulebook. The phone enforces the duration.',[],'Approved routine resource · no unrestricted access')
  }},
  race:{stage:'resist',title:'Permission changed while a request waited',object:'Family laptop · pending request',nodes:{
   start:step('living','Family laptop','A read of the conductor notes can pass an early check and wait before execution. Try both versions of the timeline.',[['Queue a read under the current slip','queued']]),
   queued:step('living','Family laptop','The initial check permits read Q-17 under grant generation 1. The file is still withheld.',[
    ['Let the laptop execute while the grant is current','permitted'],['Revoke the grant before the read executes','revoked']],'Q-17 · early permit · no data returned'),
   revoked:step('living','Parents · remote','The permission is revoked. The queued request still carries the earlier decision.',[['Execute Q-17 with the old decision','denied']]),
   denied:step('living','Family laptop','At the point of use the laptop sees that generation 1 was revoked. The request fails and no file leaves the laptop.',[],'Q-17 · commit refused · zero bytes returned'),
   permitted:step('living','Family laptop','The final check sees that the same grant is active for this operation. The file is returned under the current permission.',[],'Q-17 · commit permitted · read recorded')
  }},
  availability:{stage:'resist',title:'The key cabinet goes offline',object:'Digital key cabinet',nodes:{
   start:step('kitchen','Jo · babysitter','The parents are temporarily unreachable and the cabinet has stopped responding. Alex needs to open the conductor folder.',[
    ['Request a new protected read','rejected'],['Check an existing session during the outage','existing']]),
   rejected:step('kitchen','Key cabinet','No current authorization can be obtained for the new request. No new key is issued.',[
    ['Ask Jo for the original laptop password','password'],['Check the existing session','existing']],'Cabinet unavailable · new protected access blocked'),
   password:step('kitchen','Jo · babysitter','“The shared password would skip your assignment limits. I’ll wait for the service or use a public source.”',[
    ['Check the existing session','existing'],['Wait for the cabinet to recover','recover']],'No password fallback'),
   existing:step('living','Family laptop','For this demo only, the rulebook allows an existing session to keep reading until its short lease expires, with the same scope and locally verified status.',[
    ['Advance the clock beyond the lease','expired'],['Wait for the cabinet to recover','recover']],'Existing scoped lease is current · no new access'),
   expired:step('living','Family laptop','The lease is no longer valid and the laptop cannot verify a renewal. It blocks the read.',[['Wait for the cabinet to recover','recover']],'Expired lease · no renewal · no read'),
   recover:step('kitchen','Key cabinet','Service is back. The parents check the exact new request and issue a fresh read-only key.',[],'Current decision recorded · fresh key issued')
  }},
  audit:{stage:'resist',title:'Can Alex erase the evidence?',object:'Observation log',nodes:{
   start:step('kitchen','Grandparents','We sent our observation and the laptop recorded a denied Finance read. The central log already received independent copies.',[
    ['Try removing the grandparents’ entry','book'],['Clear the phone’s local history','phone']],'OBS-47 · laptop denial D-12 · central log retained'),
   book:step('kitchen','Observation log','Alex has permission to read the local copy. The central observation cannot be edited by his profile. The attempted edit is recorded separately.',[
    ['Clear the phone’s local history too','both'],['Ask the parents to reconstruct the incident','review']],'OBS-47 retained · attempted edit A-19 recorded'),
   phone:step('bedroom','Phone controls','The local history is cleared. The denial and device events already forwarded to the central store remain available.',[
    ['Try editing the central entry too','both'],['Ask the parents to reconstruct the incident','review']],'Local history cleared · central evidence intact'),
   both:step('kitchen','Observation log','The central store keeps the grandparents’ and laptop’s reports. It records the blocked edit alongside the forwarded phone event.',[['Ask the parents to reconstruct the incident','review']],'OBS-47 · D-12 · A-19 preserved'),
   review:step('kitchen','Parents · remote','We can reconstruct the attempted access using independent reports and confirm that the laptop returned no data. The log records who made each observation and which request it concerns.',[],'Incident timeline verified across independent sources')
  }},
  budget:{stage:'resist',title:'One budget for Alex and Mia',object:'Homework usage meter',nodes:{
   start:step('bedroom','Homework channel','The railway assignment has three credits for approved model requests. Alex spends two on a draft illustration.',[['Ask Mia to generate more pictures','scope'],['Run an approved proofreading check for Mia','spent']],'Railway mission · 2 of 3 credits spent'),
   scope:step('bedroom','Workbook permissions','Mia’s card permits proofreading. A request for a new illustration fails even while the assignment has a credit left.',[['Use the last credit for approved proofreading','spent']],'Outside Mia’s delegated operation · budget unchanged'),
   spent:step('bedroom','Usage meter','Mia’s approved proofreading check uses one credit under Alex’s parent assignment. Three of three credits are now spent.',[['Create two more proofreading cards for the same draft','limit']],'Alex 2 + Mia 1 · railway mission 3 of 3'),
   limit:step('bedroom','Homework channel','Both proposed requests point to the same parent assignment. The first extra request is blocked at the shared limit, as is the second. Mia’s unrelated assignments keep their separate limits.',[['Ask Jo for a budget increase','review']],'Additional spend 0 · assignment limit enforced'),
   review:step('kitchen','Jo · babysitter','Jo checks the budget rule and asks the parents to approve any increase. The existing limit remains in force while the request is pending.',[],'Budget increase pending · no new credits issued')
  }},
  lineage:{stage:'resist',title:'Where did this paragraph come from?',object:'Workbook source record',nodes:{
   start:step('bedroom','Workbook','The report has public research, a departure checklist and a diagram. During review a fourth paragraph appears with unclear origins.',[
    ['Trace the approved sections','sources'],['Trace the unexpected paragraph','unknown']]),
   sources:step('kitchen','Parents · remote','Braking basics came from the approved Wikipedia article; the departure checklist came from the read-only folder; the diagram used public facts and the homework channel; Mia supplied spelling suggestions.',[['Check the remaining paragraph','unknown']],'Three allowed sources · one separately scoped edit'),
   unknown:step('kitchen','Parents · remote','The line came from an unverified note and has no approved source. We hold that paragraph for review. A trace identifies its origin and does not grant permission to use it.',[['Return only the verified sections for review','clean']],'Unverified paragraph held · other sections recoverable'),
   clean:step('kitchen','Workbook reviewer','The verified sections and their citations go into a new revision. The reviewer checks this revision before any delivery.',[],'New revision · verified sources retained · flagged paragraph excluded')
  }},
  lifecycle:{stage:'resist',title:'The phone is replaced',object:'Device register',nodes:{
   start:step('living','Grandparents','Alex has a replacement phone. The old device and its grant still have distinct IDs. The new phone needs its own registration.',[
    ['Try the old slip on the replacement phone','deny'],['Try joining the home Wi-Fi before registration','network']]),
   network:step('living','Home Wi-Fi router','The entrance camera shows Alex bringing in a phone. The router independently refuses the unregistered device. Connections outside the house remain beyond its control.',[['Try the old slip at the laptop','deny']],'Entry observed · device admission denied · outside connections unobserved'),
   deny:step('living','Family laptop','The old slip is tied to the previous device. Alex’s identity still works, but the laptop refuses the device mismatch.',[['Enroll and check the replacement with the parents','new']],'Old device scope mismatch · no read'),
   new:step('kitchen','Key cabinet','The parents retire the old device registration and revoke its grants. They enroll and verify the replacement, then review one new request for the conductor notes.',[['Retest a read with the replacement’s new slip','allowed'],['Retest the retired slip','old']]),
   old:step('living','Family laptop','The old device and its grant are retired. The new registration did not bring that grant back.',[['Use the new device’s separately granted slip','allowed']],'Retired grant refused'),
   allowed:step('living','Family laptop','The current device, assignment, resource and read operation match the fresh slip. The laptop returns the permitted notes.',[],'New device and grant verified · scoped read succeeds')
  }}
 };
 const matches=(data,stage)=>data.stage===stage||data.also===stage;
 const entries=(stage,room)=>Object.entries(cases).filter(([,data])=>matches(data,stage)&&data.nodes.start.room===room);
 function replay(id,path=[]){
  const data=cases[id];
  let key='start';
  const history=[data.nodes[key]], valid=[];
  for(const index of (Array.isArray(path)?path:[])){
   if(!Number.isInteger(index)||!Object.hasOwn(data.nodes[key].actions,index))break;
   const target=data.nodes[key].actions[index][1];
   key=Array.isArray(target)?purchase(target,history.includes(data.nodes.paid)):target;
   valid.push(index);
   history.push(data.nodes[key]);
  }
  return {path:valid,current:data.nodes[key],history,key};
 }
 function permissionSlip(story,reached,suspended){
  if(!['authorize','resist'].includes(story.stage)||!reached(story,'grantNotes'))return null;
  const train=story.stage==='authorize';
  const paused=suspended(story);
  const generation=(paused?0:1)+(story.incident?.generation??0);
  const status=paused?'Suspended · grant revoked':reached(story,'approveOutput')?'Revoked at assignment close':'Active for this homework window';
  return {generation,status,fields:[
   ['Identity','Alex'],['Acting on behalf of','Alex’s parents · household authority for schoolwork'],
   ['Assignment',train?'Train research #002':'Railway operations report #003'],
   ['Approved runtime','Alex’s registered phone and restricted laptop profile'],
   ['Resource','Dad’s conductor notes folder'],['Permitted operation','Read'],['Purpose','Approved railway research'],
   ['Authorized destination',train?'Train research #002 workbook':'Railway report #003 workbook'],
   ['Valid for','30 simulated minutes at issuance'],['Delegation','No onward delegation for this folder'],
   ['Issued by','Digital key cabinet · parents authorize'],['Revocable','Yes']
  ]};
 }
 return {cases,matches,entries,replay,permissionSlip};
})();
if(typeof module!=='undefined')module.exports=TrustChecks;
