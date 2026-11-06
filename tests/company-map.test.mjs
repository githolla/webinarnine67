import test from 'node:test';
import assert from 'node:assert/strict';
import { buildNetwork, networkPeople, networkConnections, renderCompanyMap } from '../dist/company-map.mjs';

test('fragmented map contains nine isolated employee clusters', () => {
  const graph = buildNetwork('fragmented');
  assert.equal(networkPeople.length, 9);
  assert.equal(graph.nodes.length, 27);
  assert.equal(graph.edges.length, 18);
  const nodes = new Map(graph.nodes.map(node => [node.id, node]));
  for (const edge of graph.edges) {
    assert.equal(edge.type, 'local');
    assert.equal(nodes.get(edge.from).owner, nodes.get(edge.to).owner);
  }
});

test('connected mode preserves positions and connects business outputs only', () => {
  const original = buildNetwork('fragmented');
  const connected = buildNetwork('connected');
  assert.equal(connected.nodes.length, 28);
  const updates = new Map(connected.nodes.map(node => [node.id, node]));
  for (const node of original.nodes) {
    assert.equal(updates.get(node.id).x, node.x);
    assert.equal(updates.get(node.id).y, node.y);
  }
  const edges = connected.edges.filter(edge => edge.type === 'proposed');
  assert.equal(edges.length, 9);
  for (const edge of edges) {
    assert.equal(updates.get(edge.from).type, 'output');
    assert.equal(edge.to, 'hub:records');
  }
  assert.match(edges.find(edge => edge.from === 'output:priya').label, /Power Query transformation/);
  assert.match(edges.find(edge => edge.from === 'output:marcus').label, /private Grok chats stay private/);
  assert.equal(connected.edges.some(edge => edge.from === 'ai:marcus' && edge.to === 'output:marcus'), false);
});

test('map controls expose selection and workspace detail access', () => {
  const html = renderCompanyMap({ networkMode: 'connected', mapNode: 'output:priya' });
  assert.match(html, /data-detail="workspace:priya"/);
  assert.match(html, /Proposed design · Not live integrations/);
  assert.match(html, /data-network-mode="connected" aria-pressed="true"/);
  assert.equal([...html.matchAll(/role="button" tabindex="0"/g)].length, 28);
  assert.match(html, /role="button" tabindex="0"/);
  assert.doesNotMatch(html, /undefined|NaN/);
  assert.match(renderCompanyMap({ mapNode: 'missing' }), /data-detail="workspace:priya"/);
});

test('manual work stays person-owned and useful recipient paths are explicit', () => {
  const graph = buildNetwork('connected');
  for (const id of ['elena', 'leah', 'marcus']) {
    assert(graph.edges.some(edge => edge.from === `person:${id}` && edge.to === `output:${id}`));
    assert.equal(graph.edges.some(edge => edge.from === `ai:${id}` && edge.to === `output:${id}`), false);
  }
  const nina = networkConnections.filter(link => link.from === 'nina');
  assert.deepEqual(nina.map(link => link.to), ['ava', 'marcus', 'leah']);
  for (const link of networkConnections) {
    assert(graph.edges.some(edge => edge.from === `output:${link.from}` && edge.to === `person:${link.to}` && edge.type === 'handoff'));
  }
  const html = renderCompanyMap({ networkMode: 'connected', mapNode: 'person:nina' });
  assert.match(html, /WHO CAN USE THIS NEXT/);
  assert.match(html, /Service reviews the recurring customer issue with Ops/);
  assert.match(html, /data-map-node="person:ava"/);
  assert.match(renderCompanyMap({ mapNode: 'person:elena' }), /Barely uses Copilot/);
  assert.match(renderCompanyMap({ mapNode: 'person:leah' }), /after manually assembling/);
});
