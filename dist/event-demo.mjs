import { initialState, transition } from './event-model.mjs';
import { scenes, renderScene, primaryAction, renderDetail } from './event-view.mjs';
let state=initialState();
let detailKey='';
let detailTrigger;
const $=id=>document.getElementById(id);
const dialog=$('detail-dialog');
function render(navigate=false){
 const scene=scenes[state.scene];
 $('title').textContent=scene.title;$('lead').textContent=scene.lead;
 $('stage').innerHTML=renderScene(state);
 document.querySelectorAll('[data-scene]').forEach(button=>{if(Number(button.dataset.scene)===state.scene)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');});
 const action=primaryAction(state);$('next').textContent=action.label;$('next').dataset.action=action.action;
 $('presenter-cue').textContent=presenterCue();
 $('back').disabled=state.scene===0;$('counter').textContent=`${state.scene+1} / 5`;
 document.body.dataset.scene=String(state.scene);document.body.dataset.ready=String(state.ready);
 if(navigate){history.replaceState(null,'',`#slide-${state.scene+1}`);$('title').focus({preventScroll:true});window.scrollTo(0,0);}
 if(detailKey)updateDetail();
 $('announcement').textContent=state.notice||`${scene.title} ${state.scene===3?(state.ready?'All updates verified.':`Review ${state.phase} of 3.`):''}`;
}
function presenterCue(){
 if(state.scene===0)return 'Josh: One simple customer request. Watch how much work sits behind the answer.';
 if(state.scene===1)return ['Josh: Leah uses AI well. The request is captured, and the acknowledgment is ready.','Josh: Sam checked availability. His inventory work is done correctly.','Josh: Dana checked the truck and driver. Another useful AI-assisted result.'][state.person];
 if(state.scene===2)return 'Josh: AI can draft the reply. Leah still has to get approval and finish the job across three systems.';
 if(state.scene===3)return ['Suuchi: We connect the permitted records to one versioned request.','Josh: Sam’s quantities are now in Dana’s review. Leah did not copy them.','Josh: The complete price reaches the customer, with the plan behind it.','Suuchi: Human decisions stay in place. The workflow performs and checks the authorized updates.','Josh: This is the proof. Three systems agree before we call the work complete.'][state.phase];
 return 'Josh: We did not give the team another AI tool. We connected the work they were already doing.';
}
function dispatch(action){const before=state.scene;state=transition(state,action);render(state.scene!==before||action.type==='RESET');}
function updateDetail(){const detail=renderDetail(state,detailKey);$('detail-title').textContent=detail.title;$('detail-content').innerHTML=detail.html;const booking=$('booking-content');if(booking&&window.N67_EVENT?.bookingUrl){try{const url=new URL(window.N67_EVENT.bookingUrl);if(['http:','https:'].includes(url.protocol)){const a=document.createElement('a');a.href=url.href;a.target='_blank';a.rel='noopener';a.textContent=window.N67_EVENT.bookingLabel||'Book your workflow assessment';booking.replaceChildren(a);}}catch{/* Retain the chat invitation for an invalid booking URL. */}}}
function showDetail(key,trigger){detailKey=key;detailTrigger=trigger;updateDetail();if(!dialog.open)dialog.showModal();$('close-detail').focus();}
function act(action,trigger){
 if(action==='next')return dispatch({type:'NEXT_SCENE'});
 if(action==='next-person')return dispatch({type:'PERSON',index:state.person+1});
 if(action==='review')return dispatch({type:'REVIEW'});
 if(action==='release')return dispatch({type:'RELEASE'});
 if(action==='review-scene')return dispatch({type:'SCENE',index:3});
 if(action==='assessment')return showDetail('assessment',trigger);
}
document.addEventListener('click',event=>{
 if(!(event.target instanceof Element))return;const button=event.target.closest('button');if(!button||button.disabled)return;
 if(button.id==='close-detail')return dialog.close();
 if(button.dataset.detail)return showDetail(button.dataset.detail,button);
 if(button.dataset.scene!==undefined)return dispatch({type:'SCENE',index:Number(button.dataset.scene)});
 if(button.dataset.person!==undefined)return dispatch({type:'PERSON',index:Number(button.dataset.person)});
 if(button.id==='back'){if(state.scene===1&&state.person>0)return dispatch({type:'PERSON',index:state.person-1});return dispatch({type:'SCENE',index:state.scene-1});}
 if(button.id==='notes'){document.body.classList.toggle('show-notes');button.setAttribute('aria-pressed',String(document.body.classList.contains('show-notes')));return;}
 if(button.id==='reset')return dispatch({type:'RESET'});
 if(button.dataset.action)act(button.dataset.action,button);
});
document.addEventListener('change',event=>{if(event.target instanceof HTMLSelectElement&&event.target.id==='fault'){dispatch({type:'FAULT',value:event.target.value});$('fault')?.focus();}});
document.addEventListener('keydown',event=>{if(event.repeat||event.ctrlKey||event.metaKey||event.altKey||dialog.open||!(event.target instanceof Element)||event.target.closest('input,textarea,select,a')||event.target.isContentEditable)return;if(event.key==='n'||event.key==='N'){event.preventDefault();$('notes').click();return;}if(event.key==='ArrowRight'||event.code==='Space'){event.preventDefault();act(primaryAction(state).action);}if(event.key==='ArrowLeft'){event.preventDefault();if(state.scene===1&&state.person>0)dispatch({type:'PERSON',index:state.person-1});else dispatch({type:'SCENE',index:state.scene-1});}});
dialog.addEventListener('close',()=>{detailKey='';if(detailTrigger?.isConnected)detailTrigger.focus({preventScroll:true});});
function followHash(){const match=location.hash.match(/^#slide-(\d+)$/);state=transition(state,{type:'SCENE',index:match?Number(match[1])-1:0});render();}
window.addEventListener('hashchange',followHash);followHash();
