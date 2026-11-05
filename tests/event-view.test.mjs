import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { initialState, transition } from '../dist/event-model.mjs';
import { renderScene, renderDetail, primaryAction } from '../dist/event-view.mjs';
function approve(state){for(let i=0;i<3;i++)state=transition(state,{type:'REVIEW'});return state;}
test('the visible path includes three AI workspaces and cannot confirm before release',()=>{
 let state=initialState();assert.match(renderScene(state),/120 to 160 guests/);
 state=transition(state,{type:'NEXT_SCENE'});
 for(let person=0;person<3;person++){state=transition(state,{type:'PERSON',index:person});const html=renderScene(state);assert.match(html,/chat-result/);assert.match(html,/SAVED IN THEIR OWN SYSTEM/);assert.equal(primaryAction(state).action,person<2?'next-person':'next');}
 state=transition(state,{type:'SCENE',index:4});assert.match(renderScene(state),/still needs approval/);assert.doesNotMatch(renderScene(state),/Simulated updates verified/);
 state=transition(approve(state),{type:'RELEASE'});assert.match(renderScene(state),/\$580/);assert.match(renderScene(state),/\$2,100/);assert.match(renderScene(state),/draft · Not sent/);
});
test('all active scenes and optional details render valid local assets',()=>{
 const initial=initialState();const ready=transition(approve(initial),{type:'RELEASE'});
 for(const state of [initial,ready])for(let scene=0;scene<5;scene++){
  const html=renderScene({...state,scene});assert.doesNotMatch(html,/undefined|NaN/);
  for(const match of html.matchAll(/src="(assets\/[^\"]+)"/g))assert(existsSync('dist/'+match[1]),match[1]);
 }
 for(const key of ['sam','dana','build','exceptions','assessment','about'])assert.doesNotMatch(renderDetail(initial,key).html,/undefined|NaN/);
 const html=readFileSync('dist/live.html','utf8');assert.match(html,/event-demo\.mjs/);assert.doesNotMatch(html,/proposal-demo\.mjs/);
});
test('revision changes flow through connected quantities, total and customer confirmation',()=>{
 let state=approve(initialState());state=transition(state,{type:'FAULT',value:'revision'});state=transition(state,{type:'RELEASE'});
 const html=renderScene({...state,scene:3});assert.match(html,/60 chairs \+ 15 tables/);assert.match(html,/\$2,300/);assert.match(html,/PROPOSED ORDER/);
 state=transition(approve(state),{type:'RELEASE'});const final=renderScene({...state,scene:4});assert.match(final,/180 chairs and 45 tables/);assert.match(final,/\$780/);assert.match(final,/\$2,300/);
});
