const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

let fecha = null;
let hora = null;

async function cargarFunciones() {
    try {
        console.log(movieId)
        const response = await fetch(`/funciones/${movieId}`);
        const data = await response.json();

        if (!data.ok) {
            console.error(data.mensaje);
            alert(data.mensaje);
            window.location.href = '/';
            return;
        }

        const nombrePelicula = document.getElementById('nombrePelicula');
        const clasificacion = document.getElementById('clasificacionPelicula');
        const duracion = document.getElementById('duracionPelicula');

        if (response.ok) {

            console.log(data.info);
            const hoy = new Date();
            hoy.setMinutes(hoy.getMinutes() + 15); // Suma 15 minutos

            const yyyy = hoy.getFullYear();
            const mm = String(hoy.getMonth() + 1).padStart(2, '0');
            const dd = String(hoy.getDate()).padStart(2, '0');
            const fechaHoyISO = `${yyyy}-${mm}-${dd}`;

            const funcionesDeHoy = data.funciones.filter(funcion => {
                const fechaFuncionISO = funcion.fecha.split('T')[0];
                const fechaHoraFuncion = new Date(`${fechaFuncionISO}T${funcion.hora}`);

                // Solo funciones de hoy y después de la hora actual + 15 min
                return fechaFuncionISO === fechaHoyISO && fechaHoraFuncion >= hoy;
            });


            funcionesDeHoy.sort((a, b) => {
                const fechaHoraA = new Date(`${a.fecha.split('T')[0]}T${a.hora}`);
                const fechaHoraB = new Date(`${b.fecha.split('T')[0]}T${b.hora}`);
                return fechaHoraA - fechaHoraB;
            });

            if (funcionesDeHoy.length === 0) {
                alert("No hay funciones disponibles para hoy.");
                window.location.href = '/trabajador/funciones';
                return;
            }

            nombrePelicula.innerText = data.info.nombre;
            clasificacion.innerText = "Clasificación: " + data.info.clasificacion;
            duracion.innerText = "Duración: " + data.info.duracion + " min";

            const funcionesPorFecha = agruparFuncionesPorFecha(funcionesDeHoy);
            const diasContenedor = document.getElementById('diasContenedor');
            diasContenedor.innerHTML = "";

            Object.entries(funcionesPorFecha).forEach(([fechaISO, funcionesDelDia]) => {
                const fechaFormateada = formatFecha(fechaISO);
                const diaBtn = document.createElement('button');
                diaBtn.classList.add('day-button', 'selected');
                diaBtn.innerHTML = `
                    <div class="day">
                        <div class="nameDay">${fechaFormateada.diaSemana}</div>
                        <div class="numberDay">${fechaFormateada.fecha}</div>
                    </div>
                `;
                diasContenedor.appendChild(diaBtn);
                mostrarHoras(funcionesDelDia); // mostrar automáticamente
            });
        }
    } catch (error) {
        console.error('Error al cargar las funciones de la película:', error);
    }
}

function agruparFuncionesPorFecha(funciones) {
    const funcionesPorFecha = {};
    funciones.forEach(funcion => {
        const fechaISO = funcion.fecha.split('T')[0];
        if (!funcionesPorFecha[fechaISO]) {
            funcionesPorFecha[fechaISO] = [];
        }
        funcionesPorFecha[fechaISO].push(funcion);
    });
    return funcionesPorFecha;
}

function mostrarHoras(funcionesDelDia) {
    const horasContenedor = document.querySelector('.hours-container');
    horasContenedor.innerHTML = "";

    funcionesDelDia.forEach(funcion => {
        const horaStr = funcion.hora.slice(0, 5);
        const tipoSala = funcion.tipo_sala;
        const color = obtenerColorSala(tipoSala);

        const div = document.createElement('div');
        div.classList.add('hour');
        div.style.backgroundColor = color;

        div.innerHTML = `
            <div class="hour-time">${formatearHora12h(horaStr)}</div>
            <div class="hour-type">${tipoSala}</div>
        `;

        horasContenedor.appendChild(div);

        div.addEventListener('click', () => {
            document.querySelectorAll('.hour').forEach(h => h.classList.remove('selected'));
            div.classList.add('selected');

            idFuncion = funcion.ID_funcion;
            tituloPelicula = funcion.titulo;
            generoPelicula = funcion.genero;
            clasificacionPelicula = funcion.clasificacion;
            numSalaPelicula = funcion.Num_sala;
            precio = funcion.precio;
            fecha = funcion.fecha.split('T')[0];
            hora = funcion.hora;
            document.getElementById("infoSala").classList.remove("noshow");
            const fechaFormateada = formatFecha(funcion.fecha.split('T')[0]);
            document.getElementById("dia").innerHTML = `<strong>Día:</strong> ${fechaFormateada.diaSemana} - ${fechaFormateada.fecha}`;
            document.getElementById("hora").innerHTML = `<strong>Hora:</strong> ${formatearHora12h(horaStr)}`;
            document.getElementById("sala").innerHTML = `<strong>Sala:</strong> ${funcion.Num_sala} - ${tipoSala}`;
            document.getElementById("precioSala").innerHTML = `<strong>Precio (Subtotal):</strong> $${funcion.precio}`;
            document.getElementById("comprar").disabled = false;
        });
    });
}

function formatFecha(fechaISO) {
    const [año, mes, dia] = fechaISO.split('-');
    const fecha = new Date(`${año}-${mes}-${dia}T12:00:00`);
    const diasSemana = ["DOMINGO", "LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"];
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    const diaSemana = diasSemana[fecha.getDay()];
    return {
        diaSemana: diaSemana,
        fecha: `${parseInt(dia)} de ${meses[parseInt(mes) - 1]}`
    };
}

function obtenerColorSala(tipo) {
    switch (tipo.toLowerCase()) {
        case '3d': return '#ff5722';
        case 'vip': return '#4caf50';
        case '4dx': return '#2196f3';
        case 'tradicional': return '#9e9e9e';
        default: return '#607d8b';
    }
}

function formatearHora12h(hora24) {
    const [h, m] = hora24.split(':');
    let hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${m}${ampm}`;
}

let idFuncion;
let tituloPelicula;
let generoPelicula;
let clasificacionPelicula;
let numSalaPelicula;
let precio;

document.getElementById("comprar").addEventListener("click", async function () {
    if (!idFuncion) {
        alert("Por favor, selecciona una función antes de continuar.");
        return;
    }
    const infoCompra = {
        id: idFuncion,
        titulo: tituloPelicula,
        genero: generoPelicula,
        clasificacion: clasificacionPelicula,
        num_sala: numSalaPelicula,
        precio,
        fecha,
        hora
    };
    console.log(infoCompra);

    await fetch('/compra/seleccionar-funcion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(infoCompra)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.ok) {
                window.location.href = "/trabajador/compra/seleccionar-asientos";
            }
            document.getElementById("comprar").disabled = false;
        });
});

window.onload = cargarFunciones;
