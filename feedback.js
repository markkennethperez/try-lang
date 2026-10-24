/* TrendWear Clothing: feedback.js (star rating, comments, notify signup). Needs common.js loaded first. */
'use strict';

/* ---------- 9. FEEDBACK (stars + comments) ---------- */
const stars = $$('#stars button');
function paintStars(n) {
  stars.forEach(s => { const on = +s.dataset.v <= n; s.classList.toggle('on', on); s.setAttribute('aria-checked', +s.dataset.v === state.fbRating); });
}
// EVENT: mouseover / mouseout, preview stars on hover
stars.forEach(s => {
  s.addEventListener('mouseenter', () => paintStars(+s.dataset.v));
  s.addEventListener('mouseleave', () => paintStars(state.fbRating));
  // EVENT: click, set the rating
  s.addEventListener('click', () => { state.fbRating = +s.dataset.v; $('#starErr').textContent = ''; paintStars(state.fbRating); });
  s.addEventListener('focus', () => paintStars(+s.dataset.v));
  s.addEventListener('blur', () => paintStars(state.fbRating));
});
// EVENT: keydown, arrow keys change the rating (keyboard support)
$('#stars').addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowUp')  { state.fbRating = Math.min(5, state.fbRating + 1); }
  else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { state.fbRating = Math.max(1, state.fbRating - 1); }
  else return;
  e.preventDefault(); paintStars(state.fbRating); stars[state.fbRating - 1].focus();
});

let feedback = store.get('tw_feedback', []);
function renderFeedback() {
  const list = $('#fbList');
  if (!feedback.length) {
    list.innerHTML = `<li class="fb-empty">No feedback yet. Be the first to leave a comment!</li>`;
    $('#avgRating').textContent = '';
    return;
  }
  const avg = feedback.reduce((s, f) => s + f.rating, 0) / feedback.length;
  $('#avgRating').textContent = `★ ${avg.toFixed(1)} · ${feedback.length} review${feedback.length > 1 ? 's' : ''}`;
  list.innerHTML = feedback.map(f => `
    <li class="fb"><div class="fb__top"><strong>${esc(f.name)}</strong><span class="fb__stars" aria-label="${f.rating} out of 5">${'★'.repeat(f.rating)}${'☆'.repeat(5 - f.rating)}</span></div>
    <p>${esc(f.text)}</p><time>${esc(f.date)}</time></li>`).join('');
}
// EVENT: submit, post feedback and show it instantly
$('#feedbackForm').addEventListener('submit', e => {
  e.preventDefault();
  const text = $('#fbText').value.trim();
  let ok = true;
  if (!state.fbRating) { $('#starErr').textContent = 'Please choose a star rating.'; ok = false; }
  if (text.length < 5) { $('#fbErr').textContent = 'Please write at least 5 characters.'; ok = false; } else $('#fbErr').textContent = '';
  if (!ok) return;
  feedback.unshift({ name: $('#fbName').value.trim() || 'Anonymous', rating: state.fbRating, text,
    date: new Date().toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' }) });
  feedback = feedback.slice(0, 30);
  store.set('tw_feedback', feedback);
  e.target.reset(); state.fbRating = 0; paintStars(0);
  renderFeedback(); toast('Thanks for your feedback! 💛');
});
// EVENT: input, clear feedback error while typing
$('#fbText').addEventListener('input', () => { $('#fbErr').textContent = ''; });

// EVENT: submit, "notify me" signup
$('#notifyForm').addEventListener('submit', e => {
  e.preventDefault();
  const v = $('#notifyEmail').value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { $('#notifyErr').textContent = 'Please enter a valid email.'; return; }
  $('#notifyErr').textContent = '';
  const list = store.get('tw_notify', []); if (!list.includes(v)) list.push(v); store.set('tw_notify', list);
  e.target.reset(); toast("You're on the list! 🎉");
});

renderFeedback();
