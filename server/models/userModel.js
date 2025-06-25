const db = require('../config/db');

const User = {
    verificarCorreo: (correo, callback) => {
        db.query('CALL usuariosExistentes(?)', [correo], callback);
    },

    crearUsuario: (nombre, apellido, fecha_nacimiento, correo, contraseña, callback) => {
        db.query('CALL crear_usuario(?, ?, ?, ?, ?)', [nombre, apellido, fecha_nacimiento, correo, contraseña], callback);
    },

    accesoUsuario: (correo, contraseña, callback) => {
        db.query('CALL iniciarSesionCliente(?, ?)', [correo, contraseña], callback);
    },

    eliminarUsuario: (id, callback) => {
        db.query('CALL eliminarClienteRegistrado(?)', [id], callback);
    },

    traerBoletosComprados: (id, callback) => {
        db.query('CALL traerBoletoUsuario(?)', [id], callback);
    },

    traerVentasYBoletos: (id, callback) => {
        db.query('CALL ventasUsuario(?)', [id], callback);
    },

    traerTotalVenta: (id, callback) => {
        db.query('CALL total_venta(?)', [id], callback);
    },
};

module.exports = User;
