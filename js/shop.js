// =======================
// VARIABLES GLOBALES
// =======================
const shop = document.querySelector('.shop');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartEmpty = document.getElementById('cart-empty');
const cartTotal = document.getElementById('cart-total');
const categoryLinks = document.querySelectorAll('.shop-sidebar a');
const cartContainer = document.getElementById('cart');

// MODAL
const cartModal = document.getElementById('cart-modal');
const cartModalItems = document.getElementById('cart-modal-items');
const cartModalTotal = document.getElementById('cart-modal-total');
const cartModalEmpty = document.getElementById('cart-modal-empty');
const cartModalClose = document.querySelector('.cart-close');
const cartModalCheckout = document.getElementById('cart-modal-checkout');

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let allProducts = [];

// =======================
// ACTUALIZAR CARRITO
// =======================
function updateCart() {
  // actualizar contador y localStorage
  cartCount.textContent = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  localStorage.setItem('cart', JSON.stringify(cart));

  // actualizar lista flotante
  if(cartItems){
    cartItems.innerHTML = '';
    if(cart.length===0){
      cartEmpty.style.display='block';
    } else {
      cartEmpty.style.display='none';
      cart.forEach(item=>{
        const li = document.createElement('li');
        li.textContent = `${item.name} - ${item.price}€ x ${item.quantity || 1}`;
        cartItems.appendChild(li);
      });
    }
  }
}

// =======================
// RENDER PRODUCTOS
// =======================
function renderProducts(products){
  if(!shop) return;
  shop.innerHTML = '';
  products.forEach(product=>{
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
// FILTRO POR CATEGORÍAS
// =======================
function filterCategory(category){
  if(category==='all') renderProducts(allProducts);
  else renderProducts(allProducts.filter(p=>p.category===category));
}

// =======================
// CARGA JSON
// =======================
fetch('data/products.json')
  .then(res=>res.json())
  .then(products=>{
    allProducts = products;
    renderProducts(products);
    updateCart();
  })
  .catch(err=>console.error('Error cargando productos:', err));

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
// FUNCIONES MODAL CARRITO
// =======================
function openCartModal(){
  if(cart.length===0){
    cartModalEmpty.style.display='block';
    cartModalItems.innerHTML='';
    cartModalTotal.textContent='';
  } else {
    cartModalEmpty.style.display='none';
    cartModalItems.innerHTML='';
    let total=0;
    cart.forEach(item=>{
      const li=document.createElement('li');
      li.textContent = `${item.name} - ${item.price}€ x ${item.quantity || 1}`;
      cartModalItems.appendChild(li);
      total += item.price*(item.quantity||1);
    });
    cartModalTotal.textContent = `Total: ${total}€`;
  }
  cartModal.style.display='block';
}

function closeCartModal(){
  cartModal.style.display='none';
}

// abrir modal al click en carrito
if(cartContainer) cartContainer.addEventListener('click', openCartModal);
if(cartModalClose) cartModalClose.addEventListener('click', closeCartModal);

// cerrar modal al pinchar fuera
window.addEventListener('click', e=>{
  if(e.target===cartModal) closeCartModal();
});

// botón finalizar compra dentro del modal
if(cartModalCheckout){
  cartModalCheckout.addEventListener('click', ()=>{
    if(cart.length>0) window.location.href='checkout.html';
  });
}

// iniciar contador al cargar
updateCart();
