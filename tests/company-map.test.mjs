import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { buildNetwork, networkPeople, improvements, renderCompanyMap } from '../dist/company-map.mjs';

test('all nine employees stay in the same three-by-three positions', () => {
  assert.equal(networkPeople.length, 9);
  const original = buildNetwork('fragmented');
  for (const id of Object.keys(improvements)) {
    const connected = buildNetwork('connected', id);
    assert.deepEqual(connected.nodes, original.nodes);
    assert.equal(connected.nodes.length, 9);
    assert.equal(connected.edges.filter(edge => edge.type === 'proposed').length, 3);
    assert.equal(connected.nodes.some(node => node.id.startsWith('hub:')), false);
  }
  assert.deepEqual(original.nodes.map(node => [node.row, node.column]), [[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2]]);
});

test('employee cards expose real workspaces, verdicts, tools and one-line work', () => {
  const html = renderCompanyMap({});
  assert.equal([...html.matchAll(/data-workspace="/g)].length, 9);
  assert.equal([...html.matchAll(/class="pg-line"/g)].length, 9);
  for (const person of networkPeople) assert.match(html, new RegExp(`data-workspace="${person.id}"`));
  for (const [,file] of html.matchAll(/src="([^\"]+)"/g)) assert(existsSync(`dist/${file}`));
  assert.doesNotMatch(html, /map-inspector|hub:records|undefined|NaN/);
  assert.equal([...html.matchAll(/class="pg-verdict">AI WIN</g)].length, 4);
  assert.equal([...html.matchAll(/class="pg-verdict">DIFFERENT WAY</g)].length, 2);
  assert.equal([...html.matchAll(/class="pg-verdict">STRUGGLING</g)].length, 2);
  assert.equal([...html.matchAll(/class="pg-verdict">THE GLUE</g)].length, 1);
  assert.match(html, /Personal phone/);
});

test('today shows dead ends and only hand-made links through Leah', () => {
  const today = renderCompanyMap({});
  assert.match(today, /Company graph/);
  assert.equal([...today.matchAll(/class="pg-stays"/g)].length, 8);
  assert.doesNotMatch(today, /Stays with Leah/);
  assert.equal([...today.matchAll(/class="pg-edge manual/g)].length, 4);
  assert.match(today, />By hand</);
  assert.doesNotMatch(today, /class="pg-edge connected|pg-maya|data-build=/);
});

test('connected view links every company tool to one Register and leaves personal apps out', () => {
  const html = renderCompanyMap({networkMode:'connected',improvement:'nina'});
  assert.equal([...html.matchAll(/class="pg-edge connected/g)].length, 9);
  assert.doesNotMatch(html, /pg-stays|pg-edge manual|By hand|hub:records/);
  for (const text of ['Parkside Work Register','never connected','Maya · other branch','Shared Claude project · Maya ✓','Knows HF-01 before the call','Proposed design, simulated here']) assert.match(html, new RegExp(text));
  assert.equal([...html.matchAll(/pg-card v-\w+ is-linked/g)].length, 9);
  const positions = h => [...h.matchAll(/data-workspace="(\w+)" style="([^"]+)"/g)].map(m => m.slice(1).join(' '));
  assert.deepEqual(positions(html), positions(renderCompanyMap({})));
});

test('explore controls keep improvement selection and build hooks', () => {
  for (const id of Object.keys(improvements)) {
    const html = renderCompanyMap({networkMode:'connected',improvement:id});
    assert.match(html, new RegExp(`data-improvement="${id}" aria-pressed="true"`));
    assert.match(html, new RegExp(`data-build="${id}"`));
    assert.doesNotMatch(html, /undefined|NaN/);
  }
  assert.match(renderCompanyMap({}), /data-network-mode="connected"/);
  assert.match(renderCompanyMap({networkMode:'connected',improvement:'unknown'}), /data-build="priya"/);
});
