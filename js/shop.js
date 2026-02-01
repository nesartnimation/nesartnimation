// =======================
// VARIABLES GLOBALES
// =======================
const shop = document.querySelector('.shop');
const categoryLinks = document.querySelectorAll('.shop-sidebar a');

const cartIcon = document.getElementById('cart');
const cartCount = document.getElementById('cart-count');

const cartModal = document.getElementById('cart-modal');
const cartModalItems = document.getElementById('cart-modal-items');
const cartModalTotal = document.getElementById('cart-modal-total');
const cartModalEmpty = document.getElementById('cart-modal-empty');
const cartClose = document.querySelector('.cart-close');
const cartCheckoutBtn = document.getElementById('cart-modal-checkout');

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let allProducts = [];

// =======================
// GUARDAR + CONTADOR
// =======================
function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCount) cartCount.textContent = totalItems;
  localStorage.setItem('cart', JSON.stringify(cart));
}

// =======================
// MODAL CARRITO (RENDER)
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

  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;

    const li = document.createElement('li');
    li.className = 'cart-modal-item';

    li.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-modal-item-info">
        <h4>${item.name}</h4>
        <p>${item.price}€ × ${item.quantity}</p>
      </div>
    `;

    cartModalItems.appendChild(li);
  });

  cartModalTotal.textContent = `Total: ${total}€`;
}

// =======================
// ABRIR / CERRAR MODAL
// =======================
if (cartIcon && cartModal) {
  cartIcon.addEventListener('click', () => {
    cartModal.classList.add('active');
    renderCartModal();
  });
}

if (cartClose) {
  cartClose.addEventListener('click', () => {
    cartModal.classList.remove('active');
  });
}

if (cartModal) {
  cartModal.addEventListener('click', e => {
    if (e.target === cartModal) {
      cartModal.classList.remove('active');
    }
  });
}

if (cartCheckoutBtn) {
  cartCheckoutBtn.addEventListener('click', () => {
    window.location.href = 'checkout.html';
  });
}

// =======================
// RENDER PRODUCTOS (TIENDA)
// =======================
function renderProducts(products) {
  if (!shop) return;

  shop.innerHTML = '';

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
    `;

    shop.appendChild(div);
  });
}

// =======================
// FILTRO CATEGORÍAS
// =======================
function filterCategory(category) {
  if (category === 'all') {
    renderProducts(allProducts);
  } else {
    renderProducts(allProducts.filter(p => p.category === category));
  }
}

// =======================
// CARGA PRODUCTOS JSON
// =======================
fetch('data/products.json')
  .then(res => res.json())
  .then(products => {
    allProducts = products;
    renderProducts(products);
    updateCartCount();
  })
  .catch(err => console.error('Error cargando productos:', err));

// =======================
// EVENTOS SIDEBAR
// =======================
categoryLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    filterCategory(link.dataset.category);
  });
});

// =======================
// EXPONER FUNCIÓN PARA PRODUCTO.HTML
// =======================
// (para que el botón "Añadir al carrito" funcione allí)
window.addToCart = function(product) {
  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  updateCartCount();
};
