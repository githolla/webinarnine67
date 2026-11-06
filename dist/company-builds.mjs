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
function button(action, label, secondary = false) { return `<button class="${secondary ? 'build-secondary' : 'build-primary'}" data-build-action="${action}">${label}</button>`; }
function tabs(active) {
  return `<nav class="improvement-tabs" aria-label="Concrete improvements">${[['priya', 'Priya', 'A reusable finance workflow'], ['elena', 'Elena', 'Specific help with her real work'], ['nina', 'Nina', 'A finding reaches the next owner']].map(([id, name, label]) => `<button data-improvement="${id}" aria-pressed="${id === active}"><b>${name}</b><span>${label}</span></button>`).join('')}</nav>`;
}
function finance(builds) {
  const state = builds.priya;
  const report = financeReport(builds);
  const action = !state.submitted ? button('finance-submit', 'Submit the three branch files →') : !state.duplicateDecision ? '' : !state.published ? button('finance-publish', state.duplicateDecision === 'keep' ? 'Publish with duplicate retained →' : 'Publish Priya’s reviewed report →') : !state.reuseStarted ? button('finance-reuse', 'Maya submits her branch files →') : !state.reused ? button('finance-review-reuse', 'Maya reviews the duplicate and runs the report →') : '<span class="build-complete">Maya produced the same reviewed result using rule set v1.</span>';
  return `<header class="build-heading"><div><small>PRIYA · FINANCE</small><h2>Her useful refresh becomes a workflow others can run.</h2></div><span class="build-status">${state.reused ? 'Reused by Maya' : state.reuseStarted ? 'Maya’s exception review' : state.published ? 'Report published' : state.submitted ? 'Exception review' : 'Three incoming files'}</span></header><div class="build-workspace finance-build"><section class="build-input"><h3 class="build-brand"><img src="assets/ms-excel.svg" alt=""> Excel · One agreed format</h3><table class="branch-inputs"><thead><tr><th>Source</th><th>Incoming headers</th><th>Sample rows</th></tr></thead><tbody>${branchFiles.map(file => `<tr><td><b>${file.branch}</b><small>${file.file}</small></td><td>${file.headers.join(' / ')}</td><td>${file.rows.map(([vendor, id, amount]) => `${vendor}<br>${id} · ${money(amount)}`).join('<br>')}</td></tr>`).join('')}</tbody></table><p class="build-context"><b>Claude helped Priya build the vendor mapping.</b> Excel and the repeatable workflow run it. Priya owns the rules, version v1.</p></section><section class="build-output">${!state.submitted ? '<div class="build-placeholder"><small>THE NEXT BUILD</small><h3>Map the columns.<br>Flag exceptions.<br>Publish after review.</h3><p>Maya, another Finance analyst, can use Priya’s tested process.</p></div>' : !state.published ? `<div class="exception-review"><small>1 EXCEPTION · EAST.XLSX</small><h3>N101 appears in two files.</h3><p>North and East both contain <b>N101 · ${money(1200)}</b>. “AcmeLtd” and “ACME LTD.” map to Acme Ltd. Priya reviews the possible duplicate.</p><div class="build-choices">${button('finance-exclude', 'Exclude the duplicate', state.duplicateDecision !== 'exclude')}${button('finance-keep', 'Keep both rows', state.duplicateDecision !== 'keep')}</div>${state.duplicateDecision ? `<p class="decision-note">Priya’s decision: ${state.duplicateDecision === 'exclude' ? 'exclude the East row' : 'retain both rows'}. Result: <b>${report.outputRows} rows · ${money(report.total)}</b>.</p>` : '<p class="decision-note">The report stays unpublished until the exception is reviewed.</p>'}</div>` : `<div class="finance-result"><small>${state.reuseStarted&&!state.reused?'MAYA’S RUN · REVIEW REQUIRED':'REVIEWED REPORT · RULE SET V1'}</small>${state.reuseStarted&&!state.reused?'<p class="decision-note">Maya submits the same illustrative branch files. N101 is flagged again. She must review the exception for her run.</p>':''}<h3>${money(report.total)} <span>${report.outputRows} included rows</span></h3><table><thead><tr><th>Normalized vendor / invoice</th><th>Reviewed expense</th></tr></thead><tbody>${report.rows.map(row => `<tr><td>${row.vendor}<small class="invoice-reference">${row.id} · ${row.branch}</small></td><td>${money(row.amount)}</td></tr>`).join('')}</tbody></table><p class="decision-note"><b>Run by ${report.operator}.</b> ${state.duplicateDecision === 'exclude' ? 'Duplicate N101 from East excluded' : 'Both N101 rows retained by Priya'}; the decision stays with the report.</p></div>`}</section></div><footer class="build-footer"><p>${state.reused ? 'The method no longer lives only with Priya.' : 'A business-owned process, with an explicit exception decision.'}</p>${action}</footer>`;
}
function tracker(builds) {
  const state = builds.elena;
  const rows = trackerRows(builds);
  const action = !state.proposed ? button('tracker-propose', 'Propose tracker updates from these notes →') : state.owner !== 'Nina' ? '' : !state.applied ? button('tracker-apply', 'Apply Elena’s reviewed updates →') : '<span class="build-complete">Three tracker rows updated with their source references.</span>';
  return `<header class="build-heading"><div><small>ELENA · PROJECT COORDINATION</small><h2>Use approved notes to update the actual tracker.</h2></div><span class="build-status">${state.applied ? 'Reviewed changes applied' : state.proposed ? 'Owner decision needed' : 'Current tracker'}</span></header><div class="build-workspace tracker-build"><section class="build-input"><h3 class="build-brand"><img src="assets/ms-teams.svg" alt=""> Approved meeting notes</h3><ol class="approved-notes">${approvedNotes.map(note => `<li><small>${note.id}</small><p>${note.text}</p></li>`).join('')}</ol><p class="build-context">Copilot proposes specific row changes. Elena checks the sources and chooses the accountable person.</p></section><section class="build-output"><h3 class="build-brand"><img src="assets/ms-excel.svg" alt="">${state.applied ? 'Updated tracker' : state.proposed ? 'Proposed changes' : 'Current tracker'}</h3><div class="tracker-rows">${rows.map(row => `<div class="tracker-row ${state.applied ? 'field-updated' : ''}"><b>${row.task}</b><span>${state.proposed && !state.applied ? row.id === 'T-41' ? 'Unassigned → choose owner · due November 10' : row.id === 'T-42' ? 'In progress → Complete' : 'Awaiting input → Ready for review' : `${row.owner} · ${row.status} · ${row.due}`}</span><small>Source: ${row.source}</small></div>`).join('')}</div>${state.proposed && !state.applied ? `<div class="owner-review"><b>Operations owns the handoff review. Who is accountable?</b><div class="build-choices">${button('tracker-owner-nina', 'Nina · Operations', state.owner !== 'Nina')}${button('tracker-owner-ben', 'Ben · Sales', state.owner !== 'Ben')}</div>${state.owner === 'Ben' ? '<p class="decision-note">Ben owns Sales. NOTE-01 specifies Operations. Check the owner before applying.</p>' : state.owner === 'Nina' ? '<p class="decision-note">Elena selected Nina. The proposed changes are ready to apply.</p>' : ''}</div>` : ''}</section></div><footer class="build-footer"><p>Specific inputs, three changes, one reviewed tracker.</p>${action}</footer>`;
}
function operations(builds) {
  const state = builds.nina;
  const published = publishedFinding(builds);
  const action = state.sourceExcluded ? button('ops-restore-source','Restore CASE-201 for review →') : !state.sourceOpened ? button('ops-open-source', 'Inspect the original source →') : !state.confirmed ? button('ops-confirm', 'Record Nina’s review of this finding →') : !state.published ? button('ops-assign-publish', 'Assign Nina, set the date, and share →') : '<span class="build-complete">The same reviewed finding is visible in all three places.</span>';
  const panels = [['Teams · Nina', 'Finding reviewed and published','ms-teams.svg'], ['CRM · Marcus', 'Attached to Northwind’s account','hubspot.svg'], ['Weekly review · Leah', 'Included in Friday’s briefing','ms-powerpoint.svg']];
  return `<header class="build-heading"><div><small>NINA · OPERATIONS</small><h2>A reviewed finding reaches the people who need it.</h2></div><span class="build-status">${state.sourceExcluded ? 'Source excluded; cannot publish' : state.published ? 'Shared record updated' : state.confirmed ? 'Reviewed; ready to assign' : 'Candidate; source review required'}</span></header><div class="ops-evidence ${published?'source-reviewed':''}"><div><small>${published?'NINA REVIEWED AND PUBLISHED · CASE-201':'ASK OPS · PROPOSED FINDING'}</small><h3>${published?'Next action: confirm the receiving Service owner.':finding.title}</h3><p>${state.sourceOpened ? `<b>${sourceCase.id} · ${sourceCase.account}:</b> ${sourceCase.text}` : 'The bot links the finding to an original case. Nina reviews that evidence before sharing it.'}</p></div><div class="source-actions"><button class="build-link" data-detail="source:CASE-201">Open CASE-201 ↗</button><button class="build-link" data-detail="supporting-cases">Review supporting cases ↗</button></div></div><div class="recipient-panels">${panels.map(([title, context,icon]) => `<section><small class="build-brand"><img src="assets/${icon}" alt="">${title}</small><h3>${context}</h3>${published ? `<div class="shared-fields field-updated"><p><b>${published.id}</b> · ${published.title}</p><dl><div><dt>Owner</dt><dd>${published.owner}</dd></div><div><dt>Update due</dt><dd>${published.due}</dd></div><div><dt>Status</dt><dd>${published.status}</dd></div></dl><span>Source: ${published.sourceId} · Reviewed by ${published.reviewedBy}</span></div>` : `<p class="recipient-empty">${state.confirmed ? 'Reviewed finding ready. Owner and next-update date have not been published.' : 'No reviewed finding shared yet.'}</p>`}</section>`).join('')}</div><footer class="build-footer"><p>${state.published ? 'The investigation is assigned. The customer issue is still open.' : 'No private AI chat is read. Only reviewed business evidence is shared.'}</p>${action}</footer>`;
}
export function renderBuilds(state) {
  const active = ['priya', 'elena', 'nina'].includes(state.improvement) ? state.improvement : 'priya';
  const builds = state.builds || initialBuildState();
  return `<div class="concrete-builds" data-active-build="${escapeHtml(active)}">${tabs(active)}<div class="build-surface">${({ priya: finance, elena: tracker, nina: operations })[active](builds)}</div><p class="build-simulation">Interactive simulation · Illustrative records · No live system changes</p></div>`;
}
