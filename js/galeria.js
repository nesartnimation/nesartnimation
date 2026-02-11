<script>
  const gallery = document.getElementById('nesart-gallery');

  const projects = [
    {
      id: "cat-and-fish",
      file: "CATANDFISH.jpg",
      title: "CAT & FISH",
      desc: "Proyecto creativo enfocado en el mundo animal."
    },
    {
      id: "cranhelado",
      file: "CRANHELADO.jpg",
      title: "CRANHELADO",
      desc: "Ilustración humor negro estilo rubberhose."
    },
    {
      id: "bill-cypher",
      file: "BILLCYPHER.jpg",
      title: "BILL CYPHER",
      desc: "Reinterpretación cartoon con estética 1930."
    },
 {
      id: "seong",
      file: "Seong.jpg",
      title: "SEONG GI HUN",
      desc: "Reinterpretación cartoon El juego del calamar con estética 1930."
    },
    {
      id: "wendigo",
      file: "Wendigo.jpg",
      title: "WENDIGO",
      desc: "Concept cartoon con estética 1930."
    },
    {
      id: "corvus",
      file: "Corvus.jpg",
      title: "CORVUS",
      desc: "Concept Cuervo cartoon con estética 1930."
    },
    {
      id: "horror-movie",
      file: "HorrorMovie.png",
      title: "HORROR MOVIE",
      desc: "Escena de terror."
    },
    {
      id: "sick-party",
      file: "SickParty.png",
      title: "SICK PARTY",
      desc: "Representación de una fiesta salida de control."
    },
    {
      id: "coffeenstein",
      file: "Coffeenstein.jpg",
      title: "COFFEENSTEIN",
      desc: "Para los amantes del café y el cine clásico."
    }
  ];

  projects.forEach(p => {
    const item = document.createElement('a');
    item.href = `proyecto.html?id=${p.id}`;
    item.className = 'nesart-masonry-item';
    item.innerHTML = `
      <img src="images/Galeria/Nesart/${p.file}" alt="${p.title}">
      <div class="nesart-overlay">
        <div class="nesart-overlay-text">
          <strong>${p.title}</strong>
          <span>${p.desc}</span>
        </div>
      </div>
    `;
    gallery.appendChild(item);
  });
</script>


