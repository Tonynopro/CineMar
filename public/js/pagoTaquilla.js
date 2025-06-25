let datos = null;
let subtotal = 0;
let iva = 0;
let total = 0;
let precioUnitario = 0;
let cuponAplicado = false;
let cupon;
let user;
let preciosPorBoleto = [];

document.addEventListener('DOMContentLoaded', () => {
    obtenerDatosCompra();
    configurarEventos();
});

function obtenerDatosCompra() {
    fetch('/compra/datosCompra')
        .then(res => res.json())
        .then(data => {
            datos = data.compra;
            console.log('Datos de compra:', datos);
            mostrarDatosCompra();
            calcularYMostrarPrecios();
        })
        .catch(error => {
            console.error('Error al obtener los datos de compra:', error);
            mostrarEstadoCupon('No se pudieron cargar los datos de la compra.', false);
        });
}

function configurarEventos() {
    const btnPago = document.getElementById('submit-payment');
    const btnCupon = document.getElementById('verify-coupon');
    const btnUsuario = document.getElementById('verify-user');

    btnPago.replaceWith(btnPago.cloneNode(true));
    document.getElementById('submit-payment').addEventListener('click', realizarCompra);

    btnCupon.replaceWith(btnCupon.cloneNode(true));
    document.getElementById('verify-coupon').addEventListener('click', () => {
        const codigo = document.getElementById('coupon').value.trim();
        if (codigo !== '') {
            aplicarDescuento(codigo);
        } else {
            mostrarEstadoCupon("Ingresa un código de cupón.", false);
        }
    });

    btnUsuario.replaceWith(btnUsuario.cloneNode(true));
    document.getElementById('verify-user').addEventListener('click', () => {
        const id = document.getElementById('user').value.trim();

        const esNumero = /^\d+$/.test(id);
        const esCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(id);

        if (id === '' || (!esNumero && !esCorreo)) {
            mostrarEstadoUsuario("Ingresa un ID numérico o un correo válido.", false);
            return;
        }

        fetch(`/trabajador/compra/checarUsuario/${encodeURIComponent(id)}`)
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    mostrarEstadoUsuario(`Usuario encontrado: ${data.usuario.nombre} ${data.usuario.apellido}`, true);
                    user = data.usuario.ID_cliente;
                    console.log('Usuario encontrado:', user);
                    bloquearUsuario();
                } else {
                    mostrarEstadoUsuario("Usuario no encontrado.", false);
                }
            })
            .catch(error => {
                console.error('Error al verificar el usuario:', error);
                mostrarEstadoUsuario("Error al verificar el usuario.", false);
            });
    });
}

function mostrarDatosCompra() {
    document.getElementById('movie-name').textContent = datos.titulo;
    document.getElementById('sala-number').textContent = `Sala ${datos.num_sala}`;
    const asientos = datos.asientosSeleccionados.map(a => `${a.fila}${a.numero}`).join(', ');
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
                    calcularYMostrarPrecios();
                    return;
                }

                mostrarEstadoCupon(`Cupón aceptado. Tipo: ${tipo}`, true);
                calcularYMostrarPrecios(tipo);
                cupon = codigo;
                cuponAplicado = true;
                bloquearCupon();
            } else {
                mostrarEstadoCupon('Cupón no válido.', false);
                calcularYMostrarPrecios();
            }
        })
        .catch(error => {
            console.error('Error al validar el cupón:', error);
            mostrarEstadoCupon('Error al validar el cupón.', false);
        });
}

function mostrarEstadoCupon(mensaje, valido) {
    const status = document.getElementById('coupon-status');
    status.textContent = mensaje;
    status.style.color = valido ? '#4caf50' : '#f44336';
}

function mostrarEstadoUsuario(mensaje, valido) {
    const status = document.getElementById('user-status');
    status.textContent = mensaje;
    status.style.color = valido ? '#4caf50' : '#f44336';
}

function bloquearCupon() {
    const input = document.getElementById('coupon');
    const btnOriginal = document.getElementById('verify-coupon');

    input.disabled = true;
    btnOriginal.textContent = 'Cambiar cupón';

    const nuevoBtn = btnOriginal.cloneNode(true);
    btnOriginal.parentNode.replaceChild(nuevoBtn, btnOriginal);

    nuevoBtn.addEventListener('click', () => {
        input.disabled = false;
        input.value = '';
        cupon = null;
        cuponAplicado = false;
        mostrarEstadoCupon('', false);
        calcularYMostrarPrecios();
        nuevoBtn.textContent = 'Verificar cupón';

        const btnVerificar = nuevoBtn.cloneNode(true);
        nuevoBtn.parentNode.replaceChild(btnVerificar, nuevoBtn);
        btnVerificar.addEventListener('click', () => {
            const codigo = input.value.trim();
            if (codigo !== '') {
                aplicarDescuento(codigo);
            } else {
                mostrarEstadoCupon("Ingresa un código de cupón.", false);
            }
        });
    });
}


function bloquearUsuario() {
    const input = document.getElementById('user');
    const btnOriginal = document.getElementById('verify-user');

    input.disabled = true;
    btnOriginal.textContent = 'Cambiar usuario';

    const nuevoBtn = btnOriginal.cloneNode(true);
    btnOriginal.parentNode.replaceChild(nuevoBtn, btnOriginal);

    nuevoBtn.addEventListener('click', () => {
        input.disabled = false;
        input.value = '';
        user = null;
        mostrarEstadoUsuario('', false);
        nuevoBtn.textContent = 'Verificar usuario';

        const btnVerificar = nuevoBtn.cloneNode(true);
        nuevoBtn.parentNode.replaceChild(btnVerificar, nuevoBtn);
        btnVerificar.addEventListener('click', () => {
            const id = input.value.trim();

            const esNumero = /^\d+$/.test(id);
            const esCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(id);

            if (id === '' || (!esNumero && !esCorreo)) {
                mostrarEstadoUsuario("Ingresa un ID numérico o un correo válido.", false);
                return;
            }

            fetch(`/trabajador/compra/checarUsuario/${encodeURIComponent(id)}`)
                .then(res => res.json())
                .then(data => {
                    if (data.ok) {
                        mostrarEstadoUsuario(`Usuario encontrado: ${data.usuario.nombre} ${data.usuario.apellido}`, true);
                        user = data.usuario.ID_cliente;
                        console.log('Usuario encontrado:', user, "asda");
                        bloquearUsuario();
                    } else {
                        mostrarEstadoUsuario("Usuario no encontrado.", false);
                    }
                })
                .catch(error => {
                    console.error('Error al verificar el usuario:', error);
                    mostrarEstadoUsuario("Error al verificar el usuario.", false);
                });
        });
    });
}


function crearVenta() {
    return fetch('/compra/crearVenta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idCliente: user })
    })
        .then(res => {
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
    console.log(datos);

    crearVenta()
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
                    tipoCompra: "ventanilla",
                    cliente: user,
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
                window.location.href = '/trabajador/funciones';
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
