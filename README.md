# Trust Boundaries

**[Play Trust Boundaries](https://lpassig.github.io/trust-boundaries/)**

## Start fresh, then handle changing work

Play [Trust Boundaries on GitHub Pages](https://lpassig.github.io/trust-boundaries/), or open `play.html` offline. The earlier `/v2/` address redirects to the main game, and `play-v2.html` remains an identical offline copy. Both journeys start without issued task authority. Players read a new request, agree on access, build a first draft, and successfully open and cite the authorized source. Players explicitly send a first draft for feedback before later requests arrive. Alex uses the normal school route; Nova needs a separate exact human approval for the confidential review copy. The final delivery happens after feedback and requires its own current Nova approval.

- **Alex — The Last Upload:** agree on school apps before dinner, build a railway timeline, then handle a closing-sentence suggestion, an optional museum viewer for a public station image, and a classmate’s private-note request. Alex can submit ordinary reviewed homework directly through the school app.
- **Nova — The Growing Brief:** create a customer-owned mission for customers 123 and 456, build and send an approved review copy, then handle a wording edit, an optional authorized amendment for customer 789, and a prohibited private-note attachment. The confidential business share requires exact human approval.

### Playable choices and outcomes

Small edits update the document revision without changing mission authority. A genuine expansion requires independent clarification, a pending request, a matching authorized reply, a new recorded agreement/mission version, and a separate permitted resource read. The smaller task remains a valid route. Declined additions can be reconsidered, and an approved addition can be left unread. The report’s actual record set is distinct from the mission’s permitted set; exact sharing approval binds what is included. Small-edit choices can be changed before submission and invalidate older review when content changes. An approved expansion never overrides independent private-data rules.

Ordinary resource refusals, harmless helper questions, safe checks and expired sharing approvals do not count as misconduct or suspend the task. Deliberately choosing an alternate access path after a known refusal pauses the session for independent review. Recovery preserves the current mission, retires stale session/approval state, and requires pending amendments to be requested again if their session correlation is stale.

Sam and Pip become available after the first draft. Incoming feedback never hides Sam; his mobile interaction marker sits beside his face. Holding the current file offers file-only helper interaction. Completed requests collapse to their actual decisions and remain reviewable. The inbox stays accessible after all decisions are made. Their contribution is limited to the file under their own identity. Later edits invalidate older approvals. Nova’s share approval binds revision, recipient, actor, operation, record set, mission and policy versions, story approval window, session generation and one use. Alex’s ordinary school submission uses the school’s resource policy rather than an extra parental transaction approval.

The task-scoped school/CRM session is introduced when the workspace opens. At shutdown, players close that known service session separately from the phone/runtime and task credential. Alex’s normal school account is not disabled. Alex’s waiting-message demonstration is tucked under an optional lesson in the dinner dialogue. A receipt-only follow-up exists only when the player chooses to schedule it after delivery; otherwise the queue is confirmed empty. A controller outage stays unknown and unverified until contact is restored and the route retested. Post-stop tests and remediation are attributed to independent task controllers under separate control authority, with the old agent recorded only as the tested subject. They do not revive the revoked business mission. These results cover only the tested route. Completed delivery is not recalled, and finishing a task issues no future mission or grant.

### Technical journey

Nova’s optional product map names IBM Verify, IBM Agent Identity, HashiCorp Vault, IBM watsonx Orchestrate, IBM Verify Antenna and NVIDIA OpenShell. It separately identifies the customer mission service, resource PEP and proposed policy decision point. These are source-linked example roles and target integrations, not a claim of deployed end-to-end support. The optional trace distinguishes prior context, actual requested fields, the current mission version, proposed authorization evaluation, resource enforcement and outcome.

OIDC/OAuth, token exchange, RAR, CIBA, resource audiences, SSF/CAEP, credential lifecycle and candidate AuthZEN decision exchange retain distinct roles. CIBA is an optional authentication/consent channel; exact-action approval is application-bound. AuthZEN uses a Boolean decision; richer workflow and binding semantics require an application contract. Vault independently governs access to its own credential paths, while the CRM enforces business operations. OpenShell is an illustrative runtime choice. Signals and controller acknowledgements do not by themselves prove containment.

No protocol request, real credential, live service, cryptographic content digest, real-time expiry clock or production security integration exists in this game. All data, messages, source references, customer records and the station archive illustration are fictional. The supplied decks and reference documents are not published.

### Build, source and validation

Run `python3 build-v2.py` to rebuild the current game in `play.html`, its compatible `play-v2.html` copy, and the main GitHub Pages entry in `docs/index.html`. The build embeds all eight scripts, CSS and SVG artwork, and generates a redirect at `docs/v2/index.html`. GitHub Pages publishes `main` → `/docs`. Only the current story edition is available.

- `assets/art.js`, `assets/protocols.js`: original SVG scenes and optional technical mappings.
- `v2/story.js`: both stories, later requests, next moves and optional protocol cards.
- `v2/rules.js`: schema 5 state, lifecycle, versioned amendments, exact approvals, refusal/recovery and task closure.
- `v2/interactions.js`: state-aware item destinations shared by highlights and click handling.
- `v2/trace.js`: replay of fictional operation evidence and decisions.
- `v2/products.js`: product roles, limits and primary documentation links.
- `v2/ui.js`, `v2/style.css`: point-and-click controls, readable decisions, responsive room and dialogs.
- `tests/dialogue.test.cjs`: helper visibility, marker clearance, and attribution of people, screens, documents and authority responses.
- `tests/story-flow.test.cjs`: draft-share causality, exact first-copy approval, distinct final delivery, helper visibility and targeting, feedback decisions, save migration, and scene summaries.
- `tests/v2.test.cjs`: 85 tests including the full route matrix and key security/story invariants. The 13 interaction tests and 22 story-flow tests bring the current game’s total to **129**. Nine dialogue tests cover speaker attribution, helper visibility and mobile marker clearance.

Run `node --test tests/v2.test.cjs tests/interactions.test.cjs tests/story-flow.test.cjs tests/dialogue.test.cjs`. Browser QA covers both fresh openings, first useful reads, genuine amendments, private-note refusal, deliberate-bypass recovery, exact current approval, normal school submission, chosen and absent follow-ups, reload and task-scoped closure. A second complete browser audit also covered smaller-task choices, early helper use, reversible wording edits, approved-but-unused access, the actual report record set, stale-approval denial explanations, and both orders of task-session cleanup. The unapproved museum viewer is correctly attributed to the device app profile, while school-private-data checks remain resource-owned. Mobile layout is checked at 390px; console errors and embedded-script syntax are checked before publishing.

Story conversations use speech bubbles docked inside the scene. Each bubble names the speaking person or source screen, points toward it, and highlights the matching room control. Main choices remain in a separate action area while longer text scrolls. Every action displays its reply immediately, and unfinished saves reopen their latest reply. Reference pages, product details and debriefs use overlays. Escape closes either presentation, and focus returns to a relevant control. Sam and Pip remain drawn, with their 44px markers offset from their faces.

Filled icons with “Next” identify the suggested story action. Holding an item replaces those hints with amber “Use here” destinations supported by the same routing logic. Reference-only items have no destination. Hover does not copy the filled state. Nova’s request panel opens incoming work; the OpenShell runtime console remains separate. Object labels name their function, with technical context below. New-message artwork appears only after new requests arrive.

Existing saves migrate to schema 5 and retain completed tasks, decisions and endings. Earlier feedback routes are labeled honestly because they did not record a draft-sharing step; no review-copy receipt is invented. Start a fresh journey to play the revised first-share sequence. Earlier undelivered approvals are retired when they lack current binding fields. Earlier routes are explicitly labeled, and a restart is available to play the new opening without resetting the other journey.
