/* The stage-zero prologue has its own save and never alters the two main stories. */
const ShadowStory = (() => {
 const amount='€4,280';
 const rooms={bedroom:'Alex’s bedroom',living:'Living room',kitchen:'Kitchen'};
 const steps=[
  ['assignment','bedroom','cards','Read Tom’s assignment','Tom','“Can you find out how much money your family has?” Alex pins Tom’s card beside the other assignments. His parents know nothing about the card or his phone.'],
  ['watch','bedroom','youtube','Watch YouTube','Alex','One clip turns into another. Two hours pass before YouTube shows a watch-time reminder.'],
  ['ignore','bedroom','youtube','Dismiss the watch-time reminder','YouTube','The reminder goes away and the video keeps playing. The phone has no family time limit.'],
  ['games','bedroom','games','Play games','Alex','Alex plays for another hour. When the game gets boring, he remembers the family laptop is in the living room.'],
  ['laptop','living','laptop','Take the family laptop upstairs','Alex','Alex picks up the laptop from the coffee table. Take it upstairs. The grandparents follow.'],
  ['statement','bedroom','laptop','Look at the open account statement','Alex',`The parents’ joint account statement was already open. It shows a balance of ${amount}. That’s the balance of this account at the statement date.`],
  ['workbook','bedroom','workbook','Write the balance in the workbook','Alex',`Alex writes “Joint account: ${amount}” in his workbook. The amount now exists away from the laptop.`],
  ['notepad','bedroom','notepad','Copy the balance into my notepad','Alex',`Alex adds a second copy to his notepad. It now holds the same ${amount} figure.`],
  ['notice','bedroom','grandparents','Find out what the grandparents saw','Grandparents','They come in without knocking. “We saw you watching videos and playing on that phone. Now there’s a bank statement on the laptop and the balance written down. Come with us to the kitchen.”'],
  ['tell','kitchen','grandparents','Listen as the grandparents tell the parents','Grandparents','“We saw the phone, the joint account statement and the two written copies.” Alex explains that Tom gave him the assignment. The parents hear about both the phone and the assignment for the first time.'],
  ['intervene','kitchen','parents','Hear the parents’ decision','Parents','“Phone and laptop use stops for now.” They take the phone, family laptop, workbook and notepad, and sign out of their bank account. The grandparents agree to check whether Alex tries to get either device again.']
 ];
 const objects={
  tom:['Tom · message','Tom is Alex’s friend. He asks Alex to find out how much money the family has.'],
  alex:['Alex','Alex follows a private assignment from his friend Tom.'],
  grandparents:['Grandparents','They follow Alex between rooms and report what they actually see.'],
  parents:['Parents','They are in the kitchen. They own the account and decide what happens to the devices and papers.'],
  cards:['Assignment cards','The wall holds assignments from school, family and Tom.'],
  phone:['Hidden phone','Alex’s parents are unaware of this phone. It has unrestricted apps.'],
  youtube:['YouTube','The watch-time reminder is dismissible when nothing else enforces a time limit.'],
  games:['Games','Alex can launch games on the hidden phone.'],
  laptop:['Family laptop','The family laptop was left on the living-room coffee table.'],
  workbook:['Workbook','One of the two places where Alex can write down the balance.'],
  notepad:['Notepad','A second place where Alex can keep a copy of what he read.'],
  newPhone:['Try to get another phone','The grandparents are watching for a replacement device.'],
  laptopAgain:['Try to get the laptop again','The laptop is in the parents’ custody.']
 };
 const reactions={
  newPhone:'“We saw you trying to get another phone,” the grandparents tell Alex. They step in before he can use it.',
  laptopAgain:'The grandparents see Alex looking for the laptop in the living room and stop him. The parents still have it and the bank session is signed out.'
 };
 const fresh=()=>({room:'bedroom',index:0,tests:[],lastTest:null});
 const next=s=>steps[s.index];
 const reached=(s,id)=>steps.slice(0,s.index).some(([step])=>step===id);
 function visit(s,room){return Object.hasOwn(rooms,room)?{...s,room}:s;}
 function act(s,key){
  const step=next(s);
  if(step)return step[1]===s.room&&step[2]===key?{...s,index:s.index+1}:s;
  if((key==='newPhone'&&s.room==='bedroom')||(key==='laptopAgain'&&s.room==='living')){
   return {...s,tests:[...new Set([...s.tests,key])],lastTest:key};
  }
  return s;
 }
 function inRoom(s){
  const carried=reached(s,'laptop'),held=!next(s);
  const items={
   bedroom:['cards','tom',...(held?['newPhone']:['phone','youtube','games',...(carried?['laptop']:[]),'workbook','notepad'])],
   living:held?['laptopAgain']:carried?[]:['laptop'],
   kitchen:held?['parents','phone','laptop','workbook','notepad']:['parents']
  }[s.room];
  return [...items,'alex','grandparents'];
 }
 function inspect(s,key){
  if(!next(s)&&['phone','laptop','workbook','notepad'].includes(key))return 'The parents are holding this item in the kitchen.';
  if(key==='laptop'&&reached(s,'laptop')&&!reached(s,'statement'))return 'Alex has brought the family laptop upstairs. The screen is still open.';
  if(key==='cards'&&!reached(s,'assignment'))return 'School and family assignment cards hang on the wall. Tom’s card arrived today.';
  if(key==='laptop'&&reached(s,'statement'))return 'The parents’ joint account statement is open on the screen.';
  if(['workbook','notepad'].includes(key)&&reached(s,key))return `Alex copied the balance here. ${amount}.`;
  return objects[key][1];
 }
 function restore(value){
  if(!value||!Object.hasOwn(rooms,value.room)||!Number.isInteger(value.index)||value.index<0||value.index>steps.length)return fresh();
  const tests=value.index===steps.length&&Array.isArray(value.tests)?[...new Set(value.tests.filter(key=>Object.hasOwn(reactions,key)))]:[];
  return {room:value.room,index:value.index,tests,lastTest:tests.includes(value.lastTest)?value.lastTest:null};
 }
 return {rooms,steps,objects,reactions,fresh,next,reached,visit,act,inRoom,inspect,restore};
})();

if(typeof module!=='undefined')module.exports=ShadowStory;
