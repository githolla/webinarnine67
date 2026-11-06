const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
export const networkPeople = Object.freeze([
  { id: 'dana', name: 'Dana', role: 'CEO', ai: 'Claude', output: 'Board questions', color: '#7a5af8', current: 'Challenges her thinking before board meetings.', value: 'Better questions for the leadership team.', gap: 'Her answers depend on the updates others gather.', next: 'Give leadership a reviewed brief with owners, evidence and progress.', system: 'Weekly operating review' },
  { id: 'daniel', name: 'Daniel', role: 'IT', ai: 'Ask Parkside', output: 'Company answers', color: '#36bffa', current: 'Built the internal assistant with Copilot Studio.', value: 'Approved company knowledge is easier to find.', gap: 'Usage does not show which business work improved.', next: 'Connect permitted records and evaluate useful outcomes with each team.', system: 'Copilot Studio' },
  { id: 'ben', name: 'Ben', role: 'Sales', ai: 'Copilot', output: 'Forecast insight', color: '#47cd89', current: 'Uses Copilot in Excel to compare forecast changes.', value: 'Finds repeated slippage and coaches his reps.', gap: 'The method and assumptions stay inside Sales.', next: 'Share the reviewed assumptions with Finance through a repeatable review.', system: 'Excel' },
  { id: 'priya', name: 'Priya', role: 'Finance', ai: 'Claude', output: 'Power Query logic', color: '#2f6bff', current: 'Uses Claude to develop and understand Power Query transformations.', value: 'A useful finance workflow built by someone who knows the data.', gap: 'The transformation is useful but not yet a shared, maintained asset.', next: 'Review the transformation with Priya, document it and reuse the approved logic.', system: 'Excel · Power Query' },
  { id: 'nina', name: 'Nina', role: 'Operations', ai: 'Ask Ops', output: 'Ticket patterns', color: '#fda29b', current: 'Her department built a Teams bot that links possible ticket patterns.', value: 'Ops finds recurring work worth investigating.', gap: 'The findings stay in Ops instead of becoming shared actions.', next: 'Review the sources, assign an owner and carry the finding into Service and the weekly review.', system: 'Teams · Department bot' },
  { id: 'marcus', name: 'Marcus', role: 'Account manager', ai: 'Grok · Phone', output: 'Account insight', color: '#98a2b3', current: 'Practices generic customer conversations on his personal phone.', value: 'He prepares for difficult conversations without entering private account data.', gap: 'Useful business observations may never reach the account record.', next: 'Let Marcus volunteer an account observation in the CRM. Keep personal Grok chats private.', system: 'Volunteered CRM observation' },
  { id: 'ava', name: 'Ava', role: 'Customer Service', ai: 'Copilot', output: 'Customer replies', color: '#36bffa', current: 'Uses Copilot to improve the tone of Zendesk customer replies.', value: 'Customers get clearer, more considerate responses.', gap: 'Repeated customer frustration is not visible across departments.', next: 'Use permitted service records to review recurring issues with Operations.', system: 'Zendesk' },
  { id: 'elena', name: 'Elena', role: 'Coordinator', ai: 'Copilot', output: 'Thursday tracker', color: '#8a98b2', current: 'Barely uses Copilot. A generic “help with projects” prompt did not help.', value: 'She still updates the Thursday tracker manually in Excel.', gap: 'A license did not show her how AI could help with her actual task.', next: 'Build a guided review of approved notes and the current tracker. Elena confirms unclear owners before applying changes.', system: 'Excel · Manual tracker' },
  { id: 'leah', name: 'Leah', role: 'Chief of Staff', ai: 'Copilot', output: 'Friday briefing', color: '#bdb4fe', current: 'Uses Copilot to polish PowerPoint wording after manually assembling the Friday update.', value: 'The presentation reads more clearly after she has gathered the facts.', gap: 'Copilot does not remove her collection, comparison and reconciliation work.', next: 'Build the brief from reviewed findings, named owners and current progress.', system: 'PowerPoint' }
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
export const badges={dana:'Personal value',daniel:'Useful foundation',ben:'Private success',priya:'Reusable method',nina:'Team-built tool',marcus:'Quiet practice',ava:'Hidden effort',elena:'Wants a way in',leah:'Manual assembly'};
export const verdicts={dana:'win',ben:'win',priya:'win',nina:'win',daniel:'diff',marcus:'diff',ava:'stuck',elena:'stuck',leah:'glue'};
const verdictLabels={win:'AI WIN',diff:'DIFFERENT WAY',stuck:'STRUGGLING',glue:'THE GLUE'};
const tourOrder=['dana','daniel','ben','priya','nina','ava','elena','marcus','leah'];
const tools={dana:['claude.svg','Claude'],daniel:['ms-teams.svg','Ask Parkside'],ben:['copilot.webp','Copilot'],priya:['claude.svg','Claude'],nina:['ms-teams.svg','Ask Ops'],marcus:['grok.svg','Grok'],ava:['copilot.webp','Copilot'],elena:['copilot.webp','Copilot'],leah:['copilot.webp','Copilot']};
const todayLines={dana:'Board prep in Claude',daniel:'Built Ask Parkside',ben:'Saved forecast review',priya:'Reusable Excel method',nina:'Team bot, 6 use it daily',ava:'Six records for one reply',elena:'Broad prompt, generic answer',marcus:'Practices calls on his phone',leah:'Stitches the Friday brief'};
const connectedLines={priya:'Reused by Maya ✓',nina:'Publishes with owner + date',elena:'Three tracker rows updated',marcus:'Reviewed finding attached',leah:'Owner + next update visible'};
const linked=['dana','ben','priya','nina','ava','elena','marcus','leah'];
// Fixed 1760x732 canvas: five 320px columns, three bands. Dana sits directly above Leah.
const W=1760,H=732,CW=320,CH=160,cols=[24,372,720,1068,1416];
const slots={priya:[1,72],dana:[2,72],nina:[3,72],ben:[4,72],daniel:[0,328],marcus:[1,328],elena:[3,328],ava:[4,328],leah:[2,548]};
const stubs={priya:'up',dana:'up',nina:'up',ben:'up',daniel:'down',marcus:'down',elena:'down',ava:'down'};
const stubOffset={ava:120};
const pct=(v,total)=>`${(v/total*100).toFixed(4)}%`;
const at=(x,y)=>`left:${pct(x,W)};top:${pct(y,H)}`;
const todayPaths=[
 ['nina','M1100 232 C1100 290 990 270 990 330 V542'],
 ['ben','M1440 232 C1404 236 1402 250 1402 270 V572 Q1402 596 1378 596 H1048'],
 ['ava','M1440 488 V638 Q1440 662 1416 662 H1048'],
 ['leah-dana','M880 548 V240']
];
const connectedPaths=[
 ['priya-maya','M372 128 H120'],
 ['nina-marcus','M1228 72 V54 Q1228 36 1210 36 H724 Q706 36 706 54 V392 Q706 408 700 408'],
 ['nina-leah','M1100 232 C1100 290 990 270 990 330 V542'],
 ['leah-dana','M880 548 V240'],
 ['nina-elena','M1228 232 V320'],
 ['ben-elena','M1460 232 C1460 290 1360 270 1360 320'],
 ['ava-elena','M1416 408 H1396']
];
const hands=[[990,446],[1240,596],[1300,662]];
const pill=(text,x,y,cls='')=>`<span class="pg-pill ${cls}" style="${at(x,y)}">${escapeHtml(text)}</span>`;
function token(person,connected){
 const id=person.id,v=verdicts[id],[c,y]=slots[id],[icon,tool]=tools[id],n=tourOrder.indexOf(id)+1;
 const line=connected&&connectedLines[id]?connectedLines[id]:todayLines[id];
 return `<button class="pg-card v-${v} ${connected&&linked.includes(id)?'is-linked':''}" data-workspace="${id}" style="${at(cols[c],y)};width:${pct(CW,W)};height:${pct(CH,H)}" aria-label="${n}. ${person.name}, ${person.role}, ${verdictLabels[v]}: ${escapeHtml(line)}. Open workspace"><span class="pg-num" aria-hidden="true">${n}</span><span class="pg-verdict">${verdictLabels[v]}</span><span class="pg-who"><span class="pg-av" aria-hidden="true">${person.name[0]}</span><span class="pg-name"><b>${person.name}</b><small>${person.role}</small></span></span><span class="pg-tool"><img src="assets/${icon}" alt="">${escapeHtml(tool)}${id==='marcus'?'<em>Personal phone</em>':''}</span><span class="pg-line">${escapeHtml(line)}</span></button>`;
}
function stub(person){
 const id=person.id,dir=stubs[id];if(!dir)return null;
 const [c,y]=slots[id],x=cols[c]+(stubOffset[id]||56),edge=dir==='up'?y:y+CH,end=dir==='up'?edge-28:edge+28,mark=dir==='up'?end-13:end+13;
 return {svg:`<path class="pg-stub" d="M${x} ${edge} V${end}"/><g class="pg-dead" transform="translate(${x} ${mark})"><circle r="13"/><path d="M-5 -5 L5 5 M5 -5 L-5 5"/></g>`,html:`<span class="pg-stays" style="${at(x+22,mark)}">Stays with ${person.name}</span>`};
}
const arrow=(id,color)=>`<marker id="pg-arrow-${id}" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="${color}"/></marker>`;
function legend(connected){
 return `<div class="pg-legend" style="${at(24,644)}"><div>${Object.entries(verdictLabels).map(([v,label])=>`<span class="pg-chip v-${v}">${label}</span>`).join('')}</div><p>${connected?'<i class="pg-key-solid"></i>Green line = the work connects':'<b class="pg-key-x">✕</b>stays here · <i class="pg-key-dash"></i>purple dashed = done by hand'}</p></div>`;
}
export function mapHeading(state={}){
 return state.networkMode==='connected'?{title:'Same seven AI tools. Now the work connects.',lead:''}:{title:'Same tools. Very different work.',lead:'150 people. One Copilot rollout. Useful work stays local.'};
}
function explore(connected,id){
 return `<nav class="map-explore" aria-label="Explore the company graph"><div class="map-mode" role="group" aria-label="Connection mode"><button data-network-mode="fragmented" aria-pressed="${!connected}">Today’s company</button><button data-network-mode="connected" aria-pressed="${connected}">After Nine-67</button></div>${connected?`<div class="improvement-selector" role="group" aria-label="Choose one improvement">${Object.entries(improvements).map(([key,item])=>`<button data-improvement="${key}" aria-pressed="${key===id}">${escapeHtml(item.label)}</button>`).join('')}</div><button class="primary" data-build="${id}">Watch this improvement work →</button>`:''}</nav>`;
}
export function renderCompanyMap(state={}){
 const connected=state.networkMode==='connected';const id=Object.hasOwn(improvements,state.improvement)?state.improvement:'priya';
 const parts=connected?[]:networkPeople.map(stub).filter(Boolean);
 const kind=connected?'connected':'manual';
 const paths=(connected?connectedPaths:todayPaths).map(([key,d])=>`<path class="pg-edge ${kind} e-${key}" d="${d}" pathLength="1" marker-end="url(#pg-arrow-${kind})"/>`).join('');
 const marks=connected?'':hands.map(([x,y])=>`<span class="pg-hand" style="${at(x,y)}" aria-hidden="true">✋</span>`).join('');
 const pills=connected?pill('Method reused',246,128)+pill('Reviewed finding',966,36)+pill('Notes update the tracker',1250,280):pill('By hand',880,392,'glue');
 const maya=connected?`<div class="pg-maya" style="${at(48,96)}"><span class="pg-av" aria-hidden="true">M</span><span>Maya · other branch</span></div>`:'';
 const description=connected?'Priya’s method reaches Maya; Nina, Ben and Ava update Elena’s tracker; Nina’s reviewed finding reaches Marcus and Leah; Leah’s brief reaches Dana.':'Each person’s AI work stays with them. Only Leah connects Ben, Nina and Ava to Dana, by hand.';
 return `<section class="org-graph ${connected?'is-connected':'is-today'}" aria-label="Company graph. ${escapeHtml(description)}">${explore(connected,id)}<div class="pg-canvas"><svg class="pg-lines" viewBox="0 0 ${W} ${H}" aria-hidden="true"><defs>${arrow('manual','#bdb4fe')}${arrow('connected','#47cd89')}</defs>${parts.map(p=>p.svg).join('')}${paths}</svg>${networkPeople.map(p=>token(p,connected)).join('')}${parts.map(p=>p.html).join('')}${marks}${pills}${maya}${legend(connected)}${connected?`<p class="pg-foot">Proposed workflows, not live integrations</p>`:''}</div></section>`;
}
