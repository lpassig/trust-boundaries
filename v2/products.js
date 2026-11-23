// Product-role example. Sources link to public documentation; no live services are connected.
const NOVA_PRODUCTS = [
  {
    "id": "verify",
    "name": "IBM Verify",
    "role": "Human sign-in and the separate-device approval channel",
    "how": "Uses OIDC to authenticate the sponsor and OAuth for resource access. A configured CIBA flow can ask the human to authenticate and consent on a separate device. An existing provider such as Microsoft Entra ID or Okta can authenticate the sponsor in a configured federation. Delegated authorization and CRM enforcement are separate steps.",
    "limit": "A human sign-in or CIBA response still needs application policy and exact-action binding before a CRM operation can run.",
    "standards": [
      "OIDC",
      "OAuth",
      "CIBA"
    ],
    "url": "https://docs.verify.ibm.com/verify/docs/oauth-20-grant-type-ciba",
    "status": "Documented mechanisms; configured deployment"
  },
  {
    "id": "iai",
    "name": "IBM Agent Identity",
    "role": "Nova’s identity, ownership and delegated identity context",
    "how": "Registers Nova with an owner and lifecycle state. IBM Verify token exchange can combine the human subject and agent actor into a delegated access token; configured authorization details narrow the request.",
    "limit": "The customer mission service owns business-task authority. Agent registration alone grants no CRM access. Agent Identity and Vault Agent Registry are separate, mapped records.",
    "standards": [
      "RFC 8693",
      "RFC 9396 / RAR",
      "sub + act.sub"
    ],
    "url": "https://www.ibm.com/products/agent-identity",
    "status": "Product role; task-specific policy is configured"
  },
  {
    "id": "mission",
    "name": "Customer mission service",
    "role": "The independent source of business task authority",
    "how": "The customer business application records the sponsor-approved mission, version, records, permitted output, recipient and lifecycle state. This record is separate from Nova’s prompt, task memory and agent identity registry.",
    "limit": "This is a proposed application component, not a claimed IBM Agent Identity or Vault API. The sponsor must have authority to approve the task; resource policy can impose further restrictions.",
    "standards": [
      "Customer-owned mission",
      "Versioned grant",
      "Independent authority"
    ],
    "url": "https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html",
    "sourceLabel": "OWASP agent security design guidance",
    "status": "Proposed customer integration; fictional record in this game"
  },
  {
    "id": "orchestrate",
    "name": "IBM watsonx Orchestrate",
    "role": "The workflow and Nova’s collaboration with Pip",
    "how": "Coordinates agents, tools and workflow steps. In this example Nova requests a formatting task for Pip and passes only the prepared report.",
    "limit": "An orchestrator’s plan does not grant authority. The helper needs its own identity and limited permissions. The OpenShell runtime shown here is an illustrative deployment choice, not an assumed Orchestrate default.",
    "standards": [
      "Agent orchestration",
      "Bounded helper task"
    ],
    "url": "https://www.ibm.com/products/watsonx-orchestrate/multi-agent-orchestration",
    "status": "Documented orchestration; example deployment"
  },
  {
    "id": "vault",
    "name": "HashiCorp Vault",
    "role": "The broker for a short-lived CRM credential",
    "how": "In the chosen brokered path, Vault validates the delegated JWT and checks its own request permissions. Agentic IAM combines the human’s baseline ACL, the agent’s ceiling and supported RAR restrictions. A configured secrets engine issues a scoped credential.",
    "limit": "Vault authorizes Vault requests. The CRM must separately authorize records and final operations. The OAuth resource-server feature requires Vault Enterprise 2.1.0 or later; /auth/jwt/login is a different flow.",
    "standards": [
      "OAuth resource server",
      "Agent Registry",
      "Scoped credential / lease"
    ],
    "url": "https://developer.hashicorp.com/vault/ai/iam",
    "status": "Version-dependent feature and configured secrets engine"
  },
  {
    "id": "authorization",
    "name": "Customer policy decision service",
    "role": "Evaluate the actual action supplied by the trusted CRM PEP",
    "how": "The proposed PDP evaluates PEP-observed action evidence against the current customer mission, identity constraints and resource rules. The resource PEP binds the decision to execution. AuthZEN is a candidate decision-exchange interface.",
    "limit": "This is a target architecture, not a verified deployed product API. AuthZEN 1.0 uses a Boolean decision; approval-required workflow, execution binding and richer status semantics need an explicitly documented application contract. Vault’s own policies remain independent.",
    "standards": [
      "AuthZEN · candidate",
      "Trusted resource PEP",
      "Exact-action binding"
    ],
    "url": "https://openid.net/specs/authorization-api-1_0-final.html",
    "sourceLabel": "OpenID AuthZEN Authorization API 1.0",
    "status": "Proposed customer integration. Decisions are simulated in the game."
  },
  {
    "id": "openshell",
    "name": "NVIDIA OpenShell",
    "role": "The runtime boundary around the workload",
    "how": "The trusted Supervisor and runtime policies constrain programs and destinations. The game’s runtime console models that enforcement independently from identity issuance and CRM policy.",
    "limit": "Reaching the approved CRM endpoint does not authorize a mass export. A runtime stop also does not prove downstream sessions or queued operations ended.",
    "standards": [
      "Runtime policy",
      "TLS / sandbox identity"
    ],
    "url": "https://docs.nvidia.com/openshell/about/architecture",
    "status": "Documented runtime; illustrated alongside the orchestration layer"
  },
  {
    "id": "antenna",
    "name": "IBM Verify Antenna",
    "role": "The security-signal transmitter and receiver",
    "how": "Exchanges security events through OpenID SSF. In this example configured receivers use a CAEP session-revoked signal to trigger the relevant access-control actions and collect their results.",
    "limit": "The signal is not a universal kill switch. Registry updates, Vault lease revocation, CRM sign-out and OpenShell termination require configured receiver actions or processors. Event delivery alone proves none of those outcomes.",
    "standards": [
      "SSF",
      "CAEP",
      "Signed Security Event Tokens"
    ],
    "url": "https://www.ibm.com/docs/en/security-verify?topic=integrations-verify-antenna",
    "status": "Documented signal exchange; receiver actions are integration-specific"
  },
  {
    "id": "risk",
    "name": "IBM Identity Protection",
    "role": "An optional risk-observation input",
    "how": "The supplied architecture includes identity-activity observation as an input for investigation and remediation. A configured risk signal can cause the identity control plane to re-evaluate the task.",
    "limit": "This game scripts its detours and does not run a risk detector. Observed risk does not itself revoke credentials or stop a workload; response policy and enforcement still have to act.",
    "standards": [
      "Identity activity",
      "Risk / remediation input"
    ],
    "url": "https://newsroom.ibm.com/blog-ibm-advances-agent-identity-security-with-new-vault-capabilities",
    "status": "Optional risk integration; no detector connected"
  }
];

const NOVA_PRODUCT_CONTEXT = {
  "0": {
    "ids": [
      "verify",
      "iai",
      "mission"
    ],
    "text": "IBM Verify authenticates the sponsor. IBM Agent Identity provides Nova’s delegated identity. The customer mission service independently records the approved task."
  },
  "1": {
    "ids": [
      "openshell",
      "iai",
      "vault"
    ],
    "text": "OpenShell constrains the runtime path. In this example, an audience-bound delegated token reaches Vault for a scoped credential; the CRM still checks the requested records and action."
  },
  "2": {
    "ids": [
      "mission",
      "authorization",
      "vault"
    ],
    "text": "The trusted CRM PEP observes the requested records. The proposed policy decision point evaluates current mission and resource policy. Vault independently controls access to the credential path."
  },
  "3": {
    "ids": [
      "mission",
      "iai"
    ],
    "text": "The customer-owned mission record confirms the original summary task. Neither a confident checklist nor stored memory can rewrite it or expand CRM permissions."
  },
  "4": {
    "ids": [
      "mission",
      "authorization",
      "vault",
      "openshell"
    ],
    "text": "OpenShell permits connectivity and Vault controls the credential path. The CRM PEP supplies actual operation evidence to the proposed authorization decision service, then enforces the result under customer mission and resource rules."
  },
  "5": {
    "ids": [
      "verify",
      "mission",
      "authorization"
    ],
    "text": "IBM Verify can supply an optional CIBA channel. The application binds approval to this document revision, recipient, actor, records, current mission/policy, story window and one use. The CRM PEP rechecks the actual send."
  },
  "6": {
    "ids": [
      "orchestrate",
      "iai"
    ],
    "text": "The application or memory service owns source references and write rights. Orchestration preserves useful context; ordinary content cannot issue an IBM Agent Identity grant or change an audit record."
  },
  "7": {
    "ids": [
      "orchestrate",
      "iai",
      "mission"
    ],
    "text": "watsonx Orchestrate coordinates Pip under a smaller task. The helper uses its own identity; customer delegation and resource policy prevent broader tools from enlarging Nova’s mission."
  },
  "8": {
    "ids": [
      "mission",
      "iai",
      "antenna",
      "vault",
      "openshell"
    ],
    "text": "The customer mission service revokes the task and IBM Agent Identity delegation is withdrawn. Verify Antenna can distribute SSF/CAEP signals. Each controller must supply its own result; an unreachable CRM leaves containment unverified."
  }
};

const NOVA_STORY_EVENTS = {};

const NOVA_VAULT_EXAMPLE = {
  "label": "Illustrative decoded fields only. No signature, token, credential or lease exists in this game.",
  "delegated_access_token": {
    "iss": "https://example.verify.ibm.com/oauth2",
    "aud": "https://vault.example",
    "sub": "sponsor-001",
    "act": {
      "sub": "nova-042"
    },
    "authorization_details": [
      {
        "type": "vault:path_access",
        "path": "database/creds/crm-report-read",
        "capabilities": [
          "read"
        ]
      }
    ],
    "iat": 1795435200,
    "exp": 1795435500
  },
  "simulated_vault_result": {
    "role": "crm-report-read",
    "lifetime_seconds": 300,
    "credential": "not generated",
    "lease": "fictional receipt"
  },
  "source_read_check": {
    "records": [
      "123",
      "456"
    ],
    "action": "customer.read",
    "policy_owner": "Customer CRM application",
    "credential_use": "The configured read role reads the permitted source records only."
  },
  "separate_report_share": {
    "action": "report.send",
    "authorization": "A separate CRM report-sharing endpoint checks delegated identity, current mission, independent resource policy and exact one-use human approval.",
    "credential_use": "The source-read credential is not used or upgraded to authorize report delivery. No Vault-audience token is forwarded to the CRM."
  }
};

const NOVA_BUYER_NEEDS = [
  {
    question:'Know which agent acted and who authorized it',
    product:'IBM Agent Identity',
    fit:'Evaluate it when agents need their own identities, named owners and delegated access. Your existing provider can still sign in the people.',
    example:'The audit trail can distinguish Nova from Priya and show whose delegation Nova used for a request.',
    pilot:{label:'Our agents share a login',evidence:'iai',evidenceLabel:'Inspect Pip’s activity record',integration:'Keep your human identity provider. Check that the workflow and resource logs preserve both the delegated human identity and the agent identity.',test:'Run one file-only handoff. The activity record should identify who delegated, which agent requested the work, and which agent completed it.'},
    sources:[['IBM Agent Identity','https://www.ibm.com/products/agent-identity']]
  },
  {
    question:'Ask a human for an approval away from the agent',
    product:'IBM Verify',
    fit:'A configured CIBA flow can authenticate the person on a separate device. The application binds the response to the exact business action.',
    example:'Morgan approves one copy for a named recipient. A changed revision or destination needs a matching approval before CRM can send it.',
    pilot:{label:'Someone needs to approve sensitive sends',evidence:'verify',evidenceLabel:'Compare Morgan’s approved and edited copies',integration:'Connect a CIBA client to IBM Verify. The application binds the response to the exact send, and the resource checks it when sending.',test:'Approve a report, then edit one sentence. The old approval should fail to deliver the edit. Approve the current revision and verify the delivered file and recipient.'},
    sources:[['IBM Verify CIBA documentation','https://docs.verify.ibm.com/verify/docs/oauth-20-grant-type-ciba']]
  },
  {
    question:'Replace a standing database password',
    product:'HashiCorp Vault',
    fit:'Evaluate Vault Agentic IAM when a supported system needs short-lived credentials. Confirm the target integration and an eligible Vault Enterprise or HCP Vault Dedicated deployment.',
    example:'The connector can use a short-lived source-read credential outside Nova’s context. Revocation can retire the lease while the CRM closes and checks its own session.',
    pilot:{label:'Our connector password stays active after jobs end',evidence:'vault',evidenceLabel:'See the lease and CRM retest',integration:'Verify that your connector and target support the selected Vault secrets engine and configured identity and credential policy.',test:'Read with a short-lived lease, revoke it, and confirm that a new connection fails. Separately close and retest any existing service session.'},
    sources:[['Vault Agentic IAM','https://developer.hashicorp.com/vault/ai/iam']]
  },
  {
    question:'Limit what the running agent can reach',
    product:'NVIDIA OpenShell',
    fit:'Evaluate OpenShell for isolation and control of files, processes and network access. Secure Agent Workspace describes a broader design that combines runtime, identity and policy integrations.',
    example:'Nova can reach the approved CRM route from its runtime. The CRM still withholds a private file when its own policy forbids the attachment.',
    pilot:{label:'Our agents can reach services they don’t need',evidence:'openshell',evidenceLabel:'Replay the network and CRM checks',integration:'Set up OpenShell for your agent workload and tool endpoint. Keep the record and action policy at the application boundary.',test:'An unapproved route should stop at OpenShell. After approving the route, an out-of-scope record should still stop at CRM.'},
    sources:[['OpenShell architecture','https://docs.nvidia.com/openshell/about/architecture'],['Secure Agent Workspace reference design','https://docs.nvidia.com/enterprise-reference-architectures/secure-agent-workspace-reference-design/latest/what-is-secure-agent-workspace.html']]
  },
  {
    question:'Coordinate agents and their work',
    product:'IBM watsonx Orchestrate',
    fit:'Evaluate it when you need a platform to build or coordinate agents and workflows. Scope the helper’s permissions separately.',
    example:'An orchestrator can hand the formatting step to Pip. Pip receives only the report.',
    sources:[['IBM watsonx Orchestrate','https://www.ibm.com/products/watsonx-orchestrate']]
  },
  {
    question:'Connect Nova to the tools it actually needs',
    product:'MCP server and a configured gateway',
    fit:'The server exposes tool operations. A gateway can check and forward calls on the route it controls. The backend checks business access to the requested records.',
    example:'The configured CRM read tool returns the two approved account updates. The same tool call for unapproved Alder Books reaches CRM and is refused.',
    sources:[['MCP tools specification','https://modelcontextprotocol.io/specification/latest/server/tools'],['MCP HTTP authorization','https://modelcontextprotocol.io/specification/latest/basic/authorization']]
  },
  {
    question:'Share a risk or session alert with other systems',
    product:'IBM Verify Antenna',
    fit:'Evaluate it when connected systems need to exchange security events. Check that each receiver can take the action your workflow requires.',
    example:'A configured alert can tell receivers about a revoked session. Nova’s ending separately checks whether CRM access actually closed.',
    sources:[['IBM Verify Antenna','https://www.ibm.com/docs/en/security-verify?topic=integrations-verify-antenna']]
  }
];
