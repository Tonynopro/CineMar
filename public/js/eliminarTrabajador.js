const form = document.getElementById('deleteWorkerForm');
const idSelect = document.getElementById('trabajadorId');
const continuarBtn = document.getElementById('continuarBtn');
const confirmacion = document.getElementById('confirmacion');
const confirmarBtn = document.getElementById('confirmarBtn');
const cancelarBtn = document.getElementById('cancelarBtn');
const passwordSection = document.getElementById('passwordSection');
const mensajeDiv = document.getElementById('mensaje');

let idConfirmado = null;

// Cargar trabajadores al iniciar
window.addEventListener('DOMContentLoaded', () => {
  fetch('/admin/trabajadores')
    .then(res => res.json())
    .then(data => {
      console.log(data);
      data.trabajadores.forEach(trabajador => {
        const option = document.createElement('option');
        option.value = trabajador.ID_trabajador;
        option.textContent = `${trabajador.ID_trabajador} - ${trabajador.nombre} ${trabajador.apellido}`;
        idSelect.appendChild(option);
      });
    })
    .catch(err => {
      mostrarMensaje('Error al cargar trabajadores.', 'red');
      console.error(err);
    });
});

continuarBtn.addEventListener('click', () => {
  const selectedValue = idSelect.value;
  if (!selectedValue) {
    mostrarMensaje('Selecciona un trabajador válido.', 'red');
    return;
  }

  idConfirmado = selectedValue;
  confirmacion.style.display = 'block';
  passwordSection.style.display = 'none';
  mensajeDiv.textContent = '';
});

confirmarBtn.addEventListener('click', () => {
  confirmacion.style.display = 'none';
  passwordSection.style.display = 'block';
});

cancelarBtn.addEventListener('click', () => {
  confirmacion.style.display = 'none';
  passwordSection.style.display = 'none';
  idConfirmado = null;
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!idConfirmado) {
    mostrarMensaje('Primero confirma la eliminación.', 'red');
    return;
  }

  const password = document.getElementById('password').value;

  fetch('/trabajador/eliminar', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: idConfirmado,
      contraseña: password
    })
  })
    .then(res => res.json())
    .then(result => {
      if (result.ok) {
        mostrarMensaje('Trabajador eliminado con éxito.', 'green');
        form.reset();
        window.location.href = result.redirectTo;
      } else {
        mostrarMensaje(result.mensaje || 'No se pudo eliminar.', 'red');
      }
    })
    .catch(err => {
      mostrarMensaje(err.message || 'Error del servidor', 'red');
    });
});

function mostrarMensaje(mensaje, color = 'red') {
  mensajeDiv.textContent = mensaje;
  mensajeDiv.style.color = color;
  mensajeDiv.classList.remove('fade-out');
  void mensajeDiv.offsetWidth;
  mensajeDiv.classList.add('fade-out');
}
