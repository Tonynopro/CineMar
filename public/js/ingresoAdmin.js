const form = document.getElementById('adminLoginForm');
const mensajeDiv = document.getElementById('mensaje');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    let valid = true;
    let mensaje = '';

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

    fetch('/admin/acceso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then((response) => response.json())
        .then((result) => {
            if (result.ok) {
                window.location.href = result.redirectTo || '/admin/index';
            } else {
                mensajeDiv.textContent = result.mensaje || 'Credenciales incorrectas.';
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
