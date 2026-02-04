// ======= cart.js =======

// Obtener carrito desde localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Actualiza contador global del carrito
function updateGlobalCart() {
  const cartCountEl = document.getElementById('cart-count');
  if(cartCountEl) cartCountEl.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Renderiza modal carrito
function renderCart() {
  const cartModal = document.getElementById('cart-modal');
  const cartItems = document.getElementById('cart-modal-items');
  const cartTotalEl = document.getElementById('cart-modal-total');
  const cartEmptyEl = document.getElementById('cart-modal-empty');

  if(!cartModal) return; // Si no hay modal, salir

  cartItems.innerHTML = '';
  if(cart.length === 0){
    cartEmptyEl.style.display = 'block';
    cartTotalEl.textContent = 'Total: 0€';
    updateGlobalCart();
    return;
  }

  cartEmptyEl.style.display = 'none';
  let total = 0;

  cart.forEach((item, index) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    const li = document.createElement('li');
    li.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <span>${item.name}</span>
        <span>${item.quantity} x ${item.price}€ = ${subtotal}€</span>
      </div>
      <button data-index="${index}">✖</button>
    `;

    li.querySelector('button').addEventListener('click', () => {
      cart.splice(index, 1);
      renderCart();
      renderCheckout();
    });

    cartItems.appendChild(li);
  });

  cartTotalEl.textContent = `Total: ${total}€`;
  updateGlobalCart();
}

// Renderiza modal checkout
function renderCheckout() {
  const checkoutItems = document.getElementById('checkout-cart-items');
  const checkoutTotal = document.getElementById('checkout-total');
  const checkoutEmpty = document.getElementById('checkout-empty');

  if(!checkoutItems) return;

  checkoutItems.innerHTML = '';
  if(cart.length === 0){
    checkoutEmpty.style.display = 'block';
    checkoutTotal.textContent = 'Total: 0€';
    return;
  }
  checkoutEmpty.style.display = 'none';

  let total = 0;
  cart.forEach(item => {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    const li = document.createElement('li');
    li.innerHTML = `
      <img src="${item.image}" alt="${item.name}" style="width:60px;height:60px;">
      <div>${item.name} x ${item.quantity}</div>
      <div>${subtotal}€</div>
    `;
    checkoutItems.appendChild(li);
  });

  checkoutTotal.textContent = `Total: ${total}€`;
}

// Agregar producto al carrito
function addToCart(product) {
  const existing = cart.find(p => p.id === product.id);
  if(existing) {
    existing.quantity += 1;
  } else {
    cart.push({...product, quantity: 1});
  }
  renderCart();
  renderCheckout();
}

// Inicializa modales y botones
function initCart() {
  updateGlobalCart();
  renderCart();
  renderCheckout();

  // Botón abrir carrito
  const cartBtn = document.getElementById('cart');
  const cartModal = document.getElementById('cart-modal');
  const cartClose = document.querySelector('.cart-close');

  if(cartBtn && cartModal) {
    cartBtn.addEventListener('click', () => cartModal.style.display='flex');
    if(cartClose) cartClose.addEventListener('click', () => cartModal.style.display='none');
  }

  // Botón finalizar compra en carrito
  const checkoutBtn = document.getElementById('cart-modal-checkout');
  if(checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      const checkoutModal = document.getElementById('checkout-modal');
      if(cart.length === 0){
        alert('Tu carrito está vacío');
        return;
      }
      if(checkoutModal) checkoutModal.style.display='flex';
    });
  }

  // Botón cerrar checkout
  const checkoutClose = document.querySelector('#checkout-modal .checkout-close');
  if(checkoutClose){
    checkoutClose.addEventListener('click', () => {
      const checkoutModal = document.getElementById('checkout-modal');
      if(checkoutModal) checkoutModal.style.display='none';
    });
  }

  // Botón confirmar compra
  const checkoutConfirm = document.getElementById('checkout-confirm-btn');
  if(checkoutConfirm){
    checkoutConfirm.addEventListener('click', () => {
      if(cart.length === 0){
        alert('Tu carrito está vacío');
        return;
      }
      alert('¡Compra realizada con éxito!');
      cart = [];
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCart();
      renderCheckout();
      const checkoutModal = document.getElementById('checkout-modal');
      if(checkoutModal) checkoutModal.style.display='none';
    });
  }
}

// Ejecutar al cargar página
document.addEventListener('DOMContentLoaded', initCart);
