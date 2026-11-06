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

test('employee cards expose real workspaces, tool marks and work previews', () => {
  const html = renderCompanyMap({});
  assert.equal([...html.matchAll(/data-workspace="/g)].length, 9);
  assert.equal([...html.matchAll(/class="employee-quote"/g)].length, 9);
  assert.equal([...html.matchAll(/class="work-mini /g)].length, 9);
  for (const person of networkPeople) assert.match(html, new RegExp(`data-workspace="${person.id}"`));
  for (const [,file] of html.matchAll(/src="([^\"]+)"/g)) assert(existsSync(`dist/${file}`));
  assert.doesNotMatch(html, /map-inspector|hub:records|undefined|NaN/);
  assert.match(html, /Manual: Ben exports → Priya reconciles/);
  assert.match(html, /Manual: Nina sends → Leah chases/);
});

test('connected view reveals only the selected improvement', () => {
  const names = {priya:'Branch files',elena:'Notes + tracker',nina:'Ticket finding'};
  for (const [id,title] of Object.entries(names)) {
    const html = renderCompanyMap({networkMode:'connected',improvement:id});
    assert.match(html, new RegExp(`data-improvement="${id}" aria-pressed="true"`));
    assert.match(html, new RegExp(`data-build="${id}"`));
    assert.match(html, new RegExp(`<b>${title.replace('+','\\+')}</b>`));
    assert.equal([...html.matchAll(/class="flow-step-number"/g)].length, 4);
    assert.equal([...html.matchAll(/class="selected-improvement"/g)].length, 1);
    assert.doesNotMatch(html, /undefined|NaN/);
  }
  assert.doesNotMatch(renderCompanyMap({networkMode:'fragmented'}), /class="selected-improvement"/);
  assert.match(renderCompanyMap({networkMode:'connected',improvement:'unknown'}), /data-build="priya"/);
});

test('manual work and human review remain explicit', () => {
  const today = renderCompanyMap({});
  assert.match(today, /Still updated manually/);
  assert.match(today, /After manual assembly/);
  const elena = renderCompanyMap({networkMode:'connected',improvement:'elena'});
  assert.match(elena, /Elena confirms/);
  assert.match(elena, /Confirmed changes only/);
  const priya = renderCompanyMap({networkMode:'connected',improvement:'priya'});
  assert.match(priya, /Human review/);
  const nina = renderCompanyMap({networkMode:'connected',improvement:'nina'});
  assert.match(nina, /Nina reviews/);
  assert.match(nina, /Private chats stay private/);
});

test('company graph exposes visible connections and highlights only proposed mode', () => {
  const today = renderCompanyMap({});
  assert.match(today, /Company graph/);
  assert.match(today, /card-connection-graph/);
  assert.equal([...today.matchAll(/class="card-edge manual"/g)].length, 2);
  assert.doesNotMatch(today, /class="card-edge proposed"/);
  assert.match(renderCompanyMap({networkMode:'connected',improvement:'nina'}), /class="card-edge proposed"/);
});
