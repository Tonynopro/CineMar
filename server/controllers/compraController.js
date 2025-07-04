const path = require('path');
const Compra = require('../models/compraModel');

exports.guardarFuncionSeleccionada = (req, res) => {
  const { id, titulo, genero, clasificacion, num_sala, precio, fecha, hora } = req.body;
  if (!id || !titulo || !genero || !clasificacion || !num_sala || !precio || !fecha || !hora) {
    return res.status(400).json({ ok: false, error: 'Faltan datos para guardar la función seleccionada.' });
  }
  req.session.compra = { id, titulo, genero, clasificacion, num_sala, precio, fecha, hora };
  console.log('Función seleccionada:', req.session);
  return res.json({ ok: true, mensaje: 'Función seleccionada correctamente.' });
};

exports.mostrarSeleccionarAsientos = (req, res) => {
  console.log('Mostrar seleccionar asientos:', req.session.compra);
  if (req.session.compra && req.session.compra.id) {
    res.sendFile(path.join(__dirname, '../../public/views/seleccionar-asiento.html'), { funcion: req.session.compra });
  } else {
    res.redirect('/');
  }
};

exports.guardarAsientosSeleccionados = (req, res) => {
  const { asientosSeleccionados } = req.body;
  if (!asientosSeleccionados || asientosSeleccionados.length === 0) {
    return res.status(400).json({ ok: false, mensaje: 'No se han seleccionado asientos.' });
  }
  if (req.session.compra) {
    req.session.compra.asientosSeleccionados = asientosSeleccionados;
    const redirectTo = req.originalUrl.startsWith('/trabajador') 
      ? '/trabajador/compra/metodo-de-pago' 
      : '/compra/metodo-de-pago';
    return res.json({ ok: true, mensaje: 'Asientos seleccionados correctamente.', redirectTo });
  } else {
    return res.status(400).json({ ok: false, mensaje: 'No se ha seleccionado ninguna función.', redirectTo: '/' });
  }
};

exports.mostrarMetodoPago = (req, res) => {
  const infoCompra = req.session.compra;
  console.log('Mostrar método de pago:', infoCompra);
  if (infoCompra && infoCompra.asientosSeleccionados) {
    res.sendFile(path.join(__dirname, '../../public/views/seleccion-pago.html'), { compra: infoCompra });
  } else {
    res.redirect('/');
  }
};

// Aquí empieza la migración a async/await:

exports.procesarPago = async (req, res) => {
  try {
    const infoCompra = req.session.compra;

    if (infoCompra && infoCompra.asientosSeleccionados) {
      console.log('Procesando pago:', infoCompra, req.body.detallesPago);

      // Aquí podrías guardar el pago en base de datos si fuera necesario

      delete req.session.compra;
      return res.send('Compra completada!');
    } else {
      return res.status(400).send('Información de compra incompleta o expirada.');
    }
  } catch (err) {
    console.error('Error en procesarPago:', err);
    return res.status(500).send('Ocurrió un error al procesar el pago.');
  }
};


exports.traerSala = async (req, res) => {
  const id = req.session.compra?.num_sala;
  if (!id) {
    return res.status(400).json({ ok: false, mensaje: 'ID de sala no proporcionado.' });
  }
  try {
    const results = await Compra.traerSala(id);
    const resp = results[0][0];
    const info = {
      Num_sala: resp.Num_sala,
      tipo: resp.tipo_sala,
      precio: resp.precio,
      ancho: resp.ancho_grid,
      alto: resp.alto_grid,
    };
    return res.json({ ok: true, info, sala: results[0] });
  } catch (err) {
    console.error('Error al traer sala:', err);
    return res.json({ ok: false, mensaje: err.message });
  }
};

exports.traerAsientos = async (req, res) => {
  const id = req.session.compra?.id;
  if (!id) {
    return res.status(400).json({ ok: false, mensaje: 'ID de sala no proporcionado.' });
  }
  try {
    const results = await Compra.traerAsientos(id);
    return res.json({ ok: true, asientos: results[0] });
  } catch (err) {
    console.error('Error al traer asientos:', err);
    return res.json({ ok: false, mensaje: err.message });
  }
};

exports.traerCodigosDescuento = async (req, res) => {
  const id = req.params.id;
  try {
    const results = await Compra.traerCodigoDescuento(id);
    return res.json({ ok: true, codigo: results[0][0] });
  } catch (err) {
    console.error('Error al traer codigos de descuento:', err);
    return res.json({ ok: false, mensaje: err.message });
  }
};

exports.crearVenta = async (req, res) => {
  let idCliente = req.session.idCliente || req.body.idCliente || null;
  try {
    const results = await Compra.crearVenta(idCliente);
    const idVenta = results[0][0].id;
    req.session.idVenta = idVenta;
    return res.json({ ok: true, mensaje: 'Venta creada correctamente.', idVenta });
  } catch (err) {
    console.error('Error al crear venta:', err);
    return res.json({ ok: false, mensaje: err.message });
  }
};

exports.comprarBoleto = async (req, res) => {
  let { titulo, genero, clasificacion, sala, filaAsiento, numeroAsiento, subtotal, iva, total, oferta, metodoPago, tipoCompra, idVenta, fecha, hora } = req.body;
  if (!titulo || !genero || !clasificacion || !sala || !filaAsiento || !numeroAsiento || !metodoPago || !tipoCompra || !idVenta || !fecha || !hora) {
    return res.status(400).json({ ok: false, mensaje: 'Faltan datos para comprar el boleto.' });
  }
  if (!oferta) oferta = null;
  try {
    await Compra.comprarBoleto(titulo, genero, clasificacion, sala, filaAsiento, numeroAsiento, subtotal, iva, total, oferta, metodoPago, tipoCompra, idVenta, fecha, hora);
    return res.json({ ok: true, mensaje: 'Boleto comprado correctamente.' });
  } catch (err) {
    console.error('Error al comprar boleto:', err);
    return res.json({ ok: false, mensaje: err.message });
  }
};

exports.datosCompra = (req, res) => {
  const infoCompra = req.session.compra;
  if (infoCompra) {
    res.json({ ok: true, compra: infoCompra });
  } else {
    res.status(400).json({ ok: false, mensaje: 'No hay información de compra disponible.' });
  }
};


