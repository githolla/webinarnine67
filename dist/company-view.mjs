import { people, cases, visibleCases, summary, canReview } from './company-model.mjs';
export const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const e = escapeHtml;
const icon = file => file ? `<img src="assets/${file}" alt="">` : '';
const miro = 'https://miro.com/blog/state-of-intelligent-collaboration-2026/';
const atlassian = 'https://www.atlassian.com/blog/state-of-teams-2026';
export const scenes = [
  { title: 'We bought Copilot.', lead: 'Then we asked people to show us last Tuesday. Northstar · 150 employees · Fictional company' },
  { title: 'Show us last Tuesday.', lead: 'Six people. Six different meanings of “we use AI.”' },
  { title: 'What actually reaches the CEO?', lead: 'Same people. Same week. A different view of the company.' },
  { title: 'Meet the person connecting the updates.', lead: 'Leah, Chief of Staff · Friday afternoon' },
  { title: 'First, see what the company already has.', lead: 'Look across departments before choosing where to build.' },
  { title: 'One finding. Useful in three places.', lead: 'A service manager reviews it. An account manager acts. Leadership sees progress.' },
  { title: 'Look company-wide. Start with a focused build.', lead: 'Bring the people who own the work, the systems, and the handoffs.' }
];
export const cues = [
  'Suuchi: “I feel pretty good about where we are.” Josh: “If I sat beside your employees for a morning, what would I see?”',
  'Josh: Ask each person to show a real prompt, the useful result, and where that result went next. These are different kinds of successful AI use.',
  'Josh: We saw a possible handoff pattern across Ops, Service and an account conversation. The CEO received three activity updates. Ben’s forecast pattern is a separate useful insight.',
  'Leah: “Everyone gets their update to me faster now. I still spend Friday figuring out which updates are talking about the same thing.”',
  'Suuchi: “If I brought Nine-67 in on Monday, what would you actually do?” Josh: “First, sit with people across the business and trace the results.”',
  'Suuchi: This is a proposed finding, not an automatic conclusion. Review the sources, exclude the unrelated case, assign an owner, then watch the business records agree.',
  'Josh: Bring Operations, IT, and two leaders whose teams depend on each other. Each brings one example where AI helps and one piece of work they still chase.'
];
const deskData = {
  ava: {
    title: 'Customer reply · Copilot in Outlook', icon: 'copilot.webp', kind: 'copilot',
    context: 'Ava’s draft customer reply',
    messages: [
      ['user', 'Make this sound less defensive.'],
      ['source', 'I understand why repeating the details is frustrating. I’ve asked Operations to confirm who owns this and will update you today.'],
      ['assistant', '“You shouldn’t have to repeat the details. I’m checking ownership with Operations and will send you an update today.”']
    ],
    action: 'Ava reviews the wording and sends her reply.',
    quote: '“I use it twenty times a day. Mostly tone. Nobody ever sat with me and showed me what else it could do for my job.”'
  },
  ben: {
    title: 'Forecast review · Excel + Copilot', icon: 'ms-excel.svg', kind: 'excel',
    context: 'Ben’s current workbook + three previous forecasts',
    messages: [
      ['user', 'Compare the last four forecasts. Which deals moved their close date twice, and where should I coach a rep?'],
      ['assistant', 'Three deals slipped twice. Two belong to the same rep. Review decision-maker access before treating the revised dates as firm.']
    ],
    action: 'Ben uses the analysis in coaching. His managers reuse the method.',
    quote: '“This changed how I coach my team. My managers use it. I don’t think anyone outside Sales has seen it.”'
  },
  nina: {
    title: 'Ask Ops · Teams', icon: 'ms-teams.svg', kind: 'teams',
    context: 'A department-built bot using approved ticket records',
    messages: [
      ['user', 'What kept getting escalated this week?'],
      ['assistant', 'Across 18 tickets: 8 possible ownership handoffs, 6 billing questions, and 4 access requests. Review the originals before treating these as findings.']
    ],
    action: 'Nina reviews the links with her team. The bot’s findings stay in Ops.',
    quote: '“It’s ugly, but we’d be lost without it.”'
  },
  marcus: {
    title: 'Grok · Personal phone', icon: '', kind: 'grok',
    context: 'A generic role-play. No customer names or private account records.',
    messages: [
      ['user', 'Role-play a customer who thinks our team keeps passing them around.'],
      ['assistant', '“I’ve explained this three times. Who is actually responsible for helping me?”'],
      ['user', 'I’ll be your point of contact. Let me confirm the owner and give you one clear update.']
    ],
    action: 'Marcus practices, handles the call, and moves to the next meeting.',
    quote: '“I keep names out of it. I’ve never asked whether we’re allowed to use it. I probably wouldn’t bring it up in a team meeting.”'
  },
  daniel: {
    title: 'Northstar Assist · Internal assistant', icon: '', kind: 'internal',
    context: 'Approved company documents',
    messages: [
      ['user', 'How should a customer escalation be handled?'],
      ['assistant', 'Name one accountable owner, record the next update date, and keep the customer informed. Source: Customer Escalation Procedure, §3.']
    ],
    action: 'Daniel launched the assistant. He sees opens and usage, but little evidence of which work improves.',
    quote: '“We got it into people’s hands. I’d love to know which parts actually helped them.”'
  },
  suuchi: {
    title: 'Claude · CEO preparation', icon: 'claude.svg', kind: 'claude',
    context: 'Department updates gathered by the Chief of Staff',
    messages: [
      ['user', 'What am I missing? Challenge my interpretation before Monday’s meeting.'],
      ['assistant', 'You have activity totals, but little evidence of whether the customer experience improved. What would tell you that the same problem is recurring across departments?']
    ],
    action: 'Suuchi uses the question to prepare for Monday. Someone still has to find the supporting evidence.',
    quote: '“This is where AI is most useful to me. It makes me think. My chief of staff gathers these updates every Friday.”'
  }
};
function peopleMap(state) {
  return `<nav class="people-map" aria-label="People across Northstar">${people.map(p=>`<button class="person-button" data-person="${p.id}" aria-pressed="${p.id===state.person}"><b>${p.name}</b><span>${p.department}</span><small>${p.ai}</small></button>`).join('')}</nav>`;
}
function board() {
  return `<section class="board-slide"><div class="board-title"><small>NORTHSTAR · BOARD UPDATE</small><h2>Our AI rollout</h2><span>150 employees · This quarter</span></div><div class="board-points"><p><b>Copilot rolled out company-wide</b><span>Every employee has access.</span></p><p><b>Internal AI assistant launched</b><span>Company knowledge, easier to find.</span></p><p><b>Sales using AI for forecasting</b><span>A promising example from the team.</span></p></div><blockquote class="ceo-quote">“I feel pretty good about where we are. And personally? I use Claude before almost every board meeting.”<cite>Suuchi · Playing Northstar’s CEO</cite></blockquote><p class="board-question">Josh: “If I spent a morning beside your employees, what would I see?”</p></section>`;
}
function desk(state) {
  const d=deskData[state.person];
  const p=people.find(person=>person.id===state.person);
  const extra=state.person==='ben'?`<table class="forecast-table"><thead><tr><th>Opportunity</th><th>Date changes</th><th>Coaching focus</th></tr></thead><tbody><tr><td>Atlas renewal</td><td>Twice</td><td>Decision-maker access</td></tr><tr><td>Beacon expansion</td><td>Twice</td><td>Decision-maker access</td></tr><tr><td>Delta rollout</td><td>Twice</td><td>Scope approval</td></tr></tbody></table>`:state.person==='nina'?`<div class="ticket-sources"><span>Possible handoff cases</span><button data-detail="source:CASE-201">CASE-201 ↗</button><button data-detail="source:CASE-204">CASE-204 ↗</button><button data-detail="source:CASE-218">CASE-218 ↗</button></div>`:state.person==='daniel'?`<div class="launch-message"><small>IT LAUNCH MESSAGE</small><p>“Try it out and let us know what you think.”</p></div>`:'';
  return `<div class="desk-layout">${peopleMap(state)}<div class="desk-focus"><section class="device ${d.kind} ${state.person==='marcus'?'phone-device':''}"><div class="device-bar">${icon(d.icon)}<b>${d.title}</b><span>${p.name} · ${p.department}</span></div><div class="device-content"><p class="context-label">Context: ${d.context}</p><div class="chat-stack">${d.messages.map(([role,text])=>`<div class="chat-message ${role}"><small>${role==='user'?p.name:role==='source'?'AVA’S ORIGINAL DRAFT':p.ai}</small><p>${text}</p></div>`).join('')}</div>${extra}<div class="source-strip">${d.action}</div></div></section><blockquote class="quote-caption">${d.quote}</blockquote>${state.person==='nina'?'<p class="ceo-aside">Suuchi: “Wait. We built that?”</p>':''}</div></div>`;
}
const reports=[
 ['ben','Ben found repeated deal slippage.','One revised forecast total.'],
 ['nina','Ask Ops surfaced a possible handoff pattern.','“18 tickets handled.”'],
 ['marcus','Marcus heard what repeated transfers feel like.','No account note. He handled the call.'],
 ['ava','Ava saw repeated frustration in customer replies.','“All customer messages answered.”']
];
function leadership(state) {
  return `<div class="desk-layout">${peopleMap(state)}<div class="leadership-view"><div class="report-comparison"><div class="comparison-head"><b>What we saw at the desks</b><b>What arrives on Friday</b></div>${reports.map(([id,insight,report])=>`<div class="comparison-row ${state.person===id?'selected':''}"><p>${insight}</p><p>${report}</p></div>`).join('')}</div><section class="executive-brief"><div class="device-bar">${state.person==='daniel'?'':icon('claude.svg')}<b>${state.person==='daniel'?'Daniel’s rollout report':'Claude · Based on the updates received'}</b></div><p>${state.person==='daniel'?'“The internal assistant is live. I can report who opened it. I still need to learn which work it helps.”':'“Sales revised its forecast. Operations handled 18 escalations. Customer Service responded to all inquiries.”'}</p></section><p class="pattern-note"><b>Ops, Service and Marcus saw pieces of a possible handoff problem.</b> The brief reports their activity separately.</p><div class="research-line"><span><b>83%</b> say AI improves individual productivity.</span><span><b>69%</b> say most AI work happens privately.</span><a href="${miro}" target="_blank" rel="noopener">Miro, 2026 ↗</a></div></div></div>`;
}
function chiefOfStaff() {
  return `<div class="friday-desk"><section class="chase-thread"><div class="device-bar">${icon('ms-teams.svg')}<b>Leah · Friday afternoon</b><span>Chief of Staff</span></div><div class="thread-message"><small>2:14 PM · LEAH → NINA</small><p>“Anything behind the ticket volume? Can you send the original cases?”</p></div><div class="thread-message"><small>2:31 PM · LEAH → AVA</small><p>“Can you share examples of customers being passed between teams?”</p></div><div class="thread-message"><small>3:06 PM · LEAH → MARCUS</small><p>“Nina and Ava may be seeing the same thing you heard. Can we talk?”</p></div><div class="source-strip">Three follow-ups, then manual comparison and assembly.</div></section><section class="brief-document"><small>WEEKLY BRIEF · WORKING DRAFT</small><h2>Are these the same issue?</h2><p>Ops tickets + service examples + account observations.</p><p>Find the overlap. Check the sources. Name an owner. Send Suuchi a useful brief.</p><blockquote class="cos-quote">“Everyone gets their update to me faster now. I still spend Friday figuring out which updates are talking about the same thing.”</blockquote></section></div><div class="research-line"><span><b>85%</b> of knowledge workers use AI at work.</span><span><b>29%</b> have embedded it in their workflow.</span><a href="${atlassian}" target="_blank" rel="noopener">Atlassian, 2026 ↗</a></div>`;
}
const discoveries={
 ava:['Useful daily assistance','Copilot makes her customer replies clearer. She still asks other teams for facts.','Observe a Friday review. Connect existing facts and keep human judgment visible.'],
 ben:['A practice worth spreading','His forecasting method works, but depends on his workbook and remembered prompts.','Make the review repeatable with Ben. Share the assumptions with Finance. Teaching may be the right first step.'],
 nina:['A working tool worth examining','Ask Ops finds useful themes. Other teams and IT have not evaluated how to reuse it.','Test recent cases with Nina and IT. Check sources and permissions, then route reviewed findings to Service.'],
 marcus:['A useful technique without clear guidance','Private role-play helps him prepare. Business observations rarely reach the account record.','Keep private chats private. Agree on approved mobile tools and an easy way to submit business observations.'],
 daniel:['IT needs a view of business value','Usage tells him people opened the assistant. It does not reveal valuable local tools or painful handoffs.','Build a shared inventory of applications, owners, data access, useful practices and next opportunities.'],
 suuchi:['A sponsor who can connect the company','Claude helps her think. Her brief still depends on someone collecting and reconciling updates.','Map the whole company, then prioritize one measurable cross-department build with leadership.']
};
function discovery(state) {
  const d=discoveries[state.person];
  return `<div class="discovery-question">“Show me the last real thing you did with AI. What happened to the result? <b>Who needed it next?</b>”</div><div class="desk-layout discovery-layout">${peopleMap(state)}<section class="discovery-detail"><small>NINE-67 · OBSERVE BEFORE RECOMMENDING</small><h2>${d[0]}</h2><div><h3>What we discover</h3><p>${d[1]}</p></div><div><h3>What we could do</h3><p>${d[2]}</p></div><p class="discovery-outcome">The executive gets a company-wide map: what to reuse, what to teach, what to connect, and what to build.</p></section></div>`;
}
function findingState(state) {
  if(state.stage===0)return 'Candidate finding · Human review required';
  if(state.stage===1)return 'Reviewed finding · Ready to assign';
  if(state.stage===2)return 'Assigned · Investigation not started';
  if(state.stage===3)return 'Investigation in progress';
  return 'Change being tested · Outcome not yet established';
}
function pilotTabs(state) {
  return `<nav class="pilot-tabs" aria-label="Connected business views">${[['teams','Teams · Service manager'],['crm','CRM · Marcus'],['executive','Weekly operating review']].map(([id,label])=>`<button data-pilot-view="${id}" aria-pressed="${state.pilotView===id}">${label}</button>`).join('')}</nav>`;
}
function findingHeader(state) {
  const s=summary(state);
  return `<div class="finding-header"><div><small>FINDING HF-01 · REVISION ${state.revision}</small><h2>Customers passed between teams</h2></div><span class="pilot-status">${findingState(state)}</span></div><div class="finding-detail"><b>${s.caseCount} ${state.approved?'reviewed':'candidate'} cases · ${s.accountCount} accounts</b><span>From 18 tickets. A pattern to investigate, not a proven cause.</span></div>`;
}
function pilot(state) {
  const s=summary(state);
  const owner=state.owner||'Not assigned';
  const due=state.due||'Not set';
  let body='';
  if(state.pilotView==='teams') {
    const records=visibleCases(state,'teams');
    body=`<section class="pilot-panel teams-panel"><div class="device-bar">${icon('ms-teams.svg')}<b>Service review · Teams</b><span>Simulated integration</span></div>${findingHeader(state)}<div class="case-list">${records.map(record=>`<div class="case-row ${state.excluded.includes(record.id)?'excluded':''}"><button data-detail="source:${record.id}"><b>${record.id}</b><span>${record.account}</span><span>${record.title}</span><small>View source ↗</small></button>${state.approved?`<span class="reviewed-label">${state.excluded.includes(record.id)?'Excluded':'Reviewed'}</span>`:`<button class="exclude-case" data-exclude="${record.id}" ${state.excluded.includes(record.id)?'disabled':''}>${state.excluded.includes(record.id)?'Excluded':'Exclude'}</button>`}</div>`).join('')}</div><p class="review-instruction">${state.approved?'The service manager’s review is recorded. Assign an accountable owner.':'Review the originals. CASE-218 concerns a delivery address, not a team handoff.'}</p></section>`;
  } else if(state.pilotView==='crm') {
    const records=visibleCases(state,'crm');
    body=`<section class="pilot-panel crm-panel"><div class="device-bar">${icon('hubspot.svg')}<b>Account workspace · Northwind</b><span>Marcus · Permitted account records</span></div><div class="account-heading"><small>ACCOUNT HEALTH</small><h2>Northwind Services</h2><p>Related finding: customers passed between teams.</p></div><dl class="record-fields"><div><dt>Accountable owner</dt><dd>${owner}</dd></div><div><dt>Next update due</dt><dd>${due}</dd></div><div><dt>Finding status</dt><dd>${findingState(state)}</dd></div><div><dt>Related account cases</dt><dd>${state.approved?records.length:'Awaiting review'}</dd></div></dl><div class="account-observation"><small>MARCUS’S BUSINESS OBSERVATION</small><p>${state.accountObservation?'“Customer described repeating the issue to three teams. Please keep one named contact.”':'Marcus can call the customer with the reviewed context and record what he learns.'}</p>${state.accountObservation?'<span>Saved to the account · Shared with the investigation owner</span>':'<span>No private Grok conversation is imported.</span>'}</div><div class="source-strip">${records.map(record=>`<button data-detail="source:${record.id}">${record.id} ↗</button>`).join('')}<span>Only Marcus’s permitted account records are shown.</span></div></section>`;
  } else {
    body=`<section class="pilot-panel executive-panel"><div class="device-bar"><b>Northstar · Weekly operating review</b><span>Approved business records</span></div>${findingHeader(state)}<dl class="record-fields"><div><dt>Accountable leader</dt><dd>${owner}</dd></div><div><dt>Next update</dt><dd>${due}</dd></div><div><dt>Progress</dt><dd>${state.progressNote||findingState(state)}</dd></div><div><dt>Customer perspective</dt><dd>${state.accountObservation?'Marcus’s observation attached':'No observation recorded yet'}</dd></div></dl><div class="executive-action"><small>WHAT LEADERSHIP CAN NOW ASK</small><p>“Nina, what have we learned, and is the change reducing repeat handoffs?”</p><span>The issue has evidence, an owner and progress. It is not just a ticket count.</span></div><button class="text-button" data-detail="evidence">Open permitted supporting records ↗</button></section>`;
  }
  if(!state.approved&&state.pilotView!=='teams')body=`<section class="pilot-panel empty-state"><h2>No reviewed finding has been shared here yet.</h2><p>The service manager must review the candidate cases before publishing them to the account and executive views.</p><button data-pilot-view="teams">Return to the source review →</button></section>`;
  const receipt=state.stage===0?'The service manager chooses what becomes a shared finding.':state.stage===1?`${s.reviewedCount} cases reviewed. Excluded records stay out of the shared finding.`:state.stage===2?(state.accountObservation?'Marcus’s observation is attached to HF-01. Leadership can see it without chasing a Friday update.':'Nina and Tuesday now appear in Teams, the account record and the weekly review.'):state.stage===3?'Nina’s investigation status is shared across the same three views.':'The change being tested and its status are visible across the same records. Measurement comes next.';
  return `<div class="pilot-shell">${pilotTabs(state)}${body}<div class="activity-receipt"><b>${state.stage?'Shared update':'Human review'}</b><span>${receipt}</span><button data-detail="architecture" class="text-button">How it works ↗</button></div></div>`;
}
function offer() {
  return `<section class="engagement"><div class="engagement-stages">${[
    ['01','Discover across departments','A map of tools, useful practices, employee-built solutions and manual handoffs.'],
    ['02','Prioritize with leadership','A company-wide roadmap and one defined build with an owner and success measure.'],
    ['03','Build and pilot','A working connection, tested with the people on both sides of the handoff.'],
    ['04','Measure and expand','Evidence on time chasing inputs, finding-to-action time and continued use.']
  ].map(([n,title,text])=>`<section><small>${n}</small><h2>${title}</h2><p>${text}</p></section>`).join('')}</div><div class="invite-list"><div><small>WHO TO BRING</small><p>Operations + IT + two department leaders whose teams depend on each other.</p></div><div><small>WHAT TO BRING</small><p>One example where AI helps. One piece of work your people still chase.</p></div></div><div class="offer-cta"><h2>Book an AI Workflow Discovery Session.</h2><p>See how your teams use AI today and where Nine-67 can connect the work across your company.</p></div></section>`;
}
export function renderScene(state) {return [board,desk,leadership,chiefOfStaff,discovery,pilot,offer][state.scene](state);}
export function primaryAction(state) {
  if(state.scene===0)return {label:'Sit beside the employees →',action:'next'};
  if(state.scene===1){const index=people.findIndex(p=>p.id===state.person);return index<people.length-1?{label:`Visit ${people[index+1].name} →`,action:'next-person'}:{label:'What reaches the CEO? →',action:'next'};}
  if(state.scene===2)return {label:'Who connects these updates? →',action:'next'};
  if(state.scene===3)return {label:'What would Nine-67 do on Monday? →',action:'next'};
  if(state.scene===4)return {label:'Show one connected build →',action:'next'};
  if(state.scene===5){
    if(!state.approved)return canReview(state)?{label:'Record the service manager’s review →',action:'approve'}:{label:'Review the unrelated case →',action:'outlier'};
    if(state.stage===1)return {label:'Assign Nina · Update due Tuesday →',action:'assign'};
    if(!state.accountObservation)return {label:'Record Marcus’s customer follow-up →',action:'observation'};
    if(state.stage===2)return {label:'Show Nina starting the investigation →',action:'investigate'};
    if(state.stage===3)return {label:'Show the progress update →',action:'progress'};
    return {label:'How an engagement starts →',action:'next'};
  }
  return {label:'Book an AI Workflow Discovery Session →',action:'discovery'};
}
export function renderDetail(state,key) {
  if(key.startsWith('source:')) {
    const id=key.slice(7);
    const record=cases.find(row=>row.id===id);
    if(!record)return {title:'Source unavailable',html:'<p>This record is not part of the demonstration.</p>'};
    if(state.scene===5&&state.pilotView!=='teams'&&!visibleCases(state,state.pilotView).some(row=>row.id===id))return {title:'Record not available in this view',html:'<p>This role can inspect only its permitted supporting records.</p>'};
    return {title:`${record.id} · ${record.account}`,html:`<p class="detail-label">SYNTHETIC SOURCE RECORD · ORIGINAL CASE</p><h3>${e(record.title)}</h3><p>${e(record.description)}</p><p>${record.id==='CASE-218'?'<b>Review note:</b> This is an address correction. It does not support the suggested handoff finding.':'The source describes a possible ownership handoff. A human must decide whether it belongs in the finding.'}</p>${state.scene===5&&state.pilotView==='teams'&&!state.approved?`<button class="primary" data-exclude="${record.id}" ${state.excluded.includes(record.id)?'disabled':''}>${state.excluded.includes(record.id)?'Excluded from finding':'Exclude this case from the finding'}</button>`:''}`};
  }
  if(key==='evidence')return {title:'Supporting records · Executive view',html:`<p>The executive sees the reviewed finding and permitted supporting links. Access to raw account records remains scoped.</p><div class="evidence-links">${visibleCases(state,'executive').map(record=>`<button data-detail="source:${record.id}">${record.id} · ${e(record.account)} ↗</button>`).join('')}</div>`};
  if(key==='architecture')return {title:'What connects these three views',html:`<div class="build-list"><section><h3>Approved business records</h3><p>Connect ticket IDs, account IDs and assignments. Preserve the source links and versions. Private AI conversations are not collected.</p></section><section><h3>Matching + permissions</h3><p>Propose related cases for review. Match them to permitted accounts. Give Service, account owners and leadership the appropriate views.</p></section><section><h3>Human review + write-back</h3><p>Exclude unrelated cases, record the reviewer, assign an owner and due date, then update the authorized business records.</p></section><section><h3>Reusable foundations</h3><p>The next build can reuse account connections, access controls and ownership rules, for example connecting Ben’s forecast assumptions to Finance.</p></section></div><p class="detail-note">This prototype synchronizes simulated views locally. Production integrations require connectors, permissions, verification and evaluation with your actual systems.</p>`};
  if(key==='discovery')return {title:'Book an AI Workflow Discovery Session',html:`<p class="detail-quote">See how your teams use AI today and where Nine-67 can connect the work across your company.</p><p><b>Bring:</b> Operations, IT, and two leaders whose teams depend on each other.</p><p><b>Each brings:</b> one example where AI helps and one piece of work they still chase.</p><div id="booking-content"><b>Type “discovery” in the webinar chat to arrange the session.</b></div><p class="detail-note">The first conversation identifies where a company-wide assessment should start and what a focused first build could achieve.</p>`};
  if(key==='research')return {title:'Research behind the story',html:`<p><b>83%</b> of Miro respondents agreed AI has made individuals more productive. <b>69%</b> said most AI-assisted work happens in private sessions rather than shared spaces. <a href="${miro}" target="_blank" rel="noopener">Miro, November 2026 ↗</a></p><p><b>85%</b> of knowledge workers in Atlassian’s survey use AI at work, while <b>29%</b> have embedded it in their workflows. <a href="${atlassian}" target="_blank" rel="noopener">Atlassian, April 2026 ↗</a></p><p class="detail-note">Self-reported vendor surveys with different samples. Northstar is a fictional illustration, not measured Nine-67 performance.</p>`};
  return {title:'About this demonstration',html:'<p>Northstar and its employees, records, prompts, outputs and events are fictional. Suuchi is playing its CEO. All interfaces and cross-system updates are illustrative simulations, not live product sessions or integrations.</p><p>No private chats are read, no messages are sent, and no business records are changed outside this local demonstration. Source review and access-scoped views illustrate the controls a real build would need.</p>'};
}
