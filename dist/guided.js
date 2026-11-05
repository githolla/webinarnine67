'use strict';
const DESK = 4;
const DONE = 5;
const scenes = [
  {kicker:'The company in this story · Fictional',title:'Meet Halvane Robotics.',lead:'Halvane builds R7 autonomous pallet robots for factories and −20°F freezer warehouses. Every new fleet goes live with a certified field engineer on site.',next:'See the two plans →',time:'1:04:30–1:05:15',say:'“Meet Halvane Robotics. They build autonomous pallet robots for factories and freezer warehouses. Every new fleet goes live with a certified field engineer on site, and they only have a few. Two big customers: Leah manages Frostline Foods, Marcus manages Meridian Axle. Maya runs the field engineers on the dispatch board. And they rolled out AI: Leah plans in ChatGPT, Marcus in Copilot. Monday, 9:02, Marcus asks Maya one simple question: can Alex be on site in Tennessee?”',point:'Point left to right: the two customers, then field engineering, then Alex. Then the message, then “How this gets answered today”. Suuchi asks: “Who answers this in your company, and how long does it take?”'},
  {kicker:'Halvane Robotics · Two customer go-lives · November 9–13',title:'Two install plans. Both written with AI.',lead:'Your AI rollout worked. Leah and Marcus each wrote a solid go-live plan in minutes.',next:'Check Alex’s week →',time:'1:05:15–1:06:00',say:'“This is the company that did everything right. Leah used ChatGPT, Marcus used Copilot. Two good install plans in minutes. You’re the COO. Would you confirm both?”',point:'Wait for the “Same person” badge to pop between the two red Alex boxes. Then: “One engineer. Ohio and Tennessee. Same week.” Pause before advancing.'},
  {kicker:'Halvane Robotics · Alex’s week · November 9–13',title:'Alex is due in Ohio and Tennessee. The same week.',lead:'Each AI did its job. Nobody’s job was to check across them.',next:'What happens next →',time:'1:06:00–1:07:00',say:'“Frostline fills Alex’s week. Meridian goes straight past the line. And no system flags it, because both bookings live in AI-written documents. The dispatch board hasn’t seen either one.”',point:'Wait for the Double-booked stamp to land. Then point at the three boxes along the bottom, ending on the dispatch board.'},
  {kicker:'If nobody checks across teams',title:'Nobody finds out until go-live week.',lead:'Both plans get confirmed on Monday. Here is how go-live week goes.',next:'Rewind to Monday →',time:'1:07:00–1:08:15',say:'“Monday, Marcus confirms. A week later Alex asks: Ohio or Tennessee? Tuesday, Leah won’t give Alex up, Frostline’s holiday peak starts Monday. Wednesday night, the plant director says they retrained 30 operators for Friday and can’t move it. 24 robots sit in crates on the dock. Every AI did its job. The company still broke a promise.”',point:'Read the four messages as they appear. The clock counts down to go-live and turns red. Pause on the last one. Suuchi: “How many of these are in flight in your company right now?”'},
  {kicker:'Rewind · Same request · Go-Live Desk',title:'Same Monday. Caught by 9:04 AM.',lead:'',next:'Approve as COO →',time:'1:08:15–1:10:00',say:'“Same Monday, two minutes after Marcus asked. The desk read both plans, checked the dispatch board, and found Jamie: certified, read the site survey, free that week. Maya confirmed. Now I have one decision, and I can see exactly what approving will do. Nothing changes until a person approves.”',point:'Let the rewind play before speaking, then let the work log finish. Point to “Approving will”. Click Approve as COO inside the card, or press →. Use Change one fact only in Q&A.'},
  {kicker:'Go-Live Desk · After one approval',title:'Request completed. One approval.',lead:'Both go-lives stay on schedule. Alex keeps Frostline, Jamie takes Meridian.',next:'Find your handoffs →',time:'1:10:00–1:11:00',say:'“Five minutes after Marcus asked, it is done: install plan updated, Jamie booked, both account managers told, Marcus answered, and a full audit trail. No escalation, no robots sitting in crates. Swap field engineer for whatever is scarce in your business: a line, a crew, a test cell, a truck.”',point:'Point to the two bars, then the before and after. Say the dispatch board write is simulated here and uses the field service system’s API in a real build.'},
  {kicker:'Complimentary workflow assessment',title:'Find your manual handoffs.',lead:'Bring one workflow. We will map it the way we just mapped Marcus’s request.',next:'Back to the start ↺',time:'1:16:00 and 1:27:30',say:'“What you typed in chat is step one of the assessment. Type ‘assessment’ and your workflow, or use the link if you’d rather keep it private.”',point:'Leave this screen up through Q&A and the close.'}
];
const monday = {d:'Mon, Nov 2',t:'9:02 AM',n:'Meridian go-live in 11 days'};
const clocks = [
  [monday],[monday],[monday],
  [{d:'Mon, Nov 2',t:'10:15 AM',n:'Go-live in 11 days'},{at:1800,d:'Mon, Nov 9',t:'6:40 AM',n:'Go-live in 4 days',tone:'warn'},{at:3300,d:'Tue, Nov 10',t:'9:05 AM',n:'Go-live in 3 days',tone:'warn'},{at:4800,d:'Wed, Nov 11',t:'5:52 PM',n:'Go-live in 2 days',tone:'fire'}],
  [{...monday,tone:'calm'},{at:2000,d:'Mon, Nov 2',t:'9:03 AM',n:'Checking the schedule',tone:'calm'},{at:3600,d:'Mon, Nov 2',t:'9:04 AM',n:'Caught 11 days early',tone:'calm'}],
  [{d:'Mon, Nov 2',t:'9:07 AM',n:'Both go-lives on track',tone:'calm'}],
  null
];
const rewindDays = ['Wed, Nov 11','Tue, Nov 10','Mon, Nov 9','Sun, Nov 8','Sat, Nov 7','Fri, Nov 6','Thu, Nov 5','Wed, Nov 4','Tue, Nov 3','Mon, Nov 2'];
const leads = {
  ready:'The desk read both plans, found a certified replacement, and Maya confirmed. You approve.',
  unknown:'The desk found a certified replacement. Maya has not confirmed availability yet, so it holds.',
  booked:'The desk’s first choice is committed elsewhere. Maya must find someone else or move a date.'
};
const deskCopy = {
  ready:{headline:'Send Jamie to Tennessee.',proof:'Confirmed by Maya · free Nov 9–13',source:'Dispatch export · Confirmed by Maya · No live sync',bench:'Jamie: R7 certified ✓ · read the Meridian site survey ✓ · free Nov 9–13 ✓',confirm:'Maya confirmed Jamie · 9:04 AM',note:'Field service manager checked the current schedule.',hold:''},
  unknown:{headline:'Hold: confirm Jamie first.',proof:'Not confirmed yet',source:'Dispatch export · Not yet confirmed · No live sync',bench:'Jamie: R7 certified ✓ · read the Meridian site survey ✓ · availability unconfirmed',confirm:'Waiting on Maya',note:'An empty calendar alone does not prove availability.',hold:'Held for Maya. Approval opens once Jamie’s availability is confirmed.'},
  booked:{headline:'Hold: Jamie is committed elsewhere.',proof:'Booked at another site',source:'Dispatch export · Jamie fully booked · No live sync',bench:'Jamie: booked at another site. Searching for another certified engineer.',confirm:'Maya notified · decision needed',note:'Find another certified engineer or move a go-live date.',hold:'Held. Jamie is already committed. Maya must find another certified engineer or change a go-live date.'}
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
