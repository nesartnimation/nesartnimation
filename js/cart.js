document.addEventListener('DOMContentLoaded', () => {

  /* =======================
     VARIABLES
  ======================= */
  const cartBtn = document.getElementById('cart');
  const cartModal = document.getElementById('cart-modal');
  const cartClose = document.querySelector('.cart-close');
  const cartItemsEl = document.getElementById('cart-modal-items');
  const cartEmptyEl = document.getElementById('cart-modal-empty');
  const cartTotalEl = document.getElementById('cart-modal-total');
  const cartCheckoutBtn = document.getElementById('cart-modal-checkout');
  const cartCountEl = document.getElementById('cart-count');

  const checkoutModal = document.getElementById('checkout-modal');
  const checkoutClose = document.querySelector('.checkout-close');
  const checkoutItemsEl = document.getElementById('checkout-cart-items');
  const checkoutTotalEl = document.getElementById('checkout-total');

  const SHIPPING_COST = 6;

  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  /* =======================
     UTILIDADES
  ======================= */
  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  function getSubtotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  function updateCartCount() {
    if (cartCountEl) {
      cartCountEl.textContent = cart.reduce((sum, i) => sum + i.quantity, 0);
    }
  }

  /* =======================
     RENDER CARRITO MODAL
  ======================= */
  function renderCartModal() {
    if (!cartItemsEl) return;

    cartItemsEl.innerHTML = '';

    if (cart.length === 0) {
      cartEmptyEl.style.display = 'block';
      cartTotalEl.textContent = '';
      updateCartCount();
      return;
    }

    cartEmptyEl.style.display = 'none';

    cart.forEach((item, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-info">
          <span>${item.name}</span>
          <span>${item.price}€ × ${item.quantity}</span>
        </div>
      `;
      cartItemsEl.appendChild(li);
    });

    const subtotal = getSubtotal();
    const total = subtotal + SHIPPING_COST;

    cartTotalEl.textContent = `Total: ${total}€`;
    updateCartCount();
    saveCart();
  }

  /* =======================
     RENDER CHECKOUT
  ======================= */
  function renderCheckout() {
    if (!checkoutItemsEl) return;

    checkoutItemsEl.innerHTML = '';

    cart.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div>
          <strong>${item.name}</strong><br>
          ${item.price}€ × ${item.quantity}
        </div>
      `;
      checkoutItemsEl.appendChild(li);
    });

    const subtotal = getSubtotal();
    const total = subtotal + SHIPPING_COST;

    checkoutTotalEl.textContent = `${total}€`;
  }

  /* =======================
     EVENTOS
  ======================= */
  if (cartBtn && cartModal) {
    cartBtn.addEventListener('click', () => {
      renderCartModal();
      cartModal.style.display = 'flex';
    });
  }

  if (cartClose && cartModal) {
    cartClose.addEventListener('click', () => {
      cartModal.style.display = 'none';
    });
  }

  if (cartCheckoutBtn && checkoutModal) {
    cartCheckoutBtn.addEventListener('click', () => {
      if (cart.length === 0) return;
      cartModal.style.display = 'none';
      renderCheckout();
      checkoutModal.style.display = 'flex';
    });
  }

  if (checkoutClose && checkoutModal) {
    checkoutClose.addEventListener('click', () => {
      checkoutModal.style.display = 'none';
    });
  }

  window.addEventListener('click', e => {
    if (e.target === cartModal) cartModal.style.display = 'none';
    if (e.target === checkoutModal) checkoutModal.style.display = 'none';
  });
window.addToCart = function (product) {
  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      stock: product.stock
    });
  }
  /* =======================
     INIT
  ======================= */
  saveCart();
  updateCartCount();
  renderCartModal();
};
});
