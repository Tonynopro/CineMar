import {
    validarHoraFuncion,
    validarFechaFuncion
} from './validaciones.js';

const mensajeDiv = document.getElementById('mensaje');

document.addEventListener('DOMContentLoaded', () => {
    const peliculaSelect = document.getElementById('pelicula');
    const salaSelect = document.getElementById('sala');
    const form = document.getElementById('form-funcion');

    // Cargar películas
    fetch('/admin/peliculas')
        .then(res => res.json())
        .then(peliculas => {
            console.log(peliculas);
            peliculas.peliculas.forEach(p => {
                const option = document.createElement('option');
                option.value = p.ID_pelicula;
                option.textContent = p.titulo;
                peliculaSelect.appendChild(option);
            });
        })
        .catch(err => console.error('Error cargando películas:', err));

    // Cargar salas
    fetch('/admin/salas')
        .then(res => res.json())
        .then(salas => {
            salas.salas.forEach(s => {
                const option = document.createElement('option');
                option.value = s.Num_sala;
                option.textContent = `Sala ${s.Num_sala} - ${s.tipo_sala}`;
                salaSelect.appendChild(option);
            });
        })
        .catch(err => console.error('Error cargando salas:', err));

    // Enviar formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const hora = document.getElementById('hora').value;
        const dia = document.getElementById('dia').value;
        let valid = true;
        let mensaje = '';

        if (!validarHoraFuncion(hora)) {
            valid = false;
            mensaje = 'La hora no es valida.';
        } else if (!validarFechaFuncion(dia)) {
            valid = false;
            mensaje = 'La fecha no es válida.';
        }

        if (!valid) {
            ponerMensaje(mensaje);
            return;
        }

        const datos = {
            ID_pelicula: peliculaSelect.value,
            Num_sala: salaSelect.value,
            dia,
            hora
        };

        fetch('/admin/registrar-funcion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        })
            .then(res => res.json())
            .then(result => {
                if (result.ok) {
                    ponerMensaje('Función registrada con éxito', 'green');
                    form.reset(); // Limpiar el formulario
                } else {
                    ponerMensaje(result.mensaje || 'Error desconocido');
                }
            })
            .catch(err => {
                ponerMensaje('Error al registrar la función');
                console.error(err);
            });
    });
});

function ponerMensaje(mensaje, color = "red") {
    mensajeDiv.textContent = mensaje;
    mensajeDiv.style.color = color;
    mensajeDiv.classList.remove("fade-out");
    void mensajeDiv.offsetWidth;
    mensajeDiv.classList.add("fade-out");
}
