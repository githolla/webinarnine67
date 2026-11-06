import { initialState, transition, people } from './company-model.mjs';
import { scenes, cues, renderScene, renderDetail, primaryAction } from './company-view.mjs';
let state=initialState();
let detailKey='';
let detailTrigger;
const $=id=>document.getElementById(id);
const dialog=$('detail-dialog');
function render(navigate=false) {
  const scene=scenes[state.scene];
  $('title').textContent=scene.title;
  $('lead').textContent=scene.lead;
  $('stage').innerHTML=renderScene(state);
  document.querySelectorAll('[data-scene]').forEach(button=>{
    if(Number(button.dataset.scene)===[0,1,2,3,3,3,6,6,8][state.scene])button.setAttribute('aria-current','step');
    else button.removeAttribute('aria-current');
  });
  const action=primaryAction(state);
  $('next').textContent=action.label;
  $('next').dataset.action=action.action;
  $('back').disabled=state.scene===0;
  $('counter').textContent=`${state.scene+1} / ${scenes.length}`;
  $('presenter-cue').textContent=cues[state.scene];
  document.body.dataset.scene=String(state.scene);
  if(navigate) {
    history.replaceState(null,'',`#slide-${state.scene+1}`);
    $('title').focus({preventScroll:true});
    window.scrollTo(0,0);
  }
  if(detailKey)updateDetail();
  $('announcement').textContent=state.scene===7?`Finding stage ${state.stage}. ${state.owner?`Owner ${state.owner}, update due ${state.due}.`:''}`:scene.title;
}
function dispatch(action) {
  const before=state.scene;
  state=transition(state,action);

  render(before!==state.scene||action.type==='RESET');
}
function setPilot(view) { state=transition(state,{type:'PILOT_VIEW',view}); }
function updateDetail() {
  const detail=renderDetail(state,detailKey);
  $('detail-title').textContent=detail.title;
  $('detail-content').innerHTML=detail.html;
  const booking=$('booking-content');
  if(booking&&window.N67_EVENT?.bookingUrl) {
    try {
      const url=new URL(window.N67_EVENT.bookingUrl);
      if(['http:','https:'].includes(url.protocol)) {
        const link=document.createElement('a');
        link.href=url.href;link.target='_blank';link.rel='noopener';link.className='primary';
        link.textContent='Book an AI Workflow Discovery Session';
        booking.replaceChildren(link);
      }
    } catch { /* Keep the chat invitation when a configured booking URL is invalid. */ }
  }
}
function showDetail(key,trigger) {
  if(key.startsWith('source:'))state=transition(state,{type:'INSPECT',id:key.slice(7)});
  detailKey=key;detailTrigger=trigger;updateDetail();
  if(!dialog.open)dialog.showModal();
  $('close-detail').focus();
}
function act(action,trigger) {
  if(action==='refresh-finance')return dispatch({type:'REFRESH_FINANCE'});
  if(action==='show-coaching')return dispatch({type:'SHOW_COACHING'});
  if(action==='next')return dispatch({type:'SCENE',index:state.scene+1});
  if(action==='next-person') {
    const index=people.findIndex(p=>p.id===state.person);
    return dispatch({type:'PERSON',id:people[Math.min(index+1,people.length-1)].id});
  }
  if(action==='outlier') {setPilot('teams');render();return showDetail('source:CASE-218',trigger);}
  if(action==='approve') {setPilot('teams');return dispatch({type:'APPROVE_FINDING'});}
  if(action==='assign') {setPilot('teams');state=transition(state,{type:'ASSIGN'});setPilot('crm');return render();}
  if(action==='observation') {
    setPilot('crm');state=transition(state,{type:'RECORD_ACCOUNT_OBSERVATION'});setPilot('executive');return render();
  }
  if(action==='investigate') {setPilot('executive');return dispatch({type:'START_INVESTIGATION'});}
  if(action==='progress') {setPilot('executive');return dispatch({type:'UPDATE_PROGRESS'});}
  if(action==='discovery')return showDetail('discovery',trigger);
}
function back() {
  const index=people.findIndex(p=>p.id===state.person);

  dispatch({type:'SCENE',index:state.scene-1});
}
document.addEventListener('click',event=>{
  if(!(event.target instanceof Element))return;
  const node=event.target.closest('[data-map-node]');
  if(node){event.preventDefault();return dispatch({type:'MAP_NODE',id:node.dataset.mapNode});}
  const button=event.target.closest('button');
  if(!button||button.disabled)return;
  if(button.dataset.networkMode)return dispatch({type:'NETWORK_MODE',mode:button.dataset.networkMode});
  if(button.hasAttribute('data-map-reset'))return dispatch({type:'MAP_RESET'});
  if(button.id==='close-detail')return dialog.close();
  if(button.dataset.detail)return showDetail(button.dataset.detail,button);
  if(button.dataset.scene!==undefined)return dispatch({type:'SCENE',index:Number(button.dataset.scene)});
  if(button.dataset.person)return dispatch({type:'PERSON',id:button.dataset.person});
  if(button.dataset.pilotView)return dispatch({type:'PILOT_VIEW',view:button.dataset.pilotView});
  if(button.dataset.exclude) {
    state=transition(state,{type:'EXCLUDE',id:button.dataset.exclude});
    if(dialog.open){detailKey='';dialog.close();}
    render();$('next').focus({preventScroll:true});return;
  }
  if(button.id==='back')return back();
  if(button.id==='reset')return dispatch({type:'RESET'});
  if(button.id==='notes') {
    document.body.classList.toggle('show-notes');
    button.setAttribute('aria-pressed',String(document.body.classList.contains('show-notes')));return;
  }
  if(button.dataset.action)act(button.dataset.action,button);
});
document.addEventListener('keydown',event=>{
  if(event.target instanceof Element&&event.target.closest('[data-map-node]')&&['Enter',' '].includes(event.key)){event.preventDefault();dispatch({type:'MAP_NODE',id:event.target.closest('[data-map-node]').dataset.mapNode});return;}
  if(event.repeat||event.ctrlKey||event.metaKey||event.altKey||dialog.open||!(event.target instanceof Element)||event.target.closest('input,textarea,select,a')||event.target.isContentEditable)return;
  if(event.key==='n'||event.key==='N'){event.preventDefault();$('notes').click();}
  if(event.code==='Space'&&event.target.closest('button')&&event.target.id!=='next')return;
  if(event.key==='ArrowRight'||event.code==='Space'){event.preventDefault();act(primaryAction(state).action);}
  if(event.key==='ArrowLeft'){event.preventDefault();back();}
});
dialog.addEventListener('close',()=>{detailKey='';if(detailTrigger?.isConnected)detailTrigger.focus({preventScroll:true});});
function followHash() {
  const match=location.hash.match(/^#slide-(\d+)$/);
  state=transition(state,{type:'SCENE',index:match?Number(match[1])-1:0});render();
}
window.addEventListener('hashchange',followHash);
followHash();
