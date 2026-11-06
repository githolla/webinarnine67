const money = value => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
export const branchFiles = Object.freeze([
  { branch: 'North', file: 'North.csv', headers: ['Vendor', 'Invoice', 'Amount'], rows: [['AcmeLtd', 'N101', 1200]] },
  { branch: 'East', file: 'East.xlsx', headers: ['Supplier', 'Invoice', 'Total'], rows: [['ACME LTD.', 'N101', 1200]] },
  { branch: 'West', file: 'West.csv', headers: ['Payee', 'Invoice', 'Cost'], rows: [['NorthOffice', 'W203', 850]] }
]);
export function normalizeVendor(value) {
  const key = value.toLowerCase().replace(/[^a-z0-9]/g, '');
  return ({ acmeltd: 'Acme Ltd', northoffice: 'North Office' })[key] || value.trim();
}
export const approvedNotes = Object.freeze([
  { id: 'NOTE-01', text: 'Operations will own the customer handoff review. Next update: Tuesday, November 10.' },
  { id: 'NOTE-02', text: 'Ben confirmed that the sales forecast review is complete.' },
  { id: 'NOTE-03', text: 'Ava shared the customer examples. They are ready for review.' }
]);
const initialTracker = [
  { id: 'T-41', task: 'Customer handoff review', owner: 'Unassigned', due: 'Not set', status: 'Open', source: 'NOTE-01' },
  { id: 'T-42', task: 'Sales forecast review', owner: 'Ben', due: 'November 9', status: 'In progress', source: 'NOTE-02' },
  { id: 'T-43', task: 'Customer examples', owner: 'Ava', due: 'November 9', status: 'Awaiting input', source: 'NOTE-03' }
];
export const sourceCase = Object.freeze({
  id: 'CASE-201', account: 'Northwind', title: 'Implementation handoff has no receiving owner',
  text: 'The implementation team marked its setup task complete. The receiving service-owner field was empty, and the customer asked who would handle the next step.'
});
export const finding = Object.freeze({ id: 'HF-01', title: 'A customer handoff needs a receiving owner', sourceId: 'CASE-201', account: 'Northwind', owner: 'Nina', due: 'Tuesday, November 10', status: 'Investigation assigned' });
export function initialBuildState() {
  return {
    priya: { submitted: false, duplicateDecision: null, published: false, reuseStarted: false, reused: false },
    elena: { proposed: false, owner: null, applied: false },
    nina: { sourceExcluded: false, sourceOpened: false, confirmed: false, assigned: false, published: false }
  };
}
export function financeReport(builds) {
  const seen = new Set();
  const rows = branchFiles.flatMap(file => file.rows.map(([rawVendor, id, amount], index) => {
    const vendor = normalizeVendor(rawVendor);
    const key = `${vendor.toLowerCase()}|${id}|${amount}`;
    const duplicate = seen.has(key);
    seen.add(key);
    return { id, vendor, rawVendor, amount, branch: file.branch, source: `${file.file} · row ${index + 2}`, duplicate };
  }));
  const included = builds.priya.duplicateDecision === 'exclude' ? rows.filter(row => !row.duplicate) : rows;
  return { rows: included, total: included.reduce((sum, row) => sum + row.amount, 0), inputRows: rows.length, outputRows: included.length, exceptions: rows.filter(row => row.duplicate).length, reviewed: Boolean(builds.priya.duplicateDecision), published: builds.priya.published, operator: builds.priya.reused ? 'Maya' : 'Priya', rulesVersion: 'v1' };
}
export function trackerRows(builds) {
  return initialTracker.map(row => {
    if (!builds.elena.applied) return { ...row };
    if (row.id === 'T-41') return { ...row, owner: 'Nina', due: 'November 10', status: 'Review scheduled' };
    if (row.id === 'T-42') return { ...row, status: 'Complete' };
    return { ...row, status: 'Ready for review' };
  });
}
export function publishedFinding(builds) {
  return builds.nina.published ? { ...finding, reviewedBy: 'Nina', revision: 1, outcome: 'Open; no resolution claimed' } : null;
}
export function transitionBuild(current, action) {
  const type = typeof action === 'string' ? action : action.type === 'BUILD' ? action.action : action.type;
  const next = { priya: { ...current.priya }, elena: { ...current.elena }, nina: { ...current.nina } };
  if (type === 'finance-submit') next.priya.submitted = true;
  else if ((type === 'finance-exclude' || type === 'finance-keep') && next.priya.submitted && !next.priya.published) next.priya.duplicateDecision = type === 'finance-exclude' ? 'exclude' : 'keep';
  else if (type === 'finance-publish' && next.priya.submitted && next.priya.duplicateDecision) next.priya.published = true;
  else if (type === 'finance-reuse' && next.priya.published) next.priya.reuseStarted = true;
  else if(type === 'finance-review-reuse' && next.priya.reuseStarted) next.priya.reused=true;
  else if (type === 'tracker-propose') next.elena.proposed = true;
  else if ((type === 'tracker-owner-nina' || type === 'tracker-owner-ben') && next.elena.proposed && !next.elena.applied) next.elena.owner = type === 'tracker-owner-nina' ? 'Nina' : 'Ben';
  else if (type === 'tracker-apply' && next.elena.proposed && next.elena.owner === 'Nina') next.elena.applied = true;
  else if (type === 'ops-open-source') next.nina.sourceOpened = true;
  else if(type === 'ops-exclude-source' && !next.nina.published){next.nina.sourceExcluded=true;next.nina.confirmed=false;}
  else if(type === 'ops-restore-source' && !next.nina.published)next.nina.sourceExcluded=false;
  else if (type === 'ops-confirm' && next.nina.sourceOpened && !next.nina.sourceExcluded) next.nina.confirmed = true;
  else if (type === 'ops-assign-publish' && next.nina.confirmed && !next.nina.sourceExcluded) { next.nina.assigned = true; next.nina.published = true; }
  return next;
}
const crew = {
  priya: { name: 'Priya', role: 'Finance Analyst', ai: 'Claude', icon: 'claude.svg', verdict: 'win' },
  nina: { name: 'Nina', role: 'Operations', ai: 'Ask Ops', icon: 'ms-teams.svg', verdict: 'win' },
  marcus: { name: 'Marcus', role: 'Account Manager', ai: 'Grok', icon: 'grok.svg', verdict: 'diff' },
  leah: { name: 'Leah', role: 'Chief of Staff', ai: 'Copilot', icon: 'copilot.webp', verdict: 'glue' }
};
const verdictLabel = { win: 'AI WIN', diff: 'DIFFERENT WAY', stuck: 'STRUGGLING', glue: 'THE GLUE' };
function token(id, chip = true) {
  const p = crew[id];
  return `<div class="bx-token v-${p.verdict}"><span class="bx-av" aria-hidden="true">${p.name[0]}</span><span class="bx-who"><b>${p.name}</b><small>${p.role}</small></span><span class="bx-row"><span class="bx-tool"><img src="assets/${p.icon}" alt="">${p.ai}</span>${chip ? `<span class="bx-verdict">${verdictLabel[p.verdict]}</span>` : ''}</span></div>`;
}
function mayaToken(solid, note = 'Finance analyst') { return `<div class="bx-token is-maya ${solid ? 'is-solid' : 'is-ghost'}"><span class="bx-av" aria-hidden="true">M</span><span class="bx-who"><b>Maya · other branch</b><small>${note}</small></span></div>`; }
function frame(icon, title, body, meta = '', cls = '') { return `<section class="bx-frame ${cls}"><header class="bx-bar"><img src="assets/${icon}" alt=""><b>${title}</b>${meta ? `<span class="bx-meta">${meta}</span>` : ''}</header><div class="bx-body">${body}</div></section>`; }
function stepper(names, current, complete) {
  return `<ol class="bx-stepper" aria-label="Build steps">${names.map((name, i) => { const status = i < current || (complete && i === current) ? 'done' : i === current ? 'current' : 'next'; return `<li class="is-${status}"${i === current ? ' aria-current="step"' : ''}><span class="bx-disc" aria-hidden="true">${status === 'done' ? '✓' : i + 1}</span><span class="bx-step">${name}</span></li>`; }).join('')}</ol>`;
}
function caption(next) { return next ? `<p class="bx-caption"><span class="bx-key" aria-hidden="true">→</span><span>${next[1]}</span>${next[2] ? '<span class="bx-hint">→ chooses recommended</span>' : ''}</p>` : ''; }
function forward(next, complete) { return `<footer class="build-footer">${next ? `<button class="build-primary" data-build-action="${next[0]}" aria-label="Next step: ${next[1]}">Next step →</button>` : `<span class="build-complete">${complete}</span>`}</footer>`; }
function choice(action, label, selected) { return `<button class="bx-choice${selected ? ' is-selected' : ''}" data-build-action="${action}" aria-pressed="${selected}">${selected ? '✓ ' : ''}${label}</button>`; }
function band(line, sub = '') { return `<div class="bx-band"><p>${line}</p>${sub ? `<small>${sub}</small>` : ''}</div>`; }
function heading(n, title, aside = '') { return `<header class="bx-heading"><div><small class="bx-eyebrow">Discover &amp; build · Build ${n} of 3</small><h2>${title}</h2></div>${aside}</header>`; }
function tabs(active) {
  return `<nav class="improvement-tabs" aria-label="Concrete improvements">${[['priya', 'Priya', 'A reusable finance workflow'], ['elena', 'Elena', 'Specific help with her real work'], ['nina', 'Nina', 'A finding reaches the next owner']].map(([id, name, label]) => `<button data-improvement="${id}" aria-pressed="${id === active}"><b>${name}</b><span>${label}</span></button>`).join('')}</nav>`;
}
function finance(builds) {
  const state = builds.priya;
  const report = financeReport(builds);
  const step = !state.submitted ? 0 : !state.published ? 1 : !state.reuseStarted ? 2 : !state.reused ? 3 : 4;
  const next = !state.submitted ? ['finance-submit', 'Submit the three branch files'] : !state.duplicateDecision ? ['finance-exclude', 'Priya reviews the possible duplicate', true] : !state.published ? ['finance-publish', state.duplicateDecision === 'keep' ? 'Publish with duplicate retained' : 'Publish Priya’s reviewed report'] : !state.reuseStarted ? ['finance-reuse', 'Maya submits her branch files'] : !state.reused ? ['finance-review-reuse', 'Maya reviews the duplicate and runs the report'] : null;
  const input = step === 0
    ? frame('ms-excel.svg', 'Excel · Three branch files', `<table class="bx-files"><thead><tr><th>Source</th><th>Incoming headers</th><th>Sample row</th></tr></thead><tbody>${branchFiles.map(file => `<tr><td><b>${file.branch}</b><small>${file.file}</small></td><td>${file.headers.join(' / ')}</td><td>${file.rows.map(([vendor, id, amount]) => `${vendor}<small>${id} · ${money(amount)}</small>`).join('')}</td></tr>`).join('')}</tbody></table><p class="bx-note"><b>Claude helped Priya build the vendor mapping.</b> Excel and the repeatable workflow run it. Priya owns the rules, version v1.</p>`, 'One agreed format')
    : frame('ms-excel.svg', 'Excel · Three branch files', `<ul class="bx-compact">${branchFiles.map(file => `<li><b>${file.file}</b><span>${file.headers.join(' / ')}</span></li>`).join('')}</ul><p class="bx-map"><span>Vendor / Supplier / Payee</span><i aria-hidden="true">→</i><b>Vendor + Invoice + Amount</b></p><p class="bx-note">Rules v1 · owned by Priya</p>`, '', 'is-quiet');
  const decision = state.duplicateDecision;
  const people = `<div class="bx-pair ${state.reused ? 'is-linked' : ''}">${token('priya', false)}${step >= 3 ? `<span class="bx-link" aria-hidden="true">${state.reused ? '✓' : ''}</span>${mayaToken(true, state.reused ? 'Run by Maya' : 'Maya’s run')}` : ''}</div>`;
  const output = step === 0
    ? frame('ms-excel.svg', 'Reviewed report', `<h3 class="bx-plan">Map the columns.<br>Flag exceptions.<br>Publish after review.</h3><div class="bx-aside">${mayaToken(false)}<p>Maya, another Finance analyst, can use Priya’s tested process.</p></div>`, 'Not yet run', 'is-quiet')
    : step === 1
      ? frame('ms-excel.svg', 'Exception review · East.xlsx', `<h3>N101 appears in two files.</h3><p class="bx-lede">North and East both contain <b>N101 · ${money(1200)}</b>. “AcmeLtd” and “ACME LTD.” map to Acme Ltd. Priya reviews the possible duplicate.</p><div class="build-choices">${choice('finance-exclude', 'Exclude the duplicate', decision === 'exclude')}${choice('finance-keep', 'Keep both rows', decision === 'keep')}</div><p class="bx-small">${decision ? `Priya’s decision: ${decision === 'exclude' ? 'exclude the East row' : 'retain both rows'}. Result: <b>${report.outputRows} rows · ${money(report.total)}</b>.` : 'The report stays unpublished until the exception is reviewed.'}</p>`, '1 exception', 'is-changed')
      : frame('ms-excel.svg', step === 3 ? 'Maya’s run · review required' : 'Reviewed report · Rule set v1', `${people}${step === 3 ? '<p class="bx-lede">Maya submits the same illustrative branch files. N101 is flagged again. She must review the exception for her run.</p>' : ''}<div class="bx-total"><strong>${money(report.total)}</strong><span>${report.outputRows} included rows</span></div><table class="bx-rows"><thead><tr><th>Normalized vendor / invoice</th><th>Reviewed expense</th></tr></thead><tbody>${report.rows.map(row => `<tr><td>${row.vendor}<small>${row.id} · ${row.branch}</small></td><td>${money(row.amount)}</td></tr>`).join('')}</tbody></table>${step === 3 ? '' : `<p class="bx-small"><b>Run by ${report.operator}.</b> ${decision === 'exclude' ? 'Duplicate N101 from East excluded' : 'Both N101 rows retained by Priya'}; the decision stays with the report.</p>`}`, step === 3 ? '' : `Run by ${report.operator}`, `is-changed ${step === 3 ? 'is-pending' : ''}`);
  return `${heading(1, 'Her useful refresh becomes a workflow others can run.')}${stepper(['Files in', 'Exception', 'Published', 'Maya runs it', 'Reused'], step, state.reused)}${caption(next)}<div class="bx-split finance-build">${input}${output}</div>${state.reused ? band('Maya ran Priya’s method. Same result. No rebuild.', 'The method no longer lives only with Priya.') : ''}${forward(next, 'Maya produced the same reviewed result using rule set v1.')}`;
}
function tracker(builds) {
  const state = builds.elena;
  const rows = trackerRows(builds);
  const step = !state.proposed ? 0 : state.owner !== 'Nina' ? 1 : !state.applied ? 2 : 3;
  const next = !state.proposed ? ['tracker-propose', 'Propose tracker updates from these notes'] : state.owner !== 'Nina' ? ['tracker-owner-nina', 'Operations owns the handoff review. Elena chooses who is accountable', true] : !state.applied ? ['tracker-apply', 'Apply Elena’s reviewed updates'] : null;
  const diff = row => {
    if (!state.proposed) return `<span class="bx-cell ${row.owner === 'Unassigned' ? 'is-stuck' : ''}">${row.owner}</span><span class="bx-cell">${row.status}</span><span class="bx-cell">${row.due}</span>`;
    const [from, to, sub] = row.id === 'T-41' ? ['Unassigned', state.owner === 'Nina' ? 'Nina' : 'choose owner', state.applied ? `Due ${row.due} · ${row.status}` : 'Due November 10'] : row.id === 'T-42' ? ['In progress', 'Complete', ''] : ['Awaiting input', 'Ready for review', ''];
    return `<s>${from}</s><i aria-hidden="true">→</i><b class="${to === 'choose owner' ? 'is-open' : ''}">${to}</b>${sub ? `<small>${sub}</small>` : ''}`;
  };
  const notes = frame('ms-teams.svg', 'Teams · Approved meeting notes', `<ol class="bx-notes">${approvedNotes.map(note => `<li><small class="bx-tag">${note.id}</small><p>${note.text}</p></li>`).join('')}</ol>`, '', step < 2 ? '' : 'is-quiet');
  const table = frame('ms-excel.svg', `Excel · ${state.applied ? 'Updated tracker' : state.proposed ? 'Proposed changes' : 'Current tracker'}`, `<ol class="bx-tracker">${rows.map(row => `<li class="${state.applied ? 'field-updated' : ''}"><div class="bx-task"><b>${row.task}</b><small class="bx-tag">Source: ${row.source}</small></div><div class="bx-diff">${diff(row)}</div></li>`).join('')}</ol>${state.proposed && !state.applied ? `<div class="bx-owner"><b>Who is accountable for the handoff review?</b><div class="build-choices">${choice('tracker-owner-nina', 'Nina · Operations', state.owner === 'Nina')}${choice('tracker-owner-ben', 'Ben · Sales', state.owner === 'Ben')}</div>${state.owner === 'Ben' ? '<p class="bx-small">Ben owns Sales. NOTE-01 specifies Operations. Check the owner before applying.</p>' : ''}</div>` : ''}`, state.applied ? 'Reviewed changes applied' : '', step === 0 ? '' : 'is-changed');
  const callback = state.applied ? '<p class="bx-callback">Stop 10: generic advice at 3:42. Now: her real notes, her real tracker.</p>' : '';
  return `${heading(2, 'Use approved notes to update the actual tracker.')}${stepper(['Current tracker', 'Proposed', 'Owner chosen', 'Applied'], step, state.applied)}${caption(next)}${callback}<div class="bx-split tracker-build ${state.proposed ? 'is-linked' : ''}">${notes}${table}</div>${state.applied ? band('Her real notes. Her real tracker. Three rows updated with sources.', 'Specific inputs, three changes, one reviewed tracker.') : ''}${forward(next, 'Three tracker rows updated with their source references.')}`;
}
function operations(builds) {
  const state = builds.nina;
  const published = publishedFinding(builds);
  const step = !state.sourceOpened ? 0 : !state.confirmed ? 1 : !state.published ? 2 : 3;
  const next = state.sourceExcluded ? ['ops-restore-source', 'CASE-201 is excluded, so nothing can publish. Restore CASE-201 for review'] : !state.sourceOpened ? ['ops-open-source', 'Inspect the original source'] : !state.confirmed ? ['ops-confirm', 'Record Nina’s review of this finding'] : !state.published ? ['ops-assign-publish', 'Assign Nina, set the date, and share'] : null;
  const evidence = state.sourceOpened ? `<p class="bx-lede"><b>${sourceCase.id} · ${sourceCase.account}:</b> ${sourceCase.text}</p>` : '<p class="bx-lede">The bot links the finding to an original case. Nina reviews that evidence before sharing it.</p>';
  const hubBody = published
    ? `<p class="bx-hub-title">${published.id} · ${published.title}</p><div class="bx-hub-line"><p class="bx-lede">Next action: confirm the receiving Service owner.</p><dl class="bx-status"><div><dt>Status</dt><dd>${published.status}</dd></div></dl></div>`
    : `<p class="bx-hub-title">${finding.id} · ${finding.title}</p>${evidence}${state.confirmed ? '<p class="bx-chip-ok">✓ Reviewed; ready to assign</p>' : ''}`;
  const links = '<span class="source-actions"><button class="build-link" data-detail="source:CASE-201">Open CASE-201 ↗</button><button class="build-link" data-detail="supporting-cases">Review supporting cases ↗</button></span>';
  const lock = '<span class="bx-lock"><svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="7" width="10" height="8" rx="1.5"/><path d="M5 7V5a3 3 0 0 1 6 0v2" fill="none"/></svg>No private AI chat is read. Only reviewed business evidence is shared.</span>';
  const hub = frame('ms-teams.svg', published ? `Nina reviewed and published · ${published.sourceId}` : 'Ask Ops · proposed finding', hubBody + links, lock, `bx-hub ${published ? 'is-quiet' : step ? 'is-changed' : ''}`);
  const tiles = [['nina', 'Teams', 'ms-teams.svg', 'Finding reviewed and published'], ['marcus', 'HubSpot', 'hubspot.svg', 'Attached to Northwind’s account'], ['leah', 'Weekly review', 'ms-powerpoint.svg', 'Included in Friday’s briefing']];
  const wires = `<svg class="bx-wires ${published ? 'is-shared' : ''}" viewBox="0 0 1200 56" preserveAspectRatio="none" aria-hidden="true">${[200, 600, 1000].map(x => `<path d="M600 0 C600 30 ${x} 26 ${x} 56" vector-effect="non-scaling-stroke"/>`).join('')}</svg>`;
  const tileHtml = tiles.map(([id, tool, icon, context]) => `<section class="bx-tile ${published ? 'is-shared' : ''}"><header>${token(id)}<span class="bx-dest"><img src="assets/${icon}" alt="">${tool}</span></header><h3>${context}</h3>${published ? `<div class="bx-badge field-updated"><b>${published.id} attached</b><dl><div><dt>Owner</dt><dd>${published.owner}</dd></div><div><dt>Due</dt><dd>${published.due}</dd></div></dl></div>${id === 'leah' ? '<p class="bx-callback">Who owns the next step? → Owner: Nina</p>' : ''}` : '<p class="bx-empty">Not shared yet</p>'}</section>`).join('');
  return `${heading(3, 'A reviewed finding reaches the people who need it.')}${stepper(['Proposed', 'Source checked', 'Reviewed', 'Shared to 3 places'], step, Boolean(published))}${caption(next)}<div class="bx-hubwrap ops-build">${hub}${wires}<div class="bx-tiles">${tileHtml}</div></div>${published ? band('One finding. Three people. Same owner, same date.', 'The investigation is assigned. The customer issue is still open.') : ''}${forward(next, 'The same reviewed finding is visible in all three places.')}`;
}
export function renderBuilds(state) {
  const active = ['priya', 'elena', 'nina'].includes(state.improvement) ? state.improvement : 'priya';
  const builds = state.builds || initialBuildState();
  return `<div class="concrete-builds" data-active-build="${escapeHtml(active)}">${tabs(active)}<div class="build-surface">${({ priya: finance, elena: tracker, nina: operations })[active](builds)}</div></div>`;
}
