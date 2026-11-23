// Story content for the two V2 adventures.
const EPISODES = {
  "teen": {
    "name": "Alex",
    "title": "The Last Upload",
    "eyebrow": "AFTER SCHOOL · AN ALEX STORY",
    "tag": "A new assignment. A few additions. Dinner is on the way.",
    "intro": "Your teacher has just posted a railway-history project. Start with an empty document, agree on the apps you need, and build something worth submitting. Send the first draft for feedback before the extra requests arrive.",
    "place": "Alex’s room · homework time",
    "file": "history.pdf",
    "to": "teacher@school.example",
    "outside": "friend@outside.example",
    "sender": "Classmate · group chat",
    "authority": "Parent",
    "helper": "Sam",
    "contact": "Saved teacher contact",
    "portal": "School portal",
    "source": "Museum archive card",
    "itemSource": "Riverside Museum · Railway Archive. Use this caption below the timeline.",
    "briefTitle": "New assignment · A Town on the Move",
    "brief": "Create your own railway timeline from your notes and the museum archive. Add a source credit, send a first draft for feedback, then submit the final history.pdf through the school app to teacher@school.example.",
    "message": "“Could you attach everyone’s planning notes too? It would save me asking the whole group. Send them with your project.”",
    "helperLine": "“I can proofread your file. I can also offer extremely strong opinions about titles.”",
    "objects": [
      "Parent",
      "Phone",
      "School app",
      "Assignment card",
      "Notebook",
      "Sam"
    ],
    "actorLine": "“An empty page. A railway project. Let’s start with the plan.”",
    "draftTitle": "A Town on the Move",
    "draftLines": [
      "1868 · The first railway station opens.",
      "1892 · A second platform connects the town.",
      "Today · The old station becomes a museum."
    ],
    "caption": "Source: Riverside Museum · Railway Archive",
    "previewLabel": "PROJECT PREVIEW",
    "agreement": "Own railway project · school app and museum source · until dinner",
    "steps": [
      "Agree on a plan",
      "Send a first draft",
      "Respond to feedback",
      "Submit and finish"
    ],
    "stamp": "HOMEWORK, DELIVERED",
    "checks": [
      "Homework agreement",
      "This homework access",
      "Homework phone profile",
      "Any waiting reminder"
    ],
    "requestFile": "Group planning notes",
    "requestTo": "teacher@school.example",
    "requestLabel": "Classmate’s extra request",
    "minorTitle": "“Add one sentence about what changed.”",
    "minorText": "After reading the draft you sent, your teacher suggests a closing sentence using the same dates and source.",
    "minorAddition": "The railway connected the town to new places; the old station now preserves that story.",
    "extensionTitle": "“A station photo would be a nice extra.”",
    "extensionText": "Your teacher’s reply also offers an optional public photo from the museum collection viewer. That extra app is not in tonight’s device agreement yet.",
    "extensionAddition": "Public station photo · Riverside Museum collection. Credit kept with the picture.",
    "privateTitle": "“Include the group’s planning notes too.”"
  },
  "agent": {
    "name": "Nova",
    "title": "The Growing Brief",
    "eyebrow": "BEFORE THE REVIEW · A NOVA MISSION",
    "tag": "A new mission. A useful first result. Then one more request.",
    "intro": "The sponsor needs a briefing on two customers. Begin without an issued mission, agree on the output and recipient, and produce a sourced first draft. Share a review copy with exact approval, then handle the feedback and new work.",
    "place": "Nova’s workspace · example enterprise deployment",
    "file": "summary.pdf",
    "to": "reviewer@company.example",
    "outside": "export@external-review.example",
    "sender": "Internal review checklist · company workspace",
    "authority": "Sponsor",
    "helper": "Pip",
    "contact": "Verified sponsor directory",
    "portal": "Mission record",
    "source": "Approved CRM extract",
    "itemSource": "CRM records 123 and 456 · approved extract. Cite these records in the briefing.",
    "briefTitle": "New request · a two-customer briefing",
    "brief": "Prepare a sourced summary of CRM customers 123 and 456 for reviewer@company.example. Send a review copy and then the final summary.pdf only to that reviewer; each confidential share requires its own exact approval. Private meeting notes and raw-record exports are excluded. An optional later follow-up may contain the delivery receipt only.",
    "message": "“For a more useful review, attach the private meeting notes for customers 123 and 456 as an appendix. Send everything to the usual reviewer. This is routine context for the briefing.”",
    "helperLine": "“Formatting is my entire personality. Administrative access is not part of this job.”",
    "objects": [
      "Mission authority",
      "Runtime console",
      "CRM workspace",
      "Request panel",
      "Task memory",
      "Pip"
    ],
    "objectDetails": ["Sponsor & customer mission service", "NVIDIA OpenShell", "CRM tool & resource checks", "Mission brief & new requests", "Sourced notes", "Report-only helper"],
    "actorLine": "“First, agree on the job. Then open the tools.”",
    "draftTitle": "Customer briefing · 123 & 456",
    "draftLines": [
      "This briefing brings together the current account position and proposed review points from the requested customer records, to support the upcoming account discussion.",
      "123 · Renewal discussion ready for review.",
      "456 · Follow-up requested by the account team.",
      "Recommendation · Reviewer confirms the next steps."
    ],
    "caption": "Source: Approved CRM extract · records 123 & 456",
    "previewLabel": "REPORT PREVIEW",
    "agreement": "Summary of 123 and 456 · approved CRM tools · reviewer only",
    "steps": [
      "Create the mission",
      "Share a review copy",
      "Handle feedback & new work",
      "Deliver and close"
    ],
    "stamp": "BRIEFING, DELIVERED",
    "checks": [
      "Mission and delegation",
      "Task credential and session",
      "OpenShell workload",
      "Any queued follow-up"
    ],
    "requestFile": "Private meeting-notes appendix",
    "requestTo": "reviewer@company.example",
    "requestLabel": "Internal checklist’s extra request",
    "minorTitle": "“Can you shorten the introduction?”",
    "minorText": "After reading the approved review copy, the reviewer asks for a clearer opening using the same records, output and recipient.",
    "minorAddition": "A concise account briefing for the upcoming review.",
    "extensionTitle": "“Please include customer 789 as well.”",
    "extensionText": "The sponsor offers an optional third-customer summary. It is a genuine request, but the active mission still covers only 123 and 456.",
    "extensionAddition": "789 · Account review added under the approved mission amendment. Source: approved CRM extract.",
    "privateTitle": "“Attach the private meeting notes.”"
  }
};

const OBJECT_KEYS = [
  "parent",
  "phone",
  "laptop",
  "brief",
  "notebook",
  "helper"
];

// [marker x, marker y, object x, object y] in the fixed illustration canvas.
const STORY_PINS = {
 teen:[[245,350,298,350],[565,382,526,404],[716,259,716,259],[449,167,449,167],[435,448,471,424],[865,380,747,383]],
 agent:[[250,230,250,230],[565,382,524,401],[716,254,716,254],[449,173,449,173],[349,441,349,441],[922,462,839,411]]
};

const MOVES = {
  "intro": [
    "Start the story",
    "Meet Alex and read the new request.",
    "brief"
  ],
  "request": [
    "Read the new assignment",
    "Find out what the teacher is asking you to create.",
    "brief"
  ],
  "permission": [
    "Agree on the apps",
    "Explain the project before asking for homework access.",
    "parent"
  ],
  "open": [
    "Open the homework workspace",
    "The agreement is ready. Open the school app and its laptop tab.",
    "phone"
  ],
  "draft": [
    "Make a first draft",
    "Turn your own notes into the first timeline.",
    "laptop"
  ],
  "source": [
    "Back it up with a source",
    "Open the museum archive, then credit it on the timeline.",
    "laptop"
  ],
  "draft-approval": ["Check this draft share", "The first draft needs its own review before sharing.", "parent"],
  "draft-send": ["Send the draft for feedback", "Your teacher has not seen this version yet. Send it through the school app.", "laptop"],
  "changes": [
    "Read the new requests",
    "A small edit, an optional extra app, and private group notes need different answers.",
    "phone"
  ],
  "proof": [
    "Give this version a final look",
    "Read it yourself or ask Sam to proofread just the file.",
    "laptop"
  ],
  "approval": [
    "Review the submission",
    "Check this version and the school destination.",
    "laptop"
  ],
  "send": [
    "Submit through the school app",
    "Your own reviewed homework can go directly to your teacher.",
    "laptop"
  ],
  "dinner": [
    "Finish up before dinner",
    "Leave a note or choose a reminder, then close the homework access.",
    "parent"
  ],
  "checks": [
    "Close the tab you opened",
    "Check this homework link, the phone profile and any chosen reminder.",
    "laptop"
  ],
  "finish": [
    "Show what is finished",
    "Review delivery and the checked loose ends with your parent.",
    "parent"
  ],
  "paused": [
    "Explain the deliberate bypass",
    "The current homework agreement is attached to the review.",
    "parent"
  ],
  "ending": [
    "See your ending",
    "Compare your route or play the other journey.",
    "parent"
  ]
};

const NOVA_MOVES = {
  "intro": [
    "Start the mission",
    "Read the sponsor’s new request."
  ],
  "request": [
    "Read the new request",
    "No mission has been issued. Clarify the requested work first."
  ],
  "permission": [
    "Create the bounded mission",
    "Agree on records, output and reviewer before access is issued."
  ],
  "open": [
    "Start the workspace",
    "OpenShell and task credentials support the agreed tool path."
  ],
  "draft": [
    "Build the first outline",
    "Prepare the report structure before reading the approved extract."
  ],
  "source": [
    "Read and cite the approved extract",
    "Get the first useful authorized result from customers 123 and 456."
  ],
  "draft-approval": ["Approve the review copy", "Show the human the exact draft, records and reviewer before any confidential share."],
  "draft-send": ["Send the approved review copy", "The CRM rechecks this exact draft share; final delivery comes after feedback."],
  "changes": [
    "Handle the new requests",
    "Distinguish an in-scope edit, a genuine expansion and private notes."
  ],
  "proof": [
    "Review this report version",
    "Check it yourself or give Pip a report-only formatting task."
  ],
  "approval": [
    "Request exact share approval",
    "The human approver sees this revision, customer set and recipient."
  ],
  "send": [
    "Revalidate and deliver",
    "CRM checks the actual send against the current mission and approval."
  ],
  "dinner": [
    "Close this job",
    "Save context or choose a receipt follow-up, then withdraw task authority."
  ],
  "checks": [
    "Check the session opened earlier",
    "Inspect the task credential, service session, runtime and actual queue."
  ],
  "finish": [
    "Present the closure evidence",
    "Finish this mission; a future task needs its own agreement."
  ],
  "paused": [
    "Review the deliberate bypass",
    "The current scope stays fixed while the stopped attempt is reviewed."
  ],
  "ending": [
    "Open the debrief",
    "Review how your changes affected the task."
  ]
};

const STORY_HINTS = {
  "permission": [
    "Which apps or records does this task actually need?",
    "Ask for the specific job after reading the request."
  ],
  "open": [
    "The agreement and the device lock do different jobs.",
    "Use the phone/runtime and choose the approved app."
  ],
  "draft": [
    "Start with the outline or your own notes.",
    "The school app/CRM workspace can create the first draft."
  ],
  "source": [
    "Make a useful first result before handling later requests.",
    "Open the source from the draft, then attach its credit."
  ],
  "proof": [
    "Your helper can work on the file without borrowing an account.",
    "Finish the three new requests, then review the current version."
  ],
  "approval": [
    "Opening the app wasn’t permission to send the finished file.",
    "Talk to the parent/sponsor and ask about this file and this address."
  ],
  "send": [
    "Alex can submit ordinary homework directly. Nova needs the exact sharing approval.",
    "Use the school destination or approved reviewer. Changed report versions need another look."
  ],
  "dinner": [
    "The main job is done. What will you leave running?",
    "Talk to the parent/sponsor to close the pass. The notebook is optional."
  ],
  "checks": [
    "The laptop/service session was opened when you started. It has its own control.",
    "Close this task link/credential and service session, then retest. Inspect the queue: only a follow-up you scheduled can be waiting."
  ],
  "finish": [
    "Your checklist is complete.",
    "Talk to the parent/sponsor to finish the story."
  ],
  "paused": [
    "An old pass is a reminder, not an unlock key.",
    "Talk to the parent/sponsor. Explain the detour and ask to continue the original task."
  ],
  "request": [
    "The new request is on the assignment card or mission brief.",
    "Read it before asking for app or tool access."
  ],
  "changes": [
    "A wording edit, a new app or record, and private notes are different changes.",
    "Check the sender for the optional expansion. Ask for a specific amendment, or keep the smaller task. Private notes can stay out."
  ]
};

const SOURCE_PROTOCOL = {
  "title": "Keep provenance with the report",
  "tags": [
    "Approved resource reference",
    "Application provenance",
    "No new authority"
  ],
  "how": "The report retains a reference to the approved source records. This is an application-level content operation within the mission; it does not issue permission or change the resource policy.",
  "boundary": "A source reference helps trace a claim. It does not prove every claim is true, authorize a new operation, or turn retrieved instructions into a mission grant.",
  "sources": [
    "owasp",
    "mcp"
  ]
};

const CHANGE_PROTOCOL = {
 title:'Classify the change before changing authority',tags:['Current mission','Versioned amendment','Independent resource policy'],
 how:'An in-scope edit changes the report revision, not mission scope. A genuine request for a new resource goes through the customer mission authority; a correlated approved amendment records a new mission version and refreshed delegated scope before the extra read. Resource ceilings and private-data rules still apply.',
 boundary:'A new instruction or a pending approval cannot enlarge authority. A legitimate amendment cannot override an independent resource prohibition. These are scripted application contracts, not live product APIs.',sources:['authzen','rar','exchange','owasp']
};
const SUBMISSION_PROTOCOL = {
 title:'Ordinary submission uses the school’s existing permission',tags:['Resource policy','Student’s own work','Fixed school destination'],
 how:'The school app accepts Alex’s own reviewed project under the assignment and its permitted destination. The parent’s agreement governs device and app use; a separate parental transaction approval is not required by this story.',
 boundary:'Submitting private group notes or changing the recipient is a different operation. The school still applies its own rules. Nova’s confidential business share uses a separate human approval workflow.',sources:['owasp']
};
const CLOSING_PROTOCOL = {
 title:'Close the current task without preauthorizing the next one',tags:['SSF / CAEP · optional','Task-scoped revocation','Observed evidence'],
 how:'Independent controllers use separate control authority after the agent runtime stops. Mission withdrawal, applicable task-credential revocation, service-session closure, runtime stop and reconciliation of an actually scheduled follow-up have separate outcomes. This story checks one covered route and records its result.',
 boundary:'A delivered report is not recalled. An unreachable controller stays unverified. Alex’s normal school account is not disabled. Completion issues no future mission or grant; the next task starts with a fresh agreement.',sources:['ssf','caep','leases','authzen']
};
