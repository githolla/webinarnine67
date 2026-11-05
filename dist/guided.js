'use strict';
const DESK = 4;
const DONE = 5;
const scenes = [
  {
    "kicker": "The customer request",
    "title": "Your team has AI. Why is the work still manual?",
    "lead": "Meet Keystone Fabrication. A customer changes the material, quantity and delivery split on an active order.",
    "next": "Follow the handoffs →",
    "time": "1:04:30–1:05:15",
    "say": "Introduce Rachel as the customer and Leah as account manager. Read the full request, the accurate acknowledgment and Rachel’s positive reply. Leah has not promised an unverified date.",
    "point": "Introduce Rachel as the customer and Leah as account manager. Read the full request, the accurate acknowledgment and Rachel’s positive reply. Leah has not promised an unverified date."
  },
  {
    "kicker": "AI in every department",
    "title": "Everyone completes a different check.",
    "lead": "Request captured. Commercial scope updated. Capacity checked. Material and engineering reviews requested.",
    "next": "Compare the records →",
    "time": "1:05:15–1:07:00",
    "say": "Read the extended AI conversations. Each assistant accurately distinguishes its completed local check from the unresolved delivery decision. Show Leah’s follow-up tasks, Dana’s conditional amendment and Sam’s submitted PUR-91 and ECO-27 requests. Everyone saves the right update and communicates the limits.",
    "point": "Read the extended AI conversations. Each assistant accurately distinguishes its completed local check from the unresolved delivery decision. Show Leah’s follow-up tasks, Dana’s conditional amendment and Sam’s submitted PUR-91 and ECO-27 requests. Everyone saves the right update and communicates the limits."
  },
  {
    "kicker": "The manufacturing dependency",
    "title": "The open checks are known. Their answers are disconnected.",
    "lead": "A 316L price is not a material allocation. Available hours are not a verified delivery plan.",
    "next": "See the delay →",
    "time": "1:07:00–1:08:00",
    "say": "State clearly: Sam already requested material and engineering validation. Page 3 is not a hidden problem his AI failed to mention. The purchasing record belongs to revision A; revision B needs a new supply commitment. Point to the three queues and their owners. Their results do not automatically trigger reconciliation or update the other systems. A Teams channel shares awareness, but people still need to collect evidence, compare revisions and complete the updates.",
    "point": "State clearly: Sam already requested material and engineering validation. Page 3 is not a hidden problem his AI failed to mention. The purchasing record belongs to revision A; revision B needs a new supply commitment. Point to the three queues and their owners. Their results do not automatically trigger reconciliation or update the other systems. A Teams channel shares awareness, but people still need to collect evidence, compare revisions and complete the updates."
  },
  {
    "kicker": "The cost of disconnected work",
    "title": "Local work finished. Shared work waited.",
    "lead": "The delay comes from following up, collecting evidence and reconciling answers across separate queues.",
    "next": "Connect the workflow →",
    "time": "1:08:00–1:09:00",
    "say": "No person forgot a step or used a bad prompt. The local tasks finished, while known dependencies awaited answers and manual reconciliation. The material mismatch is resolved when people compare the underlying records; the late resolution loses the earlier supply option in this fictional example. The manufacturing release remains safely held.",
    "point": "No person forgot a step or used a bad prompt. The local tasks finished, while known dependencies awaited answers and manual reconciliation. The material mismatch is resolved when people compare the underlying records; the late resolution loses the earlier supply option in this fictional example. The manufacturing release remains safely held."
  },
  {
    "kicker": "Rewind · Connected workflow",
    "title": "A connected workflow completes the open checks.",
    "lead": "Track the dependencies, collect the evidence, recalculate the plan and verify the approved updates.",
    "next": "Approve coordinated update →",
    "time": "1:09:00–1:10:00",
    "say": "The connected workflow matches order and revision, compares the existing allocation, and tracks PUR-91 and ECO-27 to evidence-backed answers. It follows up or escalates overdue requests. Confirmed material and engineering results trigger a fresh capacity check and amended customer terms. People approve their decisions. The workflow writes consistent records, verifies success and only then prepares the customer confirmation. A missing answer remains a hold, not an invented fact.",
    "point": "The connected workflow matches order and revision, compares the existing allocation, and tracks PUR-91 and ECO-27 to evidence-backed answers. It follows up or escalates overdue requests. Confirmed material and engineering results trigger a fresh capacity check and amended customer terms. People approve their decisions. The workflow writes consistent records, verifies success and only then prepares the customer confirmation. A missing answer remains a hold, not an invented fact."
  },
  {
    "kicker": "Request → completed work",
    "title": "Now the customer can act on the answer.",
    "lead": "The approved scope, material allocation, manufacturing plan and customer commitment agree.",
    "next": "Find your handoffs →",
    "time": "1:10:00–1:11:00",
    "say": "Read the verified records and customer correspondence. The same people and AI now work with reconciled evidence. The customer can schedule installation. All writes and approvals in this demo are simulated.",
    "point": "Read the verified records and customer correspondence. The same people and AI now work with reconciled evidence. The customer can schedule installation. All writes and approvals in this demo are simulated."
  },
  {
    "kicker": "Complimentary workflow assessment",
    "title": "Find your manual handoffs.",
    "lead": "Bring one workflow. We will map the systems, decisions and dependencies that keep it manual.",
    "next": "Back to the start ↺",
    "time": "1:16:00 and 1:27:30",
    "say": "Offer the complimentary workflow assessment, scheduled separately after the webinar. Map one workflow, its dependencies and one measurable outcome.",
    "point": "Offer the complimentary workflow assessment, scheduled separately after the webinar. Map one workflow, its dependencies and one measurable outcome."
  }
];
const clocks = [[{"d": "Mon, Nov 2", "t": "8:55 AM", "n": "Request acknowledged"}], [{"d": "Mon, Nov 2", "t": "9:20 AM", "n": "Three local updates saved"}], [{"d": "Mon, Nov 2", "t": "9:20 AM", "n": "Cross-system validation pending", "tone": "warn"}], [{"d": "Wed, Nov 4", "t": "10:25 AM", "n": "Customer still waiting", "tone": "warn"}], [{"d": "Mon, Nov 2", "t": "11:15 AM", "n": "Dependencies verified", "tone": "calm"}], [{"d": "Mon, Nov 2", "t": "11:28 AM", "n": "Customer can schedule installation", "tone": "calm"}], null];
const rewindDays = ["Wed, Nov 4","Tue, Nov 3","Mon, Nov 2"];
const rewindTo = "Mon, Nov 2 · 8:41 AM";
const leads = {"ready": "Approve the coordinated plan.", "unknown": "Hold: customer acceptance pending.", "booked": "Replan: 316L cannot arrive in time."};
const deskCopy = {
  "ready": {
    "headline": "Approve the coordinated plan.",
    "proof": "Rachel approved amendment B",
    "source": "Simulation · no live writes",
    "bench": "316L supply confirmed · BOM B validated · split delivery feasible",
    "confirm": "Customer accepted the revised price and split delivery",
    "note": "Supplier, engineering, capacity and customer evidence are linked to revision B.",
    "hold": ""
  },
  "unknown": {
    "headline": "Hold: customer acceptance pending.",
    "proof": "Amendment B not yet accepted",
    "source": "Acceptance pending",
    "bench": "Material and capacity checked; commercial acceptance still needed.",
    "confirm": "Leah requests customer acceptance",
    "note": "Keep the manufacturing release on hold until the revised terms are accepted.",
    "hold": "Held. No coordinated release until Rachel accepts the amended scope, price and delivery plan."
  },
  "booked": {
    "headline": "Replan: 316L cannot arrive in time.",
    "proof": "Delivery proposal must change",
    "source": "Supply conflict",
    "bench": "316L arrival misses the first production window.",
    "confirm": "Sam prepares a feasible alternative",
    "note": "Dana updates the amendment; Leah asks Rachel to approve the new split or date.",
    "hold": "Held. Machine capacity cannot compensate for unavailable material. Replan and get customer acceptance before release."
  }
};
const byId = id => document.getElementById(id);
const panels = Array.from(document.querySelectorAll('.scene'));
const steps = Array.from(document.querySelectorAll('.steps li'));
const presenter = window.N67_PRESENTER === true;
let current = 0;
let rehearsal = false;
let availability = 'ready';
let timers = [];
const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
const later = (ms,fn) => timers.push(setTimeout(fn,ms));

function fillAssessment() {
  const event = window.N67_EVENT;
  byId('cta-presenters').innerHTML = window.N67_presenterMarkup();
  const slots = byId('cta-slots');
  if (event.novemberSlots > 0) {
    slots.hidden = false;
    slots.textContent = 'We run these ourselves, so we are holding ' + event.novemberSlots + ' sessions in November.';
  }
  const booking = byId('cta-booking');
  if (event.bookingUrl) {
    const link = document.createElement('a');
    link.href = event.bookingUrl; link.target = '_blank'; link.rel = 'noopener';
    link.textContent = event.bookingLabel || event.bookingUrl.replace(/^https?:\/\//, '');
    booking.append('Book at ', link, '. Or type “assessment” in chat.');
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
    script.onload = () => { if (typeof window.QRCode === 'function') new window.QRCode(byId('cta-qr'), {text:event.bookingUrl,width:132,height:132,colorDark:'#17201f',colorLight:'#fffdf8'}); };
    document.head.append(script);
  } else {
    booking.innerHTML = 'Type <strong>assessment</strong> and your workflow in chat, or reply to the follow-up email.';
  }
}
fillAssessment();

function render() {
  const s=scenes[current];
  const d=deskCopy[availability];
  document.body.dataset.step=String(current);
  panels.forEach((panel,i)=>{panel.hidden=i!==current;});
  steps.forEach((step,i)=>{if(i===current)step.setAttribute('aria-current','step');else step.removeAttribute('aria-current');});
  byId('kicker').textContent=s.kicker;
  byId('title').textContent=s.title;
  byId('lead').textContent=current===DESK?leads[availability]:s.lead;
  byId('lead').hidden=current===DESK;
  byId('next').textContent=s.next;
  byId('next').disabled=current===DESK && availability!=='ready';
  byId('approve').disabled=availability!=='ready';
  byId('back').disabled=current===0; byId('counter').textContent=(current+1)+' of '+scenes.length;
  byId('cuebox').hidden=!(presenter && rehearsal); byId('mode').textContent=rehearsal?'Mode: Rehearsal':'Mode: Live';
  byId('time').textContent=s.time; byId('say').textContent=s.say; byId('point').textContent=s.point;
  byId('availability').value=availability;
  byId('proposal-headline').textContent=d.headline;
  byId('availability-proof').textContent=d.proof;
  byId('proposal-source').textContent=d.source;
  byId('log-bench').textContent=d.bench;
  byId('log-confirm').textContent=d.confirm;
  byId('log-confirm-note').textContent=d.note;
  byId('log-confirm-row').classList.toggle('waiting',availability!=='ready');
  byId('hold').hidden=availability==='ready';
  byId('hold').textContent=d.hold;
}
function setClock(f) {
  const clock=byId('clock');
  clock.hidden=!f;
  if(!f)return;
  byId('clock-day').textContent=f.d; byId('clock-time').textContent=f.t; byId('clock-note').textContent=f.n;
  clock.className='clock'; void clock.offsetWidth; clock.className='clock flip'+(f.tone?' '+f.tone:'');
}
function playClock(index) {
  const frames=clocks[index];
  if(!frames||calm.matches){setClock(frames?frames[frames.length-1]:null);return;}
  frames.forEach(f=>f.at?later(f.at,()=>setClock(f)):setClock(f));
}
function rewind() {
  const overlay=byId('rewind');
  overlay.hidden=false;
  setClock(clocks[DESK][0]);
  rewindDays.forEach((day,i)=>later(i*180,()=>{byId('rewind-day').textContent=day;}));
  later(rewindDays.length*180+150,()=>{byId('rewind-day').textContent=rewindTo;});
  later(1900,()=>{
    overlay.hidden=true;
    const panel=panels[DESK]; panel.hidden=true; void panel.offsetWidth; panel.hidden=false;
    playClock(DESK);
  });
}
function show(index,navigate=false) {
  if(index<0 || index>=scenes.length)return;
  if(index===DONE && current===DESK && availability!=='ready')return;
  const from=current;
  current=index;
  if(current!==DESK){availability='ready';byId('qa-controls').open=false;}
  timers.forEach(clearTimeout); timers=[];
  byId('rewind').hidden=true;
  render();
  if(navigate && index===DESK && from===DESK-1 && !calm.matches)rewind(); else playClock(index);
  if(navigate){history.replaceState(null,'','#slide-'+(index+1));byId('title').focus({preventScroll:true});window.scrollTo(0,0);byId('announcement').textContent=scenes[index].title;}
}
function advance(){if(!byId('next').disabled)show((current+1)%scenes.length,true);}
function followHash(){
  const m=location.hash.match(/^#slide-(\d+)$/);
  const i=m?Math.max(0,Math.min(scenes.length-1,Number(m[1])-1)):0;
  show(i);
  if(new URLSearchParams(location.search).has('qa')&&i===DESK)byId('qa-controls').open=true;
}
byId('next').addEventListener('click',advance);
steps.forEach((step,i)=>step.querySelector('button').addEventListener('click',()=>show(i,true)));
byId('approve').addEventListener('click',()=>{if(availability==='ready')show(DONE,true);});
byId('back').addEventListener('click',()=>show(current-1,true));
byId('mode').addEventListener('click',()=>{rehearsal=!rehearsal;if(!rehearsal)show(0,true);else render();});
byId('availability').addEventListener('change',()=>{availability=byId('availability').value;render();});
document.addEventListener('keydown',event=>{
  if(event.repeat||event.ctrlKey||event.metaKey||event.altKey||['INPUT','TEXTAREA','SELECT'].includes(event.target.tagName)||event.target.isContentEditable)return;
  if(event.key==='ArrowRight'&&current<scenes.length-1){event.preventDefault();if(current===DESK)byId('approve').click();else show(current+1,true);}
  if(event.key==='ArrowLeft'){event.preventDefault();if(current>0)show(current-1,true);else location.assign('stats.html');}
});
window.addEventListener('hashchange',followHash);
followHash();
