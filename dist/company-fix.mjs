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
const flowIn=[
 ['copilot.webp','Project Tracker Assist','Elena · Copilot Studio'],
 ['ms-teams.svg','Ask Ops','Nina · Copilot Studio'],
 ['copilot.webp','Friday Brief','Leah · Copilot Studio'],
 ['ms-teams.svg','Ask Parkside','Daniel · Copilot Studio'],
 ['claude.svg','Month-End Reconciliation','Priya · Claude'],
 ['claude.svg','Board prep','Dana · Claude'],
 ['openai.svg','Call Prep Coach','Marcus · ChatGPT']
];
const flowOut=[
 ['ms-teams.svg','Teams','Approvals and channels'],
 ['ms-excel.svg','Excel','Trackers and month-end files'],
 ['hubspot.svg','HubSpot','Account notes'],
 ['ms-outlook.svg','Outlook','Leah’s Friday brief']
];
function curve(x1,y1,x2,y2){const xm=(x1+x2)/2,ym=(y1+y2)/2,dx=x2-x1;return `<path class="fx2-link" d="M${x1} ${y1} C${x1+dx*.3} ${y1} ${xm-dx*.12} ${ym} ${xm} ${ym} C${xm+dx*.12} ${ym} ${x2-dx*.3} ${y2} ${x2} ${y2}" marker-mid="url(#fx2-arrow)"/>`;}
export function renderBuildMap(){
 const H=560,cx=880,cy=250,r=118;
 const inY=flowIn.map((_,i)=>44+i*74),outY=flowOut.map((_,i)=>92+i*112);
 const hubPt=(y,side)=>{const t=Math.max(-.62,Math.min(.62,(y-cy)/260));return [cx+side*r*Math.cos(Math.asin(t)),cy+r*t];};
 const links=[...inY.map(y=>{const [x2,y2]=hubPt(y,-1);return curve(420,y,x2-6,y2);}),...outY.map(y=>{const [x1,y1]=hubPt(y,1);return curve(x1+6,y1,1338,y);})].join('');
 const svg=`<svg class="fx2-links" viewBox="0 0 1760 ${H}" aria-hidden="true"><defs><linearGradient id="fx2-grad" x1="0" x2="1"><stop offset="0" stop-color="#6b8cff"/><stop offset="1" stop-color="#22c3ee"/></linearGradient><marker id="fx2-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="13" markerHeight="13" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#22a8ee"/></marker></defs>${links}</svg>`;
 const node=([icon,name,sub])=>`<li><span class="fx2-ring">${img(icon)}</span><div><b>${name}</b><small>${sub}</small></div></li>`;
 const left=`<div class="fx2-col fx2-in"><p class="fx2-colhead">Company AI tools we build</p><ul>${flowIn.map(node).join('')}</ul></div>`;
 const right=`<div class="fx2-col fx2-out"><p class="fx2-colhead">Lands where people work</p><ul>${flowOut.map(node).join('')}</ul></div>`;
 const hub=`<div class="fx2-hub" style="left:${cx-r}px;top:${cy-r}px;width:${r*2}px;height:${r*2}px"><span class="fx2-dots" aria-hidden="true">${Array.from({length:15},(_,i)=>`<i style="height:${[10,22,34,22,10][i%5]}px"></i>`).join('')}</span><b>AI Register</b></div><div class="fx2-hublabel" style="left:${cx-260}px;top:${cy+r+18}px;width:520px"><b>Parkside AI Register</b><span>One SharePoint list in your Microsoft 365. Tools propose, a named owner approves, everyone reads.</span></div>`;
 const personal=`<p class="fx2-personal" style="left:${cx-260}px;top:${cy+r+118}px;width:520px">${img('grok.svg')}${img('openai.svg')}<span><b>Personal apps:</b> we learn from them, never connect them.</span></p>`;
 const map=`<div class="fx-map fx2-map">${svg}${left}${hub}${right}${personal}</div>`;
 const how=`<div class="fx-how"><p class="fx-howlabel">How it works</p><ol>${['A company tool <b>proposes</b>','A named owner <b>approves</b> in Teams','It <b>lands</b> in the tool people use, with owner and due date'].map((t,i)=>`<li><i>${i+1}</i><span>${t}</span></li>`).join('')}</ol></div>`;
 const who=`<ul class="fx-whoband">${[['<span class="fx-n67" aria-hidden="true">N67</span>','Nine-67 builds it with your people'],[personToken('daniel','S'),'Your IT approves every connector'],['<span class="fx-ownmark" aria-hidden="true">✓</span>','Every tool has a named owner']].map(([a,b])=>`<li>${a}<span>${b}</span></li>`).join('')}</ul>`;
 return `<section class="fx fx-build" aria-label="What Nine-67 builds: company AI tools on Copilot, Claude and ChatGPT flow into the Parkside AI Register and out to Teams, Excel, HubSpot and Outlook">${map}<div class="fx-bottom">${how}${who}</div></section>`;
}

const items=[
 {id:'HF-01',proposedAt:'Mon 8:52 AM',landedAt:'Mon 9:06 AM',who:'nina',pill:'HF-01 · Ask Ops',tool:['ms-teams.svg','Ask Ops','Copilot Studio agent','Make Nina the owner of Northwind’s next step, due Tue Nov 10.'],came:['Customer email','“Your team says setup is done. Who do we call now?”'],problem:'Setup marked complete. Nobody owns what happens next.',approver:'Nina',at:'Mon 9:05 AM',item:'Northwind: nobody owns the next step',owner:'Nina',due:'Tue Nov 10',land:['ms-teams.svg','Teams','Operations channel','HF-01 posted. Owner Nina, due Tue Nov 10.']},
 {id:'REC-07',proposedAt:'Tue 8:40 AM',landedAt:'Tue 9:15 AM',who:'priya',pill:'REC-07 · Priya',came:['Three branch files','North.csv · East.xlsx · West.csv'],problem:'Invoice N101 ($1,200) appears twice.',tool:['claude.svg','Claude','Month-End Reconciliation','Hold the East row for Priya’s review. Nothing is removed.'],approver:'Priya',at:'Tue 9:14 AM',item:'East: invoice N101 posted twice',owner:'Priya',due:'Fri Nov 13',land:['ms-excel.svg','Excel','Month-end exceptions.xlsx','N101 held for review. Owner Priya.']},
 {id:'T-41',proposedAt:'Wed 9:48 AM',landedAt:'Wed 10:03 AM',who:'elena',pill:'T-41 · Elena → Nina',came:['Ops sync recap','“Confirm Northwind rollout scope”'],problem:'The tracker row has no owner.',tool:['copilot.webp','Project Tracker Assist','Copilot Studio agent','Owner Nina, due Tue Nov 10.'],approver:'Nina',at:'Wed 10:02 AM',item:'Confirm Northwind rollout scope',owner:'Nina',due:'Tue Nov 10',land:['ms-excel.svg','Excel','Elena’s tracker','Row updated: owner Nina, due Nov 10.']},
 {id:'CALL-12',proposedAt:'Thu 2:31 PM',landedAt:'Thu 2:41 PM',who:'marcus',pill:'CALL-12 · Marcus',came:['Call prep','Monday call with Northwind'],problem:'Northwind wants one setup contact.',tool:['openai.svg','Call Prep Coach','Company GPT','Log it on Northwind in HubSpot. Owner Marcus.'],approver:'Marcus',at:'Thu 2:40 PM',item:'Northwind wants one setup contact',owner:'Marcus',due:'Mon Nov 9',land:['hubspot.svg','HubSpot','Companies › Northwind','Call note saved to the Northwind record.']}
];
const pills=[...items.map(i=>`${i.at.split(' ')[0]} · ${i.pill}`),'Fri · Friday brief'];
const captions=[
 'Northwind asked who to call next, and nobody owned it. Ask Ops spotted it, Nina took it, and now everyone can see it.',
 'Priya’s shared Claude project proposes. Priya approves. The Register and her Excel file update.',
 'Elena’s Copilot agent proposes an owner. Nina, the named owner, approves. Elena’s tracker updates.',
 'Marcus’s company GPT preps the call. Marcus approves the note. HubSpot and the Register update.',
 'Friday. The Friday Brief agent writes Leah’s draft from approved rows only.'
];
const stage=(n,label,body,when='')=>`<div class="fx-stage"><p class="fx-stagelabel"><i>${n}</i>${label}${when?`<time>${when}</time>`:''}</p>${body}</div>`;
function flow(it){
 const [ticon,tapp,tpath,ttext]=it.tool,[licon,lapp,lpath,ltext]=it.land;
 const propose=win(`fx-propose fx-app-${ticon.split('.')[0]}`,ticon,tapp,tpath,`${it.came?`<div class="fx-in"><small>What came in · ${it.came[0]}</small><p>${it.came[1]}</p></div><div class="fx-prob"><small>The problem</small><p>${it.problem}</p></div><div class="fx-prop"><small>${tapp} proposes</small><p>${ttext}</p></div>`:`<p class="fx-msg">${ttext}</p>`}${it.came?'':`<p class="fx-msgfoot">${personToken(it.who,'S')}<span>Proposed for ${it.owner}</span></p>`}`);
 const approve=win('rx-teams fx-approve','ms-teams.svg','Teams','Approvals',`<p class="fx-apid">${it.id}</p><p class="fx-apitem">${it.item}</p><p class="fx-approved">✓ Approved by ${it.approver}</p><small class="fx-apat">${it.at}</small>`);
 const land=win(`fx-land fx-app-${licon.split('.')[0]}`,licon,lapp,lpath,`<p class="fx-msg">${ltext}</p>`);
 const arrow='<span class="fx-arrow" aria-hidden="true">→</span>';
 return `<div class="fx-flow4">${stage(1,`${tapp.replace('Project ','')} proposes`,propose,it.proposedAt)}${arrow}${stage(2,`${it.approver} approves`,approve,it.at)}${arrow}${stage(3,'Row in the Register',`<div class="fx-rowcard"><i>${it.id}</i><b>${it.item}</b><span>${it.owner} · ${it.due}</span><em>✓ Approved</em></div>`,it.at)}${arrow}${stage(4,`Lands in ${lapp}`,land,it.landedAt)}</div>`;
}
function brief(){
 const lines=[['Operations: Nina owns Northwind’s next step. Tue Nov 10.','HF-01'],['Finance: East duplicate invoice N101 held. Priya, Fri Nov 13.','REC-07'],['Projects: Northwind rollout scope assigned to Nina, Tue Nov 10.','T-41'],['Accounts: Northwind asked for one setup contact. Marcus, Mon Nov 9.','CALL-12']];
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
