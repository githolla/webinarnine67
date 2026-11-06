export const people = [
  { id: 'ava', name: 'Ava', department: 'Customer Service', ai: 'Copilot', system: 'Outlook', icon: 'copilot.webp' },
  { id: 'ben', name: 'Ben', department: 'Head of Sales', ai: 'Copilot', system: 'Excel', icon: 'copilot.webp' },
  { id: 'nina', name: 'Nina', department: 'Operations', ai: 'Ask Ops', system: 'Teams', icon: 'ms-teams.svg' },
  { id: 'marcus', name: 'Marcus', department: 'Account Manager', ai: 'Grok', system: 'Personal phone' },
  { id: 'daniel', name: 'Daniel', department: 'IT', ai: 'Internal assistant', system: 'Company documents' },
  { id: 'suuchi', name: 'Suuchi', department: 'CEO (role-play)', ai: 'Claude', system: 'Friday department updates', icon: 'claude.svg' }
];
const candidateRows = [
  ['CASE-201', 'Northwind', 'Implementation handoff has no receiving owner'],
  ['CASE-202', 'Northwind', 'Customer repeated setup details after reassignment'],
  ['CASE-203', 'Northwind', 'Service follow-up waiting for implementation context'],
  ['CASE-204', 'Brightline', 'Handoff completed without a named service owner'],
  ['CASE-205', 'Brightline', 'Account team chased the next implementation step'],
  ['CASE-206', 'Cedar', 'Customer followed up after an internal reassignment'],
  ['CASE-207', 'Cedar', 'Implementation notes did not reach the service owner'],
  ['CASE-218', 'Cedar', 'Shipping address correction delayed a replacement']
];
const caseDescriptions = {
  'CASE-201': 'The implementation team marked its setup task complete. The receiving service-owner field was empty, and the customer asked who would handle the next step.',
  'CASE-202': 'After reassignment from Implementation to Service, the customer was asked to repeat setup details already supplied. The receiving team had not been given the previous case context.',
  'CASE-203': 'A service follow-up was waiting for the implementation notes. Both teams had completed their individual tasks, but neither record named the owner of the customer update.',
  'CASE-204': 'The handoff checklist was marked complete without a receiving service owner. The customer followed up for a named point of contact.',
  'CASE-205': 'The account team asked Operations and Service who should send the next implementation update. Each team had recorded its own completed step.',
  'CASE-206': 'The customer followed up after an internal reassignment. The case history showed two completed departmental tasks and no agreed owner for the next reply.',
  'CASE-207': 'Implementation notes were saved in the source task but were not linked to the receiving service case. The service owner asked for the same background again.',
  'CASE-218': 'A replacement shipment was delayed because the customer requested a shipping-address correction. Fulfillment confirmed the corrected address and retained ownership. This case does not describe a transfer between teams.'
};
const executiveSourceIds = ['CASE-201', 'CASE-204', 'CASE-206'];
export const cases = Object.freeze([
  ...candidateRows.map(([id, account, title]) => Object.freeze({ id, account, title, description: caseDescriptions[id], category: 'handoff', candidate: true, relevant: id !== 'CASE-218', source: 'Service case record', version: 1 })),
  ...Array.from({ length: 6 }, (_, index) => Object.freeze({ id: `CASE-${208 + index}`, account: index % 2 ? 'Cedar' : 'Brightline', title: ['Invoice clarification', 'Billing adjustment', 'Payment reference question'][index % 3], description: 'The service record concerns a billing question handled by the billing team. It is outside the proposed ownership-handoff finding.', category: 'billing', candidate: false, relevant: false, source: 'Service case record', version: 1 })),
  ...Array.from({ length: 4 }, (_, index) => Object.freeze({ id: `CASE-${214 + index}`, account: index % 2 ? 'Cedar' : 'Brightline', title: ['Account access request', 'Login reset'][index % 2], description: 'The service record concerns an account-access request handled by the access team. It is outside the proposed ownership-handoff finding.', category: 'access', candidate: false, relevant: false, source: 'Service case record', version: 1 }))
]);
export function initialState() {
  return { scene: 0, person: 'ava', pilotView: 'teams', excluded: [], approved: false, reviewed: false, assigned: null, owner: null, due: null, progress: 'unassigned', progressNote: '', accountObservation: null, stage: 0, revision: 1, inspected: [], audit: [] };
}
function retainedCases(state) {
  return cases.filter(row => row.candidate && !state.excluded.includes(row.id));
}
export function visibleCases(state, view = state.pilotView, includeOtherGroups = false) {
  const records = includeOtherGroups ? cases : cases.filter(row => row.candidate);
  if (view === 'teams') return records;
  if (view === 'crm') return records.filter(row => row.account === 'Northwind' && (includeOtherGroups || !state.approved || !state.excluded.includes(row.id)));
  if (view === 'executive' && state.approved) return retainedCases(state).filter(row => executiveSourceIds.includes(row.id));
  return [];
}
export function summary(state) {
  const retained = retainedCases(state);
  const accounts = [...new Set(retained.map(row => row.account))];
  return {
    total: cases.length,
    candidateCount: cases.filter(row => row.candidate).length,
    excludedCount: state.excluded.length,
    caseCount: retained.length,
    reviewedCount: state.reviewed ? retained.length : 0,
    accountCount: accounts.length,
    accounts,
    affectedAccounts: accounts,
    otherCount: cases.length - retained.length,
    sourceIds: state.reviewed ? retained.map(row => row.id) : [],
    revision: state.revision,
    owner: state.owner,
    due: state.due,
    progress: state.progress,
    progressNote: state.progressNote,
    accountObservation: state.accountObservation,
    overview: { total: cases.length, candidates: 8, reviewed: state.reviewed ? retained.length : 0, accounts: accounts.length },
    approved: state.approved,
    reviewed: state.reviewed,
    stage: state.stage
  };
}
export function canReview(state) {
  return !state.approved && state.excluded.includes('CASE-218') && retainedCases(state).length > 0;
}
function record(state, message) {
  state.audit.push({ sequence: state.audit.length + 1, revision: state.revision, message });
}
export function transition(current, action) {
  if (action.type === 'RESET') return initialState();
  const state = { ...current, excluded: [...current.excluded], inspected: [...current.inspected], audit: [...current.audit] };
  if (action.type === 'SCENE') {
    if (Number.isInteger(action.index)) state.scene = Math.max(0, Math.min(6, action.index));
  } else if (action.type === 'NEXT_SCENE') {
    state.scene = Math.min(6, state.scene + 1);
  } else if (action.type === 'PERSON') {
    if (people.some(person => person.id === action.id)) state.person = action.id;
  } else if (action.type === 'PILOT_VIEW') {
    if (['teams', 'crm', 'executive'].includes(action.view)) state.pilotView = action.view;
  } else if (action.type === 'INSPECT') {
    if (visibleCases(state, state.pilotView, true).some(row => row.id === action.id) && !state.inspected.includes(action.id)) {
      state.inspected.push(action.id);
      record(state, `An authorized user opened source ${action.id}.`);
    }
  } else if (action.type === 'EXCLUDE') {
    if (!state.approved && state.pilotView === 'teams' && cases.some(row => row.id === action.id && row.candidate) && !state.excluded.includes(action.id)) {
      state.excluded.push(action.id);
      record(state, `Service manager excluded ${action.id} from this finding after source review. The original case remains unchanged.`);
    }
  } else if (action.type === 'APPROVE_FINDING') {
    if (state.pilotView !== 'teams' || !canReview(state)) return current;
    state.approved = true;
    state.reviewed = true;
    state.stage = 1;
    record(state, `Service manager reviewed the original records and approved the finding: ${summary(state).caseCount} handoff cases across ${summary(state).accountCount} accounts. Root cause remains unconfirmed.`);
  } else if (action.type === 'ASSIGN') {
    if (!state.approved || state.assigned || state.pilotView !== 'teams') return current;
    state.assigned = 'nina';
    state.owner = 'Nina';
    state.due = 'Tuesday';
    state.progress = 'assigned';
    state.progressNote = 'Review the handoff process and report the next step.';
    state.stage = 2;
    record(state, 'Nina assigned to investigate the reviewed handoff finding. Update due Tuesday.');
  } else if (action.type === 'RECORD_ACCOUNT_OBSERVATION') {
    if (!state.approved || state.assigned !== 'nina' || state.pilotView !== 'crm' || state.accountObservation) return current;
    state.accountObservation = { actor: 'Marcus', account: 'Northwind', note: 'Customer described repeating the issue to three teams; please keep one named contact.', source: 'Account observation entered by Marcus', revision: state.revision };
    record(state, 'Marcus added a consented Northwind business observation to the shared finding. No personal Grok conversation was imported.');
  } else if (action.type === 'START_INVESTIGATION') {
    if (state.assigned !== 'nina' || state.progress !== 'assigned') return current;
    state.progress = 'investigating';
    state.progressNote = 'Nina is checking the handoff process with the service team.';
    state.stage = 3;
    record(state, 'Nina acknowledged ownership and started investigating. No resolution claimed.');
  } else if (action.type === 'UPDATE_PROGRESS') {
    if (state.progress !== 'investigating' || state.stage !== 3) return current;
    state.progressNote = 'Handoff mapped; change being tested';
    state.stage = 4;
    record(state, 'Nina posted a human progress update: handoff mapped; change being tested. The issue remains open.');
  }
  return state;
}
