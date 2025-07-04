const path = require('path');
const User = require('../models/userModel');

exports.mostrarMenuIngreso = (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/views/menu-usuario.html'));
};

exports.mostrarFormularioRegistro = (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/views/registrar.html'));
};

exports.mostrarFormularioAcceso = (req, res) => {
  req.session.destroy(err => {
    if (err) console.error('Error al cerrar sesión:', err);
    res.clearCookie('connect.sid');
    res.sendFile(path.join(__dirname, '../../public/views/iniciar-sesion.html'));
  });
};

exports.mostrarPaginaEliminar = (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/views/borrar-cliente.html'));
};

exports.mostrarBoletos = (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/views/boletos.html'));
};

exports.mostrarPerfilUsuario = (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/views/info-cliente.html'));
};

exports.registrarUsuario = async (req, res) => {
  const { nombre, apellido, fecha_nacimiento, correo, contraseña, verificar_contraseña } = req.body;
  if (contraseña !== verificar_contraseña) {
    return res.json({ ok: false, mensaje: 'Las contraseñas no coinciden' });
  }
  try {
    const resultadosVerif = await User.verificarCorreo(correo);
    const mensaje = resultadosVerif[0][0].mensaje;
    if (mensaje === 'El cliente ya está registrado.') {
      return res.json({ ok: false, mensaje });
    }
    const resultadosCrear = await User.crearUsuario(nombre, apellido, fecha_nacimiento, correo, contraseña);
    const perfil = resultadosCrear[0][0];
    req.session.idCliente = perfil.ID_cliente;
    req.session.nombre = perfil.nombre;
    req.session.apellido = perfil.apellido;
    req.session.fecha_nacimiento = perfil.fecha_nac;
    req.session.correo = perfil.correo;
    req.session.nivel = perfil.nivel;
    req.session.contraseña = perfil.contraseña;
    req.session.tipo = "cliente";
    return res.json({ ok: true });
  } catch (err) {
    console.error('Error en registrarUsuario:', err);
    return res.json({ ok: false, mensaje: 'Error al registrar usuario' });
  }
};

exports.accesoUsuario = async (req, res) => {
  const { correo, contraseña } = req.body;
  if (!correo || !contraseña) {
    return res.json({ ok: false, mensaje: 'Correo y contraseña son requeridos' });
  }
  try {
    const resultados = await User.accesoUsuario(correo, contraseña);
    const mensaje = resultados[0][0].mensaje;
    if (mensaje === undefined) {
      const perfil = resultados[0][0];
      req.session.idCliente = perfil.ID_cliente;
      req.session.nombre = perfil.nombre;
      req.session.apellido = perfil.apellido;
      req.session.fecha_nacimiento = perfil.fecha_nac;
      req.session.correo = perfil.correo;
      req.session.nivel = perfil.nivel;
      req.session.contraseña = perfil.contraseña;
      req.session.tipo = "cliente";
      return res.json({ ok: true, redirectTo: '/' });
    }
    return res.json({ ok: false, mensaje });
  } catch (err) {
    console.error('Error en accesoUsuario:', err);
    return res.json({ ok: false, mensaje: 'Error al acceder' });
  }
};

exports.eliminarUsuario = async (req, res) => {
  const { contraseña } = req.body;
  const id = req.session.idCliente;
  if (!id) return res.json({ ok: false, mensaje: 'ID de usuario requerido' });
  if (contraseña !== req.session.contraseña) {
    return res.json({ ok: false, mensaje: 'Contraseña incorrecta' });
  }
  try {
    await User.eliminarUsuario(id);
    req.session.destroy(err => {
      if (err) {
        console.error('Error al destruir sesión:', err);
        return res.json({ ok: false, mensaje: 'Usuario eliminado, pero no se pudo cerrar sesión' });
      }
      return res.json({ ok: true, mensaje: 'Usuario eliminado y sesión cerrada' });
    });
  } catch (err) {
    console.error('Error en eliminarUsuario:', err);
    return res.json({ ok: false, mensaje: 'Error al eliminar usuario' });
  }
};

exports.mostrarInfoUsuario = (req, res) => {
  const id = req.session.idCliente;
  if (!id) return res.json({ ok: false, mensaje: 'No hay usuario en sesión' });
  const response = {
    id,
    nombre: req.session.nombre,
    apellido: req.session.apellido,
    fecha_nacimiento: req.session.fecha_nacimiento,
    correo: req.session.correo,
    nivel: req.session.nivel,
    tipo: req.session.tipo,
  };
  res.json({ ok: true, data: response });
};

exports.traerBoletosComprados = async (req, res) => {
  const id = req.session.idCliente;
  if (!id) return res.json({ ok: false, mensaje: 'No hay usuario en sesión' });
  try {
    const resultados = await User.traerBoletosComprados(id);
    return res.json({ ok: true, boletos: resultados[0] });
  } catch (err) {
    console.error('Error en traerBoletosComprados:', err);
    return res.json({ ok: false, mensaje: 'Error al obtener boletos' });
  }
};

exports.traerVentasYBoletos = async (req, res) => {
  const id = req.session.idCliente;
  if (!id) return res.json({ ok: false, mensaje: 'No hay usuario en sesión' });
  try {
    const resultados = await User.traerVentasYBoletos(id);
    return res.json({ ok: true, ventas_y_boletos: resultados[0] });
  } catch (err) {
    console.error('Error en traerVentasYBoletos:', err);
    return res.json({ ok: false, mensaje: 'Error al obtener ventas y boletos' });
  }
};

exports.traerTotalVenta = async (req, res) => {
  const id = req.session.idCliente;
  if (!id) return res.json({ ok: false, mensaje: 'No hay usuario en sesión' });
  const { id_venta } = req.query;
  if (!id_venta) return res.json({ ok: false, mensaje: 'ID de venta requerido' });
  try {
    const resultados = await User.traerTotalVenta(id_venta);
    return res.json({ ok: true, total_venta: resultados[0] });
  } catch (err) {
    console.error('Error en traerTotalVenta:', err);
    return res.json({ ok: false, mensaje: 'Error al obtener total de venta' });
  }
};

exports.cerrarSesion = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
      return res.redirect('/cliente/menu');
    }
    res.redirect('/');
  });
};
