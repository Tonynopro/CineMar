const form = document.getElementById('loginForm');
const mensajeDiv = document.getElementById('mensaje');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const idInput = document.getElementById('trabajadorId');
  const id = idInput.value.trim();

  console.log('ID ingresado:', id);

  if (!id) {
    mostrarMensaje('Ingresa un ID válido (número)', 'red');
    return;
  }

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  fetch('/trabajador/acceso', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(result => {
      if (result.ok) {
        window.location.href = result.redirectTo;
      } else {
        mostrarMensaje(result.mensaje || 'Credenciales incorrectas', 'red');
      }
    })
    .catch((err) => {
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
