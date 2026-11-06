import test from 'node:test';
import assert from 'node:assert/strict';
import { initialBuildState, transitionBuild, financeReport, trackerRows, publishedFinding, renderBuilds, sourceCase, normalizeVendor } from '../dist/company-builds.mjs';
const step = (state, action) => transitionBuild(state, { type: action });
test('finance publishes only after input and an explicit duplicate decision', () => {
  let state = initialBuildState();
  assert.equal(financeReport(state).inputRows, 3);
  assert.equal(financeReport(state).total, 3250);
  assert.equal(step(state, 'finance-publish').priya.published, false);
  assert.equal(step(state, 'finance-exclude').priya.duplicateDecision, null);
  assert.equal(step(state, 'finance-reuse').priya.reused, false);
  state = step(state, 'finance-submit');
  assert.equal(step(state, 'finance-publish').priya.published, false);
  state = step(state, 'finance-exclude');
  assert.equal(financeReport(state).outputRows, 2);
  assert.equal(financeReport(state).total, 2050);
  state = step(state, 'finance-publish');
  assert.equal(financeReport(state).published, true);
  assert.equal(financeReport(state).operator, 'Priya');
  const rows = financeReport(state).rows;
  state = step(state, 'finance-reuse');
  assert.equal(state.priya.reused, false);
  state = step(state, 'finance-review-reuse');
  assert.equal(financeReport(state).operator, 'Maya');
  assert.deepEqual(financeReport(state).rows, rows);
  assert.equal(financeReport(state).rulesVersion, 'v1');
  assert.equal(step(state, 'finance-keep').priya.duplicateDecision, 'exclude');
});
test('retaining both rows remains an explicit auditable finance choice', () => {
  let state = step(initialBuildState(), 'finance-submit');
  state = step(state, 'finance-keep');
  assert.equal(financeReport(state).outputRows, 3);
  assert.equal(financeReport(state).total, 3250);
  assert.equal(financeReport(state).reviewed, true);
  assert.match(renderBuilds({ builds: state, improvement: 'priya' }), /Publish with duplicate retained/);
  state = step(state, 'finance-publish');
  assert.match(renderBuilds({ builds: state, improvement: 'priya' }), /Both N101 rows retained by Priya/);
});
test('tracker needs source-based proposals and the Operations owner before applying', () => {
  let state = initialBuildState();
  const original = trackerRows(state);
  assert.equal(step(state, 'tracker-apply').elena.applied, false);
  assert.equal(step(state, 'tracker-owner-nina').elena.owner, null);
  state = step(state, 'tracker-propose');
  state = step(state, 'tracker-owner-ben');
  assert.equal(step(state, 'tracker-apply').elena.applied, false);
  assert.deepEqual(trackerRows(state), original);
  state = step(state, 'tracker-owner-nina');
  assert.deepEqual(trackerRows(state), original);
  state = step(state, 'tracker-apply');
  const rows = trackerRows(state);
  assert.equal(rows[0].owner, 'Nina');
  assert.equal(rows[0].due, 'November 10');
  assert.equal(rows[1].status, 'Complete');
  assert.equal(rows[2].status, 'Ready for review');
  assert(rows.every(row => row.source.startsWith('NOTE-')));
  assert.equal(step(state, 'tracker-owner-ben').elena.owner, 'Nina');
});
test('operations requires opening evidence and human confirmation before shared publication', () => {
  let state = initialBuildState();
  assert.equal(sourceCase.id, 'CASE-201');
  assert.equal(step(state, 'ops-confirm').nina.confirmed, false);
  assert.equal(publishedFinding(step(state, 'ops-assign-publish')), null);
  state = step(state, 'ops-open-source');
  assert.match(renderBuilds({ builds: state, improvement: 'nina' }), /receiving service-owner field was empty/);
  assert.equal(publishedFinding(step(state, 'ops-assign-publish')), null);
  state = step(state, 'ops-confirm');
  assert.equal(publishedFinding(state), null);
  state = step(state, 'ops-assign-publish');
  const finding = publishedFinding(state);
  assert.equal(finding.owner, 'Nina');
  assert.equal(finding.due, 'Tuesday, November 10');
  assert.equal(finding.status, 'Investigation assigned');
  assert.equal(finding.outcome, 'Open; no resolution claimed');
  const html = renderBuilds({ builds: state, improvement: 'nina' });
  assert.equal([...html.matchAll(/<dd>Nina<\/dd>/g)].length, 3);
  assert.equal([...html.matchAll(/<dd>Tuesday, November 10<\/dd>/g)].length, 3);
  assert.equal([...html.matchAll(/<dd>Investigation assigned<\/dd>/g)].length, 3);
  assert.match(html, /customer issue is still open/);
});
test('build actions are isolated and pure, and every state renders without missing values', () => {
  const initial = initialBuildState();
  const updated = step(initial, 'finance-submit');
  assert.equal(initial.priya.submitted, false);
  assert.deepEqual(updated.elena, initial.elena);
  assert.deepEqual(updated.nina, initial.nina);
  assert.deepEqual(step(initial, 'unknown'), initial);
  let state = initial;
  for (const action of ['finance-submit', 'finance-exclude', 'finance-publish', 'finance-reuse', 'finance-review-reuse', 'tracker-propose', 'tracker-owner-nina', 'tracker-apply', 'ops-open-source', 'ops-confirm', 'ops-assign-publish']) {
    state = step(state, action);
    for (const improvement of ['priya', 'elena', 'nina']) {
      const html = renderBuilds({ builds: state, improvement });
      assert.doesNotMatch(html, /undefined|NaN/);
      assert.match(html, /Interactive simulation/);
    }
  }
  assert.doesNotMatch(renderBuilds({}), /undefined|NaN/);
});

test('vendor spellings normalize before invoice and amount duplicate matching', () => {
  assert.equal(normalizeVendor('AcmeLtd'), 'Acme Ltd');
  assert.equal(normalizeVendor('ACME LTD.'), 'Acme Ltd');
  assert.equal(normalizeVendor('NorthOffice'), 'North Office');
  const report = financeReport(initialBuildState());
  assert.equal(report.exceptions, 1);
  assert.equal(report.rows[0].duplicate, false);
  assert.equal(report.rows[1].duplicate, true);
  assert.equal(report.rows[2].duplicate, false);
  assert.equal(report.rows[1].id, 'N101');
  assert.equal(report.rows[1].source, 'East.xlsx · row 2');
  let state = step(step(initialBuildState(), 'finance-submit'), 'finance-exclude');
  state = step(state, 'finance-publish');
  const reviewed = financeReport(state);
  assert.deepEqual(reviewed.rows.map(row => [row.vendor, row.id, row.amount]), [['Acme Ltd', 'N101', 1200], ['North Office', 'W203', 850]]);
  assert.equal(reviewed.total, reviewed.rows.reduce((sum, row) => sum + row.amount, 0));
  assert.match(renderBuilds({ builds: state, improvement: 'priya' }), /Reviewed expense/);
});

test('excluding the selected source blocks publication until it is restored and reviewed',()=>{
 let state=step(initialBuildState(),'ops-open-source');state=step(state,'ops-confirm');state=step(state,'ops-exclude-source');
 assert.equal(state.nina.confirmed,false);assert.equal(step(state,'ops-confirm').nina.confirmed,false);assert.equal(step(state,'ops-assign-publish').nina.published,false);
 state=step(state,'ops-restore-source');state=step(state,'ops-confirm');state=step(state,'ops-assign-publish');
 assert.equal(state.nina.published,true);assert.deepEqual(step(state,'ops-exclude-source'),state);
});
