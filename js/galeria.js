const gallery = document.getElementById('gallery');

const images = [
  {
    src: "images/Galeria/NesArt/BILLCYPHER.jpg",
    title: "Obra 1"
  },
  {
    src: "images/Galeria/Comisiones/CATANDFISH.jpg",
    title: "Obra 2"
  },
  {
    src: "images/Galeria/Originales/CRANHELADO.jpg",
    title: "Obra 3"
  }
];

images.forEach(item => {
  const figure = document.createElement('figure');
  figure.innerHTML = `
    <img src="${item.src}" alt="${item.title}">
    <figcaption>${item.title}</figcaption>
  `;
  gallery.appendChild(figure);
});

