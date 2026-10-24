/* TrendWear Clothing: whyus.js (feature cards). Needs common.js loaded first. */
'use strict';

// EVENT: IntersectionObserver, cards fade in as they scroll into view
const cards = $$('.feature');
cards.forEach((c, i) => { c.style.transitionDelay = (i * 70) + 'ms'; c.classList.add('reveal'); });
const io = new IntersectionObserver(es => es.forEach(en => {
  if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
}), { threshold: 0.2 });
cards.forEach(c => io.observe(c));

// EVENT: mousemove / mouseleave, small 3D tilt on hover
cards.forEach(c => {
  c.addEventListener('mousemove', e => {
    const r = c.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    c.style.transform = `perspective(600px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-4px)`;
  });
  c.addEventListener('mouseleave', () => { c.style.transform = ''; });
});
