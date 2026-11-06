import { initialState, transition, numbers, artifact, money, owners, approved } from './proposal-model.mjs';
import { renderScene, scenes, escapeHtml, roster, primaryAction, renderDetail } from './proposal-view.mjs';
let state = initialState();
let playbackTimer;
let openDetail = '';
let detailTrigger;
const byId = id => document.getElementById(id);
const dialog = byId('detail-dialog');
const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
function stopTimer(){clearTimeout(playbackTimer);playbackTimer=undefined;}
function render(navigate=false){
  const scene=scenes[state.scene];
  byId('eyebrow').textContent=scene.eyebrow;
  byId('title').textContent=scene.title;
  byId('lead').textContent=scene.lead;
  byId('scene-content').innerHTML=renderScene(state);
  byId('people-roster').innerHTML=roster(state);
  document.body.dataset.scene=String(state.scene);
  document.querySelectorAll('[data-scene]').forEach(button=>{
    if(Number(button.dataset.scene)===state.scene)button.setAttribute('aria-current','step');
    else button.removeAttribute('aria-current');
  });
  const action=primaryAction(state);
  byId('primary-action').textContent=action.label;
  byId('primary-action').disabled=Boolean(action.disabled);
  byId('primary-action').dataset.action=action.action;
  byId('back').disabled=state.scene===0;
  byId('counter').textContent=`${state.scene+1} / 5`;
  if(navigate){
    history.replaceState(null,'',`#slide-${state.scene+1}`);
    byId('title').focus({preventScroll:true});
    byId('scene-content').scrollTop=0;window.scrollTo(0,0);
  }
  if(openDetail)updateDetail();
  byId('announcement').textContent=state.notice||`${scene.title} ${state.playing?`${state.runStep} owner decisions recorded.`:''}`;
}
function schedulePlayback(){
  stopTimer();
  if(!state.playing||state.scene!==3||openDetail)return;
  playbackTimer=setTimeout(()=>{state=transition(state,{type:'RUN_STEP'});render();schedulePlayback();},calm.matches?3500:4200);
}
function dispatch(action){
  const before=state.scene;
  if(action.type==='SCENE'&&action.index!==3&&state.playing)state=transition(state,{type:'PAUSE_RUN'});
  state=transition(state,action);
  render(before!==state.scene||action.type==='RESET');schedulePlayback();
}
function updateDetail(){
  const detail=renderDetail(state,openDetail);
  byId('detail-title').textContent=detail.title;
  byId('detail-content').innerHTML=detail.html;
  const booking=byId('booking-content');
  if(booking&&window.N67_EVENT?.bookingUrl){
    try{const url=new URL(window.N67_EVENT.bookingUrl);if(['http:','https:'].includes(url.protocol)){const link=document.createElement('a');link.href=url.href;link.target='_blank';link.rel='noopener';link.className='primary';link.textContent=window.N67_EVENT.bookingLabel||'Book your workflow assessment';booking.replaceChildren(link);}}catch{/* Keep the chat invitation when the configured URL is invalid. */}
  }
}
function showDetail(key,trigger){
  stopTimer();openDetail=key;detailTrigger=trigger;updateDetail();
  if(!dialog.open)dialog.showModal();
  byId('close-detail').focus();
}
function closeDetail(){dialog.close();}
dialog.addEventListener('close',()=>{openDetail='';if(detailTrigger?.isConnected)detailTrigger.focus({preventScroll:true});schedulePlayback();});
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeDetail();}});
function download(){
  if(!state.ready)return;
  const n=numbers(state);
  const text=`<!doctype html><html lang="en"><meta charset="utf-8"><title>Summit Advisory · Sample proposal summary</title><style>body{max-width:780px;margin:60px auto;padding:24px;font:17px/1.6 system-ui;color:#24322d}small{color:#666}h1{line-height:1.2}section{border-top:1px solid #ddd;padding-top:20px;margin-top:24px}</style><small>ILLUSTRATIVE DEMO ARTIFACT · NOT A CLIENT CONTRACT</small><h1>Northstar Distribution<br>90-day operational improvement proposal</h1><p>Revision ${state.revision} · ${escapeHtml(state.sites.join(' + '))} · ${money(n.fee)}</p>${owners.map(owner=>{const row=artifact(state,owner.id);return `<section><h2>${row[0]}</h2><p>${escapeHtml(row[2])}</p><p>${escapeHtml(row[3])}</p></section>`;}).join('')}<section><h2>Decisions and verified updates</h2><p>Five sample owner decisions and final leadership authorization recorded. SharePoint, HubSpot and Jira writes were simulated and verified. No external records were changed and no email was sent.</p></section></html>`;
  const url=URL.createObjectURL(new Blob([text],{type:'text/html'}));
  const link=document.createElement('a');link.href=url;link.download=`Summit_Northstar_proposal_v${state.revision}.html`;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function act(action,trigger){
  if(action==='next')return dispatch({type:'SCENE',index:state.scene+1});
  if(action==='start-manual'){state=transition(state,{type:'CHANGE'});return dispatch({type:'SCENE',index:2});}
  if(action==='manual')return dispatch({type:'MANUAL'});
  if(action==='change')return dispatch({type:'CHANGE'});
  if(action==='analyze')return dispatch({type:'ANALYZE'});
  if(action==='run'){if(!state.analyzed)state=transition(state,{type:'ANALYZE'});return dispatch({type:'START_RUN'});}
  if(action==='advance-run')return dispatch({type:'RUN_STEP'});
  if(action==='pause')return dispatch({type:'PAUSE_RUN'});
  if(action==='release'){
    if(!owners.every(owner=>approved(state,owner.id)))return;
    state=transition(state,{type:'APPROVE',id:'leadership'});
    state=transition(state,{type:'SYNC'});
    return dispatch({type:'SCENE',index:state.ready?4:3});
  }
  if(action==='return-review')return dispatch({type:'SCENE',index:3});
  if(action==='assessment')return showDetail('assessment',trigger);
  if(action==='download')return download();
}
document.addEventListener('click',event=>{
  if(!(event.target instanceof Element))return;
  const button=event.target.closest('button');if(!button||button.disabled)return;
  if(button.id==='close-detail')return closeDetail();
  if(button.dataset.detail)return showDetail(button.dataset.detail,button);
  if(button.dataset.scene!==undefined)return dispatch({type:'SCENE',index:Number(button.dataset.scene)});
  if(button.dataset.goto!==undefined)return dispatch({type:'SCENE',index:Number(button.dataset.goto)});
  if(button.dataset.manualBeat!==undefined){if(openDetail.startsWith('handoff:')){openDetail=`handoff:${button.dataset.manualBeat}`;return updateDetail();}state={...state,manualCount:Number(button.dataset.manualBeat)};return render();}
  if(button.id==='back')return dispatch({type:'SCENE',index:state.scene-1});
  if(button.id==='reset'){stopTimer();if(dialog.open)dialog.close();openDetail='';return dispatch({type:'RESET'});}
  if(button.dataset.action)return act(button.dataset.action,button);
});
document.addEventListener('change',event=>{if(event.target instanceof HTMLSelectElement&&event.target.id==='fault'){dispatch({type:'FAULT',value:event.target.value});byId('fault')?.focus({preventScroll:true});}});
document.addEventListener('keydown',event=>{
  if(event.repeat||event.ctrlKey||event.metaKey||event.altKey||dialog.open||!(event.target instanceof Element)||event.target.closest('input,textarea,select,a,summary')||event.target.isContentEditable)return;
  if(event.key==='ArrowRight'){event.preventDefault();const action=primaryAction(state);if(!action.disabled)act(action.action);}
  if(event.key==='ArrowLeft'){event.preventDefault();dispatch({type:'SCENE',index:state.scene-1});}
});
function followHash(){stopTimer();if(state.playing)state=transition(state,{type:'PAUSE_RUN'});const match=location.hash.match(/^#slide-(\d+)$/);state=transition(state,{type:'SCENE',index:match?Number(match[1])-1:0});render();}
window.addEventListener('hashchange',followHash);
followHash();
