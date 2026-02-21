// blog.js (versión completa y funcional con botones de compartir)

const posts = [
  {
    id: 1, // ✅ id único
    title: "El camino para convertirme en Concept Artist",
    date: "12 Feb 2026",
    image: "images/Blog/MrChipsy.jpg",
    excerpt: "Esto es lo que me llevó al punto donde estoy ahora. Meses y meses de creaciones apasionadas, de noches sin dormir.",
    content: [
      { 
        type: "image", 
        value: "images/Blog/MrChipsy.jpg"
      },
      { 
        type: "text", 
        value: [
          "Estaréis de acuerdo conmigo cuando os digo que está en la naturaleza humana expresarse a través de la ilustración.",
          "Desde que nacemos y tenemos en nuestras manos una herramienta para dibujar pintamos paredes, techos y todo lo que esté a nuestro alcance.",
          "Si echo la vista atrás, he estado toda mi vida garabateando en papel, tratando de descubrir qué es lo que más me gustaba dentro de esta maravillosa disciplina. Y es que hay tanto por aprender, que a veces se nos puede hacer todo un mundo.",
          "A los 2 o 3 años comencé con pequeños cómics inventados con curiosos protagonistas como: Danonino, los Power Ranger, para más tarde pasar por una época donde mezclaba Pokemons y hacía nuevas creaciones, más tarde dibujaba al más puro estilo Manga, e incluso llegué a caricaturizar a mis profesores y famosos de los años 90 y 2000."
        ] 
      },
      { 
        type: "image", 
        value: "images/Manga_Caricatura.jpg" 
      },
      { 
        type: "text", 
        value: [
          "Tras una larga ausencia de casi 20 años sin tocar un lápiz de forma seria, hace poco más de 730 días decidí retomar la ilustración al formarme como tatuador, adoptando un estilo Cartoon mezclado con medieval y Grime Style, para posteriormente enfocarme por completo en un estilo Fleischer.",
          "Esto es lo que me llevó al punto donde estoy ahora. Meses y meses de creaciones apasionadas, de noches sin dormir, porque algo dentro de mí me pedía a gritos volver a mezclar ideas para crear nuevos personajes."
        ] 
      },
      { 
        type: "image", 
        value: "images/Personajes.jpg" 
      },
      { 
        type: "text", 
        value: [
          "Y tras dejar atrás mi vida y cambiarme de ciudad, investigar cada opción dentro del mundo de la ilustración y probar sin descanso, me di cuenta de que lo que me llena es crear algo nuevo, el poder darle vida a personajes que no existen.",
          "Soy consciente de que mi camino apenas empieza, en esta nueva etapa de autodescubrimiento y un nuevo mundo lleno de infinitas posibilidades.",
          "Y si hay alguien aquí leyendo esto, te doy la bienvenida al principio de mi nueva historia como CONCEPT ARTIST."
        ] 
      }
    ]
  }
];

// =========================================
// Renderizar GRID de posts en Blog.html
// =========================================
const blogGrid = document.getElementById("blog-posts");

posts.forEach((post, index) => {
  const card = document.createElement("div");
  card.classList.add("blog-card");
  const postId = index + 1;

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

  // ==============================
  // Botones de compartir dinámicos
  // ==============================
  const currentUrl = `${window.location.origin}/post.html?id=${postId}`;
  const title = post.title;

  const fb = card.querySelector(".fb");
  const tw = card.querySelector(".tw");
  const wa = card.querySelector(".wa");
  const li = card.querySelector(".li");
  const copyBtn = card.querySelector(".copy");

  if (fb) fb.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
  if (tw) tw.href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(title)}`;
  if (wa) wa.href = `https://wa.me/?text=${encodeURIComponent(title + " " + currentUrl)}`;
  if (li) li.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
  if (copyBtn) copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(currentUrl);
    alert("Enlace copiado ✅");
  });
});

// =========================================
// Opcional: Renderizar post individual en post.html
// =========================================
if (document.body.classList.contains("post-container")) {
  const params = new URLSearchParams(window.location.search);
  const postId = parseInt(params.get("id"));
  const post = posts.find(p => p.id === postId);

  const titleEl = document.getElementById("post-title");
  const dateEl = document.getElementById("post-date");
  const contentEl = document.getElementById("post-content");

  if (post) {
    titleEl.textContent = post.title;
    dateEl.textContent = post.date;

    post.content.forEach(item => {
      if (item.type === "text") {
        if (Array.isArray(item.value)) {
          item.value.forEach(p => {
            const pEl = document.createElement("p");
            pEl.textContent = p;
            contentEl.appendChild(pEl);
          });
        } else {
          const pEl = document.createElement("p");
          pEl.textContent = item.value;
          contentEl.appendChild(pEl);
        }
      } else if (item.type === "image") {
        const img = document.createElement("img");
        img.src = item.value;
        img.style.width = "100%";
        img.style.borderRadius = "12px";
        img.style.margin = "20px 0";
        contentEl.appendChild(img);
      }
    });

    // Botones de compartir en post individual
    const shareContainer = document.createElement("div");
    shareContainer.classList.add("share-buttons");
    shareContainer.innerHTML = `
      <a class="share-btn fb" target="_blank">Facebook</a>
      <a class="share-btn tw" target="_blank">X</a>
      <a class="share-btn wa" target="_blank">WhatsApp</a>
      <a class="share-btn li" target="_blank">LinkedIn</a>
      <button class="share-btn copy">Copiar link</button>
    `;
    contentEl.appendChild(shareContainer);

    const currentUrl = window.location.href;

    const fb = shareContainer.querySelector(".fb");
    const tw = shareContainer.querySelector(".tw");
    const wa = shareContainer.querySelector(".wa");
    const li = shareContainer.querySelector(".li");
    const copyBtn = shareContainer.querySelector(".copy");

    if (fb) fb.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
    if (tw) tw.href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(post.title)}`;
    if (wa) wa.href = `https://wa.me/?text=${encodeURIComponent(post.title + " " + currentUrl)}`;
    if (li) li.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
    if (copyBtn) copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(currentUrl);
      alert("Enlace copiado ✅");
    });

  } else {
    contentEl.innerHTML = "<p style='color:red; font-weight:bold;'>Post no encontrado.</p>";
  }
}
