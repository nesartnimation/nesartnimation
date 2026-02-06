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
const checkoutForm = document.getElementById('checkout-form');
const checkoutTotalModal = document.getElementById('checkout-total-modal');
const checkoutCartItems = document.getElementById('checkout-cart-items');
const discountInput = document.getElementById('discount-code');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// =======================
// AÑADIR AL CARRITO (🔥 FALTABA)
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

  // Solo abrir modal si options.openModal es true
  if (options.openModal && cartModal) {
    cartModal.style.display = 'flex';
  }
};


// =======================
// ACTUALIZAR CARRITO
// =======================
function updateCart() {
  // Mini carrito
  if (cartItems) {
    cartItems.innerHTML = '';
    if (cart.length === 0) {
      cartEmpty.style.display = 'block';
    } else {
      cartEmpty.style.display = 'none';
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
    cartModalEmpty.style.display = 'block';
    cartModalTotal.textContent = '';
    return;
  }

  cartModalEmpty.style.display = 'none';

  let subtotal = 0;

  cart.forEach(item => {
    subtotal += item.price * item.quantity;

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

    // Eliminar
    li.querySelector('button').addEventListener('click', () => {
      cart = cart.filter(p => p.id !== item.id);
      updateCart();
    });

    cartModalItems.appendChild(li);
  });

  cartModalTotal.textContent = `Subtotal: ${subtotal.toFixed(2)}€`;
}

// =======================
// CHECKOUT
// =======================
function renderCheckoutCart() {
  if (!checkoutCartItems) return;

  checkoutCartItems.innerHTML = '';
  let subtotal = 0;

  cart.forEach(item => {
    const totalItem = item.price * item.quantity;
    subtotal += totalItem;

    const li = document.createElement('li');
    li.innerHTML = `
      <img src="${item.image}">
      <span>${item.name} x ${item.quantity}</span>
      <span>${totalItem.toFixed(2)}€</span>
    `;
    checkoutCartItems.appendChild(li);
  });

  const envio = cart.length > 0 ? 6 : 0;
  const total = subtotal + envio;

  if (checkoutTotalModal) {
    checkoutTotalModal.textContent = `Total: ${total.toFixed(2)}€ (envío incluido)`;
  }
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

// Click fuera
window.addEventListener('click', e => {
  if (e.target === cartModal) cartModal.style.display = 'none';
  if (e.target === checkoutModal) checkoutModal.style.display = 'none';
});

// =======================
// CONFIRMAR COMPRA
// =======================
if (checkoutForm) {
  checkoutForm.addEventListener('submit', e => {
    e.preventDefault();

    alert('¡Compra realizada con éxito!');
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
    checkoutModal.style.display = 'none';
    checkoutForm.reset();
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
