// ==================== SLIDER DE PROMOCIONES ====================
const slides = [
  {
    image: "../images/promos/promoOmar.webp",
    title: "¡LA VENIDA DE OMAR!",
    description: "Lo más esperado por los fans de Omar.",
    actionText: "Próximamente...",
    link: "#promo1"
  },
  {
    image: "../images/promos/promoHector.webp",
    title: "OMG ES HECTOR",
    description: "¡No te lo puedes perder!",
    actionText: "Realmente el botón no hace nada",
    link: "#promo2"
  },
  {
    image: "../images/promos/promoFansOmar.webp",
    title: "SI SON LOS FANS DE OMAR",
    description: "¡SI TE LO PUEDES PERDER!",
    actionText: "Realmente el botón sigue sin hacer nada",
    link: "#promo3"
  },
  {
    image: "../images/promos/omarVsSinicoPromo.webp",
    title: "¡OMAR VS SINICO!",
    description: "Finalmente se enfrentan en la pantalla grande.",
    actionText: "Sigue la historia",
    link: "#promo4"
  },
  {
    image: "../images/promos/promoFans.webp",
    title: "DE LA SAGA DE FANS DE OMAR",
    description: "La saga continúa con un nuevo capítulo.",
    actionText: "Próximamente",
    link: "#promo5"
  }
];

let currentSlide = 0;
let slideInterval;

// Elementos del slider
const slideImage = document.querySelector(".imgSlide img");
const slideTitle = document.querySelector(".titleSlide");
const slideDesc = document.querySelector(".descSlide");
const slideAction = document.querySelector(".actionSlide");

// Inicializa el slider
function renderSlide(index) {
  const slide = slides[index];

  // Aplica la clase de fade-out solo a la imagen
  slideImage.classList.add("fade-out");

  // También preparamos el cuadro de info para reiniciar animación
  const infoSlide = document.querySelector(".infoSlide");

  setTimeout(() => {
    slideImage.src = slide.image;
    slideTitle.textContent = slide.title;
    slideTitle.setAttribute('title', slide.title.trim());
    slideDesc.textContent = slide.description;
    slideAction.textContent = slide.actionText;
    slideAction.href = slide.link;

    // Reinicia animación imagen
    slideImage.classList.remove("fade-out");
    slideImage.classList.remove("slide-anim");
    void slideImage.offsetWidth;
    slideImage.classList.add("slide-anim");

    // Reinicia animación del cuadro negro (infoSlide)
    infoSlide.classList.remove("info-anim");
    void infoSlide.offsetWidth;
    infoSlide.classList.add("info-anim");
  }, 10);
}


function startSlideInterval() {
  slideInterval = setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    renderSlide(currentSlide);
  }, 10000); // Intervalo entre cambios de slide
}

document.querySelector(".prev").addEventListener("click", () => {
  clearInterval(slideInterval); // Detener el intervalo al cambiar de slide
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  renderSlide(currentSlide);
  startSlideInterval(); // Reiniciar el intervalo
});

document.querySelector(".next").addEventListener("click", () => {
  clearInterval(slideInterval); // Detener el intervalo al cambiar de slide
  currentSlide = (currentSlide + 1) % slides.length;
  renderSlide(currentSlide);
  startSlideInterval(); // Reiniciar el intervalo
});

// Iniciar intervalo al cargar la página
startSlideInterval();
renderSlide(currentSlide);



// ==================== PELÍCULAS DINÁMICAS ====================
const moviesContainer = document.querySelector(".movies-container");
const searchInput = document.getElementById("movieSearch");
const genreFilter = document.getElementById("genreFilter");

// Función para cargar las películas desde el backend
async function loadMovies() {
  try {
    const response = await fetch('/peliculasCartelera');
    const data = await response.json();

    console.log(data);

    // Poner los generos de las peliculas
    genreFilter.innerHTML = `
      <option value="">Selecciona un género</option>
      ${Array.from(new Set(data.peliculas.map(movie => movie.genero))).map(genre => `
        <option value="${genre}">${genre}</option>
      `).join("")}
    `;

    function renderMovies(filteredMovies) {
      moviesContainer.innerHTML = "";


      filteredMovies.forEach(movie => {
        let img = movie.imagen;
        // Cambiar la extension de cual sea a la imagen a webp
        if (img.endsWith('.jpg') || img.endsWith('.jpeg')) {
          img = img.replace(/\.jpe?g$/, '.webp');
        } else if (img.endsWith('.png')) {
          img = img.replace(/\.png$/, '.webp');
        }
        const image = "../images/peliculas/" + img;
        const movieDiv = document.createElement("div");
        movieDiv.classList.add("movie");

        movieDiv.innerHTML = `
          <a href="/info?id=${movie.ID_pelicula}" class="imageMovie">
            <img src="${image}" alt="${movie.titulo}" loading="lazy">
          </a>
          <div class="infoMovie">
            <div class="clasificacion">${movie.clasificacion}</div>
            <div class="nameMovie">${movie.titulo}</div>
            <div class="duracion">${movie.duracion_min} min</div>
          </div>
        `;

        // Animación al pasar el mouse sobre la película
        movieDiv.addEventListener("mouseenter", () => {
          movieDiv.style.transform = "scale(1.05)";
          movieDiv.style.transition = "transform 0.3s ease-in-out";
        });

        movieDiv.addEventListener("mouseleave", () => {
          movieDiv.style.transform = "scale(1)";
        });

        moviesContainer.appendChild(movieDiv);
      });
    }

    function applyFilters() {
      const searchTerm = searchInput.value.toLowerCase();
      const selectedGenre = genreFilter.value;

      const filtered = data.peliculas.filter(movie => {
        const matchesName = movie.titulo.toLowerCase().includes(searchTerm);
        const matchesGenre = selectedGenre === "" || movie.genero === selectedGenre;
        return matchesName && matchesGenre;
      });

      // Agregamos un efecto de fade-in al renderizar las películas
      moviesContainer.classList.add("fade");
      void moviesContainer.offsetWidth; // Reflow
      moviesContainer.classList.remove("fade");

      renderMovies(filtered);
    }

    searchInput.addEventListener("input", applyFilters);
    genreFilter.addEventListener("change", applyFilters);

    renderMovies(data.peliculas); // Renderiza todas las películas
  } catch (error) {
    console.error('Error al cargar las películas:', error);
  }
}

// Llama la función para cargar películas al inicio
loadMovies();