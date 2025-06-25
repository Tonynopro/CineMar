const db = require('../config/db');

const Admin = {

    accesoAdmin: (correo, contraseña, callback) => {
        db.query('CALL adminAcceso(?, ?)', [correo, contraseña], callback);
    },

    asignarRol: (fecha, trabajador, rol, callback) => {
        db.query('CALL asignarRolDelDia(?, ?, ?)', [fecha, trabajador, rol], callback);
    },

    traerTodosTrabajadores: (callback) => {
        db.query('CALL traerTrabajadores()', callback);
    },

    traerTodosRoles: (callback) => {
        db.query('CALL traerRoles()', callback);
    },

    traerTodasSalas: (callback) => {
        db.query('CALL traerSalas()', callback);
    },

    asignarSala: (fecha, trabajador, rol, sala, callback) => {
        db.query('CALL asignarEncargadoSala(?, ?, ?, ?)', [fecha, trabajador, rol, sala], callback);
    },
    
    traerTodasPeliculas: (callback) => {
        db.query('CALL traerPeliculas()', callback);
    },

    registrarFuncion: (pelicula, sala, dia, hora, callback) => {
        db.query('CALL asignarFuncion(?, ?, ?, ?)', [dia, hora, pelicula, sala], callback);
    }

};

module.exports = Admin;