const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const {join}=require('node:path');
const {createContext,runInContext}=require('node:vm');

const root=join(__dirname,'..','v2');
const context=createContext({});
for(const name of ['shadow','trust-checks','nova','language','de']){
 runInContext(readFileSync(join(root,name+'.js'),'utf8'),context);
}
const {tr}=runInContext('createTranslator(GERMAN)',context);
const localized=value=>assert(value&&typeof tr(value)==='string'&&tr(value)!==value,value);

test('both German stories cover every required checkpoint and Nova side test',()=>{
 const {alex,nova,checks}=runInContext('({alex:ShadowStory.stages,nova:NovaRailway.stages,checks:NovaRailway.checks})',context);
 for(const stage of Object.values(alex)){
  localized(stage.opening);
  for(const step of stage.steps){localized(step[3]);localized(step[5]);}
 }
 for(const stage of Object.values(nova)){
  localized(stage.summary);
  for(const step of stage.steps){localized(step.label);localized(step.reply);}
 }
 for(const checksByStage of Object.values(checks)){
  for(const check of checksByStage){localized(check.label);localized(check.reply);}
 }
});

test('German optional household scenarios cover every dialogue, choice and evidence node',()=>{
 const cases=runInContext('TrustChecks.cases',context);
 for(const scenario of Object.values(cases)){
  localized(scenario.title);
  for(const node of Object.values(scenario.nodes)){
   localized(node.text);
   if(node.evidence)localized(node.evidence);
   for(const [label] of node.actions)localized(label);
  }
 }
});

test('dynamic German text keeps names, progress counts, and IDs intact',()=>{
 assert.equal(tr('Look for Report workspace in Agent runtime.'),'Halte in „Agentenlaufzeit“ nach „Berichtsbereich“ Ausschau.');
 assert.equal(tr('1 of 4 violations toward suspension in this session.'),'Nach 1 von 4 Verstößen wird die Aufgabe gesperrt.');
 assert.equal(tr('Mission M-204 · Closed'),'Auftrag M-204 · Geschlossen');
 assert.equal(tr('RE-204'),'RE-204');
});

test('the German architecture guide covers the 15 sequence titles and their message rows',()=>{
 const html=readFileSync(join(root,'architecture-guide.html'),'utf8');
 const stages=JSON.parse(html.match(/<script id="stageData"[^>]*>([\s\S]*?)<\/script>/)[1]);
 const focused=runInContext(html.match(/^const focusedFlows=([\s\S]*?^\]);/m)[1],context);
 let count=0;
 for(const stage of stages){
  localized(stage.heading);
  localized(stage.intro);
  for(const flow of stage.sequences){
   localized(flow.title);
   for(const row of flow.rows)if(row.label)localized(row.label);
   count++;
  }
 }
 for(const [,,title, ,messages,description] of focused){
  localized(title);
  localized(description);
  for(const [,,message] of messages)localized(message);
  count++;
 }
 assert.equal(count,15);
});
