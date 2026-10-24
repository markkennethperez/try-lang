/* TrendWear Clothing: insight.js (animated counters, bars, donut). Needs common.js loaded first. */
'use strict';

/* ---------- 10. INSIGHTS: animated counters, bars, donut ---------- */
function animateCount(el) {
  const target = parseFloat(el.dataset.count), dec = +el.dataset.dec || 0, suf = el.dataset.suffix || '';
  const t0 = performance.now(), dur = 1300;
  (function tick(now) {
    const k = Math.min((now - t0) / dur, 1), eased = 1 - Math.pow(1 - k, 3);
    el.textContent = (target * eased).toFixed(dec) + suf;
    if (k < 1) requestAnimationFrame(tick);
  })(t0);
}
function revealInsights() {
  $$('[data-count]').forEach(animateCount);
  $$('.bar').forEach(b => { $('i', b).style.width = b.dataset.v + '%'; });
  $('#donut').style.background =
    'conic-gradient(var(--accent) 0 42.9%, var(--ink) 42.9% 80%, #7c5cff 80% 91.4%, var(--line) 91.4% 100%)';
}
// EVENT: scroll into view (IntersectionObserver), start animations when visible
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    if (entries.some(en => en.isIntersecting)) { revealInsights(); io.disconnect(); }
  }, { threshold: 0.25 });
  io.observe($('.counters'));
} else revealInsights();
