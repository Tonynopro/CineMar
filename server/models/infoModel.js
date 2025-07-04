const db = require('../config/db');

const Info = {

  obtenerInfo: async (id) => {
    const [rows] = await db.query('CALL infoPelicula(?)', [id]);
    return rows;
  },

  obtenerActores: async (id) => {
    const [rows] = await db.query('CALL traerActores(?)', [id]);
    return rows;
  },

  obtenerFunciones: async (id) => {
    const [rows] = await db.query('CALL traerFuncionesPelicula(?)', [id]);
    return rows;
  },

  obtenerAsientos: async (id) => {
    const [rows] = await db.query('CALL asientosdisponibles(?)', [id]);
    return rows;
  },

  obtenerPeliculas: async () => {
    const [rows] = await db.query('CALL peliculasCartelera()');
    return rows;
  },

  obtenerPromociones: async () => {
    const [rows] = await db.query('CALL promociones()');
    return rows;
  },

  obtenerPeliculasHoy: async () => {
    const [rows] = await db.query('CALL peliculasCarteleraHoy()');
    return rows;
  }

};

module.exports = Info;
