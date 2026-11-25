/* Offline railway security simulation. All requests, data and receipts are fictional. */
const NovaRailway=(()=>{
 const scenes={external:'Intake & delivery',runtime:'Agent runtime',resources:'Enterprise resources',security:'Security control plane'};
 const workOrder={id:'WO-204',asset:'RE-204',owner:'Maya Chen · Railway Operations',agent:'agent:nova'};
 const independentRead={asset:'RE-105',missionId:'M-105'};
 const eventsAudience='urn:railway:events';
 const missionIds={build:'M-101',authorize:'M-204',resist:'M-304'};
 const records={
  crm:[['C-438','Passenger service case','Restricted customer record'],['F-112','Compensation ledger','Confidential financial record']],
  kafka:[['EV-204-01','08:41','RE-204','Door D3 fails to confirm closed'],['EV-204-02','08:43','RE-204','Departure held · +7 minutes']],
  database:[['INC-117','RE-204','Intermittent door-position sensor','Connector inspection cleared the fault']],
  astra:[['KB-042','Door interlock troubleshooting','Isolate the door and inspect sensor alignment'],['KB-105','RE-105 scheduled service','Documentation only · separate mission M-105']]
 };
 const step=(id,room,station,label,reply)=>({id,room,station,label,reply});
 const stages={
  unknown:{title:'Stage 0 · Unknown',tag:'UNKNOWN',start:'external',summary:'Discover an unmanaged agent, trace what it reached and verify containment.',ending:'The discovered routes are closed. An unmanaged copy outside monitored infrastructure would still be a visibility gap.',steps:[
   step('accept','external','intake','Inspect the unverified request','An unknown sender quotes WO-204, the work order for the RE-204 door fault, and asks for the customer list. The unmanaged copy of Nova accepts it. Quoting a real work order gives the sender no authority.'),
   step('runtime','runtime','sandbox','Inspect the unmanaged workstation','Nova runs in a local container with broad network and tool access. A new tool appears without review. The tool inventory and deployment are unknown to the platform team.'),
   step('usage','runtime','model','Read the model usage warning','The external model meter shows repeated calls with little progress. A warning is displayed, and calls continue. There is no enforced mission budget.'),
   step('credential','runtime','vault','Inspect the Vault Radar finding','Vault Radar flags an exposed employee credential in a scanned artifact. The finding records a reference with the value masked. The workstation log separately shows the employee account being used.'),
   step('crm','resources','crm','Review the CRM access receipt','The CRM recorded the employee account and returned fictional customer and financial data. Its logs could not distinguish Nova from that employee.'),
   step('kafka','resources','kafka','Review the Kafka access receipt','The Kafka access log shows another identity reading the passenger payment stream. Its broker permissions allowed the read, even though no one had authorized Nova to use the data.'),
   step('artifact','runtime','artifact','Inspect the report staged for external sharing','A local artifact combines the CRM and stream results. Transfer was queued. Investigators still need destination and network evidence to determine whether any data left.'),
   step('discover','security','soc','Correlate the discovery findings','IBM Identity Protection observes an unmanaged client reaching the CRM on a monitored route. Endpoint and CRM logs help Security Operations link it to Nova. Vault Radar found the exposed secret separately. Activity on routes without connected sensors remains unknown.'),
   step('contain','security','soc','Contain the discovered workload','The endpoint owner stops the process, service owners revoke exposed credentials, CRM closes the affected session, Kafka removes the affected access, and the workspace and report enter quarantine. The network owner blocks the identified destination.'),
   step('verify','resources','crm','Retest the old resource route','CRM and Kafka now refuse the old identities. The file-sharing service reports no completed upload to the destination investigators checked. The SOC leaves other routes open for investigation.')
  ]},
  build:{title:'Stage 1 · Build',tag:'BUILD',start:'security',summary:'Register Nova, verify its runtime and finish a public-research mission.',ending:'The approved public report was delivered. The task credentials and approved routes were closed.',steps:[
   step('register','security','identity','Register Nova and its accountable owner','IBM Agent Identity registers agent:nova with Maya Chen in Railway Operations as its owner. The Vault Agent Registry has a separately mapped entity and policies. The agent record, workload identity and execution have different identifiers.'),
   step('provision','runtime','sandbox','Inspect the managed OpenShift runtime','A platform deployment provisions the approved image and restricted OpenShell sandbox. OpenShift hosts the workload. Terraform and image and cluster checks are deployment controls. OpenShell limits the workload’s filesystem, process and network access.'),
   step('bootstrap','security','admission','Verify workload identity and runtime posture','Red Hat ZTWIM manages SPIRE for SPIFFE workload identities. A customer admission service checks the workload identity, the link to Nova’s record and current deployment posture before allowing credential issuance. These are distinct checks.'),
   step('provider','security','vault','Prepare the approved model connection','The trusted model-provider integration can obtain the approved credential through Vault. The model key stays on the mediated path. Nova needs an active mission before using the Granite endpoint.'),
   step('request','external','intake','Read the verified operations request','Maya signs in with Microsoft Entra ID to request a preliminary brief for WO-204. The mission authority verifies her role. M-101 permits public research about possible door faults and an internal report.'),
   step('scope','security','mission','Activate the public-only mission','The mission authority approves the public brief for WO-204. IBM Agent Identity records the configured delegation from Maya to Nova. M-101 grants public research and an internal report. Private data and internal operational tools are outside scope.'),
   step('research','runtime','gateway','Research through the approved MCP gateway','Nova retrieves public railway documentation through the approved research tool. The gateway filters the tool route, and only M-101 can write to its mission memory.'),
   step('budget','runtime','model','Check the model budget','The gateway blocks further model calls when the budget runs out. Nova already saved the findings and citations. It can finish the report with the approved template.'),
   step('internal','resources','database','Request internal incident data','OpenShell prevents direct access from the sandbox. The approved connector also denies the request because M-101 permits public research only. The two controls evaluate different things.'),
   step('draft','runtime','artifact','Assemble the report from saved notes','The report workspace fills the approved template with Nova’s saved findings and citations. Operations can now review a short public-source brief on door faults for WO-204. The model stays blocked and the budget stays exhausted.'),
   step('approve','security','review','Ask a human to approve this exact copy','A configured IBM Verify CIBA flow can authenticate the operations reviewer on a separate device. The customer application records the reviewer’s decision and binds it to the exact report digest, operation and internal recipient.'),
   step('deliver','external','delivery','Release the approved report','The delivery service checks the actual copy and destination. It releases the report to Operations and records delivery.'),
   step('close','security','mission','Close the research mission','The registry closes M-101. The credential and resource owners close mission-specific access. An existing general employee sign-in is separate.')
  ]},
  authorize:{title:'Stage 2 · Authorize',tag:'AUTHORIZE',start:'external',summary:'Investigate RE-204, request new resources and keep two missions separate.',ending:'RE-204’s report was delivered and M-204 access closed. M-105’s separate documentation grant still works.',steps:[
   step('request','external','intake','Read the RE-204 investigation request','After the public brief, Maya signs in with Entra ID and asks Nova to investigate the RE-204 door fault under WO-204. Payment access and production changes are excluded.'),
   step('register','security','mission','Register mission M-204','M-204 starts with approved operational documents. The customer mission service records the manager’s bounded delegation, recipient, expiration and budget. Configured OAuth token exchange can carry the human subject and Nova’s actor identity to the appropriate audience.'),
   step('research','runtime','memory','Search approved documentation','The retrieval service filters Astra DB results by collection and document policy. Nova records sources and classifications in M-204 memory. The notes suggest Nova needs current events and historical incidents.'),
   step('requestAccess','runtime','gateway','Request bounded events and historical data','Nova asks to read the RE-204 event window and approved incident history. Its rationale is supporting data. The gateway supplies the observed request and trusted identity and runtime context.'),
   step('grant','security','policy','Decide the exact expansion','The customer PDP evaluates the actor, delegating manager, active mission version, resource, operation, train, time window and classification. It approves only the investigation reads. Vault independently checks access to a credential.'),
   step('lease','security','vault','Issue a short-lived read-only lease','Vault checks a separate token intended for Vault. It intersects the human baseline, Nova’s ceiling and the Vault-specific authorization details. The trusted connector gets a 15-minute read-only database lease. Nova never receives the database password.'),
   step('events','resources','kafka','Read RE-204 through the OAuth API','The Railway Events API validates the Entra delegated token for its own audience, then checks the approved train and time window. Confluent checks the broker’s backing access separately. The API returns a door warning and delay.'),
   step('history','resources','database','Read incident history through Vault','The trusted connector uses the short-lived Vault credential over the configured connection. The incident service checks the actual train and PostgreSQL limits access to its permitted view. The result is a matching earlier door fault.'),
   step('second','security','mission','Register the separate RE-105 research mission','M-105 has its own read grant and memory namespace for RE-105 documentation. The same logical agent and runtime can hold separately checked mission contexts.'),
   step('separate','runtime','memory','Test the RE-204 grant under M-105','The receiving policy check refuses the mission mismatch. M-105 retains its own documentation permission. M-204 notes and credentials stay inside their scope.'),
   step('draft','runtime','artifact','Write the RE-204 incident report','The report puts the door warning next to the delay and compares both with earlier incidents. Nova recommends an inspection and cites the event, the PostgreSQL incident view and the maintenance notes. M-105 contributes no data.'),
   step('approve','security','review','Approve the exact incident report','The Operations Manager approves this version and the internal destination. The delivery service will compare the actual artifact and recipient again.'),
   step('deliver','external','delivery','Deliver the approved RE-204 report','The Operations Manager receives the approved copy in the company’s own report inbox. The receipt links the mission and artifact version.'),
   step('close','security','vault','Close M-204 and revoke its access','The mission closes, its revocable Vault lease is retired, and the database service verifies the old route. M-105 keeps its own grant.'),
   step('remaining','resources','astra','Verify the unrelated mission still works','The RE-105 documentation query succeeds under M-105’s separate context. The old M-204 grant cannot open it.')
  ]},
  resist:{title:'Stage 3 · Resist',tag:'RESIST',start:'resources',summary:'Investigate an event-triggered incident, delegate to Mira and authorize an exact maintenance ticket.',ending:'The maintenance ticket and approved report are recorded. Task access has ended. Confirmed effects remain in the record.',steps:[
   step('event','resources','kafka','Inspect the RE-204 disruption event','A fresh door warning arrives on WO-204. Confluent carries the events and Flink correlates them. The signal is evidence for the mission authority.'),
   step('register','security','mission','Start a new investigation under standing policy',`The mission service validates the event and starts ${missionIds.resist} for WO-204 under Maya’s standing Operations authority. It grants routine reads for this incident on RE-204. The earlier ${missionIds.authorize} permissions stay closed. M-105 retains its separate documentation grant. Safety-critical controls, customer compensation and unrelated data are outside the new grant.`),
   step('plan','runtime','sandbox','Investigate within the approved runtime','Nova checks the scoped door events through the Railway Events API and compares them with the earlier report and approved maintenance notes. It proposes sending that evidence to Mira for a second opinion.'),
   step('delegate','security','policy','Authorize Mira’s exact sub-mission',`The customer mission service verifies delegation is allowed and issues a package-only analysis task tied to ${missionIds.resist}. Mira authenticates with its own workload identity and does not inherit Nova’s credentials. Both are charged to the parent mission budget.`),
   step('mira','runtime','mira','Receive Mira’s bounded analysis','Mira returns a likely door-sensor fault with references to the approved technical package. A2A carries the result. The child grant closes, and both agents have used the shared model budget. The evidence supports an internal maintenance ticket.'),
   step('ticketCredential','security','vault','Authorize the maintenance connector credential','Vault independently authorizes the trusted maintenance connector to obtain scoped access. Nova never receives the raw credential. The receiving maintenance system still needs to authorize the actual ticket request.'),
   step('permit','resources','maintenance','Preview the maintenance request','The maintenance PEP observes Nova’s actual tool, asset RE-204, priority High and Railway Maintenance destination. Mission policy permits the exact request. The tool preview has created no ticket.'),
   step('commit','resources','maintenance','Commit one internal maintenance ticket','The receiving service checks the current mission and observes the exact arguments again before committing. It records ticket MT-204 and the operation identifier. Credential authorization and the live business decision remain independent.'),
   step('draft','runtime','artifact','Assemble the incident report and ticket receipt','Nova records which data it used, Mira’s contribution and the actual ticket identifier. No external or safety-critical change was performed.'),
   step('approve','security','review','Approve the exact internal report','The reviewer approves this copy for the Operations Manager. The approval names the current mission version. Delivery will check the copy, the inbox and that the approval is still current.'),
   step('deliver','external','delivery','Deliver the internal report to Operations','The delivery service matches the approved copy to the manager’s internal inbox. The report arrives there, and the service records the delivery receipt.'),
   step('risk-signal','security','soc','Review the identity risk signal','IBM Identity Protection flags unusual access activity from the managed agent on a monitored route. Security Operations checks the source evidence, and the configured customer response policy authorizes suspension of M-304 only.'),
   step('close','security','mission','Close the mission and delegated access','The customer mission service closes M-304, Vault revokes the supported maintenance lease, and the runtime owner requests shutdown of the affected session. The already committed ticket remains. Verify that the protected routes now refuse the old authority.'),
   step('verify-retired','resources','maintenance','Retry the old authority at both resources','The Railway Events API refuses the old mission context, and the maintenance service refuses an uncommitted write under the retired grant. No new ticket is created.'),
   step('verify-unrelated','resources','astra','Check that M-105 still works','Documentation search returns RE-105 under its separate active M-105 grant. This is a resource result under M-105, independent of the closure of M-304.')
  ]}
 };
 const stations={
  intake:['Work intake','External gateway','Checks who is making a request and sends verified scope to the mission authority.'],
  delivery:['Report delivery','Resource-side PEP','Checks the actual artifact and its recipient at release. A delivery receipt records a completed effect.'],
  externalSource:['External services','Public research and untrusted destinations','Public information and outside services have separate trust and visibility boundaries. A source can provide evidence without authorizing an action.'],
  sandbox:['Runtime console','NVIDIA OpenShell · Red Hat OpenShift','OpenShift hosts the workload. OpenShell constrains the configured sandbox. Optional NVIDIA Sentry can add out-of-band controls in supported hardware deployments. Runtime reachability and business permission are separate.'],
  model:['Model gateway','Granite · configured model gateway','Mediates access to the named model and applies configured usage and input limits.'],
  gateway:['MCP gateway','agentgateway · configured MCP route','Checks the approved tool route. Tool-name authorization and argument inspection are distinct controls.'],
  memory:['Working memory','Mission-scoped store · Astra DB example','The application controls which mission can read or write each namespace. Stored text is evidence rather than policy.'],
  mira:['Mira · specialist agent','A2A · optional watsonx Orchestrate','Mira authenticates independently and receives only the inputs and actions defined in the linked mission.'],
  artifact:['Report workspace','Governed artifact store','Tracks source lineage and retained copies. Delivery still requires an exact approval.'],
  crm:['Customer CRM','Separate application and session controller','Customer records and payments belong to the resource owner. The CRM decides access and owns the session state.'],
  kafka:['Operational event streams','Confluent Kafka · Flink correlation','Kafka checks topic and operation access. The access service applies train and time-window filters. Flink correlates configured event streams.'],
  flink:['Event correlation','Apache Flink on Confluent','Correlation creates a candidate signal from configured records. The mission authority verifies the source and standing authority before issuing a grant.'],
  database:['Incident history','PostgreSQL · Vault · optional Boundary','Vault leases credentials. Boundary controls connectivity. The database and access service enforce views and record scope.'],
  astra:['Documentation search','DataStax Astra DB','The retrieval service vets the mission and applies collection and document filters before returning results.'],
  maintenance:['Maintenance system','MCP tool · trusted resource PEP','The maintenance system owns the real ticket arguments, live commitment decision and idempotency record.'],
  identity:['Agent identity registry','IBM Agent Identity · Microsoft Entra ID','Entra signs in the workforce user. IBM Agent Identity records the logical agent, accountable owner and configured delegation. Runtime admission is separate.'],
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
   probe('egress','runtime','Test an unapproved model destination','OpenShell supervisor','The configured egress policy blocks the test connection. The model gateway still checks the mission budget on the approved route.'),
   probe('install','runtime','Request an unapproved tool install','Runtime and deployment policy','The runtime blocks the install. The tool inventory still shows the approved research tool.'),
   probe('failed-posture','security','Test a registered agent with failed posture','Admission service','Registration and workload identity still resolve. The new posture check fails, so no service credential is issued.')
  ],
  authorize:[
   probe('pay-topic','resources','Test a payment-topic request','Kafka broker','The test principal cannot consume from the payment topic. The operational grant is unaffected.'),
   probe('control-topic','resources','Test a write to the control stream','Kafka broker','Kafka refuses to publish the message. The mission’s access is read-only.'),
   probe('wrong-collection','resources','Test a customer collection lookup','Astra retrieval service','M-204 can search approved documentation. The retrieval service refuses the customer collection before returning any results.'),
   probe('old-lease','security','Retest the closed RE-204 lease','Vault and database access service','The old lease and the M-204 resource route fail the retest. M-105 still has its own scope.')
  ],
  resist:[
   probe('injection','runtime','Test the document’s request for payment records','Mission PDP and resource PEP','The document claims the manager requested payment data. The active mission contains no such authority. The read is blocked and the source is flagged.',1),
   probe('tool-update','runtime','Inspect a changed MCP tool inventory','MCP gateway and platform team','The configured allowlist refuses the newly exposed tool. The platform team quarantines the tool version pending review.',1),
   probe('replay','external','Test a copied credential from a different runtime','Receiving service','The request arrived from a different runtime. The receiving service checks the credential’s sender binding and refuses it. An ordinary bearer token could still be replayed while valid.',2),
   probe('tamper','runtime','Test a runtime that fails the current posture check','OpenShell and admission service','Runtime controls refuse the prohibited write. The admission service withholds credentials from a runtime that fails posture verification.',3),
   probe('issuer','external','Test a valid credential with insufficient issuer authority','Mission authority','The credential verifies as a credential for the Operations role. The mission request asks for financial records outside that role. No mission is created.',1),
   probe('poison','runtime','Inspect a poisoned memory entry','Report delivery and SOC','Memory claims that future reports should go outside the company. The delivery PEP refuses the destination. The affected entry is held for review while verified sources are retained.',2),
   probe('deputy','runtime','Test whether Mira can fetch payment data for Nova','Mira’s receiving PEP','The parent scope and linked task only allow analysis of the technical package. Mira’s unrelated access cannot satisfy this request.',2),
   probe('disclosure','runtime','Test a classified model payload','Model gateway and DLP policy','The proposed prompt includes classified passenger data. The model gateway stops it before it reaches the provider. Nova can continue with approved public or sanitized inputs.',4),
   probe('parameters','resources','Compare out-of-scope maintenance operations','Maintenance system','The maintenance system refuses the ticket for RE-999. It also refuses to close another incident, change production settings, or issue compensation. This mission can only create the approved ticket for RE-204.',1),
   probe('approval','external','Test a report changed after approval','Report delivery PEP','The report came back with a last-minute edit. The delivery service detects a different digest and holds the edited copy. A reviewer must approve that exact copy and destination. The original approved copy is still ready to send.',1),
   probe('race','resources','Suspend the mission between permit and commit','Maintenance system and SOC','The old permit is rejected when the resource checks the live mission at commit. No ticket is created by this attempt. The same request will need a fresh decision after recovery.',4),
   probe('budget','runtime','Test more calls through Mira after the shared limit','Shared mission budget service','Nova and Mira already spent the parent mission allocation. Both requests are denied. A new helper task does not create more budget.'),
   probe('admin','security','Test an overbroad administrator grant','Customer policy administration service','The delegated admin session verifies. Its role cannot authorize unrestricted CRM access. The request and grant refusal are recorded.',2),
   probe('outage','security','Test a new protected operation during PDP outage','Credential broker','The new protected request fails closed. No administrative password fallback is available. Any existing lease remains usable only under an explicitly authorized bounded offline policy.'),
   probe('audit','security','Test removing local evidence','Protected audit store','Independent OpenTelemetry, Vault and resource records remain available in the protected store. The local delete attempt is recorded separately.',2),
   probe('stream','resources','Test an unauthorized stream destination','Kafka broker and connector policy','Kafka refuses the write. The connector separately refuses the destination. No event is exported.',4),
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
 const fresh=stage=>({stage,room:stages[stage].start,index:0,version:1,generation:1,risk:0,activeChecks:[],events:[],incident:null,
  credentialVersion:null,databaseLease:null,childGrant:null,budgetUsed:0,permit:null,artifactRevision:0,
  approval:null,approvalVersion:null,deliveryReceipt:null,ticket:null,admission:stage==='build'?'Pending':null,reply:null});
 const sharedBudget=50000;
 const reportRequest=s=>({
  missionId:missionIds[s.stage],operation:'deliver',recipient:'Railway Operations',
  digest:s.artifactRevision?`SIM-${missionIds[s.stage]}-REPORT-${s.artifactRevision}`:null
 });
 function deliveryDecision(s,request=reportRequest(s)){
  if(s.incident||reached(s,'close'))return 'Mission unavailable';
  if(s.deliveryReceipt)return 'Prior receipt';
  if(!s.approval||s.approval.version!==s.version||s.approval.generation!==s.generation)return 'Approval required';
  const expected=reportRequest(s);
  const fields=Object.keys(expected);
  return Object.keys(request).length===fields.length&&fields.every(field=>
   request[field]===expected[field]&&request[field]===s.approval.request[field])?'Permit':'Approval mismatch';
 }
 const ticketRequest={operation:'createMaintenanceTicket',missionId:missionIds.resist,asset:'RE-204',priority:'High',team:'Railway Maintenance',operationId:'OP-204-TICKET-1'};
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
 function runtimeStatus(s){
  if(s.incident)return s.incident.confirmed.includes('runtime')?'Stopped and verified':'Stop requested · awaiting confirmation';
  if(s.stage==='unknown'&&reached(s,'contain'))return 'Stopped';
  if(s.stage==='resist'&&reached(s,'close'))return 'Runtime stop not independently checked';
  return null;
 }
 function resourceRead(s,resource,request={}){
  const {stage}=s;
  const {asset='RE-204',missionId=missionIds[stage],operation='read'}=request;
  const deny=reason=>({status:'Denied',reason,rows:[]});
  const permit=(reason,rows)=>({status:'Allowed',reason,rows});
  const independent=stage==='authorize'&&reached(s,'second')||stage==='resist'&&reached(s,'register');
  if(missionId===independentRead.missionId&&independent){
   return resource==='astra'&&asset===independentRead.asset&&operation==='read'?
    permit('M-105 has its own documentation grant.',[records.astra[1]]):
    deny('M-105 cannot use the RE-204 grant or evidence.');
  }
  if(s.incident)return deny('The resource refuses the suspended mission.');
  if(operation!=='read')return deny('This route has no write permission.');
  if(stage==='unknown'){
   if(!['crm','kafka'].includes(resource))return deny('The workstation has no known route to this resource.');
   if(reached(s,'contain'))return deny('The affected session and stream access were revoked.');
   const observed=reached(s,resource);
   if(!observed)return deny('No matching access receipt has been collected.');
   return permit('Historical receipt · the resource accepted an inherited identity.',resource==='crm'?records.crm:
    [['PAY-204-31','Passenger payments topic','Read observed in broker audit']]);
  }
  if(resource==='crm')return deny('This mission grants no customer or financial data access.');
  if(missionId!==missionIds[stage]||asset!=='RE-204')return deny('The actual request is outside this mission and asset scope.');
  if(reached(s,'close'))return deny('The mission is closed. Its old authorization cannot be reused.');
  if(stage==='build')return deny('M-101 grants public research only. Enterprise resources are outside its scope.');
  if(resource==='astra'&&reached(s,'register'))return permit('Governed retrieval returned one in-scope document.',[records.astra[0]]);
  if(resource==='kafka'&&(stage==='authorize'&&reached(s,'grant')||stage==='resist'&&reached(s,'register'))){
   if(request.window&&request.window!=='08:40–09:00')return deny('The access service refused the time window. Topic access is still intact.');
   return permit('The broker allowed the topic read. The resource returned only rows in the approved asset and window.',records.kafka);
  }
  if(resource==='database'){
   if(s.databaseLease?.status!=='Active')return deny('The database connector has no active, in-scope lease.');
   return permit('The incident service applied the mission scope and read-only view.',records.database);
  }
  return deny('No current permission covers this resource.');
 }
 // Illustrative claims only. The simulation never creates or validates real OAuth tokens.
 function eventsGrant(s){
  return {issuer:'Microsoft Entra ID',audience:eventsAudience,subject:s.stage==='resist'?'agent:nova':'user:maya',
   actor:workOrder.agent,scope:'events.read',missionId:missionIds[s.stage],version:s.version,generation:s.generation};
 }
 function routeRead(s,route,request={},grant=eventsGrant(s)){
  if(route==='oauth'){
   const required=eventsGrant(s);
   if(Object.keys(required).some(key=>grant?.[key]!==required[key])){
    return {status:'Denied',reason:'The Railway Events API refuses this token context.',rows:[]};
   }
   return resourceRead(s,'kafka',request);
  }
  return resourceRead(s,'database',request);
 }
 function available(s,replaying=false){
  if(s.incident)return [];
  return checks[s.stage].filter(item=>{
   if(item.id==='blind')return reached(s,'verify');
   if(s.stage==='build')return reached(s,'bootstrap')&&(replaying||!reached(s,'close')&&
    (item.id!=='failed-posture'||s.admission==='Verified'&&!reached(s,'provider')));
   if(s.stage==='authorize')return item.id==='old-lease'?reached(s,'close'):reached(s,'lease')&&!reached(s,'close');
   if(item.id==='duplicate')return !!s.ticket&&!reached(s,'close');
   if(item.id==='race')return s.permit===s.version&&!s.ticket;
   if(!replaying&&item.id==='approval')return reached(s,'approve')&&!reached(s,'deliver');
   if(!replaying&&item.id==='budget')return reached(s,'mira')&&!reached(s,'close');
   if(!replaying&&item.id==='deputy')return reached(s,'delegate')&&!reached(s,'close');
   return reached(s,'plan')&&!reached(s,'close');
  }).filter(item=>item.room===s.room);
 }
 function next(s){
  if(!s.incident){
   const current=normalNext(s);
   if(current?.id==='provider'&&s.admission==='Failed'){
    return step('restore-posture','security','admission','Restore and verify a fresh runtime','');
   }
   if(current?.id==='history'&&s.databaseLease?.status==='Expired'){
    return step('renew-lease','security','vault','Request a fresh read-only lease','');
   }
   if(current?.id==='deliver'&&deliveryDecision(s)!=='Permit'){
    return step('reapprove','security','review','Ask for approval of this exact copy','');
   }
   return current;
  }
  const pending=controllers.find(([id])=>!s.incident.confirmed.includes(id));
  if(pending){
   const [id,room,name]=pending;
   return step('ack-'+id,room,'soc','Verify '+name,'');
  }
  if(!s.incident.reviewed)return step('investigate','security','soc','Reconstruct the incident','');
  return step('recover','security','admission','Reauthorize a fresh runtime','');
 }
 function record(s,id,owner,reply,decision,points=0,details={}){
  const context=mission(s);
  const event={id,owner,decision,points,environment:s.room,version:s.version,runtime:s.generation,workOrderId:workOrder.id,
   missionId:context?.id??null,missionVersion:context?.version??null,subject:context?.subject??null,
   resource:owner,action:id,decisionSource:null,enforcer:null,...details};
  return {...s,reply:{owner,reply},events:[...s.events,event]};
 }
 function act(s,id,replaying=false){
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
  if(id==='flag-source'&&s.room==='runtime'&&s.stage==='resist'&&reached(s,'plan')&&!reached(s,'close')){
   if(s.events.some(event=>event.id===id))return s;
   return record(s,id,'Security operations','Operations holds the instruction for review. Nova can keep the verified door-system notes and finish its investigation.','Reported');
  }
  if(s.stage==='resist'&&reached(s,'approve')&&!reached(s,'deliver')){
   if(s.room==='runtime'&&id==='edit-report'&&s.artifactRevision===1){
    return {...record(s,id,'Report workspace','The edited conclusion is saved as revision 2. The previous approval still names revision 1.','Edited'),artifactRevision:2};
   }
   if(s.room==='runtime'&&id==='restore-report'&&s.artifactRevision===2){
    return {...record(s,id,'Report workspace','Nova selects the original report for delivery again. The service will check the approval for that revision.','Selected'),artifactRevision:1};
   }
   if(s.room==='external'&&id==='try-delivery'&&deliveryDecision(s)!=='Permit'){
    return record(s,id,'Report delivery','The delivery service compared this report with the approval and held the copy. Nothing was sent.','Denied');
   }
  }
  if(current?.id==='reapprove'&&id==='reapprove'&&s.room==='security'){
   return {...record(s,id,'Output approval','The reviewer approved this exact revision for the internal Operations inbox.','Approved'),
    approvalVersion:s.version,approval:{version:s.version,generation:s.generation,request:reportRequest(s)}};
  }
  if(current?.id==='restore-posture'&&id==='restore-posture'&&s.room==='security'){
   return record({...s,generation:s.generation+1,admission:'Verified'},id,'Runtime admission',
    'The platform team restores the approved deployment and verifies identity and posture for a fresh generation. The failed runtime received no service credential.','Verified');
  }
  if(s.stage==='authorize'&&s.room==='security'&&reached(s,'lease')&&!reached(s,'history')){
   if(id==='expire-lease'&&s.databaseLease?.status==='Active'){
    return {...record(s,id,'Vault and database connector','The simulated lease expires. The PostgreSQL connector cannot use it for a new read. The separate Kafka grant remains available.','Expired'),
     databaseLease:{...s.databaseLease,status:'Expired'}};
   }
   if(current?.id==='renew-lease'&&id==='renew-lease'){
    return {...record(s,id,'Vault','Vault independently approves a new read-only lease under the same current mission scope. The original lease remains retired.','Issued'),
     databaseLease:{id:'DB-M204-'+(s.databaseLease.generation+1),generation:s.databaseLease.generation+1,status:'Active'}};
   }
  }
  if(s.stage==='authorize'&&s.room==='resources'&&id==='try-other-train'&&reached(s,'events')&&
     !reached(s,'close')&&!s.events.some(event=>event.id===id)){
   const request={asset:'RE-999'};
   const result=routeRead(s,'oauth',request);
   if(result.status!=='Denied')return s;
   return record(s,id,'Railway Events API','The token is valid for this API. Changing the train to RE-999 exceeds the mission. The API returned no records.',result.status,0,
    {resource:'railway-events/RE-999',action:'read',decisionSource:'Customer mission policy',enforcer:'Railway Events API',rows:result.rows.length});
  }
  if(current?.room===s.room&&current.id===id){
   if(id==='permit'&&ticketDecision(s)!=='Permit')return s;
   if(id==='commit'&&(s.permit!==s.version||ticketDecision(s)!=='Permit'))return s;
   if(id==='deliver'&&deliveryDecision(s)!=='Permit')return s;
   if(id==='provider'&&s.admission!=='Verified')return s;
   if(id==='mira'&&(s.childGrant?.status!=='Active'||s.childGrant.version!==s.version))return s;
   const route={events:'oauth',plan:'oauth',history:'database'}[id];
   const read=route?routeRead(s,route):['remaining','verify-unrelated'].includes(id)?resourceRead(s,'astra',independentRead):null;
   if(read&&read.status!=='Allowed')return s;
   let retiredChecks;
   if(id==='verify-retired'){
    const old=s.events.findLast(event=>event.id==='close');
    const api=routeRead(s,'oauth',{},old?.grant);
    const maintenance=ticketDecision(s,{...ticketRequest,operationId:'OP-204-UNCOMMITTED'});
    if(!old||api.status!=='Denied'||maintenance!=='Mission unavailable')return s;
    retiredChecks=[['Railway Events API',api.status],['Maintenance API','Denied']];
   }
   const state=id==='grant'?{...s,version:s.version+1}:s;
   const owner=stations[current.station][0];
   const outcome={
    grant:['Approved',{decisionSource:owner,action:'amend-mission'}],
    register:s.stage==='build'?['Registered',{resource:workOrder.agent,action:'register-agent',
     decisionSource:'Railway Operations',enforcer:'IBM Agent Identity'}]:['Recorded',{}],
    events:['Allowed',{resource:'railway-events/RE-204',action:'read',decisionSource:'Customer mission policy',enforcer:'Railway Events API',
     audience:eventsAudience,rows:read?.rows.length}],
    history:['Allowed',{resource:'incident-history/RE-204',action:'read',decisionSource:'Customer mission policy',enforcer:'Incident history service and PostgreSQL',rows:read?.rows.length}],
    plan:['Allowed',{resource:'railway-events/RE-204',action:'read',decisionSource:'Customer standing policy',enforcer:'Railway Events API',rows:read?.rows.length}],
    internal:['Denied',{resource:'incident-history',action:'read',enforcer:'OpenShell and approved connector'}],
    remaining:['Allowed',{resource:'documentation/RE-105',action:'read',missionId:independentRead.missionId,missionVersion:1,subject:null,
     enforcer:'Documentation search'}],
    discover:['Observed',{resource:'Customer CRM',action:'observe',decisionSource:'IBM Identity Protection'}],
    credential:['Found',{resource:'Scanned workspace artifact',action:'detect-exposed-secret',decisionSource:'Vault Radar'}],
    scope:['Approved',{missionId:missionIds.build,missionVersion:1,subject:workOrder.owner,decisionSource:'Customer mission authority',enforcer:'IBM Agent Identity delegation',
     agentId:workOrder.agent,workloadId:'spiffe://railway.example/nova/build',executionId:missionIds.build+'/run-'+s.generation}],
    lease:['Issued',{resource:'incident-history/RE-204',action:'issue-read-only-lease',decisionSource:'Vault',enforcer:'Vault',leaseId:'DB-M204-1',ttlMinutes:15}],
    'risk-signal':['Observed',{resource:'Monitored access route',action:'review-risk-signal',decisionSource:'IBM Identity Protection',grant:eventsGrant(s)}],
    close:s.stage==='resist'?['Revoked',{resource:'M-304 routes',action:'close-mission-and-revoke',decisionSource:'Customer response policy',
     enforcer:'Mission service and Vault',grant:eventsGrant(s)}]:['Recorded',{}],
    'verify-retired':['Denied',{resource:'Railway Events API and Maintenance API',action:'retry-retired-authority',
     decisionSource:'Current mission state',enforcer:'Railway Events API and Maintenance API',rows:0,resourceChecks:retiredChecks}],
    'verify-unrelated':['Allowed',{resource:'documentation/RE-105',action:'read',missionId:independentRead.missionId,
     missionVersion:1,subject:null,decisionSource:'Independent M-105 grant',enforcer:'Documentation search',rows:read?.rows.length}],
    commit:['Committed',{resource:'maintenance/RE-204',action:'create-maintenance-ticket',enforcer:owner}],
    deliver:['Delivered',{resource:'report-delivery',action:'deliver',enforcer:owner}]
   }[id]??['Recorded',{}];
   const result=record(state,id,owner,current.reply,outcome[0],0,outcome[1]);
   return {...result,index:s.index+1,admission:id==='bootstrap'?'Verified':s.admission,
    credentialVersion:id==='ticketCredential'?s.version:id==='close'?null:s.credentialVersion,
    permit:id==='permit'?s.version:id==='close'?null:s.permit,artifactRevision:id==='draft'?1:s.artifactRevision,
    databaseLease:id==='lease'?{id:'DB-M204-1',generation:1,status:'Active'}:
     id==='close'&&s.databaseLease?{...s.databaseLease,status:'Revoked'}:s.databaseLease,
    childGrant:id==='delegate'?{id:'M-304-MIRA-'+s.version,version:s.version,status:'Active',scope:'Technical package only'}:
     id==='mira'?{...s.childGrant,status:'Closed'}:s.childGrant,
    budgetUsed:id==='plan'?Math.max(s.budgetUsed,30000):id==='mira'?sharedBudget:s.budgetUsed,
    approvalVersion:id==='approve'?s.version:s.approvalVersion,
    approval:id==='approve'?{version:s.version,generation:s.generation,request:reportRequest(s)}:s.approval,
    deliveryReceipt:id==='deliver'?{...reportRequest(s),version:s.version}:s.deliveryReceipt,
    ticket:id==='commit'?'MT-204':s.ticket};
  }
  const item=available(s,replaying).find(entry=>entry.id===id);
  if(!item)return s;
  if(id==='failed-posture'&&!reached(s,'provider'))return record({...s,admission:'Failed'},id,item.owner,item.reply,'Denied');
  const points=s.activeChecks.includes(id)?0:item.points;
  const result=record(s,id,item.owner,item.reply,id==='duplicate'?'Prior receipt':'Control checked',points);
  const risk=s.risk+points;
  if(risk<4)return {...result,risk,activeChecks:[...new Set([...s.activeChecks,id])]};
  // A previous-generation connector credential and early permit cannot survive recovery.
  const redo=(!s.ticket&&reached(s,'ticketCredential'))?'ticketCredential':normalNext(s)?.id==='deliver'?'approve':
   s.childGrant?.status==='Active'?'delegate':null;
  const index=redo?stages.resist.steps.findIndex(item=>item.id===redo):s.index;
  const childGrant=s.childGrant?.status==='Active'?{...s.childGrant,status:'Suspended'}:s.childGrant;
  return {...result,index,risk,room:'security',childGrant,credentialVersion:null,permit:null,approval:null,approvalVersion:null,
   incident:{confirmed:[],reviewed:false,trigger:id}};
 }
 function restore(stage,value){
  if(value?.stage!==stage||!Array.isArray(value.events))return fresh(stage);
  let state=fresh(stage);
  const extraRooms={'timeout-resource':'resources','flag-source':'runtime','edit-report':'runtime','restore-report':'runtime','try-other-train':'resources',
   'try-delivery':'external','expire-lease':'security'};
  for(const event of value.events){
   // Preserve deliveries already recorded by releases that allowed delivery after recovery.
   const priorDelivery=event?.decision==='Historical receipt'||(!Object.hasOwn(value,'approvalVersion')&&event?.decision==='Recorded');
   if(priorDelivery&&event?.id==='deliver'&&next(state)?.id==='approve'&&state.events.some(item=>item.id==='approve')){
    const delivery=stages[stage].steps[state.index+1];
    const receipt=record(visit(state,delivery.room),'deliver','Report delivery','Operations already received the report. The previous delivery receipt is preserved.','Historical receipt');
    state={...receipt,index:state.index+2,deliveryReceipt:{...reportRequest(state),version:state.version}};
    continue;
   }
   // Earlier saves could record Mira's result after recovery without a distinct child regrant.
   if(!Object.hasOwn(value,'childGrant')&&event?.id==='mira'&&next(state)?.id==='delegate'&&state.childGrant?.status==='Suspended'){
    state=act(visit(state,'security'),'delegate',true);
   }
   if(!Object.hasOwn(value,'admission')&&event?.id==='provider'&&next(state)?.id==='restore-posture'){
    state=act(visit(state,'security'),'restore-posture',true);
   }
   // A completed older save has a closure receipt but predates the monitored risk step.
   if(stage==='resist'&&event?.id==='close'&&next(state)?.id==='risk-signal'){
    const historical=record(visit(state,'security'),'close','Mission registry',
     'The earlier playthrough closed M-304. Verify its retired access at the resources.','Historical receipt',0,
     {resource:'M-304 routes',action:'close-mission-and-revoke',grant:eventsGrant(state)});
    state={...historical,index:state.index+2,permit:null,credentialVersion:null};
    continue;
   }
   const room=extraRooms[event?.id]||(next(state)?.id===event?.id?next(state).room:
    checks[stage].find(item=>item.id===event?.id)?.room);
   if(!room)continue;
   state=act(visit(state,room),event.id,true);
  }
  return visit(state,value.room);
 }
 function mission(s){
  if(s.stage==='unknown'||!reached(s,s.stage==='build'?'scope':'register'))return null;
  const id=missionIds[s.stage];
  return {
   id,
   status:s.incident?'Suspended':reached(s,'close')?'Closed':'Active',
   version:s.version,
   scope:s.stage==='build'?'Public documents and internal report only':s.stage==='authorize'&&!reached(s,'grant')?'Approved documentation only':
    s.stage==='authorize'?'RE-204 operational event window and read-only incident view':'RE-204 event and documentation reads, package-only delegation and one internal maintenance ticket',
   subject:s.stage==='resist'?'Accountable Operations owner · standing organizational authority':workOrder.owner,
   memory:id+' isolated workspace'
  };
 }
 return {scenes,stages,stations,checks,controllers,workOrder,eventsGrant,ticketRequest,ticketDecision,resourceRead,routeRead,reportRequest,deliveryDecision,sharedBudget,
  fresh,visit,reached,next,complete,available,act,restore,mission,runtimeStatus};
})();
if(typeof module!=='undefined')module.exports=NovaRailway;
