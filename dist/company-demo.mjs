import { initialState, transition } from './company-model.mjs';
import { scenes, cues, renderScene, renderDetail, primaryAction } from './company-view.mjs';
import { tourStops, enterTourStop, firstStopForScene } from './company-tour.mjs';
import { workspaceHeading } from './company-workspaces.mjs';
let guided=true;let tourIndex=0;let mapReturn=null;
let state=initialState();let detailKey='';let detailTrigger;let playback=[];
const $=id=>document.getElementById(id);const dialog=$('detail-dialog');
function stopPlayback(){playback.forEach(clearTimeout);playback=[];}
function tourAction(){
 if(!guided)return primaryAction(state);
 if(state.scene===7&&!state.workspace){
  const control=document.querySelector('.build-footer .build-primary');
  if(control)return {label:control.textContent,action:'build-forward'};
  if(document.querySelector('.build-choices')&&!document.querySelector('.build-complete'))return {label:'Review the choice above',action:'review-required'};
 }
 if(tourIndex===tourStops.length-1)return {label:'Book a discovery session →',action:'discovery'};
 return {label:`Next · ${tourStops[tourIndex+1].label} →`,action:'tour-next'};
}
function goTour(index){
 stopPlayback();tourIndex=Math.max(0,Math.min(tourStops.length-1,index));
 state=enterTourStop(state,tourIndex);render(true);
}
function render(navigate=false){
 document.body.classList.toggle('guided-tour',guided);
 const scene=scenes[state.scene];
 $('title').textContent=state.workspace?workspaceHeading(state):scene.title;
 $('lead').textContent=state.workspace?'A real task, a useful result, and what the rest of the company does not see.':scene.lead;
 $('stage').innerHTML=renderScene(state);
 document.querySelectorAll('[data-scene]').forEach(b=>{if(Number(b.dataset.scene)===state.scene)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
 const action=tourAction();$('next').textContent=action.label;$('next').dataset.action=action.action;$('next').disabled=action.action==='review-required';
 $('back').disabled=guided?tourIndex===0:state.scene===0;$('counter').textContent=guided?`${tourIndex+1} / ${tourStops.length}`:`${state.scene+1} / ${scenes.length}`;
 $('presenter-cue').textContent=cues[state.scene];document.body.dataset.scene=String(state.scene);
 if(navigate){history.replaceState(null,'',`#slide-${state.scene+1}`);$('title').focus({preventScroll:true});window.scrollTo(0,0);}
 if(detailKey)updateDetail();$('announcement').textContent=state.workspace?workspaceHeading(state):scene.title;
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
function act(action,trigger){stopPlayback();if(action==='tour-next')return goTour(tourIndex+1);if(action==='build-forward')return document.querySelector('.build-footer .build-primary')?.click();if(action==='review-required')return;if(action==='next')return dispatch({type:'SCENE',index:state.scene+1});if(action==='discovery')return showDetail('discovery',trigger);}
function workAction(id){stopPlayback();if(id==='marcus'){dispatch({type:'WORK_REPLAY',id});playback=[setTimeout(()=>{if(state.workspace==='marcus')dispatch({type:'WORK_STEP',id});},2200),setTimeout(()=>{if(state.workspace==='marcus')dispatch({type:'WORK_STEP',id});},4600)];}else dispatch({type:'WORK_STEP',id});}
document.addEventListener('click',event=>{
 if(!(event.target instanceof Element))return;const b=event.target.closest('button');if(!b||b.disabled)return;
 if(b.id==='close-detail')return dialog.close();
 if(b.dataset.detail)return showDetail(b.dataset.detail,b);
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
 if(b.id==='back'){if(guided)return goTour(tourIndex-1);stopPlayback();return dispatch({type:'SCENE',index:state.scene-1});}
 if(b.id==='reset'){stopPlayback();return dispatch({type:'RESET'});}
 if(b.id==='notes'){document.body.classList.toggle('show-notes');b.setAttribute('aria-pressed',String(document.body.classList.contains('show-notes')));return;}
 if(b.dataset.action)act(b.dataset.action,b);
});
document.addEventListener('keydown',event=>{
 if(event.repeat||event.ctrlKey||event.metaKey||event.altKey||dialog.open||!(event.target instanceof Element)||event.target.closest('input,textarea,select,a,summary')||event.target.isContentEditable)return;
 if(event.key==='Escape'&&state.workspace){stopPlayback();return dispatch({type:'CLOSE_WORKSPACE'});}
 if(event.key==='n'||event.key==='N'){event.preventDefault();$('notes').click();}
 if(event.code==='Space'&&event.target.closest('button')&&event.target.id!=='next')return;
 if(event.key==='ArrowRight'||event.code==='Space'){event.preventDefault();act(tourAction().action);}
 if(event.key==='ArrowLeft'){event.preventDefault();if(guided)return goTour(tourIndex-1);stopPlayback();dispatch({type:'SCENE',index:state.scene-1});}
});
dialog.addEventListener('close',()=>{detailKey='';if(detailTrigger?.isConnected)detailTrigger.focus({preventScroll:true});});
function followHash(){stopPlayback();const match=location.hash.match(/^#slide-(\d+)$/);const scene=match?Number(match[1])-1:0;if(guided){tourIndex=firstStopForScene(scene);state=enterTourStop(state,tourIndex);}else state=transition(state,{type:'SCENE',index:scene});render();}
window.addEventListener('hashchange',followHash);followHash();
