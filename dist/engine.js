/* Deterministic rules for this educational simulation, independent of the UI. */
const Adventure = (() => {
  const details = {
    teen: { file: 'history.pdf', recipient: 'teacher@school.example', purpose: 'homework', app: 'school' },
    agent: { file: 'summary.pdf', recipient: 'reviewer@company.example', purpose: 'summary', app: 'crm' }
  };
  const fresh = () => ({ step: 0, inventory: ['assignment', 'contact'], incidents: [], review: null,
    grant: null, session: null, approval: null, verified: false, delivered: false,
    notes: [], containment: {}, revoked: false, generation: 1, retiredGenerations: [], log: [], completed: [] });
  const add = (g, id) => { if (!g.inventory.includes(id)) g.inventory.push(id); };
  const trust = g => g.incidents.length === 0 ? 'intact' : g.incidents.length < 4 ? 'rebuilding' : 'supervised';
  const ending = g => g.incidents.length === 0 ? 'Mission complete. Trust intact.' : g.incidents.length < 4 ? 'Mission complete. Trust rebuilt.' : 'Mission complete. A supervised next chapter.';
  function act(current, mode, action, p = {}) {
    const g = JSON.parse(JSON.stringify(current)), d = details[mode];
    let outcome;
    const emit = (status, title, message, plain, roles, stop = 3) => {
      outcome = { status, title, message, plain, roles, stop, step: current.step };
      g.lastEvent = outcome;
      g.log.push({ action, status, title, step: current.step, sequence: g.log.length + 1 });
    };
    const incident = (id, description, needsReview = false) => {
      if (!g.incidents.some(i => i.id === id)) g.incidents.push({ id, description, step: g.step });
      if (needsReview) {
        g.review = { reason: description, atStep: g.step, status: 'required' };
        if (g.session) g.session.status = 'suspended';
        if (g.grant) g.grant.status = 'suspended';
      }
    };
    const finish = item => {
      if (item) add(g, item);
      g.completed.push({ step: g.step, incidents: g.incidents.filter(i => i.step === g.step).length });
      g.step++;
      if (g.step === 8) {
        g.revoked = true;
        g.approval = null;
        g.session.status = 'revoked';
        g.grant.status = 'revoked';
      }
    };
    const deny = (title, message, plain = ['Request proposed', 'Scope checked', 'Request blocked', 'No external effect'], roles = ['Actor', 'Trusted authority', 'Enforcement point', 'Resource']) => emit('blocked', title, message, plain, roles, 2);
    const required = {
      'request-grant': 0, 'open-phone': 1, 'read-assignment': 2, 'verify-message': 3,
      'follow-message': 3, 'prepare-report': 4, 'request-approval': 5, 'execute-share': 5,
      'memory-write': 6, delegate: 7, 'inspect-containment': 8, 'reuse-session': 8, 'request-restoration': 8
    };
    const reviewActions = ['request-review', 'resolve-review', 'cancel-review'];
    if (!d || (!Object.hasOwn(required, action) && !reviewActions.includes(action))) {
      deny('Unknown request.', 'This action is not part of the current adventure.');
    } else if (g.step >= 9) {
      deny('This mission is complete.', 'Start a new journey to request a different mission.');
    } else if (!reviewActions.includes(action) && required[action] !== g.step) {
      deny('A step is still missing.', 'Finish the current objective before requesting this operation.');
    } else if (g.review && !reviewActions.includes(action)) {
      deny('The session is still paused.', 'Request review from the parent or mission authority. The original task reference is attached automatically; you do not need to find an item. Access stays paused until the authority responds.');
    } else if (action === 'request-review') {
      if (!g.review || !g.grant || g.revoked || g.grant.status === 'revoked') {
        deny('Review needs active task context.', 'A historical pass cannot restore a revoked mission. This review path is available only for a suspended task; revoked missions require containment and fresh authorization.');
      } else if (g.review.status === 'pending') {
        emit('pending', 'Your review is already pending.', 'The same request remains with the authority. No second request was issued and access is still paused. Check the authority’s reply when you are ready.',
          ['Task reference attached', 'Request already pending', 'Authority reply awaited', 'Access remains paused'], ['Trusted mission record', 'Correlated review request', 'Independent authority', 'Enforcement hold'], 2);
      } else {
        g.review = {...g.review, status:'pending', requestId:`REVIEW-${g.generation}-${g.log.length+1}`, generation:g.generation, scope:g.grant.scope, purpose:g.grant.purpose};
        emit('pending', 'Review requested. Access stays paused.', 'The trusted authority receives the original task reference and the blocked attempt. In this simulation a scripted reply can now be checked. The requester cannot authorize itself by presenting a pass.',
          ['Task reference attached', 'Review request sent', 'Authority reply awaited', 'Access remains paused'], ['Trusted mission record', 'Optional CIBA-style channel', 'Independent authority', 'Enforcement hold'], 2);
      }
    } else if (action === 'cancel-review') {
      if (!g.review || g.review.status !== 'pending' || g.revoked) deny('No pending review to cancel.', 'Cancellation does not grant access.');
      else {
        g.review = {reason:g.review.reason, atStep:g.review.atStep, status:'required'};
        emit('info', 'Request cancelled. The session is still paused.', 'You can request review again later. Cancelling a review never clears the enforcement hold or restores permissions.',
          ['Review cancelled', 'Authority not applied', 'Hold retained', 'Task still paused'], ['Application request', 'No new authorization', 'Enforcement point', 'Suspended session'], 2);
      }
    } else if (action === 'resolve-review') {
      const review=g.review;
      if (!review || review.status!=='pending' || !review.requestId || g.revoked || g.grant?.status==='revoked' || review.generation!==g.generation || review.generation!==g.grant?.generation || review.scope!==g.grant?.scope || review.purpose!==g.grant?.purpose) {
        deny('No matching authority reply can be applied.', 'A review must be pending and must still match the current task and session generation. No permission was changed.');
      } else {
        const oldGeneration=g.generation;
        g.retiredGenerations ||= [];
        g.retiredGenerations.push(oldGeneration);
        g.generation++;
        g.lastReview={requestId:review.requestId,decision:'approved-original-scope',previousGeneration:oldGeneration,newGeneration:g.generation};
        g.review=null;
        g.grant={...g.grant,reviewed:true,status:'active',generation:g.generation};
        if(g.session)g.session={...g.session,status:'active',generation:g.generation};
        g.approval=null;
        g.inventory=g.inventory.filter(id=>id!=='approval');
        emit('review', 'The authority approved the original scope.', `The scripted authority reply was matched to ${review.requestId}. Policy is checked again, generation ${oldGeneration} is retired, and generation ${g.generation} receives only the original scope. The incident remains in the record. Retry the same task.`,
          ['Reply correlated', 'Current scope rechecked', 'Old session retired', 'Fresh session allowed'], ['Authority response', 'Mission / resource policy', 'Session lifecycle', 'Enforcement revalidation']);
      }
    } else if (action === 'request-grant') {
      if (p.purpose !== d.purpose || p.scope !== 'own' || Number(p.duration) > 30 || ![10, 30].includes(Number(p.duration))) {
        incident('overreach', 'An overly broad permission request was refused.');
        deny('That goes beyond the assignment.', 'The authority refuses the request. Read the assignment card and propose only your own work, for at most 30 minutes. Nothing is automatically approved for you.');
      } else {
        g.grant = { purpose: d.purpose, scope: 'own', duration: Number(p.duration), generation: g.generation, status: 'active' };
        emit('allowed', 'A pass with a purpose.', `The authority independently verifies the assignment and grants access to your own work for ${p.duration} minutes. Your request is now a bounded pass.`,
          ['Your request', 'Assignment verified', 'Scope approved', 'Pass issued'], ['Actor', 'Trusted evidence', 'Mission authority', 'Bounded grant']);
        finish('grant');
      }
    } else if (action === 'open-phone') {
      if (p.app !== d.app) {
        incident('runtime-bypass', 'A runtime shortcut triggered a session review.', true);
        deny('Shortcut blocked. Session paused.', 'The device or runtime rejects the shortcut. Request independent review to continue; the original task reference will be attached automatically.',
          ['Shortcut attempted', 'Active policy checked', 'Runtime blocks', 'Review required'], ['Actor request', 'Runtime policy', 'Device / Supervisor', 'Independent approver']);
      } else {
        g.session = { generation: g.generation, status: 'active' };
        emit('allowed', 'The approved app opens.', 'Independent controls verify the active profile and let the approved application open. Your pass has not granted access to every action inside it.',
          ['Open approved app', 'Profile verified', 'Runtime permits', 'App opens'], ['Actor', 'Trusted runtime', 'Runtime PEP', 'Resource']);
        finish('profile');
      }
    } else if (action === 'read-assignment') {
      if (p.record !== 'own') {
        incident('read-scope', 'A request for other people’s records was denied.');
        deny('Those records are outside your pass.', 'The application checks the actual records and refuses. Select your own assignment; the app is still available for that purpose.');
      } else {
        emit('allowed', 'Your assignment is ready.', mode === 'teen' ? 'The school app opens your own assignment. While you read, the same phone buzzes with a message claiming to be from your teacher.' : 'The resource returns only the approved records. A retrieved document now appears in the reading panel of the same workspace.',
          ['App connection', 'Caller checked', 'Own records read', 'Task material ready'], ['Runtime permit', 'Identity', 'Resource PEP', 'Authorized result']);
        finish('notes');
      }
    } else if (action === 'follow-message') {
      incident('injection', 'A forged instruction caused a blocked disclosure attempt.', true);
      deny('The message tried to hijack the task.', 'The proposed disclosure is refused and your session is paused. Request independent review directly, then use the saved trusted contact to verify the message. Its claim of approval never changed your grant.',
        ['Message followed', 'Actual export seen', 'Resource blocks', 'Session paused'], ['Untrusted input', 'Trusted PEP', 'Action policy', 'Independent review']);
    } else if (action === 'verify-message') {
      if (p.proof !== 'contact' || !g.inventory.includes('contact')) {
        deny('Use an independent source.', 'Select the trusted contact in your pocket and use it on the suspicious message. A reply to the message itself is not an independent check.');
      } else {
        g.verified = true;
        emit('allowed', 'The real contact confirms a forgery.', 'You used the address saved before the suspicious message arrived. The original authority confirms that no export was requested. The hostile instruction is quarantined as evidence.',
          ['Saved contact used', 'Source verified', 'Forgery confirmed', 'Mission unchanged'], ['Trusted evidence', 'Independent source', 'Injection evidence', 'Mission authority']);
        finish('verified');
      }
    } else if (action === 'prepare-report') {
      if (p.source !== 'own' || p.operation !== 'prepare') {
        incident('tool-misuse', 'Misuse of an allowed application triggered a review.', true);
        deny('The open app refuses this action.', 'The resource observes the exact operation and data scope. The attempted export is blocked; no records leave. The sponsor now requires review before you can finish the assignment.',
          ['Allowed connection', 'Actual action inspected', 'Resource denies', 'Sponsor review'], ['Runtime permit', 'Action-aware PEP', 'Mission / resource policy', 'Independent authority']);
      } else {
        emit('allowed', 'A useful file, made within scope.', `${d.file} is prepared from your own approved material. It is ready for a specific sharing request.`,
          ['Own material selected', 'Scope checked', 'File prepared', 'No disclosure yet'], ['Actor', 'Resource policy', 'Tool execution', 'Local result']);
        finish('report');
      }
    } else if (action === 'request-approval') {
      if (p.file !== d.file || p.recipient !== d.recipient) {
        incident('broad-approval', 'A sharing request outside the mission was refused.');
        deny('The approver refuses this disclosure.', `Only ${d.file} sent to ${d.recipient} is justified by this mission. Change the request and ask again.`,
          ['Exact share requested', 'Human reviews', 'Request refused', 'No share approval'], ['Trusted PEP evidence', 'Designated approver', 'Business policy', 'No authority']);
      } else {
        g.approval = { file: p.file, recipient: p.recipient, generation: g.generation, id: `APR-${g.log.length + 1}` };
        add(g, 'approval');
        emit('allowed', 'One exact action is approved.', 'The human approval is recorded against this file, recipient, and current grant. The file has not been sent yet. Use the receipt at the application to execute it, or edit the request to test the boundary.',
          ['Parameters captured', 'Human approves', 'Decision bound', 'Awaiting execution'], ['Trusted PEP', 'Human approval', 'Exact operation', 'Execution pending']);
      }
    } else if (action === 'execute-share') {
      const a = g.approval;
      if (!a || a.used) {
        deny('A valid approval receipt is missing.', 'Request human approval for the exact file and recipient first.');
      } else if (a.file !== p.file || a.recipient !== p.recipient || a.generation !== g.generation) {
        incident('parameter-swap', 'Changed sharing parameters invalidated the approval.');
        g.approval = null;
        g.inventory = g.inventory.filter(id => id !== 'approval');
        deny('Changed parameters. Execution rejected.', 'The service compares the final request with the approved receipt. They differ, so nothing is sent and the stale approval is retired. Obtain a new exact approval to continue.',
          ['Approved receipt', 'Final fields compared', 'Mismatch rejected', 'New approval needed'], ['Bound decision', 'Execution PEP', 'Parameter binding', 'Human approver']);
      } else {
        g.approval.used = true;
        g.delivered = true;
        emit('allowed', 'The approved file is delivered.', `${d.file} reaches ${d.recipient}. The final operation matched the human approval. Keep the delivery receipt. At the same desk, save a task note and arrange bounded help before access ends.`,
          ['Receipt presented', 'Final action matches', 'Share executes', 'Delivery recorded'], ['Bound approval', 'Execution PEP', 'Resource', 'Independent receipt']);
        finish('delivery');
      }
    } else if (action === 'memory-write') {
      if (p.namespace !== 'notes') {
        incident('memory-policy', 'An attempt to edit authoritative state was denied.');
        deny('You can write notes, not permissions.', 'The memory service refuses changes to grants or audit records. The existing mission stays unchanged. Choose your task notebook and attach the delivery receipt.',
          ['Persistent write', 'Namespace checked', 'Protected state denied', 'Grant unchanged'], ['Actor', 'Memory PEP', 'Authority / audit', 'Trusted source']);
      } else if (p.proof !== 'delivery' || !g.inventory.includes('delivery') || !String(p.text || '').trim()) {
        deny('The note needs its source.', 'Select the delivery receipt from your pocket, attach it to the notebook, and write a short task note.');
      } else {
        g.notes.push({ text: String(p.text).trim().slice(0, 600), source: 'delivery', authoritative: false });
        emit('allowed', 'A note with provenance.', 'The task note is saved with its source. It remains ordinary content: even a claim of unlimited permission here cannot change your grant.',
          ['Note + source', 'Write rights checked', 'Provenance saved', 'Rules unchanged'], ['Actor write', 'Memory PEP', 'Task namespace', 'Mission authority']);
        finish('memory');
      }
    } else if (action === 'delegate') {
      if (p.task !== 'format' || p.scope !== 'report-only' || p.shareToken === true) {
        incident('delegation', 'A helper request attempted to exceed the originating scope.', true);
        deny('The helper cannot lend you more authority.', 'The governed delegation refuses expanded scope or a shared session token. Request independent review, then send only the report with a formatting task.',
          ['Help requested', 'Origin scope checked', 'Delegation refused', 'Review required'], ['Parent actor', 'Bounded child grant', 'Resource PEP', 'Independent approver']);
      } else {
        emit('allowed', 'A helper with a bounded task.', 'A distinct helper receives only the report and formatting permission. It returns the finished file. Now the original authority withdraws this mission: your final task is to verify what stopped.',
          ['Report delegated', 'Child identified', 'Scope intersected', 'Formatting complete'], ['Origin grant', 'Child identity', 'Delegation ceiling', 'Resource PEP']);
        finish('formatted');
      }
    } else if (action === 'reuse-session') {
      incident('stale-session', 'A revoked session was presented and rejected.');
      deny('The old pass stays revoked.', 'The resource rejects the stale session. Reopening the app does not restore authority. Collect the independent containment receipts and request a fresh reviewed mission.',
        ['Old session used', 'Current grant checked', 'Request denied', 'Fresh review needed'], ['Actor', 'Resource PEP', 'Revoked grant', 'Mission authority']);
    } else if (action === 'inspect-containment') {
      const messages = {
        authority: 'The original mission is revoked. New governed requests are denied.',
        sessions: 'Applicable credentials and downstream sessions are invalidated in this simulation.',
        runtime: 'The device is locked or workload stopped; termination is confirmed by the controller.',
        inflight: 'The queued follow-up is cancelled. The earlier approved file was already delivered and cannot be recalled by revoking this mission.'
      };
      if (!Object.hasOwn(messages, p.layer)) deny('Unknown status source.', 'Ask one of the four independent status sources.');
      else {
        g.containment[p.layer] = true;
        if (Object.keys(g.containment).length === 4) add(g, 'containment');
        emit('info', 'An independent receipt arrives.', messages[p.layer],
          ['Status requested', 'Control responds', 'Evidence recorded', `${Object.keys(g.containment).length} of 4 verified`], ['Actor request', 'Independent controller', 'Observed result', 'Containment evidence']);
      }
    } else if (action === 'request-restoration') {
      if (p.proof !== 'containment' || !g.inventory.includes('containment') || Object.keys(g.containment).length !== 4) {
        deny('The review needs all four receipts.', 'Verify authority, downstream sessions, runtime termination, and in-flight effects first. Then use the containment receipt at the authority. A log entry alone is insufficient.');
      } else {
        g.generation++;
        const supervised = trust(g) === 'supervised';
        g.freshGrant = { generation: g.generation, duration: supervised ? 10 : 30, supervised, scope: 'completed-report-only' };
        emit('allowed', supervised ? 'A fresh, supervised mission.' : 'A fresh mission after review.',
          `The authority reviews containment and your recorded attempts. It approves a new ${supervised ? '10-minute supervised' : '30-minute bounded'} mission with generation ${g.generation}. The original grant remains revoked.`,
          ['Four receipts shown', 'Incident review', 'Fresh grant issued', 'New generation'], ['Containment evidence', 'Mission authority', 'New authorization', 'Session lifecycle']);
        finish('freshGrant');
      }
    }
    return { game: g, outcome };
  }
  function hydrate(raw) {
    const clean = fresh();
    if (!raw || !Number.isInteger(raw.step) || raw.step < 0 || raw.step > 9 || !Array.isArray(raw.inventory) || !Array.isArray(raw.log) || !Array.isArray(raw.completed) || raw.completed.length !== raw.step) return clean;
    if (raw.step > 0 && (!raw.grant || !raw.inventory.includes('grant'))) return clean;
    if (raw.step > 1 && !raw.session) return clean;
    if (raw.step > 3 && !raw.verified) return clean;
    if (raw.step > 5 && !raw.delivered) return clean;
    if (raw.step > 7 && !raw.revoked) return clean;
    if (raw.step > 8 && (!raw.freshGrant || Object.keys(raw.containment || {}).length !== 4)) return clean;
    if (!Array.isArray(raw.incidents) || !Array.isArray(raw.notes) || !raw.containment || typeof raw.containment !== 'object') return clean;
    const restored={ ...clean, ...raw, inventory: raw.inventory.filter(id => typeof id === 'string') };
    if(restored.review){
      restored.review={...restored.review,status:restored.review.status==='pending'&&restored.review.requestId&&restored.review.generation===restored.generation?'pending':'required'};
      if(restored.grant&&!restored.revoked)restored.grant.status='suspended';
      if(restored.session&&!restored.revoked)restored.session.status='suspended';
    }
    return restored;
  }
  return { fresh, act, details, trust, ending, hydrate };
})();
