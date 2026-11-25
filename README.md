# Trust Boundaries

**[Open the public game](https://lpassig.github.io/trust-boundaries/)** or open the local release candidate in `play.html` offline.

Trust Boundaries is an independent educational game about who grants access, what tools enforce and how to verify that access ended. Alex learns these ideas at home. Nova follows an IBM Identity Protection alert through an enterprise railway investigation. The current source identifies its release candidate in the application-version metadata in `v2/index.html`.

**Home** shows both journeys at each stage of the Raise the BAR maturity model. Start with **Alex** if you are new to AI or security. Choose **Nova** for the enterprise workflow and technical controls. **Reset** clears both journeys and optional scenario progress on this device after confirmation.

Use **DE / EN** to switch languages while keeping progress. The German edition includes both stories, optional scenarios and the interactive architecture guide. [Auf Deutsch spielen](https://lpassig.github.io/trust-boundaries/?lang=de)

**Guided** highlights the next interaction. **Exploration** keeps the assignment, permissions and milestones visible and lets players find their own way between checkpoints. Switch modes at any time. In Exploration, select **Show next step** for exact help, or use the optional idle hints. Open **Mission checklist** to review progress and change the idle-hint setting.

**[Play Nova’s railway investigation](https://lpassig.github.io/trust-boundaries/#nova)** to follow the same four stages across intake and delivery, the agent runtime, enterprise resources and the security control plane. The technical route covers shadow discovery, registered and verified bootstrap, dynamic access to RE-204 resources, Mira’s scoped delegation, and committing one authorized maintenance ticket. The last stage includes 17 optional security tests and a containment replay with independent confirmations. Alex and Nova save progress separately. Nova’s final outcome includes a pilot checklist with the request, expected result and evidence to keep.

- **[Stage 0 · UNKNOWN](https://lpassig.github.io/trust-boundaries/#shadow)** follows Tom’s private request through discovery, investigation and containment.
- **[Stage 1 · BUILD](https://lpassig.github.io/trust-boundaries/#build)** uses a verified school assignment and a time-limited phone to complete a solar-system workbook.
- **[Stage 2 · AUTHORIZE](https://lpassig.github.io/trust-boundaries/#authorize)** lets Alex identify a better source and ask for temporary, read-only access to the conductor notes.
- **[Stage 3 · RESIST](https://lpassig.github.io/trust-boundaries/#resist)** gives Jo limited approval authority and Mia a separate draft-only assignment. Follow the approved route or test how the household responds to a violation.

Open a phone to use its apps and browser, or open the family laptop to inspect its sign-in, browser session or files. Nova’s stations expose synthetic data and viewable permission states. Try the database lease expiry or edit the approved report to see how a downstream service responds. Each stage saves its own progress on the current device. The grandparents can observe indoors. A conversation or paper handoff outside stays beyond their view.

**Optional security scenarios** appear in the rooms from BUILD onward. Try a registered phone that fails verification, a signed assignment that exceeds the issuer’s authority, an edited workbook, or a revoked read that was already waiting to execute. Scenario choices and evidence stay separate from the main assignment. From AUTHORIZE onward, find the digital permission slip inside the scene after the parents approve the conductor notes.

The Enterprise Architecture Guide contains interactive topologies, 15 sequence diagrams and a decision lab. **Protocols** maps the RFCs and OpenID standards to their use in Nova, with official sources and shortcuts to the relevant sequence steps. Open a sequence from a story decision or a component from a Nova console. [Open Architecture](https://lpassig.github.io/trust-boundaries/#architecture)

## Privacy and simulation

Gameplay and progress use local browser state. The standalone file contains its own scripts and diagrams and runs offline. Product documentation links open external websites when selected. The public deployment is hosted by GitHub Pages. Gameplay uses fictional data and performs no operation on a real enterprise system. Product names identify the illustrated technologies.

## Build and verify

Run `python3 build-v2.py` to generate `play.html`, the compatible offline copy `play-v2.html`, and the GitHub Pages entry in `docs/index.html`. The earlier `/v2/` link redirects to the current game and preserves its URL fragment.

Run `python3 build-v2.py --check` to check all generated files. Run `node --test tests/*.test.cjs` for state and reference tests. Run `node tests/browser-e2e.cjs` for the offline desktop and mobile Chrome walkthroughs. Set `CHROME` to a Chromium or Chrome executable if it is outside the default location. Set `TRUST_QA_SCREENSHOTS` to an existing directory to capture the stage views.
