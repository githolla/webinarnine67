'use strict';
const DESK = 3;
const DONE = 4;
const scenes = [
  {kicker:'Forma Digital · Monday, November 2 · 9:02 AM',title:'A request comes in.',lead:'Forma Digital builds customer apps. Marcus needs one answer before he can confirm a client launch.',next:'See what the desk finds →',time:'1:04:30–1:05:30',say:'“Monday, 9:02. Marcus asks one simple question: can Alex do the Rally launch? This is the kind of message your team answers by hand every week.”',point:'Point to the message, then the desk card. Suuchi asks: “Who answers this in your company?”'},
  {kicker:'Forma Digital · Two client launches · November 9–13',title:'Two plans. Both written with AI.',lead:'Leah planned Luma Hotels with ChatGPT. Marcus planned Rally Fitness with Copilot. Each plan looks fine on its own.',next:'Check Alex’s week →',time:'1:05:30–1:06:30',say:'“Two good AI outputs. Leah used ChatGPT, Marcus used Copilot. You’re the COO. Would you confirm both launch dates?”',point:'Point to Alex and 40 hours on each plan. Pause, then advance.'},
  {kicker:'Forma Digital · Alex’s week · November 9–13',title:'Alex has 80 hours promised. And a 40-hour week.',lead:'ChatGPT helped Leah. Copilot helped Marcus. Nobody checked across the two teams.',next:'Show what the desk did →',time:'1:06:30–1:07:45',say:'“Every day next week, Alex is expected on both projects. Without a shared check, Maya has four handoffs to chase. Who discovers this in your company, and when?”',point:'Trace one day down the two rows, then read the four handoffs left to right. Suuchi asks the question.'},
  {kicker:'Launch Desk · Monday, November 2 · 9:04 AM',title:'The desk catches the collision before the promises go out.',lead:'',next:'Approve as COO →',time:'1:07:45–1:09:30',say:'“The desk read both plans, checked capacity, and found Jamie. Maya confirmed. Now I have one decision, and I can see exactly what approving will do. Nothing is written until a person approves.”',point:'Let the work log finish. Point to “Approving will”. Click Approve as COO inside the card. Use Change one fact only in Q&A.'},
  {kicker:'Launch Desk · Monday, November 2 · 9:07 AM',title:'Request completed. One approval.',lead:'Alex keeps Luma. Jamie takes Rally. Every team works from the same approved plan.',next:'Find your handoffs →',time:'1:09:30–1:11:00',say:'“Five minutes after Marcus asked, the request is done: plan updated, allocation recorded, both managers told, Marcus answered, and a full audit trail. Four handoffs became one approval.”',point:'Point to the reply to Marcus, then the before and after strip. Say the Kantata write is simulated here and uses its API in a real build.'},
  {kicker:'Complimentary workflow assessment',title:'Find your manual handoffs.',lead:'Bring one workflow. We will map it the way we just mapped Marcus’s request.',next:'Back to the start ↺',time:'1:16:00 and 1:27:30',say:'“What you typed in chat is step one of the assessment. Type ‘assessment’ and your workflow, or use the link if you’d rather keep it private.”',point:'Leave this screen up through Q&A and the close.'}
];
const leads = {
  ready:'The desk read both plans, checked capacity and found a qualified replacement. Maya confirmed. You approve.',
  unknown:'The desk found a qualified replacement. Maya has not confirmed availability yet, so the desk holds.',
  booked:'The desk’s first choice is committed elsewhere. Maya must find another qualified person or change a launch date.'
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

function fillWeek(id, labels) {
  const week = byId(id);
  const blank = document.createElement('span');
  blank.className = 'weekday';
  blank.textContent = 'Nov 9–13';
  week.append(blank);
  const days = ['Mon','Tue','Wed','Thu','Fri'];
  for (const day of days) {
    const cell = document.createElement('span');
    cell.className = 'weekday'; cell.textContent = day; week.append(cell);
  }
  labels.forEach((label, row) => {
    const name = document.createElement('strong'); name.className='row-label'; name.textContent=label; week.append(name);
    for (const day of days) {
      const cell = document.createElement('div'); cell.className='slot ' + (row === 0 ? 'hotel' : 'fitness'); cell.dataset.day=day;
      cell.textContent='8h'; cell.setAttribute('aria-label', label + ', ' + day + ', eight hours'); week.append(cell);
    }
  });
}
fillWeek('conflict-week',['Alex · Luma','Alex · Rally']);
fillWeek('resolved-week',['Alex · Luma','Jamie · Rally']);

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
function show(index,navigate=false) {
  if(index<0 || index>=scenes.length)return;
  if(index===DONE && current===DESK && availability!=='ready')return;
  current=index;
  if(current!==DESK){availability='ready';byId('qa-controls').open=false;}
  render();
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
