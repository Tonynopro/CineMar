const express = require('express');
const router = express.Router();
const { esTrabajador, esAdmin } = require('../middlewares/verificarRol');
const trabajadorController = require('../controllers/trabajadorController');

// Ruta para mostrar formulario de registro
router.get('/registro', esAdmin,trabajadorController.mostrarFormularioRegistro);

// Ruta para mostrar formulario de acceso
router.get('/iniciar-sesion', trabajadorController.mostrarFormularioAcceso);
router.get('/', trabajadorController.mostrarFormularioAcceso);

// Ruta para mostrar formulario de eliminacion
router.get('/eliminarTrabajador', esAdmin, trabajadorController.mostrarFormularioEliminacion);

// Ruta para mostrar pagina principal
router.get('/index', esTrabajador, trabajadorController.mostrarPaginaPrincipal);

// Ruta para mostrar formulario de oferta
router.get('/oferta', esTrabajador, trabajadorController.mostrarFormularioOferta);

// Ruta para mostrar informacion de la sala
router.get('/sala-info', esTrabajador, trabajadorController.mostrarInfoSala)

// Ruta para mostrar las funciones
router.get('/funciones', esTrabajador, trabajadorController.mostrarFunciones);

// Ruta para mostrar los horarios de una funcion
router.get('/horarios', esTrabajador, trabajadorController.mostrarHorariosPelicula);

// Ruta para registrar trabajador
router.post('/registrar', esAdmin, trabajadorController.registrarTrabajador);

// Ruta para ingresar trabajador
router.post('/acceso', trabajadorController.accesoTrabajador);

// Ruta para cerrar sesion
router.get('/cerrar-sesion', trabajadorController.cerrarSesion);

// Ruta para registrar oferta
router.post('/registrarOferta', esTrabajador, trabajadorController.registrarOferta);

// Ruta para eliminar trabajador
router.delete('/eliminar', esAdmin, trabajadorController.eliminarTrabajador);

//Ruta para traer a todos los supervisores
router.get('/supervisores', esTrabajador, trabajadorController.obtenerSupervisores);

// Ruta para obtener los datos del trabajador
router.get('/info', esTrabajador, trabajadorController.obtenerDatosTrabajador);

// Ruta para obtener la sala del trabajador del dia
router.get('/sala', esTrabajador, trabajadorController.obtenerSalaDelDia);

// Ruta para traer funciones de la sala
router.get('/funciones/:sala', esTrabajador, trabajadorController.obtenerFuncionesDeLaSala);

// Ruta para traer la sala
router.get('/traerSala/:sala', esTrabajador, trabajadorController.obtenerSala);

// Ruta para traer los asientos disponibles
router.get('/asientos/:funcion', esTrabajador, trabajadorController.obtenerAsientosDisponibles);

module.exports = router;