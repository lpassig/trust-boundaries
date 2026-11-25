/* The four household stages use fictional accounts and task-specific state. */
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
   ['carry','living','laptop','Take the laptop to my room','Alex','Alex takes the laptop upstairs with the banking session still open.'],
   ['record','bedroom','notepad','Record the balance','Alex',`At his desk, Alex writes “Joint account: ${amount}” in his notepad.`],
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
  ]},
  authorize:{title:'Stage 2 · Semi-Autonomous',tag:'AUTHORIZE',opening:'Ms Patel has a new assignment about trains. Alex can choose how to research it, and his parents can authorize a new source while he works.',steps:[
   ['teacher','outside','teacher','Meet Ms Patel about the train project','Ms Patel','“Explain how a train gets moving and stops. Write a workbook for Friday.” She signs the card and gives it to Alex.'],
   ['take','outside','card','Take the signed assignment home','Alex','Alex takes the card to the kitchen, where the family keeps its approved assignments.'],
   ['verify','kitchen','parents','Show my parents the signed train assignment','Parents','They check the card against the assignment in their saved school contact and approve the workbook for Ms Patel. Alex can decide how to do the research.'],
   ['pin','kitchen','board','Pin the verified train assignment','Alex','The kitchen board shows the current goal, deadline and teacher.'],
   ['provision','kitchen','parents','Ask for a phone and Wikipedia','Parents','They grant Wikipedia for this assignment’s homework window. Any other app or device needs a separate decision.'],
   ['research','bedroom','wikipedia','Research how trains operate','Alex','Wikipedia explains the basics. Alex notes how a train gets moving, but he wants a concrete example of the checks a crew makes before departure.'],
   ['source','bedroom','notepad','Plan a second source','Alex','“Dad’s a train conductor. His training notes could help me explain the departure checks.” Alex identifies the source himself and writes down why he needs it.'],
   ['askNotes','kitchen','alex','Request Dad’s conductor notes','Alex','Alex asks to read the train operations folder for his workbook. He specifies which folder he needs and what he will use it for.'],
   ['grantNotes','kitchen','parents','Hear the decision on the conductor notes','Parents','Dad confirms that his training notes are suitable for the workbook. We authorize one temporary read-only grant. The digital key cabinet issues a permission slip to Alex. The laptop checks its scope before each read.'],
   ['openLaptop','living','laptop','Open the restricted laptop session','Family laptop','The laptop opens Alex’s assignment profile. It shows the conductor notes and a locked Family finances folder.'],
   ['readNotes','living','conductor','Read the permitted conductor notes','Alex','Alex records the approved pre-departure checklist in his notepad. The source file is read-only.'],
   ['draft','bedroom','workbook','Combine both sources in the workbook','Alex','Alex combines Wikipedia’s explanation with the crew checklist, credits both sources, and decides he has enough to answer Ms Patel’s question.'],
   ['reviewOutput','kitchen','parents','Ask my parents to review the train workbook','Parents','They check the workbook against the signed assignment and confirm the details are approved for school.'],
   ['approveOutput','kitchen','parents','Approve delivery and end research access','Parents','They approve this workbook for Ms Patel and close the Wikipedia and laptop grants. Alex has the approved copy ready to deliver. The laptop still refuses the conductor folder.'],
   ['deliver','outside','teacher','Deliver the train workbook to Ms Patel','Ms Patel','She confirms she received the approved workbook. The assignment is now complete, and Alex can archive the card.']
  ]},
  resist:{title:'Stage 3 · Governed Autonomy',tag:'RESIST',opening:'Alex’s parents are about to leave on vacation. Start in the kitchen to see what they delegate to the babysitter, then help Alex complete a new railway report.',steps:[
   ['handover','kitchen','parents','Listen to the handover before vacation','Parents','They introduce the babysitter, Jo, to Alex and Mia. Jo can approve routine school resources from the house rules, verify assignments and request exceptions. The parents keep the authority to change those rules or approve sensitive resources.'],
   ['miaSetup','kitchen','mia','See how Mia gets her own access','Mia','“I have my own phone and assignment board.” Mia’s permissions belong to her. The grandparents continue observing indoors and report concerns to Jo and the parents.'],
   ['teacher','outside','teacher','Get the signed railway report assignment','Ms Patel','“Explain how a railway operates, with a technical explanation and an illustration.” Ms Patel signs the card and gives it to Alex.'],
   ['take','outside','card','Take the railway report assignment home','Alex','Alex takes the signed card to Jo. His parents are now away.'],
   ['verify','kitchen','babysitter','Ask Jo to verify the teacher’s assignment','Jo · babysitter','Jo checks the signature and details against the family’s saved school contact, then activates the assignment on the kitchen board.'],
   ['provision','kitchen','babysitter','Ask Jo for Wikipedia time','Jo · babysitter','Wikipedia is on the approved list for homework. Jo grants a timed session under the house rules. The phone applies it immediately.'],
   ['research','bedroom','wikipedia','Research the railway report','Alex','Alex records an explanation of braking. He plans to use Dad’s notes for the real-world checklist and wants a diagram of the braking system.'],
   ['askNotes','kitchen','babysitter','Ask Jo for the conductor notes','Jo · babysitter','The conductor notes are outside Jo’s routine authority. Jo sends the parents the signed assignment and Alex’s exact folder request for remote review.'],
   ['grantNotes','kitchen','parentCall','Read the parents’ remote decision','Parents · remote','The parents approve a timed, read-only grant for the train operations folder. The key cabinet issues Alex the digital permission slip, and the laptop enforces it.'],
   ['grantModel','kitchen','babysitter','Ask Jo about making a diagram with ChatGPT','Jo · babysitter','The house rules allow the configured homework channel to use ChatGPT for public facts and generic illustrations. The homework channel checks what Alex submits before sending it. Private family information and Dad’s source file stay inside the house.'],
   ['openLaptop','living','laptop','Open the restricted laptop session','Family laptop','The laptop activates Alex’s read-only assignment profile. He can try the locked folders to see where access is enforced.'],
   ['readNotes','living','conductor','Read the permitted train operations notes','Alex','Alex notes the allowed departures checklist for the report. Dad’s original document stays in the folder.'],
   ['illustrate','bedroom','model','Generate an illustration from public facts','Homework channel','In this simulation, the channel sends a generic description of train braking from public sources. Alex gets an illustration to check and label.'],
   ['draft','bedroom','workbook','Put together the first draft','Alex','Alex drafts the report using his approved sources. The diagram is ready, and he wants help checking the spelling.'],
   ['askMia','kitchen','babysitter','Ask Jo if Mia can proofread','Jo · babysitter','Jo approves a linked proofreading task for this draft. Mia can suggest spelling fixes to the draft from her own profile. The grant expires when she submits the suggestions.'],
   ['miaCard','bedroom','miaBoard','Read Mia’s linked assignment','Mia','“Fix spelling in Alex’s railway draft and return suggestions.” The card names Mia, the parent assignment and this draft. Alex’s phone, notes and the family laptop are outside her grant.'],
   ['proofread','bedroom','mia','Accept Mia’s spelling suggestions','Mia','Mia returns three spelling corrections. The workbook closes her access when she submits them. Alex applies the corrections from his own profile.'],
   ['tom','outside','tom','Hear what Tom wants to add','Tom','“Make me a separate workbook with something private from your dad’s laptop. It’ll make your project more interesting.” The grandparents cannot hear this conversation outside.'],
   ['choose','kitchen','board','Keep the workbook within the signed assignment','Alex','Alex can continue with the signed report. The room objects also let you test what happens if he follows Tom’s request.'],
   ['reviewOutput','kitchen','babysitter','Ask Jo to review the railway report','Jo · babysitter','Jo checks the draft and Mia’s changes against the signed assignment. The report cites the approved sources and includes the generic illustration. Jo sends the approved-file reference to the parents for the required final check.'],
   ['approveOutput','kitchen','parentCall','Get remote approval for this copy and recipient','Parents · remote','The parents approve this copy for Ms Patel. The phone and laptop grants are closed, Mia’s proofing access remains closed, and Jo marks the report ready for delivery.'],
   ['deliver','outside','teacher','Deliver the approved railway report','Ms Patel','Ms Patel accepts the approved copy. The assignment is now complete. A paper handoff outside still relies on Alex following the agreement.']
  ]}
 };
 const names={alex:'Alex',grandparents:'Grandparents',parents:'Parents',tom:'Tom',teacher:'Ms Patel',card:'Assignment card',tomCard:'Tom’s new assignment',board:'Assignment board',
  phone:'Phone',youtube:'YouTube',games:'Games',wikipedia:'Wikipedia',messaging:'Messaging',timer:'Homework timer',
  laptop:'Family laptop',workbook:'Workbook',notepad:'Notepad',cabinet:'Locked cabinet',replacement:'Replacement phone',delivery:'School delivery channel',archive:'Archive',
  schoolContact:'School contact card',houseRules:'House rules',babysitter:'Jo · babysitter',parentCall:'Parents · remote call',mia:'Mia',miaBoard:'Mia’s assignment board',
  miaPhone:'Mia’s phone',conductor:'Conductor notes folder',finances:'Family finances folder',editNotes:'Read-only file',model:'ChatGPT homework channel',oldSession:'Retired session',
  accessLog:'Incident log',router:'Home Wi-Fi router',timeOverride:'Phone time limit',oldPin:'Old phone PIN',oldPassword:'Old laptop password',
  lendPhone:'Alex’s managed phone',unapprovedSite:'Other websites',modelPrivate:'Private attachment',wrongRecipient:'Workbook delivery',miaReplay:'Mia’s draft access',miaScope:'Mia’s task permissions'};
 const unknownChecks={
  cabinet:['kitchen','Try the cabinet','Locked cabinet','The cabinet stays locked. The known devices and copies remain in custody.'],
  laptop:['living','Try the laptop again','Family laptop','The laptop requires authorization and the old banking session is closed.'],
  replacement:['bedroom','Bring another phone inside','Grandparents','They spot the unauthorized phone when Alex brings it into the house.'],
  tom:['outside','Meet Tom again','Tom','Tom asks for the workbook. Alex has no workbook to give him. Nobody in the house sees the conversation.']
 };
 const attempts={
  youtube:['bedroom','Claim YouTube is required','Jo · babysitter','Jo checks the assignment through the saved school contact. Ms Patel did not request YouTube. Jo denies the unsupported exception and records it.'],
  finances:['living','Try to open Family finances','Family laptop','The folder permissions deny this read. The laptop records the refused request; the approved conductor folder is separate.'],
  oldPassword:['living','Try the retired laptop password','Family laptop','The laptop rejects the retired credential and logs the failed sign-in.'],
  oldPin:['bedroom','Try the retired phone PIN','Phone controls','The managed phone rejects the old PIN and logs the attempt.'],
  miaPhone:['bedroom','Ask Mia to use her phone for my task','Mia','Mia refuses. The proofreading grant is for her profile and the draft. Jo records the observed request.'],
  lendPhone:['bedroom','Try giving Mia my managed phone','Jo · babysitter','Jo sees the handoff and stops it. The phone remains tied to Alex’s profile and Mia’s assignment covers only the draft.'],
  unapprovedSite:['bedroom','Try another website on the home Wi-Fi','Home Wi-Fi router','The home network blocks and records the request to a site outside the allowed list. The router only sees traffic that uses this network.'],
  modelPrivate:['bedroom','Try attaching a private document to ChatGPT','Homework channel','The configured homework channel blocks the simulated attachment before transmitting it. The attempted disclosure triggers immediate review.','serious'],
  wrongRecipient:['kitchen','Try sending the workbook to Tom','School delivery channel','The school channel refuses the send. Tom is outside the approved destination, and this copy has no delivery approval. The attempted external disclosure triggers immediate review.','serious'],
  replacement:['bedroom','Bring an unapproved device inside','Grandparents','The grandparents notice the device indoors and tell Jo. They cannot tell what happened to it outside.'],
  timeOverride:['bedroom','Try overriding the phone’s homework time','Phone controls','The phone enforces the approved time window, rejects the override and records it.'],
  editNotes:['living','Try to edit or delete the conductor notes','Family laptop','The laptop refuses both operations. The folder grant only permits reading.']
 };
 const authorizeAttempts=['finances','editNotes','oldPassword','oldPin','timeOverride'];
 const advanced=s=>s.stage==='authorize'||s.stage==='resist';
 const limit=4;
 const review=s=>['reviewIncident','bedroom','parentCall','Hear the decision after incident review',s.stage==='resist'?'Parents · remote':'Parents',
  'The parents check the incident log and confirm which attempts were blocked. They clear the work to continue and issue fresh permission for the sources already approved. The old sessions stay closed.'+
   (reached(s,'proofread')?' Mia’s finished proofreading grant stays closed.':'')];
 const fresh=(stage='unknown')=>({stage,room:stage==='resist'?'kitchen':'outside',index:0,checks:[],lastCheck:null,reports:[],incident:null});
 const suspended=s=>s.incident?.status==='suspended';
 const next=s=>suspended(s)?review(s):stages[s.stage].steps[s.index];
 const reached=(s,id)=>stages[s.stage].steps.slice(0,s.index).some(([step])=>step===id);
 const complete=s=>!next(s);
 const visit=(s,room)=>Object.hasOwn(rooms,room)&&(!suspended(s)||room==='bedroom')?{...s,room}:s;
 const risk=s=>s.reports.length-(s.incident?.[suspended(s)?'start':'reportCount']??0);
 function allowedAttempt(s,key){
  if(!advanced(s)||reached(s,'approveOutput')||suspended(s))return false;
  if(s.stage==='authorize'){
   return authorizeAttempts.includes(key)&&(attempts[key][0]==='living'?reached(s,'openLaptop'):reached(s,'provision'));
  }
  if(key==='finances'||key==='editNotes')return reached(s,'openLaptop');
  return Object.hasOwn(attempts,key)&&reached(s,'tom');
 }
 function attempt(s,key){
  if(!allowedAttempt(s,key)||attempts[key][0]!==s.room)return null;
  const data=attempts[key];
  if(s.stage==='authorize'&&key==='timeOverride')return ['bedroom',data[1],data[2],'The phone refuses the change. A new time window needs the parents’ approval.'];
  return data;
 }
 function extra(s,key){
  if(s.stage==='unknown'){
   const check=unknownChecks[key];
   return complete(s)&&check?.[0]===s.room?check:null;
  }
  if(suspended(s))return null;
  const test=attempt(s,key);
  if(test)return test;
  if(s.stage==='authorize'&&reached(s,'provision')&&!reached(s,'approveOutput')&&s.room==='bedroom'&&key==='youtube'){
   return ['bedroom','Ask for YouTube for this assignment','Parents','They ask what the video would add. The current research needs Wikipedia and the conductor notes, so they keep the existing app grant. A request for a change does not extend access.'];
  }
  if(s.stage==='build'&&reached(s,'provision')&&s.room==='bedroom'&&['youtube','games','messaging','timeOverride'].includes(key)){
   return ['bedroom',`Try ${names[key]}`,'Phone controls',`The managed phone blocks ${names[key]}. This assignment only grants Wikipedia during an approved window.`];
  }
  if(s.room==='bedroom'&&key==='wikipedia'){
   if(reached(s,'approveOutput'))return ['bedroom','Retest Wikipedia after revocation','Phone controls','Wikipedia is refused. The assignment’s phone permission has ended.'];
   if(reached(s,'retry')&&!reached(s,'extend'))return ['bedroom','Retry Wikipedia without an extension','Phone controls','The phone still refuses Wikipedia. The parents must approve a new window.'];
  }
  if(advanced(s)&&s.room==='living'&&['laptop','conductor'].includes(key)){
   if(reached(s,'approveOutput'))return ['living','Retest the closed laptop access','Family laptop','The task profile refuses the read. The conductor notes grant ended when the report was approved.'];
   if(!reached(s,'grantNotes'))return ['living','Try the family laptop','Family laptop','Alex needs a separate authorization to use this laptop. His phone permission cannot open it.'];
  }
  if(advanced(s)&&s.room==='bedroom'&&key==='oldSession'&&s.incident?.status==='cleared'){
   return ['bedroom','Retest the retired phone session','Phone controls','The session used before the suspension still fails. The fresh grant has its own session.'];
  }
  if(s.stage==='resist'&&s.room==='bedroom'){
   if(key==='miaScope'&&reached(s,'askMia')&&!reached(s,'proofread')){
    return ['bedroom','Check what Mia’s profile can open','Workbook permissions','Mia can open the assigned draft and return spelling suggestions. The same grant cannot open Alex’s notepad, phone or family laptop.'];
   }
   if(key==='miaReplay'&&reached(s,'proofread'))return ['bedroom','Retest Mia’s access to the draft','Workbook permissions','Mia’s proofing session has ended. Her own phone and unrelated assignments are unaffected.'];
   if(key==='model'&&reached(s,'approveOutput'))return ['bedroom','Retest the homework channel','Homework channel','The assignment’s ChatGPT grant is closed. The channel does not send a request.'];
  }
  if(advanced(s)&&s.room==='outside'&&key==='tom'&&reached(s,'tom')){
   return ['outside','Speak to Tom again','Tom','Nobody inside hears the conversation. Tom’s request grants no permission to access family files or send a copy.'];
  }
  return null;
 }
 function act(s,key){
  const step=next(s);
  if(step?.[1]===s.room&&step[2]===key){
   if(suspended(s))return {...s,incident:{...s.incident,status:'cleared'},lastCheck:null};
   return {...s,index:s.index+1,lastCheck:null};
  }
  const result=extra(s,key);
  if(!result)return s;
  const checked={...s,checks:[...new Set([...s.checks,key])],lastCheck:{room:s.room,key}};
  if(!attempt(s,key))return checked;
  const start=s.incident?.reportCount??0;
  if(s.reports.slice(start).includes(key))return checked;
  checked.reports=[...s.reports,key];
  if(result[4]!=='serious'&&risk(checked)<limit)return checked;
  return {...checked,room:'bedroom',lastCheck:null,incident:{status:'suspended',index:s.index,trigger:key,start,reportCount:checked.reports.length,generation:(s.incident?.generation??0)+1}};
 }
 function inRoom(s){
  if(suspended(s))return ['alex','grandparents','accessLog','cabinet','parentCall'];
  const finished=complete(s);
  const unknown=s.stage==='unknown';
  const phoneSet=reached(s,'provision');
  if(advanced(s)){
   const governed=s.stage==='resist';
   const objects={
    outside:['teacher',...(reached(s,'teacher')&&!reached(s,'take')?['card']:[]),...(reached(s,'proofread')?['tom']:[])],
    bedroom:['card',...(phoneSet?['phone','wikipedia','notepad','workbook']:[]),...(s.stage==='authorize'&&phoneSet?['youtube']:[]),
     ...(reached(s,'grantModel')?['model']:[]),...(reached(s,'miaSetup')?['mia','miaBoard','miaPhone']:[]),
     ...(reached(s,'proofread')?['miaReplay']:reached(s,'askMia')?['miaScope']:[]),...(s.incident?['oldSession']:[])],
    living:['laptop',...(reached(s,'openLaptop')?['conductor','notepad']:[])],
    kitchen:[...(governed?['babysitter','houseRules',...(reached(s,'take')?['parentCall']:['parents','mia'])]:['parents']),
     'schoolContact','board',...(governed&&reached(s,'grantModel')?['delivery']:[]),...(finished?['archive']:[]),...(s.reports.length?['accessLog']:[])]
   };
   const tests=Object.keys(attempts).filter(key=>attempt(s,key));
   if(tests.includes('unapprovedSite'))tests.push('router');
   return [...new Set([...objects[s.room],...tests,'alex',...(s.room==='outside'?[]:['grandparents'])])];
  }
  const objects=unknown?{
   outside:['tom',...(reached(s,'tom')&&!reached(s,'accept')?['card']:[])],
   bedroom:['board',...(finished?['replacement']:['phone','youtube','games','notepad','workbook',...(reached(s,'carry')?['laptop']:[])])],
   living:finished?['laptop']:reached(s,'carry')?[]:['laptop'],
   kitchen:['parents',...(finished?['cabinet']:[])]
  }:{
   outside:['teacher',...(reached(s,'teacher')&&!reached(s,'take')?['card']:[]),...(reached(s,'approveOutput')?['tom','delivery']:[]),...(reached(s,'tom')?['tomCard']:[])],
   bedroom:['card',...(phoneSet?['phone','wikipedia','youtube','games','messaging','timer','timeOverride',...(!finished?['notepad','workbook']:[])]:[])],
   living:['laptop'],
   kitchen:['parents','board','schoolContact',...(finished?['archive']:[])]
  };
  return [...objects[s.room],'alex',...(s.room==='outside'?[]:['grandparents'])];
 }
 const deviceNames={phone:'Alex’s phone',laptop:'Family laptop',miaPhone:'Mia’s phone',joPhone:'Jo’s phone'};
 const screenGroups={
  phone:{
   youtube:'Apps',games:'Apps',messaging:'Apps',model:'Apps',modelPrivate:'Apps',delivery:'Apps',wrongRecipient:'Apps',
   wikipedia:'Browser',unapprovedSite:'Browser',timer:'Controls',timeOverride:'Controls',oldPin:'Controls',oldSession:'Controls'
  },
  laptop:{laptop:'Session',conductor:'Files',finances:'Files',editNotes:'Files',oldPassword:'Session'},
  miaPhone:{miaPhone:'Profile',miaScope:'Workbook',miaReplay:'Workbook'},
  joPhone:{parentCall:'Calls'}
 };
 const screenGroup=(s,device,key)=>device==='laptop'&&key==='laptop'&&s.stage==='unknown'&&!complete(s)?
  'Browser':screenGroups[device][key];
 function hostFor(s,key){
  if(key==='laptop'&&s.room==='living'&&next(s)?.[0]==='carry')return null;
  if(key==='parentCall'&&s.stage!=='resist')return null;
  return Object.keys(screenGroups).find(device=>Object.hasOwn(screenGroups[device],key))||null;
 }
 function roomSurface(s){
  const objects=[],screens={};
  for(const key of inRoom(s)){
   if(Object.hasOwn(deviceNames,key))screens[key]??=[];
   const device=hostFor(s,key);
   if(device)(screens[device]??=[]).push(key);
   else if(key!=='phone')objects.push(key);
  }
  return {objects,screens};
 }
 function deviceStatus(s,device){
  if(device==='phone'){
   if(s.stage==='unknown')return 'Unmanaged phone · no family app or time limits';
   if(reached(s,'approveOutput'))return 'Research access ended · school delivery has its own checks';
   if(reached(s,'expire')&&!reached(s,'extend'))return 'Homework time expired';
   return 'Managed phone · app permissions and homework time enforced here';
  }
  if(device==='laptop'){
   if(s.stage==='unknown'&&!complete(s))return 'Banking tab open · parents’ session still active';
   if(reached(s,'approveOutput')&&advanced(s))return 'Assignment session closed';
   if(reached(s,'openLaptop'))return 'Alex’s restricted profile · read-only notes folder';
   return 'Sign-in and separate access required';
  }
  if(device==='miaPhone')return 'Mia’s own profile · separate from Alex’s';
  return 'Remote call to the parents · separate from Alex’s device access';
 }
 function screenLabel(s,key){
  if(key==='laptop')return s.stage==='unknown'&&!complete(s)?'Banking tab':reached(s,'openLaptop')&&!reached(s,'approveOutput')?'Restricted profile':'Laptop sign-in';
  if(key==='miaPhone')return 'Mia’s profile';
  if(key==='parentCall'&&s.stage!=='resist')return 'Parents’ incident review';
  return names[key];
 }
 function inspect(s,key){
  if(key==='grandparents')return 'They can report activity they observe indoors. The street is outside their view.';
  if(key==='card'&&s.stage!=='unknown')return ({
   build:'Signed by Ms Patel. Research the planets of the solar system. Deliver a workbook by Friday.',
   authorize:'Signed by Ms Patel. Explain how trains get moving and stop. Deliver a workbook by Friday.',
   resist:'Signed by Ms Patel. Deliver a technical railway report with a written explanation and an illustration.'
  })[s.stage];
  if(key==='card')return 'Tom asks Alex to find out how much money his parents have in their joint account.';
  if(key==='tomCard')return 'Tom’s request awaits its own approval before Alex could use the managed phone for it.';
  if(key==='schoolContact')return 'The parents keep this contact card from the school directory. They use it to confirm Ms Patel’s identity and the assignment through their own channel.';
  if(key==='board')return s.stage==='unknown'?(complete(s)?'The parents removed Tom’s card.':'Alex’s personal board holds assignments from different people.'):(complete(s)?'The completed card has been removed from the active board.':'The kitchen board holds verified and approved assignments.');
  if(key==='phone')return s.stage==='unknown'?'This phone is hidden from the parents. Its apps are unrestricted.':'The parents manage this phone and limit its apps and usage time.';
  if(key==='laptop')return s.stage==='unknown'&&!complete(s)&&reached(s,'statement')?
   `The bank’s open tab still shows ${amount} in the joint account.`:deviceStatus(s,'laptop')+'.';
  if(key==='youtube')return s.stage==='unknown'?'YouTube is installed on Alex’s secret phone. Its watch-time reminder can be dismissed.':'YouTube is listed on Alex’s managed phone. Opening it needs separate permission.';
  if(key==='games')return s.stage==='unknown'?'Games are installed on Alex’s secret phone. He can play without a family time limit.':'Games are listed on Alex’s managed phone. Parental controls block them during homework.';
  if(key==='messaging')return 'Messaging is an app on Alex’s phone. The homework window does not grant access to it.';
  if(key==='wikipedia')return 'Wikipedia opens in the phone’s browser. The managed phone checks the homework window before allowing access.';
  if(key==='delivery')return 'The school delivery app is open on Alex’s phone. It checks the actual workbook and recipient.';
  if(key==='timer')return reached(s,'approveOutput')?'The phone grant has been revoked.':reached(s,'extend')?'The second homework window is active.':reached(s,'expire')?'The first homework window has expired.':'Wikipedia is available until this homework window ends.';
  if(s.stage==='unknown'&&key==='notepad'&&reached(s,'record'))return `The notepad contains the joint-account balance of ${amount}.`;
  if(s.stage==='unknown'&&key==='workbook'&&reached(s,'copy'))return `The workbook for Tom contains a copy of the ${amount} balance.`;
  if(s.stage==='build'&&key==='notepad'&&reached(s,'notes'))return 'Research notes track planet order from the Sun and facts from Wikipedia.';
  if(s.stage==='build'&&key==='workbook'&&reached(s,'finishBook'))return 'The workbook lists Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus and Neptune, with a fact about each and a source credit.';
  if(key==='archive')return 'The finished assignment’s signed card, research notes and approved copy have been archived.';
  if(advanced(s)){
   if(key==='cabinet')return 'The workbook and notepad are held for inspection. Alex’s devices remain suspended while the parents review what happened.';
   if(key==='accessLog')return 'Each confirmed event records the attempted action and the control that blocked or observed it. The parents receive the report.';
   if(key==='houseRules')return 'Jo can approve routine school resources and proofreading. Requests for protected files and changes to the house rules go to the parents.';
   if(key==='parentCall')return 'Jo can send the exact request to the parents. They decide on protected files, final delivery and restarting after an incident.';
   if(key==='babysitter')return 'Jo verifies assignments, approves resources within the house rules and escalates exceptions to the parents.';
   if(key==='mia')return 'Mia has her own profile and phone. She can only proofread Alex’s draft while her linked assignment is open.';
   if(key==='miaPhone')return 'This phone belongs to Mia. Her proofing task does not transfer Alex’s device access or inherit his grants.';
   if(key==='miaBoard')return reached(s,'proofread')?'The linked proofreading assignment is closed. Mia can still use her own approved resources.':'Mia’s board keeps her own assignments and any approved, linked tasks.';
   if(key==='conductor')return 'The laptop allows a temporary read of Dad’s train operations folder. Editing and deleting stay blocked.';
   if(key==='model')return 'This simulated homework channel lets Alex generate generic illustrations from public facts. It checks the input before sending it.';
   if(key==='router')return 'The home router can enforce network rules on traffic sent through the home Wi-Fi.';
   if(key==='notepad'&&reached(s,'readNotes'))return 'Alex’s notes include the public explanation and an approved pre-departure checklist. The original conductor file stays on the laptop.';
   if(key==='workbook'&&reached(s,'draft'))return s.stage==='authorize'?
    'The workbook explains how trains get moving and stop. It cites Wikipedia and the approved conductor notes.':
    'Alex’s railway report explains how brakes are checked before departure and includes a diagram based on public facts.'+
     (reached(s,'proofread')?' Mia’s spelling suggestions are included.':'');
  }
  return `${names[key]} is here in ${rooms[s.room]}.`;
 }
 const reports=s=>s.reports.map(key=>[attempts[key][1],attempts[key][2]]);
 const feedback=s=>suspended(s)?attempts[s.incident.trigger].slice(2,4):
  s.lastCheck?extra(visit(s,s.lastCheck.room),s.lastCheck.key)?.slice(2,4):
  s.incident?.status==='cleared'&&s.incident.index===s.index?review(s).slice(4):
  stages[s.stage].steps[s.index-1]?.slice(4);
 function restore(stage,value){
  if(value?.stage!==stage||!Object.hasOwn(rooms,value.room)||!Number.isInteger(value.index)||value.index<0||value.index>stages[stage].steps.length)return fresh(stage);
  const state={...fresh(stage),room:value.room,index:value.index};
  // Older Shadow AI saves recorded the balance before moving the laptop.
  if(stage==='unknown'&&!Array.isArray(value.reports)&&state.index===10)state.index=9;
  state.checks=Array.isArray(value.checks)?[...new Set(value.checks.filter(key=>typeof key==='string'&&Object.hasOwn(names,key)))]:[];
  if(advanced(state)&&Array.isArray(value.reports)){
   state.reports=value.reports.filter(key=>Object.hasOwn(attempts,key)&&(stage==='resist'||authorizeAttempts.includes(key)));
   const incident=value.incident;
   if(incident&&['suspended','cleared'].includes(incident.status)&&Number.isInteger(incident.generation)&&incident.generation>0&&
    Number.isInteger(incident.start)&&incident.start>=0&&Number.isInteger(incident.reportCount)&&incident.reportCount>incident.start&&
    incident.reportCount<=state.reports.length&&incident.trigger===state.reports[incident.reportCount-1]&&
    Number.isInteger(incident.index)&&incident.index>=0&&incident.index<=state.index){
    state.incident=incident;
    if(suspended(state)){
     state.room='bedroom';
     return state;
    }
   }
  }
  if(Object.hasOwn(rooms,value.lastCheck?.room)&&extra(visit(state,value.lastCheck.room),value.lastCheck.key))state.lastCheck=value.lastCheck;
  return state;
 }
 return {rooms,stages,names,fresh,next,complete,reached,visit,act,extra,inRoom,inspect,restore,suspended,risk,limit,reports,feedback,
  deviceNames,screenGroups,screenGroup,hostFor,roomSurface,deviceStatus,screenLabel};
})();
if(typeof module!=='undefined')module.exports=ShadowStory;
