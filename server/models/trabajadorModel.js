const db = require('../config/db');

const Trabajador = {

    crearTrabajador: (curp, nombre, apellido, fecha_nacimiento, fecha_ingreso, contraseña, callback) => {
        db.query('CALL registrarTrabajador(?, ?, ?, ?, ?, ?)', [curp, nombre, apellido, fecha_nacimiento, fecha_ingreso, contraseña], callback);
    },

    accesoTrabajador: (id, contraseña, callback) => {
        db.query('CALL iniciarSesion(?, ?)', [id, contraseña], callback);
    },

    eliminarTrabajador: (id, callback) => {
        db.query('CALL eliminarTrabajador(?)', [id], callback);
    },

    obtenerTrabajador: (id, callback) => {
        db.query('CALL obtenerTrabajador(?)', [id], callback);
    },

    obtenerTurnos: (id, callback) => {
        db.query('CALL obtenerTodosLosRolesDelTrabajador(?)', [id], callback);
    },

    registrarOferta: (folio, tipo, id_trab, contra, callback) => {
        db.query('CALL registrarOferta(?, ?, ?, ?)', [folio, tipo, id_trab, contra], callback);
    },

    obtenerSupervisores: (callback) => {
        db.query('CALL traerSupervisores()', callback);
    },

    obtenerSalaDelDia: (id, callback) => {
        db.query('CALL salaEncargado(?)', [id], callback);
    },

    obtenerFuncionesDeLaSala: (id, callback) => {
        db.query('CALL funcionesSala(?)', [id], callback);
    },

    traerSala: (id, callback) => {
        db.query('CALL traerSala(?)', [id], callback);
    },
    
    traerAsientos: (id, callback) => {
        db.query('CALL asientosdisponibles(?)', [id], callback);
    },
    
    obtenerRolActual: (id, callback) => {
        db.query('CALL traerRol(?)', [id], callback);
    }

};

module.exports = Trabajador;