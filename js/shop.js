// =======================
// VARIABLES GLOBALES
// =======================
const shop = document.getElementById('shop'); // sección de productos
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartEmpty = document.getElementById('cart-empty');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// =======================
// FUNCIONES DE CARRITO
// =======================
function updateCart() {
  cartItems.innerHTML = '';
  if (cart.length === 0) {
    cartEmpty.style.display = 'block';
  } else {
    cartEmpty.style.display = 'none';
    cart.forEach((item, index) => {
      const li = document.createElement('li');
      li.textContent = `${item.name} - ${item.price}€`;

      // Botón eliminar
      const removeBtn = document.createElement('button');
      removeBtn.textContent = '❌';
      removeBtn.style.marginLeft = '8px';
      removeBtn.style.cursor = 'pointer';
      removeBtn.addEventListener('click', () => {
        cart.splice(index, 1);
        updateCart();
      });

      li.appendChild(removeBtn);
      cartItems.appendChild(li);
    });
  }
  cartCount.textContent = cart.length;
  localStorage.setItem('cart', JSON.stringify(cart));
}

// =======================
// CARGAR PRODUCTOS
// =======================
function loadProducts(category = null) {
  fetch('data/products.json')
    .then(response => response.json())
    .then(products => {

      // Filtrar por categoría si category no es null
      let filteredProducts = products;
      if (category) {
        filteredProducts = products.filter(p => p.category === category);
      }

      // Limpiar contenedor
      shop.innerHTML = '';

      filteredProducts.forEach(product => {

        const productCard = document.createElement('div');
        productCard.className = 'product';

        // Imagen con overlay
        const imageWrapper = document.createElement('div');
        imageWrapper.className = 'product-image-wrapper';

        const link = document.createElement('a');
        link.href = product.link;
        link.className = 'product-link';

        const img = document.createElement('img');
        img.src = product.image;
        img.alt = product.name;

        link.appendChild(img);
        imageWrapper.appendChild(link);

        const addButton = document.createElement('button');
        addButton.className = 'overlay-button';
        addButton.textContent = 'Añadir al carrito';
        addButton.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          cart.push({ name: product.name, price: product.price });
          updateCart();
        });

        imageWrapper.appendChild(addButton);

        // Nombre y precio
        const title = document.createElement('h3');
        title.textContent = product.name;

        const price = document.createElement('p');
        price.textContent = product.price + '€';

        // Añadir todo a card
        productCard.appendChild(imageWrapper);
        productCard.appendChild(title);
        productCard.appendChild(price);

        shop.appendChild(productCard);
      });
    })
    .catch(err => {
      console.error('Error al cargar productos:', err);
      shop.innerHTML = '<p>Error cargando productos</p>';
    });
}

// =======================
// DETECTAR SI HAY CATEGORÍA EN LA URL
// =======================
const urlParams = new URLSearchParams(window.location.search);
const categoryParam = urlParams.get('id');

// Cargar productos filtrados o todos
loadProducts(categoryParam);

// Actualizar carrito al cargar
updateCart();
