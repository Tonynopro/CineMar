const db = require('../config/db');

const Trabajador = {

    crearTrabajador: async (curp, nombre, apellido, fecha_nacimiento, fecha_ingreso, contraseña) => {
        const [rows] = await db.query('CALL registrarTrabajador(?, ?, ?, ?, ?, ?)', [curp, nombre, apellido, fecha_nacimiento, fecha_ingreso, contraseña]);
        return rows;
    },

    accesoTrabajador: async (id, contraseña) => {
        const [rows] = await db.query('CALL iniciarSesion(?, ?)', [id, contraseña]);
        return rows;
    },

    eliminarTrabajador: async (id) => {
        const [rows] = await db.query('CALL eliminarTrabajador(?)', [id]);
        return rows;
    },

    obtenerTrabajador: async (id) => {
        const [rows] = await db.query('CALL obtenerTrabajador(?)', [id]);
        return rows;
    },

    obtenerTurnos: async (id) => {
        const [rows] = await db.query('CALL obtenerTodosLosRolesDelTrabajador(?)', [id]);
        return rows;
    },

    registrarOferta: async (folio, tipo, id_trab, contra) => {
        const [rows] = await db.query('CALL registrarOferta(?, ?, ?, ?)', [folio, tipo, id_trab, contra]);
        return rows;
    },

    obtenerSupervisores: async () => {
        const [rows] = await db.query('CALL traerSupervisores()');
        return rows;
    },

    obtenerSalaDelDia: async (id) => {
        const [rows] = await db.query('CALL salaEncargado(?)', [id]);
        return rows;
    },

    obtenerFuncionesDeLaSala: async (id) => {
        const [rows] = await db.query('CALL funcionesSala(?)', [id]);
        return rows;
    },

    traerSala: async (id) => {
        const [rows] = await db.query('CALL traerSala(?)', [id]);
        return rows;
    },

    traerAsientos: async (id) => {
        const [rows] = await db.query('CALL asientosdisponibles(?)', [id]);
        return rows;
    },

    obtenerRolActual: async (id) => {
        const [rows] = await db.query('CALL traerRol(?)', [id]);
        return rows;
    }

};

module.exports = Trabajador;