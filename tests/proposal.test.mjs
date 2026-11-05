import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { initialState, transition, numbers, owners, dependencies, approved, canApprove, allApproved, artifact } from '../dist/proposal-model.mjs';
import { renderScene, renderSidebar, renderDetail, primaryAction } from '../dist/proposal-view.mjs';
function setup(){return transition(transition(initialState(),{type:'CHANGE'}),{type:'ANALYZE'});}
function approveAll(state){for(const id of Object.keys(dependencies))state=transition(state,{type:'APPROVE',id});return state;}
test('original contributions agree; a later requirement preserves those original artifacts',()=>{
 const original=initialState();const revised=setup();
 assert.equal(original.revision,1);assert.deepEqual(original.sites,['Austin']);assert.equal(revised.revision,2);
 for(const owner of owners){assert.deepEqual(artifact(revised,owner.id,true),artifact(original,owner.id));assert.match(artifact(revised,owner.id).join(' '),/Denver/);}
 assert.deepEqual(numbers(revised),{days:330,cost:495000,fee:810000,margin:'38.9',duration:90});
});
test('approval ordering enforces upstream evidence and same-revision decisions',()=>{
 let state=setup();assert.equal(canApprove(state,'finance'),false);
 state=transition(state,{type:'APPROVE',id:'finance'});assert.equal(approved(state,'finance'),false);
 state=transition(state,{type:'SYNC'});assert.equal(state.ready,false);assert.deepEqual(state.writes,{});
 for(const id of Object.keys(dependencies)){assert(canApprove(state,id));state=transition(state,{type:'APPROVE',id});assert(approved(state,id));}
 assert(allApproved(state));assert.equal(state.ready,false);
 const count=state.audit.length;state=transition(state,{type:'APPROVE',id:'leadership'});assert.equal(state.audit.length,count);
 state=transition(state,{type:'SYNC'});assert(state.ready);assert.deepEqual(Object.keys(state.writes),['SharePoint','HubSpot','Jira']);
});
test('partial write failure blocks release and safe retry does not duplicate completed writes',()=>{
 let state=approveAll(setup());state=transition(state,{type:'FAULT',value:'crm'});state=transition(state,{type:'SYNC'});
 assert.equal(state.ready,false);assert.deepEqual(state.writes,{SharePoint:2});assert.match(state.notice,/failed/);
 state=transition(state,{type:'FAULT',value:'none'});state=transition(state,{type:'SYNC'});assert(state.ready);
 assert.equal(state.audit.filter(event=>event.message.startsWith('SharePoint:')).length,1);
 const count=state.audit.length;state=transition(state,{type:'SYNC'});assert.equal(state.audit.length,count);
});
test('new source revision invalidates approval and requires a fresh review',()=>{
 let state=approveAll(setup());state=transition(state,{type:'FAULT',value:'revision'});state=transition(state,{type:'SYNC'});
 assert.equal(state.revision,3);assert.equal(state.ready,false);assert.equal(state.analyzed,false);assert.deepEqual(state.approvals,{});assert.deepEqual(state.writes,{});
 assert.equal(canApprove(state,'sales'),false);assert.match(state.notice,/invalidated/);
 state=transition(state,{type:'ANALYZE'});state=approveAll(state);state=transition(state,{type:'SYNC'});assert(state.ready);
 assert.equal(numbers(state).fee,870000);
});
test('navigation cannot bypass readiness and reset clears the demonstration',()=>{
 let state=transition(initialState(),{type:'SCENE',index:4});assert.match(renderScene(state),/final packet still needs its decisions/);assert.doesNotMatch(renderScene(state),/data-action="download"/);
 state=approveAll(setup());state=transition(state,{type:'SYNC'});state=transition(state,{type:'SCENE',index:4});assert.match(renderScene(state),/data-action="download"/);
 state=transition(state,{type:'RESET'});assert.deepEqual(state,initialState());
});
test('manual walkthrough carries evidence without granting approval',()=>{
 let state=transition(initialState(),{type:'MANUAL'});assert.equal(state.manualCount,0);state=transition(state,{type:'CHANGE'});
 for(let i=0;i<9;i++)state=transition(state,{type:'MANUAL'});
 assert.equal(state.manualCount,6);assert.equal(state.ready,false);state.scene=2;assert.equal([...renderScene(state).matchAll(/data-detail="handoff:/g)].length,4);const detail=renderDetail(state,'handoff:3').html;assert.match(detail,/Leah → Leadership/);assert.doesNotMatch(detail,/Leah → Leah/);assert.match(detail,/Reconstruct the approval trail/);assert.deepEqual(state.approvals,{});
});
test('all five scenes and inspectable conversations render with local assets',()=>{
 const variants=[initialState(),setup(),approveAll(setup()),transition(approveAll(setup()),{type:'SYNC'})];
 for(const state of variants){for(let scene=0;scene<5;scene++){
   const output=renderScene({...state,scene})+renderSidebar({...state,scene});assert.doesNotMatch(output,/undefined|NaN/);
   for(const match of output.matchAll(/src="(assets\/[^\"]+)"/g))assert(existsSync('dist/'+match[1]),match[1]);
 }}
 for(const owner of owners){const detail=renderDetail(initialState(),`ai:${owner.id}`);assert.match(detail.html,new RegExp(owner.file.replace('.','\\.')));assert.match(detail.html,/Illustrative conversation/);assert.equal([...detail.html.matchAll(/class="chat-turn/g)].length,4);}
 assert.equal(primaryAction({...setup(),scene:3}).action,'run');
 assert.equal(primaryAction({...approveAll(setup()),scene:3}).action,'release');
 const html=readFileSync('dist/live.html','utf8');assert.equal([...html.matchAll(/data-scene="/g)].length,5);
});


test('recorded playback waits for a known analyzed change and never approves leadership',()=>{
 let state=transition(initialState(),{type:'START_RUN'});assert.equal(state.playing,false);assert.equal(state.runPhase,'idle');
 state=transition(state,{type:'CHANGE'});state=transition(state,{type:'START_RUN'});assert.equal(state.playing,false);
 state=transition(state,{type:'ANALYZE'});state=transition(state,{type:'START_RUN'});assert.equal(state.playing,true);assert.equal(state.runPhase,'running');
 for(const [index,owner] of owners.entries()){
   state=transition(state,{type:'RUN_STEP'});
   assert.deepEqual(Object.keys(state.approvals),owners.slice(0,index+1).map(row=>row.id));
   assert.equal(state.runStep,index+1);assert.equal(state.selectedReview,owner.id);
   assert.equal(approved(state,'leadership'),false);
 }
 assert.equal(state.playing,false);assert.equal(state.runPhase,'review');assert.equal(allApproved(state),false);
 assert.equal(state.audit.filter(event=>event.message.startsWith('Simulated recorded human response:')).length,5);
 const completed=structuredClone(state);state=transition(state,{type:'RUN_STEP'});assert.deepEqual(state,completed);
 state=transition(state,{type:'SYNC'});assert.equal(state.ready,false);assert.deepEqual(state.writes,{});
 state=transition(state,{type:'APPROVE',id:'leadership'});state=transition(state,{type:'SYNC'});
 assert.equal(state.ready,true);assert.equal(state.runPhase,'complete');assert.equal(state.writes.Jira,2);
});
test('pause and resume preserve decisions without duplicating recorded responses',()=>{
 let state=transition(setup(),{type:'START_RUN'});state=transition(state,{type:'RUN_STEP'});
 state=transition(state,{type:'PAUSE_RUN'});assert.equal(state.playing,false);assert.equal(state.runPhase,'paused');
 const paused=structuredClone(state);state=transition(state,{type:'RUN_STEP'});assert.deepEqual(state,paused);
 state=transition(state,{type:'START_RUN'});assert.equal(state.runStep,1);assert.equal(state.selectedReview,'delivery');
 for(let index=0;index<4;index++)state=transition(state,{type:'RUN_STEP'});
 const events=state.audit.length;state=transition(state,{type:'START_RUN'});state=transition(state,{type:'RUN_STEP'});
 assert.equal(state.runPhase,'review');assert.equal(state.playing,false);assert.equal(state.audit.length,events);
 assert.equal(state.audit.filter(event=>event.message.includes('Leah (Sales')).length,1);
 state=transition(state,{type:'RESET'});assert.equal(state.runStep,0);assert.equal(state.playing,false);assert.equal(state.runPhase,'idle');
});
test('playback preserves approvals made before or during the run',()=>{
 let state=transition(setup(),{type:'APPROVE',id:'sales'});state=transition(state,{type:'START_RUN'});
 assert.equal(state.runStep,1);state=transition(state,{type:'RUN_STEP'});assert.equal(approved(state,'delivery'),true);
 state=transition(state,{type:'APPROVE',id:'finance'});assert.equal(state.runStep,3);
 state=transition(state,{type:'RUN_STEP'});assert.equal(state.selectedReview,'legal');
 state=transition(state,{type:'APPROVE',id:'marketing'});assert.equal(state.runPhase,'review');assert.equal(state.playing,false);
 assert.equal(state.audit.filter(event=>event.message.startsWith('Simulated recorded human response:')).length,2);
});
test('faults after playback preserve release gates and a new revision clears playback',()=>{
 let state=transition(setup(),{type:'START_RUN'});for(let index=0;index<5;index++)state=transition(state,{type:'RUN_STEP'});
 state=transition(state,{type:'APPROVE',id:'leadership'});state=transition(state,{type:'FAULT',value:'crm'});state=transition(state,{type:'SYNC'});
 assert.equal(state.ready,false);assert.equal(state.playing,false);assert.equal(state.runPhase,'review');assert.deepEqual(state.writes,{SharePoint:2});
 state=transition(state,{type:'FAULT',value:'revision'});state=transition(state,{type:'SYNC'});
 assert.equal(state.revision,3);assert.equal(state.playing,false);assert.equal(state.runPhase,'idle');assert.equal(state.runStep,0);assert.deepEqual(state.approvals,{});assert.deepEqual(state.writes,{});
 state=transition(state,{type:'START_RUN'});assert.equal(state.playing,false);
 state=transition(state,{type:'ANALYZE'});state=transition(state,{type:'START_RUN'});for(let index=0;index<5;index++)state=transition(state,{type:'RUN_STEP'});
 assert.equal(approved(state,'leadership'),false);assert.equal(state.runPhase,'review');
});

test('new revisions keep displayed handoffs, AI conversations and final commitment consistent',()=>{
 let state=transition(transition(approveAll(setup()),{type:'FAULT',value:'revision'}),{type:'SYNC'});
 for(let manualCount=0;manualCount<4;manualCount++){
  const html=renderScene({...state,scene:2,manualCount});assert.doesNotMatch(html,/\$810,000|38\.9%|v2|Leah → Leah/);
 }
 for(const owner of owners){const html=renderDetail({...state,scene:3},`ai:${owner.id}`).html;assert.doesNotMatch(html,/\$810,000|38\.9%|v2|330 consultant|30 additional consultant/);}
 state=transition(transition(state,{type:'ANALYZE'}),{type:'START_RUN'});
 for(let i=0;i<5;i++){
  state=transition(state,{type:'RUN_STEP'});const html=renderScene({...state,scene:3});assert.doesNotMatch(html,/\$810,000|38\.9%|v2/);
  if(i===1)assert.match(html,/60 consultant-days/);
  if(i===2){assert.match(html,/\$870,000/);assert.match(html,/37\.9%/);}
 }
 assert.equal(approved(state,'leadership'),false);assert.equal(state.ready,false);
 state=transition(transition(state,{type:'APPROVE',id:'leadership'}),{type:'SYNC'});
 const final=renderScene({...state,scene:4});assert.match(final,/3 locations/);assert.match(final,/Additional site 3/);assert.doesNotMatch(final,/both locations|Two locations/);
});
test('opening original contributions after the change retains their original context',()=>{
 for(const owner of owners){const html=renderDetail({...setup(),scene:0},`ai:${owner.id}`).html;assert.match(html,/Original requirement/);assert.doesNotMatch(html,/Denver|\$810,000/);}
 assert.doesNotMatch(renderDetail(initialState(),'ai:sales').html,/handoff to Leah/);
});

test('presentation path keeps optional detail out of the main sequence',()=>{
 let state=transition(initialState(),{type:'CHANGE'});
 assert.equal(primaryAction({...state,scene:2}).action,'next');
 assert.equal(primaryAction({...state,scene:3}).action,'run');
 state=transition(state,{type:'ANALYZE'});state=transition(state,{type:'START_RUN'});
 assert.equal(primaryAction({...state,scene:3}).action,'advance-run');
 for(let index=0;index<5;index++)state=transition(state,{type:'RUN_STEP'});
 assert.equal(primaryAction({...state,scene:3}).action,'release');
 assert.equal(state.ready,false);assert.equal(approved(state,'leadership'),false);
 for(let index=0;index<4;index++)assert.doesNotMatch(renderDetail(state,`handoff:${index}`).html,/undefined|NaN/);
});
