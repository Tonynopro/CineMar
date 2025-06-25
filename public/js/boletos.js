document.addEventListener('DOMContentLoaded', () => {
  const contenedor = document.getElementById('boletos-container');

  fetch('/cliente/ventas_y_boletos')
    .then(res => res.json())
    .then(data => {
      if (!data.ok || !Array.isArray(data.ventas_y_boletos) || data.ventas_y_boletos.length === 0) {
        contenedor.innerHTML = '<p style="color:#ccc;">No has comprado ningún boleto aún.</p>';
        return;
      }

      // Agrupar boletos por id_venta
      const ventas = {};
      data.ventas_y_boletos.forEach(b => {
        ventas[b.id_venta] = ventas[b.id_venta] || [];
        ventas[b.id_venta].push(b);
      });

      const ahora = new Date();

      // Crear grupos
      const proximas = [];
      const anteriores = [];

      // Ordenar por fecha (más reciente primero)
      const ventasOrdenadas = Object.entries(ventas).sort((a, b) => {
        const fechaA = new Date(a[1][0].fecha);
        const fechaB = new Date(b[1][0].fecha);
        return fechaB - fechaA;
      });

      // Clasificar ventas
      ventasOrdenadas.forEach(([id_venta, boletos]) => {
        const info = boletos[0];
        const fechaVenta = new Date(info.fecha);

        if (fechaVenta > ahora) {
          proximas.push([id_venta, boletos]);
        } else {
          anteriores.push([id_venta, boletos]);
        }
      });

      // Renderizar grupos
      renderGrupo('Próximas funciones', proximas);
      renderGrupo('Boletos comprados', anteriores);
    })
    .catch(() => {
      contenedor.innerHTML = '<p style="color:red;">Error al obtener tus boletos.</p>';
    });

  function renderGrupo(titulo, grupo) {
    if (grupo.length === 0) return;

    const seccion = document.createElement('div');
    seccion.className = 'grupo-ventas';
    seccion.innerHTML = `<h2>${titulo}</h2><div class="grupo-tarjetas"></div>`;
    const tarjetasContainer = seccion.querySelector('.grupo-tarjetas');

    grupo.forEach(([id_venta, boletos]) => {
      const info = boletos[0];
      const asientos = boletos.map(b => `${b.fila}${b.numero}`).join(', ');

      const ventaCard = document.createElement('div');
      ventaCard.className = 'venta-card';
      ventaCard.innerHTML = `
        <h3>${info.titulo}</h3>
        <p><strong>Fecha:</strong> ${new Date(info.fecha).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' })}</p>
        <p><strong>Tipo:</strong> ${info.Tipo_compra} | <strong>Pago:</strong> ${info.metodo_pago}</p>
        <p><strong>Sala:</strong> ${info.Num_sala} | <strong>Asientos:</strong> ${asientos}</p>
        <div class="boletos-list"></div>
        <p class="cargando-total">Cargando total...</p>
      `;
      tarjetasContainer.appendChild(ventaCard);

      // mini-boletos
      const lista = ventaCard.querySelector('.boletos-list');
      boletos.forEach(b => {
        const mini = document.createElement('div');
        mini.className = 'boleto-mini';
        mini.innerHTML = `
          <span><strong>Precio:</strong> $${b.precio.toFixed(2)}</span>
          <span><strong>IVA:</strong> $${b.IVA.toFixed(2)}</span>
          <span><strong>Total:</strong> $${b.total.toFixed(2)}</span>
        `;
        lista.appendChild(mini);
      });

      // total real
      fetch(`/cliente/total_venta?id_venta=${id_venta}`)
        .then(res => res.json())
        .then(resT => {
          const p = ventaCard.querySelector('.cargando-total');
          if (resT.ok && resT.total_venta.length) {
            p.innerHTML = `<strong>Total Pagado:</strong> $${resT.total_venta[0].total.toFixed(2)}`;
          } else {
            p.textContent = 'No se pudo obtener el total.';
          }
        })
        .catch(() => {
          ventaCard.querySelector('.cargando-total').textContent = 'Error al cargar total.';
        });
    });

    contenedor.appendChild(seccion);
  }
});
