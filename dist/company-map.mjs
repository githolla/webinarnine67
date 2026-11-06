const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
export const networkPeople = Object.freeze([
  { id: 'dana', name: 'Dana', role: 'CEO', ai: 'Claude', output: 'Board questions', color: '#7c729d', current: 'Challenges her thinking before board meetings.', value: 'Better questions for the leadership team.', gap: 'Her answers depend on the updates others gather.', next: 'Give leadership a reviewed brief with owners, evidence and progress.', system: 'Weekly operating review' },
  { id: 'daniel', name: 'Daniel', role: 'IT', ai: 'Ask Parkside', output: 'Company answers', color: '#5d8fa3', current: 'Built the internal assistant with Copilot Studio.', value: 'Approved company knowledge is easier to find.', gap: 'Usage does not show which business work improved.', next: 'Connect permitted records and evaluate useful outcomes with each team.', system: 'Copilot Studio' },
  { id: 'ben', name: 'Ben', role: 'Sales', ai: 'Copilot', output: 'Forecast insight', color: '#729b8a', current: 'Uses Copilot in Excel to compare forecast changes.', value: 'Finds repeated slippage and coaches his reps.', gap: 'The method and assumptions stay inside Sales.', next: 'Share the reviewed assumptions with Finance through a repeatable review.', system: 'Excel' },
  { id: 'priya', name: 'Priya', role: 'Finance', ai: 'Claude', output: 'Power Query logic', color: '#c19b61', current: 'Uses Claude to develop and understand Power Query transformations.', value: 'A useful finance workflow built by someone who knows the data.', gap: 'The transformation is useful but not yet a shared, maintained asset.', next: 'Review the transformation with Priya, document it and reuse the approved logic.', system: 'Excel · Power Query' },
  { id: 'nina', name: 'Nina', role: 'Operations', ai: 'Ask Ops', output: 'Ticket patterns', color: '#bc7f83', current: 'Her department built a Teams bot that links possible ticket patterns.', value: 'Ops finds recurring work worth investigating.', gap: 'The findings stay in Ops instead of becoming shared actions.', next: 'Review the sources, assign an owner and carry the finding into Service and the weekly review.', system: 'Teams · Department bot' },
  { id: 'marcus', name: 'Marcus', role: 'Account manager', ai: 'Grok · Phone', output: 'Account insight', color: '#928a79', current: 'Practices generic customer conversations on his personal phone.', value: 'He prepares for difficult conversations without entering private account data.', gap: 'Useful business observations may never reach the account record.', next: 'Let Marcus volunteer an account observation in the CRM. Keep personal Grok chats private.', system: 'Volunteered CRM observation' },
  { id: 'ava', name: 'Ava', role: 'Customer Service', ai: 'Copilot', output: 'Customer replies', color: '#6e9fa0', current: 'Uses Copilot to improve the tone of Zendesk customer replies.', value: 'Customers get clearer, more considerate responses.', gap: 'Repeated customer frustration is not visible across departments.', next: 'Use permitted service records to review recurring issues with Operations.', system: 'Zendesk' },
  { id: 'elena', name: 'Elena', role: 'Coordinator', ai: 'Copilot', output: 'Thursday tracker', color: '#8a98b2', current: 'Barely uses Copilot. A generic “help with projects” prompt did not help.', value: 'She still updates the Thursday tracker manually in Excel.', gap: 'A license did not show her how AI could help with her actual task.', next: 'Build a guided review of approved notes and the current tracker. Elena confirms unclear owners before applying changes.', system: 'Excel · Manual tracker' },
  { id: 'leah', name: 'Leah', role: 'Chief of Staff', ai: 'Copilot', output: 'Friday briefing', color: '#a68b9f', current: 'Uses Copilot to polish PowerPoint wording after manually assembling the Friday update.', value: 'The presentation reads more clearly after she has gathered the facts.', gap: 'Copilot does not remove her collection, comparison and reconciliation work.', next: 'Build the brief from reviewed findings, named owners and current progress.', system: 'PowerPoint' }
]);
export const networkConnections = Object.freeze([
  { from: 'nina', to: 'ava', why: 'Service reviews the recurring customer issue with Ops.' },
  { from: 'nina', to: 'marcus', why: 'The account owner gets the reviewed cases relevant to his customer.' },
  { from: 'nina', to: 'leah', why: 'The Friday brief gets evidence, an owner and current progress.' },
  { from: 'ben', to: 'priya', why: 'Finance can inspect the reviewed forecast assumptions.' },
  { from: 'priya', to: 'daniel', why: 'IT helps maintain and reuse the reviewed Power Query method.' },
  { from: 'leah', to: 'dana', why: 'The CEO sees the reviewed finding and who owns the next step.' },
  { from: 'daniel', to: 'elena', why: 'IT supports a guided tracker workflow that Elena can review and use.' }
]);
const toolMarks = {
 dana: [['claude.svg','Claude'],['ms-powerpoint.svg','PowerPoint']],
 daniel: [['ms-teams.svg','Teams · Ask Parkside'],['ms-sharepoint.svg','SharePoint']],
 ben: [['copilot.webp','Copilot'],['ms-excel.svg','Excel']],
 priya: [['claude.svg','Claude'],['ms-excel.svg','Excel · Power Query']],
 nina: [['ms-teams.svg','Teams · Ask Ops'],['ms-sharepoint.svg','SharePoint List']],
 marcus: [['grok.svg','Grok'],['hubspot.svg','HubSpot']],
 ava: [['copilot.webp','Copilot'],['zendesk.svg','Zendesk']],
 elena: [['copilot.webp','Copilot'],['ms-excel.svg','Excel']],
 leah: [['copilot.webp','Copilot'],['ms-powerpoint.svg','PowerPoint']]
};
const cardData = {
  dana: {quote:'“We bought Copilot for everyone. I use Claude.”',kind:'chat',label:'Claude · Board preparation',left:'Challenge these claims',right:'What evidence supports them?'},
  daniel: {quote:'“We launched an assistant. We need feedback.”',kind:'chat',label:'Ask Parkside · Company guidance',left:'How do I escalate this?' ,right:'Procedure §3 cited'},
  ben: {quote:'“I figured out a better forecast review.”',kind:'table',label:'Excel · Forecast review',left:'Atlas renewal',right:'Close date moved twice'},
  priya: {quote:'“I built this with AI. It runs every month.”',kind:'table',label:'Excel · Power Query',left:'3 branch formats',right:'Refresh → review exceptions'},
  nina: {quote:'“Six of us use this bot every morning.”',kind:'table',label:'Ask Ops · Ticket review',left:'18 tickets',right:'8 possible handoffs'},
  marcus: {quote:'“I use it on my phone. I haven’t mentioned it.”',kind:'chat',label:'Grok · Generic practice only',left:'Play a frustrated customer',right:'Who owns my issue?'},
  ava: {quote:'“Writing is faster. Finding the answer isn’t.”',kind:'chat',label:'Copilot · Reply after checking tickets',left:'Make this warmer',right:'You shouldn’t have to repeat it'},
  elena: {quote:'“I want to use it. Where do I start?”',kind:'tracker',label:'Excel · Still updated manually',left:'Thursday tracker',right:'Copy dates + owners'},
  leah: {quote:'“I still pull everyone’s work together.”',kind:'tracker',label:'PowerPoint · After manual assembly',left:'Three follow-ups',right:'Assemble → polish slides'}
};
export const improvements = Object.freeze({
  priya: {label:'Priya · Reuse a proven method',people:['priya'],steps:[['Branch files','Approved input folder'],['Validated workflow','Priya’s reviewed transformation'],['Human review · Maya','Another branch checks exceptions'],['Reviewed branch report','Priya owns the supported workflow']],note:'Reuse the method Priya already built. Keep exceptions visible.',build:'priya'},
  elena: {label:'Elena · A guided update workflow',people:['elena','daniel'],steps:[['Notes + tracker','Her actual Thursday inputs'],['Proposed changes','AI compares owners and dates'],['Elena confirms','She checks each suggested change'],['Updated tracker','Confirmed changes only']],note:'A guided workflow proposes changes and asks Elena to resolve uncertainty.',build:'elena'},
  nina: {label:'Nina · Carry a reviewed finding',people:['nina','marcus','leah'],steps:[['Ticket finding','Source cases stay attached'],['Nina reviews','Exclude unrelated cases'],['Publish finding','Named owner + next update'],['Account + briefing','Marcus and Leah see the same fact']],note:'Share reviewed business records. Private chats stay private.',build:'nina'}
});
const manualConnections = Object.freeze([
  {from:'ben',to:'priya',type:'manual',label:'Ben exports the forecast. Priya reconciles it.'},
  {from:'nina',to:'leah',type:'manual',label:'Nina sends case links. Leah follows up.'}
]);
export function buildNetwork(mode='fragmented', improvement='priya') {
  const selected = improvements[improvement] || improvements.priya;
  const nodes = networkPeople.map((person,index)=>({id:`person:${person.id}`,owner:person.id,type:'person',row:Math.floor(index/3),column:index%3,label:person.name}));
  const edges = [...manualConnections];
  if(mode==='connected') edges.push(...selected.steps.slice(1).map((step,index)=>({from:`step:${index}`,to:`step:${index+1}`,type:'proposed',label:`${selected.steps[index][0]} → ${step[0]}`})));
  return {nodes,edges,improvement:mode==='connected'?selected:null};
}
function card(person,connected,improvement) {
  const data=cardData[person.id];
  const involved=connected&&improvement.people.includes(person.id);
  const markers=toolMarks[person.id].map(([file,label])=>`<span><img src="assets/${file}" alt="">${escapeHtml(label)}</span>`).join('');
  const localType=['elena','leah'].includes(person.id)?'manual':'existing';
  return `<button class="employee-work ${involved?'improvement-member':''}" data-workspace="${person.id}" aria-label="Open ${person.name}’s actual workspace" style="--department:${person.color}"><header><h2>${person.name}</h2><span>${person.role}</span><small aria-hidden="true">↗</small></header><div class="employee-tools">${markers}</div><p class="employee-quote">${escapeHtml(data.quote)}</p><div class="work-mini ${data.kind} ${localType}" aria-label="${escapeHtml(data.label)}"><span>${escapeHtml(data.left)}</span><i aria-hidden="true"></i><b>${escapeHtml(data.right)}</b></div></button>`;
}
function selectedFlow(state) {
  const id=Object.hasOwn(improvements,state.improvement)?state.improvement:'priya';
  const selected=improvements[id];
  return `<section class="selected-improvement" aria-label="One proposed improvement"><header><div class="improvement-selector" role="group" aria-label="Choose one improvement">${Object.entries(improvements).map(([key,value])=>`<button data-improvement="${key}" aria-pressed="${key===id}">${value.label}</button>`).join('')}</div><button class="build-selected" data-build="${selected.build}">Open this build ↗</button></header><ol class="improvement-flow">${selected.steps.map(([title,detail],index)=>`<li><span class="flow-step-number">${index+1}</span><div><b>${title}</b><small>${detail}</small></div></li>`).join('')}</ol><p>${selected.note}</p></section>`;
}
export function renderCompanyMap(state={}) {
  const connected=state.networkMode==='connected';
  const improvement=improvements[state.improvement]||improvements.priya;
  return `<section class="company-network" aria-label="Nine employee workspaces across Parkside"><header class="map-toolbar"><div><b>Company graph</b><span>Parkside · 150 employees · Everyone has Copilot</span></div><div class="map-mode" role="group" aria-label="Connection mode"><button data-network-mode="fragmented" aria-pressed="${!connected}">Today’s company</button><button data-network-mode="connected" aria-pressed="${connected}">After Nine-67</button></div></header><div class="employee-map"><div class="employee-grid-wrap"><svg class="card-connection-graph" viewBox="0 0 1000 360" preserveAspectRatio="none" aria-hidden="true"><defs><marker id="card-existing-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#8197a6"/></marker><marker id="card-manual-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#b79c66"/></marker><marker id="card-proposed-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#287da8"/></marker></defs><path class="card-edge existing" d="M842 360 V378 H329 V50 H316" marker-end="url(#card-existing-arrow)"/><path class="card-edge manual" d="M842 100 V115 H158 V130" marker-end="url(#card-manual-arrow)"/><path class="card-edge manual" d="M500 230 V245 H842 V260" marker-end="url(#card-manual-arrow)"/>${connected?`<path class="card-edge proposed" d="${state.improvement==='elena'?'M500 260 V245 H671 V115 H500 V100':state.improvement==='nina'?'M658 180 H684 M500 230 V245 H842 V260':'M316 180 H329 V378 H158'}" marker-end="url(#card-proposed-arrow)"/>`:''}</svg><div class="map-manual-link first"><span>Manual: Ben exports → Priya reconciles</span></div><div class="map-manual-link second"><span>Manual: Nina sends → Leah chases</span></div><div class="map-existing-label"><span>Existing: Leah’s board brief → Dana</span></div><div class="employee-grid">${networkPeople.map(person=>card(person,connected,improvement)).join('')}</div></div></div>${connected?selectedFlow(state):''}<footer class="map-legend"><span><i class="existing"></i>Existing work</span><span><i class="manual"></i>Manual handoff</span><span><i class="proposed"></i>Proposed improvement</span><small>${connected?'One proposed design · Simulated, not live integrations':'Select an employee to open their actual work'}</small></footer></section>`;
}
