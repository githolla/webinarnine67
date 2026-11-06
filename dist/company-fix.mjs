import { personToken, escapeHtml } from './company-view.mjs';
export const WATCH_LAST=4;
export const fixCopy={
 build:{eyebrow:'The fix · 1 of 3',title:'What we build, and where it lives.',lead:'No new AI vendor. Each person’s best work becomes a shared company tool on the platform they already use.'},
 watch:{eyebrow:'The fix · 2 of 3 · Simulated',title:'Watch one week land in one place.',lead:''},
 plan:{eyebrow:'Where to start',title:'How we build it, with your people.',lead:''}
};
export const fixCues={
 build:'Josh: This answers “how would you build it?” Three columns, three platforms Parkside already pays for. Each card is one tool, built from one person’s real work, with that person as owner. Marcus’s technique moves from his phone to a company GPT, and we only learn it by asking him. Everything reads from one Register in your Microsoft 365. Next: watch it happen.',
 watch:[
  'Josh: One SharePoint list in Parkside’s own Microsoft 365. HF-01 is already in it: Ask Ops proposed it, Nina reviewed it. Press → to add Priya.',
  'Josh: Priya’s shared Claude project finds the duplicate invoice. It only proposes. Priya approves in Teams, and then it counts. Press →.',
  'Josh: Elena’s new Copilot agent reads HF-01 and proposes the tracker row. She approves. No more broad prompt. Press →.',
  'Josh: Marcus’s company GPT knows about HF-01 before the Northwind call. He approves the call note, and it lands in HubSpot and the Register. Press →.',
  'Josh: Three platforms, four reviewed items, one place. The Friday Brief agent reads only reviewed rows and flags the one thing it cannot know. Leah edits. She stops stitching. Simulated, not live.'
 ],
 connected:'Josh: Same nine people, same company AI. The by-hand lines into Leah are gone. Blue reads the Register, green proposes and a named owner reviews. Personal apps sit outside, never connected. Daniel’s team approves every connector.',
 plan:'Josh: Four steps. We discover, you prioritize, we build with your people, and we measure what the Register records. No new AI vendor. Timelines and scope come out of the Discovery Session. Type “discovery” in the chat. Leave this up for Q&A.'
};
const lock='<svg class="fx-lock" viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="7" width="10" height="8" rx="1.5"/><path d="M5 7V5a3 3 0 0 1 6 0v2" fill="none"/></svg>';
const img=(f,cls='')=>`<img${cls?` class="${cls}"`:''} src="assets/${f}" alt="">`;
const ctl='<i class="rx-ctl" aria-hidden="true"><em></em><em></em><em></em></i>';
const win=(cls,icon,app,path,body)=>`<section class="rx-win fx-win ${cls}"><header class="rx-title">${img(icon)}<b>${app}</b><span>${path}</span>${ctl}</header><div class="rx-body">${body}</div></section>`;

const platforms=[
 {icon:'copilot.webp',name:'Microsoft 365 Copilot + Copilot Studio',sub:'Agents in Teams and Microsoft 365 Copilot Chat',cards:[
  ['elena','Project Tracker Assist','New agent. Proposes tracker owners and dates.','Owner: Elena','Reads + proposes'],
  ['leah','Friday Brief','Drafts Dana’s brief from reviewed items only.','Owner: Leah','Reads only'],
  ['nina','Ask Ops + Propose finding','Her existing agent. Not rebuilt. One new action.','Owner: Nina','Reads + proposes'],
  ['daniel','Ask Parkside + the Register','Anyone can ask who owns what.','Owner: Daniel (IT)','Reads only']],
  foot:'Ask Sales and Ask Service also read the Register.'},
 {icon:'claude.svg',name:'Claude · company plan',sub:'Shared projects in the Parkside organization',cards:[
  ['priya','Month-End Reconciliation','Shared project. Her method is the instructions.','Owner: Priya','Proposes exceptions'],
  'maya',
  ['dana','Board prep project','Starts board questions from reviewed items.','Owner: Dana','Reads only']],
  foot:'Reads company files through the Microsoft 365 connector IT enables. Proposes through an IT-approved connector.'},
 {icon:'openai.svg',name:'ChatGPT · company plan',sub:'Custom GPTs shared in the Parkside workspace',cards:[
  ['marcus','Call Prep Coach','Custom GPT built from his rehearsal technique.','Owner: Marcus','Reads HubSpot with his own access']],
  personal:true}
];
const buildCard=c=>c==='maya'
 ?'<li class="fx-ghostrow"><span class="fx-ghost" aria-hidden="true">M</span><p>Maya runs it at her branch. Each person’s chats stay private.</p></li>'
 :`<li class="fx-bcard">${personToken(c[0],'S')}<div><b>${c[1]}</b><p>${c[2]}</p><span class="fx-chips"><i>${c[3]}</i><i>${c[4]}</i></span></div></li>`;
const personalLane=`<div class="fx-personal"><span class="fx-interview" aria-hidden="true"><i>↑</i>interview</span><p class="fx-plabel">${lock}Personal AI: we learn from it, we never connect to it</p><p class="fx-plogos">${img('grok.svg')}${img('openai.svg')}<em>Personal</em></p><p>We ask Marcus how he practices. He chooses what to share. His personal chats stay his.</p></div>`;
const answers=[['New AI vendor?','No'],['Personal accounts connected?','Never'],['Private chats read?','Never'],['Who approves access?','Parkside IT'],['Who approves content?','A named owner']];
export function renderBuildMap(){
 const cols=platforms.map(p=>`<article class="fx-col"><header>${img(p.icon)}<div><b>${p.name}</b><small>${p.sub}</small></div></header><ul>${p.cards.map(buildCard).join('')}</ul>${p.personal?personalLane:''}${p.foot?`<p class="fx-foot">${p.foot}</p>`:''}</article>`).join('');
 const flow=['Proposed by a company tool','Approved in Teams by a named owner','Owner + due date, in the tool people use'];
 const strip=`<div class="fx-strip"><div class="fx-reg"><small>THE ONE PLACE</small><b>Parkside Work Register</b><span>A SharePoint list in Parkside’s own Microsoft 365</span></div><ol class="fx-flow">${flow.map(f=>`<li>${f}</li>`).join('')}</ol><div class="fx-it">${personToken('daniel','S')}<span>IT approves every connector and access</span></div></div>`;
 return `<section class="fx fx-build" aria-label="What Nine-67 builds on each company AI platform, all connected to the Parkside Work Register"><div class="fx-cols">${cols}</div>${strip}<ul class="fx-answers">${answers.map(([q,a])=>`<li><span>${q}</span><b>${a}</b></li>`).join('')}</ul></section>`;
}

const pills=['HF-01 already in','Priya · Claude','Elena · Copilot','Marcus · ChatGPT','Friday brief'];
const captions=[
 'Monday. One reviewed finding is already in the Register: HF-01 from Ask Ops, reviewed by Nina.',
 'Priya’s Claude project proposes an exception. Priya approves it in Teams. Only then does it count.',
 'Elena’s Copilot agent reads HF-01 and proposes a tracker row. Elena approves.',
 'Marcus’s company GPT knows HF-01 before the call. His approved note goes to HubSpot and the Register.',
 'The Friday Brief agent reads only reviewed rows. Every line has an owner, a due date and a source.'
];
const rows=[
 {id:'HF-01',finding:'Northwind handoff has no receiving owner',src:'CASE-201 · Zendesk',icon:'ms-teams.svg',tool:'Ask Ops',by:'Nina',owner:'Nina · Tue Nov 10'},
 {id:'REC-07',finding:'East: invoice N101 posted twice',src:'East.xlsx · row 3',icon:'claude.svg',tool:'Month-End Reconciliation',by:'Priya',owner:'Priya · Fri Nov 13',at:'9:14 AM'},
 {id:'T-41',finding:'Confirm Northwind rollout scope',src:'Ops sync recap · Nov 5',icon:'copilot.webp',tool:'Project Tracker Assist',by:'Elena',owner:'Nina · Tue Nov 10',at:'10:02 AM'},
 {id:'CALL-12',finding:'Northwind wants one setup contact',src:'HubSpot call note',icon:'openai.svg',tool:'Call Prep Coach',by:'Marcus',owner:'Marcus · Mon Nov 9',at:'2:40 PM'}
];
function register(step){
 const shown=rows.slice(0,Math.min(step,3)+1);
 const body=shown.map((r,i)=>`<tr class="${i===step&&i>0?'fx-new':''}"><th scope="row">${r.id}</th><td><b>${r.finding}</b><small>${r.src}</small></td><td><span class="fx-by">${img(r.icon)}${r.tool}</span></td><td>${r.by}</td><td>${r.owner.split(' · ')[0]} ·<span class="fx-due">${r.owner.split(' · ')[1]}</span></td><td><span class="fx-ok">Reviewed</span>${i===step&&r.at?`<small>Approved in Teams · ${r.at}</small>`:''}</td></tr>`).join('');
 const empty=step<4?'<tr class="fx-empty"><td colspan="6">Next proposal waits for review</td></tr>':'';
 return `<section class="rx-win rx-teams fx-win fx-register"><header class="rx-title">${img('ms-teams.svg')}<b>Teams</b><span>Leadership › Work Register</span>${ctl}</header><nav class="fx-tab">${img('ms-sharepoint.svg')}<b>Work Register (SharePoint list)</b></nav><div class="fx-tablewrap"><table><caption>Parkside Work Register</caption><thead><tr><th scope="col">ID</th><th scope="col">Finding</th><th scope="col">Proposed by</th><th scope="col">Reviewed by</th><th scope="col">Owner · Due</th><th scope="col">Status</th></tr></thead><tbody>${body}${empty}</tbody></table></div></section>`;
}
const say=(who,text,cls='')=>`<div class="fx-say ${cls}"><small>${who}</small><p>${text}</p></div>`;
const approved=name=>`<span class="fx-approved">✓ Approved by ${name}</span>`;
function leftPane(step){
 if(step===0)return `<article class="fx-card fx-waiting"><b class="fx-cardtitle">Three company tools, three people</b><ul>${[['priya','claude.svg','Month-End Reconciliation'],['elena','copilot.webp','Project Tracker Assist'],['marcus','openai.svg','Call Prep Coach']].map(([id,icon,t])=>`<li>${personToken(id,'S')}<span class="fx-by">${img(icon)}${t}</span><em>Waiting</em></li>`).join('')}</ul></article>`;
 if(step===1)return `${win('fx-claude','claude.svg','Claude · Parkside','Shared project',`<p class="fx-wpath">Projects › Month-End Reconciliation</p><span class="fx-wchip">Shared with Finance · rules v1 · owner Priya</span>${say('PRIYA','November files are in: North.csv, East.xlsx, West.csv.','is-user')}${say('CLAUDE','Reconciled 3 files with rules v1. 1 exception: invoice N101 appears twice in East.xlsx ($1,200). I have not removed it. Proposed to the Register as REC-07 for your review.')}`)}<div class="rx-card is-done fx-approval"><p class="rx-kicker">Approvals · REC-07</p><p>East: invoice N101 posted twice · Requested by Month-End Reconciliation</p>${approved('Priya')}</div>`;
 if(step===2)return win('rx-teams fx-tall','ms-teams.svg','Teams','Project Tracker Assist',`<p class="rx-from"><b>Project Tracker Assist</b><span class="rx-app">APP</span></p>${say('','From Thursday’s Ops sync recap: “Confirm Northwind rollout scope” has no owner. The Register lists Nina on HF-01. Proposed update for T-41: owner Nina, due Tue Nov 10.')}<p class="fx-row">${approved('Elena')}<span class="rx-btn is-ghost">Edit</span></p>`);
 if(step===3)return win('fx-gpt fx-tall','openai.svg','ChatGPT · Parkside workspace','',`<p class="fx-wpath">Call Prep Coach</p><span class="fx-wchip">Company GPT · built from Marcus’s technique</span>${say('GPT','Before your Northwind call. Open in the Register: HF-01, handoff owner, Nina, Tue Nov 10. Likely pushback: “Who is actually helping me?”')}${say('MARCUS','I’m your contact. Nina confirms the setup owner by Tuesday.','is-user')}${say('GPT','Draft call note: Northwind wants one contact for setup. Save to HubSpot and propose to the Register?')}<p class="fx-row">${approved('Marcus')}<small class="fx-micro">Reads HubSpot with Marcus’s own access.</small></p>`);
 return `<article class="fx-card fx-checks"><b class="fx-cardtitle">Four reviewed items</b><ul>${['HF-01 · Ask Ops · Nina','REC-07 · Claude · Priya','T-41 · Copilot · Elena','CALL-12 · ChatGPT · Marcus'].map(t=>`<li>✓ ${t}</li>`).join('')}</ul></article>`;
}
const mini=(cls,icon,title,text,isNew)=>`<section class="rx-win fx-mini ${cls}${isNew?' fx-new':''}"><header class="rx-title">${img(icon)}<b>${title}</b></header><div class="rx-body"><p>${text}</p></div></section>`;
function rightPane(step){
 if(step===0)return mini('fx-outlook','ms-outlook.svg','Friday brief · Week of Nov 2','Not started. Waiting for reviewed items.');
 if(step<4)return [
  mini('fx-excel','ms-excel.svg','Month-end exceptions.xlsx','N101 held for review · Priya',step===1),
  step>=2?mini('fx-excel','ms-excel.svg','Thursday commitments.xlsx','T-41 · Confirm rollout scope · Nina · Nov 10 ✓',step===2):'',
  step>=3?mini('rx-hubspot','hubspot.svg','Companies › Northwind','Note · Wants one contact for setup · Marcus · 2:41 PM',step===3):''
 ].join('');
 const lines=[['Operations: Northwind handoff needs a receiving owner. Nina, Tue Nov 10.','HF-01'],['Finance: East duplicate invoice N101 held. Priya, Fri Nov 13.','REC-07'],['Projects: Northwind rollout scope assigned to Nina, Tue Nov 10.','T-41'],['Accounts: Northwind asked for one setup contact. Marcus, Mon Nov 9.','CALL-12']];
 return win('fx-outlook fx-brief','ms-outlook.svg','Outlook','Draft · Friday brief · Week of Nov 2',`<p class="fx-to">To: Dana</p><span class="fx-wchip">${img('copilot.webp')}Drafted by Friday Brief from 4 reviewed Register items</span><ul class="fx-lines">${lines.map(([t,id])=>`<li><span>${t}</span><i>${id}</i></li>`).join('')}</ul><p class="fx-flag">⚑ Leah to confirm: Service wrote “NW Services”. Same account as Northwind?</p><p class="fx-sends">Leah edits and sends.</p>`);
}
export function renderWatch(step=0){
 const s=Math.max(0,Math.min(WATCH_LAST,Number(step)||0));
 const stepper=`<ol class="fx-stepper" aria-label="Steps">${pills.map((p,i)=>`<li class="${i<s?'is-done':i===s?'is-current':''}"${i===s?' aria-current="step"':''}><span aria-hidden="true">${i<s?'✓':i+1}</span>${p}</li>`).join('')}</ol>`;
 const labels=['1 · A company tool proposes','2 · A named owner reviews, in one place','3 · It lands where people work'];
 const grid=`<div class="fx-watch-grid"><div class="fx-pane"><small class="fx-label">${labels[0]}</small>${leftPane(s)}</div><div class="fx-pane"><small class="fx-label">${labels[1]}</small>${register(s)}</div><div class="fx-pane"><small class="fx-label">${labels[2]}</small>${rightPane(s)}</div></div>`;
 const band=s===4?'<div class="fx-band"><p>Four reviewed items. Three company AI platforms. One place.</p><small>Leah edits instead of stitching.</small></div>':'';
 const footer=s<4?`<footer class="build-footer"><button class="build-primary" data-step-forward data-fix-step="${s+1}" aria-label="Next step: ${escapeHtml(pills[s+1])}">Next step →</button></footer>`:'<footer class="build-footer"><span class="build-complete">Every line traces to a reviewed row.</span></footer>';
 return `<section class="fx fx-watch" aria-label="Simulated week: company tools propose, named owners review, one Work Register">${stepper}<p class="fx-caption" aria-live="polite">${captions[s]}</p>${grid}${band}<div class="fx-footrow"><p class="fx-gov">Nothing counts until a named owner approves it in Teams. Every change is kept in list version history. IT approved each connector.</p>${footer}</div></section>`;
}

const plan=[
 ['Discover','Sit beside your people in their real tools.','Inventory every license, agent, project and custom GPT, with its owner and sources. Ask what people do in personal AI, and why.','Teams show real work. IT shares the admin view.','An AI inventory and a map of every hand-stitched handoff.'],
 ['Prioritize','Pick the handoffs that cost the most stitching.','Rank handoffs by how often people chase inputs and how many teams they touch.','Dana and Leah choose. Owners agree to review. IT signs off on access.','A build plan: each tool, its platform, its owner.'],
 ['Build','Build with the people who will use it.','Stand up the Register, extend existing agents, rebuild the best private methods as company tools.','Owners test with real work. IT approves each connector before go-live.','Working tools on licenses you already pay for.'],
 ['Measure','Count what the Register records.','Findings proposed vs. reviewed, items with an owner and date, briefs that still needed hand reconciliation, and who keeps using each tool.','Leadership keeps, fixes or retires each build, then picks the next.','The next build, added to the same Register.']
];
export function renderPlan(){
 const steps=plan.map(([name,one,n67,park,get],i)=>`<li class="fx-step"><header><i>${i+1}</i><b>${name}</b></header><p class="fx-one">${one}</p><dl><div><dt>Nine-67</dt><dd>${n67}</dd></div><div><dt>Parkside</dt><dd>${park}</dd></div><div><dt>You get</dt><dd>${get}</dd></div></dl></li>`).join('');
 const t=ids=>`<span class="fx-toks">${ids.map(id=>personToken(id,'S')).join('')}</span>`;
 const who=[['<span class="fx-n67" aria-hidden="true">N67</span>','Nine-67 engineers build in your tenant, beside your people.'],[t(['daniel']),'Your IT approves every connector and access.'],[t(['nina','priya','elena','marcus']),'Department owners own their tools and review their findings.'],[t(['leah','dana']),'Leah reviews the brief. Dana sponsors and picks priorities.']];
 return `<section class="fx fx-plan" aria-label="How Nine-67 builds it with your people: discover, prioritize, build, measure"><ol class="fx-steps">${steps}</ol><ul class="fx-who">${who.map(([a,b])=>`<li>${a}<p>${b}</p></li>`).join('')}</ul><div class="sh-cta fx-cta"><div><h2>Book an AI Workflow Discovery Session.</h2><p>Type “discovery” in the webinar chat</p></div><ul><li>Bring: IT, Operations and two department leaders whose teams depend on each other.</li><li>And your AI inventory if you have one: licenses, agents, custom GPTs, projects.</li></ul></div><p class="fx-rule">Built only on the AI you already license. Personal accounts are never connected.</p></section>`;
}
