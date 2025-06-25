document.addEventListener('DOMContentLoaded', () => {
  fetch('/trabajador/info')
    .then(res => res.json())
    .then(data => {
      if (data.ok === false) {
        window.location.href = '/trabajador/iniciar-sesion';
        return;
      }

      const {
        id,
        curp,
        nombre,
        apellido,
        fecha_nacimiento,
        fecha_contratacion
      } = data.trabajador;

      const turnos = data.turnos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

      console.log(data.turnos);
      console.log(nombre, apellido, id, curp, fecha_nacimiento, fecha_contratacion);

      document.getElementById('nombreTrabajador').textContent = nombre;
      document.getElementById('idTrabajador').textContent = id;
      document.getElementById('nombreCompleto').textContent = `${nombre} ${apellido}`;
      document.getElementById('curp').textContent = `${curp}`;

      const hoy = new Date();
      const hoySinHora = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()); // Reseteamos la hora a las 00:00:00

      let turnosDeHoy = [];
      const tabla = document.getElementById('tablaTurnos');
      tabla.innerHTML = '';
      turnos.forEach(turno => {
        const fechaTurno = new Date(`${turno.fecha}T00:00:00-06:00`);

        const fechaTurnoSinHora = new Date(fechaTurno.getFullYear(), fechaTurno.getMonth(), fechaTurno.getDate()); // Reseteamos la hora a las 00:00:00
        console.log(turno.fecha, "-", fechaTurno);
        if (fechaTurnoSinHora < hoySinHora) {
          return; // No se muestra el turno si ya pasó
        }

        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${turno.dia} ${turno.fecha}</td>
          <td>${turno.rol}</td>
        `;
        tabla.appendChild(row);
        if (fechaTurnoSinHora.getTime() === hoySinHora.getTime()) {
          turnosDeHoy.push(turno);
        }
      });

      // Generar un botón por cada rol en los turnos de hoy
      if (turnosDeHoy.length > 0) {
        const btnContainer = document.getElementById('btnContainer');
        btnContainer.innerHTML = ''; // Limpiar los botones previos

        turnosDeHoy.forEach(turnoDeHoy => {
          const btn = document.createElement('button');
          btn.style.display = 'inline-block';
          let textoBoton = '';
          let ruta = '';

          switch (turnoDeHoy.rol) {
            case 'sala':
              textoBoton = 'Administración de Sala';
              ruta = '/trabajador/sala-info';
              break;
            case 'taquilla':
              textoBoton = 'Panel de Taquilla';
              ruta = '/trabajador/funciones';
              break;
            case 'supervisor':
              textoBoton = 'Administrar Promociones';
              ruta = '/trabajador/oferta';
              break;
            default:
              textoBoton = `Panel para rol: ${turnoDeHoy.rol}`;
              ruta = '/';
          }

          btn.textContent = textoBoton;
          btn.addEventListener('click', () => {
            if (ruta !== '/') {
              window.location.href = ruta;
            } else {
              alert('No hay una ruta configurada para tu rol: ' + turnoDeHoy.rol);
            }
          });
          btn.classList.add('adminSalaBtn');
          btnContainer.appendChild(btn);
        });
      }

    })
    .catch(err => {
      console.error('Error al cargar datos del trabajador:', err);
    });
});

document.getElementById('cerrarSesionBtn').addEventListener('click', () => {
  fetch('/trabajador/cerrar-sesion', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(data => {
      if (data.ok) {
        window.location.href = '/trabajador/';
      } else {
        alert('Error al cerrar sesión. Inténtalo de nuevo.');
      }
    })
    .catch(err => {
      console.error('Error al cerrar sesión:', err);
    });
  console.log('Cerrar sesión clickeado');
});
