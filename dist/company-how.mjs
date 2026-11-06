import { personToken } from './company-view.mjs';
const keep=[
 {id:'nina',ai:'Ask Ops',work:'Teams',icon:'ms-teams.svg'},
 {id:'priya',ai:'Claude',work:'Excel',icon:'ms-excel.svg'},
 {id:'marcus',ai:'Call Prep Coach',work:'HubSpot',icon:'hubspot.svg',note:'Built from his technique'},
 {id:'ava',ai:'Copilot',work:'Zendesk',icon:'zendesk.svg'},
 {id:'leah',ai:'Copilot',work:'Outlook',icon:'ms-outlook.svg'}
];
const steps=[
 {n:'1',name:'Capture',text:'The finished result from approved systems: Teams, Excel, HubSpot, Zendesk.',note:'Never personal accounts or private chats.'},
 {n:'2',name:'Review',text:'A named owner checks it before it moves.',note:'Nothing is shared without a person.'},
 {n:'3',name:'Route',text:'Sent to the next person, inside the tool they already use.',note:'With one owner and one due date.'}
];
const lands=[
 {id:'marcus',icon:'hubspot.svg',text:'A note on the Northwind account in HubSpot'},
 {id:'elena',icon:'ms-excel.svg',text:'Tracker rows updated with owners and dates'},
 {id:'leah',icon:'ms-powerpoint.svg',text:'Friday briefing arrives already reconciled'},
 {ghost:true,icon:'ms-excel.svg',text:'Maya runs Priya’s method at her branch'}
];
const answers=[['New AI vendor?','No'],['Personal accounts connected?','Never'],['Who approves?','A named owner'],['What gets built?','Company tools + one Register']];
export function renderHow(){
 const left=keep.map(k=>`<li>${personToken(k.id,'S')}<div><b>${k.ai}</b><span><img src="assets/${k.icon}" alt="">Work lives in ${k.work}</span>${k.note?`<em class="hw-lock">${k.note}</em>`:''}</div></li>`).join('');
 const mid=steps.map(s=>`<li><i>${s.n}</i><div><b>${s.name}</b><p>${s.text}</p><small>${s.note}</small></div></li>`).join('');
 const right=lands.map(l=>`<li>${l.ghost?'<span class="hw-ghost" aria-hidden="true">M</span>':personToken(l.id,'S')}<p><img src="assets/${l.icon}" alt="">${l.text}</p></li>`).join('');
 return `<section class="hw"><div class="hw-cols"><article class="hw-card"><small>The company AI they already use</small><ul class="hw-keep">${left}</ul></article><span class="hw-arrow" aria-hidden="true">→</span><article class="hw-card hw-core"><small>Nine-67 connects the results</small><ol class="hw-steps">${mid}</ol></article><span class="hw-arrow" aria-hidden="true">→</span><article class="hw-card"><small>It lands where they already work</small><ul class="hw-lands">${right}</ul></article></div><ul class="hw-answers">${answers.map(([q,a])=>`<li><span>${q}</span><b>${a}</b></li>`).join('')}</ul></section>`;
}
