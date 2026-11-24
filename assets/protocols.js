/* Primary-source review: 2026-11-23. Optional integrations are not native-product claims. */
const PROTOCOL_SOURCES = {
 authzen:{name:'OpenID AuthZEN Authorization API 1.0',url:'https://openid.net/specs/authorization-api-1_0-final.html'},
 oidc:{name:'OpenID Connect Core 1.0',url:'https://openid.net/specs/openid-connect-core-1_0.html'},
 ciba:{name:'CIBA Core 1.0 — Final',url:'https://openid.net/specs/openid-client-initiated-backchannel-authentication-core-1_0-final.html'},
 rar:{name:'RFC 9396 — Rich Authorization Requests',url:'https://www.rfc-editor.org/rfc/rfc9396.html'},
 resource:{name:'RFC 8707 — Resource Indicators',url:'https://www.rfc-editor.org/rfc/rfc8707.html'},
 protectedResource:{name:'RFC 9728 — Protected Resource Metadata',url:'https://www.rfc-editor.org/rfc/rfc9728.html'},
 oauth21:{name:'OAuth 2.1 Internet-Draft',url:'https://datatracker.ietf.org/doc/draft-ietf-oauth-v2-1/'},
 jwt:{name:'RFC 7519 — JSON Web Token',url:'https://www.rfc-editor.org/rfc/rfc7519.html'},
 clientRegistration:{name:'RFC 7591 — Dynamic Client Registration',url:'https://www.rfc-editor.org/rfc/rfc7591.html'},
 clientMetadata:{name:'OAuth Client ID Metadata Document Internet-Draft',url:'https://datatracker.ietf.org/doc/draft-ietf-oauth-client-id-metadata-document/'},
 scimProtocol:{name:'RFC 7644 — SCIM Protocol',url:'https://www.rfc-editor.org/rfc/rfc7644.html'},
 scimSchema:{name:'RFC 7643 — SCIM Core Schema',url:'https://www.rfc-editor.org/rfc/rfc7643.html'},
 transactionTokens:{name:'Transaction Tokens Internet-Draft',url:'https://datatracker.ietf.org/doc/draft-ietf-oauth-transaction-tokens/'},
 a2a:{name:'Agent2Agent protocol specification',url:'https://a2a-protocol.org/latest/specification/'},
 exchange:{name:'RFC 8693 — Token Exchange',url:'https://www.rfc-editor.org/rfc/rfc8693.html'},
 revoke:{name:'RFC 7009 — Token Revocation',url:'https://www.rfc-editor.org/rfc/rfc7009.html'},
 ssf:{name:'OpenID Shared Signals Framework 1.0',url:'https://openid.net/specs/openid-sharedsignals-framework-1_0.html'},
 caep:{name:'OpenID CAEP 1.0',url:'https://openid.net/specs/openid-caep-1_0.html'},
 mcp:{name:'MCP HTTP Authorization — 2026-07-28',url:'https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization'},
 mcpClientRegistration:{name:'MCP Client Registration — 2026-07-28',url:'https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/client-registration'},
 openshell:{name:'NVIDIA OpenShell architecture',url:'https://docs.nvidia.com/openshell/about/architecture'},
 vault:{name:'Vault Agentic IAM',url:'https://developer.hashicorp.com/vault/ai/iam'},
 leases:{name:'Vault lease, renew, and revoke',url:'https://developer.hashicorp.com/vault/docs/concepts/lease'},
 agentInventory:{name:'IBM Agent Identity inventory and registration',url:'https://www.ibm.com/products/agent-identity'},
 vaultRegistry:{name:'Vault Agent Registry',url:'https://developer.hashicorp.com/vault/ai/iam/concepts/agent-registry'},
 aiGateway:{name:'watsonx Orchestrate model routing',url:'https://www.ibm.com/products/watsonx-orchestrate/developers'},
 mcpGateway:{name:'Example DataPower Interact Gateway MCP policies',url:'https://www.ibm.com/docs/en/dp-interact-gateway/12.1.1?topic=servers-mcp-server-policies'},
 identityRisk:{name:'IBM on AuthMind runtime identity observability',url:'https://newsroom.ibm.com/blog-ibm-advances-agent-identity-security-with-new-vault-capabilities'},
 aiRmf:{name:'NIST AI Risk Management Framework',url:'https://nvlpubs.nist.gov/nistpubs/AI/NIST.AI.100-1.pdf'},
 spiffe:{name:'SPIFFE workload identity concepts',url:'https://spiffe.io/docs/latest/spiffe-about/spiffe-concepts/'},
 owasp:{name:'OWASP AI Agent Security',url:'https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html'},
 mcpTools:{name:'MCP tools specification',url:'https://modelcontextprotocol.io/specification/latest/server/tools'},
 familyControls:{name:'Apple’s parental controls example',url:'https://support.apple.com/en-us/105121'},
 trustedContact:{name:'FTC guidance on checking a message',url:'https://consumer.ftc.gov/articles/how-recognize-avoid-phishing-scams'},
 fileSharing:{name:'Google Drive sharing permissions example',url:'https://support.google.com/drive/answer/2494822'},
 fileVersions:{name:'Google Docs version history example',url:'https://support.google.com/docs/answer/190843'},
 accountSessions:{name:'Google Account sessions and sign-out example',url:'https://support.google.com/accounts/answer/3067630'},
 citing:{name:'Library of Congress guide to citing sources',url:'https://www.loc.gov/programs/teachers/getting-started-with-primary-sources/citing/'}
};
const PROTOCOL_NOTE='Educational mapping only: these exchanges are not sent. CIBA, SSF/CAEP, token exchange, and external authorization service integration depend on deployment support; they are not claimed as native OpenShell or Vault features. Durations are simulated; production signature, expiry, and token validation are not implemented here.';
const AGENT_PROTOCOLS = [
 {
  title:'Establish who may delegate, then bound the task',tags:['OIDC','OAuth 2.0','RAR · RFC 9396'],status:'Standards + proposed mission integration',
  how:'OIDC can authenticate the human sponsor. OAuth can issue resource access; RAR can express fine-grained authorization details when the authorization server and resource support their meaning. A customer-owned mission record separately binds Nova, purpose, scope, and expiry.',
  boundary:'An ID token establishes authentication context. It is not a CRM access token or a mission grant. The example CRM RAR type below is application-defined, not a standard schema.',
  evidence:{mission:'G-042',agent:'nova-042',authorization_details:[{type:'example.crm-summary',actions:['read'],customer_ids:['123','456']}]},sources:['oidc','rar','vault']
 },
 {
  title:'Start only inside the verified runtime boundary',tags:['TLS','Sandbox JWT','OpenShell runtime'],status:'Documented runtime foundation; deployment still needs testing',
  how:'OpenShell documents an authenticated Sandbox Protocol using TLS and a sandbox JWT, plus a trusted Supervisor and an outer egress fence. Controls must be confirmed before the workload starts. SPIFFE/SVID is an optional workload-identity integration choice.',
  boundary:'Identity authenticates a component; runtime policy constrains its operations. Neither CIBA nor a model response replaces sandbox enforcement. Network permission does not establish every business permission.',
  evidence:{boundary:'confirmed',program:'approved agent',destination:'crm.example',business_action_authority:'checked separately'},sources:['openshell','jwt','spiffe']
 },
 {
  title:'Authorize the actual CRM read',tags:['OAuth 2.1 · MCP HTTP profile','RFC 9728','RFC 8707','CRM resource check'],status:'Standard resource authorization + proposed action-aware PEP/PDP',
  how:'On the HTTP MCP path, protected resource metadata points Nova to the authorization server (RFC 9728). Nova requests an access token for the MCP resource (RFC 8707). The MCP boundary validates that token, and Vault separately authorizes its credential path. The CRM PEP checks the actual operation and records.',
  boundary:'MCP authorization does not define the business mission. Vault permissions and RAR restrictions on Vault requests do not automatically authorize arbitrary CRM operations. The PDP-to-PEP decision contract is proposed. AuthZEN is a candidate interface, not a deployed integration in this game.',
  evidence:{audience:'https://crm-tools.example/mcp',action:'customer.read',records:['123','456'],decision:'permit only within current grant'},sources:['mcp','oauth21','protectedResource','resource','vault']
 },
 {
  title:'Keep retrieved instructions below the authority boundary',tags:['Untrusted content','Authenticated source ≠ authority','Independent PEP'],status:'Application security control; no injection-proof protocol',
  how:'A saved trusted contact provides an independent check. Even authenticated content stays below the mission authority; the tool boundary continues to constrain actions if Nova follows a hostile instruction.',
  boundary:'OIDC or TLS can authenticate a party without making every statement trustworthy. Content filtering and provenance help investigation but do not mint permission.',
  evidence:{input_class:'retrieved document',claimed_override:'not authoritative',mission:'unchanged'},sources:['owasp','oidc']
 },
 {
  title:'An allowed endpoint still needs an action decision',tags:['OAuth / RAR','Resource PEP','External PDP · proposed'],status:'Application authorization; exact CRM policy is an integration',
  how:'The trusted resource PEP observes actual parameters and obtains a proposed policy decision point decision against the customer-owned mission and resource policy. AuthZEN can carry the evaluation exchange; the resource still binds and enforces the result at execution.',
  boundary:'The runtime allows connectivity. The action-aware resource boundary separately denies an out-of-mission export. An unavailable or unverifiable sensitive-action decision must not silently permit execution. AuthZEN uses a Boolean decision; approval workflow, richer statuses and execution-binding fields are application extensions.',
  evidence:{network:'allowed',attempted_action:'customer.export',mission:'summary only',resource_decision:'deny'},sources:['authzen','rar','openshell','owasp']
 },
 {
  title:'Human consent and exact-action execution are separate checks',tags:['CIBA · optional','RAR · optional','One-use action approval','Execution PEP'],status:'Proposed approval integration; binding is application-enforced',
  how:'CIBA can authenticate a human and obtain consent through a separate device. The application must separately bind its approval to the actor, document revision or content digest, records, recipient, current mission/policy version, expiry, and one execution. The executing PEP verifies and consumes that approval.',
  boundary:'CIBA’s binding_message helps the person correlate devices; it is not a cryptographic signature over the CRM action. CIBA plus RAR is not assumed to be a universally supported profile. Changed content or parameters require a new decision. The simulation binds a document revision and demonstrates expiry through an explicit story event. It implements no cryptographic digest or real-time token expiry.',
  evidence:{file:'summary.pdf',recipient:'reviewer@company.example',approval_id:'example APR',revision:'bound to the approved report revision',expiry:'explicit story-window event',execution:'compare then consume once'},sources:['ciba','rar','owasp']
 },
 {
  title:'Authorize a persistent write without creating new authority',tags:['Memory PEP','Namespace policy','Provenance'],status:'Application control; not a CIBA or SSF feature',
  how:'The memory service checks the task namespace, write rights, and attached execution evidence. Source references remain attached to stored content. Mission grants and independent audit evidence stay in protected state.',
  boundary:'A provenance receipt does not prove that arbitrary note text is true. A stored claim never changes the grant. Retention, tenant isolation, integrity, and sensitive-data handling also need implementation.',
  evidence:{namespace:'task-memory/G-042',source:'execution receipt',authoritative:false},sources:['owasp']
 },
 {
  title:'Preserve the originating limits across a helper call',tags:['RFC 8693 · optional','Audience binding','Child grant','Distinct identity'],status:'Standards-supported option + customer delegation policy',
  how:'A supporting authorization server can exchange a token for the downstream audience under RFC 8693. Distinct helper identity and an explicit child grant preserve the originating mission and restrict the helper to formatting the report.',
  boundary:'Token exchange alone does not define the child’s business permissions or revoke its input tokens. Do not pass an unrelated bearer token through an MCP server. Child scope and delegation depth need independent limits.',
  evidence:{parent_mission:'G-042',helper:'pip-01',task:'format',data_scope:'report only',parent_token_shared:false},sources:['exchange','mcp']
 },
 {
  title:'Distribute the revocation signal, then verify its effect',tags:['SSF','CAEP session-revoked','RFC 7009 · where supported','Runtime stop'],status:'Proposed cross-system integration; four outcomes are checked separately',
  how:'SSF can distribute signed Security Event Tokens; CAEP defines session-revoked semantics. Receivers validate and correlate the signal, then apply their enforcement policy. Token revocation, applicable Vault lease revocation, runtime stop, and in-flight reconciliation are separate operations.',
  boundary:'Delivery or acknowledgement of an event is not proof of containment. Receivers, self-contained tokens, leases, and queued actions can behave differently. The game requires observed results for the tested route before closure is marked verified. A future task would need fresh authorization. An unreachable controller leaves an unknown, unverified state; these checks do not prove coverage of every possible endpoint.',
  evidence:{illustrative_header:{typ:'secevent+jwt',alg:'ES256',kid:'example-key'},illustrative_decoded_SET:{iss:'https://idp.example',iat:1795424400,aud:'https://resource.example',jti:'example-event-042',sub_id:{format:'opaque',id:'session-G-042'},events:{'https://schemas.openid.net/secevent/caep/event-type/session-revoked':{}}},signature_and_delivery:'not implemented in this game'},sources:['ssf','caep','revoke','leases','openshell']
 }
];
const REVIEW_PROTOCOL = {
 title:'Request independent review without hunting for a pass',tags:['CIBA · optional','Pending ≠ approved','Current-policy check','Fresh session generation'],status:'Scripted authority exchange; optional protocol integration',
 how:'The trusted mission reference and blocked attempt are attached automatically. An optional CIBA channel can obtain human authentication and consent. The application correlates the reply, rechecks current policy, and issues a fresh bounded session only after the authority approves.',
 boundary:'The actor cannot restore authority by holding an old pass. A local suspension is not an invented CAEP event type. If revocation is signaled through SSF/CAEP, receivers still enforce independently. Cancelling review changes application state, not a standard CIBA cancellation API. This mock has no network calls or live CIBA tokens.',
 evidence:{application_review:'correlated with mission and generation',illustrative_CIBA_form_fields:{backchannel_request:{scope:'openid',login_hint:'sponsor@company.example',binding_message:'G42-R1'},acknowledgement:{auth_req_id:'example-opaque-id',expires_in:120,interval:5},token_request:{grant_type:'urn:openid:params:grant-type:ciba',auth_req_id:'example-opaque-id'}},while_pending:'authorization_pending; all governed actions remain blocked',after_approved:'application rechecks policy; retire old generation; preserve original scope'},sources:['ciba','ssf','caep','owasp']
};
const RESTORATION_PROTOCOL = {
 title:'Issue fresh authority after containment is verified',tags:['OIDC / CIBA · optional reauthentication','New scoped OAuth grant','New session generation'],status:'New customer authorization; not a side effect of SSF',
 how:'After the four containment receipts are checked, the authority reviews the incident and current scope. A supported OIDC or CIBA flow can reauthenticate the human where required. The application then authorizes a fresh bounded mission and session generation.',
 boundary:'A CAEP event does not restore access, and authentication alone does not authorize the new mission. The earlier grant stays revoked. Already completed external effects are handled separately.',
 evidence:{original_grant:'revoked',required_receipts:['authority','sessions','runtime','inflight'],new_scope:'completed-report-only',new_generation:'distinct from retired sessions'},sources:['oidc','ciba','caep','resource']
};
