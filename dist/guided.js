'use strict';
const DESK = 4;
const DONE = 5;
const scenes = [
  {kicker:'The company in this story · Fictional',title:'Meet Keystone Workwear.',lead:'Keystone prints uniforms for national service companies. Order 4821 is approved and ships Friday.',next:'See who used AI →',time:'1:04:30–1:05:15',say:'“Meet Keystone Workwear. They print uniforms for national service companies. Order 4821, 5,000 crew shirts, was approved back in October and ships Friday. Monday, 8:41, Ridgeline emails: we approved a new logo, use it on all 5,000 shirts, are we still good for Friday? Leah, the account manager, clicks Draft with Copilot: got it, we’ll use the new logo. Look at both logos. Remember the new one.”',point:'Walk the five cards left to right: who does what on order 4821. Then the email, Leah’s reply, and the two shirts: proof v1 approved Oct 14, and the new logo that only lives in the email. Pause on the new logo. Suuchi asks: “When a customer changes an order in your company, where does that change actually land?”'},
  {kicker:'Keystone Workwear · Order 4821 · Monday morning',title:'AI in every department. Each one did its job.',lead:'Your AI rollout worked. Sales, design and production each used AI on the same order.',next:'Go to the press →',time:'1:05:15–1:06:00',say:'“This is the company that did everything right. Leah used Copilot to answer the customer. Dana used an AI tool to vectorize the new logo. Sam asked an AI assistant to resequence the week and protect Friday. Three good AI outputs. Now read the bottom line of each card.”',point:'Point to the three green checks first: every AI finished in minutes. Then read the red line on each card, left to right. Then the callout: nobody changed the order. Pause.'},
  {kicker:'Keystone Workwear · Press 3 · Monday 12:58 PM',title:'Knowing what this operator knows, would you hit Start?',lead:'The first print matches the ticket. Art approved, screens burned. The new logo is somewhere else.',next:'What happens next →',time:'1:06:00–1:07:00',say:'“This is Theo’s job ticket at 12:58. He pulls the first print and holds it against the ticket. Logo matches, placement matches, ink matches. Proof approved, screens burned. Knowing what this operator knows, would you hit Start? Of course you would. Every control worked. They all checked version one. The new logo is in Leah’s email and on the art drive. Just not on the job.”',point:'Ask the question and wait three seconds before the Old logo stamp lands. Then point to the three boxes on the right, ending on the shop system.'},
  {kicker:'If nobody connects the change',title:'Nobody finds out until the shirts arrive.',lead:'Theo signs the press check at 1:00 PM. Here is how the week goes.',next:'Rewind to Monday →',time:'1:07:00–1:08:15',say:'“1:00 PM, the press starts. About 2,000 by end of shift, second shift finishes overnight. All 5,000 boxed, ahead of schedule. Friday morning, a branch in Denver opens the box: these have our old logo. Friday afternoon, Rachel writes: we relaunch at 40 branches Monday. You confirmed the change. Keystone eats it. Leah confirmed the new logo in writing.”',point:'Read the four messages as they appear. The clock jumps from Monday to Friday and turns red. Pause on “You confirmed the change.” Suuchi: “How many of these are in flight in your company right now?”'},
  {kicker:'Rewind · Same email · Order Desk',title:'Same email. Fixed before the press starts.',lead:'',next:'Release with proof v2 →',time:'1:08:15–1:10:00',say:'“Back to Monday, 8:44. Same email. This is the rule your shop already has: a change means a new proof. The agent makes sure the email reaches the job. It matches the email to order 4821 and shows Leah the one fact that matters: 5,000 shirts print the old logo at 1:00 today. Leah approves a hold in Teams. Dana sends proof v2 to Rachel. Rachel approves at 10:12, the screen room burns new screens, and Sam releases. Nothing prints until a person approves.”',point:'Let the rewind play, then let the log finish. Point to the two shirts and the red line: 5,000 shirts at 1:00 today. Click Release with proof v2, or press →. Use Change one fact only in Q&A.'},
  {kicker:'Order Desk · Monday 10:15 AM',title:'The right shirt. Still on time.',lead:'New screens, same press, Friday holds. Leah promised only what the order could do.',next:'Find your handoffs →',time:'1:10:00–1:11:00',say:'“Back to Theo’s ticket. Watch the logo change. Proof v2, new screens, same press, Friday holds. And look at Leah’s reply: held, proof attached, approve by noon and we still ship Friday. Same people, same AI, same software. The change finally reached the job. The customer asked us to change what went on the shirt. We used AI to answer the email, prep the artwork, and schedule the press. Who changed what went on the shirt?”',point:'Let the old shirt fade into the new one. Then the checklist, ending on Leah’s confirmation. Say the shop-system update is simulated here. In a real build the agent writes it where the shop system’s API allows, such as Printavo, and hands it to a person where it doesn’t. Land the closing question and pause.'},
  {kicker:'Complimentary workflow assessment',title:'Find your manual handoffs.',lead:'Bring one workflow. We will map it the way we just mapped order 4821.',next:'Back to the start ↺',time:'1:16:00 and 1:27:30',say:'“What you typed in chat is step one of the assessment. Type ‘assessment’ and your workflow, or use the link if you’d rather keep it private.”',point:'Leave this screen up through Q&A and the close.'}
];
const clocks = [
  [{d:'Mon, Nov 2',t:'8:47 AM',n:'Shirts ship Friday'}],
  [{d:'Mon, Nov 2',t:'11:30 AM',n:'Press moved up to 1:00 PM'}],
  [{d:'Mon, Nov 2',t:'12:58 PM',n:'Press starts in 2 minutes',tone:'warn'}],
  [{d:'Mon, Nov 2',t:'1:00 PM',n:'Press running',tone:'warn'},{at:1800,d:'Tue, Nov 3',t:'6:10 AM',n:'5,000 shirts printed',tone:'warn'},{at:3300,d:'Fri, Nov 6',t:'9:10 AM',n:'Rollout in 3 days',tone:'fire'},{at:4800,d:'Fri, Nov 6',t:'2:45 PM',n:'Rollout in 3 days',tone:'fire'}],
  [{d:'Mon, Nov 2',t:'8:44 AM',n:'Press starts at 1:00 PM',tone:'calm'},{at:2000,d:'Mon, Nov 2',t:'8:47 AM',n:'WO 4821 on hold',tone:'calm'},{at:3600,d:'Mon, Nov 2',t:'10:12 AM',n:'Proof v2 approved',tone:'calm'}],
  [{d:'Mon, Nov 2',t:'10:15 AM',n:'Press 3 at 3:00 PM · ships Friday',tone:'calm'}],
  null
];
const rewindDays = ['Fri, Nov 6','Thu, Nov 5','Wed, Nov 4','Tue, Nov 3','Mon, Nov 2'];
const rewindTo = 'Mon, Nov 2 · 8:44 AM';
const leads = {
  ready:'The desk matched the email to the order, Leah held the job, and Rachel approved proof v2. Production releases.',
  unknown:'The job is on hold. Rachel has not approved proof v2 yet, so nothing prints.',
  booked:'The new file fails the print check. Leah needs a better file from the customer before anything prints.'
};
const deskCopy = {
  ready:{headline:'Release with proof v2.',proof:'Approved by Rachel · 10:12 AM',source:'No live sync',bench:'Logo v2: vector ✓ · 2 colors ✓ · proof v2 on WO 4821',confirm:'Rachel approved proof v2 · 10:12 AM',note:'Screen room: new screens ordered from v2.',hold:''},
  unknown:{headline:'Hold: waiting on Rachel.',proof:'Sent 8:58 · not approved yet',source:'Proof pending',bench:'Logo v2: vector ✓ · 2 colors ✓ · proof v2 on WO 4821',confirm:'Waiting on Rachel',note:'“Use the new logo” in an email is not an approved proof.',hold:'Held. WO 4821 stays off Press 3 until Rachel approves proof v2.'},
  booked:{headline:'Hold: the new file can’t print.',proof:'Not sent · file failed',source:'File rejected',bench:'Logo v2: low-resolution image, prints blurry. Needs a vector file.',confirm:'Design flagged the file · customer file needed',note:'Ask Ridgeline for a vector file, or agree a new ship date.',hold:'Held. The new file fails the print check. Leah asks Ridgeline for a vector file before anything prints or anyone confirms Friday.'}
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
