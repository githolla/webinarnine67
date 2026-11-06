export const people = [
  { id: 'leah', name: 'Leah', department: 'Customer Service', ai: 'ChatGPT', icon: 'openai.svg', system: 'HubSpot', systemIcon: 'hubspot.svg' },
  { id: 'sam', name: 'Sam', department: 'Warehouse', ai: 'Copilot', icon: 'copilot.webp', system: 'Rental inventory' },
  { id: 'dana', name: 'Dana', department: 'Dispatch', ai: 'Claude', icon: 'claude.svg', system: 'Dispatch board' }
];
export const destinations = ['Rental order', 'Dispatch board', 'HubSpot'];
export const reviewOrder = ['sam', 'dana', 'rachel'];
export const original = Object.freeze({ guests: 120, chairs: 120, tables: 30, total: 1520, delivery: 320, truckCount: 1 });
export function initialState() {
  return {
    scene: 0,
    person: 0,
    revision: 2,
    request: { guests: 160, chairs: 160, tables: 40, eventDate: 'Friday', arrival: '9:00 AM' },
    phase: 0,
    approvals: {},
    writes: {},
    localReady: true,
    ready: false,
    fault: 'none',
    notice: '',
    audit: []
  };
}
export function totals(state) {
  const chairs = state.request.chairs;
  const tables = state.request.tables;
  const addedChairs = chairs - original.chairs;
  const addedTables = tables - original.tables;
  const items = addedChairs * 5 + addedTables * 20;
  const truckCount = chairs > original.chairs || tables > original.tables ? 2 : 1;
  const transport = truckCount === 2 ? 180 : 0;
  const extra = items + transport;
  return { chairs, tables, addedChairs, addedTables, chairRate: 5, tableRate: 20, base: original.total, items, transport, extra, total: original.total + extra, truckCount };
}
export function reviewed(state, id) {
  return state.approvals[id] === state.revision;
}
function record(state, message) {
  state.audit.push({ sequence: state.audit.length + 1, revision: state.revision, message });
}
function currentPhase(state) {
  if (state.ready) return 4;
  return reviewOrder.filter(id => reviewed(state, id)).length;
}
export function transition(current, action) {
  if (action.type === 'RESET') return initialState();
  const state = { ...current, request: { ...current.request }, approvals: { ...current.approvals }, writes: { ...current.writes }, audit: [...current.audit] };
  if (action.type === 'SCENE' || action.type === 'NEXT_SCENE') {
    const index = action.type === 'NEXT_SCENE' ? state.scene + 1 : action.index;
    if (Number.isInteger(index)) state.scene = Math.max(0, Math.min(4, index));
  } else if (action.type === 'PERSON') {
    if (Number.isInteger(action.index)) state.person = Math.max(0, Math.min(people.length - 1, action.index));
  } else if (action.type === 'FAULT') {
    if (['none', 'dispatch', 'revision'].includes(action.value) && !state.ready) {
      state.fault = action.value;
      state.notice = '';
    }
  } else if (action.type === 'REVIEW') {
    const next = reviewOrder.find(id => !reviewed(state, id));
    if (!next || (action.id && action.id !== next)) return current;
    state.approvals[next] = state.revision;
    const n = totals(state);
    const messages = {
      sam: `Sam reviewed availability for ${n.chairs} chairs and ${n.tables} tables. Inventory remains a pending change until release.`,
      dana: `Dana reviewed ${n.truckCount} trucks arriving ${state.request.eventDate} by ${state.request.arrival}. Additional transport: $${n.transport}.`,
      rachel: `Simulated customer acceptance: Rachel accepted $${n.extra} additional charges, $${n.total} total before tax.`
    };
    record(state, messages[next]);
    state.notice = '';
  } else if (action.type === 'RELEASE') {
    if (!reviewOrder.every(id => reviewed(state, id)) || state.ready) return current;
    if (state.fault === 'revision') {
      state.request.guests += 20;
      state.request.chairs += 20;
      state.request.tables += 5;
      state.revision += 1;
      state.approvals = {};
      state.writes = {};
      state.fault = 'none';
      state.localReady = false;
      state.notice = 'The client added another 20 guests before release. Previous decisions are invalidated. Review the new quantities and charges before confirming.';
      record(state, 'A new client revision arrived before release. No new writes applied; previous approvals invalidated.');
    } else {
      if (!reviewed(state, 'leah')) {
        state.approvals.leah = state.revision;
        record(state, 'Leah authorized the reviewed change after the inventory, dispatch and customer decisions.');
      }
      for (const destination of destinations) {
        if (state.writes[destination] === state.revision) continue;
        if (destination === 'Dispatch board' && state.fault === 'dispatch') {
          state.notice = 'Rental order saved. Dispatch update failed. Customer confirmation is held until all records are verified. Retry after clearing the fault.';
          if (!state.audit.at(-1)?.message.startsWith('Dispatch update failed')) record(state, 'Dispatch update failed. Partial completion recorded; release held.');
          break;
        }
        state.writes[destination] = state.revision;
        record(state, `${destination}: simulated update saved and verified for revision ${state.revision}.`);
      }
      state.ready = destinations.every(destination => state.writes[destination] === state.revision);
      if (state.ready) {
        state.notice = '';
        record(state, 'All records agree. Customer confirmation is ready for Leah to send; no email has been sent.');
      }
    }
  }
  state.phase = currentPhase(state);
  return state;
}
