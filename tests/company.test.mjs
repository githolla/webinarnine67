import test from 'node:test';
import assert from 'node:assert/strict';
import { people, cases, initialState, transition, visibleCases, summary, canReview } from '../dist/company-model.mjs';
function reviewedState() {
  return transition(transition(initialState(), { type: 'EXCLUDE', id: 'CASE-218' }), { type: 'APPROVE_FINDING' });
}
test('company pilot separates candidate pattern from reviewed evidence', () => {
  const state = initialState();
  assert.equal(people.length, 6);
  assert.equal(cases.length, 18);
  assert.equal(new Set(cases.map(row => row.id)).size, 18);
  assert.equal(summary(state).candidateCount, 8);
  assert.equal(summary(state).caseCount, 8);
  assert.equal(summary(state).reviewedCount, 0);
  assert.equal(state.approved, false);
  assert.deepEqual(summary(state).sourceIds, []);
  assert.equal(cases.filter(row => row.category === 'billing').length, 6);
  assert.equal(cases.filter(row => row.category === 'access').length, 4);
});
test('human review must exclude the unrelated case before accepting the finding', () => {
  const initial = initialState();
  assert.equal(canReview(initial), false);
  assert.deepEqual(transition(initial, { type: 'APPROVE_FINDING' }), initial);
  const excluded = transition(initial, { type: 'EXCLUDE', id: 'CASE-218' });
  assert.equal(canReview(excluded), true);
  assert.equal(summary(excluded).caseCount, 7);
  assert.equal(summary(excluded).reviewedCount, 0);
  const reviewed = transition(excluded, { type: 'APPROVE_FINDING' });
  assert.equal(reviewed.reviewed, true);
  assert.equal(summary(reviewed).reviewedCount, 7);
  assert.equal(summary(reviewed).accountCount, 3);
  assert.equal(summary(reviewed).otherCount, 11);
  assert.equal(summary(reviewed).sourceIds.includes('CASE-218'), false);
  assert.equal(cases.find(row => row.id === 'CASE-218').title, 'Shipping address correction delayed a replacement');
  assert.deepEqual(initial.excluded, []);
});
test('each pilot surface respects its record permissions', () => {
  const state = reviewedState();
  assert.equal(visibleCases(state, 'teams').length, 8);
  assert.equal(visibleCases(state, 'teams', true).length, 18);
  assert.equal(visibleCases(state, 'crm').length, 3);
  assert(visibleCases(state, 'crm').every(row => row.account === 'Northwind'));
  assert.equal(visibleCases(state, 'crm').some(row => row.id === 'CASE-218'), false);
  assert.deepEqual(visibleCases(initialState(), 'executive'), []);
  assert.deepEqual(visibleCases(state, 'executive').map(row => row.id), ['CASE-201', 'CASE-204', 'CASE-206']);
  assert(visibleCases(state, 'executive').every(row => row.relevant && row.description));
  assert.equal(visibleCases(state, 'executive').some(row => row.id === 'CASE-202'), false);
  assert.equal(visibleCases(state, 'executive').some(row => row.id === 'CASE-218'), false);
  assert.deepEqual(visibleCases(state, 'unknown'), []);
  const crm = transition(initialState(), { type: 'PILOT_VIEW', view: 'crm' });
  assert.deepEqual(transition(crm, { type: 'EXCLUDE', id: 'CASE-218' }).excluded, []);
  assert.deepEqual(transition(crm, { type: 'INSPECT', id: 'CASE-218' }).inspected, []);
});
test('assignment and progress require reviewed evidence and never imply resolution', () => {
  const initial = initialState();
  for (const type of ['ASSIGN', 'START_INVESTIGATION', 'UPDATE_PROGRESS']) assert.deepEqual(transition(initial, { type }), initial);
  let state = reviewedState();
  state = transition(state, { type: 'ASSIGN' });
  assert.equal(state.owner, 'Nina');
  assert.equal(state.due, 'Tuesday');
  assert.equal(state.progress, 'assigned');
  assert.equal(state.stage, 2);
  assert.equal(transition(state, { type: 'UPDATE_PROGRESS' }).stage, 2);
  state = transition(state, { type: 'START_INVESTIGATION' });
  assert.equal(state.stage, 3);
  assert.equal(state.progress, 'investigating');
  state = transition(state, { type: 'UPDATE_PROGRESS' });
  assert.equal(state.stage, 4);
  assert.equal(state.progress, 'investigating');
  assert.equal(state.progressNote, 'Handoff mapped; change being tested');
  assert.notEqual(state.progress, 'resolved');
  assert.deepEqual(transition(state, { type: 'UPDATE_PROGRESS' }), state);
});
test('Teams, CRM and executive views derive the same shared finding and action', () => {
  let state = reviewedState();
  for (const type of ['ASSIGN', 'START_INVESTIGATION', 'UPDATE_PROGRESS']) state = transition(state, { type });
  const expected = summary(state);
  for (const view of ['teams', 'crm', 'executive']) {
    const selected = transition(state, { type: 'PILOT_VIEW', view });
    assert.deepEqual(summary(selected), expected);
    assert.equal(summary(selected).owner, 'Nina');
    assert.equal(summary(selected).due, 'Tuesday');
    assert.equal(summary(selected).reviewedCount, 7);
    assert.equal(summary(selected).accountCount, 3);
  }
});
test('read-only surfaces cannot make management decisions and approvals freeze evidence', () => {
  let state = reviewedState();
  assert.deepEqual(transition(state, { type: 'EXCLUDE', id: 'CASE-201' }), state);
  for (const view of ['crm', 'executive']) {
    const selected = transition(state, { type: 'PILOT_VIEW', view });
    assert.deepEqual(transition(selected, { type: 'ASSIGN' }), selected);
  }
  assert.deepEqual(transition(state, { type: 'RESET' }), initialState());
  state = transition(state, { type: 'SCENE', index: 999 });
  assert.equal(state.scene, 6);
  assert.equal(transition(state, { type: 'SCENE', index: NaN }).scene, 6);
  assert.equal(transition(state, { type: 'PERSON', id: 'invalid' }).person, 'ava');
});

test('Marcus contributes a business observation without exposing his personal AI history', () => {
  let state = transition(reviewedState(), { type: 'PILOT_VIEW', view: 'crm' });
  assert.equal(transition(state, { type: 'RECORD_ACCOUNT_OBSERVATION' }).accountObservation, null);
  state = transition(state, { type: 'PILOT_VIEW', view: 'teams' });
  state = transition(state, { type: 'ASSIGN' });
  assert.equal(transition(state, { type: 'RECORD_ACCOUNT_OBSERVATION' }).accountObservation, null);
  state = transition(state, { type: 'PILOT_VIEW', view: 'crm' });
  state = transition(state, { type: 'RECORD_ACCOUNT_OBSERVATION' });
  assert.equal(state.accountObservation.actor, 'Marcus');
  assert.equal(state.accountObservation.account, 'Northwind');
  assert.match(state.audit.at(-1).message, /No personal Grok conversation was imported/);
  assert.deepEqual(transition(state, { type: 'RECORD_ACCOUNT_OBSERVATION' }), state);
  state = transition(state, { type: 'PILOT_VIEW', view: 'executive' });
  state = transition(state, { type: 'START_INVESTIGATION' });
  state = transition(state, { type: 'UPDATE_PROGRESS' });
  assert.equal(state.progress, 'investigating');
  assert.equal(state.stage, 4);
  assert.equal(summary(state).accountObservation.actor, 'Marcus');
});

test('executive supporting links are reviewed, permitted and remain scoped after exclusion', () => {
  let state = transition(initialState(), { type: 'EXCLUDE', id: 'CASE-201' });
  state = transition(state, { type: 'EXCLUDE', id: 'CASE-218' });
  state = transition(state, { type: 'APPROVE_FINDING' });
  const executive = transition(state, { type: 'PILOT_VIEW', view: 'executive' });
  assert.deepEqual(visibleCases(executive).map(row => row.id), ['CASE-204', 'CASE-206']);
  assert.deepEqual(transition(executive, { type: 'INSPECT', id: 'CASE-202' }).inspected, []);
  assert.deepEqual(transition(executive, { type: 'INSPECT', id: 'CASE-218' }).inspected, []);
  assert.deepEqual(transition(executive, { type: 'INSPECT', id: 'CASE-204' }).inspected, ['CASE-204']);
  assert(cases.every(row => typeof row.description === 'string' && row.description.length > 30));
});

test('excluded account cases do not return as reviewed CRM evidence',()=>{
 let state=transition(initialState(),{type:'EXCLUDE',id:'CASE-201'});
 state=transition(state,{type:'EXCLUDE',id:'CASE-218'});
 state=transition(state,{type:'APPROVE_FINDING'});
 assert.equal(summary(state).caseCount,6);
 assert.deepEqual(visibleCases(state,'crm').map(row=>row.id),['CASE-202','CASE-203']);
});
