const seatMap = document.getElementById("seat-map");
const selectedCount = document.getElementById("selected-count");

let ancho = 0;
let alto = 0;
let asientos = [];
let disponiblesSet = new Set();
let seleccionados = [];

async function obtenerSala() {
  try {
    const response = await fetch(`/compra/traerSala`);
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

      await obtenerDisponibles(); // Primero cargar los disponibles, luego crear el mapa
      crearMapa();
    } else {
      console.error("Error al obtener la información de la sala.");
      alert("Sala no disponible.");
      window.location.href = history.back(); // Redirigir a la página de selección de función
    }
  } catch (error) {
    console.error("Error al realizar la solicitud:", error);
  }
}

async function obtenerDisponibles() {
  try {
    const response = await fetch(`/compra/traerAsientos`);
    const data = await response.json();

    console.log(data);

    // Crear un set con clave "fila-numero" para facilitar comparación
    disponiblesSet = new Set(data.asientos.map(d => `${d.fila}-${d.numero}`));
  } catch (error) {
    console.error("Error al obtener asientos disponibles:", error);
  }
}

function crearMapa() {
  seatMap.innerHTML = "";
  seatMap.style.gridTemplateColumns = `repeat(${ancho + 1}, 40px)`;

  for (let y = 1; y <= alto; y++) {
    const rowLabel = document.createElement("div");
    rowLabel.classList.add("row-label");
    rowLabel.textContent = String.fromCharCode(64 + y); // A, B, ...
    seatMap.appendChild(rowLabel);

    for (let x = 1; x <= ancho; x++) {
      const asiento = asientos.find(a => a.x === x && a.y === y);
      const seat = document.createElement("div");
      seat.classList.add("seat");

      if (asiento) {
        const id = `F${y}-S${x}`;
        const clave = `${asiento.fila}-${asiento.numero}`;

        seat.dataset.id = id;
        seat.dataset.fila = asiento.fila;
        seat.dataset.numero = asiento.numero;
        seat.textContent = asiento.numero;

        if (disponiblesSet.has(clave)) {
          seat.addEventListener("click", () => {
            if (seat.classList.contains("selected")) {
              seat.classList.remove("selected");
              seleccionados = seleccionados.filter(s => s.id !== id);
            } else {
              if (seleccionados.length >= 5) {
                alert("Solo puedes seleccionar hasta 5 asientos.");
                return;
              }

              seat.classList.add("selected");
              seleccionados.push({
                id,
                fila: asiento.fila,
                numero: asiento.numero
              });
            }

            selectedCount.textContent = seleccionados.length;
          });

        } else {
          seat.classList.add("occupied");
        }
      } else {
        seat.classList.add("noshow");
      }

      seatMap.appendChild(seat);
    }
  }
}

document.getElementById("confirm").addEventListener("click", async () => {
  // Recolectar los asientos seleccionados en el momento
  const selectedSeats = Array.from(document.querySelectorAll(".seat.selected")).map(seat => ({
    fila: seat.dataset.fila,
    numero: seat.dataset.numero
  }));

  if (selectedSeats.length === 0) {
    alert("No has seleccionado ningún asiento.");
    return;
  }

  try {
    const response = await fetch('/compra/seleccionar-asientos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        asientosSeleccionados: selectedSeats
      })
    });

    const result = await response.json();

    if (result.ok) {
      window.location.href = result.redirectTo; // Redirigir a la página de pago
    } else {
      alert("Hubo un problema al guardar los asientos.");
    }

  } catch (error) {
    console.error("Error al enviar los asientos:", error);
    alert("Error en la conexión con el servidor.");
  }
});  

// Inicia el proceso
obtenerSala();

window.addEventListener('pageshow', function (event) {
  // Se ejecuta si la página viene del cache (por ejemplo, por el botón atrás)
  if (event.persisted || window.performance.getEntriesByType("navigation")[0].type === "back_forward") {
    window.location.reload();
  }
});
