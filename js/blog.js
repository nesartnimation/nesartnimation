const posts = [
  {
    id: 1, // ✅ agrega un id único
    title: "Proceso creativo: Ilustración digital",
    date: "12 Feb 2026",
    image: "images/Blog/PetFoodBag.jpg",
    excerpt: "Un vistazo a cómo construyo mis ilustraciones digitales desde la idea hasta la obra final.",
    content: [
      { type: "text", value: "Este es el inicio del post con algo de introducción..." },
      { type: "image", value: "images/post1-extra1.jpg" },
      { type: "text", value: "Aquí sigue la explicación del proceso creativo..." },
      { type: "image", value: "images/post1-extra2.jpg" },
      { type: "text", value: "Y finalmente un cierre con reflexión." }
    ]
  }
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
