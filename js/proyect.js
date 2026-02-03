// Obtener id del proyecto de la URL
const params = new URLSearchParams(window.location.search);
const projectId = params.get('id');

const projects = {
  "CATANDFISH": {
    title: "Catan & Fish",
    description: "Breve descripción del proyecto...",
    images: ["CATANDFISH-1.jpg","CATANDFISH-2.jpg"]
  },
  "CRANHELADO": {
    title: "Cran Helado",
    description: "Breve explicación con mockups...",
    images: ["CRANHELADO-1.jpg","CRANHELADO-2.jpg"]
  },
  "BILLCYPHER": {
    title: "Bill Cypher",
    description: "Breve explicación del proyecto...",
    images: ["BILLCYPHER-1.jpg","BILLCYPHER-2.jpg"]
  }
};

// Renderizar proyecto
const titleEl = document.getElementById('project-title');
const descEl = document.getElementById('project-description');
const galleryEl = document.getElementById('project-mockups');

if(projects[projectId]) {
  const project = projects[projectId];
  titleEl.innerHTML = `<h1>${project.title}</h1>`;
  descEl.innerHTML = `<p>${project.description}</p>`;
  project.images.forEach(img => {
    const imgEl = document.createElement('img');
    imgEl.src = `images/Galeria/Nesart/${img}`;
    imgEl.alt = project.title;
    galleryEl.appendChild(imgEl);
  });
} else {
  titleEl.innerHTML = `<h1>Proyecto no encontrado</h1>`;
}
