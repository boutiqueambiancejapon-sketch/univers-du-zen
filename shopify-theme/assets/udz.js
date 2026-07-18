/* Univers du Zen — interactions thème */
(function () {
  'use strict';

  /* ---- Méga menu (hover desktop, clic mobile) ---- */
  document.querySelectorAll('[data-mega-trigger]').forEach(function (btn) {
    var key = btn.getAttribute('data-mega-trigger');
    var panel = document.querySelector('[data-mega="' + key + '"]');
    if (!panel) return;
    var wrap = btn.closest('.udz-head');
    function open() { closeAll(); panel.setAttribute('data-open', 'true'); btn.setAttribute('aria-expanded', 'true'); }
    function close() { panel.setAttribute('data-open', 'false'); btn.setAttribute('aria-expanded', 'false'); }
    btn.addEventListener('mouseenter', open);
    btn.addEventListener('focus', open);
    btn.addEventListener('click', function (e) { e.preventDefault(); panel.getAttribute('data-open') === 'true' ? close() : open(); });
    panel.addEventListener('mouseleave', close);
    if (wrap) wrap.addEventListener('mouseleave', close);
  });
  function closeAll() {
    document.querySelectorAll('[data-mega]').forEach(function (p) { p.setAttribute('data-open', 'false'); });
    document.querySelectorAll('[data-mega-trigger]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeAll(); closeDrawer(); } });

  /* ---- Scrollers (flèches) ---- */
  document.querySelectorAll('[data-scroller-prev]').forEach(function (b) {
    b.addEventListener('click', function () { var s = document.querySelector('[data-scroller="' + b.getAttribute('data-scroller-prev') + '"]'); if (s) s.scrollBy({ left: -540, behavior: 'smooth' }); });
  });
  document.querySelectorAll('[data-scroller-next]').forEach(function (b) {
    b.addEventListener('click', function () { var s = document.querySelector('[data-scroller="' + b.getAttribute('data-scroller-next') + '"]'); if (s) s.scrollBy({ left: 540, behavior: 'smooth' }); });
  });

  /* ---- Reveal on scroll ---- */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.style.opacity = '1'; en.target.style.transform = 'none'; io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      if (el.getBoundingClientRect().top > window.innerHeight * 0.85) {
        el.style.opacity = '0'; el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity .7s ease, transform .7s ease';
        io.observe(el);
      }
    });
  }

  /* ---- Cart drawer ---- */
  var drawer = document.querySelector('[data-cart-drawer]');
  function openDrawer() { if (drawer) { drawer.setAttribute('data-open', 'true'); refreshCart(); } }
  function closeDrawer() { if (drawer) drawer.setAttribute('data-open', 'false'); }
  document.querySelectorAll('[data-cart-open]').forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); openDrawer(); }); });
  document.querySelectorAll('[data-cart-close]').forEach(function (b) { b.addEventListener('click', closeDrawer); });

  function money(cents) {
    try { return (cents / 100).toLocaleString('fr-FR', { style: 'currency', currency: window.UDZ_CURRENCY || 'EUR' }); }
    catch (e) { return (cents / 100).toFixed(2) + ' €'; }
  }
  function refreshCart() {
    fetch('/cart.js').then(function (r) { return r.json(); }).then(renderCart).catch(function () {});
  }
  function renderCart(cart) {
    document.querySelectorAll('[data-cart-count]').forEach(function (el) { el.textContent = cart.item_count; el.style.display = cart.item_count ? 'flex' : 'none'; });
    var box = drawer && drawer.querySelector('[data-cart-items]');
    if (box) {
      if (!cart.items.length) { box.innerHTML = '<p style="color:var(--muted);padding:24px 0">Votre panier est vide.</p>'; }
      else {
        box.innerHTML = cart.items.map(function (it) {
          return '<div class="udz-cartline"><img src="' + (it.image ? it.image.replace(/(\.[^.]+)$/, '_120x$1') : '') + '" alt=""><div style="flex:1"><div style="font-weight:600;font-size:14px">' + it.product_title + '</div><div style="color:var(--muted);font-size:13px">' + it.quantity + ' × ' + money(it.final_price) + '</div></div></div>';
        }).join('');
      }
      var sub = drawer.querySelector('[data-cart-subtotal]'); if (sub) sub.textContent = money(cart.total_price);
    }
  }

  /* ---- Add to cart (AJAX) ---- */
  document.querySelectorAll('form[action$="/cart/add"]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('[type="submit"]'); var label = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Ajout…'; }
      fetch('/cart/add.js', { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
        .then(function (r) { return r.json(); })
        .then(function () { if (btn) { btn.textContent = 'Ajouté ✓'; } openDrawer(); setTimeout(function () { if (btn) { btn.disabled = false; btn.textContent = label; } }, 1600); })
        .catch(function () { if (btn) { btn.disabled = false; btn.textContent = label; } });
    });
  });

  /* ---- PDP: thumbnail swap ---- */
  document.querySelectorAll('[data-pdp-thumb]').forEach(function (t) {
    t.addEventListener('click', function () {
      var main = document.querySelector('[data-pdp-main]');
      if (main) main.src = t.getAttribute('data-full') || t.src;
    });
  });

  refreshCart();
})();
