// =======================
// VARIABLES GLOBALES
// =======================
const shop = document.querySelector('.shop');
const categoryLinks = document.querySelectorAll('.shop-sidebar a');

let allProducts = [];

// =======================
// RENDER PRODUCTOS
// =======================
function renderProducts(products) {
  if (!shop) return;

  shop.innerHTML = '';

  products.forEach((product, index) => {
    // Aseguramos que cada producto tenga un ID único y stock definido
    if (!product.id) product.id = `prod-${index}`;
    if (product.stock === undefined) product.stock = 99;

    const div = document.createElement('div');
    div.className = 'product';

    // 🔹 Imagen envuelta en <a> para que el CSS funcione y sea clicable
    div.innerHTML = `
      <div class="product-image-wrapper">
        <a href="${product.link ?? '#'}">
          <img src="${product.image}" alt="${product.name}">
        </a>
      </div>
      <h3>${product.name}</h3>
      <p>${product.price}€</p>
      <button class="add-to-cart-btn">Añadir al carrito</button>
    `;

    // Añadir al carrito usando la función global de cart.js
    const addBtn = div.querySelector('.add-to-cart-btn');
    addBtn.addEventListener('click', () => {
      if (typeof window.addToCart !== 'function') {
        console.error('addToCart no está disponible. Asegúrate de cargar cart.js antes de shop.js');
        return;
      }

      const productForCart = {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.image,
        stock: product.stock
      };

      window.addToCart(productForCart);
    });

    shop.appendChild(div);
  });
}

// =======================
// FILTRO POR CATEGORÍAS
// =======================
function filterCategory(category) {
  if (category === 'all') renderProducts(allProducts);
  else renderProducts(allProducts.filter(p => p.category === category));
}

// =======================
// EVENTOS SIDEBAR
// =======================
categoryLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const category = link.dataset.category;
    filterCategory(category);
  });
});

// =======================
// CARGA DE PRODUCTOS
// =======================
fetch('data/products.json')
  .then(res => res.json())
  .then(products => {
    allProducts = products;

    // Aseguramos IDs únicos y stock por seguridad
    allProducts.forEach((p, i) => {
      if (!p.id) p.id = `prod-${i}`;
      if (p.stock === undefined) p.stock = 99;
    });

    renderProducts(allProducts);
  })
  .catch(err => console.error('Error cargando productos:', err));
