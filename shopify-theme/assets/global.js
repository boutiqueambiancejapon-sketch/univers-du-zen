/* Univers du Zen — global.js
   Menu mobile, drawer panier AJAX, quick-add, galerie produit, carrousels. */

(function () {
  'use strict';

  var moneyFormat = window.UDZ_MONEY_FORMAT || '{{amount_with_comma_separator}} €';

  function formatMoney(cents) {
    var amount = (cents / 100).toFixed(2).replace('.', ',');
    return moneyFormat
      .replace(/\{\{\s*amount_with_comma_separator\s*\}\}/, amount)
      .replace(/\{\{\s*amount\s*\}\}/, (cents / 100).toFixed(2));
  }

  /* ── Menu mobile ── */
  document.addEventListener('click', function (e) {
    var toggle = e.target.closest('[data-mobile-menu-toggle]');
    if (toggle) {
      var menu = document.querySelector('[data-mobile-menu]');
      if (menu) {
        var open = menu.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      }
    }
  });

  /* ── Carrousels horizontaux (featured) ── */
  document.addEventListener('click', function (e) {
    var arrow = e.target.closest('[data-scroll-dir]');
    if (!arrow) return;
    var scroller = arrow.closest('section').querySelector('[data-scroller]');
    if (!scroller) return;
    var dir = arrow.getAttribute('data-scroll-dir') === 'right' ? 1 : -1;
    scroller.scrollBy({ left: dir * 220, behavior: 'smooth' });
  });

  /* ── Galerie produit ── */
  document.addEventListener('click', function (e) {
    var thumb = e.target.closest('[data-thumb]');
    if (!thumb) return;
    var gallery = thumb.closest('[data-gallery]');
    var main = gallery.querySelector('[data-main-image]');
    main.src = thumb.getAttribute('data-src');
    main.srcset = '';
    gallery.querySelectorAll('[data-thumb]').forEach(function (t) { t.classList.remove('is-active'); });
    thumb.classList.add('is-active');
  });

  /* ── Quantité ── */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-qty-change]');
    if (!btn) return;
    var input = btn.parentElement.querySelector('input');
    var val = parseInt(input.value, 10) || 1;
    var next = val + parseInt(btn.getAttribute('data-qty-change'), 10);
    input.value = Math.max(parseInt(input.min, 10) || 0, next);
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });

  /* ── Sélecteur de variante → mise à jour prix / id ── */
  document.querySelectorAll('[data-product-form]').forEach(function (formWrap) {
    var select = formWrap.querySelector('[data-variant-select]');
    if (!select) return;
    var variants = JSON.parse(formWrap.querySelector('[data-variants-json]').textContent);
    select.addEventListener('change', function () {
      var v = variants.find(function (x) { return String(x.id) === select.value; });
      if (!v) return;
      var priceEl = formWrap.querySelector('[data-price]');
      var compareEl = formWrap.querySelector('[data-compare-price]');
      var submit = formWrap.querySelector('[type="submit"]');
      if (priceEl) priceEl.textContent = formatMoney(v.price);
      if (compareEl) {
        if (v.compare_at_price && v.compare_at_price > v.price) {
          compareEl.textContent = formatMoney(v.compare_at_price);
          compareEl.hidden = false;
        } else {
          compareEl.hidden = true;
        }
      }
      if (submit) {
        submit.disabled = !v.available;
        submit.textContent = v.available ? submit.getAttribute('data-add-text') : submit.getAttribute('data-soldout-text');
      }
    });
  });

  /* ── Drawer panier ── */
  var drawer = document.querySelector('[data-cart-drawer]');

  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-cart-open]')) { e.preventDefault(); refreshCart().then(openDrawer); }
    if (e.target.closest('[data-cart-close]')) closeDrawer();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDrawer();
  });

  function updateCartCount(cart) {
    document.querySelectorAll('[data-cart-count]').forEach(function (el) {
      el.textContent = cart.item_count > 9 ? '9+' : cart.item_count;
      el.hidden = cart.item_count === 0;
    });
  }

  function renderDrawer(cart) {
    if (!drawer) return;
    var itemsEl = drawer.querySelector('[data-drawer-items]');
    var footer = drawer.querySelector('[data-drawer-footer]');
    if (cart.item_count === 0) {
      itemsEl.innerHTML = '<div class="cart-drawer__empty"><p>' + itemsEl.getAttribute('data-empty-text') + '</p></div>';
      footer.hidden = true;
      return;
    }
    footer.hidden = false;
    itemsEl.innerHTML = cart.items.map(function (item) {
      var img = item.image
        ? '<img src="' + item.image.replace(/(\.[a-z]+)(\?|$)/, '_200x$1$2') + '" alt="" loading="lazy">'
        : '';
      var variant = item.variant_title && item.variant_title !== 'Default Title'
        ? '<p class="cart-line__variant">' + item.variant_title + '</p>' : '';
      return (
        '<div class="cart-line">' +
          '<div class="cart-line__img">' + img + '</div>' +
          '<div style="flex:1">' +
            '<a class="cart-line__title" href="' + item.url + '">' + item.product_title + '</a>' +
            variant +
            '<div class="cart-line__actions">' +
              '<div class="quantity-input" style="transform:scale(.85);transform-origin:left">' +
                '<button type="button" data-line-change="' + item.key + '" data-delta="-1" aria-label="−">−</button>' +
                '<input type="text" value="' + item.quantity + '" readonly aria-label="Quantité">' +
                '<button type="button" data-line-change="' + item.key + '" data-delta="1" aria-label="+">+</button>' +
              '</div>' +
              '<button class="cart-line__remove" data-line-remove="' + item.key + '">Retirer</button>' +
            '</div>' +
          '</div>' +
          '<span class="cart-line__price">' + formatMoney(item.final_line_price) + '</span>' +
        '</div>'
      );
    }).join('');
    var totalEl = drawer.querySelector('[data-drawer-total]');
    if (totalEl) totalEl.textContent = formatMoney(cart.total_price);

    var bar = drawer.querySelector('[data-shipping-bar]');
    if (bar) {
      var threshold = parseInt(bar.getAttribute('data-threshold'), 10);
      var remaining = threshold - cart.total_price;
      var fill = bar.querySelector('.free-shipping-bar__fill');
      var text = bar.querySelector('.free-shipping-bar__text');
      var pct = Math.min(100, (cart.total_price / threshold) * 100);
      fill.style.width = pct + '%';
      text.innerHTML = remaining > 0
        ? 'Plus que <strong>' + formatMoney(remaining) + '</strong> pour la livraison offerte'
        : '✓ Livraison offerte !';
    }
  }

  function refreshCart() {
    return fetch('/cart.js')
      .then(function (r) { return r.json(); })
      .then(function (cart) {
        updateCartCount(cart);
        renderDrawer(cart);
        return cart;
      });
  }

  document.addEventListener('click', function (e) {
    var change = e.target.closest('[data-line-change]');
    var remove = e.target.closest('[data-line-remove]');
    if (!change && !remove) return;
    e.preventDefault();
    var key = (change || remove).getAttribute(change ? 'data-line-change' : 'data-line-remove');
    var body;
    if (remove) {
      body = { id: key, quantity: 0 };
    } else {
      var input = change.parentElement.querySelector('input');
      var qty = (parseInt(input.value, 10) || 1) + parseInt(change.getAttribute('data-delta'), 10);
      body = { id: key, quantity: Math.max(0, qty) };
    }
    fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then(refreshCart);
  });

  /* ── Ajout au panier AJAX (formulaires + quick add) ── */
  document.addEventListener('submit', function (e) {
    var form = e.target.closest('form[data-ajax-cart]');
    if (!form) return;
    e.preventDefault();
    var submit = form.querySelector('[type="submit"]');
    var original = submit ? submit.textContent : '';
    if (submit) { submit.disabled = true; submit.textContent = submit.getAttribute('data-adding-text') || '…'; }
    fetch('/cart/add.js', {
      method: 'POST',
      body: new FormData(form)
    })
      .then(function (r) {
        if (!r.ok) return r.json().then(function (err) { throw err; });
        return r.json();
      })
      .then(function () { return refreshCart(); })
      .then(function () { openDrawer(); })
      .catch(function (err) { alert(err && err.description ? err.description : 'Erreur lors de l\'ajout au panier.'); })
      .finally(function () {
        if (submit) { submit.disabled = false; submit.textContent = original; }
      });
  });

  /* ── Init compteur au chargement ── */
  refreshCart();
})();
