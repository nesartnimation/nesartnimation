// =======================
// VARIABLES GLOBALES
// =======================
const shop = document.querySelector('.shop');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartEmpty = document.getElementById('cart-empty');
const cartTotal = document.getElementById('cart-total');
const categoryLinks = document.querySelectorAll('.shop-sidebar a');

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let allProducts = [];

// =======================
// ACTUALIZAR CARRITO
// =======================
function updateCartCount() {
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = total;
  localStorage.setItem('cart', JSON.stringify(cart));
}

// =======================
// RENDER PRODUCTOS
// =======================
function renderProducts(products) {
  shop.innerHTML = '';

  products.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'product';

    productCard.innerHTML = `
      <div class="product-image-wrapper">
        <a href="${product.link}">
          <img src="${product.image}" alt="${product.name}">
        </a>
        <button class="add-to-cart">Añadir al carrito</button>
      </div>
      <h3>${product.name}</h3>
      <p>${product.price}€</p>
    `;

    const addBtn = productCard.querySelector('.add-to-cart');

    addBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const existing = cart.find(item => item.id === product.id);

      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1
        });
      }

      updateCartCount();
    });

    shop.appendChild(productCard);
  });
}

// =======================
// FILTRO POR CATEGORÍA
// =======================
function filterCategory(category) {
  if (category === 'all') {
    renderProducts(allProducts.slice(0, 4));
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
    renderProducts(products.slice(0, 4));
    updateCartCount();
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
