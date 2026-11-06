import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { initialState, transition, people } from '../dist/company-model.mjs';
import { renderScene, renderDetail, primaryAction, scenes, renderStack, renderCrowd, crowdByKind, viewCopy } from '../dist/company-view.mjs';
import { renderWorkspace, workspaceStories, weeklyUseList } from '../dist/company-workspaces.mjs';
test('nine scenes and every employee task render valid content and local assets',()=>{
 let state=initialState();
 for(let scene=0;scene<9;scene++){
  state=transition(state,{type:'SCENE',index:scene});
  const html=renderScene(state);assert.doesNotMatch(html,/undefined|NaN/);
  for(const match of html.matchAll(/(?:src|href)="(assets\/[^"]+)"/g))assert(existsSync('dist/'+match[1]),match[1]);
 }
 for(const p of people)for(let step=0;step<=workspaceStories[p.id].max;step++){
  const html=renderWorkspace({...initialState(),workspace:p.id,workSteps:{[p.id]:step}},p.id);
  assert.doesNotMatch(html,/undefined|NaN/);assert.match(html,/employee-strip/);assert.match(html,new RegExp(p.name));
  for(const match of html.matchAll(/src="(assets\/[^"]+)"/g))assert(existsSync('dist/'+match[1]),match[1]);
 }
 const shell=readFileSync('dist/live.html','utf8');assert.equal([...shell.matchAll(/data-scene="/g)].length,scenes.length);assert.match(shell,/presenter-menu/);
});
test('workspaces distinguish reusable automation, hidden context and practical support',()=>{
 const base=initialState();
 const priya=renderWorkspace({...base,workSteps:{priya:1}},'priya');assert.match(priya,/Claude helped build/);assert.match(priya,/Excel runs the saved transformation/);assert.match(priya,/Possible duplicate/);
 const ava=renderWorkspace({...base,workSteps:{ava:2}},'ava');assert.match(ava,/six records/);assert.match(ava,/COPILOT · AVA REVIEWS/);
 const elena=renderWorkspace({...base,workSteps:{elena:2}},'elena');assert.match(elena,/3:42 PM/);assert.match(elena,/Set clear goals/);
 const leah=renderWorkspace({...base,workSteps:{leah:2}},'leah');assert.match(leah,/Dana/);assert.match(leah,/summary|summary|brief/i);
});
test('peer reveals name who benefits without importing private chats',()=>{
 for(const id of ['ben','priya','nina','marcus']){
  const html=renderWorkspace({...initialState(),peer:id,workSteps:{[id]:workspaceStories[id].max}},id);assert.match(html,/WHO ELSE COULD USE THIS/);assert.match(html,/peer-task/);
 }
 assert.match(renderWorkspace({...initialState(),peer:'priya',workSteps:{priya:2}},'priya'),/Maya/);
 assert.match(renderWorkspace(initialState(),'marcus'),/Private chat stays private/);
});
test('research follows the CEO without introducing unseen employees or role play',()=>{
 const html=renderScene({...initialState(),scene:1});assert.match(html,/83%/);assert.match(html,/69%/);assert.match(html,/85%/);assert.match(html,/29%/);assert.doesNotMatch(html,/Priya|Ben|Leah|Nina/);
 assert.doesNotMatch(renderScene(initialState()),/Suuchi|role.play/i);
});
test('optional source review does not reveal the unrelated record before it is opened',()=>{
 const state=initialState();const detail=renderDetail(state,'supporting-cases');assert.match(detail.html,/source:CASE-218/);assert.doesNotMatch(detail.html,/unrelated|does not support|address correction.*exclude/i);
 assert.match(renderDetail(state,'source:CASE-218').html,/retained ownership/);
 const excluded=transition(state,{type:'EXCLUDE',id:'CASE-218'});assert.match(renderDetail(excluded,'supporting-cases').html,/Excluded/);assert.equal(excluded.builds.nina.published,false);
});
test('main path advances sections without repeated service status screens',()=>{
 for(let scene=0;scene<8;scene++)assert.equal(primaryAction({...initialState(),scene}).action,'next');
 assert.equal(primaryAction({...initialState(),scene:8}).action,'discovery');
 const offer=renderScene({...initialState(),scene:8});assert.match(offer,/Operations \+ IT/);assert.match(offer,/company-wide roadmap/);
});
test('stack and crowd tell the licensed, agent and personal story by construction',()=>{
 const stack=renderStack();assert.match(stack,/<b>3<\/b> company AI platforms/);assert.match(stack,/<b>4<\/b> department agents/);assert.match(stack,/<b>3<\/b> personal apps/);
 const kinds=crowdByKind();assert.equal(kinds.company,111);assert.equal(kinds.personal,17);assert.equal(kinds.company+kinds.personal,128);
 const crowd=renderCrowd();assert.match(crowd,/<b>111<\/b> mostly on company AI/);assert.match(crowd,/is-personal/);
 const marcus=renderWorkspace(initialState(),'marcus');assert.match(marcus,/from before the rollout/);assert.match(marcus,/Private chat stays private/);
 assert.doesNotMatch(weeklyUseList('priya'),/Personal account/);
 for(let scene=0;scene<9;scene++)assert.doesNotMatch(renderScene({...initialState(),scene}),/\u2014/);
 assert.doesNotMatch(stack+crowd+JSON.stringify(viewCopy),/\u2014/);
});
test('three discoveries open the people and the matching build',()=>{
 for(const [discovery,person] of [['reuse','priya'],['needs','elena'],['handoff','nina']]){
  const html=renderScene({...initialState(),scene:6,discovery});assert.match(html,new RegExp(`data-build="${person}"`));assert.match(html,/Dana’s adoption report/);assert.match(html,/data-workspace/);
 }
});
