/* TrendWear Clothing: checkout.js (form validation + order confirmation). Needs common.js loaded first. */
'use strict';

/* ---------- 8. CHECKOUT FORM + VALIDATION ---------- */
const form = $('#orderForm');
const rules = {
  fName:  v => v.trim().length >= 2 ? '' : 'Please enter your full name.',
  fPhone: v => /^(09\d{9}|\+639\d{9})$/.test(v.trim()) ? '' : 'Use a valid PH mobile number, e.g. 09171234567.',
  fEmail: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Please enter a valid email address.',
  fSchool:v => v.trim().length >= 2 ? '' : 'Enter your school, course and section.'
};
function setErr(id, msg) {
  const out = $(`.err[data-for="${id}"]`); if (out) out.textContent = msg;
  const input = document.getElementById(id);
  if (input) { input.closest('.field').classList.toggle('invalid', !!msg); input.setAttribute('aria-invalid', !!msg); }
}
function validateField(id) { const msg = rules[id]($('#' + id).value); setErr(id, msg); return !msg; }

// EVENT: blur / input, validate each field as the user leaves or edits it
Object.keys(rules).forEach(id => {
  const el = $('#' + id);
  el.addEventListener('blur', () => validateField(id));
  el.addEventListener('input', () => { if (el.closest('.field').classList.contains('invalid')) validateField(id); });
});
// EVENT: input, phone box only allows digits and +
$('#fPhone').addEventListener('input', e => { e.target.value = e.target.value.replace(/[^\d+]/g, ''); });
// EVENT: input, live character counter for notes
$('#fNotes').addEventListener('input', e => { $('#notesCount').textContent = `${e.target.value.length} / 200`; });
// EVENT: change, clear pickup error once a method is picked
$$('input[name="pickup"]').forEach(r => r.addEventListener('change', () => setErr('pickup', '')));

// EVENT: submit, validate, then show the confirmation
form.addEventListener('submit', e => {
  e.preventDefault();
  if (!state.cart.length) { toast('Your cart is empty. Add items first!'); setTimeout(() => { location.href = 'shop.html'; }, 1000); return; }
  let ok = Object.keys(rules).map(validateField).every(Boolean);
  const pickup = form.elements.pickup.value;
  if (!pickup) { setErr('pickup', 'Please choose a pickup method.'); ok = false; }
  if (!ok) { const first = $('.field.invalid input, .field.invalid textarea'); first ? first.focus() : $('input[name="pickup"]').focus(); return; }

  const t = totals();
  const ref = 'TW-' + Date.now().toString(36).toUpperCase().slice(-6);
  const lines = state.cart.map(l => { const p = prodById(l.id); return `<div class="sum-item"><span>${esc(p.name)} <small>(${l.size} × ${l.qty})</small></span><strong>${peso(p.price * l.qty)}</strong></div>`; }).join('');
  openModal(`
    <div class="confirm">
      <div class="check">✓</div>
      <h3 id="modalTitle" style="font-size:1.8rem">Order placed!</h3>
      <p class="muted">Thanks, ${esc($('#fName').value.trim().split(' ')[0])}! Your reference is <span class="ref">${ref}</span>.</p>
      <dl style="margin-top:1rem">
        <div class="sum-item"><span>Pickup</span><strong>${esc(pickup)}</strong></div>
        <div class="sum-item"><span>Contact</span><strong>${esc($('#fPhone').value.trim())}</strong></div>
      </dl>
      ${lines}
      <dl class="totals">${totalsHTML(t).replace(/<p class="hint">.*?<\/p>/g, '')}</dl>
      <p class="hint">This is a school-project demo. No payment or real order is sent. We'd confirm details with you directly.</p>
      <button class="btn btn--primary btn--block" id="doneBtn" style="margin-top:1rem">Done</button>
    </div>`);
  $('#doneBtn').addEventListener('click', closeModal);
  state.cart = []; saveCart(); renderCart();
  form.reset(); $('#notesCount').textContent = '0 / 200';
});
