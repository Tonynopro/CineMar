const seatMap = document.getElementById("seat-map");
const functionList = document.getElementById("function-list");

let ancho = 0;
let alto = 0;
let asientos = [];
let disponiblesSet = new Set();
let funciones = [];

async function obtenerSalaDelDia() {
  try {
    const response = await fetch('/trabajador/sala');
    const data = await response.json();

    if (data.ok) {
      sala = data.sala;
      console.log("Sala del día:", sala);
      obtenerFunciones(sala.Num_sala);
    } else {
      console.error(data.mensaje);
    }
  } catch (error) {
    console.error("Error al realizar la solicitud de sala:", error);
  }
}

async function obtenerFunciones(sala) {
  try {
    const response = await fetch(`/trabajador/funciones/${sala}`);
    const data = await response.json();

    if (data.ok) {
      funciones = data.funciones;  // Array de funciones con sus horarios
      console.log("Funciones del día:", funciones);
      mostrarFunciones();
    } else {
      console.error("Error al obtener las funciones del día.");
    }
  } catch (error) {
    console.error("Error al realizar la solicitud de funciones:", error);
  }
}

async function obtenerSala(salaObtenida) {
  console.log("Obteniendo sala:", salaObtenida.sala);
  try {
    const response = await fetch(`/trabajador/traerSala/${salaObtenida.sala}`);
    const data = await response.json();
    if (data.ok) {
      
      ancho = data.info.ancho;
      alto = data.info.alto;

      const sala = data.sala;
      asientos = sala.map(seat => ({
        x: seat.pos_x,
        y: seat.pos_y,
        fila: seat.fila,
        numero: seat.numero
      }));

      await obtenerDisponibles(salaObtenida.id);
      crearMapa();
    } else {
      console.error("Error al obtener la información de la sala.");
    }
  } catch (error) {
    console.error("Error al realizar la solicitud de sala:", error);
  }
}

async function obtenerDisponibles(funcion) {
  try {
    console.log("Obteniendo asientos disponibles para la función:", funcion);
    const response = await fetch(`/trabajador/asientos/${funcion}`);
    const data = await response.json();
    disponiblesSet = new Set(data.asientos.map(d => `${d.fila}-${d.numero}`));
  } catch (error) {
    console.error("Error al obtener asientos disponibles:", error);
  }
}

function mostrarFunciones() {
  functionList.innerHTML = "";  // Limpiar la lista de funciones

  funciones.forEach(funcion => {
    const li = document.createElement("li");
    li.textContent = `${funcion.hora} - ${funcion.pelicula}`;
    li.addEventListener("click", () => cargarSalaDeFuncion(funcion));
    functionList.appendChild(li);
  });
}

function cargarSalaDeFuncion(funcion) {
  // Mostrar el mapa de la sala correspondiente a esta función
  console.log("Cargando sala para la función:", funcion);
  obtenerSala(funcion);
}

function crearMapa() {
  seatMap.innerHTML = "";
  seatMap.style.gridTemplateColumns = `repeat(${ancho + 1}, 40px)`;

  for (let y = 1; y <= alto; y++) {
    const rowLabel = document.createElement("div");
    rowLabel.classList.add("row-label");
    rowLabel.textContent = String.fromCharCode(64 + y);
    seatMap.appendChild(rowLabel);

    for (let x = 1; x <= ancho; x++) {
      const asiento = asientos.find(a => a.x === x && a.y === y);
      const seat = document.createElement("div");
      seat.classList.add("seat");

      if (asiento) {
        const clave = `${asiento.fila}-${asiento.numero}`;
        seat.dataset.fila = asiento.fila;
        seat.dataset.numero = asiento.numero;
        seat.textContent = asiento.numero;

        if (!disponiblesSet.has(clave)) {
          seat.classList.add("occupied");
        }
      } else {
        seat.classList.add("noshow");
      }

      seatMap.appendChild(seat);
    }
  }
}

obtenerSalaDelDia();

window.addEventListener('pageshow', function (event) {
  if (event.persisted || window.performance.getEntriesByType("navigation")[0].type === "back_forward") {
    window.location.reload();
  }
});
