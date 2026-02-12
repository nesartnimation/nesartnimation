// Función callback que ejecuta Blogger al cargar JSONP
function mostrarPosts(data) {
  const postsContainer = document.getElementById('blog-posts');
  postsContainer.innerHTML = '';

  const entries = data.feed.entry || [];

  entries.forEach(entry => {
    const title = entry.title.$t;
    const link = entry.link.find(l => l.rel === "alternate").href;
    const content = entry.content ? entry.content.$t : (entry.summary ? entry.summary.$t : "");

    // Buscar primera imagen del post
    const imgMatch = content.match(/<img.*?src="(.*?)"/);
    const imgSrc = imgMatch ? imgMatch[1] : "images/placeholder.jpg";

    // Crear el HTML del post
    const postHTML = `
      <div class="blog-card">
        <a href="${link}" target="_blank">
          <img src="${imgSrc}" alt="${title}">
          <div class="blog-card-content">
            <h2>${title}</h2>
            <p>${stripHTML(content).substring(0, 150)}...</p>
          </div>
        </a>
      </div>
    `;

    postsContainer.innerHTML += postHTML;
  });
}

// Función para quitar etiquetas HTML
function stripHTML(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}
