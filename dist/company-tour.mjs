import { transition } from './company-model.mjs';

export const tourStops = [
 {scene:0, label:'Dana’s view'},
 {scene:1, label:'The research'},
 {scene:1, view:'stack', label:'Parkside’s AI stack'},
 {scene:2, view:'crowd', label:'All 150 people'},
 {scene:2, label:'Meet the company'},
 {scene:3, workspace:'priya', label:'Priya · Finance'},
 {scene:4, workspace:'marcus', label:'Marcus · Accounts'},
 {scene:4, workspace:'elena', label:'Elena · Coordination'},
 {scene:5, workspace:'leah', label:'Leah · Chief of staff'},
 {scene:7, view:'how', label:'How it works'},
 {scene:7, improvement:'nina', label:'The fix · Nina’s connected finding'},
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
