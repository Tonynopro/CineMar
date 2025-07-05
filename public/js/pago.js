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
      console.log('Verificando cupón:', codigo);
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

    if (tipoDescuento === "boletos gratis") {
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

  console.log('Subtotal:', subtotal);
  console.log('IVA:', iva);
  console.log('Total:', total);

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
        console.log('Cupón aplicado:', tipo);
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

const style = {
  base: {
    color: '#fff',              // texto blanco
    fontSize: '16px',
    '::placeholder': {
      color: '#bbb'             // placeholder gris claro
    },
    ':-webkit-autofill': {
      color: '#fff',
    },
    '::selection': {
      backgroundColor: '#ff5722',
      color: '#fff'
    }
  },
  invalid: {
    color: '#ff6f61',           // rojo para errores
    iconColor: '#ff6f61'
  }
};

const stripe = Stripe('pk_test_51RhNi8Q9N7hbwrlCmev5MqDVCaNdEZLzIpcvC0Qn74bR2fCzdBHfkUifLjfGKvmIzmUfkCQg1SGV0rX8mwKaIlqI00MrnZEpB0', { locale: 'es' });
const elements = stripe.elements();
const card = elements.create('card', { style: style });
card.mount('#card-element');

card.on('change', event => {
  const displayError = document.getElementById('card-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }
});

function realizarCompra() {
  document.getElementById('success-message').style.display = 'none';
  document.getElementById('error-message').style.display = 'none';
  stripe.createToken(card).then(result => {
    if (result.error) {
      document.getElementById('card-errors').textContent = result.error.message;
      return;
    }

    const token = result.token; // <-- ENVÍA TODO el objeto token
    const metodoPago = document.getElementById('metPago').value;
    const codigoCupon = document.getElementById('coupon').value.trim();

    // Mandar token al backend primero
    fetch('/compra/pagarStripe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: token,
        totalPagar: total.toFixed(2) // tu total ya calculado, en pesos
      })
    })
      .then(res => res.json())
      .then(data => {
        if (!data.ok) throw new Error(data.mensaje);

        // ✅ Solo si pago fue exitoso → continuar con lógica de CineMar
        return crearVenta().then(idVenta => {
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
            }).then(res => res.json());
          });

          return Promise.all(promesas);
        });
      })
      .then(resultados => {
        // Compra finalizada
        document.getElementById('success-message').style.display = 'block';
        document.getElementById('submit-payment').disabled = true;
        document.getElementById('submit-payment').textContent = 'Compra realizada';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => window.location.href = '/', 1000);
      })
      .catch(error => {

        let mensaje = error.message;
        if (mensaje.includes('Your card number is incomplete')) {
          mensaje = 'El número de la tarjeta está incompleto.';
        } else if (mensaje.includes('Your card\'s security code is incomplete')) {
          mensaje = 'El código de seguridad está incompleto.';
        } else if (mensaje.includes('Your card has expired')) {
          mensaje = 'Tu tarjeta ha expirado.';
        } else if (mensaje.includes('Your card was declined')) {
          mensaje = 'Tu tarjeta fue rechazada.';
        } else if (mensaje.includes('Your card\'s security code is incorrect')) {
          mensaje = 'El código de seguridad de tu tarjeta es incorrecto.';
        }

        console.error('Error:', mensaje);
        document.getElementById('error-message').style.display = 'block';
        document.getElementById('error-message').textContent = mensaje;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
  }

  );
}








