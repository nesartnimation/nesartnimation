async function cargarPosts() {
  try {
    const response = await fetch("data/post.json");
    const posts = await response.json();

    const container = document.getElementById("blog-posts");
    container.innerHTML = "";

    posts.forEach(post => {

      const summary = post.content.length > 150 
        ? post.content.substring(0, 150) + "..." 
        : post.content;

      const postHTML = `
        <div class="blog-card">
          <img src="${post.image}" alt="${post.title}">
          <div class="blog-card-content">
            <h2>${post.title}</h2>
            <span class="blog-date">${post.date}</span>
            <p>${summary}</p>
            <a href="post.html?id=${post.id}" class="read-more">Leer más</a>
          </div>
        </div>
      `;

      container.innerHTML += postHTML;
    });

  } catch (error) {
    console.error("Error cargando los posts:", error);
  }
}

cargarPosts();
