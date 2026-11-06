'use strict';
// Cover page: 1920x1080 deck scaled to the viewport, Parkside hook card, keyboard start.
(() => {
  const liveUrl = 'live.html#slide-1';
  const verdicts = { win: 'AI win', diff: 'Different way', stuck: 'Struggling', glue: 'The glue' };
  const parkside = [
    ['Dana', 'CEO', 'Claude (company plan)', 'claude.svg', 'win'],
    ['Daniel', 'IT', 'Ask Parkside (Copilot Studio)', 'ms-teams.svg', 'diff'],
    ['Ben', 'Head of Sales', 'Copilot', 'copilot.webp', 'win'],
    ['Priya', 'Finance Analyst', 'Claude (company plan)', 'claude.svg', 'win'],
    ['Nina', 'Operations', 'Ask Ops (Copilot Studio)', 'ms-teams.svg', 'win'],
    ['Ava', 'Customer Service', 'Copilot', 'copilot.webp', 'stuck'],
    ['Elena', 'Project Coordinator', 'Copilot', 'copilot.webp', 'stuck'],
    ['Marcus', 'Account Manager', 'Grok · personal phone', 'grok.svg', 'diff'],
    ['Leah', 'Chief of Staff', 'Copilot', 'copilot.webp', 'glue']
  ];
  const tools = [['Microsoft 365 Copilot', 'copilot.webp'], ['Copilot Studio agents', 'ms-teams.svg'], ['Claude', 'claude.svg'], ['ChatGPT', 'openai.svg'], ['Grok', 'grok.svg'], ['Perplexity', 'perplexity.svg']];
  const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const fill = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };

  fill('people', parkside.map(([name, dept, ai, icon, verdict]) =>
    `<li class="tok v-${verdict}"><span class="av" aria-hidden="true">${name[0]}<img src="assets/${icon}" alt=""></span><b>${name}</b><small>${dept}</small><span class="sr">uses ${ai}. ${verdicts[verdict]}.</span></li>`).join(''));
  fill('tools', tools.map(([name, icon]) => `<li><img src="assets/${icon}" alt="" width="32" height="32">${name}</li>`).join(''));
  const presenters = (window.N67_EVENT && window.N67_EVENT.presenters) || [];
  fill('presenters', presenters.map(p => {
    const face = p.portrait ? `<img class="face" src="${esc(p.portrait)}" alt="">` : `<span class="face" aria-hidden="true">${esc(p.initials)}</span>`;
    return `<figure class="presenter">${face}<figcaption><strong>${esc(p.name)}</strong><span>${esc(String(p.role).split(' · ')[0])} / FDE</span></figcaption></figure>`;
  }).join(''));
  if (window.N67_PRESENTER) fill('presenter-links', '<a href="host-guide.html" target="_blank" rel="noopener">Host guide ↗</a><a href="stats.html">Research backup</a>');

  function fitDeck() {
    const s = Math.min(innerWidth / 1920, innerHeight / 1080), root = document.documentElement.style;
    root.setProperty('--s', s);
    root.setProperty('--dx', (innerWidth - 1920 * s) / 2 + 'px');
    root.setProperty('--dy', (innerHeight - 1080 * s) / 2 + 'px');
  }
  fitDeck();
  addEventListener('resize', fitDeck);
  document.addEventListener('keydown', event => {
    if (event.repeat || event.ctrlKey || event.metaKey || event.altKey) return;
    if (['ArrowRight', 'PageDown', ' '].includes(event.key)) { event.preventDefault(); location.assign(liveUrl); }
  });
})();
