import {
  contieneNumeros,
  validarFechaNacimiento,
  validarCorreo,
  validarContraseña
} from './validaciones.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registroForm');
  const mensajeDiv = document.getElementById('mensaje');
  const contraseñaInput = document.getElementById('contraseña');
  const verificarContraseñaInput = document.getElementById('verificar_contraseña');
  const nombreInput = document.querySelector('input[name="nombre"]');
  const apellidoInput = document.querySelector('input[name="apellido"]');
  const correoInput = document.querySelector('input[name="correo"]');
  const fechaNacimientoInput = document.querySelector('input[name="fecha_nacimiento"]');

  [nombreInput, apellidoInput].forEach(input => {
    input.addEventListener('keypress', (e) => {
      if (/\d/.test(e.key)) {
        e.preventDefault();
      }
    });

    input.addEventListener('input', () => {
      input.value = input.value.replace(/\d/g, '');
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let valid = true;
    let mensaje = '';

    if (contieneNumeros(nombreInput.value)) {
      valid = false;
      mensaje = 'El nombre no puede contener números.';
    } else if (contieneNumeros(apellidoInput.value)) {
      valid = false;
      mensaje = 'El apellido no puede contener números.';
    } else if (!validarFechaNacimiento(fechaNacimientoInput.value)) {
      valid = false;
      mensaje = 'La fecha de nacimiento debe ser válida.';
    } else if (!validarCorreo(correoInput.value)) {
      valid = false;
      mensaje = 'Por favor, ingresa un correo electrónico válido.';
    } else if (!validarContraseña(contraseñaInput.value)) {
      valid = false;
      mensaje = 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, un número y un carácter especial.';
    } else if (contraseñaInput.value !== verificarContraseñaInput.value) {
      valid = false;
      mensaje = 'Las contraseñas no coinciden.';
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

    fetch('/cliente/registrar_usuario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.ok) {
          window.location.href = '/';
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
});

document.querySelectorAll(".onCar").forEach(input => {
  input.addEventListener("input", () => {
    input.value = input.value.replace(/[^a-zA-ZñÑ\s]/g, '');
  });
});