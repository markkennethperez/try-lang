/* TrendWear Clothing: howtoorder.js (interactive steps). Needs common.js loaded first. */
'use strict';

const stepEls = $$('.step');
stepEls.forEach(s => s.setAttribute('tabindex', '0'));
function setStep(i) {
  stepEls.forEach((s, k) => { s.classList.toggle('is-active', k <= i); s.setAttribute('aria-current', k === i ? 'step' : 'false'); });
}
// EVENT: click, tap a step to light up the flow up to that step
stepEls.forEach((s, i) => s.addEventListener('click', () => setStep(i)));
// EVENT: keydown, Enter/Space selects a step, arrows move between steps
stepEls.forEach((s, i) => s.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setStep(i); }
  if (e.key === 'ArrowRight' && stepEls[i + 1]) stepEls[i + 1].focus();
  if (e.key === 'ArrowLeft' && stepEls[i - 1]) stepEls[i - 1].focus();
}));
setStep(0);
