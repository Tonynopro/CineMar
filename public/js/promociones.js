document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("promociones-container");

    fetch('/promocionesValidas') // <- Reemplaza esto con tu endpoint real
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
            <div class="promo-detalle">Codigo: ${promo.folio_oferta}</div>
          `;

                contenedor.appendChild(card);
            });
        })
        .catch(err => {
            console.error("Error al obtener promociones:", err);
            contenedor.innerHTML = "<p style='color:red; text-align:center;'>Error al cargar las promociones.</p>";
        });
});
