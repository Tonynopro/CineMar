const db = require('../config/db');

const User = {
    verificarCorreo: async (correo) => {
        const [rows] = await db.query('CALL usuariosExistentes(?)', [correo]);
        return rows;
    },

    crearUsuario: async (nombre, apellido, fecha_nacimiento, correo, contraseña) => {
        const [rows] = await db.query('CALL crear_usuario(?, ?, ?, ?, ?)', [nombre, apellido, fecha_nacimiento, correo, contraseña]);
        return rows;
    },

    accesoUsuario: async (correo, contraseña) => {
        const [rows] = await db.query('CALL iniciarSesionCliente(?, ?)', [correo, contraseña]);
        return rows;
    },

    eliminarUsuario: async (id) => {
        const [rows] = await db.query('CALL eliminarClienteRegistrado(?)', [id]);
        return rows;
    },

    traerBoletosComprados: async (id) => {
        const [rows] = await db.query('CALL traerBoletoUsuario(?)', [id]);
        return rows;
    },

    traerVentasYBoletos: async (id) => {
        const [rows] = await db.query('CALL ventasUsuario(?)', [id]);
        return rows;
    },

    traerTotalVenta: async (id) => {
        const [rows] = await db.query('CALL total_venta(?)', [id]);
        return rows;
    },
};

module.exports = User;
