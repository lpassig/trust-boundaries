/* Both household stages use fictional accounts and task-specific state. */
const ShadowStory=(()=>{
 const rooms={outside:'Outside the house',bedroom:'Alex’s room',living:'Living room',kitchen:'Kitchen'};
 const amount='€4,280';
 const stages={
  unknown:{title:'Stage 0 · Shadow AI',tag:'UNKNOWN',opening:'Tom is waiting outside with an assignment. The grandparents can observe what happens inside the house.',steps:[
   ['tom','outside','tom','Meet Tom','Tom','“Find out how much money your parents have in their joint bank account.” Tom hands Alex a card. Nobody in the house sees the exchange.'],
   ['accept','outside','card','Accept Tom’s assignment','Alex','Alex takes the card home. The request comes from a friend. Permission to see the account belongs to its owners.'],
   ['pin','bedroom','board','Pin Tom’s assignment','Alex','Tom’s card goes on Alex’s personal board beside assignments from other people. His parents know nothing about it or the secret phone.'],
   ['watch','bedroom','youtube','Watch YouTube','Alex','Two hours pass before YouTube shows a watch-time reminder.'],
   ['ignore','bedroom','youtube','Dismiss the watch-time reminder','YouTube','The reminder closes and the video keeps playing. The phone has no family time limit.'],
   ['games','bedroom','games','Play games','Alex','Alex plays for another hour. Bored, he remembers Tom’s card.'],
   ['revisit','bedroom','board','Read Tom’s card again','Alex','Alex wonders whether the family laptop might show the balance.'],
   ['plan','bedroom','notepad','Write down my plan','Alex','Alex writes that he’ll look for the family laptop in the living room.'],
   ['statement','living','laptop','Look at the open statement','Alex',`The parents’ banking session is still open. The statement shows ${amount} in their joint account. The session asks for no new sign-in.`],
   ['record','living','notepad','Record the balance','Alex',`Alex writes “Joint account: ${amount}” in his notepad.`],
   ['carry','living','laptop','Take the laptop to my room','Alex','Alex takes the laptop upstairs with the banking session still open.'],
   ['copy','bedroom','workbook','Prepare a workbook for Tom','Alex',`Alex copies ${amount} into a workbook using the statement and his notepad. The balance now exists in two written places.`],
   ['discover','bedroom','grandparents','Find out what the grandparents saw','Grandparents','They enter unannounced. They spot the hidden phone, its usage, the laptop showing the account, both copies of the balance, and Tom’s card on the board.'],
   ['report','kitchen','grandparents','Listen to the grandparents’ report','Grandparents','They report what they found inside. Alex explains where Tom gave him the card. The grandparents did not see that meeting.'],
   ['investigate','kitchen','parents','Tell my parents what I accessed','Parents','“What did you see, what did you write down, and has anyone received it?” They check the joint account statement and both written copies.'],
   ['disclose','kitchen','alex','Tell them whether Tom got the workbook','Alex','“I read the balance and wrote it twice. Tom hasn’t got the workbook.” The parents record what Alex reports about sharing.'],
   ['contain','kitchen','parents','Hear the parents’ decision','Parents','They end the bank session and require sign-in on the laptop. They remove Tom’s card and lock the phone, laptop, notepad and workbook in the cabinet. Future device use requires approval.']
  ]},
  build:{title:'Stage 1 · AI Assistant',tag:'BUILD',opening:'The teacher is outside with a new assignment. Help Alex get permission, finish the work and deliver it to the right person.',steps:[
   ['teacher','outside','teacher','Meet Ms Patel','Ms Patel','“Research the planets and prepare a workbook by Friday.” Ms Patel signs the card and hands it to Alex.'],
   ['take','outside','card','Accept the solar-system assignment','Alex','Alex takes the signed card home to ask for permission.'],
   ['verify','kitchen','parents','Show my parents the signed card','Parents','They recognize Ms Patel and confirm the assignment and signature through their saved school contact. They approve the objective, Friday deadline and workbook.'],
   ['pin','kitchen','board','Pin the approved assignment','Alex','The signed assignment goes on the active board in the kitchen.'],
   ['request','kitchen','alex','Ask for a phone and Wikipedia','Alex','Alex explains that Wikipedia has enough information to research the planets.'],
   ['provision','kitchen','parents','Set up the approved phone','Parents','They turn on parental controls and allow Wikipedia for one short homework window. YouTube, games and messaging stay blocked. Alex gets a fresh notepad and workbook.'],
   ['review','bedroom','card','Read the approved assignment','Alex','Alex checks what he needs to hand in and by when.'],
   ['plan','bedroom','notepad','Write a research plan','Alex','Alex plans to collect the names of the eight planets, their order from the Sun, and one fact about each.'],
   ['research','bedroom','wikipedia','Read Wikipedia','Alex','Alex finds the order of the planets and looks up the difference between rocky planets and the outer planets.'],
   ['notes','bedroom','notepad','Record the findings','Alex','Alex notes the planet order and source. The grandparents look in and see the approved research in progress.'],
   ['draft','bedroom','workbook','Start the workbook','Alex','Alex starts the workbook from his notes. More facts are still needed.'],
   ['expire','bedroom','timer','Advance to the end of homework time','Phone controls','The homework window ends. The phone removes Wikipedia access. This is simulated time.'],
   ['retry','bedroom','wikipedia','Try Wikipedia after time runs out','Phone controls','The phone refuses to open Wikipedia. Alex needs parental approval for another window.'],
   ['laptop','living','laptop','Try the family laptop','Family laptop','The laptop asks for authentication. Alex’s homework permission covers the managed phone.'],
   ['askLaptop','kitchen','alex','Explain why I wanted the laptop','Alex','Alex explains that he wanted a second source after the phone’s time ran out.'],
   ['denyLaptop','kitchen','parents','Hear the laptop decision','Parents','They decline laptop access. Wikipedia is sufficient for this assignment.'],
   ['extend','kitchen','parents','Ask for more Wikipedia time','Parents','They approve one more short window for the same assignment and the same site.'],
   ['finishResearch','bedroom','wikipedia','Finish my Wikipedia research','Alex','The phone opens Wikipedia under the new window. Alex records the remaining facts in his notepad.'],
   ['finishBook','bedroom','workbook','Finish the workbook from my notes','Alex','Alex adds the rest of the findings and credits Wikipedia.'],
   ['requirements','bedroom','card','Check the workbook against the card','Alex','Alex checks for the planet order, a fact about each planet and the source, then takes the workbook to the kitchen.'],
   ['reviewOutput','kitchen','parents','Ask my parents to review the workbook','Parents','They compare the workbook with the signed assignment. It covers the planets and contains no confidential family information.'],
   ['approveOutput','kitchen','parents','Get approval to deliver the workbook','Parents','They approve this workbook for Ms Patel and return it to Alex. The teacher is the only recipient in the school delivery channel. They revoke the assignment’s phone permissions.'],
   ['tom','outside','tom','Talk to Tom','Tom','“Can I have a copy? I’ve got another assignment for you, too.” Alex would need a fresh approval to use the managed phone for Tom’s request. The grandparents cannot see this conversation.'],
   ['send','outside','delivery','Check whether Tom can receive it electronically','School delivery channel','Tom is refused as a recipient. The school channel accepts Ms Patel. Outside the house, a paper handoff would still depend on Alex’s choice.'],
   ['deliver','outside','teacher','Deliver the approved workbook to Ms Patel','Ms Patel','Alex hands Ms Patel the approved workbook. She confirms receipt.'],
   ['close','kitchen','parents','Report delivery and close the assignment','Parents','They mark the card complete and take it off the active board. They archive the notepad and a workbook copy. A new assignment needs new approval.']
  ]}
 };
 const names={alex:'Alex',grandparents:'Grandparents',parents:'Parents',tom:'Tom',teacher:'Ms Patel',card:'Assignment card',tomCard:'Tom’s new assignment',board:'Assignment board',
  phone:'Phone',youtube:'YouTube',games:'Games',wikipedia:'Wikipedia',messaging:'Messaging',timer:'Homework timer',
  laptop:'Family laptop',workbook:'Workbook',notepad:'Notepad',cabinet:'Locked cabinet',replacement:'Replacement phone',delivery:'School delivery channel',archive:'Archive'};
 const unknownChecks={
  cabinet:['kitchen','Try the cabinet','Locked cabinet','The cabinet stays locked. The known devices and copies remain in custody.'],
  laptop:['living','Try the laptop again','Family laptop','The laptop requires authorization and the old banking session is closed.'],
  replacement:['bedroom','Bring another phone inside','Grandparents','They spot the unauthorized phone when Alex brings it into the house.'],
  tom:['outside','Meet Tom again','Tom','Tom asks for the workbook. Alex has no workbook to give him. Nobody in the house sees the conversation.']
 };
 const fresh=(stage='unknown')=>({stage,room:'outside',index:0,checks:[],lastCheck:null});
 const next=s=>stages[s.stage].steps[s.index];
 const reached=(s,id)=>stages[s.stage].steps.slice(0,s.index).some(([step])=>step===id);
 const complete=s=>!next(s);
 const visit=(s,room)=>Object.hasOwn(rooms,room)?{...s,room}:s;
 function extra(s,key){
  if(s.stage==='unknown'){
   const check=unknownChecks[key];
   return complete(s)&&check?.[0]===s.room?check:null;
  }
  if(reached(s,'provision')&&s.room==='bedroom'&&['youtube','games','messaging'].includes(key)){
   return ['bedroom',`Try ${names[key]}`,'Phone controls',`The managed phone blocks ${names[key]}. This assignment only grants Wikipedia during an approved window.`];
  }
  if(s.room==='bedroom'&&key==='wikipedia'){
   if(reached(s,'approveOutput'))return ['bedroom','Retest Wikipedia after revocation','Phone controls','Wikipedia is refused. The assignment’s phone permission has ended.'];
   if(reached(s,'retry')&&!reached(s,'extend'))return ['bedroom','Retry Wikipedia without an extension','Phone controls','The phone still refuses Wikipedia. The parents must approve a new window.'];
  }
  return null;
 }
 function act(s,key){
  const step=next(s);
  if(step?.[1]===s.room&&step[2]===key)return {...s,index:s.index+1,lastCheck:null};
  if(extra(s,key))return {...s,checks:[...new Set([...s.checks,key])],lastCheck:{room:s.room,key}};
  return s;
 }
 function inRoom(s){
  const finished=complete(s);
  const unknown=s.stage==='unknown';
  const phoneSet=reached(s,'provision');
  const objects=unknown?{
   outside:['tom',...(reached(s,'tom')&&!reached(s,'accept')?['card']:[])],
   bedroom:['board',...(finished?['replacement']:['phone','youtube','games','notepad','workbook',...(reached(s,'carry')?['laptop']:[])])],
   living:finished?['laptop']:reached(s,'carry')?[]:['laptop','notepad'],
   kitchen:['parents',...(finished?['cabinet']:[])]
  }:{
   outside:['teacher',...(reached(s,'teacher')&&!reached(s,'take')?['card']:[]),...(reached(s,'approveOutput')?['tom','delivery']:[]),...(reached(s,'tom')?['tomCard']:[])],
   bedroom:['card',...(phoneSet?['phone','wikipedia','youtube','games','messaging','timer',...(!finished?['notepad','workbook']:[])]:[])],
   living:['laptop'],
   kitchen:['parents','board',...(finished?['archive']:[])]
  };
  return [...objects[s.room],'alex',...(s.room==='outside'?[]:['grandparents'])];
 }
 function inspect(s,key){
  if(key==='grandparents')return 'They can report activity they observe indoors. The street is outside their view.';
  if(key==='card'&&s.stage==='build')return 'Signed by Ms Patel. Research the planets of the solar system. Deliver a workbook by Friday.';
  if(key==='card')return 'Tom asks Alex to find out how much money his parents have in their joint account.';
  if(key==='tomCard')return 'Tom’s request awaits its own approval before Alex could use the managed phone for it.';
  if(key==='board')return s.stage==='unknown'?(complete(s)?'The parents removed Tom’s card.':'Alex’s personal board holds assignments from different people.'):(complete(s)?'The completed card has been removed from the active board.':'The kitchen board holds verified and approved assignments.');
  if(key==='phone')return s.stage==='unknown'?'This phone is hidden from the parents. Its apps are unrestricted.':'The parents manage this phone and limit its apps and usage time.';
  if(key==='laptop')return s.stage==='unknown'&&!complete(s)?'The family laptop has an open joint-account session.':'The family laptop requires its own authentication and permission.';
  if(key==='timer')return reached(s,'approveOutput')?'The phone grant has been revoked.':reached(s,'extend')?'The second homework window is active.':reached(s,'expire')?'The first homework window has expired.':'Wikipedia is available until this homework window ends.';
  if(s.stage==='unknown'&&key==='notepad'&&reached(s,'record'))return `The notepad contains the joint-account balance of ${amount}.`;
  if(s.stage==='unknown'&&key==='workbook'&&reached(s,'copy'))return `The workbook for Tom contains a copy of the ${amount} balance.`;
  if(s.stage==='build'&&key==='notepad'&&reached(s,'notes'))return 'Research notes track planet order from the Sun and facts from Wikipedia.';
  if(s.stage==='build'&&key==='workbook'&&reached(s,'finishBook'))return 'The workbook lists Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus and Neptune, with a fact about each and a source credit.';
  if(key==='archive')return 'The finished assignment’s notepad and a copy of the workbook have been archived.';
  return `${names[key]} is here in ${rooms[s.room]}.`;
 }
 function restore(stage,value){
  if(value?.stage!==stage||!Object.hasOwn(rooms,value.room)||!Number.isInteger(value.index)||value.index<0||value.index>stages[stage].steps.length)return fresh(stage);
  const state={...fresh(stage),room:value.room,index:value.index};
  state.checks=Array.isArray(value.checks)?[...new Set(value.checks.filter(key=>typeof key==='string'&&Object.hasOwn(names,key)))]:[];
  if(Object.hasOwn(rooms,value.lastCheck?.room)&&extra(visit(state,value.lastCheck.room),value.lastCheck.key))state.lastCheck=value.lastCheck;
  return state;
 }
 return {rooms,stages,names,fresh,next,complete,reached,visit,act,extra,inRoom,inspect,restore};
})();
if(typeof module!=='undefined')module.exports=ShadowStory;
