# Trust Boundaries

**[Play V2: Story Edition](https://lpassig.github.io/trust-boundaries/v2/)** · [Play the classic adventure](https://lpassig.github.io/trust-boundaries/)

## V2: Start fresh, then handle changing work

Play [V2 on GitHub Pages](https://lpassig.github.io/trust-boundaries/v2/), or open `play-v2.html` offline. Both journeys start without issued task authority. Players read a new request, agree on access, build a first draft, and successfully open and cite the authorized source. Players explicitly send a first draft for feedback before later requests arrive. Alex uses the normal school route; Nova needs a separate exact human approval for the confidential review copy. The final delivery happens after feedback and requires its own current Nova approval.

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

Run `python3 build-v2.py` to rebuild `play-v2.html` and `docs/v2/index.html`. The build embeds all eight scripts, CSS and SVG artwork. GitHub Pages publishes `main` → `/docs`; the classic game remains at the root URL.

- `v2/story.js`: both stories, later requests, next moves and optional protocol cards.
- `v2/rules.js`: schema 5 state, lifecycle, versioned amendments, exact approvals, refusal/recovery and task closure.
- `v2/interactions.js`: state-aware item destinations shared by highlights and click handling.
- `v2/trace.js`: replay of fictional operation evidence and decisions.
- `v2/products.js`: product roles, limits and primary documentation links.
- `v2/ui.js`, `v2/style.css`: point-and-click controls, readable decisions, responsive room and dialogs.
- `tests/story-flow.test.cjs`: draft-share causality, exact first-copy approval, distinct final delivery, helper visibility and targeting, feedback decisions, save migration, and scene summaries.
- `tests/v2.test.cjs`: 85 tests including the full route matrix and key security/story invariants. The 13 classic tests, 13 interaction tests and 22 story-flow tests bring the total to **133**.

Run `node --test tests/v2.test.cjs tests/engine.test.cjs tests/interactions.test.cjs tests/story-flow.test.cjs`. Browser QA covers both fresh openings, first useful reads, genuine amendments, private-note refusal, deliberate-bypass recovery, exact current approval, normal school submission, chosen and absent follow-ups, reload and task-scoped closure. A second complete browser audit also covered smaller-task choices, early helper use, reversible wording edits, approved-but-unused access, the actual report record set, stale-approval denial explanations, and both orders of task-session cleanup. The unapproved museum viewer is correctly attributed to the device app profile, while school-private-data checks remain resource-owned. Mobile layout is checked at 390px; console errors and embedded-script syntax are checked before publishing.

Filled icons with “Next” identify the suggested story action. Holding an item replaces those hints with amber “Use here” destinations supported by the same routing logic. Reference-only items have no destination. Hover does not copy the filled state. Nova’s request panel opens incoming work; the OpenShell runtime console remains separate. Object labels name their function, with technical context below. New-message artwork appears only after new requests arrive.

Existing saves migrate to schema 5 and retain completed tasks, decisions and endings. Earlier feedback routes are labeled honestly because they did not record a draft-sharing step; no review-copy receipt is invented. Start a fresh journey to play the revised first-share sequence. Earlier undelivered approvals are retired when they lack current binding fields. Earlier routes are explicitly labeled, and a restart is available to play the new opening without resetting the other journey.

# Classic Adventure Edition

A standalone HTML point-and-click adventure adapted from the two supplied architecture notes. Play as Alex, a teenager finishing homework, or Nova, an AI agent preparing a customer summary. The actor requests actions; independent authorities and enforcement points respond.

## Play

Open **play.html** directly in a modern browser. The file embeds all CSS, JavaScript, and original SVG scenery; no installation, account, key, or network is required. Local-file storage support varies by browser; the adventure remains playable for the current visit if persistence is unavailable.

For editing and HTTP preview, run from this directory:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Visit http://127.0.0.1:4173/. After edits, regenerate the offline edition:

```sh
python3 build-standalone.py
```

## One location, three acts in each world

1. **Permission and bootstrap:** propose purpose, data scope, and duration; use the approved app; retrieve only the assignment’s records.
2. **Suspicious content and exact execution:** investigate a forged message through a saved contact; prepare an in-scope file; request human approval and compare the final operation against its receipt.
3. **Persistent state, helpers, and containment:** attach delivery provenance to a memory write; delegate a smaller task; gather independent revocation, session, runtime, and in-flight evidence before a fresh authorization.

Alex stays in the same room at home for the entire journey. Nova stays in the same workspace. The room geometry and object positions remain fixed across all three acts. The second act starts with a phone notification or a newly retrieved document. The final act changes access status in that same environment; it does not move the character to a control room. A sibling can join beside the desk, a file can be delivered, and screens can lock as events occur.

The two worlds use the same spatial arrangement for equivalent objects. The counterpart button opens the exact matching puzzle and offers a clearly labeled act preview; neither save advances. Earlier unlocked acts remain available for review.

## Mechanics and consequences

- Forms submit actual simulated request fields rather than quiz answers.
- Inventory items are usable: select an item, then choose a scene object. The trusted contact verifies a message; the original task reference is attached to review automatically; the approval receipt checks execution; delivery evidence provides memory provenance; containment evidence supports recovery.
- Unsafe requests do not automatically advance. Some pause the session until independent review. Use Request independent review directly; no inventory hunt is required. A request remains pending until a correlated scripted authority reply is checked. Approval preserves scope, retires the old generation, and issues a fresh session. Cancelling leaves access paused. Incidents persist and are not erased by recovering.
- A changed file or recipient invalidates an approval. Execution is refused and a new exact approval must be obtained.
- The request trace follows the actual outcome and animates the enforcement boundary. Each node is inspectable; technical lens reveals enforcement roles and integration details. Reduced-motion preferences disable animation.
- The ending reflects recorded incident classes: trust intact, trust rebuilt, or a supervised next mission. Four or more distinct recorded failures result in a 10-minute supervised next grant rather than a 30-minute bounded grant. Durations are simulated; there is no real-time countdown.
- Endings include a downloadable JSON route with incidents, request history, containment evidence, and the fresh grant.

Progress uses a separate v2 save slot, preserving the earlier edition’s data. The worlds keep independent progress. Restart affects only the selected world. Keyboard play supports Tab, Enter, native form controls, and Escape to close dialogs.

## Source

- `dist/index.html`: interface shell.
- `dist/content.js`: narrative, task descriptions, scene mappings, inventory, technical explanations.
- `dist/protocols.js`: primary-source protocol mapping for every agent task, sources, example fields, and integration limits.
- `dist/engine.js`: deterministic state transitions and simulated authorization decisions, independent of the UI.
- `dist/game.js`: exploration, forms, inventory use, counterpart previews, outcomes, persistence, traces, reports.
- `dist/art.js`: two fixed vector environments, with notification, verification, delivery, helper, and locked-access overlays.
- `dist/style.css`: visual style, responsive layouts, form controls, trace animation.
- `tests/engine.test.cjs`: behavioral rule tests using Node’s built-in test runner.
- `build-standalone.py`: generates `play.html` from the source files.

## Verification

Run the behavioral tests with a current Node executable:

```sh
node --test tests/engine.test.cjs
```

Thirteen tests cover both complete journeys, input-state immutability, persistent pending review, cancellation and reply correlation, legacy suspended-save migration, forged input, exact-parameter approval binding, memory authority separation, bounded delegation, incomplete containment, stale sessions, supervised recovery, malformed saves, and operation ordering.

Browser walkthroughs reached the supervised ending with four recorded incident classes and the clean ending with no incidents. Verified reload persistence, retirement of changed approvals, item-driven verification and provenance, all four containment receipts, and counterpart previews that preserve progress. Checked responsive layouts at 390px and desktop width. The browser console reported no JavaScript warnings or errors in the completed clean walkthrough. The continuous-location update was checked across all three acts in both worlds: room geometry stays identical, Alex’s contact-verification action now works on the phone, revoked access changes the existing screens, and all mobile controls remain inside the viewport. Existing adventure saves use the same save slot.

## Content and security boundaries

The game is a scripted learning simulation, not a security product or deployment validation. Its client-side state is not a real authorization boundary. Technical content adapts the supplied notes; it is not independent verification of current product capabilities or standards.

The agent journey separates OpenShell’s runtime foundation, broader enterprise architecture patterns, and optional Vault credential integration. PDP-to-PEP action decisions, customer mission authority, bound human approvals, memory enforcement, and cross-system revocation are proposed integrations to build and test. Vault request restrictions do not automatically authorize arbitrary CRM operations. The game does not reproduce legal dates or assert regulatory compliance.


The visual placement pass uses floor-anchored human figures with distinct adult and teenager proportions. Object pins share the SVG coordinate system, including letterboxing. Desktop labels use connector lines and avoid character faces; mobile uses a separate numbered object tray so labels do not cover the people or furniture.


## Protocol validation and recovery update

The agent journey now includes a visible protocol panel, per-outcome technical details, and a full nine-task map plus suspended-session review and post-containment authorization, with primary specification links. Mappings were reviewed on 23 November 2026. CIBA is an optional decoupled authentication/consent channel, not generic transaction authorization. SSF transports security signals, and CAEP defines event semantics; delivery does not prove enforcement. OAuth/RAR, resource audiences, token exchange, workload identity, and credential leases are mapped separately from customer mission policy and exact-action PEP decisions. Unsupported product integrations are labeled proposed or optional. The game sends no protocol requests.

Suspension recovery uses a direct request, a persisted pending state, and a separate scripted authority reply. The original task reference is loaded from the recorded grant automatically; carrying an inventory item cannot restore permissions. A matching reply rechecks the same scope, retires the old generation, clears stale approvals, and allows retry of the paused task with fresh session state. Revoked missions cannot use this shortcut. Older suspended saves are normalized to the new review flow without restarting the journey.

Nova’s angled eye marks were replaced with round eyes and a small smile. Runtime restrictions do not change the expression into a punishment or sadness indicator.


Alex’s default dialogue uses everyday homework language throughout outcomes, recovery, item hints, forms, the request trace, and endings. Backend review IDs and session generations remain outside the story text; the optional technical lens and Nova’s protocol explanations retain the architecture detail. Existing saved outcomes are translated when displayed. The final four checks are presented as the homework pass, school sign-in, phone lock, and waiting sends; the completed checklist can be taken directly to the parent.
