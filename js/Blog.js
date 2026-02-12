// URL de tu feed de Blogger en formato JSON
const feedURL = "https://elrincondenesart.blogspot.com/feeds/posts/default?alt=json";

// Función para quitar etiquetas HTML
function stripHTML(html) {
  let div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

// Función para truncar texto
function truncateText(text, maxLength) {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

// Cargar posts de Blogger
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
      const content = entry.content ? entry.content.$t : (entry.summary ? entry.summary.$t : "");

      // Obtener primera imagen del post
      const imgMatch = content.match(/<img.*?src="(.*?)"/);
      const imgSrc = imgMatch ? imgMatch[1] : "images/placeholder.jpg";

      // Crear la tarjeta del post
      const postHTML = `
        <div class="blog-card">
          <a href="${link}" target="_blank">
            <img src="${imgSrc}" alt="${title}">
            <div class="blog-card-content">
              <h2>${title}</h2>
              <p>${truncateText(stripHTML(content), 150)}</p>
            </div>
          </a>
        </div>
      `;

      postsContainer.innerHTML += postHTML;
    });

  } catch (error) {
    console.error("Error cargando los posts:", error);
    const postsContainer = document.getElementById('blog-posts');
    postsContainer.innerHTML = "<p>No se pudieron cargar los posts. Intenta más tarde.</p>";
  }
}

// Ejecutar al iniciar
document.addEventListener("DOMContentLoaded", cargarPosts);
