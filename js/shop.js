// =======================
// VARIABLES GLOBALES
// =======================
const shop = document.querySelector('.shop');
const cartButton = document.getElementById('cart');
const cartModal = document.getElementById('cart-modal');
const cartItemsEl = document.getElementById('cart-items');
const cartCountEl = document.getElementById('cart-count');
const cartEmptyEl = document.getElementById('cart-empty');
const cartTotalEl = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const categoryLinks = document.querySelectorAll('.shop-sidebar a');

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let allProducts = [];

// =======================
// FUNCIONES CARRITO
// =======================
function updateCart() {
  cartItemsEl.innerHTML = '';

  if(cart.length === 0){
    cartEmptyEl.style.display = 'block';
    cartTotalEl.textContent = '';
  } else {
    cartEmptyEl.style.display = 'none';
    let total = 0;
    cart.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.name} - ${item.price}€ x ${item.quantity}`;
      cartItemsEl.appendChild(li);
      total += item.price * item.quantity;
    });
    cartTotalEl.textContent = `Total: ${total}€`;
  }

  cartCountEl.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Mostrar modal al pinchar carrito
if(cartButton){
  cartButton.addEventListener('click', () => {
    if(cartModal){
      cartModal.classList.toggle('active');
      updateCart();
    }
  });
}

// Checkout
if(checkoutBtn){
  checkoutBtn.addEventListener('click', () => {
    window.location.href = 'checkout.html';
  });
}

// =======================
// RENDER PRODUCTOS
// =======================
function renderProducts(products) {
  if(!shop) return;
  shop.innerHTML = '';
  products.forEach(product => {
    const div = document.createElement('div');
    div.className = 'product';
    div.innerHTML = `
      <div class="product-image-wrapper">
        <a href="producto.html?id=${product.id}">
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
function filterCategory(category){
  if(category==='all') renderProducts(allProducts);
  else renderProducts(allProducts.filter(p => p.category === category));
}

// =======================
// CARGA JSON
// =======================
fetch('data/products.json')
  .then(res => res.json())
  .then(products => {
    allProducts = products;
    renderProducts(products);
    updateCart();
  });

// =======================
// EVENTOS SIDEBAR
// =======================
categoryLinks.forEach(link => {
  link.addEventListener('click', e=>{
    e.preventDefault();
    filterCategory(link.dataset.category);
  });
});

updateCart();
