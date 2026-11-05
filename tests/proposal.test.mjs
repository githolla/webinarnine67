import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { initialState, transition, numbers, owners, dependencies, approved, canApprove, allApproved, artifact } from '../dist/proposal-model.mjs';
import { renderScene, renderSidebar } from '../dist/proposal-view.mjs';
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
 state=transition(state,{type:'SYNC'});assert(state.ready);assert.deepEqual(Object.keys(state.writes),['SharePoint','HubSpot','Kantata']);
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
 let state=transition(initialState(),{type:'SCENE',index:4});assert.match(renderScene(state),/not ready yet/);assert.doesNotMatch(renderScene(state),/data-action="download"/);
 state=approveAll(setup());state=transition(state,{type:'SYNC'});state=transition(state,{type:'SCENE',index:4});assert.match(renderScene(state),/data-action="download"/);
 state=transition(state,{type:'RESET'});assert.deepEqual(state,initialState());
});
test('manual walkthrough counts illustrative effort without granting approval',()=>{
 let state=transition(initialState(),{type:'MANUAL'});assert.equal(state.manualCount,0);state=transition(state,{type:'CHANGE'});
 for(let i=0;i<9;i++)state=transition(state,{type:'MANUAL'});
 assert.equal(state.manualCount,6);assert.equal(state.ready,false);state.scene=2;assert.match(renderScene(state),/160 minutes/);assert.match(renderScene(state),/not measured ROI/);
});
test('all five scenes, five conversations and six approval views render with local assets',()=>{
 const variants=[initialState(),setup(),approveAll(setup()),transition(approveAll(setup()),{type:'SYNC'})];
 for(const state of variants){for(let scene=0;scene<5;scene++){
   const output=renderScene({...state,scene})+renderSidebar({...state,scene});assert.doesNotMatch(output,/undefined|NaN/);
   for(const match of output.matchAll(/src="(assets\/[^\"]+)"/g))assert(existsSync('dist/'+match[1]),match[1]);
 }}
 for(const owner of owners){const output=renderScene({...initialState(),selectedOwner:owner.id});assert.match(output,new RegExp(owner.file.replace('.','\\.')));assert.match(output,/WHAT TRAVELS WITH THIS OUTPUT/);}
 for(const id of Object.keys(dependencies)){assert.match(renderScene({...setup(),scene:3,selectedReview:id}),new RegExp(`data-approve="${id}"`));}
 const html=readFileSync('dist/live.html','utf8');assert.equal([...html.matchAll(/data-scene="/g)].length,5);
});
