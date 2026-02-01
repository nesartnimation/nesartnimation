// =======================
// VARIABLES GLOBALES
// =======================
const shop = document.querySelector('.shop');
const cartItems = document.getElementById('cart-items'); // para dropdown (opcional)
const cartCount = document.getElementById('cart-count');
const cartEmpty = document.getElementById('cart-empty');
const cartTotal = document.getElementById('cart-total');
const categoryLinks = document.querySelectorAll('.shop-sidebar a');

const cartModal = document.getElementById('cart-modal');
const cartModalContent = document.querySelector('.cart-modal-content');
const cartModalItems = document.getElementById('cart-modal-items');
const cartModalTotal = document.getElementById('cart-modal-total');
const cartModalEmpty = document.getElementById('cart-modal-empty');
const cartModalClose = document.querySelector('.cart-close');
const cartModalCheckout = document.getElementById('cart-modal-checkout');

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let allProducts = []; // guardar productos desde JSON

// =======================
// ACTUALIZAR CARRITO
// =======================
function updateCart() {
  // Dropdown interno
  if(cartItems){
    cartItems.innerHTML = '';
    if(cart.length === 0){
      cartEmpty.style.display = 'block';
    } else {
      cartEmpty.style.display = 'none';
      cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - ${item.price}€ x ${item.quantity}`;
        cartItems.appendChild(li);
      });
    }
  }

  // Contador carrito
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Modal
  renderCartModal();

  localStorage.setItem('cart', JSON.stringify(cart));
}

// =======================
// RENDER MODAL CARRITO
// =======================
function renderCartModal() {
  cartModalItems.innerHTML = '';
  if(cart.length === 0){
    cartModalEmpty.style.display = 'block';
    cartModalTotal.textContent = '';
  } else {
    cartModalEmpty.style.display = 'none';
    let total = 0;
    cart.forEach(item => {
      total += item.price * item.quantity;

      const li = document.createElement('li');
      li.innerHTML = `
        <img src="${item.image}" alt="${item.name}" style="width:50px; height:50px; object-fit:cover; border-radius:6px; margin-right:10px;">
        <span>${item.name} - ${item.price}€ x ${item.quantity}</span>
      `;
      cartModalItems.appendChild(li);
    });
    cartModalTotal.textContent = `Total: ${total}€`;
  }
}

// =======================
// RENDER PRODUCTOS (TIENDA Y CATEGORÍAS)
// =======================
function renderProducts(products) {
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

    // Añadir producto al carrito al click en la imagen
    div.querySelector('a').addEventListener('click', e => {
      e.preventDefault(); // evitar navegación si quieres abrir modal en lugar de página
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });
      updateCart();
      cartModal.style.display = 'flex'; // abrir modal
    });

    shop.appendChild(div);
  });
}

// =======================
// FILTRO POR CATEGORÍAS
// =======================
function filterCategory(category) {
  if(category === 'all'){
    renderProducts(allProducts);
  } else {
    renderProducts(allProducts.filter(p => p.category === category));
  }
}

// =======================
// CARGA JSON
// =======================
fetch('data/products.json')
  .then(res => res.json())
  .then(products => {
    allProducts = products;
    renderProducts(products); // mostrar todos
    updateCart();
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
// MODAL CARRITO EVENTOS
// =======================
if(cartModalClose){
  cartModalClose.addEventListener('click', ()=> cartModal.style.display='none');
}

if(cartModalCheckout){
  cartModalCheckout.addEventListener('click', ()=> {
    if(cart.length === 0){
      alert('Todavía no has añadido productos al carrito');
      return;
    }
    window.location.href = 'checkout.html';
  });
}

// Cerrar modal al pinchar fuera
window.addEventListener('click', e => {
  if(e.target === cartModal){
    cartModal.style.display = 'none';
  }
});

// =======================
// ACCESO AL CARRITO DESDE BOTÓN FLOTANTE
// =======================
const cartContainer = document.getElementById('cart');
if(cartContainer){
  cartContainer.addEventListener('click', ()=>{
    if(cart.length === 0){
      cartModalEmpty.textContent = 'Todavía no has puesto nada en tu carrito';
      cartModalEmpty.style.display = 'block';
    }
    cartModal.style.display='flex';
  });
}

// =======================
// INICIALIZACIÓN
// =======================
updateCart();
