// =======================
// VARIABLES GLOBALES
// =======================
const shop = document.querySelector('.shop');
const cartIcon = document.getElementById('cart');
const cartModal = document.getElementById('cart-modal');
const cartClose = document.querySelector('.cart-close');
const cartModalItems = document.getElementById('cart-modal-items');
const cartModalTotal = document.getElementById('cart-modal-total');
const cartModalEmpty = document.getElementById('cart-modal-empty');
const categoryLinks = document.querySelectorAll('.shop-sidebar a');

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let allProducts = [];

// =======================
// FUNCIONES CARRITO
// =======================
function updateCart() {
  cartModalItems.innerHTML = '';
  if(cart.length === 0){
    cartModalEmpty.style.display = 'block';
    cartModalTotal.textContent = '';
  } else {
    cartModalEmpty.style.display = 'none';
    let total = 0;
    cart.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.name} - ${item.price}€ x ${item.quantity}`;
      cartModalItems.appendChild(li);
      total += item.price * item.quantity;
    });
    cartModalTotal.textContent = `Total: ${total}€`;
  }
  document.getElementById('cart-count').textContent = cart.reduce((sum,item)=>sum+item.quantity,0);
  localStorage.setItem('cart', JSON.stringify(cart));
}

// =======================
// RENDER PRODUCTOS
// =======================
function renderProducts(products){
  if(!shop) return;
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
    div.querySelector('a').addEventListener('click', e => {
      e.preventDefault();
      // Redirige a producto.html?id=ID
      window.location.href = `producto.html?id=${product.id}`;
    });
    shop.appendChild(div);
  });
}

// =======================
// FILTRO CATEGORÍAS
// =======================
function filterCategory(category){
  if(category === 'all'){
    renderProducts(allProducts);
  } else {
    renderProducts(allProducts.filter(p=>p.category===category));
  }
}

// =======================
// CARGAR JSON
// =======================
fetch('data/products.json')
  .then(res => res.json())
  .then(products=>{
    allProducts = products;
    renderProducts(products);
    updateCart();
  });

// =======================
// EVENTOS SIDEBAR
// =======================
categoryLinks.forEach(link=>{
  link.addEventListener('click', e=>{
    e.preventDefault();
    filterCategory(link.dataset.category);
  });
});

// =======================
// MOSTRAR CARRITO SOLO EN TIENDA Y CATEGORÍAS
// =======================
if(cartIcon){
  const currentPage = window.location.pathname.split('/').pop().toLowerCase();
  const allowedPages = ['tienda.html','producto.html']; // páginas donde carrito se ve
  if(!allowedPages.includes(currentPage)){
    cartIcon.style.display='none';
  } else {
    cartIcon.style.display='block';
  }

  cartIcon.addEventListener('click', ()=>{
    cartModal.style.display = 'block';
    updateCart();
  });
}

// CERRAR MODAL
if(cartClose){
  cartClose.addEventListener('click', ()=>cartModal.style.display='none');
  window.addEventListener('click', e=>{
    if(e.target === cartModal) cartModal.style.display='none';
  });
}

// =======================
// ACTUALIZAR CARRITO INICIAL
// =======================
updateCart();
