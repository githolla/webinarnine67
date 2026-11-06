import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState, people } from '../dist/company-model.mjs';
import { tourStops, enterTourStop, firstStopForScene } from '../dist/company-tour.mjs';
import { workspaceStories } from '../dist/company-workspaces.mjs';
import { renderScene } from '../dist/company-view.mjs';
import { renderWatch, renderBuildMap, renderPlan, fixCopy, fixCues, WATCH_LAST } from '../dist/company-fix.mjs';

test('guided path shows one person per verdict with their work already visible',()=>{
 let state=initialState();const seen=[];
 for(let i=0;i<tourStops.length;i++){
  state=enterTourStop(state,i);
  assert.doesNotMatch(renderScene(state),/undefined|NaN/);
  if(state.workspace){seen.push(state.workspace);assert.equal(state.workSteps[state.workspace],workspaceStories[state.workspace].max);}
 }
 assert.deepEqual(seen,['priya','marcus','elena','leah']);
 assert(people.every(person=>workspaceStories[person.id]),'every employee keeps a workspace for explore mode');
});
test('research follows the opening and connected graph follows the fix',()=>{
 assert.equal(tourStops[1].scene,1);
 assert.deepEqual(tourStops.map(s=>s.view).filter(Boolean),['stack','crowd','build','watch','plan']);
 const connected=tourStops.findIndex(stop=>stop.networkMode==='connected');
 assert(connected>tourStops.findIndex(stop=>stop.view==='watch'));
 assert.equal(enterTourStop(initialState(),connected).networkMode,'connected');
 assert.equal(tourStops.at(-1).scene,8);assert.equal(tourStops.at(-1).view,'plan');
});
test('fix screens show what gets built, where, and how, with no invented numbers',()=>{
 const outputs=[];
 for(let s=0;s<=WATCH_LAST;s++){
  const html=renderWatch(s);outputs.push(html);
  assert.doesNotMatch(html,/undefined|NaN|—/);
  assert.equal(/data-step-forward/.test(html),s<WATCH_LAST);
 }
 const last=outputs.at(-1);
 for(const id of ['HF-01','REC-07','T-41','CALL-12','Leah to confirm'])assert.match(last,new RegExp(id));
 assert.doesNotMatch(last,/Grok/);
 const build=renderBuildMap();
 for(const re of [/Parkside Work Register/,/Call Prep Coach/,/never connect them/,/proposes/,/approves/])assert.match(build,re);
 const plan=renderPlan();
 for(const re of [/Discover/,/Prioritize/,/Build/,/Measure/,/discovery/])assert.match(plan,re);
 const copy=JSON.stringify([fixCopy,fixCues]);
 assert.doesNotMatch(copy+build+plan,/new AI vendor/i);
 for(const html of [...outputs,build,plan,copy]){assert.doesNotMatch(html,/\d+ weeks?|\$\d+k|ROI/i);assert.doesNotMatch(html,/undefined|NaN|—/);}
});
test('tour navigation preserves review gates and never approves a build',()=>{
 let state=initialState();
 for(let index=0;index<tourStops.length;index++)state=enterTourStop(state,index);
 assert.equal(state.builds.priya.published,false);
 assert.equal(state.builds.elena.applied,false);
 assert.equal(state.builds.nina.published,false);
 for(const scene of new Set(tourStops.map(stop=>stop.scene)))assert.equal(tourStops[firstStopForScene(scene)].scene,scene);
 assert(tourStops.length<=13,'tour fits a 30-minute webinar');
});
test('company overview adds up to 150 people with most but not all using AI',async()=>{
 const { crowdTotals }=await import('../dist/company-view.mjs');
 const t=crowdTotals();const all=Object.values(t).reduce((a,b)=>a+b,0);
 assert.equal(all,150);assert.equal(all-t.none,128);assert(t.none>0);
});
