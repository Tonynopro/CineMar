const btnSi = document.getElementById('btn-si');
const btnNo = document.getElementById('btn-no');
const confirmacion = document.getElementById('confirmacion');
const deleteForm = document.getElementById('deleteForm');
const mensajeDiv = document.getElementById('mensaje');

fetch('/perfil')
    .then(res => res.json())
    .then(data => {
        console.log('Datos de perfil:', data);
        if (!data.ok) {
            window.location.href = '/';
        } else {
            console.log('Sesión activa:', data.usuario);
        }
    });

btnSi.addEventListener('click', () => {
    confirmacion.style.display = 'none';
    deleteForm.style.display = 'flex';
});

btnNo.addEventListener('click', () => {
    window.location.href = '/';
});

deleteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('password').value;

    fetch('/cliente/eliminar_usuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contraseña: password })
    })
        .then(res => res.json())
        .then(result => {
            mensajeDiv.textContent = result.mensaje || 'Error al borrar la cuenta';
            mensajeDiv.style.color = result.ok ? 'green' : 'red';
            mensajeDiv.classList.remove("fade-out");
            void mensajeDiv.offsetWidth;
            mensajeDiv.classList.add("fade-out");

            if (result.ok) {
                setTimeout(() => {
                    window.location.href = '/';
                }, 500);
            }
        })
        .catch(err => {
            mensajeDiv.textContent = err.message || 'Error del servidor';
            mensajeDiv.style.color = 'red';
            mensajeDiv.classList.remove("fade-out");
            void mensajeDiv.offsetWidth;
            mensajeDiv.classList.add("fade-out");
        });
});
