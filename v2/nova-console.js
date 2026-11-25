/* Synthetic station views. Resource rows are returned by the same model that runs the story. */
function novaConsole(state,station,close,act){
 const reached=id=>NovaRailway.reached(state,id);
 const mission=NovaRailway.mission(state);
 const closed=mission?.status==='Closed';
 const suspended=Boolean(state.incident);
 const unknown=state.stage==='unknown';
 const [name,technology,description]=NovaRailway.stations[station];
 const rows=[];
 const field=(label,value)=>rows.push([label,value]);
 const resources={crm:['Record','Type','Classification'],kafka:['Event','Time','Asset','Message'],
  database:['Incident','Asset','Finding','Outcome'],astra:['Document','Title','Excerpt']};
 let recordTable='';
 if(Object.hasOwn(resources,station)){
  const read=NovaRailway.resourceRead(state,station,station==='astra'&&closed&&state.stage==='authorize'?{asset:'RE-105',missionId:'M-105'}:{});
  field('Resource decision',read.status);
  field('Evidence',read.reason);
  if(read.rows.length){
   const headers=unknown&&station==='kafka'?['Event','Topic','Observation']:resources[station];
   recordTable=`<div class="console-table" tabindex="0" role="region" aria-label="Synthetic records">
    <table><caption>Synthetic records</caption><thead><tr>${headers.map(header=>`<th scope="col">${esc(header)}</th>`).join('')}</tr></thead>
    <tbody>${read.rows.map(row=>`<tr>${row.map(value=>`<td>${esc(value)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }
 }
 if(station==='sandbox'||station==='admission'){
  const stopStatus=NovaRailway.runtimeStatus(state);
  field('Runtime',stopStatus??(unknown?'Unmanaged workstation':`nova-runtime-${state.generation}`));
  field('Admission',suspended?'Mission suspended · new issuance blocked':stopStatus?'Closed':unknown?'Unverified':state.admission==='Failed'?'Posture failed · issuance blocked':
   state.admission==='Pending'?'Waiting for workload and posture checks':'Verified for the current deployment');
  field('Network',suspended&&!state.incident.confirmed.includes('runtime')?'Runtime route status unverified':stopStatus?'Agent route unavailable':unknown?'Broad workstation access':stageNetwork(state));
  if(station==='sandbox')field('Research plan',mission?.scope??'Review the request before running a managed task.');
 }
 if(station==='identity'){
  field('Logical identity',unknown?'No registered agent record':reached('register')?'nova · Railway Operations owner recorded':'Registration pending');
  field('Delegation',mission?.subject??'No active authority recorded');
 }
 if(station==='model'){
  field('Connection',unknown?'Direct external endpoint':'Approved Granite route through the model gateway');
  field('Budget',unknown?'Unbounded':suspended||closed?'Unavailable':reached('budget')?'Exhausted · further calls blocked':
   state.stage==='resist'?`${state.budgetUsed.toLocaleString('en')} / ${NovaRailway.sharedBudget.toLocaleString('en')} simulated tokens · shared by Nova and Mira`:
   state.stage==='authorize'?'50,000 simulated tokens':'Enforced on M-101');
 }
 if(station==='gateway'){
  field('MCP route',unknown?'Unapproved inventory':suspended||closed?'Mission route unavailable':mission?.scope??'Waiting for the mission grant');
  field('Tools',unknown?'Discovered workstation tools':state.stage==='build'?'Public rail documentation search':state.stage==='authorize'?
   'Astra documentation · operational events · incident view':'Investigation reads · exact maintenance ticket connector');
 }
 const expireLease=station==='vault'&&state.stage==='authorize'&&state.databaseLease?.status==='Active'&&!reached('history');
 if(station==='vault'){
  field('Credential state',unknown?(reached('contain')?'Inherited credential revoked':'Inherited employee access under investigation'):
   suspended?'Issuance blocked; affected lease revocation in progress':state.admission==='Failed'?'Issuance blocked by runtime admission':closed?'Mission credentials closed':
   state.databaseLease?state.databaseLease.id+' · '+state.databaseLease.status:state.credentialVersion===state.version?'Maintenance connector authorization active':
   reached('provider')?'Provider route configured':'No step has issued a mission credential');
  if(suspended){
   field('Verification',state.incident.confirmed.includes('vault')?'Vault confirmed revocation':'Awaiting Vault confirmation');
  }
  field('Custody','The trusted service holds the credential. Values are hidden.');
 }
 if(station==='mission'||station==='policy'){
  field('Mission',mission?.id??'No verified mission');
  field('Version and status',mission?`v${mission.version} · ${mission.status}`:'Awaiting authority');
  if(station==='policy')field('Evidence used','Verified subject and actor, current mission, resource, observed operation and parameters');
 }
 if(station==='memory'||station==='artifact'){
  field('Workspace',unknown?'Local to the workstation':mission?.memory??'Awaiting a mission');
  field('Status',suspended?(state.incident.confirmed.includes('artifacts')?'Quarantined':'Quarantine requested · awaiting confirmation'):
   unknown&&reached('contain')?'Quarantined':closed?'Archived':
   NovaRailway.deliveryDecision(state)==='Permit'?'Exact copy approved':reached('draft')?'Draft ready':reached('research')||reached('plan')?'Source notes available':'Empty');
  if(reached('second'))field('Separate workspace','M-105 · RE-105 documentation only');
  if(reached('draft')&&!suspended)field('Provenance',state.stage==='build'?'Public railway documentation':
   state.stage==='authorize'?'EV-204-01 · INC-117 · KB-042':'RE-204 technical package · Mira’s analysis'+(state.ticket?' · '+state.ticket:''));
 }
 if(station==='intake'||station==='delivery'||station==='review'){
  field('Request',unknown?'Unverified sender':mission?.id??'In the operations backlog');
  field('Report',reached('deliver')?'Delivery recorded':suspended?'Release paused':NovaRailway.deliveryDecision(state)==='Permit'?'Approved for Operations':
   reached('draft')?'Waiting for reviewer':'No report awaiting review');
 }
 if(station==='intake'&&unknown&&reached('accept'))field('Message','An unknown sender asks for the customer list and the cost of the disruption.');
 if(station==='externalSource'){
  field('Public rail reference','Operations can approve retrieval for public research. The source cannot issue a mission.');
  field('Outside transfer',unknown&&reached('artifact')?(reached('verify')?'No upload at the destination investigators checked':'Queued; destination evidence still needed'):
   'Outside destinations are outside the managed report route.');
 }
 if(station==='flink'){
  field('Correlation',reached('event')?'EV-204-01 door warning + EV-204-02 delay':'Waiting for the configured event window');
  field('Authority',reached('register')?'Mission authority validated standing policy and started M-304':'A correlation result still needs mission authority');
 }
 const reportControls=station==='artifact'&&state.stage==='resist'&&reached('approve')&&!reached('deliver')&&!suspended;
 if(['artifact','delivery','review'].includes(station)&&state.artifactRevision&&!suspended){
  const report=state.stage==='build'?'Revision 1 · Common causes of rail disruption include equipment faults, severe weather and signal failures.':
   state.stage==='authorize'?'Revision 1 · Inspect the RE-204 door sensor. The event log and earlier incident history support that recommendation.':
   state.artifactRevision===1?'Revision 1 · Inspect door sensor D3 before the next service.':
   'Revision 2 · Inspect door sensor D3 and confirm the connector is seated before the next service.';
  field('Current report',report);
  if(state.approval)field('Approved report',state.approval.request.digest);
  if(station==='delivery')field('Delivery service',NovaRailway.deliveryDecision(state));
 }
 if(station==='maintenance')field('Ticket',state.ticket??'No committed operation');
 if(station==='mira'){
  field('Linked task',state.childGrant?state.childGrant.id+' · '+state.childGrant.status:'No delegated grant');
  if(state.childGrant)field('Scope',state.childGrant.scope);
 }
 if(station==='soc'){
  field('Independent evidence',state.events.length+' recorded events');
  field('Containment',suspended?`${state.incident.confirmed.length} of ${NovaRailway.controllers.length} controllers verified`:
   unknown&&reached('verify')?'Tested routes closed':'No active incident');
 }
 const stage=Object.keys(NovaRailway.stages).indexOf(state.stage);
 const component=[
  {intake:'T',externalSource:'F',sandbox:'N',model:'L',vault:'C',artifact:'M',crm:'CRM',kafka:'K',soc:'Q'},
  {intake:'U',sandbox:'SV',model:'M',gateway:'G',identity:'AI',admission:'B',mission:'MA',vault:'V',artifact:'WS',review:'R',soc:'S'},
  {intake:'U',sandbox:'OS',gateway:'G',memory:'DS',identity:'AI',admission:'SPI',mission:'M',policy:'PDP',vault:'V',kafka:'K',database:'DB',astra:'DS',soc:'AUD'},
  {intake:'MA',delivery:'ART',sandbox:'OS',model:'L',gateway:'G',memory:'DS',artifact:'ART',identity:'AI',admission:'SPI',mission:'MA',policy:'PDP',
   vault:'V',review:'AP',kafka:'K',flink:'F',database:'DB',astra:'DS',maintenance:'RP',mira:'MI',soc:'SOC'}
 ][stage][station];
 return `<section class="nova-console" aria-labelledby="nova-console-title">
  <div class="console-heading"><div><p class="eyebrow">${esc(technology)}</p><h3 id="nova-console-title" tabindex="-1">${esc(name)}</h3></div>
   ${button('Close console',close,'secondary')}</div>
  ${rows.length?`<dl>${rows.map(([label,value])=>`<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl>`:''}
  ${recordTable}
  ${expireLease?`<div class="actions">${button('Advance to lease expiry',()=>act('expire-lease'),'secondary')}</div>`:''}
  ${reportControls?`<div class="actions">${state.artifactRevision===1?button('Clarify the report’s recommendation',()=>act('edit-report'),'secondary'):
   button('Select the original report',()=>act('restore-report'),'secondary')}</div>`:''}
  <details><summary>How this station works</summary><p>${esc(description)}</p>${novaSourceLinks(novaSources[station])}
   ${component?button('Locate this component in the architecture',()=>navigate(architectureRoute(stage,{component})),'secondary'):''}</details>
 </section>`;
}
function stageNetwork(state){
 return state.stage==='build'?'Approved public research and model routes':'Mediated mission endpoints · direct egress blocked';
}
