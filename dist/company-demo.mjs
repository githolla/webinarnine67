import { initialState, transition, people } from './company-model.mjs';
import { renderStack, renderCrowd, scenes, cues, renderScene, renderDetail, primaryAction, rosterStrip, tourPeople, discoveryPeople, viewCopy } from './company-view.mjs';
import { renderBuildMap, renderWatch, renderPlan, fixCopy, fixCues, WATCH_LAST } from './company-fix.mjs';
import { mapHeading } from './company-map.mjs';
import { tourStops, enterTourStop, firstStopForScene } from './company-tour.mjs';
import { workspaceHeading } from './company-workspaces.mjs';
let guided=true;let tourIndex=0;let mapReturn=null;let fixStep=0;
let state=initialState();let detailKey='';let detailTrigger;let playback=[];let idleTimer;
const $=id=>document.getElementById(id);const dialog=$('detail-dialog');
const acts=['Belief','Evidence','The people','The fix','Connected'];
const actStarts=[0,1,3,9,11];
const actOf=i=>i===0?0:i<3?1:i<9?2:i<11?3:4;
const sceneAct=[0,1,2,2,2,2,3,3,4];
const nextNames={0:'The research',1:'Parkside’s AI stack',2:'All 150 people',3:'Nine of them',8:'What we build',9:'Watch it happen',10:'The connected company',11:'How we build it'};
const tourView=()=>guided&&!state.workspace?tourStops[tourIndex]?.view:undefined;const onStack=()=>tourView()==='stack';
const tourWorkspaces=tourStops.filter(stop=>stop.workspace).map(stop=>stop.workspace);
const buildOrder=['priya','elena','nina'];
const buildPeople={priya:['priya'],elena:['elena','nina'],nina:['nina','marcus','leah']};
const discoveryOrder=['reuse','needs','handoff'];
const discoveryTitles={reuse:'Someone already solved work another team still does manually.',needs:'The same license hides very different needs.',handoff:'A department has findings other teams never receive.'};
function fit(){const s=Math.min(innerWidth/1920,innerHeight/1080);const root=document.documentElement.style;root.setProperty('--s',String(s));root.setProperty('--dx',`${(innerWidth-1920*s)/2}px`);root.setProperty('--dy',`${(innerHeight-1080*s)/2}px`);}
function canvasMatches(text){
 const parts=text.split(',');
 return parts.some(part=>{const rest=part.replace(/\((min|max)-(width|height)\s*:\s*\d+px\)/g,'').replace(/\b(and|screen|all|only)\b/g,'').trim();if(rest)return null;
  return [...part.matchAll(/\((min|max)-(width|height)\s*:\s*(\d+)px\)/g)].every(([,bound,axis,value])=>{const size=axis==='width'?1920:1080;return bound==='min'?size>=Number(value):size<=Number(value);});});
}
function pinViewportQueries(){
 for(const sheet of document.styleSheets){
  if(!sheet.href||/stage-[a-z]+\.css/.test(sheet.href))continue;let rules;try{rules=sheet.cssRules;}catch{continue;}
  for(let i=rules.length-1;i>=0;i--){const rule=rules[i];if(!(rule instanceof CSSMediaRule))continue;const text=rule.conditionText||rule.media.mediaText;
   if(!/(min|max)-(width|height)/.test(text)||/prefers|print|hover|orientation|resolution/.test(text))continue;
   const inner=[...rule.cssRules].map(r=>r.cssText);sheet.deleteRule(i);
   if(canvasMatches(text))inner.reverse().forEach(css=>{try{sheet.insertRule(css,i);}catch{}});}
 }
}
function setupShell(){
 const mast=document.querySelector('.mast');const app=$('company-app');
 const deck=document.createElement('div');deck.className='deck';document.body.prepend(deck);deck.append(mast,app);
 const about=mast.querySelector('[data-detail="about"]');about.textContent='Fictional company · Illustrative';about.classList.add('sh-about');
 const nav=document.createElement('nav');nav.className='acts';nav.setAttribute('aria-label','Webinar progress');
 nav.innerHTML=`<ol>${acts.map((name,i)=>`<li><button data-act="${i}">${name}</button></li>`).join('')}</ol><div class="acts-ticks" aria-hidden="true">${tourStops.map((_,i)=>`<i data-tick="${i}"></i>`).join('')}</div>`;
 about.before(nav);
 const eyebrow=document.createElement('p');eyebrow.id='eyebrow';eyebrow.className='sh-eyebrow';$('title').before(eyebrow);
 const roster=document.createElement('div');roster.id='roster';$('stage').before(roster);
 const hint=document.createElement('span');hint.id='hint';hint.textContent='→ chooses recommended';
 const note=document.createElement('span');note.id='disclaimer';note.textContent='Interactive simulation · Illustrative records';
 $('next').before(hint,note);
 pinViewportQueries();fit();addEventListener('resize',fit);
}
function stopPlayback(){playback.forEach(clearTimeout);playback=[];}
function footerPrimary(){return document.querySelector('#stage [data-step-forward], #stage .build-footer .build-primary');}
function recommendedChoice(){if(document.querySelector('#stage .build-complete'))return null;return document.querySelector('#stage [data-recommended]:not(:disabled), #stage .build-choices [data-build-action="finance-exclude"].build-secondary, #stage .build-choices [data-build-action="tracker-owner-nina"].build-secondary');}
function nextName(index){const fixed=nextNames[index];if(fixed)return fixed;const stop=tourStops[index+1];const p=stop?.workspace&&people.find(x=>x.id===stop.workspace);return p?p.name:stop?.label||'';}
function tourAction(){
 if(!guided)return primaryAction(state);
 if(state.scene===7&&!state.workspace){
  if(footerPrimary())return {label:'Next step →',action:'build-forward'};
  if(recommendedChoice())return {label:'Next step →',action:'build-choose'};
 }
 if(tourIndex===tourStops.length-1)return {label:'Book a discovery session →',action:'discovery'};
 return {label:`Next: ${nextName(tourIndex)} →`,action:'tour-next'};
}
function goTour(index){
 stopPlayback();fixStep=0;tourIndex=Math.max(0,Math.min(tourStops.length-1,index));
 state=enterTourStop(state,tourIndex);render(true);
}
function heading(){
 const view=tourView();
 if(fixCopy[view])return fixCopy[view];
 if(view==='crowd'||view==='stack'){const {eyebrow,title,lead}=viewCopy[view];return {eyebrow,title,lead};}
 if(state.scene===2&&state.networkMode==='connected')return {eyebrow:guided?'The fix · 3 of 3':'',...mapHeading(state)};
 if(state.workspace)return {eyebrow:guided&&tourWorkspaces.includes(state.workspace)?`Meet the people · ${tourWorkspaces.indexOf(state.workspace)+1} of ${tourWorkspaces.length}`:`The nine · Person ${tourPeople.indexOf(state.workspace)+1} of 9`,title:workspaceHeading(state),lead:''};
 if(state.scene===2)return {eyebrow:'',title:scenes[2].title,lead:guided?'Nine of the 150, with the AI each one uses. We’ll sit beside the four outlined.':scenes[2].lead};
 if(state.scene===6){const id=discoveryOrder.includes(state.discovery)?state.discovery:'reuse';return {eyebrow:`What discovery finds · ${discoveryOrder.indexOf(id)+1} of 3`,title:discoveryTitles[id],lead:''};}
 if(state.scene===7){const lifted=$('stage').querySelector('[data-stage-title], .build-heading h2');if(lifted)lifted.classList.add('sh-lifted');return {eyebrow:guided?'The fix':`Discover & build · Build ${Math.max(0,buildOrder.indexOf(state.improvement))+1} of 3`,title:lifted?.textContent||scenes[7].title,lead:''};}
 return {eyebrow:'',title:scenes[state.scene].title,lead:scenes[state.scene].lead};
}
function markTourFocus(){
 const stage=$('stage');
 stage.querySelectorAll('.org-graph.is-today .pg-card').forEach(card=>{const order=tourWorkspaces.indexOf(card.dataset.workspace);const num=card.querySelector('.pg-num');card.classList.toggle('is-featured',order>=0);if(num)num.textContent=order>=0?String(order+1):'';});
 const eyebrow=stage.querySelector('.bx-eyebrow');if(eyebrow)eyebrow.textContent='See it work · No new AI tool';
}
function roster(){
 if(state.workspace){return rosterStrip({current:state.workspace,visited:tourPeople});}
 if(state.scene===6){const d=discoveryPeople(state.discovery);return rosterStrip({visited:tourPeople,focus:d.people,ghost:d.ghost});}
 if(state.scene===7&&guided)return '';
 if(state.scene===7)return rosterStrip({visited:tourPeople,focus:buildPeople[state.improvement]||[],ghost:state.improvement==='priya'});
 return '';
}
function armIdle(){clearTimeout(idleTimer);document.body.classList.remove('controls-idle');if(guided&&tourIndex===tourStops.length-1)idleTimer=setTimeout(()=>document.body.classList.add('controls-idle'),4000);}
function render(navigate=false){
 document.body.classList.toggle('guided-tour',guided);document.body.classList.toggle('is-tour',guided);
 $('stage').innerHTML=onStack()?renderStack():tourView()==='crowd'?renderCrowd():tourView()==='build'?renderBuildMap():tourView()==='watch'?renderWatch(fixStep):tourView()==='plan'?renderPlan():renderScene(state);
 if(guided)markTourFocus();
 const head=heading();
 $('eyebrow').textContent=head.eyebrow;$('eyebrow').hidden=!head.eyebrow;$('title').textContent=head.title;$('lead').textContent=head.lead;$('lead').hidden=!head.lead;
 const strip=roster();$('roster').innerHTML=strip;$('roster').hidden=!strip;
 const act=guided?actOf(tourIndex):sceneAct[state.scene];const tick=guided?tourIndex:firstStopForScene(state.scene);
 document.querySelectorAll('[data-act]').forEach(b=>{if(Number(b.dataset.act)===act)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
 document.querySelectorAll('[data-tick]').forEach(t=>{const i=Number(t.dataset.tick);t.className=i<tick?'is-done':i===tick?'is-current':'';});
 document.querySelectorAll('[data-scene]').forEach(b=>{if(Number(b.dataset.scene)===state.scene)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
 const action=tourAction();$('next').textContent=action.label;$('next').dataset.action=action.action;$('next').disabled=false;$('next').title=action.label;
 $('hint').hidden=action.action!=='build-choose';
 $('back').disabled=guided?tourIndex===0:state.scene===0;$('counter').textContent=guided?`${tourIndex+1} / ${tourStops.length}`:`${state.scene+1} / ${scenes.length}`;
 $('presenter-cue').textContent={stack:viewCopy.stack.cue,crowd:viewCopy.crowd.cue,build:fixCues.build,watch:fixCues.watch[fixStep],plan:fixCues.plan}[tourView()]??(state.scene===2&&state.networkMode==='connected'?fixCues.connected:cues[state.scene]);document.body.dataset.scene=String(state.scene);document.body.dataset.stop=guided?String(tourIndex+1):'';
 if(navigate){history.replaceState(null,'',guided?`#stop-${tourIndex+1}`:`#slide-${state.scene+1}`);$('title').focus({preventScroll:true});window.scrollTo(0,0);}
 if(detailKey)updateDetail();$('announcement').textContent=head.title||'Dana’s view: “We gave everyone AI. I thought we were in pretty good shape.”';
 armIdle();
}
function dispatch(action){const before=state.scene;
 if(guided&&action.type==='SCENE')return goTour(firstStopForScene(action.index));
 if(guided&&action.type==='RESET') {state=initialState();return goTour(0);}
 if(action.type==='CLOSE_WORKSPACE'&&mapReturn){state=mapReturn.state;tourIndex=mapReturn.index;mapReturn=null;return render(true);}
 if(guided&&action.type==='CLOSE_WORKSPACE')return goTour(firstStopForScene(2));
 if(action.type==='WORKSPACE'&&state.scene===2&&!state.workspace)mapReturn={state,index:tourIndex};
 state=transition(state,action);
 if(guided&&action.type==='WORKSPACE'){
  state=transition(state,{type:'WORK_REVEAL',id:action.id});
  const found=tourStops.findIndex(stop=>stop.workspace===action.id);if(found>=0){tourIndex=found;state={...state,scene:tourStops[found].scene};}
 }
 if(guided&&action.type==='BUILD_OPEN')tourIndex=tourStops.findIndex(stop=>stop.improvement===action.id);
 if(guided&&action.type==='IMPROVEMENT'&&state.scene===7)tourIndex=tourStops.findIndex(stop=>stop.improvement===action.id);
 if(guided&&action.type==='DISCOVERY')tourIndex=tourStops.findIndex(stop=>stop.discovery===action.id);
 render(before!==state.scene||action.type==='RESET');}
function updateDetail(){const detail=renderDetail(state,detailKey);$('detail-title').textContent=detail.title;$('detail-content').innerHTML=detail.html;
 const booking=$('booking-content');if(booking&&window.N67_EVENT?.bookingUrl){try{const url=new URL(window.N67_EVENT.bookingUrl);if(['http:','https:'].includes(url.protocol)){const a=document.createElement('a');a.href=url.href;a.target='_blank';a.rel='noopener';a.className='primary';a.textContent='Book an AI Workflow Discovery Session';booking.replaceChildren(a);}}catch{}}
}
function showDetail(key,trigger){if(key.startsWith('workspace:'))return dispatch({type:'WORKSPACE',id:key.slice(10)});if(key.startsWith('source:'))state=transition(state,{type:'INSPECT',id:key.slice(7)});detailKey=key;detailTrigger=trigger;updateDetail();if(!dialog.open)dialog.showModal();$('close-detail').focus();}
function goBack(){if(guided)return goTour(tourIndex-1);stopPlayback();dispatch({type:'SCENE',index:state.scene-1});}
function act(action,trigger){stopPlayback();if(action==='tour-next')return goTour(tourIndex+1);if(action==='build-forward')return footerPrimary()?.click();if(action==='build-choose')return recommendedChoice()?.click();if(action==='next')return dispatch({type:'SCENE',index:state.scene+1});if(action==='discovery')return showDetail('discovery',trigger);}
function workAction(id){stopPlayback();if(id==='marcus'){dispatch({type:'WORK_REPLAY',id});playback=[setTimeout(()=>{if(state.workspace==='marcus')dispatch({type:'WORK_STEP',id});},2200),setTimeout(()=>{if(state.workspace==='marcus')dispatch({type:'WORK_STEP',id});},4600)];}else dispatch({type:'WORK_STEP',id});}
function togglePresenter(){const menu=document.querySelector('.presenter-menu');const on=!document.body.classList.contains('show-presenter');document.body.classList.toggle('show-presenter',on);if(menu)menu.open=on;}
setupShell();
document.addEventListener('click',event=>{
 if(!(event.target instanceof Element))return;const b=event.target.closest('button');if(!b||b.disabled)return;
 if(b.id==='close-detail')return dialog.close();
 if(b.dataset.detail)return showDetail(b.dataset.detail,b);
 if(b.dataset.act!==undefined){const start=actStarts[Number(b.dataset.act)]||0;if(guided)return goTour(start);return dispatch({type:'SCENE',index:tourStops[start].scene});}
 if(b.dataset.workspace){stopPlayback();return dispatch({type:'WORKSPACE',id:b.dataset.workspace});}
 if(b.hasAttribute('data-close-workspace')){stopPlayback();return dispatch({type:'CLOSE_WORKSPACE'});}
 if(b.dataset.workReveal){stopPlayback();return dispatch({type:'WORK_REVEAL',id:b.dataset.workReveal});}
 if(b.dataset.workAction)return workAction(b.dataset.workAction);
 if(b.dataset.peer)return dispatch({type:'PEER',id:b.dataset.peer});
 if(b.dataset.improvement)return dispatch({type:'IMPROVEMENT',id:b.dataset.improvement});
 if(b.dataset.build){stopPlayback();return dispatch({type:'BUILD_OPEN',id:b.dataset.build});}
 if(b.dataset.buildAction)return dispatch({type:'BUILD',action:b.dataset.buildAction});
 if(b.dataset.discovery)return dispatch({type:'DISCOVERY',id:b.dataset.discovery});
 if(b.dataset.networkMode)return dispatch({type:'NETWORK_MODE',mode:b.dataset.networkMode});
 if(b.dataset.scene!==undefined){stopPlayback();return dispatch({type:'SCENE',index:Number(b.dataset.scene)});}
 if(b.dataset.exclude){state=transition(state,{type:'EXCLUDE',id:b.dataset.exclude});detailKey='supporting-cases';return render();}
 if(b.id==='tour-mode'){guided=!guided;b.textContent=guided?'Explore freely':'Guided walkthrough';b.setAttribute('aria-pressed',String(guided));if(guided)return goTour(firstStopForScene(state.scene));return render();}
 if(b.id==='back')return goBack();
 if(b.id==='reset'){stopPlayback();return dispatch({type:'RESET'});}
 if(b.id==='notes'){document.body.classList.toggle('show-notes');b.setAttribute('aria-pressed',String(document.body.classList.contains('show-notes')));return;}
 if(b.dataset.fixStep){fixStep=Math.min(WATCH_LAST,Number(b.dataset.fixStep));return render();}
 if(b.dataset.action)act(b.dataset.action,b);
});
document.addEventListener('click',()=>{if(!dialog.open&&document.activeElement instanceof HTMLElement&&document.activeElement!==document.body)document.activeElement.blur();});
document.addEventListener('keydown',event=>{
 if(event.repeat||event.ctrlKey||event.metaKey||event.altKey||dialog.open)return;
 const target=event.target;if(target instanceof Element&&(target.closest('input,textarea,select')||target.isContentEditable))return;
 if(event.key==='Escape'&&state.workspace&&!guided){stopPlayback();return dispatch({type:'CLOSE_WORKSPACE'});}
 if(event.key==='n'||event.key==='N'){event.preventDefault();return $('notes').click();}
 if(event.key==='p'||event.key==='P'){event.preventDefault();return togglePresenter();}
 if(event.key==='ArrowRight'||event.code==='Space'||event.key==='PageDown'){event.preventDefault();return act(tourAction().action,$('next'));}
 if(event.key==='ArrowLeft'||event.key==='PageUp'){event.preventDefault();goBack();}
});
addEventListener('mousemove',armIdle);addEventListener('keydown',armIdle,true);
dialog.addEventListener('close',()=>{detailKey='';if(!guided&&detailTrigger?.isConnected)return detailTrigger.focus({preventScroll:true});if(document.activeElement instanceof HTMLElement)document.activeElement.blur();});
function followHash(){stopPlayback();fixStep=0;const stop=location.hash.match(/^#stop-(\d+)/);const slide=location.hash.match(/^#slide-(\d+)$/);
 if(stop&&guided){tourIndex=Math.max(0,Math.min(tourStops.length-1,Number(stop[1])-1));state=enterTourStop(state,tourIndex);return render();}
 const scene=slide?Number(slide[1])-1:0;if(guided){tourIndex=firstStopForScene(scene);state=enterTourStop(state,tourIndex);}else state=transition(state,{type:'SCENE',index:scene});render();}
window.addEventListener('hashchange',followHash);followHash();
