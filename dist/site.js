'use strict';
// Edit these before the webinar. Empty values fall back to safe defaults on screen.
window.N67_EVENT = {
  bookingUrl: '',
  bookingLabel: '',
  novemberSlots: 0,
  presenters: [
    { name: 'Suuchi Ramesh', role: 'CEO · Forward Deployed Engineer', initials: 'SR', portrait: '' },
    { name: 'Josh Lee', role: 'COO · Forward Deployed Engineer', initials: 'JL', portrait: '' }
  ]
};

// Presenter controls appear only after visiting any page with ?presenter=1 in this tab. ?presenter=0 turns them off.
window.N67_PRESENTER = (() => {
  const flag = new URLSearchParams(location.search).get('presenter');
  try {
    if (flag === '1') sessionStorage.setItem('n67-presenter', '1');
    if (flag === '0') sessionStorage.removeItem('n67-presenter');
    return sessionStorage.getItem('n67-presenter') === '1';
  } catch {
    return flag === '1';
  }
})();
document.documentElement.classList.toggle('presenter', window.N67_PRESENTER);

window.N67_presenterMarkup = () => window.N67_EVENT.presenters.map(p => {
  const face = p.portrait
    ? `<img class="presenter-face" src="${p.portrait}" alt="">`
    : `<span class="presenter-face presenter-initials" aria-hidden="true">${p.initials}</span>`;
  return `<figure class="presenter">${face}<figcaption><strong>${p.name}</strong><span>${p.role}</span></figcaption></figure>`;
}).join('');
