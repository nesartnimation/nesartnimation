// Obtener el id del post desde la URL
const urlParams = new URLSearchParams(window.location.search);
const postId = parseInt(urlParams.get("id"));

// Buscar el post en el array
const post = posts.find(p => p.id === postId);

const container = document.getElementById("post-container");

if (post) {
  container.innerHTML = `
    <h1>${post.title}</h1>
    <span class="blog-date">${post.date}</span>
    <img src="${post.image}" alt="${post.title}" style="width:100%; max-width:800px; margin:20px 0;">
    <p>${post.content}</p>
    <a href="Blog.html" class="read-more">Volver al Blog</a>
  `;
} else {
  container.innerHTML = "<p>Post no encontrado.</p>";
}
