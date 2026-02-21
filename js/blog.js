// blog.js (versión final, móvil y desktop)

const posts = [
  {
    id: 1, // id único
    title: "El camino para convertirme en Concept Artist",
    date: "12 Feb 2026",
    image: "images/Blog/MrChipsy.jpg",
    excerpt: "Esto es lo que me llevó al punto donde estoy ahora. Meses y meses de creaciones apasionadas, de noches sin dormir.",
    content: [
      { type: "image", value: "images/Blog/MrChipsy.jpg" },
      { type: "text", value: [
          "Estaréis de acuerdo conmigo cuando os digo que está en la naturaleza humana expresarse a través de la ilustración.",
          "Desde que nacemos y tenemos en nuestras manos una herramienta para dibujar pintamos paredes, techos y todo lo que esté a nuestro alcance.",
          "Si echo la vista atrás, he estado toda mi vida garabateando en papel, tratando de descubrir qué es lo que más me gustaba dentro de esta maravillosa disciplina. Y es que hay tanto por aprender, que a veces se nos puede hacer todo un mundo.",
          "A los 2 o 3 años comencé con pequeños cómics inventados con curiosos protagonistas como: Danonino, los Power Ranger, para más tarde pasar por una época donde mezclaba Pokemons y hacía nuevas creaciones, más tarde dibujaba al más puro estilo Manga, e incluso llegué a caricaturizar a mis profesores y famosos de los años 90 y 2000."
        ]
      },
      { type: "image", value: "images/Manga_Caricatura.jpg" },
      { type: "text", value: [
          "Tras una larga ausencia de unos casi 20 largo años sin tocar un lápiz de forma seria, hace poco más de 730 días decidí retomar la ilustración al formarme como tatuador, adoptando un estilo Cartoon mezclado con medieval y Grime Style, para posteriormente enfocarme por completo en un estilo Fleischer.",
          "Esto es lo que me llevó al punto donde estoy ahora. Meses y meses de creaciones apasionadas, de noches sin dormir, porque algo dentro de mí me pedía a gritos volver a mezclar ideas para crear nuevos personajes."
        ]
      },
      { type: "image", value: "images/Personajes.jpg" },
      { type: "text", value: [
          "Y tras dejar atrás mi vida y cambiarme de ciudad, investigar cada opción dentro del mundo de la ilustración y probar sin descanso, me di cuenta de que lo que me llena es crear algo nuevo, el poder darle vida a personajes que no existen.",
          "Soy consciente de que mi camino apenas empieza, en esta nueva etapa de autodescubrimiento y un nuevo mundo lleno de infinitas posibilidades.",
          "Y si hay alguien aquí leyendo esto, te doy la bienvenida al principio de mi nueva historia como CONCEPT ARTIST."
        ]
      }
    ]
  }
];

// =====================
// BLOG PRINCIPAL
// =====================
const blogGrid = document.getElementById("blog-posts");

if(blogGrid){
  posts.forEach((post, index) => {
    const card = document.createElement("div");
    card.classList.add("blog-card");
    const postId = post.id;
    card.innerHTML = `
      <a href="post.html?id=${postId}">
        <img src="${post.image}" alt="${post.title}">
      </a>
      <div class="blog-card-content">
        <h2>${post.title}</h2>
        <span class="blog-date">${post.date}</span>
        <p>${post.excerpt}</p>
        <a href="post.html?id=${postId}" class="read-more">Leer más</a>

        <div class="share-buttons">
          <a class="share-btn fb" target="_blank">Facebook</a>
          <a class="share-btn tw" target="_blank">X</a>
          <a class="share-btn wa" target="_blank">WhatsApp</a>
          <a class="share-btn li" target="_blank">LinkedIn</a>
          <button class="share-btn copy">Copiar link</button>
        </div>

      </div>
    `;
    blogGrid.appendChild(card);
  });
}

// =====================
// POST INDIVIDUAL
// =====================
const postTitleEl = document.getElementById('post-title');
const postDateEl = document.getElementById('post-date');
const postContentEl = document.getElementById('post-content');

if(postTitleEl && postDateEl && postContentEl){
  const params = new URLSearchParams(window.location.search);
  const postId = parseInt(params.get('id'));
  const post = posts.find(p => p.id === postId);

  if(post){
    postTitleEl.textContent = post.title;
    postDateEl.textContent = post.date;

    post.content.forEach(item => {
      if(item.type === "text"){
        if(Array.isArray(item.value)){
          item.value.forEach(pText => {
            const p = document.createElement("p");
            p.textContent = pText;
            postContentEl.appendChild(p);
          });
        } else {
          const p = document.createElement("p");
          p.textContent = item.value;
          postContentEl.appendChild(p);
        }
      } else if(item.type === "image"){
        const img = document.createElement("img");
        img.src = item.value;
        img.style.width = "100%";
        img.style.borderRadius = "12px";
        img.style.margin = "20px 0";
        postContentEl.appendChild(img);
      }
    });

    // Agregar sección de compartir al final del post
    const shareDiv = document.createElement("div");
    shareDiv.classList.add("share-buttons");
    shareDiv.style.marginTop = "20px";
    shareDiv.innerHTML = `
      <a class="share-btn fb" target="_blank">Facebook</a>
      <a class="share-btn tw" target="_blank">X</a>
      <a class="share-btn wa" target="_blank">WhatsApp</a>
      <a class="share-btn li" target="_blank">LinkedIn</a>
      <button class="share-btn copy">Copiar link</button>
    `;
    postContentEl.appendChild(shareDiv);
  }
}

// =====================
// FUNCIONALIDAD BOTONES COMPARTIR
// =====================
document.addEventListener("DOMContentLoaded", function () {
  const currentUrl = window.location.href;
  const title = document.title;

  document.querySelectorAll(".share-btn.fb").forEach(btn => {
    btn.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
  });

  document.querySelectorAll(".share-btn.tw").forEach(btn => {
    btn.href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(title)}`;
  });

  document.querySelectorAll(".share-btn.wa").forEach(btn => {
    btn.href = `https://wa.me/?text=${encodeURIComponent(title + " " + currentUrl)}`;
  });

  document.querySelectorAll(".share-btn.li").forEach(btn => {
    btn.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
  });

  document.querySelectorAll(".share-btn.copy").forEach(btn => {
    btn.addEventListener("click", () => {
      navigator.clipboard.writeText(currentUrl);
      alert("Enlace copiado ✅");
    });
  });
});
