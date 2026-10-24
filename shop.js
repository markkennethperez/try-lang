/* TrendWear Clothing: shop.js (filter, search, sort, quick view, wishlist). Needs common.js loaded first. */
'use strict';

/* ---------- 5. SHOP: render, filter, search, sort ---------- */
const CATS = ['All', 'T-shirts', 'Oversized', 'Polo', 'Hoodies', 'Pants/Jeans', 'Shorts', '♥ Wishlist'];

function renderFilters() {
  $('#filters').innerHTML = CATS.map(c =>
    `<button class="chip${c === state.category ? ' active' : ''}" data-cat="${esc(c)}" aria-pressed="${c === state.category}">${esc(c)}</button>`).join('');
}

function visibleProducts() {
  const q = state.query.trim().toLowerCase();
  let list = PRODUCTS.filter(p => {
    const inCat = state.category === 'All' ||
      (state.category === '♥ Wishlist' ? state.wish.includes(p.id) : p.cat === state.category);
    const hit = !q || (p.name + ' ' + p.cat + ' ' + p.colors.join(' ')).toLowerCase().includes(q);
    return inCat && hit;
  });
  if (state.sort === 'low')  list.sort((a, b) => a.price - b.price);
  if (state.sort === 'high') list.sort((a, b) => b.price - a.price);
  if (state.sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
  return list;
}

function renderProducts() {
  const list = visibleProducts();
  $('#productGrid').innerHTML = list.map((p, i) => `
    <article class="card product" data-id="${p.id}" style="animation-delay:${i * 40}ms">
      <button class="product__img" data-act="view" style="background:${p.bg}" aria-label="Quick view ${esc(p.name)}">
        ${p.tag ? `<span class="tag">${esc(p.tag)}</span>` : ''}
        ${garment(p.type, p.color)}
      </button>
      <button class="heart${state.wish.includes(p.id) ? ' on' : ''}" data-act="wish" aria-label="Toggle wishlist for ${esc(p.name)}" aria-pressed="${state.wish.includes(p.id)}">${state.wish.includes(p.id) ? '♥' : '♡'}</button>
      <div class="product__body">
        <span class="product__cat">${esc(p.cat)}</span>
        <h3 class="product__name">${esc(p.name)}</h3>
        <span class="product__price">${peso(p.price)}</span>
        <div class="sizes" role="group" aria-label="Size">
          ${p.sizes.map(s => `<button class="size${s === state.sizes[p.id] ? ' sel' : ''}" data-act="size" data-size="${s}" aria-pressed="${s === state.sizes[p.id]}">${s}</button>`).join('')}
        </div>
        <div class="product__actions">
          <button class="btn btn--ghost" data-act="view">Quick View</button>
          <button class="btn btn--primary" data-act="add">Add to Cart</button>
        </div>
      </div>
    </article>`).join('');
  $('#noResults').hidden = list.length > 0;
  $('#resultCount').textContent = `Showing ${list.length} of ${PRODUCTS.length} products`;
}

// EVENT: click, category filter buttons (event delegation)
$('#filters').addEventListener('click', e => {
  const b = e.target.closest('.chip'); if (!b) return;
  state.category = b.dataset.cat; renderFilters(); renderProducts();
});
// EVENT: input, live search while typing
$('#searchInput').addEventListener('input', e => { state.query = e.target.value; renderProducts(); });
// EVENT: change, sort dropdown
$('#sortSelect').addEventListener('change', e => { state.sort = e.target.value; renderProducts(); });

// EVENT: click, product card buttons (size / add / wishlist / quick view) via delegation
$('#productGrid').addEventListener('click', e => {
  const btn = e.target.closest('[data-act]'); if (!btn) return;
  const id = +btn.closest('.product').dataset.id;
  const act = btn.dataset.act;
  if (act === 'size') {
    state.sizes[id] = btn.dataset.size;
    $$('.size', btn.parentElement).forEach(s => {
      const on = s === btn; s.classList.toggle('sel', on); s.setAttribute('aria-pressed', on);
    });
  } else if (act === 'add')  { addToCart(id, state.sizes[id]); }
  else if (act === 'wish')   { toggleWish(id); }
  else if (act === 'view')   { openQuickView(id); }
});

function toggleWish(id) {
  const i = state.wish.indexOf(id);
  if (i > -1) { state.wish.splice(i, 1); toast('Removed from wishlist'); }
  else { state.wish.push(id); toast('Saved to wishlist ♥'); }
  store.set('tw_wish', state.wish);
  renderProducts();
}

function openQuickView(id) {
  const p = prodById(id);
  openModal(`
    <div class="qv">
      <div class="qv__img" style="background:${p.bg}">${garment(p.type, p.color)}</div>
      <div>
        <span class="product__cat">${esc(p.cat)}</span>
        <h3 id="modalTitle">${esc(p.name)}</h3>
        <span class="product__price">${peso(p.price)}</span>
        <p>${esc(p.desc)}</p>
        <strong>Colors</strong>
        <div class="colors" title="${esc(p.colors.join(', '))}">${p.colors.map(c => `<span class="tag" style="position:static">${esc(c)}</span>`).join('')}</div>
        <strong>Size</strong>
        <div class="sizes" id="qvSizes" style="margin:.4rem 0 1rem">${p.sizes.map(s => `<button class="size${s === state.sizes[id] ? ' sel' : ''}" data-size="${s}">${s}</button>`).join('')}</div>
        <button class="btn btn--primary btn--block" id="qvAdd">Add to Cart</button>
      </div>
    </div>`);
  // EVENT: click, size + add inside the quick-view modal
  $('#qvSizes').addEventListener('click', e => {
    const b = e.target.closest('.size'); if (!b) return;
    state.sizes[id] = b.dataset.size;
    $$('#qvSizes .size').forEach(s => s.classList.toggle('sel', s === b));
  });
  $('#qvAdd').addEventListener('click', () => { addToCart(id, state.sizes[id]); closeModal(); renderProducts(); });
}

renderFilters();
renderProducts();
