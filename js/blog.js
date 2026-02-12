// blog.js

const posts = [
  {
    title: "Proceso creativo: Ilustración digital",
    date: "12 Feb 2026",
    image: "images/Blog/PetFoodBag.jpg",
    excerpt: "Un vistazo a cómo construyo mis ilustraciones digitales desde la idea hasta la obra final.",
    content: "Aquí va todo el contenido del primer post..."
  },
 
];

const blogGrid = document.getElementById("blog-posts");

posts.forEach(post => {
  const card = document.createElement("div");
  card.classList.add("blog-card");
  card.innerHTML = `
    <a href="post.html?id=${post.id}">
      <img src="${post.image}" alt="${post.title}">
    </a>
    <div class="blog-card-content">
      <h2>${post.title}</h2>
      <span class="blog-date">${post.date}</span>
      <p>${post.excerpt}</p>
      <a href="post.html?id=${post.id}" class="read-more">Leer más</a>
    </div>
  `;
  blogGrid.appendChild(card);
});
