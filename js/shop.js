// =======================
// SHOP.JS - TIENDA FUNCIONAL
// =======================

// ELEMENTOS GLOBALES
const shop = document.querySelector('.shop');
const cartCount = document.getElementById('cart-count');
const cartItemsDropdown = document.getElementById('cart-items');
const cartEmptyDropdown = document.getElementById('cart-empty');
const categoryLinks = document.querySelectorAll('.shop-sidebar a');

const cartModal = document.getElementById('cart-modal');
const cartModalItems = document.getElementById('cart-modal-items');
const cartModalTotal = document.getElementById('cart-modal-total');
const cartModalEmpty = document.querySelector('#cart-modal-empty');
const cartModalClose = document.querySelector('.cart-close');
const cartModalCheckout = document.getElementById('cart-modal-checkout');

// CARRITO
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let allProducts = [];

// =======================
// FUNCIONES CARRITO
// =======================
function updateCart() {
  // DROPDOWN
  if(cartItemsDropdown){
    cartItemsDropdown.innerHTML = '';
    if(cart.length === 0){
      cartEmptyDropdown.style.display = 'block';
    } else {
      cartEmptyDropdown.style.display = 'none';
      cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - ${item.price}€ x ${item.quantity}`;
        cartItemsDropdown.appendChild(li);
      });
    }
  }

  // CONTADOR
  if(cartCount){
    cartCount.textContent = cart.reduce((sum,item)=>sum+item.quantity,0);
  }

  // MODAL
  renderCartModal();

  // GUARDAR
  localStorage.setItem('cart', JSON.stringify(cart));
}

function renderCartModal() {
  if(!cartModal || !cartModalItems || !cartModalTotal || !cartModalEmpty) return;

  cartModalItems.innerHTML = '';
  if(cart.length===0){
    cartModalEmpty.style.display='block';
    cartModalTotal.textContent='';
  } else {
    cartModalEmpty.style.display='none';
    let total=0;
    cart.forEach((item, index)=>{
      total += item.price * item.quantity;
      const li = document.createElement('li');
      li.innerHTML = `
        <img src="${item.image}" alt="${item.name}" style="width:50px;height:50px;object-fit:cover;border-radius:6px;margin-right:10px;">
        <span>${item.name} - ${item.price}€ x ${item.quantity}</span>
        <button class="remove-item" data-index="${index}">✖</button>
      `;
      li.querySelector('.remove-item').addEventListener('click', ()=>{
        cart.splice(index,1);
        updateCart();
      });
      cartModalItems.appendChild(li);
    });
    cartModalTotal.textContent = `Total: ${total}€`;
  }
}

// =======================
// FUNCION AÑADIR AL CARRITO
// =======================
function addProductToCart(id){
  const product = allProducts.find(p=>p.id===id);
  if(!product) return;

  const existing = cart.find(item=>item.id===id);
  if(existing){
    existing.quantity++;
  } else {
    cart.push({...product, quantity:1});
  }
  updateCart();
}

// =======================
// RENDER PRODUCTOS
// =======================
function renderProducts(products){
  if(!shop) return;

  shop.innerHTML = '';
  products.forEach(product=>{
    const div = document.createElement('div');
    div.className='product';
    div.innerHTML=`
      <div class="product-image-wrapper">
        <a href="${product.link || '#'}">
          <img src="${product.image}" alt="${product.name}">
        </a>
      </div>
      <h3>${product.name}</h3>
      <p>${product.price}€</p>
      <button class="add-to-cart-btn" data-id="${product.id}">Añadir al carrito</button>
    `;
    div.querySelector('.add-to-cart-btn').addEventListener('click', ()=>{
      addProductToCart(product.id);
    });
    shop.appendChild(div);
  });
}

// =======================
// FILTRO POR CATEGORÍA
// =======================
function filterCategory(category){
  if(category==='all') renderProducts(allProducts);
  else renderProducts(allProducts.filter(p=>p.category===category));
}

// =======================
// EVENTOS SIDEBAR
// =======================
categoryLinks.forEach(link=>{
  link.addEventListener('click', e=>{
    e.preventDefault();
    const category = link.dataset.category;
    if(category) filterCategory(category);
  });
});

// =======================
// MODAL EVENTOS
// =======================
if(cartModalClose) cartModalClose.addEventListener('click', ()=>cartModal.style.display='none');

if(cartModalCheckout){
  cartModalCheckout.addEventListener('click', ()=>{
    if(cart.length===0){
      alert('Todavía no has añadido productos');
      return;
    }
    window.location.href='checkout.html';
  });
}

// Cerrar modal al hacer click fuera
window.addEventListener('click', e=>{
  if(cartModal && e.target===cartModal) cartModal.style.display='none';
});

// =======================
// BOTÓN CARRITO FLOTA
// =======================
const cartContainer = document.getElementById('cart');
if(cartContainer){
  cartContainer.addEventListener('click', ()=>{
    if(cart.length===0 && cartModalEmpty) {
      cartModalEmpty.textContent='Todavía no has puesto nada en tu carrito';
      cartModalEmpty.style.display='block';
    }
    if(cartModal) cartModal.style.display='flex';
  });
}

// =======================
// CARGAR JSON PRODUCTOS
// =======================
fetch('data/products.json')
  .then(res=>res.json())
  .then(products=>{
    allProducts = products;

    // FILTRAR CATEGORÍA DESDE URL (categoria.html)
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('id');
    if(categoryId){
      filterCategory(categoryId);
    } else {
      renderProducts(products);
    }

    updateCart();
  })
  .catch(err=>console.error('Error cargando productos:', err));
