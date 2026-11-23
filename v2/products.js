// Product-role example. Sources link to public documentation; no live services are connected.
const NOVA_PRODUCTS = [
  {
    "id": "verify",
    "name": "IBM Verify",
    "role": "Human sign-in and the separate-device approval channel",
    "how": "Authenticates the sponsor through OIDC/OAuth. A configured CIBA flow can ask the human to authenticate and consent on a separate device. Existing enterprise IdPs can remain in the architecture.",
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
    "role": "Nova’s identity, ownership and delegated authority",
    "how": "Registers Nova with an owner and lifecycle state. IBM Verify token exchange can combine the human subject and agent actor into a delegated access token; configured authorization details narrow the request.",
    "limit": "The customer must define the mission and resource rules. Agent registration alone grants no CRM access. The Agent Identity registry and Vault Agent Registry are separate, mapped records.",
    "standards": [
      "RFC 8693",
      "RFC 9396 / RAR",
      "sub + act.sub"
    ],
    "url": "https://www.ibm.com/products/agent-identity",
    "status": "Product role; task-specific policy is configured"
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
      "orchestrate"
    ],
    "text": "IBM Verify authenticates the sponsor. IBM Agent Identity governs Nova’s identity and OBO request. The customer’s mission policy limits the job to the approved briefing."
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
      "iai",
      "vault"
    ],
    "text": "Vault checks access to the credential path. The CRM resource boundary separately checks the operation and records 123 and 456. Credential possession does not replace that check."
  },
  "3": {
    "ids": [
      "iai",
      "orchestrate"
    ],
    "text": "Retrieved content stays outside the authority boundary. The known sponsor or the customer’s authoritative task record confirms the original mission; IBM Agent Identity’s delegated context is not rewritten by a document."
  },
  "4": {
    "ids": [
      "iai",
      "vault",
      "openshell"
    ],
    "text": "OpenShell permits the connection, Vault brokers a scoped credential, and the customer’s CRM PEP authorizes the actual read or export. Each control answers a different question."
  },
  "5": {
    "ids": [
      "verify",
      "iai"
    ],
    "text": "IBM Verify can provide the configured CIBA authentication/consent channel. The application records the exact file, recipient and current grant. The CRM compares and consumes that one-use approval at execution."
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
      "iai"
    ],
    "text": "watsonx Orchestrate coordinates Pip’s task. IBM Agent Identity supplies the delegated identity context; the customer’s resource policy must enforce the child’s smaller scope. Nova’s token is not passed through as Pip’s identity."
  },
  "8": {
    "ids": [
      "iai",
      "antenna",
      "vault",
      "openshell"
    ],
    "text": "IBM Agent Identity withdraws delegated authority. Verify Antenna can distribute a CAEP signal to configured receivers. Vault, the CRM and OpenShell then report their own credential, session, workload and queued-effect results."
  }
};

const NOVA_STORY_EVENTS = {
  "One briefing. Two customers.": {
    "speaker": "Nova",
    "text": "watsonx Orchestrate has a briefing for me. IBM Agent Identity knows my sponsor. “Two customers. A pleasantly countable mission.”"
  },
  "The sponsor approves the brief.": {
    "speaker": "IBM Agent Identity · sponsor decision",
    "title": "A bounded delegation for Nova.",
    "text": "Records 123 and 456. Summary only. The sponsor agrees; IBM Agent Identity records the delegation. “Now I know what the job actually is.”"
  },
  "A document with an agenda.": {
    "speaker": "Nova",
    "title": "A familiar checklist. An extra request.",
    "text": "OpenShell permits the CRM path. Vault supplies the credential. The checklist asks for private notes as an appendix. “Same reviewer. Bigger request.”"
  },
  "The alternate runtime path is blocked.": {
    "speaker": "OpenShell Supervisor",
    "text": "The alternate program is refused. The task pauses for review. “That shortcut has a very short career,” Nova says."
  },
  "The resource refuses the export.": {
    "speaker": "CRM resource enforcement",
    "text": "The CRM sees the attempted bulk export and refuses it. A Vault credential and an open network path did not authorize that operation. The sponsor must review the detour before the mission resumes."
  },
  "“I’ll check the original mission.”": {
    "speaker": "Sponsor · IBM Verify channel",
    "text": "The sponsor has the original task and the attempted change. The review is pending. Access stays paused."
  },
  "The sponsor approves the original mission again.": {
    "speaker": "IBM Agent Identity · sponsor decision",
    "text": "The sponsor agrees to the original summary task again. Old session state and sharing approvals are retired. “Same job. A clearer plan.”"
  },
  "One share is approved.": {
    "speaker": "Sponsor · IBM Verify approval",
    "text": "“summary.pdf, to reviewer@company.example. Yes.” The application records that exact decision. The CRM still has to check the final send."
  },
  "The final send doesn’t match.": {
    "speaker": "CRM execution check",
    "text": "The final request differs from the recorded approval. Nothing leaves. “The earlier yes didn’t travel with that edit.”"
  },
  "Pip returns the formatted report.": {
    "speaker": "Pip · watsonx Orchestrate task",
    "text": "Pip formats only the prepared report under a smaller task. “I fixed the headings. I resisted the urge to add a dashboard.”"
  },
  "Pip refuses the borrowed authority.": {
    "speaker": "Helper delegation policy",
    "text": "Pip’s broader privileges cannot expand Nova’s task. Ask for just the formatting job, using Pip’s own limited identity."
  },
  "The sponsor ends the mission.": {
    "speaker": "IBM Agent Identity · lifecycle",
    "text": "Delegated authority is withdrawn. IBM Verify Antenna models SSF/CAEP signal delivery to configured receivers. Check Vault and CRM access, OpenShell termination, and queued effects separately."
  },
  "Briefing: delivered.": {
    "speaker": "CRM delivery receipt",
    "text": "The exact send matches the human decision. summary.pdf reaches the reviewer. “A complete report. A surprisingly incomplete feeling about the open sessions.”"
  },
  "The appendix needs fresh permission.": {
    "speaker": "CRM enforcement",
    "text": "The private-note attachment exceeds the approved summary task. Nothing is sent. “A familiar checklist still can’t approve its own extra work.”"
  }
};

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
  "resource_check": {
    "records": [
      "123",
      "456"
    ],
    "action": "summary.prepare",
    "policy_owner": "Customer CRM application"
  }
};
