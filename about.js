/* TrendWear Clothing: about.js (team cards). Needs common.js loaded first. */
'use strict';

$('#team').innerHTML = TEAM.map(m => {
  const initials = m.name.split(' ').filter(w => /^[A-Z]/.test(w)).slice(0, 2).map(w => w[0]).join('');
  return `<article class="card member"><div class="avatar" style="background:${m.color}">${initials}</div><h3>${esc(m.name)}</h3><p>BSIT · Group member</p></article>`;
}).join('');
