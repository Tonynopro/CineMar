import {
    validarCorreo,
} from './validaciones.js';

const form = document.getElementById('loginForm');
const mensajeDiv = document.getElementById('mensaje');
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const correoInput = document.getElementById('email');

    let valid = true;
    let mensaje = '';

    if(!validarCorreo(correoInput.value)) {
        valid = false;
        mensaje = 'Por favor, ingresa un correo electrónico válido.';
    }

    if (!valid) {
      mensajeDiv.textContent = mensaje;
      mensajeDiv.style.color = 'red';
      mensajeDiv.classList.remove("fade-out");
      void mensajeDiv.offsetWidth;
      mensajeDiv.classList.add("fade-out");
      return;
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    fetch('/cliente/acceso_usuario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.ok) {
          window.location.href = result.redirectTo;
        } else {
          mensajeDiv.textContent = result.mensaje || 'Error desconocido';
          mensajeDiv.style.color = 'red';
          mensajeDiv.classList.remove("fade-out");
          void mensajeDiv.offsetWidth;
          mensajeDiv.classList.add("fade-out");
        }
      })
      .catch((err) => {
        mensajeDiv.textContent = err.message || 'Error en el servidor';
        mensajeDiv.style.color = 'red';
        mensajeDiv.classList.remove("fade-out");
        void mensajeDiv.offsetWidth;
        mensajeDiv.classList.add("fade-out");
      });
  });