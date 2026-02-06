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

  products.forEach(product => {
    const div = document.createElement('div');
    div.className = 'product';

    div.innerHTML = `
      <div class="product-image-wrapper">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <h3>${product.name}</h3>
      <p>${product.price}€</p>
      <button class="add-to-cart-btn">Añadir al carrito</button>
    `;

    // Ir a ficha de producto
    div.querySelector('.product-image-wrapper').addEventListener('click', () => {
      window.location.href = product.link;
    });

    // =======================
    // AÑADIR AL CARRITO (🔥 CLAVE)
    // =======================
    div.querySelector('.add-to-cart-btn').addEventListener('click', () => {

      if (typeof window.addToCart !== 'function') {
        console.error('addToCart no está disponible. cart.js no cargado.');
        return;
      }

      // 🔒 Normalizamos el objeto para cart.js
      const productForCart = {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.image,
        stock: product.stock ?? 99 // fallback seguro
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
  if (category === 'all') {
    renderProducts(allProducts);
  } else {
    const filtered = allProducts.filter(
      product => product.category === category
    );
    renderProducts(filtered);
  }
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

    // 🧠 Seguridad: aseguramos IDs únicos
    allProducts.forEach((p, index) => {
      if (!p.id) p.id = `prod-${index}`;
    });

    renderProducts(allProducts);
  })
  .catch(err => {
    console.error('Error cargando productos:', err);
  });
+
