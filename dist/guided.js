'use strict';
const DESK = 4;
const DONE = 5;
const scenes = [
  {kicker:'Forma Digital · A client app agency',title:'A request comes in.',lead:'Forma Digital builds customer apps. Marcus needs one answer before he can confirm a client launch.',next:'See the two plans →',time:'1:04:30–1:05:15',say:'“Monday, 9:02. Marcus asks one simple question: can Alex do the Rally launch? Your team answers messages like this by hand every week.”',point:'Point to the message, then the desk card. Suuchi asks: “Who answers this in your company, and how long does it take?”'},
  {kicker:'Forma Digital · Two client launches · November 9–13',title:'Two plans. Both written with AI.',lead:'Your AI rollout worked. Leah and Marcus each wrote a solid launch plan in minutes.',next:'Check Alex’s week →',time:'1:05:15–1:06:00',say:'“This is the company that did everything right. Leah used ChatGPT, Marcus used Copilot. Two good plans in minutes. You’re the COO. Would you confirm both?”',point:'Wait for the “Same person” badge to pop between the two red Alex boxes. Pause before advancing.'},
  {kicker:'Forma Digital · Alex’s week · November 9–13',title:'Alex has 80 hours promised. And a 40-hour week.',lead:'Each AI did its job. Nobody’s job was to check across them.',next:'What happens next →',time:'1:06:00–1:07:00',say:'“Luma fills Alex’s week. Rally goes straight past the line. And no system flags it, because both bookings live in AI-written documents. Kantata hasn’t seen either one.”',point:'Wait for the Double-booked stamp to land. Then point at the three boxes along the bottom, ending on Kantata.'},
  {kicker:'If nobody checks across teams',title:'Nobody finds out until launch week.',lead:'Both plans get confirmed on Monday. Here is how launch week goes.',next:'Rewind to Monday →',time:'1:07:00–1:08:15',say:'“Monday, Marcus confirms. A week later Alex asks which launch to work on. Tuesday, Leah won’t give him up. Wednesday night, the client says they announced Friday to 40,000 members and can’t move it. Every AI did its job. The company still broke a promise.”',point:'Read the four messages as they appear. The clock counts down to launch and turns red. Pause on the last one. Suuchi: “How many of these are in flight in your company right now?”'},
  {kicker:'Rewind · Same request · Launch Desk',title:'Same Monday. Caught by 9:04 AM.',lead:'',next:'Approve as COO →',time:'1:08:15–1:10:00',say:'“Same Monday, two minutes after Marcus asked. The desk read both plans, checked capacity, and found Jamie. Maya confirmed. Now I have one decision, and I can see exactly what approving will do. Nothing changes until a person approves.”',point:'Let the rewind play before speaking, then let the work log finish. Point to “Approving will”. Click Approve as COO inside the card, or press →. Use Change one fact only in Q&A.'},
  {kicker:'Launch Desk · After one approval',title:'Request completed. One approval.',lead:'Both launches stay on schedule. Alex keeps Luma, Jamie takes Rally.',next:'Find your handoffs →',time:'1:10:00–1:11:00',say:'“Five minutes after Marcus asked, it is done: plan updated, allocation recorded, both managers told, Marcus answered, and a full audit trail. No escalation, no slipped launch. Swap launch specialist for whatever is scarce in your business.”',point:'Point to the two bars, then the before and after. Say the Kantata write is simulated here and uses its API in a real build.'},
  {kicker:'Complimentary workflow assessment',title:'Find your manual handoffs.',lead:'Bring one workflow. We will map it the way we just mapped Marcus’s request.',next:'Back to the start ↺',time:'1:16:00 and 1:27:30',say:'“What you typed in chat is step one of the assessment. Type ‘assessment’ and your workflow, or use the link if you’d rather keep it private.”',point:'Leave this screen up through Q&A and the close.'}
];
const monday = {d:'Mon, Nov 2',t:'9:02 AM',n:'Rally launch in 11 days'};
const clocks = [
  [monday],[monday],[monday],
  [{d:'Mon, Nov 2',t:'10:15 AM',n:'Launch in 11 days'},{at:1800,d:'Mon, Nov 9',t:'8:40 AM',n:'Launch in 4 days',tone:'warn'},{at:3300,d:'Tue, Nov 10',t:'9:05 AM',n:'Launch in 3 days',tone:'warn'},{at:4800,d:'Wed, Nov 11',t:'5:52 PM',n:'Launch in 2 days',tone:'fire'}],
  [{...monday,tone:'calm'},{at:2000,d:'Mon, Nov 2',t:'9:03 AM',n:'Checking capacity',tone:'calm'},{at:3600,d:'Mon, Nov 2',t:'9:04 AM',n:'Caught 11 days early',tone:'calm'}],
  [{d:'Mon, Nov 2',t:'9:07 AM',n:'Both launches on track',tone:'calm'}],
  null
];
const rewindDays = ['Wed, Nov 11','Tue, Nov 10','Mon, Nov 9','Sun, Nov 8','Sat, Nov 7','Fri, Nov 6','Thu, Nov 5','Wed, Nov 4','Tue, Nov 3','Mon, Nov 2'];
const leads = {
  ready:'The desk read both plans, found a qualified replacement, and Maya confirmed. You approve.',
  unknown:'The desk found a qualified replacement. Maya has not confirmed availability yet, so it holds.',
  booked:'The desk’s first choice is committed elsewhere. Maya must find someone else or move a date.'
};
const deskCopy = {
  ready:{headline:'Give Jamie the second launch.',proof:'Confirmed by Maya · 40 free hours',source:'Kantata export · Confirmed by Maya · No live sync',bench:'Jamie: launch skill ✓ · reviewed the Rally brief ✓ · 40h free ✓',confirm:'Maya confirmed Jamie · 9:04 AM',note:'Resource manager checked the current snapshot.',hold:''},
  unknown:{headline:'Hold: confirm Jamie first.',proof:'Not confirmed yet',source:'Kantata export · Not yet confirmed · No live sync',bench:'Jamie: launch skill ✓ · reviewed the Rally brief ✓ · hours unconfirmed',confirm:'Waiting on Maya',note:'A blank calendar alone does not prove availability.',hold:'Held for Maya. Approval opens once Jamie’s availability is confirmed.'},
  booked:{headline:'Hold: Jamie is committed elsewhere.',proof:'0 free hours',source:'Kantata export · Jamie fully booked · No live sync',bench:'Jamie: 0h free. Searching for another qualified person.',confirm:'Maya notified · decision needed',note:'Find another qualified person or move a launch date.',hold:'Held. Jamie is already committed. Maya must find another qualified person or change a launch date.'}
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
  rewindDays.forEach((day,i)=>later(i*110,()=>{byId('rewind-day').textContent=day;}));
  later(1150,()=>{byId('rewind-day').textContent='Mon, Nov 2 · 9:02 AM';});
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
