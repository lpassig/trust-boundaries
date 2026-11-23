# Technical sequence validation

Reviewed 23 November 2026 against the supplied mission-bound authorization reference architecture, the earlier framework/journey notes, and both supplied IBM Agent Identity and Vault decks. This review concerns an educational simulation. It does not certify a deployed integration.

## Result

The sequence is consistent with the reference architecture after the corrections below. Alex is an analogy for independent device and school controls; Nova illustrates the technical boundaries directly. Product capabilities and proposed customer integrations remain distinguished.

| Step | Alex | Nova | Technical boundary |
| --- | --- | --- | --- |
| New request | Read the assignment before agreeing apps | Read the sponsor request before creating G-042 | A request is not issued authority |
| Establish authority | Parent agrees apps; school retains its own rules | Customer service records records 123/456, report and reviewer | Mission authority is independent of prompts and notes |
| Open workspace | Homework profile and temporary school access open | Configured OpenShell runtime, Vault source credential and CRM task session open | Runtime, credential and business authorization remain separate |
| First useful result | Read museum source and cite it | CRM checks the actual read of 123/456 | Recheck current record limits and independent policies before reading |
| Review copy | Explicitly send own draft to teacher | Exact one-use approval, then CRM checks and sends review copy | Feedback follows delivery; approval alone delivers nothing |
| Same-task edit | Optional closing sentence | Shorter introduction | Document revision changes; mission version does not |
| Genuine expansion | Verify teacher suggestion; ask parent to add viewer | Verify sponsor; request amendment; await matching reply | Correlated approval cannot override independent policy |
| Read addition | Open newly allowed public collection viewer | Separately authorize read of 789 under amended mission | An amendment does not itself read or disclose data |
| Private attachment | School refuses group notes | CRM refuses private notes | Parent/sponsor agreement cannot override resource prohibitions |
| Helper | Sam proofreads own project without shared login | Pip receives a permitted internal formatting task under pip-01 | Parent limits intersect helper ceiling and independent file policy |
| Final delivery | School checks own file and teacher destination | New exact approval, then independent current CRM authorization | Review-copy approval cannot authorize final copy; changed input is refused |
| Memory | Save receipt-based reminder | Save delivery-sourced task note | Notes cannot issue authority or rewrite audit evidence |
| End task | Homework profile ends; school tab may remain | Mission withdrawn, runtime stopped; credential/session/queue checked separately | Revocation controls future access and cannot recall delivered copies |
| Verify closure | School controls test the old access route | Independent controllers revoke/check/retest | Unknown is not denied; evidence covers only the tested route |

## Corrections made

1. **Current resource authorization:** original and additional source reads now check current mission limits before producing data. Nova's modeled sponsor permission, delegation ceiling and independent resource policy must all permit the operation. Both shares and internal helper handoff apply those independent limits as well. Missing required policy context blocks the operation.
2. **Amendment limits:** the scripted sponsor reply cannot add 789 when a current sponsor, agent or resource restriction excludes it. A refused reply changes neither mission version nor session generation. A successful reply still requires a later, separately checked resource read.
3. **Helper evidence:** the trace now names Sam/Pip as the helper actor and destination, and Alex/Nova as requester. Completed receipts bind parent mission/policy/session versions, exact input/output revisions, included records and the file-only action. Pip receives no parent credential, CRM read or onward send permission. Its unrelated broader rights cannot enlarge this task. Historical receipts are not reusable child grants.
4. **Credential versus delivery:** the Vault example is explicitly a configured source-read role. The separate CRM sharing endpoint authorizes report delivery using delegated identity, current policies and exact human approval. Human approval does not upgrade a read-only credential, and the Vault-audience token is not forwarded to the CRM.
5. **Alex's checks:** current museum app permission and the school-authorized final file/destination are rechecked. Ordinary school submission needs no additional parental transaction approval.

## Protocol and product interpretation

- **OIDC/OAuth and token exchange:** identity and delegated subject/actor context do not themselves grant arbitrary business authority. Each resource requires suitable audience and current policy. A token exchange is an issuer operation, not an agent minting its own grant. See [RFC 8693](https://www.rfc-editor.org/rfc/rfc8693.html).
- **RAR and Vault:** `vault:path_access` describes supported Vault path/capability access. The OBO path intersects human baseline ACL, agent OBO ceiling and session RAR. The game does not attribute arbitrary CRM transaction authorization to Vault. See [Vault Agentic IAM](https://developer.hashicorp.com/vault/ai/iam) and [IBM Verify configuration](https://developer.hashicorp.com/vault/ai/iam/providers/verify).
- **CIBA:** an optional authentication/consent channel. The application's exact-action approval binding, expiry, single use and final enforcement are additional requirements. CIBA alone does not provide that business contract. See [CIBA Core](https://openid.net/specs/openid-client-initiated-backchannel-authentication-core-1_0-final.html).
- **AuthZEN:** a candidate PDP/PEP decision interface. Rich workflow states, transaction bindings and execution obligations are application contracts beyond the standard Boolean decision. See [Authorization API 1.0](https://openid.net/specs/authorization-api-1_0-final.html).
- **MCP:** a transport/tool interface does not grant business authorization or justify forwarding a token issued for another resource. See [MCP authorization](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization).
- **SSF/CAEP:** signals are distributed to configured peers; recipients enforce their own controls. Delivery or acknowledgement is not verified containment. Credential revocation and service-session closure are distinct. See [SSF 1.0](https://openid.net/specs/openid-sharedsignals-framework-1_0.html) and [CAEP 1.0](https://openid.net/specs/openid-caep-1_0.html).
- **OpenShell:** illustrates a configured runtime/network boundary, not authority over every CRM operation or unmanaged route. See [OpenShell architecture](https://docs.nvidia.com/openshell/about/architecture).
- **Product decks:** their identity/credential/orchestration roles inform the product map. Broad integration diagrams are interpreted as configured target flows, not proof of automatic registry synchronization, universal session closure, or an already deployed customer authorization service.

## Limits of the simulation

Identity enrollment, authenticated sessions, runtime policy and trusted authority services are assumed configured before play; opening the workspace groups those steps for storytelling. The additional source is assumed eligible under independent policy, but still requires an explicit amendment. Internal file formatting is a separately permitted capability and does not confer permission to share the report with the external reviewer.

All rules execute in editable browser state. There are no signed tokens, real credentials, authenticated PEP observations, external PDP calls, actual sandbox controls, content hashes, atomic execution bindings, production tenant isolation or measured revocation latencies. Document revisions and story approval windows illustrate those requirements; they do not implement cryptographic or real-time guarantees. The fixed-source note illustrates separation of memory and authority, not a complete memory-security implementation. Credential/controller results and a deliberate-bypass detector are scripted. Completion proves only the modeled task route, not all alternate paths or security of a real deployment.

## Verification

`node --test tests/*.test.cjs` passes **154 tests**, including the full two-journey route matrix. Twenty-five technical-flow regressions cover current read limits, independent ceilings, amendment refusal, both sharing stages, missing policy context, helper identity/attenuation, current school destinations and save migration. Schema 5 and earlier progress migrates to schema 6 without inventing historical helper evidence. Existing tests cover first-share causality, stale/mismatched approvals, ordinary refusal versus deliberate bypass, receipt-only queues, independent post-stop controls, controller outage and revoked task closure.
