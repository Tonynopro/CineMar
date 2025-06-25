const db = require('../config/db');

const Info = {

    obtenerInfo: (id, callback) => {
        db.query('CALL infoPelicula(?)', [id], callback);
    },

    obtenerActores: (id, callback) => {
        db.query('CALL traerActores(?)', [id], callback);
    },

    obtenerFunciones: (id, callback) => {
        db.query('CALL traerFuncionesPelicula(?)', [id], callback);
    },
    
    obtenerAsientos: (id, callback) => {
        db.query('CALL asientosdisponibles(?)', [id], callback);
    },

    obtenerPeliculas: (callback) => {
        db.query('CALL peliculasCartelera()', callback);
    },

    obtenerPromociones: (callback) => {
        db.query('CALL promociones()', callback);
    },

    obtenerPeliculasHoy: (callback) => {
        db.query('CALL peliculasCarteleraHoy()', callback);
    }
    
};

module.exports = Info;