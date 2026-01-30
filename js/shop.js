// =======================
// VARIABLES GLOBALES
// =======================
const shop = document.getElementById('shop');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartEmpty = document.getElementById('cart-empty');

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
    cart.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.name} - $${item.price}`;
      cartItems.appendChild(li);
    });
  }
  cartCount.textContent = cart.length;
  localStorage.setItem('cart', JSON.stringify(cart));
}

// =======================
// FUNCION PARA CARGAR PRODUCTOS DESDE JSON
// =======================
function loadProducts() {
  fetch('data/products.json')
    .then(response => response.json())
    .then(products => {
      products.forEach(product => {
        const div = document.createElement('div');
        div.className = 'product';
        div.innerHTML = `
          <img src="images/${product.image}" alt="${product.name}">
          <h3>${product.name}</h3>
          <p>${product.price}€</p>
          <button class="add-to-cart" data-name="${product.name}" data-price="${product.price}">Añadir al carrito</button>
        `;
        shop.appendChild(div);
      });

      // Añadir eventos a los botones creados dinámicamente
      document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
          const name = button.getAttribute('data-name');
          const price = button.getAttribute('data-price');
          cart.push({ name, price });
          updateCart();
        });
      });
    })
    .catch(err => console.error(err));
}
// =======================
// INICIALIZACIÓN
// =======================
loadProducts();
updateCart();

