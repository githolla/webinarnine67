const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
export const networkPeople = Object.freeze([
  { id: 'dana', name: 'Dana', role: 'CEO', ai: 'Claude', output: 'Board questions', color: '#7c729d', current: 'Challenges her thinking before board meetings.', value: 'Better questions for the leadership team.', gap: 'Her answers depend on the updates others gather.', next: 'Give leadership a reviewed brief with owners, evidence and progress.', system: 'Weekly operating review' },
  { id: 'daniel', name: 'Daniel', role: 'IT', ai: 'Ask Parkside', output: 'Company answers', color: '#5d8fa3', current: 'Built the internal assistant with Copilot Studio.', value: 'Approved company knowledge is easier to find.', gap: 'Usage does not show which business work improved.', next: 'Connect permitted records and evaluate useful outcomes with each team.', system: 'Copilot Studio' },
  { id: 'ben', name: 'Ben', role: 'Sales', ai: 'Copilot', output: 'Forecast insight', color: '#729b8a', current: 'Uses Copilot in Excel to compare forecast changes.', value: 'Finds repeated slippage and coaches his reps.', gap: 'The method and assumptions stay inside Sales.', next: 'Share the reviewed assumptions with Finance through a repeatable review.', system: 'Excel' },
  { id: 'priya', name: 'Priya', role: 'Finance', ai: 'Claude', output: 'Power Query logic', color: '#c19b61', current: 'Uses Claude to develop and understand Power Query transformations.', value: 'A useful finance workflow built by someone who knows the data.', gap: 'The transformation is useful but not yet a shared, maintained asset.', next: 'Review the transformation with Priya, document it and reuse the approved logic.', system: 'Excel · Power Query' },
  { id: 'nina', name: 'Nina', role: 'Operations', ai: 'Ask Ops', output: 'Ticket patterns', color: '#bc7f83', current: 'Her department built a Teams bot that links possible ticket patterns.', value: 'Ops finds recurring work worth investigating.', gap: 'The findings stay in Ops instead of becoming shared actions.', next: 'Review the sources, assign an owner and carry the finding into Service and the weekly review.', system: 'Teams · Department bot' },
  { id: 'marcus', name: 'Marcus', role: 'Account manager', ai: 'Grok · Phone', output: 'Account insight', color: '#928a79', current: 'Practices generic customer conversations on his personal phone.', value: 'He prepares for difficult conversations without entering private account data.', gap: 'Useful business observations may never reach the account record.', next: 'Let Marcus volunteer an account observation in the CRM. Keep personal Grok chats private.', system: 'Volunteered CRM observation' },
  { id: 'ava', name: 'Ava', role: 'Customer Service', ai: 'Copilot', output: 'Customer replies', color: '#6e9fa0', current: 'Uses Copilot to improve the tone of Zendesk customer replies.', value: 'Customers get clearer, more considerate responses.', gap: 'Repeated customer frustration is not visible across departments.', next: 'Use permitted service records to review recurring issues with Operations.', system: 'Zendesk' },
  { id: 'elena', name: 'Elena', role: 'Coordinator', ai: 'Copilot', output: 'Thursday tracker', color: '#8a98b2', current: 'Barely uses Copilot. A generic “help with projects” prompt did not help.', value: 'She still updates the Thursday tracker manually in Excel.', gap: 'A license did not show her how AI could help with her actual task.', next: 'Spend ten minutes beside Elena on her real tracker. Teach one useful step before proposing a build.', system: 'Excel · Manual tracker' },
  { id: 'leah', name: 'Leah', role: 'Chief of Staff', ai: 'Copilot', output: 'Friday briefing', color: '#a68b9f', current: 'Uses Copilot to polish PowerPoint wording after manually assembling the Friday update.', value: 'The presentation reads more clearly after she has gathered the facts.', gap: 'Copilot does not remove her collection, comparison and reconciliation work.', next: 'Build the brief from reviewed findings, named owners and current progress.', system: 'PowerPoint' }
]);
export const networkConnections = Object.freeze([
  { from: 'nina', to: 'ava', why: 'Service reviews the recurring customer issue with Ops.' },
  { from: 'nina', to: 'marcus', why: 'The account owner gets the reviewed cases relevant to his customer.' },
  { from: 'nina', to: 'leah', why: 'The Friday brief gets evidence, an owner and current progress.' },
  { from: 'ben', to: 'priya', why: 'Finance can inspect the reviewed forecast assumptions.' },
  { from: 'priya', to: 'daniel', why: 'IT helps maintain and reuse the reviewed Power Query method.' },
  { from: 'leah', to: 'dana', why: 'The CEO sees the reviewed finding and who owns the next step.' },
  { from: 'daniel', to: 'elena', why: 'IT offers ten-minute coaching on Elena’s real tracker task.' }
]);
const point = (angle, rx, ry) => ({ x: 450 + Math.cos(angle) * rx, y: 280 + Math.sin(angle) * ry });
export function buildNetwork(mode = 'fragmented') {
  const connected = mode === 'connected';
  const nodes = [];
  const edges = [];
  for (const [index, person] of networkPeople.entries()) {
    const angle = -Math.PI / 2 + index * Math.PI * 2 / networkPeople.length;
    const ownerNode = { id: `person:${person.id}`, owner: person.id, type: 'person', label: person.name, sublabel: person.role, color: person.color, angle, ...point(angle, 284, 170) };
    const aiNode = { id: `ai:${person.id}`, owner: person.id, type: 'ai', label: person.ai, color: person.color, angle: angle - .10, ...point(angle - .10, 359, 231) };
    const outputNode = { id: `output:${person.id}`, owner: person.id, type: 'output', label: person.id === 'marcus' && connected ? 'CRM observation' : person.output, color: person.color, angle: angle + .13, ...point(angle + .13, 187, 109) };
    nodes.push(ownerNode, aiNode, outputNode);
    edges.push({ from: ownerNode.id, to: aiNode.id, type: 'local', label: `${person.name} uses ${person.ai}` });
    edges.push({ from: ['marcus', 'elena', 'leah'].includes(person.id) ? ownerNode.id : aiNode.id, to: outputNode.id, type: 'local', label: person.id === 'marcus' ? 'Marcus can volunteer a business observation separately' : person.id === 'elena' ? 'Elena maintains the tracker manually; AI did not produce it' : person.id === 'leah' ? 'Leah manually assembles the brief before Copilot polishes the wording' : `Local work produces ${person.output.toLowerCase()}` });
    if (connected) edges.push({ from: outputNode.id, to: 'hub:records', type: 'proposed', label: person.id === 'marcus' ? 'Volunteered account observation only; private Grok chats stay private' : person.id === 'priya' ? 'Reviewed Power Query transformation; not private Claude history' : `Reviewed ${person.output.toLowerCase()} shared with the appropriate owners` });
  }
  if (connected) edges.push(...networkConnections.map(link => ({ from: `output:${link.from}`, to: `person:${link.to}`, type: 'handoff', label: link.why })));
  if (connected) nodes.push({ id: 'hub:records', owner: null, type: 'hub', label: 'Shared business records', x: 450, y: 280, color: '#334f60', angle: 0 });
  return { nodes, edges };
}
function nodeMarkup(node, selected, focused) {
  const isPerson = node.type === 'person';
  const isHub = node.type === 'hub';
  const classes = ['map-node', `map-node-${node.type}`, selected ? 'selected' : '', focused ? 'in-focus' : 'outside-focus'].filter(Boolean).join(' ');
  const description = isHub ? 'Shared business records. Proposed connection with human review and scoped access.' : `${node.label}, ${node.type === 'ai' ? 'AI workspace' : node.type === 'output' ? 'business output' : node.sublabel}. Select to inspect.`;
  if (isHub) return `<a href="#" class="${classes}" data-map-node="${node.id}" role="button" tabindex="0" aria-label="${escapeHtml(description)}" aria-pressed="${selected}"><rect class="node-hit" x="${node.x-75}" y="${node.y-26}" width="150" height="52" rx="5"/><rect class="hub-shape" x="${node.x-68}" y="${node.y-22}" width="136" height="44" rx="4"/><text class="hub-label" x="${node.x}" y="${node.y-2}" text-anchor="middle">Shared business</text><text class="hub-label" x="${node.x}" y="${node.y+13}" text-anchor="middle">records</text></a>`;
  const radius = isPerson ? 11 : node.type === 'ai' ? 6 : 4;
  const horizontal = Math.abs(Math.cos(node.angle)) > .32;
  const labelOnRight = Math.cos(node.angle) > 0;
  const anchor = horizontal ? (labelOnRight ? 'start' : 'end') : 'middle';
  const labelX = node.x + (horizontal ? (labelOnRight ? 17 : -17) : 0);
  const labelY = node.y + (horizontal ? -2 : node.type === 'ai' ? -15 : isPerson ? 26 : 20);
  const labelWidth = Math.max(48, node.label.length * (isPerson ? 7.3 : 5.5));
  const labelLeft = anchor === 'middle' ? labelX-labelWidth/2-5 : anchor === 'end' ? labelX-labelWidth-5 : labelX-5;
  const boundsLeft = Math.min(node.x-17, labelLeft);
  const boundsRight = Math.max(node.x+17, labelLeft+labelWidth+10);
  return `<a href="#" class="${classes}" data-map-node="${node.id}" role="button" tabindex="0" aria-label="${escapeHtml(description)}" aria-pressed="${selected}" style="--cluster:${node.color}"><title>${escapeHtml(description)}</title><rect class="node-hit" x="${boundsLeft.toFixed(1)}" y="${Math.min(node.y-18,labelY-16).toFixed(1)}" width="${(boundsRight-boundsLeft).toFixed(1)}" height="${isPerson?55:42}" rx="3"/>${selected?`<rect class="selected-label" x="${labelLeft.toFixed(1)}" y="${labelY-13}" width="${labelWidth+10}" height="${isPerson?34:21}" rx="3"/>`:''}${node.type==='output'?`<rect class="node-shape" x="${node.x-radius}" y="${node.y-radius}" width="${radius*2}" height="${radius*2}" rx="1"/>`:`<circle class="node-shape" cx="${node.x}" cy="${node.y}" r="${radius}"/>`}<text class="node-label" x="${labelX.toFixed(1)}" y="${labelY.toFixed(1)}" text-anchor="${anchor}">${escapeHtml(node.label)}</text>${isPerson?`<text class="node-sublabel" x="${labelX.toFixed(1)}" y="${labelY+14}" text-anchor="${anchor}">${escapeHtml(node.sublabel)}</text>`:''}</a>`;
}
function inspector(node, connected) {
  if (node.type === 'hub') return `<aside class="map-inspector" aria-label="Selected network node"><div class="map-inspector-top"><small>PROPOSED DESIGN</small><h2>Shared business records</h2><p>Connect the work people choose to share.</p></div><dl><div><dt>What moves</dt><dd>Reviewed findings, approved transformations, account observations, owners and progress.</dd></div><div><dt>What stays private</dt><dd>Personal AI conversations and unapproved working material.</dd></div><div><dt>How it is controlled</dt><dd>Source links, permissions, human review and verified updates.</dd></div></dl><p class="map-proposal-note">These lines show a proposed design. No live integration or private-chat access is implied.</p><button class="text-button" data-detail="architecture">Inspect the connection design ↗</button></aside>`;
  const person = networkPeople.find(row => row.id === node.owner);
  const outgoing = networkConnections.filter(link => link.from === person.id);
  const incoming = networkConnections.filter(link => link.to === person.id);
  const relevant = outgoing.length ? outgoing.map(link => ({ id: link.to, label: link.why })) : incoming.map(link => ({ id: link.from, label: link.why }));
  const recipients = connected && relevant.length ? `<div class="map-recipients"><small>${outgoing.length ? 'WHO CAN USE THIS NEXT' : 'WHAT COULD REACH THIS PERSON'}</small>${relevant.map(link => { const recipient = networkPeople.find(row => row.id === link.id); return `<button data-map-node="person:${recipient.id}"><b>${recipient.name} · ${recipient.role}</b><span>${escapeHtml(link.label)}</span></button>`; }).join('')}</div>` : '';
  const type = node.type === 'person' ? 'EMPLOYEE' : node.type === 'ai' ? 'AI WORKSPACE' : 'BUSINESS OUTPUT';
  return `<aside class="map-inspector" aria-label="Selected network node"><div class="map-inspector-top"><small>${type} · ${escapeHtml(person.role)}</small><h2>${escapeHtml(node.type === 'person' ? person.name : node.label)}</h2><p>${escapeHtml(person.name)} · ${escapeHtml(person.system)}</p></div>${connected?`<dl><div class="map-inspector-emphasis"><dt>What we could connect</dt><dd>${escapeHtml(person.next)}</dd></div></dl>${recipients}<details class="map-current-detail"><summary>Current work and value</summary><p>${escapeHtml(person.current)}</p><p>${escapeHtml(person.value)}</p><p>${escapeHtml(person.gap)}</p></details>`:`<dl><div><dt>What happens today</dt><dd>${escapeHtml(person.current)}</dd></div><div><dt>The work today</dt><dd>${escapeHtml(person.value)}</dd></div><div class="map-inspector-emphasis"><dt>What stays local</dt><dd>${escapeHtml(person.gap)}</dd></div></dl>`}<p class="map-proposal-note">${connected?'Proposed design · Approved business outputs only.':'Everyone has a Copilot license. Actual AI use varies by person.'}</p><button class="map-workspace-link" data-detail="workspace:${person.id}">Open ${escapeHtml(person.name)}’s workspace ↗</button></aside>`;
}
export function renderCompanyMap(state = {}) {
  const mode = state.networkMode === 'connected' ? 'connected' : 'fragmented';
  const connected = mode === 'connected';
  const graph = buildNetwork(mode);
  const requestedNode = state.mapNode || `person:${state.person || 'priya'}`;
  const selected = graph.nodes.find(node => node.id === requestedNode) || graph.nodes.find(node => node.id === 'person:priya');
  const focus = new Set([selected.id]);
  if (selected.type === 'hub') {
    graph.nodes.filter(node => node.type === 'output').forEach(node => focus.add(node.id));
  } else {
    graph.nodes.filter(node => node.owner === selected.owner).forEach(node => focus.add(node.id));
    if (connected) {
      focus.add('hub:records');
      networkConnections.filter(link => link.from === selected.owner).forEach(link => focus.add(`person:${link.to}`));
      networkConnections.filter(link => link.to === selected.owner).forEach(link => focus.add(`output:${link.from}`));
    }
  }
  const edges = graph.edges.map(edge => {
    const from = graph.nodes.find(node => node.id === edge.from);
    const to = graph.nodes.find(node => node.id === edge.to);
    const active = focus.has(from.id) && focus.has(to.id);
    const path = edge.type === 'handoff' ? `M ${from.x.toFixed(1)} ${from.y.toFixed(1)} Q 450 280 ${to.x.toFixed(1)} ${to.y.toFixed(1)}` : `M ${from.x.toFixed(1)} ${from.y.toFixed(1)} L ${to.x.toFixed(1)} ${to.y.toFixed(1)}`;
    return `<path class="map-edge ${edge.type} ${active?'in-focus':''}" data-edge-from="${from.id}" data-edge-to="${to.id}" d="${path}" ${edge.type==='handoff'?'marker-end="url(#map-handoff-arrow)"':''}><title>${escapeHtml(edge.label)}</title></path>`;
  }).join('');
  return `<section class="company-network" aria-label="Interactive map of AI work across Parkside"><header class="map-toolbar"><div><b>Parkside · 150 people</b><span>9 desks · One company-wide Copilot license rollout</span></div><div class="map-mode" role="group" aria-label="Connection mode"><button data-network-mode="fragmented" aria-pressed="${!connected}">Today: separate work</button><button data-network-mode="connected" aria-pressed="${connected}">Proposed connections</button></div><button class="map-reset" data-map-reset aria-label="Reset map selection">Reset view</button></header><div class="network-layout"><div class="map-canvas"><svg class="company-map" viewBox="0 0 900 560" role="group" aria-label="${connected?'Proposed connections between reviewed business outputs':'Nine separate employee AI workspaces'}. Select a person, tool or output for details."><desc>Each cluster contains an employee, the AI they use and a business output. ${connected?'Only reviewed business outputs connect to the shared records hub. Private chat histories are not connected.':'There are no cross-department connections in this illustrative current-state map.'}</desc><defs><marker id="map-handoff-arrow" markerWidth="5" markerHeight="5" refX="12" refY="2.5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L5,2.5 L0,5" fill="#7995a4"/></marker></defs><g class="map-edges" aria-hidden="true">${edges}</g>${!connected?'<g class="map-center-note" aria-hidden="true"><text x="450" y="276" text-anchor="middle">Useful work.</text><text x="450" y="295" text-anchor="middle">Separate places.</text></g>':''}<g class="map-nodes">${graph.nodes.map(node=>nodeMarkup(node,node.id===selected.id,focus.has(node.id))).join('')}</g></svg><footer class="map-legend"><span><i class="legend-person"></i>Person</span><span><i class="legend-ai"></i>AI workspace</span><span><i class="legend-output"></i>Business output</span><small>${connected?'Proposed design · Not live integrations':'Select any node to inspect the work'}</small></footer></div>${inspector(selected,connected)}</div></section>`;
}
