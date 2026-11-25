# The Agent House

**[Play The Agent House](https://lpassig.github.io/trust-boundaries/)** or open `play.html` offline.

The Agent House is the v3 edition of Trust Boundaries, a point-and-click adventure about who may grant access, what tools enforce, and how to check that access ended. The game follows Alex through the same four rooms as he earns more independence.

**[Play Nova’s railway investigation](https://lpassig.github.io/trust-boundaries/#nova)** to follow the same four stages across intake and delivery, the agent runtime, enterprise resources and the security control plane. The technical route covers shadow discovery, registered and verified bootstrap, dynamic access to RE-204 resources, Mira’s scoped delegation, and committing one authorized maintenance ticket. The last stage includes 17 optional security tests and a containment replay with independent confirmations. Alex and Nova save progress separately.

- **[Stage 0 · UNKNOWN](https://lpassig.github.io/trust-boundaries/#shadow)** follows Tom’s private request through discovery, investigation and containment.
- **[Stage 1 · BUILD](https://lpassig.github.io/trust-boundaries/#build)** uses a verified school assignment and a time-limited phone to complete a solar-system workbook.
- **[Stage 2 · AUTHORIZE](https://lpassig.github.io/trust-boundaries/#authorize)** lets Alex identify a better source and ask for temporary, read-only access to the conductor notes.
- **[Stage 3 · RESIST](https://lpassig.github.io/trust-boundaries/#resist)** gives Jo limited approval authority and Mia a separate draft-only assignment. Follow the approved route or test how the household responds to a violation.

Select the highlighted action to advance. Open a phone to use its apps and browser, or open the family laptop to inspect its sign-in, browser session or files. People and physical objects stay in the room. Each stage saves its own progress on the current device. The grandparents can observe indoors. A conversation or paper handoff outside stays beyond their view.

**Optional security scenarios** appear in the rooms from BUILD onward. Try a registered phone that fails verification, a signed assignment that exceeds the issuer’s authority, an edited workbook, or a revoked read that was already waiting to execute. Scenario choices and evidence stay separate from the main assignment. From AUTHORIZE onward, find the digital permission slip inside the scene after the parents approve the conductor notes.

[Architecture](https://lpassig.github.io/trust-boundaries/#architecture) opens the Enterprise Architecture Guide for Nova’s railway scenario. Select a maturity stage, inspect its topology and components, replay a request, or use the decision lab. The guide is bundled into the offline game.

## Build and verify

Run `python3 build-v2.py` to generate `play.html`, the compatible offline copy `play-v2.html`, and the GitHub Pages entry in `docs/index.html`. The earlier `/v2/` link redirects to the current game and preserves its URL fragment.

Run `python3 build-v2.py --check` to check all generated files. Run `node --test tests/*.test.cjs` for the household tests and existing reference model checks.
