const path = require('path');
const Compra = require('../models/compraModel');

exports.mostrarSeleccionarAsientos = (req, res) => {
  console.log('Mostrar seleccionar asientos:', req.session.compra);
  if (req.session.compra && req.session.compra.id) {
    res.sendFile(path.join(__dirname, '../../public/views/seleccionar-asiento-taquilla.html'), { funcion: req.session.compra });
  } else {
    res.redirect('/');
  }
};

exports.mostrarMetodoPago = (req, res) => {
  console.log('Mostrar método de pago:', req.session.compra);
  if (req.session.compra && req.session.compra.id) {
    res.sendFile(path.join(__dirname, '../../public/views/seleccion-pago-taquilla.html'), { funcion: req.session.compra });
  } else {
    res.redirect('/');
  }
};

exports.checarUsuario = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ ok: false, mensaje: 'ID no proporcionado.' });
  }
  try {
    const results = await Compra.checarUsuario(id);
    // Dependiendo cómo regresa results, por ejemplo:
    if (results[0].length > 0) {
      return res.json({ ok: true, mensaje: 'Usuario existe.', usuario: results[0][0] });
    } else {
      return res.json({ ok: false, mensaje: 'Usuario no existe.' });
    }
  } catch (err) {
    console.error('Error al checar usuario:', err);
    return res.status(500).json({ ok: false, mensaje: 'Error al checar usuario.' });
  }
};
