// =======================
// VARIABLES GLOBALES
// =======================
const shop = document.querySelector('.shop');
const cartItems = document.getElementById('cart-items'); 
const cartCount = document.getElementById('cart-count');
const cartEmpty = document.getElementById('cart-empty');
const cartTotal = document.getElementById('cart-total');
const categoryLinks = document.querySelectorAll('.shop-sidebar a');

const cartModal = document.getElementById('cart-modal');
const cartModalItems = document.getElementById('cart-modal-items');
const cartModalTotal = document.getElementById('cart-modal-total');
const cartModalEmpty = document.getElementById('cart-modal-empty');
const cartModalClose = document.querySelector('.cart-close');
const cartModalCheckout = document.getElementById('cart-modal-checkout');

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let allProducts = [];

// =======================
// FUNCIONES CARRITO
// =======================
function updateCart() {
  // Dropdown
  if(cartItems){
    cartItems.innerHTML = '';
    if(cart.length === 0){
      cartEmpty.style.display = 'block';
    } else {
      cartEmpty.style.display = 'none';
      cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - ${item.price}€ x ${item.quantity}`;
        cartItems.appendChild(li);
      });
    }
  }

  // Contador
  cartCount.textContent = cart.reduce((sum,item)=>sum+item.quantity,0);

  // Modal
  renderCartModal();

  localStorage.setItem('cart',JSON.stringify(cart));
}

function renderCartModal() {
  cartModalItems.innerHTML = '';
  if(cart.length===0){
    cartModalEmpty.style.display='block';
    cartModalTotal.textContent='';
  } else {
    cartModalEmpty.style.display='none';
    let total=0;
    cart.forEach(item=>{
      total += item.price * item.quantity;

      const li = document.createElement('li');
      li.innerHTML = `
        <img src="${item.image}" alt="${item.name}" style="width:50px;height:50px;object-fit:cover;border-radius:6px;margin-right:10px;">
        <span>${item.name} - ${item.price}€ x ${item.quantity}</span>
      `;
      cartModalItems.appendChild(li);
    });
    cartModalTotal.textContent = `Total: ${total}€`;
  }
}

// =======================
// RENDER PRODUCTOS
// =======================
function renderProducts(products) {
  if(!shop) return;

  shop.innerHTML = '';

  products.forEach(product=>{
    const div = document.createElement('div');
    div.className='product';

    div.innerHTML=`
      <div class="product-image-wrapper">
        <a href="${product.link}">
          <img src="${product.image}" alt="${product.name}">
        </a>
      </div>
      <h3>${product.name}</h3>
      <p>${product.price}€</p>
      <button class="add-to-cart-btn">Añadir al carrito</button>
    `;

    // Botón añadir al carrito
    const addBtn = div.querySelector('.add-to-cart-btn');
    addBtn.addEventListener('click', ()=>{
      const existing = cart.find(item => item.id === product.id);
      const currentQty = existing ? existing.quantity : 0;

      if(currentQty + 1 > product.stock){
        alert(`No hay suficiente stock de ${product.name}. Disponible: ${product.stock}`);
        return;
      }

      if(existing){
        existing.quantity += 1;
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
    });

    shop.appendChild(div);
  });
}

// =======================
// FILTRO POR CATEGORÍAS
// =======================
function filterCategory(category){
  categoryLinks.forEach(link=>{
    if(link.dataset.category === category) link.classList.add('active');
    else link.classList.remove('active');
  });

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

    // Filtrado inicial por URL
    const urlParams = new URLSearchParams(window.location.search);
    const catFromURL = urlParams.get('id');
    if(catFromURL && allProducts.some(p=>p.category===catFromURL)){
      filterCategory(catFromURL);
    } else {
      renderProducts(products);
      filterCategory('all');
    }

    updateCart();
  }).catch(err=>console.error(err));

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
// MODAL EVENTOS
// =======================
if(cartModalClose) cartModalClose.addEventListener('click',()=>cartModal.style.display='none');
if(cartModalCheckout){
  cartModalCheckout.addEventListener('click',()=>{
    if(cart.length===0){
      alert('Todavía no has añadido productos');
      return;
    }
    window.location.href='checkout.html';
  });
}

// Cerrar modal al click fuera
window.addEventListener('click', e=>{
  if(e.target===cartModal) cartModal.style.display='none';
});

// =======================
// BOTÓN FLOTA CARRITO
// =======================
const cartContainer = document.getElementById('cart');
if(cartContainer){
  cartContainer.addEventListener('click', ()=>{
    if(cart.length===0){
      cartModalEmpty.textContent='Todavía no has puesto nada en tu carrito';
      cartModalEmpty.style.display='block';
    }
    cartModal.style.display='flex';
  });
}

// =======================
// INICIALIZACIÓN
// =======================
updateCart();
