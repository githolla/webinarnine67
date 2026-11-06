import { transition } from './company-model.mjs';

export const tourStops = [
 {scene:0, label:'Dana’s view'},
 {scene:1, label:'The research'},
 {scene:2, label:'Meet the company'},
 {scene:2, workspace:'dana', label:'Dana · CEO'},
 {scene:2, workspace:'daniel', label:'Daniel · IT'},
 {scene:3, workspace:'ben', label:'Ben · Sales'},
 {scene:3, workspace:'priya', label:'Priya · Finance'},
 {scene:3, workspace:'nina', label:'Nina · Operations'},
 {scene:4, workspace:'ava', label:'Ava · Service'},
 {scene:4, workspace:'elena', label:'Elena · Coordination'},
 {scene:4, workspace:'marcus', label:'Marcus · Accounts'},
 {scene:5, workspace:'leah', label:'Leah · Chief of staff'},
 {scene:6, discovery:'reuse', label:'Discover a reusable method'},
 {scene:6, discovery:'needs', label:'Discover different needs'},
 {scene:6, discovery:'handoff', label:'Discover a missing connection'},
 {scene:7, improvement:'priya', label:'Build · Priya’s reusable workflow'},
 {scene:7, improvement:'elena', label:'Build · Elena’s guided tracker'},
 {scene:7, improvement:'nina', label:'Build · Nina’s connected finding'},
 {scene:2, networkMode:'connected', improvement:'nina', label:'See the connected company'},
 {scene:8, label:'Where to start'}
];

export function enterTourStop(current, index) {
 const stop=tourStops[index];
 if(!stop)return current;
 let state=transition(current,{type:'SCENE',index:stop.scene});
 state={...state,workspace:null};
 if(stop.networkMode)state=transition(state,{type:'NETWORK_MODE',mode:stop.networkMode});
 if(stop.discovery)state=transition(state,{type:'DISCOVERY',id:stop.discovery});
 if(stop.improvement)state=transition(state,{type:'IMPROVEMENT',id:stop.improvement});
 if(stop.workspace){
  state=transition(state,{type:'WORKSPACE',id:stop.workspace});
  state=transition(state,{type:'WORK_REVEAL',id:stop.workspace});
 }
 return state;
}

export function firstStopForScene(scene) {
 return Math.max(0,tourStops.findIndex(stop=>stop.scene===scene));
}
