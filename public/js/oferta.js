import {
    soloNumeros
} from './validaciones.js';

document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('form-oferta');
    const trabajadorSelect = document.getElementById('trabajador-id');
    const mensajeDiv = document.getElementById('mensaje');

    // Función para cargar los trabajadores desde el backend
    const cargarTrabajadores = async () => {
        const trabajadorSelect = document.getElementById('trabajador-id');
        const hoy = new Date().toLocaleDateString('en-CA');
    
        try {
            const response = await fetch('/trabajador/supervisores');
            const trabajadores = await response.json();
            console.log(trabajadores);
            trabajadores.supervisores
                .filter(trabajador => {
                    const fechaTrabajador = trabajador.fecha.split('T')[0]; // Obtener solo la fecha (sin la hora)
                    console.log(fechaTrabajador, hoy);
                    return fechaTrabajador === hoy; // Comparar si la fecha del trabajador es la de hoy
                })
                .forEach(trabajador => {
                    const option = document.createElement('option');
                    option.value = trabajador.id;
                    option.textContent = `${trabajador.id} - ${trabajador.nombre} ${trabajador.apellido}`;
                    trabajadorSelect.appendChild(option);
                });
        } catch (error) {
            console.error('Error al cargar trabajadores:', error);
        }
    };

    // Validación del formulario antes de enviarlo
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const folio = document.getElementById('folio').value.trim();
        const tipo = document.getElementById('tipo').value;
        const idTrabajador = trabajadorSelect.value;
        const contraseña = document.getElementById('password').value;

        if (!folio || !tipo || !idTrabajador || !contraseña) {
            mostrarMensaje('Por favor, completa todos los campos.', true);
            return;
        }

        if (!soloNumeros(folio)) {
            mostrarMensaje('Folio no valido', true);
            return;
        }

        if(idTrabajador == 0){
            mostrarMensaje('Selecciona un trabajador', true);
            return;
        }

        const datosOferta = {
            folio,
            tipo,
            id_trab: idTrabajador,
            contra: contraseña
        };

        console.log('Datos de la oferta:', datosOferta);

        fetch('/trabajador/registrarOferta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosOferta)
        })
            .then(response => response.json())
            .then(result => {
                if (result.ok) {
                    mostrarMensaje('Oferta registrada con éxito.');
                    form.reset();
                } else {
                    mostrarMensaje(result.mensaje, true);
                }
            })
            .catch(error => {
                console.error('Error al registrar oferta:', error);
                mostrarMensaje('Error al registrar oferta.', true);
            });
    });

    // Función para mostrar mensajes de éxito o error
    const mostrarMensaje = (msg, esError = false) => {
        mensajeDiv.textContent = msg;
        mensajeDiv.style.color = esError ? 'red' : 'green';
    };

    // Inicializar carga de trabajadores
    cargarTrabajadores();
});
