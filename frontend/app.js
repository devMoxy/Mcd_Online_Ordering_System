// Point this at your backend. Swap to http://localhost:8080 for local testing.
const API_BASE = 'https://mc-7ddd916d38e04a9f8f78fc3e0c254ff9.ecs.eu-west-2.on.aws';

const state = {
  token: localStorage.getItem('token') || null,
  email: localStorage.getItem('email') || null,
  menu: [],
  cart: [], // { menuItemId, name, price, quantity }
  orders: [],
};

let ordersTickInterval = null;

// ---------- helpers ----------

function money(n) {
  return `£${Number(n).toFixed(2)}`;
}

// Bigger orders take longer — base 5 min, +1 min per item beyond the first 3, capped at 20.
function estimateMinutes(order) {
  const totalQty = order.items.reduce((sum, it) => sum + it.quantity, 0);
  return Math.min(20, 5 + Math.max(0, totalQty - 3));
}

function orderReadyInfo(order) {
  const estMin = estimateMinutes(order);
  const placedAt = new Date(order.createdAt).getTime();
  const elapsedMin = (Date.now() - placedAt) / 60000;
  const remaining = Math.ceil(estMin - elapsedMin);

  if (remaining <= 0) {
    return { ready: true, text: 'Ready for pickup!' };
  }
  return { ready: false, text: `Ready in ~${remaining} min` };
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => { toast.hidden = true; }, 3200);
}

async function api(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (state.token) headers['Authorization'] = `Bearer ${state.token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong. Please try again.');
  }
  return data;
}

function isLoggedIn() {
  return Boolean(state.token);
}

// ---------- auth ----------

function setSession(token, email) {
  state.token = token;
  state.email = email;
  localStorage.setItem('token', token);
  localStorage.setItem('email', email);
  updateAuthUI();
}

function clearSession() {
  state.token = null;
  state.email = null;
  localStorage.removeItem('token');
  localStorage.removeItem('email');
  updateAuthUI();
}

function updateAuthUI() {
  const emailEl = document.getElementById('userEmail');
  const logoutBtn = document.getElementById('logoutBtn');
  const loginBtn = document.getElementById('loginNavBtn');

  if (isLoggedIn()) {
    emailEl.textContent = state.email;
    emailEl.hidden = false;
    logoutBtn.hidden = false;
    loginBtn.hidden = true;
  } else {
    emailEl.hidden = true;
    logoutBtn.hidden = true;
    loginBtn.hidden = false;
  }
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const errorEl = document.getElementById('loginError');
  errorEl.hidden = true;

  try {
    const body = { email: form.email.value.trim(), password: form.password.value };
    const data = await api('/api/auth/login', { method: 'POST', body: JSON.stringify(body) });
    setSession(data.token, data.email);
    showToast(`Welcome back, ${data.email}`);
    showView('menu');
    form.reset();
  } catch (err) {
    errorEl.textContent = err.message;
    errorEl.hidden = false;
  }
});

document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const errorEl = document.getElementById('registerError');
  errorEl.hidden = true;

  try {
    const body = { email: form.email.value.trim(), password: form.password.value };
    const data = await api('/api/auth/register', { method: 'POST', body: JSON.stringify(body) });
    setSession(data.token, data.email);
    showToast(`Account created — welcome, ${data.email}`);
    showView('menu');
    form.reset();
  } catch (err) {
    errorEl.textContent = err.message;
    errorEl.hidden = false;
  }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  clearSession();
  state.cart = [];
  renderCart();
  syncItemCardControls();
  showToast('Logged out');
  showView('menu');
});

document.getElementById('loginNavBtn').addEventListener('click', () => showView('auth'));

document.querySelectorAll('.auth-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.auth-tab').forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');
    const target = tab.dataset.form;
    document.getElementById('loginForm').hidden = target !== 'login';
    document.getElementById('registerForm').hidden = target !== 'register';
  });
});

// ---------- view switching ----------

function showView(name) {
  document.querySelectorAll('.view').forEach((v) => (v.hidden = true));
  document.getElementById(`view-${name}`).hidden = false;

  document.querySelectorAll('.nav-link').forEach((link) => {
    link.classList.toggle('active', link.dataset.view === name);
  });

  clearInterval(ordersTickInterval);

  if (name === 'orders') {
    if (!isLoggedIn()) {
      showView('auth');
      showToast('Log in to see your orders');
      return;
    }
    loadOrders();
    // Re-render every 15s so "Ready in ~N min" counts down live, and flips to "Ready for pickup!" on its own.
    ordersTickInterval = setInterval(renderOrders, 15000);
  }
}

document.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', () => showView(link.dataset.view));
});

// ---------- menu ----------

async function loadMenu() {
  try {
    state.menu = await api('/api/menu');
    renderMenu();
  } catch (err) {
    document.getElementById('menuList').innerHTML = `<p class="empty-msg">Couldn't load the menu right now. Try refreshing.</p>`;
  }
}

function renderMenu() {
  const tabsEl = document.getElementById('categoryTabs');
  const listEl = document.getElementById('menuList');

  tabsEl.innerHTML = state.menu
    .map((cat, i) => `<button class="category-tab${i === 0 ? ' active' : ''}" data-cat="cat-${cat.id}" role="tab">${cat.name}</button>`)
    .join('');

  listEl.innerHTML = state.menu
    .map((cat) => `
      <div class="category-block" id="cat-${cat.id}">
        <h2 class="category-heading">${cat.name}</h2>
        <div class="item-grid">
          ${cat.items.map(itemCardHtml).join('')}
        </div>
      </div>
    `)
    .join('');

  tabsEl.querySelectorAll('.category-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      tabsEl.querySelectorAll('.category-tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.cat).scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  syncItemCardControls();
}

function itemCardHtml(item) {
  return `
    <div class="item-card" data-item-id="${item.id}">
      <span class="item-name">${item.name}</span>
      <p class="item-desc">${item.description || ''}</p>
      <div class="item-footer">
        <span class="item-price">${money(item.price)}</span>
        <div class="item-controls" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}"></div>
      </div>
    </div>
  `;
}

function syncItemCardControls() {
  document.querySelectorAll('.item-controls').forEach((el) => {
    const id = el.dataset.id;
    const name = el.dataset.name;
    const price = Number(el.dataset.price);
    const line = state.cart.find((l) => l.menuItemId === id);

    if (!line) {
      el.innerHTML = `<button class="add-btn" aria-label="Add ${name}">Add</button>`;
      el.querySelector('.add-btn').addEventListener('click', () => addToCart(id, name, price));
    } else {
      el.innerHTML = `
        <div class="qty-stepper">
          <button data-action="dec" aria-label="Remove one ${name}">−</button>
          <span>${line.quantity}</span>
          <button data-action="inc" aria-label="Add one more ${name}">+</button>
        </div>
      `;
      el.querySelector('[data-action="dec"]').addEventListener('click', () => changeQty(id, -1));
      el.querySelector('[data-action="inc"]').addEventListener('click', () => changeQty(id, 1));
    }
  });
}

// ---------- cart ----------

function addToCart(id, name, price) {
  state.cart.push({ menuItemId: id, name, price, quantity: 1 });
  renderCart();
  syncItemCardControls();
  showToast(`Added ${name}`);
}

function changeQty(id, delta) {
  const line = state.cart.find((l) => l.menuItemId === id);
  if (!line) return;
  line.quantity += delta;
  if (line.quantity <= 0) {
    state.cart = state.cart.filter((l) => l.menuItemId !== id);
  }
  renderCart();
  syncItemCardControls();
}

function removeLine(id) {
  state.cart = state.cart.filter((l) => l.menuItemId !== id);
  renderCart();
  syncItemCardControls();
}

function cartTotal() {
  return state.cart.reduce((sum, l) => sum + l.price * l.quantity, 0);
}

function renderCart() {
  const itemsEl = document.getElementById('cartItems');
  const countEl = document.getElementById('cartCount');
  const totalEl = document.getElementById('cartTotal');

  const totalQty = state.cart.reduce((sum, l) => sum + l.quantity, 0);
  countEl.textContent = totalQty;
  countEl.hidden = totalQty === 0;

  if (state.cart.length === 0) {
    itemsEl.innerHTML = `<p class="empty-cart">Your cart is empty.<br>Add something from the menu to get started.</p>`;
  } else {
    itemsEl.innerHTML = state.cart
      .map(
        (l) => `
      <div class="cart-line">
        <div>
          <div class="cart-line-name">${l.name}</div>
          <div class="cart-line-qty">
            <div class="qty-stepper">
              <button data-action="dec" data-id="${l.menuItemId}" aria-label="Remove one ${l.name}">−</button>
              <span>${l.quantity}</span>
              <button data-action="inc" data-id="${l.menuItemId}" aria-label="Add one more ${l.name}">+</button>
            </div>
          </div>
          <div class="remove-link" data-action="remove" data-id="${l.menuItemId}">Remove</div>
        </div>
        <div class="cart-line-price">${money(l.price * l.quantity)}</div>
      </div>
    `
      )
      .join('');

    itemsEl.querySelectorAll('[data-action="inc"]').forEach((b) => b.addEventListener('click', () => changeQty(b.dataset.id, 1)));
    itemsEl.querySelectorAll('[data-action="dec"]').forEach((b) => b.addEventListener('click', () => changeQty(b.dataset.id, -1)));
    itemsEl.querySelectorAll('[data-action="remove"]').forEach((b) => b.addEventListener('click', () => removeLine(b.dataset.id)));
  }

  totalEl.textContent = money(cartTotal());
}

function openCart() {
  document.getElementById('cartState').hidden = false;
  document.getElementById('confirmState').hidden = true;
  document.getElementById('cartOverlay').hidden = false;
  document.getElementById('cartDrawer').hidden = false;
}

function closeCart() {
  document.getElementById('cartOverlay').hidden = true;
  document.getElementById('cartDrawer').hidden = true;
}

document.getElementById('cartBtn').addEventListener('click', openCart);
document.getElementById('closeCartBtn').addEventListener('click', closeCart);
document.getElementById('cartOverlay').addEventListener('click', closeCart);

document.getElementById('checkoutBtn').addEventListener('click', async () => {
  const errorEl = document.getElementById('orderError');
  const btn = document.getElementById('checkoutBtn');
  errorEl.hidden = true;

  if (!isLoggedIn()) {
    closeCart();
    showView('auth');
    showToast('Log in to place your order');
    return;
  }

  if (state.cart.length === 0) {
    errorEl.textContent = 'Your cart is empty.';
    errorEl.hidden = false;
    return;
  }

  const originalLabel = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Placing order…';

  try {
    const body = { items: state.cart.map((l) => ({ menuItemId: Number(l.menuItemId), quantity: l.quantity })) };
    const order = await api('/api/orders', { method: 'POST', body: JSON.stringify(body) });

    state.cart = [];
    renderCart();
    syncItemCardControls();
    showConfirmation(order);
  } catch (err) {
    errorEl.textContent = err.message;
    errorEl.hidden = false;
  } finally {
    btn.disabled = false;
    btn.textContent = originalLabel;
  }
});

// Shows the receipt right inside the cart drawer immediately after checkout succeeds.
function showConfirmation(order) {
  const estMin = estimateMinutes(order);
  const confirmEl = document.getElementById('confirmState');

  confirmEl.innerHTML = `
    <div class="confirm-header">
      <div class="checkmark">
        <svg viewBox="0 0 20 20" width="22" height="22"><path d="M4 10.5l4 4 8-9" stroke="#2B2118" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <h2>Order placed!</h2>
      <p>We're on it.</p>
      <div class="confirm-order-number">Order #${order.id}</div>
      <div class="confirm-eta">Ready in ~${estMin} min</div>
    </div>
    <div class="confirm-body">
      <div class="confirm-receipt-title">Your receipt</div>
      ${receiptItemsHtml(order)}
    </div>
    <div class="confirm-footer">
      <button class="btn-primary btn-full" id="viewOrdersBtn">View your orders</button>
      <button class="btn-secondary btn-full" id="continueShoppingBtn">Continue shopping</button>
    </div>
  `;

  document.getElementById('cartState').hidden = true;
  confirmEl.hidden = false;
  document.getElementById('cartOverlay').hidden = false;
  document.getElementById('cartDrawer').hidden = false;

  document.getElementById('viewOrdersBtn').addEventListener('click', () => {
    closeCart();
    showView('orders');
  });
  document.getElementById('continueShoppingBtn').addEventListener('click', closeCart);
}

function receiptItemsHtml(order) {
  const lines = order.items
    .map((it) => `<div class="receipt-line"><span>${it.quantity} × ${it.menuItemName}</span><span>${money(it.subtotal)}</span></div>`)
    .join('');
  return `${lines}<hr class="receipt-divider"><div class="receipt-total"><span>Total</span><span>${money(order.total)}</span></div>`;
}

// ---------- orders / receipts ----------

async function loadOrders() {
  const listEl = document.getElementById('ordersList');
  listEl.innerHTML = `<p class="loading-msg">Loading your orders…</p>`;

  try {
    state.orders = await api('/api/orders/me');
    renderOrders();
  } catch (err) {
    listEl.innerHTML = `<p class="empty-msg">Couldn't load your orders right now.</p>`;
  }
}

function renderOrders() {
  const listEl = document.getElementById('ordersList');

  if (state.orders.length === 0) {
    listEl.innerHTML = `<p class="empty-msg">No orders yet. Once you check out, your receipt shows up here.</p>`;
    return;
  }

  listEl.innerHTML = state.orders
    .slice()
    .reverse()
    .map((order) => {
      const date = new Date(order.createdAt).toLocaleString(undefined, {
        month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
      });
      const ready = orderReadyInfo(order);

      return `
      <article class="receipt">
        <div class="receipt-stub"></div>
        <div class="receipt-body">
          <div class="receipt-header">
            <span class="receipt-id">Order #${order.id}</span>
            <span class="receipt-status status-${order.status}">${order.status}</span>
          </div>
          <div class="receipt-date">${date}</div>
          <div class="ready-banner ${ready.ready ? 'ready' : 'pending'}">
            ${ready.ready ? '🎉' : '⏱'} ${ready.text}
          </div>
          ${receiptItemsHtml(order)}
        </div>
      </article>
    `;
    })
    .join('');
}

// ---------- init ----------

updateAuthUI();
renderCart();
loadMenu();
showView('menu');
