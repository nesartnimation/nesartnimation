/* ==============================
   CART.JS - Carrito y Checkout Unificado
============================== */

// =======================
// VARIABLES
// =======================
const cartContainer = document.getElementById('cart');
const cartCount = document.getElementById('cart-count');

const cartModal = document.getElementById('cart-modal');
const cartModalItems = document.getElementById('cart-modal-items');
const cartModalTotal = document.getElementById('cart-modal-total');
const cartModalEmpty = document.getElementById('cart-modal-empty');
const cartModalClose = document.querySelector('.cart-close');
const cartModalCheckout = document.getElementById('cart-modal-checkout');

const checkoutModal = document.getElementById('checkout-modal');

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let allProducts = [];

// =======================
// FUNCIONES CARRITO
// =======================

// Actualiza el contador y renderiza modales
function updateCart() {
  // Contador flotante
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

  renderCartModal();
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Renderiza items dentro del modal de carrito
function renderCartModal() {
  if (!cartModalItems) return;

  cartModalItems.innerHTML = '';
  if (cart.length === 0) {
    cartModalEmpty.style.display = 'block';
    cartModalTotal.textContent = '';
    return;
  }

  cartModalEmpty.style.display = 'none';
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;
    const li = document.createElement('li');
    li.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <span>${item.name}</span>
        <span>${item.price}€ x ${item.quantity}</span>
      </div>
    `;
    cartModalItems.appendChild(li);
  });

  cartModalTotal.textContent = `Total: ${total}€`;
}

// Añadir producto al carrito
function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);
  const currentQty = existing ? existing.quantity : 0;

  if (currentQty + 1 > product.stock) {
    alert(`No hay suficiente stock de ${product.name}. Disponible: ${product.stock}`);
    return;
  }

  if (existing) existing.quantity += 1;
  else cart.push({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    quantity: 1,
    stock: product.stock
  });

  updateCart();
  if (cartModal) cartModal.style.display = 'flex';
}

// =======================
// RENDER PRODUCTOS
// =======================
function renderProducts(products, container) {
  if (!container) return;
  container.innerHTML = '';

  products.forEach(product => {
    const div = document.createElement('div');
    div.className = 'product';
    div.innerHTML = `
      <div class="product-image-wrapper">
        <a href="${product.link}">
          <img src="${product.image}" alt="${product.name}">
        </a>
      </div>
      <h3>${product.name}</h3>
      <p>${product.price}€</p>
      <button class="add-to-cart-btn">Añadir al carrito</button>
    `;

    const addBtn = div.querySelector('.add-to-cart-btn');
    addBtn.addEventListener('click', () => addToCart(product));

    container.appendChild(div);
  });
}

// =======================
// FILTRAR POR CATEGORÍA
// =======================
function filterCategory(category, container, links) {
  if (!links) return;

  links.forEach(link => {
    if (link.dataset.category === category) link.classList.add('active');
    else link.classList.remove('active');
  });

  if (category === 'all') renderProducts(allProducts, container);
  else renderProducts(allProducts.filter(p => p.category === category), container);
}

// =======================
// MODAL EVENTOS
// =======================
if (cartModalClose) cartModalClose.addEventListener('click', () => cartModal.style.display = 'none');
if (cartModalCheckout) cartModalCheckout.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Todavía no has añadido productos');
    return;
  }
  if (checkoutModal) checkoutModal.style.display = 'flex';
});

// Cerrar modales haciendo clic fuera
window.addEventListener('click', e => {
  if (e.target === cartModal) cartModal.style.display = 'none';
  if (e.target === checkoutModal) checkoutModal.style.display = 'none';
});

// Abrir carrito desde botón flotante
if (cartContainer) {
  cartContainer.addEventListener('click', () => {
    if (cart.length === 0) {
      cartModalEmpty.textContent = 'Todavía no has puesto nada en tu carrito';
      cartModalEmpty.style.display = 'block';
    }
    cartModal.style.display = 'flex';
  });
}

// =======================
// CARGAR JSON PRODUCTOS
// =======================
document.addEventListener('DOMContentLoaded', () => {
  const shopContainer = document.querySelector('.shop');
  const categoryLinks = document.querySelectorAll('.shop-sidebar a');

  fetch('data/products.json')
    .then(res => res.json())
    .then(products => {
      allProducts = products;

      // Filtrar según URL
      const urlParams = new URLSearchParams(window.location.search);
      const catFromURL = urlParams.get('id');

      if (catFromURL && allProducts.some(p => p.category === catFromURL)) {
        filterCategory(catFromURL, shopContainer, categoryLinks);
      } else {
        filterCategory('all', shopContainer, categoryLinks);
      }

      updateCart();
    }).catch(err => console.error(err));

  // Sidebar categorías
  categoryLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      filterCategory(link.dataset.category, shopContainer, categoryLinks);
    });
  });
});
