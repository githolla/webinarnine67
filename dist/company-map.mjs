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
const mapStories = {
 priya:{before:'A useful method stops at Priya’s desk.',after:'Another branch can use what Priya built.',gap:'Maya still cleans a comparable file by hand.',gain:'Maya runs the supported workflow and reviews its exceptions.',tag:'Reuse a method'},
 elena:{before:'Elena has access. Her tracker is still manual.',after:'Elena gets a workflow she can actually use.',gap:'Generic advice never reaches her real Thursday task.',gain:'Notes become proposed updates. Elena confirms the unclear owner.',tag:'Guide the work'},
 nina:{before:'Ops sees the pattern. Everyone else chases it.',after:'One reviewed finding reaches the next person.',gap:'Marcus needs account context. Leah asks for another update.',gain:'Marcus gets the account context. Leah sees the owner and due date.',tag:'Connect the finding'}
};
const badges={dana:'Personal value',daniel:'Useful foundation',ben:'Private success',priya:'Reusable method',nina:'Team-built tool',marcus:'Quiet practice',ava:'Hidden effort',elena:'Wants a way in',leah:'Manual assembly'};
const shortQuotes={dana:'“I use Claude before every board meeting.”',daniel:'“It’s live. Tell us what helps.”',ben:'“This changed how I coach my team.”',priya:'“I built it once. It runs every month.”',nina:'“Six of us use this every morning.”',marcus:'“I practice on my phone. Quietly.”',ava:'“Writing is fast. Finding facts isn’t.”',elena:'“I want to use it. Show me how.”',leah:'“I still pull everyone’s work together.”'};
function card(person,connected,improvement) {
 const data=cardData[person.id];const involved=improvement.people.includes(person.id);
 const changed=connected&&involved;
 const markers=toolMarks[person.id].map(([file,label])=>`<span><img src="assets/${file}" alt="">${escapeHtml(label)}</span>`).join('');
 const after={priya:['Reviewed method','Maya can run it too'],elena:['Notes + tracker','Elena reviews → applies'],daniel:['Approved sources','A supported workflow'],nina:['Nina reviews','Publishes with owner + date'],marcus:['Northwind account','Reviewed finding attached'],leah:['Weekly briefing','Owner + next update visible']};
 const preview=changed&&after[person.id]?after[person.id]:[data.left,data.right];
 return `<button class="employee-work ${involved?'map-focus':''} ${changed?'improvement-member':''}" data-workspace="${person.id}" aria-label="Open ${person.name}’s actual workspace" style="--department:${person.color}"><header><h2>${person.name}</h2><span>${person.role}</span><small aria-hidden="true">↗</small></header><p class="employee-quote">${escapeHtml(shortQuotes[person.id])}</p><div class="employee-tools">${markers}<small>${changed?'Proposed improvement':badges[person.id]}</small></div><div class="work-mini ${data.kind} ${changed?'upgraded':['elena','leah'].includes(person.id)?'manual':'existing'}" aria-label="${escapeHtml(data.label)}"><span>${escapeHtml(preview[0])}</span><i aria-hidden="true">→</i><b>${escapeHtml(preview[1])}</b></div></button>`;
}
function routes(connected,id){
 const proposed=id==='nina'?'M658 180 H684 M500 230 V245 H842 V260':id==='elena'?'M500 260 V245 H671 V115 H500 V100':'M316 180 H329 V378 H500';
 return `<svg class="card-connection-graph" viewBox="0 0 1000 360" preserveAspectRatio="none" aria-hidden="true"><defs>${[['existing','#9fb5c0'],['manual','#e8b76b'],['proposed','#7ee2bc']].map(([type,color])=>`<marker id="map-arrow-${type}" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="${color}"/></marker>`).join('')}</defs><path class="card-edge existing" d="M842 360 V378 H329 V50 H316" marker-end="url(#map-arrow-existing)"/><path class="card-edge manual" d="M842 100 V115 H158 V130" marker-end="url(#map-arrow-manual)"/><path class="card-edge manual" d="M500 230 V245 H842 V260" marker-end="url(#map-arrow-manual)"/>${connected?`<path class="card-edge proposed" d="${proposed}" marker-end="url(#map-arrow-proposed)"/>`:''}</svg>`;
}
function selectedFlow(state,connected){
 const id=Object.hasOwn(improvements,state.improvement)?state.improvement:'priya';const selected=improvements[id];const story=mapStories[id];
 return `<section class="map-payoff ${connected?'selected-improvement':''}" aria-label="${connected?'One proposed improvement':'Where the useful work stops'}"><div class="map-payoff-copy"><small>${connected?'AFTER NINE-67 · PROPOSED':'TODAY · THE MISSED OPPORTUNITY'}</small><h3>${connected?story.after:story.before}</h3><p>${connected?story.gain:story.gap}</p></div><div class="map-payoff-action">${connected?`<button data-build="${id}">Watch this improvement work →</button>`:'<button data-network-mode="connected">Show what could change →</button>'}<span>${connected?'Human review stays visible. Private chats stay private.':'Select an employee card to open their real work.'}</span></div></section>${connected?`<ol class="improvement-flow">${selected.steps.map(([title,detail],i)=>`<li><span class="flow-step-number">${i+1}</span><div><b>${title}</b><small>${detail}</small></div></li>`).join('')}</ol>`:''}`;
}
export function renderCompanyMap(state={}){
 const connected=state.networkMode==='connected';const id=Object.hasOwn(improvements,state.improvement)?state.improvement:'priya';const improvement=improvements[id];
 return `<section class="company-network map-v2 ${connected?'is-connected':'is-today'}" aria-label="Company graph: nine employee workspaces"><header class="map-toolbar"><div><b>Parkside · Company graph <span>150 people. One Copilot rollout.</span></b><small>COMPANY GRAPH · CLICK A PERSON TO SEE THE WORK</small></div><div class="map-mode" role="group" aria-label="Connection mode"><button data-network-mode="fragmented" aria-pressed="${!connected}">Today’s company</button><button data-network-mode="connected" aria-pressed="${connected}">After Nine-67</button></div><div class="improvement-selector" role="group" aria-label="Choose one improvement">${Object.keys(mapStories).map(key=>`<button data-improvement="${key}" aria-pressed="${key===id}">${key==='priya'?'Priya':key==='elena'?'Elena':'Nina'}<span>${mapStories[key].tag}</span></button>`).join('')}</div></header><div class="employee-map"><div class="employee-grid-wrap">${routes(connected,id)}<div class="map-route-label route-forecast">Manual: Ben exports → Priya reconciles</div><div class="map-route-label route-ops">${connected&&id==='nina'?'Reviewed finding → Marcus + Leah':'Manual: Nina sends → Leah chases'}</div><div class="map-route-label route-brief">Existing: Leah’s board brief → Dana</div><div class="employee-grid">${networkPeople.map(p=>card(p,connected,improvement)).join('')}</div></div></div>${selectedFlow(state,connected)}<p class="map-simulation"><span>Solid: existing work · Dashed: manual handoff · Green: proposed improvement</span>Illustrative company · ${connected?'Proposed workflows, not live integrations':'Local successes and the work between them'}</p></section>`;
}
