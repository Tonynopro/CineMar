import {
    validarFechaTurno
} from './validaciones.js';

let pusoSala = false;

document.addEventListener('DOMContentLoaded', () => {

    const selectTrabajador = document.getElementById('trabajador');

    fetch('/admin/trabajadores')
        .then(res => res.json())
        .then(data => {
            console.log(data);
            data.trabajadores.forEach(trabajador => {
                console.log(trabajador);
                const option = document.createElement('option');
                option.value = trabajador.ID_trabajador;
                option.textContent = `${trabajador.ID_trabajador} - ${trabajador.nombre} ${trabajador.apellido}`;
                selectTrabajador.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error al cargar los trabajadores:', error);
        });

    fetch('/admin/roles') 
        .then(res => res.json())
        .then(data => {
            console.log(data);
            const selectRol = document.getElementById('rol');
            data.roles.forEach(rol => {
                const option = document.createElement('option');
                option.value = rol.ID_rol;
                option.textContent = rol.nombre_rol;
                selectRol.appendChild(option);
            });
            verificarRol();
        })
        .catch(error => {
            console.error('Error al cargar los roles:', error);
        });

    fetch('/admin/salas')
        .then(res => res.json())
        .then(data => {
            console.log(data);
            const selectSala = document.getElementById('sala');
            data.salas.forEach(sala => {
                const option = document.createElement('option');
                option.value = sala.Num_sala;
                option.textContent = `Sala ${sala.Num_sala} (${sala.tipo_sala})`;
                selectSala.appendChild(option);
            });
        })

    const form = document.getElementById('form-turno');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const trabajador = document.getElementById('trabajador').value;
        const rol = document.getElementById('rol').value;
        const fecha = document.getElementById('turno-dia').value;
        const sala = document.getElementById('sala') ? document.getElementById('sala').value : null;

        let valid = true;
        let mensaje = '';
        const mensajeDiv = document.getElementById('mensaje');

        if (!validarFechaTurno(fecha)) {
            valid = false;
            mensaje = 'Fecha no valida.';
        }

        if (!valid) {
            mensajeDiv.textContent = mensaje;
            mensajeDiv.style.color = 'red';
            mensajeDiv.classList.remove("fade-out");
            void mensajeDiv.offsetWidth;
            mensajeDiv.classList.add("fade-out");
            return;
        }

        const datosTurno = {
            fecha,
            trabajador,
            rol
        };

        fetch('/admin/asignar', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosTurno)
        })
            .then(response => response.json())
            .then(async result => {
                if (result.ok) {
                    let mes = "";
                    // Si la sala es diferente de null, se asigna la sala al turno
                    if (pusoSala) {
                        const datosSala = {
                            fecha,
                            trabajador,
                            rol,
                            sala
                        };

                        try {
                            const resSala = await fetch('/admin/asignar/sala', { 
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(datosSala)
                            });
                            const resSalaData = await resSala.json();
                            mes += resSalaData.ok ? resSalaData.mensaje : resSalaData.mensaje || 'Error en sala';
                            mes += "\n";
                        } catch (error) {
                            console.error('Error en asignación de sala:', error);
                            mes += error.message || 'Error desconocido' + "\n";
                        }
                    }
                    mes += result.mensaje;
                    mensajeDiv.textContent = mes
                    mensajeDiv.style.color = 'green';
                    mensajeDiv.classList.remove("fade-out");
                    void mensajeDiv.offsetWidth;
                    mensajeDiv.classList.add("fade-out");
                } else {
                    mensajeDiv.textContent = result.mensaje || 'Error desconocido';
                    mensajeDiv.style.color = 'red';
                    mensajeDiv.classList.remove("fade-out");
                    void mensajeDiv.offsetWidth;
                    mensajeDiv.classList.add("fade-out");
                }
            })
            .catch(error => {
                console.error('Error en la conexión:', error);
                mensajeDiv.textContent = error.message || 'Error desconocido';
                mensajeDiv.style.color = 'red';
                mensajeDiv.classList.remove("fade-out");
                void mensajeDiv.offsetWidth;
                mensajeDiv.classList.add("fade-out");
            });
    });

});

document.getElementById('rol').addEventListener('change', verificarRol);

function verificarRol() {
    const selectRol = document.getElementById('rol');
    const datosEncargado = document.getElementById('datos-encargado');
    if (selectRol.value === '301') {
        datosEncargado.style.display = 'block';
        pusoSala = true;
    } else {
        datosEncargado.style.display = 'none';
        pusoSala = false;
    }
}