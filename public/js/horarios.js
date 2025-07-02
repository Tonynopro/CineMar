const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

let fecha = null;
let hora = null;

async function cargarFunciones() {
    try {
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
            console.log(data);
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
                alert("No hay funciones disponibles para esta película en este momento.");
                window.location.href = history.back();
                return;
            }

            const info = data.funciones[0];
            console.log(info);
            nombrePelicula.innerText = info.titulo;
            clasificacion.innerText = "Clasificación: " + info.clasificacion;
            duracion.innerText = "Duración: " + info.duracion + " min";

            const funcionesPorFecha = agruparFuncionesPorFecha(funcionesFiltradas);

            const diasContenedor = document.getElementById('diasContenedor');
            diasContenedor.innerHTML = "";

            Object.entries(funcionesPorFecha).forEach(([fechaISO, funcionesDelDia]) => {
                const fechaFormateada = formatFecha(fechaISO);
                const diaBtn = document.createElement('button');
                diaBtn.classList.add('day-button');
                diaBtn.innerHTML = `
                    <div class="day">
                        <div class="nameDay">${fechaFormateada.diaSemana}</div>
                        <div class="numberDay">${fechaFormateada.fecha}</div>
                    </div>
                `;
                diaBtn.addEventListener('click', () => mostrarHoras(funcionesDelDia));
                diasContenedor.appendChild(diaBtn);
            });

            document.querySelectorAll('#diasContenedor .day-button').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('#diasContenedor .day-button').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    document.getElementById("infoSala").classList.add("noshow");
                    document.getElementById("comprar").disabled = true;
                });
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
        const horaStr = funcion.hora.slice(0, 5); // formato HH:MM
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

            // Aquí puedes guardar el ID_funcion, si lo necesitas para el carrito
            idFuncion = funcion.ID_funcion;
            tituloPelicula = funcion.titulo;
            generoPelicula = funcion.genero;
            clasificacionPelicula = funcion.clasificacion;
            numSalaPelicula = funcion.Num_sala;
            precio = funcion.precio;
            fecha = funcion.fecha.split('T')[0];
            hora = funcion.hora;
            document.getElementById("infoSala").classList.remove("noshow")
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
    const fecha = new Date(`${año}-${mes}-${dia}T12:00:00`); // Fijamos hora media para evitar cambio de fecha
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
        default: return '#607d8b'; // gris azul
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

    if(!idFuncion) {
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
    .then(response => response.json()) // Parsear la respuesta JSON
    .then(data => {
        console.log(data);
        if(data.ok){
            window.location.href = "compra/seleccionar-asientos";
        }
        document.getElementById("comprar").disabled = false;
    });

    
});

// Iniciar carga al abrir la página
window.onload = cargarFunciones;
