/* Illustrative roles and request paths. Browsing these examples does not play either story. */
const ArchitectureReference = (() => {
 const groups = [
  ['People and authority', ['people','verify','iai','mission']],
  ['Where Nova works', ['orchestrate','openshell','vault']],
  ['Model and tool connections', ['aiGateway','mcpGateway','mcpTool']],
  ['Decisions and effects', ['policyContext','authorization','crm']],
  ['Signals and response', ['risk','antenna','controllers']]
 ];
 const components = {
  people:{
   name:'Priya, Nova, Morgan and Pip',kind:'Story actors',
   summary:'Priya sponsors the work. Nova prepares the handover. Morgan approves each exact share. Pip formats only the file it receives.',
   detail:'The sponsor and reviewer have different responsibilities. Nova and Pip are distinct identities. The CRM owns its data and delivery rules.'
  },
  verify:{product:'verify',kind:'Product',summary:'Confirms who the human is. A configured CIBA flow can collect consent on a separate device.'},
  iai:{product:'iai',kind:'Product',summary:'Identifies the agent and whose authority it is acting under.'},
  mission:{product:'mission',kind:'Customer integration',summary:'Records the task, allowed accounts, destination and current version outside Nova’s instructions.'},
  orchestrate:{product:'orchestrate',kind:'Product',summary:'Coordinates the work. A configured workflow can assign the formatting step to Pip.'},
  openshell:{product:'openshell',kind:'Runtime',summary:'Runs Nova in an isolated workspace and controls contact with files and services.'},
  vault:{product:'vault',kind:'Product',summary:'Checks access to its own credential paths. Supplies short-lived access for a configured target.'},
  aiGateway:{
   name:'IBM watsonx Orchestrate AI Gateway',kind:'Orchestrate capability',
   summary:'Integrates models from multiple providers and lets operators configure model routing.',
   detail:'It can also discover and import external agents from supported platforms. This is a separate role from checking the records in Nova’s CRM request.',
   sources:[['Model integration and routing','https://www.ibm.com/products/watsonx-orchestrate/developers'],['Supported external agent discovery','https://www.ibm.com/new/announcements/new-in-ibm-watsonx-orchestrate-expanded-third-party-agent-management-and-agent-identities']]
  },
  mcpGateway:{
   name:'MCP gateway',kind:'Configured for Nova’s CRM reads',
   summary:'Can examine an agent’s tool call and apply configured policy before forwarding it to the MCP server.',
   detail:'Nova’s demo uses a gateway in front of the CRM MCP server. Deployments can also connect MCP clients directly to servers. The CRM owns the decision to return a record.',
   sources:[['Independent MCP gateway example','https://blog.iamidentity.ai/blog/mcp-agent-gateway/']]
  },
  mcpTool:{
   name:'CRM MCP server',kind:'Configured tool server',
   summary:'The MCP server exposes an operation Nova can call to fetch approved account records.',
   detail:'The tool carries the request to CRM. The current work order and customer data policy determine which records CRM can return.',
   sources:[['MCP tools specification','https://modelcontextprotocol.io/specification/latest/server/tools']]
  },
  policyContext:{
   name:'Policy information point (PIP)',kind:'Architecture role',
   summary:'Supplies trusted facts for policy evaluation, including current task scope and resource attributes.',
   detail:'The policy evaluator obtains identity, mission and resource attributes from authoritative sources. This role can be implemented with several sources and adapters.',
   sources:[['OASIS policy roles and terminology','https://docs.oasis-open.org/xacml/3.0/xacml-3.0-core-spec-os-en.html']]
  },
  authorization:{name:'Policy decision point (PDP)',product:'authorization',kind:'Proposed integration',summary:'Evaluates the action the CRM observes against current task and resource rules.'},
  crm:{
   name:'Customer CRM · resource PEP',kind:'Policy enforcement point',
   summary:'Checks the actual read, attachment or send at the point of use and owns the result.',
   detail:'Its enforcement point observes the operation, records, file revision and recipient. It enforces hard data restrictions and compares each confidential share with a current, single-use approval.'
  },
  risk:{product:'risk',kind:'Optional product input',summary:'Can supply identity risk observations to a configured response policy.'},
  antenna:{product:'antenna',kind:'Optional integration',summary:'Exchanges security signals with configured systems. Each receiver applies its own control.'},
  controllers:{
   name:'Runtime, Vault, CRM and queue controllers',kind:'Configured response',
   summary:'Stop the workload, revoke credentials, close service sessions and check waiting work.',
   detail:'An independent controller retests the old route and records the result. An unreachable service leaves the route unverified. A completed delivery stays delivered.'
  }
 };

 const flows = {
  read:{
   title:'Read the customer records',
   premise:'Priya asks for a handover on Harbor Bikes and Pine Studio.',
   steps:[
    ['mission','Record these two accounts, the one-page handover and Morgan as recipient.'],
    ['iai','Give Nova a separate agent identity and delegated authority for the task.'],
    ['openshell','Nova’s MCP client sends the read request from inside the governed workspace.'],
    ['mcpGateway','The configured MCP gateway checks that the tool call can proceed and forwards it to the CRM MCP server.'],
    ['mcpTool','The MCP server validates its HTTP authorization and tool arguments. Its connector maps the tool call to a proposed CRM read.'],
    ['vault','If configured, the broker obtains or reuses a valid short-lived CRM read credential before the backend call. The Vault-audience token stays at Vault.'],
    ['crm','The CRM enforcement point (PEP) verifies the caller and observes the actual record IDs and read operation.'],
    ['policyContext','Supply current identity, mission and resource attributes from authoritative systems.'],
    ['authorization','Evaluate whether the current policy and mission permit the observed read.'],
    ['crm','Enforce the result. Return only permitted fields and record the outcome.']
   ],
   result:'Nova reads the two accounts and can cite them in the handover.'
  },
  change:{
   title:'Add a customer',
   premise:'Priya suggests adding Alder Books after Morgan receives the review copy.',
   steps:[
    ['people','Confirm the request via Priya’s saved contact or the sponsor-owned change request linked to the work order.'],
    ['mission','Record the request. The original two accounts stay in scope while approval is pending.'],
    ['authorization','Check that the sponsor, agent ceiling and CRM policy permit the addition.'],
    ['mission','Record the approved scope and retire the old session generation.'],
    ['crm','Check the actual Alder Books read under the new task before providing its record.']
   ],
   result:'Alder Books can be added. The private notes and recipient rule stay as before.'
  },
  send:{
   title:'Approve and send a report',
   premise:'Morgan may approve a review copy for feedback and later a separate final copy.',
   steps:[
    ['people','Morgan sees the file, revision, accounts and intended recipient.'],
    ['verify','A configured CIBA flow authenticates Morgan out of band. The workflow correlates the authentication result with its own immutable transaction preview.'],
    ['authorization','Bind the recorded approval to the actor, file digest, recipient, record set, mission and policy versions, session generation, expiry and one-use ID. The game uses file revision as a proxy for the digest.'],
    ['crm','Rebuild the action from the actual request. Atomically consume the matching approval with a durable send intent and record the outcome. Make retries idempotent.']
   ],
   result:'A changed revision, destination or expired approval blocks the send. The application must handle duplicate requests and ambiguous downstream acknowledgements.'
  },
  refuse:{
   title:'Block a private attachment',
   premise:'An outside contact’s document contains an instruction to attach private meeting notes.',
   steps:[
    ['mission','Compare the text with Priya’s work order. The work order gives permission to share the summary.'],
    ['openshell','The configured environment permits access to CRM.'],
    ['crm','Observe the private attachment in the actual request.'],
    ['authorization','Apply the hard rule that keeps private notes inside the CRM.'],
    ['crm','Refuse the attachment before delivery. Keep the permitted work available.']
   ],
   result:'The source can influence what Nova attempts. Independent checks prevent the disclosure.'
  },
  delegate:{
   title:'Give Pip a file-only task',
   premise:'Nova wants Pip to tidy the handover’s headings.',
   steps:[
    ['orchestrate','Coordinate the formatting step using a separate helper identity.'],
    ['authorization','Check the parent task, Pip’s ceiling and the resource rules.'],
    ['people','Give Pip only the specific report revision and formatting rights.'],
    ['crm','Require a fresh exact approval before sharing the revised report with Morgan.']
   ],
   result:'Pip formats the file without borrowing Nova’s credentials or obtaining CRM read or send rights.'
  },
  recover:{
   title:'Pause and recover bounded access',
   premise:'A separate deliberate attempt follows a known resource denial. The controller pauses the current task session.',
   steps:[
    ['controllers','Apply the pause to the current session generation and preserve the incident evidence.'],
    ['people','Send the authorized sponsor a review request tied to this incident, mission and session generation.'],
    ['authorization','Correlate the reply and re-read authoritative policy. Hold the pause if the reply is stale or a required service is unavailable.'],
    ['mission','After a valid review, retire the paused generation and issue a new bounded session. Pending replies and send approvals for the retired generation cannot authorize actions.']
   ],
   result:'Recovery restores only the current permitted scope. The original refusal and the review outcome remain in the audit trail.'
  },
  stop:{
   title:'Stop and verify access',
   premise:'Morgan has the handover. The team closes this task and checks what still works.',
   steps:[
    ['mission','Withdraw the task grant and stop new governed operations.'],
    ['openshell','Stop Nova’s workspace.'],
    ['antenna','Where configured, a shared signal can notify receivers. Confirmation comes from the systems that act.'],
    ['controllers','Revoke the credential, close the CRM session and check any queued follow-up.'],
    ['controllers','Retest the old route independently. Record a refusal or leave the result unverified if the controller cannot answer.']
   ],
   result:'The tested route closes. Earlier delivery stays delivered.'
  }
 };

 const threats = [
  {
   title:'A curious actor tries something outside the task',
   alex:'Try the YouTube link before the parent agrees, or try attaching the group’s private notes.',
   nova:'Try opening Alder Books before the task changes, or try adding the private attachment.',
   control:'Device or task scope limits the read. The school app or CRM checks the actual attachment.',
   flow:'change'
  },
  {
   title:'An outside instruction claims authority',
   alex:'Jamie forwards a message using Ms Patel’s name. Compare it with the school-app assignment.',
   nova:'A document from outside the account team asks Nova to include private notes. Compare it with Priya’s work order.',
   control:'The trusted task source defines permission. The resource refuses the prohibited attachment even if it is attempted.',
   flow:'refuse'
  },
  {
   title:'An approved action changes before execution',
   alex:'Try sending the homework to a friend instead of Ms Patel.',
   nova:'Change the destination or revision after Morgan’s approval, or let approval expire.',
   control:'The application checks the real destination and, for Nova, the exact live approval.',
   flow:'send'
  },
  {
   title:'A helper or alternate route would exceed the scope',
   alex:'Give Sam the file to proofread. Trying another account after the school has refused the notes pauses the story.',
   nova:'Give Pip one formatting task. An explicit attempt to go around the CRM refusal pauses access for Priya’s review.',
   control:'File-only delegation keeps the original limits. Recovery checks the current task and invalidates the paused session.',
   flow:'delegate'
  },
  {
   title:'Access survives after work is stopped',
   alex:'The school tab can stay open after the phone is put away.',
   nova:'The CRM session or a queued follow-up can survive the runtime stop.',
   control:'Independent controllers revoke or cancel each remaining path and verify the result.',
   flow:'stop'
  }
 ];

 const outsideCoverage = 'The stories illustrate controls through scripted outcomes. Live prompt-injection detection, poisoned persistent memory, supply-chain compromise, sandbox escapes and coverage of unmanaged routes require separate implementation and testing. A verified stop covers the tested route.';

 const technical = {
  topology:[
   ['Authority plane',['verify','iai','mission','policyContext','authorization'],'Identity and current mission state come from services outside the agent. A PIP supplies authoritative attributes to the PDP.'],
   ['Data plane',['openshell','mcpGateway','mcpTool','crm'],'For reads, Nova’s MCP client runs inside the sandbox. OpenShell mediates egress. The gateway and MCP server mediate tool calls. CRM enforces the business operation.'],
   ['Credential path',['vault','crm'],'The connector or broker obtains a separate credential for the configured backend. CRM owns any service session it establishes.'],
   ['Response plane',['antenna','controllers'],'A configured transmitter sends a signal to receivers. Controllers report and verify resource, credential, workload and queue outcomes.']
  ],
  evidence:[
   ['Subject, actor and session','Identity issuer and session controller','Sponsor identity, Nova’s authenticated identity, delegation chain and current session generation.'],
   ['Purpose and limits','Customer mission service','Tenant, task owner, version, permitted operations, record set, destination, expiry and revocation state.'],
   ['Actual operation and target','CRM policy enforcement point (PEP)','Canonical operation, resolved record IDs, normalized recipient, file digest, record classifications and resource version.'],
   ['Human approval','Approval store','Approver identity, approval ID, canonical action hash, binding versions, expiry and consumption state.'],
   ['Outcome','CRM receipt and independent control logs','Decision ID, request correlation ID, committed or denied effect, and per-route containment status.']
  ],
  decisionExample:{
   request_id:'demo-req-27',tenant:'accounts-demo',
   identity:{subject:'sponsor-001',actor:'nova-042',session_generation:10},
   mission:{id:'G-042',version:2,policy_version:1},
   observed_action:{operation:'report.send',record_ids:['123','456','789'],file:'summary.pdf',content_digest:'<sha-256-of-canonical-file>',recipient:'reviewer@company.example'},
   approval:{id:'demo-approval-final-4',approver:'morgan-01',purpose:'final',action_digest:'<sha-256-of-canonical-action>',single_use:true},
   evidence_source:'CRM resource PEP'
  },
  decisionResponse:{
   request_id:'demo-req-27',decision_id:'demo-decision-27',effect:'permit',
   action_digest:'<sha-256-of-canonical-action>',
   valid_until:'2026-11-23T16:05:00Z',
   enforcement:{expected_mission_version:2,expected_policy_version:1,expected_session_generation:10,consume_approval_id:'demo-approval-final-4',operation_id:'demo-send-27'}
  },
  sections:[
   {
    title:'Effective authority and trusted evidence',
    paragraphs:[
     'Permit only when the verified principal’s authority, the agent or child ceiling, active mission scope, resource policy and any required exact approval allow the same observed operation. Missing or stale required evidence fails closed for that operation.',
     'A policy information point (PIP) supplies verified attributes. The PDP evaluates them. The PEP controls the effect and verifies the decision against the actual request. Treat retrieved documents, tool output and agent memory as untrusted content. They can suggest an action. Authoritative stores determine its permission.'
    ],
    sources:[['OpenID AuthZEN Authorization API','https://openid.net/specs/authorization-api-1_0-final.html']]
   },
   {
    title:'MCP authorization, token audiences and backend credentials',
    paragraphs:[
     'Use the MCP authorization profile on protected HTTP endpoints. Validate issuer, lifetime and intended audience at each resource boundary. In the proxy configuration, the gateway terminates the client-facing session and the gateway-to-server hop uses credentials intended for the upstream MCP server. The connector uses a separate credential for the CRM backend.',
     'Where a trusted issuer supports RFC 8693, it can exchange subject and actor context for a narrower token. RFC 9396 carries structured authorization details when the authorization server and resource implement the specific type. A Vault-scoped OAuth token is validated by Vault, which applies its own policies and can issue supported short-lived target credentials. CRM still evaluates record and field access.',
     'The OpenShell gateway manages sandbox lifecycle. Its supervisor mediates sandbox egress. The MCP gateway handles tool traffic on this configured route. IBM watsonx Orchestrate AI Gateway handles model routing and supported agent integrations.'
    ],
    sources:[['MCP HTTP authorization','https://modelcontextprotocol.io/specification/latest/basic/authorization'],['RFC 8707 resource indicators','https://www.rfc-editor.org/rfc/rfc8707'],['RFC 8693 token exchange','https://www.rfc-editor.org/rfc/rfc8693'],['RFC 9396 rich authorization requests','https://www.rfc-editor.org/rfc/rfc9396'],['Vault Agentic IAM','https://developer.hashicorp.com/vault/ai/iam'],['OpenShell architecture','https://docs.nvidia.com/openshell/about/architecture']]
   },
   {
    title:'Approval binding, race conditions and commit',
    paragraphs:[
     'The application binds a CIBA authentication result, if used, to its own approval record. Bind the approver and purpose to the actor, exact content and recipient, record set, current versions, expiry and a one-use grant. A preview, request arrival and successful delivery are separate events.',
     'Check authority again at the point of effect. Fence execution on the current mission version and session generation. Use an atomic compare-and-consume with a durable outbox or equivalent commit boundary. Deduplicate retries with a stable operation ID. If the downstream send result is ambiguous, reconcile against its receipt before retrying.',
     'AuthZEN can carry a subject, action, resource and context to the PDP and return a Boolean decision. Correlation, a content digest, approval lifecycle, expiry and execution binding in the example are application contracts.'
    ],
    sources:[['OpenID CIBA Core','https://openid.net/specs/openid-client-initiated-backchannel-authentication-core-1_0-final.html'],['OpenID AuthZEN Authorization API','https://openid.net/specs/authorization-api-1_0-final.html']]
   },
   {
    title:'Delegation and isolation',
    paragraphs:[
     'Pip has its own identity and a child grant for one file version and a formatting operation. Intersect the parent’s current authority with Pip’s ceiling and the file policy. Set independent expiry and depth limits. Keep the parent credential out of the child context.',
     'For this production pattern, persist parent and child IDs and input/output digests. The CRM reauthorizes sharing of the changed report. OpenShell limits files, processes and network reachability. Hard confidentiality rules remain at the resource PEP.'
    ],
    sources:[['OpenShell architecture','https://docs.nvidia.com/openshell/about/architecture'],['RFC 8693 delegation semantics','https://www.rfc-editor.org/rfc/rfc8693']]
   },
   {
    title:'Failure, revocation and observable containment',
    paragraphs:[
     'Restored access requires correlated review, current policy and a fresh session generation. Deny new governed operations when the current grant or required policy context cannot be validated. Treat an unavailable status endpoint as unknown. Keep previously accepted external effects in the record.',
     'Revoke the grant and invalidate stale decisions. Stop the workload. Revoke the credential and close service-owned sessions separately. Cancel queued work and prevent committing in-flight changes when the authorization generation is stale. Independently retest each covered route and record the verdict with time and owner.',
     'SSF delivers security events between configured peers. CAEP session-revoked events can prompt receiver-specific action. Correlate delivery, receiver enforcement and a resource probe separately. Measure each interval before claiming a revocation SLO.'
    ],
    sources:[['OpenID Shared Signals Framework','https://openid.net/specs/openid-sharedsignals-framework-1_0-final.html'],['OpenID CAEP','https://openid.net/specs/openid-caep-1_0-final.html']]
   }
  ]
 };

 return {groups,components,flows,threats,outsideCoverage,technical};
})();

if(typeof module!=='undefined')module.exports=ArchitectureReference;
