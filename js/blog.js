// blog.js

const posts = [
  {
    title: "Proceso creativo: Ilustración digital",
    date: "12 Feb 2026",
    image: "images/Blog/PetFoodBag.jpg",
    excerpt: "Un vistazo a cómo construyo mis ilustraciones digitales desde la idea hasta la obra final.",
    link: "#"
  },
  {
    title: "Inspiración artística: Naturaleza",
    date: "5 Feb 2026",
    image: "images/post2.jpg",
    excerpt: "Descubre cómo la naturaleza influye en mi estilo y paleta de colores.",
    link: "#"
  },
  {
    title: "Tips para mejorar tus ilustraciones",
    date: "28 Ene 2026",
    image: "images/post3.jpg",
    excerpt: "Consejos prácticos para artistas que quieren perfeccionar sus habilidades.",
    link: "#"
  },
  {
    title: "Entrevista con un ilustrador profesional",
    date: "20 Ene 2026",
    image: "images/post4.jpg",
    excerpt: "Hablamos sobre procesos, retos y recomendaciones para artistas emergentes.",
    link: "#"
  },
  {
    title: "Técnicas de coloreado digital",
    date: "10 Ene 2026",
    image: "images/post5.jpg",
    excerpt: "Explorando distintos métodos de coloreado digital para dar vida a tus personajes.",
    link: "#"
  },
  {
    title: "Mi rutina de dibujo diaria",
    date: "2 Ene 2026",
    image: "images/post6.jpg",
    excerpt: "Cómo organizar tu día para mantener la creatividad y la productividad en tus ilustraciones.",
    link: "#"
  }
];

const blogGrid = document.getElementById("blog-posts");

posts.forEach(post => {
  const card = document.createElement("div");
  card.className = "blog-card";

  card.innerHTML = `
    <img src="${post.image}" alt="${post.title}">
    <div class="blog-card-content">
      <span class="blog-date">${post.date}</span>
      <h2>${post.title}</h2>
      <p>${post.excerpt}</p>
      <a href="${post.link}" class="read-more">Leer más →</a>
    </div>
  `;

  blogGrid.appendChild(card);
});
