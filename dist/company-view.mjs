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
 {title:'Same tools. Very different work.',lead:'150 people. One Copilot rollout. Useful work stays local.'},
 {title:'See what people have figured out.',lead:''},
 {title:'The same access. Very different needs.',lead:''},
 {title:'See the work between departments.',lead:''},
 {title:'What we discover by sitting beside people.',lead:''},
 {title:'Three things Nine-67 could build.',lead:''},
 {title:'Look across the company. Choose where to build.',lead:''}
];
export const cues=[
 'Josh: Dana sees real success, including her own. Her confidence is reasonable. Ask the question on the band, then press →.',
 'Josh: These are different surveys. People get more done; much of the work stays private; fewer people embed AI into workflows.',
 'Josh: The same license means nine different things. Press → to sit beside each person, starting with Dana.',
 'Josh: Priya’s refresh, Ben’s saved review and Nina’s bot already work. Press →. Ask who else could use what they have already built.',
 'Josh: This is not a motivation problem. Show Ava’s hidden preparation, Elena’s first attempt and Marcus’s private practice.',
 'Josh: Leah compares the names, dates and assumptions. Then show the summary Dana actually receives.',
 'Josh: Start company-wide discovery before deciding what to build. Some work can be reused, some needs a guided workflow, and some needs a connection.',
 'Josh: Show the input, the human review and the usable output. Press → at each step. These are simulated workflows, not live integrations.',
 'Josh: Bring Operations, IT and two department leaders. One example where AI helps. One piece of work you still chase.'
];
export const tourPeople=['dana','daniel','ben','priya','nina','ava','elena','marcus','leah'];
export const verdicts={dana:'win',daniel:'diff',ben:'win',priya:'win',nina:'win',marcus:'diff',ava:'stuck',elena:'stuck',leah:'glue'};
const verdictLabel={win:'AI WIN',diff:'DIFFERENT WAY',stuck:'STRUGGLING',glue:'THE GLUE'};
const badges={dana:'Personal value',daniel:'Useful foundation',ben:'Private success',priya:'Reusable method',nina:'Team-built tool',marcus:'Quiet practice',ava:'Hidden effort',elena:'Wants a way in',leah:'Manual assembly'};
const toolIcon={dana:'claude.svg',daniel:'ms-teams.svg',ben:'copilot.webp',priya:'claude.svg',nina:'ms-teams.svg',marcus:'grok.svg',ava:'copilot.webp',elena:'copilot.webp',leah:'copilot.webp'};
const person=id=>people.find(p=>p.id===id);
export function personToken(id,size='M',line=''){
 const p=person(id);if(!p)return '';const v=verdicts[id];
 if(size==='S')return `<span class="sh-pt sh-pt-s v-${v}"><span class="sh-pt-av" aria-hidden="true">${p.name[0]}<img src="assets/${toolIcon[id]}" alt=""></span><b>${p.name}</b></span>`;
 const tool=`<span class="sh-pt-tool"><img src="assets/${toolIcon[id]}" alt="">${e(p.ai)}</span>${id==='marcus'?'<span class="sh-pt-extra">Personal phone</span>':''}`;
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
function board(){return `<section class="sh-dana"><div class="sh-dana-quote"><blockquote>“We gave everyone AI.<br>I thought we were in pretty good shape.”</blockquote><div class="sh-dana-who"><div class="sh-dana-photo" role="img" aria-label="Dana, illustrative portrait"></div><div class="sh-dana-meta"><p class="sh-attr">Dana · CEO, Parkside</p><p class="sh-dana-seen">Dana has seen Sales use it well. IT launched a company assistant. Claude helps her prepare for board meetings.</p>${personToken('dana','L')}</div></div><button class="primary x-explore" data-workspace="dana">Open Dana’s rollout and Claude session →</button></div><article class="sh-card sh-window sh-board"><header><img src="assets/ms-powerpoint.svg" alt=""><b>Parkside · CEO’s rollout update</b><span>AI rollout · Board update</span></header><ul>${[['150','Copilot licenses assigned'],['Live','Ask Parkside company assistant'],['Working','Sales forecast review']].map(([v,l])=>`<li><i aria-hidden="true">✓</i><strong>${v}</strong><span>${l}</span></li>`).join('')}</ul></article><div class="sh-band sh-dana-band"><p>What would we see if we sat beside the employees? →</p></div></section>`;}
const bar=(pct,tone,label)=>`<div class="sh-viz" role="img" aria-label="${label}"><div class="sh-bar"><i class="t-${tone}" style="width:${pct}%"></i></div></div>`;
function gapBars(){return '<div class="sh-viz sh-gapviz" role="img" aria-label="85 percent use AI at work; 29 percent embed it in workflows; a 56 point gap"><div class="sh-bar"><i class="t-ink" style="width:85%"><em>85%</em></i></div><div class="sh-bar"><i class="t-stuck" style="width:29%"><em>29%</em></i><span class="sh-hatch" style="left:29%;width:56%">the gap</span></div></div>';}
function research(){return `<section class="sh-research"><div class="sh-stats"><article class="sh-card sh-stat"><strong class="sh-hero"><small aria-hidden="true">&nbsp;</small>83%</strong><p class="sh-claim">say AI makes them more productive</p>${bar(83,'win','83 percent agree AI improves individual productivity')}<button class="sh-source" data-detail="research">Source: Miro, 2026</button></article><article class="sh-card sh-stat"><strong class="sh-hero"><small aria-hidden="true">&nbsp;</small>69%</strong><p class="sh-claim">of AI work happens privately</p>${bar(69,'stuck','69 percent say most AI-assisted work happens in private sessions')}<button class="sh-source" data-detail="research">Source: Miro, 2026</button></article><article class="sh-card sh-stat is-climax"><strong class="sh-hero is-stuck"><small>85% use AI</small>29%</strong><p class="sh-claim">embed it in workflows</p>${gapBars()}<button class="sh-source" data-detail="research">Source: Atlassian, 2026</button></article></div><div class="sh-band sh-research-band"><p>Individual wins are real. The work between people is still manual.</p><span>So we sat beside nine people at Parkside →</span></div><p class="sh-fine">Separate self-reported surveys, not one funnel. Parkside is illustrative, not a measured case study.</p></section>`;}
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
 const stages=[['01','Discover across departments','Watch real work. Find useful methods, unmet needs and handoffs.'],['02','Prioritize with leadership','A company-wide roadmap and a first build with an owner.'],['03','Build with the employees','Test with the people who supply, review and use it.'],['04','Measure and expand','Time chasing inputs, time to a usable result, continued use.']];
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
 if(key==='discovery')return {title:'Book an AI Workflow Discovery Session',html:'<p>Bring Operations, IT and two department leaders whose teams depend on each other.</p><p>Each brings one example where AI helps and one piece of work they still chase.</p><div id="booking-content"><b>Type “discovery” in the webinar chat to arrange the session.</b></div><p>Start with company-wide discovery, prioritize a build plan, then implement with the employees who will use it.</p>'};
 return {title:'About this demonstration',html:'<p>Parkside, its employees and every record are fictional. Interfaces, AI responses, file processing and integrations are simulated locally. No live business records or private AI chats are accessed.</p><p>A real build requires approved sources, scoped access, validation, accountable owners and testing with the people doing the work.</p>'};
}
const stackOfficial=[
 {icon:'microsoft.svg',name:'Microsoft 365',note:'Teams · Outlook · Excel · PowerPoint · SharePoint'},
 {icon:'copilot.webp',name:'Copilot',note:'150 licenses, one per employee'},
 {icon:'hubspot.svg',name:'HubSpot',note:'Sales'},
 {icon:'zendesk.svg',name:'Zendesk',note:'Customer Service'}
];
const stackActual=[
 {icon:'copilot.webp',name:'Copilot',how:'Rolled out',kind:'official',people:['ben','ava','elena','leah']},
 {icon:'claude.svg',name:'Claude',how:'Bought separately',kind:'separate',people:['dana','priya']},
 {icon:'ms-teams.svg',name:'Ask Parkside',how:'Built by IT',kind:'built',people:['daniel']},
 {icon:'ms-teams.svg',name:'Ask Ops',how:'Built by Operations',kind:'built',people:['nina']},
 {icon:'grok.svg',name:'Grok',how:'Personal phone',kind:'personal',people:['marcus']},
 {icon:'openai.svg',name:'ChatGPT',how:'Personal accounts',kind:'personal',people:[],others:'Others across the company'},
 {icon:'perplexity.svg',name:'Perplexity',how:'Personal accounts',kind:'personal',people:[],others:'Others across the company'}
];
export function renderStack(){
 const official=stackOfficial.map(t=>`<li><img src="assets/${t.icon}" alt=""><div><b>${t.name}</b><span>${t.note}</span></div></li>`).join('');
 const actual=stackActual.map(t=>`<li class="stk-${t.kind}"><img src="assets/${t.icon}" alt=""><div class="stk-tool"><b>${t.name}</b><span class="stk-how">${t.how}</span></div><div class="stk-people">${t.people.map(id=>personToken(id,'S')).join('')}${t.others?`<span class="stk-others">${t.others}</span>`:''}</div></li>`).join('');
 return `<section class="stk"><div class="stk-cols"><article class="stk-card stk-plan"><small>What leadership rolled out</small><ul>${official}</ul><p>The stack on Dana’s rollout slide.</p></article><span class="stk-arrow" aria-hidden="true">→</span><article class="stk-card stk-real"><small>What people actually use</small><ul>${actual}</ul></article></div><p class="stk-band"><b>7</b> AI tools <i>·</i> <b>2</b> homegrown bots <i>·</i> <b>3</b> on personal accounts <i>·</i> <b class="stk-zero">0</b> shared between teams</p></section>`;
}
const crowdTools={copilot:{name:'Copilot',color:'#2f6bff'},chatgpt:{name:'ChatGPT',color:'#0e9384'},claude:{name:'Claude',color:'#e07a3f'},perplexity:{name:'Perplexity',color:'#06aed4'},askops:{name:'Ask Ops',color:'#7a5af8'},askparkside:{name:'Ask Parkside',color:'#b692f6'},grok:{name:'Grok',color:'#344054'},none:{name:'No AI use yet',color:''}};
const crowdDepts=[
 {name:'Operations',mix:[['askops',11],['copilot',18],['chatgpt',4],['none',7]],featured:{nina:'askops'}},
 {name:'Customer Service',mix:[['copilot',18],['chatgpt',5],['none',7]],featured:{ava:'copilot'}},
 {name:'Sales',mix:[['copilot',12],['chatgpt',7],['grok',3],['perplexity',2]],featured:{ben:'copilot',marcus:'grok'}},
 {name:'Leadership & admin',mix:[['copilot',8],['claude',4],['chatgpt',1],['perplexity',2],['none',3]],featured:{dana:'claude',leah:'copilot'}},
 {name:'Projects',mix:[['copilot',10],['chatgpt',2],['perplexity',1],['none',3]],featured:{elena:'copilot'}},
 {name:'Finance',mix:[['copilot',5],['claude',5],['chatgpt',2],['none',2]],featured:{priya:'claude'}},
 {name:'IT',mix:[['copilot',3],['askparkside',4],['perplexity',1]],featured:{daniel:'askparkside'}}
];
export function crowdTotals(){const totals={};crowdDepts.forEach(d=>d.mix.forEach(([tool,n])=>{totals[tool]=(totals[tool]||0)+n;}));return totals;}
export function renderCrowd(){
 const totals=crowdTotals();const all=Object.values(totals).reduce((a,b)=>a+b,0);const usingAi=all-(totals.none||0);
 const dept=d=>{const featured=Object.entries(d.featured);const dots=[];
  d.mix.forEach(([tool,n])=>{const mine=featured.filter(([,t])=>t===tool).map(([id])=>id);for(let i=0;i<n;i++){const id=mine[i];const p=id&&person(id);
   dots.push(`<i class="cr-dot${tool==='none'?' is-none':''}${p?' is-featured':''}" style="${tool==='none'?'':`--c:${crowdTools[tool].color}`}"${p?` title="${p.name}"`:''}>${p?p.name[0]:''}</i>`);}});
  const size=d.mix.reduce((a,[,n])=>a+n,0);const ai=size-(d.mix.find(([t])=>t==='none')?.[1]||0);
  return `<article class="cr-dept"><header><b>${d.name}</b><span>${ai} of ${size} use AI</span></header><div class="cr-dots">${dots.join('')}</div></article>`;};
 const order=['copilot','chatgpt','claude','perplexity','askops','askparkside','grok','none'];
 const legend=order.map(t=>`<li><i class="cr-dot${t==='none'?' is-none':''}" style="${t==='none'?'':`--c:${crowdTools[t].color}`}"></i><b>${crowdTools[t].name}</b><span>${totals[t]||0}</span></li>`).join('');
 return `<section class="cr" role="img" aria-label="${all} people at Parkside. ${usingAi} use some form of AI, across ${order.length-1} different tools. ${totals.none} do not yet."><aside class="cr-legend"><p class="cr-big"><b>${usingAi}</b><span>of ${all} use some form of AI</span></p><ul>${legend}</ul><p class="cr-key"><i class="cr-dot is-featured" style="--c:#0e1726">D</i>The nine we’ll follow</p></aside><div class="cr-grid">${crowdDepts.map(dept).join('')}<article class="cr-take"><b>${order.length-1} different AI tools.</b><span>Nobody chose them together.</span><span class="cr-none">${totals.none} people use none yet.</span></article></div></section>`;
}
