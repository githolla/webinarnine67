import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState, people } from '../dist/company-model.mjs';
import { tourStops, enterTourStop, firstStopForScene } from '../dist/company-tour.mjs';
import { workspaceStories } from '../dist/company-workspaces.mjs';
import { renderScene } from '../dist/company-view.mjs';

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
test('research follows the opening and connected graph concludes the builds',()=>{
 assert.equal(tourStops[1].scene,1);
 const connected=tourStops.findIndex(stop=>stop.networkMode==='connected');
 assert(connected>tourStops.findIndex(stop=>stop.improvement==='nina'&&stop.scene===7));
 assert.equal(enterTourStop(initialState(),connected).networkMode,'connected');
 assert.equal(tourStops.at(-1).scene,8);
});
test('tour navigation preserves review gates and never approves a build',()=>{
 let state=initialState();
 for(let index=0;index<tourStops.length;index++)state=enterTourStop(state,index);
 assert.equal(state.builds.priya.published,false);
 assert.equal(state.builds.elena.applied,false);
 assert.equal(state.builds.nina.published,false);
 for(const scene of new Set(tourStops.map(stop=>stop.scene)))assert.equal(tourStops[firstStopForScene(scene)].scene,scene);
 assert(tourStops.length<=11,'tour fits a 30-minute webinar');
});
