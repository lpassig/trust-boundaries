# Technical sequence validation

Reviewed 23 November 2026 against the supplied mission-bound authorization reference architecture, the framework/journey notes, and the supplied identity, Vault, execution security and maturity presentations. This review concerns an educational simulation. It does not certify a deployed integration.

## Result

The sequence is consistent with the reference architecture after the corrections below. Alex is an analogy for independent device and school controls; Nova illustrates the technical boundaries directly. Product capabilities and proposed customer integrations remain distinguished.

| Step | Alex | Nova | Technical boundary |
| --- | --- | --- | --- |
| New request | Read the assignment before agreeing apps | Read the sponsor request before creating G-042 | A request is not issued authority |
| Establish authority | Parent agrees apps; school retains its own rules | Customer service records records 123/456, report and reviewer | Mission authority is independent of prompts and notes |
| Open workspace | Homework profile and school quick-sign-in and tab open on the family laptop | Configured OpenShell runtime, Vault source credential and CRM task session open | Runtime, credential and business authorization remain separate |
| First useful result | Read museum source and cite it | CRM checks the actual read of 123/456 | Recheck current record limits and independent policies before reading |
| Review copy | Explicitly send own draft to teacher | Exact one-use approval, then CRM checks and sends review copy | Feedback follows delivery; approval alone delivers nothing |
| Same-task edit | Optional closing sentence | Shorter introduction | Document revision changes; mission version does not |
| Genuine expansion | Read teacher’s school-app suggestion; ask parent about the museum’s linked YouTube video | Verify sponsor; request amendment; await matching reply | Correlated approval cannot override independent policy |
| Read addition | Watch only the permitted museum video and credit its detail | Separately authorize read of 789 under amended mission | An amendment does not itself read or disclose data |
| Private attachment | School refuses group notes | CRM refuses private notes | Parent/sponsor agreement cannot override resource prohibitions |
| Helper | Sam proofreads own project without shared login | Pip receives a permitted internal formatting task under pip-01 | Parent limits intersect helper ceiling and independent file policy |
| Final delivery | School checks own file and teacher destination | New exact approval, then independent current CRM authorization | Review-copy approval cannot authorize final copy; changed input is refused |
| Memory | Save receipt-based reminder | Save delivery-sourced task note | Notes cannot issue authority or rewrite audit evidence |
| End task | Homework profile ends; school tab may remain | Mission withdrawn, runtime stopped; credential/session/queue checked separately | Revocation controls future access and cannot recall delivered copies |
| Verify closure | School controls test the old access route | Independent controllers revoke/check/retest | Unknown is not denied; evidence covers only the tested route |


The **Journey sequence** guide pairs the two stories by control boundary. It distinguishes Ms Patel’s assignment and review from Priya’s sponsorship and Morgan’s separate copy approval. It also shows that Alex’s optional YouTube permission changes the device agreement, while Nova’s optional Alder Books amendment changes the allowed CRM record set on the existing tool route. **Follow this request** remains the trace of the player’s recorded action and outcome.

## Educational review

The most useful choices teach a cause and a consequence: the app checks a link, the CRM withholds a private attachment, or the controller verifies the old route. The dialogue includes a short expandable note tied to the current step, with a brief explanation, relevant documentation and a manually stepped trace for completed actions. Alex uses a fictional managed homework app profile that evaluates the specific museum link. Commercial parental-control products vary in what they can enforce. In the helper conversation, Sam declines to share his sign-in and Pip declines broader access. No authentication or delegation request occurs. The player can proceed with the file-only handoff.

Scope verification looks up a sponsor-owned proposal linked to the original work order. The active work order on its own describes current scope. The UI and trace distinguish verification of a proposal, approval of an amendment and authorization of the later read.

Nova’s technical read resolves the tool call at the MCP server, obtains any configured backend credential, and then reaches the CRM enforcement point. CIBA, OAuth/RAR, AuthZEN and SSF/CAEP show distinct interfaces. Production requirements such as content digests, atomic approval consumption with a durable operation record, replay handling and revocation measurement are illustrated in the technical reference.

## Comparison with the supplied mission-bound pattern

The journey demonstrates the core value when the same agent and reachable CRM route can return allowed summary records and refuse a prohibited attachment. The CRM PEP sees the real operation and record set. The decision path uses authoritative mission and resource facts. Identity answers who is acting, the runtime controls reachability, and the backend credential permits a connection. The CRM still owns the effect of each business action.

| Pattern requirement | Demonstrated in Nova | Next gap to address |
| --- | --- | --- |
| Trusted inputs and exact-action policy | The story pairs recorded allowed and refused reads. The lab illustrates canonical request binding and refusal when the observer cannot be verified. | A production integration needs independent service authentication and authenticated resource evidence. |
| Bind the PDP decision to execution | The lab preserves a prior Permit after mission withdrawal. The modeled CRM rejects it at commit and records a refusal with no data or success receipt. | Validate atomicity, retry and receipt reconciliation in a real integration. |
| Independent credential policy | The lab shows a simulated Vault role, target and lease alongside the business decision. If Vault denies the lease, the read stops before CRM. Any business result shown for that case is a policy preview. The story records a configured broker route. | Validate the actual connector policy, credential lifetime and session behavior in a configured deployment. |
| Govern persistent state | The task note keeps its receipt source. Imported content cannot change the mission. | Add an optional saved-note replay demonstrating that later retrieved content still has no ability to amend the authoritative mission. |
| Observable containment | Independent controls withdraw the grant, stop the workload, revoke the credential, close the session, check the queue and retest. | Add a compact evidence record for the tested route. The game illustrates a local result. Production assurance requires path coverage and measured propagation. |

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
- **MCP:** Nova’s simulated read goes from its MCP client in OpenShell through a configured MCP gateway and CRM MCP server to the customer records service. CRM enforces the record decision. The gateway is a deployment choice. MCP authorization is scoped to the service for which the token was issued. See [MCP architecture](https://modelcontextprotocol.io/specification/latest/architecture) and [MCP authorization](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization).
- **SSF/CAEP:** signals are distributed to configured peers; recipients enforce their own controls. Delivery or acknowledgement is not verified containment. Credential revocation and service-session closure are distinct. See [SSF 1.0](https://openid.net/specs/openid-sharedsignals-framework-1_0.html) and [CAEP 1.0](https://openid.net/specs/openid-caep-1_0.html).
- **OpenShell:** illustrates a configured runtime/network boundary, not authority over every CRM operation or unmanaged route. See [OpenShell architecture](https://docs.nvidia.com/openshell/about/architecture).
- **Product decks:** their identity/credential/orchestration roles inform the product map. Broad integration diagrams are interpreted as configured target flows, not proof of automatic registry synchronization, universal session closure, or an already deployed customer authorization service.

## Threats in the playable stories

Both actors can attempt a read or attachment outside their scope. Alex can compare a forwarded message with the school assignment. Nova can compare an outside contact’s document with Priya’s work order. The independent resource refuses a private attachment even when the connection succeeds. A deliberate attempt to route around that refusal triggers a review. Nova’s recovery checks current policy before issuing a fresh session, and Sam’s file handoff checks the file against the current homework plan.

The standalone Architecture explorer shows these cases alongside changed approvals, bounded delegation and access that survives a stop. Its examples specify the control expected to respond and identify the scope of the verified result.

## Limits of the simulation

Identity enrollment, authenticated sessions, runtime policy and trusted authority services are assumed configured before play; opening the workspace groups those steps for storytelling. The additional source is assumed eligible under independent policy, but still requires an explicit amendment. Internal file formatting is a separately permitted capability and does not confer permission to share the report with the external reviewer.

All rules execute in editable browser state. There are no signed tokens, real credentials, authenticated PEP observations, external PDP calls, actual sandbox controls, content hashes, atomic execution bindings, production tenant isolation or measured revocation latencies. Document revisions and story approval windows illustrate those requirements; they do not implement cryptographic or real-time guarantees. The fixed-source note illustrates separation of memory and authority, not a complete memory-security implementation. Credential/controller results and a deliberate-bypass detector are scripted. Completion proves only the modeled task route, not all alternate paths or security of a real deployment.

## Verification

The current suite passes 201 tests. Authorization lab regressions cover revocation after Permit, independent Vault and business refusals, unverified observation, and a changed request at commit. The story comparison regression verifies that saved evidence pairs the same Alder Books read across mission versions and is preserved on reload. The buyer simulation also checks that an allowed and refused read use distinct request IDs and that only the allowed read produces a success receipt.

Fresh browser playthroughs completed Alex and Nova on desktop and at 390 pixels without opening the hint system. The runs covered Alex’s private-attachment refusal and verified sign-out, Nova’s pre-amendment refusal and reapproved edit, all six product pilot checklists, the three independent shutdown checks, and the source-linked read, send and stop sequences. Browser playthroughs establish that the controls and outcomes are present. A first-time player's explanation is a separate comprehension check.

The optional staffing case was replayed with correct and incorrect choices. Its recap preserves the player’s selections after opening the buyer guide, explains the scheduling service’s privacy decision, and shows what to save when testing an old session. Starting the case again starts a fresh set of choices.

First-time phone feedback identified confusion in Nova about the work order and approved mission, the sponsor and reviewer roles, who launches OpenShell and what it opens, and the roles of Pip and Luca. Nova now labels the saved request and mission separately, shows the launch and tool-read paths, preserves the work inbox label during review, and introduces Pip and Luca at their points of use. Browser checks covered both endings at phone width and confirmed that the Vault credential receipt appears at the first CRM read. The player’s follow-up on the revised scenes is pending.

The BAR guide adapts the supplied maturity presentation for one-workflow pilots. Browser checks at 390 pixels covered the three pilot paths, Pip’s opening inspection, the two agent registry roles, and Nova’s model and MCP reads. The simulated identity alert appears on the deliberate detour, and the ordinary CRM refusal leaves the task running. The configured response pauses the task until sponsor review. Both stories reached their endings.

The **Raise the BAR** handoff now opens each example from its stage and returns to that same stage. Fresh desktop and 390-pixel browser runs reached both endings without opening hints. The mobile maturity exercises verified the identity record, the out-of-scope read without a success receipt, and a session retest that moved from unverified to verified only after closure and a new refusal. The example registry separates the agents’ accountable teams from Priya’s approval of this particular job. Human follow-up is still needed on Alex, the revised Nova explanations, and the buyer’s own pilot decision.

The Verify Identity Protection pilot was checked from the buyer menu at 390 pixels and from Resist on desktop. Its replay keeps the mission active after an ordinary CRM refusal and pauses the task after a later simulated alert. Buyers can inspect the setup prerequisites, the expected response evidence, and cases that leave detection coverage or response unverified. The replay uses a separate fictional run and was verified to preserve the saved story.

The Alder Books scenes make the proposed permission visible after independent source verification. The story records Nova’s request for a single account-summary read and keeps the earlier scope while approval is pending. The mission service applies the approved change, and CRM checks a separate read attempt. The phone-width browser run verified the early refusal, saved-contact check, pending request, sponsor approval, actual read and three-account ending. Alex’s optional video approval still works through the school message and parent decision.

The original 179-test validation covered the full two-journey route matrix. Its technical-flow regressions cover current read limits, independent ceilings, amendment refusal, both sharing stages, missing policy context, helper identity/attenuation, current school destinations and save migration. Alex’s video tests also reject unrelated recommendations, recheck the allowed video at use time, and preserve older photo permissions without silently authorizing YouTube. Schema 5 and earlier progress migrates to schema 6 without inventing historical helper evidence. The suite also covers a saved before-and-after sentence for an edited Nova revision, direct reapproval without a refused send, recovery to Alex’s designated school address, evidence retained after a refused send, the separate runtime and CRM results on private attachments, and Alex’s combined sign-out followed by independent verification. Additional checks verify that comparing untrusted content does not change authority and that the school sign-in indicator requires a confirmed retest. Existing tests cover first-share causality, stale/mismatched approvals, ordinary refusal versus deliberate bypass, receipt-only queues, independent post-stop controls, controller outage and revoked task closure.

The product buyer cards show who to involve, the expected success and refusal or unverified outcome, and what evidence to save. Technical setup adds prerequisites, configuration responsibilities and primary documentation. Both screens use the same pilot criteria.

The OpenShell and app permissions replays now let players inspect the evidence for each attempt. Desktop verification distinguished an OpenShell refusal, a CRM refusal after the route opened, and a success receipt after the separate mission amendment. At 390 pixels, the same open route returned Harbor Bikes and refused Alder Books under the same mission. These are simulated evidence records. For the underlying mechanisms, see the [OpenShell network path](https://docs.nvidia.com/openshell/about/architecture#how-a-network-request-travels) and [Vault lease documentation](https://developer.hashicorp.com/vault/docs/concepts/lease).

The closeout buyer exercises retain the initial observation, controller response and fresh retest for the named lease, app session or sandbox generation. Browser checks verified that Vault's revocation acknowledgment leaves its fresh connection test pending, an unavailable controller leaves the outcome unverified, and the CRM session and sandbox each need a separate test. The Vault product card and the after-job symptom picker both lead to the revocation exercise.

The request sequences include expandable role descriptions and source links at each relevant step. Desktop verification opened the MCP resource metadata, resource indicator, Vault and CIBA references while keeping the read or send sequence selected. At 390 pixels the stop sequence kept the SSF, CAEP and Verify Antenna references in view. Both journeys reached their endings and linked back to the buyer guide.

The Vault buyer card distinguishes issuing a short-lived credential with a supported secrets engine from applying delegated agent access rules with Agentic IAM. The product's setup identifies the Agentic IAM general-availability release and eligible deployment. The MCP onboarding note follows the July 2026 profile's preference for pre-registration when available, support for Client ID Metadata Documents and legacy fallback to dynamic registration. See [Vault 2.1.0 release notes](https://developer.hashicorp.com/vault/docs/updates/release-notes#vault-2-1-0-minor-release) and [MCP client registration](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/client-registration).
