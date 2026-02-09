// =======================
// VARIABLES GLOBALES
// =======================
const cartItems = document.getElementById('cart-items'); 
const cartCount = document.getElementById('cart-count');
const cartEmpty = document.getElementById('cart-empty');

const cartModal = document.getElementById('cart-modal');
const cartModalItems = document.getElementById('cart-modal-items');
const cartModalTotal = document.getElementById('cart-modal-total');
const cartModalEmpty = document.getElementById('cart-modal-empty');
const cartModalClose = document.querySelector('.cart-close');
const cartModalCheckout = document.getElementById('cart-modal-checkout');

const checkoutModal = document.getElementById('checkout-modal');
const checkoutClose = document.querySelector('.checkout-close');
const checkoutConfirmBtn = document.getElementById('checkout-confirm-btn');
const checkoutCartItems = document.getElementById('checkout-cart-items');

const checkoutSubtotalEl = document.getElementById('checkout-subtotal');
const checkoutShippingEl = document.getElementById('checkout-shipping');
const checkoutTotalEl = document.getElementById('checkout-total');

const SHIPPING_COST = 6;

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// =======================
// 🔹 NUEVO: PAGO
// =======================
let selectedPaymentMethod = null;
let savedCard = JSON.parse(localStorage.getItem('savedCard')) || null;

// =======================
// AÑADIR AL CARRITO
// =======================
window.addToCart = function(product, options = { openModal: true }) {
  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    if (existing.quantity + 1 > product.stock) {
      alert(`No hay suficiente stock de ${product.name}`);
      return;
    }
    existing.quantity++;
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

  updateCart();

  if (options.openModal && cartModal) {
    cartModal.style.display = 'flex';
  }
};

// =======================
// CALCULAR SUBTOTAL
// =======================
function calculateSubtotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// =======================
// ACTUALIZAR CARRITO
// =======================
function updateCart() {
  if (cartItems) {
    cartItems.innerHTML = '';
    if (cart.length === 0) {
      if(cartEmpty) cartEmpty.style.display = 'block';
    } else {
      if(cartEmpty) cartEmpty.style.display = 'none';
      cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - ${item.price}€ x ${item.quantity}`;
        cartItems.appendChild(li);
      });
    }
  }

  if (cartCount) {
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  renderCartModal();
  renderCheckoutCart();

  localStorage.setItem('cart', JSON.stringify(cart));
}

// =======================
// MODAL CARRITO
// =======================
function renderCartModal() {
  if (!cartModalItems) return;

  cartModalItems.innerHTML = '';

  if (cart.length === 0) {
    if(cartModalEmpty) cartModalEmpty.style.display = 'block';
    if(cartModalTotal) cartModalTotal.textContent = '';
    return;
  }

  if(cartModalEmpty) cartModalEmpty.style.display = 'none';

  let subtotal = calculateSubtotal();

  cart.forEach(item => {
    const li = document.createElement('li');
    li.style.display = 'flex';
    li.style.alignItems = 'center';
    li.style.gap = '10px';

    li.innerHTML = `
      <img src="${item.image}" style="width:50px;height:50px;object-fit:cover;border-radius:6px;">
      <span style="flex:1">${item.name}</span>
      <input type="number" min="1" value="${item.quantity}" style="width:50px;">
      <button>✖</button>
    `;

    li.querySelector('input').addEventListener('change', e => {
      let val = parseInt(e.target.value);
      if (val < 1) val = 1;
      if (val > item.stock) val = item.stock;
      item.quantity = val;
      updateCart();
    });

    li.querySelector('button').addEventListener('click', () => {
      cart = cart.filter(p => p.id !== item.id);
      updateCart();
    });

    cartModalItems.appendChild(li);
  });

  if(cartModalTotal) cartModalTotal.textContent = `Subtotal: ${subtotal.toFixed(2)}€`;
}

// =======================
// CHECKOUT
// =======================
function renderCheckoutCart() {
  if (!checkoutCartItems) return;

  checkoutCartItems.innerHTML = '';

  const subtotal = calculateSubtotal();
  const total = subtotal + SHIPPING_COST;

  cart.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="checkout-item-image">
        <img src="${item.image}">
      </div>
      <div>
        ${item.name} x ${item.quantity}
        <strong>${(item.price * item.quantity).toFixed(2)}€</strong>
      </div>
    `;
    checkoutCartItems.appendChild(li);
  });

  if(checkoutSubtotalEl) checkoutSubtotalEl.textContent = `${subtotal.toFixed(2)}€`;
  if(checkoutShippingEl) checkoutShippingEl.textContent = `${SHIPPING_COST.toFixed(2)}€`;
  if(checkoutTotalEl) checkoutTotalEl.textContent = `Total: ${total.toFixed(2)}€`;
}

// =======================
// EVENTOS MODALES
// =======================
if (cartModalClose) {
  cartModalClose.addEventListener('click', () => cartModal.style.display = 'none');
}

if (cartModalCheckout) {
  cartModalCheckout.addEventListener('click', () => {
    if (cart.length === 0) return alert('Tu carrito está vacío');
    cartModal.style.display = 'none';
    checkoutModal.style.display = 'flex';
  });
}

if (checkoutClose) {
  checkoutClose.addEventListener('click', () => checkoutModal.style.display = 'none');
}

// =======================
// 🔹 NUEVO: MÉTODOS DE PAGO
// =======================
document.querySelectorAll('.payment-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.payment-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedPaymentMethod = btn.dataset.method;

    if (selectedPaymentMethod === 'paypal') {
      alert('Redirigiendo a PayPal… (simulado)');
    }

    if (selectedPaymentMethod === 'card' && !savedCard) {
      openCardModal();
    }
  });
});

// =======================
// 🔹 NUEVO: MODAL TARJETA
// =======================
function openCardModal() {
  const modal = document.createElement('div');
  modal.style.cssText = `
    position:fixed; inset:0; background:rgba(0,0,0,.6);
    display:flex; align-items:center; justify-content:center; z-index:4000;
  `;

  modal.innerHTML = `
    <div style="background:#fff;padding:20px;border-radius:12px;width:320px">
      <h3>Datos de tarjeta</h3>
      <input id="card-number" placeholder="Número" style="width:100%;margin:6px 0">
      <input id="card-name" placeholder="Titular" style="width:100%;margin:6px 0">
      <input id="card-exp" placeholder="MM/AA" style="width:100%;margin:6px 0">
      <input id="card-cvc" placeholder="CVC" style="width:100%;margin:6px 0">
      <button id="save-card">Guardar tarjeta</button>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector('#save-card').addEventListener('click', () => {
    savedCard = {
      number: modal.querySelector('#card-number').value,
      name: modal.querySelector('#card-name').value
    };
    localStorage.setItem('savedCard', JSON.stringify(savedCard));
    document.body.removeChild(modal);
    alert('Tarjeta guardada');
  });
}

// =======================
// CONFIRMAR COMPRA
// =======================
if (checkoutConfirmBtn) {
  checkoutConfirmBtn.addEventListener('click', () => {
    if (!selectedPaymentMethod) {
      alert('Selecciona un método de pago');
      return;
    }

    if (selectedPaymentMethod === 'card' && !savedCard) {
      alert('No hay tarjeta registrada');
      return;
    }

    alert('Pago realizado correctamente');
    cart = [];
    localStorage.removeItem('cart');
    updateCart();
    checkoutModal.style.display = 'none';
  });
}

// =======================
// BOTÓN CARRITO
// =======================
const cartContainer = document.getElementById('cart');
if (cartContainer) {
  cartContainer.addEventListener('click', () => {
    cartModal.style.display = 'flex';
  });
}

// =======================
// INIT
// =======================
updateCart();
