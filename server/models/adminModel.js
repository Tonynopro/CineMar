const db = require('../config/db');

const Admin = {

    accesoAdmin: async (correo, contraseña) => {
        const [rows] = await db.query('CALL adminAcceso(?, ?)', [correo, contraseña]);
        return rows;
    },

    asignarRol: async (fecha, trabajador, rol) => {
        const [rows] = await db.query('CALL asignarRolDelDia(?, ?, ?)', [fecha, trabajador, rol]);
        return rows;
    },

    traerTodosTrabajadores: async () => {
        const [rows] = await db.query('CALL traerTrabajadores()');
        return rows;
    },

    traerTodosRoles: async () => {
        const [rows] = await db.query('CALL traerRoles()');
        return rows;
    },

    traerTodasSalas: async () => {
        const [rows] = await db.query('CALL traerSalas()');
        return rows;
    },

    asignarSala: async (fecha, trabajador, rol, sala) => {
        const [rows] = await db.query('CALL asignarEncargadoSala(?, ?, ?, ?)', [fecha, trabajador, rol, sala]);
        return rows;
    },

    traerTodasPeliculas: async () => {
        const [rows] = await db.query('CALL traerPeliculas()');
        return rows;
    },

    registrarFuncion: async (pelicula, sala, dia, hora) => {
        const [rows] = await db.query('CALL asignarFuncion(?, ?, ?, ?)', [dia, hora, pelicula, sala]);
        return rows;
    }

};

module.exports = Admin;
