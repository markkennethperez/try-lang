/* TrendWear Clothing: cart.js (full cart page). Needs common.js loaded first. */
'use strict';

function renderCartPage(t) {
  $('#cartPage').innerHTML = state.cart.length ? state.cart.map((l, i) => {
    const p = prodById(l.id);
    return `<div class="ci card" data-i="${i}" style="margin-bottom:.8rem">
      <div class="ci__img" style="background:${p.bg}">${garment(p.type, p.color)}</div>
      <div><h4>${esc(p.name)}</h4><small>Size ${l.size} · ${peso(p.price)}</small>
        <div class="qty"><button data-act="dec" aria-label="Decrease quantity">−</button><span>${l.qty}</span><button data-act="inc" aria-label="Increase quantity">+</button></div></div>
      <div class="ci__side">${peso(p.price * l.qty)}<button class="ci__rm" data-act="rm">Remove</button></div>
    </div>`;
  }).join('') : `<div class="cart-empty card"><span>🛍️</span><p>Your cart is empty.</p><p><a href="shop.html">Browse the shop</a></p></div>`;
  $('#pageTotals').innerHTML = totalsHTML(t);
  $('#pageClear').hidden = !state.cart.length;
  $('#toCheckout').classList.toggle('disabled', !state.cart.length);
}
onCartChange.push(renderCartPage);

// EVENT: click, quantity +/- and remove (delegation)
$('#cartPage').addEventListener('click', e => {
  const btn = e.target.closest('[data-act]'); if (!btn) return;
  const i = +btn.closest('.ci').dataset.i, line = state.cart[i];
  if (btn.dataset.act === 'inc') line.qty = Math.min(line.qty + 1, 20);
  if (btn.dataset.act === 'dec') line.qty = Math.max(line.qty - 1, 1);
  if (btn.dataset.act === 'rm')  state.cart.splice(i, 1);
  saveCart(); renderCart();
});
// EVENT: click, clear cart
$('#pageClear').addEventListener('click', () => { state.cart = []; saveCart(); renderCart(); toast('Cart cleared'); });
// EVENT: click, block checkout when the cart is empty
$('#toCheckout').addEventListener('click', e => { if (!state.cart.length) { e.preventDefault(); toast('Add something to your cart first!'); } });

renderCart();
