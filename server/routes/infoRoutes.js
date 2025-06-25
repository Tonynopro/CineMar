const express = require('express');
const router = express.Router();
const infoController = require('../controllers/infoController');

//Ruta para mostrar "Nuestra historia"
router.get('/nuestraHistoria', infoController.mostrarNuestraHistoria);

//Ruta para mostrar "Preguntas frecuentes"
router.get('/preguntasFrecuentes', infoController.mostrarPreguntasFrecuentes);

//Ruta para mostrar "Terminos de uso"
router.get('/terminosUso', infoController.mostrarTerminosUso);

//Ruta para mostrar "Politicas de privacidad"
router.get('/politicasPrivacidad', infoController.mostrarPoliticasPrivacidad);

//Ruta para mostrar "Encuentra tu cine" (Realmente es otra cosa)
router.get('/encuentraTuCine', infoController.mostrarEncuentraTuCine);

//Ruta para mostrar informacion de una pelicula
router.get('/info', infoController.mostrarInformacionPelicula);

//Ruta para mostrar los horarios de una pelicula
router.get('/horarios', infoController.mostrarHorariosPelicula);

//Ruta para mostrar las promociones
router.get('/promociones', infoController.mostrarPromociones);

//Ruta para obtener la informacion de una pelicula
router.get('/infoPelicula/:id', infoController.traerInfoPelicula);

//Ruta para obtener las funciones de una pelicula
router.get('/funciones/:id', infoController.traerFuncionesPelicula);

//Ruta para obtener los asientos de una funcion
router.get('/asientos/:id', infoController.traerAsientosFuncion);

//Ruta para traer todas las peliculas
router.get('/peliculasCartelera', infoController.traerPeliculas);

//Ruta para traer todas las peliculas de hoy
router.get('/peliculasHoy', infoController.traerPeliculasHoy);

//Ruta para traer todas las promociones
router.get('/promocionesValidas', infoController.traerPromociones);

module.exports = router;