function startPage() {
  // ==================== SLIDER DE PROMOCIONES ====================
  const slides = [
    {
      image: "../images/promos/promoOmar.webp",
      title: "¡LA VENIDA DE OMAR!",
      description: "Lo más esperado por los fans de Omar.",
      actionText: "Próximamente...",
      link: "https://diariodelyaqui.mx/ciudadobregon/tras-la-venida-de-omar-garcia-harfuch-esta-sera-la-estrategia-para-atacar-la-violencia-en-cajeme/92629"
    },
    {
      image: "../images/promos/promoHector.webp",
      title: "OMG ES HECTOR",
      description: "¡No te lo puedes perder!",
      actionText: "Realmente el botón no hace nada",
      link: "https://www.acm.org"
    },
    {
      image: "../images/promos/promoFansOmar.webp",
      title: "SI SON LOS FANS DE OMAR",
      description: "¡SI TE LO PUEDES PERDER!",
      actionText: "Realmente el botón sigue sin hacer nada",
      link: "https://www.fansdeomar.com"
    },
    {
      image: "../images/promos/omarVsSinicoPromo.webp",
      title: "¡OMAR VS SINICO!",
      description: "Finalmente se enfrentan en la pantalla grande.",
      actionText: "Sigue la historia",
      link: "https://www.youtube.com/watch?v=c0T_DHeMYo0"
    },
    {
      image: "../images/promos/promoFans.webp",
      title: "DE LA SAGA DE FANS DE OMAR",
      description: "La saga continúa con un nuevo capítulo.",
      actionText: "Próximamente",
      link: "https://www.youtube.com/watch?v=EhVB22S1Zqk"
    },
    {
      image: "../images/promos/Sugey.webp",
      title: "???",
      description: "¿¿¿???",
      actionText: "¿?",
      link: "https://cat-bounce.com"
    },
    {
      image: "../images/promos/Si.webp",
      title: "MIRA ESTOS",
      description: "Estos reprueban como toros, sin usar pastillas",
      actionText: "Descubre como...",
      link: "https://www.thisman.org"
    },
    {
      image: "../images/promos/Denuncia.jpg",
      title: "ALERTA",
      description: "Favor de denunciar",
      actionText: "Denunciar",
      link: "https://denuncia.org/denuncia-digital"
    }
  ];

  let currentSlide = 0;
  let slideInterval;

  const slideImage = document.querySelector(".imgSlide img");
  const slideTitle = document.querySelector(".titleSlide");
  const slideDesc = document.querySelector(".descSlide");
  const slideAction = document.querySelector(".actionSlide");
  const slideImagenL = document.querySelector(".imgSlide");

  function renderSlide(index) {
    const slide = slides[index];

    slideImage.classList.add("fade-out");

    const infoSlide = document.querySelector(".infoSlide");

    setTimeout(() => {
      slideImage.src = slide.image;
      slideTitle.textContent = slide.title;
      slideTitle.setAttribute('title', slide.title.trim());
      slideDesc.textContent = slide.description;
      slideAction.textContent = slide.actionText;
      slideAction.href = slide.link;
      slideImagenL.href = slide.link;
      

      slideImage.classList.remove("fade-out");
      slideImage.classList.remove("slide-anim");
      void slideImage.offsetWidth;
      slideImage.classList.add("slide-anim");

      infoSlide.classList.remove("info-anim");
      void infoSlide.offsetWidth;
      infoSlide.classList.add("info-anim");
    }, 10);
  }


  function startSlideInterval() {
    slideInterval = setInterval(() => {
      currentSlide = (currentSlide + 1) % slides.length;
      renderSlide(currentSlide);
    }, 10000);
  }

  document.querySelector(".prev").addEventListener("click", () => {
    clearInterval(slideInterval);
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    renderSlide(currentSlide);
    startSlideInterval();
  });

  document.querySelector(".next").addEventListener("click", () => {
    clearInterval(slideInterval); 
    currentSlide = (currentSlide + 1) % slides.length;
    renderSlide(currentSlide);
    startSlideInterval();
  });

  startSlideInterval();
  renderSlide(currentSlide);



  // ==================== PELÍCULAS DINÁMICAS ====================
  const moviesContainer = document.querySelector(".movies-container");
  const searchInput = document.getElementById("movieSearch");
  const genreFilter = document.getElementById("genreFilter");

  async function loadMovies() {
    try {
      const response = await fetch('/peliculasCartelera');
      const data = await response.json();

      console.log(data);

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
            <img src="${image}" alt="${movie.titulo}" loading="lazy" onerror="this.onerror=null; this.src='../images/other/imageNotFound.webp';">
          </a>
          <div class="infoMovie">
            <div class="clasificacion">${movie.clasificacion}</div>
            <div class="nameMovie">${movie.titulo}</div>
            <div class="duracion">${movie.duracion_min} min</div>
          </div>
        `;

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

        moviesContainer.classList.add("fade");
        void moviesContainer.offsetWidth; 
        moviesContainer.classList.remove("fade");

        renderMovies(filtered);
      }

      searchInput.addEventListener("input", applyFilters);
      genreFilter.addEventListener("change", applyFilters);

      renderMovies(data.peliculas);
    } catch (error) {
      console.error('Error al cargar las películas:', error);
    }
  }

  // Llama la función para cargar películas al inicio
  loadMovies();
}


async function verificarServidor(intento = 1) {
  try {
    const response = await fetch("/peliculasCartelera");
    if (!response.ok) throw new Error("Respuesta no OK");
    const data = await response.json();
    if (!data.ok) throw new Error("Datos no válidos");
    console.log("Backend disponible.");
    startPage();
  } catch (error) {
    console.warn(`⚠️ Intento ${intento} fallido: backend aún no disponible.`);
    if (intento < 1) {
      setTimeout(() => verificarServidor(intento + 1), 1000);
    } else {
      console.warn("🔄 Recargando página para reintentar backend...");
      location.reload();
    }
  }
}

verificarServidor();