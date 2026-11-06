import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState, transition, totals, reviewed, original, destinations } from '../dist/event-model.mjs';
function approveAll(state = initialState()) {
  for (let index = 0; index < 3; index++) state = transition(state, { type: 'REVIEW' });
  return state;
}
test('rental change reconciles items, transport and total without altering original order', () => {
  const state = initialState();
  assert.deepEqual(totals(state), { chairs: 160, tables: 40, addedChairs: 40, addedTables: 10, chairRate: 5, tableRate: 20, base: 1520, items: 400, transport: 180, extra: 580, total: 2100, truckCount: 2 });
  assert.equal(original.chairs * 5 + original.tables * 20 + original.delivery, original.total);
  assert.equal(state.localReady, true);
  assert.equal(state.ready, false);
  assert.deepEqual(state.approvals, {});
  assert.deepEqual(state.writes, {});
});
test('local AI work and navigation never grant authorization or reserve inventory', () => {
  let state = transition(initialState(), { type: 'SCENE', index: 4 });
  state = transition(state, { type: 'PERSON', index: 2 });
  state = transition(state, { type: 'RELEASE' });
  assert.equal(state.scene, 4);
  assert.equal(state.person, 2);
  assert.equal(state.phase, 0);
  assert.equal(state.ready, false);
  assert.deepEqual(state.writes, {});
});
test('review follows warehouse, dispatch and customer order before Leah release', () => {
  let state = initialState();
  state = transition(state, { type: 'REVIEW', id: 'rachel' });
  assert.equal(state.phase, 0);
  for (const [index, id] of ['sam', 'dana', 'rachel'].entries()) {
    state = transition(state, { type: 'REVIEW', id });
    assert.equal(state.phase, index + 1);
    assert.equal(reviewed(state, id), true);
    assert.equal(state.ready, false);
    assert.equal(reviewed(state, 'leah'), false);
    assert.deepEqual(state.writes, {});
  }
  const count = state.audit.length;
  state = transition(state, { type: 'REVIEW' });
  assert.equal(state.audit.length, count);
  state = transition(state, { type: 'RELEASE' });
  assert.equal(state.ready, true);
  assert.equal(state.phase, 4);
  assert.equal(reviewed(state, 'leah'), true);
  for (const destination of destinations) assert.equal(state.writes[destination], 2);
  assert.match(state.audit.at(-1).message, /no email has been sent/);
});
test('dispatch failure preserves partial writes, blocks confirmation and retries without duplication', () => {
  let state = transition(approveAll(), { type: 'FAULT', value: 'dispatch' });
  state = transition(state, { type: 'RELEASE' });
  assert.equal(state.ready, false);
  assert.equal(state.phase, 3);
  assert.deepEqual(state.writes, { 'Rental order': 2 });
  const auditLength = state.audit.length;
  state = transition(state, { type: 'RELEASE' });
  assert.equal(state.audit.length, auditLength);
  state = transition(state, { type: 'FAULT', value: 'none' });
  state = transition(state, { type: 'RELEASE' });
  assert.equal(state.ready, true);
  assert.equal(state.audit.filter(entry => entry.message.startsWith('Rental order:')).length, 1);
  assert.equal(state.audit.filter(entry => entry.message.startsWith('Leah authorized')).length, 1);
  const complete = structuredClone(state);
  assert.deepEqual(transition(state, { type: 'RELEASE' }), complete);
});
test('a newer client request invalidates approvals and changes the visible figures', () => {
  let state = transition(approveAll(), { type: 'FAULT', value: 'revision' });
  state = transition(state, { type: 'RELEASE' });
  assert.equal(state.revision, 3);
  assert.equal(state.phase, 0);
  assert.equal(state.ready, false);
  assert.deepEqual(state.approvals, {});
  assert.deepEqual(state.writes, {});
  assert.equal(totals(state).chairs, 180);
  assert.equal(totals(state).tables, 45);
  assert.equal(totals(state).extra, 780);
  assert.equal(totals(state).total, 2300);
  assert.match(state.notice, /invalidated/);
  assert.equal(reviewed(state, 'rachel'), false);
  state = transition(approveAll(state), { type: 'RELEASE' });
  assert.equal(state.ready, true);
  for (const destination of destinations) assert.equal(state.writes[destination], 3);
});
test('transition leaves previous snapshots intact and reset removes the previous run', () => {
  const initial = initialState();
  const snapshot = structuredClone(initial);
  const approved = approveAll(initial);
  assert.deepEqual(initial, snapshot);
  const complete = transition(approved, { type: 'RELEASE' });
  assert.equal(approved.ready, false);
  assert.deepEqual(approved.writes, {});
  assert.deepEqual(transition(complete, { type: 'RESET' }), initialState());
  assert.equal(transition(initial, { type: 'SCENE', index: NaN }).scene, 0);
  assert.equal(transition(initial, { type: 'PERSON', index: -5 }).person, 0);
});
