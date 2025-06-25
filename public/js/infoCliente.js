document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("info-container");

    fetch("/cliente/info_usuario") // <-- Reemplaza con tu ruta real
        .then(res => res.json())
        .then(data => {
            console.log(data);

            const user = data.data;
            if (!user) {
                container.innerHTML = "<p style='color:#ccc;'>No se encontró información del usuario.</p>";
                return;
            }
            const card = document.createElement("div");
            card.className = "info-card";

            card.innerHTML = `
          <h2>Datos Personales</h2>
          <div class="info-line"><strong>Nombre:</strong> ${user.nombre} ${user.apellido}</div>
          <div class="info-line"><strong>Correo:</strong> ${user.correo}</div>
          <div class="info-line"><strong>Fecha de Nacimiento:</strong> ${formatFecha(user.fecha_nacimiento).fecha}</div>
          <div class="info-line"><strong>ID Cliente:</strong> ${user.id}</div>
          <div class="info-line"><strong>Nivel:</strong> ${user.nivel}</div>
        `;

            container.appendChild(card);
        })
        .catch(err => {
            console.error("Error al cargar info:", err);
            container.innerHTML = "<p style='color:red;'>No se pudo cargar tu información.</p>";
        });
});

function formatFecha(fechaISO) {
    const [año, mes, dia] = fechaISO.split('-');
    const fecha = new Date(`${año}-${mes}-${dia}T12:00:00`); // Fijamos hora media para evitar cambio de fecha
    const diasSemana = ["DOMINGO", "LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"];
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    const diaSemana = diasSemana[fecha.getDay()];
    return {
        diaSemana: diaSemana,
        fecha: `${parseInt(dia)} de ${meses[parseInt(mes) - 1]} del ${año}`
    };
}
