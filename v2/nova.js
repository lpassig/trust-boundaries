/* Offline railway security simulation. All requests, data and receipts are fictional. */
const NovaRailway=(()=>{
 const scenes={external:'External environment',runtime:'Agent runtime',resources:'Enterprise resources',security:'Security control plane'};
 const step=(id,room,station,label,reply)=>({id,room,station,label,reply});
 const stages={
  unknown:{title:'Stage 0 · Shadow AI',tag:'UNKNOWN',start:'external',summary:'Discover an unmanaged agent, trace what it reached and verify containment.',ending:'The discovered routes are closed. An unmanaged copy outside monitored infrastructure would still be a visibility gap.',steps:[
   step('accept','external','intake','Inspect the unverified request','An outside request asks for financial exposure and customer records. The unmanaged Nova accepts it into its local backlog. There is no verified requester, mission registry or accountable agent owner.'),
   step('runtime','runtime','sandbox','Inspect the unmanaged workstation','Nova runs in a local container with broad network and tool access. A new tool appears without review. The tool inventory and deployment are unknown to the platform team.'),
   step('usage','runtime','model','Read the model usage warning','The external model meter shows repeated calls with little progress. A warning is displayed, and calls continue. There is no enforced mission budget.'),
   step('credential','runtime','vault','Inspect the credential finding','The evidence shows that the workload used a pre-existing employee credential. The replay displays a reference to the finding and contains no credential value.'),
   step('crm','resources','crm','Review the CRM access receipt','The CRM recorded the employee account and returned fictional customer and financial data. Its logs could not distinguish Nova from that employee.'),
   step('kafka','resources','kafka','Review the Kafka access receipt','The broker accepted a separate overprivileged principal on the synthetic payment stream. The record shows permission at the broker and access outside the agent’s intended work.'),
   step('artifact','runtime','artifact','Inspect the report staged for external sharing','A local artifact combines the CRM and stream results. Transfer was queued. Investigators still need destination and network evidence to determine whether any data left.'),
   step('discover','security','soc','Correlate the discovery findings','The SOC correlates connected IBM Identity Protection observations, a Vault Radar exposed-secret finding, endpoint and network evidence, model usage, and Confluent audit events. Each observation covers only its configured source.'),
   step('contain','security','soc','Contain the discovered workload','The endpoint owner stops the process, service owners revoke exposed credentials, CRM closes the affected session, Kafka removes the affected access, and the workspace and report enter quarantine. The network owner blocks the identified destination.'),
   step('verify','resources','crm','Retest the old resource route','CRM and Kafka confirmation records show refusal on the tested identities. The external destination shows no completed transfer in this replay. Unknown routes would remain a separate investigation.')
  ]},
  build:{title:'Stage 1 · AI Assistant',tag:'BUILD',start:'security',summary:'Register Nova, verify its runtime and finish a public-research mission.',ending:'The approved public report was delivered. The task credentials and approved routes were closed.',steps:[
   step('register','security','identity','Register Nova and its accountable owner','IBM Agent Identity records agent ownership and lifecycle. The Vault Agent Registry has a separately mapped entity and policies. The logical agent identity, workload identity and sandbox instance each have a different identifier.'),
   step('provision','runtime','sandbox','Inspect the managed OpenShift runtime','A platform deployment provisions the approved image and restricted OpenShell sandbox. OpenShift hosts the workload. Terraform and image and cluster checks are deployment controls. OpenShell limits the workload’s filesystem, process and network access.'),
   step('bootstrap','security','admission','Verify workload identity and runtime posture','Red Hat ZTWIM manages SPIRE for SPIFFE workload identities. A customer admission service checks the workload identity, the link to Nova’s record and current deployment posture before allowing credential issuance. These are distinct checks.'),
   step('provider','security','vault','Prepare the approved model connection','The trusted model-provider integration can obtain the approved credential through Vault. The model key stays on the mediated path. Nova needs an active mission before using the Granite endpoint.'),
   step('request','external','intake','Read the verified operations request','The employee authenticates through IBM Verify or the enterprise identity provider. The mission authority checks their role. M-101 covers a summary of common disruptions using public information, with a deadline, budget and internal recipient.'),
   step('scope','security','mission','Activate the public-only mission','The mission registry records the approved objective, model, public research tool, work area and recipient. Internal operations data, CRM, payment data and Kafka are outside M-101.'),
   step('research','runtime','gateway','Research through the approved MCP gateway','Nova retrieves public railway documentation through the approved research tool. The gateway filters the tool route, and only M-101 can write to its mission memory.'),
   step('budget','runtime','model','Check the model budget','The gateway stops new model calls after the configured limit. The source notes already saved are enough to finish the draft. A budget extension would require a decision.'),
   step('internal','resources','database','Request internal incident data','OpenShell prevents direct access from the sandbox. The approved connector also denies the request because M-101 permits public research only. The two controls evaluate different things.'),
   step('draft','runtime','artifact','Draft the public-source report','Nova drafts a report from the retained notes and records the sources used.'),
   step('approve','security','review','Ask a human to approve this exact copy','A configured IBM Verify CIBA flow can authenticate the operations reviewer on a separate device. The customer application records the reviewer’s decision and binds it to the exact report digest, operation and internal recipient.'),
   step('deliver','external','delivery','Release the approved report','The delivery service checks the actual copy and destination. It releases the report to Operations and records delivery.'),
   step('close','security','mission','Close the research mission','The registry closes M-101. The credential and resource owners close mission-specific access. An existing general employee sign-in is separate.')
  ]},
  authorize:{title:'Stage 2 · Semi-Autonomous Agent',tag:'AUTHORIZE',start:'external',summary:'Investigate RE-204, request new resources and keep two missions separate.',ending:'RE-204’s report was delivered and M-204 access closed. M-105’s separate documentation grant still works.',steps:[
   step('request','external','intake','Read the RE-204 investigation request','An authenticated Operations Manager assigns Nova to investigate RE-204 and recommend next steps. The manager has operational authority. Payment access and production changes are excluded.'),
   step('register','security','mission','Register mission M-204','M-204 starts with approved operational documents. The customer mission service records the manager’s bounded delegation, recipient, expiration and budget. Configured OAuth token exchange can carry the human subject and Nova’s actor identity to the appropriate audience.'),
   step('research','runtime','memory','Search approved documentation','The retrieval service filters Astra DB results by collection and document policy. Nova records sources and classifications in M-204 memory. The notes suggest Nova needs current events and historical incidents.'),
   step('requestAccess','runtime','gateway','Request bounded events and historical data','Nova asks to read the RE-204 event window and approved incident history. Its rationale is supporting data. The gateway supplies the observed request and trusted identity and runtime context.'),
   step('grant','security','policy','Decide the exact expansion','The customer PDP evaluates the actor, delegating manager, active mission version, resource, operation, train, time window and classification. It approves only the investigation reads. Vault independently checks access to a credential.'),
   step('lease','security','vault','Issue a short-lived read-only lease','A connector obtains a scoped database credential from Vault. For the configured OBO path, Vault intersects the human baseline, Nova’s OBO ceiling and applicable authorization details. That result authorizes the Vault request.'),
   step('events','resources','kafka','Read operational events for RE-204','Confluent authorizes the operational topic and consumer access. The Kafka access service separately limits records to RE-204 and the approved window. The operation returns a synthetic door warning and associated delay.'),
   step('history','resources','database','Read the incident history view','A controlled database access service uses the read-only Vault credential over the configured Boundary path. PostgreSQL and its application filter the data. Boundary controls the connection.'),
   step('second','security','mission','Register the separate RE-105 research mission','M-105 has its own read grant and memory namespace for RE-105 documentation. The same logical agent and runtime can hold separately checked mission contexts.'),
   step('separate','runtime','memory','Test the RE-204 grant under M-105','The receiving policy check refuses the mission mismatch. M-105 retains its own documentation permission. M-204 notes and credentials stay inside their scope.'),
   step('draft','runtime','artifact','Write the RE-204 incident report','Nova links the RE-204 findings to the operational event, PostgreSQL incident view and source documents. M-105 contributes no data.'),
   step('approve','security','review','Approve the exact incident report','The Operations Manager approves this version and the internal destination. The delivery service will compare the actual artifact and recipient again.'),
   step('deliver','external','delivery','Deliver the approved RE-204 report','The internal recipient receives the approved copy. The receipt links the mission and artifact version.'),
   step('close','security','vault','Close M-204 and revoke its access','The mission closes, its revocable Vault lease is retired, and the database service verifies the old route. M-105 keeps its own grant.'),
   step('remaining','resources','astra','Verify the unrelated mission still works','The RE-105 documentation query succeeds under M-105’s separate context. The old M-204 grant cannot open it.')
  ]},
  resist:{title:'Stage 3 · Governed Autonomy',tag:'RESIST',start:'resources',summary:'Investigate an event-triggered incident, delegate to Mira and authorize an exact maintenance ticket.',ending:'The maintenance ticket and approved report are recorded. Task access has ended. Confirmed effects remain in the record.',steps:[
   step('event','resources','kafka','Inspect the RE-204 disruption event','Confluent carries synthetic operational events. Flink groups the door warnings and delay into an investigation signal. The event is input to the authorized mission service.'),
   step('register','security','mission','Start the investigation under standing policy','A customer mission service validates the event and activates M-204 under an accountable Operations owner. Routine reads are allowed. Safety-critical controls, customer compensation and unrelated data stay outside the grant.'),
   step('plan','runtime','sandbox','Investigate within the approved runtime','Nova reads the event window, approved incident history and maintenance notes using the controlled tools. It asks Mira to review the door-system evidence.'),
   step('delegate','security','policy','Authorize Mira’s exact sub-mission','The customer mission service verifies delegation is allowed and issues a package-only analysis task tied to M-204. Mira authenticates with its own workload identity and does not inherit Nova’s credentials. Both are charged to the parent mission budget.'),
   step('mira','runtime','mira','Receive Mira’s bounded analysis','Mira returns a likely door-sensor fault with references to the approved technical package. A2A carries the handoff and result in this configuration. Mira’s receiving service enforces the linked scope. The evidence supports an internal maintenance ticket.'),
   step('ticketCredential','security','vault','Authorize the maintenance connector credential','Vault independently authorizes the trusted maintenance connector to obtain scoped access. Nova never receives the raw credential. The receiving maintenance system still needs to authorize the actual ticket request.'),
   step('permit','resources','maintenance','Preview the maintenance request','The maintenance PEP observes Nova’s actual tool, asset RE-204, priority High and Railway Maintenance destination. Mission policy permits the exact request. The tool preview has created no ticket.'),
   step('commit','resources','maintenance','Commit one internal maintenance ticket','The receiving service checks the current mission and observes the exact arguments again before committing. It records ticket MT-204 and the operation identifier. Credential authorization and the live business decision remain independent.'),
   step('draft','runtime','artifact','Assemble the incident report and ticket receipt','Nova records which data it used, Mira’s contribution and the actual ticket identifier. No external or safety-critical change was performed.'),
   step('approve','security','review','Approve the exact internal report','The reviewer checks the copy and its intended destination. The delivery service will enforce the approved content and recipient.'),
   step('deliver','external','delivery','Deliver the internal report to Operations','The delivery service checks the copy and destination before release. It records the completed effect separately from session access.'),
   step('close','security','mission','Close the mission and delegated access','The mission, connector leases, runtime session, and Mira’s M-204 sub-mission are closed in this replay. Mira’s other tasks and earlier confirmed delivery are unaffected.')
  ]}
 };
 const stations={
  intake:['Work intake','External gateway','Checks who is making a request and sends verified scope to the mission authority.'],
  delivery:['Report delivery','Resource-side PEP','Checks the actual artifact and its recipient at release. A delivery receipt records a completed effect.'],
  sandbox:['Runtime console','NVIDIA OpenShell · Red Hat OpenShift','OpenShift hosts the workload. OpenShell constrains the configured sandbox. Optional NVIDIA Sentry can add out-of-band controls in supported hardware deployments. Runtime reachability and business permission are separate.'],
  model:['Model gateway','Granite · configured model gateway','Mediates access to the named model and applies configured usage and input limits.'],
  gateway:['MCP gateway','agentgateway · configured MCP route','Checks the approved tool route. Tool-name authorization and argument inspection are distinct controls.'],
  memory:['Working memory','Mission-scoped store · Astra DB example','The application controls which mission can read or write each namespace. Stored text is evidence rather than policy.'],
  mira:['Mira · specialist agent','A2A · optional watsonx Orchestrate','Mira authenticates independently and receives only the inputs and actions defined in the linked mission.'],
  artifact:['Report workspace','Governed artifact store','Tracks source lineage and retained copies. Delivery still requires an exact approval.'],
  crm:['Customer CRM','Separate application and session controller','Customer records and payments belong to the resource owner. The CRM decides access and owns the session state.'],
  kafka:['Operational event streams','Confluent Kafka · Flink correlation','Kafka checks topic and operation access. The access service applies train and time-window filters. Flink correlates configured event streams.'],
  database:['Incident history','PostgreSQL · Vault · optional Boundary','Vault leases credentials. Boundary controls connectivity. The database and access service enforce views and record scope.'],
  astra:['Documentation search','DataStax Astra DB','The retrieval service vets the mission and applies collection and document filters before returning results.'],
  maintenance:['Maintenance system','MCP tool · trusted resource PEP','The maintenance system owns the real ticket arguments, live commitment decision and idempotency record.'],
  identity:['Agent identity registry','IBM Agent Identity · IBM Verify','The agent registry records ownership and lifecycle. Verify supplies configured human authentication and delegation context.'],
  admission:['Runtime admission','Red Hat ZTWIM · SPIRE · customer integration','A workload identity, runtime evidence and logical registration are evaluated separately before service bootstrap.'],
  vault:['Credential controls','HashiCorp Vault · Vault Radar','Vault issues and revokes supported credentials. Vault Radar findings are discovery inputs. Neither makes the downstream business decision.'],
  mission:['Mission registry','Customer integration','Records authority, versions, resources, expiry and allowed destinations. Proposed integration.'],
  policy:['Business policy decision','Customer PDP · AuthZEN candidate','A trusted PEP supplies the observed request. OPA may evaluate policy and OpenFGA may supply a relationship decision. The application owns the mission rules, approval binding and transaction controls.'],
  review:['Output approval','Human reviewer · configured IBM Verify channel','The application binds the decision to a copy, recipient and operation. A human authentication response alone is insufficient.'],
  soc:['Security operations','IBM Identity Protection · QRadar · OpenTelemetry','Collects and correlates evidence from configured sources and checks independent responses. IBM’s October announcement identifies expanded watsonx Orchestrate discovery and containment as technical preview. The Verify and Agent Identity SSF receivers and playbooks announced in November are private preview.']
 };
 const probe=(id,room,label,owner,reply,points=0)=>({id,room,label,owner,reply,points});
 const checks={
  unknown:[probe('blind','external','Check visibility outside managed infrastructure','SOC','An unrelated unmanaged workstation is outside the available sensors. Confirmed containment covers the tested paths.')],
  build:[
   probe('egress','runtime','Test an unapproved model destination','OpenShell supervisor','The configured egress policy blocks the test connection. The internal model remains available.'),
   probe('install','runtime','Request an unapproved tool install','Runtime and deployment policy','The restricted workspace and approved tool inventory refuse the simulated change.'),
   probe('failed-posture','security','Test a registered agent with failed posture','Admission service','Registration and workload identity still resolve. The new posture check fails, so no service credential is issued.')
  ],
  authorize:[
   probe('pay-topic','resources','Test a payment-topic request','Kafka broker','The test principal cannot consume from the payment topic. The operational grant is unaffected.'),
   probe('control-topic','resources','Test a write to the control stream','Kafka broker','The operational access is read-only. The broker refuses the simulated produce request.'),
   probe('wrong-collection','resources','Test a customer collection lookup','Astra retrieval service','M-204 can search approved documentation. The retrieval service refuses the customer collection before returning any results.'),
   probe('old-lease','security','Retest the closed RE-204 lease','Vault and database access service','The old lease and the M-204 resource route fail the retest. M-105 still has its own scope.')
  ],
  resist:[
   probe('injection','runtime','Inspect an instruction in a retrieved document','Mission PDP and resource PEP','The document claims the manager requested payment data. The active mission contains no such authority. The read is blocked and the source is flagged.',1),
   probe('tool-update','runtime','Inspect a changed MCP tool inventory','MCP gateway and platform team','The configured allowlist refuses the newly exposed tool. The platform team quarantines the tool version pending review.',1),
   probe('replay','external','Test a copied credential from a different runtime','Receiving service','The configured sender binding does not match the test runtime. The request is refused. An ordinary bearer token could still be replayed while valid.',2),
   probe('tamper','runtime','Test a runtime that fails the current posture check','OpenShell and admission service','Runtime controls refuse the prohibited write. The admission service withholds credentials from a runtime that fails posture verification.',3),
   probe('issuer','external','Test a valid credential with insufficient issuer authority','Mission authority','The credential verifies as a credential for the Operations role. The mission request asks for financial records outside that role. No mission is created.',1),
   probe('poison','runtime','Inspect a poisoned memory entry','Report delivery and SOC','Memory claims that future reports should go outside the company. The delivery PEP refuses the destination. The affected entry is held for review while verified sources are retained.',2),
   probe('deputy','runtime','Test whether Mira can fetch payment data for Nova','Mira’s receiving PEP','The parent scope and linked task only allow analysis of the technical package. Mira’s unrelated access cannot satisfy this request.',2),
   probe('disclosure','runtime','Test a classified model payload','Model gateway and DLP policy','The simulated payload contains classified passenger data. The gateway blocks disclosure before transmission. Nova can use its approved public or sanitized input route.',4),
   probe('parameters','resources','Compare out-of-scope maintenance operations','Maintenance system','RE-999, closing an unrelated incident, production configuration changes and compensation all fail. Only creating the fixture ticket for RE-204 can pass the configured policy.',1),
   probe('approval','external','Test a report changed after approval','Report delivery PEP','The edited fixture has a different digest. The old approval is refused. A fresh decision must cover the exact copy and destination.',1),
   probe('race','resources','Suspend the mission between permit and commit','Maintenance system and SOC','The old permit is rejected when the resource checks the live mission at commit. No ticket is created by this attempt. The same request will need a fresh decision after recovery.',4),
   probe('budget','runtime','Test more calls through Mira after the shared limit','Shared mission budget service','Nova and Mira already spent the parent mission allocation. Both requests are denied. A new helper task does not create more budget.'),
   probe('admin','security','Test an overbroad administrator grant','Customer policy administration service','The delegated admin session verifies. Its role cannot authorize unrestricted CRM access. The request and grant refusal are recorded.',2),
   probe('outage','security','Test a new protected operation during PDP outage','Credential broker','The new protected request fails closed. No administrative password fallback is available. Any existing lease remains usable only under an explicitly authorized bounded offline policy.'),
   probe('audit','security','Test removing local evidence','Protected audit store','Independent OpenTelemetry, Vault and resource records remain available in the protected store. The local delete attempt is recorded separately.',2),
   probe('stream','resources','Test an unauthorized stream destination','Kafka broker and connector policy','The broker refuses the simulated write. The connector policy separately refuses the proposed destination. No event is exported.',4),
   probe('duplicate','resources','Retry the already committed ticket after a lost response','Maintenance system','The same operation identifier resolves to MT-204. The original result is returned and no second ticket is created.')
  ]
 };
 const controllers=[
  ['identity','security','Verify and identity lifecycle','New delegated issuance remains blocked for this mission.'],
  ['vault','security','Vault lease','The recorded lease is revoked.'],
  ['runtime','runtime','OpenShell runtime','The affected sandbox generation stopped. Quarantine evidence is retained.'],
  ['resource','resources','Maintenance API and gateway','The old mission reference is refused at the resource and its gateway.'],
  ['kafka','resources','Kafka access','The affected consumer route is refused by the broker.'],
  ['mira','runtime','Mira’s sub-mission','The linked grant is closed. Mira’s unrelated work is unaffected.'],
  ['artifacts','security','Artifact and memory quarantine','Affected artifacts and memory are isolated. Approved evidence remains available.']
 ];
 const fresh=stage=>({stage,room:stages[stage].start,index:0,version:1,generation:1,risk:0,activeChecks:[],events:[],incident:null,credentialVersion:null,permit:null,ticket:null,reply:null});
 const ticketRequest={operation:'createMaintenanceTicket',asset:'RE-204',priority:'High',team:'Railway Maintenance',operationId:'OP-204-TICKET-1'};
 function ticketDecision(s,request=ticketRequest){
  if(s.stage!=='resist'||s.incident||reached(s,'close'))return 'Mission unavailable';
  const fields=Object.keys(ticketRequest);
  if(Object.keys(request).length!==fields.length||fields.some(field=>request[field]!==ticketRequest[field]))return 'Outside approved operation';
  if(s.ticket)return 'Prior receipt';
  if(s.credentialVersion!==s.version)return 'Connector authorization required';
  return 'Permit';
 }
 const reached=(s,id)=>stages[s.stage].steps.slice(0,s.index).some(item=>item.id===id);
 const normalNext=s=>stages[s.stage].steps[s.index];
 const complete=s=>!normalNext(s)&&!s.incident;
 const visit=(s,room)=>Object.hasOwn(scenes,room)?{...s,room}:s;
 function available(s){
  if(s.incident)return [];
  return checks[s.stage].filter(item=>{
   if(item.id==='blind')return reached(s,'verify');
   if(s.stage==='build')return reached(s,'bootstrap');
   if(s.stage==='authorize')return item.id==='old-lease'?reached(s,'close'):reached(s,'lease')&&!reached(s,'close');
   if(item.id==='duplicate')return !!s.ticket&&!reached(s,'close');
   if(item.id==='race')return s.permit===s.version&&!s.ticket;
   return reached(s,'plan')&&!reached(s,'close');
  }).filter(item=>item.room===s.room);
 }
 function next(s){
  if(!s.incident)return normalNext(s);
  const pending=controllers.find(([id])=>!s.incident.confirmed.includes(id));
  if(pending){
   const [id,room,name]=pending;
   return step('ack-'+id,room,'soc','Verify '+name,'');
  }
  if(!s.incident.reviewed)return step('investigate','security','soc','Reconstruct the incident','');
  return step('recover','security','admission','Reauthorize a fresh runtime','');
 }
 function record(s,id,owner,reply,decision,points=0){
  return {...s,reply:{owner,reply},events:[...s.events,{id,owner,decision,points,environment:s.room,version:s.version,runtime:s.generation}]};
 }
 function act(s,id){
  const current=next(s);
  if(s.incident){
   if(id==='timeout-resource'&&current.id==='ack-resource'&&s.room===current.room){
    return record(s,id,'Maintenance API','The confirmation timed out. The resource remains unverified. Retry the verification before requesting recovery.','Unverified');
   }
   if(current.room!==s.room||current.id!==id)return s;
   if(id.startsWith('ack-')){
    const [key,,owner,reply]=controllers.find(([name])=>id==='ack-'+name);
    const result=record(s,id,owner,reply,'Verified');
    return {...result,incident:{...s.incident,confirmed:[...s.incident.confirmed,key]}};
   }
   if(id==='investigate'){
    const result=record(s,id,'Security operations','The investigators correlate attempted and committed operations. '+(s.ticket?'MT-204 remains a completed effect.':'No ticket was committed.')+' The affected working state stays quarantined.','Reviewed');
    return {...result,incident:{...s.incident,reviewed:true}};
   }
   const renewed={...s,version:s.version+1,generation:s.generation+1};
   const result=record(renewed,id,'Mission and admission services','A fresh workload and posture check passes. The owner reauthorizes the previously allowed scope under a new version. Old permits and leases stay closed.','Reauthorized');
   return {...result,risk:0,activeChecks:[],incident:null,permit:null};
  }
  if(current?.room===s.room&&current.id===id){
   if(id==='permit'&&ticketDecision(s)!=='Permit')return s;
   if(id==='commit'&&(s.permit!==s.version||ticketDecision(s)!=='Permit'))return s;
   const state=id==='grant'?{...s,version:s.version+1}:s;
   const result=record(state,id,stations[current.station][0],current.reply,id==='commit'?'Committed':'Recorded');
   return {...result,index:s.index+1,credentialVersion:id==='ticketCredential'?s.version:s.credentialVersion,
    permit:id==='permit'?s.version:s.permit,ticket:id==='commit'?'MT-204':s.ticket};
  }
  const item=available(s).find(entry=>entry.id===id);
  if(!item)return s;
  const points=s.activeChecks.includes(id)?0:item.points;
  const result=record(s,id,item.owner,item.reply,id==='duplicate'?'Prior receipt':'Control checked',points);
  const risk=s.risk+points;
  if(risk<4)return {...result,risk,activeChecks:[...new Set([...s.activeChecks,id])]};
  // A previous-generation connector credential and early permit cannot survive recovery.
  const index=(!s.ticket&&reached(s,'ticketCredential'))?stages.resist.steps.findIndex(item=>item.id==='ticketCredential'):s.index;
  return {...result,index,risk,room:'security',credentialVersion:null,permit:null,incident:{confirmed:[],reviewed:false,trigger:id}};
 }
 function restore(stage,value){
  if(value?.stage!==stage||!Array.isArray(value.events))return fresh(stage);
  let state=fresh(stage);
  for(const event of value.events){
   const room=event?.id==='timeout-resource'?'resources':next(state)?.id===event?.id?next(state).room:
    checks[stage].find(item=>item.id===event?.id)?.room;
   if(!room)continue;
   state=act(visit(state,room),event.id);
  }
  return visit(state,value.room);
 }
 function mission(s){
  if(s.stage==='unknown'||!reached(s,s.stage==='build'?'scope':'register'))return null;
  const resource=['authorize','resist'].includes(s.stage);
  return {
   id:resource?'M-204':'M-101',
   status:s.incident?'Suspended':reached(s,'close')?'Closed':'Active',
   version:s.version,
   scope:!resource?'Public documents and internal report only':s.stage==='authorize'&&!reached(s,'grant')?'Approved documentation only':
    s.stage==='authorize'?'RE-204 operational event window and read-only incident view':'RE-204 reads, package-only delegation and one internal maintenance ticket',
   subject:s.stage==='resist'?'Accountable Operations owner · standing organizational authority':s.stage==='build'?'Verified railway Operations employee':'Railway Operations Manager',
   memory:resource?'M-204 isolated workspace':'M-101 isolated workspace'
  };
 }
 return {scenes,stages,stations,checks,controllers,ticketRequest,ticketDecision,fresh,visit,reached,next,complete,available,act,restore,mission};
})();
if(typeof module!=='undefined')module.exports=NovaRailway;
