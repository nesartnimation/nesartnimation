const feedURL = "https://elrincondenesart.blogspot.com/feeds/posts/default?alt=json"; // Cambia tu URL

async function cargarPosts() {
  try {
    const response = await fetch(feedURL);
    const data = await response.json();

    const postsContainer = document.getElementById('blog-posts');
    postsContainer.innerHTML = '';

    const entries = data.feed.entry || [];
    entries.forEach(entry => {
      const title = entry.title.$t;
      const link = entry.link.find(l => l.rel === "alternate").href;
      const content = entry.content.$t || entry.summary.$t;

      // Buscar primera imagen del post
      const imgMatch = content.match(/<img.*?src="(.*?)"/);
      const imgSrc = imgMatch ? imgMatch[1] : "placeholder.jpg";

      // Crear el bloque HTML del post
      const postHTML = `
        <div class="blog-post">
          <a href="${link}" target="_blank">
            <div class="blog-post-image">
              <img src="${imgSrc}" alt="${title}">
            </div>
            <h2>${title}</h2>
            <p>${truncateText(stripHTML(content), 120)}...</p>
          </a>
        </div>
      `;
      postsContainer.innerHTML += postHTML;
    });
  } catch (error) {
    console.error("Error cargando los posts:", error);
  }
}

// Función para quitar etiquetas HTML
function stripHTML(html) {
  let div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

// Función para truncar texto
function truncateText(text, maxLength) {
  return text.length > maxLength ? text.substring(0, maxLength) : text;
}

// Cargar posts al iniciar
cargarPosts();
