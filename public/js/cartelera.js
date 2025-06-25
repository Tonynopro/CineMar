document.addEventListener("DOMContentLoaded", () => {
    const moviesContainer = document.querySelector(".movies-container");
  
    async function loadMovies() {
      try {
        const response = await fetch('/peliculasHoy');
        const data = await response.json();

        if(data.ok === false) {
          moviesContainer.innerHTML = "<p class='error-message'>No hay películas disponibles.</p>";
          return;
        }
  
        renderMovies(data.peliculas);
      } catch (error) {
        console.error('Error al cargar las películas:', error);
        moviesContainer.innerHTML = "<p>Error al cargar la cartelera.</p>";
      }
    }
  
    function renderMovies(movies) {
      moviesContainer.innerHTML = "";
  
      movies.forEach(movie => {
        const image = "../images/peliculas/" + movie.imagen;
        const movieDiv = document.createElement("div");
        movieDiv.classList.add("movie");
  
        movieDiv.innerHTML = `
          <a href="/trabajador/horarios?id=${movie.ID_pelicula}" class="imageMovie">
            <img src="${image}" alt="${movie.titulo}">
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
  
    loadMovies();
  });
  