/* Illustrative roles and request paths. Browsing these examples does not play either story. */
const ArchitectureReference = (() => {
 const groups = [
  ['People and authority', ['people','verify','iai','mission']],
  ['Where Nova works', ['orchestrate','openshell','vault']],
  ['Model and tool connections', ['aiGateway','mcpGateway','mcpTool']],
  ['Decisions and effects', ['authorization','crm']],
  ['Signals and response', ['risk','antenna','controllers']]
 ];
 const components = {
  people:{
   name:'Priya, Nova, Morgan and Pip',kind:'Story actors',
   summary:'Priya sponsors the work. Nova prepares the handover. Morgan approves each exact share. Pip formats only the file it receives.',
   detail:'The sponsor and reviewer have different responsibilities. Nova and Pip are distinct identities. The CRM owns its data and delivery rules.'
  },
  verify:{product:'verify',kind:'Product',summary:'Confirms who the human is. A configured CIBA flow can collect consent on a separate device.'},
  iai:{product:'iai',kind:'Product',summary:'Identifies the agent and whose authority it is acting under.'},
  mission:{product:'mission',kind:'Customer integration',summary:'Records the task, allowed accounts, destination and current version outside Nova’s instructions.'},
  orchestrate:{product:'orchestrate',kind:'Product',summary:'Coordinates the work. A configured workflow can assign the formatting step to Pip.'},
  openshell:{product:'openshell',kind:'Runtime',summary:'Runs Nova in an isolated workspace and controls contact with files and services.'},
  vault:{product:'vault',kind:'Product',summary:'Checks access to its own credential paths. Supplies short-lived access for a configured target.'},
  aiGateway:{
   name:'IBM watsonx Orchestrate AI Gateway',kind:'Orchestrate capability',
   summary:'Integrates models from multiple providers and lets operators configure model routing.',
   detail:'It can also discover and import external agents from supported platforms. This is a separate role from checking the records in Nova’s CRM request.',
   sources:[['Model integration and routing','https://www.ibm.com/products/watsonx-orchestrate/developers'],['Supported external agent discovery','https://www.ibm.com/new/announcements/new-in-ibm-watsonx-orchestrate-expanded-third-party-agent-management-and-agent-identities']]
  },
  mcpGateway:{
   name:'MCP gateway',kind:'Optional integration pattern',
   summary:'Can examine an agent’s tool call and apply configured policy before forwarding it to the MCP server.',
   detail:'On the optional CRM route, it sits in front of the tool server. The CRM still decides whether to return this record or attach the requested file.',
   sources:[['Independent MCP gateway example','https://blog.iamidentity.ai/blog/mcp-agent-gateway/']]
  },
  mcpTool:{
   name:'CRM tool via Model Context Protocol (MCP)',kind:'Protocol and configured tool',
   summary:'The MCP server exposes an operation Nova can call to fetch approved account records.',
   detail:'The tool carries the request to CRM. The current work order and customer data policy determine which records CRM can return.',
   sources:[['MCP tools specification','https://modelcontextprotocol.io/specification/latest/server/tools']]
  },
  authorization:{name:'Authorization decision service',product:'authorization',kind:'Proposed integration',summary:'Evaluates the action the CRM observes against current task and resource rules.'},
  crm:{
   name:'Customer CRM',kind:'Customer application',
   summary:'Checks the actual read, attachment or send at the point of use and owns the result.',
   detail:'Its enforcement point observes the operation, records, file revision and recipient. It enforces hard data restrictions and compares each confidential share with a current, single-use approval.'
  },
  risk:{product:'risk',kind:'Optional product input',summary:'Can supply identity risk observations to a configured response policy.'},
  antenna:{product:'antenna',kind:'Optional integration',summary:'Exchanges security signals with configured systems. Each receiver applies its own control.'},
  controllers:{
   name:'Runtime, Vault, CRM and queue controllers',kind:'Configured response',
   summary:'Stop the workload, revoke credentials, close service sessions and check waiting work.',
   detail:'An independent controller retests the old route and records the result. An unreachable service leaves the route unverified. A completed delivery stays delivered.'
  }
 };

 const flows = {
  read:{
   title:'Read the customer records',
   premise:'Priya asks for a handover on Harbor Bikes and Pine Studio.',
   steps:[
    ['mission','Record these two accounts, the one-page handover and Morgan as recipient.'],
    ['iai','Give Nova a separate agent identity and delegated authority for the task.'],
    ['openshell','Open the governed workspace and permit the customer records route.'],
    ['mcpGateway','Optional route: a configured tool gateway checks and forwards the request.'],
    ['mcpTool','In the MCP example, the server exposes the CRM read to Nova. CRM still needs to authorize the actual operation.'],
    ['vault','For the configured source path, the broker uses a Vault-scoped credential. CRM owns its separate service session.'],
    ['crm','Check the actual read of Harbor Bikes and Pine Studio against current task and resource policy before returning records.']
   ],
   result:'Nova reads the two accounts and can cite them in the handover.'
  },
  change:{
   title:'Add a customer',
   premise:'Priya suggests adding Alder Books after Morgan receives the review copy.',
   steps:[
    ['people','Confirm the request via Priya’s saved contact or the current work order.'],
    ['mission','Record the request. The original two accounts stay in scope while approval is pending.'],
    ['authorization','Check that the sponsor, agent ceiling and CRM policy permit the addition.'],
    ['mission','Record the approved scope and retire the old session generation.'],
    ['crm','Check the actual Alder Books read under the new task before providing its record.']
   ],
   result:'Alder Books can be added. The private notes and recipient rule stay as before.'
  },
  send:{
   title:'Approve and send a report',
   premise:'Morgan may approve a review copy for feedback and later a separate final copy.',
   steps:[
    ['people','Morgan sees the file, revision, accounts and intended recipient.'],
    ['verify','A configured CIBA channel can authenticate Morgan and collect consent.'],
    ['authorization','Application policy binds approval to this action, current authority, expiry and one use.'],
    ['crm','Compare the actual request with the approval. Enforce current resource policy before sending and record the outcome.']
   ],
   result:'Each approved copy travels once. A changed revision, destination or expired approval blocks the send.'
  },
  refuse:{
   title:'Block a private attachment',
   premise:'An outside contact’s document contains an instruction to attach private meeting notes.',
   steps:[
    ['mission','Compare the text with Priya’s work order. The work order gives permission to share the summary.'],
    ['openshell','The configured environment permits access to CRM.'],
    ['crm','Observe the private attachment in the actual request.'],
    ['authorization','Apply the hard rule that keeps private notes inside the CRM.'],
    ['crm','Refuse the attachment before delivery. Keep the permitted work available.']
   ],
   result:'The source can influence what Nova attempts. Independent checks prevent the disclosure.'
  },
  delegate:{
   title:'Give Pip a file-only task',
   premise:'Nova wants Pip to tidy the handover’s headings.',
   steps:[
    ['orchestrate','Coordinate the formatting step using a separate helper identity.'],
    ['authorization','Check the parent task, Pip’s ceiling and the resource rules.'],
    ['people','Give Pip only the specific report revision and formatting rights.'],
    ['crm','Require a fresh exact approval before sharing the revised report with Morgan.']
   ],
   result:'Pip formats the file without borrowing Nova’s credentials or obtaining CRM read or send rights.'
  },
  stop:{
   title:'Stop and verify access',
   premise:'Morgan has the handover. The team closes this task and checks what still works.',
   steps:[
    ['mission','Withdraw the task grant and stop new governed operations.'],
    ['openshell','Stop Nova’s workspace.'],
    ['antenna','Where configured, a shared signal can notify receivers. Confirmation comes from the systems that act.'],
    ['controllers','Revoke the credential, close the CRM session and check any queued follow-up.'],
    ['controllers','Retest the old route independently. Record a refusal or leave the result unverified if the controller cannot answer.']
   ],
   result:'The tested route closes. Earlier delivery stays delivered.'
  }
 };

 const threats = [
  {
   title:'A curious actor tries something outside the task',
   alex:'Try the YouTube link before the parent agrees, or try attaching the group’s private notes.',
   nova:'Try opening Alder Books before the task changes, or try adding the private attachment.',
   control:'Device or task scope limits the read. The school app or CRM checks the actual attachment.',
   flow:'change'
  },
  {
   title:'An outside instruction claims authority',
   alex:'Jamie forwards a message using Ms Patel’s name. Compare it with the school-app assignment.',
   nova:'A document from outside the account team asks Nova to include private notes. Compare it with Priya’s work order.',
   control:'The trusted task source defines permission. The resource refuses the prohibited attachment even if it is attempted.',
   flow:'refuse'
  },
  {
   title:'An approved action changes before execution',
   alex:'Try sending the homework to a friend instead of Ms Patel.',
   nova:'Change the destination or revision after Morgan’s approval, or let approval expire.',
   control:'The application checks the real destination and, for Nova, the exact live approval.',
   flow:'send'
  },
  {
   title:'A helper or alternate route would exceed the scope',
   alex:'Give Sam the file to proofread. Trying another account after the school has refused the notes pauses the story.',
   nova:'Give Pip one formatting task. An explicit attempt to go around the CRM refusal pauses access for Priya’s review.',
   control:'File-only delegation keeps the original limits. Recovery checks the current task and invalidates the paused session.',
   flow:'delegate'
  },
  {
   title:'Access survives after work is stopped',
   alex:'The school tab can stay open after the phone is put away.',
   nova:'The CRM session or a queued follow-up can survive the runtime stop.',
   control:'Independent controllers revoke or cancel each remaining path and verify the result.',
   flow:'stop'
  }
 ];

 const outsideCoverage = 'The stories illustrate controls through scripted outcomes. Live prompt-injection detection, poisoned persistent memory, supply-chain compromise, sandbox escapes and coverage of unmanaged routes require separate implementation and testing. A verified stop covers the tested route.';

 return {groups,components,flows,threats,outsideCoverage};
})();

if(typeof module!=='undefined')module.exports=ArchitectureReference;
