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
// CALCULAR IVA
// =======================
function calculateIVA(subtotal) {
  return subtotal * (IVA_PERCENT / 100);
}

// =======================
// ACTUALIZAR CARRITO
// =======================
function updateCart() {
  // Mini carrito
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

  // Contador
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
      <input type="number" min="1" value="${item.quantity}" data-id="${item.id}" style="width:50px;">
      <button data-id="${item.id}">✖</button>
    `;

    li.querySelector('input').addEventListener('change', e => {
      let val = parseInt(e.target.value);
      if (val < 1) val = 1;

      const prod = cart.find(p => p.id === item.id);
      if (!prod) return;

      if (val > prod.stock) {
        alert(`Solo hay ${prod.stock} unidades disponibles`);
        val = prod.stock;
      }

      prod.quantity = val;
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
  const iva = calculateIVA(subtotal);
  const total = subtotal + iva + SHIPPING_COST;

  cart.forEach(item => {
    const totalItem = item.price * item.quantity;

    const li = document.createElement('li');
    li.className = 'checkout-item';
    li.innerHTML = `
      <div class="checkout-item-image">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="checkout-item-info">
        <span>${item.name} x ${item.quantity}</span>
        <span>${totalItem.toFixed(2)}€</span>
      </div>
    `;
    checkoutCartItems.appendChild(li);
  });

  // Mostrar Subtotal, IVA, Envío y Total en columna izquierda
  if(checkoutSubtotalEl) checkoutSubtotalEl.textContent = `${subtotal.toFixed(2)}€`;
  if(checkoutIVAEl) checkoutIVAEl.textContent = `${iva.toFixed(2)}€`;
  if(checkoutShippingEl) checkoutShippingEl.textContent = `${SHIPPING_COST.toFixed(2)}€`;
  if(checkoutTotalEl) checkoutTotalEl.textContent = `Total: ${total.toFixed(2)}€`;
}

// =======================
// EVENTOS MODALES
// =======================
if (cartModalClose) {
  cartModalClose.addEventListener('click', () => {
    cartModal.style.display = 'none';
  });
}

if (cartModalCheckout) {
  cartModalCheckout.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }
    cartModal.style.display = 'none';
    checkoutModal.style.display = 'flex';
  });
}

if (checkoutClose) {
  checkoutClose.addEventListener('click', () => {
    checkoutModal.style.display = 'none';
  });
}

// Click fuera de modales
window.addEventListener('click', e => {
  if (e.target === cartModal) cartModal.style.display = 'none';
  if (e.target === checkoutModal) checkoutModal.style.display = 'none';
});

// =======================
// BOTÓN CONFIRMAR COMPRA
// =======================
if (checkoutConfirmBtn) {
  checkoutConfirmBtn.addEventListener('click', () => {
    if(cart.length === 0){
      alert('Tu carrito está vacío');
      checkoutModal.style.display = 'none';
      return;
    }

    alert('¡Compra realizada con éxito!');
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
    checkoutModal.style.display = 'none';
  });
}

// =======================
// BOTÓN CARRITO FLOTANTE
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
