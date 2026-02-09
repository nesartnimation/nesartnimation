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
let selectedPaymentMethod = null;

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
  const total = subtotal + SHIPPING_COST;

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

  // Mostrar Subtotal, Envío y Total en columna izquierda
  if(checkoutSubtotalEl) checkoutSubtotalEl.textContent = `${subtotal.toFixed(2)}€`;
  if(checkoutShippingEl) checkoutShippingEl.textContent = `${SHIPPING_COST.toFixed(2)}€`;
  if(checkoutTotalEl) checkoutTotalEl.textContent = `Total: ${total.toFixed(2)}€`;

  renderSavedCard(); // NUEVO: mostrar tarjeta en checkout
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
// SELECCIÓN MÉTODO DE PAGO
// =======================
const paymentButtons = document.querySelectorAll('.payment-btn');
let savedCard = JSON.parse(localStorage.getItem('savedCard')) || null;

paymentButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    paymentButtons.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedPaymentMethod = btn.dataset.method;

    if(selectedPaymentMethod === 'card' && !savedCard){
      openCardModal();
    }
  });
});

// =======================
// FUNCIONES TARJETA
// =======================
function luhnCheck(num) {
  let arr = (num + '').split('').reverse().map(x => parseInt(x));
  let sum = arr.reduce((acc,val,i)=>{
    if(i%2){ val*=2; if(val>9) val-=9; }
    return acc+val;
  },0);
  return sum % 10 === 0;
}

function validExpiry(exp){
  const [m,y] = exp.split('/').map(n=>parseInt(n));
  if(!m||!y||m<1||m>12) return false;
  const now = new Date();
  const expDate = new Date(2000+y, m-1,1);
  return expDate > now;
}

function cardBrand(num){
  if(/^4/.test(num)) return 'Visa';
  if(/^5[1-5]/.test(num)) return 'Mastercard';
  return 'Tarjeta';
}

// =======================
// MOSTRAR TARJETA EN CHECKOUT
// =======================
function renderSavedCard(){
  const cardEl = document.getElementById('checkout-saved-card');
  if(!cardEl) return;
  cardEl.innerHTML = '';

  if(!savedCard){
    cardEl.textContent = 'No hay tarjeta registrada';
    return;
  }

  cardEl.innerHTML = `
    <p>${savedCard.brand} **** ${savedCard.last4}</p>
    <button id="edit-card">Editar</button>
    <button id="delete-card">Eliminar</button>
  `;

  document.getElementById('edit-card').onclick = openCardModal;
  document.getElementById('delete-card').onclick = ()=>{
    savedCard=null;
    localStorage.removeItem('savedCard');
    renderSavedCard();
  };
}

// =======================
// MODAL TARJETA
// =======================
function openCardModal(){
  const modal = document.createElement('div');
  modal.style.cssText="position:fixed;inset:0;background:#0008;display:flex;justify-content:center;align-items:center";

  modal.innerHTML = `
    <div style="background:#fff;padding:20px;border-radius:12px;width:300px">
      <h3>Datos de tarjeta</h3>
      <input id="card-num" placeholder="Número de tarjeta">
      <input id="card-name" placeholder="Titular">
      <input id="card-exp" placeholder="MM/AA">
      <input id="card-cvc" placeholder="CVC">
      <button id="save-card">Guardar</button>
      <button id="cancel-card">Cancelar</button>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelector('#save-card').onclick=()=>{
    const num = modal.querySelector('#card-num').value.replace(/\s/g,'');
    const name = modal.querySelector('#card-name').value;
    const exp = modal.querySelector('#card-exp').value;
    const cvc = modal.querySelector('#card-cvc').value;

    if(!luhnCheck(num) || !validExpiry(exp) || cvc.length<3){
      alert('Datos inválidos');
      return;
    }

    savedCard = { brand: cardBrand(num), last4: num.slice(-4), name };
    localStorage.setItem('savedCard', JSON.stringify(savedCard));
    document.body.removeChild(modal);
    renderSavedCard();
  };

  modal.querySelector('#cancel-card').onclick=()=>{
    document.body.removeChild(modal);
  };
}

// =======================
// BOTÓN CONFIRMAR COMPRA
// =======================
if (checkoutConfirmBtn) {
  checkoutConfirmBtn.addEventListener('click', () => {
    if(cart.length===0){
      alert('Tu carrito está vacío');
      checkoutModal.style.display='none';
      return;
    }

    if(!selectedPaymentMethod){
      alert('Debes seleccionar un método de pago');
      return;
    }

    if(selectedPaymentMethod==='card' && !savedCard){
      alert('Debes registrar una tarjeta');
      return;
    }

    alert(`Compra realizada con éxito! Método: ${selectedPaymentMethod}`);
    cart=[];
    selectedPaymentMethod=null;
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
    checkoutModal.style.display='none';
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
