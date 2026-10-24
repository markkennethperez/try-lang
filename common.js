/* =====================================================================
   TrendWear Clothing: common.js (loaded on EVERY page)
   Every "EVENT:" comment marks an event handler (for presentation).
   Easy edits: change PRODUCTS, TEAM, DISCOUNT_* below. Page-specific code lives in <page>.js
   ===================================================================== */
'use strict';

/* ---------- 1. DATA (edit prices, names, colors here) ---------- */
const DISCOUNT_MIN_ITEMS = 3;   // buy this many items...
const DISCOUNT_RATE = 0.10;     // ...and get 10% off

const LETTER_SIZES = ['S', 'M', 'L', 'XL'];
const WAIST_SIZES  = ['28', '30', '32', '34'];

const PRODUCTS = [
  { id: 1,  name: 'Everyday Basic Tee',    cat: 'T-shirts',   type: 'tee',       price: 149, sizes: LETTER_SIZES, color: '#ffffff', bg: '#ffd9c7', colors: ['White','Black','Gray'], tag: 'Best seller', desc: 'Soft cotton-blend tee for everyday school wear. Simple, clean, goes with everything.' },
  { id: 2,  name: 'Campus Graphic Tee',    cat: 'T-shirts',   type: 'tee',       price: 199, sizes: LETTER_SIZES, color: '#ff5a1f', bg: '#ffe8a3', colors: ['Orange','Navy','Cream'], desc: 'Bold front print for a standout campus look. Breathable and comfortable.' },
  { id: 3,  name: 'Pocket Tee',            cat: 'T-shirts',   type: 'tee',       price: 179, sizes: LETTER_SIZES, color: '#2f5d50', bg: '#d4ecd9', colors: ['Forest','Sand','Black'], desc: 'Minimal chest pocket tee. Smart-casual enough for presentation days.' },
  { id: 4,  name: 'Oversized Drop Tee',    cat: 'Oversized',  type: 'oversized', price: 229, sizes: ['M','L','XL'], color: '#1c1c1c', bg: '#dcd6ff', colors: ['Black','Ash','Brown'], tag: 'Trending', desc: 'Dropped shoulders and a relaxed fit. The streetwear staple.' },
  { id: 5,  name: 'Boxy Oversized Tee',    cat: 'Oversized',  type: 'oversized', price: 249, sizes: ['M','L','XL'], color: '#e9e2cf', bg: '#cfe6ff', colors: ['Cream','Sage','Charcoal'], desc: 'Heavier fabric, boxy cut, easy to style with jeans or shorts.' },
  { id: 6,  name: 'Classic Polo',          cat: 'Polo',       type: 'polo',      price: 249, sizes: LETTER_SIZES, color: '#1f3a8a', bg: '#ffe0e6', colors: ['Navy','White','Maroon'], desc: 'Neat and comfortable polo for school events and casual outings.' },
  { id: 7,  name: 'Stripe Polo',           cat: 'Polo',       type: 'polo',      price: 279, sizes: LETTER_SIZES, color: '#c9462c', bg: '#e3f3d1', colors: ['Red','Teal','Gray'], desc: 'A fresh stripe twist on the classic polo. Light and breathable.' },
  { id: 8,  name: 'Cozy Pullover Hoodie',  cat: 'Hoodies',    type: 'hoodie',    price: 399, sizes: LETTER_SIZES, color: '#6b6f78', bg: '#ffd9c7', colors: ['Gray','Black','Maroon'], tag: 'Best seller', desc: 'Warm, soft fleece interior. Perfect for air-conditioned classrooms.' },
  { id: 9,  name: 'Zip-Up Hoodie',         cat: 'Hoodies',    type: 'hoodie',    price: 399, sizes: LETTER_SIZES, color: '#243b53', bg: '#ffe8a3', colors: ['Navy','Black','Olive'], desc: 'Easy on and off with a full zipper and roomy front pockets.' },
  { id: 10, name: 'Straight-Cut Jeans',    cat: 'Pants/Jeans',type: 'pants',     price: 399, sizes: WAIST_SIZES, color: '#3b5b8c', bg: '#dcd6ff', colors: ['Blue','Black','Light wash'], desc: 'Classic straight fit with a bit of stretch for all-day comfort.' },
  { id: 11, name: 'Utility Cargo Pants',   cat: 'Pants/Jeans',type: 'pants',     price: 349, sizes: WAIST_SIZES, color: '#6b705c', bg: '#d4ecd9', colors: ['Olive','Khaki','Black'], tag: 'Trending', desc: 'Roomy pockets and a relaxed leg. Practical and very on-trend.' },
  { id: 12, name: 'Relaxed Denim Jeans',   cat: 'Pants/Jeans',type: 'pants',     price: 379, sizes: WAIST_SIZES, color: '#8fb0d6', bg: '#ffe0e6', colors: ['Light blue','Dark blue'], desc: 'Loose, easygoing denim that pairs with oversized tees.' },
  { id: 13, name: 'Casual Everyday Shorts',cat: 'Shorts',     type: 'shorts',    price: 199, sizes: WAIST_SIZES, color: '#b08968', bg: '#cfe6ff', colors: ['Tan','Black','Gray'], desc: 'Lightweight shorts for hot Cebu days, on or off campus.' },
  { id: 14, name: 'Jogger Shorts',         cat: 'Shorts',     type: 'shorts',    price: 179, sizes: ['S','M','L','XL'], color: '#2b2b2b', bg: '#e3f3d1', colors: ['Black','Gray','Navy'], desc: 'Stretchy waistband, soft fabric, made for lounging or sports.' }
];

const TEAM = [
  { name: 'Johan Canete',               color: '#ff5a1f' },
  { name: 'Kevin Tangpos',              color: '#2f5d50' },
  { name: 'John Carlo Tomaquin',        color: '#1f3a8a' },
  { name: 'Mark Kenneth M. Perez',      color: '#7c5cff' },
  { name: 'Samantha Adriene Marie N. Giango', color: '#c9462c' }
];

/* ---------- 2. SMALL HELPERS ---------- */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const peso = n => '₱' + Number(n).toLocaleString('en-PH', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
const esc  = s => String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));

// localStorage can throw in private mode, so always wrap it
const store = {
  get(k, fb) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch { return fb; } },
  set(k, v)  { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } }
};

function toast(msg) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  $('#toasts').appendChild(el);
  setTimeout(() => el.classList.add('out'), 2200);
  setTimeout(() => el.remove(), 2600);
}

/* Draw a simple clothing icon as inline SVG (swap for real photos later) */
function garment(type, fill) {
  const S = 'stroke="#111" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"';
  const shapes = {
    tee: `<path d="M30 14 L42 10 Q50 19 58 10 L70 14 L90 30 L80 42 L72 36 L72 88 L28 88 L28 36 L20 42 L10 30 Z" fill="${fill}" ${S}/>`,
    oversized: `<path d="M26 14 L41 9 Q50 19 59 9 L74 14 L96 34 L86 48 L76 40 L76 90 L24 90 L24 40 L14 48 L4 34 Z" fill="${fill}" ${S}/>`,
    polo: `<path d="M30 14 L42 10 L50 22 L58 10 L70 14 L90 30 L80 42 L72 36 L72 88 L28 88 L28 36 L20 42 L10 30 Z" fill="${fill}" ${S}/>
           <path d="M42 10 L50 22 L58 10 M50 22 V46" fill="none" ${S}/><circle cx="50" cy="31" r="1.3" fill="#111"/><circle cx="50" cy="39" r="1.3" fill="#111"/>`,
    hoodie: `<path d="M32 16 Q50 2 68 16 L92 70 L80 76 L72 52 L72 90 L28 90 L28 52 L20 76 L8 70 Z" fill="${fill}" ${S}/>
           <path d="M38 14 Q50 34 62 14 M50 28 V44 M36 66 H64 V80 H36 Z" fill="none" ${S}/>`,
    pants: `<path d="M30 8 H70 L77 92 H54 L50 38 L46 92 H23 Z" fill="${fill}" ${S}/><path d="M30 17 H70 M50 17 V38" fill="none" ${S}/>`,
    shorts: `<path d="M28 14 H72 L82 68 H54 L50 40 L46 68 H18 Z" fill="${fill}" ${S}/><path d="M28 23 H72 M50 23 V40" fill="none" ${S}/>`
  };
  return `<svg viewBox="0 0 100 100" role="img" aria-hidden="true">${shapes[type]}</svg>`;
}

/* ---------- 3. STATE ---------- */
const state = {
  category: 'All',
  query: '',
  sort: 'featured',
  sizes: {},                                  // chosen size per product id
  cart: store.get('tw_cart', []),             // [{id, size, qty}]
  wish: store.get('tw_wish', []),             // [id, ...]
  fbRating: 0
};
const prodById = id => PRODUCTS.find(p => p.id === id);
const defaultSize = p => p.sizes.includes('M') ? 'M' : (p.sizes.includes('30') ? '30' : p.sizes[0]);
PRODUCTS.forEach(p => { state.sizes[p.id] = defaultSize(p); });
const onCartChange = [];   // pages can register functions that re-draw when the cart changes

/* ---------- 4. NAVBAR, THEME, SCROLL EVENTS ---------- */
const root = document.documentElement;
(function initTheme() {
  const saved = store.get('tw_theme', null);
  const dark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(dark ? 'dark' : 'light');
})();
function setTheme(t) {
  root.setAttribute('data-theme', t);
  $('#themeToggle').textContent = t === 'dark' ? '☀️' : '🌙';
}
// EVENT: click, dark/light mode toggle
$('#themeToggle').addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  setTheme(next); store.set('tw_theme', next);
});

// EVENT: click, hamburger menu on mobile
const burger = $('#burger'), navLinks = $('#navLinks');
burger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
  burger.textContent = open ? '✕' : '☰';
});
// EVENT: click, close the mobile menu after choosing a link
navLinks.addEventListener('click', e => {
  if (e.target.matches('a')) { navLinks.classList.remove('open'); burger.textContent = '☰'; burger.setAttribute('aria-expanded', false); }
});

// Highlight the nav link for the current page
(function markActivePage() {
  const page = location.pathname.split('/').pop() || 'home.html';
  $$('.nav__links a').forEach(a => {
    const on = a.getAttribute('href') === page;
    a.classList.toggle('active', on);
    if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
})();

// EVENT: scroll, show the back-to-top button after scrolling down
const toTop = $('#toTop');
let ticking = false;
window.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => { toTop.hidden = window.scrollY < 600; ticking = false; });
}, { passive: true });
// EVENT: click, scroll back to the top
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ---------- 6. CART ---------- */
function addToCart(id, size, qty = 1) {
  const line = state.cart.find(l => l.id === id && l.size === size);
  if (line) line.qty = Math.min(line.qty + qty, 20); else state.cart.push({ id, size, qty });
  saveCart(); renderCart();
  const b = $('#cartCount'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
  toast(`Added ${prodById(id).name} (${size}) to cart`);
}
function saveCart() { store.set('tw_cart', state.cart); }

function totals() {
  const items = state.cart.reduce((n, l) => n + l.qty, 0);
  const subtotal = state.cart.reduce((s, l) => s + prodById(l.id).price * l.qty, 0);
  const discount = items >= DISCOUNT_MIN_ITEMS ? Math.round(subtotal * DISCOUNT_RATE * 100) / 100 : 0;
  return { items, subtotal, discount, total: subtotal - discount };
}
function totalsHTML(t) {
  const need = DISCOUNT_MIN_ITEMS - t.items;
  return `
    <div><dt>Items</dt><dd>${t.items}</dd></div>
    <div><dt>Subtotal</dt><dd>${peso(t.subtotal)}</dd></div>
    ${t.discount ? `<div class="save"><dt>Bundle discount (10%)</dt><dd>−${peso(t.discount)}</dd></div>` : ''}
    <div class="grand"><dt>Total</dt><dd>${peso(t.total)}</dd></div>
    ${t.items > 0 && need > 0 ? `<p class="hint">Add ${need} more item${need > 1 ? 's' : ''} to get 10% off 🎁</p>` : ''}
    ${t.discount ? `<p class="hint">🎉 Bundle discount applied!</p>` : ''}`;
}

function renderCart() {
  const t = totals();
  $('#cartCount').textContent = t.items;
  const body = $('#cartBody');
  if (!state.cart.length) {
    body.innerHTML = `<div class="cart-empty"><span>🛍️</span><p>Your cart is empty.</p><p>Add something fresh from the shop!</p></div>`;
  } else {
    body.innerHTML = state.cart.map((l, i) => {
      const p = prodById(l.id);
      return `<div class="ci" data-i="${i}">
        <div class="ci__img" style="background:${p.bg}">${garment(p.type, p.color)}</div>
        <div><h4>${esc(p.name)}</h4><small>Size ${l.size} · ${peso(p.price)}</small>
          <div class="qty"><button data-act="dec" aria-label="Decrease quantity">−</button><span>${l.qty}</span><button data-act="inc" aria-label="Increase quantity">+</button></div></div>
        <div class="ci__side">${peso(p.price * l.qty)}<button class="ci__rm" data-act="rm">Remove</button></div>
      </div>`;
    }).join('');
  }
  $('#cartTotals').innerHTML = totalsHTML(t);
  $('#clearCart').hidden = !state.cart.length;
  $('#checkoutBtn').disabled = !state.cart.length;
  renderSummary(t);
  onCartChange.forEach(fn => fn(t));
}

function renderSummary(t = totals()) {
  if (!$('#summaryItems')) return;   // only the checkout page has a summary box
  $('#summaryItems').innerHTML = state.cart.length
    ? state.cart.map(l => { const p = prodById(l.id);
        return `<div class="sum-item"><span>${esc(p.name)}<br><small>Size ${l.size} × ${l.qty}</small></span><strong>${peso(p.price * l.qty)}</strong></div>`; }).join('')
    : `<p class="muted" style="padding:.6rem 0">Your cart is empty. <a href="shop.html">Browse the shop</a>.</p>`;
  $('#summaryTotals').innerHTML = totalsHTML(t);
}

// EVENT: click, quantity +/-, remove (delegation inside the drawer)
$('#cartBody').addEventListener('click', e => {
  const btn = e.target.closest('[data-act]'); if (!btn) return;
  const i = +btn.closest('.ci').dataset.i, line = state.cart[i];
  if (btn.dataset.act === 'inc') line.qty = Math.min(line.qty + 1, 20);
  if (btn.dataset.act === 'dec') line.qty = Math.max(line.qty - 1, 1);
  if (btn.dataset.act === 'rm')  state.cart.splice(i, 1);
  saveCart(); renderCart();
});
// EVENT: click, clear cart
$('#clearCart').addEventListener('click', () => { state.cart = []; saveCart(); renderCart(); toast('Cart cleared'); });

/* drawer open / close */
const drawer = $('#drawer'), overlay = $('#overlay');
let lastFocus = null;
function openCart() {
  lastFocus = document.activeElement;
  drawer.classList.add('open'); drawer.setAttribute('aria-hidden', 'false'); overlay.hidden = false;
  document.body.style.overflow = 'hidden'; $('#closeCart').focus();
}
function closeCart() {
  drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); overlay.hidden = true;
  document.body.style.overflow = ''; lastFocus && lastFocus.focus && lastFocus.focus();
}
// EVENT: click, open/close cart drawer
$('#openCart').addEventListener('click', openCart);
$('#closeCart').addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);
// EVENT: click, "Go to checkout" scrolls to the form
$('#checkoutBtn').addEventListener('click', () => {
  closeCart();
  location.href = 'checkout.html';
});

/* ---------- 7. MODAL (quick view + order confirmation) ---------- */
const modal = $('#modal');
function openModal(html) {
  $('#modalContent').innerHTML = html;
  modal.hidden = false; document.body.style.overflow = 'hidden';
  lastFocus = document.activeElement; $('#modalClose').focus();
}
function closeModal() {
  modal.hidden = true; document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
  lastFocus && lastFocus.focus && lastFocus.focus();
}
// EVENT: click, close modal by X button or by clicking the dark backdrop
$('#modalClose').addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });


/* ---------- Footer year + Esc key + start ---------- */
$('#year').textContent = new Date().getFullYear();
// EVENT: keydown, Esc closes modal, then cart drawer, then mobile menu
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (!modal.hidden) closeModal();
  else if (drawer.classList.contains('open')) closeCart();
  else if (navLinks.classList.contains('open')) { navLinks.classList.remove('open'); burger.textContent = '☰'; }
});
renderCart();
