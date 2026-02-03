// =======================
// VARIABLES GLOBALES
// =======================
const shop = document.querySelector('.shop');
const cartItems = document.getElementById('cart-items'); 
const cartCount = document.getElementById('cart-count');
const cartEmpty = document.getElementById('cart-empty');
const categoryLinks = document.querySelectorAll('.shop-sidebar a');

const cartModal = document.getElementById('cart-modal');
const cartModalItems = document.getElementById('cart-modal-items');
const cartModalTotal = document.getElementById('cart-modal-total');
const cartModalEmpty = document.getElementById('cart-modal-empty');
const cartModalClose = document.querySelector('.cart-close');
const cartModalCheckout = document.getElementById('cart-modal-checkout');

const checkoutModal = document.getElementById('checkout-modal');
const checkoutClose = document.querySelector('.checkout-close');
const checkoutForm = document.getElementById('checkout-form');
const checkoutTotalModal = document.getElementById('checkout-total-modal');
const checkoutCartItems = document.getElementById('checkout-cart-items');
const discountInput = document.getElementById('discount-code');

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let allProducts = [];

// =======================
// ACTUALIZAR CARRITO
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
  if(cartCount) cartCount.textContent = cart.reduce((sum,item)=>sum+item.quantity,0);

  // Modal carrito
  renderCartModal();

  // Modal checkout derecho
  renderCheckoutCart();

  localStorage.setItem('cart',JSON.stringify(cart));
}

// =======================
// RENDER MODAL CARRITO
// =======================
function renderCartModal() {
  if(!cartModalItems) return;

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
      li.style.display='flex';
      li.style.alignItems='center';
      li.style.justifyContent='space-between';
      li.style.gap='10px';
      li.innerHTML = `
        <img src="${item.image}" alt="${item.name}" style="width:50px;height:50px;object-fit:cover;border-radius:6px;">
        <span>${item.name} - ${item.price}€ x </span>
        <input type="number" min="1" value="${item.quantity}" data-id="${item.id}" style="width:50px;">
        <button data-id="${item.id}">✖</button>
      `;
      // Cambiar cantidad
      li.querySelector('input').addEventListener('change', e=>{
        const val = parseInt(e.target.value);
        if(val < 1) e.target.value=1;
        const id = e.target.dataset.id;
        const prod = cart.find(p=>p.id===id);
        if(prod){
          if(val>prod.stock){
            alert(`No hay suficiente stock. Disponible: ${prod.stock}`);
            e.target.value = prod.stock;
            prod.quantity = prod.stock;
          } else {
            prod.quantity = val;
          }
          updateCart();
        }
      });
      // Botón eliminar
      li.querySelector('button').addEventListener('click', e=>{
        const id = e.target.dataset.id;
        cart = cart.filter(p=>p.id!==id);
        updateCart();
      });

      cartModalItems.appendChild(li);
    });
    cartModalTotal.textContent = `Total: ${total}€`;
  }
}

// =======================
// RENDER CHECKOUT DERECHO
// =======================
function renderCheckoutCart() {
  if(!checkoutCartItems) return;
  checkoutCartItems.innerHTML = '';
  let subtotal = 0;
  cart.forEach(item => {
    subtotal += item.price * item.quantity;
    const li = document.createElement('li');
    li.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <span>${item.name} x ${item.quantity}</span>
      <span>${(item.price*item.quantity).toFixed(2)}€</span>
    `;
    checkoutCartItems.appendChild(li);
  });
  const discount = parseFloat(discountInput?.value) || 0;
  const total = Math.max(subtotal - discount,0);
  if(checkoutTotalModal) checkoutTotalModal.textContent = `Total: ${total.toFixed(2)}€`;
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
        <img src="${product.image}" alt="${product.name}">
      </div>
      <h3>${product.name}</h3>
      <p>${product.price}€</p>
    `;

    div.querySelector('.product-image-wrapper').addEventListener('click',()=>{
      window.location.href = product.link;
    });

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
  }).catch(err=>console.error(err));

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
// MODAL CARRITO EVENTOS
// =======================
if(cartModalClose) cartModalClose.addEventListener('click',()=>cartModal.style.display='none');

// Abrir checkout modal (desde botón finalizar compra o tienda)
function openCheckoutModal(){
  if(cart.length===0){
    alert('Todavía no has añadido productos');
    return;
  }
  renderCheckoutCart();
  if(checkoutModal) checkoutModal.style.display='flex';
}

// Botón finalizar compra
if(cartModalCheckout) cartModalCheckout.addEventListener('click', openCheckoutModal);

// Descuento código
if(discountInput){
  discountInput.addEventListener('input', renderCheckoutCart);
}

// Cerrar modal al click fuera
window.addEventListener('click', e=>{
  if(e.target===cartModal) cartModal.style.display='none';
  if(e.target===checkoutModal) checkoutModal.style.display='none';
});

// =======================
// CERRAR MODAL CHECKOUT
// =======================
if(checkoutClose) checkoutClose.addEventListener('click',()=>checkoutModal.style.display='none');

// =======================
// CONFIRMAR COMPRA
// =======================
if(checkoutForm){
  checkoutForm.addEventListener('submit', e=>{
    e.preventDefault();

    const name = document.getElementById('client-name').value;
    const email = document.getElementById('client-email').value;
    const address = document.getElementById('client-address').value;
    const city = document.getElementById('client-city').value;
    const postal = document.getElementById('client-postal').value;
    const country = document.getElementById('client-country').value;
    const phone = document.getElementById('client-phone').value;
    const message = document.getElementById('client-message').value;
    const payment = document.querySelector('input[name="payment-method"]:checked')?.value;

    if(!name || !email || !address || !city || !postal || !country || !phone || !payment){
      alert('Completa todos los campos antes de continuar');
      return;
    }

    alert(`Compra realizada con éxito!\nGracias ${name}\nTotal: ${checkoutTotalModal.textContent}`);

    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
    checkoutModal.style.display='none';
    checkoutForm.reset();
    if(discountInput) discountInput.value = '';
  });
}

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
