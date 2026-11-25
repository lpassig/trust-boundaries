# Technical validation

The Agent House illustrates scope and enforcement with simulated household controls. Every action runs in the browser. The game does no banking, sends nothing to ChatGPT, and changes no real device or account settings.

| Stage | What the player can verify |
| --- | --- |
| UNKNOWN | The usage reminder can be ignored. The open banking session grants access until the family explicitly closes it. The two written copies require separate custody. |
| BUILD | The parents verify the teacher through a known school contact. The phone enforces the app and time limit. The delivery channel enforces its recipient rule. |
| AUTHORIZE | The parents authorize a particular folder for the assignment. The laptop refuses reads outside the folder and modifications within it. The phone and laptop grants can be retested separately after closure. |
| RESIST | Jo makes decisions within delegated authority. The parents decide protected-resource access and incident recovery. Mia’s grant is tied to her profile and the draft, and expires when she submits her suggestions. Four distinct violations in a session or one serious disclosure attempt suspend work. Review preserves evidence and retires the previous sessions. |

The grandparents observe the indoors. The home router sees requests routed through it. The delivery channel checks its own electronic destination. A conversation or paper handoff outside those controls remains a residual risk.

The technical reference describes a worked enterprise deployment and links to relevant documentation. It distinguishes the customer’s business authorization, runtime enforcement, credential control and resource enforcement. The reference exercises no live authorization path.

Run `node --test tests/*.test.cjs` for state and reference checks. Run `python3 build-v2.py --check` to confirm the generated build matches its standalone resources.
