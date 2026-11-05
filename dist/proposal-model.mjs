export const owners = [
  { id: 'sales', name: 'Leah', department: 'Sales · Proposal owner', ai: 'ChatGPT', icon: 'openai.svg', system: 'HubSpot', systemIcon: 'hubspot.svg', file: 'Client_brief.docx', format: 'Word', deliverable: 'Scope and client needs', minutes: 12 },
  { id: 'delivery', name: 'Sam', department: 'Delivery', ai: 'Copilot', icon: 'copilot.webp', system: 'Jira', systemIcon: 'jira.svg', file: 'Staffing_plan.docx', format: 'Word', deliverable: 'Staffing and timeline', minutes: 18 },
  { id: 'finance', name: 'Priya', department: 'Finance', ai: 'ChatGPT', icon: 'openai.svg', system: 'Excel', systemIcon: 'ms-excel.svg', file: 'Pricing_model.xlsx', format: 'Excel', deliverable: 'Pricing and margin', minutes: 15 },
  { id: 'legal', name: 'Alex', department: 'Legal', ai: 'Claude', icon: 'claude.svg', system: 'Word', systemIcon: 'ms-word.svg', file: 'Engagement_terms.pdf', format: 'PDF', deliverable: 'Terms and risks', minutes: 14 },
  { id: 'marketing', name: 'Maya', department: 'Marketing', ai: 'Copilot', icon: 'copilot.webp', system: 'SharePoint', systemIcon: 'ms-sharepoint.svg', file: 'Executive_summary.docx', format: 'Word', deliverable: 'Summary and proposal assembly', minutes: 10 }
];
export const dependencies = { sales: [], delivery: ['sales'], finance: ['delivery'], legal: ['sales', 'finance'], marketing: ['delivery', 'finance', 'legal'], leadership: ['sales', 'delivery', 'finance', 'legal', 'marketing'] };
export const manualSteps = [
  { title: 'Collect the latest files', minutes: 15, tools: 'Teams → SharePoint → Downloads', detail: 'Leah asks five people which version is current, downloads their files, and creates a working folder. Each original file correctly covers Austin.' },
  { title: 'Translate the new requirement into handoffs', minutes: 25, tools: 'Outlook → HubSpot → Teams', detail: 'Leah records Denver and asks Sam for the extra staffing, Priya for the fee impact, Alex for the revised terms, and Maya to hold the final summary.' },
  { title: 'Reconcile delivery and finance replies', minutes: 40, tools: 'Jira → Excel → Teams', detail: 'Sam confirms 30 additional consultant-days. Priya initially has the correct original Austin model. Leah carries Sam’s new estimate into the pricing conversation: +$45,000 cost and +$60,000 fee.' },
  { title: 'Carry the approved assumptions into legal', minutes: 20, tools: 'Excel → Word → Email', detail: 'Leah copies the two-location scope, $810,000 fee and unchanged 90-day duration into Alex’s review request, then follows up for the updated terms.' },
  { title: 'Assemble one consistent proposal', minutes: 25, tools: 'Word → SharePoint → PDF', detail: 'Leah sends Maya the latest staffing, price and terms, checks the summary against them, and replaces the previous proposal version.' },
  { title: 'Build the approval packet and chase sign-off', minutes: 35, tools: 'SharePoint → Teams → Email', detail: 'Leah documents who approved which version, routes the combined proposal to leadership, and follows up. The final release still needs a recorded leadership decision.' }
];
export function initialState() {
  return { scene: 0, selectedOwner: 'sales', changed: false, analyzed: false, revision: 1, sites: ['Austin'], manualCount: 0, selectedReview: 'sales', approvals: {}, writes: {}, audit: [], fault: 'none', ready: false, notice: '', playing: false, runPhase: 'idle', runStep: 0 };
}
export function numbers(state) {
  const extra = state.sites.length - 1;
  const days = 300 + extra * 30;
  const cost = 450000 + extra * 45000;
  const fee = 750000 + extra * 60000;
  return { days, cost, fee, margin: ((fee - cost) / fee * 100).toFixed(1), duration: 90 };
}
export function approved(state, id) { return state.approvals[id] === state.revision; }
export function canApprove(state, id) {
  return state.changed && state.analyzed && Object.hasOwn(dependencies, id) && !approved(state, id) && dependencies[id].every(key => approved(state, key));
}
export function allApproved(state) { return Object.keys(dependencies).every(id => approved(state, id)); }
function log(state, message) { state.audit.push({ sequence: state.audit.length + 1, revision: state.revision, message }); }
export function transition(current, action) {
  const state = structuredClone(current);
  switch (action.type) {
    case 'SCENE': state.scene = Math.max(0, Math.min(4, action.index)); break;
    case 'SELECT_OWNER': if (owners.some(owner => owner.id === action.id)) state.selectedOwner = action.id; break;
    case 'CHANGE':
      if (!state.changed) {
        state.changed = true; state.revision = 2; state.sites = ['Austin', 'Denver'];
        log(state, 'Client email received: add Denver, retain 90 days, show additional cost. Original deliverables remain valid for revision 1.');
      }
      break;
    case 'MANUAL': if (state.changed && state.manualCount < manualSteps.length) state.manualCount++; break;
    case 'ANALYZE':
      if (state.changed && !state.analyzed) {
        state.analyzed = true;
        log(state, `Matched requirement revision ${state.revision} to five deliverables; routed affected sections to their owners.`);
      }
      break;
    case 'START_RUN':
      if (!state.changed || !state.analyzed || state.ready) break;
      state.runStep = owners.filter(owner => approved(state, owner.id)).length;
      state.playing = state.runStep < owners.length;
      state.runPhase = state.playing ? 'running' : 'review';
      if (state.playing) state.selectedReview = owners.find(owner => canApprove(state, owner.id)).id;
      break;
    case 'RUN_STEP': {
      if (!state.playing || !state.changed || !state.analyzed || state.ready) break;
      const owner = owners.find(candidate => canApprove(state, candidate.id));
      if (owner) {
        state.approvals[owner.id] = state.revision;
        state.selectedReview = owner.id;
        log(state, `Simulated recorded human response: ${owner.name} (${owner.department}) approved revision ${state.revision}; dependent work can continue.`);
      }
      state.runStep = owners.filter(candidate => approved(state, candidate.id)).length;
      if (state.runStep === owners.length) {
        state.playing = false;
        state.runPhase = 'review';
      } else if (!owner) {
        state.playing = false;
        state.runPhase = 'paused';
      }
      break;
    }
    case 'PAUSE_RUN':
      if (state.playing) { state.playing = false; state.runPhase = 'paused'; }
      break;
    case 'SELECT_REVIEW': if (Object.hasOwn(dependencies, action.id)) state.selectedReview = action.id; break;
    case 'APPROVE':
      if (canApprove(state, action.id)) {
        state.approvals[action.id] = state.revision;
        state.runStep = owners.filter(owner => approved(state, owner.id)).length;
        if (state.runStep === owners.length) { state.playing = false; state.runPhase = 'review'; }
        log(state, `${action.id === 'leadership' ? 'Leadership' : owners.find(owner => owner.id === action.id).name} approved revision ${state.revision}; dependent review steps unlocked.`);
      }
      break;
    case 'FAULT': if (['none', 'crm', 'revision'].includes(action.value)) state.fault = action.value; break;
    case 'SYNC':
      if (!allApproved(state) || state.ready) break;
      state.playing = false;
      if (state.fault === 'revision') {
        state.revision++; state.sites.push(`Additional site ${state.sites.length + 1}`);
        state.approvals = {}; state.writes = {}; state.analyzed = false; state.fault = 'none';
        state.runPhase = 'idle'; state.runStep = 0;
        state.notice = 'A new client revision arrived before release. Approvals were invalidated. Trace the updated requirement and review the affected documents again.';
        log(state, 'Source revision changed before write. Release stopped; prior decisions retained in the audit trail.');
        break;
      }
      for (const destination of ['SharePoint', 'HubSpot', 'Jira']) {
        if (state.writes[destination] === state.revision) continue;
        if (destination === 'HubSpot' && state.fault === 'crm') {
          state.notice = 'Simulated HubSpot update failed. SharePoint is saved; client release remains blocked. Select “No fault” and retry to continue without repeating completed writes.';
          log(state, 'HubSpot write failed. Partial state recorded; no ready-to-send confirmation issued.');
          return state;
        }
        state.writes[destination] = state.revision;
        log(state, `${destination}: simulated update saved and read back for revision ${state.revision}.`);
      }
      state.ready = true; state.runPhase = 'complete'; state.notice = 'All required approvals and simulated writes verified. Leah can review the final proposal and client email.';
      log(state, 'Proposal ready for Leah’s final send review. No client message has been sent.');
      break;
    case 'RESET': return initialState();
  }
  return state;
}
export const money = value => '$' + value.toLocaleString('en-US');
export function artifact(state, id, original = false) {
  original = original || !state.changed;
  const n = numbers(original ? initialState() : state);
  const sites = original ? ['Austin'] : state.sites;
  const revision = original ? 1 : state.revision;
  const facts = `Revision ${revision} · ${sites.join(' + ')} · 90 days`;
  const outputs = {
    sales: [`Client requirements`, facts, `Northstar Distribution requests a 90-day operational improvement engagement covering ${sites.join(' and ')}.`, `Deliverables: diagnostic, process redesign, implementation support and executive readout. ${original ? 'Initial opportunity value: $750,000.' : 'Additional site cost is explicitly requested; final fee requires approval.'}`],
    delivery: ['Staffing and timeline', facts, `${n.days} consultant-days across the engagement. Days 1–20: diagnostic. Days 21–50: design. Days 51–90: implementation and handover.`, original ? 'Austin staffing baseline approved locally. Delivery review complete for the original requirement.' : `${n.days - 300} additional consultant-days support parallel site work. Sam validates staffing availability before approval; the 90-day duration depends on that approved allocation.`],
    finance: ['Pricing and margin', facts, `Professional fee: ${money(n.fee)}. Delivery cost: ${money(n.cost)}. Gross margin: ${n.margin}%.`, `Illustrative commercial model: ${original ? '300 consultant-days at $1,500 loaded cost.' : 'Each added location requires 30 days, $45,000 cost and $60,000 additional fee.'} Margin is calculated as (fee − delivery cost) ÷ fee.`],
    legal: ['Engagement terms', facts, `Scope: ${sites.join(' and ')}. Professional fee: ${money(n.fee)}. Duration: 90 days from agreed kickoff.`, 'Client access and staffing dependencies are stated in the engagement terms. Further scope changes require a written amendment. Alex reviews the revised commercial commitments before approving.'],
    marketing: ['Executive summary', facts, `Summit Advisory Group proposes a 90-day operational improvement engagement for Northstar Distribution across ${sites.join(' and ')}.`, `The ${money(n.fee)} proposal combines the approved scope, delivery plan, commercial model and engagement terms. Maya assembles the final narrative after upstream decisions are recorded.`]
  };
  return outputs[id];
}
