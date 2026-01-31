// =======================
// VARIABLES GLOBALES
// =======================
const shop = document.getElementById('shop');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartEmpty = document.getElementById('cart-empty');
const cartTotal = document.getElementById('cart-total');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// =======================
// FUNCIÓN PARA ACTUALIZAR CARRITO
// =======================
function updateCart() {
  cartItems.innerHTML = '';
  if (cart.length === 0) {
    cartEmpty.style.display = 'block';
  } else {
    cartEmpty.style.display = 'none';

    cart.forEach((item, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        ${item.name} - $${item.price} x ${item.quantity}
        <button class="remove-item" data-index="${index}">✖</button>
      `;
      cartItems.appendChild(li);
    });
  }

  // Actualizar contador
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalQuantity;

  // Guardar en localStorage
  localStorage.setItem('cart', JSON.stringify(cart));

  // Mostrar total
  if(cartTotal){
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotal.textContent = `Total: $${totalPrice}`;
  }

  // Eventos de eliminar
  const removeButtons = document.querySelectorAll('.remove-item');
  removeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const index = button.getAttribute('data-index');
      cart.splice(index, 1);
      updateCart();
    });
  });
}

// =======================
// CARGAR PRODUCTOS DESDE JSON
// =======================
function loadProducts() {
  fetch('data/products.json')
    .then(response => response.json())
    .then(products => {
      products.forEach(product => {
        const div = document.createElement('div');
        div.className = 'product';
        div.innerHTML = `
          <div class="product-image-wrapper">
            <a href="${product.link}" class="product-link">
              <img src="${product.image}" alt="${product.name}">
            </a>
            <button class="overlay-button add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">Añadir al carrito</button>
          </div>
          <h3>${product.name}</h3>
          <p>${product.price}€</p>
        `;
        shop.appendChild(div);
      });

      // Botones añadir al carrito
      const addButtons = document.querySelectorAll('.add-to-cart');
      addButtons.forEach(button => {
        button.addEventListener('click', () => {
          const id = button.getAttribute('data-id');
          const name = button.getAttribute('data-name');
          const price = parseFloat(button.getAttribute('data-price'));

          // Si ya existe en el carrito, aumenta la cantidad
          const existing = cart.find(item => item.id === id);
          if(existing){
            existing.quantity += 1;
          } else {
            cart.push({ id, name, price, quantity: 1 });
          }

          updateCart();
        });
      });
    })
    .catch(error => console.error('Error al cargar los productos:', error));
}

// =======================
// INICIALIZACIÓN
// =======================
loadProducts();
updateCart();
