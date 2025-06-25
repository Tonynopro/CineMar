const path = require('path');
const Compra = require('../models/compraModel');

exports.guardarFuncionSeleccionada = (req, res) => {
  const { id, titulo, genero, clasificacion, num_sala, precio, fecha, hora } = req.body;
  if (!id || !titulo || !genero || !clasificacion || !num_sala || !precio || !fecha || !hora) {
    return res.status(400).json({ ok: false, error: 'Faltan datos para guardar la función seleccionada.' });
  }
  // Guardar la información de la función seleccionada en la sesión
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
    if (req.originalUrl.startsWith('/trabajador')) {
      res.json({ ok: true, mensaje: 'Asientos seleccionados correctamente.', redirectTo: '/trabajador/compra/metodo-de-pago' });
    } else {
      res.json({ ok: true, mensaje: 'Asientos seleccionados correctamente.', redirectTo: '/compra/metodo-de-pago' });
    }
  } else {
    res.status(400).json({ ok: false, mensaje: 'No se ha seleccionado ninguna función.', redirectTo: '/' });
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

exports.procesarPago = (req, res) => {
  const infoCompra = req.session.compra;
  if (infoCompra && infoCompra.asientosSeleccionados) {
    console.log('Procesando pago:', infoCompra, req.body.detallesPago);
    delete req.session.compra;
    res.send('Compra completada!');
  } else {
    res.status(400).send('Información de compra incompleta o expirada.');
  }
};

exports.traerSala = (req, res) => {
  const id = req.session.compra.num_sala;
  if (!id) {
    return res.status(400).json({ ok: false, mensaje: 'ID de sala no proporcionado.' });
  }

  Compra.traerSala(id, (err, results) => {
    if (err) {
      console.error('Error al traer sala:', err.stack);
      return res.json({ ok: false, mensaje: err.message });
    }

    const resp = results[0][0];

    const info = {
      Num_sala: resp.Num_sala,
      tipo: resp.tipo_sala,
      precio: resp.precio,
      ancho: resp.ancho_grid,
      alto: resp.alto_grid,
    }
    return res.json({ ok: true, info, sala: results[0] });
  });
}

exports.traerAsientos = (req, res) => {
  const id = req.session.compra.id;
  console.log('ID de sala:', id);
  if (!id) {
    return res.status(400).json({ ok: false, mensaje: 'ID de sala no proporcionado.' });
  }

  Compra.traerAsientos(id, (err, results) => {
    if (err) {
      console.error('Error al traer asientos:', err.stack);
      return res.json({ ok: false, mensaje: err.message });
    }

    return res.json({ ok: true, asientos: results[0] });
  });
}

exports.traerCodigosDescuento = (req, res) => {
  const id = req.params.id;

  Compra.traerCodigoDescuento(id, (err, results) => {
    if (err) {
      console.error('Error al traer codigos de descuento:', err.stack);
      return res.json({ ok: false, mensaje: err.message });
    }

    return res.json({ ok: true, codigo: results[0][0] });
  });
}

exports.crearVenta = (req, res) => {
  let idCliente = req.session.idCliente || req.body.idCliente; // Obtener el ID de cliente de la sesión o del cuerpo de la solicitud

  if(!idCliente) {
    idCliente = null; // Si no hay ID de cliente en la sesión, se establece como null
  }

  Compra.crearVenta(idCliente, (err, results) => {
    if (err) {
      console.error('Error al crear venta:', err.stack);
      return res.json({ ok: false, mensaje: err.message });
    }

    const idVenta = results[0][0].id;
    req.session.idVenta = idVenta; // Guardar el ID de la venta en la sesión
    return res.json({ ok: true, mensaje: 'Venta creada correctamente.', idVenta });
  });
}

exports.comprarBoleto = (req, res) => {
  let { titulo, genero, clasificacion, sala, filaAsiento, numeroAsiento, subtotal, iva, total, oferta, metodoPago, tipoCompra, idVenta, fecha, hora } = req.body;
  console.log('Datos de compra:', req.body);
  if (!titulo || !genero || !clasificacion || !sala || !filaAsiento || !numeroAsiento || !metodoPago || !tipoCompra || !idVenta || !fecha || !hora) {
    return res.status(400).json({ ok: false, mensaje: 'Faltan datos para comprar el boleto.' });
  }

  if (!oferta) {
    oferta = null; // Si no se proporciona oferta, se establece como null
  }

  Compra.comprarBoleto(titulo, genero, clasificacion, sala, filaAsiento, numeroAsiento, subtotal, iva, total, oferta, metodoPago, tipoCompra, idVenta,fecha, hora, (err) => {
    if (err) {
      console.error('Error al comprar boleto:', err.stack);
      return res.json({ ok: false, mensaje: err.message });
    }

    console.log(titulo, genero, clasificacion, sala, filaAsiento, numeroAsiento, subtotal, iva, total, oferta, metodoPago, tipoCompra, idVenta,fecha, hora);
    return res.json({ ok: true, mensaje: 'Boleto comprado correctamente.' });
  });
}

exports.datosCompra = (req, res) => {
  const infoCompra = req.session.compra;
  if (infoCompra) {
    res.json({ ok: true, compra: infoCompra });
  } else {
    res.status(400).json({ ok: false, mensaje: 'No hay información de compra disponible.' });
  }
}

