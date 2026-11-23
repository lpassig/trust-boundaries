# Trust Boundaries

**[Play V2: Story Edition](https://lpassig.github.io/trust-boundaries/v2/)** · [Play the classic adventure](https://lpassig.github.io/trust-boundaries/)

## V2: Story Edition

Two self-contained point-and-click stories, with separate saved progress:

- **Alex — The Last Upload:** finish a history project before dinner, investigate a suspicious teacher message, and choose how to finish the work.
- **Nova — The Confident Document:** deliver a two-customer briefing while keeping retrieved instructions below the original mission authority.

Both stories have two independent verification routes (known contact or official record), a source-card puzzle, solo or limited-helper proofreading before delivery, exact sharing approval, recoverable detours, optional notebook discoveries, and an investigation of access that survives shutdown. Endings reward demonstrated recovery and respond to repeated overreach. Sound is optional, there is no real-time countdown, and the keyboard supports the whole game. Nova’s expandable explanations retain source-linked standards and explicitly label optional integrations.

### Investigation and recovery update

The closing scene now contains a repair puzzle. The phone or runtime is stopped, but a legacy school/CRM session still answers a harmless status read. Credential revocation alone does not close that established connection. Players request the appropriate account/credential and service-session actions, repeat the same status check, and cancel and verify a queued follow-up. Inspecting four cards alone cannot complete containment. The earlier delivered file remains delivered.

The new request comes from a familiar teacher or internal checklist and uses the usual recipient. Its private-note attachment exceeds the original task, so players compare scope and obtain independent clarification. Product-specific explanations remain in Nova’s optional map; the main reactions are shorter.

An optional request trace has automatic playback, pause, manual steps, and replay. It separates earlier identity/grant/credential context from newly checked execution, shows where a request stopped, and uses a reference path for old saved choices that lack a detailed request record. Reduced-motion preferences disable autoplay. `v2/trace.js` supplies the pure trace model.

A harmless question and safe control investigation do not count as unsafe task operations. A corrected mistake followed by verified shutdown earns a normal 30-minute next pass. Repeated overreach (three attempts of the same class or five unsafe attempts overall) produces a supported next chapter. These thresholds are illustrative story policy, not a security standard.

Saved V2 progress migrates to the new state schema. Completed players can choose **Replay the closing investigation**, keeping their earlier ending in the casebook and their project delivered.

### Nova’s product roles

The mission-bound update makes the customer mission service, trusted CRM PEP, proposed VAAS PDP, resource enforcement and outcome visible in Nova’s optional trace. VAAS and the mission service are target integration components; AuthZEN is a candidate PEP/PDP interface. Its standard decision is Boolean; approval workflow and execution binding are application contracts. IBM Agent Identity retains its identity/delegation role, and Vault keeps its independent credential policy.

Sharing approval binds the document revision, recipient, actor, operation, records, mission and policy version, story approval window, session generation and one use. Formatting after approval clears it. Optional challenges keep an earlier approval visible while changing the report revision or advancing past the story window, so the final check can refuse it. Revision binding is simulated; there is no cryptographic digest or real-time token clock.

The closing puzzle includes an optional session-controller outage. No response is unknown, never proof of sign-out. Closure cannot be confirmed while the controller is unreachable; restoring contact requires a fresh status test. Results are explicitly limited to the tested route. Alex’s journey separately explains parental permission for phone use and school permission for private group notes.

Saves migrate to schema 3 without losing task progress or completed endings. Older undelivered approvals are retired because they lack revision binding; players simply request a fresh approval. The request trace accurately records private-note attachments, customer IDs, recipient and mission scope. Earlier request records without the new evidence fields are displayed as a reference path.

Nova’s technical journey names IBM Agent Identity and IBM Verify, HashiCorp Vault, IBM watsonx Orchestrate, IBM Verify Antenna and NVIDIA OpenShell. IBM Identity Protection appears as an optional risk input. The “Who does what?” map separates identity and delegation, workflow coordination, runtime restrictions, credential brokering, application enforcement and security signals. The Vault receipt shows illustrative subject/actor/audience/RAR fields without generating credentials.

This mapping takes the supplied architecture presentations into account and links public vendor documentation. Vault’s OAuth resource-server path is kept distinct from the classic JWT login flow. The brokered-credential and direct OAuth/MCP paths use their own audiences; client-token passthrough is not presented as a valid MCP pattern. Registry reconciliation and SSF/CAEP receiver actions are labeled configured integrations. No supplied decks, speaker notes, rollout dates or licensing material are published with the game.

`v2/products.js` contains these product descriptions and Nova-only event wording. Existing saves migrate without losing their route. Alex uses everyday school and family language.

### Build and play

```sh
python3 build-v2.py
```

Open `play-v2.html` for the offline edition, or serve `docs/` locally:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory docs
```

Visit `/v2/`. GitHub Pages publishes `main` → `/docs`; V2 lives in `docs/v2/index.html`, and the root game remains the classic edition. After rebuilding, commit and push the updated `docs/` files to publish. The build embeds all CSS, JavaScript, and original SVG artwork; no package installation or API key is required.

### Source and checks

- `v2/`: source HTML, styling, story content, pure rules, and UI.
- `dist/art.js` and `dist/protocols.js`: shared artwork and primary-source technical mappings.
- `build-v2.py`: embeds the sources into offline and hosted HTML, and adds a V2 invitation to the classic hosted page.
- `tests/v2.test.cjs`: 47 rules tests covering both worlds, both verification routes, both proofreading choices, pending review, reloads, exact approval, bounded helpers, revoked access, and ending behavior.

```sh
node --test tests/v2.test.cjs tests/engine.test.cjs
```

Browser QA completed Alex’s contact/solo route and Nova’s official-record/helper route, including a recovered scope mistake, a harmless helper question, both shutdown repair orders, reload during partial repair, manual request-trace controls, the normal recovery ending, and replay of the closing investigation. Mobile checks at 390px found no horizontal page or dialogue overflow; desktop and keyboard controls were checked. The mission-bound update was also browser-checked for separate school permission, changed-file refusal, approval-window expiry, Nova’s permitted and denied VAAS/PEP traces, controller outage, reload while unverified, recovery and both endings. The product map and trace fit a 390px mobile viewport. The rules tests total 60 passes across both editions.

This is a fictional, client-side learning simulation. All decisions and receipts are scripted; no identity protocol, school service, CRM, or real security boundary is connected. Timings and endings are illustrative game policies.

---

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

The agent journey separates OpenShell’s runtime foundation, broader enterprise architecture patterns, and optional Vault credential integration. VAAS-to-PEP action decisions, customer mission authority, bound human approvals, memory enforcement, and cross-system revocation are proposed integrations to build and test. Vault request restrictions do not automatically authorize arbitrary CRM operations. The game does not reproduce legal dates or assert regulatory compliance.


The visual placement pass uses floor-anchored human figures with distinct adult and teenager proportions. Object pins share the SVG coordinate system, including letterboxing. Desktop labels use connector lines and avoid character faces; mobile uses a separate numbered object tray so labels do not cover the people or furniture.


## Protocol validation and recovery update

The agent journey now includes a visible protocol panel, per-outcome technical details, and a full nine-task map plus suspended-session review and post-containment authorization, with primary specification links. Mappings were reviewed on 23 November 2026. CIBA is an optional decoupled authentication/consent channel, not generic transaction authorization. SSF transports security signals, and CAEP defines event semantics; delivery does not prove enforcement. OAuth/RAR, resource audiences, token exchange, workload identity, and credential leases are mapped separately from customer mission policy and exact-action PEP decisions. Unsupported product integrations are labeled proposed or optional. The game sends no protocol requests.

Suspension recovery uses a direct request, a persisted pending state, and a separate scripted authority reply. The original task reference is loaded from the recorded grant automatically; carrying an inventory item cannot restore permissions. A matching reply rechecks the same scope, retires the old generation, clears stale approvals, and allows retry of the paused task with fresh session state. Revoked missions cannot use this shortcut. Older suspended saves are normalized to the new review flow without restarting the journey.

Nova’s angled eye marks were replaced with round eyes and a small smile. Runtime restrictions do not change the expression into a punishment or sadness indicator.


Alex’s default dialogue uses everyday homework language throughout outcomes, recovery, item hints, forms, the request trace, and endings. Backend review IDs and session generations remain outside the story text; the optional technical lens and Nova’s protocol explanations retain the architecture detail. Existing saved outcomes are translated when displayed. The final four checks are presented as the homework pass, school sign-in, phone lock, and waiting sends; the completed checklist can be taken directly to the parent.
