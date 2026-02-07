// =======================
// VARIABLES GLOBALES
// =======================
const shop = document.querySelector('.shop');
const categoryLinks = document.querySelectorAll('.shop-sidebar a');

let allProducts = [];

// =======================
// RENDERIZAR PRODUCTOS
// =======================
function renderProducts(products) {
  if (!shop) return;

  shop.innerHTML = '';

  products.forEach((product, index) => {
    // Garantizar ID y stock
    const productId = product.id || `prod-${index}`;
    const productStock = product.stock ?? 99;

    const div = document.createElement('div');
    div.className = 'product';

    // Imagen con link a producto
    div.innerHTML = `
      <div class="product-image-wrapper">
        <a href="producto.html?id=${productId}">
          <img src="${product.image}" alt="${product.name}">
        </a>
      </div>
      <h3>${product.name}</h3>
      <p>${product.price}€</p>
      <button class="add-to-cart-btn">Añadir al carrito</button>
    `;

    // Botón "Añadir al carrito"
    const addBtn = div.querySelector('.add-to-cart-btn');
    addBtn.addEventListener('click', () => {
      if (typeof window.addToCart !== 'function') {
        console.error('addToCart no está disponible. Asegúrate de cargar cart.js antes de shop.js');
        return;
      }

      window.addToCart({
        id: productId,
        name: product.name,
        price: Number(product.price),
        image: product.image,
        stock: productStock
      }, { openModal: false });
    });

    shop.appendChild(div);
  });
}

// =======================
// FILTRO POR CATEGORÍA
// =======================
function filterCategory(category) {
  if (category === 'all') renderProducts(allProducts);
  else renderProducts(allProducts.filter(p => p.category === category));

  // Marcar link activo
  categoryLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.category === category);
  });
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
    allProducts = products.map((p, i) => ({
      id: p.id || `prod-${i}`,
      name: p.name,
      price: p.price,
      image: p.image,
      category: p.category || 'uncategorized',
      stock: p.stock ?? 99,
      link: p.link ?? `producto.html?id=${p.id || `prod-${i}`}`
    }));

    renderProducts(allProducts);
  })
  .catch(err => console.error('Error cargando productos:', err));
