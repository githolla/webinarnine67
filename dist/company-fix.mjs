import { personToken, escapeHtml } from './company-view.mjs';
export const WATCH_LAST=4;
export const fixCopy={
 build:{eyebrow:'The fix · 1 of 3',title:'Meet the Parkside AI Register.',lead:'Nine-67 builds on the AI you already license and connects it through one Register your team controls.'},
 watch:{eyebrow:'The fix · 2 of 3 · Simulated',title:'The AI Register we built, live for one week.',lead:''},
 connected:{eyebrow:'The fix · 3 of 3',title:'Same people, same AI. Now the work connects.',lead:'Every tool reads one Register. Nothing counts until a named owner approves it.'},
 plan:{eyebrow:'Where to start',title:'How we build it, with your people.',lead:''}
};
export const fixCues={
 build:'Josh: This is what we build. In the middle, one Register: a SharePoint list in your own Microsoft 365. Around it, tools built from each person’s real work, on the AI Parkside already pays for. Left side, Copilot agents. Right side, a shared Claude project and a company GPT. Some tools propose items, some only read. Personal apps stay outside: we learn from them, we never connect them. Next: see the Register at work.',
 watch:[
  'Josh: Same pattern every time, left to right. A tool proposes. A named owner approves in Teams. It becomes a row in the Register. It lands in the tool that person already uses. HF-01 is already in. Press →.',
  'Josh: Priya’s shared Claude project finds the duplicate invoice. It only proposes. Priya approves, and only then does it count. Press →.',
  'Josh: Elena’s Copilot agent finds a tracker row with no owner and proposes Nina. Nina is the owner, so Nina approves. Elena’s tracker updates itself. Press →.',
  'Josh: Marcus’s company GPT preps the Northwind call with what the Register already knows. He approves the call note and it lands in HubSpot. Press →.',
  'Josh: Friday. The Friday Brief agent writes Leah’s draft from approved rows only, and flags the one thing it cannot know. Leah edits instead of stitching. Simulated here, built in your tenant for real.'
 ],
 connected:'Josh: Same nine people, same company AI. The by-hand lines into Leah are gone. Every tool reads the Register, and nothing counts until a named owner approves it. Personal apps sit outside, never connected. Daniel’s team approves every connector.',
 plan:'Josh: Four steps. We discover, you prioritize, we build with your people, and we measure what the Register records. Your IT approves access, every tool has a named owner, and leadership picks what comes next. Timelines and scope come out of the Discovery Session. Type “discovery” in the chat. Leave this up for Q&A.'
};
const img=(f,cls='')=>`<img${cls?` class="${cls}"`:''} src="assets/${f}" alt="">`;
const ctl='<i class="rx-ctl" aria-hidden="true"><em></em><em></em><em></em></i>';
const win=(cls,icon,app,path,body)=>`<section class="rx-win fx-win ${cls}"><header class="rx-title">${img(icon)}<b>${app}</b><span>${path}</span>${ctl}</header><div class="rx-body">${body}</div></section>`;

const tools={
 copilot:{icon:'copilot.webp',name:'Microsoft 365 Copilot + Copilot Studio',items:[
  ['elena','Project Tracker Assist','Proposes owners and dates for her tracker','proposes'],
  ['nina','Ask Ops','Proposes findings from Ops cases','proposes'],
  ['leah','Friday Brief','Drafts Dana’s brief from approved rows','reads'],
  ['daniel','Ask Parkside','Answers “who owns this?” for anyone','reads']]},
 claude:{icon:'claude.svg',name:'Claude · company plan',items:[
  ['priya','Month-End Reconciliation','Her method, shared. Maya runs it at her branch.','proposes'],
  ['dana','Board prep','Starts board questions from approved rows','reads']]},
 chatgpt:{icon:'openai.svg',name:'ChatGPT · company plan',items:[
  ['marcus','Call Prep Coach','Built from his call technique. Notes go to HubSpot.','proposes']]}
};
const L={x:0,w:530},R={x:1230,w:530},HUB={x:650,y:84,w:460,h:410},CARD=112;
const leftY=[56,182,308,434],rightY=[56,182,366];
function toolCard([id,name,text,verb],x,y,side){
 return `<li class="fx-tool is-${verb}" style="left:${x}px;top:${y}px;width:${side.w}px;height:${CARD}px">${personToken(id,'S')}<div><b>${name}</b><p>${text}</p></div></li>`;
}
function link(x1,y1,x2,y2,verb,labelX){
 const mx=(x1+x2)/2;const d=`M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`;
 return `<path class="fx-link is-${verb}" d="${d}"/>`+`<g class="fx-linklabel is-${verb}" transform="translate(${labelX} ${(y1+y2)/2})"><rect x="-52" y="-15" width="104" height="30" rx="15"/><text text-anchor="middle" dy="6">${verb}</text></g>`;
}
export function renderBuildMap(){
 const left=tools.copilot.items,right=[...tools.claude.items,...tools.chatgpt.items];
 const hubIn=i=>HUB.y+90+i*76;
 const svg=[...left.map((t,i)=>link(L.x+L.w,leftY[i]+CARD/2,HUB.x,hubIn(i),t[3],590)),...right.map((t,i)=>link(R.x,rightY[i]+CARD/2,HUB.x+HUB.w,HUB.y+110+i*96,t[3],1170))].join('');
 const cards=[...left.map((t,i)=>toolCard(t,L.x,leftY[i],L)),...right.map((t,i)=>toolCard(t,R.x,rightY[i],R))].join('');
 const head=(p,x,y,w)=>`<p class="fx-plat" style="left:${x}px;top:${y}px;width:${w}px">${img(p.icon)}${p.name}</p>`;
 const rows=[['HF-01','Nina','Tue'],['REC-07','Priya','Fri'],['T-41','Nina','Tue'],['CALL-12','Marcus','Mon']];
 const hub=`<div class="fx-hub" style="left:${HUB.x}px;top:${HUB.y}px;width:${HUB.w}px;height:${HUB.h}px"><small>The one place</small><b>Parkside AI Register</b><span>A SharePoint list in your own Microsoft 365</span><ul>${rows.map(([id,o,d])=>`<li><i>${id}</i><span>${o}</span><span>${d}</span><em>✓</em></li>`).join('')}</ul></div>`;
 const personal=`<p class="fx-personal" style="left:${R.x}px;top:494px;width:${R.w}px">${img('grok.svg')}${img('openai.svg')}<span><b>Personal apps:</b> we learn from them, never connect them.</span></p>`;
 const map=`<div class="fx-map"><svg class="fx-links" viewBox="0 0 1760 560" aria-hidden="true">${svg}</svg>${head(tools.copilot,L.x,0,L.w)}${head(tools.claude,R.x,0,R.w)}${head(tools.chatgpt,R.x,318,R.w)}<ul class="fx-tools">${cards}</ul>${hub}${personal}</div>`;
 const how=`<div class="fx-how"><p class="fx-howlabel">How it works</p><ol>${['A company tool <b>proposes</b>','A named owner <b>approves</b> in Teams','It <b>lands</b> in the tool people use, with owner and due date'].map((t,i)=>`<li><i>${i+1}</i><span>${t}</span></li>`).join('')}</ol></div>`;
 const who=`<ul class="fx-whoband">${[['<span class="fx-n67" aria-hidden="true">N67</span>','Nine-67 builds it with your people'],[personToken('daniel','S'),'Your IT approves every connector'],['<span class="fx-ownmark" aria-hidden="true">✓</span>','Every tool has a named owner']].map(([a,b])=>`<li>${a}<span>${b}</span></li>`).join('')}</ul>`;
 return `<section class="fx fx-build" aria-label="What Nine-67 builds: company AI tools on Copilot, Claude and ChatGPT, all connected through the Parkside AI Register">${map}<div class="fx-bottom">${how}${who}</div></section>`;
}

const items=[
 {id:'HF-01',who:'nina',pill:'HF-01 · Ask Ops',tool:['ms-teams.svg','Ask Ops','Copilot Studio agent','Case CASE-201: the Northwind handoff has no receiving owner. Propose to the Register?'],approver:'Nina',at:'Mon 9:05 AM',item:'Northwind handoff has no receiving owner',owner:'Nina',due:'Tue Nov 10',land:['ms-teams.svg','Teams','Operations channel','HF-01 posted. Owner Nina, due Tue Nov 10.']},
 {id:'REC-07',who:'priya',pill:'REC-07 · Priya',tool:['claude.svg','Claude','Month-End Reconciliation','Invoice N101 appears twice in East.xlsx ($1,200). Not removed. Propose as REC-07?'],approver:'Priya',at:'Tue 9:14 AM',item:'East: invoice N101 posted twice',owner:'Priya',due:'Fri Nov 13',land:['ms-excel.svg','Excel','Month-end exceptions.xlsx','N101 held for review. Owner Priya.']},
 {id:'T-41',who:'elena',pill:'T-41 · Elena → Nina',tool:['copilot.webp','Project Tracker Assist','Copilot Studio agent','“Confirm Northwind rollout scope” has no owner. HF-01 lists Nina. Propose owner Nina, due Tue Nov 10?'],approver:'Nina',at:'Wed 10:02 AM',item:'Confirm Northwind rollout scope',owner:'Nina',due:'Tue Nov 10',land:['ms-excel.svg','Excel','Elena’s tracker','Row updated: owner Nina, due Nov 10.']},
 {id:'CALL-12',who:'marcus',pill:'CALL-12 · Marcus',tool:['openai.svg','Call Prep Coach','Company GPT','Before the Northwind call: HF-01 is open and Nina owns it. Draft note: Northwind wants one setup contact.'],approver:'Marcus',at:'Thu 2:40 PM',item:'Northwind wants one setup contact',owner:'Marcus',due:'Mon Nov 9',land:['hubspot.svg','HubSpot','Companies › Northwind','Call note saved to the Northwind record.']}
];
const pills=[...items.map(i=>i.pill),'Friday brief'];
const captions=[
 'The pattern. Ask Ops proposed HF-01, Nina approved it, and it landed in the Register and the Operations channel.',
 'Priya’s shared Claude project proposes. Priya approves. The Register and her Excel file update.',
 'Elena’s Copilot agent proposes an owner. Nina, the named owner, approves. Elena’s tracker updates.',
 'Marcus’s company GPT preps the call. Marcus approves the note. HubSpot and the Register update.',
 'Friday. The Friday Brief agent writes Leah’s draft from approved rows only.'
];
const stage=(n,label,body)=>`<div class="fx-stage"><p class="fx-stagelabel"><i>${n}</i>${label}</p>${body}</div>`;
function flow(it){
 const [ticon,tapp,tpath,ttext]=it.tool,[licon,lapp,lpath,ltext]=it.land;
 const propose=win(`fx-propose fx-app-${ticon.split('.')[0]}`,ticon,tapp,tpath,`<p class="fx-msg">${ttext}</p><p class="fx-msgfoot">${personToken(it.who,'S')}<span>Proposed for ${it.owner}</span></p>`);
 const approve=win('rx-teams fx-approve','ms-teams.svg','Teams','Approvals',`<p class="fx-apid">${it.id}</p><p class="fx-apitem">${it.item}</p><p class="fx-approved">✓ Approved by ${it.approver}</p><small class="fx-apat">${it.at}</small>`);
 const land=win(`fx-land fx-app-${licon.split('.')[0]}`,licon,lapp,lpath,`<p class="fx-msg">${ltext}</p>`);
 const arrow='<span class="fx-arrow" aria-hidden="true">→</span>';
 return `<div class="fx-flow4">${stage(1,'A tool proposes',propose)}${arrow}${stage(2,'The owner approves',approve)}${arrow}${stage(3,'A row in the Register',`<div class="fx-rowcard"><i>${it.id}</i><b>${it.item}</b><span>${it.owner} · ${it.due}</span><em>✓ Approved</em></div>`)}${arrow}${stage(4,'It lands where they work',land)}</div>`;
}
function brief(){
 const lines=[['Operations: Northwind handoff needs a receiving owner. Nina, Tue Nov 10.','HF-01'],['Finance: East duplicate invoice N101 held. Priya, Fri Nov 13.','REC-07'],['Projects: Northwind rollout scope assigned to Nina, Tue Nov 10.','T-41'],['Accounts: Northwind asked for one setup contact. Marcus, Mon Nov 9.','CALL-12']];
 const mail=win('fx-outlook fx-brief','ms-outlook.svg','Outlook','Draft · Friday brief · Week of Nov 2',`<p class="fx-to">From Leah · To Dana · <span class="fx-wchip">${img('copilot.webp')}Written by Friday Brief from 4 approved rows</span></p><ul class="fx-lines">${lines.map(([t,id])=>`<li><span>${t}</span><i>${id}</i></li>`).join('')}</ul><p class="fx-flag">⚑ Leah to confirm: Service wrote “NW Services”. Same account as Northwind?</p>`);
 return `<div class="fx-final">${mail}<div class="fx-take"><b>Four approved items. Three company AI platforms. One Register.</b><span>Leah edits instead of stitching.</span></div></div>`;
}
function register(s){
 const shown=items.slice(0,Math.min(s,3)+1);
 const body=shown.map((r,i)=>`<tr class="${i===s?'fx-new':''}"><th scope="row">${img(r.tool[0])}${r.id}</th><td>${r.item}</td><td>${r.owner}</td><td>${r.due}</td><td><span class="fx-ok">✓ Approved</span></td></tr>`).join('');
 const empty=s<3?`<tr class="fx-empty"><td colspan="5">Next: ${escapeHtml(items[s+1].pill)} waits for an owner</td></tr>`:'';
 return `<section class="rx-win rx-teams fx-win fx-register"><header class="rx-title">${img('ms-sharepoint.svg')}<b>Parkside AI Register</b><span>SharePoint list · Microsoft 365</span>${ctl}</header><table><thead><tr><th scope="col">ID</th><th scope="col">Item</th><th scope="col">Owner</th><th scope="col">Due</th><th scope="col">Status</th></tr></thead><tbody>${body}${empty}</tbody></table></section>`;
}
export function renderWatch(step=0){
 const s=Math.max(0,Math.min(WATCH_LAST,Number(step)||0));
 const stepper=`<ol class="fx-stepper" aria-label="Steps">${pills.map((p,i)=>`<li class="${i<s?'is-done':i===s?'is-current':''}"${i===s?' aria-current="step"':''}><span aria-hidden="true">${i<s?'✓':i+1}</span>${p}</li>`).join('')}</ol>`;
 const main=s<4?flow(items[s]):brief();
 const footer=s<4?`<footer class="build-footer"><button class="build-primary" data-step-forward data-fix-step="${s+1}" aria-label="Next step: ${escapeHtml(pills[s+1])}">Next step →</button></footer>`:'<footer class="build-footer"><span class="build-complete">Every line traces to an approved row.</span></footer>';
 return `<section class="fx fx-watch" aria-label="Simulated week in the Parkside AI Register: a tool proposes, a named owner approves, it lands where people work">${stepper}<p class="fx-caption" aria-live="polite">${captions[s]}</p>${main}${s<4?register(s):''}<div class="fx-footrow"><p class="fx-gov">Nothing counts until a named owner approves it. Every change is kept in the list history. IT approves each connector.</p>${footer}</div></section>`;
}

const plan=[
 ['Discover','We sit beside your people and inventory every license, agent and workaround.','A map of every hand-stitched handoff.'],
 ['Prioritize','You pick the handoffs that cost the most. Each gets a named owner.','A build plan: tool, platform, owner.'],
 ['Build','We build the Register and the tools on your licensed AI, with the people who use them.','Working tools in your Microsoft 365.'],
 ['Measure','We track what the Register records: approved items, owners, dates and who keeps using each tool.','Proof, and the next build.']
];
export function renderPlan(){
 const steps=plan.map(([name,does,get],i)=>`<li class="fx-step"><header><i>${i+1}</i><b>${name}</b></header><p class="fx-does">${does}</p><p class="fx-get"><small>You get</small>${get}</p></li>`).join('');
 const t=ids=>`<span class="fx-toks">${ids.map(id=>personToken(id,'S')).join('')}</span>`;
 const who=[['<span class="fx-n67" aria-hidden="true">N67</span>','Nine-67 engineers build with your people.'],[t(['daniel']),'Your IT approves every connector and access.'],[t(['nina','priya','marcus']),'Every tool has a named owner.'],[t(['dana','leah']),'Leadership picks the priorities.']];
 return `<section class="fx fx-plan" aria-label="How Nine-67 builds it with your people: discover, prioritize, build, measure"><ol class="fx-steps">${steps}</ol><ul class="fx-who">${who.map(([a,b])=>`<li>${a}<p>${b}</p></li>`).join('')}</ul><div class="sh-cta fx-cta"><div><h2>Book an AI Workflow Discovery Session.</h2><p>Type “discovery” in the webinar chat</p></div><ul><li>Bring IT, Operations and two department leaders whose teams depend on each other.</li><li>Built only on the AI you already license. Personal accounts are never connected.</li></ul></div></section>`;
}
