import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { initialState, transition, people, summary } from '../dist/company-model.mjs';
import { renderScene, renderDetail, primaryAction } from '../dist/company-view.mjs';
function review(state=initialState()) {
 state=transition(state,{type:'EXCLUDE',id:'CASE-218'});
 return transition(state,{type:'APPROVE_FINDING'});
}
test('nine scenes preserve all nine workspaces and valid source links',()=>{
 for(const state of [initialState(),review()])for(let scene=0;scene<9;scene++)for(const person of people){
  const html=renderScene({...state,scene,person:person.id});
  assert.doesNotMatch(html,/undefined|NaN/);
  for(const match of html.matchAll(/src="(assets\/[^\"]+)"/g))assert(existsSync('dist/'+match[1]),match[1]);
 }
 for(const person of people){const html=renderDetail(initialState(),'workspace:'+person.id).html;assert.match(html,new RegExp(person.ai));assert.match(html,/source-strip/);assert.match(html,/quote-caption/);}
 const nina=renderDetail(initialState(),'workspace:nina').html;assert.match(nina,/source:CASE-201/);assert.doesNotMatch(nina,/source:CASE-211/);
 const shell=readFileSync('dist/live.html','utf8');assert.match(shell,/company-demo\.mjs/);assert.equal([...shell.matchAll(/data-scene="/g)].length,6);
});
test('private AI work becomes context only through authorized business records',()=>{
 const marcus=renderDetail(initialState(),'workspace:marcus').html;assert.match(marcus,/No customer names/);
 let state=transition(review(),{type:'ASSIGN'});state=transition(state,{type:'PILOT_VIEW',view:'crm'});
 let html=renderScene({...state,scene:7});assert.match(html,/No private Grok conversation is imported/);assert.match(html,/Nina/);assert.match(html,/Tuesday/);
 state=transition(state,{type:'RECORD_ACCOUNT_OBSERVATION'});html=renderScene({...state,scene:7});assert.match(html,/Saved to the account/);
 state=transition(state,{type:'PILOT_VIEW',view:'executive'});html=renderScene({...state,scene:7});assert.match(html,/Marcus’s observation attached/);
});
test('source review changes the shared case count and blocks premature publication',()=>{
 let state={...initialState(),scene:7};assert.equal(primaryAction(state).action,'outlier');
 assert.match(renderScene({...state,pilotView:'crm'}),/No reviewed finding/);assert.match(renderScene({...state,pilotView:'executive'}),/No reviewed finding/);
 assert.match(renderDetail(state,'source:CASE-218').html,/address correction/);
 state=transition(state,{type:'EXCLUDE',id:'CASE-218'});assert.equal(primaryAction(state).action,'approve');
 state=transition(state,{type:'APPROVE_FINDING'});assert.match(renderScene(state),/7 reviewed cases · 3 accounts/);assert.match(renderScene(state),/reviewed-label">Excluded/);
 assert.equal(primaryAction(state).action,'assign');
});
test('source dialogs enforce CRM and executive evidence scope',()=>{
 const state={...review(),scene:7};
 assert.match(renderDetail({...state,pilotView:'crm'},'source:CASE-201').html,/receiving service-owner/);
 assert.match(renderDetail({...state,pilotView:'crm'},'source:CASE-204').html,/only its permitted/);
 assert.match(renderDetail({...state,pilotView:'executive'},'source:CASE-204').html,/receiving service owner/);
 assert.match(renderDetail({...state,pilotView:'executive'},'source:CASE-202').html,/only its permitted/);
 assert.match(renderDetail({...state,pilotView:'executive'},'evidence').html,/source:CASE-206/);
});
test('approved count is derived when the reviewer excludes additional cases',()=>{
 let state=transition(initialState(),{type:'EXCLUDE',id:'CASE-201'});state=review(state);
 const html=renderScene({...state,scene:7});assert.equal(summary(state).caseCount,6);assert.match(html,/6 cases reviewed/);assert.doesNotMatch(html,/7 cases reviewed/);
});
test('the pilot ends with a measured next step rather than a false resolution',()=>{
 let state=transition(review(),{type:'ASSIGN'});state=transition(state,{type:'PILOT_VIEW',view:'crm'});state=transition(state,{type:'RECORD_ACCOUNT_OBSERVATION'});state=transition(state,{type:'PILOT_VIEW',view:'executive'});state=transition(state,{type:'START_INVESTIGATION'});state=transition(state,{type:'UPDATE_PROGRESS'});
 const html=renderScene({...state,scene:7});assert.match(html,/change being tested/);assert.match(html,/Outcome not yet established/);assert.equal(primaryAction({...state,scene:7}).action,'next');
 const offer=renderScene({...state,scene:8});assert.match(offer,/Operations \+ IT/);assert.match(offer,/company-wide roadmap/);assert.match(offer,/AI Workflow Discovery Session/);
});
