const posts = [
  {
    id: 1, // ✅ agrega un id único
    title: "Proceso creativo: El camino para convertirme en Concept Artist",
    date: "12 Feb 2026",
    image: "images/Blog/.jpg",
    excerpt: "Un vistazo a cómo construyo y trabajo mis ilustraciones desde la idea hasta la obra final.",
    content: [
      { type: "image", value: "images/MrChipsy.jpg" },
      { type: "text", value: 
        "Estaréis de acuerdo conmigo cuando digo que está en la naturaleza humana expresarse a través de la ilustración."
        "Desde que nacemos y tenemos en nuestras manos una herramienta para dibujar, pintamos paredes, techos" 
        "y todo lo que esté a nuestro alcance."
        
        " He estado toda mi vida garabateando en papel, tratando de descubrir qué es lo que más me gustaba dentro"
        "de este maravilloso mundo, y es que hay tanto por aprender, que a veces se nos puede hacer todo un mundo."
        
        "Comencé con pequeños cómics inventados con curiosos protagonistas como: Danoninto, los Power ranger,"
        "pasando por mi época donde mezclaba Pokemons y hacía nuevas creaciones y dibujado al más puro estilo"
        "`Manga´, e incluso caricaturizado a mis profesores y famosos de los años 90."
      
        "Tras una larga ausencia de unos 20 años sin tocar un lapiz de forma seria, hace algo más de un par de años," 
        "decidí retomar la ilustración, al formarme como tatuador, adoptando un estilo Cartoon, mezclado"
        "con medieval y Grime Style, para posteriormente enfocarme por completo en un estilo Fleischer."
        
        { type: "image", value: "images/post1-extra2.jpg" },
        
        "Esto es lo que me llevó al punto donde estoy ahora. Meses y meses de creaciones apasionadas, de noches sin dormir,",
        "porque algo dentro de mí me pedía a gritos volver a mezclar ideas para crear nuevos personajes."

        "Y tras una mudanza, mucho investigar cada opción dentro del mundo de la ilustración y probar sin descanso,"
        "me di cuenta, que lo que me llena, es el Concept Art, el poder darle vida a personajes que no existen."

        "Soy consciente que mi camino apenas empieza, en esta nueva etapa de autodescubrimiento y un nuevo mundo"
        "lleno de infinitas posibilidades. Y si hay alguien aquí, leyendo esto, te doy la bienvenida al principio"
        "de mi nueva historia."

       "CONVERTIRME EN CONCEPTARTIST"},
    ]
  }
];

const blogGrid = document.getElementById("blog-posts");

posts.forEach((post, index) => {
  const card = document.createElement("div");
  card.classList.add("blog-card");
  const postId = index + 1; // genera id automáticamente
  card.innerHTML = `
    <a href="post.html?id=${postId}">
      <img src="${post.image}" alt="${post.title}">
    </a>
    <div class="blog-card-content">
      <h2>${post.title}</h2>
      <span class="blog-date">${post.date}</span>
      <p>${post.excerpt}</p>
      <a href="post.html?id=${postId}" class="read-more">Leer más</a>
    </div>
  `;
  blogGrid.appendChild(card);
});
;
