document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("promociones-container");

    fetch('/promocionesValidas')
        .then(res => res.json())
        .then(data => {
            if (!data || data.length === 0) {
                contenedor.innerHTML = "<p style='text-align:center; width:100%'>No hay promociones vigentes.</p>";
                return;
            }

            data.promociones.forEach(promo => {
                const card = document.createElement("div");
                card.className = "promo-card";
                card.innerHTML = `
                    <div class="promo-tipo">${promo.tipo_descuento}</div>
                    <div class="promo-detalle">Código: ${promo.folio_oferta}</div>
                `;

                card.addEventListener("click", () => {
                    navigator.clipboard.writeText(promo.folio_oferta)
                        .then(() => mostrarNotificacion("¡Código copiado al portapapeles!"))
                        .catch(() => mostrarNotificacion("Error al copiar el código", true));
                });

                contenedor.appendChild(card);
            });
        })
        .catch(err => {
            console.error("Error al obtener promociones:", err);
            contenedor.innerHTML = "<p style='color:red; text-align:center;'>Error al cargar las promociones.</p>";
        });

    // Función para mostrar notificaciones
    function mostrarNotificacion(mensaje, error = false) {
        const noti = document.createElement("div");
        noti.className = "notificacion";
        if (error) noti.classList.add("error");
        noti.textContent = mensaje;
        document.body.appendChild(noti);

        setTimeout(() => {
            noti.classList.add("show");
        }, 10); // pequeño delay para que la animación se dispare

        setTimeout(() => {
            noti.classList.remove("show");
            setTimeout(() => noti.remove(), 300);
        }, 2000);
    }
});
