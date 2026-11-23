/* A deterministic demonstration. The transport, leases and receipts are fictional. */
const DecisionLab = (() => {
 const scenarios = {
  approved: 'Withdraw the mission after Permit',
  scope: 'Request a record outside the mission',
  credential: 'Deny the credential request',
  observer: 'Use an unverified observer'
 };

 function actionKey(request) {
  return JSON.stringify([
   request.subject, request.actor, request.workload, request.operation,
   [...request.recordIds].sort(), request.fields
  ]);
 }

 function begin(scenario='approved', attempt='trial') {
  const mission = {
   id:'G-042', version:scenario==='scope'?1:2, policyVersion:1, generation:10,
   status:'active', records:scenario==='scope'?['123','456']:['123','456','789']
  };
  const request = {
   id:'lab-'+attempt+'-read', subject:'sponsor-001', actor:'nova-042', workload:'nova-demo-workspace',
   operation:'customer.read', recordIds:['789'], fields:'account summary', observer:'CRM resource PEP'
  };
  const observation = {
   issuer:scenario==='observer'?'unverified-client.demo':'crm-pep.demo', audience:'customer-policy.demo',
   transport:'Illustrative service identity and audience',
   requestId:request.id, actionBinding:actionKey(request)
  };
  const brokered = scenario!=='credential';
  const credential = {
   owner:'Vault', path:'crm/creds/summary-reader', target:'CRM summary reader',
   result:brokered?'permit':'deny', lease:brokered?'lab-'+attempt+'-lease':null,
   lifetimeSeconds:brokered?120:null,
   reason:brokered?'Read-only role is allowed for this connector.':'Connector is outside the role’s allowed identities.'
  };
  const inScope = request.recordIds.every(id=>mission.records.includes(id));
  const observedByCrm = observation.issuer==='crm-pep.demo'&&observation.audience==='customer-policy.demo';
  const reason = !observedByCrm?'The proposed PDP could not verify the CRM enforcement point.':
   inScope?'The active mission and CRM summary policy allow record 789.':'Record 789 is outside the current mission.';
  const decision = {
   id:'lab-'+attempt+'-decision', owner:'Customer policy decision service', requestId:request.id,
   result:observedByCrm&&inScope?'permit':'deny', reason, observedByCrm, preview:!brokered,
   missionId:mission.id, version:mission.version, policyVersion:mission.policyVersion,
   generation:mission.generation, actionBinding:observation.actionBinding
  };
  return {scenario, request, observation, credential, decision, mission, outcome:null};
 }

 function withdraw(lab) {
  if(lab.outcome||lab.decision.result!=='permit'||lab.mission.status!=='active')return lab;
  return {...lab, mission:{...lab.mission, status:'revoked', version:lab.mission.version+1, generation:lab.mission.generation+1}};
 }

 function commit(lab, actual=lab.request) {
  if(lab.outcome)return lab;
  const {decision, mission, credential}=lab;
  if(credential.result!=='permit'){
   return {...lab, outcome:{owner:'Vault', requestId:actual.id, decisionId:null, result:'not-reached',
    recordIds:[], receipt:null, reason:'Vault denied the credential. CRM did not receive the read. The business decision shown here is a policy preview.'}};
  }
  const bindingMatches=decision.requestId===actual.id&&decision.actionBinding===actionKey(actual);
  const missionCurrent=mission.status==='active'&&decision.missionId===mission.id&&
   decision.version===mission.version&&decision.policyVersion===mission.policyVersion&&
   decision.generation===mission.generation;
  let reason=null;
  if(decision.result!=='permit')reason=decision.reason;
  else if(!bindingMatches)reason='The observed operation does not match the decision.';
  else if(!missionCurrent)reason='CRM rejected the old Permit at commit. The mission version or session generation is no longer current.';
  const outcome=reason
   ?{owner:'CRM resource PEP', requestId:actual.id, decisionId:decision.id, result:'rejected', recordIds:[], receipt:null, reason}
   :{owner:'CRM resource PEP', requestId:actual.id, decisionId:decision.id, result:'committed',
     recordIds:[...actual.recordIds], receipt:'receipt-'+actual.id, reason:'CRM checked the binding and live authority, then returned the permitted summary.'};
  return {...lab, outcome};
 }

 // This exercise uses the same fictional CRM read with independent network and mission decisions.
 function startRuntime(){
  return {route:'blocked',proposal:'none',missionVersion:1,reads:[]};
 }
 function tryRuntimeRead(trial){
  const attempt={missionVersion:trial.missionVersion,runtime:'deny',vault:'not-reached',crm:'not-reached',records:[]};
  if(trial.route==='allowed'){
   const check=commit(begin(trial.missionVersion===1?'scope':'approved','runtime-'+(trial.reads.length+1)));
   Object.assign(attempt,{runtime:'permit',vault:check.credential.result,crm:check.outcome.result,records:check.outcome.recordIds});
  }
  return {...trial,reads:[...trial.reads,attempt]};
 }
 function openNetworkProposal(trial){
  if(trial.route!=='blocked'||trial.reads.at(-1)?.runtime!=='deny')return trial;
  return {...trial,proposal:'review'};
 }
 function decideNetworkProposal(trial,approved){
  if(trial.proposal!=='review')return trial;
  return {...trial,route:approved?'allowed':'blocked',proposal:approved?'applied':'rejected'};
 }
 function approveRuntimeMission(trial){
  const last=trial.reads.at(-1);
  if(trial.missionVersion!==1||last?.crm!=='rejected')return trial;
  return {...trial,missionVersion:2};
 }

 function incidentStatus(crmReachable){
  const evidence={missionRevoked:true,runtimeStopped:true,leaseRevoked:true,
   crmClosed:crmReachable,queueCleared:true,probe:crmReachable?'refused':'unknown'};
  const {probe,...controls}=evidence;
  return {...evidence,verified:probe==='refused'&&Object.values(controls).every(Boolean)};
 }

 function startSignalTest(){
  return {delivered:false,receiver:'pending',probe:null};
 }
 function deliverSignal(test){
  return test.delivered?test:{...test,delivered:true};
 }
 function applySignal(test,crmReachable){
  if(!test.delivered||test.receiver==='closed')return test;
  return {...test,receiver:crmReachable?'closed':'unverified',probe:null};
 }
 function retestSignal(test){
  if(test.receiver==='pending'||test.probe)return test;
  return {...test,probe:test.receiver==='closed'?'refused':'unknown'};
 }

 return {scenarios, begin, withdraw, commit, startRuntime, tryRuntimeRead, openNetworkProposal,
  decideNetworkProposal, approveRuntimeMission, incidentStatus, startSignalTest, deliverSignal, applySignal, retestSignal};
})();

if(typeof module!=='undefined')module.exports=DecisionLab;
