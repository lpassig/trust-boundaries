# The Agent House

**[Play The Agent House](https://lpassig.github.io/trust-boundaries/)** or open `play.html` offline.

The Agent House is the v3 edition of Trust Boundaries, a point-and-click adventure about who may grant access, what tools enforce, and how to check that access ended. The game follows Alex through the same four rooms as he earns more independence.

- **[Stage 0 · UNKNOWN](https://lpassig.github.io/trust-boundaries/#shadow)** follows Tom’s private request through discovery, investigation and containment.
- **[Stage 1 · BUILD](https://lpassig.github.io/trust-boundaries/#build)** uses a verified school assignment and a time-limited phone to complete a solar-system workbook.
- **[Stage 2 · AUTHORIZE](https://lpassig.github.io/trust-boundaries/#authorize)** lets Alex identify a better source and ask for temporary, read-only access to the conductor notes.
- **[Stage 3 · RESIST](https://lpassig.github.io/trust-boundaries/#resist)** gives Jo limited approval authority and Mia a separate draft-only assignment. Follow the approved route or test how the household responds to a violation.

Select the highlighted action to advance. Other objects and people let you inspect the scene or test a boundary. Each stage saves its own progress on the current device. The grandparents can observe indoors. A conversation or paper handoff outside stays beyond their view.

**Optional security scenarios** appear in the rooms from BUILD onward. Try a registered phone that fails verification, a signed assignment that exceeds the issuer’s authority, an edited workbook, or a revoked read that was already waiting to execute. Scenario choices and evidence stay separate from the main assignment. From AUTHORIZE onward, find the digital permission slip inside the scene after the parents approve the conductor notes.

[Architecture](https://lpassig.github.io/trust-boundaries/#architecture) is a browsable reference with product roles, request sequences, deployment options and pilot checklists. It uses a worked customer handover to show how the household controls could translate to a workplace.

## Build and verify

Run `python3 build-v2.py` to generate `play.html`, the compatible offline copy `play-v2.html`, and the GitHub Pages entry in `docs/index.html`. The earlier `/v2/` link redirects to the current game and preserves its URL fragment.

Run `python3 build-v2.py --check` to check all generated files. Run `node --test tests/*.test.cjs` for the household tests and existing reference model checks.
