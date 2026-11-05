'use strict';
const scenes = [
  {title:'Can both clients launch on Friday?',lead:'Forma Digital builds customer apps. Two project managers have prepared next week’s launch plans with AI.',next:'Compare the two plans →',time:'0:00–0:45',say:'“Two client apps. Two Friday launches. Two managers used AI to prepare the work. You’re the COO. Would you confirm both dates?”',point:'Point to Alex and 40 hours on each plan. Pause, then compare the plans.'},
  {title:'Alex has 80 hours promised. And a 40-hour week.',lead:'ChatGPT helped Leah. Copilot helped Marcus. Someone still had to notice that both plans depend on the same person.',next:'Show the shared staffing check →',time:'0:45–1:30',say:'“Every day next week, Alex is expected on both projects. What happens on Monday if nobody catches that? Who would do the chasing in your company?”',point:'Trace one day down the two rows. The amber total is the 40 hours the business cannot deliver with Alex alone.'},
  {title:'Catch the collision before the promises go out.',lead:'Nine-67 could build a Launch Desk around the plans, people and capacity you already have. Maya has verified a qualified replacement.',next:'Approve Jamie for Rally',time:'1:30–2:30',say:'“AI reads the plans. The application checks the shared capacity. Maya confirms Jamie is qualified and free. Now I have one staffing decision to make.”',point:'Point to Jamie’s verified availability. Approve once. Use the optional scenarios only during Q&A.'},
  {title:'Two launch plans. Two available specialists.',lead:'Alex keeps Luma. Jamie takes Rally. Both managers can work from one approved allocation.',next:'Replay the case',time:'2:30–3:15',say:'“We caught the collision before Monday, prepared a workable change and gave every owner the next action. The team still owns launch readiness.”',point:'Show the corrected calendar. Explain that Maya’s Kantata update is queued because this example uses an export. Then ask which commitments their teams still reconcile by hand.'}
];
const byId = id => document.getElementById(id);
const panels = Array.from(document.querySelectorAll('.scene'));
const steps = Array.from(document.querySelectorAll('.steps li'));
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

function render() {
  const s=scenes[current];
  document.body.dataset.step=String(current);
  panels.forEach((panel,i)=>{panel.hidden=i!==current;});
  steps.forEach((step,i)=>{if(i===current)step.setAttribute('aria-current','step');else step.removeAttribute('aria-current');});
  byId('title').textContent=s.title; byId('lead').textContent=s.lead;
  byId('next').textContent=s.next; byId('next').disabled=current===2 && availability!=='ready';
  byId('back').disabled=current===0; byId('counter').textContent=(current+1)+' of 4';
  byId('cuebox').hidden=!rehearsal; byId('mode').textContent=rehearsal?'Start live':'Rehearse';
  byId('time').textContent=s.time; byId('say').textContent=s.say; byId('point').textContent=s.point;
  byId('availability').value=availability;
  byId('hold').hidden=availability==='ready';
  byId('hold').textContent=availability==='unknown'?'Hold for Maya. Confirm Jamie’s current availability before making the change.':'Hold the proposal. Jamie is already committed. Maya must find another qualified person or change a launch date.';
  byId('availability-proof').textContent=availability==='ready'?'Maya confirmed 40 free hours in the current planning snapshot.':availability==='unknown'?'Availability has not been confirmed.':'Jamie has 0 free hours in this scenario.';
}
function show(index,navigate=false) {
  if(index<0 || index>=scenes.length)return;
  if(index===3 && availability!=='ready')return;
  current=index;
  if(current!==2){availability='ready';byId('qa-controls').open=false;}
  render();
  if(navigate){history.replaceState(null,'','#slide-'+(index+1));byId('title').focus({preventScroll:true});window.scrollTo(0,0);byId('announcement').textContent=scenes[index].title;}
}
function followHash(){const m=location.hash.match(/^#slide-([1-5])$/);const i=m?Math.min(3,Number(m[1])-1):0;show(i);if(new URLSearchParams(location.search).has('qa')&&i===2)byId('qa-controls').open=true;}
byId('next').addEventListener('click',()=>{if(!byId('next').disabled)show((current+1)%scenes.length,true);});
byId('back').addEventListener('click',()=>show(current-1,true));
byId('mode').addEventListener('click',()=>{rehearsal=!rehearsal;if(!rehearsal)show(0,true);else render();});
byId('availability').addEventListener('change',()=>{availability=byId('availability').value;render();});
document.addEventListener('keydown',event=>{
  if(event.repeat||event.ctrlKey||event.metaKey||event.altKey||['INPUT','TEXTAREA','SELECT','BUTTON','A'].includes(event.target.tagName)||event.target.isContentEditable)return;
  if(event.key==='ArrowRight'&&current<3){event.preventDefault();show(current+1,true);}
  if(event.key==='ArrowLeft'&&current>0){event.preventDefault();show(current-1,true);}
});
window.addEventListener('hashchange',followHash);
followHash();
