let datos = null;
let subtotal = 0;
let iva = 0;
let total = 0;
let precioUnitario = 0;
let cuponAplicado = false;
let preciosPorBoleto = []; // Nuevo arreglo para manejar precios individuales

document.addEventListener('DOMContentLoaded', () => {
  // Obtener los datos reales del backend
  fetch('/compra/datosCompra')
    .then(res => res.json())
    .then(data => {
      datos = data.compra;
      console.log(datos);
      mostrarDatosCompra();
      calcularYMostrarPrecios();
    })
    .catch(error => {
      console.error('Error al obtener los datos de compra:', error);
      mostrarEstadoCupon('No se pudieron cargar los datos de la compra.', false);
    });

  document.getElementById('submit-payment').addEventListener('click', realizarCompra);

  // Verificar cupón al hacer clic
  const verifyBtn = document.getElementById('verify-coupon');
  verifyBtn.addEventListener('click', () => {
    const codigo = document.getElementById('coupon').value.trim();
    if (codigo !== '') {
      aplicarDescuento(codigo);
    } else {
      mostrarEstadoCupon("Ingresa un código de cupón.", false);
    }
  });
});

function mostrarDatosCompra() {
  document.getElementById('movie-name').textContent = datos.titulo;
  document.getElementById('sala-number').textContent = `Sala ${datos.num_sala}`;
  const asientos = datos.asientosSeleccionados
    .map(a => `${a.fila}${a.numero}`)
    .join(', ');
  document.getElementById('seats-chosen').textContent = asientos;
  precioUnitario = datos.precio;
}

function calcularYMostrarPrecios(tipoDescuento = null) {
  const cantidadBoletos = datos.asientosSeleccionados.length;
  preciosPorBoleto = [];

  datos.asientosSeleccionados.forEach((asiento, index) => {
    let precio = precioUnitario;

    if (tipoDescuento === "boletos gratis" && index === 0) {
      precio = 0;
    } else if (tipoDescuento === "Entradas 2X1" && index % 2 !== 0) {
      precio = 0;
    } else if (tipoDescuento === "50% descuento" && index === 0) {
      precio = precio * 0.5;
    }

    preciosPorBoleto.push(precio);
  });

  subtotal = preciosPorBoleto.reduce((sum, val) => sum + val, 0);
  iva = subtotal * 0.16;
  total = subtotal + iva;

  const precios = document.querySelectorAll('.price-details div:nth-child(2) p');
  precios[0].textContent = `$${subtotal.toFixed(2)}`;
  precios[1].textContent = `$${iva.toFixed(2)}`;
  precios[2].innerHTML = `<strong>$${total.toFixed(2)}</strong>`;
}


function aplicarDescuento(codigo) {
  fetch(`/compra/traerCodigoDescuento/${codigo}`)
    .then(res => res.json())
    .then(data => {
      if (data.ok) {
        const cup = data.codigo;
        const tipo = cup.tipo_descuento;
        const cantidadBoletos = datos.asientosSeleccionados.length;

        if (tipo === "Entradas 2X1" && cantidadBoletos < 2) {
          mostrarEstadoCupon('La promoción 2x1 requiere al menos 2 boletos.', false);
          calcularYMostrarPrecios(); // Resetea precios
          return;
        }

        mostrarEstadoCupon(`Cupón aceptado. Tipo: ${tipo}`, true);
        calcularYMostrarPrecios(tipo);
        bloquearCupon();
      } else {
        mostrarEstadoCupon('Cupón no válido.', false);
        calcularYMostrarPrecios();
      }
    })
    .catch(error => {
      console.error('Error al validar cupón:', error);
      mostrarEstadoCupon('Error al validar el cupón.', false);
    });
}


function mostrarEstadoCupon(mensaje, valido) {
  const status = document.getElementById('coupon-status');
  status.textContent = mensaje;
  status.style.color = valido ? '#4caf50' : '#f44336';
}

function bloquearCupon() {
  document.getElementById('coupon').disabled = true;
  document.getElementById('verify-coupon').disabled = true;
}

function crearVenta() {
  return fetch('/compra/crearVenta', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
  })
    .then(res => {
      console.log('Respuesta de crearVenta:', res);
      if (!res.ok) throw new Error('Error al crear la venta');
      return res.json();
    })
    .then(data => {
      if (!data.ok) throw new Error(data.mensaje || 'Error en la respuesta de venta');
      return data.idVenta;
    });
}

function realizarCompra() {
  const metodoPago = document.getElementById('metPago').value;
  const codigoCupon = document.getElementById('coupon').value.trim();
  console.log(datos)
  crearVenta() // Aquí obtienes el idVenta primero
    .then(idVenta => {
      const promesas = datos.asientosSeleccionados.map((asiento, index) => {
        const precio = preciosPorBoleto[index];
        const subtotalBoleto = precio;
        const ivaBoleto = subtotalBoleto * 0.16;
        const totalBoleto = subtotalBoleto + ivaBoleto;
      
        const compra = {
          titulo: datos.titulo,
          genero: datos.genero,
          clasificacion: datos.clasificacion,
          sala: datos.num_sala,
          filaAsiento: asiento.fila,
          numeroAsiento: asiento.numero,
          subtotal: subtotalBoleto,
          iva: ivaBoleto,
          total: totalBoleto,
          oferta: codigoCupon,
          metodoPago: metodoPago,
          tipoCompra: "aplicacion",
          cliente: datos.idCliente,
          idVenta: idVenta,
          fecha: datos.fecha,
          hora: datos.hora
        };
      
        return fetch('/compra/comprarBoleto', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(compra)
        })
          .then(res => res.json())
          .then(data => {
            if (!data.ok) throw new Error(data.mensaje || 'Error en la compra del boleto');
            return data;
          });
      });      

      return Promise.all(promesas);
    })
    .then(resultados => {
      console.log('Todas las compras realizadas:', resultados);
      document.getElementById('success-message').style.display = 'block';
      document.getElementById('error-message').style.display = 'none';
      document.getElementById('submit-payment').disabled = true;
      document.getElementById('submit-payment').textContent = 'Compra realizada';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    })
    .catch(error => {
      console.error('Error en la compra:', error.message);
      document.getElementById('error-message').style.display = 'block';
      document.getElementById('error-message').textContent = error.message + ' - Intenta nuevamente o vuelve atrás.';
      document.getElementById('success-message').style.display = 'none';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}



