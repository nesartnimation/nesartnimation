// =======================
// VARIABLES GLOBALES
// =======================
const shop = document.querySelector('.shop');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartEmpty = document.getElementById('cart-empty');
const cartTotal = document.getElementById('cart-total');
const categoryLinks = document.querySelectorAll('.shop-sidebar a');

const cartButton = document.getElementById('cart');
const cartModal = document.getElementById('cart-modal');
const cartModalClose = document.getElementById('cart-modal-close');
const cartModalItems = document.getElementById('cart-modal-items');
const cartModalEmpty = document.getElementById('cart-modal-empty');
const cartModalTotal = document.getElementById('cart-modal-total');
const cartModalCheckout = document.getElementById('cart-modal-checkout');

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let allProducts = []; // guardar productos desde JSON

// =======================
// FUNCIONES CARRITO / MODAL
// =======================
function updateCart() {
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCartModal();
}

function renderCartModal() {
  if(!cartModalItems) return;
  cartModalItems.innerHTML = '';
  if (cart.length === 0) {
    cartModalEmpty.style.display = 'block';
    cartModalTotal.textContent = '';
  } else {
    cartModalEmpty.style.display = 'none';
    let total = 0;
    cart.forEach((item,index) => {
      const li = document.createElement('li');
      li.textContent = `${item.name} - ${item.price}€ x ${item.quantity}`;
      const removeBtn = document.createElement('button');
      removeBtn.textContent = '❌';
      removeBtn.addEventListener('click', () => {
        cart.splice(index,1);
        updateCart();
      });
      li.appendChild(removeBtn);
      cartModalItems.appendChild(li);
      total += item.price * item.quantity;
    });
    cartModalTotal.textContent = `Total: ${total}€`;
  }
}

function openCartModal() {
  cartModal.classList.add('active');
  renderCartModal();
}

function closeCartModal() {
  cartModal.classList.remove('active');
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
        <a href="${product.link}?id=${product.id}">
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
  if(category === 'all'){
    renderProducts(allProducts);
  } else {
    renderProducts(allProducts.filter(p=>p.category===category));
  }
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
categoryLinks.forEach(link=>{
  link.addEventListener('click',e=>{
    e.preventDefault();
    filterCategory(link.dataset.category);
  });
});

// =======================
// MODAL CARRITO
// =======================
if(cartButton){
  cartButton.addEventListener('click', openCartModal);
}
if(cartModalClose){
  cartModalClose.addEventListener('click', closeCartModal);
}
if(cartModalCheckout){
  cartModalCheckout.addEventListener('click',()=>{
    if(cart.length === 0){
      alert("Todavía no has puesto nada en tu carrito");
    } else {
      window.location.href = 'checkout.html';
    }
  });
}

updateCart();
