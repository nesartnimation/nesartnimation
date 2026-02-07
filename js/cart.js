// =======================
// VARIABLES GLOBALES
// =======================
const cartCount = document.getElementById('cart-count');

const cartModal = document.getElementById('cart-modal');
const cartModalItems = document.getElementById('cart-modal-items');
const cartModalTotal = document.getElementById('cart-modal-total');
const cartModalEmpty = document.getElementById('cart-modal-empty');
const cartModalClose = document.querySelector('.cart-close');
const cartModalCheckout = document.getElementById('cart-modal-checkout');

const checkoutModal = document.getElementById('checkout-modal');
const checkoutClose = document.querySelector('.checkout-close');
const checkoutCartItems = document.getElementById('checkout-cart-items');
const checkoutSubtotalEl = document.getElementById('checkout-subtotal');
const checkoutTotalEl = document.getElementById('checkout-total');

const SHIPPING_COST = 6;

// Cargar carrito del localStorage o iniciar vacío
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
      price: Number(product.price),
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
  // Contador en header
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
    cartModalEmpty.style.display = 'block';
    cartModalTotal.textContent = '';
    return;
  }

  cartModalEmpty.style.display = 'none';
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

    // Cambiar cantidad
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

    // Eliminar producto
    li.querySelector('button').addEventListener('click', () => {
      cart = cart.filter(p => p.id !== item.id);
      updateCart();
    });

    cartModalItems.appendChild(li);
  });

  cartModalTotal.textContent = `Subtotal: ${subtotal.toFixed(2)}€`;
}

// =======================
// MODAL CHECKOUT
// =======================
function renderCheckoutCart() {
  if (!checkoutCartItems) return;

  checkoutCartItems.innerHTML = '';
  const subtotal = calculateSubtotal();
  const total = cart.length > 0 ? subtotal + SHIPPING_COST : 0;

  cart.forEach(item => {
    const totalItem = item.price * item.quantity;
    const li = document.createElement('li');
    li.style.display = 'flex';
    li.style.justifyContent = 'space-between';
    li.innerHTML = `
      <span>${item.name} x ${item.quantity}</span>
      <span>${totalItem.toFixed(2)}€</span>
    `;
    checkoutCartItems.appendChild(li);
  });

  if (checkoutSubtotalEl) checkoutSubtotalEl.textContent = `${subtotal.toFixed(2)}€`;
  if (checkoutTotalEl) checkoutTotalEl.textContent = `Total: ${total.toFixed(2)}€`;
}

// =======================
// EVENTOS MODALES
// =======================
// Cerrar carrito
if (cartModalClose) {
  cartModalClose.addEventListener('click', () => {
    cartModal.style.display = 'none';
  });
}

// Abrir checkout desde carrito
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

// Cerrar checkout
if (checkoutClose) {
  checkoutClose.addEventListener('click', () => {
    checkoutModal.style.display = 'none';
  });
}

// Cerrar al hacer click fuera
window.addEventListener('click', e => {
  if (e.target === cartModal) cartModal.style.display = 'none';
  if (e.target === checkoutModal) checkoutModal.style.display = 'none';
});

// =======================
// BOTÓN CARRITO HEADER
// =======================
const cartContainer = document.getElementById('cart');
if (cartContainer) {
  cartContainer.addEventListener('click', () => {
    cartModal.style.display = 'flex';
  });
}

// =======================
// INICIALIZAR
// =======================
updateCart();
