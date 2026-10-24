/* TrendWear Clothing: home.js (hero art + featured products). Needs common.js loaded first. */
'use strict';

// Hero illustrations (swap for real photos later)
$('#heroTee').innerHTML = garment('oversized', '#ffffff');
$('#heroHoodie').innerHTML = garment('hoodie', '#111111');

// Show four featured products
const FEATURED = PRODUCTS.filter(p => p.tag).slice(0, 4);
$('#featured').innerHTML = FEATURED.map(p => `
  <article class="card product" data-id="${p.id}">
    <div class="product__img" style="background:${p.bg}">${p.tag ? `<span class="tag">${esc(p.tag)}</span>` : ''}${garment(p.type, p.color)}</div>
    <div class="product__body">
      <span class="product__cat">${esc(p.cat)}</span>
      <h3 class="product__name">${esc(p.name)}</h3>
      <span class="product__price">${peso(p.price)}</span>
      <div class="product__actions"><button class="btn btn--primary" data-act="add">Add to Cart (${state.sizes[p.id]})</button></div>
    </div>
  </article>`).join('');

// EVENT: click, quick add (event delegation on the grid)
$('#featured').addEventListener('click', e => {
  const btn = e.target.closest('[data-act="add"]'); if (!btn) return;
  const id = +btn.closest('.product').dataset.id;
  addToCart(id, state.sizes[id]);
});

/* ---------- VIDEO AD ---------- */
const adVideo = $('#adVideo'), adPlay = $('#adPlay'), adMute = $('#adMute');
let userPaused = false;   // true if the visitor pressed pause themselves

// EVENT: IntersectionObserver (scroll), autoplay (muted) when the ad is on screen, pause when it leaves
new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting && !userPaused) adVideo.play().catch(() => {});
    else if (!en.isIntersecting) adVideo.pause();
  });
}, { threshold: 0.5 }).observe($('#adPlayer'));

// EVENT: click, play / pause button
adPlay.addEventListener('click', () => {
  if (adVideo.paused) { userPaused = false; adVideo.play(); } else { userPaused = true; adVideo.pause(); }
});
// EVENT: play / pause (video events), keep the button icon in sync
adVideo.addEventListener('play',  () => { adPlay.textContent = '⏸'; adPlay.setAttribute('aria-label', 'Pause video'); });
adVideo.addEventListener('pause', () => { adPlay.textContent = '▶'; adPlay.setAttribute('aria-label', 'Play video'); });
// EVENT: click, sound on / off
adMute.addEventListener('click', () => {
  adVideo.muted = !adVideo.muted;
  adMute.textContent = adVideo.muted ? '🔇' : '🔊';
  adMute.setAttribute('aria-label', adVideo.muted ? 'Turn sound on' : 'Turn sound off');
  $('#adHint').hidden = !adVideo.muted;
});
