// =======================
// VARIABLES GLOBALES
// =======================
const shop = document.querySelector('.shop');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartEmpty = document.getElementById('cart-empty');
const cartTotal = document.getElementById('cart-total');
const cartContainer = document.getElementById('cart');
const categoryLinks = document.querySelectorAll('.shop-sidebar a');

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let allProducts = [];

// =======================
// ACTUALIZAR CARRITO Y MOSTRAR MINIATURAS
// =======================
function updateCart() {
  cartItems.innerHTML = '';

  if(cart.length === 0){
    cartEmpty.textContent = "Tu carrito está vacío";
    cartEmpty.style.display = 'block';
  } else {
    cartEmpty.style.display = 'none';
    cart.forEach((item, index)=>{
      const li = document.createElement('li');

      li.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-thumb">
        <span>${item.name} - ${item.price}€ x ${item.quantity || 1}</span>
        <button data-index="${index}">❌</button>
      `;

      li.querySelector('button').addEventListener('click', ()=>{
        cart.splice(index,1);
        updateCart();
      });

      cartItems.appendChild(li);
    });
  }

  // Total
  if(cartTotal){
    const total = cart.reduce((sum,item)=> sum + item.price * (item.quantity || 1),0);
    cartTotal.textContent = cart.length > 0 ? `Total: ${total}€` : '';
  }

  cartCount.textContent = cart.reduce((sum,item)=> sum + (item.quantity || 1),0);
  localStorage.setItem('cart', JSON.stringify(cart));
}

// =======================
// ACCESO AL CARRITO (MODAL)
// =======================
if(cartContainer){
  cartContainer.addEventListener('click', ()=>{
    if(cart.length === 0){
      cartEmpty.textContent = 'Todavía no has puesto nada en tu carrito';
      cartEmpty.style.display = 'block';
      return;
    }
    // Toggle modal
    cartContainer.classList.toggle('open');
  });
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
  else renderProducts(allProducts.filter(p=>p.category===category));
}

// =======================
// CARGAR JSON
// =======================
fetch('data/products.json')
  .then(res=>res.json())
  .then(products=>{
    allProducts = products;
    renderProducts(products);
    updateCart();
  })
  .catch(err=>console.error(err));

// =======================
// EVENTOS SIDEBAR
// =======================
categoryLinks.forEach(link=>{
  link.addEventListener('click', e=>{
    e.preventDefault();
    filterCategory(link.dataset.category);
  });
});
