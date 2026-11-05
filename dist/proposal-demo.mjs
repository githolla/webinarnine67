import { initialState, transition, numbers, artifact, money } from './proposal-model.mjs';
import { renderScene, renderSidebar, scenes, escapeHtml } from './proposal-view.mjs';
let state = initialState();
const byId = id => document.getElementById(id);
const content = byId('scene-content');
const sidebar = byId('explanation');
function render(navigate = false) {
  const scroll = content.scrollTop;
  const scene = scenes[state.scene];
  byId('eyebrow').textContent = scene.eyebrow;
  byId('title').textContent = scene.title;
  byId('lead').textContent = scene.lead;
  content.innerHTML = renderScene(state);
  sidebar.innerHTML = renderSidebar(state);
  document.querySelectorAll('[data-scene]').forEach(button => {
    if (Number(button.dataset.scene) === state.scene) button.setAttribute('aria-current','step');
    else button.removeAttribute('aria-current');
  });
  byId('counter').textContent = `Scene ${state.scene + 1} of 5`;
  byId('back').disabled = state.scene === 0;
  byId('next').disabled = state.scene === 4;
  byId('next').textContent = state.scene === 3 ? 'See the proposal →' : 'Next scene →';
  content.scrollTop = navigate ? 0 : scroll;
  if (navigate) {
    sidebar.scrollTop = 0;
    history.replaceState(null,'',`#slide-${state.scene+1}`);
    byId('title').focus({preventScroll:true});
    window.scrollTo(0,0);
  }
  byId('announcement').textContent = state.notice || scene.title;
  const booking = byId('booking-content');
  if (booking && window.N67_EVENT?.bookingUrl) {
    try {
      const url = new URL(window.N67_EVENT.bookingUrl);
      if (['https:','http:'].includes(url.protocol)) {
        const link = document.createElement('a');
        link.href=url.href; link.target='_blank'; link.rel='noopener'; link.className='primary';
        link.textContent=window.N67_EVENT.bookingLabel || 'Book your workflow assessment';
        booking.prepend(link);
      }
    } catch { /* An unset or invalid booking URL keeps the chat invitation. */ }
  }
}
function dispatch(action) {
  const previous = state.scene;
  state = transition(state,action);
  render(previous !== state.scene || action.type === 'RESET');
}
function download() {
  if (!state.ready) return;
  const n = numbers(state);
  const text = `<!doctype html><html lang="en"><meta charset="utf-8"><title>Summit Advisory · Sample proposal summary</title><style>body{max-width:780px;margin:60px auto;padding:24px;font:17px/1.6 system-ui;color:#24322d}small{color:#666}h1{line-height:1.2}section{border-top:1px solid #ddd;padding-top:20px;margin-top:24px}</style><small>ILLUSTRATIVE DEMO ARTIFACT · NOT A CLIENT CONTRACT</small><h1>Northstar Distribution<br>90-day operational improvement proposal</h1><p>Revision ${state.revision} · ${escapeHtml(state.sites.join(' + '))} · ${money(n.fee)}</p>${['sales','delivery','finance','legal','marketing'].map(id=>{const row=artifact(state,id);return `<section><h2>${row[0]}</h2><p>${escapeHtml(row[2])}</p><p>${escapeHtml(row[3])}</p></section>`;}).join('')}<section><h2>Demo approval and update record</h2><p>All six simulated decisions approved revision ${state.revision}. SharePoint, HubSpot and Kantata updates were simulated and verified in the prototype. No external records were changed.</p><p>This summary is generated from structured sample data. It is not an imported or edited Word, Excel or PDF file.</p></section></html>`;
  const url=URL.createObjectURL(new Blob([text],{type:'text/html'}));
  const link=document.createElement('a');link.href=url;link.download=`Summit_Northstar_proposal_v${state.revision}.html`;
  document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
document.addEventListener('click', event => {
  if (!(event.target instanceof Element)) return;
  const button = event.target.closest('button');
  if (!button || button.disabled) return;
  if (button.dataset.scene !== undefined) return dispatch({type:'SCENE',index:Number(button.dataset.scene)});
  if (button.dataset.goto !== undefined) return dispatch({type:'SCENE',index:Number(button.dataset.goto)});
  if (button.dataset.owner) return dispatch({type:'SELECT_OWNER',id:button.dataset.owner});
  if (button.dataset.review) return dispatch({type:'SELECT_REVIEW',id:button.dataset.review});
  if (button.dataset.approve) return dispatch({type:'APPROVE',id:button.dataset.approve});
  if (button.id==='back') return dispatch({type:'SCENE',index:state.scene-1});
  if (button.id==='next') return dispatch({type:'SCENE',index:state.scene+1});
  if (button.id==='reset') return dispatch({type:'RESET'});
  if (button.dataset.action==='download') return download();
  const actions={change:'CHANGE',manual:'MANUAL',analyze:'ANALYZE',sync:'SYNC'};
  const type=actions[button.dataset.action];
  if(type)dispatch({type});
});
document.addEventListener('change', event => {
  if(event.target instanceof HTMLSelectElement && event.target.id==='fault') {
    dispatch({type:'FAULT',value:event.target.value});
    byId('fault').focus({preventScroll:true});
  }
});
document.addEventListener('keydown', event => {
  if (event.repeat||event.ctrlKey||event.metaKey||event.altKey||!(event.target instanceof Element)||event.target.closest('input,textarea,select,button,a,summary')||event.target.isContentEditable) return;
  if(event.key==='ArrowRight'){event.preventDefault();dispatch({type:'SCENE',index:state.scene+1});}
  if(event.key==='ArrowLeft'){event.preventDefault();dispatch({type:'SCENE',index:state.scene-1});}
});
function followHash(){const match=location.hash.match(/^#slide-(\d+)$/);state=transition(state,{type:'SCENE',index:match?Number(match[1])-1:0});render();}
window.addEventListener('hashchange',followHash);
followHash();
