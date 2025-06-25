const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id'); // Obtener el ID de la película desde la URL

async function loadMovieDetails() {
    document.getElementById("btnHorario").href = `/horarios?id=${movieId}`;
    try {
        // Obtener la información de la película
        const response = await fetch(`/infoPelicula/${movieId}`);
        const data = await response.json();

        if (response.ok) {

            const pelicula = data.pelicula;

            // Insertar los datos de la película en los elementos correspondientes
            document.getElementById('movie-image').src = `../images/peliculas/${pelicula.imagen}`;  // Asegúrate de que la imagen esté en el path correcto
            document.getElementById('movie-title').innerText = pelicula.titulo;
            document.getElementById('movie-description').innerText = pelicula.descripcion;
            document.getElementById('movie-rating').innerHTML = `<strong>Clasificación:</strong> ${pelicula.clasificacion}`;
            document.getElementById('movie-duration').innerHTML = `<strong>Duración:</strong> ${pelicula.duracion_min} min`;
            document.getElementById('movie-genre').innerHTML = `<strong>Género:</strong> ${pelicula.genero}`;
            document.getElementById('movie-director').innerHTML = `<strong>Director:</strong> ${pelicula.director}`;

            // Insertar actores dinámicamente
            const actorsContainer = document.getElementById('actors-container');
            data.actores.forEach(actor => {
                const actorDiv = document.createElement('div');
                actorDiv.classList.add('actor');

                const actorImg = document.createElement('img');
                actorImg.src = `../images/actores/${actor.imagen}`; // Asegúrate de que la imagen esté en el path correcto
                actorImg.alt = actor.nombre;
                actorDiv.appendChild(actorImg);

                const actorName = document.createElement('p');
                actorName.innerText = actor.nombre;
                actorDiv.appendChild(actorName);

                const actorCharacter = document.createElement('p');
                actorCharacter.innerText = `Personaje: ${actor.personaje}`;
                actorDiv.appendChild(actorCharacter);

                actorsContainer.appendChild(actorDiv);
            });
        } else {
            // Manejar el caso de error, si no se encontró la película
            console.error('Película no encontrada o error en la respuesta');
            window.location.href = '/tonto'; // Redirigir a la página principal o a otra página de error
        }
    } catch (error) {
        console.error('Error al cargar los detalles de la película:', error);
    }
}

async function checkFunctions() {
    try{
        const response = await fetch(`/funciones/${movieId}`);
        const data = await response.json();

        if (response.ok) {

            const funcionesFiltradas = data.funciones.filter(funcion => {
                const [fechaStr] = funcion.fecha.split('T'); // YYYY-MM-DD
                const fechaFuncion = new Date(`${fechaStr}T${funcion.hora}`); // Local time
                return fechaFuncion >= new Date();
            });

            funcionesFiltradas.sort((a, b) => {
                const [fechaStrA] = a.fecha.split('T');
                const [fechaStrB] = b.fecha.split('T');
                const fechaHoraA = new Date(`${fechaStrA}T${a.hora}`);
                const fechaHoraB = new Date(`${fechaStrB}T${b.hora}`);
                return fechaHoraA - fechaHoraB;
            });

            console.log(funcionesFiltradas);

            if (funcionesFiltradas.length === 0) {
                console.log('No hay funciones disponibles para esta película.');
                document.getElementById("btnHorario").classList.add("not-active");
            }
        }

    } catch (error) {
        console.error('Error al traer la informacion:', error);
    }
}

// Llamar a la función cuando se cargue la página
window.onload = async function() {
    await loadMovieDetails();
    await checkFunctions();
};
