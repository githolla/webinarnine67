import { people, cases } from './company-model.mjs';
import { renderCompanyMap } from './company-map.mjs';
import { renderWorkspace } from './company-workspaces.mjs';
import { renderBuilds } from './company-builds.mjs';
export const escapeHtml = value => String(value).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const e=escapeHtml;
const miro='https://miro.com/blog/state-of-intelligent-collaboration-2026/';
const atlassian='https://www.atlassian.com/blog/state-of-teams-2026';
export const scenes=[
 {title:'What Dana thinks is happening.',lead:''},
 {title:'People are faster. The work isn’t connected.',lead:''},
 {title:'Same tools. Very different work.',lead:'150 people. Three company AI platforms. Useful work stays local.'},
 {title:'See what people have figured out.',lead:''},
 {title:'The same access. Very different needs.',lead:''},
 {title:'See the work between departments.',lead:''},
 {title:'What we discover by sitting beside people.',lead:''},
 {title:'Three things Nine-67 could build.',lead:''},
 {title:'Look across the company. Choose where to build.',lead:''}
];
export const cues=[
 'Josh: Dana pays for three company AI platforms and IT built an agent. Her confidence is reasonable. Ask the question on the band, then press →.',
 'Josh: These are different surveys. People get more done; much of the work stays private; fewer people embed AI into workflows.',
 'Josh: Nine of the 150. Company Copilot and Claude, two department agents, and Marcus on Grok on his own phone. Every card ends the same way: it stays with them. We sit beside the four outlined. Press →.',
 'Josh: Priya built this on the company Claude plan. It runs every month. It still lives in her own chats and workbook. Ask: who else in your company built something nobody else can use?',
 'Josh: Marcus has a company ChatGPT seat and still practices on Grok, because that is where he learned. No blame, that is normal. Elena has Copilot and gave up after one broad prompt. Different people need different help.',
 'Josh: Leah has every company tool and still stitches the week by hand. More licenses do not fix this. Read the band out loud.',
 'Josh: Start company-wide discovery before deciding what to build. Some work can be reused, some needs a guided workflow, and some needs a connection.',
 'Josh: Explore mode. Each build runs on a company tool Parkside already licenses. Simulated, not live.',
 'Josh: Bring IT, Operations and two department leaders. Type “discovery” in the chat.'
];
export const tourPeople=['dana','daniel','ben','priya','nina','ava','elena','marcus','leah'];
export const verdicts={dana:'win',daniel:'diff',ben:'win',priya:'win',nina:'win',marcus:'diff',ava:'stuck',elena:'stuck',leah:'glue'};
const verdictLabel={win:'AI WIN',diff:'DIFFERENT WAY',stuck:'STRUGGLING',glue:'THE GLUE'};
const badges={dana:'Personal value',daniel:'Useful foundation',ben:'Private success',priya:'Reusable method',nina:'Team-built tool',marcus:'Quiet practice',ava:'Hidden effort',elena:'Wants a way in',leah:'Manual assembly'};
const toolIcon={dana:'claude.svg',daniel:'ms-teams.svg',ben:'copilot.webp',priya:'claude.svg',nina:'ms-teams.svg',marcus:'grok.svg',ava:'copilot.webp',elena:'copilot.webp',leah:'copilot.webp'};
const toolNote={dana:'Company plan',priya:'Company plan',daniel:'Copilot Studio agent',nina:'Copilot Studio agent',marcus:'Personal phone'};
const person=id=>people.find(p=>p.id===id);
export function personToken(id,size='M',line=''){
 const p=person(id);if(!p)return '';const v=verdicts[id];
 if(size==='S')return `<span class="sh-pt sh-pt-s v-${v}"><span class="sh-pt-av" aria-hidden="true">${p.name[0]}<img src="assets/${toolIcon[id]}" alt=""></span><b>${p.name}</b></span>`;
 const tool=`<span class="sh-pt-tool"><img src="assets/${toolIcon[id]}" alt="">${e(p.ai)}</span>${toolNote[id]?`<span class="sh-pt-extra${id==='marcus'?' is-personal':''}">${toolNote[id]}</span>`:''}`;
 return `<div class="sh-pt sh-pt-${size.toLowerCase()} v-${v}"><span class="sh-pt-av" aria-hidden="true">${p.name[0]}</span><div class="sh-pt-id"><b>${p.name}</b><span class="sh-pt-role">${e(p.department)}</span>${size==='L'?`<span class="sh-pt-tools">${tool}</span>`:''}${line?`<p class="sh-pt-line">${line}</p>`:''}</div><div class="sh-pt-verdict"><span class="sh-pt-chip">${verdictLabel[v]}</span>${size==='L'?`<small>${badges[id]}</small>`:''}</div></div>`;
}
const ghostToken=(size,line='')=>size==='S'?'<span class="sh-pt sh-pt-s is-ghost"><span class="sh-pt-av" aria-hidden="true">M</span><b>Maya · other branch</b></span>':`<div class="sh-pt sh-pt-m is-ghost"><span class="sh-pt-av" aria-hidden="true">M</span><div class="sh-pt-id"><b>Maya</b><span class="sh-pt-role">Other branch</span>${line?`<p class="sh-pt-line">${line}</p>`:''}</div><div class="sh-pt-verdict"><span class="sh-pt-chip">BY HAND</span></div></div>`;
export function rosterStrip({current=null,visited=[],focus=null,ghost=false,tally=true,note=''}={}){
 const seen=tourPeople.filter(id=>visited.includes(id));const count=v=>seen.filter(id=>verdicts[id]===v).length;
 const tallyText=`${count('win')} ${count('win')===1?'win':'wins'} · ${count('diff')} different · ${count('stuck')} struggling · ${count('glue')} glue`;
 const items=tourPeople.map((id,i)=>{const cls=[visited.includes(id)?'is-visited':'is-todo',id===current?'is-current':'',focus&&!focus.includes(id)?'is-dim':''].join(' ');
  return `${i?'<span class="sh-rlink" aria-hidden="true"><i>✕</i></span>':''}<span class="sh-r ${cls}">${personToken(id,'S')}</span>`;}).join('');
 const side=tally?`<p class="sh-tally"><span>${tallyText}</span><b>0 connections</b></p>`:note?`<p class="sh-tally"><span>${note}</span></p>`:'';
 return `<div class="sh-roster" role="img" aria-label="Nine people at Parkside. ${seen.length} met so far. Their work is not connected."><div class="sh-rtrack">${items}${ghost?`<span class="sh-rghost">${ghostToken('S')}</span>`:''}</div>${side}</div>`;
}
function board(){
 const kpis=[['150','Copilot licenses assigned'],['3','Company AI platforms'],['4','Department agents live'],['✓','Sales forecast review working']];
 return `<section class="dn"><div class="dn-left"><div class="dn-who"><div class="dn-photo" role="img" aria-label="Dana, illustrative portrait"></div><p class="dn-tag"><b>Dana</b>CEO, Parkside</p></div><div class="dn-copy"><blockquote>“We gave everyone AI. I thought we were in pretty good shape.”</blockquote><p>Everyone has Copilot. Parkside also pays for Claude and ChatGPT. Sales is using it, and IT launched an assistant.</p><dl class="dn-snap" aria-label="Parkside company snapshot"><div><dt>Industry</dt><dd>Commercial services</dd></div><div><dt>Employees</dt><dd>150</dd></div><div><dt>Revenue</dt><dd>$42M</dd></div><div><dt>Locations</dt><dd>HQ + 3 branches</dd></div><div><dt>Departments</dt><dd>7</dd></div><div><dt>Core systems</dt><dd>Microsoft 365 · HubSpot · Zendesk</dd></div></dl><button class="primary x-explore" data-workspace="dana">Open Dana’s rollout and Claude session →</button></div></div><figure class="dn-claude" aria-label="Dana asks Claude to create her board update"><header><img src="assets/claude.svg" alt=""><b>Claude</b><span>Parkside company plan</span></header><div class="dn-chat"><p class="dn-ask"><small>Dana</small>Create a board update on our AI rollout. 150 Copilot licenses assigned. We pay for Copilot, Claude and ChatGPT. 4 department agents are live. Sales uses it for the forecast review. Make it clear we are on track.</p><div class="dn-reply"><p class="dn-says"><img src="assets/claude.svg" alt="">Here’s a one-slide board update:</p><div class="dn-slide"><p class="dn-kicker">Board update · Q4</p><h3>AI rollout: on track</h3><ul>${kpis.map(([v,l])=>`<li><strong>${v}</strong><span>${l}</span></li>`).join('')}</ul><p class="dn-status"><i aria-hidden="true"></i>Status: green across every department</p></div></div></div></figure><div class="sh-band sh-dana-band"><p>What would we see if we sat beside the employees? →</p></div></section>`;}
const bar=(pct,tone,label)=>`<div class="sh-viz" role="img" aria-label="${label}"><div class="sh-bar"><i class="t-${tone}" style="width:${pct}%"></i></div></div>`;
function gapBars(){return '<div class="sh-viz sh-gapviz" role="img" aria-label="85 percent use AI at work; 29 percent embed it in workflows; a 56 point gap"><div class="sh-bar"><i class="t-ink" style="width:85%"><em>85%</em></i></div><div class="sh-bar"><i class="t-stuck" style="width:29%"><em>29%</em></i><span class="sh-hatch" style="left:29%;width:56%">the gap</span></div></div>';}
const researchTie=text=>`<p class="sh-tie">${text}</p>`;
function research(){return `<section class="sh-research"><div class="sh-stats"><article class="sh-card sh-stat"><strong class="sh-hero"><small aria-hidden="true">&nbsp;</small>83%</strong><p class="sh-claim">say AI makes them more productive</p>${bar(83,'win','83 percent agree AI improves individual productivity')}${researchTie('People really do get more done.')}<button class="sh-source" data-detail="research">Source: Miro, 2026</button></article><article class="sh-card sh-stat"><strong class="sh-hero"><small aria-hidden="true">&nbsp;</small>69%</strong><p class="sh-claim">of AI work happens privately</p>${bar(69,'stuck','69 percent say most AI-assisted work happens in private sessions')}${researchTie('Most of it stays in private chats.')}<button class="sh-source" data-detail="research">Source: Miro, 2026</button></article><article class="sh-card sh-stat is-climax"><strong class="sh-hero is-stuck"><small>85% use AI</small>29%</strong><p class="sh-claim">embed it in workflows</p>${gapBars()}${researchTie('Few teams build it into how work gets done.')}<button class="sh-source" data-detail="research">Source: Atlassian, 2026</button></article></div><div class="sh-band sh-research-band"><p>Individual wins are real. The work between people is still manual.</p><span>So we looked inside Parkside →</span></div><p class="sh-fine">Separate self-reported surveys, not one funnel. Parkside is illustrative, not a measured case study.</p></section>`;}
const discoveryOptions=[
 {id:'reuse',name:'A method worth reusing',title:'Someone already solved work another team still does manually.',people:['priya'],ghost:true,saw:{priya:'Priya’s monthly transformation works.',maya:'Maya at another branch still cleans similar files row by row.'},opportunity:'Adapt and test the method, document its rules, add exception handling, and name an owner.',button:'priya',flow:{from:['North.csv','East.xlsx','West.csv'],to:['One checked report']}},
 {id:'needs',name:'Different help for different people',title:'The same license hides very different needs.',people:['ben','ava','elena'],saw:{ben:'Ben developed a strong technique.',ava:'Ava needs faster access to context.',elena:'Elena needs a guided way to review her actual updates.'},opportunity:'Spread the useful practice, connect the right facts, and build a workflow that helps people check the result.',button:'elena',needs:[['ben','Repeatable review'],['ava','Missing context'],['elena','No useful starting point']]},
 {id:'handoff',name:'Information that should travel',title:'A department has findings other teams never receive.',people:['nina','marcus','leah'],saw:{nina:'Nina reviews recurring issues.',marcus:'Marcus needs relevant account context.',leah:'Leah still asks around to assemble the broader picture.'},opportunity:'Publish reviewed findings into the account record, the assigned action and the weekly briefing.',button:'nina',flow:{from:['Reviewed Ops finding'],to:['Account context','Accountable owner','Leadership visibility']}}
];
export const discoveryPeople=id=>{const d=discoveryOptions.find(x=>x.id===id)||discoveryOptions[0];return {people:d.people,ghost:Boolean(d.ghost)};};
function flowMarkup(d){
 if(d.needs)return `<ul class="sh-needs">${d.needs.map(([id,need])=>`<li><b>${person(id).name}</b><span>${need}</span><i aria-hidden="true">✕</i></li>`).join('')}</ul>`;
 const box=list=>`<div class="sh-flow-col">${list.map(x=>`<span class="sh-box">${x}</span>`).join('')}</div>`;
 return `<div class="sh-flow">${box(d.flow.from)}<div class="sh-flow-link" aria-hidden="true"><span>by hand today</span><i>✕</i></div>${box(d.flow.to)}</div>`;
}
function discoveries(state){const index=Math.max(0,discoveryOptions.findIndex(x=>x.id===state.discovery));const d=discoveryOptions[index];
 const chips=d.people.map(id=>`<span class="sh-vchip v-${verdicts[id]}">${person(id).name}: ${verdictLabel[verdicts[id]]}</span>`).join('')+(d.ghost?'<span class="sh-vchip is-ghost">Maya: by hand</span>':'');
 const report=index===0?`<div class="sh-report"><b>Dana’s adoption report:</b><span>license assigned ${d.people.map(()=>'✓').join(' ')}</span><strong>The desk says:</strong>${chips}</div>`:'';const stamp=index===0?'':'<span class="sh-stamp">Dana’s adoption report: ✓</span>';
 return `<section class="sh-discover ${index===0?'has-report':''}">${report}<div class="sh-disc-cols"><div class="sh-disc-saw"><small class="sh-label">What we saw</small>${d.people.map(id=>personToken(id,'M',d.saw[id])).join('')}${d.ghost?ghostToken('M',d.saw.maya):''}</div><div class="sh-dark sh-disc-pattern"><small class="sh-label">The pattern</small><h2>${d.name}</h2>${flowMarkup(d)}</div><div class="sh-card sh-disc-build"><small class="sh-label">What to build</small><p>${d.opportunity}</p><button class="primary x-explore" data-build="${d.button}">See the working improvement →</button><div class="sh-disc-foot"><span class="sh-buildchip">Build ${index+1} of 3</span>${stamp}</div></div></div><nav class="x-explore sh-explore-row" aria-label="Choose a discovery">${discoveryOptions.map(x=>`<button data-discovery="${x.id}" aria-pressed="${d.id===x.id}">${x.name}</button>`).join('')}${d.people.map(id=>`<button data-workspace="${id}">${person(id).name} · ${person(id).department} ↗</button>`).join('')}</nav></section>`;}
function offer(){
 const stages=[['01','Discover across departments','Inventory every license, agent and habit. Map the handoffs done by hand.'],['02','Prioritize with leadership','A company-wide roadmap: each build, its platform, its owner.'],['03','Build with the employees','On the company AI you already license. IT approves each connector.'],['04','Measure and expand','Count reviewed findings, owners and dates, and continued use.']];
 const vlinks='<span class="sh-vlink"></span><span></span><span class="sh-vlink"></span><span></span><span class="sh-vlink"></span>';
 const loop=[0,1,2].map(r=>[0,1,2].map(c=>`${c?'<span class="sh-glink"></span>':''}${personToken(tourPeople[r*3+c],'S')}`).join('')+(r<2?vlinks:'')).join('');
 return `<section class="sh-offer"><ol class="sh-timeline">${stages.map(([n,t,p])=>`<li><b>${n}</b><h2>${t}</h2><p>${p}</p></li>`).join('')}</ol><div class="sh-bring"><article class="sh-card"><small class="sh-label">Who to bring</small><p>Operations + IT + two department leaders whose teams depend on each other.</p></article><article class="sh-card"><small class="sh-label">What to bring</small><p>One example where AI helps. One piece of work your people still chase.</p></article></div><div class="sh-cta"><div class="sh-cta-copy"><h2>Book an AI Workflow Discovery Session.</h2><p>Type “discovery” in the webinar chat</p></div><div class="sh-loop" role="img" aria-label="All nine Parkside people, connected">${loop}</div></div></section>`;}
export function renderScene(state){
 if(state.workspace)return renderWorkspace(state,state.workspace);
 if(state.scene===3)return renderWorkspace(state,'priya');
 if(state.scene===4)return renderWorkspace(state,'ava');
 if(state.scene===5)return renderWorkspace(state,'leah');
 return [board,research,renderCompanyMap,null,null,null,discoveries,renderBuilds,offer][state.scene](state);
}
export function primaryAction(state){return state.scene===8?{label:'Book a discovery session →',action:'discovery'}:{label:`Next: ${['','The research','Meet Parkside','Private successes','Different needs','Between departments','What we discover','What we build','Where to start'][state.scene+1]} →`,action:'next'};}
export function renderDetail(state,key){
 if(key.startsWith('workspace:')){const id=key.slice(10);const p=people.find(x=>x.id===id);if(p)return {title:`${p.name} · ${p.department}`,html:renderWorkspace(state,id)};}
 if(key.startsWith('source:')){const r=cases.find(x=>x.id===key.slice(7));if(r)return {title:`${r.id} · ${r.account}`,html:`<p class="detail-label">ILLUSTRATIVE ORIGINAL SOURCE · VERSION ${r.version}</p><h3>${e(r.title)}</h3><p>${e(r.description)}</p><p>The reviewer decides whether this source supports the proposed finding.</p><button class="primary" data-exclude="${r.id}" ${state.excluded.includes(r.id)||(r.id==='CASE-201'&&state.builds.nina.published)?'disabled':''}>${r.id==='CASE-201'&&state.builds.nina.published?'Published source preserved':state.excluded.includes(r.id)?'Excluded from optional review':'Exclude from optional review'}</button>`};}
 if(key==='supporting-cases')return {title:'Review supporting cases',html:`<p>Explore the original records. Excluding a record here preserves its source and does not publish a finding.</p><div class="optional-case-list">${cases.filter(r=>r.candidate).map(r=>`<div><button data-detail="source:${r.id}"><b>${r.id} · ${r.account}</b><span>${r.title}</span></button><span>${state.excluded.includes(r.id)?'Excluded':'Available to review'}</span></div>`).join('')}</div>`};
 if(key==='procedure')return {title:'Customer Escalation Procedure · §3',html:'<p class="detail-label">ILLUSTRATIVE APPROVED SHAREPOINT DOCUMENT</p><h3>Transfer ownership without losing context</h3><ol><li>Name a receiving owner.</li><li>Link the original case and relevant implementation notes.</li><li>Record the next customer update date.</li><li>Confirm that the receiving owner accepts the handoff.</li></ol><p>Ask Parkside retrieves this procedure. It does not determine whether each real handoff followed it.</p>'};
 if(key==='research')return {title:'Research behind the story',html:`<p><b>83%</b> of Miro respondents agreed AI made individuals more productive. <b>69%</b> said most AI-assisted work happens in private sessions. <a href="${miro}" target="_blank" rel="noopener">Miro, November 2026 ↗</a></p><p><b>85%</b> of knowledge workers in Atlassian’s survey use AI at work; <b>29%</b> have embedded it into workflows. <a href="${atlassian}" target="_blank" rel="noopener">Atlassian, April 2026 ↗</a></p><p>Different self-reported vendor surveys. These are not measured Nine-67 results.</p>`};
 if(key==='discovery')return {title:'Book an AI Workflow Discovery Session',html:'<p>Bring Operations, IT and two department leaders whose teams depend on each other.</p><p>Each brings one example where AI helps and one piece of work they still chase.</p><div id="booking-content"><b>Type “discovery” in the webinar chat to arrange the session.</b></div><p>Start with discovery across departments, prioritize the handoffs, build on the company AI you already license, then measure what changed.</p>'};
 return {title:'About this demonstration',html:'<p>Parkside, its employees and every record are fictional. Interfaces, AI responses, file processing and integrations are simulated locally. No live business records or private AI chats are accessed.</p><p>A real build requires approved sources, scoped access, validation, accountable owners and testing with the people doing the work.</p>'};
}
const stackOfficial=[
 {icon:'microsoft.svg',name:'Microsoft 365'},
 {icon:'copilot.webp',name:'Copilot',note:'150 seats + Copilot Studio'},
 {icon:'claude.svg',name:'Claude',note:'company plan'},
 {icon:'openai.svg',name:'ChatGPT',note:'company plan'},
 {icon:'hubspot.svg',name:'HubSpot'},
 {icon:'zendesk.svg',name:'Zendesk'}
];
const stackActual=[
 {icon:'copilot.webp',name:'Copilot',kind:'company',people:['ben','ava','elena','leah']},
 {icon:'claude.svg',name:'Claude',kind:'company',people:['dana','priya']},
 {icon:'openai.svg',name:'ChatGPT',kind:'company',people:['leah'],others:'+ Sales'},
 {icon:'ms-teams.svg',name:'Ask Parkside',owner:'IT · Daniel',kind:'agent',people:['daniel']},
 {icon:'ms-teams.svg',name:'Ask Ops',owner:'Operations · Nina',kind:'agent',people:['nina']},
 {icon:'ms-teams.svg',name:'Ask Sales',owner:'Sales Ops',kind:'agent',people:[]},
 {icon:'ms-teams.svg',name:'Ask Service',owner:'Customer Service',kind:'agent',people:[]},
 {icon:'grok.svg',name:'Grok',kind:'personal',people:['marcus']},
 {icon:'openai.svg',name:'ChatGPT',kind:'personal',people:['marcus','elena'],others:'+ others'},
 {icon:'perplexity.svg',name:'Perplexity',kind:'personal',people:[],others:'A few people'}
];
export const viewCopy={
 stack:{eyebrow:'The company',title:'Parkside’s AI today. Three islands.',lead:'Company AI, department agents, and the personal apps people learned on first.',cue:'Josh: This is most companies now. Leadership licensed Copilot, Claude and ChatGPT. Departments built their own agents, each with its own sources and owner, none talking to each other. And some people still use the personal app they learned on first. Read the band. Next: who uses what.'},
 crowd:{eyebrow:'The company',title:'150 people. Most use AI. Mostly on company tools.',lead:'Each dot is a person, colored by the AI they use most. Solid: company license. Ring: personal account.',cue:'Josh: Zoom out. 128 of 150 use something, most of it on tools Parkside pays for. 17 still lean on a personal account. 22 use nothing yet. Bought together, used apart. Then we follow nine of them.'}
};
export function renderStack(){
 const n=k=>stackActual.filter(t=>t.kind===k).length;const of=k=>stackActual.filter(t=>t.kind===k);
 const who=t=>`<div class="stk-who">${[...t.people.map(id=>`<em class="v-${verdicts[id]}">${person(id).name}</em>`),t.others?`<span>${t.others.replace(/^\+ /,'')}</span>`:''].filter(Boolean).join('')}</div>`;
 const tool=t=>`<li class="stk-tool"><img src="assets/${t.icon}" alt=""><div><b>${t.name}</b>${who(t)}</div></li>`;
 const licensed=stackOfficial.map(t=>`<li><img src="assets/${t.icon}" alt="">${t.name}${t.note?` <span>${t.note}</span>`:''}</li>`).join('');
 const a=of('agent').map(t=>`<li class="stk-agent"><b><img src="assets/${t.icon}" alt="">${t.name}</b><span>Owner: ${t.owner}</span></li>`);
 const x='<li class="stk-ax" aria-hidden="true">✕</li>';
 const agents=[a[0],x,a[1],x,'<li aria-hidden="true"></li>',x,a[2],x,a[3]].join('');
 const gap='<div class="stk-gap" aria-hidden="true"><i>✕</i></div>';
 return `<section class="stk"><div class="stk-licensed"><b>Licensed</b><ul>${licensed}</ul></div><div class="stk-islands"><article class="stk-island stk-company"><h3>Company AI</h3><p>Everyone has it. Each person uses it in their own chats.</p><ul>${of('company').map(tool).join('')}</ul></article>${gap}<article class="stk-island stk-agents"><h3>Department agents</h3><p>Built in Copilot Studio. Each has its own owner.</p><ul>${agents}</ul></article>${gap}<article class="stk-island stk-personal"><h3>Personal apps</h3><p>Learned before the rollout. Outside company control.</p><ul>${of('personal').map(tool).join('')}</ul></article></div><p class="stk-band"><b>${n('company')}</b> company AI platforms <i>·</i> <b>${n('agent')}</b> department agents <i>·</i> <b>${n('personal')}</b> personal apps <i>·</i> <b class="stk-zero">0</b> connected to each other</p></section>`;
}
const crowdTools={copilot:{name:'Copilot',color:'#2f6bff',kind:'company'},agents:{name:'Department agents',color:'#7a5af8',kind:'company'},claude:{name:'Claude',color:'#e07a3f',kind:'company'},chatgpt:{name:'ChatGPT',color:'#0e9384',kind:'company'},chatgptp:{name:'ChatGPT · personal',color:'#0e9384',kind:'personal'},grok:{name:'Grok · personal',color:'#344054',kind:'personal'},perplexity:{name:'Perplexity · personal',color:'#06aed4',kind:'personal'},none:{name:'No AI use yet',color:'',kind:'none'}};
const crowdDepts=[
 {name:'Operations',mix:[['agents',11],['copilot',14],['chatgpt',4],['claude',1],['chatgptp',2],['perplexity',1],['none',7]],featured:{nina:'agents'}},
 {name:'Customer Service',mix:[['copilot',13],['agents',4],['chatgpt',3],['chatgptp',3],['none',7]],featured:{ava:'copilot'}},
 {name:'Sales',mix:[['copilot',8],['chatgpt',7],['agents',2],['grok',3],['chatgptp',2],['perplexity',2]],featured:{ben:'copilot',marcus:'grok'}},
 {name:'Leadership & admin',mix:[['copilot',6],['claude',4],['chatgpt',3],['chatgptp',1],['perplexity',1],['none',3]],featured:{dana:'claude',leah:'copilot'}},
 {name:'Projects',mix:[['copilot',9],['chatgpt',2],['chatgptp',1],['perplexity',1],['none',3]],featured:{elena:'copilot'}},
 {name:'Finance',mix:[['copilot',4],['claude',6],['chatgpt',2],['none',2]],featured:{priya:'claude'}},
 {name:'IT',mix:[['copilot',3],['agents',3],['claude',1],['chatgpt',1]],featured:{daniel:'agents'}}
];
export function crowdTotals(){const totals={};crowdDepts.forEach(d=>d.mix.forEach(([tool,n])=>{totals[tool]=(totals[tool]||0)+n;}));return totals;}
export function crowdByKind(){const totals=crowdTotals();const out={company:0,personal:0,none:0};Object.entries(totals).forEach(([t,n])=>{out[crowdTools[t].kind]+=n;});return out;}
const dotClass=tool=>`cr-dot${tool==='none'?' is-none':crowdTools[tool].kind==='personal'?' is-personal':''}`;
export function renderCrowd(){
 const totals=crowdTotals();const all=Object.values(totals).reduce((a,b)=>a+b,0);const usingAi=all-(totals.none||0);const {company,personal,none}=crowdByKind();
 const dept=d=>{const featured=Object.entries(d.featured);const dots=[];
  d.mix.forEach(([tool,n])=>{const mine=featured.filter(([,t])=>t===tool).map(([id])=>id);for(let i=0;i<n;i++){const id=mine[i];const p=id&&person(id);
   dots.push(`<i class="${dotClass(tool)}${p?' is-featured':''}" style="${tool==='none'?'':`--c:${crowdTools[tool].color}`}"${p?` title="${p.name}"`:''}>${p?p.name[0]:''}</i>`);}});
  const size=d.mix.reduce((a,[,n])=>a+n,0);const ai=size-(d.mix.find(([t])=>t==='none')?.[1]||0);
  return `<article class="cr-dept"><header><b>${d.name}</b><span>${ai} of ${size} use AI</span></header><div class="cr-dots">${dots.join('')}</div></article>`;};
 const order=['copilot','agents','claude','chatgpt','chatgptp','grok','perplexity','none'];
 const companyKinds=order.filter(t=>crowdTools[t].kind==='company').length;const personalKinds=order.filter(t=>crowdTools[t].kind==='personal').length;
 const entry=t=>`<li><i class="${dotClass(t)}" style="${t==='none'?'':`--c:${crowdTools[t].color}`}"></i><b>${crowdTools[t].name}</b><span>${totals[t]||0}</span></li>`;
 const group=(kind,label)=>`<li class="cr-lgroup">${label}</li>${order.filter(t=>crowdTools[t].kind===kind).map(entry).join('')}`;
 const legend=`${group('company','Company AI')}${group('personal','Personal accounts')}<li class="cr-lgap" aria-hidden="true"></li>${entry('none')}`;
 return `<section class="cr" role="img" aria-label="${all} people at Parkside. ${usingAi} use some form of AI: ${company} mostly on company AI, ${personal} mostly on a personal account. ${none} do not yet."><aside class="cr-legend"><p class="cr-big"><b>${usingAi}</b><span>of ${all} use some form of AI</span></p><p class="cr-split"><b>${company}</b> mostly on company AI · <b>${personal}</b> mostly on a personal account</p><ul>${legend}</ul><p class="cr-key"><i class="cr-dot is-featured" style="--c:#0e1726">D</i>The nine we’ll follow</p></aside><div class="cr-grid">${crowdDepts.map(dept).join('')}<article class="cr-take"><b>Bought together. Used apart.</b><span>3 company AI platforms plus department agents. ${personalKinds} personal apps. No shared work between them.</span><span class="cr-none">${none} people use none yet.</span></article></div></section>`;
}
